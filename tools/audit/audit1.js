module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg}=c;
 // Wall of Wonder : peut attaquer malgré défenseur (effet dont la source est la carte)
 await add('Wall of Wonder','battlefield');const w=perm('Wall of Wonder');
 T('ww '+c.w.__js(`(()=>{const so={name:'Wall of Wonder',controller:'p1',srcUid:'${w.uid}',text:'t'};const X=compute(S).X;const card=S.perms.find(p=>p.uid==='${w.uid}').card;const r=runActions(card.activations[0].actions,so,X,[],{},'k:t');const X2=compute(S).X;return r.join(' ')+' | rules '+rulesOf(X2,['canAttackDefender']).map(x=>JSON.stringify(x.r.affects)+'@'+x.src.uid).join(',')+' self='+'${w.uid}'+' ok='+rulesOf(X2,['canAttackDefender']).some(x=>evalSel(x.r.affects,X2,{controller:'p1',src:x.src.uid}).includes('${w.uid}'))})()`));
 // Izzet Staticaster : 1 blessure à la cible et à chaque AUTRE créature du même nom
 await add('Izzet Staticaster','battlefield');await add('Grizzly Bears','battlefield');await add('Grizzly Bears','battlefield');await add('Savannah Lions','battlefield');
 const bs=c.w.__js(`JSON.stringify(S.perms.filter(p=>p.card.name==='Grizzly Bears').map(p=>p.uid))`);const B=JSON.parse(bs);
 T('iz '+c.w.__js(`(()=>{const st=S.perms.find(p=>p.card.name==='Izzet Staticaster');const so={name:'Izzet Staticaster',controller:'p1',srcUid:st.uid,text:'t',units:[{targets:['${B[0]}']}]};S._resolving=so;const X=compute(S).X;const r=runActions(st.card.activations[0].actions,so,X,['${B[0]}'],{},'k:t');S._resolving=null;return r.join(' ')+' | dmg '+S.perms.filter(p=>['Grizzly Bears','Savannah Lions'].includes(p.card.name)).map(p=>p.card.name+':'+p.damage).join(',')})()`));

 // Groupe (700.8) : Clerc + Sorcier + créature à deux types
 await add('Cleric of the Forward Order','battlefield');await add('Prodigal Sorcerer','battlefield');
 T('party '+c.w.__js(`ev({party:1},compute(S).X,{controller:'p1'})`));
 // Cartes piochées ce tour-ci
 T('drawn '+c.w.__js(`(()=>{S.ts.drawn={p1:2};return ev({drawnTurn:1},compute(S).X,{controller:'p1'})})()`));

 // Maelstrom Pulse : la cible et chaque autre permanent du même nom, au moment de la résolution
 await add('Maelstrom Pulse','hand');
 T('mp '+c.w.__js(`(()=>{const B=S.perms.filter(p=>p.card.name==='Grizzly Bears');const card=Z('p1','hand').find(e=>e.card.name==='Maelstrom Pulse').card;const so={name:'Maelstrom Pulse',controller:'p1',srcUid:null,text:'t',units:[{targets:[B[0].uid]}]};S._resolving=so;const X=compute(S).X;const r=runActions(card.spell.actions,so,X,[B[0].uid],{},'k:mp');S._resolving=null;return r.join(' ')+' | ours restants '+S.perms.filter(p=>p.card.name==='Grizzly Bears').length})()`));
};
