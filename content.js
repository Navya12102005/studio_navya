/* Shared, escaped rendering and browser-draft loading. No credentials live here. */
(() => {
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeURL = (value, image = false) => {
    const text = String(value || "").trim();
    if (!text) return "";
    if (image && /^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=\s]+$/i.test(text)) return text;
    if (/^(assets\/|\.\/assets\/)[a-z0-9_./% -]+$/i.test(text) && !text.includes("..")) return text;
    try { const url = new URL(text); return ["https:", "http:"].includes(url.protocol) ? url.href : ""; } catch { return ""; }
  };
  const key = "studio-navya-draft-v1";
  const valid = data => !!(data && data.version === 1 && Array.isArray(data.work) && data.work.every(w => {
    if(!w || typeof w.title!=="string" || typeof w.slug!=="string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(w.slug))return false;
    if(["category","summary","client","duration","role","problem","test","image","link","learned"].some(k=>w[k]!=null&&typeof w[k]!=="string"))return false;
    if(["approach","deliverables","results"].some(k=>w[k]!=null&&(!Array.isArray(w[k])||w[k].some(x=>typeof x!=="string"))))return false;
    if(w.gallery!=null&&(!Array.isArray(w.gallery)||w.gallery.some(g=>!g||typeof g.src!=="string"||(g.caption!=null&&typeof g.caption!=="string"))))return false;
    return typeof w.spec==="boolean";
  }) && new Set(data.work.map(w=>w.slug)).size===data.work.length && (!data.site || (typeof data.site==="object" && !Array.isArray(data.site) && ["name","email","linkedin","instagram","whatsapp","calendly"].every(k=>data.site[k]==null||typeof data.site[k]==="string"))));
  const readDraft = () => { try { const data=JSON.parse(localStorage.getItem(key)); return valid(data) ? data : null; } catch { return null; } };
  const published = valid(window.STUDIO_CONTENT) ? window.STUDIO_CONTENT : {version:1, site:{}, work:window.WORK || []};
  const preview = new URLSearchParams(location.search).get("preview") === "1";
  const data = (preview && readDraft()) || published;
  const site = {...(window.SITE || {}), ...data.site};
  const defaults = {version:1,site:{...(window.SITE || {}),...published.site},work:published.work};
  function cover(w) {
    const url=safeURL(w.image,true);
    if(url) return '<div class="work-cover"><img src="'+esc(url)+'" alt="'+esc(w.title)+'" loading="lazy"></div>';
    const types={
      "Social Media":'<div class="cover-art cover-cafe"><span class="cover-label">SOCIAL / AN EDITORIAL DIRECTION</span><div class="cafe-board"><small>THE NEIGHBOURHOOD EDIT</small><strong>slow<br><em>mornings.</em></strong><span class="coffee-ring"></span><small>GOOD COFFEE. BETTER STORIES.</small></div><span class="cafe-side">STORIES WORTH STAYING FOR</span></div>',
      "LinkedIn":'<div class="cover-art cover-linkedin"><span class="cover-label">LINKEDIN / FOUNDER POSITIONING</span><div class="linkedin-post"><small>THE FOUNDER’S NOTE</small><strong>Expertise.<br>With a little<br><em>personality.</em></strong><div><div class="mock-line"></div><div class="mock-line short"></div></div></div></div>',
      "Cold Email":'<div class="cover-art cover-outreach"><span class="cover-label">OUTREACH / A MORE PERSONAL APPROACH</span><div class="letter-sheet"><small>A NOTE, JUST FOR YOU.</small><strong>Good things<br>start with<br>a hello.</strong><div class="mock-line"></div><div class="mock-line short"></div></div><div class="wax-seal">n</div></div>',
      "Email Marketing":'<div class="cover-art cover-skincare"><span class="cover-label">EMAIL / A WARM WELCOME</span><div class="skincare-letter"><small>aura</small><strong>A little care<br>goes a<br><em>long way.</em></strong><div class="skincare-bottle"></div></div></div>',
      "Content Writing":'<div class="cover-art cover-writing"><span class="cover-label">CONTENT / WORDS WITH PURPOSE</span><div class="writing-page"><small>THE JOURNAL / 01</small><strong>Make room<br>for a<br><em>new idea.</em></strong><div class="mock-line"></div><div class="mock-line"></div><div class="mock-line short"></div></div></div>',
      "Data Analytics":'<div class="cover-art cover-data"><span class="cover-label">ANALYTICS / THE CLEARER PICTURE</span><div class="dashboard"><small>THE BUSINESS, AT A GLANCE</small><div class="dash-kpis"><i>Sales</i><i>Trends</i><i>Mix</i></div><div class="dash-bars"><b style="height:35%"></b><b style="height:58%"></b><b style="height:43%"></b><b style="height:75%"></b><b style="height:66%"></b><b style="height:88%"></b></div></div></div>'
    };
    return '<div class="work-cover" role="img" aria-label="'+esc((w.spec ? "Illustrative concept cover: " : "Project cover: ")+w.title)+'">'+(types[w.category] || '<div class="cover-art cover-campaign"><span class="cover-label">CAMPAIGN / A SEASON TO REMEMBER</span><div class="campaign-art"><small>THE FESTIVE EDIT</small><strong>A little<br><em>celebration.</em></strong><span>✦</span></div></div>')+'</div>';
  }
  window.Studio={esc,safeURL,key,valid,readDraft,site,work:data.work,defaults,preview:preview&&!!readDraft(),cover};
})();
