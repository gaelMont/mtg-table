#!/usr/bin/env python3
"""Suivi carte par carte de l'automatisation du simulateur.
Usage : python3 tools/coverage.py <forge/res> <sim/db> <date limite AAAA-MM-JJ> <sortie.json>
Statuts : automatisee (tout est appliqué par le moteur), partielle (une partie est
automatisée, le reste est signalé), manuelle (le moteur affiche l'effet à appliquer à la main),
absente (édition sortie mais aucun script Forge, donc pas dans la base)."""
import glob,re,json,sys,collections
RES,DB,CUT,OUT=sys.argv[1:5]
STAT={'full':'automatisee','partial':'partielle','manual':'manuelle'}
CAT={'Online':'en ligne','Funny':'fantaisie'}
BAD={'Plane','Scheme','Phenomenon','Vanguard','Conspiracy','Dungeon'}
eds={}  # nom -> liste (date, code, nom d'édition, catégorie)
for f in glob.glob(RES+'/editions/*.txt'):
  t=open(f,encoding='utf-8',errors='replace').read()
  ty=re.search(r'^Type=(\w+)',t,re.M); d=re.search(r'^Date=([\d-]+)',t,re.M)
  if not ty or not d or d.group(1)>CUT: continue
  code=(re.search(r'^Code=(\S+)',t,re.M) or re.search(r'^Name=(.+)$',t,re.M)).group(1)
  en=(re.search(r'^Name=(.+)$',t,re.M) or ty).group(1).strip()
  cat=CAT.get(ty.group(1),'papier'); sec=None
  for l in t.split('\n'):
    l=l.strip()
    if l.startswith('['): sec=l.lower(); continue
    if not l or sec!='[cards]': continue
    m=re.match(r'^\S+\s+[CURMSLT]\s+(.+?)(?:\s+@.*)?$',l)
    if not m: continue
    nm=m.group(1).split(' $')[0].split('|')[0].strip().rstrip('+').strip().split(' // ')[0].strip()
    if not nm or nm.startswith((':','//','[')): continue
    eds.setdefault(nm,set()).add((d.group(1),code,en,cat))
rank={'papier':0,'fantaisie':1,'en ligne':2}
cards={}
for f in glob.glob(DB+'/cards_?.json'):
  for k,v in json.load(open(f,encoding='utf-8')).items():
    base=k.split(' // ')[0]; E=eds.get(k) or eds.get(base)
    if not E or set(v.get('types',[]))&BAD: continue
    E=sorted(E); cat=min((e[3] for e in E),key=rank.get)
    g=sorted(set(x.replace('effet manuel : ','manuel : ') for x in (v.get('gaps') or [])))
    cards[k]={'statut':STAT.get(v['cov'],v['cov']),'categorie':cat,'premiere_sortie':E[0][0],
      'editions':sorted({e[1] for e in E}),'manques':g}
for nm,E in eds.items():
  if nm in cards or any(c.split(' // ')[0]==nm for c in ()) or nm.startswith('A-'): continue
  if nm in {k.split(' // ')[0] for k in ()}: continue
seen={k.split(' // ')[0] for k in cards}|set(cards)
AL={}
try:
  for a,b in json.load(open(DB+'/aliases.json',encoding='utf-8')).items(): AL[a]=b; AL[b]=a
except Exception: pass
for nm,E in eds.items():
  if nm in seen or nm.startswith('A-'): continue
  E=sorted(E)
  if AL.get(nm) in cards:
    t=cards[AL[nm]]; cards[nm]={**t,'editions':sorted({e[1] for e in E}),'premiere_sortie':E[0][0],'nom_alternatif_de':AL[nm]}; continue
  cards[nm]={'statut':'absente','categorie':min((e[3] for e in E),key=rank.get),'premiere_sortie':E[0][0],'editions':sorted({e[1] for e in E}),'manques':['pas de script Forge : en général un plan, une machination, une carte Vanguard ou une conspiration, hors partie normale']}
res=collections.defaultdict(collections.Counter); gaps=collections.Counter(); ged={}
for k,c in cards.items():
  if c.get('nom_alternatif_de'): continue  # compté sous son nom principal
  res[c['categorie']][c['statut']]+=1
  if c['categorie']=='papier' and c['statut'] in ('partielle','manuelle'):
    for g in c['manques']: gaps[g]+=1; ged.setdefault(g,k)
resume={cat:{**dict(v),'total':sum(v.values()),'pourcentage_automatisees':round(100*v['automatisee']/max(1,sum(v[s] for s in ('automatisee','partielle','manuelle'))),1)} for cat,v in res.items()}
edn={}
for nm,E in eds.items():
  for d_,code,en,cat in E: edn[code]=(d_,en,cat)
pe=collections.defaultdict(collections.Counter)
for k,c in cards.items():
  if c.get('nom_alternatif_de'): continue
  for e in c['editions']: pe[e][c['statut']]+=1
par_ed=[{'code':e,'nom':edn[e][1],'sortie':edn[e][0],'categorie':edn[e][2],**dict(v),'pourcentage_automatisees':round(100*v['automatisee']/max(1,sum(v[s] for s in ('automatisee','partielle','manuelle'))),1)} for e,v in pe.items()]
par_ed.sort(key=lambda x:x['sortie'],reverse=True)
out={'genere_le':CUT,'source':'scripts Forge + moteur du simulateur','statuts':{'automatisee':'tout est appliqué par le moteur','partielle':'une partie est automatisée, le reste est signalé','manuelle':'le moteur affiche l\'effet à appliquer à la main','absente':'édition sortie, pas de script Forge'},
 'resume':resume,'par_edition':par_ed,'manques_les_plus_frequents':[{'manque':g,'cartes':n,'exemple':ged[g]} for g,n in gaps.most_common(100)],
 'cartes':dict(sorted(cards.items()))}
json.dump(out,open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(json.dumps(resume,ensure_ascii=False))
