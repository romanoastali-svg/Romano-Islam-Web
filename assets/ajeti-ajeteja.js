(()=>{'use strict';
const passages=[{"id":"bismillah","keys":["1:1"],"expression":["1:1"],"refs":["5:15","5:16","7:156","10:38","11:13","9:86","24:1"],"source":1},{"id":"allah","keys":["1:1"],"expression":"اللَّهِ","refs":["43:87","6:136"],"source":1},{"id":"rahman","keys":["1:1"],"expression":"الرَّحْمَٰنِ","refs":["20:5","19:75"],"source":1},{"id":"rahim","keys":["1:1"],"expression":"الرَّحِيمِ","refs":["33:43","9:117"],"source":1},{"id":"hamd","keys":["1:2"],"expression":"الْحَمْدُ لِلَّهِ","refs":["40:62","32:7","39:4","20:111","20:8","7:180","37:159","37:160","23:28","14:39","27:93","27:15","10:10","42:5","13:13","17:44","20:110","16:74"],"source":1},{"id":"alamin","keys":["1:2"],"expression":"الْعَالَمِينَ","refs":["3:42","25:1","7:80"],"source":1},{"id":"malik","keys":["1:4"],"expression":["1:4"],"refs":["40:16"],"source":1},{"id":"sirat","keys":["1:6","1:7"],"expression":["1:6","1:7"],"refs":["84:6","64:3","42:53","36:60","36:61","2:186","40:60","41:44","7:40","20:81","2:108","58:11","2:108","36:60","36:61","14:22","6:82","6:82","4:69","4:65","4:66","57:19","58:11","29:69","12:108","31:15","4:115","5:15","5:16","12:106","36:61","6:161","13:17","4:175","6:125","6:126","15:41","15:42","35:43","46:19","13:17","4:69","5:55","28:56","4:68","42:52","40:38","28:56","6:125","39:23","29:69","13:17","58:11"],"source":1}];
const sourcePages={
 first:'https://al-islam.org/al-mizan-exegesis-quran-volume-1-sayyid-muhammad-husayn-tabatabai/surah-al-fatiha-verses-1-5',
 joint:'https://al-islam.org/al-mizan-exegesis-quran-volume-1-sayyid-muhammad-husayn-tabatabai/surah-al-fatiha-verses-6-7'
};
const data=JSON.parse(document.getElementById('appData').textContent),$=id=>document.getElementById(id);
const modal=$('ri-fatiha-modal'),opened=$('ri-fatiha-opened');
if(!modal||!opened)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let previousFocus=null,activeKey='',activeContext='*',origin=null;
const back=document.createElement('button');back.type='button';back.className='ri-return-to-reference';back.textContent='← Irintu';back.setAttribute('aria-label','Irintu — vrati se na prethodno mjesto i otvorene ajete');document.body.append(back);
function expression(p){return Array.isArray(p.expression)?p.expression.map(k=>data.arabic[k]).join('\n'):p.expression;}
function open(key,context='*'){
 const selected=passages.filter(p=>p.keys.includes(key)&&(context==='*'||p.id===context));if(!selected.length)return;
 previousFocus=document.activeElement;activeKey=key;activeContext=context;
 const joint=selected.length===1&&selected[0].keys.length>1;
 $('ri-fatiha-heading').textContent='Ajeti Ajeteja · '+(joint?selected[0].keys.join('–'):key);
 modal.dataset.riKey=key;modal.dataset.riContext=context;
 $('ri-fatiha-notice').replaceChildren();$('ri-fatiha-notice').hidden=true;
 $('ri-fatiha-grid').replaceChildren();$('ri-fatiha-grid').hidden=true;opened.replaceChildren();
 for(const p of selected){
  const section=document.createElement('section');section.className='ri-ajeti-passage';section.dataset.passage=p.id;section.dataset.sourceUrl=p.id==='sirat'?sourcePages.joint:sourcePages.first;
  const label=document.createElement('header');label.className='ri-ajeti-expression';
  label.innerHTML='<p class="ri-fatiha-ar" lang="ar" dir="rtl">'+esc(expression(p))+'</p><span class="ri-ajeti-source">'+p.source+'</span>';
  if(Array.isArray(p.expression))for(const key of p.expression){const bs=document.createElement('p');bs.className='ri-fatiha-bs';bs.lang='bs';bs.textContent=data.mlivo[key];label.append(bs);}
  section.append(label);
  for(const [index,ref] of p.refs.entries()){
   const article=document.createElement('article');article.className='ri-ajeti-reference';article.dataset.ref=ref;article.dataset.source=String(p.source);article.dataset.position=String(index);
   article.innerHTML='<h3>'+esc(ref)+'</h3><p class="ri-fatiha-ar" lang="ar" dir="rtl">'+esc(data.arabic[ref])+'</p><p class="ri-fatiha-bs" lang="bs">'+esc(data.mlivo[ref])+'</p>';
   const jump=document.createElement('button');jump.type='button';jump.className='ri-go-to-verse';jump.dataset.ref=ref;jump.textContent='Dža ko ajeti →';article.append(jump);section.append(article);
  }
  opened.append(section);
 }
 modal.hidden=false;modal.classList.add('ri-active');modal.querySelector('.ri-fatiha-panel').scrollTop=0;$('ri-fatiha-close').focus();
}
function close(){modal.classList.remove('ri-active');modal.hidden=true;if(previousFocus?.isConnected)previousFocus.focus();}
$('ri-fatiha-close').addEventListener('click',close);
modal.addEventListener('click',e=>{if(e.target===modal)close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close();});
function marker(key,context){const b=document.createElement('button');b.type='button';b.className='ri-footnote';b.textContent='1';b.dataset.passage=context;b.setAttribute('aria-label','Ajeti Ajeteja · 1');b.addEventListener('click',()=>open(key,context));return b;}
function attachToExpression(article,key,p){
 const arabic=article.querySelector('p.arabic');if(!arabic||Array.isArray(p.expression))return;
 const walk=document.createTreeWalker(arabic,NodeFilter.SHOW_TEXT);let node;
 while((node=walk.nextNode())){
  if(node.parentElement.closest('button'))continue;
  const at=node.data.indexOf(p.expression);if(at<0)continue;
  const tail=node.splitText(at+p.expression.length);tail.before(marker(key,p.id));return;
 }
}
function decorate(root,mode){
 for(const article of root.querySelectorAll('article.verse')){
  const match=(article.id||'').match(new RegExp('^'+mode+'-1-([1-7])$'));if(!match||article.querySelector('.ri-ajeti-launch'))continue;
  const key='1:'+match[1],selected=passages.filter(p=>p.keys.includes(key));if(!selected.length)continue;
  for(const p of selected)attachToExpression(article,key,p);
  const b=document.createElement('button');b.type='button';b.className='button ri-ajeti-launch';b.textContent='Ajeti Ajeteja · 1';b.dataset.key=key;b.addEventListener('click',()=>open(key));article.append(b);
 }
}
for(const [id,mode] of [['readerVerses','reader'],['romaneVerses','romane']]){
 const root=$(id);if(!root)continue;let queued=false;
 const render=()=>{queued=false;decorate(root,mode);};render();
 new MutationObserver(records=>{if(queued||!records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('article.verse')||n.querySelector?.('article.verse')))))return;queued=true;queueMicrotask(render);}).observe(root,{childList:true,subtree:true});
}
function routeName(){return (document.documentElement.dataset.riRoute||location.hash.slice(1))==='romane'?'romane':'reader';}
function routeTo(mode){if(window.romanoApp?.openRoute)window.romanoApp.openRoute(mode);else location.hash=mode;}
function selectVerse(mode,s,a){
 const surah=$(mode==='romane'?'romaneSurah':'readerSurah'),ayah=$(mode==='romane'?'romaneAyah':'readerAyah'),action=$(mode==='romane'?'romaneOpen':'openAyah');
 if(!surah||!ayah||!action)return false;
 // Preserve a deliberate navigation while audio is playing.
 $(mode==='romane'?'romaneBody':'readerBody').dispatchEvent(new Event('wheel'));
 surah.value=String(s);surah.dispatchEvent(new Event('change',{bubbles:true}));ayah.value=String(a);action.click();
 const picker=$(mode==='romane'?'romanePicker':'readerPicker');if(picker)picker.open=false;return true;
}
const afterRender=fn=>requestAnimationFrame(()=>requestAnimationFrame(fn));
opened.addEventListener('click',e=>{
 const b=e.target.closest('.ri-go-to-verse');if(!b)return;
 const ref=b.dataset.ref;if(!/^\d{1,3}:\d{1,3}$/.test(ref))return;
 const mode=routeName(),body=$(mode==='romane'?'romaneBody':'readerBody'),surah=$(mode==='romane'?'romaneSurah':'readerSurah'),ayah=$(mode==='romane'?'romaneAyah':'readerAyah');
 origin={mode,sura:Number(surah.value),ayah:Number(ayah.value),scroll:body.scrollTop,windowScroll:window.scrollY,key:activeKey,context:activeContext,panelScroll:modal.querySelector('.ri-fatiha-panel').scrollTop};
 close();routeTo(mode);const [s,a]=ref.split(':').map(Number);if(!selectVerse(mode,s,a)){origin=null;return;}back.classList.add('ri-shown');
 afterRender(()=>{const target=$(mode+'-'+s+'-'+a);if(target)body.scrollTop=Math.max(0,target.getBoundingClientRect().top-body.getBoundingClientRect().top+body.scrollTop-12);});
});
back.addEventListener('click',()=>{
 const saved=origin;if(!saved)return;origin=null;back.classList.remove('ri-shown');routeTo(saved.mode);if(!selectVerse(saved.mode,saved.sura,saved.ayah))return;
 afterRender(()=>{const body=$(saved.mode==='romane'?'romaneBody':'readerBody');body.scrollTop=saved.scroll;window.scrollTo({top:saved.windowScroll,behavior:'instant'});open(saved.key,saved.context);modal.querySelector('.ri-fatiha-panel').scrollTop=saved.panelScroll;});
});
window.riAjetiAjeteja={open,close};
})();
