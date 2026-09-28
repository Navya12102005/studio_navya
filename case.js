/* Renders one case study from work.js, chosen by ?p=slug */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const work = window.WORK || [];
const key = new URLSearchParams(location.search).get("p");
let idx = work.findIndex((w, i) => w.slug === key || String(i) === key);
if (idx < 0) idx = 0;
const w = work[idx], next = work[(idx + 1) % work.length];
document.title = `${w.title} — Studio Navya`;

const list = arr => (arr || []).map(x => `<li>${x}</li>`).join("");
const gallery = (w.gallery || []).map(g =>
  `<figure class="reveal"><img src="${g.src}" alt="${g.caption || ""}" loading="lazy">${g.caption ? `<figcaption>${g.caption}</figcaption>` : ""}</figure>`
).join("");

$("#case").innerHTML = `
  <section class="case-hero dark">
    <div class="container">
      <p class="kicker">${w.category}${w.spec ? ` · <span class="spec">Concept project</span>` : ""}</p>
      <h1 class="split">${w.title}</h1>
      <p class="lead">${w.summary}</p>
      <dl class="case-meta">
        <div><dt>${w.spec ? "Brand" : "Client"}</dt><dd>${w.client || "—"}</dd></div>
        <div><dt>Scope</dt><dd>${w.duration || "—"}</dd></div>
        <div><dt>My role</dt><dd>${w.role || w.category}</dd></div>
      </dl>
    </div>
  </section>

  ${w.image ? `<div class="case-cover"><div class="container"><img class="img-reveal" src="${w.image}" alt=""></div></div>` : ""}

  <section class="section container case-results">
    ${w.spec ? `<p class="case-note">A self-initiated concept project, made to show my process. Not a paid client engagement.</p>` : ""}
    ${(w.deliverables || w.results || []).map(r => {
      const t = r.split(" "), k = Math.max(0, t.findIndex(x => /\d/.test(x)));
      const label = [...t.slice(0, k), ...t.slice(k + 1)].join(" ").replace(/:$/, "");
      return `<div class="reveal"><strong>${t[k]}</strong><span>${label}</span></div>`;
    }).join("")}
  </section>

  <section class="container case-body">
    ${w.problem ? `<div class="case-row reveal"><span class="sec-num">The problem</span><p class="case-big">${w.problem}</p></div>` : ""}
    ${w.approach ? `<div class="case-row reveal"><span class="sec-num">What I did</span><ol class="case-steps">${list(w.approach)}</ol></div>` : ""}
    ${gallery ? `<div class="case-row"><span class="sec-num">The work</span><div class="case-gallery">${gallery}</div></div>` : ""}
    ${w.test ? `<div class="case-row reveal"><span class="sec-num">What I'd test first</span><p class="case-big"><em>${w.test}</em></p></div>` : ""}
    ${w.learned ? `<div class="case-row reveal"><span class="sec-num">What I learned</span><p class="case-big"><em>${w.learned}</em></p></div>` : ""}
    ${w.quote ? `<blockquote class="case-quote reveal"><p>“${w.quote.text}”</p><cite>${w.quote.name}${w.quote.role ? `, ${w.quote.role}` : ""}</cite></blockquote>` : ""}
    ${w.link ? `<p class="reveal"><a class="link-arrow" href="${w.link}" target="_blank" rel="noopener">See it live ↗</a></p>` : ""}
  </section>

  <section class="section container case-cta reveal">
    <h2>Want this kind of thinking for <em>your</em> brand?</h2>
    <a class="btn" href="index.html#contact">Start a conversation</a>
  </section>

  ${next && next !== w ? `<a class="case-next dark" href="case.html?p=${encodeURIComponent(next.slug || (idx + 1) % work.length)}">
    <div class="container"><span class="kicker">Next project</span><h2>${next.title} →</h2></div></a>` : ""}
`;

/* animations */
$$(".split").forEach(el => {
  el.innerHTML = el.textContent.split(" ").map((t, i) => `<span class="w"><span style="transition-delay:${i * 60}ms">${t}</span></span>`).join(" ");
});
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: 0.15 });
$$(".reveal, .split, .img-reveal").forEach(el => io.observe(el));
const bar = $(".progress");
addEventListener("scroll", () => {
  bar.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - innerHeight)})`;
}, { passive: true });
$("#yr").textContent = new Date().getFullYear();
