(() => {
"use strict";
const $=(s,el=document)=>el.querySelector(s), $$=(s,el=document)=>[...el.querySelectorAll(s)];
const {esc:e,safeURL,site,work,preview,cover}=window.Studio;
const services=window.SERVICES || [];
// Native tabs with vertical arrow-key navigation.
const tabs=$("#serviceTabs"), panel=$("#servicePanel");
function renderService(index,focus=false){
 const s=services[index]; if(!s)return;
 $$(".service-tab",tabs).forEach((tab,i)=>{tab.setAttribute("aria-selected",String(i===index));tab.tabIndex=i===index?0:-1;if(i===index&&focus)tab.focus();});
 panel.setAttribute("aria-labelledby","service-tab-"+s.id);
 panel.innerHTML='<p class="eyebrow">THE EXPERTISE / '+String(index+1).padStart(2,"0")+'</p><h3>'+e(s.name)+'</h3><p class="service-what">'+e(s.what)+'</p><div class="service-panel-grid"><div><h4>What’s included</h4><ul class="service-includes">'+s.includes.map(x=>'<li>'+e(x)+'</li>').join("")+'</ul></div><div class="service-panel-side"><div><h4>Example scope</h4>'+s.deliverables.map(([n,l])=>'<div class="deliverable-row"><b>'+e(n)+'</b><span>'+e(l)+'</span></div>').join("")+'</div><p class="best-for"><b>A good fit for</b><br>'+e(s.ideal)+'</p></div></div><h4>What we measure</h4><div class="kpi-list">'+s.kpis.map(x=>'<span>'+e(x)+'</span>').join("")+'</div><a class="button" href="#contact" data-service="'+e(s.name)+'">Explore this service <span aria-hidden="true">↗</span></a>';
 panel.classList.remove("panel-enter");void panel.offsetWidth;panel.classList.add("panel-enter");
}
services.forEach((s,i)=>{const b=document.createElement("button");b.type="button";b.className="service-tab";b.id="service-tab-"+s.id;b.role="tab";b.setAttribute("aria-controls","servicePanel");b.innerHTML='<span>'+["I","II","III","IV","V","VI","VII"][i]+'</span>'+e(s.name)+'<span aria-hidden="true">↗</span>';b.addEventListener("click",()=>renderService(i));b.addEventListener("keydown",ev=>{let next=i;if(ev.key==="ArrowDown"||ev.key==="ArrowRight")next=(i+1)%services.length;else if(ev.key==="ArrowUp"||ev.key==="ArrowLeft")next=(i-1+services.length)%services.length;else if(ev.key==="Home")next=0;else if(ev.key==="End")next=services.length-1;else return;ev.preventDefault();renderService(next,true);});tabs.append(b);});
renderService(0);
const serviceSelect=$("#service");
function addServiceOption(label){const option=document.createElement("option");option.value=label;option.textContent=label;serviceSelect.append(option);}
services.forEach(s=>addServiceOption(s.name));
["Signature Project","Ongoing Partnership","Full Studio","Single project"].forEach(addServiceOption);
// Filtered work. Concepts are always explicitly marked.
const grid=$("#workGrid"), filters=$("#workFilters");
const categories=["All work",...new Set(work.map(w=>w.category))];
function renderWork(cat){
 $$(".filter-button",filters).forEach(b=>{const active=b.dataset.category===cat;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});
 const selected=work.filter(w=>cat==="All work"||w.category===cat);
 grid.innerHTML=selected.length?selected.map(w=>'<a class="work-card" href="case.html?p='+encodeURIComponent(w.slug)+(preview?"&preview=1":"")+'">'+cover(w)+'<div class="work-meta"><span>'+e(w.category)+'</span><span class="'+(w.spec?"concept":"")+'">'+(w.spec?"Concept brief":"Client project")+'</span></div><h3>'+e(w.title)+'</h3><p>'+e(w.summary)+'</p></a>').join(""):'<p class="empty-state">New work is on the way. Let’s talk about your project.</p>';
 $("#workCount").textContent=selected.length+" project"+(selected.length===1?"":"s")+" / "+(cat==="All work"?"THE COLLECTION":cat.toUpperCase());
}
categories.forEach(cat=>{const b=document.createElement("button");b.type="button";b.className="filter-button";b.dataset.category=cat;b.textContent=cat;b.addEventListener("click",()=>renderWork(cat));filters.append(b);});
renderWork("All work");
// Interactive marketing journey.
const stages=[
 ["01 / BE DISCOVERED","Give the right people a reason to notice you. Search-led writing and consistent social content introduce your brand through useful ideas, a recognisable voice and relevant topics."],
 ["02 / EARN TRUST","Show the thinking behind your work. LinkedIn posts, useful articles and a clear brand story help potential clients understand your expertise before a sales conversation."],
 ["03 / START A CONVERSATION","Reach relevant prospects with a specific, personal message. Research, thoughtful outreach and a clear next step turn awareness into an opportunity to talk."],
 ["04 / BUILD A RELATIONSHIP","Stay useful after the first hello. Welcome emails, segmented newsletters and follow-up content help people get to know your brand and return when the need is right."]
];
$$(".journey-node").forEach(b=>b.addEventListener("click",()=>{$$(".journey-node").forEach(x=>{const on=x===b;x.classList.toggle("active",on);x.setAttribute("aria-pressed",String(on));});const s=stages[Number(b.dataset.stage)];$("#journeyDetail").innerHTML='<span class="eyebrow">'+s[0]+'</span><p>'+s[1]+'</p>';}));
// Placeholder credentials never count as completed training.
const certs=(window.CERTS||[]).filter(c=>!c.placeholder);
if(certs.length){$("#credentials").hidden=false;$("#credentialList").innerHTML=certs.map(c=>'<article class="credential"><h3>'+e(c.title)+'</h3><p>'+e(c.issuer)+' · '+e(c.date)+'</p>'+(safeURL(c.link)?'<a class="text-link" target="_blank" rel="noopener" href="'+e(safeURL(c.link))+'">Verify credential ↗</a>':"")+'</article>').join("");}
// Keep the original one-off menu available, without discount clutter.
const singles=site.singles||[], singleFilters=$("#singleFilters");
function renderSingles(cat){
 $$(".filter-button",singleFilters).forEach(b=>{const on=b.dataset.category===cat;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));});
 const items=singles.filter(s=>cat==="All"||s.service===cat);
 $("#singleGrid").innerHTML=items.map(s=>'<article class="single-card"><small>'+e(s.service)+'</small><h3>'+e(s.name)+'</h3><p>'+e(s.includes)+'</p><span class="single-meta">'+(site.showPrices?e(site.currency+s.price)+" · ":"")+e(s.days? s.days+" working days · scope to confirm":"Scope to confirm")+'</span><a class="text-link" href="#contact" data-single="'+e(s.name)+'">Discuss this brief <span aria-hidden="true">↗</span></a></article>').join("");
}
["All",...new Set(singles.map(s=>s.service))].forEach(cat=>{const b=document.createElement("button");b.type="button";b.className="filter-button";b.textContent=cat;b.dataset.category=cat;b.addEventListener("click",()=>renderSingles(cat));singleFilters.append(b);});
if(singles.length)renderSingles("All");else $(".project-menu").hidden=true;
if(site.showPrices)$$("[data-price]").forEach(el=>{const price=site.prices?.[el.dataset.price];if(price)el.textContent="From "+(site.currency||"₹")+price+" / month";});
// Navigation and contextual enquiries.
const header=$("#header"), menu=$(".menu-button");
function closeMenu(){header.classList.remove("menu-open");menu.setAttribute("aria-expanded","false");}
menu.addEventListener("click",()=>{const open=header.classList.toggle("menu-open");menu.setAttribute("aria-expanded",String(open));});
$$("nav a").forEach(a=>a.addEventListener("click",closeMenu));
document.addEventListener("keydown",ev=>{if(ev.key==="Escape"){closeMenu();menu.focus();}});
document.addEventListener("click",ev=>{
 const service=ev.target.closest("[data-service]"), pkg=ev.target.closest("[data-package]"),single=ev.target.closest("[data-single]");
 if(service)serviceSelect.value=service.dataset.service;
 if(pkg){serviceSelect.value=pkg.dataset.package;$("#message").value="I’d like to discuss the "+pkg.dataset.package+" for my brand.";}
 if(single){serviceSelect.value="Single project";$("#message").value="I’d like to discuss: "+single.dataset.single+".";}
});
// Only configured, real contact routes are rendered.
const contactEmail=String(site.email||"").trim();
const emailOK=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
if(emailOK){const a=$("#contactEmail");a.hidden=false;a.textContent=contactEmail;a.href="mailto:"+contactEmail;$("#deliveryNote").textContent="This opens your email app with your project brief ready to send.";$("#contactForm button[type=submit]").innerHTML='Open email with my enquiry <span aria-hidden="true">↗</span>';}
const socials=[["LinkedIn",site.linkedin],["Instagram",site.instagram],["Book a call",site.calendly]];
socials.forEach(([label,url])=>{const safe=safeURL(url);if(safe){const a=document.createElement("a");a.textContent=label+" ↗";a.href=safe;a.target="_blank";a.rel="noopener";$("#socialLinks").append(a);}});
if(/^\d{8,15}$/.test(site.whatsapp||"")){const a=document.createElement("a");a.textContent="WhatsApp ↗";a.href="https://wa.me/"+site.whatsapp;a.target="_blank";a.rel="noopener";$("#socialLinks").append(a);}
$$("[data-owner]").forEach(el=>el.textContent=site.name||"Navya");
const form=$("#contactForm");
form.addEventListener("submit",ev=>{
 ev.preventDefault();if(!form.reportValidity())return;const fd=new FormData(form);
 const brief="PROJECT ENQUIRY — STUDIO NAVYA\n\nName: "+fd.get("name")+"\nEmail: "+fd.get("email")+"\nBrand / website: "+fd.get("brand")+"\nService: "+fd.get("service")+"\n\n"+fd.get("message");
 $("#enquiryText").value=brief;$("#enquiryOutput").hidden=false;
 if(emailOK){const a=document.createElement("a");a.href="mailto:"+contactEmail+"?subject="+encodeURIComponent("Project enquiry: "+fd.get("service"))+"&body="+encodeURIComponent(brief);a.click();$("#formStatus").textContent="Your email app should open. Review and send the message there. You can also copy the brief below.";}
 else $("#formStatus").textContent="Your brief is ready below. It has not been sent. The studio’s contact details are still being finalised.";
});
$("#copyEnquiry").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("#enquiryText").value);$("#formStatus").textContent="Enquiry copied. Paste it into your preferred messaging app.";}catch{$("#enquiryText").focus();$("#enquiryText").select();$("#formStatus").textContent="Select and copy the enquiry above.";}});
$("#year").textContent=new Date().getFullYear();
if(preview){$("#draftBanner").hidden=false;$("#hideDraft").addEventListener("click",()=>$("#draftBanner").hidden=true);}
// Optional motion enhancement, with immediate static fallback.
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
if(!reduced.matches && "IntersectionObserver" in window){
 document.documentElement.classList.add("motion-ready");
 const observer=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");observer.unobserve(en.target);}}),{threshold:.08});
 $$(".reveal").forEach(el=>observer.observe(el));
 reduced.addEventListener("change",ev=>{if(ev.matches)document.documentElement.classList.remove("motion-ready");});
}
})();
