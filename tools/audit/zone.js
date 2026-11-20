module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 const PERM=(n,z)=>W.__js(`(()=>{const e=Z('p1','${z}').find(e=>e.card.name==='${n}');return e?JSON.stringify(permission(e.card,e.id,'${z}','p1')):'absente'})()`);
 // 1. Emry : cible une carte d'artefact de ton cimetière, tu peux la lancer ce tour-ci
 await add('Emry, Lurker of the Loch','battlefield');await add('Sol Ring','graveyard');await add('Grizzly Bears','graveyard');
 T('Emry avant : '+PERM('Sol Ring','graveyard'));
 act('Emry, Lurker of the Loch',0);await sleep(40);T('Emry choix '+pk().slice(0,160));
 tg('Grizzly Bears','0');await sleep(20);T('Emry ours refusé : '+W.__js('String(toast)').slice(0,90));
 tg('Sol Ring','0');await sleep(20);go();await sleep(40);res();await sleep(40);log(1);
 T('Emry Sol Ring : '+PERM('Sol Ring','graveyard')+' | Ours : '+PERM('Grizzly Bears','graveyard'));
 // 2. Back for Seconds : retour de cartes du cimetière ciblées
 await add('Llanowar Elves','graveyard');await add('Back for Seconds','hand');
 zb('Back for Seconds','zcast');await sleep(40);T('BfS '+pk().slice(0,200));
 tg('Llanowar Elves','0');await sleep(10);tg('Grizzly Bears','0');await sleep(10);go();await sleep(40);res();await sleep(40);log(1);
 T('BfS main : '+zone('p1','hand').join(',')+' | cimetière : '+zone('p1','graveyard').join(','));
};
