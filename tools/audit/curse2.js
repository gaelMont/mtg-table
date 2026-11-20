module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 const cast=async(n,who)=>{await add(n,'hand');zb(n,'zcast');await sleep(40);tg(who,'0');await sleep(10);go();await sleep(40);res();await sleep(60);W.__js(`pick=null;render();`);};
 // 1. Grievous Wound attachée à p2 : p2 ne peut pas gagner de vie
 await cast('Grievous Wound','Adversaire');await sleep(20);
 W.__js(`lifeAdd('p2',3);lifeAdd('p1',3);render();`);await sleep(20);log(2);
 T('vies '+W.__js(`JSON.stringify(S.players.map(p=>[p.id,p.life]))`));
 // 2. Curse of Exhaustion sur p1 : un seul sort par tour
 await cast('Curse of Exhaustion','Toi');W.__js(`S.ts.spells={};`);await sleep(20);
 await add('Opt','hand');await add('Divination','hand');zb('Opt','zcast');await sleep(40);T('Opt 1er '+(pk().includes('empêche')?'bloqué':'ok'));go();await sleep(40);res();await sleep(60);
 W.__js(`S.pending=[];pick=null;render();`);await sleep(20);
 zb('Divination','zcast');await sleep(40);const t2=pk();T('Divination 2e : '+(t2.match(/[^.]*empêche[^.]*/)||['pas bloqué'])[0].slice(0,160));
 // 3. Curse of Hospitality : les créatures qui attaquent le joueur enchanté ont le piétinement
 W.__js(`pick=null;render();`);await cast('Curse of Hospitality','Adversaire');await add('Grizzly Bears','battlefield');await sleep(20);
 const b=S().perms.find(x=>x.card.name==='Grizzly Bears').uid;
 const kw=()=>W.__js(`(()=>{const o=compute(S).X.objs['${b}'];return o.abilities.filter(a=>a.kind==='keyword').map(a=>a.name).join(',')||'aucun'})()`);
 T('ours sans attaque : '+kw());W.__js(`S.combat={attackers:{'${b}':'p2'},blockers:{}};render();`);T('ours attaque p2 : '+kw());
 W.__js(`S.combat={attackers:{'${b}':'p1'},blockers:{}};render();`);T('ours attaque p1 : '+kw());
};
