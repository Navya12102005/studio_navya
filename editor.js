(() => {
"use strict";
const $=s=>document.querySelector(s),{esc:e,safeURL,key,valid,defaults,readDraft,cover}=window.Studio;
const clone=x=>JSON.parse(JSON.stringify(x));
let draft=clone(readDraft()||defaults),undo=null;
const status=message=>$("#editorStatus").textContent=message;
function save(next,message){try{const previous=clone(draft);localStorage.setItem(key,JSON.stringify(next));undo=previous;draft=clone(next);status(message+" Saved only in this browser. Export to publish.");renderList();return true;}catch{status("This browser could not save the draft (storage may be full or unavailable). Download a backup before leaving.");return false;}}
function renderSettings(){const s={...defaults.site,...draft.site};["name","email","linkedin","instagram","whatsapp","calendly"].forEach(name=>$("#settingsForm [name="+name+"]").value=s[name]||"");$("#showPrices").checked=!!s.showPrices;}
function renderList(){const active=$("#editingSlug").value;$("#projectList").innerHTML=draft.work.map(w=>'<li class="project-list-item"><button type="button" data-edit="'+e(w.slug)+'" class="'+(w.slug===active?"selected":"")+'">'+e(w.title)+'<small>'+e(w.category)+' · '+(w.spec?"Concept":"Client project")+'</small></button></li>').join("");$("#undoChange").disabled=!undo;}
function showCover(){const src=safeURL($("#projectImage").value,true);$("#coverPreview").innerHTML=src?'<div class="work-cover"><img src="'+e(src)+'" alt="Project cover preview"></div>':"";}
function resetProject(){$("#projectForm").reset();$("#editingSlug").value="";$("#projectHeading").textContent="Add your next chapter.";$("#deleteProject").hidden=true;$("#projectSpec").checked=true;showCover();renderList();}
function editProject(slug){const w=draft.work.find(w=>w.slug===slug);if(!w)return;$("#editingSlug").value=w.slug;const map={Title:"title",Slug:"slug",Category:"category",Client:"client",Duration:"duration",Role:"role",Summary:"summary",Problem:"problem",Test:"test",Image:"image",Link:"link"};Object.entries(map).forEach(([id,field])=>$("#project"+id).value=w[field]||"");["Approach","Deliverables","Results"].forEach(id=>$("#project"+id).value=(w[id.toLowerCase()]||[]).join("\n"));$("#projectSpec").checked=!!w.spec;$("#projectHeading").textContent="Refine this chapter.";$("#deleteProject").hidden=false;showCover();renderList();$("#projectHeading").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
$("#projectList").addEventListener("click",ev=>{const b=ev.target.closest("[data-edit]");if(b)editProject(b.dataset.edit);});
$("#settingsForm").addEventListener("submit",ev=>{ev.preventDefault();if(!ev.target.reportValidity())return;const next=clone(draft);next.site={...next.site,...Object.fromEntries(new FormData(ev.target)),showPrices:$("#showPrices").checked};if(["linkedin","instagram","calendly"].some(k=>next.site[k]&&!safeURL(next.site[k]))){status("Use a complete https:// URL for your social and booking links.");return;}save(next,"Contact details updated.");});
$("#newProject").addEventListener("click",()=>{resetProject();$("#projectTitle").focus();});
$("#projectTitle").addEventListener("input",()=>{if(!$("#editingSlug").value)$("#projectSlug").value=$("#projectTitle").value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");});
$("#projectImage").addEventListener("input",showCover);
$("#imageUpload").addEventListener("change",ev=>{const f=ev.target.files[0];if(!f)return;if(!["image/png","image/jpeg","image/webp"].includes(f.type)||f.size>1024*1024){status("Choose a PNG, JPEG or WebP image smaller than 1 MB.");ev.target.value="";return;}const reader=new FileReader();reader.onload=()=>{$("#projectImage").value=String(reader.result);showCover();status("Cover selected. Save the project to include it in your draft.");};reader.onerror=()=>status("The image could not be read. Try choosing it again.");reader.readAsDataURL(f);});
$("#projectForm").addEventListener("submit",ev=>{
 ev.preventDefault();if(!ev.target.reportValidity())return;
 const oldSlug=$("#editingSlug").value,slug=$("#projectSlug").value.trim();
 if(draft.work.some(w=>w.slug===slug&&w.slug!==oldSlug)){status("That URL slug is already used. Choose a unique one.");return;}
 const image=$("#projectImage").value.trim();if(image&&!safeURL(image,true)){status("Use an https:// image URL, an assets/work/ path, or choose an image.");return;}
 const lines=id=>$("#project"+id).value.split("\n").map(s=>s.trim()).filter(Boolean);
 const existing=draft.work.find(w=>w.slug===oldSlug)||{};
 const w={...existing,slug,title:$("#projectTitle").value.trim(),category:$("#projectCategory").value,client:$("#projectClient").value.trim(),duration:$("#projectDuration").value.trim(),role:$("#projectRole").value.trim(),summary:$("#projectSummary").value.trim(),spec:$("#projectSpec").checked,problem:$("#projectProblem").value.trim(),approach:lines("Approach"),deliverables:lines("Deliverables"),test:$("#projectTest").value.trim(),image,gallery:existing.gallery||[],link:$("#projectLink").value.trim(),results:$("#projectSpec").checked?[]:lines("Results")};
 const next=clone(draft),i=next.work.findIndex(w=>w.slug===oldSlug);if(i<0)next.work.unshift(w);else next.work[i]=w;
 if(save(next,"Project updated.")){$("#editingSlug").value=slug;$("#deleteProject").hidden=false;$("#projectHeading").textContent="Refine this chapter.";renderList();}
});
$("#deleteProject").addEventListener("click",()=>{const slug=$("#editingSlug").value;if(!slug)return;const next=clone(draft);next.work=next.work.filter(w=>w.slug!==slug);if(save(next,"Project removed from the draft. Use Undo to restore it."))resetProject();});
$("#undoChange").addEventListener("click",()=>{if(!undo)return;const previous=clone(undo);if(save(previous,"Last saved change reversed.")){renderSettings();resetProject();}});
$("#restoreDefaults").addEventListener("click",()=>{if(save(clone(defaults),"Published content restored in your draft.")){renderSettings();resetProject();}});
function download(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
$("#exportContent").addEventListener("click",()=>{const payload={version:1,site:draft.site,work:draft.work};const js="/* Exported from the Studio Navya editor. Replace content-data.js, commit, then redeploy. */\nwindow.STUDIO_CONTENT = "+JSON.stringify(payload,null,2).replace(/</g,"\\u003c")+";\n";download("content-data.js",js,"text/javascript");status("Exported saved draft. Replace content-data.js in GitHub, commit, and redeploy. This export does not publish by itself.");});
$("#exportBackup").addEventListener("click",()=>{download("studio-navya-content-backup.json",JSON.stringify(draft,null,2),"application/json");status("Saved draft exported as a backup. Keep it to import on another device.");});
$("#importBackup").addEventListener("change",async ev=>{const f=ev.target.files[0];if(!f)return;try{if(f.size>6*1024*1024)throw Error();const data=JSON.parse(await f.text());if(!valid(data)||new Set(data.work.map(w=>w.slug)).size!==data.work.length)throw Error();if(save(data,"Backup imported.")){renderSettings();resetProject();}}catch{status("That file is not a valid Studio Navya JSON backup, or it is too large.");}finally{ev.target.value="";}});
renderSettings();renderList();showCover();
})();
