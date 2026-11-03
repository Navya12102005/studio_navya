export function composePrompt({role,task,context='',constraints=''}){
 if(!task.trim())throw new Error('Describe the task before building a prompt.');
 return [`ROLE: ${role.trim()||'Helpful specialist'}`,`TASK: ${task.trim()}`,context.trim()?`CONTEXT: ${context.trim()}`:'',constraints.trim()?`CONSTRAINTS: ${constraints.trim()}`:'','OUTPUT: State assumptions, then provide the requested result.'].filter(Boolean).join('\n\n');
}
export function inspectCsv(csv){
 const lines=csv.trim().split(/\r?\n/);if(lines.shift()?.trim()!=='id,date,amount')throw new Error('Use the header id,date,amount and unquoted comma-separated rows.');
 const seen=new Set(),accepted=[],rejected=[];let totalCents=0;
 lines.forEach((line,index)=>{const cells=line.split(',').map(s=>s.trim()),[id,date,amount]=cells;let reason='';
  if(cells.length!==3||!id)reason='Expected three fields and a nonempty ID.';
  else if(seen.has(id))reason='Duplicate ID.';
  else if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)reason='Invalid ISO date.';
  else if(!/^\d+(\.\d{1,2})?$/.test(amount))reason='Use a nonnegative amount with at most two decimal places.';
  const cents=reason?0:Number(amount.split('.')[0])*100+Number((amount.split('.')[1]||'').padEnd(2,'0'));
  if(!reason&&!Number.isSafeInteger(cents+totalCents))reason='Amount exceeds the safe range for this browser demonstration.';
  if(reason)rejected.push({row:index+2,reason});else{seen.add(id);totalCents+=cents;accepted.push({id,date,cents});}
 });return{accepted,rejected,total:(totalCents/100).toFixed(2)};
}
export const COMIC_REALMS=[{id:1,title:'TECH MATRIX',subtitle:'The neural code city',works:[['prompt','Prompt sandbox'],['python','Python pipeline logic'],['build','Vibe-coding project']]},{id:2,title:'BIOMEDICAL SANCTUARY',subtitle:'The clinical blueprint lab',works:[['plates','Exploded anatomical plates'],['molecule','Molecular interaction study'],['research','Research context']]},{id:3,title:'CREATIVE STUDIO',subtitle:'A luxury-goth story gallery',works:[['startup','Design leadership'],['studio','Studio Navya'],['soundcheck','Event direction']]}];
