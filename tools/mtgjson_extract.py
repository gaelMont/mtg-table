import ijson,json,sys
src,dst=sys.argv[1:3]
out={'meta':None,'sets':[]}
with open(src,'rb') as f:
  for code,s in ijson.kvitems(f,'data'):
    cards=[]
    for c in s.get('cards',[]):
      d_={k:c.get(k) for k in ('name','faceName','number','rarity','availability','isFunny','layout','types','side','isOnlineOnly','isRebalanced','flavorName','printedName','artist','isAlternative','securityStamp','promoTypes','language','borderColor','frameEffects','isFullArt')}
      d_['legal']=any(v in ('Legal','Restricted','Banned') for v in (c.get('legalities') or {}).values())
      cards.append(d_)
    out['sets'].append({'code':code,'name':s.get('name'),'releaseDate':s.get('releaseDate'),'type':s.get('type'),'isOnlineOnly':s.get('isOnlineOnly'),'isPartialPreview':s.get('isPartialPreview'),'parentCode':s.get('parentCode'),'cards':cards})
with open(src,'rb') as f:
  for k,v in ijson.kvitems(f,''):
    if k=='meta': out['meta']=v; break
json.dump(out,open(dst,'w'),default=str)
print(len(out['sets']),sum(len(s['cards']) for s in out['sets']),out['meta'])
