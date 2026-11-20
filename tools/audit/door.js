module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 await add('Door to Nothingness','battlefield');W.__js(`(()=>{const p=S.perms.find(p=>p.card.name==='Door to Nothingness');p.sick=false;p.enteredTurn=-5;})()`);
 act('Door to Nothingness',0);await sleep(40);tg('Adversaire','0');await sleep(10);go();await sleep(40);res();await sleep(60);log(1);
 T('joueurs '+W.__js(`JSON.stringify(S.players.map(p=>[p.id,p.lost,p.life]))`));
 await add('Orcish Spy','battlefield');for(let i=0;i<3;i++)await add('Island','library','p2');W.__js(`(()=>{const p=S.perms.find(p=>p.card.name==='Orcish Spy');p.sick=false;p.enteredTurn=-5;})()`);
 act('Orcish Spy',0);await sleep(40);tg('Adversaire','0');await sleep(10);go();await sleep(40);res();await sleep(60);log(1);
};
