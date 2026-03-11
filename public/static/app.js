// ============================================================
// MORNING MATE - Full App Logic
// ============================================================

// ===== STATE =====
let state = {
  mumName: '',
  leaveTime: '08:30',
  meltdownMins: 35,
  wakeTime: null,
  children: [],
  activeChildIndex: 0,
  activeBagChildIndex: 0,
  mumTasks: {},      // { date: { taskId: completed } }
  childTasks: {},    // { childId: { date: { taskId: completed } } }
  bagItems: {},      // { childId: [{ id, name, day, checked }] }
  eveningTasks: {},  // { date: { taskId: completed } }
  streak: [],        // array of date strings
  onboarded: false,
  selectedAvatar: '🦊',
  selectedNewAvatar: '🦊',
  currentScriptIndex: 0,
  timerInterval: null,
  timerTaskCallback: null,
  breathInterval: null,
};

// ===== DEFAULT DATA =====
const DEFAULT_MUM_TASKS = [
  { id: 'mum-1', emoji: '⏰', label: 'Wake up 20 mins before kids', sublabel: 'Your secret weapon' },
  { id: 'mum-2', emoji: '💧', label: 'Drink a glass of water', sublabel: 'Hydrate first thing' },
  { id: 'mum-3', emoji: '🚿', label: 'Quick shower / freshen up', sublabel: 'You first, always' },
  { id: 'mum-4', emoji: '👗', label: 'Get dressed', sublabel: 'Before the chaos begins' },
  { id: 'mum-5', emoji: '☕', label: 'Make yourself a hot drink', sublabel: 'You deserve it' },
];

const CHILD_TASKS_BY_AGE = {
  '3-5': [
    { id: 't1', emoji: '🛏️', label: 'Get out of bed', sublabel: 'Gentle start', timer: 120 },
    { id: 't2', emoji: '🚽', label: 'Toilet visit', sublabel: 'First thing!', timer: 120 },
    { id: 't3', emoji: '👗', label: 'Get dressed (with help)', sublabel: 'Mum helps today', timer: 180 },
    { id: 't4', emoji: '🧦', label: 'Socks & shoes on', sublabel: 'Check comfort', timer: 120 },
    { id: 't5', emoji: '🍳', label: 'Eat breakfast', sublabel: 'Fuel for the day', timer: 600 },
    { id: 't6', emoji: '🦷', label: 'Brush teeth (with help)', sublabel: '2 minutes!', timer: 120 },
    { id: 't7', emoji: '💆', label: 'Brush hair', sublabel: 'Looking great', timer: 60 },
    { id: 't8', emoji: '🎒', label: 'Grab school bag', sublabel: 'Check it\'s packed', timer: 60 },
  ],
  '6-9': [
    { id: 't1', emoji: '🛏️', label: 'Get out of bed', sublabel: 'You can do it!', timer: 120 },
    { id: 't2', emoji: '🚽', label: 'Bathroom visit', sublabel: 'Before breakfast', timer: 180 },
    { id: 't3', emoji: '👗', label: 'Get dressed', sublabel: 'Clothes are laid out', timer: 180 },
    { id: 't4', emoji: '🧦', label: 'Socks & shoes', sublabel: 'Check they fit ok', timer: 120 },
    { id: 't5', emoji: '🍳', label: 'Eat breakfast', sublabel: 'Eat it all up!', timer: 600 },
    { id: 't6', emoji: '🦷', label: 'Brush teeth', sublabel: '2 whole minutes!', timer: 120 },
    { id: 't7', emoji: '💆', label: 'Hair sorted', sublabel: 'Almost ready!', timer: 60 },
    { id: 't8', emoji: '🎒', label: 'Pack school bag', sublabel: 'Check your checklist', timer: 120 },
    { id: 't9', emoji: '🧥', label: 'Coat & accessories', sublabel: 'Check the weather', timer: 60 },
  ],
  '10+': [
    { id: 't1', emoji: '⏰', label: 'Wake up independently', sublabel: 'Your alarm, your job', timer: 120 },
    { id: 't2', emoji: '🚿', label: 'Shower / wash & dressed', sublabel: 'Full independence!', timer: 600 },
    { id: 't3', emoji: '🍳', label: 'Make & eat breakfast', sublabel: 'You\'ve got this', timer: 600 },
    { id: 't4', emoji: '🦷', label: 'Brush teeth', sublabel: '2 minutes please', timer: 120 },
    { id: 't5', emoji: '🎒', label: 'Pack bag yourself', sublabel: 'Check everything\'s in', timer: 120 },
    { id: 't6', emoji: '📱', label: 'Phone charged & packed', sublabel: 'Don\'t forget it', timer: 60 },
    { id: 't7', emoji: '🧥', label: 'Coat ready at door', sublabel: 'Check the weather', timer: 60 },
    { id: 't8', emoji: '✅', label: 'Final bag check', sublabel: 'Homework? PE kit?', timer: 60 },
  ]
};

const DEFAULT_BAG_ITEMS = [
  { id: 'b1', name: 'Water bottle', day: 'daily', emoji: '💧' },
  { id: 'b2', name: 'Lunch box', day: 'daily', emoji: '🥪' },
  { id: 'b3', name: 'PE Kit', day: 'Monday', emoji: '👟' },
  { id: 'b4', name: 'Library book', day: 'Wednesday', emoji: '📚' },
  { id: 'b5', name: 'Reading folder', day: 'daily', emoji: '📂' },
  { id: 'b6', name: 'Homework', day: 'daily', emoji: '📝' },
];

const DEFAULT_EVENING_TASKS = [
  { id: 'e1', emoji: '👗', label: 'Lay out tomorrow\'s uniform' },
  { id: 'e2', emoji: '🎒', label: 'Pack the school bag' },
  { id: 'e3', emoji: '🥪', label: 'Prepare lunch box' },
  { id: 'e4', emoji: '📝', label: 'Sign any school letters/forms' },
  { id: 'e5', emoji: '🔋', label: 'Charge devices overnight' },
  { id: 'e6', emoji: '👟', label: 'Put PE kit by the door' },
  { id: 'e7', emoji: '⏰', label: 'Set morning alarm' },
  { id: 'e8', emoji: '🌙', label: 'Kids in bed on time' },
];

const CALM_SCRIPTS = [
  "We are doing one thing at a time. Just one thing. That's it.",
  "I am calm. I set the tone for this morning. My children follow my lead.",
  "This is hard but I am doing my best. That's enough.",
  "Deep breath. We have time. We always get there.",
  "I love my children. This moment will pass. We will laugh about this later.",
  "I don't need a perfect morning. I just need a good enough morning.",
  "My children are not giving me a hard time — they are having a hard time.",
];

const MOTIVATIONAL_MSGS = [
  "⚡ Beat the timer!", "🚀 Superstar speed!", "🌟 You've got this!",
  "🏆 Champion mode!", "🎯 Stay focused!", "💪 Almost there!"
];

// ===== HELPERS =====
const today = () => new Date().toISOString().split('T')[0];
const dayName = () => ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
const save = () => localStorage.setItem('morningmate', JSON.stringify(state));

function load() {
  const raw = localStorage.getItem('morningmate');
  if (raw) {
    try {
      const saved = JSON.parse(raw);
      state = { ...state, ...saved };
    } catch(e) {}
  }
}

function getChildTasksForToday(childId) {
  const d = today();
  if (!state.childTasks[childId]) state.childTasks[childId] = {};
  if (!state.childTasks[childId][d]) state.childTasks[childId][d] = {};
  return state.childTasks[childId][d];
}

function getMumTasksForToday() {
  const d = today();
  if (!state.mumTasks[d]) state.mumTasks[d] = {};
  return state.mumTasks[d];
}

function getEveningTasksForToday() {
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

// ===== INIT =====
window.addEventListener('load', () => {
  load();
  if (state.onboarded && state.children.length > 0) {
    showApp();
  } else {
    document.getElementById('onboarding').classList.add('active');
    document.getElementById('onboarding').style.display = 'block';
  }
});

// ===== ONBOARDING =====
let currentStep = 1;

function nextStep(step) {
  if (step === 3) {
    const name = document.getElementById('mum-name-input').value.trim();
    if (!name) { alert('Please enter your name! 😊'); return; }
    state.mumName = name;
  }
  if (step === 4) {
    state.leaveTime = document.getElementById('leave-time-input').value || '08:30';
  }

  document.getElementById(`step-${currentStep}`).classList.add('hidden');
  document.getElementById(`dot-${currentStep}`).classList.remove('active');
  currentStep = step;
  document.getElementById(`step-${step}`).classList.remove('hidden');
  document.getElementById(`dot-${step}`).classList.add('active');
}

function selectAvatar(emoji) {
  state.selectedAvatar = emoji;
  document.querySelectorAll('#step-4 .avatar-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.emoji === emoji);
  });
}

function finishOnboarding() {
  const name = document.getElementById('child-name-input').value.trim();
  if (!name) { alert('Please enter your child\'s name! 😊'); return; }

  const ageGroup = document.getElementById('child-age-input').value;
  state.children.push({
    id: 'child-' + Date.now(),
    name,
    age: ageGroup,
    avatar: state.selectedAvatar,
    sensory: false,
    anxiety: false,
    stars: 0,
  });

  state.onboarded = true;
  save();
  showApp();
}

// ===== APP LAUNCH =====
function showApp() {
  document.getElementById('onboarding').style.display = 'none';
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('app').style.display = 'block';

  initCountdown();
  renderHome();
  renderStreak();
  showScreen('home');
}

// ===== SCREEN NAVIGATION =====
function showScreen(name) {
  document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const screen = document.getElementById(`screen-${name}`);
  if (screen) screen.classList.add('active');

  const nav = document.getElementById(`nav-${name}`);
  if (nav) nav.classList.add('active');

  // Screen-specific renders
  if (name === 'home') { renderHome(); renderStreak(); }
  if (name === 'routine') { renderRoutineScreen(); }
  if (name === 'bag') { renderBagScreen(); }
  if (name === 'evening') { renderEveningScreen(); }
  if (name === 'children') { renderChildrenScreen(); }
  if (name === 'settings') { loadSettings(); }
}

// ===== COUNTDOWN =====
function initCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setInterval(checkMeltdownWindow, 60000);
}

function updateCountdown() {
  const now = new Date();
  const [hours, mins] = state.leaveTime.split(':').map(Number);
  const leave = new Date();
  leave.setHours(hours, mins, 0, 0);

  const diff = leave - now;

  if (diff <= 0) {
    document.getElementById('countdown-display').textContent = 'Time to go! 🚌';
    document.getElementById('countdown-display').classList.add('urgent');
    return;
  }

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  let display = '';
  if (h > 0) display = `${h}h ${String(m).padStart(2,'0')}m`;
  else display = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  document.getElementById('countdown-display').textContent = display;

  if (diff < 600000) {
    document.getElementById('countdown-display').classList.add('urgent');
  } else {
    document.getElementById('countdown-display').classList.remove('urgent');
  }
}

// ===== HOME RENDER =====
function renderHome() {
  const now = new Date();
  const hr = now.getHours();
  let greeting = 'Good morning';
  let icon = '☀️';
  if (hr < 7) { greeting = 'Rise & shine'; icon = '🌤️'; }
  else if (hr >= 12) { greeting = 'Good afternoon'; icon = '🌞'; }

  document.getElementById('greeting-time').textContent = greeting + '!';
  document.getElementById('greeting-name').textContent = `Hey ${state.mumName || 'Mum'} 👋`;
  document.getElementById('date-display').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('home-weather-icon').textContent = icon;
  document.getElementById('leave-time-display').textContent = `Target: ${state.leaveTime}`;

  // Routine progress label
  if (state.children.length > 0) {
    const child = state.children[0];
    const tasks = CHILD_TASKS_BY_AGE[child.age] || [];
    const done = getChildTasksForToday(child.id);
    const completedCount = tasks.filter(t => done[t.id]).length;
    document.getElementById('routine-progress-label').textContent = `${completedCount} of ${tasks.length} done`;
  }

  // Children overview
  const container = document.getElementById('children-overview');
  if (state.children.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-sm text-center py-2">No children added yet</p>`;
    return;
  }

  container.innerHTML = state.children.map(child => {
    const tasks = CHILD_TASKS_BY_AGE[child.age] || [];
    const done = getChildTasksForToday(child.id);
    const completedCount = tasks.filter(t => done[t.id]).length;
    const percent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
    return `
      <div class="flex items-center gap-3">
        <span class="text-2xl">${child.avatar}</span>
        <div class="flex-1">
          <div class="flex justify-between items-center mb-1">
            <span class="font-semibold text-gray-700 text-sm">${child.name}</span>
            <span class="text-xs text-gray-500">${completedCount}/${tasks.length}</span>
          </div>
          <div class="bg-gray-100 rounded-full h-2">
            <div class="bg-gradient-to-r from-orange-400 to-amber-400 h-2 rounded-full transition-all"
              style="width:${percent}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ===== MELTDOWN WARNING =====
function checkMeltdownWindow() {
  if (!state.wakeTime) return;
  const now = Date.now();
  const diff = (now - state.wakeTime) / 60000;
  const panel = document.getElementById('meltdown-warning');
  if (diff >= 30 && diff <= 45) {
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }
}

// ===== STREAK =====
function renderStreak() {
  const container = document.getElementById('streak-display');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayStr = today();

  const last7 = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7.push(d.toISOString().split('T')[0]);
  }

  container.innerHTML = last7.map((d, i) => {
    const isToday = d === todayStr;
    const completed = state.streak.includes(d);
    const dayLabel = days[new Date(d).getDay() === 0 ? 6 : new Date(d).getDay() - 1];
    return `
      <div class="flex flex-col items-center gap-1">
        <div class="streak-day ${completed ? 'completed' : ''} ${isToday ? 'today' : ''}">
          ${completed ? '⭐' : (isToday ? '📅' : '○')}
        </div>
        <span class="text-xs text-gray-400">${dayLabel}</span>
      </div>
    `;
  }).join('');

  const streakCount = state.streak.filter(d => {
    const date = new Date(d);
    const now = new Date();
    return (now - date) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  document.getElementById('streak-message').textContent =
    streakCount === 0 ? 'Start your streak today! 🌟' :
    streakCount < 3 ? `${streakCount} day streak! Keep going! 🔥` :
    streakCount < 5 ? `${streakCount} days! You\'re on fire! 🔥🔥` :
    `${streakCount} days! Incredible! 🏆🔥`;
}

function markStreakToday() {
  const d = today();
  if (!state.streak.includes(d)) {
    state.streak.push(d);
    save();
    renderStreak();
  }
}

// ===== ROUTINE SCREEN =====
let activeChildTab = 0;

function renderRoutineScreen() {
  renderMumTasks();
  renderChildTabs();
  renderChildRoutine(activeChildTab);
}

function renderMumTasks() {
  const done = getMumTasksForToday();
  const container = document.getElementById('mum-tasks');
  container.innerHTML = DEFAULT_MUM_TASKS.map(task => {
    const completed = !!done[task.id];
    return `
      <div class="task-item ${completed ? 'completed' : ''}" onclick="toggleMumTask('${task.id}')">
        <div class="task-checkbox">${completed ? '✓' : ''}</div>
        <span class="task-emoji">${task.emoji}</span>
        <div class="flex-1">
          <div class="task-label">${task.label}</div>
          <div class="task-sublabel">${task.sublabel}</div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleMumTask(id) {
  const done = getMumTasksForToday();
  done[id] = !done[id];
  save();
  renderMumTasks();
  checkAllMumDone();
}

function checkAllMumDone() {
  const done = getMumTasksForToday();
  const allDone = DEFAULT_MUM_TASKS.every(t => done[t.id]);
  if (allDone) showCelebration('You\'re ready, Mum! 💅', 'Your morning started perfectly!', '⭐⭐⭐');
}

function renderChildTabs() {
  const container = document.getElementById('child-tabs');
  if (state.children.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-400">Add children first</p>`;
    return;
  }
  container.innerHTML = state.children.map((child, i) => `
    <button class="child-tab ${i === activeChildTab ? 'active' : ''}" onclick="selectChildTab(${i})">
      <span>${child.avatar}</span> ${child.name}
    </button>
  `).join('');
}

function selectChildTab(index) {
  activeChildTab = index;
  renderChildTabs();
  renderChildRoutine(index);
}

function renderChildRoutine(index) {
  if (state.children.length === 0) return;
  const child = state.children[index];
  const tasks = CHILD_TASKS_BY_AGE[child.age] || [];
  const done = getChildTasksForToday(child.id);

  document.getElementById('active-child-name').textContent = `${child.avatar} ${child.name}'s Tasks`;

  const completedCount = tasks.filter(t => done[t.id]).length;
  document.getElementById('child-task-count').textContent = `${completedCount}/${tasks.length}`;

  const percent = tasks.length ? (completedCount / tasks.length) * 100 : 0;
  document.getElementById('routine-progress-bar').style.width = `${percent}%`;

  const container = document.getElementById('child-tasks');
  container.innerHTML = tasks.map(task => {
    const completed = !!done[task.id];
    return `
      <div class="task-item ${completed ? 'completed' : ''}" onclick="toggleChildTask('${child.id}', '${task.id}', ${index})">
        <div class="task-checkbox">${completed ? '✓' : ''}</div>
        <span class="task-emoji">${task.emoji}</span>
        <div class="flex-1">
          <div class="task-label">${task.label}</div>
          <div class="task-sublabel">${task.sublabel}</div>
        </div>
        ${!completed ? `<button class="task-timer-btn" onclick="event.stopPropagation(); startTimer('${task.emoji}', '${task.label}', ${task.timer}, '${child.id}', '${task.id}', ${index})">⏱ Timer</button>` : ''}
      </div>
    `;
  }).join('');

  const allDone = completedCount === tasks.length && tasks.length > 0;
  document.getElementById('all-done-banner').classList.toggle('hidden', !allDone);

  if (allDone) {
    child.stars = (child.stars || 0) + 1;
    save();
    markStreakToday();
  }

  // Update home label
  if (index === 0) {
    const el = document.getElementById('routine-progress-label');
    if (el) el.textContent = `${completedCount} of ${tasks.length} done`;
  }
}

function toggleChildTask(childId, taskId, childIndex) {
  const done = getChildTasksForToday(childId);
  done[taskId] = !done[taskId];
  save();
  renderChildRoutine(childIndex);

  if (done[taskId]) {
    const msgs = ['⭐ Task done!', '🎉 Amazing!', '🏆 Superstar!', '💪 Keep going!'];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    showMiniToast(msg);
  }
}

// ===== TIMER =====
function startTimer(emoji, label, seconds, childId, taskId, childIndex) {
  let remaining = seconds;
  const total = seconds;

  document.getElementById('modal-task-icon').textContent = emoji;
  document.getElementById('modal-task-name').textContent = label;
  document.getElementById('modal-child-name-display').textContent =
    MOTIVATIONAL_MSGS[Math.floor(Math.random() * MOTIVATIONAL_MSGS.length)];

  state.timerTaskCallback = () => {
    const done = getChildTasksForToday(childId);
    done[taskId] = true;
    save();
    renderChildRoutine(childIndex);
    showCelebration('Task Complete! 🎉', `${emoji} ${label} done in record time!`, '⭐⭐⭐');
  };

  document.getElementById('timer-modal').classList.remove('hidden');

  if (state.timerInterval) clearInterval(state.timerInterval);

  state.timerInterval = setInterval(() => {
    remaining--;
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    document.getElementById('timer-countdown').textContent = `${m}:${String(s).padStart(2,'0')}`;

    const progress = remaining / total;
    const circumference = 339.3;
    document.getElementById('timer-circle').style.strokeDashoffset = circumference * (1 - progress);

    if (remaining <= 10) {
      document.getElementById('timer-countdown').style.color = '#ef4444';
      document.getElementById('timer-motivational').textContent = '🏃 Almost there!';
    }

    if (remaining <= 0) {
      clearInterval(state.timerInterval);
      document.getElementById('timer-countdown').textContent = "Time's up! ⏰";
      document.getElementById('timer-motivational').textContent = '⏰ Did you do it?';
    }
  }, 1000);
}

function closeTimer() {
  clearInterval(state.timerInterval);
  document.getElementById('timer-modal').classList.add('hidden');
  document.getElementById('timer-circle').style.strokeDashoffset = 0;
  document.getElementById('timer-countdown').style.color = '#f97316';
}

function completeTimerTask() {
  clearInterval(state.timerInterval);
  document.getElementById('timer-modal').classList.add('hidden');
  if (state.timerTaskCallback) state.timerTaskCallback();
}

// ===== BAG SCREEN =====
let activeBagChildTab = 0;

function renderBagScreen() {
  const day = dayName();
  document.getElementById('bag-day-display').textContent = `${day}'s school bag checklist`;

  const container = document.getElementById('bag-child-tabs');
  if (state.children.length === 0) {
    container.innerHTML = '';
    renderBagItems(null, day);
    return;
  }

  container.innerHTML = state.children.map((child, i) => `
    <button class="child-tab ${i === activeBagChildTab ? 'active' : ''}" onclick="selectBagChildTab(${i})">
      <span>${child.avatar}</span> ${child.name}
    </button>
  `).join('');

  renderBagItems(state.children[activeBagChildTab].id, day);
}

function selectBagChildTab(index) {
  activeBagChildTab = index;
  document.querySelectorAll('#bag-child-tabs .child-tab').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  renderBagItems(state.children[index].id, dayName());
}

function renderBagItems(childId, day) {
  const items = childId ? getBagItemsForChild(childId) : [];
  const relevant = items.filter(item => item.day === 'daily' || item.day === day);
  const container = document.getElementById('bag-items');

  if (relevant.length === 0) {
    container.innerHTML = `<div class="bg-white rounded-2xl p-6 text-center text-gray-400"><div class="text-3xl mb-2">🎒</div><p>No items for today</p></div>`;
    return;
  }

  const d = today();
  if (!state.bagItems[childId + '_checked']) state.bagItems[childId + '_checked'] = {};
  if (!state.bagItems[childId + '_checked'][d]) state.bagItems[childId + '_checked'][d] = {};
  const checked = state.bagItems[childId + '_checked'][d];

  container.innerHTML = relevant.map(item => {
    const isChecked = !!checked[item.id];
    return `
      <div class="bag-item ${isChecked ? 'checked' : ''}" onclick="toggleBagItem('${childId}', '${item.id}')">
        <div class="task-checkbox">${isChecked ? '✓' : ''}</div>
        <span class="text-2xl">${item.emoji || '📦'}</span>
        <div class="flex-1">
          <span class="bag-label font-semibold text-gray-700">${item.name}</span>
          ${item.day !== 'daily' ? `<span class="text-xs text-orange-500 ml-2">${item.day}</span>` : ''}
        </div>
        <button onclick="event.stopPropagation(); deleteBagItem('${childId}','${item.id}')" class="text-gray-300 hover:text-red-400 text-sm">✕</button>
      </div>
    `;
  }).join('');

  // Update progress label
  const checkedCount = relevant.filter(i => checked[i.id]).length;
  const el = document.getElementById('bag-progress-label');
  if (el) el.textContent = `${checkedCount}/${relevant.length} packed`;
}

function toggleBagItem(childId, itemId) {
  const d = today();
  if (!state.bagItems[childId + '_checked']) state.bagItems[childId + '_checked'] = {};
  if (!state.bagItems[childId + '_checked'][d]) state.bagItems[childId + '_checked'][d] = {};
  const checked = state.bagItems[childId + '_checked'][d];
  checked[itemId] = !checked[itemId];
  save();
  renderBagItems(childId, dayName());
}

function deleteBagItem(childId, itemId) {
  if (!state.bagItems[childId]) return;
  state.bagItems[childId] = state.bagItems[childId].filter(i => i.id !== itemId);
  save();
  renderBagItems(childId, dayName());
}

function addBagItem() {
  const name = document.getElementById('bag-item-input').value.trim();
  const day = document.getElementById('bag-item-day').value;
  if (!name) return;

  const childId = state.children.length > 0 ? state.children[activeBagChildTab].id : 'default';
  if (!state.bagItems[childId]) state.bagItems[childId] = [...DEFAULT_BAG_ITEMS.map(i => ({...i, id: i.id+'-'+childId}))];

  const emojis = { water:'💧', lunch:'🥪', book:'📚', homework:'📝', pe:'👟', kit:'👟', bag:'🎒', letter:'📬', show:'🎨' };
  const emoji = Object.entries(emojis).find(([k]) => name.toLowerCase().includes(k))?.[1] || '📦';

  state.bagItems[childId].push({ id: 'custom-' + Date.now(), name, day, emoji });
  document.getElementById('bag-item-input').value = '';
  save();
  renderBagItems(childId, dayName());
}

// ===== EVENING SCREEN =====
function renderEveningScreen() {
  const done = getEveningTasksForToday();
  const completedCount = DEFAULT_EVENING_TASKS.filter(t => done[t.id]).length;

  document.getElementById('evening-progress-display').textContent = `${completedCount}/${DEFAULT_EVENING_TASKS.length}`;

  const container = document.getElementById('evening-tasks');
  container.innerHTML = DEFAULT_EVENING_TASKS.map(task => {
    const completed = !!done[task.id];
    return `
      <div class="evening-task ${completed ? 'completed' : ''}" onclick="toggleEveningTask('${task.id}')">
        <div class="task-checkbox">${completed ? '✓' : ''}</div>
        <span class="text-2xl">${task.emoji}</span>
        <span class="font-semibold text-gray-700 flex-1">${task.label}</span>
      </div>
    `;
  }).join('');

  if (completedCount === DEFAULT_EVENING_TASKS.length) {
    showMiniToast('🌟 All prep done! Tomorrow will be smooth!');
  }
}

function toggleEveningTask(id) {
  const done = getEveningTasksForToday();
  done[id] = !done[id];
  save();
  renderEveningScreen();
}

// ===== CHILDREN SCREEN =====
function renderChildrenScreen() {
  const container = document.getElementById('children-list');
  if (state.children.length === 0) {
    container.innerHTML = `<div class="text-center text-gray-400 py-4">No children yet. Add your first child below!</div>`;
    return;
  }

  container.innerHTML = state.children.map((child, i) => `
    <div class="child-card">
      <div class="flex items-center gap-3">
        <span class="text-4xl">${child.avatar}</span>
        <div class="flex-1">
          <h3 class="font-bold text-gray-800">${child.name}</h3>
          <p class="text-sm text-gray-500">Age group: ${child.age}</p>
          <div class="child-badges">
            <span class="badge badge-age">${child.age} yrs</span>
            ${child.sensory ? '<span class="badge badge-sensory">👕 Sensory</span>' : ''}
            ${child.anxiety ? '<span class="badge badge-anxiety">🎓 Needs support</span>' : ''}
            <span class="badge" style="background:#fef9c3;color:#854d0e">⭐ ${child.stars || 0} stars</span>
          </div>
        </div>
        <button onclick="removeChild(${i})" class="text-red-300 hover:text-red-500 text-sm p-2">✕</button>
      </div>
      ${child.anxiety ? `
        <div class="mt-3 bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
          <strong>💙 Anxiety support active:</strong> Extra time buffer added. Try: "I know school feels hard today. What's one thing you're looking forward to?"
        </div>
      ` : ''}
      ${child.sensory ? `
        <div class="mt-3 bg-yellow-50 rounded-xl p-3 text-sm text-yellow-700">
          <strong>👕 Sensory note:</strong> Lay out pre-approved clothes the night before. Let them choose between 2 safe options to avoid morning conflict.
        </div>
      ` : ''}
    </div>
  `).join('');
}

function removeChild(index) {
  if (confirm(`Remove ${state.children[index].name}?`)) {
    state.children.splice(index, 1);
    save();
    renderChildrenScreen();
  }
}

function selectNewAvatar(emoji) {
  state.selectedNewAvatar = emoji;
  document.querySelectorAll('#screen-children .avatar-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.emoji === emoji);
  });
}

function addChild() {
  const name = document.getElementById('new-child-name').value.trim();
  if (!name) { alert('Please enter a name!'); return; }

  state.children.push({
    id: 'child-' + Date.now(),
    name,
    age: document.getElementById('new-child-age').value,
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
  showMiniToast('👧 Child added!');
}

// ===== CALM SCREEN =====
function startCalmMode() {
  document.getElementById('breathing-panel').classList.remove('hidden');
  document.getElementById('breathing-panel').scrollIntoView({ behavior: 'smooth' });
}

let breathingPhase = 0;
let breathCount = 0;
const breathPhases = [
  { label: 'Breathe IN', instruction: 'Slowly breathe in through your nose...', class: 'expand', duration: 4000 },
  { label: 'HOLD', instruction: 'Hold your breath gently...', class: 'hold', duration: 4000 },
  { label: 'Breathe OUT', instruction: 'Slowly breathe out through your mouth...', class: 'shrink', duration: 4000 },
];

function startBreathing() {
  document.getElementById('breath-btn').style.display = 'none';
  breathCount = 0;
  runBreathPhase(0);
}

function runBreathPhase(phase) {
  if (breathCount >= 4) {
    document.getElementById('breath-text').textContent = '✨ Done';
    document.getElementById('breath-instruction').textContent = 'You did it. Take a moment. You\'ve got this.';
    document.getElementById('breath-circle').className = 'breath-circle';
    document.getElementById('breath-btn').style.display = 'block';
    document.getElementById('breath-btn').textContent = 'Again';
    return;
  }

  const p = breathPhases[phase];
  document.getElementById('breath-text').textContent = p.label;
  document.getElementById('breath-instruction').textContent = p.instruction;
  document.getElementById('breath-circle').className = `breath-circle ${p.class}`;

  setTimeout(() => {
    const next = (phase + 1) % 3;
    if (next === 0) breathCount++;
    runBreathPhase(next);
  }, p.duration);
}

function nextScript() {
  state.currentScriptIndex = (state.currentScriptIndex + 1) % CALM_SCRIPTS.length;
  renderCalmScripts();
}

function renderCalmScripts() {
  const container = document.getElementById('calm-scripts');
  const idx = state.currentScriptIndex;
  const show = [
    CALM_SCRIPTS[idx],
    CALM_SCRIPTS[(idx + 1) % CALM_SCRIPTS.length],
  ];
  container.innerHTML = show.map(s => `<div class="calm-script">${s}</div>`).join('');
}

// Render calm scripts on load
document.addEventListener('DOMContentLoaded', renderCalmScripts);

// ===== SETTINGS =====
function loadSettings() {
  document.getElementById('settings-mum-name').value = state.mumName || '';
  document.getElementById('settings-leave-time').value = state.leaveTime || '08:30';
  document.getElementById('settings-meltdown').value = state.meltdownMins || 35;
}

function saveSettings() {
  state.mumName = document.getElementById('settings-mum-name').value.trim() || state.mumName;
  state.leaveTime = document.getElementById('settings-leave-time').value || '08:30';
  state.meltdownMins = parseInt(document.getElementById('settings-meltdown').value);
  save();
  showMiniToast('✅ Settings saved!');
  showScreen('home');
}

function resetApp() {
  if (confirm('Reset all data? This cannot be undone.')) {
    localStorage.removeItem('morningmate');
    location.reload();
  }
}

// ===== CELEBRATION MODAL =====
function showCelebration(title, msg, stars) {
  document.getElementById('celebration-title').textContent = title;
  document.getElementById('celebration-msg').textContent = msg;
  document.getElementById('celebration-stars').textContent = stars;
  document.getElementById('celebration-modal').classList.remove('hidden');
}

function closeCelebration() {
  document.getElementById('celebration-modal').classList.add('hidden');
}

// ===== MINI TOAST =====
function showMiniToast(message) {
  const existing = document.getElementById('mini-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'mini-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: #1f2937; color: white; padding: 10px 20px;
    border-radius: 20px; font-size: 14px; font-weight: 600;
    z-index: 200; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: slideUp 0.3s ease;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ===== Wake time detection =====
// Track page load as approximate wake time if morning
const loadHour = new Date().getHours();
if (loadHour >= 5 && loadHour <= 9 && !state.wakeTime) {
  state.wakeTime = Date.now();
  save();
}

// ===== Init calm scripts on screen show =====
document.addEventListener('DOMContentLoaded', () => {
  renderCalmScripts();
});
