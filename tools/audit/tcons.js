module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 const PT=n=>S().perms.filter(p=>p.card.name===n).map(p=>W.__js(`(()=>{const o=compute(S).X.objs['${p.uid}'];return o.p+'/'+o.t+' '+o.controller})()`)).join(', ');
 // 1. Leeching Bite : deux cibles distinctes (TargetUnique)
 await add('Grizzly Bears','battlefield');await add('Grizzly Bears','battlefield','p2');await add('Leeching Bite','hand');
 zb('Leeching Bite','zcast');await sleep(40);tg('Grizzly Bears','0');await sleep(20);
 const B=S().perms.filter(p=>p.card.name==='Grizzly Bears');
 q(`[data-act=tsel][data-ui="0b"][data-u="${B[0].uid}"]`)?.click();await sleep(20);T('LB même cible refusée : '+W.__js('String(toast)').slice(0,90)+' | sel2='+JSON.stringify(W.__js('JSON.stringify(pick.sel)')));
 q(`[data-act=tsel][data-ui="0b"][data-u="${B[1].uid}"]`)?.click();await sleep(20);go();await sleep(40);res();await sleep(40);T('LB après : '+PT('Grizzly Bears'));
 // 2. Krosan Reclamation : cartes du cimetière du joueur ciblé seulement, puis mélange
 await add('Llanowar Elves','graveyard','p1');await add('Elvish Mystic','graveyard','p2');await add('Krosan Reclamation','hand');
 zb('Krosan Reclamation','zcast');await sleep(40);tg('Adversaire','0');await sleep(20);
 tg('Llanowar Elves','0b');await sleep(20);T('KR carte de Toi refusée : '+W.__js('String(toast)').slice(0,90));
 tg('Elvish Mystic','0b');await sleep(20);go();await sleep(40);res();await sleep(40);log(1);T('KR cimetière p2 : '+zone('p2','graveyard').join(',')+' | bibli p2 contient Mystic : '+zone('p2','library').includes('Elvish Mystic'));
 // 3. Seismic Wave : 1 à chaque créature non-artefact que contrôle l'adversaire ciblé
 await add('Seismic Wave','hand');zb('Seismic Wave','zcast');await sleep(40);tg('Adversaire','0');await sleep(10);tg('Adversaire','0b');await sleep(10);go();await sleep(40);res();await sleep(40);log(1);
 // 4. Jinxed Idol : l'adversaire ciblé en prend le contrôle
 await add('Jinxed Idol','battlefield');await add('Grizzly Bears','battlefield');const idol=perm('Jinxed Idol');
 act('Jinxed Idol',0);await sleep(40);T('JI '+pk().slice(0,200));tg('Adversaire','0');await sleep(10);
 if(q('[data-act=sacsel]'))q('[data-act=sacsel]').click();go();await sleep(40);res();await sleep(40);log(1);T('JI contrôleur : '+W.__js(`compute(S).X.objs['${idol.uid}']?.controller`));
};
