import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a content transmogrifier. You receive two inputs:

1. SOURCE CONTENT — raw text that is absolute law. Every single word, quote, fact, and detail must be accounted for in your output. Do not omit, summarize, or paraphrase anything.

2. TEMPLATE RAILS — a plain text template/mold that defines the FORMAT and STRUCTURE for the output. This template is REPEATABLE. If the source content has more items than the template shows, repeat the template pattern as many times as needed to cover ALL source content.

Your job:
- Take ALL content from the source (every word matters)
- Map it into the structure/format defined by the template rails
- Repeat the template pattern as many times as necessary
- Output plain text in the exact same format as the template
- Never drop content. Never add content that wasn't in the source.
- The template is a mold — the source content fills it.`;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { source, template, forbidReorder } = body;

  if (!source || !template) {
    return new Response("Missing source or template", { status: 400 });
  }

  const anthropic = new Anthropic();

  const stream = anthropic.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `=== SOURCE CONTENT ===\n${source}\n\n=== TEMPLATE RAILS ===\n${template}\n\n=== INSTRUCTIONS ===\nTransmogrify the source content into the template format. Repeat the template pattern as many times as needed. Account for every word in the source.${forbidReorder ? "\n\nCRITICAL: FORBID REORDER is ON. You MUST preserve the exact order of content as it appears in the source. Do NOT rearrange, regroup, or reorder any content to match the template's ordering. Process the source content strictly top-to-bottom, applying the template format to each piece in the order it originally appears." : "\n\nYou may reorder content to best fit the template structure."} Output ONLY the transmogrified result, no commentary.`,
      },
    ],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
};

export const config = {
  path: "/api/transmogrify",
};
