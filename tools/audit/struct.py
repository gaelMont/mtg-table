# Contrôle de cohérence : références de cible incohérentes avec la définition de cible de l'unité
import json,glob,collections,sys
OBJ_ACTS={'destroy','exile','bounce','graveyard','library','tap','untap','counters','regenerate','shield','attach','copyToken','moveCard','parts','removeCounters','sacrificeTarget','phaseOut','goad','transform','fight','gainControl','flicker','tapOrUntap','doubleCounters','proliferate'}
def units(card):
    if card.get('spell'):
        sp=card['spell']
        if sp.get('modes'):
            for m in sp['modes']: yield 'mode',m
        else: yield 'sort',sp
    for a in card.get('activations',[]): yield 'activation',a
    for a in card.get('zoneActs',[]): yield 'zone',a
    for a in card.get('abilities',[]):
        if a.get('kind')=='triggered':
            if a.get('modes'):
                for m in a['modes']: yield 'déclenchée',m
            else: yield 'déclenchée',{'target':a.get('target'),'target2':a.get('target2'),'actions':a.get('do',[]),'affects':a.get('affects')}
def acts(L):
    for a in L or []:
        if isinstance(a,dict):
            yield a
            for k in ('then','else','actions'):
                if isinstance(a.get(k),list): yield from acts(a[k])
            if isinstance(a.get('options'),list):
                for o in a['options']: yield from acts(o.get('then',[]))
            if isinstance(a.get('ab'),dict): pass
def check(card):
    out=[]
    for kind,u in units(card):
        t=u.get('target'); t2=u.get('target2')
        players=isinstance(t,dict) and t.get('playersOnly')
        for a in acts(u.get('actions')):
            if a.get('do') in ('reflexive','delayed','delayedZone','delayedCast','effect'): continue
            to=a.get('to')
            if to=='target' and t is None and a.get('do') not in ('gainLife','loseLife'): out.append(f"{kind} : {a.get('do')} vise « target » sans cible définie")
            if to=='target2' and t2 is None: out.append(f"{kind} : {a.get('do')} vise « target2 » sans seconde cible")
            if to=='target' and players and a.get('do') in OBJ_ACTS: out.append(f"{kind} : {a.get('do')} appliqué à un joueur ciblé")
            w=a.get('who')
            if w=='targetPlayer' and t is not None and not (t.get('playersOnly') or t.get('players')) and not t.get('stack') and not t.get('zone'):
                out.append(f"{kind} : {a.get('do')} par « joueur ciblé » alors que la cible est un objet")
    return out
if __name__=='__main__':
    c=collections.Counter();ex=collections.defaultdict(list);n=0
    for f in glob.glob('/home/claude/sim/db/cards_?.json'):
        for k,v in json.load(open(f)).items():
            if v.get('cov')!='full': continue
            r=check(v)
            if r: n+=1
            for x in set(r): c[x.split(' : ',1)[1]]+=1; ex[x.split(' : ',1)[1]].append(k)
    for k,m in c.most_common(40): print(m,k,'|',ex[k][:6])
    print('cartes',n)
