// 2e passe : ne rejoue que les unités signalées, sur le banc enrichi, avec deux politiques de réponse
const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync('/tmp/dbg.html','utf8'),{runScripts:'dangerously',pretendToBeVisual:true});
const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};
w.fetch=async(u)=>({json:async()=>JSON.parse(fs.readFileSync('/home/claude/sim/'+u,'utf8'))});
let pageErr=[];w.addEventListener('error',e=>pageErr.push(e.message));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const prev=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const out=process.argv[3];
(async()=>{await sleep(400);
 w.__js(fs.readFileSync('/home/claude/scripts/dyn_page.js','utf8'));await w.__js('dbIndex()');
 const D={};for(const f of fs.readdirSync('/home/claude/sim/db').filter(f=>/^cards_.\.json$/.test(f)))Object.assign(D,JSON.parse(fs.readFileSync('/home/claude/sim/db/'+f,'utf8')));
 const res={};let n=0;
 for(const [name,v] of Object.entries(prev)){const c=D[name];if(!c||c.cov!=='full')continue;
  const labs=[...new Set(v.warn.filter(x=>/aucun effet/.test(x)).map(x=>x.split(' : ')[0]))];if(!labs.length)continue;
  let still=new Set(labs);const errs=[];
  for(const last of [false,true]){w.__card=c;w.__opt={rich:1,last,only:[...still]};let r;try{r=w.__js('__dynTest(__card,__opt)');}catch(e){r={err:['HARNESS '+e.message],warn:[]}}
   errs.push(...(r.err||[]),...pageErr);pageErr=[];const ws=new Set((r.warn||[]).filter(x=>/aucun effet/.test(x)).map(x=>x.split(' : ')[0]));still=new Set([...still].filter(l=>ws.has(l)));if(!still.size)break;}
  n++;if(still.size||errs.length)res[name]={still:[...still],err:errs};
 }
 fs.writeFileSync(out,JSON.stringify(res));console.log('rejouées',n,'toujours muettes',Object.values(res).filter(x=>x.still.length).length,'erreurs',Object.values(res).filter(x=>x.err.length).length);process.exit(0);
})();
