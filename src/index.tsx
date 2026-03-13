import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()
app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
  <title>Morning Mate 🌅</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
  <link href="/static/style.css" rel="stylesheet"/>
</head>
<body>

<!-- ═══════════════════════════════════════════
     ONBOARDING (shown only first time)
═══════════════════════════════════════════ -->
<div id="onboarding" class="fullscreen hidden">
  <div class="ob-bg">
    <!-- Animated sky hero -->
    <div class="ob-hero">
      <div class="ob-sun">☀️</div>
      <div class="ob-clouds">
        <span class="cloud c1">☁️</span>
        <span class="cloud c2">☁️</span>
      </div>
      <div class="ob-family">
        <div class="ob-char ob-mom">
          <div class="ob-avatar" style="background:#fda4af">👩</div>
          <div class="ob-bubble">Ready!</div>
        </div>
        <div class="ob-char ob-kid1">
          <div class="ob-avatar" style="background:#fde68a">👧</div>
          <div class="ob-bubble">😄</div>
        </div>
        <div class="ob-char ob-kid2">
          <div class="ob-avatar" style="background:#93c5fd">👦</div>
          <div class="ob-bubble">🎒</div>
        </div>
      </div>
      <div class="ob-bus">🚌 <span>School Bus</span></div>
    </div>

    <!-- Content card -->
    <div class="ob-card">
      <!-- Step 1 -->
      <div class="ob-step" id="ob1">
        <div class="text-center mb-5">
          <div class="ob-logo">🌅 Morning Mate</div>
          <h1 class="ob-headline">Calm school mornings.<br/><span class="text-orange-500">Less yelling,</span> more connection.</h1>
          <p class="ob-sub">The morning routine app for US moms 🇺🇸</p>
        </div>
        <div class="ob-proof">
          <div class="ob-stars">★★★★★ <span>4.9 · 2,400 moms</span></div>
          <p class="ob-quote">"This stopped our 8AM screaming matches!" — <strong>Sarah, mom of 3</strong></p>
        </div>
        <button class="btn-primary mt-5" onclick="obNext(2)">Start Free — 7 Day Trial 🚀</button>
        <p class="ob-fine">Free 7-day trial · Then \$4.99/month · Cancel anytime</p>
      </div>

      <!-- Step 2: Mom name -->
      <div class="ob-step hidden" id="ob2">
        <div class="text-center mb-5">
          <div class="text-5xl mb-2">👋</div>
          <h2 class="ob-step-title">Hi there, Mom!</h2>
          <p class="ob-step-sub">Let's personalize your Morning Mate</p>
        </div>
        <label class="form-label">Your first name</label>
        <input id="ob-mom-name" type="text" class="input-field" placeholder="e.g. Jessica" maxlength="25"/>
        <button class="btn-primary mt-4" onclick="obNext(3)">Continue →</button>
      </div>

      <!-- Step 3: Drop-off time -->
      <div class="ob-step hidden" id="ob3">
        <div class="text-center mb-5">
          <div class="text-5xl mb-2">⏰</div>
          <h2 class="ob-step-title">School drop-off time?</h2>
          <p class="ob-step-sub">We'll count down every morning</p>
        </div>
        <div class="time-row">
          <select id="ob-hr" class="time-sel">
            <option>6</option><option>7</option><option selected>8</option><option>9</option>
          </select>
          <span class="time-colon">:</span>
          <select id="ob-min" class="time-sel">
            <option>00</option><option selected>15</option><option>30</option><option>45</option>
          </select>
          <select id="ob-ampm" class="time-sel">
            <option selected>AM</option><option>PM</option>
          </select>
        </div>
        <button class="btn-primary mt-5" onclick="obNext(4)">Continue →</button>
      </div>

      <!-- Step 4: Add first child -->
      <div class="ob-step hidden" id="ob4">
        <div class="text-center mb-4">
          <div class="text-5xl mb-2">👧</div>
          <h2 class="ob-step-title">Add your first child</h2>
          <p class="ob-step-sub">We'll build a routine just for them</p>
        </div>
        <label class="form-label">Child's name</label>
        <input id="ob-child-name" type="text" class="input-field mb-3" placeholder="e.g. Emma" maxlength="20"/>
        <label class="form-label">Age</label>
        <div class="age-row" id="ob-ages">
          <button class="age-btn" onclick="selAge(5,this)">5</button>
          <button class="age-btn" onclick="selAge(6,this)">6</button>
          <button class="age-btn active" onclick="selAge(7,this)">7</button>
          <button class="age-btn" onclick="selAge(8,this)">8</button>
          <button class="age-btn" onclick="selAge(9,this)">9</button>
          <button class="age-btn" onclick="selAge(10,this)">10</button>
          <button class="age-btn" onclick="selAge(11,this)">11</button>
        </div>
        <label class="form-label mt-3">Avatar</label>
        <div class="avatar-row" id="ob-avatars">
          <button class="av-btn active" onclick="selAv('🦊',this,'ob-avatars')">🦊</button>
          <button class="av-btn" onclick="selAv('🐼',this,'ob-avatars')">🐼</button>
          <button class="av-btn" onclick="selAv('🦁',this,'ob-avatars')">🦁</button>
          <button class="av-btn" onclick="selAv('🐸',this,'ob-avatars')">🐸</button>
          <button class="av-btn" onclick="selAv('🦋',this,'ob-avatars')">🦋</button>
          <button class="av-btn" onclick="selAv('🦄',this,'ob-avatars')">🦄</button>
          <button class="av-btn" onclick="selAv('🐯',this,'ob-avatars')">🐯</button>
          <button class="av-btn" onclick="selAv('🐬',this,'ob-avatars')">🐬</button>
        </div>
        <button class="btn-primary mt-5" onclick="obFinish()">Let's Go! 🚀</button>
      </div>

      <!-- Progress dots -->
      <div class="ob-dots">
        <div class="ob-dot active" id="od1"></div>
        <div class="ob-dot" id="od2"></div>
        <div class="ob-dot" id="od3"></div>
        <div class="ob-dot" id="od4"></div>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     MAIN APP SHELL
═══════════════════════════════════════════ -->
<div id="app" class="fullscreen hidden">

  <!-- TOP BAR -->
  <header class="topbar" id="topbar">
    <div class="topbar-left">
      <span class="topbar-logo">🌅</span>
      <span class="topbar-title">Morning Mate</span>
    </div>
    <div class="topbar-right">
      <button class="info-btn" onclick="showInfoModal()" title="Why it matters">
        <i class="fas fa-info-circle"></i>
      </button>
      <button class="kid-mode-btn" onclick="enterKidMode()" title="Kid mode">
        👧 Kid Mode
      </button>
      <button class="plus-pill" onclick="showPlus()">⭐ Plus</button>
      <button class="icon-btn" onclick="nav('settings')"><i class="fas fa-cog"></i></button>
    </div>
  </header>

  <!-- SCREENS WRAPPER -->
  <div class="screens-wrap">

    <!-- ─────────── HOME SCREEN ─────────── -->
    <div class="screen active" id="s-home">
      <div class="screen-scroll">

        <!-- HERO CARD -->
        <div class="hero-card" id="hero-card">
          <div class="hero-top">
            <div>
              <p class="hero-greeting" id="hero-greeting">Good morning!</p>
              <h2 class="hero-name" id="hero-name">Hey Mom! 👋</h2>
              <p class="hero-date" id="hero-date"></p>
            </div>
            <div class="hero-right">
              <div class="hero-sun" id="hero-sun">☀️</div>
            </div>
          </div>

          <!-- Countdown block -->
          <div class="countdown-block" id="countdown-block">
            <div class="countdown-left">
              <p class="cd-label">🚌 Drop-off in</p>
              <div class="cd-time" id="cd-time">--:--</div>
              <p class="cd-sub" id="cd-sub">Target: 8:15 AM</p>
            </div>
            <div class="cd-ring-wrap">
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="#fed7aa" stroke-width="7"/>
                <circle id="cd-arc" cx="36" cy="36" r="30" fill="none" stroke="#f97316"
                  stroke-width="7" stroke-dasharray="188.5" stroke-dashoffset="0"
                  stroke-linecap="round" transform="rotate(-90 36 36)"/>
              </svg>
              <span class="cd-pct" id="cd-pct"></span>
            </div>
          </div>

          <!-- TIMELINE (morning schedule) -->
          <div class="timeline" id="timeline">
            <!-- Populated by JS -->
          </div>

          <!-- Meltdown warning banner -->
          <div class="meltdown-banner hidden" id="meltdown-banner">
            ⚠️ <strong>Meltdown Window Active</strong> — Keep it to 1 thing. Speak softly. You've got this, Mom.
          </div>
        </div>

        <!-- CONTEXTUAL MESSAGE -->
        <div class="ctx-msg" id="ctx-msg">
          <span id="ctx-icon">🌅</span>
          <p id="ctx-text">Tap "Start Routine" to begin Sarah's morning!</p>
        </div>

        <!-- START ROUTINE BUTTON -->
        <button class="start-btn" id="start-btn" onclick="nav('routine')">
          Start <span id="start-child-name">Sarah</span>'s Routine →
        </button>

        <!-- QUICK GRID -->
        <div class="quick-grid">
          <button class="qc" onclick="nav('bag')">
            <span class="qc-icon">🎒</span>
            <span class="qc-label">Bag Check</span>
            <span class="qc-sub" id="bag-home-sub">Today's items</span>
          </button>
          <button class="qc" onclick="nav('nightprep')">
            <span class="qc-icon">🌙</span>
            <span class="qc-label" style="color:#7c3aed">Night Prep</span>
            <span class="qc-sub" style="color:#a78bfa" id="nightprep-home-sub">Win tomorrow now</span>
          </button>
          <button class="qc bg-red-50 border-red-100" onclick="nav('calm')">
            <span class="qc-icon">🧘</span>
            <span class="qc-label text-red-600">Calm Reset</span>
            <span class="qc-sub text-red-400">Overwhelmed? Here</span>
          </button>
          <button class="qc" onclick="nav('children')">
            <span class="qc-icon">👨‍👩‍👧</span>
            <span class="qc-label">My Kids</span>
            <span class="qc-sub" id="kids-home-sub">Manage profiles</span>
          </button>
        </div>

        <!-- STREAK -->
        <div class="card">
          <div class="card-row">
            <h3 class="card-title">🔥 Smooth Morning Streak</h3>
            <span class="streak-badge" id="streak-badge">0 days</span>
          </div>
          <div class="streak-row" id="streak-row"></div>
          <p class="streak-msg" id="streak-msg"></p>
          <div class="ref-unlock hidden" id="ref-unlock">
            <span id="ref-unlock-text">🎁 4 more smooth mornings → free week for a friend!</span>
          </div>
        </div>

        <!-- SHARE -->
        <button class="share-strip" onclick="doShare()">
          <span class="text-xl">📲</span>
          <div>
            <p class="font-bold text-white">Share with another Mom</p>
            <p style="font-size:12px;color:rgba(255,255,255,0.8)">Give 1 free week → Get 1 free week</p>
          </div>
          <i class="fas fa-chevron-right ml-auto text-white/70"></i>
        </button>

      </div>
    </div><!-- end home -->

    <!-- ─────────── ROUTINE SCREEN ─────────── -->
    <div class="screen hidden" id="s-routine">
      <div class="screen-scroll">
        <div class="screen-header">
          <button class="back-btn" onclick="nav('home')"><i class="fas fa-arrow-left"></i></button>
          <h2 class="screen-title">Morning Routine</h2>
          <button class="info-btn" onclick="showInfoModal()"><i class="fas fa-info-circle"></i></button>
        </div>

        <!-- Child tabs -->
        <div class="tab-row" id="routine-tabs"></div>

        <!-- Mom section -->
        <div class="mom-section">
          <div class="section-label">💅 Your Morning First, Mom</div>
          <div id="mom-tasks"></div>
        </div>

        <!-- Child routine header -->
        <div class="routine-header">
          <div class="routine-child-name" id="routine-child-label">Sarah's tasks</div>
          <div class="routine-count" id="routine-count">0/8</div>
        </div>
        <div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>

        <!-- Child tasks -->
        <div id="child-tasks" class="tasks-list"></div>

        <!-- All done -->
        <div class="all-done hidden" id="all-done">
          <div class="text-5xl mb-2">🎉</div>
          <h3 class="text-xl font-black text-green-700">Amazing morning!</h3>
          <p class="text-green-600 text-sm mt-1">You're a superstar, Mom! Your kid earned a star ⭐</p>
          <button class="share-win-btn mt-3" onclick="shareWin()">📲 Share this win</button>
        </div>

      </div>
    </div>

    <!-- ─────────── BAG CHECK SCREEN ─────────── -->
    <div class="screen hidden" id="s-bag">
      <div class="screen-scroll">
        <div class="screen-header">
          <button class="back-btn" onclick="nav('home')"><i class="fas fa-arrow-left"></i></button>
          <h2 class="screen-title">🎒 Today's Bag</h2>
        </div>
        <div class="day-pill" id="bag-day-pill">Monday's checklist</div>
        <div class="tab-row" id="bag-tabs"></div>
        <div id="bag-items" class="tasks-list"></div>
        <div class="add-item-box">
          <h3 class="section-label mb-2">➕ Add Item</h3>
          <input id="bag-input" type="text" class="input-field mb-2" placeholder="e.g. Swimming gear"/>
          <div class="flex gap-2">
            <select id="bag-day-sel" class="input-field flex-1">
              <option value="daily">Every day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
            <button class="btn-sm-primary" onclick="addBagItem()">Add</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ─────────── NIGHT PREP SCREEN ─────────── -->
    <div class="screen hidden" id="s-nightprep">
      <div class="screen-scroll">
        <div class="screen-header">
          <button class="back-btn" onclick="nav('home')"><i class="fas fa-arrow-left"></i></button>
          <h2 class="screen-title">🌙 Night Prep</h2>
        </div>
        <div class="night-hero">
          <h3 class="font-black text-white text-lg mb-1">Tomorrow starts tonight ✨</h3>
          <p style="color:rgba(255,255,255,0.8);font-size:13px">Check these off before bed = stress-free morning</p>
          <div class="night-progress-pill">
            <span id="night-progress-display">0/0</span> items ready
          </div>
        </div>
        <div id="night-tasks" class="tasks-list mt-3"></div>
        <div class="tip-box">
          <p class="font-semibold text-yellow-800 mb-1">💡 Pro Tips</p>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li>• Let kids pick between 2 pre-approved outfits tonight</li>
            <li>• Pack the bag while they brush teeth</li>
            <li>• Set your alarm 20 mins before the kids'</li>
            <li>• Check school app for tomorrow's notices</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ─────────── CALM RESET SCREEN ─────────── -->
    <div class="screen hidden" id="s-calm">
      <div class="screen-scroll">
        <div class="screen-header">
          <button class="back-btn" onclick="nav('home')"><i class="fas fa-arrow-left"></i></button>
          <h2 class="screen-title">Calm Reset 🧘</h2>
        </div>
        <div class="calm-hero">
          <div class="text-5xl mb-2">🧘</div>
          <h3 class="text-xl font-black text-white">You're doing great, Mom.</h3>
          <p style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px">Every mom has tough mornings. 30 seconds is all you need.</p>
          <button class="calm-start-btn" onclick="startBreathing()">Start 30-sec Reset ✨</button>
        </div>
        <div class="breath-panel hidden" id="breath-panel">
          <div class="breath-circle" id="breath-circle">
            <span id="breath-label">Tap Begin</span>
          </div>
          <p class="breath-note" id="breath-note">Follow the circle</p>
          <button class="btn-primary mt-3" id="breath-go-btn" onclick="goBreath()">Begin</button>
        </div>
        <div class="scripts-card">
          <h3 class="section-label mb-2">💬 Say This Out Loud</h3>
          <div id="calm-scripts"></div>
          <button class="btn-outline mt-3 w-full" onclick="nextScript()">Next phrase →</button>
        </div>
        <div class="ground-box">
          <h3 class="font-bold text-amber-800 mb-3">🌿 5-4-3-2-1 Grounding</h3>
          <div class="ground-list">
            <div class="ground-item"><span class="gn">5</span><span>things you can <strong>SEE</strong></span></div>
            <div class="ground-item"><span class="gn">4</span><span>things you can <strong>TOUCH</strong></span></div>
            <div class="ground-item"><span class="gn">3</span><span>things you can <strong>HEAR</strong></span></div>
            <div class="ground-item"><span class="gn">2</span><span>things you can <strong>SMELL</strong></span></div>
            <div class="ground-item"><span class="gn">1</span><span>thing you can <strong>TASTE</strong></span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─────────── CHILDREN SCREEN ─────────── -->
    <div class="screen hidden" id="s-children">
      <div class="screen-scroll">
        <div class="screen-header">
          <button class="back-btn" onclick="nav('home')"><i class="fas fa-arrow-left"></i></button>
          <h2 class="screen-title">👨‍👩‍👧 My Kids</h2>
        </div>
        <div id="children-list" class="space-y-3 mb-4"></div>
        <div class="add-child-box">
          <h3 class="section-label mb-3">➕ Add a Child</h3>
          <input id="nc-name" type="text" class="input-field mb-3" placeholder="Child's name" maxlength="20"/>
          <label class="form-label">Age</label>
          <div class="age-row mb-3" id="nc-ages">
            <button class="age-btn" onclick="selNewAge(5,this)">5</button>
            <button class="age-btn" onclick="selNewAge(6,this)">6</button>
            <button class="age-btn active" onclick="selNewAge(7,this)">7</button>
            <button class="age-btn" onclick="selNewAge(8,this)">8</button>
            <button class="age-btn" onclick="selNewAge(9,this)">9</button>
            <button class="age-btn" onclick="selNewAge(10,this)">10</button>
            <button class="age-btn" onclick="selNewAge(11,this)">11</button>
          </div>
          <label class="form-label">Avatar</label>
          <div class="avatar-row mb-3" id="nc-avatars">
            <button class="av-btn active" onclick="selAv('🦊',this,'nc-avatars')">🦊</button>
            <button class="av-btn" onclick="selAv('🐼',this,'nc-avatars')">🐼</button>
            <button class="av-btn" onclick="selAv('🦁',this,'nc-avatars')">🦁</button>
            <button class="av-btn" onclick="selAv('🐸',this,'nc-avatars')">🐸</button>
            <button class="av-btn" onclick="selAv('🦋',this,'nc-avatars')">🦋</button>
            <button class="av-btn" onclick="selAv('🦄',this,'nc-avatars')">🦄</button>
            <button class="av-btn" onclick="selAv('🐯',this,'nc-avatars')">🐯</button>
            <button class="av-btn" onclick="selAv('🐬',this,'nc-avatars')">🐬</button>
          </div>
          <div class="toggle-row mb-2">
            <div><p class="toggle-label">Sensory Sensitive</p><p class="toggle-sub">Clothing/texture issues</p></div>
            <label class="tog"><input type="checkbox" id="nc-sensory"/><span class="tog-s"></span></label>
          </div>
          <div class="toggle-row">
            <div><p class="toggle-label">School Anxious</p><p class="toggle-sub">Sometimes reluctant to go</p></div>
            <label class="tog"><input type="checkbox" id="nc-anxiety"/><span class="tog-s"></span></label>
          </div>
          <button class="btn-primary mt-4" onclick="addChild()">Add Child</button>
        </div>
      </div>
    </div>

    <!-- ─────────── SETTINGS SCREEN ─────────── -->
    <div class="screen hidden" id="s-settings">
      <div class="screen-scroll">
        <div class="screen-header">
          <button class="back-btn" onclick="nav('home')"><i class="fas fa-arrow-left"></i></button>
          <h2 class="screen-title">⚙️ Settings</h2>
        </div>
        <div class="settings-card">
          <h3 class="section-label mb-3">👩 Your Profile</h3>
          <label class="form-label">Your name</label>
          <input id="s-momname" type="text" class="input-field mb-3"/>
          <label class="form-label">Drop-off time</label>
          <div class="time-row mb-1">
            <select id="s-hr" class="time-sel"><option>6</option><option>7</option><option>8</option><option>9</option></select>
            <span class="time-colon">:</span>
            <select id="s-min" class="time-sel"><option>00</option><option>15</option><option>30</option><option>45</option></select>
            <select id="s-ampm" class="time-sel"><option>AM</option><option>PM</option></select>
          </div>
          <label class="form-label mt-3">Meltdown window alert</label>
          <select id="s-meltdown" class="input-field mb-3">
            <option value="30">30 minutes after wake-up</option>
            <option value="35" selected>35 minutes after wake-up</option>
            <option value="40">40 minutes after wake-up</option>
            <option value="0">Off</option>
          </select>
          <button class="btn-primary" onclick="saveSettings()">Save Changes ✓</button>
        </div>
        <div class="plus-settings-card mt-4">
          <div class="flex gap-3 items-center mb-3">
            <span class="text-3xl">⭐</span>
            <div><p class="font-black text-white">Morning Mate Plus</p><p style="color:rgba(255,255,255,0.7);font-size:13px">\$4.99/month</p></div>
          </div>
          <ul style="color:rgba(255,255,255,0.9);font-size:13px" class="space-y-1 mb-4">
            <li>✓ Unlimited kids &amp; routines</li>
            <li>✓ Smart bag learning</li>
            <li>✓ Full calm tools library</li>
            <li>✓ M-F schedule templates</li>
            <li>✓ Referral rewards</li>
          </ul>
          <button class="bg-white text-orange-600 font-black py-3 rounded-2xl w-full" onclick="showPlus()">Start 7-Day Free Trial</button>
        </div>
        <div class="danger-card mt-4">
          <button class="danger-btn" onclick="resetApp()">Reset all data</button>
        </div>
      </div>
    </div>

  </div><!-- end screens-wrap -->

  <!-- BOTTOM NAV -->
  <nav class="bottomnav">
    <button class="nb active" id="nb-home" onclick="nav('home')"><i class="fas fa-home"></i><span>Home</span></button>
    <button class="nb" id="nb-routine" onclick="nav('routine')"><i class="fas fa-check-circle"></i><span>Routine</span></button>
    <button class="nb" id="nb-bag" onclick="nav('bag')"><i class="fas fa-shopping-bag"></i><span>Bag</span></button>
    <button class="nb" id="nb-nightprep" onclick="nav('nightprep')"><i class="fas fa-moon"></i><span>Tonight</span></button>
    <button class="nb nb-calm" id="nb-calm" onclick="nav('calm')"><i class="fas fa-spa"></i><span>Calm</span></button>
  </nav>
</div>

<!-- ═══════════════════════════════════════════
     KID MODE (full screen takeover)
═══════════════════════════════════════════ -->
<div id="kid-mode" class="fullscreen hidden">
  <div class="kid-bg">
    <div class="kid-header">
      <div class="kid-title-row">
        <span class="kid-avatar" id="km-avatar">🦊</span>
        <div>
          <h1 class="kid-name" id="km-name">Sarah's</h1>
          <p class="kid-subtitle">Morning Mission!</p>
        </div>
      </div>
      <div class="kid-stars">
        <span id="km-stars">⭐⭐⭐</span>
      </div>
    </div>

    <!-- Kid countdown -->
    <div class="kid-countdown">
      <p class="kid-cd-label">School in</p>
      <div class="kid-cd-time" id="km-time">--:--</div>
    </div>

    <!-- Kid tasks (big buttons) -->
    <div class="kid-tasks" id="kid-tasks"></div>

    <!-- All done kid -->
    <div class="kid-alldone hidden" id="kid-alldone">
      <div class="text-6xl">🎉</div>
      <p class="kid-done-text">YOU DID IT!</p>
      <p style="color:#f97316;font-size:1rem;margin-top:8px">Tell Mom you're ready! 🚌</p>
    </div>

    <!-- Exit kid mode (PIN protected) -->
    <button class="exit-kid-btn" onclick="askExitKid()">
      🔒 Parent Mode
    </button>
  </div>
</div>

<!-- ═══════════════════════════════════════════
     MODALS
═══════════════════════════════════════════ -->

<!-- WHY IT MATTERS -->
<div id="modal-why" class="modal-backdrop hidden">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('modal-why')">✕</button>
    <h2 class="modal-title">Why calm mornings change everything</h2>
    <div class="why-items">
      <div class="why-item"><span class="why-icon">✅</span><div><strong>TODAY:</strong> Kids arrive focused. Teachers notice the difference.</div></div>
      <div class="why-item"><span class="why-icon">📅</span><div><strong>THIS YEAR:</strong> Fewer meltdowns, more independence, less yelling.</div></div>
      <div class="why-item"><span class="why-icon">🏆</span><div><strong>LIFETIME:</strong> Self-discipline, better grades, lifelong confidence.</div></div>
    </div>
    <button class="btn-primary mt-4" onclick="closeModal('modal-why')">Back to routine →</button>
    <p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:8px">Auto-closes in <span id="why-timer">5</span>s</p>
  </div>
</div>

<!-- PLUS UPGRADE -->
<div id="modal-plus" class="modal-backdrop hidden">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('modal-plus')">✕</button>
    <div class="text-center">
      <div class="text-5xl mb-2">⭐</div>
      <h2 class="modal-title">Morning Mate Plus</h2>
      <p style="color:#6b7280;font-size:13px;margin-bottom:16px">The upgrade every mom deserves</p>
      <div class="before-after-box mb-4">
        <div class="ba-col">
          <p class="ba-label bad">😤 Before</p>
          <ul class="ba-list">
            <li>Yelling before 9 AM</li><li>Forgotten PE kits</li><li>Late every Tuesday</li>
          </ul>
        </div>
        <div class="ba-divider"></div>
        <div class="ba-col">
          <p class="ba-label good">😊 After Plus</p>
          <ul class="ba-list">
            <li>Calm, smooth mornings</li><li>Never forget anything</li><li>Kids ready on time</li>
          </ul>
        </div>
      </div>
      <ul class="plus-features-list mb-4">
        <li><span class="text-green-500">✓</span> Unlimited kids &amp; routines</li>
        <li><span class="text-green-500">✓</span> Smart bag reminders by day</li>
        <li><span class="text-green-500">✓</span> Full calm script library</li>
        <li><span class="text-green-500">✓</span> M-F weekly templates</li>
        <li><span class="text-green-500">✓</span> Referral rewards program</li>
      </ul>
      <button class="btn-primary" onclick="startTrial()">Start 7-Day Free Trial 🚀</button>
      <p style="font-size:11px;color:#9ca3af;margin-top:8px">Then \$4.99/month. Cancel anytime.</p>
    </div>
  </div>
</div>

<!-- TIMER MODAL -->
<div id="modal-timer" class="modal-backdrop hidden">
  <div class="modal-box text-center">
    <div class="text-6xl mb-2" id="timer-icon">⏱</div>
    <h3 class="text-xl font-black text-gray-900 mb-1" id="timer-label">Task Timer</h3>
    <p style="color:#f97316;font-weight:700;font-size:13px;margin-bottom:16px" id="timer-motive">⚡ Beat the timer!</p>
    <div class="timer-ring-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#fed7aa" stroke-width="12"/>
        <circle id="timer-arc" cx="60" cy="60" r="54" fill="none" stroke="#f97316"
          stroke-width="12" stroke-dasharray="339.3" stroke-dashoffset="0"
          stroke-linecap="round" transform="rotate(-90 60 60)"/>
      </svg>
      <span class="timer-num" id="timer-num">2:00</span>
    </div>
    <div class="flex gap-3 mt-4">
      <button class="btn-outline flex-1" onclick="closeTimer()">Skip</button>
      <button class="btn-primary flex-1" onclick="doneTimer()">Done! ✅</button>
    </div>
  </div>
</div>

<!-- PIN MODAL -->
<div id="modal-pin" class="modal-backdrop hidden">
  <div class="modal-box text-center">
    <h3 class="text-xl font-black mb-2">Parent PIN</h3>
    <p style="color:#6b7280;font-size:13px;margin-bottom:16px">Enter PIN to exit Kid Mode</p>
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
    <button class="btn-outline mt-3 w-full" onclick="closeModal('modal-pin')">Cancel</button>
  </div>
</div>

<!-- CELEBRATION -->
<div id="modal-celebrate" class="modal-backdrop hidden">
  <div class="modal-box text-center">
    <div class="celebrate-stars" id="cel-stars">🎉</div>
    <h3 class="text-2xl font-black text-gray-900 mt-2" id="cel-title">Amazing!</h3>
    <p style="color:#6b7280;margin-top:6px;margin-bottom:20px" id="cel-msg">You did it!</p>
    <button class="btn-primary" onclick="closeModal('modal-celebrate')">Keep Going! 🚀</button>
  </div>
</div>

<script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
