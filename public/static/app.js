// ============================================================
// MORNING MATE v2.0 — US Moms Edition
// ============================================================

// ===== STATE =====
let state = {
  momName: '',
  leaveTime: '8:15 AM',
  leaveHour: 8,
  leaveMin: 15,
  leaveAmPm: 'AM',
  meltdownMins: 35,
  wakeTime: null,
  children: [],
  activeChildIndex: 0,
  activeBagChildIndex: 0,
  mumTasks: {},
  childTasks: {},
  bagItems: {},
  bagChecked: {},
  eveningTasks: {},
  streak: [],
  smoothMornings: 0,
  onboarded: false,
  selectedAvatar: '🦊',
  selectedNewAvatar: '🦊',
  selectedAge: 7,
  selectedNewAge: 7,
  currentScriptIndex: 0,
  timerInterval: null,
  timerTaskCallback: null,
  isPlusUser: false,
  trialActive: false,
  trialDaysLeft: 7,
};

// ===== DEFAULT DATA =====
const MOM_TASKS = [
  { id: 'm1', emoji: '⏰', label: 'Wake up 20 mins before kids', sublabel: 'Your secret superpower' },
  { id: 'm2', emoji: '💧', label: 'Drink a glass of water', sublabel: 'Hydrate before the rush' },
  { id: 'm3', emoji: '🚿', label: 'Quick shower / freshen up', sublabel: 'You first — always' },
  { id: 'm4', emoji: '👗', label: 'Get dressed', sublabel: 'Before the chaos starts' },
  { id: 'm5', emoji: '☕', label: 'Make yourself a coffee', sublabel: 'You deserve it, Mom' },
];

const CHILD_TASKS = {
  '5-7': [
    { id: 't1', emoji: '🛏️', label: 'Get out of bed', sublabel: 'Rise and shine!', timer: 120 },
    { id: 't2', emoji: '🚽', label: 'Bathroom visit', sublabel: 'First thing!', timer: 120 },
    { id: 't3', emoji: '👗', label: 'Get dressed (with help)', sublabel: 'Mom helps today', timer: 180 },
    { id: 't4', emoji: '🧦', label: 'Socks & shoes on', sublabel: 'Check they\'re comfy', timer: 120 },
    { id: 't5', emoji: '🍎', label: 'Eat breakfast', sublabel: 'Fuel for elementary!', timer: 600 },
    { id: 't6', emoji: '🪥', label: 'Brush teeth', sublabel: '2 whole minutes!', timer: 120 },
    { id: 't7', emoji: '🎒', label: 'Grab school bag', sublabel: 'Already packed?', timer: 60 },
    { id: 't8', emoji: '🚌', label: 'Ready to go!', sublabel: 'Let\'s do this!', timer: 30 },
  ],
  '8-10': [
    { id: 't1', emoji: '🛏️', label: 'Get out of bed', sublabel: 'You\'ve got this!', timer: 120 },
    { id: 't2', emoji: '🚽', label: 'Bathroom & wash hands', sublabel: 'Before breakfast', timer: 180 },
    { id: 't3', emoji: '👗', label: 'Get dressed', sublabel: 'Clothes are laid out', timer: 180 },
    { id: 't4', emoji: '🍎', label: 'Eat breakfast', sublabel: 'Eat it all!', timer: 600 },
    { id: 't5', emoji: '🪥', label: 'Brush teeth', sublabel: '2 minutes please', timer: 120 },
    { id: 't6', emoji: '💆', label: 'Hair done', sublabel: 'Looking great!', timer: 60 },
    { id: 't7', emoji: '🎒', label: 'Pack school bag', sublabel: 'Check your list', timer: 120 },
    { id: 't8', emoji: '🧥', label: 'Coat & shoes ready', sublabel: 'Check the weather', timer: 60 },
    { id: 't9', emoji: '🚀', label: 'Ready to go!', sublabel: 'Crushing it!', timer: 30 },
  ],
  '11+': [
    { id: 't1', emoji: '⏰', label: 'Wake up (your alarm!)', sublabel: 'Total independence', timer: 120 },
    { id: 't2', emoji: '🚿', label: 'Shower, dressed & hair', sublabel: 'Full independence mode', timer: 600 },
    { id: 't3', emoji: '🍎', label: 'Eat breakfast', sublabel: 'Don\'t skip it', timer: 600 },
    { id: 't4', emoji: '🪥', label: 'Brush teeth', sublabel: '2 min minimum', timer: 120 },
    { id: 't5', emoji: '🎒', label: 'Pack bag yourself', sublabel: 'Everything in?', timer: 120 },
    { id: 't6', emoji: '📱', label: 'Phone charged & packed', sublabel: 'Don\'t forget it', timer: 60 },
    { id: 't7', emoji: '✅', label: 'Final bag check', sublabel: 'Homework? PE kit?', timer: 60 },
    { id: 't8', emoji: '🚀', label: 'Ready for drop-off!', sublabel: 'Let\'s go!', timer: 30 },
  ],
};

const DEFAULT_BAG_ITEMS = [
  { id: 'b1', name: 'Water bottle', day: 'daily', emoji: '💧' },
  { id: 'b2', name: 'Lunch box', day: 'daily', emoji: '🥪' },
  { id: 'b3', name: 'Reading folder', day: 'daily', emoji: '📂' },
  { id: 'b4', name: 'PE Kit', day: 'Wednesday', emoji: '👟' },
  { id: 'b5', name: 'Library book', day: 'Friday', emoji: '📚' },
  { id: 'b6', name: 'Homework', day: 'daily', emoji: '📝' },
];

const EVENING_TASKS = [
  { id: 'e1', emoji: '👗', label: 'Lay out tomorrow\'s outfit' },
  { id: 'e2', emoji: '🎒', label: 'Pack the school bag' },
  { id: 'e3', emoji: '🥪', label: 'Prep tomorrow\'s lunch box' },
  { id: 'e4', emoji: '📝', label: 'Sign any school forms' },
  { id: 'e5', emoji: '🔋', label: 'Charge all devices overnight' },
  { id: 'e6', emoji: '👟', label: 'PE kit ready by the door' },
  { id: 'e7', emoji: '⏰', label: 'Set morning alarm' },
  { id: 'e8', emoji: '🌙', label: 'Kids in bed on time' },
];

const CALM_SCRIPTS = [
  "We are doing one thing at a time. Just one thing. That's all.",
  "I am calm. I set the tone for this morning. My kids follow my lead.",
  "This is hard but I am doing my best. That is enough.",
  "Deep breath. We have time. We always make it.",
  "I love my kids. This moment will pass. We'll laugh about it later.",
  "I don't need a perfect morning. I just need a good enough morning.",
  "My children are not giving me a hard time — they're having a hard time.",
  "I am a great mom. Great moms have tough mornings too.",
];

const MOTIVATIONAL = [
  "⚡ Beat the timer!", "🚀 Superstar speed!", "🌟 You've got this!",
  "🏆 Champion mode!", "🎯 Stay focused!", "💪 Almost there!"
];

// ===== HELPERS =====
const today = () => new Date().toISOString().split('T')[0];
const dayName = () => ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
const save = () => localStorage.setItem('morningmate_v2', JSON.stringify(state));

function load() {
  const raw = localStorage.getItem('morningmate_v2');
  if (raw) {
    try { Object.assign(state, JSON.parse(raw)); } catch(e) {}
  }
}

function getChildAge(child) {
  const age = child.age || 7;
  if (age <= 7) return '5-7';
  if (age <= 10) return '8-10';
  return '11+';
}

function getChildTasks(child) {
  return CHILD_TASKS[getChildAge(child)] || CHILD_TASKS['8-10'];
}

function getChildDoneTasks(childId) {
  const d = today();
  if (!state.childTasks[childId]) state.childTasks[childId] = {};
  if (!state.childTasks[childId][d]) state.childTasks[childId][d] = {};
  return state.childTasks[childId][d];
}

function getMomDoneTasks() {
  const d = today();
  if (!state.mumTasks[d]) state.mumTasks[d] = {};
  return state.mumTasks[d];
}

function getEveningDone() {
  const d = today();
  if (!state.eveningTasks[d]) state.eveningTasks[d] = {};
  return state.eveningTasks[d];
}

function getBagItemsForChild(childId) {
  if (!state.bagItems[childId]) {
    state.bagItems[childId] = DEFAULT_BAG_ITEMS.map(i => ({ ...i, id: i.id + '-' + childId }));
  }
  return state.bagItems[childId];
}

function getBagChecked(childId) {
  const d = today();
  const key = childId + '_' + d;
  if (!state.bagChecked[key]) state.bagChecked[key] = {};
  return state.bagChecked[key];
}

function format12hr(h24str) {
  const [h, m] = h24str.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function getLeaveTimeAs24() {
  let h = parseInt(state.leaveHour);
  const m = parseInt(state.leaveMin);
  if (state.leaveAmPm === 'PM' && h !== 12) h += 12;
  if (state.leaveAmPm === 'AM' && h === 12) h = 0;
  return { h, m };
}

// ===== INIT =====
window.addEventListener('load', () => {
  load();
  if (state.onboarded && state.children.length > 0) {
    launchApp();
  } else {
    document.getElementById('splash').classList.add('active');
    document.getElementById('splash').style.display = 'block';
  }
});

// ===== SPLASH → ONBOARDING =====
function showOnboarding() {
  document.getElementById('splash').style.display = 'none';
  const ob = document.getElementById('onboarding');
  ob.classList.remove('hidden');
  ob.style.display = 'block';
  showOnboardStep(1);
}

let currentOnboardStep = 1;
const TOTAL_STEPS = 3;

function showOnboardStep(step) {
  document.querySelectorAll('.onboard-step').forEach(s => s.classList.add('hidden'));
  const el = document.getElementById(`step-${step}`);
  if (el) el.classList.remove('hidden');
  document.getElementById('onboard-progress').style.width = `${(step / TOTAL_STEPS) * 100}%`;
  currentOnboardStep = step;
}

function onboardNext(next) {
  if (next === 2) {
    const name = document.getElementById('mom-name-input').value.trim();
    if (!name) { showToast('Please enter your name! 😊'); return; }
    state.momName = name;
  }
  if (next === 3) {
    state.leaveHour = parseInt(document.getElementById('leave-hour').value);
    state.leaveMin = document.getElementById('leave-min').value;
    state.leaveAmPm = document.getElementById('leave-ampm').value;
    state.leaveTime = `${state.leaveHour}:${state.leaveMin} ${state.leaveAmPm}`;
  }
  save();
  showOnboardStep(next);
}

function selectAge(age) {
  state.selectedAge = age;
  document.querySelectorAll('#age-selector .age-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.age) === age);
  });
}

function selectAvatar(emoji) {
  state.selectedAvatar = emoji;
  document.querySelectorAll('#step-3 .avatar-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.emoji === emoji);
  });
}

function finishOnboarding() {
  const name = document.getElementById('child-name-input').value.trim();
  if (!name) { showToast('Please enter your child\'s name!'); return; }

  state.children.push({
    id: 'child_' + Date.now(),
    name,
    age: state.selectedAge,
    avatar: state.selectedAvatar,
    sensory: false,
    anxiety: false,
    stars: 0,
  });

  state.onboarded = true;
  save();
  document.getElementById('onboarding').style.display = 'none';
  launchApp();
}

// ===== APP LAUNCH =====
function launchApp() {
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('app').style.display = 'block';
  initCountdown();
  renderCalmScripts();
  showScreen('home');

  // Track wake time
  const hr = new Date().getHours();
  if (hr >= 5 && hr <= 9 && !state.wakeTime) {
    state.wakeTime = Date.now();
    save();
  }
}

// ===== SCREEN NAVIGATION =====
function showScreen(name) {
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const screen = document.getElementById('screen-' + name);
  if (screen) screen.classList.add('active');
  const nav = document.getElementById('nav-' + name);
  if (nav) nav.classList.add('active');

  if (name === 'home') renderHome();
  if (name === 'routine') renderRoutineScreen();
  if (name === 'bag') renderBagScreen();
  if (name === 'evening') renderEveningScreen();
  if (name === 'children') renderChildrenScreen();
  if (name === 'settings') loadSettings();
}

// ===== COUNTDOWN =====
function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setInterval(() => {
    if (state.wakeTime) {
      const minsSince = (Date.now() - state.wakeTime) / 60000;
      const w = document.getElementById('meltdown-warning');
      if (w) w.classList.toggle('hidden', !(minsSince >= 30 && minsSince <= 45));
    }
  }, 30000);
}

function updateCountdown() {
  const now = new Date();
  const { h, m } = getLeaveTimeAs24();
  const leave = new Date();
  leave.setHours(h, m, 0, 0);
  const diff = leave - now;

  const displayEl = document.getElementById('countdown-display');
  const arcEl = document.getElementById('countdown-arc');
  const pctEl = document.getElementById('countdown-pct');
  const leaveEl = document.getElementById('leave-time-display');

  if (leaveEl) leaveEl.textContent = `Drop-off: ${state.leaveTime}`;

  if (!displayEl) return;

  if (diff <= 0) {
    displayEl.textContent = "Let's go! 🚌";
    displayEl.classList.add('urgent');
    if (pctEl) pctEl.textContent = '🚌';
    return;
  }

  const totalMins = 60;
  const minsLeft = Math.floor(diff / 60000);
  const h2 = Math.floor(diff / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);

  if (h2 > 0) {
    displayEl.textContent = `${h2}h ${String(min).padStart(2,'0')}m`;
  } else {
    displayEl.textContent = `${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  }

  displayEl.classList.toggle('urgent', diff < 600000);

  // Arc
  if (arcEl) {
    const pct = Math.min(1, Math.max(0, minsLeft / totalMins));
    arcEl.style.strokeDashoffset = 213.6 * (1 - pct);
  }
  if (pctEl) pctEl.textContent = minsLeft <= 60 ? `${minsLeft}m` : '';
}

// ===== HOME RENDER =====
function renderHome() {
  const hr = new Date().getHours();
  let greet = 'Good morning';
  let emoji = '☀️';
  if (hr < 7) { greet = 'Rise & shine'; emoji = '🌤️'; }
  else if (hr >= 12) { greet = 'Good afternoon'; emoji = '🌞'; }

  setText('greeting-sub', greet + '!');
  setText('greeting-name', `Hey ${state.momName || 'Mom'}! 👋`);
  setText('date-display', new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
  setText('weather-emoji', emoji);

  // Routine progress
  if (state.children.length > 0) {
    const child = state.children[0];
    const tasks = getChildTasks(child);
    const done = getChildDoneTasks(child.id);
    const c = tasks.filter(t => done[t.id]).length;
    setText('routine-progress-label', `${c} of ${tasks.length} done`);
  }

  // Bag progress
  if (state.children.length > 0) {
    const child = state.children[0];
    const items = getBagItemsForChild(child.id);
    const day = dayName();
    const relevant = items.filter(i => i.day === 'daily' || i.day === day);
    const checked = getBagChecked(child.id);
    const c = relevant.filter(i => checked[i.id]).length;
    setText('bag-progress-label', `${c}/${relevant.length} packed`);
  }

  renderChildrenOverview();
  renderStreak();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderChildrenOverview() {
  const container = document.getElementById('children-overview');
  if (!container) return;
  if (state.children.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-sm text-center py-2">No kids added yet — <button onclick="showScreen('children')" class="text-orange-500 font-semibold">add your first child</button></p>`;
    return;
  }
  container.innerHTML = state.children.map(child => {
    const tasks = getChildTasks(child);
    const done = getChildDoneTasks(child.id);
    const c = tasks.filter(t => done[t.id]).length;
    const pct = tasks.length ? Math.round((c / tasks.length) * 100) : 0;
    return `
      <div class="flex items-center gap-3">
        <span class="text-2xl">${child.avatar}</span>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <span class="font-bold text-gray-800 text-sm">${child.name} <span class="text-gray-400 font-normal">· age ${child.age}</span></span>
            <span class="text-xs text-gray-400">${c}/${tasks.length}</span>
          </div>
          <div class="bg-gray-100 rounded-full h-2.5">
            <div class="bg-gradient-to-r from-orange-400 to-amber-400 h-2.5 rounded-full transition-all" style="width:${pct}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== STREAK =====
function renderStreak() {
  const container = document.getElementById('streak-display');
  if (!container) return;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const todayStr = today();
  const last7 = Array.from({length:7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6-i));
    return d.toISOString().split('T')[0];
  });

  container.innerHTML = last7.map(d => {
    const isToday = d === todayStr;
    const done = state.streak.includes(d);
    const di = new Date(d + 'T12:00:00');
    const label = days[di.getDay() === 0 ? 6 : di.getDay() - 1];
    return `
      <div class="streak-day ${done ? 'done' : ''} ${isToday && !done ? 'today' : ''}">
        <span>${done ? '⭐' : (isToday ? '📅' : '·')}</span>
        <span class="day-label">${label}</span>
      </div>
    `;
  }).join('');

  const recent = state.streak.filter(d => {
    const dd = new Date(d + 'T12:00:00');
    return (Date.now() - dd) < 7*24*60*60*1000;
  }).length;

  const badge = document.getElementById('streak-count-badge');
  if (badge) badge.textContent = `${recent} day${recent !== 1 ? 's' : ''} 🔥`;

  const msg = document.getElementById('streak-message');
  if (msg) {
    msg.textContent = recent === 0 ? 'Start your streak today! 🌟' :
      recent < 3 ? `${recent} days! You're on a roll! 🔥` :
      recent < 5 ? `${recent} days! Amazing streak! 🔥🔥` :
      `${recent} days! You're incredible! 🏆🔥`;
  }

  // Referral progress
  const refPanel = document.getElementById('referral-progress');
  const refText = document.getElementById('referral-progress-text');
  if (refPanel && refText) {
    const smooth = state.smoothMornings || 0;
    if (smooth < 7) {
      refPanel.classList.remove('hidden');
      refText.textContent = `🎁 ${7 - smooth} more smooth mornings = 1 free week for a friend!`;
    } else {
      refPanel.classList.remove('hidden');
      refText.textContent = `🎉 You've unlocked a free week to share with a friend!`;
    }
  }
}

function markStreakToday() {
  const d = today();
  if (!state.streak.includes(d)) {
    state.streak.push(d);
    state.smoothMornings = (state.smoothMornings || 0) + 1;
    save();
    renderStreak();
    if (state.smoothMornings === 7) {
      setTimeout(() => showCelebration('7 Smooth Mornings! 🏆', 'You\'ve unlocked a free week to share with a friend!', '🏆⭐🏆'), 1000);
    }
  }
}

// ===== ROUTINE SCREEN =====
let activeChildTab = 0;

function renderRoutineScreen() {
  renderMomTasks();
  renderChildTabs('child-tabs', activeChildTab, selectChildTab);
  renderChildRoutine(activeChildTab);
}

function renderMomTasks() {
  const done = getMomDoneTasks();
  const container = document.getElementById('mom-tasks');
  if (!container) return;
  container.innerHTML = MOM_TASKS.map(t => {
    const c = !!done[t.id];
    return `
      <div class="task-item ${c ? 'completed' : ''}" onclick="toggleMomTask('${t.id}')">
        <div class="task-checkbox">${c ? '✓' : ''}</div>
        <span class="task-emoji">${t.emoji}</span>
        <div class="flex-1"><div class="task-label">${t.label}</div><div class="task-sublabel">${t.sublabel}</div></div>
      </div>
    `;
  }).join('');
}

function toggleMomTask(id) {
  const done = getMomDoneTasks();
  done[id] = !done[id];
  save();
  renderMomTasks();
  if (MOM_TASKS.every(t => done[t.id])) {
    showCelebration('You\'re ready, Mom! 💅', 'Your morning started perfectly — now the kids!', '⭐⭐⭐');
  }
}

function renderChildTabs(containerId, activeIdx, callback) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (state.children.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-400">Add kids first</p>`;
    return;
  }
  container.innerHTML = state.children.map((child, i) => `
    <button class="child-tab ${i === activeIdx ? 'active' : ''}" onclick="${callback.name}(${i})">
      ${child.avatar} ${child.name}
    </button>
  `).join('');
}

function selectChildTab(i) {
  activeChildTab = i;
  renderChildTabs('child-tabs', i, selectChildTab);
  renderChildRoutine(i);
}

function renderChildRoutine(idx) {
  if (state.children.length === 0) return;
  const child = state.children[idx];
  const tasks = getChildTasks(child);
  const done = getChildDoneTasks(child.id);
  const c = tasks.filter(t => done[t.id]).length;
  const pct = tasks.length ? (c / tasks.length) * 100 : 0;

  setText('active-child-name', `${child.avatar} ${child.name}`);
  setText('child-task-count', `${c}/${tasks.length}`);

  const bar = document.getElementById('routine-progress-bar');
  if (bar) bar.style.width = `${pct}%`;

  const container = document.getElementById('child-tasks');
  if (!container) return;
  container.innerHTML = tasks.map(t => {
    const done2 = !!done[t.id];
    return `
      <div class="task-item ${done2 ? 'completed' : ''}" onclick="toggleChildTask('${child.id}', '${t.id}', ${idx})">
        <div class="task-checkbox">${done2 ? '✓' : ''}</div>
        <span class="task-emoji">${t.emoji}</span>
        <div class="flex-1">
          <div class="task-label">${t.label}</div>
          <div class="task-sublabel">${t.sublabel}</div>
        </div>
        ${!done2 ? `<button class="task-timer-btn" onclick="event.stopPropagation(); openTimer('${t.emoji}','${t.label}',${t.timer},'${child.id}','${t.id}',${idx})">⏱ Go</button>` : ''}
      </div>
    `;
  }).join('');

  const banner = document.getElementById('all-done-banner');
  const allDone = c === tasks.length && tasks.length > 0;
  if (banner) banner.classList.toggle('hidden', !allDone);
  if (allDone) { markStreakToday(); }

  // Update home label
  setText('routine-progress-label', `${c} of ${tasks.length} done`);
}

function toggleChildTask(childId, taskId, idx) {
  const done = getChildDoneTasks(childId);
  done[taskId] = !done[taskId];
  save();
  renderChildRoutine(idx);
  if (done[taskId]) {
    const msgs = ['⭐ Task done!', '🎉 Amazing!', '🏆 Superstar!', '💪 Keep going!', '🚀 Crushing it!'];
    showToast(msgs[Math.floor(Math.random() * msgs.length)]);
  }
}

// ===== TIMER =====
function openTimer(emoji, label, seconds, childId, taskId, childIdx) {
  setText('modal-task-icon', emoji);
  setText('modal-task-name', label);
  setText('modal-motivational', MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)]);

  let remaining = seconds;
  const total = seconds;

  state.timerTaskCallback = () => {
    const done = getChildDoneTasks(childId);
    done[taskId] = true;
    save();
    renderChildRoutine(childIdx);
    showCelebration('Task Complete! 🎉', `${emoji} ${label} — done in record time!`, '⭐⭐⭐');
  };

  document.getElementById('timer-modal').classList.remove('hidden');
  if (state.timerInterval) clearInterval(state.timerInterval);

  const countEl = document.getElementById('timer-countdown');
  const circleEl = document.getElementById('timer-circle');

  state.timerInterval = setInterval(() => {
    remaining--;
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    if (countEl) countEl.textContent = `${m}:${String(s).padStart(2,'0')}`;
    if (circleEl) {
      const p = remaining / total;
      circleEl.style.strokeDashoffset = 339.3 * (1 - p);
    }
    if (remaining <= 10 && countEl) countEl.style.color = '#ef4444';
    if (remaining <= 0) {
      clearInterval(state.timerInterval);
      if (countEl) countEl.textContent = "Time's up! ⏰";
    }
  }, 1000);
}

function closeTimer() {
  clearInterval(state.timerInterval);
  document.getElementById('timer-modal').classList.add('hidden');
  const c = document.getElementById('timer-circle');
  const t = document.getElementById('timer-countdown');
  if (c) c.style.strokeDashoffset = 0;
  if (t) { t.style.color = '#f97316'; }
}

function completeTimerTask() {
  clearInterval(state.timerInterval);
  document.getElementById('timer-modal').classList.add('hidden');
  if (state.timerTaskCallback) state.timerTaskCallback();
}

// ===== BAG SCREEN =====
let activeBagTab = 0;

function renderBagScreen() {
  const day = dayName();
  setText('bag-day-display', `${day}'s school bag checklist`);
  renderChildTabs('bag-child-tabs', activeBagTab, selectBagTab);
  if (state.children.length > 0) renderBagItems(state.children[activeBagTab].id, day);
  else renderBagItems(null, day);
}

function selectBagTab(i) {
  activeBagTab = i;
  renderChildTabs('bag-child-tabs', i, selectBagTab);
  renderBagItems(state.children[i].id, dayName());
}

function renderBagItems(childId, day) {
  const container = document.getElementById('bag-items');
  if (!container) return;
  if (!childId) {
    container.innerHTML = `<div class="text-center text-gray-400 py-6"><div class="text-4xl mb-2">🎒</div><p>Add kids first to use bag check</p></div>`;
    return;
  }
  const items = getBagItemsForChild(childId);
  const relevant = items.filter(i => i.day === 'daily' || i.day === day);
  if (!relevant.length) {
    container.innerHTML = `<div class="bg-white rounded-2xl p-6 text-center text-gray-400"><div class="text-3xl mb-2">✅</div><p>No items for ${day}!</p></div>`;
    return;
  }
  const checked = getBagChecked(childId);
  container.innerHTML = relevant.map(item => {
    const isChecked = !!checked[item.id];
    return `
      <div class="bag-item ${isChecked ? 'checked' : ''}" onclick="toggleBagItem('${childId}','${item.id}')">
        <div class="task-checkbox">${isChecked ? '✓' : ''}</div>
        <span class="text-2xl">${item.emoji || '📦'}</span>
        <div class="flex-1">
          <span class="bag-label">${item.name}</span>
          ${item.day !== 'daily' ? `<span class="text-xs text-orange-500 ml-2 font-semibold">${item.day}</span>` : ''}
        </div>
        <button onclick="event.stopPropagation();deleteBagItem('${childId}','${item.id}')" class="text-gray-300 hover:text-red-400 p-1">✕</button>
      </div>
    `;
  }).join('');

  // Update home badge
  const c = relevant.filter(i => checked[i.id]).length;
  setText('bag-progress-label', `${c}/${relevant.length} packed`);
}

function toggleBagItem(childId, itemId) {
  const checked = getBagChecked(childId);
  checked[itemId] = !checked[itemId];
  save();
  renderBagItems(childId, dayName());
}

function deleteBagItem(childId, itemId) {
  if (state.bagItems[childId]) {
    state.bagItems[childId] = state.bagItems[childId].filter(i => i.id !== itemId);
    save();
    renderBagItems(childId, dayName());
  }
}

function addBagItem() {
  const name = document.getElementById('bag-item-input').value.trim();
  const day = document.getElementById('bag-item-day').value;
  if (!name) return;
  const childId = state.children.length > 0 ? state.children[activeBagTab].id : null;
  if (!childId) return;
  if (!state.bagItems[childId]) state.bagItems[childId] = [...DEFAULT_BAG_ITEMS.map(i=>({...i,id:i.id+'-'+childId}))];

  const emojiMap = {water:'💧',lunch:'🥪',book:'📚',homework:'📝',pe:'👟',kit:'👟',bag:'🎒',snack:'🍎',towel:'🏊',swim:'🏊'};
  const emoji = Object.entries(emojiMap).find(([k]) => name.toLowerCase().includes(k))?.[1] || '📦';
  state.bagItems[childId].push({ id: 'custom_' + Date.now(), name, day, emoji });
  document.getElementById('bag-item-input').value = '';
  save();
  renderBagItems(childId, dayName());
}

// ===== EVENING SCREEN =====
function renderEveningScreen() {
  const done = getEveningDone();
  const c = EVENING_TASKS.filter(t => done[t.id]).length;
  setText('evening-progress-display', `${c}/${EVENING_TASKS.length}`);
  const container = document.getElementById('evening-tasks');
  if (!container) return;
  container.innerHTML = EVENING_TASKS.map(t => {
    const isDone = !!done[t.id];
    return `
      <div class="evening-task ${isDone ? 'completed' : ''}" onclick="toggleEveningTask('${t.id}')">
        <div class="task-checkbox">${isDone ? '✓' : ''}</div>
        <span class="text-2xl">${t.emoji}</span>
        <span class="evening-label flex-1">${t.label}</span>
      </div>
    `;
  }).join('');
  if (c === EVENING_TASKS.length) showToast('🌙 All set for tomorrow!');
}

function toggleEveningTask(id) {
  const done = getEveningDone();
  done[id] = !done[id];
  save();
  renderEveningScreen();
}

// ===== CHILDREN SCREEN =====
function renderChildrenScreen() {
  const container = document.getElementById('children-list');
  if (!container) return;
  if (!state.children.length) {
    container.innerHTML = `<p class="text-center text-gray-400 py-4 text-sm">No kids added yet! Add your first child below.</p>`;
    return;
  }
  container.innerHTML = state.children.map((child, i) => `
    <div class="child-card">
      <div class="flex items-center gap-3">
        <span class="text-4xl">${child.avatar}</span>
        <div class="flex-1">
          <h3 class="font-black text-gray-900">${child.name}</h3>
          <div class="flex flex-wrap gap-1 mt-1">
            <span class="badge badge-age">Age ${child.age}</span>
            ${child.sensory ? '<span class="badge badge-sensory">👕 Sensory</span>' : ''}
            ${child.anxiety ? '<span class="badge badge-anxiety">🎓 Support</span>' : ''}
            <span class="badge" style="background:#fef9c3;color:#854d0e">⭐ ${child.stars||0}</span>
          </div>
        </div>
        <button onclick="removeChild(${i})" class="text-gray-300 hover:text-red-400 p-2 text-lg">✕</button>
      </div>
      ${child.anxiety ? `<div class="mt-3 bg-blue-50 rounded-xl p-3 text-xs text-blue-700"><strong>💙 Tip:</strong> "I know school feels hard today. What's one thing you're looking forward to?"</div>` : ''}
      ${child.sensory ? `<div class="mt-2 bg-yellow-50 rounded-xl p-3 text-xs text-yellow-700"><strong>👕 Tip:</strong> Lay out 2 pre-approved outfit choices the night before to avoid morning conflict.</div>` : ''}
    </div>
  `).join('');
}

function removeChild(i) {
  if (confirm(`Remove ${state.children[i].name}?`)) {
    state.children.splice(i, 1);
    save();
    renderChildrenScreen();
  }
}

function selectNewAge(age) {
  state.selectedNewAge = age;
  document.querySelectorAll('#new-age-selector .age-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.age) === age);
  });
}

function selectNewAvatar(emoji) {
  state.selectedNewAvatar = emoji;
  document.querySelectorAll('#screen-children .avatar-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.emoji === emoji);
  });
}

function addChild() {
  const name = document.getElementById('new-child-name').value.trim();
  if (!name) { showToast('Please enter a name!'); return; }
  if (!state.isPlusUser && !state.trialActive && state.children.length >= 1) {
    showPlusModal(); return;
  }
  state.children.push({
    id: 'child_' + Date.now(),
    name,
    age: state.selectedNewAge || 7,
    avatar: state.selectedNewAvatar,
    sensory: document.getElementById('new-child-sensory').checked,
    anxiety: document.getElementById('new-child-anxiety').checked,
    stars: 0,
  });
  document.getElementById('new-child-name').value = '';
  document.getElementById('new-child-sensory').checked = false;
  document.getElementById('new-child-anxiety').checked = false;
  save();
  renderChildrenScreen();
  showToast('👧 Child added!');
}

// ===== CALM SCREEN =====
function startCalmMode() {
  const panel = document.getElementById('breathing-panel');
  if (panel) { panel.classList.remove('hidden'); panel.scrollIntoView({ behavior:'smooth' }); }
}

let breathPhase = 0, breathCycles = 0;
const PHASES = [
  { label:'Breathe IN', note:'In through your nose...', cls:'expand', ms:4000 },
  { label:'HOLD', note:'Hold gently...', cls:'hold', ms:4000 },
  { label:'Breathe OUT', note:'Out through your mouth...', cls:'shrink', ms:4000 },
];

function startBreathing() {
  const btn = document.getElementById('breath-btn');
  if (btn) btn.style.display = 'none';
  breathCycles = 0;
  runPhase(0);
}

function runPhase(p) {
  if (breathCycles >= 4) {
    setText('breath-text', '✨ Done');
    setText('breath-instruction', 'You did it. You\'ve got this, Mom.');
    const c = document.getElementById('breath-circle');
    if (c) c.className = 'breath-circle';
    const btn = document.getElementById('breath-btn');
    if (btn) { btn.style.display = 'block'; btn.textContent = 'Go Again'; }
    return;
  }
  const ph = PHASES[p];
  setText('breath-text', ph.label);
  setText('breath-instruction', ph.note);
  const c = document.getElementById('breath-circle');
  if (c) c.className = `breath-circle ${ph.cls}`;
  setTimeout(() => {
    const next = (p + 1) % 3;
    if (next === 0) breathCycles++;
    runPhase(next);
  }, ph.ms);
}

function nextScript() {
  state.currentScriptIndex = (state.currentScriptIndex + 1) % CALM_SCRIPTS.length;
  renderCalmScripts();
}

function renderCalmScripts() {
  const container = document.getElementById('calm-scripts');
  if (!container) return;
  const i = state.currentScriptIndex;
  container.innerHTML = [CALM_SCRIPTS[i], CALM_SCRIPTS[(i+1) % CALM_SCRIPTS.length]].map(s =>
    `<div class="calm-script">"${s}"</div>`
  ).join('');
}

// ===== SETTINGS =====
function loadSettings() {
  const n = document.getElementById('settings-mom-name');
  const sh = document.getElementById('settings-hour');
  const sm = document.getElementById('settings-min');
  const sa = document.getElementById('settings-ampm');
  if (n) n.value = state.momName;
  if (sh) sh.value = state.leaveHour;
  if (sm) sm.value = state.leaveMin;
  if (sa) sa.value = state.leaveAmPm;
}

function saveSettings() {
  const n = document.getElementById('settings-mom-name');
  const sh = document.getElementById('settings-hour');
  const sm = document.getElementById('settings-min');
  const sa = document.getElementById('settings-ampm');
  if (n) state.momName = n.value.trim() || state.momName;
  if (sh) state.leaveHour = parseInt(sh.value);
  if (sm) state.leaveMin = sm.value;
  if (sa) state.leaveAmPm = sa.value;
  state.leaveTime = `${state.leaveHour}:${state.leaveMin} ${state.leaveAmPm}`;
  save();
  showToast('✅ Settings saved!');
  showScreen('home');
}

function resetApp() {
  if (confirm('Reset all data? This cannot be undone.')) {
    localStorage.removeItem('morningmate_v2');
    location.reload();
  }
}

// ===== PLUS MODAL =====
function showPlusModal() {
  document.getElementById('plus-modal').classList.remove('hidden');
}
function closePlusModal() {
  document.getElementById('plus-modal').classList.add('hidden');
}
function startTrial() {
  state.isPlusUser = true;
  state.trialActive = true;
  state.trialDaysLeft = 7;
  save();
  closePlusModal();
  showToast('🎉 7-day free trial started!');
  renderHome();
}

// ===== CELEBRATION =====
function showCelebration(title, msg, stars) {
  setText('celebration-title', title);
  setText('celebration-msg', msg);
  setText('celebration-stars', stars);
  document.getElementById('celebration-modal').classList.remove('hidden');
}
function closeCelebration() {
  document.getElementById('celebration-modal').classList.add('hidden');
}

// ===== SHARE =====
function shareApp() {
  const msg = `This app stopped our 8AM screaming matches! Makes school mornings calmer 😊 Try Morning Mate free: https://morningmate.app`;
  if (navigator.share) {
    navigator.share({ title: 'Morning Mate', text: msg });
  } else {
    navigator.clipboard.writeText(msg).then(() => showToast('📋 Share message copied!'));
  }
}

function shareWin() {
  const msg = `We just had a PERFECT school morning — everyone ready on time! 🎉 Morning Mate is a game changer for moms: https://morningmate.app`;
  if (navigator.share) {
    navigator.share({ title: 'Morning Win!', text: msg });
  } else {
    navigator.clipboard.writeText(msg).then(() => showToast('📋 Win message copied!'));
  }
}

// ===== TOAST =====
function showToast(msg) {
  const old = document.getElementById('toast-el');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'toast-el';
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
    background:#1f2937;color:white;padding:10px 20px;border-radius:20px;
    font-size:14px;font-weight:700;z-index:300;
    box-shadow:0 4px 20px rgba(0,0,0,0.3);white-space:nowrap;
    animation:slideUp 0.3s ease;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// Init calm scripts
document.addEventListener('DOMContentLoaded', renderCalmScripts);
