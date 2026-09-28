/* ---------- Service details ---------- */
const SERVICES = [
  {
    id: "social", icon: "01", name: "Social Media Management",
    tagline: "Your brand, consistently beautiful and consistently seen.",
    what: "End-to-end management of Instagram, Facebook and other platforms — from strategy to posting to community care.",
    includes: [
      "Audit of current profiles & competitor research",
      "Content pillars and a monthly content calendar",
      "Post & Reel design, captions and hashtag research",
      "Scheduling and publishing at peak times",
      "Community management — replies to comments & DMs",
      "Monthly analytics report with insights"
    ],
    deliverables: [["12–20", "posts / month"], ["4–8", "Reels / month"], ["Daily", "engagement"]],
    ideal: "Cafés, boutiques, D2C brands, coaches and local businesses who want to look premium online without doing it themselves.",
    kpis: ["Reach", "Engagement rate", "Follower growth", "Profile visits"]
  },
  {
    id: "linkedin", icon: "02", name: "LinkedIn Marketing",
    tagline: "Turn your profile into a client-generating asset.",
    what: "Personal-brand and company-page growth on LinkedIn through positioning, ghostwritten thought leadership and strategic networking.",
    includes: [
      "Profile makeover — headline, banner, About, Featured",
      "Ghostwritten posts in your voice (text, carousels, polls)",
      "Company page setup & content",
      "Targeted connection & engagement strategy",
      "Warm DM outreach scripts",
      "Monthly growth & inbound-lead report"
    ],
    deliverables: [["8–12", "posts / month"], ["2–4", "carousels"], ["100+", "targeted connections"]],
    ideal: "Founders, consultants, coaches and B2B companies whose clients are decision-makers.",
    kpis: ["Impressions", "Profile views", "Followers", "Inbound DMs"]
  },
  {
    id: "cold", icon: "03", name: "Cold Emailing",
    tagline: "Predictable conversations with your ideal clients.",
    what: "Done-for-you outbound: finding the right prospects and writing personalised emails that get replies — without landing in spam.",
    includes: [
      "Ideal Customer Profile (ICP) definition",
      "Verified lead list building & research",
      "Domain & inbox warm-up / deliverability setup",
      "Personalised multi-step sequences & follow-ups",
      "A/B testing of subject lines and offers",
      "Reply handling & meeting-booking support"
    ],
    deliverables: [["500+", "leads / month"], ["3–5", "step sequence"], ["Weekly", "reply reports"]],
    ideal: "Agencies, SaaS, freelancers and B2B service providers who want meetings on the calendar.",
    kpis: ["Open rate", "Reply rate", "Positive replies", "Meetings booked"]
  },
  {
    id: "email", icon: "04", name: "Email Marketing",
    tagline: "Your most profitable channel — the one you own.",
    what: "Newsletters and automated flows that nurture your existing audience and turn subscribers into repeat customers.",
    includes: [
      "Platform setup (Mailchimp, Brevo, Klaviyo etc.)",
      "Lead magnet & signup form strategy",
      "Welcome, abandoned-cart & re-engagement flows",
      "Monthly / weekly newsletters — copy & design",
      "List segmentation and hygiene",
      "Campaign analytics and optimisation"
    ],
    deliverables: [["2–4", "newsletters / month"], ["3", "automated flows"], ["Monthly", "report"]],
    ideal: "E-commerce brands, creators, coaches and any business with a list they're not using yet.",
    kpis: ["Open rate", "Click rate", "Revenue per email", "List growth"]
  },
  {
    id: "content", icon: "05", name: "Content Writing",
    tagline: "Words that sound like you — only sharper.",
    what: "Research-backed, SEO-friendly writing for websites, blogs and brands — clear, persuasive and on-voice.",
    includes: [
      "Website & landing-page copy",
      "SEO blog posts and articles",
      "Brand voice & messaging guide",
      "Social captions & scripts for Reels",
      "Case studies, bios and About pages",
      "Product descriptions & ad copy"
    ],
    deliverables: [["4–8", "articles / month"], ["1", "voice guide"], ["2", "revision rounds"]],
    ideal: "Startups, personal brands and businesses launching or refreshing their website.",
    kpis: ["Organic traffic", "Time on page", "Rankings", "Conversions"]
  },
  {
    id: "digital", icon: "06", name: "Digital Marketing",
    tagline: "One strategy connecting every channel.",
    what: "Holistic growth planning and execution — paid ads, SEO basics, funnels and analytics tied together around your business goals.",
    includes: [
      "Marketing audit & 90-day growth strategy",
      "Meta & Google ads — setup, creatives, optimisation",
      "Basic on-page SEO & Google Business Profile",
      "Funnel & landing-page planning",
      "Analytics & conversion tracking setup",
      "Campaign planning for launches & festive seasons"
    ],
    deliverables: [["1", "strategy roadmap"], ["2–3", "campaigns / quarter"], ["Live", "dashboard"]],
    ideal: "Growing businesses that want a single partner to plan and run their marketing.",
    kpis: ["ROAS", "Cost per lead", "Conversion rate", "Revenue"]
  }
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Service tabs ---------- */
const tabs = $("#serviceTabs"), panel = $("#servicePanel");
function renderService(i) {
  const s = SERVICES[i];
  $$(".tab", tabs).forEach((t, j) => t.setAttribute("aria-selected", i === j));
  panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
  panel.innerHTML = `
    <div class="sp-head">
      <span class="sp-icon">${s.icon}</span>
      <div><h3>${s.name}</h3><p class="sp-tag">${s.tagline}</p></div>
    </div>
    <p class="sp-what">${s.what}</p>
    <div class="sp-grid">
      <div class="sp-block">
        <h4>What's included</h4>
        <ul class="checks">${s.includes.map(x => `<li>${x}</li>`).join("")}</ul>
      </div>
      <div class="sp-side">
        <h4>Typical monthly deliverables</h4>
        <div class="deliv">${s.deliverables.map(([n, l]) => `<div><strong>${n}</strong><span>${l}</span></div>`).join("")}</div>
        <h4>Best for</h4><p>${s.ideal}</p>
        <h4>What we measure</h4>
        <div class="kpis">${s.kpis.map(k => `<span>${k}</span>`).join("")}</div>
      </div>
    </div>
    <a href="#contact" class="btn" data-svc="${s.name}">Enquire about ${s.name}</a>`;
}
SERVICES.forEach((s, i) => {
  const b = document.createElement("button");
  b.className = "tab"; b.role = "tab";
  b.innerHTML = `<span>${s.icon}</span>${s.name}`;
  b.onclick = () => renderService(i);
  tabs.appendChild(b);
});
renderService(0);
panel.addEventListener("click", e => {
  const b = e.target.closest("[data-svc]");
  if (b) $("#svc").value = b.dataset.svc;
});

/* ---------- Work grid ---------- */
const work = window.WORK || [];
const cats = ["All", ...new Set(work.map(w => w.category))];
const filters = $("#workFilters"), grid = $("#workGrid");
const hues = { "Social Media": 18, "LinkedIn": 205, "Cold Email": 32, "Email Marketing": 350, "Content Writing": 42, "Digital Marketing": 190 };

function renderWork(cat) {
  $$(".chip", filters).forEach(c => c.classList.toggle("on", c.dataset.cat === cat));
  grid.innerHTML = "";
  work.forEach((w, i) => {
    if (cat !== "All" && w.category !== cat) return;
    const h = hues[w.category] ?? 25;
    const card = document.createElement("a");
    card.className = "work-card";
    card.href = `case.html?p=${encodeURIComponent(w.slug || i)}`;
    card.style.setProperty("--h", h);
    card.style.animationDelay = `${grid.children.length * 70}ms`;
    card.innerHTML = `
      <div class="wc-cover" ${w.image ? `style="background-image:url('${w.image}')"` : ""}>
        ${w.image ? "" : `<span>${w.category}</span>`}
      </div>
      <div class="wc-body">
        <small>${w.category}${w.spec ? " · Concept" : ""}</small>
        <h3>${w.title}</h3>
        <p>${w.summary}</p>
        <span class="wc-more">View project →</span>
      </div>`;
    grid.appendChild(card);
  });
}
cats.forEach(c => {
  const b = document.createElement("button");
  b.className = "chip"; b.dataset.cat = c; b.textContent = c;
  b.onclick = () => renderWork(c);
  filters.appendChild(b);
});
renderWork("All");

/* ---------- Modal ---------- */
const modal = $("#modal");
function openModal(i) {
  const w = work[i];
  $("#modalBody").innerHTML = `
    ${w.image ? `<img src="${w.image}" alt="">` : ""}
    <small class="eyebrow">${w.category} · ${w.client || ""}</small>
    <h3>${w.title}</h3>
    <p>${w.summary}</p>
    <h4>Results</h4>
    <ul class="checks">${(w.results || []).map(r => `<li>${r}</li>`).join("")}</ul>
    ${w.link ? `<a class="btn" href="${w.link}" target="_blank" rel="noopener">View project ↗</a>` : ""}`;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal() { modal.hidden = true; document.body.style.overflow = ""; }
modal.addEventListener("click", e => { if (e.target === modal || e.target.closest(".modal-close")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ---------- Reveal on scroll + counters ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    const c = $("[data-count]", en.target);
    if (c) countUp(c);
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 5) * 80}ms`; io.observe(el); });

function countUp(el) {
  const end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now();
  const step = t => {
    const p = Math.min((t - t0) / 1600, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(end * e) + suf;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Nav ---------- */
const nav = $("#nav"), menuBtn = $(".menu-btn");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });
menuBtn.onclick = () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
};
$$(".links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

/* ---------- Settings from config.js ---------- */
const SITE = window.SITE || {};
const waLink = (topic = "your services") =>
  SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent((SITE.whatsappMessage || "Hi! ") + topic)}` : "#contact";
if (SITE.email) { const a = $("#soEmail"); a.href = `mailto:${SITE.email}`; a.textContent = SITE.email; }
if (SITE.linkedin) $("#soLinkedin").href = SITE.linkedin;
if (SITE.instagram) $("#soInstagram").href = SITE.instagram;
$("#soWhatsapp").href = $("#waBtn").href = waLink();
if (!SITE.whatsapp) { $("#waBtn").hidden = true; $("#soWhatsapp").hidden = true; }
$$("[data-price]").forEach(el => {
  const v = SITE.prices && SITE.prices[el.dataset.price];
  if (v) el.innerHTML = `<small>From</small> ${SITE.currency || ""}${v}<small> / month</small>`; else el.remove();
});
const auditBtn = $("#auditBtn");
if (SITE.calendly) { auditBtn.href = SITE.calendly; auditBtn.target = "_blank"; auditBtn.rel = "noopener"; }
else auditBtn.addEventListener("click", () => { $("#svc").value = "Free audit"; });
$$('.pkg a[href="#contact"]').forEach(a => a.addEventListener("click", () => {
  $("#msg").value = `I'm interested in the ${$("h3", a.closest(".pkg")).textContent} package.`;
}));

/* ---------- Contact form ---------- */
const form = $("#contactForm"), status = $("#formStatus");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const f = new FormData(form);
  if (f.get("botcheck")) return;
  const subject = `New enquiry: ${f.get("service")} — ${f.get("name")}`;
  if (!SITE.web3formsKey) {
    const body = `Name: ${f.get("name")}\nEmail: ${f.get("email")}\nService: ${f.get("service")}\n\n${f.get("message")}`;
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return;
  }
  const btn = $("button[type=submit]", form);
  btn.disabled = true; status.className = "form-status"; status.textContent = "Sending…";
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: SITE.web3formsKey, subject, from_name: "Studio Navya website", ...Object.fromEntries(f) })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    form.reset();
    status.classList.add("ok");
    status.textContent = "Thank you — your message is in. I'll reply within 24 hours.";
  } catch {
    status.classList.add("err");
    status.innerHTML = `Something went wrong. Please email me at <a href="mailto:${SITE.email}">${SITE.email}</a>.`;
  } finally { btn.disabled = false; }
});

$("#yr").textContent = new Date().getFullYear();

/* ---------- Scroll animations ---------- */
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Split headings into words that rise from a mask
$$(".split").forEach(el => {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(part); return; }
          const w = document.createElement("span"); w.className = "w";
          const inner = document.createElement("span");
          inner.textContent = part; inner.style.transitionDelay = `${i++ * 70}ms`;
          w.append(inner); frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
  };
  walk(el);
});
const io2 = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io2.unobserve(en.target); }
}), { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
$$(".split, .img-reveal").forEach(el => io2.observe(el));

// Progress bar, parallax, pinned horizontal process
const bar = $(".progress"), hs = $(".hscroll"), track = $(".hs-track"), meter = $(".hs-meter i");
const parallax = $$("[data-speed]");
function sizeHS() {
  if (!hs) return;
  const dist = Math.max(0, track.scrollWidth - innerWidth + 80);
  hs.style.height = `${innerHeight + dist}px`;
  hs.dataset.dist = dist;
}
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${scrollY / max})`;
  if (reduced) return;
  parallax.forEach(el => {
    const r = el.parentElement.getBoundingClientRect();
    el.style.transform = `translate3d(0, ${-r.top * el.dataset.speed}px, 0)`;
  });
  if (hs) {
    const r = hs.getBoundingClientRect(), dist = +hs.dataset.dist;
    const p = Math.min(1, Math.max(0, -r.top / (hs.offsetHeight - innerHeight)));
    track.style.transform = `translate3d(${-p * dist}px, 0, 0)`;
    meter.style.transform = `scaleX(${p})`;
    $$("li", track).forEach((li, k, all) => li.classList.toggle("on", p >= k / all.length - 0.05));
  }
}
sizeHS(); onScroll();
addEventListener("resize", () => { sizeHS(); onScroll(); });
addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
