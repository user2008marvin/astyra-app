import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Morning Mate 🌅</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet"/>
  <link href="/static/style.css" rel="stylesheet"/>
</head>
<body class="bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen font-sans">

<!-- ===================== WELCOME SPLASH SCREEN ===================== -->
<div id="splash" class="screen active">
  <div class="splash-bg min-h-screen flex flex-col">

    <!-- Hero Image Area -->
    <div class="splash-hero relative overflow-hidden">
      <!-- Warm gradient sky background -->
      <div class="absolute inset-0 bg-gradient-to-b from-amber-400 via-orange-400 to-rose-400"></div>

      <!-- Decorative sun -->
      <div class="absolute top-6 right-8 sun-glow">
        <div class="text-6xl">☀️</div>
      </div>

      <!-- Illustrated scene with emoji art -->
      <div class="relative z-10 pt-12 pb-6 px-6 flex flex-col items-center">

        <!-- Family illustration using emojis -->
        <div class="family-scene">
          <!-- House -->
          <div class="house-bg">
            <div class="text-5xl">🏠</div>
          </div>

          <!-- Mom and kids -->
          <div class="family-row">
            <div class="family-member">
              <div class="avatar-bubble bg-rose-400">👩</div>
              <div class="speech-bubble-left">Ready!</div>
            </div>
            <div class="family-member mx-2">
              <div class="avatar-bubble bg-yellow-400 animate-bounce-slow">👧</div>
              <div class="speech-bubble">😄</div>
            </div>
            <div class="family-member">
              <div class="avatar-bubble bg-sky-400 animate-bounce-slower">👦</div>
              <div class="speech-bubble">🎒</div>
            </div>
          </div>

          <!-- School bus -->
          <div class="bus-row">
            <div class="school-bus">
              <span class="text-4xl bus-animate">🚌</span>
              <span class="bus-label">School Bus</span>
            </div>
          </div>
        </div>

        <!-- Floating elements -->
        <div class="floating-icons">
          <span class="float-icon fi-1">⭐</span>
          <span class="float-icon fi-2">🌟</span>
          <span class="float-icon fi-3">✨</span>
          <span class="float-icon fi-4">💛</span>
          <span class="float-icon fi-5">🌈</span>
        </div>
      </div>
    </div>

    <!-- Content card -->
    <div class="splash-card flex-1 rounded-t-3xl bg-white px-6 pt-8 pb-6 -mt-4 relative z-20 shadow-2xl">
      <!-- Logo -->
      <div class="text-center mb-5">
        <div class="inline-flex items-center gap-2 bg-orange-100 rounded-2xl px-4 py-2 mb-3">
          <span class="text-2xl">🌅</span>
          <span class="font-black text-orange-600 text-lg tracking-wide">MORNING MATE</span>
        </div>
        <h1 class="text-3xl font-black text-gray-900 leading-tight">
          Calm school mornings.<br/>
          <span class="text-orange-500">Less yelling,</span> more connection.
        </h1>
        <p class="text-gray-500 mt-2 text-sm">The #1 morning routine app for US moms 🇺🇸</p>
      </div>

      <!-- Social proof -->
      <div class="bg-orange-50 rounded-2xl p-4 mb-5 border border-orange-100">
        <div class="flex items-center gap-2 mb-2">
          <div class="flex text-yellow-400 text-sm">★★★★★</div>
          <span class="text-xs font-semibold text-gray-600">4.9 from 2,400 moms</span>
        </div>
        <p class="text-sm text-gray-600 italic">"This app stopped our 8AM screaming matches! School mornings are actually fun now." <strong>— Sarah, mom of 3</strong></p>
      </div>

      <!-- Feature pills -->
      <div class="flex flex-wrap gap-2 mb-6 justify-center">
        <span class="feature-pill">⏰ Countdown timer</span>
        <span class="feature-pill">✅ Kids checklists</span>
        <span class="feature-pill">🎒 Bag check</span>
        <span class="feature-pill">🧘 Calm reset</span>
        <span class="feature-pill">🔥 Streak rewards</span>
        <span class="feature-pill">👨‍👩‍👧‍👦 Multi-kid</span>
      </div>

      <!-- CTA buttons -->
      <button onclick="showOnboarding()" class="btn-primary w-full mb-3 text-lg py-4">
        Start Free — 7 Day Trial 🚀
      </button>
      <button onclick="showOnboarding()" class="text-gray-400 text-sm w-full text-center">
        Already have an account? <span class="text-orange-500 font-semibold">Sign in</span>
      </button>

      <!-- Free trial note -->
      <p class="text-center text-xs text-gray-400 mt-3">Free 7-day trial · Then $4.99/month · Cancel anytime</p>
    </div>
  </div>
</div>

<!-- ===================== ONBOARDING SCREENS ===================== -->
<div id="onboarding" class="screen hidden">
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">

    <!-- Progress bar -->
    <div class="onboard-progress-bar">
      <div class="onboard-progress-fill" id="onboard-progress"></div>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center p-6">
      <div class="w-full max-w-sm">

        <!-- Step 1: Mom name -->
        <div class="onboard-step" id="step-1">
          <div class="text-center mb-6">
            <div class="text-6xl mb-3">👋</div>
            <h2 class="text-2xl font-black text-gray-900">Hi there, Mom!</h2>
            <p class="text-gray-500 mt-1">Let's personalize your Morning Mate</p>
          </div>
          <div class="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <label class="text-sm font-semibold text-gray-600 mb-2 block">What's your name?</label>
            <input id="mom-name-input" type="text" placeholder="Your first name" class="input-field text-lg" maxlength="30" autofocus/>
            <p class="text-xs text-gray-400 mt-2">So we can make every morning feel personal 💛</p>
          </div>
          <button onclick="onboardNext(2)" class="btn-primary w-full">Continue →</button>
          <div class="step-dots mt-4" id="dots-1"></div>
        </div>

        <!-- Step 2: School drop-off time -->
        <div class="onboard-step hidden" id="step-2">
          <div class="text-center mb-6">
            <div class="text-6xl mb-3">⏰</div>
            <h2 class="text-2xl font-black text-gray-900">School drop-off time?</h2>
            <p class="text-gray-500 mt-1">We'll count down to this every morning</p>
          </div>
          <div class="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <div class="time-picker-row">
              <select id="leave-hour" class="time-picker-select">
                <option value="6">6</option><option value="7">7</option>
                <option value="8" selected>8</option><option value="9">9</option><option value="10">10</option>
              </select>
              <span class="time-colon">:</span>
              <select id="leave-min" class="time-picker-select">
                <option value="00">00</option><option value="15" selected>15</option>
                <option value="30">30</option><option value="45">45</option>
              </select>
              <select id="leave-ampm" class="time-picker-select">
                <option value="AM" selected>AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <p class="text-xs text-gray-400 mt-3 text-center">Most elementary schools start between 7:30–9:00 AM</p>
          </div>
          <button onclick="onboardNext(3)" class="btn-primary w-full">Continue →</button>
        </div>

        <!-- Step 3: Add first child -->
        <div class="onboard-step hidden" id="step-3">
          <div class="text-center mb-6">
            <div class="text-6xl mb-3">👧</div>
            <h2 class="text-2xl font-black text-gray-900">Add your first child</h2>
            <p class="text-gray-500 mt-1">We'll build a routine just for them</p>
          </div>
          <div class="bg-white rounded-3xl p-6 shadow-lg mb-6 space-y-4">
            <div>
              <label class="text-sm font-semibold text-gray-600 mb-1 block">Child's name</label>
              <input id="child-name-input" type="text" placeholder="e.g. Emma" class="input-field" maxlength="20"/>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600 mb-1 block">Age</label>
              <div class="age-selector" id="age-selector">
                <button class="age-btn" onclick="selectAge(5)" data-age="5">5</button>
                <button class="age-btn" onclick="selectAge(6)" data-age="6">6</button>
                <button class="age-btn active" onclick="selectAge(7)" data-age="7">7</button>
                <button class="age-btn" onclick="selectAge(8)" data-age="8">8</button>
                <button class="age-btn" onclick="selectAge(9)" data-age="9">9</button>
                <button class="age-btn" onclick="selectAge(10)" data-age="10">10</button>
                <button class="age-btn" onclick="selectAge(11)" data-age="11">11</button>
              </div>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600 mb-2 block">Choose an avatar</label>
              <div class="avatar-grid">
                <button onclick="selectAvatar('🦊')" class="avatar-btn active" data-emoji="🦊">🦊</button>
                <button onclick="selectAvatar('🐼')" class="avatar-btn" data-emoji="🐼">🐼</button>
                <button onclick="selectAvatar('🦁')" class="avatar-btn" data-emoji="🦁">🦁</button>
                <button onclick="selectAvatar('🐸')" class="avatar-btn" data-emoji="🐸">🐸</button>
                <button onclick="selectAvatar('🦋')" class="avatar-btn" data-emoji="🦋">🦋</button>
                <button onclick="selectAvatar('🐬')" class="avatar-btn" data-emoji="🐬">🐬</button>
                <button onclick="selectAvatar('🦄')" class="avatar-btn" data-emoji="🦄">🦄</button>
                <button onclick="selectAvatar('🐯')" class="avatar-btn" data-emoji="🐯">🐯</button>
              </div>
            </div>
          </div>
          <button onclick="finishOnboarding()" class="btn-primary w-full">Let's Go! 🚀</button>
        </div>

      </div>
    </div>
  </div>
</div>

<!-- ===================== MAIN APP ===================== -->
<div id="app" class="screen hidden">

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="flex items-center gap-2">
      <span class="text-xl">🌅</span>
      <span class="font-black text-orange-600">Morning Mate</span>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="showPlusModal()" class="plus-badge">⭐ Plus</button>
      <button onclick="showScreen('settings')" class="text-gray-400 text-xl"><i class="fas fa-cog"></i></button>
    </div>
  </div>

  <div class="screen-container">

    <!-- ===== HOME SCREEN ===== -->
    <div class="app-screen active" id="screen-home">
      <div class="p-4 space-y-4 pb-28">

        <!-- Hero countdown card -->
        <div class="hero-card">
          <div class="hero-card-bg"></div>
          <div class="relative z-10">
            <div class="flex justify-between items-start mb-1">
              <div>
                <p class="text-orange-200 text-sm" id="greeting-sub">Good morning!</p>
                <h2 class="text-2xl font-black text-white" id="greeting-name">Hey Mom! 👋</h2>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-3xl" id="weather-emoji">☀️</span>
                <span class="text-xs text-orange-200" id="date-display"></span>
              </div>
            </div>

            <!-- Countdown -->
            <div class="countdown-card mt-3">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs text-gray-500 mb-1">🚌 School drop-off in</p>
                  <div class="text-4xl font-black tracking-tight text-gray-800" id="countdown-display">--:--</div>
                  <p class="text-xs text-gray-400 mt-1" id="leave-time-display">Drop-off: 8:15 AM</p>
                </div>
                <div class="countdown-ring">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#fed7aa" stroke-width="8"/>
                    <circle id="countdown-arc" cx="40" cy="40" r="34" fill="none" stroke="#f97316" stroke-width="8"
                      stroke-dasharray="213.6" stroke-dashoffset="0" stroke-linecap="round"
                      transform="rotate(-90 40 40)"/>
                  </svg>
                  <div class="countdown-ring-inner" id="countdown-pct">—</div>
                </div>
              </div>
            </div>

            <!-- Meltdown warning -->
            <div id="meltdown-warning" class="hidden mt-3 bg-red-100 border border-red-200 rounded-2xl p-3">
              <p class="text-red-700 text-sm font-bold">⚠️ Meltdown Window (30–45 min after wake)</p>
              <p class="text-red-500 text-xs mt-1">Keep tasks simple. One thing at a time. Speak calmly.</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions Grid -->
        <div class="grid grid-cols-2 gap-3">
          <button onclick="showScreen('routine')" class="quick-card bg-white">
            <div class="quick-card-icon bg-orange-100">✅</div>
            <span class="quick-card-label">Morning Routine</span>
            <span class="quick-card-sub" id="routine-progress-label">Tap to start</span>
          </button>
          <button onclick="showScreen('calm')" class="quick-card bg-red-50 border-red-100">
            <div class="quick-card-icon bg-red-100">🧘</div>
            <span class="quick-card-label text-red-600">Calm Reset</span>
            <span class="quick-card-sub text-red-400">Overwhelmed? Tap here</span>
          </button>
          <button onclick="showScreen('bag')" class="quick-card bg-white">
            <div class="quick-card-icon bg-blue-100">🎒</div>
            <span class="quick-card-label">Bag Check</span>
            <span class="quick-card-sub" id="bag-progress-label">Today's items</span>
          </button>
          <button onclick="showScreen('evening')" class="quick-card bg-purple-50 border-purple-100">
            <div class="quick-card-icon bg-purple-100">🌙</div>
            <span class="quick-card-label text-purple-600">Tonight's Prep</span>
            <span class="quick-card-sub text-purple-400">Win tomorrow now</span>
          </button>
        </div>

        <!-- Kids overview -->
        <div class="bg-white rounded-3xl p-4 shadow-sm">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-gray-800">👨‍👩‍👧 My Kids</h3>
            <button onclick="showScreen('children')" class="text-sm text-orange-500 font-semibold">Manage</button>
          </div>
          <div id="children-overview" class="space-y-3"></div>
        </div>

        <!-- 7-Day Streak -->
        <div class="bg-white rounded-3xl p-4 shadow-sm">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-gray-800">🔥 Smooth Morning Streak</h3>
            <span class="streak-count-badge" id="streak-count-badge">0 days</span>
          </div>
          <div class="flex gap-2 justify-between" id="streak-display"></div>
          <p class="text-sm text-gray-500 mt-2" id="streak-message"></p>
          <!-- Referral unlock progress -->
          <div id="referral-progress" class="hidden mt-3 bg-yellow-50 rounded-xl p-3 border border-yellow-200">
            <p class="text-xs font-semibold text-yellow-700" id="referral-progress-text">🎁 3 more smooth mornings = 1 free week for a friend!</p>
          </div>
        </div>

        <!-- Share button -->
        <button onclick="shareApp()" class="share-btn w-full">
          <span class="text-xl">📲</span>
          <div class="text-left">
            <p class="font-bold text-white">Share with another Mom</p>
            <p class="text-orange-200 text-xs">Give a friend 1 free week → Get 1 free week</p>
          </div>
          <span class="text-white text-xl ml-auto">→</span>
        </button>

      </div>
    </div>

    <!-- ===== ROUTINE SCREEN ===== -->
    <div class="app-screen hidden" id="screen-routine">
      <div class="p-4 pb-28">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="back-btn"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-black text-gray-800">Morning Routine</h2>
        </div>

        <!-- Child selector tabs -->
        <div id="child-tabs" class="flex gap-2 mb-4 overflow-x-auto pb-1"></div>

        <!-- Mom's own section -->
        <div class="mom-section mb-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xl">💅</span>
            <h3 class="font-bold text-rose-700">Your Morning First, Mom!</h3>
          </div>
          <div id="mom-tasks" class="space-y-2"></div>
        </div>

        <!-- Child routine -->
        <div id="child-routine-panel">
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold text-gray-800" id="active-child-name">Child Tasks</h3>
            <div class="bg-orange-100 rounded-xl px-3 py-1">
              <span class="text-orange-700 font-bold text-sm" id="child-task-count">0/0</span>
            </div>
          </div>
          <div class="progress-bar mb-4">
            <div id="routine-progress-bar" class="progress-fill" style="width:0%"></div>
          </div>
          <div id="child-tasks" class="space-y-2"></div>
          <div id="all-done-banner" class="hidden mt-4 all-done-card">
            <div class="text-4xl mb-2">🎉</div>
            <p class="font-black text-green-700 text-lg">All done! Amazing morning!</p>
            <p class="text-sm text-green-600 mt-1">You and your family crushed it today! ⭐</p>
            <button onclick="shareWin()" class="mt-3 bg-green-500 text-white rounded-xl py-2 px-5 text-sm font-bold">Share this win 📲</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== CALM RESET SCREEN ===== -->
    <div class="app-screen hidden" id="screen-calm">
      <div class="p-4 pb-28">
        <div class="flex items-center gap-3 mb-6">
          <button onclick="showScreen('home')" class="back-btn"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-black text-gray-800">Calm Reset</h2>
        </div>

        <!-- Big emergency card -->
        <div class="calm-hero-card mb-5">
          <div class="text-5xl mb-3">🧘</div>
          <h3 class="text-xl font-black text-white mb-1">You're doing great, Mom.</h3>
          <p class="text-indigo-200 text-sm mb-4">Every mom has tough mornings. Let's take 30 seconds.</p>
          <button onclick="startCalmMode()" class="bg-white text-indigo-600 font-black py-3 px-8 rounded-2xl text-base shadow-lg">
            Start 30-sec Reset ✨
          </button>
        </div>

        <!-- Breathing panel -->
        <div id="breathing-panel" class="hidden bg-white rounded-3xl p-6 shadow-lg mb-4 text-center">
          <h3 class="font-bold text-gray-800 mb-4">4-4-4 Box Breathing</h3>
          <div class="flex flex-col items-center">
            <div id="breath-circle" class="breath-circle mb-4">
              <span id="breath-text" class="text-white font-black text-base">Tap Begin</span>
            </div>
            <p id="breath-instruction" class="text-gray-500 text-sm mb-4">Follow the circle</p>
            <button onclick="startBreathing()" id="breath-btn" class="btn-primary px-8">Begin</button>
          </div>
        </div>

        <!-- Calm scripts -->
        <div class="bg-white rounded-3xl p-5 shadow-sm mb-4">
          <h3 class="font-bold text-gray-800 mb-1">💬 Say This Out Loud</h3>
          <p class="text-xs text-gray-400 mb-3">These phrases actually work. Try one:</p>
          <div id="calm-scripts" class="space-y-3"></div>
          <button onclick="nextScript()" class="btn-outline w-full mt-3">Next Phrase →</button>
        </div>

        <!-- Grounding -->
        <div class="bg-amber-50 rounded-3xl p-5 border border-amber-200">
          <h3 class="font-bold text-amber-800 mb-3">🌿 5-4-3-2-1 Grounding</h3>
          <div class="space-y-2 text-sm text-amber-700">
            <div class="flex gap-3 items-start"><span class="grounding-num">5</span><span>things you can <strong>SEE</strong> right now</span></div>
            <div class="flex gap-3 items-start"><span class="grounding-num">4</span><span>things you can <strong>TOUCH</strong></span></div>
            <div class="flex gap-3 items-start"><span class="grounding-num">3</span><span>things you can <strong>HEAR</strong></span></div>
            <div class="flex gap-3 items-start"><span class="grounding-num">2</span><span>things you can <strong>SMELL</strong></span></div>
            <div class="flex gap-3 items-start"><span class="grounding-num">1</span><span>thing you can <strong>TASTE</strong></span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BAG CHECK SCREEN ===== -->
    <div class="app-screen hidden" id="screen-bag">
      <div class="p-4 pb-28">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="back-btn"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-black text-gray-800">🎒 Bag Check</h2>
        </div>
        <div class="bg-orange-100 rounded-2xl p-3 mb-4 text-center border border-orange-200">
          <p class="text-orange-700 font-semibold" id="bag-day-display">Today: Monday</p>
        </div>
        <div id="bag-child-tabs" class="flex gap-2 mb-4 overflow-x-auto pb-1"></div>
        <div id="bag-items" class="space-y-2 mb-4"></div>
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <h3 class="font-semibold text-gray-700 mb-2">➕ Add Item</h3>
          <div class="space-y-2">
            <input id="bag-item-input" type="text" placeholder="e.g. Swimming gear" class="input-field"/>
            <div class="flex gap-2">
              <select id="bag-item-day" class="input-field flex-1">
                <option value="daily">Every day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
              <button onclick="addBagItem()" class="btn-primary px-5">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== EVENING PREP SCREEN ===== -->
    <div class="app-screen hidden" id="screen-evening">
      <div class="p-4 pb-28">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="back-btn"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-black text-gray-800">🌙 Tonight's Prep</h2>
        </div>
        <div class="evening-hero mb-5">
          <h3 class="text-lg font-black text-white mb-1">Tomorrow starts tonight ✨</h3>
          <p class="text-indigo-200 text-sm">Check these off before bed = stress-free morning</p>
          <div class="mt-3 bg-white/20 rounded-xl p-3 text-center">
            <span class="text-2xl font-black text-white" id="evening-progress-display">0/0</span>
            <span class="text-indigo-200 text-sm ml-2">items ready</span>
          </div>
        </div>
        <div id="evening-tasks" class="space-y-2 mb-4"></div>
        <div class="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <h3 class="font-semibold text-yellow-800 mb-2">💡 Pro Tips from Moms</h3>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li>• Lay out clothes — let kids pick between 2 options</li>
            <li>• Pack the bag while they brush teeth</li>
            <li>• Set your alarm 20 mins before the kids' alarm</li>
            <li>• Check the school app for any notices</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ===== CHILDREN SCREEN ===== -->
    <div class="app-screen hidden" id="screen-children">
      <div class="p-4 pb-28">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="back-btn"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-black text-gray-800">My Kids</h2>
        </div>
        <div id="children-list" class="space-y-3 mb-4"></div>
        <div class="bg-white rounded-3xl p-5 shadow-sm border-2 border-dashed border-orange-200">
          <h3 class="font-bold text-gray-700 mb-3">➕ Add a Child</h3>
          <div class="space-y-3">
            <input id="new-child-name" type="text" placeholder="Child's name" class="input-field" maxlength="20"/>
            <div>
              <label class="text-sm font-semibold text-gray-600 mb-1 block">Age</label>
              <div class="age-selector" id="new-age-selector">
                <button class="age-btn" onclick="selectNewAge(5)" data-age="5">5</button>
                <button class="age-btn" onclick="selectNewAge(6)" data-age="6">6</button>
                <button class="age-btn active" onclick="selectNewAge(7)" data-age="7">7</button>
                <button class="age-btn" onclick="selectNewAge(8)" data-age="8">8</button>
                <button class="age-btn" onclick="selectNewAge(9)" data-age="9">9</button>
                <button class="age-btn" onclick="selectNewAge(10)" data-age="10">10</button>
                <button class="age-btn" onclick="selectNewAge(11)" data-age="11">11</button>
              </div>
            </div>
            <div>
              <label class="text-sm font-semibold text-gray-600 mb-2 block">Avatar</label>
              <div class="avatar-grid">
                <button onclick="selectNewAvatar('🦊')" class="avatar-btn active" data-emoji="🦊">🦊</button>
                <button onclick="selectNewAvatar('🐼')" class="avatar-btn" data-emoji="🐼">🐼</button>
                <button onclick="selectNewAvatar('🦁')" class="avatar-btn" data-emoji="🦁">🦁</button>
                <button onclick="selectNewAvatar('🐸')" class="avatar-btn" data-emoji="🐸">🐸</button>
                <button onclick="selectNewAvatar('🦋')" class="avatar-btn" data-emoji="🦋">🦋</button>
                <button onclick="selectNewAvatar('🐬')" class="avatar-btn" data-emoji="🐬">🐬</button>
                <button onclick="selectNewAvatar('🦄')" class="avatar-btn" data-emoji="🦄">🦄</button>
                <button onclick="selectNewAvatar('🐯')" class="avatar-btn" data-emoji="🐯">🐯</button>
              </div>
            </div>
            <div class="flex items-center justify-between bg-orange-50 rounded-xl p-3">
              <div><p class="font-medium text-gray-700 text-sm">Sensory Sensitive</p><p class="text-xs text-gray-500">Clothing/texture issues</p></div>
              <label class="toggle-switch"><input type="checkbox" id="new-child-sensory"/><span class="toggle-slider"></span></label>
            </div>
            <div class="flex items-center justify-between bg-blue-50 rounded-xl p-3">
              <div><p class="font-medium text-gray-700 text-sm">School Anxious</p><p class="text-xs text-gray-500">Sometimes reluctant to go</p></div>
              <label class="toggle-switch"><input type="checkbox" id="new-child-anxiety"/><span class="toggle-slider"></span></label>
            </div>
          </div>
          <button onclick="addChild()" class="btn-primary w-full mt-4">Add Child</button>
        </div>
      </div>
    </div>

    <!-- ===== SETTINGS SCREEN ===== -->
    <div class="app-screen hidden" id="screen-settings">
      <div class="p-4 pb-28">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="back-btn"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-black text-gray-800">Settings</h2>
        </div>
        <div class="space-y-4">
          <div class="bg-white rounded-2xl p-4 shadow-sm">
            <h3 class="font-bold text-gray-700 mb-3">👩 Your Profile</h3>
            <div class="space-y-3">
              <div><label class="text-sm text-gray-500 mb-1 block">Your name</label>
                <input id="settings-mom-name" type="text" class="input-field" placeholder="Your name"/></div>
              <div><label class="text-sm text-gray-500 mb-1 block">Drop-off time</label>
                <div class="time-picker-row">
                  <select id="settings-hour" class="time-picker-select">
                    <option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option>
                  </select>
                  <span class="time-colon">:</span>
                  <select id="settings-min" class="time-picker-select">
                    <option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option>
                  </select>
                  <select id="settings-ampm" class="time-picker-select">
                    <option value="AM">AM</option><option value="PM">PM</option>
                  </select>
                </div>
              </div>
            </div>
            <button onclick="saveSettings()" class="btn-primary w-full mt-3">Save Changes ✓</button>
          </div>

          <!-- Plus subscription -->
          <div class="plus-settings-card">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-3xl">⭐</span>
              <div><p class="font-black text-white">Morning Mate Plus</p><p class="text-orange-200 text-sm">$4.99/month</p></div>
            </div>
            <ul class="text-sm text-orange-100 space-y-1 mb-4">
              <li>✓ Unlimited kids</li>
              <li>✓ Full routines (not just 3 steps)</li>
              <li>✓ Smart reminders</li>
              <li>✓ Calm library (10+ scripts)</li>
              <li>✓ Weekly routine templates</li>
            </ul>
            <button onclick="showPlusModal()" class="bg-white text-orange-600 font-black py-3 rounded-2xl w-full">Start 7-Day Free Trial</button>
          </div>

          <div class="bg-red-50 rounded-2xl p-4 border border-red-100">
            <h3 class="font-bold text-red-700 mb-2">Reset App</h3>
            <button onclick="resetApp()" class="bg-red-500 text-white rounded-xl py-2 px-4 text-sm font-medium w-full">Clear all data</button>
          </div>
        </div>
      </div>
    </div>

  </div><!-- end screen-container -->

  <!-- Bottom Nav -->
  <nav class="bottom-nav">
    <button onclick="showScreen('home')" class="nav-btn active" id="nav-home">
      <i class="fas fa-home text-xl"></i><span>Home</span>
    </button>
    <button onclick="showScreen('routine')" class="nav-btn" id="nav-routine">
      <i class="fas fa-check-circle text-xl"></i><span>Routine</span>
    </button>
    <button onclick="showScreen('bag')" class="nav-btn" id="nav-bag">
      <i class="fas fa-shopping-bag text-xl"></i><span>Bag</span>
    </button>
    <button onclick="showScreen('evening')" class="nav-btn" id="nav-evening">
      <i class="fas fa-moon text-xl"></i><span>Tonight</span>
    </button>
    <button onclick="showScreen('calm')" class="nav-btn nav-calm" id="nav-calm">
      <i class="fas fa-spa text-xl"></i><span>Calm</span>
    </button>
  </nav>
</div>

<!-- ===== PLUS MODAL ===== -->
<div id="plus-modal" class="modal-overlay hidden">
  <div class="modal-card">
    <button onclick="closePlusModal()" class="absolute top-4 right-4 text-gray-300 text-2xl">✕</button>
    <div class="text-center">
      <div class="text-5xl mb-2">⭐</div>
      <h3 class="text-xl font-black text-gray-900">Morning Mate Plus</h3>
      <p class="text-gray-500 text-sm mb-4">The upgrade every mom deserves</p>

      <div class="bg-orange-50 rounded-2xl p-4 mb-4 text-left space-y-2">
        <div class="before-after">
          <div><p class="text-xs font-bold text-red-500 mb-1">😤 BEFORE</p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Yelling before 9 AM</li><li>• Forgotten PE kits</li><li>• Late every Tuesday</li>
            </ul>
          </div>
          <div class="divider-v"></div>
          <div><p class="text-xs font-bold text-green-500 mb-1">😊 AFTER Plus</p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Calm, smooth mornings</li><li>• Never forget anything</li><li>• Kids ready on time</li>
            </ul>
          </div>
        </div>
      </div>

      <ul class="text-sm text-left space-y-2 mb-5">
        <li class="flex gap-2"><span class="text-green-500">✓</span><span>Unlimited kids & routines</span></li>
        <li class="flex gap-2"><span class="text-green-500">✓</span><span>Smart bag reminders by day</span></li>
        <li class="flex gap-2"><span class="text-green-500">✓</span><span>Calm script library (10+ scripts)</span></li>
        <li class="flex gap-2"><span class="text-green-500">✓</span><span>M-F weekly routine templates</span></li>
        <li class="flex gap-2"><span class="text-green-500">✓</span><span>Referral rewards program</span></li>
      </ul>

      <button onclick="startTrial()" class="btn-primary w-full mb-2">Start 7-Day Free Trial 🚀</button>
      <p class="text-xs text-gray-400">Then $4.99/month. Cancel anytime. No surprise charges.</p>
    </div>
  </div>
</div>

<!-- ===== TIMER MODAL ===== -->
<div id="timer-modal" class="modal-overlay hidden">
  <div class="modal-card text-center">
    <div class="text-6xl mb-2" id="modal-task-icon">🧦</div>
    <h3 class="text-xl font-black text-gray-800 mb-1" id="modal-task-name">Put on socks</h3>
    <p class="text-gray-400 text-sm mb-4" id="modal-motivational">⚡ Beat the timer!</p>
    <div class="relative w-32 h-32 mx-auto mb-4">
      <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#fed7aa" stroke-width="12"/>
        <circle id="timer-circle" cx="60" cy="60" r="54" fill="none" stroke="#f97316" stroke-width="12"
          stroke-dasharray="339.3" stroke-dashoffset="0" stroke-linecap="round"/>
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span id="timer-countdown" class="text-3xl font-black text-orange-600">3:00</span>
      </div>
    </div>
    <div class="flex gap-3">
      <button onclick="closeTimer()" class="btn-outline flex-1">Skip</button>
      <button onclick="completeTimerTask()" class="btn-primary flex-1">Done! ✅</button>
    </div>
  </div>
</div>

<!-- ===== CELEBRATION MODAL ===== -->
<div id="celebration-modal" class="modal-overlay hidden">
  <div class="modal-card text-center">
    <div class="text-6xl mb-3 animate-bounce">🎉</div>
    <h3 class="text-2xl font-black text-gray-900 mb-2" id="celebration-title">Amazing!</h3>
    <p class="text-gray-500 mb-4" id="celebration-msg">You nailed it!</p>
    <div class="text-4xl mb-4" id="celebration-stars">⭐⭐⭐</div>
    <button onclick="closeCelebration()" class="btn-primary w-full">Keep Going! 🚀</button>
  </div>
</div>

<script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
