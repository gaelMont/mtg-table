module.exports=async c=>{const {add,zb,go,res,T,S,sleep,pk,log,perm,act,ans,tg,flush,q,zone}=c;const W=c.w;
 const btns=n=>[...c.w.document.querySelectorAll('.zc')].filter(z=>z.textContent.includes(n)).map(z=>[...z.querySelectorAll('button')].map(b=>b.textContent).join(' / ')).join(' || ');
 await add('Divination','graveyard');await add('Lightning Bolt','graveyard');await add('Recoup','hand');
 zb('Recoup','zcast');await sleep(40);T('Recoup pick '+pk().slice(0,250));tg('Divination','0');await sleep(10);go();await sleep(40);res();await sleep(60);log(1);
 T('Divination : '+btns('Divination')+' | Bolt : '+btns('Lightning Bolt'));
 await add('Dregscape Sliver','battlefield');await add('Muscle Sliver','graveyard');await sleep(20);T('Dregscape : '+btns('Muscle Sliver'));
};
