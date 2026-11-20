module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 const PT=n=>S().perms.filter(p=>p.card.name===n).map(p=>W.__js(`(()=>{const o=compute(S).X.objs['${p.uid}'];return o.p+'/'+o.t+' '+o.controller})()`)).join(', ');
 // 1. Curse of the Bloody Tome : lancée sur l'adversaire, elle reste attachée au joueur
 for(let i=0;i<4;i++)await add('Island','library','p2');
 await add('Curse of the Bloody Tome','hand');zb('Curse of the Bloody Tome','zcast');await sleep(40);T('BT pick '+pk().slice(0,900));
 tg('Adversaire','0');await sleep(10);go();await sleep(40);res();await sleep(60);log(1);
 const ct=perm('Curse of the Bloody Tome');T('BT attachée à : '+(ct?ct.attachedTo:'absente'));
 W.__js(`S.active='p2';enterStep('upkeep');render();`);await sleep(40);T('pending '+S().pending.map(p=>p.srcName).join(','));c.flush();await sleep(60);res();await sleep(60);log(1);
 T('BT cimetière p2 : '+zone('p2','graveyard').join(','));
 // 2. Curse of Death's Hold : -1/-1 aux créatures du joueur enchanté seulement
 await add('Grizzly Bears','battlefield','p2');await add('Grizzly Bears','battlefield','p1');
 await add("Curse of Death's Hold",'hand');W.__js(`S.active='p1';enterStep('main1');render();`);await sleep(30);zb("Curse of Death's Hold",'zcast');await sleep(40);tg('Adversaire','0');await sleep(10);go();await sleep(40);res();await sleep(60);
 T('DH ours : '+PT('Grizzly Bears'));
 // 3. Curse of Opulence : quand le joueur enchanté est attaqué, l'attaquant crée un Trésor
 W.__js(`(()=>{const p=S.perms.find(x=>x.card.name==='Grizzly Bears'&&x.controller==='p1');p.sick=false;p.enteredTurn=-1;})()`);
 await add('Curse of Opulence','hand');zb('Curse of Opulence','zcast');await sleep(40);tg('Adversaire','0');await sleep(10);go();await sleep(40);res();await sleep(60);
 const tr0=S().perms.filter(p=>p.card.name==='Gold').length;
 const b=S().perms.find(x=>x.card.name==='Grizzly Bears'&&x.controller==='p1');
 W.__js(`(()=>{S.combat={attackers:{'${b.uid}':'p2'},blockers:{}};const X=compute(S).X;emit({type:'attackersDeclared',player:'p1',attackers:['${b.uid}']},X);render();})()`);await sleep(40);
 T('pending opulence '+S().pending.map(p=>p.srcName).join(','));c.flush();await sleep(60);res();await sleep(60);log(1);
 T('Trésors : '+tr0+' -> '+S().perms.filter(p=>p.card.name==='Gold').map(p=>p.controller).join(','));
 // 4. Opulence ne se déclenche pas si l'attaque vise un autre joueur (p1 enchanté ? non) : on attaque p1 avec une créature de p2
 const b2=S().perms.find(x=>x.card.name==='Grizzly Bears'&&x.controller==='p2');
 W.__js(`(()=>{S.combat={attackers:{'${b2.uid}':'p1'},blockers:{}};const X=compute(S).X;emit({type:'attackersDeclared',player:'p2',attackers:['${b2.uid}']},X);render();})()`);await sleep(40);
 T('pending si p1 attaqué : ['+S().pending.map(p=>p.srcName).join(',')+']');
};
