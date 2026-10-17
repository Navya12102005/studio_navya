import {mkdir, rm, cp, readdir} from "node:fs/promises";
import path from "node:path";
const root=process.cwd(), out=path.join(root,"dist");
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const file of await readdir(root)){
  if(/\.(html|css|js)$/.test(file)) await cp(path.join(root,file),path.join(out,file));
}
await cp(path.join(root,"assets"),path.join(out,"assets"),{recursive:true});
console.log("Static site prepared in dist/.");
