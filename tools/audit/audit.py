import re,json,glob,collections,sys
s=open('/home/claude/sim/index.html').read()
def body(fn):
    i=s.find(fn); j=s.find('\nfunction ',i+10); return s[i:j]
B={k:body(f) for k,f in [('match','function match('),('ev','function ev('),('cond','function cond('),('sel','function evalSel('),('trig','function trigMatches('),('cand','function candidates('),('legal','function legalAny('),('lt','function legalTarget('),('fd','function filtDesc(')]}
B['match']=B['match']+B['cand']+B['legal']+B['lt']+B['fd']
for extra in ('function nOf(','function evalVal(','function present('):
    if s.find(extra)>=0: B['ev']+=body(extra); B['cond']+=body(extra)
cases=set(re.findall(r"case'([A-Za-z0-9_]+)'",s))
lits=set(re.findall(r"'([A-Za-z0-9_]+)'",s))|set(re.findall(r'"([A-Za-z0-9_]+)"',s))
props=set(re.findall(r"\.([A-Za-z_][A-Za-z0-9_]*)",s))
def known_in(key,b):
    return re.search(r"(\.|\[')"+re.escape(key)+r"\b|'"+re.escape(key)+r"' in ",b) is not None
issues=collections.defaultdict(lambda: collections.Counter()); ex={}
ACT_KEYS_SKIP=set()
def walk(o,ctx,card,path=''):
    if isinstance(o,dict):
        if 'do' in o and isinstance(o['do'],str):
            if o['do'] not in cases: issues['action'][o['do']]+=1; ex.setdefault(('action',o['do']),card)
        if ctx=='rule' and 'type' in o:
            t=o['type']
            if t not in lits: issues['rule'][t]+=1; ex.setdefault(('rule',t),card)
        for k,v in o.items():
            nctx=ctx
            if k in ('filter','who','target','target2','affects','tgtFilter','srcF','tgt','tfilter','sel') and isinstance(v,dict): nctx='filter'
            elif k in ('n','amount','value','lifeAmount','limit','xv') and isinstance(v,dict): nctx='value'
            elif k in ('cond','if','condition') and isinstance(v,dict): nctx='cond'
            elif k=='rule': nctx='rule'
            elif k=='on' and isinstance(v,dict):
                ev=v.get('event')
                if ev and ev not in lits: issues['event'][ev]+=1; ex.setdefault(('event',ev),card)
                for kk in v:
                    if kk!='event' and kk not in props and kk not in lits: issues['onkey'][kk]+=1; ex.setdefault(('onkey',kk),card)
            if nctx=='filter' and ctx=='filter' or (nctx=='filter' and k not in ('who',)) :
                pass
            if ctx=='filter' and isinstance(o,dict) and k not in ('any','all') :
                if not (known_in(k,B['match']) or known_in(k,B['sel'])): issues['filterkey'][k]+=1; ex.setdefault(('filterkey',k),card+' @'+path)
            if ctx=='value' and k not in ('add','sub'):
                if not known_in(k,B['ev']): issues['valuekey'][k]+=1; ex.setdefault(('valuekey',k),card+' @'+path)
            if ctx=='cond':
                if not (known_in(k,B['cond']) or known_in(k,B['ev'])): issues['condkey'][k]+=1; ex.setdefault(('condkey',k),card+' @'+path)
            if ctx in ('cond','value') and nctx==ctx and isinstance(v,dict) and k not in ('not','and','or','mul','add','sub','min','max','ifn','ifv','cmp','neg','half','div'): nctx='filter'
            if ctx=='filter' and k in ('filter','any') : nctx='filter'
            walk(v,nctx if isinstance(v,(dict,list)) else ctx,card,path+'.'+k)
    elif isinstance(o,list):
        for x in o: walk(x,ctx,card,path)
full=0
for f in glob.glob('/home/claude/sim/db/cards_?.json'):
    for k,v in json.load(open(f)).items():
        if v.get('cov')!='full': continue
        full+=1
        walk(v,'top',k)
print('full cards',full)
for cat,c in issues.items():
    print('==',cat,sum(c.values()))
    for k,n in c.most_common(int(sys.argv[1]) if len(sys.argv)>1 else 25): print('  ',n,k,'|',ex[(cat,k)])
