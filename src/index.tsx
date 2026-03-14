import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
const app = new Hono()
app.use('/static/*', serveStatic({ root: './' }))
app.get('/', (c) => c.html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<title>Morning Mate 🌅</title>
<link href="/static/style.css" rel="stylesheet"/>
</head>
<body>

<!-- ══════════════ ONBOARDING ══════════════ -->
<div id="screen-ob" class="fullscreen">
  <div class="ob-bg">
    <div class="ob-hero">
      <div class="ob-sun">☀️</div>
      <div class="ob-clouds"><span class="cloud c1">☁️</span><span class="cloud c2">⛅</span></div>
      <div class="ob-family">
        <div class="ob-char ob-mom">
          <div class="ob-bubble">☕ Ready!</div>
          <div class="ob-avatar" style="background:#fde68a">👩</div>
          <span style="font-size:.6rem;font-weight:800;color:#7c2d12;margin-top:3px">Mom</span>
        </div>
        <div class="ob-char ob-kid1">
          <div class="ob-bubble">🎒 Let's go!</div>
          <div class="ob-avatar" style="background:#ddd6fe">👧</div>
          <span style="font-size:.6rem;font-weight:800;color:#7c2d12;margin-top:3px">Sarah</span>
        </div>
        <div class="ob-char ob-kid2">
          <div class="ob-bubble">🚀 Yay!</div>
          <div class="ob-avatar" style="background:#bbf7d0">👦</div>
          <span style="font-size:.6rem;font-weight:800;color:#7c2d12;margin-top:3px">Jake</span>
        </div>
      </div>
      <div class="ob-bus">🚌<br/>School bus!</div>
    </div>

    <div class="ob-card">
      <!-- Step 1: Welcome -->
      <div id="obs1" class="ob-step">
        <div class="ob-logo">🌅 Morning Mate</div>
        <div class="ob-motto-tag" id="ob-motto">✨ Morning chores → kid cheers.</div>
        <h2 class="ob-headline">Calm school mornings start here.</h2>
        <p class="ob-sub">Less yelling, more connection — for US moms.</p>
        <div class="ob-proof">
          <div class="ob-stars">⭐⭐⭐⭐⭐ <span>4.9 / 5 from 2,400+ moms</span></div>
          <p class="ob-quote">"Stopped our 8AM screaming matches in 3 days!" — Jamie, TX</p>
        </div>
        <button class="btn-primary" style="margin-top:16px" onclick="obNext(2)">Start Free — 7 Day Trial 🚀</button>
        <p class="ob-fine">No credit card needed • Cancel anytime</p>
      </div>

      <!-- Step 2: Kid setup -->
      <div id="obs2" class="ob-step hidden">
        <div class="ob-step-title">👧 Add your first kid</div>
        <p class="ob-step-sub">Takes 30 seconds. No reading needed.</p>
        <div style="margin-top:16px">
          <label class="form-label">Kid's first name</label>
          <input id="ob-kname" class="input-field" type="text" placeholder="e.g. Sarah" maxlength="15"/>
        </div>
        <div style="margin-top:12px">
          <label class="form-label">Age</label>
          <div class="age-row" id="ob-ages">
            <button class="age-btn" onclick="obSelAge(5,this)">5</button>
            <button class="age-btn" onclick="obSelAge(6,this)">6</button>
            <button class="age-btn active" onclick="obSelAge(7,this)">7</button>
            <button class="age-btn" onclick="obSelAge(8,this)">8</button>
            <button class="age-btn" onclick="obSelAge(9,this)">9</button>
            <button class="age-btn" onclick="obSelAge(10,this)">10</button>
            <button class="age-btn" onclick="obSelAge(11,this)">11</button>
          </div>
        </div>
        <button class="btn-primary" style="margin-top:20px" onclick="obNext(3)">Next →</button>
      </div>

      <!-- Step 3: School time -->
      <div id="obs3" class="ob-step hidden">
        <div class="ob-step-title">⏰ School drop-off time?</div>
        <p class="ob-step-sub">Default is 8:15 AM — change it below.</p>
        <div class="time-row" style="margin-top:16px">
          <select id="ob-hr" class="time-sel"><option>6</option><option>7</option><option selected>8</option><option>9</option></select>
          <span class="time-colon">:</span>
          <select id="ob-min" class="time-sel"><option>00</option><option selected>15</option><option>30</option><option>45</option></select>
          <select id="ob-ap" class="time-sel"><option selected>AM</option><option>PM</option></select>
        </div>
        <button class="btn-primary" style="margin-top:20px" onclick="obFinish()">Ready? Let's go! 🚀</button>
      </div>
    </div>
  </div>
</div>

<!-- ══════════════ KID APP (FULL SCREEN HAPTIC EMOJI MODE) ══════════════ -->
<div id="screen-kid" class="fullscreen hidden">

  <!-- STREAK BANNER (always top) -->
  <div class="streak-banner" id="streak-banner">
    <span class="sb-name" id="sb-name">Sarah</span>
    <span class="sb-fire" id="sb-fire">🔥 3-DAY STREAK!</span>
    <span class="sb-stars" id="sb-stars">⭐ 12/20 → Ice Cream Friday!</span>
  </div>

  <!-- MOTTO BAR -->
  <div class="motto-bar">✨ <span id="motto-text">Morning chores → kid cheers.</span> ✨</div>

  <!-- MAIN STAGE -->
  <div class="kid-stage" id="kid-stage">

    <!-- Countdown pill -->
    <div class="kid-countdown-pill" id="kid-cd-pill">
      ⏰ <span id="kid-cd-num">--</span> min to school
    </div>

    <!-- THE MEGA EMOJI BUTTON -->
    <button class="mega-btn" id="mega-btn" onclick="tapTask()">
      <div class="mega-emoji" id="mega-emoji">🥛</div>
      <div class="mega-label" id="mega-label">EAT BREAKFAST</div>
      <div class="mega-tap-hint">TAP ME! 👆</div>
    </button>

    <!-- Star counter -->
    <div class="star-row">
      <span class="star-count" id="star-count">⭐ 0 / 6 ⭐</span>
    </div>

    <!-- Emoji progress chain -->
    <div class="emoji-chain" id="emoji-chain"></div>

  </div>

  <!-- EXPLOSION CANVAS (full screen overlay) -->
  <canvas id="explode-canvas" class="explode-canvas"></canvas>

  <!-- YELL TEXT -->
  <div class="yell-text hidden" id="yell-text">YASSS! 🏆</div>

  <!-- ALL DONE SCREEN -->
  <div class="all-done-screen hidden" id="all-done-screen">
    <div class="all-done-inner">
      <div style="font-size:6rem;animation:rocketLaunch 1s ease forwards">🚀</div>
      <h1 class="all-done-title">DAILY WINNER!</h1>
      <div style="font-size:4rem;margin:10px 0">🏆</div>
      <p class="all-done-sub" id="all-done-sub">You crushed it today!</p>
      <div class="all-done-stars" id="all-done-stars">⭐⭐⭐⭐⭐⭐</div>
      <button class="all-done-btn" onclick="resetForTomorrow()">See you tomorrow! 👋</button>
    </div>
  </div>

  <!-- PARENT LOCK BUTTON (bottom right) -->
  <button class="parent-lock-btn" onclick="askPin()">🔒</button>
</div>

<!-- ══════════════ PARENT DASHBOARD ══════════════ -->
<div id="screen-parent" class="fullscreen hidden">
  <div class="parent-wrap">
    <div class="parent-header">
      <div>
        <div class="parent-logo">🌅 Morning Mate</div>
        <div class="parent-sub">Mom Dashboard</div>
      </div>
      <button class="parent-back-btn" onclick="exitParent()">← Kid Mode</button>
    </div>

    <!-- Weekly summary -->
    <div class="p-card">
      <h3 class="p-card-title">📈 This Week</h3>
      <div class="p-summary-row">
        <div class="p-stat"><div class="p-stat-num" id="p-stat-days">0</div><div class="p-stat-lbl">days crushed</div></div>
        <div class="p-stat"><div class="p-stat-num" id="p-stat-stars">0</div><div class="p-stat-lbl">stars earned</div></div>
        <div class="p-stat"><div class="p-stat-num" id="p-stat-streak">0</div><div class="p-stat-lbl">day streak</div></div>
      </div>
      <div class="p-week-row" id="p-week-row"></div>
      <p class="p-msg" id="p-msg">Keep it going! 🌟</p>
    </div>

    <!-- Photo proof gallery -->
    <div class="p-card">
      <h3 class="p-card-title">📷 Today's Proof</h3>
      <div id="p-photos" class="p-photo-grid">
        <p class="p-empty">No photos yet. Kid taps 📷 on each task!</p>
      </div>
      <button class="p-share-btn" onclick="sharePhotos()">📲 Send to Dad / Co-parent</button>
    </div>

    <!-- Night prep -->
    <div class="p-card">
      <h3 class="p-card-title">🌙 Tonight's Prep <span class="p-pill">2 mins → easier morning</span></h3>
      <div id="p-night-tasks" class="p-task-list"></div>
    </div>

    <!-- Settings -->
    <div class="p-card">
      <h3 class="p-card-title">⚙️ Settings</h3>
      <label class="form-label">Kid's name</label>
      <input id="p-kname" type="text" class="input-field" placeholder="Sarah" style="margin-bottom:10px"/>
      <label class="form-label">Drop-off time</label>
      <div class="time-row" style="margin-bottom:10px">
        <select id="p-hr" class="time-sel"><option>6</option><option>7</option><option>8</option><option>9</option></select>
        <span class="time-colon">:</span>
        <select id="p-min" class="time-sel"><option>00</option><option>15</option><option>30</option><option>45</option></select>
        <select id="p-ap" class="time-sel"><option>AM</option><option>PM</option></select>
      </div>
      <label class="form-label">Reward goal (stars)</label>
      <input id="p-goal" type="number" class="input-field" value="20" min="5" max="50" style="margin-bottom:10px"/>
      <label class="form-label">Reward name</label>
      <input id="p-reward" type="text" class="input-field" placeholder="e.g. Ice Cream Friday" style="margin-bottom:10px"/>
      <label class="form-label">Change PIN (4 digits)</label>
      <input id="p-pin" type="number" class="input-field" placeholder="e.g. 1234" maxlength="4" style="margin-bottom:14px"/>
      <button class="btn-primary" onclick="saveSettings()">Save Changes ✓</button>
    </div>

    <div class="p-card" style="background:#fef2f2;border:1px solid #fecaca">
      <button onclick="resetApp()" style="width:100%;background:#ef4444;color:white;border:none;border-radius:12px;padding:10px;font-weight:700;cursor:pointer">Reset all data</button>
    </div>
  </div>
</div>

<!-- ══════════════ PIN MODAL ══════════════ -->
<div id="pin-modal" class="pin-overlay hidden">
  <div class="pin-box">
    <h3 class="pin-title">🔒 Parent PIN</h3>
    <div class="pin-display" id="pin-display">_ _ _ _</div>
    <div class="pin-pad">
      <button class="pin-btn" onclick="pinTap(1)">1</button>
      <button class="pin-btn" onclick="pinTap(2)">2</button>
      <button class="pin-btn" onclick="pinTap(3)">3</button>
      <button class="pin-btn" onclick="pinTap(4)">4</button>
      <button class="pin-btn" onclick="pinTap(5)">5</button>
      <button class="pin-btn" onclick="pinTap(6)">6</button>
      <button class="pin-btn" onclick="pinTap(7)">7</button>
      <button class="pin-btn" onclick="pinTap(8)">8</button>
      <button class="pin-btn" onclick="pinTap(9)">9</button>
      <button class="pin-btn pin-clear" onclick="pinClear()">✕</button>
      <button class="pin-btn" onclick="pinTap(0)">0</button>
      <button class="pin-btn pin-ok" onclick="pinSubmit()">✓</button>
    </div>
    <button class="pin-cancel" onclick="closePin()">Cancel</button>
  </div>
</div>

<script src="/static/app.js"></script>
</body>
</html>`))
export default app
