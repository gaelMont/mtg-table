// Pilotage réel des capacités déclenchées : on provoque l'événement dans le moteur (emit / destroyPerm / dealDmg…),
// on vérifie que la capacité se déclenche, puis on la met sur la pile et on la résout comme en partie.
window.__dynTrig=function(card){
 const out=[];
 const abil=(card.abilities||[]).map((a,i)=>[a,i]).filter(([a])=>a.kind==='triggered');
 for(const [a,i] of abil){
  const lab='déclenchée '+i;const on=a.on||{};const evn=on.event;
  const variants=[];
  const self=(on.who==='self');const selfC=self||!!on.self||!!(on.filter&&on.filter.self);
  const bearC=(n,c)=>({name:n,types:['Creature'],sub:['Bear'],super:[],colors:[c||'G'],p:2,t:2,cost:'{1}{G}',mv:2,abilities:[]});
  const spellC=(t,c)=>({name:'Sort test',types:[t],sub:[],super:[],colors:[c],cost:'{1}',mv:1,abilities:[],spell:{actions:[]}});
  const other=(pid)=>S.perms.find(p=>p.controller===pid&&p.card.name==='Ours '+pid);
  const meU=()=>window.__me&&window.__me.uid;
  // objet fabriqué pour satisfaire le filtre du déclencheur (sous-types, couleurs, mots-clés, contrôleur…)
  const synth=(f,dflt)=>{let a_=f&&f.any?f.any[0]:(f||{});if(typeof a_!=='object')a_={};if(a_.attachedToSrc||a_.equipped||a_.enchanted){const at=S.perms.find(p=>p.uid===meU())?.attachedTo;const ap=at&&S.perms.find(p=>p.uid===at);if(ap)return ap;}if(a_.isSelf)return S.perms.find(p=>p.uid===meU());const ty=a_.types||(a_.anyTypes?[a_.anyTypes[0]]:['Creature']);const c={name:'Synth '+(a_.subtypes||[ty[0]])[0],types:ty.includes('Creature')||ty.some(t=>['Artifact','Enchantment','Land','Planeswalker'].includes(t))?ty:['Creature',...ty],sub:a_.subtypes||(ty.includes('Creature')?['Bear']:[]),super:a_.supertypes||[],colors:a_.colors||(a_.multicolor?['W','U']:a_.notColors||a_.colorless?[]:['G']),isCommander:!!a_.commander,p:Math.max(a_.pGE||2,a_.pMin||0)+(a_.pGT?1:0),t:(a_.tGE||2),cost:'{2}',mv:a_.mvMin??a_.mv??2,abilities:(a_.withKw||[]).map(k=>({kind:'keyword',name:k})),token:!!a_.token};const pid=a_.controller==='opp'?'p2':a_.controller==='you'?'p1':dflt;const np=addPerm(c,pid,{enteredTurn:-5});if(a_.tapped)np.tapped=true;if(a_.hasCounters||a_.counters)np.counters['+1/+1']=1;return np;};
  const fw=(typeof on.who==='object'&&on.who)?on.who:(typeof on.srcWho==='object'&&on.srcWho)?on.srcWho:null;
  if(evn==='etb'){if(self)variants.push(()=>emit({type:'etb',uid:meU()},compute(S).X));else for(const pid of ['p1','p2'])variants.push(()=>{const np=fw?synth(fw,pid):addPerm(bearC('Nouveau '+pid),pid,{});emit({type:'etb',uid:np.uid},compute(S).X);});}
  else if(evn==='attacks'){const go=(u,def)=>{S.combat={attackers:{[u]:def},blockers:{},blocked:{},assign:{},band:{},enlisted:{}};S.phase='declareAttackers';emit({type:'attacks',uid:u,defender:def},compute(S).X);};if(self)variants.push(()=>go(meU(),'p2'));else{if(fw){variants.push(()=>{const np=synth(fw,'p1');go(np.uid,np.controller==='p1'?'p2':'p1');});}variants.push(()=>go(other('p1').uid,'p2'));variants.push(()=>go(other('p2').uid,'p1'));}}
  else if(evn==='dies'||evn==='leaves'||evn==='toGraveyard'){if(self)variants.push(()=>destroyPerm(meU(),compute(S).X,true));else{if(fw)for(const pid of ['p1','p2'])variants.push(()=>{const np=synth(fw,pid);destroyPerm(np.uid,compute(S).X,true);});for(const pid of ['p1','p2'])variants.push(()=>destroyPerm(other(pid).uid,compute(S).X,true));}}
  else if(evn==='damage'||evn==='damageOnce'||evn==='damagedOnce'){if(on.tgt==='self'){const X_=()=>compute(S).X;for(const cb of [true,false])variants.push(()=>{try{dmgBatch={};}catch(e){}const o=other('p2');dealDmg(srcOfObj(X_().objs[o.uid]),meU(),1,cb,X_());flushBatch(X_());});}const X=()=>compute(S).X;const hit=(srcU,tgt,combat)=>{try{dmgBatch={};}catch(e){}dealDmg(srcOfObj(X().objs[srcU]),tgt,2,combat,X());flushBatch(X());};
   if(self){for(const cb of [true,false]){variants.push(()=>hit(meU(),'P:p2',cb));variants.push(()=>hit(meU(),other('p2').uid,cb));variants.push(()=>hit(other('p2').uid,meU(),cb));}}
   else{for(const cb of [true,false])for(const [s_,t_] of [['p1','P:p2'],['p2','P:p1'],['p1','o2'],['p2','o1']])variants.push(()=>hit(fw?synth(fw,s_).uid:other(s_).uid,t_==='o2'?other('p2').uid:t_==='o1'?other('p1').uid:t_,cb));}}
  else if(evn==='cast'){if(on.filter)for(const pid of ['p1','p2'])variants.push(()=>{let a_=on.filter.any?on.filter.any[0]:on.filter;const c_={name:'Sort synthétique',types:a_.types||(a_.anyTypes?[a_.anyTypes[0]]:['Instant']),sub:a_.subtypes||[],super:a_.supertypes||[],colors:a_.colors||(a_.multicolor?['W','U']:a_.colorless?[]:['R']),cost:'{3}',mv:a_.mvMin??3,p:Math.max(2,a_.pMin||0),t:2,abilities:(a_.withKw||[]).map(k=>({kind:'keyword',name:k})),isCommander:!!a_.commander,spell:{actions:[]}};const fz=on.filter.castFrom&&on.filter.castFrom!=='hand'?(on.filter.castFrom==='notHand'?'graveyard':on.filter.castFrom):'hand';for(let i_=0;i_<(on.nth||1);i_++){((S.ts.castL??={})[pid]??=[]).push(c_);emit({type:'cast',player:pid,card:c_,stackUid:null,manaSpent:3,fromZone:fz},compute(S).X);}});for(const pid of ['p1','p2'])for(const [t,c] of [['Instant','R'],['Sorcery','B'],['Creature','G'],['Artifact','C'],['Enchantment','W']])variants.push(()=>emit({type:'cast',player:pid,card:t==='Creature'?bearC('Créature test','G'):spellC(t,c),stackUid:null,manaSpent:3,fromZone:'hand'},compute(S).X));}
  else if(evn==='step'){for(const pid of ['p1','p2'])variants.push(()=>{S.active=pid;emit({type:'step',step:on.step||'upkeep',player:pid},compute(S).X);});}
  else if(evn==='gainLife'){for(const pid of ['p1','p2'])variants.push(()=>gainP(pid,2));}
  else if(evn==='loseLife'){for(const pid of ['p1','p2'])variants.push(()=>lifeAdd(pid,-2));}
  else if(evn==='blockedBy'||evn==='becomesBlocked'||evn==='blocks'){variants.push(()=>{const at=self?meU():(fw?synth(fw,'p1').uid:other('p1').uid);const bl=other('p2').uid;S.combat={attackers:{[at]:'p2'},blockers:{[bl]:at},blocked:{[at]:true},assign:{},band:{},enlisted:{}};const X=compute(S).X;emit({type:'blocks',uid:bl,blocker:bl,attacker:at},X);emit({type:'blockedBy',uid:at,blocker:bl,attacker:at},X);emit({type:'becomesBlocked',uid:at,defender:'p2'},X);});
   if((self&&evn==='blocks')||on.blocker==='self')variants.push(()=>{const atk=other('p2').uid;S.combat={attackers:{[atk]:'p1'},blockers:{[meU()]:atk},blocked:{[atk]:true},assign:{},band:{},enlisted:{}};const X=compute(S).X;emit({type:'blocks',uid:meU(),blocker:meU(),attacker:atk},X);emit({type:'blockedBy',uid:atk,blocker:meU(),attacker:atk},X);emit({type:'becomesBlocked',uid:atk,defender:'p1'},X);});}
  else if(evn==='draw'){for(const pid of ['p1','p2'])variants.push(()=>{for(let i_=0;i_<2;i_++){(S.ts.drawn??={})[pid]=((S.ts.drawn||{})[pid]||0)+1;emit({type:'draw',player:pid},compute(S).X);}});}
  else if(evn==='attackersDeclared'){const go=(us,pl)=>{S.active=pl;S.combat={attackers:Object.fromEntries(us.map(u=>[u,pl==='p1'?'p2':'p1'])),blockers:{},blocked:{},assign:{},band:{},enlisted:{}};emit({type:'attackersDeclared',player:pl,attackers:us},compute(S).X);};variants.push(()=>go([meU(),other('p1').uid].filter(Boolean),'p1'));if(fw)variants.push(()=>go([synth(fw,'p1').uid,other('p1').uid],'p1'));variants.push(()=>go([other('p2').uid],'p2'));}
  else if(evn==='tapped'||evn==='untapped'){const T_=u=>{const p=S.perms.find(x=>x.uid===u);if(p)p.tapped=evn==='tapped';emit({type:evn,uid:u},compute(S).X);};if(self)variants.push(()=>T_(meU()));else{if(fw)for(const pid of ['p1','p2'])variants.push(()=>T_(synth(fw,pid).uid));for(const pid of ['p1','p2'])variants.push(()=>T_(other(pid).uid));}}
  else if(evn==='turnedFaceUp'){variants.push(()=>emit({type:'turnedFaceUp',uid:meU()},compute(S).X));if(fw)variants.push(()=>emit({type:'turnedFaceUp',uid:synth(fw,'p1').uid},compute(S).X));}
  else if(evn==='sacrificed'){const sc=u=>{const X=compute(S).X;const o=X.objs[u];emit({type:'sacrificed',uid:u,obj:o},X);removePerm(u,'gy',X);};if(self)variants.push(()=>sc(meU()));else{if(fw)for(const pid of ['p1','p2'])variants.push(()=>sc(synth(fw,pid).uid));for(const pid of ['p1','p2'])variants.push(()=>sc(other(pid).uid));}}
  else if(evn==='becomesTarget'){for(const by of ['p2','p1'])for(const spell of [true,false])variants.push(()=>emit({type:'becomesTarget',uid:self?meU():(fw?synth(fw,'p1').uid:other('p1').uid),by,so:null,soName:'Sort test',spell,stypes:spell?['Instant']:[],ssub:[]},compute(S).X));}
  else if(evn==='cycled'){for(const pid of ['p1','p2'])variants.push(()=>{if(on.self){selfTrig(card,pid,'cycled');}else emit({type:'cycled',player:pid,card:selfC?card:bearC('Cyclée')},compute(S).X);});}
  else if(evn==='discard'){for(const pid of ['p1','p2'])for(const c_ of [bearC('Défaussée'),{name:'Terrain défaussé',types:['Land'],sub:[],super:[],colors:[],mv:0,abilities:[]},{name:'Sort défaussé',types:['Instant'],sub:[],super:[],colors:['R'],mv:1,abilities:[]}])variants.push(()=>emit({type:'discard',player:pid,card:selfC?card:(fw||on.filter?{...c_,...(()=>{const a_=(on.filter||fw);const b_=a_.any?a_.any[0]:a_;return{types:b_.types||c_.types,abilities:(b_.withKw||[]).map(k=>({kind:'keyword',name:k}))};})()}:c_)},compute(S).X));}
  else if(evn==='countersAdded'){const ad=(u,kind,by)=>{const p=S.perms.find(x=>x.uid===u);if(p)p.counters[kind]=(p.counters[kind]||0)+1;emit({type:'countersAdded',uid:u,kind,n:1,by},compute(S).X);};for(const kind of [on.kind||'+1/+1','+1/+1','-1/-1'])for(const by of ['p1','p2'])variants.push(()=>ad(self?meU():(fw?synth(fw,'p1').uid:other('p1').uid),kind,by));}
  else if(evn==='landPlayed'){for(const pid of ['p1','p2'])variants.push(()=>emit({type:'landPlayed',player:pid},compute(S).X));}
  else {out.push(lab+' : événement « '+evn+' » non piloté');continue;}
  let fired=false,effect=false,errs=[],lastWhy='',lastRes='';
  for(const V of variants){
   try{window.__dynTest(card,{rich:1,only:['__aucune__']});}catch(e){errs.push('banc '+e.message);break;}
   window.__me=S.perms.find(p=>p.card===card||p.card.name===card.name);
   S.pending=[];S.stack=[];
   const zs=a.zones||[];if(window.__me&&zs.length&&!zs.includes('battlefield')){const X0=compute(S).X;removePerm(window.__me.uid,zs[0]==='graveyard'?'gy':zs[0],X0);S.pending=[];}
   try{V();}catch(e){errs.push('événement : '+e.message);continue;}
   const mine=S.pending.filter(t=>(window.__me&&t.srcUid===window.__me.uid)||String(t.srcName||'').startsWith(card.name));
   const mine2=mine.filter(t=>t.ab&&t.ab.text===a.text);
   if(!mine2.length){const lr=S.log.slice(-3).join(' ');const m_=lr.match(/ne se déclenche pas[^|]*/);if(m_)lastWhy=m_[0].slice(0,160);continue;}fired=true;
   S.pending=mine2.slice(0,1);
   {/* choisir des cibles comme le ferait un joueur (une cible « jusqu'à une » n'est pas laissée vide) */const t=S.pending[0];const X=compute(S).X;const pickT=(f,excl)=>{if(!f)return[];return candidates(f,X).map(o=>o.uid).filter(x=>legalAny(x,f,t.src,X).ok&&!(excl||[]).includes(x)&&!(f.tc&&tcWhy(f.tc,[x],excl||[],excl||[],X)));};
    if(t.ab.target){const L=pickT(t.ab.target);L.sort((x,y)=>((X.objs[y]?.controller==='p2'||y==='P:p2')?1:0)-((X.objs[x]?.controller==='p2'||x==='P:p2')?1:0));t.sel=L.slice(0,1);}
    if(t.ab.target2){t.sel2=pickT(t.ab.target2,t.sel).slice(0,1);}}
   const SKIP=new Set(['log','nextId','nextTs','_zb','_resolving','_benchStack','stack','pending','_unknownActs','resN','_lastRes']);const snap=()=>JSON.stringify(S,(k,v)=>SKIP.has(k)?undefined:v);const s0=snap();
   try{pushPending();let g=0;while(S.stack.length&&g++<10){pick=null;resolveTop();let gq=0;while(pick&&pick.mode==='choice'&&gq++<40){const q=pick.qs[pick.i];let v;if(q.opts){const k=Math.max(q.pickMin??1,q.opts.length?1:0);v=q.opts.slice(0,Math.min(q.pickN??1,k)).map(o=>o[0]);}else if(q.a)v=q.a[0]?.[0];else v=q.default??1;answer(v);}}}catch(e){errs.push('résolution : '+e.message);}
   const L=S.log.slice(-4).join(' ');if(/undefined|NaN|\[object Object\]/.test(L))errs.push('journal suspect : '+L.slice(0,200));
   lastRes=(S.log.filter(x=>/se résout|retirée de la pile/.test(x)).slice(-1)[0]||'').slice(0,300);
   if(snap()!==s0){effect=true;break;}
  }
  if(errs.length)out.push(lab+' : ERREUR '+errs[0]);
  else if(!fired)out.push(lab+' : ne se déclenche sur aucun des événements essayés ('+evn+')'+(lastWhy?' ; '+lastWhy:''));
  else if(!effect)out.push(lab+' : se déclenche mais aucun effet observé ## '+lastRes);
 }
 return out;
};
