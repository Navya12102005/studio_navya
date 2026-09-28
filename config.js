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
  prices: { starter: "15,000", growth: "35,000", studio: "65,000" },

  // One-off "try me" services — small, fixed-price, fast.
  // Edit, add or delete freely. days = delivery time.
  singles: [
    { name: "Social media audit",        service: "Social Media",    price: "799",   days: 2, includes: "A recorded walkthrough of your Instagram with 10 specific fixes" },
    { name: "LinkedIn profile makeover", service: "LinkedIn",        price: "1,999", days: 3, includes: "Headline, About section, banner copy and Featured section" },
    { name: "5 LinkedIn posts",          service: "LinkedIn",        price: "1,499", days: 4, includes: "Five ready-to-post posts in your voice, plus one call to learn how you talk" },
    { name: "Instagram content pack",    service: "Social Media",    price: "2,499", days: 5, includes: "6 post designs in Canva with captions and hashtags" },
    { name: "3 Reel scripts",            service: "Social Media",    price: "999",   days: 3, includes: "Hook, script and shot list for each Reel" },
    { name: "Cold email sequence",       service: "Cold Email",      price: "1,999", days: 4, includes: "A 4-email sequence, 2 subject-line variants and a target-customer outline" },
    { name: "Welcome email series",      service: "Email Marketing", price: "1,999", days: 4, includes: "3 welcome emails with subject lines and preview text" },
    { name: "SEO blog article",          service: "Content Writing", price: "1,499", days: 4, includes: "One 1,000-word article with keyword research and meta description" }
  ]
};
