# Traductions écrites à la main, carte par carte, pour les cartes que le traducteur générique ne couvre pas.
# Chaque entrée suit le texte Oracle et les règles citées.
OPP={'playersOnly':1,'oppOnly':1}
PL={'playersOnly':1}
KW=lambda n:{'layer':'6','op':'addAbility','ability':{'kind':'keyword','name':n}}
CUSTOM2={
 # {G}, {T} : adversaire ciblé qui contrôlait plus de créatures que toi à l'activation ; crée un 2/2 Bête.
 'Keeper of the Beasts':{'abilities':[{'m':'Choose target opponent','do':[{'do':'token','name':'tk:g_2_2_beast','n':1}],'target':{**OPP,'moreCreatures':1}}]},
 'Questing Phelddagrif':{'abilities':[
   {'m':'gets +1/+1','parts':[],'do':[{'do':'parts','affects':{'self':1},'duration':'eot','parts':[{'layer':'7c','op':'modPT','p':1,'t':1}]},{'do':'token','name':'tk:g_1_1_hippo','n':1,'who':'targetPlayer'}],'target':OPP},
   {'m':'gains protection from black','parts':[],'do':[{'do':'parts','affects':{'self':1},'duration':'eot','parts':[KW('Protection from black'),KW('Protection from red')]},{'do':'gainLife','who':'targetPlayer','n':2}],'target':OPP},
   {'m':'gains flying','parts':[],'do':[{'do':'parts','affects':{'self':1},'duration':'eot','parts':[KW('Flying')]},{'do':'genericChoice','who':'targetPlayer','options':[{'label':'Piocher une carte','then':[{'do':'draw','who':'targetPlayer','n':1}]},{'label':'Ne pas piocher','then':[]}]}],'target':OPP}]},
 # crée un 1/1 Saprolin qui bloque la créature ciblée qui t'attaque, puis pioche une carte.
 'Flash Foliage':{'spellMerge':{'actions':[{'do':'token','name':'tk:g_1_1_saproling','n':1,'blockingTarget':1},{'do':'draw','who':'you','n':1}],'target':{'types':['Creature'],'attacking':1,'attackingYou':1}}},
 # Panther Pounce : le joueur ciblé enquête ; la créature ciblée gagne +1/+0 et le vol, puis se dégage.
 'Panther Pounce':{'spellMerge':{'actions':[{'do':'token','name':'tk:c_a_clue_draw','n':1,'who':'targetPlayer'},{'do':'parts','to':'target2','duration':'eot','parts':[{'layer':'7c','op':'modPT','p':1,'t':0},KW('Flying')]},{'do':'untap','to':'target2'}],'target':PL,'target2':{'types':['Creature']}}},
}
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
# Call the Coppercoats : autant d'adversaires ciblés que voulu (frénésie d'effort gérée par le mot-clé) ; X = créatures qu'ils contrôlent.
CUSTOM2['Call the Coppercoats']={'spellMerge':{'actions':[{'do':'token','name':'tk:w_1_1_human_soldier','n':{'count':{'types':['Creature'],'ctlTargetPls':1}}}],'target':OPP,'minTargets':0,'maxTargets':7},'clear':['']}
# Jolted Awake : tu gagnes {E}{E}, puis tu peux payer autant de {E} que la valeur de mana de la carte ciblée pour la renvoyer sur le champ de bataille.
CUSTOM2['Jolted Awake']={'spellMerge':{'actions':[{'do':'playerCounter','kind':'energy','who':'you','n':2},{'do':'if','cond':{'cmp':[{'tgtMv':1},'GE',0]},'then':[{'do':'payToDo','pc':{'mana':'','extra':[{'kind':'energy','n':'X'}]},'xv':{'tgtMv':1},'then':[{'do':'moveCard','dest':'battlefield'}]}]}],'target':{'zone':['graveyard'],'filter':{'anyTypes':['Artifact','Creature']},'own':'you'},'minTargets':0},'clear':['']}
SPELL={'stack':1,'kinds':['spell']}
IS={'any':[{'types':['Instant']},{'types':['Sorcery']}]}
CUSTOM2.update({
 # Invert Polarity : pile ou face ; gagné, tu prends le contrôle du sort et peux changer ses cibles ; perdu, il est contrecarré.
 'Invert Polarity':{'spellMerge':{'actions':[{'do':'flipCoin','n':1,'win':[{'do':'controlSpell'},{'do':'changeTargets'}],'lose':[{'do':'counterTarget'}]}],'target':SPELL}},
 # Odds : pile ou face sans annonce ; pile, contrecarre ; face, copie le sort avec de nouvelles cibles possibles.
 'Odds':{'spellMerge':{'actions':[{'do':'flipCoin','n':1,'heads':[{'do':'counterTarget'}],'tails':[{'do':'copySpell','n':1}]}],'target':{**SPELL,'filter':IS}}},
 # Thrull Wizard : contrecarre le sort noir ciblé à moins que son contrôleur paie {B} ou {3} (il choisit lequel).
 'Thrull Wizard':{'abilities':[{'m':'Counter target black spell','do':[{'do':'genericChoice','who':'targetController','options':[{'label':'Payer {B}','then':[{'do':'unlessPay','payer':'targetController','cost':'{B}','then':[{'do':'counterTarget'}]}]},{'label':'Payer {3}','then':[{'do':'unlessPay','payer':'targetController','cost':'{3}','then':[{'do':'counterTarget'}]}]}]}],'target':{**SPELL,'filter':{'colors':['B']}}}]},
 # Goblin Artisans : pile ou face ; gagné, pioche ; perdu, contrecarre le sort d'artefact ciblé que tu contrôles (pas déjà ciblé par un autre Goblin Artisans).
 'Goblin Artisans':{'abilities':[{'m':'Flip a coin','do':[{'do':'flipCoin','n':1,'win':[{'do':'draw','who':'you','n':1}],'lose':[{'do':'counterTarget'}]}],'target':{**SPELL,'filter':{'types':['Artifact']},'ctl':'you','notTgtBySameName':1}}]},
 # Wyll's Reversal : jet d'un d20 + la plus grande force parmi tes créatures ; 1-14 nouvelles cibles ; 15+ nouvelles cibles puis copie.
 "Wyll's Reversal":{'spellMerge':{'actions':[{'do':'rollDice','sides':20,'n':1,'ignoreLower':0,'diff':False,'mod':{'greatest':['p',{'types':['Creature'],'controller':'you'}]},'results':[{'lo':-99,'hi':14,'then':[{'do':'changeTargets'}],'label':'1-14 : nouvelles cibles'},{'lo':15,'hi':999,'then':[{'do':'changeTargets'},{'do':'copySpell','n':1}],'label':'15+ : nouvelles cibles, puis copie'}]}],'target':{'stack':1,'kinds':['spell','ability','trigger'],'hasTargets':1}}},
 # Sudden Substitution : échange le contrôle du sort non-créature ciblé et de la créature ciblée ; le nouveau contrôleur du sort peut changer ses cibles.
 'Sudden Substitution':{'spellMerge':{'actions':[{'do':'exchangeSpellCreature'},{'do':'changeTargets'}],'target':{**SPELL,'filter':{'notTypes':['Creature']}},'target2':{'types':['Creature']}}},
})
CUSTOM2['Aang, Swift Savior']={'abilities':[{'m':'When Aang enters','do':[{'do':'airbend','to':'target'},{'do':'airbendSpell'}],'target':{'types':['Creature'],'other':1,'stackOr':SPELL},'minTargets':0}]}
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
GYC={'zone':['graveyard'],'filter':{'types':['Creature']},'own':'you'}
CUSTOM2.update({
 # Feldon : jeton copie d'une carte de créature de ton cimetière, artefact en plus, avec la célérité, sacrifié à la prochaine étape de fin.
 'Feldon of the Third Path':{'abilities':[{'m':"Create a token that's a copy of target creature card",'do':[{'do':'copyToken','to':'target','n':1,'except':{'addTypes':['Artifact']},'kws':['Haste'],'kwDur':'perm','atEot':'sac'}],'target':GYC}]},
 # Daretti -6 : trois jetons copies d'une carte d'artefact dans un cimetière ou d'un artefact sur le champ de bataille.
 'Daretti, Ingenious Iconoclast':{'abilities':[{'m':'Choose target artifact card in a graveyard','do':[{'do':'copyToken','to':'target','n':3}],'target':{'types':['Artifact'],'zoneOr':{'zone':['graveyard'],'filter':{'types':['Artifact']}}}}]},
 # Dino DNA : jeton copie d'une carte de créature exilée avec Dino DNA, sauf que c'est une créature Dinosaure verte 6/6 avec le piétinement.
 'Dino DNA':{'abilities':[{'m':"Create a token that's a copy of target creature card exiled",'do':[{'do':'copyToken','to':'target','n':1,'except':{'p':6,'t':6,'colors':['G'],'setTypes':['Creature'],'setSub':['Dinosaur'],'addKws':['Trample']}}],'target':{'zone':['exile'],'filter':{'types':['Creature'],'exiledWithSrc':1}}}]},
 # Shifting Woodland : devient une copie d'une carte de permanent de ton cimetière jusqu'à la fin du tour (délire).
 'Shifting Woodland':{'abilities':[{'m':'becomes a copy of target permanent card','do':[{'do':'clone','from':'target','duration':'eot'}],'target':{'zone':['graveyard'],'filter':{'notTypes':['Instant','Sorcery']},'own':'you'}}]},
 # Taskmaster : jusqu'à ton prochain tour, devient une copie d'une créature ou d'une carte de créature dans un cimetière, sauf son nom et ses types.
 'Taskmaster, Mercenary Mimic':{'abilities':[{'m':'Photographic Reflexes','do':[{'do':'clone','from':'target','duration':'ynext','ex':{'name':'Taskmaster, Mercenary Mimic','setTypes':['Creature'],'setSub':['Human','Mercenary','Villain'],'addSuper':['Legendary']}}],'target':{'types':['Creature'],'zoneOr':{'zone':['graveyard'],'filter':{'types':['Creature']}}},'minTargets':0}]},
})
# Espers to Magicite : exile le cimetière de chaque adversaire ; puis jusqu'à une carte de créature exilée ainsi devient un jeton copie, artefact seulement.
# (La capacité réflexive « quand tu le fais » est simplifiée en un choix pendant la résolution : en exil, la différence entre cibler et choisir ne change rien.)
CUSTOM2['Espers to Magicite']={'spellMerge':{'actions':[{'do':'zoneAll','from':['graveyard'],'who':'all','filter':{'owner':'opp'},'dest':'exile','remember':1},{'do':'chooseMoved','n':1,'upTo':1,'filter':{'types':['Creature']}},{'do':'copyToken','to':'moved','n':1,'except':{'setTypes':['Artifact']}}]}}
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
def _fbGrant(name):
    return {'do':'effect','name':'Effet','duration':'eot','statics':[{'kind':'static','text':'Capacité accordée dans le cimetière','rule':{'type':'grantZone','zone':'graveyard','abil':[{'kind':'keyword','name':name}],'ways':[],'zoneActs':[],'remembered':1}}],'triggers':[],'reps':[],'remember':'targets'}
# Archmage's Newt : la carte ciblée gagne le flashback (son coût de mana), ou le flashback {0} si le Triton est sellé.
CUSTOM2["Archmage's Newt"]={'abilities':[{'m':"Whenever Archmage's Newt deals combat damage",'do':[{'do':'if','cond':{'selfIs':{'saddled':1}},'then':[_fbGrant('Flashback {0}')],'else':[_fbGrant('Flashback')]}],'target':{'zone':['graveyard'],'filter':IS,'own':'you'}}],'clear':['']}
CUSTOM2.update({
 # Petra Sphinx : le joueur ciblé nomme une carte puis révèle le dessus ; si c'est elle, en main, sinon au cimetière.
 'Petra Sphinx':{'abilities':[{'m':'Target player chooses a card name','do':[{'do':'nameCard','filter':{}},{'do':'dig','who':'targetPlayer','n':1,'take':99,'filter':{'namedCard':1},'dest':'hand','rest':'graveyard'}],'target':PL}]},
 # Vexing Arcanix : pareil ; si ce n'est pas la carte nommée, 2 blessures à ce joueur.
 'Vexing Arcanix':{'abilities':[{'m':'Target player chooses a card name','do':[{'do':'nameCard','filter':{}},{'do':'peek','who':'targetPlayer','n':1,'reveal':True,'remember':True,'optional':False,'revealValid':None},{'do':'dig','who':'targetPlayer','n':1,'take':99,'filter':{'namedCard':1},'dest':'hand','rest':'graveyard'},{'do':'if','cond':{'not':{'remIs':{'namedCard':1}}},'then':[{'do':'damagePlayer','who':'targetPlayer','n':2}]}],'target':PL}]},
 # Venomous Breath : à la fin du combat, détruis toutes les créatures qui ont bloqué la créature ciblée ou ont été bloquées par elle.
 'Venomous Breath':{'spellMerge':{'actions':[{'do':'delayed','step':'ecombat','whose':'each','remember':'targets','text':'Détruis les créatures qui ont bloqué la créature ciblée ou ont été bloquées par elle','then':[{'do':'destroy','to':'affected','affects':{'all':1,'types':['Creature'],'combatWithRem':1}}],'once':1}],'target':{'types':['Creature']}}},
 # Choice of Damnations : l'adversaire ciblé choisit un nombre ; tu choisis : il perd autant de PV, ou il sacrifie tous ses permanents sauf ce nombre.
 'Choice of Damnations':{'spellMerge':{'actions':[{'do':'chooseParam','param':'chosenNum','kind':'number','min':0,'max':999,'who':'targetPlayer'},{'do':'genericChoice','who':'you','options':[{'label':'Il perd autant de points de vie','then':[{'do':'loseLife','who':'targetPlayer','n':{'param':'chosenNum'}}]},{'label':'Il sacrifie tous ses permanents sauf ce nombre','then':[{'do':'sacrifice','who':'targetPlayer','filter':{},'n':{'sum':[{'count':{'ctlTargetCtl':1}},{'neg':{'param':'chosenNum'}}]}}]}]}],'target':OPP}},
 # Linessa (grandeur) : le joueur ciblé renvoie une créature qu'il contrôle, puis un artefact, un enchantement et un terrain.
 'Linessa, Zephyr Mage':{'abilities':[{'m':'Target player returns a creature','label':'Grandeur, défausser une autre carte nommée Linessa, Zephyr Mage : le joueur ciblé renvoie une créature, puis un artefact, un enchantement et un terrain','extra':[{'kind':'discard','n':1,'filter':{'name':'Linessa, Zephyr Mage'}}],'do':[x for t in ('Creature','Artifact','Enchantment','Land') for x in ({'do':'chooseCard','who':'targetPlayer','filter':{'types':[t]},'n':1},{'do':'bounce','to':'chosen'},{'do':'cleanChosen'})],'target':PL}]},
 # Teferi -12 : l'adversaire ciblé renvoie un permanent qu'il contrôle en main, puis mélange ses permanents non-terrains dans sa bibliothèque.
 'Teferi, Temporal Pilgrim':{'abilities':[{'m':'-12','do':[{'do':'chooseCard','who':'targetPlayer','filter':{},'n':1},{'do':'bounce','to':'chosen'},{'do':'library','to':'affected','affects':{'all':1,'notTypes':['Land'],'ctlTargetCtl':1}},{'do':'shuffle','who':'targetPlayer'}],'target':OPP}]},
 # Fortune's Favor : l'adversaire ciblé sépare tes 4 cartes du dessus en deux piles ; tu en prends une, l'autre va au cimetière.
 "Fortune's Favor":{'spellMerge':{'actions':[{'do':'peek','who':'you','n':4,'reveal':False,'remember':True,'optional':False,'revealValid':None},{'do':'twoPiles','chosen':'hand','unchosen':'graveyard','separator':'targetPlayer','chooser':'you'}],'target':OPP}},
 # Rescue from the Underworld : au début de ton prochain entretien, la carte ciblée et la créature sacrifiée reviennent sous ton contrôle ; le sort est exilé.
 'Rescue from the Underworld':{'spellMerge':{'actions':[{'do':'delayedReturnCards','withSac':1},{'do':'exileSpellSelf'}],'target':GYC}},
 # Plague Reaver : au début du prochain entretien de l'adversaire ciblé, il récupère Plague Reaver de ton cimetière sous son contrôle.
 'Plague Reaver':{'abilities':[{'m':'Choose target opponent','do':[{'do':'delayedReturnCards','selfGy':1,'whose':'targetPlayer','ctl':'targetPlayer'}],'target':OPP}]},
 # Behemoth of Vault 0 : quand il meurt, tu peux payer autant de {E} que la valeur de mana du permanent non-terrain ciblé ; si tu le fais, détruis-le.
 'Behemoth of Vault 0':{'abilities':[{'m':'When Behemoth of Vault 0 dies','do':[{'do':'payToDo','pc':{'mana':'','extra':[{'kind':'energy','n':'X'}]},'xv':{'tgtMv':1},'then':[{'do':'destroy','to':'target'}]}],'target':{'notTypes':['Land']}}]},
})
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
FH=lambda **kw:{'do':'loop','kind':'freeHand','filter':kw.pop('filter',{}),'n':kw.pop('n',1),**kw}
CUSTOM2.update({
 # Djinn of Wishes : révèle le dessus ; tu peux jouer cette carte sans payer son coût de mana (un terrain compte comme ton terrain du tour) ; sinon, exile-la.
 'Djinn of Wishes':{'abilities':[{'m':'Reveal the top card','do':[{'do':'peek','who':'you','n':1,'reveal':True,'remember':True,'optional':False,'revealValid':None},FH(zone='libraryTop',allowLand=1),{'do':'zoneAll','from':['library'],'who':'you','filter':{'remembered':1},'dest':'exile'}]}]},
 # Chandra, Pyromaster -7 : exile les dix du dessus, choisis un éphémère ou rituel exilé ainsi, copie-le trois fois et lance les copies gratuitement.
 'Chandra, Pyromaster':{'abilities':[{'m':'-7','do':[{'do':'dig','who':'you','n':10,'take':99,'dest':'exile','rest':'bottom','remember':1},{'do':'chooseMoved','n':1,'filter':IS},FH(zone='exile',fromMoved=1,copy=1,copyN=3,n=3)]}]},
 # Jace -2 : un adversaire sépare les trois cartes révélées en deux piles ; une en main, l'autre au-dessous de ta bibliothèque.
 'Jace, Architect of Thought':{'abilities':[{'m':'-2','do':[{'do':'peek','who':'you','n':3,'reveal':True,'remember':True,'optional':False,'revealValid':None},{'do':'twoPiles','chosen':'hand','unchosen':'libraryBottom','separator':'opp','chooser':'you'}]},
   {'m':'-8','do':[{'do':'chooseFromZone','from':['library'],'who':'all','filter':{'notTypes':['Land']},'n':1,'dest':'exile','shuffle':True,'remember':1},FH(zone='exile',fromMoved=1,n=99)]}]},
 # Spell Queller : quand il quitte le champ de bataille, le propriétaire de la carte exilée peut la lancer gratuitement.
 'Spell Queller':{'abilities':[{'m':'When Spell Queller leaves','do':[FH(zone='exile',fromExiledWith=1,forOwner=1)]}]},
 # Jadzi : révèle le dessus ; non-terrain, tu peux le lancer en payant {1} au lieu de son coût de mana ; terrain, il arrive sur le champ de bataille.
 'Jadzi, Oracle of Arcavios':{'abilities':[{'m':'Magecraft','do':[{'do':'peek','who':'you','n':1,'reveal':True,'remember':True,'optional':False,'revealValid':None},FH(zone='libraryTop',free=0,playCost='{1}'),{'do':'zoneAll','from':['library'],'who':'you','filter':{'remembered':1,'types':['Land']},'dest':'battlefield'}]}]},
 # Diluvian Primordial : pour chaque adversaire, jusqu'à un éphémère ou rituel ciblé de son cimetière, lancé gratuitement puis exilé.
 'Diluvian Primordial':{'abilities':[{'m':'When Diluvian Primordial enters','do':[FH(fromTargets=1,zone='graveyard',replaceGy=1,n=99)],'target':{'zone':['graveyard'],'filter':IS,'own':'opp','tc':{'diffCtl':1}},'minTargets':0,'maxTargets':7}]},
 # Scholar of the Lost Trove : lance gratuitement un éphémère, rituel ou artefact ciblé de ton cimetière ; un éphémère ou rituel est exilé ensuite.
 'Scholar of the Lost Trove':{'abilities':[{'m':'When Scholar of the Lost Trove enters','do':[FH(fromTargets=1,zone='graveyard',replaceGy=1)],'target':{'zone':['graveyard'],'filter':{'anyTypes':['Instant','Sorcery','Artifact']},'own':'you'},'minTargets':0}]},
 # Tinybones : lance une carte de permanent non-terrain ciblée du cimetière du joueur blessé, avec du mana de n'importe quel type.
 'Tinybones, the Pickpocket':{'abilities':[{'m':'Whenever Tinybones','do':[FH(fromTargets=1,zone='graveyard',free=0,anyMana=1)],'target':{'zone':['graveyard'],'filter':{'notTypes':['Land','Instant','Sorcery']},'ownEv':'player'},'minTargets':0}]},
 # Geode Golem : tu peux lancer ton commandant depuis la zone de commandement sans payer son coût de mana (la taxe reste due, 903.8).
 'Geode Golem':{'abilities':[{'m':'Whenever Geode Golem','do':[FH(zone='command',filter={'commander':1})]}]},
})
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
CUSTOM2.update({
 # Reversal of Fortune : l'adversaire ciblé révèle sa main ; tu peux copier un éphémère ou un rituel qui s'y trouve et lancer la copie gratuitement.
 'Reversal of Fortune':{'spellMerge':{'actions':[{'do':'revealHand','who':'targetPlayer'},FH(zone='hand',zpTarget=1,copy=1,filter=IS)],'target':OPP}},
 # Arcane Savant : la carte choisie avant la partie n'existe qu'en draft (texte « hors de la partie ») ; dans une partie de Commander, rien ne se passe.
 'Arcane Savant':{'abilities':[{'m':'When Arcane Savant enters','do':[{'do':'note','text':"Arcane Savant : aucune carte n'a été mise de côté pendant un draft, donc rien n'est copié."}]}]},
 # Chun-Li (et sa variante Zethi) : en arrivant, exile jusqu'à X éphémères ciblés de ton cimetière avec un marqueur coup (X = nombre de kickers) ; en attaquant, copie chacun et tu peux lancer les copies.
 'Chun-Li, Countless Kicks':{'abilities':[{'m':'When Chun-Li','do':[{'do':'moveCard','dest':'exile'},{'do':'markMoved','flag':'kickCtr','label':'Chaque carte exilée ainsi reçoit un marqueur coup.'}],'target':{'zone':['graveyard'],'filter':{'types':['Instant']},'own':'you'},'minTargets':0,'maxTargets':{'kickTimes':1}},
   {'m':'Whenever Chun-Li','do':[FH(zone='exile',filter={'kickCtr':1},copy=1,free=0,n=99)]}]},
 # Garth One-Eye : choisis un nom pas encore choisi parmi six ; crée une copie de cette carte, tu peux la lancer (en payant son coût).
 'Garth One-Eye':{'abilities':[{'m':'Choose a card name','do':[{'do':'copyByName','names':['Disenchant','Braingeyser','Terror','Shivan Dragon','Regrowth','Black Lotus']},FH(zone='exile',fromMoved=1,free=0,adoptCopies=1)]}]},
 # Rod of Absorption : chaque éphémère ou rituel lancé est exilé au lieu d'aller au cimetière en se résolvant ; {X},{T}, sacrifice : lance gratuitement des cartes exilées ainsi de valeur de mana totale X au plus.
 'Rod of Absorption':{'abilities':[{'m':'Whenever a player casts','do':[{'do':'spellMark','to':'eventSpell','mark':{'exileWith':1}}]},{'m':'{X}','do':[FH(zone='exile',fromExiledWith=1,n=99,mvTotal={'xPaid':1})]}]},
 # Invoke Calamity : jusqu'à deux éphémères ou rituels de ton cimetière ou de ta main, valeur de mana totale 6 au plus, lancés gratuitement puis exilés ; exile Invoke Calamity.
 'Invoke Calamity':{'spellMerge':{'actions':[FH(zone='graveyard',zones=['graveyard','hand'],filter=IS,n=2,mvTotal=6,replaceGy=1),{'do':'exileSpellSelf'}]}},
 # Smuggler's Buggy : tu peux lancer la carte exilée gratuitement ; si tu le fais, renvoie le Buggy dans la main de son propriétaire.
 "Smuggler's Buggy":{'abilities':[{'m':"Whenever Smuggler's Buggy",'do':[FH(zone='exile',fromExiledWith=1),{'do':'if','cond':{'remIs':{}},'then':[{'do':'bounce','to':'self'}]}]}]},
 # Widespread Thieving : un Trésor, puis tu peux payer {W}{U}{B}{R}{G} pour jouer gratuitement la carte exilée.
 'Widespread Thieving':{'abilities':[{'m':'Whenever you cast a multicolored','do':[{'do':'token','name':'tk:c_a_treasure_sac','n':1},{'do':'payToDo','pc':{'mana':'{W}{U}{B}{R}{G}','extra':[]},'then':[FH(zone='exile',fromExiledWith=1,allowLand=1)]}]}]},
})
CUSTOM2['Zethi, Arcane Blademaster']=CUSTOM2['Chun-Li, Countless Kicks']
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
CUSTOM2.update({
 # Primeval Spawn : exilée si elle arrive sans avoir été lancée avec du mana ; en quittant le champ de bataille, exile les dix du dessus, lance gratuitement des sorts de valeur de mana totale 10 au plus parmi elles.
 'Primeval Spawn':{'card':{'mustCastWithMana':1},'abilities':[{'m':'When Primeval Spawn leaves','do':[{'do':'dig','who':'you','n':10,'take':99,'dest':'exile','rest':'bottom','remember':1},FH(zone='exile',fromMoved=1,filter={'notTypes':['Land']},n=99,mvTotal=10)]}]},
 # Anrakyr : en attaquant, tu peux lancer un sort d'artefact de ta main ou de ton cimetière en payant des PV égaux à sa valeur de mana.
 'Anrakyr the Traveller':{'abilities':[{'m':'Lord of the Pyrrhian Legions','do':[FH(zone='hand',zones=['hand','graveyard'],filter={'types':['Artifact']},free=0,lifeMv=1)]}]},
 # Ogre Battlecaster : en attaquant, lance l'éphémère ou le rituel ciblé de ton cimetière en payant {R}{R} en plus ; exilé ensuite ; l'Ogre gagne +X/+0 (X = sa valeur de mana).
 'Ogre Battlecaster':{'abilities':[{'m':'Whenever Ogre Battlecaster attacks','do':[FH(fromTargets=1,zone='graveyard',free=0,addCost='{R}{R}',replaceGy=1),{'do':'if','cond':{'remIs':{}},'then':[{'do':'parts','affects':{'self':1},'duration':'eot','parts':[{'layer':'7c','op':'modPT','p':{'loopCastMv':1},'t':0}]}]}],'target':{'zone':['graveyard'],'filter':IS,'own':'you'},'minTargets':0}]},
 # Ryan Sinclair : exile jusqu'à une carte non-terrain ; tu peux la lancer gratuitement si sa valeur de mana est au plus sa force ; le reste au-dessous dans un ordre aléatoire.
 'Ryan Sinclair':{'abilities':[{'m':'exile cards from the top of your library until','do':[{'do':'digUntil','who':'you','filter':{'notTypes':['Land']},'found':'exile','revealed':'exile','remember':1},FH(zone='exile',fromMoved=1,filter={'notTypes':['Land']},mvMax={'powerOf':'self'}),{'do':'zoneAll','from':['exile'],'who':'you','filter':{'remembered':1},'dest':'library','pos':'bottom','random':1}]}]},
 # The Face of Boe : {T} : lance un sort avec suspension de ta main en payant son coût de suspension au lieu de son coût de mana (vitesse de rituel).
 'The Face of Boe':{'abilities':[{'m':'You may cast a spell with suspend','do':[FH(zone='hand',filter={'hasSuspend':1},free=0,costSuspend=1)]}]},
 # River Song's Diary : chaque éphémère ou rituel lancé depuis la main est exilé avec le Journal en se résolvant ; à ton entretien, s'il y en a au moins quatre, une au hasard peut être lancée gratuitement.
 "River Song's Diary":{'abilities':[{'m':'Whenever a player casts','do':[{'do':'spellMark','to':'eventSpell','mark':{'exileWith':1}}]},{'m':'At the beginning of your upkeep','do':[{'do':'if','cond':{'cmp':[{'exiledWith':'count'},'GE',4]},'then':[FH(zone='exile',fromExiledWith=1,randomOne=1)]}]}]},
 # Forger's Foundry : le mana de son {T} dépensé pour un éphémère ou rituel de VM 3 au plus fait exiler ce sort avec la Fonderie ; {3}{U}{U},{T} : lance gratuitement les cartes exilées avec elle.
 "Forger's Foundry":{'card':{'riderExile':{'filter':{'allOf':[IS,{'mvMax':3}]}}},'abilities':[{'m':'{3}{U}{U}','do':[FH(zone='exile',fromExiledWith=1,n=99)]}]},
})
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
CUSTOM2.update({
 # Summon: Esper Valigarmanda, chapitres II à IV : ajoute {R} par marqueur de savoir, puis tu peux lancer un éphémère ou un rituel exilé avec la Saga (mana de n'importe quel type).
 'Summon: Esper Valigarmanda':{'abilities':[{'m':'Chapitre %d'%i,'do':[{'do':'addMana','fixed':'R','n':{'selfCounters':'lore'}},FH(zone='exile',fromExiledWith=1,filter=IS,free=0,anyMana=1)]} for i in (2,3,4)]},
 # Quistis Trepe : lance l'éphémère ou le rituel ciblé d'un cimetière, mana de n'importe quel type ; exilé ensuite.
 'Quistis Trepe':{'abilities':[{'m':'Blue Magic','do':[FH(fromTargets=1,zone='graveyard',free=0,anyMana=1,replaceGy=1)],'target':{'zone':['graveyard'],'filter':IS},'minTargets':0}]},
 # Bilbo : en attaquant, tu peux lancer un artefact, un éphémère ou un rituel de ton cimetière ; un éphémère ou rituel est exilé ensuite.
 'Bilbo, Thief in the Night':{'abilities':[{'m':'Whenever Bilbo','do':[FH(zone='graveyard',filter={'anyTypes':['Artifact','Instant','Sorcery']},free=0,replaceGy=1)]}]},
 # Cmdr. Troi : l'adversaire dont c'est le tour peut lancer gratuitement un sort de sa main ; s'il le fait, tu copies ce sort ; sinon, tu pioches.
 'Cmdr. Troi, Outgoing Empath':{'abilities':[{'m':'Target opponent whose turn','do':[FH(zone='hand',casterTarget=1),{'do':'if','cond':{'remIs':{}},'then':[{'do':'copyLoopCast'}],'else':[{'do':'draw','who':'you','n':1}]}],'target':{**OPP,'activeOnly':1}}]},
})
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
# Q, Stacking the Deck : la carte non-terrain exilée gagne « Exiler une carte de ta main : crée une copie de cette carte, tu peux lancer la copie », seulement pendant ton tour et tant qu'elle est en exil.
_QACT={'zone':'exile','label':"Exiler une carte de ta main : crée une copie de cette carte, tu peux lancer la copie (seulement pendant ton tour)",'mana':'','extra':[{'kind':'exileHand','n':1}],'yourTurn':1,'duration':'eot','parts':[],'actions':[{'do':'copySelfCard'},FH(zone='exile',fromMoved=1,free=0,adoptCopies=1)]}
CUSTOM2['Q, Stacking the Deck']={'abilities':[{'m':'When Q enters','do':[{'do':'shuffle','who':'you'},{'do':'digUntil','who':'you','filter':{'notTypes':['Land']},'n':1,'found':'exile','revealed':'exile','bottomRandom':False,'shuffle':False,'tapped':False,'remember':True},{'do':'chooseMoved','n':1,'filter':{'notTypes':['Land']}},{'do':'effect','name':'Q, Stacking the Deck','duration':'perm','statics':[{'kind':'static','text':'La carte exilée a une capacité activable depuis l\'exil','rule':{'type':'grantZone','zone':'exile','abil':[],'ways':[],'zoneActs':[_QACT],'remembered':1}}],'triggers':[],'reps':[],'remember':'moved'}]}],'clear':['']}
# Chandra, Fire of Kaladesh : si elle a infligé 3 blessures ou plus ce tour-ci, exile-la puis renvoie-la transformée ; -7 du verso : emblème pour chaque joueur blessé ainsi.
_EMB=[{'kind':'triggered','text':"Au début de ton entretien, cet emblème t'inflige 3 blessures.",'on':{'event':'step','step':'upkeep','whose':'you'},'do':[{'do':'damagePlayer','who':'you','n':3}]}]
CUSTOM2['Chandra, Fire of Kaladesh']={'abilities':[{'m':'deals 1 damage to target player','do':[{'do':'damage','n':1,'to':'target'},{'do':'if','cond':{'cmp':[{'srcDmgTurn':1},'GE',3]},'then':[{'do':'exile','to':'self','remember':1},{'do':'returnMoved','from':['exile'],'dest':'battlefield','transformed':1}]}],'target':{'types':['Planeswalker'],'players':1}}],'clear':['']}
CUSTOM2['Chandra, Fire of Kaladesh']['backAbilities']=[{'m':'-7','do':[{'do':'damagePlayer','who':'opps','n':6},{'do':'effect','name':'Emblème : Chandra, Roaring Flame','duration':'perm','statics':[],'triggers':_EMB,'reps':[],'owner':'dmgBySrcPlayers'}]}]
CUSTOM2.update({
 # Thran Tome : révèle les trois du dessus ; l'adversaire ciblé en choisit une, qui va dans ton cimetière ; puis tu pioches deux cartes.
 'Thran Tome':{'abilities':[{'m':'Reveal the top three cards','do':[{'do':'peek','who':'you','n':3,'reveal':True,'remember':True,'optional':False,'revealValid':None},{'do':'chooseMoved','n':1},{'do':'returnMoved','from':['library'],'dest':'graveyard','chosen':1},{'do':'draw','who':'you','n':2}],'target':OPP}]},
 # Giant Albatross : en mourant, tu peux payer {1}{U} ; chaque créature qui lui a infligé des blessures ce tour-ci est détruite (sans régénération) à moins que son contrôleur paie 2 PV.
 'Giant Albatross':{'abilities':[{'m':'When Giant Albatross dies','do':[{'do':'payToDo','pc':{'mana':'{1}{U}','extra':[]},'then':[{'do':'destroyUnlessLife','filter':{'types':['Creature'],'dealtDmgToSrc':1},'life':2}]}]}]},
})
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
# Runesword : +2/+0 à la créature attaquante ciblée ; les créatures qu'elle blesse ce tour-ci ne peuvent pas être régénérées et sont exilées au lieu de mourir ; si elle quitte le champ de bataille ce tour-ci, sacrifie Runesword.
CUSTOM2['Runesword']={'abilities':[{'m':'Target attacking creature gets +2/+0','do':[{'do':'parts','to':'target','duration':'eot','parts':[{'layer':'7c','op':'modPT','p':2,'t':0}]},{'do':'runesword'}],'target':{'types':['Creature'],'attacking':1}}],'clear':['']}
# Crystal Spray : jusqu'à la fin du tour, remplace dans le texte du sort ou du permanent ciblé un mot de couleur par un autre, ou un type de terrain de base par un autre ; pioche une carte.
_COLW=['white','blue','black','red','green']; _LT=['Plains','Island','Swamp','Mountain','Forest']
_FRC={'white':'blanc','blue':'bleu','black':'noir','red':'rouge','green':'vert'}
_opts=[{'label':f'« {_FRC[a]} » devient « {_FRC[b]} »','then':[{'do':'textChangeTarget','from':a,'to':b}]} for a in _COLW for b in _COLW if a!=b]+[{'label':f'« {a} » devient « {b} »','then':[{'do':'textChangeTarget','from':a,'to':b}]} for a in _LT for b in _LT if a!=b]
CUSTOM2['Crystal Spray']={'spellMerge':{'actions':[{'do':'genericChoice','who':'you','options':_opts},{'do':'draw','who':'you','n':1}],'target':{'stackOr':SPELL}},'clear':['']}
# Baron Helmut Zemo (vantardise, une fois par tour s'il a attaqué) : exile des cartes noires de ton cimetière totalisant au moins 15 {B} ; copie-les et lance jusqu'à trois copies gratuitement.
CUSTOM2['Baron Helmut Zemo']={'abilities':[{'m':'ExileFromGrave','label':'Vantardise, exiler des cartes noires de ton cimetière totalisant au moins 15 {B} : copie-les, tu peux lancer jusqu\'à trois copies gratuitement','mana':'','extra':[{'kind':'exileGyBSym','n':99,'min':15}],'cond':{'selfIs':{'attackedTurn':1}},'limit':1,'do':[FH(zone='exile',fromCostExiled=1,copy=1,n=3)]}],'clear':['']}
# The Muckslinger Gang : les sorts de créature que tu contrôles et les cartes de créature que tu possèdes hors du champ de bataille ont +3/+3 (611.3a, 613.4c).
CUSTOM2['The Muckslinger Gang']={'abilities':[{'m':'Creature spells you control and creature cards you own','kind':'static','effect':{'affects':{'all':1,'types':['Creature'],'owner':'you'},'parts':[{'layer':'7c','op':'modPT','p':3,'t':3}],'allZones':1},'do':None}],'clear':['']}
# Spawnsire of Ulamog : {20} : lance gratuitement n'importe quel nombre de cartes Eldrazi que tu possèdes hors de la partie (désignées dans la base de cartes).
CUSTOM2['Spawnsire of Ulamog']={'card':{'preloadIndex':1},'abilities':[{'m':'{20}','do':[{'do':'outsideCast','sub':'Eldrazi'}]}],'clear':['']}
CUSTOM2['Garth One-Eye'].setdefault('card',{})['preloadNames']=['Disenchant','Braingeyser','Terror','Shivan Dragon','Regrowth','Black Lotus']
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
# Illusionary Mask : {X} : une carte de créature de ta main dont le coût est payable avec une partie du mana dépensé pour {X} se lance face cachée, comme une créature 2/2, sans payer son coût de mana ; elle se retourne avant d'infliger ou de subir des blessures ou de s'engager.
CUSTOM2['Illusionary Mask']={'abilities':[{'m':'{X}','do':[FH(zone='hand',filter={'types':['Creature']},maskX=1)]}],'clear':['']}
# Spellweaver Volute : enchante une carte d'éphémère dans un cimetière ; à chaque rituel lancé, copie-la et tu peux lancer la copie gratuitement ; si tu le fais, exile la carte enchantée et attache l'Aura à une autre carte d'éphémère d'un cimetière.
CUSTOM2['Spellweaver Volute']={'card':{'enchant':{'zone':['graveyard'],'filter':{'types':['Instant']},'zoneFilter':{'types':['Instant']}}},'abilities':[{'m':'Whenever you cast a sorcery spell','do':[FH(zone='graveyard',fromEnchanted=1,copy=1),{'do':'if','cond':{'remIs':{}},'then':[{'do':'voluteMove'}]}]}],'clear':['']}
for _k,_v in CUSTOM2.items(): _v.setdefault('clear',[''])
