const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync('/tmp/dbg.html','utf8'),{runScripts:'dangerously',pretendToBeVisual:true});
const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};
w.fetch=async(u)=>({json:async()=>JSON.parse(fs.readFileSync('/home/claude/sim/'+u,'utf8'))});
let pageErr=[];w.addEventListener('error',e=>pageErr.push(e.message));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{await sleep(400);w.__js(fs.readFileSync('/home/claude/scripts/dyn_page.js','utf8'));w.__js(fs.readFileSync('/home/claude/scripts/dyn_trig.js','utf8'));await w.__js('dbIndex()');
 const D={};for(const f of fs.readdirSync('/home/claude/sim/db').filter(f=>/^cards_.\.json$/.test(f)))Object.assign(D,JSON.parse(fs.readFileSync('/home/claude/sim/db/'+f,'utf8')));
 const names=process.argv[3]?process.argv.slice(3):Object.keys(D).filter(n=>D[n].cov==='full'&&(D[n].abilities||[]).some(a=>a.kind==='triggered'));
 const res={};let n=0;const t0=Date.now();
 for(const nm of names){const c=D[nm];if(!c)continue;n++;w.__card=c;let r;try{r=w.__js('__dynTrig(__card)');}catch(e){r=['HARNESS '+e.message];}if(pageErr.length){r.push(...pageErr.map(x=>'PAGE '+x));pageErr=[];}if(r.length)res[nm]=r;
  if(process.argv[3]&&!process.env.QUIET)console.log(nm,JSON.stringify(r),'\n  ',w.__js('S.log.slice(-3).join(" || ")').slice(0,500));}
 fs.writeFileSync(process.argv[2],JSON.stringify(res));console.log('cartes',n,'signalées',Object.keys(res).length,((Date.now()-t0)/1000|0)+'s');process.exit(0);})();
