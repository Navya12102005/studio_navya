/* ============================================================
   SITE SETTINGS — fill these in once, they're used everywhere.
   ============================================================ */
window.SITE = {
  name: "Navya",
  email: "hello@studionavya.com",           // your email
  whatsapp: "919999999999",                  // country code + number, no + or spaces
  whatsappMessage: "Hi Navya, I found your website and I'd like to talk about ",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",

  // Free audit booking — create a free event at calendly.com and paste the link.
  // Leave "" to send people to the contact form instead.
  calendly: "",

  // Contact form delivery — get a free access key at https://web3forms.com
  // (enter your email, they send you the key). Leave "" to fall back to email.
  web3formsKey: "",

  // Package prices (shown as "From ₹X / month"). Leave "" to hide a price.
  currency: "₹",
  prices: { starter: "5,999", growth: "11,999", studio: "19,999" },

  // Launch bonuses — shown as a strip above the single services.
  // Delete a line to stop offering it. Leave the list empty [] to hide the strip.
  bonuses: [
    { title: "Free audit with every order",   text: "Any order comes with a free 10-point audit of one of your profiles." },
    { title: "10% off your first order",      text: "Mention “FIRST10” when you order — valid on any single service." },
    { title: "Order credit carries over",     text: "Upgrade to a monthly package within 30 days and I'll take what you paid off month one." },
    { title: "Refer a friend, get a freebie", text: "When someone you refer places an order, you get any ₹499 service free." }
  ],

  // One-off "try me" services — small, fixed-price, fast.
  // days = delivery time · bonus = free extra (optional) · popular = shown first
  singles: [
    // Social Media
    { name: "Instagram profile audit",   service: "Social Media", price: "299",   days: 2, popular: true, includes: "A short video walkthrough of your profile with 10 specific fixes", bonus: "Competitor snapshot of 2 accounts" },
    { name: "Bio & highlights refresh",  service: "Social Media", price: "399",   days: 2, includes: "A rewritten Instagram bio plus 5 highlight cover designs", bonus: "3 alternative bio versions" },
    { name: "Hashtag & keyword set",     service: "Social Media", price: "299",   days: 2, includes: "30 researched hashtags in 3 groups, plus keywords for your bio and captions", bonus: "Rotation guide for 4 weeks" },
    { name: "10 captions",               service: "Social Media", price: "399",   days: 2, includes: "Ten ready-to-post captions with hooks and calls to action", bonus: "5 extra hook lines" },
    { name: "3 Reel scripts",            service: "Social Media", price: "499",   days: 3, popular: true, includes: "Hook, script and shot list for each Reel", bonus: "Trending-audio suggestions" },
    { name: "Instagram content pack",    service: "Social Media", price: "999",   days: 4, popular: true, includes: "6 post designs in Canva with captions and hashtags", bonus: "2 story templates" },
    { name: "30-day content calendar",   service: "Social Media", price: "1,299", days: 5, includes: "A month of post ideas, formats, captions and posting times", bonus: "Festival & trend dates for the month" },
    { name: "1-week account management", service: "Social Media", price: "1,499", days: 7, includes: "I post, reply to comments and DMs for one week, then send a short report", bonus: "Posting-time analysis" },
    // LinkedIn
    { name: "LinkedIn headline + About", service: "LinkedIn", price: "499",   days: 2, popular: true, includes: "A rewritten headline and About section that says who you help", bonus: "3 headline options to test" },
    { name: "LinkedIn banner design",    service: "LinkedIn", price: "299",   days: 2, includes: "A custom Canva banner that tells visitors what you do", bonus: "Editable Canva link" },
    { name: "LinkedIn carousel",         service: "LinkedIn", price: "599",   days: 3, includes: "One 8–10 slide carousel, written and designed in Canva", bonus: "Caption to post it with" },
    { name: "5 LinkedIn posts",          service: "LinkedIn", price: "799",   days: 4, popular: true, includes: "Five ready-to-post posts in your voice, after a short call", bonus: "Posting schedule for 2 weeks" },
    { name: "Full profile makeover",     service: "LinkedIn", price: "999",   days: 3, includes: "Headline, About, banner design, Featured section and skills", bonus: "Connection-request note template" },
    { name: "Company page setup",        service: "LinkedIn", price: "799",   days: 3, includes: "Logo, cover, tagline, About and first 3 posts for your company page", bonus: "Employee sharing guide" },
    // Cold Email & Outreach
    { name: "Cold DM scripts",           service: "Cold Email", price: "399", days: 2, includes: "5 LinkedIn or Instagram DM templates with follow-ups", bonus: "Reply-handling templates" },
    { name: "50-lead prospect list",     service: "Cold Email", price: "799", days: 3, includes: "50 researched leads in a spreadsheet: name, role, company and a personal note", bonus: "10 extra leads" },
    { name: "Cold email sequence",       service: "Cold Email", price: "999", days: 4, popular: true, includes: "A 4-email sequence, 2 subject-line variants and a target-customer outline", bonus: "Deliverability checklist" },
    { name: "Cold email review",         service: "Cold Email", price: "299", days: 1, includes: "Line-by-line feedback and a rewrite of one email you already use", bonus: "2 new subject lines" },
    // Email Marketing
    { name: "1 newsletter",              service: "Email Marketing", price: "499", days: 3, includes: "One newsletter written and laid out, with 3 subject-line options", bonus: "Preview text for each subject" },
    { name: "Lead magnet (PDF guide)",   service: "Email Marketing", price: "999", days: 5, includes: "A 5–7 page free guide designed in Canva, to grow your email list", bonus: "Sign-up form copy" },
    { name: "Welcome email series",      service: "Email Marketing", price: "999", days: 4, includes: "3 welcome emails with subject lines and preview text", bonus: "1 re-engagement email" },
    { name: "Abandoned-cart emails",     service: "Email Marketing", price: "799", days: 3, includes: "2 reminder emails that bring shoppers back to checkout", bonus: "Discount vs no-discount versions" },
    // Content Writing
    { name: "Product descriptions",      service: "Content Writing", price: "499", days: 3, includes: "5 product descriptions that sell the benefit, not just the features", bonus: "SEO title for each" },
    { name: "About / bio writing",       service: "Content Writing", price: "399", days: 2, includes: "A short and a long bio for your website, LinkedIn and press", bonus: "One-line intro for events" },
    { name: "SEO blog article",          service: "Content Writing", price: "699", days: 4, includes: "One 1,000-word article with keyword research and meta description", bonus: "3 social posts to promote it" },
    { name: "Website page copy",         service: "Content Writing", price: "999", days: 4, includes: "Copy for one page: home, about or services", bonus: "Button and headline variations" },
    // Digital Marketing
    { name: "Google Business Profile setup", service: "Digital Marketing", price: "599",   days: 3, includes: "Complete setup or cleanup: description, categories, photos and first posts", bonus: "Review-request message template" },
    { name: "3 Meta ad concepts",        service: "Digital Marketing", price: "799",   days: 3, includes: "Hook, ad copy and visual direction for 3 Facebook/Instagram ads", bonus: "Audience targeting suggestions" },
    { name: "Competitor research report",service: "Digital Marketing", price: "699",   days: 3, includes: "What 3 competitors post, promote and charge, and gaps you can use", bonus: "5 content ideas from the gaps" },
    { name: "Mini marketing plan",       service: "Digital Marketing", price: "1,499", days: 5, includes: "A 30-day plan: audience, channels, content ideas and what to measure", bonus: "30-minute walkthrough call" },
    // Data & Analytics
    { name: "Excel data cleanup",         service: "Data & Analytics", price: "499",   days: 2, popular: true, includes: "Remove duplicates, fix formats and fill gaps in one sheet (up to 5,000 rows)", bonus: "Data-entry checklist to keep it clean" },
    { name: "Excel formula fix & setup",  service: "Data & Analytics", price: "399",   days: 1, includes: "Fix broken formulas or set up XLOOKUP, IFs, SUMIFS and conditional formatting", bonus: "Short screen-recording explaining them" },
    { name: "Pivot table report",         service: "Data & Analytics", price: "599",   days: 2, includes: "Pivot tables and charts summarising your data by month, product or region", bonus: "Slicers for one-click filtering" },
    { name: "Excel sales dashboard",      service: "Data & Analytics", price: "999",   days: 4, includes: "A one-page dashboard with KPIs, trends and charts that update when you add data", bonus: "Monthly data-entry template" },
    { name: "Power BI dashboard",         service: "Data & Analytics", price: "1,999", days: 5, popular: true, includes: "An interactive Power BI report with up to 2 pages, filters and drill-downs", bonus: "15-minute walkthrough call" },
    { name: "Google Sheets tracker",       service: "Data & Analytics", price: "499",   days: 2, includes: "A shared tracker for leads, orders, inventory or expenses with dropdowns and totals", bonus: "Mobile-friendly view" },
    { name: "Social media analytics report", service: "Data & Analytics", price: "699", days: 3, includes: "Your last 30–90 days of Instagram or LinkedIn data, analysed and charted", bonus: "Best posting times and formats" },
    // Design
    { name: "5 Canva post templates",    service: "Design", price: "599", days: 3, includes: "5 editable on-brand Instagram templates you can reuse", bonus: "Matching story template" },
    { name: "Mini brand kit",            service: "Design", price: "999", days: 4, includes: "Colour palette, font pairing and a one-page style guide in Canva", bonus: "Highlight cover set" },
    { name: "Simple logo refresh",       service: "Design", price: "799", days: 4, includes: "A clean text-based logo in 2 layouts, with light and dark versions", bonus: "Profile-picture version" },
    { name: "Flyer or menu design",      service: "Design", price: "499", days: 3, includes: "One print- or WhatsApp-ready flyer, poster or menu", bonus: "Instagram-size version" }
  ]
};
