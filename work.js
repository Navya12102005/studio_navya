/* ============================================================
   YOUR SAMPLE PROJECTS — each block becomes a card on the home
   page AND its own project page (case.html?p=slug).

   You don't need clients to fill this in. Pick a real brand you
   admire (or invent one), spot a problem, and make the work.

   To add a project: copy one { ... } block, paste it, edit it.
   Put images in assets/work/ and write e.g. "assets/work/cafe-1.jpg".

   Fields:
     slug          short url name, lowercase-with-dashes, unique
     spec          true  = labelled "Concept project"
                   false = real client (when you get one!)
     category      "Social Media" | "LinkedIn" | "Cold Email" |
                   "Email Marketing" | "Content Writing" | "Digital Marketing"
     problem       the gap or opportunity you noticed
     approach      the steps / decisions you made (list)
     deliverables  what you actually made, with counts (shown big)
     test          what you'd measure or test first if it went live
     image         cover image ("" = plain colour cover)
     gallery       list of { src, caption } — your actual work samples
     quote         optional { text, name, role } — feedback from a
                   mentor, peer or future client
   ============================================================ */
window.WORK = [
  {
    slug: "cafe-instagram-refresh",
    spec: true,
    title: "Instagram refresh for a neighbourhood café",
    category: "Social Media",
    client: "Independent café (concept)",
    duration: "1-month content plan",
    role: "Strategy, content, captions",
    summary: "A month of Instagram content built around the café's slow-coffee story, with Reels first.",
    problem: "Many small cafés post menu photos with captions like 'Come visit!'. Nothing gives people a reason to follow, share or tag. The opportunity: show the people and the craft behind the counter.",
    approach: [
      "Set three content pillars: the craft (brewing), the regulars (faces and stories), and the neighbourhood.",
      "Planned a posting rhythm of 4 Reels and 3 posts a week, with every Reel under 12 seconds and a text hook in the first frame.",
      "Created a recurring 'Table 4' series featuring one regular each Friday, to encourage tagging and sharing.",
      "Wrote captions in a warm, unhurried voice, with no hashtag walls."
    ],
    deliverables: ["9 grid post ideas", "3 Reel scripts with shot lists", "12 captions", "1 monthly content calendar"],
    test: "Whether short behind-the-counter Reels beat polished latte-art shots on saves and shares.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "founder-linkedin-ghostwriting",
    spec: true,
    title: "LinkedIn ghostwriting for a SaaS founder",
    category: "LinkedIn",
    client: "B2B SaaS founder (concept)",
    duration: "2-week posting plan",
    role: "Profile rewrite, ghostwriting",
    summary: "A rewritten profile and a batch of posts written in a founder's own voice.",
    problem: "Founders often have strong opinions but post rarely, and their profile reads like a CV. Visitors get no reason to follow or reach out.",
    approach: [
      "Rewrote the headline around the customer's problem, not the job title.",
      "Rebuilt the About section as a short story: why the company exists, who it helps, how to get in touch.",
      "Wrote posts in a mix of formats: a personal story, a contrarian opinion, a carousel, a lesson and a soft pitch.",
      "Planned a daily habit of commenting on 20 target buyers' posts before any DMs."
    ],
    deliverables: ["1 rewritten headline", "1 About section", "5 ghostwritten posts", "1 carousel outline"],
    test: "Whether opinion posts earn more profile visits than 'tips' posts.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "agency-cold-email-sequence",
    spec: true,
    title: "Cold email sequence for a design agency",
    category: "Cold Email",
    client: "Boutique design agency (concept)",
    duration: "Outreach system",
    role: "ICP, copy, deliverability plan",
    summary: "An outreach system: who to target, how to set up sending safely, and a four-step sequence.",
    problem: "Small agencies often rely only on referrals, which means unpredictable months. Cold email can fix that, but most of it is generic and ends up in spam.",
    approach: [
      "Defined the ideal customer: D2C brands with 10–50 staff that recently raised funding.",
      "Planned a deliverability setup: secondary domains, three weeks of warm-up, and low daily sending limits.",
      "Opened every email with one specific observation about the prospect's own website.",
      "Kept each email under 90 words, ending with a question instead of a meeting link."
    ],
    deliverables: ["1 ideal customer profile", "4-step email sequence", "2 A/B subject-line variants", "1 deliverability checklist"],
    test: "Reply rates for an observation-led opener versus a compliment-led one.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "skincare-welcome-emails",
    spec: true,
    title: "Welcome email series for a skincare brand",
    category: "Email Marketing",
    client: "D2C skincare brand (concept)",
    duration: "Automated flows",
    role: "Flow strategy, copy",
    summary: "A five-email welcome series and an abandoned-cart flow that teach before they sell.",
    problem: "Many D2C brands only send discount blasts, which trains subscribers to wait for sales and quietly raises unsubscribes.",
    approach: [
      "Built the welcome series around the founder's story and a simple skin-type quiz.",
      "Planned list segments by quiz answer, so each person sees products for their skin.",
      "Replaced discount-first emails with 'how to use it properly' emails.",
      "Wrote an abandoned-cart email with a customer review instead of a coupon."
    ],
    deliverables: ["5 welcome emails", "2 abandoned-cart emails", "10 subject lines", "1 segmentation plan"],
    test: "Plain-text founder emails versus designed templates on click rate.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "edtech-seo-articles",
    spec: true,
    title: "SEO articles for an edtech startup",
    category: "Content Writing",
    client: "EdTech startup (concept)",
    duration: "Content plan + samples",
    role: "Keyword research, writing",
    summary: "A topic plan built from questions students really search for, plus finished sample articles.",
    problem: "Startup blogs are often written about the company, not for the reader, so they rarely rank or get read.",
    approach: [
      "Collected real student questions from Reddit, Quora and Google's 'People also ask'.",
      "Grouped them into three topic clusters, each with one pillar article and supporting posts.",
      "Answered the main question in the first 60 words of every article.",
      "Wrote a meta title and description for each piece."
    ],
    deliverables: ["1 keyword & topic map", "2 full articles", "6 article outlines", "8 meta descriptions"],
    test: "Whether answer-first intros improve time on page and ranking speed.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "retail-sales-dashboard",
    spec: true,
    title: "Power BI sales dashboard for a retail store",
    category: "Data Analytics",
    client: "Clothing retailer (concept, public sample data)",
    duration: "Dashboard build",
    role: "Data cleaning, modelling, Power BI",
    summary: "A year of messy sales exports turned into one interactive dashboard the owner can read in two minutes.",
    problem: "Small retailers usually keep sales in monthly Excel exports. Nobody can quickly answer 'which products and months actually make us money?' without hours of copy-pasting.",
    approach: [
      "Combined 12 monthly exports into one clean table in Power Query, fixing dates, duplicates and product names.",
      "Built a simple data model: sales, products and a calendar table.",
      "Wrote DAX measures for revenue, profit margin, average order value and month-on-month growth.",
      "Designed a one-page report: KPI cards on top, trend in the middle, product and category breakdown below, with slicers for month and store."
    ],
    deliverables: ["12 files merged", "6 DAX measures", "1 interactive dashboard", "4 KPI cards"],
    test: "Whether the owner checks it weekly without being reminded. A dashboard nobody opens has failed.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  },
  {
    slug: "festive-campaign-plan",
    spec: true,
    title: "Diwali campaign for an ethnic-wear label",
    category: "Digital Marketing",
    client: "Ethnic-wear label (concept)",
    duration: "5-week campaign plan",
    role: "Strategy, ad concepts, landing page",
    summary: "A full-funnel festive campaign across Instagram ads, email and one focused landing page.",
    problem: "Festive season is the biggest sales window for ethnic-wear brands, but many only start posting a week before Diwali.",
    approach: [
      "Started four weeks early with a 'which look are you?' carousel to build a warm audience.",
      "Planned retargeting with try-on Reels featuring real customers.",
      "Outlined one landing page with three curated looks, instead of sending people to the full catalogue.",
      "Added a two-email countdown to the last shipping date."
    ],
    deliverables: ["1 five-week campaign plan", "3 ad concepts", "1 landing page outline", "2 countdown emails"],
    test: "Customer try-on Reels versus studio shots on cost per purchase.",
    image: "",
    gallery: [],
    quote: null,
    link: ""
  }
];
