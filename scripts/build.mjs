import {mkdir, rm, cp, readdir} from "node:fs/promises";
import path from "node:path";
const root=process.cwd(), out=path.join(root,"dist");
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const file of await readdir(root)){
  if(/\.(html|css|js)$/.test(file)) await cp(path.join(root,file),path.join(out,file));
}
await mkdir(path.join(out,"assets"),{recursive:true});
for(const entry of await readdir(path.join(root,"assets"))){
  if(["scene","vendor"].includes(entry))continue; // Archived modeled-room prototype is not published.
  await cp(path.join(root,"assets",entry),path.join(out,"assets",entry),{recursive:true});
}
console.log("Static site prepared in dist/.");
