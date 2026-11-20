// Audit dynamique : exécute chaque capacité de chaque carte « automatisée » dans un état de jeu standard.
const {JSDOM}=require('jsdom');const fs=require('fs');
const dom=new JSDOM(fs.readFileSync('/tmp/dbg.html','utf8'),{runScripts:'dangerously',pretendToBeVisual:true});
const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};
w.fetch=async(u)=>({json:async()=>JSON.parse(fs.readFileSync('/home/claude/sim/'+u,'utf8'))});
let pageErr=[];w.addEventListener('error',e=>pageErr.push(e.message));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const letters=process.argv[2]||'abcdefghijklmnopqrstuvwxyz0';const out=process.argv[3]||'/tmp/dyn_out.json';
(async()=>{await sleep(400);
 w.__js(fs.readFileSync('/home/claude/scripts/dyn_page.js','utf8'));await w.__js('dbIndex()');
 const res={};let n=0;const t0=Date.now();
 for(const L of letters){const f=`/home/claude/sim/db/cards_${L}.json`;if(!fs.existsSync(f))continue;const D=JSON.parse(fs.readFileSync(f,'utf8'));
  for(const [name,c] of Object.entries(D)){if(c.cov!=='full')continue;n++;
   let r;try{w.__card=c;r=w.__js('__dynTest(__card)');}catch(e){r={err:['HARNESS '+String(e&&e.message||e)]};}
   if(pageErr.length){(r.err??=[]).push(...pageErr);pageErr=[];}
   if(r&&(r.err?.length||r.warn?.length))res[name]=r;}
 }
 fs.writeFileSync(out,JSON.stringify(res,null,0));console.log('testées',n,'problèmes',Object.keys(res).length,'en',((Date.now()-t0)/1000).toFixed(0),'s');process.exit(0);
})();
