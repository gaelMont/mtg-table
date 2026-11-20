module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 const btns=n=>[...c.w.document.querySelectorAll('.zc')].filter(z=>z.textContent.includes(n)).map(z=>[...z.querySelectorAll('button')].map(b=>b.textContent).join(' / ')).join(' || ');
 // 1. Lier : éphémères et rituels de ton cimetière ont le flashback
 await add('Lightning Bolt','graveyard');await add('Grizzly Bears','graveyard');
 T('sans Lier : '+btns('Lightning Bolt'));
 await add('Lier, Disciple of the Drowned','battlefield');await sleep(20);
 T('avec Lier : '+btns('Lightning Bolt')+' | ours : '+btns('Grizzly Bears'));
 zb('Lightning Bolt','zcast');await sleep(40);T('Bolt pick '+pk().slice(0,260));
 tg('Adversaire','0');await sleep(10);go();await sleep(40);res();await sleep(40);log(1);
 T('Bolt exil : '+zone('p1','exile').join(',')+' | cimetière : '+zone('p1','graveyard').join(','));
 // 2. Underworld Breach : évasion accordée
 await add('Underworld Breach','battlefield');await add('Divination','graveyard');await add('Island','graveyard');await add('Swamp','graveyard');await add('Forest','graveyard');await sleep(20);
 T('Breach : '+btns('Divination'));
 await add('Opt','graveyard');W.__js(`S.perms=S.perms.filter(p=>!['Lier, Disciple of the Drowned','Underworld Breach'].includes(p.card.name));render();`);await sleep(20);T('sans Lier ni Breach, Opt : '+btns('Opt'));
 // 3. Snapcaster : la carte ciblée acquiert le flashback
 await add('Snapcaster Mage','hand');zb('Snapcaster Mage','zcast');await sleep(40);go();await sleep(40);res();await sleep(40);
 T('Snap pending '+S().pending.map(t=>t.srcName));const sel=q('#pendZone select[data-act=tgsel]');T('opts '+(sel?[...sel.options].map(o=>o.textContent).join('|'):'pas de select'));const oo=sel&&[...sel.options].find(o=>o.textContent.includes('Opt'));if(oo){sel.value=oo.value;sel.dispatchEvent(new c.w.Event('change',{bubbles:true}));await sleep(20);}
 q('[data-act=pushpend]')?.click();await sleep(30);res();await sleep(40);log(1);
 T('Opt : '+btns('Opt')+' | Divination : '+btns('Divination'));
 // 4. Mishra : exhumation accordée aux artefacts
 await add('Mishra, Tamer of Mak Fawa','battlefield');await add('Sol Ring','graveyard');await sleep(20);
 T('Mishra : '+btns('Sol Ring'));
 // 5. Jo Grant : cyclage {2}{W} pour les cartes historiques de ta main
 await add('Jo Grant','battlefield');await add('Sol Ring','hand');await add('Grizzly Bears','hand');await add('Island','library');await sleep(20);
 T('Jo Grant Sol Ring : '+btns('Sol Ring')+' | ours main : '+btns('Grizzly Bears'));
 const nh=zone('p1','hand').length;zb('Sol Ring','zact');await sleep(40);T('cycle pick '+pk().slice(0,200));go();await sleep(40);res();await sleep(40);log(1);
 T('main : '+zone('p1','hand').join(',')+' | cimetière contient Sol Ring : '+zone('p1','graveyard').includes('Sol Ring'));
 // 6. Tannuk : warp {2}{R} pour les artefacts et créatures rouges de ta main
 await add('Tannuk, Steadfast Second','battlefield');await add('Shivan Dragon','hand');await sleep(20);
 T('Tannuk dragon : '+btns('Shivan Dragon')+' | ours : '+btns('Grizzly Bears'));
 zb('Shivan Dragon','zcast');await sleep(40);T('dragon pick : '+pk().slice(0,500));
};
