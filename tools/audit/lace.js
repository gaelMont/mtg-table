module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 const COL=n=>W.__js(`(()=>{const p=S.perms.find(p=>p.card.name==='${n}');if(!p)return 'absent';return JSON.stringify(compute(S).X.objs[p.uid].colors)})()`);
 // 1. Moonlace sur un sort de créature : il arrive incolore et le reste
 await add('Grizzly Bears','hand');zb('Grizzly Bears','zcast');await sleep(40);go();await sleep(40);
 await add('Moonlace','hand');zb('Moonlace','zcast');await sleep(40);T('ML pick '+pk().slice(0,300));
 tg('Grizzly Bears','0');await sleep(10);go();await sleep(40);res();await sleep(60);log(1);
 T('ours sur la pile : '+W.__js(`JSON.stringify(S.stack.map(t=>t.name+':'+JSON.stringify(t.card.colors)))`));
 res();await sleep(60);log(1);T('ours sur le champ : '+COL('Grizzly Bears'));
 // 2. Purelace sur un permanent
 await add('Llanowar Elves','battlefield');await add('Purelace','hand');zb('Purelace','zcast');await sleep(40);tg('Llanowar Elves','0');await sleep(10);go();await sleep(40);res();await sleep(60);log(1);
 T('elfes : '+COL('Llanowar Elves'));
 // 3. Chaoslace sur un éphémère : le sort change, la carte au cimetière redevient normale
 await add('Divination','hand');zb('Divination','zcast');await sleep(40);go();await sleep(40);
 await add('Chaoslace','hand');zb('Chaoslace','zcast');await sleep(40);tg('Divination','0');await sleep(10);go();await sleep(40);res();await sleep(60);log(1);
 T('Div pile : '+W.__js(`JSON.stringify(S.stack.map(t=>t.name+':'+JSON.stringify(t.card.colors)))`));
 res();await sleep(80);log(1);T('gy '+zone('p1','graveyard').join(','));T('Div cimetière : '+W.__js(`JSON.stringify(Z('p1','graveyard').filter(e=>e.card.name==='Divination').map(e=>e.card.colors))`));
 // 4. Parallectric Feedback : blessures = valeur de mana du sort ciblé, au contrôleur du sort
 await add('Shivan Dragon','hand');zb('Shivan Dragon','zcast');await sleep(40);go();await sleep(40);
 const l0=W.__js(`S.players.find(p=>p.id==='p1').life`);
 await add('Parallectric Feedback','hand');T('pile avant '+W.__js(`JSON.stringify(S.stack.map(t=>t.name))`));zb('Parallectric Feedback','zcast');await sleep(40);T('PF pick '+pk().slice(0,400));tg('Shivan Dragon','0');await sleep(10);go();await sleep(40);T('top '+W.__js(`JSON.stringify(S.stack.at(-1),(k,v)=>k==='card'?undefined:v).slice(0,700)`));res();await sleep(60);log(1);
 T('vie lanceur du dragon : '+l0+' -> '+W.__js(`S.players.find(p=>p.id==='p1').life`));
};
