window.__dynTest=function(card,opt){opt=opt||{};
 const err=[],warn=[];
 const mk=(name,types,o={})=>({name,types,sub:o.sub||[],super:o.super||[],colors:o.colors||[],p:o.p,t:o.t,cost:o.cost||'{2}',mv:o.mv??2,abilities:o.abilities||[]});
 const bear=(n,c)=>mk(n,['Creature'],{sub:['Bear'],colors:[c||'G'],p:2,t:2,cost:'{1}{G}',mv:2});
 S={...fresh(),players:[{id:'p1',name:'Toi',life:40,zones:{hand:[],library:freshLib(),graveyard:[],exile:[]}},{id:'p2',name:'Adversaire',life:40,zones:{hand:[],library:freshLib(),graveyard:[],exile:[]}}]};
 S.log=[];S._unknownActs=[];
 try{
  for(const pid of ['p1','p2']){addPerm(bear('Ours '+pid),pid,{enteredTurn:-5});addPerm(mk('Golem '+pid,['Artifact','Creature'],{p:3,t:3,cost:'{3}',mv:3}),pid,{enteredTurn:-5});addPerm(mk('Forest',['Land'],{sub:['Forest'],super:['Basic'],cost:'',mv:0,abilities:[{kind:'mana',text:'{T}: Add {G}.'}]}),pid,{enteredTurn:-5});addPerm(mk('Anneau '+pid,['Artifact'],{cost:'{1}',mv:1}),pid,{enteredTurn:-5});addPerm(mk('Aura '+pid,['Enchantment'],{cost:'{1}{W}',mv:2}),pid,{enteredTurn:-5});
   putCard(pid,'graveyard',bear('Cadavre '+pid,'B'));putCard(pid,'graveyard',mk('Éclair '+pid,['Instant'],{colors:['R'],cost:'{R}',mv:1}));putCard(pid,'hand',bear('Main '+pid));putCard(pid,'hand',mk('Sort '+pid,['Sorcery'],{colors:['U'],cost:'{U}',mv:1}));putCard(pid,'exile',bear('Exilé '+pid));}
  for(const pid of ['p1','p2'])for(const c of ['W','U','B','R','G','C'])poolAdd(pid,c,'',3);
  addPerm(mk('Terrain rare',['Land'],{cost:'',mv:0}),'p2',{enteredTurn:-5});
  if(opt.rich){/* banc enrichi : couleurs, sous-types, marqueurs, engagé/dégagé, attachements, bibliothèques réelles */
   const lib=(pid)=>[mk('Plaine bib',['Land'],{sub:['Plains'],super:['Basic'],cost:'',mv:0}),bear('Ours bib '+pid),mk('Éclair bib',['Instant'],{colors:['R'],cost:'{R}',mv:1}),mk('Île bib',['Land'],{sub:['Island'],super:['Basic'],cost:'',mv:0}),mk('Dragon bib',['Creature'],{sub:['Dragon'],colors:['R'],p:5,t:5,cost:'{5}',mv:6}),mk('Relique bib',['Artifact'],{cost:'{2}',mv:2}),mk('Rite bib',['Sorcery'],{colors:['B'],cost:'{B}',mv:1})];
   for(const pid of ['p1','p2']){
    const P=S.players.find(p=>p.id===pid);P.zones.library=[...Array.from({length:4},()=>lib(pid)).flat().map((c,i)=>({id:'L'+pid+i+Math.random().toString(36).slice(2,6),card:{...c}})),...P.zones.library.slice(0,6)];
    const hu=addPerm(mk('Humain '+pid,['Creature'],{sub:['Human','Soldier'],colors:['W'],p:1,t:1,cost:'{W}',mv:1}),pid,{enteredTurn:-5});hu.counters['+1/+1']=1;
    addPerm(mk('Esprit '+pid,['Creature'],{sub:['Spirit','Wizard'],colors:['U'],p:2,t:1,cost:'{1}{U}',mv:2,abilities:[{kind:'keyword',name:'Flying'}]}),pid,{enteredTurn:-5});
    const zo=addPerm(mk('Zombie '+pid,['Creature'],{sub:['Zombie'],colors:['B'],super:['Legendary'],p:2,t:2,cost:'{1}{B}',mv:2}),pid,{enteredTurn:-5});zo.counters['-1/-1']=1;
    const gb=addPerm(mk('Gobelin '+pid,['Creature'],{sub:['Goblin','Warrior'],colors:['R'],p:1,t:1,cost:'{R}',mv:1}),pid,{enteredTurn:-5});gb.tapped=true;
    addPerm(mk('Elfe '+pid,['Creature'],{sub:['Elf','Druid'],colors:['G'],p:1,t:1,cost:'{G}',mv:1}),pid,{enteredTurn:-5});
    addPerm(mk('Dragon '+pid,['Creature'],{sub:['Dragon'],colors:['R','B'],super:['Legendary'],p:5,t:5,cost:'{3}{R}{B}',mv:5,abilities:[{kind:'keyword',name:'Flying'}]}),pid,{enteredTurn:-5});
    for(const [n,sb] of [['Plaine','Plains'],['Île','Island'],['Marais','Swamp'],['Montagne','Mountain']]){const l=addPerm(mk(n+' '+pid,['Land'],{sub:[sb],super:['Basic'],cost:'',mv:0}),pid,{enteredTurn:-5});if(n==='Marais')l.tapped=true;}
    const eq=addPerm(mk('Épée '+pid,['Artifact'],{sub:['Equipment'],cost:'{2}',mv:2}),pid,{enteredTurn:-5});eq.attachedTo=hu.uid;
    const an=S.perms.find(p=>p.card.name==='Anneau '+pid);if(an)an.counters.charge=2;
    putCard(pid,'graveyard',mk('Esprit mort '+pid,['Creature'],{sub:['Spirit'],colors:['W'],p:1,t:1,cost:'{W}',mv:1}));putCard(pid,'graveyard',mk('Héros mort '+pid,['Creature'],{sub:['Human'],super:['Legendary'],colors:['G'],p:3,t:3,cost:'{2}{G}',mv:3}));
    putCard(pid,'hand',mk('Plaine main '+pid,['Land'],{sub:['Plains'],super:['Basic'],cost:'',mv:0}));putCard(pid,'hand',mk('Éclair main '+pid,['Instant'],{colors:['R'],cost:'{R}',mv:1}));
   }
   const au=S.perms.find(p=>p.card.name==='Aura p1');if(au){au.card.sub=['Aura'];au.attachedTo=S.perms.find(p=>p.card.name==='Ours p2').uid;}
   S.players[0].life=20;
  }
  const fly=addPerm(mk('Oiseau p2',['Creature'],{sub:['Bird'],colors:['U'],p:1,t:1,abilities:[{kind:'keyword',name:'Flying'}]}),'p2',{enteredTurn:-5});
  const tok=addPerm({...bear('Jeton p2'),token:true},'p2',{enteredTurn:-5});
  const pw=addPerm(mk('Arpenteur p2',['Planeswalker'],{sub:['Jace'],colors:['U'],cost:'{3}',mv:3}),'p2',{enteredTurn:-5});pw.counters.loyalty=4;
  for(const [n,ty] of [['Terre morte',['Land']],['Babiole morte',['Artifact']],['Charme mort',['Enchantment']]]){putCard('p1','graveyard',mk(n+' p1',ty));putCard('p2','graveyard',mk(n+' p2',ty));}
  const atk=S.perms.find(p=>p.card.name==='Ours p2');const blk=S.perms.find(p=>p.card.name==='Ours p1');const atk2=S.perms.find(p=>p.card.name==='Golem p2');
  S.combat={attackers:{[atk.uid]:'p1',[atk2.uid]:'p1'},blockers:{[blk.uid]:atk.uid},blocked:{[atk.uid]:true},assign:{},band:{},enlisted:{}};atk.tapped=true;atk2.tapped=true;
  (S.ts.dmgU??={})[S.perms.find(p=>p.card.name==='Golem p1').uid]=true;
  S._benchStack=[{uid:'sp2a',kind:'spell',name:'Sort adverse',card:mk('Sort adverse',['Instant'],{colors:['R'],cost:'{R}',mv:1}),controller:'p2',owner:'p2',units:[{targets:[],actions:[]}],src:{controller:'p2',colors:['R'],types:['Instant'],name:'Sort adverse'},perm:false},{uid:'sp2b',kind:'spell',name:'Créature adverse',card:mk('Créature adverse',['Creature'],{colors:['G'],cost:'{3}{G}',mv:4,p:4,t:4}),controller:'p2',owner:'p2',units:[{targets:[],actions:[]}],src:{controller:'p2',colors:['G'],types:['Creature'],name:'Créature adverse'},perm:true}];
 }catch(e){err.push('MISE EN PLACE '+e.message);return{err,warn};}
 const isPermType=(card.types||[]).some(t=>['Creature','Artifact','Enchantment','Land','Planeswalker','Battle'].includes(t));
 let me=null;
 try{if(isPermType){me=addPerm(card,'p1',{enteredTurn:-5});if(card.loyalty!=null)me.counters.loyalty=card.loyalty;if(opt.rich){const sb=card.sub||[];const ally=S.perms.find(p=>p.controller==='p1'&&p.card.name==='Elfe p1');const foe=S.perms.find(p=>p.controller==='p2'&&p.card.name==='Elfe p2');if(sb.includes('Aura'))me.attachedTo=(JSON.stringify(card).includes('"controller": "opp"')||/can't|doesn't untap|tap enchanted/i.test(JSON.stringify(card))?foe:ally)?.uid;else if(sb.includes('Equipment'))me.attachedTo=ally?.uid;}}compute(S);}catch(e){err.push('PERMANENT/STATIQUES '+e.message+' '+(e.stack||'').split('\n')[1]);}
 const units=[];
 const addU=(label,def,kind)=>{if(def)units.push({label,def,kind});};
 if(card.spell){if(card.spell.modes)card.spell.modes.forEach((m,i)=>addU('mode '+i,m,'spell'));else addU('sort',{...card.spell,actions:card.spell.actions},'spell');}
 (card.activations||[]).forEach((a,i)=>addU('activation '+i,a,'ability'));
 (card.abilities||[]).forEach((a,i)=>{if(a.kind==='triggered'){if(a.modes)a.modes.forEach((m,j)=>addU('déclenchée '+i+' mode '+j,m,'trigger'));else addU('déclenchée '+i,{duration:a.duration,target:a.target,target2:a.target2,maxTargets:a.maxTargets,minTargets:a.minTargets,maxTargets2:a.maxTargets2,minTargets2:a.minTargets2,parts:a.parts,actions:a.do||[],affects:a.affects||(a.parts&&!a.target?{self:1}:null),divided:a.divided},'trigger');}});
 (card.zoneActs||[]).forEach((a,i)=>addU('zone '+i,a,'ability'));
 for(const U of units){if(opt.only&&!opt.only.includes(U.label))continue;
  const before=S.log.length;
  try{
   S.stack=[...clone(S._benchStack||[])];const X=compute(S).X;const u=unitOf(U.def,U.label);
   const src=me?srcOfObj(X.objs[me.uid]||{controller:'p1',colors:[],types:[],name:card.name,uid:me.uid,abilities:[]}):srcOfCard(card,'p1');
   const pick1=(f,n0,mn,excl)=>{if(!f)return[];let c=candidates(f,X).map(o=>o.uid).filter(x=>legalAny(x,f,src,X).ok&&!(excl||[]).includes(x));const sc=x=>((X.objs[x]?.controller==='p2'||x==='P:p2')?-2:0)+(opt.rich&&S.perms.find(p=>p.uid===x)?.tapped?1:0)+(opt.rich&&S.combat?.attackers?.[x]?1:0);c.sort((a,b)=>sc(a)-sc(b));const k=Math.max(mn||0,1);return c.slice(0,Math.min(n0||1,k));};
   u.targets=u.tfilter?pick1(u.tfilter,u.maxT,u.minT):[];
   if(u.tfilter2)u.targets2=pick1(u.tfilter2,u.maxT2||1,u.minT2||1,u.targets);
   if(u.tfilter&&!u.targets.length&&u.minT>0){warn.push(U.label+' : aucune cible légale dans le banc');continue;}
   const so={remembered:[],uid:'s'+(S.nextId++),kind:U.kind==='spell'?'trigger':'trigger',name:card.name+' : '+U.label,text:U.def.label||U.label,card:U.kind==='spell'?card:null,controller:'p1',src,srcUid:me?me.uid:null,perm:false,units:[u],params:{X:2,...(me?.params||{})},ev:{type:'etb',uid:(X.objs[Object.keys(X.objs).find(k=>X.objs[k].controller==='p2')]||{}).uid,player:'p2',target:'P:p2',stackUid:null},may:false};
   if(opt.rich){/* la carte elle-même dans la zone attendue : capacités de zone et déclencheurs qui la déplacent depuis le cimetière */
    if(U.label.startsWith('zone ')){const zn=U.def.zone||'graveyard';const e=putCard('p1',zn==='gy'?'graveyard':zn,{...card});const id=(Z('p1',zn==='gy'?'graveyard':zn).find(x=>x.card.name===card.name&&!x._dynUsed)||{}).id;if(id){so.zoneSrc=id;so.fromCard=id;}}
    else if(U.kind==='trigger'&&/moveEvent|moveSelf/.test(JSON.stringify(U.def.actions||[]))){putCard('p1','graveyard',{...card});so.ev={...so.ev,uid:null,obj:{name:card.name,owner:'p1',controller:'p1'},cardName:card.name};}
   }
   S.stack=[...clone(S._benchStack||[]),so];S.pending=[];
   const SKIP=new Set(['log','nextId','nextTs','_zb','_resolving','_benchStack','stack','_unknownActs','resN','_lastRes']);const snap=()=>JSON.stringify(S,(k,v)=>SKIP.has(k)?undefined:v)+JSON.stringify(S.stack.filter(x=>x.uid!==so.uid));const s0=snap();
   let guard=0;pick=null;resolveTop();
   while(pick&&pick.mode==='choice'&&guard++<40){const q=pick.qs[pick.i];let v;if(q.opts){const k=Math.max(q.pickMin??1,q.opts.length?1:0);const O=opt.last?[...q.opts].reverse():q.opts;v=O.slice(0,Math.min(q.pickN??1,k)).map(o=>o[0]);}else if(q.a){v=(opt.last?q.a[q.a.length-1]:q.a[0])?.[0];}else if(q.kind==='number'||q.num){v=1;}else v=q.default??1;answer(v);}
   if(guard>=40)err.push(U.label+' : boucle de questions');
   if(S.loop){try{loopEnd&&loopEnd('');}catch(e){}S.loop=null;}
   if(opt.dbg){const a0=JSON.parse(s0.slice(0,s0.lastIndexOf('][')+1>0?s0.length:0)||'{}');}
   if(opt.dbg&&snap()!==s0){const A_=s0,B_=snap();let i=0;while(i<A_.length&&A_[i]===B_[i])i++;warn.push('DIFF@'+A_.slice(Math.max(0,i-120),i+60)+' ### '+B_.slice(Math.max(0,i-20),i+60));}
   if(snap()===s0&&((U.def.actions||[]).length||(U.def.parts||[]).length))warn.push(U.label+' : aucun effet observé');
  }catch(e){err.push(U.label+' : EXCEPTION '+(e&&e.message)+' '+String(e&&e.stack||'').split('\n').slice(1,3).join(' '));}
  const L=S.log.slice(before).join(' || ');
  if(/undefined|NaN|\[object Object\]/.test(L))err.push(U.label+' : journal suspect : '+L.slice(0,300));
  if(/Action non reconnue/.test(L))err.push(U.label+' : '+L.match(/Action non reconnue[^.]*/)[0]);
  if(/À appliquer à la main/.test(L))err.push(U.label+' : action manuelle');
  if(/se résout\.\s+La capacité cesse/.test(L)&&((U.def.actions||[]).length))warn.push(U.label+' : résolution muette');
  S.stack=[];pick=null;
 }
 return{err,warn};
};
