module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 await add('Grizzly Bears','battlefield');await add('Xenograft','hand');zb('Xenograft','zcast');await sleep(40);go();await sleep(40);res();await sleep(60);log(1);
 T('choix '+pk().slice(0,300));T('picker html '+q('#picker').innerHTML.slice(0,600));const inp=q('#picker input, #picker select');if(inp){if(inp.tagName==='SELECT'){const o=[...inp.options].find(o=>o.textContent.includes('Elf'));inp.value=o?o.value:inp.value;}else inp.value='Elf';inp.dispatchEvent(new c.w.Event('input',{bubbles:true}));inp.dispatchEvent(new c.w.Event('change',{bubbles:true}));}await sleep(20);ans('Valider');await sleep(40);log(1);
 T('xeno params '+JSON.stringify(perm('Xenograft')?.params));
 T('ours sous-types '+W.__js(`(()=>{const p=S.perms.find(p=>p.card.name==='Grizzly Bears');return JSON.stringify(compute(S).X.objs[p.uid].sub)})()`));
 // Wild Mongrel : défausse, devient la couleur choisie
 await add('Wild Mongrel','battlefield');await add('Island','hand');act('Wild Mongrel',0);await sleep(40);T('WM pick '+pk().slice(0,300));go();await sleep(40);T('WM pick2 '+pk().slice(0,300));
 res();await sleep(60);T('WM res '+pk().slice(0,300));T('picker '+(q('#picker')?.innerHTML||'').slice(0,500));
 const bs=[...c.w.document.querySelectorAll('#picker button')].map(b=>b.textContent);T('boutons '+bs.join('|'));ans('Bleu');await sleep(40);ans('Valider');await sleep(40);log(1);
 T('mongrel '+W.__js(`(()=>{const p=S.perms.find(p=>p.card.name==='Wild Mongrel');const o=compute(S).X.objs[p.uid];return o.p+'/'+o.t+' '+JSON.stringify(o.colors)})()`));
};
