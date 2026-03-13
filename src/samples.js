const samples = [
  {
    name: "Markdown → WordPress Blocks",
    description: "Blog post to Gutenberg block markup",
    source: `# The Future of Urban Farming: How Cities Are Growing Their Own Food

Urban farming has exploded in popularity over the last decade. What was once a niche hobby for rooftop gardeners has become a serious movement reshaping how cities feed their residents. From vertical farms in abandoned warehouses to community plots on vacant lots, the urban agriculture revolution is well underway.

## The Problem With Our Current Food System

The average meal in America travels 1,500 miles from farm to plate. That journey burns fossil fuels, requires refrigeration, and means produce loses nutritional value every day. Meanwhile, food deserts affect roughly 23.5 million Americans. The disconnect between where food is grown and where it is eaten has created a system that is inefficient, inequitable, and environmentally destructive.

"We have built a food system optimized for shelf life and shipping distance, not for nutrition or community health," says Dr. Elena Vasquez, director of the Metropolitan Agriculture Institute.

## How Vertical Farming Works

Vertical farms stack growing trays in climate-controlled indoor environments. LED lights replace sunlight. Hydroponic systems deliver nutrients directly to roots without soil. The result is year-round production using 95% less water than traditional agriculture and zero pesticides.

A single vertical farm occupying 70,000 square feet can produce the equivalent yield of a 350-acre outdoor farm. The trade-off is energy consumption, though LED costs have dropped 80% in the last five years.

## Community Gardens: The Low-Tech Revolution

Community gardens have been transforming vacant lots into productive green spaces for decades. Detroit alone has over 1,400 community gardens, many emerging after the 2008 financial crisis left thousands of properties abandoned.

A 2023 study in the Journal of Urban Health found that residents living within a quarter mile of a community garden reported 15% lower rates of anxiety and depression.

"The tomatoes are almost secondary," says Marcus Williams, who runs a garden in Chicago's South Side. "What we're really growing here is neighborhood."

## What Comes Next

Forward-thinking architects are designing buildings with rooftop greenhouses as standard features. Singapore mandates that new developments include food-producing gardens. Paris has opened the world's largest rooftop farm, producing 1,000 kilograms of produce daily during peak season.

AI-powered monitoring can now detect plant stress days before visible symptoms appear. Robotics handle planting and harvesting with increasing precision. But the most important ingredient may be the simplest: political will. Cities that invest in local food infrastructure will build more resilient, healthier, and more connected communities.`,
    template: `<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Page Title Goes Here</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"intro-text"} -->
<p class="intro-text">A brief introductory paragraph that summarizes the main topic. This should hook the reader and set expectations for the content below.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Section Heading</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>A standard paragraph of body content. This block can be repeated as many times as needed to accommodate all source material. Each paragraph should contain one complete thought or idea from the source.</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote">
<p>A notable quote from a person referenced in the source content.</p>
<cite>Speaker Name, Title or Context</cite>
</blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>A follow-up paragraph that continues the narrative after the quote, providing additional context or transitioning to the next idea.</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul class="wp-block-list">
<li>A key fact, statistic, or takeaway from the source content</li>
<li>Another important point worth highlighting</li>
<li>A third item that rounds out the list</li>
</ul>
<!-- /wp:list -->`,
  },
  {
    name: "Employee Directory → CSV",
    description: "Plaintext contact list to structured CSV",
    source: `Company Directory - Updated March 2026

Marketing Department

Sarah Chen - Senior Marketing Manager
  Email: s.chen@acmecorp.com
  Phone: (415) 555-0142
  Office: Building A, Room 312
  Started: January 2019

Derek Okafor - Content Strategist
  Email: d.okafor@acmecorp.com
  Phone: (415) 555-0187
  Office: Building A, Room 310
  Started: March 2021

Lisa Pham - Graphic Designer
  Email: l.pham@acmecorp.com
  Phone: (415) 555-0203
  Office: Building A, Room 315
  Started: August 2022

Engineering Department

Raj Mehta - Principal Engineer
  Email: r.mehta@acmecorp.com
  Phone: (415) 555-0291
  Office: Building C, Room 501
  Started: June 2017

Angela Torres - Frontend Developer
  Email: a.torres@acmecorp.com
  Phone: (415) 555-0344
  Office: Building C, Room 504
  Started: November 2020

Yuki Tanaka - DevOps Engineer
  Email: y.tanaka@acmecorp.com
  Phone: (415) 555-0378
  Office: Building C, Room 502
  Started: February 2023

Sales Department

Marcus Johnson - VP of Sales
  Email: m.johnson@acmecorp.com
  Phone: (415) 555-0401
  Office: Building B, Room 201
  Started: April 2018

Priya Sharma - Account Executive
  Email: p.sharma@acmecorp.com
  Phone: (415) 555-0455
  Office: Building B, Room 208
  Started: September 2021`,
    template: `Name,Title,Department,Email,Phone,Office,Start Date
"Last, First",Job Title,Department Name,email@example.com,(XXX) XXX-XXXX,Building X Room XXX,Month YYYY`,
  },
  {
    name: "Recipe Blog → Markdown",
    description: "Messy recipe page to clean markdown",
    source: `NANA'S CHICKEN TORTILLA SOUP 🍲

Jump to Recipe   Print Recipe

★★★★★ 4.8 from 1,247 reviews

Prep Time: 15 mins  Cook Time: 35 mins  Total Time: 50 mins
Servings: 6  Calories: 342 per serving

This soup has been in our family for three generations. My grandmother used to make it every Sunday and the whole neighborhood could smell it. It's hearty, warming, and the lime juice at the end is what makes it special. Don't skip that step!!

INGREDIENTS

1 tablespoon olive oil
1 medium yellow onion, diced
3 cloves garlic, minced
1 jalapeño, seeded and diced (leave seeds for more heat)
2 teaspoons cumin
1 teaspoon chili powder
1/2 teaspoon smoked paprika
Salt and pepper to taste
1 can (28 oz) fire-roasted diced tomatoes
1 can (15 oz) black beans, drained and rinsed
1 cup frozen corn kernels
4 cups chicken broth (low sodium)
2 large chicken breasts (about 1 lb), boneless and skinless
Juice of 2 limes
1/4 cup fresh cilantro, chopped

TOPPINGS
Tortilla chips or strips
Diced avocado
Sour cream
Shredded cheddar or Monterey Jack cheese
Extra lime wedges

INSTRUCTIONS

Step 1
Heat olive oil in a large Dutch oven or heavy-bottomed pot over medium heat. Add the diced onion and cook until softened, about 4-5 minutes. Add garlic and jalapeño and cook another minute until fragrant.

Step 2
Stir in cumin, chili powder, smoked paprika, salt, and pepper. Cook the spices for 30 seconds to bloom them.

Step 3
Add tomatoes, black beans, corn, and chicken broth. Nestle the whole chicken breasts into the liquid. Bring to a boil, then reduce heat and simmer for 25 minutes until chicken is cooked through (internal temp 165°F).

Step 4
Remove chicken breasts and shred with two forks. Return shredded chicken to the pot. Stir in lime juice and cilantro.

Step 5
Serve hot in bowls topped with crushed tortilla chips, avocado, sour cream, shredded cheese, and extra lime wedges.

NOTES
- You can use rotisserie chicken to save time — just shred and add in step 4, reduce simmer to 15 mins
- Freezes well for up to 3 months
- For a vegetarian version, skip the chicken and use vegetable broth, add an extra can of beans

NUTRITION INFORMATION
Calories: 342 | Fat: 9g | Carbs: 32g | Protein: 34g | Fiber: 8g | Sodium: 680mg

Filed Under: Soups, Mexican-Inspired, Weeknight Dinners, Family Favorites
Tagged With: chicken soup, tortilla soup, easy dinner, one pot meals

© 2026 NanasKitchenBlog.com All Rights Reserved

Leave a Comment ▼
Your email address will not be published.`,
    template: `# Recipe Title

> Short description or origin story.

**Prep:** X mins | **Cook:** X mins | **Serves:** X

## Ingredients

- ingredient 1
- ingredient 2

## Instructions

1. First step.
2. Second step.

## Notes

- Helpful tip or variation.`,
  },
  {
    name: "Meeting Notes → Action Items",
    description: "Rambling meeting transcript to structured tasks",
    source: `Product Sync — Tuesday March 10, 2026, 2:00 PM

Attendees: Jen (PM), Carlos (Eng Lead), Avery (Design), Sam (QA), Robin (Marketing)

Jen opened by saying Q2 planning is wrapping up and we need to finalize the roadmap by Friday. She mentioned the board presentation is the following Wednesday so there's no room to slip.

Carlos gave an eng update. The authentication refactor is about 70% done. He said the biggest blocker is that the legacy API endpoints still need to be deprecated but they can't do it until the mobile team migrates. He's going to talk to the mobile team lead (Dana) by end of day Wednesday to get a migration timeline. He also mentioned they found a performance regression in the search indexer — response times went from 120ms to 800ms after last week's deploy. He's assigning two engineers to investigate and wants it fixed before the next release.

Avery showed the new onboarding flow mockups. Everyone liked the simplified three-step approach. Sam raised a concern about accessibility — the color contrast on the secondary buttons might not meet WCAG AA. Avery said she'd run an audit and update the palette by Thursday. Jen asked Avery to also share the final mockups in Figma with the engineering team by Friday so they can start estimating.

Sam said regression testing for v2.4 is on track. She found 3 critical bugs in the payment flow — duplicate charges under certain race conditions. Carlos said that's a P0 and needs to be patched immediately, can't wait for v2.4. Sam will file detailed bug reports by end of day today and Carlos will have someone on it tomorrow morning.

Robin asked about the launch blog post for the new features. Jen said the feature list is locked but Robin needs copy-ready descriptions from Carlos's team. Carlos said he'll have an engineer write up technical descriptions by next Monday. Robin needs those to hit her March 20 publish deadline.

Jen wrapped up by reminding everyone to update their JIRA boards before Friday's roadmap review. She's scheduling a follow-up sync for next Tuesday same time.

Meeting ended at 2:47 PM.`,
    template: `## Action Items

| Owner | Action | Due Date |
|-------|--------|----------|
| Name  | Description of task | YYYY-MM-DD |

## Key Decisions

- Decision that was made and agreed upon.

## Open Questions / Blockers

- Description of unresolved issue and who is responsible for following up.`,
  },
  {
    name: "Product Reviews → Comparison Table",
    description: "Wordy reviews to structured comparison",
    source: `I've been testing three budget noise-cancelling headphones for the past month. Here's what I found.

SOUNDCORE SPACE Q45

I was really impressed by these. The noise cancellation is shockingly good for the price — not quite Sony XM5 level but maybe 80% of the way there. Battery life is the star: I got 48 hours on a single charge with ANC on, which is insane. They lasted an entire week of commuting and work without charging. Comfort is decent, the ear cups are roomy enough for my ears but the headband gets a bit clammy after 3-4 hours. Sound quality is warm and bassy, which is fine for pop and hip-hop but classical and jazz sound a bit muddy. The app lets you customize EQ and ANC levels which is nice. Build quality feels plasticky but solid enough. I paid $128 on sale.

JABRA ELITE 45H

These are the lightest of the bunch at only 160 grams. I almost forget I'm wearing them. But that lightweight build comes at a cost — they feel a bit flimsy and I wouldn't trust them in a bag without a case. Sound is bright and clear, vocals really pop, but bass is underwhelming. Fine for podcasts and calls (the mic quality is excellent actually, best of the three) but not great for bass-heavy music. No active noise cancellation, just passive isolation, which is a big miss at this price. Battery life is about 50 hours which is great. Comfort is the best of the three — I wore them for 8 hours straight with no issues. Paid $99.

EDIFIER W820NB PLUS

The build quality champion. These feel more expensive than they are — nice metal hinges, premium leatherette pads. ANC is middle of the road, noticeable but not dramatic. Where they shine is sound quality — surprisingly balanced with clear mids and tight bass. Best audio of the three for the money. Battery is 49 hours with ANC on. Comfort is good but they clamp a bit tight, which might bother people with glasses. The app is bare-bones compared to Soundcore. Hi-Res audio support via LDAC is a nice bonus if you have an Android phone. These were $79 which feels like a steal.

Overall ranking: For sound quality get the Edifier. For noise cancellation get the Soundcore. For comfort and calls get the Jabra. No single winner — depends what matters most to you.`,
    template: `## Product Comparison

| Feature | Product A | Product B | Product C |
|---------|-----------|-----------|-----------|
| Price   | $XX       | $XX       | $XX       |
| Feature | Rating/Detail | Rating/Detail | Rating/Detail |

## Summary

One-paragraph overall assessment with clear recommendation for different use cases.

## Best For

- **Use case 1:** Product name — reason.
- **Use case 2:** Product name — reason.`,
  },
];

export default samples;
