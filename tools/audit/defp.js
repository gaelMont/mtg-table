module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 await add("Orim's Prayer",'battlefield');await add('Grizzly Bears','battlefield','p2');await add('Llanowar Elves','battlefield');
 const b2=S().perms.find(x=>x.card.name==='Grizzly Bears').uid, e1=S().perms.find(x=>x.card.name==='Llanowar Elves').uid;
 const atk=(u,d,pl)=>W.__js(`(()=>{S.combat={attackers:{'${u}':'${d}'},blockers:{}};const X=compute(S).X;emit({type:'attackersDeclared',player:'${pl}',attackers:['${u}']},X);render();})()`);
 atk(b2,'p1','p2');await sleep(30);T('p2 attaque p1 : ['+S().pending.map(p=>p.srcName).join(',')+']');W.__js(`S.pending=[];render();`);
 atk(e1,'p2','p1');await sleep(30);T('p1 attaque p2 : ['+S().pending.map(p=>p.srcName).join(',')+']');W.__js(`S.pending=[];render();`);
};
