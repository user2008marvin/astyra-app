// ============================================================
// MORNING MATE v4 — Kid-First Haptic Emoji Experience
// All prompts implemented: emoji chain, haptics, explosions,
// streaks, parent PIN, night prep, photo proof, A/B mottos
// ============================================================

// ── A/B MOTTO ROTATION ──────────────────────────────────────
const MOTTOS = [
  'Morning chores → kid cheers.',
  'Dreaded tasks → kid cheers.',
  'Chores they crave → kid cheers.'
];

// ── MASCOT STATES ────────────────────────────────────────────
const MASCOT_STATES = ['😴','🙂','😊','🤩','😎','🥳','🏆'];
const MASCOT_CLASSES = ['','','','excited','excited','excited','legendary'];
const MASCOT_SPEECH = [
  'Tap me awake! 👆',
  'Nice one! Keep going! 🌟',
  'You\'re on fire! 🔥',
  'YASSS! I\'m so hyped! 🤩',
  'Nothing can stop us! 💪',
  'Almost LEGENDARY! 🥳',
  'LEGENDARY STATUS! 🏆✨',
];

function updateMascot(starsCount) {
  const idx = Math.min(starsCount, MASCOT_STATES.length - 1);
  const el = document.getElementById('mascot-char');
  const bubble = document.getElementById('mascot-bubble');
  if (!el) return;
  el.textContent = MASCOT_STATES[idx];
  el.className = 'mascot-char ' + (MASCOT_CLASSES[idx] || '');
  // bounce animation
  el.style.transform = 'scale(1.5) rotate(20deg)';
  setTimeout(() => { el.style.transform = ''; }, 400);
  if (bubble) {
    bubble.textContent = MASCOT_SPEECH[idx];
    bubble.classList.remove('hidden');
    clearTimeout(bubble._to);
    bubble._to = setTimeout(() => bubble.classList.add('hidden'), 2000);
  }
}

// Show initial mascot speech on load
function initMascot() {
  const bubble = document.getElementById('mascot-bubble');
  if (bubble) {
    bubble.textContent = MASCOT_SPEECH[0];
    bubble.classList.remove('hidden');
    setTimeout(() => bubble.classList.add('hidden'), 2500);
  }
}


const TASKS = [
  { emoji: '☀️', label: 'WAKE UP',    yell: 'Rise and shine! ☀️',   sound: 'sunburst'  },
  { emoji: '🛁', label: 'SHOWER',     yell: 'Clean champ! 🛁',      sound: 'splash'    },
  { emoji: '🥛', label: 'BREAKFAST',  yell: 'Fuel up! 🥛',          sound: 'cereal'    },
  { emoji: '🪥', label: 'BRUSH TEETH',yell: 'Shiny smile! 🪥',      sound: 'sparkle'   },
  { emoji: '🎒', label: 'PACK BAG',   yell: 'Ready to fly! 🎒',     sound: 'zipper'    },
  { emoji: '🚀', label: 'SCHOOL!',    yell: 'DAILY WINNER! 🏆',     sound: 'rocket'    },
];

const NIGHT_TASKS = [
  { id: 'n1', emoji: '👗', label: 'Lay out tomorrow\'s clothes' },
  { id: 'n2', emoji: '🎒', label: 'Pack school bag tonight' },
  { id: 'n3', emoji: '🥪', label: 'Prep lunch box' },
  { id: 'n4', emoji: '🔋', label: 'Charge all devices' },
  { id: 'n5', emoji: '⏰', label: 'Set morning alarm' },
  { id: 'n6', emoji: '🌙', label: 'Kids in bed on time' },
];

// ── STATE ────────────────────────────────────────────────────
let S = {
  kidName: 'Sarah',
  kidAge: 7,
  leaveHour: 8,
  leaveMin: '15',
  leaveAmPm: 'AM',
  PIN: '1234',
  starGoal: 20,
  reward: 'Ice Cream Friday',
  currentTask: 0,         // which task is active (0-5)
  starsToday: 0,          // stars earned today
  totalStars: 0,          // all-time stars
  streak: [],             // ['2025-03-14', ...]
  lastCompleted: '',       // date of last full completion
  photos: {},             // { date_taskIdx: dataUrl }
  nightDone: {},          // { date: {id: bool} }
  pinBuffer: [],
  onboarded: false,
  obSelectedAge: 7,
  mottoIdx: 0,
};

const today = () => new Date().toISOString().split('T')[0];
const save  = () => localStorage.setItem('mm_v4', JSON.stringify(S));
const $     = id => document.getElementById(id);
const set   = (id, v) => { const e = $(id); if (e) e.textContent = v; };
const show  = id => { const e = $(id); if (e) e.classList.remove('hidden'); };
const hide  = id => { const e = $(id); if (e) e.classList.add('hidden'); };

function load() {
  try {
    const d = localStorage.getItem('mm_v4');
    if (d) Object.assign(S, JSON.parse(d));
  } catch (e) {}
}

// ── BOOT ─────────────────────────────────────────────────────
window.addEventListener('load', () => {
  load();
  // Pick random motto
  S.mottoIdx = Math.floor(Math.random() * MOTTOS.length);
  setMotto();

  if (S.onboarded) {
    // Reset today's tasks if new day
    if (S.lastCompleted !== today()) {
      S.currentTask = 0;
      S.starsToday = 0;
    }
    launchKidApp();
  } else {
    show('screen-ob');
  }
});

function setMotto() {
  const m = MOTTOS[S.mottoIdx];
  const els = document.querySelectorAll('#motto-text, #ob-motto');
  els.forEach(el => { if (el) el.textContent = m; });
}

// ── ONBOARDING ───────────────────────────────────────────────
function obSelAge(a, btn) {
  S.obSelectedAge = a;
  document.querySelectorAll('#ob-ages .age-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function obNext(step) {
  if (step === 2) {
    hide('obs1'); show('obs2');
    setTimeout(() => $('ob-kname')?.focus(), 100);
    return;
  }
  if (step === 3) {
    const nm = ($('ob-kname')?.value || '').trim();
    if (!nm) { toast('Enter your kid\'s name! 😊'); return; }
    S.kidName = nm;
    S.kidAge  = S.obSelectedAge;
    hide('obs2'); show('obs3');
    return;
  }
}

function obFinish() {
  S.leaveHour  = parseInt($('ob-hr')?.value || 8);
  S.leaveMin   = $('ob-min')?.value || '15';
  S.leaveAmPm  = $('ob-ap')?.value || 'AM';
  S.onboarded  = true;
  S.currentTask = 0;
  S.starsToday  = 0;
  save();
  hide('screen-ob');
  launchKidApp();
}

// ── APP LAUNCH ───────────────────────────────────────────────
function launchKidApp() {
  show('screen-kid');
  updateStreakBanner();
  renderEmojiChain();
  showCurrentTask();
  startCountdown();
  setMotto();
  hideAllDone();
  setTimeout(initMascot, 800);
}

// ── COUNTDOWN ────────────────────────────────────────────────
let cdInterval = null;

function startCountdown() {
  updateCd();
  if (cdInterval) clearInterval(cdInterval);
  cdInterval = setInterval(updateCd, 1000);
}

function to24(h, m, ap) {
  let hh = parseInt(h);
  if (ap === 'PM' && hh !== 12) hh += 12;
  if (ap === 'AM' && hh === 12) hh = 0;
  return { h: hh, m: parseInt(m) };
}

function updateCd() {
  const now  = new Date();
  const { h, m } = to24(S.leaveHour, S.leaveMin, S.leaveAmPm);
  const leave = new Date(); leave.setHours(h, m, 0, 0);
  const diff  = leave - now;
  const pill  = $('kid-cd-pill');
  if (!pill) return;

  if (diff <= 0) {
    $('kid-cd-num').textContent = "Let's go! 🚌";
    pill.classList.add('urgent');
    return;
  }
  const mm = Math.floor(diff / 60000);
  const ss = Math.floor((diff % 60000) / 1000);
  $('kid-cd-num').textContent = mm > 0
    ? `${mm} min`
    : `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  pill.classList.toggle('urgent', diff < 600000);
}

// ── TASK DISPLAY ─────────────────────────────────────────────
function showCurrentTask() {
  if (S.currentTask >= TASKS.length) {
    showAllDone();
    return;
  }
  const t = TASKS[S.currentTask];
  const btn = $('mega-btn');
  const emojiEl = $('mega-emoji');
  const labelEl = $('mega-label');

  if (emojiEl) {
    emojiEl.style.transform = 'scale(0)';
    setTimeout(() => {
      emojiEl.textContent = t.emoji;
      emojiEl.style.transform = 'scale(1)';
      emojiEl.style.transition = 'transform .3s cubic-bezier(.175,.885,.32,1.275)';
    }, 150);
  }
  if (labelEl) labelEl.textContent = t.label;

  // Star counter
  set('star-count', `⭐ ${S.starsToday} / 6 ⭐`);

  renderEmojiChain();
}

function renderEmojiChain() {
  const el = $('emoji-chain');
  if (!el) return;
  el.innerHTML = TASKS.map((t, i) => {
    let cls = 'ec-step';
    if (i < S.currentTask) cls += ' done';
    else if (i === S.currentTask) cls += ' active';
    return `<span class="${cls}">${t.emoji}</span>`;
  }).join('');
}

// ── TAP TASK (main handler) ──────────────────────────────────
function tapTask() {
  if (S.currentTask >= TASKS.length) return;
  const t = TASKS[S.currentTask];

  // 1. HAPTIC — hard 3-sec vibration pattern
  haptic();

  // 2. BUTTON shake animation
  const btn = $('mega-btn');
  if (btn) {
    btn.style.animation = 'btnShake .4s ease';
    setTimeout(() => { btn.style.animation = ''; }, 450);
  }

  // 3. SCREEN SHAKE
  screenShake();

  // 4. EMOJI EXPLOSION
  explode();

  // 5. YELL TEXT
  yellText(t.yell);

  // 6. Advance task
  S.currentTask++;
  S.starsToday++;
  S.totalStars++;
  save();

  // 7. Update mascot
  updateMascot(S.starsToday);

  // 7. Show next task after animation
  setTimeout(() => {
    showCurrentTask();
  }, 700);
}

// ── HAPTIC ───────────────────────────────────────────────────
function haptic() {
  if (!navigator.vibrate) return;
  // Hard 3-second pattern: on 200ms, off 100ms, repeat
  navigator.vibrate([200, 80, 200, 80, 200, 80, 200, 80, 200, 80, 200]);
}

// ── SCREEN SHAKE ─────────────────────────────────────────────
function screenShake() {
  const stage = $('kid-stage');
  if (!stage) return;
  stage.style.animation = 'stageShake .4s ease';
  setTimeout(() => { stage.style.animation = ''; }, 450);
}

// inject shake keyframes once
(function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes btnShake {
      0%,100%{transform:scale(1) rotate(0)}
      15%{transform:scale(.93) rotate(-4deg)}
      30%{transform:scale(1.07) rotate(4deg)}
      45%{transform:scale(.96) rotate(-3deg)}
      60%{transform:scale(1.04) rotate(2deg)}
      75%{transform:scale(.98) rotate(-1deg)}
    }
    @keyframes stageShake {
      0%,100%{transform:translateX(0)}
      15%{transform:translateX(-8px)}
      30%{transform:translateX(10px)}
      45%{transform:translateX(-7px)}
      60%{transform:translateX(6px)}
      75%{transform:translateX(-3px)}
      90%{transform:translateX(2px)}
    }
  `;
  document.head.appendChild(style);
})();

// ── EMOJI EXPLOSION ──────────────────────────────────────────
function explode() {
  const canvas  = $('explode-canvas');
  if (!canvas) return;
  const t = TASKS[Math.max(0, S.currentTask)];
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  // Create 50 mini-particles
  const particles = [];
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 12;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      emoji: t.emoji,
      size: 18 + Math.random() * 28,
      life: 1,
      decay: 0.018 + Math.random() * 0.02,
    });
  }

  // Also big burst ring
  const rings = [{ r: 0, maxR: Math.max(cx, cy) * 1.4, life: 1 }];

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ring
    rings.forEach(ring => {
      ring.r += 18;
      ring.life -= 0.04;
      if (ring.life > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,220,50,${ring.life * 0.4})`;
        ctx.lineWidth = 6 * ring.life;
        ctx.stroke();
      }
    });

    // Draw particles
    let alive = false;
    particles.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.5; // gravity
      p.vx *= 0.97;
      p.life -= p.decay;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, p.x, p.y);
      ctx.restore();
    });

    frame++;
    if (frame < 80 || alive) {
      requestAnimationFrame(draw);
    } else {
      canvas.classList.remove('active');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  draw();
}

// ── YELL TEXT ────────────────────────────────────────────────
function yellText(msg) {
  const el = $('yell-text');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden', 'pop');
  // force reflow
  void el.offsetWidth;
  el.classList.add('pop');
  setTimeout(() => { el.classList.add('hidden'); el.classList.remove('pop'); }, 1200);
}

// ── ALL DONE ─────────────────────────────────────────────────
function showAllDone() {
  const screen = $('all-done-screen');
  if (!screen) return;
  screen.classList.remove('hidden');

  set('all-done-sub', `${S.kidName} crushed it today! 🏆`);
  set('all-done-stars', '⭐'.repeat(6));

  // Mark streak
  const d = today();
  if (!S.streak.includes(d)) {
    S.streak.push(d);
    S.lastCompleted = d;
    save();
  }
  updateStreakBanner();

  // Big confetti explosion
  setTimeout(explode, 300);
  setTimeout(explode, 800);

  // Haptic victory fanfare
  if (navigator.vibrate) {
    navigator.vibrate([300, 100, 300, 100, 600]);
  }
}

function hideAllDone() {
  const screen = $('all-done-screen');
  if (screen) screen.classList.add('hidden');
}

function resetForTomorrow() {
  // Reset task counter but keep stars/streak
  S.currentTask = 0;
  S.starsToday  = 0;
  save();
  hideAllDone();
  showCurrentTask();
  renderEmojiChain();
}

// ── STREAK BANNER ────────────────────────────────────────────
function updateStreakBanner() {
  set('sb-name', S.kidName);

  const last7  = S.streak.filter(d => (Date.now() - new Date(d + 'T12:00:00')) < 7 * 864e5);
  const streak = last7.length;
  set('sb-fire', streak > 0 ? `🔥 ${streak}-DAY STREAK!` : '🌟 Start your streak!');

  const prog = S.totalStars % S.starGoal;
  const left = S.starGoal - prog;
  set('sb-stars', `⭐ ${prog}/${S.starGoal} → ${S.reward}`);
}

// ── PIN FLOW ─────────────────────────────────────────────────
function askPin() {
  S.pinBuffer = [];
  set('pin-display', '_ _ _ _');
  show('pin-modal');
}

function closePin() {
  hide('pin-modal');
}

function pinTap(n) {
  if (S.pinBuffer.length >= 4) return;
  S.pinBuffer.push(n);
  haptic(); // tiny haptic per digit
  if (navigator.vibrate) navigator.vibrate(30);
  const filled  = '●'.repeat(S.pinBuffer.length);
  const empty   = '_ '.repeat(4 - S.pinBuffer.length);
  set('pin-display', (filled + ' ' + empty).trim());
}

function pinClear() {
  S.pinBuffer = [];
  set('pin-display', '_ _ _ _');
}

function pinSubmit() {
  if (S.pinBuffer.join('') === String(S.PIN)) {
    hide('pin-modal');
    openParent();
  } else {
    set('pin-display', '❌ Wrong PIN');
    if (navigator.vibrate) navigator.vibrate([200, 50, 200]);
    setTimeout(() => { S.pinBuffer = []; set('pin-display', '_ _ _ _'); }, 1300);
  }
}

// ── PARENT DASHBOARD ─────────────────────────────────────────
function openParent() {
  show('screen-parent');
  hide('screen-kid');
  renderParentDash();
}

function exitParent() {
  hide('screen-parent');
  show('screen-kid');
}

function renderParentDash() {
  // Stats
  const d7 = S.streak.filter(d => (Date.now() - new Date(d + 'T12:00:00')) < 7 * 864e5);
  set('p-stat-days', d7.length);
  set('p-stat-stars', S.totalStars);
  set('p-stat-streak', d7.length);

  // Week row
  const wr = $('p-week-row');
  if (wr) {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(); dd.setDate(dd.getDate() - (6 - i));
      return dd.toISOString().split('T')[0];
    });
    wr.innerHTML = last7.map(d => {
      const done = S.streak.includes(d);
      const di   = new Date(d + 'T12:00:00');
      const lbl  = days[di.getDay() === 0 ? 6 : di.getDay() - 1];
      return `<div class="p-week-day${done ? ' done' : ''}">${done ? '⭐' : '·'}<br/>${lbl}</div>`;
    }).join('');
  }

  // Message
  const streak = d7.length;
  let msg = 'Start your streak today! 🌟';
  if (streak >= 7) msg = `${S.kidName} crushed 7/7 mornings this week! 🔥🏆`;
  else if (streak >= 5) msg = `${streak} days! You\'re on fire! 🔥🔥`;
  else if (streak >= 3) msg = `${streak} days! Keep the momentum! 🌟`;
  else if (streak >= 1) msg = `${streak} day${streak !== 1 ? 's' : ''}! Keep going! 🌱`;
  set('p-msg', msg);

  // Photos
  const pg = $('p-photos');
  if (pg) {
    const todayPhotos = Object.entries(S.photos)
      .filter(([k]) => k.startsWith(today() + '_'))
      .map(([k, v]) => {
        const taskIdx = parseInt(k.split('_')[1]);
        const taskName = TASKS[taskIdx]?.label || 'Task';
        return `<div style="text-align:center">
          <img src="${v}" class="p-photo" alt="${taskName}"/>
          <div style="font-size:.6rem;color:#9ca3af;margin-top:2px">${taskName}</div>
        </div>`;
      });
    pg.innerHTML = todayPhotos.length
      ? todayPhotos.join('')
      : '<p class="p-empty">No photos yet. Kid taps 📷 on each task!</p>';
  }

  // Night tasks
  renderNightTasks();

  // Mom's Voice Mode
  renderVoiceMode();

  // Pre-fill settings
  const pk = $('p-kname'); if (pk) pk.value = S.kidName;
  const ph = $('p-hr');    if (ph) ph.value = S.leaveHour;
  const pm = $('p-min');   if (pm) pm.value = S.leaveMin;
  const pa = $('p-ap');    if (pa) pa.value = S.leaveAmPm;
  const pg2 = $('p-goal'); if (pg2) pg2.value = S.starGoal;
  const pr = $('p-reward'); if (pr) pr.value = S.reward;
}

// ── MOM'S VOICE MODE ─────────────────────────────────────────
function renderVoiceMode() {
  const el = $('voice-tasks');
  if (!el) return;
  if (!S.voiceClips) S.voiceClips = {};
  el.innerHTML = TASKS.map((t, i) => {
    const hasClip = !!S.voiceClips[i];
    return `<div style="display:flex;align-items:center;gap:10px;padding:10px;background:rgba(255,255,255,.05);border-radius:14px;border:1px solid rgba(255,255,255,.1)">
      <span style="font-size:1.4rem">${t.emoji}</span>
      <span style="flex:1;font-size:.82rem;font-weight:700;color:white">${t.label}</span>
      ${hasClip
        ? `<button onclick="playVoice(${i})" style="background:rgba(74,222,128,.2);border:1px solid #4ade80;color:#4ade80;border-radius:10px;padding:5px 10px;font-size:.72rem;font-weight:800;cursor:pointer">▶ Play</button>
           <button onclick="deleteVoice(${i})" style="background:rgba(239,68,68,.15);border:1px solid #f87171;color:#f87171;border-radius:10px;padding:5px 8px;font-size:.72rem;cursor:pointer">✕</button>`
        : `<button onclick="recordVoice(${i})" style="background:rgba(219,39,119,.2);border:1px solid #f472b6;color:#f472b6;border-radius:10px;padding:5px 10px;font-size:.72rem;font-weight:800;cursor:pointer">🎤 Record</button>`
      }
    </div>`;
  }).join('');
}

function recordVoice(taskIdx) {
  if (!navigator.mediaDevices?.getUserMedia) {
    toast('🎤 Microphone not available on this device');
    return;
  }
  toast(`🎤 Recording "${TASKS[taskIdx].label}"... tap Stop when done`);
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = ev => {
        if (!S.voiceClips) S.voiceClips = {};
        S.voiceClips[taskIdx] = ev.target.result;
        save();
        renderVoiceMode();
        toast(`✅ Voice saved for ${TASKS[taskIdx].label}!`);
      };
      reader.readAsDataURL(blob);
      stream.getTracks().forEach(t => t.stop());
    };
    recorder.start();
    // Auto-stop after 5 seconds
    setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); }, 5000);
    // Show stop button via toast
    setTimeout(() => toast('⏹ Recording saved!'), 5100);
  }).catch(() => toast('🎤 Microphone permission denied'));
}

function playVoice(taskIdx) {
  if (!S.voiceClips?.[taskIdx]) return;
  const audio = new Audio(S.voiceClips[taskIdx]);
  audio.play().catch(() => toast('Could not play audio'));
}

function deleteVoice(taskIdx) {
  if (S.voiceClips) {
    delete S.voiceClips[taskIdx];
    save();
    renderVoiceMode();
    toast('🗑 Voice clip deleted');
  }
}

// ── NIGHT PREP ───────────────────────────────────────────────
function getNightDone() {
  const d = today();
  if (!S.nightDone[d]) S.nightDone[d] = {};
  return S.nightDone[d];
}

function renderNightTasks() {
  const el = $('p-night-tasks');
  if (!el) return;
  const done = getNightDone();
  el.innerHTML = NIGHT_TASKS.map(t => {
    const c = !!done[t.id];
    return `<div class="p-task-item${c ? ' done' : ''}" onclick="toggleNight('${t.id}')">
      <div class="p-task-cb">${c ? '✓' : ''}</div>
      <span style="font-size:1.3rem">${t.emoji}</span>
      <span style="font-size:.88rem;font-weight:600;color:#111827;flex:1">${t.label}</span>
    </div>`;
  }).join('');
}

function toggleNight(id) {
  const d = getNightDone();
  d[id] = !d[id];
  save();
  renderNightTasks();
}

// ── SETTINGS SAVE ────────────────────────────────────────────
function saveSettings() {
  const nm = ($('p-kname')?.value || '').trim();
  if (nm) S.kidName = nm;
  S.leaveHour  = parseInt($('p-hr')?.value || 8);
  S.leaveMin   = $('p-min')?.value || '15';
  S.leaveAmPm  = $('p-ap')?.value || 'AM';
  S.starGoal   = parseInt($('p-goal')?.value || 20);
  S.reward     = ($('p-reward')?.value || 'Ice Cream Friday').trim();
  const pin    = ($('p-pin')?.value || '').trim();
  if (pin.length === 4 && /^\d{4}$/.test(pin)) S.PIN = pin;
  save();
  toast('✅ Settings saved!');
  updateStreakBanner();
  // Update kid name in main app
  set('sb-name', S.kidName);
}

// ── RESET ────────────────────────────────────────────────────
function resetApp() {
  if (confirm('Reset all data? This cannot be undone.')) {
    localStorage.removeItem('mm_v4');
    location.reload();
  }
}

// ── SHARE PHOTOS ─────────────────────────────────────────────
function sharePhotos() {
  const msg = `${S.kidName} crushed morning routine today! 🎉 Photos attached — Morning Mate app is amazing! https://morningmate.app`;
  if (navigator.share) {
    navigator.share({ title: 'Morning Win! 🏆', text: msg });
  } else {
    navigator.clipboard?.writeText(msg).then(() => toast('📋 Message copied! Send to co-parent.'));
  }
}

// ── TOAST ────────────────────────────────────────────────────
function toast(msg) {
  let t = $('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._to);
  t._to = setTimeout(() => t.classList.add('hidden'), 2500);
}
