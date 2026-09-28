/* ============================================================
   YOUR PORTFOLIO — each block below becomes a card on the home
   page AND its own case study page (case.html?p=slug).

   To add a project: copy one { ... } block, paste it, edit it.
   Put images in assets/work/ and write e.g. "assets/work/cafe-1.jpg".

   Fields:
     slug       short url name, lowercase-with-dashes, must be unique
     spec       true = labelled "Spec project" (concept work, not a paid client)
     category   "Social Media" | "LinkedIn" | "Cold Email" |
                "Email Marketing" | "Content Writing" | "Digital Marketing"
     image      cover image ("" = plain colour cover)
     gallery    list of { src, caption } work samples
     quote      optional { text, name, role } from the client
   ============================================================ */
window.WORK = [
  {
    slug: "cafe-aurum-instagram",
    spec: true,
    title: "Café Aurum — Instagram relaunch",
    category: "Social Media",
    client: "Café Aurum, Pune",
    duration: "90 days",
    role: "Strategy, content, community",
    summary: "Rebuilt the feed around the café's slow-coffee story and moved to Reels-first posting.",
    problem: "Beautiful café, forgettable feed. Posts were mostly menu photos shot under yellow light, with no posting rhythm and captions that said 'Come visit!'. Reach had been flat for six months.",
    approach: [
      "Visited twice and photographed at 8am and 4pm, the two hours the light is best inside.",
      "Set three content pillars: the craft (brewing), the regulars (UGC and faces), and the neighbourhood.",
      "Moved to 4 Reels and 3 posts a week, each Reel under 12 seconds with a text hook in the first frame.",
      "Started a 'Table 4' series featuring one regular every Friday, which gave people a reason to tag the café."
    ],
    results: ["+180% reach in 90 days", "2,100 new followers", "Reel average 12k views"],
    learned: "The polished latte-art Reels did worse than the shaky behind-the-counter ones. We stopped over-producing.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "saas-founder-linkedin",
    spec: true,
    title: "Founder ghostwriting for a SaaS CEO",
    category: "LinkedIn",
    client: "B2B SaaS founder",
    duration: "4 months",
    role: "Ghostwriting, profile, outreach",
    summary: "Three posts a week in the founder's own voice, plus a profile rebuilt to convert visitors.",
    problem: "The founder had strong opinions on hiring and product, but posted twice a year. The profile read like a CV, so the few visitors it got had no reason to reach out.",
    approach: [
      "Recorded a 45-minute voice-note interview every two weeks and wrote posts from his real stories.",
      "Rewrote the headline around the customer's problem, not his job title.",
      "Mixed formats: one story, one opinion, one carousel each week.",
      "Commented daily on 20 target buyers' posts before ever sending a DM."
    ],
    results: ["+240% profile views", "14 inbound demo requests", "Top post: 180k impressions"],
    learned: "Posts that disagreed with a popular idea did 3x better than 'tips' posts.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "agency-cold-outreach",
    spec: true,
    title: "Outbound for a boutique design agency",
    category: "Cold Email",
    client: "Design agency, Bengaluru",
    duration: "6 weeks",
    role: "ICP, list building, copy, deliverability",
    summary: "A 600-lead list and a four-step sequence that booked nine calls in the first month.",
    problem: "All work came from referrals, which meant feast-and-famine months. Previous cold emails had been sent from the main domain and landed in spam.",
    approach: [
      "Narrowed the ICP to D2C brands with 10–50 staff who had raised money in the last year.",
      "Set up two secondary domains and warmed them for three weeks before sending.",
      "Opened every email with one specific observation about the prospect's own website.",
      "Kept each email under 90 words, with one soft question instead of a meeting link."
    ],
    results: ["58% open rate", "11% reply rate", "9 meetings booked in month one"],
    learned: "The breakup email (step 4) got more replies than steps 2 and 3 combined.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "skincare-welcome-flow",
    spec: true,
    title: "Welcome series for a D2C skincare brand",
    category: "Email Marketing",
    client: "D2C skincare brand",
    duration: "2 months",
    role: "Flows, copy, segmentation",
    summary: "A five-email welcome flow, an abandoned-cart flow and a monthly newsletter.",
    problem: "Around 4,000 subscribers, but they only ever received discount blasts. Unsubscribes rose with every send.",
    approach: [
      "Built the welcome flow around the founder's story and one skin-type quiz.",
      "Segmented the list by quiz answer so each person saw products for their skin type.",
      "Swapped discount-first emails for 'how to use it properly' emails.",
      "Added an abandoned-cart flow with a customer photo instead of a coupon."
    ],
    results: ["44% open rate", "6.3% click rate", "+22% repeat purchases"],
    learned: "Plain-text emails from the founder beat the designed templates on clicks.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "edtech-seo-blog",
    spec: true,
    title: "SEO blog programme for an edtech startup",
    category: "Content Writing",
    client: "EdTech startup",
    duration: "3 months",
    role: "Keyword research, writing, internal links",
    summary: "Twelve long-form articles built around questions students actually search for.",
    problem: "The blog had 40 thin posts written for the company, not for students. Almost none ranked.",
    approach: [
      "Pulled questions from Reddit, Quora and Google's 'People also ask' for three core topics.",
      "Wrote one 1,500-word pillar per topic and three shorter supporting articles for each.",
      "Interviewed two teachers so every article had a real, quotable expert.",
      "Merged and redirected 18 old thin posts into the new pillars."
    ],
    results: ["+65% organic traffic", "4 articles on page one", "Average read time 4:10"],
    learned: "Answering the question in the first 60 words improved rankings faster than length did.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "festive-meta-campaign",
    spec: true,
    title: "Diwali campaign for an ethnic-wear label",
    category: "Digital Marketing",
    client: "Ethnic-wear label",
    duration: "5 weeks",
    role: "Strategy, creative direction, ads, landing page",
    summary: "A full-funnel festive campaign across Meta ads, email and a dedicated landing page.",
    problem: "Festive sales were the biggest of the year but the brand relied only on organic posts, launched a week before Diwali.",
    approach: [
      "Started four weeks early with a 'which look are you?' carousel to build a warm audience.",
      "Retargeted engagers with try-on Reels featuring real customers, not models.",
      "Built one landing page with three curated looks instead of sending people to the full catalogue.",
      "Ran a two-email countdown to the last shipping date."
    ],
    results: ["4.2x ROAS", "₹38 cost per lead", "1,100+ orders"],
    learned: "Customer try-on Reels had half the cost per purchase of the studio shoot.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  }
];
