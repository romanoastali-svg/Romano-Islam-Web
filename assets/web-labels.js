(()=>{'use strict';
const author='Autor Huseini Halil Ibn Ramadan';
function apply(d){
 if(!d.body)return;
 if(!d.getElementById('ri-web-label-style')){const style=d.createElement('style');style.id='ri-web-label-style';style.textContent='.verse-search-button{display:none!important}.ri-web-author{flex:none!important;display:block;text-align:center;padding:7px 12px;margin:0;color:#e1c47f;background:#082d20;font:13px/1.4 system-ui,sans-serif}';d.head.append(style);}
 d.querySelectorAll('button,a').forEach(el=>{for(const node of el.childNodes){if(node.nodeType!==3)continue;const changed=node.textContent.replace(/\bNazad\b/g,'Palal').replace(/\bTraži\b/g,'Rode');if(changed!==node.textContent)node.textContent=changed;}});
 d.querySelectorAll('input[type="search"]').forEach(input=>{if(/^Pretraži/i.test(input.placeholder))input.placeholder='Rode o lafja';});
 d.querySelectorAll('.drawer-credit,footer.credit').forEach(el=>{if(el.textContent!==author)el.textContent=author;});
 if(!d.querySelector('.ri-web-author')){const signature=d.createElement('p');signature.className='ri-web-author';signature.textContent=author;(d.getElementById('content')||d.querySelector('body>footer')||d.body).append(signature);}
}
function bind(d){
 if(!d?.body||d.documentElement.dataset.riWebLabels==='1')return;
 d.documentElement.dataset.riWebLabels='1';apply(d);
 const observer=new d.defaultView.MutationObserver(()=>apply(d));observer.observe(d.body,{subtree:true,childList:true,characterData:true});
 d.addEventListener('click',event=>{
  const el=event.target.closest('[data-page="aplikacija"],[data-module-url],a[href]');if(!el)return;
  const url=el.getAttribute('data-module-url')||el.getAttribute('href')||'';
  if(el.dataset.page!=='aplikacija'&&!/^(?:https?:\/\/)?app\.romano-islam\.de(?:\/|$)/i.test(url)&&url!=='#aplikacija')return;
  event.preventDefault();event.stopImmediatePropagation();
  let dialog=d.getElementById('ri-web-app-message');if(!dialog){dialog=d.createElement('dialog');dialog.id='ri-web-app-message';dialog.style.cssText='max-width:90vw;width:560px;padding:28px;border:1px solid #b9954d;border-radius:14px;background:#082d20;color:#e1c47f;font:20px/1.6 system-ui;text-align:center';const p=d.createElement('p');p.textContent='Aplikacija panda nane dostupno, čerela pe';const close=d.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Phand');close.style.cssText='padding:4px 18px;font-size:25px;background:#d9c58d;color:#102c26;border:0;border-radius:8px';close.onclick=()=>dialog.close();dialog.append(p,close);d.body.append(dialog);}dialog.showModal();
 },true);
}
bind(document);
const frame=document.getElementById('moduleFrame');
if(frame){const mount=()=>{try{bind(frame.contentDocument);}catch{}};frame.addEventListener('load',mount);if(frame.contentDocument?.readyState==='complete')mount();}
})();
