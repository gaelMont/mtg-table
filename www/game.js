/* MTG Table : mode partie (2 à 4 joueurs, une seule personne contrôle toute la table).
   Le moteur du labo reste l'arbitre : ce fichier ajoute la création de partie, l'import
   de listes, le mulligan, la priorité tournante et un plateau pensé pour le téléphone.
   Les fenêtres de choix du moteur (vérification, paiement, cibles, déclencheurs, combat)
   sont déplacées telles quelles dans le panneau du bas. */
{
const GKEY='mtgTableG1',DKEY='mtgTableDecks1';
const G=window.G={on:false,view:'home',focus:null,prio:null,passes:0,detail:null,sheetMin:false,hide:false,shown:null,mull:null,skipDraw:null,lastStack:0,setup:null,msg:'',busy:''};
const $g=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PH=Object.fromEntries(PHASES);
function gsave(){try{const {on,view,focus,prio,passes,hide,mull,skipDraw,lastStack}=G;localStorage.setItem(GKEY,JSON.stringify({on,view,focus,prio,passes,hide,mull,skipDraw,lastStack}));}catch(e){}}
function gload(){try{const v=JSON.parse(localStorage.getItem(GKEY));if(v)Object.assign(G,v);}catch(e){}}
function decks(){try{return JSON.parse(localStorage.getItem(DKEY))||[];}catch(e){return[];}}
function saveDecks(L){try{localStorage.setItem(DKEY,JSON.stringify(L));}catch(e){G.msg="Impossible d'enregistrer les decks sur cet appareil.";}}

/* ---------- Lecture d'une liste de deck ---------- */
// Formats acceptés : Arena et Moxfield (« 1 Sol Ring (C21) 263 »), MTGO (« 1 Sol Ring », commandant
// après une ligne vide), Archidekt (« 1x Sol Ring (c21) 263 [Ramp] », catégorie [Commander]).
// Repris et étendu depuis le parseur de l'atelier proxy de MIMIC the print (numéros avec tiret, marqueurs).
function parseList(txt){
 const out={name:null,main:[],cmd:[],side:[]};let sec='main';const blocks=[[]];
 for(const raw of String(txt||'').split(/\r?\n/)){
  let l=raw.trim();
  if(!l){if(blocks[blocks.length-1].length)blocks.push([]);continue;}
  const h=l.replace(/^(\/\/|#)\s*/,'').replace(/:$/,'').trim().toLowerCase();
  if(/^(\/\/|#)/.test(l)||/^(commander|commanders|commandant|commandants|deck|main|mainboard|maindeck|sideboard|maybeboard|considering|companion|tokens|about)$/.test(h)){
   if(/command/.test(h))sec='cmd';else if(/side|maybe|consider|companion|token|about/.test(h))sec='side';else if(/deck|main/.test(h))sec='main';continue;}
  if(/^name\s+/i.test(l)){out.name=l.replace(/^name\s+/i,'').trim();continue;}
  const m=l.match(/^(\d+)\s*x?\s+(.+)$/i);let q=1,rest=l;if(m){q=+m[1];rest=m[2];}
  let cat='';rest=rest.replace(/\s*\[([^\]]*)\]/g,(_,c)=>{cat+=','+c;return'';});
  const flagCmd=/\*CMDR\*/i.test(rest);
  rest=rest.replace(/\s\^[^^]*\^/g,'').replace(/\s\*[A-Z]+\*/gi,'').replace(/\s+#\S+/g,'').trim();
  let set=null,num=null;const sm=rest.match(/^(.+?)\s+\(([A-Za-z0-9]{2,6})\)(?:\s+([A-Za-z0-9★\-]+))?$/);
  if(sm){rest=sm[1];set=sm[2].toLowerCase();num=sm[3]||null;}
  const isCmd=sec==='cmd'||flagCmd||/(^|,)\s*commander/i.test(cat);
  const isSide=!isCmd&&(sec==='side'||/(^|,)\s*(maybeboard|sideboard|considering)/i.test(cat));
  const row={q,n:rest.trim(),set,num};if(!row.n)continue;
  (isCmd?out.cmd:isSide?out.side:out.main).push(row);if(!isCmd&&!isSide)blocks[blocks.length-1].push(row);
 }
 // MTGO : sans section, le commandant est souvent le dernier bloc séparé par une ligne vide (1 ou 2 cartes)
 const bl=blocks.filter(b=>b.length);
 if(!out.cmd.length&&bl.length>1){const last=bl[bl.length-1];if(last.length<=2&&last.every(r=>r.q===1)){out.cmd=last.slice();out.main=out.main.filter(r=>!last.includes(r));out.cmdGuess=true;}}
 return out;
}
const norm=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’‘`]/g,"'").replace(/\s+/g,' ').trim().toLowerCase();
let NAMEMAP=null;
async function nameMap(){if(NAMEMAP)return NAMEMAP;const ix=await dbIndex();NAMEMAP=new Map();for(const r of ix){NAMEMAP.set(norm(r[0]),r);}try{for(const [a,real] of Object.entries(DBALIAS||{})){const r=NAMEMAP.get(norm(real));if(r&&!NAMEMAP.has(norm(a)))NAMEMAP.set(norm(a),r);}}catch(e){}return NAMEMAP;}
async function resolveName(n){const M=await nameMap();const tries=[n,n.split(/\s*\/\/\s*/)[0],n.split(/\s*\/\s*/)[0],n.replace(/^A-/,'')];for(const t of tries){const r=M.get(norm(t));if(r)return r;}return null;}
async function checkList(p){const bad=[],ok=[];for(const sec of ['cmd','main']){for(const row of p[sec]){const r=await resolveName(row.n);if(r)ok.push({...row,name:r[0],type:r[2],cov:r[3],sec});else bad.push(row.n);}}return{ok,bad};}

/* ---------- Import par lien (app Android : requête native, sans blocage CORS) ---------- */
async function nativeGet(url){
 const H=window.Capacitor?.Plugins?.CapacitorHttp;
 if(H){const r=await H.get({url,headers:{Accept:'application/json'}});if(r.status>=400)throw new Error('réponse '+r.status);return typeof r.data==='string'?JSON.parse(r.data):r.data;}
 const r=await fetch(url,{headers:{Accept:'application/json'}});if(!r.ok)throw new Error('réponse '+r.status);return r.json();
}
async function importLink(u){
 let m=u.match(/archidekt\.com\/(?:api\/)?decks\/(\d+)/i);
 if(m){const j=await nativeGet(`https://archidekt.com/api/decks/${m[1]}/`);const out=[];
  const excl=new Set((j.categories||[]).filter(c=>c&&c.includedInDeck===false).map(c=>c.name));
  for(const x of j.cards||[]){const c=x.card||{};const nm=c.oracleCard?.name||c.name||x.name;if(!nm)continue;const cats=x.categories||[];
   const set=c.edition?.editioncode||c.edition?.editionCode;const num=c.collectorNumber;
   const tag=cats.includes('Commander')?' [Commander]':cats.some(k=>excl.has(k))?' [Maybeboard]':'';
   out.push(`${x.quantity||1} ${nm}${set?` (${set})${num?' '+num:''}`:''}${tag}`);}
  if(!out.length)throw new Error("la réponse ne contient aucune carte");return{name:j.name||'Deck Archidekt',text:out.join('\n')};}
 m=u.match(/moxfield\.com\/decks\/([\w-]+)/i);
 if(m){const j=await nativeGet(`https://api2.moxfield.com/v3/decks/all/${m[1]}`);const out=[];
  const B=j.boards||{commanders:{cards:j.commanders||{}},mainboard:{cards:j.mainboard||{}}};
  for(const [bn,tag] of [['commanders',' [Commander]'],['companions',' [Maybeboard]'],['mainboard','']]){const cards=B[bn]?.cards||{};for(const k in cards){const e=cards[k];const c=e.card||{};const nm=c.name||k;out.push(`${e.quantity||1} ${nm}${c.set?` (${c.set})${c.cn?' '+c.cn:''}`:''}${tag}`);}}
  if(!out.length)throw new Error("la réponse ne contient aucune carte");return{name:j.name||'Deck Moxfield',text:out.join('\n')};}
 throw new Error("lien non reconnu (Archidekt ou Moxfield attendu)");
}

/* ---------- Images ---------- */
function img(c,size){if(!c||c.unknown)return'';const face=c.__back?'&face=back':'';if(c.imgSet&&c.imgNum)return`https://api.scryfall.com/cards/${encodeURIComponent(c.imgSet)}/${encodeURIComponent(c.imgNum)}?format=image&version=${size}${face}`;const nm=(c.imgName||c.name||'').split(' // ')[0];return`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(nm)}&format=image&version=${size}${face}`;}
const COLV={W:'#e9e1c4',U:'#2f6db5',B:'#2b2730',R:'#c2402f',G:'#2f7d4a'};
function frameBg(cols){const c=(cols||[]).filter(x=>COLV[x]);if(!c.length)return'#8d8f96';if(c.length===1)return COLV[c[0]];if(c.length===2)return`linear-gradient(135deg,${COLV[c[0]]},${COLV[c[1]]})`;return'#c9a640';}
function cardFace(c,o,cls,size){const nm=o?.name||c?.name||'?';const pt=o&&(o.types||[]).includes('Creature')?`<b class="pt">${o.p??0}/${o.t??0}</b>`:'';const loy=o?.counters?.loyalty;
 const u=img(c,size||'small');return`<div class="gc ${cls||''}" style="--fb:${frameBg(o?.colors||c?.colors)}"><div class="gc-txt"><span class="gc-n">${esc(nm)}</span><span class="gc-c">${esc(c?.cost||'')}</span><span class="gc-t">${esc((o?.types||c?.types||[]).join(' '))}</span></div>${u?`<img loading="lazy" alt="" src="${u}" onerror="this.remove()">`:''}${pt}</div>`;}

/* ---------- Partie ---------- */
const alive=()=>S.players.filter(p=>!p.out);
function nextAlive(pid){const L=S.players;const i=L.findIndex(p=>p.id===pid);for(let k=1;k<=L.length;k++){const q=L[(i+k)%L.length];if(!q.out)return q.id;}return pid;}
async function startGame(seats,fmt){
 G.busy='Chargement des cartes…';renderGame();
 const life=fmt==='duel'?20:40;const D=decks();
 S=fresh();S.players=seats.map((s,i)=>({id:'p'+(i+1),name:s.name||('Joueur '+(i+1)),life,zones:{hand:[],library:[],graveyard:[],exile:[],command:[]}}));
 S.vars.maxHand=7;S.format=fmt;
 for(let i=0;i<seats.length;i++){const pid='p'+(i+1);const dk=D.find(d=>d.id===seats[i].deck);if(!dk)continue;
  for(const row of dk.cards){const c=await dbCard(row.name);if(!c)continue;for(let k=0;k<row.q;k++){const e=putCard(pid,row.sec==='cmd'&&fmt!=='duel'?'command':'library',c,{noPrompt:true});e.card.imgSet=row.set||null;e.card.imgNum=row.num||null;if(row.sec==='cmd'&&fmt!=='duel')e.card.isCommander=true;}}
  if(fmt==='duel')for(const row of dk.cards.filter(r=>r.sec==='cmd'))logm(`${row.name} est ajouté à la bibliothèque (pas de zone de commandement en duel classique).`);
  shuffleLib(pid);}
 const st=S.players[Math.floor(Math.random()*S.players.length)].id;S.active=st;S.turn=1;S.phase='upkeep';
 logm(`Début de partie : ${pname(st)} est désigné au hasard pour commencer (103.1). Chaque joueur mélange (103.3)${fmt==='duel'?'':', les commandants sont dans la zone de commandement (903.6)'}, ${life} points de vie (${fmt==='duel'?'103.4':'903.7'}) et sept cartes en main (103.5).`);
 for(const p of S.players)Z(p.id,'hand').push(...Z(p.id,'library').splice(0,7));
 const order=apnap();G.mull={order,i:0,n:Object.fromEntries(order.map(x=>[x,0])),bottom:0,sel:[]};
 G.skipDraw=S.players.length===2?st:null;G.on=true;G.view='mull';G.focus=order[0];G.prio=st;G.passes=0;G.lastStack=0;G.detail=null;G.busy='';
 render();
}
function mullAct(a){const M=G.mull;const pid=M.order[M.i];
 if(a==='mull'){const H=Z(pid,'hand');Z(pid,'library').push(...H.splice(0));shuffleLib(pid);H.push(...Z(pid,'library').splice(0,7));M.n[pid]++;logm(`${pname(pid)} prend un mulligan (${M.n[pid]}) : il remélange sa main et pioche sept cartes (103.5).`);}
 if(a==='keep'){const free=S.players.length>2?1:0;const k=Math.max(0,M.n[pid]-free);if(k>0){M.bottom=k;M.sel=[];}else nextMull(`${pname(pid)} garde sa main.`);}
 if(a==='bottom'){const k=M.bottom;if(M.sel.length!==k)return;const H=Z(pid,'hand');const L=Z(pid,'library');const put=[];for(const id of M.sel){const i=H.findIndex(e=>e.id===id);if(i>=0){put.push(H[i].card.name);L.push(...H.splice(i,1));}}
  M.bottom=0;M.sel=[];nextMull(`${pname(pid)} garde sa main et met ${k} carte${k>1?'s':''} sous sa bibliothèque (103.5${S.players.length>2?', premier mulligan gratuit en multijoueur 103.5c':''}).`);}
 render();}
function nextMull(msg){logm(msg);const M=G.mull;M.i++;if(M.i<M.order.length){G.focus=M.order[M.i];return;}
 G.mull=null;G.view='table';logm(`Mulligans terminés. Les cartes à utiliser depuis la main de départ peuvent l'être maintenant (103.6). Tour 1 : ${pname(S.active)}${G.skipDraw?' ne piochera pas à ce tour (103.8a)':''}.`);
 G.focus=S.active;G.prio=S.active;enterStep('untap');G.prio=S.active;}

/* priorité (117) */
function blocker(){if(pick)return'Réponds d\'abord au choix en cours.';if(S.pending.length)return'Des capacités déclenchées attendent : mets-les sur la pile d\'abord (603.3b).';if(S.loop)return`Termine d'abord ${S.loop.src}.`;if(S.manaChoice)return'Termine le choix de mana en cours.';return'';}
function pass(){const b=blocker();if(b){toast=b;render();return;}G.passes++;if(G.passes>=alive().length){allPass();return;}G.prio=nextAlive(G.prio);G.focus=G.prio;G.shown=null;logm(`${pname(G.prio)} reçoit la priorité (117.3d).`);render();}
function allPass(){const b=blocker();if(b){toast=b;render();return;}G.passes=0;
 if(S.stack.length){resolveTop();G.lastStack=S.stack.length;}
 else{const ph=S.phase,t=S.turn;nextStep(false);if(S.phase===ph&&S.turn===t){render();return;}}
 G.prio=S.active;G.focus=S.active;G.shown=null;render();}
/* élimination (104.3, 800.4a) */
function eliminations(){if(!G.on||G.view!=='table')return;for(const p of S.players){if(p.out)continue;const why=[];if((p.life??40)<=0)why.push('0 point de vie ou moins (704.5a)');if((p.poison||0)>=10)why.push('10 marqueurs poison (704.5c)');if(p.drewEmpty)why.push('pioche dans une bibliothèque vide (704.5b)');for(const [k,v] of Object.entries(p.cmdDmg||{}))if(v>=21)why.push(`21 blessures de combat de ${k} (903.10a)`);if(p.conceded)why.push('abandon (104.3a)');
  if(!why.length)continue;if(!p.conceded&&cantLoseP(p.id)){if(p._clNote!==why.join()){p._clNote=why.join();logm(`${p.name} devrait perdre la partie (${why.join(' ; ')}), mais ${cantLoseP(p.id)} l'en empêche (104.3, 614.1).`);}continue;}p.out=true;const own=S.perms.filter(x=>x.owner===p.id).map(x=>x.uid);S.perms=S.perms.filter(x=>x.owner!==p.id);S.stack=S.stack.filter(x=>x.controller!==p.id);
  const ctl=S.perms.filter(x=>R.X.objs[x.uid]?.controller===p.id);for(const x of ctl){S.perms=S.perms.filter(y=>y!==x);Z(x.owner,'exile').push(newCard(x.card));}
  for(const x of S.perms)if(own.includes(x.attachedTo))delete x.attachedTo;
  logm(`${p.name} perd la partie : ${why.join(' ; ')}. Il quitte la partie avec tous les objets qu'il possède ; ce qu'il contrôlait d'autre est exilé (800.4a).`);
  if(G.prio===p.id)G.prio=nextAlive(p.id);if(G.focus===p.id)G.focus=G.prio;}
 if(alive().length===1&&!G.won&&!cantWinP(alive()[0].id)){G.won=alive()[0].id;logm(`${pname(G.won)} gagne la partie (104.2a).`);}}

/* ---------- Rendu ---------- */
function root(){let r=$g('#game');if(r)return r;r=document.createElement('div');r.id='game';r.innerHTML=`<div id="g-view"></div><div id="g-sheet"><div class="gs-head"><button class="gbtn sm" data-g="min">Réduire</button><span id="gs-title"></span><button class="gbtn sm" data-g="close">Fermer</button></div><div id="gs-detail"></div><div id="gs-lab"></div></div><div id="g-toast"></div>`;document.body.appendChild(r);
 const lab=$g('#gs-lab');for(const id of ['picker','pendZone','combatZone','sba','stackZone'])lab.appendChild(document.getElementById(id));$g('#g-toast').appendChild(document.getElementById('toast'));return r;}
function unroot(){const r=$g('#game');if(!r)return;const main=document.querySelector('main');const board=document.getElementById('t-board');main.insertBefore(document.getElementById('picker'),main.firstChild);const ref=board.firstChild;board.insertBefore(document.getElementById('toast'),ref);for(const id of ['pendZone','stackZone','combatZone','sba'])board.insertBefore(document.getElementById(id),document.getElementById('repord'));r.remove();}

function renderGame(){
 if(!G.on&&G.view!=='home'&&G.view!=='decks'&&G.view!=='setup')G.view='home';
 root();document.body.classList.add('g-on');eliminations();
 if(S.stack.length>G.lastStack)G.passes=0;G.lastStack=S.stack.length;
 const v=$g('#g-view');
 if(G.busy){v.innerHTML=`<div class="g-page"><p class="g-big">${esc(G.busy)}</p></div>`;sheet();return;}
 v.innerHTML=G.view==='home'?homeHTML():G.view==='decks'?decksHTML():G.view==='setup'?setupHTML():G.view==='mull'?mullHTML():tableHTML();
 sheet();gsave();
}
function sheet(){const sh=$g('#g-sheet');const labBusy=['picker','pendZone','combatZone','sba'].some(id=>document.getElementById(id).innerHTML.trim());const stackOpen=G.detail==='stack';
 document.getElementById('stackZone').style.display=stackOpen?'':'none';
 const det=$g('#gs-detail');det.innerHTML=G.detail&&G.detail!=='stack'?detailHTML():'';
 const open=G.on&&G.view==='table'&&(labBusy||G.detail);sh.classList.toggle('open',!!open);sh.classList.toggle('min',!!(open&&G.sheetMin&&!G.detail));
 $g('#gs-title').textContent=G.detail==='stack'?'La pile':G.detail?'':pick?'Vérification et choix':S.pending.length?'Capacités déclenchées':['attack','block','damage'].includes(S.phase)?'Combat':'';}

function homeHTML(){const D=decks();return`<div class="g-page"><h1 class="g-title">MTG Table</h1><p class="g-sub">De 2 à 4 joueurs, tu contrôles toute la table. Le moteur vérifie chaque action selon les règles complètes.</p>
 <div class="g-menu">${G.on?'<button class="gbtn pri big" data-g="resume">Reprendre la partie</button>':''}<button class="gbtn ${G.on?'':'pri'} big" data-g="setup">Nouvelle partie</button><button class="gbtn big" data-g="decks">Mes decks (${D.length})</button><button class="gbtn big" data-g="lab">Laboratoire des règles</button></div>
 ${G.msg?`<p class="g-msg">${esc(G.msg)}</p>`:''}<p class="g-note">Images des cartes : Scryfall. Données de règles : moteur local, hors ligne.</p></div>`;}
function decksHTML(){const D=decks();const e=G.edit||{};return`<div class="g-page"><div class="g-bar2"><button class="gbtn sm" data-g="home">← Menu</button><h2>Mes decks</h2></div>
 ${D.map(d=>`<div class="g-deck"><div><b>${esc(d.name)}</b><small>${d.cards.reduce((a,r)=>a+r.q,0)} cartes · commandant : ${esc(d.cards.filter(r=>r.sec==='cmd').map(r=>r.name).join(' + ')||'aucun')}</small></div><button class="gbtn sm" data-g="dedit" data-id="${d.id}">Modifier</button><button class="gbtn sm dang" data-g="ddel" data-id="${d.id}">Suppr.</button></div>`).join('')||'<p class="g-note">Aucun deck pour l\'instant.</p>'}
 <h3>${e.id?'Modifier le deck':'Ajouter un deck'}</h3>
 <label class="g-lab">Nom<input id="g-dname" value="${esc(e.name||'')}" placeholder="Smaug"></label>
 <label class="g-lab">Lien Archidekt ou Moxfield (facultatif)<div class="g-row"><input id="g-durl" value="${esc(e.url||'')}" placeholder="https://archidekt.com/decks/…"><button class="gbtn sm" data-g="dfetch">Importer</button></div></label>
 <label class="g-lab">Liste (texte exporté depuis Archidekt, Moxfield, Arena ou MTGO)<textarea id="g-dtext" rows="10" placeholder="Commander\n1 Smaug the Impenetrable (ltc) 2\n\nDeck\n1 Sol Ring (c21) 263\n…">${esc(e.text||'')}</textarea></label>
 <div class="g-row"><button class="gbtn pri" data-g="dcheck">Vérifier la liste</button>${e.id?'<button class="gbtn" data-g="dnew">Nouveau deck</button>':''}</div>
 <div id="g-dres">${G.check?checkResHTML():''}</div>${G.msg?`<p class="g-msg">${esc(G.msg)}</p>`:''}</div>`;}
function checkResHTML(){const c=G.check;const n=c.ok.reduce((a,r)=>a+r.q,0);const cmd=c.ok.filter(r=>r.sec==='cmd');const leg=c.ok.filter(r=>r.sec!=='cmd'&&/Legendary/.test(r.type)&&/Creature|Planeswalker/.test(r.type));
 const cov=[0,0,0];for(const r of c.ok)cov[r.cov]+=r.q;
 return`<div class="g-check"><p><b>${n}</b> cartes reconnues${c.bad.length?`, <b class="bad">${c.bad.length} introuvable${c.bad.length>1?'s':''}</b>`:''}. Automatisation : ${cov[2]} automatiques, ${cov[1]} manuelles, ${cov[0]} partielles.</p>
 ${c.bad.length?`<p class="bad">Introuvables : ${esc(c.bad.join(', '))}</p>`:''}
 <p>Commandant : ${cmd.length?esc(cmd.map(r=>r.name).join(' + '))+(c.guess?' (deviné : dernier bloc de la liste)':''):'<b class="bad">aucun détecté</b>'}</p>
 ${leg.length?`<details${cmd.length?'':' open'}><summary>Choisir un autre commandant</summary>${leg.map(r=>`<button class="gbtn sm" data-g="dcmd" data-n="${esc(r.name)}">${esc(r.name)}</button>`).join(' ')}</details>`:''}
 ${n!==100&&cmd.length?`<p class="g-note">Un deck Commander compte 100 cartes, commandant compris (903.5a) : celui-ci en a ${n}. Tu peux quand même l'enregistrer.</p>`:''}
 <button class="gbtn pri" data-g="dsave">Enregistrer le deck</button></div>`;}
function setupHTML(){const D=decks();const st=G.setup||(G.setup={n:4,fmt:'cmd',seats:[1,2,3,4].map(i=>({name:'Joueur '+i,deck:D[i-1]?.id||D[0]?.id||''}))});
 return`<div class="g-page"><div class="g-bar2"><button class="gbtn sm" data-g="home">← Menu</button><h2>Nouvelle partie</h2></div>
 ${D.length?'':'<p class="g-msg">Ajoute d\'abord un deck dans « Mes decks ».</p>'}
 <div class="g-seg">${[2,3,4].map(n=>`<button class="${st.n===n?'on':''}" data-g="sn" data-n="${n}">${n} joueurs</button>`).join('')}</div>
 <div class="g-seg">${[['cmd','Commander (40 PV)'],['duel','Duel classique (20 PV)']].map(([k,n])=>`<button class="${st.fmt===k?'on':''}" data-g="sf" data-f="${k}">${n}</button>`).join('')}</div>
 ${st.seats.slice(0,st.n).map((s,i)=>`<div class="g-seat"><input data-gs="name" data-i="${i}" value="${esc(s.name)}"><select data-gs="deck" data-i="${i}">${D.map(d=>`<option value="${d.id}" ${d.id===s.deck?'selected':''}>${esc(d.name)}</option>`).join('')}</select></div>`).join('')}
 <button class="gbtn pri big" data-g="start" ${D.length?'':'disabled'}>Mélanger et distribuer</button>
 ${G.on?'<p class="g-note">Une partie est en cours : elle sera remplacée.</p>':''}</div>`;}
function mullHTML(){const M=G.mull;const pid=M.order[M.i];const H=Z(pid,'hand');const free=S.players.length>2?1:0;const nb=Math.max(0,M.n[pid]+1-free);
 return`<div class="g-page"><h2>Main de départ : ${esc(pname(pid))}</h2><p class="g-sub">${M.n[pid]?`Mulligan ${M.n[pid]}. `:''}${M.bottom?`Choisis ${M.bottom} carte${M.bottom>1?'s':''} à mettre sous ta bibliothèque (${M.sel.length}/${M.bottom}).`:'Garde ta main ou prends un mulligan (mulligan de Londres, 103.5).'}</p>
 <div class="g-mhand">${H.map(e=>`<button class="g-mc ${M.sel.includes(e.id)?'sel':''}" data-g="${M.bottom?'msel':'zoomh'}" data-c="${e.id}">${cardFace(e.card,null,'',`normal`)}</button>`).join('')}</div>
 <div class="g-row">${M.bottom?`<button class="gbtn pri big" data-g="mbottom" ${M.sel.length===M.bottom?'':'disabled'}>Mettre en dessous</button>`:`<button class="gbtn pri big" data-g="mkeep">Garder</button><button class="gbtn big" data-g="mmull">Mulligan${nb?` (garder ${7-nb})`:' (gratuit)'}</button>`}</div>
 <p class="g-note">Joueur ${M.i+1} sur ${M.order.length}. Ordre : ${M.order.map(pname).map(esc).join(', ')}.</p></div>`;}

function permTile(p,small){const o=R.X.objs[p.uid];if(!o)return'';const atk=S.combat?.attackers?.[p.uid];const blk=S.combat?.blockers?.[p.uid];const cnt=Object.entries(p.counters||{}).filter(([k,v])=>v&&k!=='loyalty');
 const c=p.faceDown?{name:'Face cachée',unknown:1}:(p.transformed&&p.card.back?{...p.card.back,imgSet:p.card.imgSet,imgNum:p.card.imgNum,imgName:p.card.name,__back:1}:p.card);
 return`<button class="g-p ${p.tapped?'tap':''} ${atk?'atk':''} ${blk?'blk':''} ${small?'sm':''}" data-g="perm" data-u="${p.uid}">${cardFace(c,o,'',small?'small':'normal')}${cnt.length?`<span class="g-cnt">${cnt.map(([k,v])=>`${v} ${esc(k)}`).join(' · ')}</span>`:''}${o.counters?.loyalty!=null||p.counters.loyalty!=null?`<span class="g-loy">${p.counters.loyalty??0}</span>`:''}${p.damage?`<span class="g-dmg">${p.damage}</span>`:''}${p.attachedTo?'<span class="g-att">⛓</span>':''}${p.prepared?'<span class="g-prep">préparé</span>':''}</button>`;}
function groups(pid){const mine=S.perms.filter(p=>R.X.objs[p.uid]?.controller===pid&&!p.phasedOut).sort((a,b)=>a.ts-b.ts);const T=p=>R.X.objs[p.uid].types||[];
 return{cre:mine.filter(p=>T(p).includes('Creature')),land:mine.filter(p=>T(p).includes('Land')&&!T(p).includes('Creature')),oth:mine.filter(p=>!T(p).includes('Creature')&&!T(p).includes('Land'))};}
function tableHTML(){const F=G.focus||S.active;const pl=P_(F)||S.players[0];const g=groups(pl.id);const ap=S.active;
 const seats=S.players.map(p=>`<button class="g-seatchip ${p.id===F?'on':''} ${p.out?'out':''}" data-g="focus" data-p="${p.id}"><span class="g-sn">${p.id===ap?'▶ ':''}${esc(p.name)}</span><span class="g-life">${p.life??40}</span><span class="g-mini">✋${Z(p.id,'hand').length} 📚${Z(p.id,'library').length}${(()=>{try{const X=R.X;const ok=rulesOf(X,['mayLook']).some(({r,src})=>r.zone==='libraryTop'&&(r.own==='any'||(r.own==='you'?src.controller===p.id:src.controller!==p.id))&&(!r.condition||cond(r.condition,X,{src:src.uid,controller:src.controller})));const t=ok&&Z(p.id,'library')[0];return t?' 👁 '+escH(t.card.name):'';}catch(e){return'';}})()}${p.poison?' ☠'+p.poison:''}${p.speed?' 🏁'+p.speed:''}</span>${G.prio===p.id&&!p.out?'<span class="g-prio">priorité</span>':''}${playerKws(p.id).length?`<span class="g-pkw">${esc(playerKws(p.id).map(k=>/everything/i.test(k)?'protection totale':/hexproof/i.test(k)?'défense talismanique':/shroud/i.test(k)?'linceul':k).join(', '))}</span>`:''}</button>`).join('');
 const st=S.stack.slice().reverse();
 const others=S.players.filter(p=>p.id!==pl.id&&!p.out).map(p=>{const q=groups(p.id);const all=[...q.cre,...q.oth,...q.land];return`<div class="g-opp"><button class="g-oppn" data-g="focus" data-p="${p.id}">${esc(p.name)} · ${p.life??40} PV · ${all.length} permanent${all.length>1?'s':''}</button><div class="g-strip">${all.map(x=>permTile(x,true)).join('')||'<span class="g-note">rien</span>'}</div></div>`;}).join('');
 const cmdZ=Z(pl.id,'command');const H=Z(pl.id,'hand');const hidden=G.hide&&G.shown!==pl.id;
 const pool=poolText(pl.id);const canAct=G.prio===pl.id;const nxt=nextAlive(G.prio);
 const big=S.stack.length?'Tout le monde passe : résoudre':(S.phase==='cleanup'?'Tour suivant':'Tout le monde passe : étape suivante');
 return`<div class="g-table">
 <header class="g-top"><button class="gbtn sm" data-g="menu">☰</button><div class="g-ph"><b>Tour ${S.turn} · ${esc(PH[S.phase]||S.phase)}</b><small>${esc(pname(ap))} joue · priorité : ${esc(pname(G.prio))}${G.passes?` (${G.passes} passe${G.passes>1?'s':''})`:''}</small></div><button class="gbtn sm" data-g="log">Journal</button></header>
 <div class="g-seats">${seats}</div>
 ${G.won?`<div class="g-win">${esc(pname(G.won))} gagne la partie.</div>`:''}
 ${st.length?`<button class="g-stack" data-g="stack"><b>Pile (${st.length})</b>${st.slice(0,3).map((x,i)=>`<span class="${i?'':'top'}">${esc(x.name||x.srcName||x.label||'objet')} <small>${esc(pname(x.controller))}</small></span>`).join('')}</button>`:''}
 ${S.pending.length||pick?`<button class="g-alert" data-g="open">${pick?'Un choix t\'attend':'Capacités déclenchées à mettre sur la pile'} : ouvrir</button>`:''}
 <div class="g-scroll">${others}
 <div class="g-me"><div class="g-meh"><b>${esc(pl.name)}</b> <button class="g-lifebtn" data-g="player" data-p="${pl.id}">${pl.life??40} PV</button>${pool?`<span class="g-pool">Réserve : ${esc(pool)}</span>`:''}<button class="gbtn sm" data-g="player" data-p="${pl.id}">Zones</button></div>
 ${g.oth.length?`<div class="g-row2">${g.oth.map(p=>permTile(p)).join('')}</div>`:''}
 <div class="g-row2 cre">${g.cre.map(p=>permTile(p)).join('')||'<span class="g-note">Aucune créature</span>'}</div>
 <div class="g-row2 land">${g.land.map(p=>permTile(p,true)).join('')||'<span class="g-note">Aucun terrain</span>'}</div></div></div>
 <div class="g-hand">${cmdZ.map(e=>`<button class="g-h cmd" data-g="card" data-c="${e.id}">${cardFace(e.card,null,'','normal')}<span class="g-tag">commandement</span></button>`).join('')}${Z(pl.id,'exile').filter(e=>e.prepOf).map(e=>`<button class="g-h cmd" data-g="card" data-c="${e.id}">${cardFace(e.card,null,'','normal')}<span class="g-tag">sort préparé</span></button>`).join('')}${hidden?`<button class="gbtn" data-g="show">Afficher la main (${H.length})</button>`:H.map(e=>`<button class="g-h" data-g="card" data-c="${e.id}">${cardFace(e.card,null,'','normal')}</button>`).join('')}</div>
 <footer class="g-foot"><button class="gbtn" data-g="pass" ${G.won?'disabled':''}>Passer${alive().length>1?` → ${esc(pname(nxt))}`:''}</button><button class="gbtn pri" data-g="allpass" ${G.won?'disabled':''}>${big}</button></footer>
 ${canAct?'':`<p class="g-hint">Tu regardes ${esc(pl.name)} : c'est ${esc(pname(G.prio))} qui a la priorité.</p>`}</div>`;}

function detailHTML(){const d=G.detail;
 if(d.t==='perm'){const p=S.perms.find(x=>x.uid===d.u);if(!p)return'';const o=R.X.objs[p.uid];const ctl=o.controller;const MA=manaAbs(o);const pr=G.prio===ctl;
  return`<div class="g-det">${cardFace(p.card,o,'zoom','normal')}<div class="g-dinfo"><h3>${esc(o.name)}</h3><p>${esc([(o.super||[]).join(' '),(o.types||[]).join(' ')].join(' ').trim())}${(o.sub||[]).length?' - '+esc(o.sub.join(' ')):''}${(o.types||[]).includes('Creature')?` · <b>${o.p??0}/${o.t??0}</b>`:''}</p>
  ${p.prepared?`<p class="g-small"><b>Préparé</b> : la copie de ${esc(p.card.prepare?.name||'son sort')} attend en exil, lançable par son contrôleur (723.3c).</p>`:''}${p.card.prepare&&!p.prepared?`<p class="g-small">Sort préparé : ${esc(p.card.prepare.name)} (pas encore préparé).</p>`:''}
  <p class="g-small">Contrôleur : ${esc(pname(ctl))}${p.owner!==ctl?' · propriétaire : '+esc(pname(p.owner)):''}${p.tapped?' · engagé':''}${p.damage?` · ${p.damage} blessure(s)`:''}</p>
  <p class="g-oracle">${esc(p.card.oracle||'').replace(/\n/g,'<br>')}</p>
  ${MA.length?`<div class="g-acts">${MA.map(({a,i})=>`<button class="gbtn sm" data-act="manaab" data-u="${p.uid}" data-i="${i}" ${p.tapped&&/\{T\}/.test(a.text)?'disabled':''}>Mana : ${esc((a.text||'').split('.')[0].slice(0,50))}</button>`).join('')}</div>`:''}
  ${actsOf(p).length?`<div class="g-acts">${actsOf(p).map(({a,i})=>`<button class="gbtn sm pri" data-act="activate" data-u="${p.uid}" data-i="${i}" ${pr?'':'disabled'}>${esc(a.label)}</button>`).join('')}</div>${pr?'':`<p class="g-small">${esc(pname(ctl))} n'a pas la priorité : seul le joueur qui a la priorité peut activer une capacité (117.1b).</p>`}`:''}
  ${p.faceDown&&p.turnUp?`<button class="gbtn sm" data-act="turnup" data-u="${p.uid}">Retourner face visible</button>`:''}
  <div class="g-acts"><button class="gbtn sm" data-g="tapman" data-u="${p.uid}">${p.tapped?'Dégager':'Engager'} (manuel)</button><button class="gbtn sm" data-g="layers" data-u="${p.uid}">Voir les layers</button></div></div></div>`;}
 if(d.t==='card'){const l=locate(d.c);if(!l)return'';const c=l.e.card;const isL=(c.types||[]).includes('Land');const pr=G.prio===l.pid;const fb=(c.abilities||[]).some(a=>a.kind==='keyword'&&/^flashback/i.test(a.name||''));
  const can=l.z==='hand'||l.z==='command'||(l.z==='graveyard'&&fb)||(l.z==='exile'&&!!permission(c,l.e.id,'exile',l.pid));const oh=l.z==='hand'&&c.openingHand&&(S.turn||1)<=1&&!(S.ts?.spells&&Object.values(S.ts.spells).some(v=>v));
  return`<div class="g-det">${cardFace(c,null,'zoom','normal')}<div class="g-dinfo"><h3>${esc(c.name)} <small>${esc(c.cost||'')}</small></h3><p>${esc((c.types||[]).join(' '))}${(c.sub||[]).length?' - '+esc(c.sub.join(' ')):''}${c.p!=null?` · ${c.p}/${c.t}`:''}</p><p class="g-oracle">${esc(c.oracle||'').replace(/\n/g,'<br>')}</p>
  ${c.back?`<p class="g-small"><b>Verso : ${esc(c.back.name)}</b><br>${esc(c.back.oracle||'')}</p>`:''}
  <div class="g-acts">${can?(isL&&l.z==='hand'?`<button class="gbtn pri" data-act="zplay" data-c="${l.e.id}" ${pr?'':'disabled'}>Jouer le terrain</button>`:`<button class="gbtn pri" data-act="zcast" data-c="${l.e.id}" ${pr?'':'disabled'}>${l.z==='graveyard'?'Flashback':'Lancer'}</button>`):''}${oh?`<button class="gbtn" data-act="openhand" data-c="${l.e.id}">Depuis la main de départ (103.6)</button>`:''}</div>
  ${can&&!pr?`<p class="g-small">${esc(pname(l.pid))} n'a pas la priorité (117.1).</p>`:''}<p class="g-small">Automatisation : ${['partielle','manuelle','automatique'][c.cov??2]||''}</p></div></div>`;}
 if(d.t==='player'){const pl=P_(d.p);return`<div class="g-dinfo"><h3>${esc(pl.name)}</h3><div class="g-acts"><button class="gbtn" data-act="life" data-p="${pl.id}" data-d="-1">−1 PV</button><b class="g-big">${pl.life??40}</b><button class="gbtn" data-act="life" data-p="${pl.id}" data-d="1">+1 PV</button><button class="gbtn" data-act="life" data-p="${pl.id}" data-d="-5">−5</button><button class="gbtn" data-act="life" data-p="${pl.id}" data-d="5">+5</button></div>
  ${Object.entries(pl.cmdDmg||{}).filter(([,v])=>v).map(([k,v])=>`<p class="g-small">Blessures de ${esc(k)} : ${v}/21</p>`).join('')}
  <div class="g-zones">${zonesHTML(pl)}</div><button class="gbtn sm dang" data-g="concede" data-p="${pl.id}">${esc(pl.name)} abandonne</button></div>`;}
 if(d.t==='log')return`<div class="g-dinfo"><h3>Journal</h3><ol class="g-log">${S.log.slice().reverse().map(m=>`<li>${esc(m)}</li>`).join('')}</ol></div>`;
 if(d.t==='menu')return`<div class="g-dinfo"><h3>Menu</h3><div class="g-menu"><button class="gbtn" data-g="home">Menu principal</button><button class="gbtn" data-g="lab">Voir la partie dans le labo</button><button class="gbtn" data-act="endturn">Fin du tour (aller à l'étape de fin)</button><label class="g-lab2"><input type="checkbox" data-g="hide" ${G.hide?'checked':''}> Cacher la main quand la vue change de joueur</label></div></div>`;
 return'';}

/* ---------- Évènements ---------- */
document.addEventListener('click',ev=>{if(!G.on&&!$g('#game'))return;const b=ev.target.closest('[data-act]');if(b&&b.closest('#gs-detail')&&b.dataset.act!=='life')G.detail=null;},true);
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-g]');if(!b||!b.closest('#game'))return;const d=b.dataset;const a=d.g;
 switch(a){
 case'home':G.view='home';G.detail=null;G.msg='';break;
 case'resume':G.view=G.mull?'mull':'table';break;
 case'setup':G.view='setup';G.msg='';break;
 case'decks':G.view='decks';G.msg='';G.check=null;G.edit=null;break;
 case'lab':G.detail=null;leaveToLab();return;
 case'sn':G.setup.n=+d.n;break;
 case'sf':G.setup.fmt=d.f;break;
 case'start':{const st=G.setup;await startGame(st.seats.slice(0,st.n),st.fmt);return;}
 case'dnew':G.edit=null;G.check=null;break;
 case'dedit':{const dk=decks().find(x=>x.id===d.id);G.edit={...dk};G.check=null;break;}
 case'ddel':{saveDecks(decks().filter(x=>x.id!==d.id));break;}
 case'dfetch':{keepEdit();const u=G.edit.url;if(!u){G.msg='Colle d\'abord un lien.';break;}G.msg='Import en cours…';renderGame();try{const r=await importLink(u);G.edit.text=r.text;if(!G.edit.name)G.edit.name=r.name;G.msg=`Liste récupérée : ${r.text.split('\n').length} lignes. Vérifie-la puis enregistre.`;}catch(e){G.msg=`Import impossible (${e.message}). Utilise l'export texte du site et colle-le ici.`;}break;}
 case'dcheck':{keepEdit();const p=parseList(G.edit.text);if(!G.edit.name&&p.name)G.edit.name=p.name;G.msg='Vérification…';renderGame();const r=await checkList(p);G.check={...r,guess:!!p.cmdGuess};G.msg='';break;}
 case'dcmd':{const c=G.check;for(const r of c.ok)if(r.sec==='cmd')r.sec='main';const r=c.ok.find(x=>x.name===d.n);if(r)r.sec='cmd';c.guess=false;break;}
 case'dsave':{keepEdit();const c=G.check;const L=decks();const id=G.edit.id||('d'+Date.now());const dk={id,name:G.edit.name||(c.ok.find(r=>r.sec==='cmd')?.name)||'Deck',url:G.edit.url||'',text:G.edit.text,cards:c.ok.map(r=>({q:r.q,name:r.name,set:r.set,num:r.num,sec:r.sec}))};const i=L.findIndex(x=>x.id===id);if(i>=0)L[i]=dk;else L.push(dk);saveDecks(L);G.edit=null;G.check=null;G.msg=`Deck « ${dk.name} » enregistré.`;break;}
 case'mkeep':mullAct('keep');return;case'mmull':mullAct('mull');return;case'mbottom':mullAct('bottom');return;
 case'msel':{const M=G.mull;const i=M.sel.indexOf(d.c);if(i>=0)M.sel.splice(i,1);else if(M.sel.length<M.bottom)M.sel.push(d.c);break;}
 case'zoomh':break;
 case'focus':G.focus=d.p;G.detail=null;break;
 case'show':G.shown=G.focus;break;
 case'perm':G.detail={t:'perm',u:d.u};G.sheetMin=false;break;
 case'card':G.detail={t:'card',c:d.c};G.sheetMin=false;break;
 case'player':G.detail={t:'player',p:d.p};G.sheetMin=false;break;
 case'log':G.detail={t:'log'};break;
 case'menu':G.detail={t:'menu'};break;
 case'stack':G.detail='stack';G.sheetMin=false;break;
 case'open':G.detail=null;G.sheetMin=false;break;
 case'close':G.detail=null;G.sheetMin=true;break;
 case'min':G.sheetMin=!G.sheetMin;G.detail=null;break;
 case'pass':pass();return;
 case'allpass':allPass();return;
 case'tapman':{const p=S.perms.find(x=>x.uid===d.u);if(p){p.tapped=!p.tapped;logm(`Manuel : ${p.card.name} ${p.tapped?'engagé':'dégagé'}.`);}break;}
 case'layers':{G.detail=null;leaveToLab();LFOCUS=d.u;tab('layers');render();return;}
 case'hide':G.hide=b.checked;break;
 case'concede':{const p=P_(d.p);p.conceded=true;G.detail=null;break;}
 }
 render();});
document.addEventListener('change',ev=>{const t=ev.target;if(!t.dataset.gs)return;const s=G.setup.seats[+t.dataset.i];s[t.dataset.gs]=t.value;gsave();});
function keepEdit(){G.edit=G.edit||{};const v=id=>document.getElementById(id)?.value;G.edit.name=v('g-dname')??G.edit.name;G.edit.url=v('g-durl')??G.edit.url;G.edit.text=v('g-dtext')??G.edit.text;}
function leaveToLab(){unroot();document.body.classList.remove('g-on');G.inLab=true;gsave();if(!$g('#g-back')){const bk=document.createElement('button');bk.id='g-back';bk.className='gbtn pri';bk.textContent='← Retour à la table';bk.onclick=()=>{bk.remove();G.inLab=false;render();};document.body.appendChild(bk);}render();}

/* ---------- Branchement sur le moteur ---------- */
const _render=render;render=function(){_render();if(!G.inLab)renderGame();};
const _drawP=drawP;drawP=function(id,n){if(G.on&&G.skipDraw&&S.turn===1&&S.phase==='draw'&&id===G.skipDraw&&id===S.active){G.skipDraw=null;logm(`${pname(id)} commence en duel : il ne pioche pas à son premier tour (103.8a).`);return 0;}return _drawP(id,n);};
const _newTurn=newTurn;newTurn=function(){let k=0;do{_newTurn();}while(G.on&&P_(S.active)?.out&&k++<8);G.prio=S.active;G.focus=S.active;G.passes=0;};

window.__eng={get S(){return S},get pick(){return pick},Z,render:()=>render(),locate};
gload();try{const cfg=window.Capacitor;if(cfg?.Plugins?.StatusBar)cfg.Plugins.StatusBar.setOverlaysWebView?.({overlay:false});}catch(e){}
if(G.on&&(!S||!S.players||!S.players.some(p=>Z(p.id,'library').length+Z(p.id,'hand').length>0)))G.on=false;
if(G.view==='table'&&!G.on)G.view='home';
render();
}
