(function(){
const $=s=>document.querySelector(s);
const START=Date.UTC(2026,9,3);
const todayN=()=>Math.max(1,Math.floor((Date.now()-START)/864e5)+1);
let lang='en';
const L=()=>0;
const T={en:{
 brand:"LAST HUMAN JOB INC.",h1:"The Last Human Job",tag:"AI does all the work now. You just sign off on it.",
 how:"5 documents. About 60 seconds. Read carefully - somebody has to take the blame.",
 start:"Start today's shift",again:"Practice mode",shift:n=>`SHIFT #${n}`,ot:"OVERTIME",streak:d=>d>1?`${d}-day streak`:"Day 1 on the job",
 done:"Today's shift is complete",resume:"See today's review",
 ask:"YOU ASKED THE AI",kind:"AI OUTPUT",unrev:"UNREVIEWED",conf:["Confidence: 99.9%","Confidence: absolute","Proofread by: nobody","Typos: none (probably)","Double-checked by: itself"],
 sig:"Human signature required",reject:"REJECT",approve:"APPROVE",rj:"REJECTED",ap:"APPROVED",next:"Next case",finish:"See my review",
 catch:"CAUGHT IT",clear:"SMOOTH SIGN-OFF",miss:"DISASTER SIGNED",false:"FALSE ALARM",without:"Without you",result:"What happened",
 of:(a,b)=>`CASE ${a} / ${b}`,
 review:"PERFORMANCE REVIEW",caught:"CAUGHT",disasters:"DISASTERS",falseal:"FALSE ALARMS",titleLbl:"TITLE AWARDED",
 head:(n,m)=>`Today I caught ${n} AI screw-up${n==1?'':'s'} and signed off on ${m==0?'zero':m} disaster${m==1?'':'s'}.`,
 share:"Share",save:"Save image",copy:"Copy link",copied:"Copied!",saved:"Saved!",
 cta:"Can you do better?",cta2:"Play today's shift",back:"New shift in",
 out:{catch:"CAUGHT",clear:"CLEARED",miss:"DISASTER",false:"FALSE ALARM"},
 foot:"Free. No login. Nothing leaves your device. Same 5 cases for everyone, every day.",
 shareText:(n,m,t,u)=>`Today I caught ${n} AI screw-up${n==1?'':'s'} and signed off on ${m==0?'zero':m} disaster${m==1?'':'s'}. Title: ${t}. Can you do better? ${u}`,
 warn:"Rule 1: the AI is usually right. Rule 2: see rule 1, then read again."},
};
const t=k=>T[lang][k];
// rng
function xmur3(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^=h>>>16)>>>0}}
function rng(seed){let a=xmur3(seed)();return function(){a|=0;a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function makeSet(seed){
  const r=seed?rng(seed):Math.random,idx=[...SC.keys()];
  for(let i=idx.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]]}
  const pick=idx.slice(0,5),nb=seed?2+(r()<.5?1:0):1+Math.floor(r()*4),pos=[0,1,2,3,4];
  for(let i=4;i>0;i--){const j=Math.floor(r()*(i+1));[pos[i],pos[j]]=[pos[j],pos[i]]}
  const bad=new Set(pos.slice(0,nb));
  return pick.map((s,i)=>({s,bad:bad.has(i),conf:Math.floor(r()*5),fq:Math.floor(r()*FALSE.length)}));
}
const store=()=>{try{return JSON.parse(localStorage.lhj||'{}')}catch(e){return{}}};
const save=o=>{try{localStorage.lhj=JSON.stringify(o)}catch(e){}};
let st={day:0,daily:true,cases:[],i:0,res:[],locked:false};
function params(){const q=new URLSearchParams(location.search);let d=parseInt(q.get('day'),10);return{day:d>0&&d<100000?d:todayN(),has:q.has('day'),og:q.has('og'),demo:q.get('demo')}}
const P=params();
function show(id){['intro','play','result'].forEach(x=>$('#'+x).hidden=x!==id);window.scrollTo(0,0);document.body.dataset.screen=id}
function esc(s){return s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function docHTML(c){
  const sc=SC[c.s],i=L(),lines=(c.bad?sc.bad:sc.good)[i];
  let rows='';
  lines.forEach(l=>{if(l.includes('||')){const [a,b]=l.split('||');rows+=b===''?`<div class="sub">${esc(a)}</div>`:`<div class="row"><span class="lb">${esc(a)}</span><span class="vl">${esc(b)}</span></div>`}else rows+=`<p>${esc(l)}</p>`});
  return `<div class="dh"><span class="ico">${sc.e}</span><div><b>${esc(sc.k[i])}</b><small>${t('kind')} - ${t('unrev')}</small></div></div><div class="db">${rows}</div><div class="df"><span>${t('conf')[c.conf]}</span><span class="sigline">${t('sig')}: <i></i></span></div>`;
}
function renderCase(){
  const c=st.cases[st.i],sc=SC[c.s],i=L();
  $('#progress').innerHTML=st.cases.map((_,k)=>`<i class="${k<st.i?'d '+st.res[k]:k===st.i?'cur':''}"></i>`).join('');
  $('#cno').textContent=t('of')(st.i+1,5);
  $('#askt').textContent=t('ask');$('#ask').textContent=sc.ask[i];
  const d=$('#doc');d.className='doc';d.innerHTML=docHTML(c)+'<div class="stamp" id="stamp"></div>';
  $('#verdict').hidden=true;$('#bar').hidden=false;st.locked=false;
  d.classList.remove('in');void d.offsetWidth;d.classList.add('in');
  $('#nx').hidden=true;
}
function stamp(approve){
  if(st.locked)return;st.locked=true;
  const c=st.cases[st.i],sc=SC[c.s],i=L();
  const out=c.bad?(approve?'miss':'catch'):(approve?'clear':'false');
  st.res[st.i]=out;
  const s=$('#stamp');s.textContent=approve?t('ap'):t('rj');s.className='stamp '+(approve?'ap':'rj')+' hit';
  if(navigator.vibrate)try{navigator.vibrate(approve?20:[15,30,15])}catch(e){}
  $('#bar').hidden=true;
  let body='';
  if(out==='catch')body=`<p>${esc(sc.wb[i])}</p><p class="mut"><b>${t('without')}:</b> ${esc(sc.ob[i])}</p>`;
  if(out==='miss')body=`<p>${esc(sc.wb[i])}</p><p class="bad"><b>${t('result')}:</b> ${esc(sc.ob[i])}</p>`;
  if(out==='clear')body=`<p>${esc(sc.wg[i])}</p>`;
  if(out==='false')body=`<p>${esc(sc.wg[i])}</p><p class="mut">${esc(FALSE[c.fq][i])}</p>`;
  const v=$('#verdict');v.className='verdict '+out;v.innerHTML=`<h3>${out==='catch'||out==='clear'?'✔':'✖'} ${t(out)}</h3>${body}`;
  setTimeout(()=>{v.hidden=false;v.classList.remove('pop');void v.offsetWidth;v.classList.add('pop');
    const nx=$('#nx');nx.hidden=false;nx.textContent=st.i===4?t('finish'):t('next');
    setTimeout(()=>v.scrollIntoView({behavior:'smooth',block:'nearest'}),50)},520);
}
function advance(){if(st.i<4){st.i++;renderCase();window.scrollTo(0,0)}else finishRun()}
function counts(res){const c={catch:0,clear:0,miss:0,false:0};res.forEach(r=>c[r]++);return c}
function titleOf(res){const c=counts(res);return TITLES[c.catch+c.clear]}
function finishRun(){
  const s=store();s.days=s.days||{};
  if(st.daily){s.days[st.day]=st.res;
    const k=todayN();
    if(st.day===k&&s.streak?.last!==k){const prev=s.streak||{};s.streak={n:(prev.last===k-1?prev.n||0:0)+1,last:k}}
    save(s)}
  showResult(st.res,st.cases,st.daily?st.day:0);
}
function showResult(res,cases,day){
  st.lastRes=res;st.lastCases=cases;st.lastDay=day;
  drawCard($('#card'),res,cases,day);$('#nx').hidden=true;$('#bar').hidden=true;show('result');
  const s=store();$('#streak').textContent=day===todayN()&&s.streak?t('streak')(s.streak.n):'';
  $('#card').classList.remove('print');void $('#card').offsetWidth;$('#card').classList.add('print');
  tick();
}
// canvas card
const F='"Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
const IMP='Impact,"Arial Black","Helvetica Neue",Arial,"PingFang SC","Microsoft YaHei",sans-serif';
function wrapText(g,s,x,y,maxw,lh,center){const zh=lang==='zh',toks=zh?[...s]:s.split(' ');let cur='';const lines=[];
  for(const w of toks){const tl=cur?(zh?cur+w:cur+' '+w):w;if(g.measureText(tl).width>maxw&&cur){lines.push(cur);cur=w}else cur=tl}
  if(cur)lines.push(cur);lines.forEach((l,i)=>{g.textAlign=center?'center':'left';g.fillText(l,x,y+i*lh)});return lines.length}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function bg(g,W,H){const gr=g.createLinearGradient(0,0,W,H);gr.addColorStop(0,'#0f172a');gr.addColorStop(1,'#1e2a4a');g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.strokeStyle='rgba(255,255,255,.04)';g.lineWidth=2;for(let x=0;x<W;x+=60){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}for(let y=0;y<H;y+=60){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}}
function inkStamp(g,text,cx,cy,rot,col,size,maxw){g.save();g.font=`bold ${size}px ${IMP}`;let lines=[text];
  if(maxw&&g.measureText(text).width+size*.9>maxw){const w=text.split(' '),m=Math.ceil(w.length/2);lines=[w.slice(0,m).join(' '),w.slice(m).join(' ')];
    while(size>20&&Math.max(...lines.map(l=>g.measureText(l).width))+size*.9>maxw){size-=2;g.font=`bold ${size}px ${IMP}`}}
  g.translate(cx,cy);g.rotate(rot);g.textAlign='center';g.textBaseline='middle';
  const w=Math.max(...lines.map(l=>g.measureText(l).width))+size*.9,lh=size*1.15,h=lines.length*lh+size*.4;
  g.strokeStyle=col;g.fillStyle=col;g.lineWidth=size*.12;g.globalAlpha=.9;rr(g,-w/2,-h/2,w,h,size*.2);g.stroke();g.lineWidth=size*.04;rr(g,-w/2+size*.14,-h/2+size*.14,w-size*.28,h-size*.28,size*.1);g.stroke();
  lines.forEach((l,k)=>g.fillText(l,0,(k-(lines.length-1)/2)*lh+size*.04));g.restore();g.textBaseline='alphabetic'}
function drawCard(cv,res,cases,day){
  const W=1080,H=1920,c=cv.getContext?cv:null;cv.width=W;cv.height=H;const g=cv.getContext('2d'),i=L(),cn=counts(res);
  bg(g,W,H);
  g.fillStyle='rgba(255,255,255,.75)';g.font=`bold 34px ${F}`;g.textAlign='center';g.fillText(t('brand'),W/2,100);
  // paper
  g.save();g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=70;g.shadowOffsetY=30;g.fillStyle='#fbf8f0';rr(g,60,140,960,1560,26);g.fill();g.restore();
  g.fillStyle='#c0392b';g.fillRect(60,140,960,18);
  g.fillStyle='#1f2937';g.textAlign='left';g.font=`bold 38px ${F}`;g.fillText(t('review'),110,230);
  g.font=`32px ${F}`;g.fillStyle='#6b7280';g.textAlign='right';
  const dt=new Date(START+(Math.max(day,1)-1)*864e5);
  g.fillText((day?t('shift')(day):t('ot'))+(day?'  -  '+dt.toISOString().slice(0,10):''),970,230);
  g.strokeStyle='#d6d3c8';g.lineWidth=3;g.setLineDash([12,10]);g.beginPath();g.moveTo(110,262);g.lineTo(970,262);g.stroke();g.setLineDash([]);
  g.fillStyle='#111827';g.font=`bold 66px ${F}`;wrapText(g,t('head')(cn.catch,cn.miss),110,350,860,82,false);
  // stats
  const sy=640,boxes=[[cn.catch,t('caught'),'#15803d'],[cn.miss,t('disasters'),'#b91c1c']];if(cn.false)boxes.push([cn.false,t('falseal'),'#b45309']);
  const bw=(860-(boxes.length-1)*24)/boxes.length;
  boxes.forEach((b,k)=>{const x=110+k*(bw+24);g.fillStyle='#f1ede0';rr(g,x,sy,bw,200,20);g.fill();g.fillStyle=b[2];g.font=`bold 110px ${F}`;g.textAlign='center';g.fillText(b[0],x+bw/2,sy+118);g.font=`bold 26px ${F}`;g.fillText(b[1],x+bw/2,sy+168)});
  // rows
  const cols={catch:'#15803d',clear:'#15803d',miss:'#b91c1c',false:'#b45309'};
  res.forEach((r,k)=>{const y=900+k*108;g.fillStyle='#9ca3af';g.font=`bold 34px ${F}`;g.textAlign='left';g.fillText(String(k+1).padStart(2,'0'),110,y+58);
    g.fillStyle='#1f2937';g.font=`36px ${F}`;g.fillText(SC[cases[k].s].n[i],185,y+58);
    const lab=t('out')[r];g.font=`bold 26px ${F}`;const w=g.measureText(lab).width+44;
    g.fillStyle=cols[r];rr(g,970-w,y+18,w,56,12);g.fill();g.fillStyle='#fff';g.textAlign='center';g.fillText(lab,970-w/2,y+57);
    g.strokeStyle='#e5e1d3';g.lineWidth=2;g.beginPath();g.moveTo(110,y+96);g.lineTo(970,y+96);g.stroke()});
  // title
  g.fillStyle='#6b7280';g.font=`bold 28px ${F}`;g.textAlign='center';g.fillText(t('titleLbl'),W/2,1478);
  const title=titleOf(res)[i],good=cn.catch+cn.clear>=4;
  inkStamp(g,title.toUpperCase(),W/2,1600,-0.04,good?'#b91c1c':'#7c2d12',64,800);
  // footer
  g.fillStyle='#fff';g.textAlign='center';g.font=`bold 52px ${F}`;g.fillText(t('cta'),W/2,1790);
  g.font=`bold 40px ${F}`;g.fillStyle='#fbbf24';g.fillText(location.host+location.pathname.replace(/\/$/,''),W/2,1850);
}
function drawOG(cv){
  const W=1200,H=630;cv.width=W;cv.height=H;const g=cv.getContext('2d');bg(g,W,H);
  const res=['catch','miss','clear','catch','false'],cases=makeSet('lhj-og'),tmp=document.createElement('canvas');
  const sv=lang;lang='en';drawCard(tmp,res,cases,1);lang=sv;
  g.save();g.translate(930,330);g.rotate(.07);g.shadowColor='rgba(0,0,0,.5)';g.shadowBlur=40;g.drawImage(tmp,-200,-330,400,711);g.restore();
  g.fillStyle='#fbbf24';g.font=`bold 30px ${F}`;g.textAlign='left';g.fillText('LAST HUMAN JOB INC.',70,110);
  g.fillStyle='#fff';g.font=`bold 96px ${IMP}`;g.fillText('THE LAST',70,230);g.fillText('HUMAN JOB',70,330);
  g.font=`bold 36px ${F}`;g.fillStyle='rgba(255,255,255,.9)';g.fillText('AI does all the work now.',70,410);g.fillText('You just sign off on it.',70,455);
  inkStamp(g,'APPROVE OR REJECT?',330,550,-.05,'#f87171',40);
}
function tick(){const n=Date.now(),next=Date.now()<START?START:START+todayN()*864e5,s=Math.max(0,Math.floor((next-n)/1000)),p=v=>String(v).padStart(2,'0');
  $('#cd').textContent=`${t('back')} ${p(Math.floor(s/3600))}:${p(Math.floor(s%3600/60))}:${p(s%60)} UTC`}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1800)}
function shareLink(){return location.origin+location.pathname+(st.lastDay?'?day='+st.lastDay:'')}
function ui(){
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  $('#brand').textContent=t('brand');
  $('#h1').textContent=t('h1');$('#tag').textContent=t('tag');$('#how').textContent=t('how');$('#warn').textContent=t('warn');
  const s=store(),done=!P.demo&&s.days&&s.days[P.day];
  $('#start').textContent=done?t('resume'):t('start');$('#prac').textContent=t('again');
  $('#shiftno').textContent=t('shift')(P.day);$('#intstreak').textContent=s.streak&&s.streak.last>=todayN()-1?t('streak')(s.streak.n):'';
  $('#rj').textContent=t('reject');$('#ap').textContent=t('approve');
  $('#share').textContent=t('share');$('#dl').textContent=t('save');$('#copy').textContent=t('copy');$('#prac2').textContent=t('again');$('#cta2').textContent=t('cta2');
  $('.foot').forEach?0:0;document.querySelectorAll('.foot').forEach(e=>e.textContent=t('foot'));
  if(st.cases.length&&!$('#play').hidden)renderCase();
  if(!$('#result').hidden)drawCard($('#card'),st.lastRes,st.lastCases,st.lastDay);
  
}
function startDaily(){const s=store(),done=s.days&&s.days[P.day];const cases=makeSet('lhj-day-'+P.day);
  if(done&&!P.demo){showResult(done,cases,P.day);return}
  st={day:P.day,daily:true,cases,i:0,res:[],locked:false};show('play');renderCase()}
function startPractice(){st={day:0,daily:false,cases:makeSet(null),i:0,res:[],locked:false};show('play');renderCase()}
async function getBlob(){const src=$('#card');const c=document.createElement('canvas');c.width=src.width;c.height=src.height;c.getContext('2d').drawImage(src,0,0);return new Promise(r=>c.toBlob(r,'image/png'))}
document.addEventListener('DOMContentLoaded',()=>{
  if(P.og){document.body.innerHTML='<canvas id="ogc" style="display:block"></canvas>';drawOG($('#ogc'));return}
  $('#start').onclick=startDaily;$('#prac').onclick=startPractice;$('#prac2').onclick=startPractice;
  $('#cta2').onclick=()=>{show('intro');ui()};
  $('#rj').onclick=()=>stamp(false);$('#ap').onclick=()=>stamp(true);$('#nx').onclick=advance;
  $('#home').onclick=()=>{show('intro');ui()};
  $('#copy').onclick=async()=>{const c=counts(st.lastRes),tx=t('shareText')(c.catch,c.miss,titleOf(st.lastRes)[L()],shareLink());try{await navigator.clipboard.writeText(tx)}catch(e){const i=document.createElement('textarea');i.value=tx;document.body.appendChild(i);i.select();document.execCommand('copy');i.remove()}toast(t('copied'))};
  $('#dl').onclick=async()=>{const b=await getBlob();const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='last-human-job-review.png';a.click();toast(t('saved'))};
  $('#share').onclick=async()=>{const b=await getBlob(),c=counts(st.lastRes),tx=t('shareText')(c.catch,c.miss,titleOf(st.lastRes)[L()],shareLink());
    const f=new File([b],'last-human-job-review.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],text:tx});return}catch(e){if(e.name==='AbortError')return}}
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='last-human-job-review.png';a.click();try{await navigator.clipboard.writeText(tx)}catch(e){}toast(t('saved')+' '+t('copied'))};
  ui();show('intro');setInterval(tick,1000);
  if(P.demo){startDaily();const seq=P.demo.split('').map(x=>x==='a');seq.forEach((a,k)=>{});window.__demo=seq}
});
window.__lhj={stamp,advance,st:()=>st};
})();
