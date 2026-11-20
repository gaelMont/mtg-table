module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 const CO=(n,z,pl)=>W.__js(`(()=>{const e=Z('${pl||'p1'}','${z}').find(e=>e.card.name==='${n}');if(!e)return 'absente';const o=cardAsObj(e.card,'${pl||'p1'}');return JSON.stringify({c:o.colors,t:o.types,s:o.sub})})()`);
 await add('Grizzly Bears','hand');await add('Lightning Bolt','graveyard','p2');
 T('avant : ours main '+CO('Grizzly Bears','hand')+' | bolt cimetière p2 '+CO('Lightning Bolt','graveyard','p2'));
 // Painter's Servant : bleu choisi
 await add("Painter's Servant",'hand');zb("Painter's Servant",'zcast');await sleep(40);go();await sleep(40);res();await sleep(60);T('pk '+(q('#picker')?.innerHTML||'').slice(0,400));ans('Bleu');await sleep(40);log(1);
 T('Painter : ours main '+CO('Grizzly Bears','hand')+' | bolt cimetière p2 '+CO('Lightning Bolt','graveyard','p2'));
 T('dbg '+W.__js(`(()=>{const X=R&&R.X;if(!X)return 'noX';const p=S.perms.find(p=>p.card.name==="Painter's Servant");const o=X.objs[p.uid];return JSON.stringify({has:!!o,ab:(o?.abilities||[]).map(a=>a.kind+':'+!!a.effect+':'+!!(a.effect&&a.effect.allZones)),par:X.params?.[p.uid]})})()`));
 T('Painter lui-même '+W.__js(`(()=>{const p=S.perms.find(p=>p.card.name==="Painter's Servant");return JSON.stringify(compute(S).X.objs[p.uid].colors)})()`));
 // Leyline of Transformation : seulement mes créatures, avec le type choisi
 await add('Leyline of Transformation','battlefield');await sleep(20);
 W.__js(`(()=>{const p=S.perms.find(p=>p.card.name==='Leyline of Transformation');p.params=p.params||{};p.params.chosenType='Elf';render();})()`);await sleep(20);
 await add('Grizzly Bears','hand','p2');
 T('Leyline : mon ours main '+CO('Grizzly Bears','hand')+' | ours main p2 '+CO('Grizzly Bears','hand','p2'));
};
