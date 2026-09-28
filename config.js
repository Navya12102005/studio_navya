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

  // One-off "try me" services — small, fixed-price, fast.
  // Edit, add or delete freely. days = delivery time.
  singles: [
    // Social Media
    { name: "Instagram profile audit",   service: "Social Media",      price: "299",   days: 2, includes: "A short video walkthrough of your profile with 10 specific fixes" },
    { name: "Bio & highlights refresh",  service: "Social Media",      price: "399",   days: 2, includes: "A rewritten Instagram bio plus 5 highlight cover designs" },
    { name: "3 Reel scripts",            service: "Social Media",      price: "499",   days: 3, includes: "Hook, script and shot list for each Reel" },
    { name: "Instagram content pack",    service: "Social Media",      price: "999",   days: 4, includes: "6 post designs in Canva with captions and hashtags" },
    { name: "30-day content calendar",   service: "Social Media",      price: "1,299", days: 5, includes: "A month of post ideas, formats, captions and posting times" },
    // LinkedIn
    { name: "LinkedIn headline + About", service: "LinkedIn",          price: "499",   days: 2, includes: "A rewritten headline and About section that says who you help" },
    { name: "5 LinkedIn posts",          service: "LinkedIn",          price: "799",   days: 4, includes: "Five ready-to-post posts in your voice, after a short call" },
    { name: "LinkedIn carousel",         service: "LinkedIn",          price: "599",   days: 3, includes: "One 8–10 slide carousel, written and designed in Canva" },
    { name: "Full profile makeover",     service: "LinkedIn",          price: "999",   days: 3, includes: "Headline, About, banner design, Featured section and skills" },
    // Cold Email
    { name: "Cold DM scripts",           service: "Cold Email",        price: "399",   days: 2, includes: "5 LinkedIn or Instagram DM templates with follow-ups" },
    { name: "Cold email sequence",       service: "Cold Email",        price: "999",   days: 4, includes: "A 4-email sequence, 2 subject-line variants and a target-customer outline" },
    { name: "50-lead prospect list",     service: "Cold Email",        price: "799",   days: 3, includes: "50 researched leads in a spreadsheet: name, role, company and a personal note" },
    // Email Marketing
    { name: "1 newsletter",              service: "Email Marketing",   price: "499",   days: 3, includes: "One newsletter written and laid out, with 3 subject-line options" },
    { name: "Welcome email series",      service: "Email Marketing",   price: "999",   days: 4, includes: "3 welcome emails with subject lines and preview text" },
    // Content Writing
    { name: "Product descriptions",      service: "Content Writing",   price: "499",   days: 3, includes: "5 product descriptions that sell the benefit, not just the features" },
    { name: "SEO blog article",          service: "Content Writing",   price: "699",   days: 4, includes: "One 1,000-word article with keyword research and meta description" },
    { name: "Website page copy",         service: "Content Writing",   price: "999",   days: 4, includes: "Copy for one page: home, about or services" },
    // Digital Marketing
    { name: "Google Business Profile setup", service: "Digital Marketing", price: "599", days: 3, includes: "Complete setup or cleanup: description, categories, photos and first posts" },
    { name: "3 Meta ad concepts",        service: "Digital Marketing", price: "799",   days: 3, includes: "Hook, ad copy and visual direction for 3 Facebook/Instagram ads" },
    // Design
    { name: "5 Canva post templates",    service: "Design",            price: "599",   days: 3, includes: "5 editable on-brand Instagram templates you can reuse" },
    { name: "Mini brand kit",            service: "Design",            price: "999",   days: 4, includes: "Colour palette, font pairing and a one-page style guide in Canva" },
    { name: "Mini marketing plan",       service: "Digital Marketing", price: "1,499", days: 5, includes: "A 30-day plan: audience, channels, content ideas and what to measure" }
  ]
};
