#!/usr/bin/env python3
"""Suivi de l'automatisation du simulateur, une entrée par carte imprimée.
Usage : python3 tools/coverage.py <forge/res> <sim/db> <date limite AAAA-MM-JJ> <sortie.json> [extrait MTGJSON]
(extrait MTGJSON : python3 tools/mtgjson_extract.py AllPrintings.json mj.json)
Chaque entrée = une impression (édition + numéro de collection), avec le statut de la carte
dans le moteur et ce qui manque encore pour l'automatiser."""
import glob,re,json,sys,collections
RES,DB,CUT,OUT=sys.argv[1:5]
MJ=sys.argv[5] if len(sys.argv)>5 else None
STAT={'full':'automatisee','partial':'partielle','manual':'manuelle'}
RAR={'C':'commune','U':'peu commune','R':'rare','M':'mythique','S':'spéciale','L':'terrain de base','T':'jeton'}
CAT={'Online':'en ligne','Funny':'fantaisie'}
SKIP={'[metadata]','[tokens]','[other]','[rebalanced]','[conjured]','[alchemy]'}
BAD={'Plane','Scheme','Phenomenon','Vanguard','Conspiracy','Dungeon'}
# statut par nom, depuis la base du moteur
st={}
for f in glob.glob(DB+'/cards_?.json'):
  for k,v in json.load(open(f,encoding='utf-8')).items():
    rec={'statut':STAT.get(v['cov'],v['cov']),'manques':sorted(set(x.replace('effet manuel : ','manuel : ') for x in (v.get('gaps') or []))),
         'cout':v.get('cost',''),'types':' '.join((v.get('super') or [])+(v.get('types') or []))+((' : '+' '.join(v['sub'])) if v.get('sub') else ''),'_bad':bool(set(v.get('types') or [])&BAD)}
    st[k]=rec; st.setdefault(k.split(' // ')[0],rec)
AL={}
try:
  for a,b in json.load(open(DB+'/aliases.json',encoding='utf-8')).items(): AL[a]=b; AL[b]=a
except Exception: pass
def num_key(n):
  m=re.match(r'^([A-Za-z]*)(\d*)(.*)$',n); return (m.group(1),int(m.group(2)) if m.group(2) else 0,m.group(3))
# MTGJSON : référence pour savoir si une carte existe en papier et sous quel nom
MJP=None;MJFL={};MJAV={};MJSERIOUS=set()
if MJ:
  mj=json.load(open(MJ,encoding='utf-8'));MJP=set()
  for s_ in mj['sets']:
    if not s_['releaseDate'] or s_['releaseDate']>CUT: continue
    for c in s_['cards']:
      nm=c['name'];b=nm.split(' // ')[0]
      av=set(c['availability'] or [])
      MJAV.setdefault(b,set()).update(av)
      if c.get('faceName'): MJAV.setdefault(c['faceName'],set()).update(av)
      if 'paper' in av and s_['type'] not in ('memorabilia','token','minigame'): MJP.add(b)
      if 'paper' in av and not c.get('isFunny') and c.get('legal') and s_['type'] not in ('memorabilia','token','minigame'): MJSERIOUS.add(b)
      for k in ('flavorName','printedName'):
        if c.get(k) and c[k]!=nm: MJFL[c[k]]=b
rows=[]
for f in glob.glob(RES+'/editions/*.txt'):
  t=open(f,encoding='utf-8',errors='replace').read()
  ty=re.search(r'^Type=(\w+)',t,re.M); d=re.search(r'^Date=([\d-]+)',t,re.M)
  if not ty or not d or d.group(1)>CUT: continue
  code=(re.search(r'^Code=(\S+)',t,re.M) or re.search(r'^Name=(.+)$',t,re.M)).group(1).strip()
  en=(re.search(r'^Name=(.+)$',t,re.M) or ty).group(1).strip()
  cat=CAT.get(ty.group(1),'papier'); sec=None
  for l in t.split('\n'):
    l=l.strip()
    if l.startswith('['): sec=l.lower(); continue
    if not l or sec is None or sec in SKIP: continue
    m=re.match(r'^(\S+)\s+([CURMSLT])\s+(.+?)(?:\s+@(.*))?$',l)
    if not m: continue
    nm=m.group(3).split(' $')[0].split('|')[0].strip().rstrip('+').strip()
    if not nm or nm.startswith((':','//','[','A-')): continue
    base=nm.split(' // ')[0].strip()
    r=st.get(nm) or st.get(base); alt=None
    if not r and AL.get(base) in st: alt=AL[base]; r=st[alt]
    if r and r['_bad']: continue
    mjnote=None;rcat=cat;oracle=None
    if MJP is not None:
      if base in MJFL:
        oracle=MJFL[base]; mjnote='nom alternatif (Secret Lair ou Universes Within) de '+oracle
      elif base in MJP:
        mjnote='ok'
        if rcat=='papier' and base not in MJSERIOUS and MJSERIOUS: rcat='fantaisie'; mjnote='ok (carte papier non légale en tournoi selon MTGJSON : test, fantaisie ou objet de collection)'
        if rcat=='fantaisie' and base in MJSERIOUS: rcat='papier'; mjnote='ok (carte légale en tournoi selon MTGJSON, malgré son édition fantaisie)'
      elif base in MJAV:
        mjnote='pas en papier selon MTGJSON ('+', '.join(sorted(MJAV[base]))+')'
        if rcat=='papier': rcat='en ligne'
      else: mjnote='introuvable dans MTGJSON au '+CUT+' (carte annoncée, nom différent ou oubli de MTGJSON)'
    e={'nom':nm,'edition':code,'nom_edition':en,'sortie':d.group(1),'numero':m.group(1),'rarete':RAR.get(m.group(2),m.group(2))}
    if sec!='[cards]': e['variante']=sec.strip('[]')
    if m.group(4): e['artiste']=m.group(4).strip()
    e['categorie']=rcat
    if oracle: e['nom_oracle']=oracle
    if mjnote: e['mtgjson']=mjnote
    if r:
      if alt: e['nom_dans_le_simulateur']=alt
      e.update(cout=r['cout'],types=r['types'],statut=r['statut'],manques=r['manques'])
    else:
      e.update(statut='absente',manques=['pas de script Forge : en général un plan, une machination, une carte Vanguard ou une conspiration, hors partie normale'])
    rows.append(e)
rows.sort(key=lambda e:(e['sortie'],e['edition'],num_key(e['numero']),e['nom']),reverse=False)
# résumé : chaque carte compte une fois, dans sa catégorie la plus « jouable » (papier > fantaisie > en ligne)
def okey(e):
  ns=[x.split(' // ')[0] for x in (e['nom'],e.get('nom_dans_le_simulateur')) if x]
  for b in ns:
    if b in MJFL: return MJFL[b]
  if MJP is not None:
    for b in ns:
      if b in MJP or b in MJAV: return b
  return ns[-1]
rank={'papier':0,'fantaisie':1,'en ligne':2}; best={}
for e in rows:
  k=okey(e)
  if k!=e['nom']: e['carte']=k
  if k not in best or rank[e['categorie']]<rank[best[k][0]]: best[k]=(e['categorie'],e['statut'])
res={}
for cat in rank:
  c=collections.Counter(s_ for c_,s_ in best.values() if c_==cat); ci=collections.Counter(e['statut'] for e in rows if e['categorie']==cat)
  jou=sum(c[s_] for s_ in ('automatisee','partielle','manuelle'))
  res[cat]={'cartes':dict(c),'impressions':dict(ci),'pourcentage_cartes_automatisees':round(100*c['automatisee']/max(1,jou),1)}
out={'genere_le':CUT,'explication':{'une_entree':'une carte imprimée : édition + numéro de collection (variantes comprises : sans bordure, vitrine, promo…)',
 'automatisee':'tout est appliqué par le moteur','partielle':'une partie est automatisée, le reste est signalé','manuelle':"le moteur affiche l'effet, à appliquer à la main",'absente':'pas de script Forge',
 'manques':'ce qui manque encore pour automatiser la carte (même liste pour toutes ses impressions)'},
 'resume':res,'cartes':rows}
head=json.dumps({k:v for k,v in out.items() if k!='cartes'},ensure_ascii=False,indent=1)[:-2]
with open(OUT,'w',encoding='utf-8') as fo:
  fo.write(head+',\n "cartes": [\n'+',\n'.join('  '+json.dumps(e,ensure_ascii=False) for e in rows)+'\n ]\n}\n')
print(len(rows),json.dumps(res,ensure_ascii=False))
