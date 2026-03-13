// ============================================================
// MORNING MATE v3 — Complete App Logic
// ============================================================

// ── STATE ──────────────────────────────────────────────────
let S = {
  momName: '',
  leaveHour: 8, leaveMin: '15', leaveAmPm: 'AM',
  meltdownMins: 35,
  wakeTime: null,
  children: [],
  activeChild: 0,
  activeBagChild: 0,
  mumTasksDone: {},   // { date: {id:bool} }
  childTasksDone: {}, // { childId: {date:{id:bool}} }
  bagItems: {},       // { childId: [...] }
  bagChecked: {},     // { childId_date: {id:bool} }
  nightDone: {},      // { date: {id:bool} }
  streak: [],         // ['2025-03-13',...]
  smoothMornings: 0,
  photos: {},         // { childId_date_taskId: dataUrl }
  isPlusUser: false,
  trialActive: false,
  obSelectedAge: 7,
  obSelectedAvatar: '🦊',
  ncSelectedAge: 7,
  ncSelectedAvatar: '🦊',
  scriptIdx: 0,
  timerInterval: null,
  timerDoneCallback: null,
  pinBuffer: [],
  PIN: '1234',
  onboarded: false,
};

// ── DEFAULT DATA ────────────────────────────────────────────
const MOM_TASKS = [
  {id:'m1',emoji:'⏰',label:'Wake up 20 mins before kids',sub:'Your secret superpower'},
  {id:'m2',emoji:'💧',label:'Drink a glass of water',sub:'Hydrate first'},
  {id:'m3',emoji:'🚿',label:'Quick shower / freshen up',sub:'You first, always'},
  {id:'m4',emoji:'👗',label:'Get dressed',sub:'Before the chaos starts'},
  {id:'m5',emoji:'☕',label:'Make yourself a coffee',sub:'You deserve it, Mom'},
];

const CHILD_TASKS = {
  '5-7': [
    {id:'t1',emoji:'🛏️',label:'Get out of bed',sub:'Rise and shine!',secs:120},
    {id:'t2',emoji:'🚽',label:'Bathroom visit',sub:'First thing!',secs:120},
    {id:'t3',emoji:'☀️',label:'Get dressed',sub:'Clothes are laid out',secs:180},
    {id:'t4',emoji:'🧦',label:'Socks & shoes on',sub:'Check they\'re comfy',secs:120},
    {id:'t5',emoji:'🍎',label:'Eat breakfast',sub:'Fuel for school!',secs:600},
    {id:'t6',emoji:'🪥',label:'Brush teeth',sub:'2 whole minutes!',secs:120},
    {id:'t7',emoji:'🎒',label:'Grab school bag',sub:'Already packed?',secs:60},
    {id:'t8',emoji:'🚀',label:'Ready to go!',sub:'You did it!',secs:30},
  ],
  '8-10': [
    {id:'t1',emoji:'🛏️',label:'Get out of bed',sub:'You\'ve got this!',secs:120},
    {id:'t2',emoji:'🚽',label:'Bathroom & wash up',sub:'Before breakfast',secs:120},
    {id:'t3',emoji:'☀️',label:'Get dressed',sub:'Pick your outfit!',secs:180},
    {id:'t4',emoji:'🍎',label:'Eat breakfast',sub:'Eat it all up!',secs:600},
    {id:'t5',emoji:'🪥',label:'Brush teeth',sub:'2 full minutes',secs:120},
    {id:'t6',emoji:'💆',label:'Hair done',sub:'Looking great!',secs:60},
    {id:'t7',emoji:'🎒',label:'Pack school bag',sub:'Check your list',secs:120},
    {id:'t8',emoji:'🧥',label:'Coat & shoes ready',sub:'Check the weather',secs:60},
    {id:'t9',emoji:'🚀',label:'Ready to go!',sub:'Crushing it!',secs:30},
  ],
  '11+': [
    {id:'t1',emoji:'⏰',label:'Wake up (your alarm!)',sub:'Total independence',secs:120},
    {id:'t2',emoji:'🚿',label:'Shower, dress & hair',sub:'Full independence',secs:600},
    {id:'t3',emoji:'🍎',label:'Eat breakfast',sub:'Don\'t skip it',secs:600},
    {id:'t4',emoji:'🪥',label:'Brush teeth',sub:'2 min minimum',secs:120},
    {id:'t5',emoji:'🎒',label:'Pack bag yourself',sub:'Everything in?',secs:120},
    {id:'t6',emoji:'📱',label:'Phone charged & packed',sub:'Don\'t forget it',secs:60},
    {id:'t7',emoji:'✅',label:'Final bag check',sub:'Homework? PE kit?',secs:60},
    {id:'t8',emoji:'🚀',label:'Ready for drop-off!',sub:'Let\'s go!',secs:30},
  ],
};

const BAG_DEFAULTS = [
  {id:'b1',name:'Water bottle',day:'daily',emoji:'💧'},
  {id:'b2',name:'Lunch box',day:'daily',emoji:'🥪'},
  {id:'b3',name:'Reading folder',day:'daily',emoji:'📂'},
  {id:'b4',name:'PE Kit',day:'Wednesday',emoji:'👟'},
  {id:'b5',name:'Library book',day:'Friday',emoji:'📚'},
  {id:'b6',name:'Homework',day:'daily',emoji:'📝'},
];

const NIGHT_TASKS = [
  {id:'n1',emoji:'👗',label:'Lay out tomorrow\'s outfit'},
  {id:'n2',emoji:'🎒',label:'Pack the school bag'},
  {id:'n3',emoji:'🥪',label:'Prep tomorrow\'s lunch box'},
  {id:'n4',emoji:'📝',label:'Sign any school forms'},
  {id:'n5',emoji:'🔋',label:'Charge all devices'},
  {id:'n6',emoji:'👟',label:'PE kit by the door'},
  {id:'n7',emoji:'⏰',label:'Set morning alarm'},
  {id:'n8',emoji:'🌙',label:'Kids in bed on time'},
];

const CALM_SCRIPTS = [
  'We are doing one thing at a time. Just one thing. That\'s all.',
  'I am calm. I set the tone. My kids follow my lead.',
  'This is hard but I am doing my best. That is enough.',
  'Deep breath. We have time. We always make it.',
  'I love my kids. This moment will pass.',
  'I don\'t need a perfect morning — a good enough morning is great.',
  'My children aren\'t giving me a hard time. They\'re having a hard time.',
  'I am a great mom. Great moms have tough mornings too.',
];

const MOTIVES = ['⚡ Beat the timer!','🚀 Superstar speed!','🌟 You\'ve got this!','🏆 Champion!','💪 Almost there!'];

// ── HELPERS ─────────────────────────────────────────────────
const today = () => new Date().toISOString().split('T')[0];
const dayName = () => ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
const save = () => localStorage.setItem('mm_v3', JSON.stringify(S));
const $ = id => document.getElementById(id);
const set = (id, v) => { const e=$(id); if(e) e.textContent=v; };
const hide = id => { const e=$(id); if(e) e.classList.add('hidden'); };
const show = id => { const e=$(id); if(e) e.classList.remove('hidden'); };

function load() {
  try { const d=localStorage.getItem('mm_v3'); if(d) Object.assign(S,JSON.parse(d)); } catch(e){}
}

function getAge(child) {
  const a=child.age||7;
  return a<=7?'5-7':a<=10?'8-10':'11+';
}

function getTasks(child) { return CHILD_TASKS[getAge(child)]||CHILD_TASKS['8-10']; }

function getChildDone(cid) {
  const d=today();
  if(!S.childTasksDone[cid]) S.childTasksDone[cid]={};
  if(!S.childTasksDone[cid][d]) S.childTasksDone[cid][d]={};
  return S.childTasksDone[cid][d];
}

function getMomDone() {
  const d=today(); if(!S.mumTasksDone[d]) S.mumTasksDone[d]={}; return S.mumTasksDone[d];
}

function getNightDone() {
  const d=today(); if(!S.nightDone[d]) S.nightDone[d]={}; return S.nightDone[d];
}

function getBagItems(cid) {
  if(!S.bagItems[cid]) S.bagItems[cid]=BAG_DEFAULTS.map(i=>({...i,id:i.id+'_'+cid}));
  return S.bagItems[cid];
}

function getBagChecked(cid) {
  const k=cid+'_'+today(); if(!S.bagChecked[k]) S.bagChecked[k]={}; return S.bagChecked[k];
}

function to24(h,m,ap){
  let hh=parseInt(h);
  if(ap==='PM'&&hh!==12) hh+=12;
  if(ap==='AM'&&hh===12) hh=0;
  return {h:hh,m:parseInt(m)};
}

function formatTime(h,m,ap){ return `${h}:${String(m).padStart(2,'0')} ${ap}`; }

// ── BOOT ────────────────────────────────────────────────────
window.addEventListener('load',()=>{
  load();
  if(S.onboarded && S.children.length>0){
    launchApp();
  } else {
    show('onboarding');
    showObStep(1);
  }
});

// ── ONBOARDING ───────────────────────────────────────────────
let obStep=1;
function showObStep(n){
  for(let i=1;i<=4;i++){
    const e=$('ob'+i); if(e) e.classList.toggle('hidden',i!==n);
    const d=$('od'+i); if(d) d.classList.toggle('active',i===n);
  }
  obStep=n;
}

function obNext(next){
  if(next===2){} // welcome → name
  if(next===3){
    const nm=($('ob-mom-name')?.value||'').trim();
    if(!nm){toast('Please enter your name 😊');return;}
    S.momName=nm; save();
  }
  if(next===4){
    S.leaveHour=parseInt($('ob-hr')?.value||8);
    S.leaveMin=$('ob-min')?.value||'15';
    S.leaveAmPm=$('ob-ampm')?.value||'AM';
    save();
  }
  showObStep(next);
}

function selAge(a,btn){
  S.obSelectedAge=a;
  btn.closest('.age-row').querySelectorAll('.age-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

function selAv(emoji,btn,containerId){
  const ctx=$(containerId)||btn.closest('.avatar-row');
  ctx.querySelectorAll('.av-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  if(containerId==='ob-avatars') S.obSelectedAvatar=emoji;
  else if(containerId==='nc-avatars') S.ncSelectedAvatar=emoji;
  save();
}

function obFinish(){
  const nm=($('ob-child-name')?.value||'').trim();
  if(!nm){toast('Please enter your child\'s name!');return;}
  S.children.push({
    id:'c_'+Date.now(), name:nm, age:S.obSelectedAge,
    avatar:S.obSelectedAvatar, sensory:false, anxiety:false, stars:0
  });
  S.isPlusUser=true; S.trialActive=true; // auto start trial on sign up
  S.onboarded=true; save();
  hide('onboarding');
  launchApp();
}

// ── APP LAUNCH ───────────────────────────────────────────────
function launchApp(){
  show('app');
  initCountdown();
  renderCalmScripts();
  // track wake time
  const hr=new Date().getHours();
  if(hr>=5&&hr<=9&&!S.wakeTime){S.wakeTime=Date.now();save();}
  nav('home');
}

// ── NAVIGATION ───────────────────────────────────────────────
const SCREENS=['home','routine','bag','nightprep','calm','children','settings'];

function nav(name){
  SCREENS.forEach(s=>{
    const sc=$('s-'+s); if(sc) sc.classList.toggle('active',s===name);
    const nb=$('nb-'+s); if(nb) nb.classList.toggle('active',s===name);
  });
  if(name==='home') renderHome();
  if(name==='routine') renderRoutine();
  if(name==='bag') renderBag();
  if(name==='nightprep') renderNightPrep();
  if(name==='calm') renderCalmScripts();
  if(name==='children') renderChildren();
  if(name==='settings') loadSettings();
}

// ── COUNTDOWN ────────────────────────────────────────────────
function initCountdown(){
  updateCd(); setInterval(updateCd,1000);
  setInterval(checkMeltdown,30000); checkMeltdown();
}

function updateCd(){
  const now=new Date();
  const {h,m}=to24(S.leaveHour,S.leaveMin,S.leaveAmPm);
  const leave=new Date(); leave.setHours(h,m,0,0);
  const diff=leave-now;
  const el=$('cd-time'); if(!el) return;
  if(diff<=0){el.textContent='Let\'s go! 🚌';el.classList.add('urgent');set('cd-pct','🚌');updateKmTime();return;}
  const hh=Math.floor(diff/3600000),mm=Math.floor((diff%3600000)/60000),ss=Math.floor((diff%60000)/1000);
  el.textContent=hh>0?`${hh}h ${String(mm).padStart(2,'0')}m`:`${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  el.classList.toggle('urgent',diff<600000);
  const pct=Math.min(1,Math.max(0,diff/(90*60000)));
  const arc=$('cd-arc'); if(arc) arc.style.strokeDashoffset=188.5*(1-pct);
  const minsLeft=Math.floor(diff/60000);
  set('cd-pct',minsLeft<=90?`${minsLeft}m`:'');
  set('cd-sub',`Drop-off: ${formatTime(S.leaveHour,S.leaveMin,S.leaveAmPm)}`);
  updateKmTime();
  renderTimeline();
}

function updateKmTime(){
  const now=new Date();
  const {h,m}=to24(S.leaveHour,S.leaveMin,S.leaveAmPm);
  const leave=new Date(); leave.setHours(h,m,0,0);
  const diff=leave-now;
  const el=$('km-time'); if(!el) return;
  if(diff<=0){el.textContent='Go! 🚌';return;}
  const mm=Math.floor(diff/60000),ss=Math.floor((diff%60000)/1000);
  el.textContent=`${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}

function checkMeltdown(){
  if(!S.wakeTime) return;
  const mins=(Date.now()-S.wakeTime)/60000;
  const el=$('meltdown-banner'); if(!el) return;
  el.classList.toggle('hidden',!(mins>=30&&mins<=45));
  updateContextMsg();
}

function renderTimeline(){
  const el=$('timeline'); if(!el) return;
  const child=S.children[S.activeChild];
  if(!child) return;
  const tasks=getTasks(child);
  const done=getChildDone(child.id);
  const {h:lh,m:lm}=to24(S.leaveHour,S.leaveMin,S.leaveAmPm);
  // Calculate task times backwards from leave
  const leaveTotal=lh*60+lm;
  const taskMins=tasks.map(t=>Math.ceil(t.secs/60));
  const totalMins=taskMins.reduce((a,b)=>a+b,0);
  let cur=leaveTotal-totalMins;
  const mins=(Date.now()-S.wakeTime)/60000;
  const meltStart=S.wakeTime?30:9999,meltEnd=45;

  const rows=tasks.slice(0,5).map((t,i)=>{
    const tMins=cur;
    cur+=taskMins[i];
    const tH=Math.floor(tMins/60),tM=tMins%60;
    const ampm=tH>=12?'PM':'AM';
    const h12=(tH%12)||12;
    const timeStr=`${h12}:${String(tM).padStart(2,'0')} ${ampm}`;
    const isDone=done[t.id];
    const isMeltdown=S.wakeTime&&(tMins-(leaveTotal-totalMins))>=(meltStart)&&(tMins-(leaveTotal-totalMins))<=meltEnd;
    return `<div class="tl-row${isMeltdown?' tl-meltdown':''}">
      <div class="tl-dot"></div>
      <span class="tl-time">${timeStr}</span>
      <span class="tl-task">${t.emoji} ${t.label}</span>
      <span class="tl-check">${isDone?'✅':''}</span>
    </div>`;
  });

  if(S.wakeTime) {
    const minsNow=(Date.now()-S.wakeTime)/60000;
    if(minsNow>=30&&minsNow<=45){
      rows.splice(2,0,`<div class="tl-row tl-meltdown"><div class="tl-dot"></div><span style="flex:1;font-weight:800">⚠️ MELTDOWN ZONE — Keep 1 task at a time</span></div>`);
    }
  }
  el.innerHTML=rows.join('');
}

// ── CONTEXT MESSAGE ─────────────────────────────────────────
const CTX_MSGS={
  default:{icon:'🌅',text:'Tap below to start your morning routine!'},
  meltdown:{icon:'⚠️',text:'Meltdown window active. Keep it to 1 thing. You\'ve got this, Mom.'},
  late:{icon:'❤️',text:'Life happens. Tomorrow\'s a fresh start. You\'re doing great.'},
  allDone:{icon:'🎉',text:'Amazing morning! You\'re a superstar, Mom! ⭐'},
  evening:{icon:'🌙',text:'Great time to prep for tomorrow — tap Tonight\'s Prep!'},
};

function updateContextMsg(){
  const now=new Date();
  const {h:lh,m:lm}=to24(S.leaveHour,S.leaveMin,S.leaveAmPm);
  const leave=new Date(); leave.setHours(lh,lm,0,0);
  const diff=leave-now;
  let msg=CTX_MSGS.default;
  if(S.wakeTime){
    const mins=(Date.now()-S.wakeTime)/60000;
    if(mins>=30&&mins<=45) msg=CTX_MSGS.meltdown;
  }
  if(diff<0) msg=CTX_MSGS.late;
  if(now.getHours()>=17) msg=CTX_MSGS.evening;
  if(S.children.length>0){
    const child=S.children[S.activeChild];
    const tasks=getTasks(child);
    const done=getChildDone(child.id);
    if(tasks.every(t=>done[t.id])) msg=CTX_MSGS.allDone;
  }
  set('ctx-icon',msg.icon);
  set('ctx-text',msg.text);
  const sn=S.children[S.activeChild]?.name||'Your child';
  set('start-child-name',sn);
}

// ── HOME SCREEN ──────────────────────────────────────────────
function renderHome(){
  const hr=new Date().getHours();
  const greets=[
    [0,5,'Rise & shine ✨'],  [5,12,'Good morning ☀️'],
    [12,17,'Good afternoon 🌞'],[17,24,'Good evening 🌙']
  ];
  const greet=greets.find(([a,b])=>hr>=a&&hr<b)?.[2]||'Good morning ☀️';
  set('hero-greeting',greet);
  set('hero-name',`Hey ${S.momName||'Mom'}! 👋`);
  set('hero-date',new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}));
  updateContextMsg();
  // routine sub
  if(S.children.length>0){
    const c=S.children[S.activeChild];
    const tasks=getTasks(c);
    const done=getChildDone(c.id);
    const cnt=tasks.filter(t=>done[t.id]).length;
    set('bag-home-sub',`${cnt}/${tasks.length} done`);
  }
  // bag sub
  if(S.children.length>0){
    const c=S.children[S.activeChild];
    const items=getBagItems(c.id);
    const day=dayName();
    const rel=items.filter(i=>i.day==='daily'||i.day===day);
    const chk=getBagChecked(c.id);
    const cnt=rel.filter(i=>chk[i.id]).length;
    set('bag-home-sub',`${cnt}/${rel.length} packed`);
  }
  set('kids-home-sub',`${S.children.length} kid${S.children.length!==1?'s':''} added`);
  renderStreak();
  renderTimeline();
}

// ── STREAK ───────────────────────────────────────────────────
function renderStreak(){
  const el=$('streak-row'); if(!el) return;
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const todayStr=today();
  const last7=Array.from({length:7},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-(6-i));return d.toISOString().split('T')[0];
  });
  el.innerHTML=last7.map(d=>{
    const done=S.streak.includes(d),isToday=d===todayStr;
    const di=new Date(d+'T12:00:00');
    const lbl=days[di.getDay()===0?6:di.getDay()-1];
    return `<div class="streak-day${done?' done':''}${isToday&&!done?' is-today':''}">
      <span>${done?'⭐':isToday?'📅':'·'}</span>
      <span class="sd-lbl">${lbl}</span>
    </div>`;
  }).join('');
  const cnt=S.streak.filter(d=>(Date.now()-new Date(d+'T12:00:00'))<7*864e5).length;
  set('streak-badge',`${cnt} day${cnt!==1?'s':''} 🔥`);
  set('streak-msg',cnt===0?'Start your streak today! 🌟':cnt<3?`${cnt} days! Keep going! 🔥`:cnt<5?`${cnt} days! You\'re on fire! 🔥🔥`:`${cnt} days! Incredible! 🏆🔥`);
  const ref=$('ref-unlock');
  if(ref){
    const sm=S.smoothMornings||0;
    if(sm<7){ref.classList.remove('hidden');set('ref-unlock-text',`🎁 ${7-sm} more smooth mornings → free week for a friend!`);}
    else{ref.classList.remove('hidden');set('ref-unlock-text','🎉 You\'ve unlocked a free week to share!');}
  }
}

function markStreak(){
  const d=today();
  if(!S.streak.includes(d)){
    S.streak.push(d);S.smoothMornings=(S.smoothMornings||0)+1;save();renderStreak();
    if(S.smoothMornings===7) setTimeout(()=>celebrate('7 Smooth Mornings! 🏆','You\'ve unlocked a free week for a friend!','🏆🌟🏆'),1e3);
  }
}

// ── ROUTINE SCREEN ───────────────────────────────────────────
function renderRoutine(){
  renderMomTasks();
  renderChildTabs('routine-tabs',S.activeChild,selectRoutineChild);
  renderChildRoutine(S.activeChild);
}

function renderMomTasks(){
  const done=getMomDone();
  const el=$('mom-tasks'); if(!el) return;
  el.innerHTML=MOM_TASKS.map(t=>{
    const c=!!done[t.id];
    return `<div class="task-item${c?' done':''}" onclick="toggleMomTask('${t.id}')">
      <div class="task-cb">${c?'✓':''}</div>
      <span class="task-emoji">${t.emoji}</span>
      <div class="flex-1"><div class="task-lbl">${t.label}</div><div class="task-sub">${t.sub}</div></div>
    </div>`;
  }).join('');
}

function toggleMomTask(id){
  const d=getMomDone();d[id]=!d[id];save();renderMomTasks();
  if(MOM_TASKS.every(t=>d[t.id])) celebrate('You\'re ready, Mom! 💅','Your morning started perfectly — now the kids!','⭐⭐⭐');
}

function renderChildTabs(containerId,activeIdx,cbFn){
  const el=$(containerId); if(!el) return;
  if(!S.children.length){el.innerHTML='<p style="font-size:.8rem;color:#9ca3af">Add kids first</p>';return;}
  el.innerHTML=S.children.map((c,i)=>
    `<button class="ctab${i===activeIdx?' active':''}" onclick="${cbFn.name}(${i})">${c.avatar} ${c.name}</button>`
  ).join('');
}

function selectRoutineChild(i){
  S.activeChild=i;save();
  renderChildTabs('routine-tabs',i,selectRoutineChild);
  renderChildRoutine(i);
}

function renderChildRoutine(idx){
  if(!S.children.length) return;
  const child=S.children[idx];
  const tasks=getTasks(child);
  const done=getChildDone(child.id);
  const cnt=tasks.filter(t=>done[t.id]).length;
  const pct=tasks.length?(cnt/tasks.length)*100:0;
  set('routine-child-label',`${child.avatar} ${child.name}`);
  set('routine-count',`${cnt}/${tasks.length}`);
  const pf=$('progress-fill'); if(pf) pf.style.width=pct+'%';
  const el=$('child-tasks'); if(!el) return;
  el.innerHTML=tasks.map(t=>{
    const c=!!done[t.id];
    const photo=S.photos[`${child.id}_${today()}_${t.id}`];
    return `<div class="task-item${c?' done':''}" onclick="toggleChildTask('${child.id}','${t.id}',${idx})">
      <div class="task-cb">${c?'✓':''}</div>
      <span class="task-emoji">${t.emoji}</span>
      <div style="flex:1"><div class="task-lbl">${t.label}</div><div class="task-sub">${t.sub}</div>
        ${photo?`<img src="${photo}" style="width:50px;height:50px;border-radius:8px;object-fit:cover;margin-top:4px" alt="proof"/>`:''}</div>
      <div class="task-actions">
        ${!c?`<button class="timer-btn" onclick="event.stopPropagation();openTimer('${t.emoji}','${t.label}',${t.secs},'${child.id}','${t.id}',${idx})">⏱</button>`:''}
        <button class="photo-btn" onclick="event.stopPropagation();takePhoto('${child.id}','${t.id}',${idx})">📷</button>
      </div>
    </div>`;
  }).join('');
  const ad=$('all-done'); if(ad) ad.classList.toggle('hidden',cnt!==tasks.length||!tasks.length);
  if(cnt===tasks.length&&tasks.length>0) markStreak();
}

function toggleChildTask(cid,tid,idx){
  const d=getChildDone(cid);d[tid]=!d[tid];save();
  renderChildRoutine(idx);
  if(d[tid]) toast(['⭐ Done!','🎉 Yes!','🏆 Star!','💪 Go!','🚀 Yes!'][Math.floor(Math.random()*5)]);
  updateContextMsg();
}

// ── PHOTO PROOF ──────────────────────────────────────────────
function takePhoto(cid,tid,idx){
  const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.capture='environment';
  inp.onchange=e=>{
    const file=e.target.files[0];if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      S.photos[`${cid}_${today()}_${tid}`]=ev.target.result;save();
      renderChildRoutine(idx);toast('📷 Photo saved!');
    };
    reader.readAsDataURL(file);
  };
  inp.click();
}

// ── TIMER ────────────────────────────────────────────────────
function openTimer(emoji,label,secs,cid,tid,idx){
  set('timer-icon',emoji);set('timer-label',label);
  set('timer-motive',MOTIVES[Math.floor(Math.random()*MOTIVES.length)]);
  S.timerDoneCallback=()=>{
    const d=getChildDone(cid);d[tid]=true;save();renderChildRoutine(idx);
    celebrate('Task Complete! 🎉',`${emoji} ${label} done in record time!','⭐⭐⭐`);
  };
  show('modal-timer');
  let rem=secs,total=secs;
  clearInterval(S.timerInterval);
  S.timerInterval=setInterval(()=>{
    rem--;
    const m=Math.floor(rem/60),s=rem%60;
    set('timer-num',`${m}:${String(s).padStart(2,'0')}`);
    const arc=$('timer-arc');
    if(arc) arc.style.strokeDashoffset=339.3*(1-rem/total);
    const tn=$('timer-num');
    if(tn&&rem<=10) tn.style.color='#ef4444';
    if(rem<=0){clearInterval(S.timerInterval);set('timer-num',"Time's up! ⏰");}
  },1000);
}

function closeTimer(){clearInterval(S.timerInterval);hide('modal-timer');const a=$('timer-arc');if(a)a.style.strokeDashoffset=0;const n=$('timer-num');if(n)n.style.color='#f97316';}
function doneTimer(){clearInterval(S.timerInterval);hide('modal-timer');if(S.timerDoneCallback)S.timerDoneCallback();}

// ── BAG SCREEN ───────────────────────────────────────────────
function renderBag(){
  const day=dayName();
  set('bag-day-pill',`${day}'s school bag checklist`);
  renderChildTabs('bag-tabs',S.activeBagChild,selectBagChild);
  if(S.children.length>0) renderBagItems(S.children[S.activeBagChild].id,day);
}

function selectBagChild(i){S.activeBagChild=i;renderChildTabs('bag-tabs',i,selectBagChild);renderBagItems(S.children[i].id,dayName());}

function renderBagItems(cid,day){
  const el=$('bag-items');if(!el) return;
  const items=getBagItems(cid);
  const rel=items.filter(i=>i.day==='daily'||i.day===day);
  const chk=getBagChecked(cid);
  if(!rel.length){el.innerHTML='<div style="text-align:center;color:#9ca3af;padding:20px"><div style="font-size:2rem">✅</div><p>No items for today!</p></div>';return;}
  el.innerHTML=rel.map(i=>{
    const c=!!chk[i.id];
    return `<div class="bag-item${c?' done':''}" onclick="toggleBag('${cid}','${i.id}')">
      <div class="task-cb">${c?'✓':''}</div>
      <span style="font-size:1.4rem">${i.emoji||'📦'}</span>
      <span class="bag-lbl flex-1">${i.name}${i.day!=='daily'?` <span style="font-size:.68rem;color:#f97316;font-weight:700">${i.day}</span>`:''}</span>
      <button onclick="event.stopPropagation();delBag('${cid}','${i.id}')" style="color:#d1d5db;background:none;border:none;font-size:.9rem;cursor:pointer;padding:4px">✕</button>
    </div>`;
  }).join('');
}

function toggleBag(cid,iid){const c=getBagChecked(cid);c[iid]=!c[iid];save();renderBagItems(cid,dayName());}
function delBag(cid,iid){if(S.bagItems[cid]){S.bagItems[cid]=S.bagItems[cid].filter(i=>i.id!==iid);save();renderBagItems(cid,dayName());}}

function addBagItem(){
  const nm=($('bag-input')?.value||'').trim();const day=$('bag-day-sel')?.value;
  if(!nm) return;
  const cid=S.children.length>0?S.children[S.activeBagChild].id:null;
  if(!cid) return;
  if(!S.bagItems[cid]) S.bagItems[cid]=[...BAG_DEFAULTS.map(i=>({...i,id:i.id+'_'+cid}))];
  const em={water:'💧',lunch:'🥪',book:'📚',homework:'📝',pe:'👟',kit:'👟',snack:'🍎',swim:'🏊',towel:'🏊'}
  const emoji=Object.entries(em).find(([k])=>nm.toLowerCase().includes(k))?.[1]||'📦';
  S.bagItems[cid].push({id:'cx_'+Date.now(),name:nm,day,emoji});
  if($('bag-input')) $('bag-input').value='';
  save();renderBagItems(cid,dayName());toast('✅ Added!');
}

// ── NIGHT PREP ───────────────────────────────────────────────
function renderNightPrep(){
  const done=getNightDone();
  const cnt=NIGHT_TASKS.filter(t=>done[t.id]).length;
  set('night-progress-display',`${cnt}/${NIGHT_TASKS.length}`);
  const el=$('night-tasks');if(!el) return;
  el.innerHTML=NIGHT_TASKS.map(t=>{
    const c=!!done[t.id];
    return `<div class="ev-task${c?' done':''}" onclick="toggleNight('${t.id}')">
      <div class="task-cb">${c?'✓':''}</div>
      <span style="font-size:1.4rem">${t.emoji}</span>
      <span class="ev-lbl">${t.label}</span>
    </div>`;
  }).join('');
  if(cnt===NIGHT_TASKS.length) toast('🌙 All set for tomorrow!');
}

function toggleNight(id){const d=getNightDone();d[id]=!d[id];save();renderNightPrep();}

// ── CALM SCREEN ──────────────────────────────────────────────
function startBreathing(){show('breath-panel');$('breath-panel').scrollIntoView({behavior:'smooth'});}

let breathCycles=0;
const PHASES=[
  {label:'Breathe IN',note:'Slowly in through your nose...',cls:'expand',ms:4000},
  {label:'HOLD',note:'Hold gently...',cls:'hold',ms:4000},
  {label:'Breathe OUT',note:'Slowly out through your mouth...',cls:'shrink',ms:4000},
];

function goBreath(){
  $('breath-go-btn').style.display='none';breathCycles=0;runPhase(0);
}

function runPhase(p){
  if(breathCycles>=4){
    set('breath-label','✨ Done');set('breath-note','You\'ve got this, Mom.');
    const c=$('breath-circle');if(c) c.className='breath-circle';
    const b=$('breath-go-btn');if(b){b.style.display='block';b.textContent='Go Again';}
    return;
  }
  const ph=PHASES[p];
  set('breath-label',ph.label);set('breath-note',ph.note);
  const c=$('breath-circle');if(c) c.className=`breath-circle ${ph.cls}`;
  setTimeout(()=>{const next=(p+1)%3;if(next===0)breathCycles++;runPhase(next);},ph.ms);
}

function nextScript(){S.scriptIdx=(S.scriptIdx+1)%CALM_SCRIPTS.length;renderCalmScripts();}

function renderCalmScripts(){
  const el=$('calm-scripts');if(!el) return;
  const i=S.scriptIdx;
  el.innerHTML=[CALM_SCRIPTS[i],CALM_SCRIPTS[(i+1)%CALM_SCRIPTS.length]]
    .map(s=>`<div class="calm-script">"${s}"</div>`).join('');
}

// ── CHILDREN SCREEN ──────────────────────────────────────────
function renderChildren(){
  const el=$('children-list');if(!el) return;
  if(!S.children.length){el.innerHTML='<p style="color:#9ca3af;font-size:.85rem;text-align:center;padding:12px">No kids yet — add your first child below!</p>';return;}
  el.innerHTML=S.children.map((c,i)=>`
    <div class="child-card">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:2.5rem">${c.avatar}</span>
        <div style="flex:1">
          <div style="font-weight:900;color:#111827">${c.name}</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px">
            <span class="badge" style="background:#f3e8ff;color:#6b21a8">Age ${c.age}</span>
            ${c.sensory?'<span class="badge badge-sensory">👕 Sensory</span>':''}
            ${c.anxiety?'<span class="badge badge-anxiety">🎓 Support</span>':''}
            <span class="badge" style="background:#fef9c3;color:#854d0e">⭐ ${c.stars||0}</span>
          </div>
        </div>
        <button onclick="removeChild(${i})" style="background:none;border:none;color:#d1d5db;font-size:1.1rem;cursor:pointer;padding:6px">✕</button>
      </div>
      ${c.anxiety?`<div style="background:#eff6ff;border-radius:12px;padding:10px;margin-top:8px;font-size:.78rem;color:#1e40af">💙 <strong>Tip:</strong> "I know school feels hard. What's one thing you're looking forward to today?"</div>`:''}
      ${c.sensory?`<div style="background:#fef9c3;border-radius:12px;padding:10px;margin-top:6px;font-size:.78rem;color:#854d0e">👕 <strong>Tip:</strong> Lay out 2 pre-approved outfits tonight so mornings are conflict-free.</div>`:''}
    </div>`).join('');
}

function removeChild(i){if(confirm(`Remove ${S.children[i].name}?`)){S.children.splice(i,1);save();renderChildren();}}

function selNewAge(a,btn){
  S.ncSelectedAge=a;
  btn.closest('.age-row').querySelectorAll('.age-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

function addChild(){
  const nm=($('nc-name')?.value||'').trim();if(!nm){toast('Please enter a name!');return;}
  if(!S.isPlusUser&&!S.trialActive&&S.children.length>=1){showPlus();return;}
  S.children.push({id:'c_'+Date.now(),name:nm,age:S.ncSelectedAge||7,
    avatar:S.ncSelectedAvatar,sensory:$('nc-sensory')?.checked||false,
    anxiety:$('nc-anxiety')?.checked||false,stars:0});
  if($('nc-name')) $('nc-name').value='';
  if($('nc-sensory')) $('nc-sensory').checked=false;
  if($('nc-anxiety')) $('nc-anxiety').checked=false;
  save();renderChildren();toast('👧 Child added!');
}

// ── SETTINGS ─────────────────────────────────────────────────
function loadSettings(){
  const n=$('s-momname');if(n) n.value=S.momName;
  const sh=$('s-hr');if(sh) sh.value=S.leaveHour;
  const sm=$('s-min');if(sm) sm.value=S.leaveMin;
  const sa=$('s-ampm');if(sa) sa.value=S.leaveAmPm;
  const melt=$('s-meltdown');if(melt) melt.value=S.meltdownMins;
}

function saveSettings(){
  S.momName=($('s-momname')?.value||'').trim()||S.momName;
  S.leaveHour=parseInt($('s-hr')?.value||8);
  S.leaveMin=$('s-min')?.value||'15';
  S.leaveAmPm=$('s-ampm')?.value||'AM';
  S.meltdownMins=parseInt($('s-meltdown')?.value||35);
  save();toast('✅ Settings saved!');nav('home');
}

function resetApp(){if(confirm('Reset all data? This cannot be undone.')){localStorage.removeItem('mm_v3');location.reload();}}

// ── KID MODE ─────────────────────────────────────────────────
function enterKidMode(){
  const child=S.children[S.activeChild];
  if(!child){toast('Add a child first!');return;}
  set('km-avatar',child.avatar);
  set('km-name',`${child.name}'s`);
  renderKidTasks();
  show('kid-mode');
}

function renderKidTasks(){
  const child=S.children[S.activeChild];if(!child) return;
  const tasks=getTasks(child);
  const done=getChildDone(child.id);
  const el=$('kid-tasks');if(!el) return;
  const cnt=tasks.filter(t=>done[t.id]).length;
  const ad=$('kid-alldone');if(ad) ad.classList.toggle('hidden',cnt!==tasks.length||!tasks.length);
  el.innerHTML=tasks.map(t=>{
    const c=!!done[t.id];
    return `<div class="kid-task${c?' done':''}" onclick="kidToggle('${child.id}','${t.id}')">
      <span class="kid-task-emoji">${t.emoji}</span>
      <span class="kid-task-label">${t.label}</span>
      <div class="kid-task-tick">${c?'✓':''}</div>
    </div>`;
  }).join('');
}

function kidToggle(cid,tid){
  const d=getChildDone(cid);d[tid]=!d[tid];save();renderKidTasks();
  if(d[tid]){
    // Big bounce animation
    const el=document.querySelector('.kid-bg');
    if(el){el.style.transform='scale(1.02)';setTimeout(()=>el.style.transform='',200);}
  }
}

function askExitKid(){
  S.pinBuffer=[];
  set('pin-display','_ _ _ _');
  show('modal-pin');
}

function pinTap(n){
  if(S.pinBuffer.length>=4) return;
  S.pinBuffer.push(n);
  const dots='● '.repeat(S.pinBuffer.length)+'_ '.repeat(4-S.pinBuffer.length);
  set('pin-display',dots.trim());
}

function pinClear(){S.pinBuffer=[];set('pin-display','_ _ _ _');}

function pinSubmit(){
  if(S.pinBuffer.join('')===S.PIN){
    hide('modal-pin');hide('kid-mode');toast('👋 Welcome back, Mom!');
  } else {
    set('pin-display','❌ Wrong PIN');setTimeout(()=>{S.pinBuffer=[];set('pin-display','_ _ _ _');},1200);
  }
}

// ── WHY IT MATTERS MODAL ─────────────────────────────────────
function showInfoModal(){
  show('modal-why');
  let t=5;const el=$('why-timer');if(el) el.textContent=t;
  const iv=setInterval(()=>{
    t--;if(el) el.textContent=t;
    if(t<=0){clearInterval(iv);closeModal('modal-why');}
  },1000);
}

// ── PLUS MODAL ───────────────────────────────────────────────
function showPlus(){show('modal-plus');}
function startTrial(){S.isPlusUser=true;S.trialActive=true;save();closeModal('modal-plus');toast('🎉 7-day free trial started!');renderHome();}

// ── MODALS ────────────────────────────────────────────────────
function closeModal(id){hide(id);}
function celebrate(title,msg,stars){set('cel-title',title);set('cel-msg',msg);set('cel-stars',stars||'🎉');show('modal-celebrate');}

// ── SHARE ────────────────────────────────────────────────────
function doShare(){
  const msg='This app stopped our 8AM screaming matches! Makes school mornings calmer 😊 Try Morning Mate free: https://morningmate.app';
  if(navigator.share){navigator.share({title:'Morning Mate',text:msg});}
  else{navigator.clipboard?.writeText(msg).then(()=>toast('📋 Copied! Share it with a friend!'));}
}

function shareWin(){
  const msg='We just had a PERFECT school morning — everyone ready on time! 🎉 Morning Mate is a game changer: https://morningmate.app';
  if(navigator.share){navigator.share({title:'Morning Win!',text:msg});}
  else{navigator.clipboard?.writeText(msg).then(()=>toast('📋 Win message copied!'));}
}

// ── TOAST ────────────────────────────────────────────────────
function toast(msg){
  let t=$('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t);}
  t.textContent=msg;t.classList.remove('hidden');
  clearTimeout(t._to);
  t._to=setTimeout(()=>t.classList.add('hidden'),2400);
}

// init
document.addEventListener('DOMContentLoaded',renderCalmScripts);
