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

<!-- ONBOARDING SCREEN -->
<div id="onboarding" class="screen active">
  <div class="min-h-screen flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-7xl mb-3">🌅</div>
        <h1 class="text-4xl font-bold text-orange-600">Morning Mate</h1>
        <p class="text-gray-500 mt-2 text-lg">Calm mornings. Happy families.</p>
      </div>

      <!-- Steps -->
      <div id="onboarding-steps">

        <!-- Step 1: Welcome -->
        <div class="onboard-step" id="step-1">
          <div class="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-3">👋 Welcome, Mum!</h2>
            <p class="text-gray-600 leading-relaxed">Morning Mate is your personal morning coach. Less chaos, less yelling, more calm — every single school day.</p>
            <div class="mt-4 space-y-2">
              <div class="flex items-center gap-3 text-gray-600"><span class="text-2xl">⏰</span><span>Live countdown to school</span></div>
              <div class="flex items-center gap-3 text-gray-600"><span class="text-2xl">✅</span><span>Gamified kids routines</span></div>
              <div class="flex items-center gap-3 text-gray-600"><span class="text-2xl">🎒</span><span>Smart bag reminders</span></div>
              <div class="flex items-center gap-3 text-gray-600"><span class="text-2xl">🧘</span><span>Calm reset when overwhelmed</span></div>
            </div>
          </div>
          <button onclick="nextStep(2)" class="btn-primary w-full">Get Started →</button>
        </div>

        <!-- Step 2: Mum's name -->
        <div class="onboard-step hidden" id="step-2">
          <div class="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">What's your name?</h2>
            <p class="text-gray-500 mb-4">So we can make this feel personal 💛</p>
            <input id="mum-name-input" type="text" placeholder="Your first name" class="input-field" maxlength="30"/>
          </div>
          <button onclick="nextStep(3)" class="btn-primary w-full">Next →</button>
        </div>

        <!-- Step 3: School leave time -->
        <div class="onboard-step hidden" id="step-3">
          <div class="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">⏰ What time do you leave?</h2>
            <p class="text-gray-500 mb-4">We'll build your countdown around this</p>
            <input id="leave-time-input" type="time" value="08:30" class="input-field text-center text-2xl font-bold"/>
            <p class="text-sm text-gray-400 mt-2 text-center">You can change this anytime in settings</p>
          </div>
          <button onclick="nextStep(4)" class="btn-primary w-full">Next →</button>
        </div>

        <!-- Step 4: Add first child -->
        <div class="onboard-step hidden" id="step-4">
          <div class="bg-white rounded-3xl p-6 shadow-lg mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">👧 Add your first child</h2>
            <p class="text-gray-500 mb-4">We'll create a routine tailored to them</p>
            <div class="space-y-3">
              <input id="child-name-input" type="text" placeholder="Child's name" class="input-field" maxlength="20"/>
              <div>
                <label class="text-sm font-medium text-gray-600 mb-1 block">Age group</label>
                <select id="child-age-input" class="input-field">
                  <option value="3-5">3–5 years (Mum-led)</option>
                  <option value="6-9" selected>6–9 years (Shared)</option>
                  <option value="10+">10+ years (Independent)</option>
                </select>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-600 mb-1 block">Avatar</label>
                <div class="flex gap-3 flex-wrap">
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
          </div>
          <button onclick="finishOnboarding()" class="btn-primary w-full">Let's Go! 🚀</button>
        </div>

      </div>

      <!-- Step indicator -->
      <div class="flex justify-center gap-2 mt-4">
        <div class="step-dot active" id="dot-1"></div>
        <div class="step-dot" id="dot-2"></div>
        <div class="step-dot" id="dot-3"></div>
        <div class="step-dot" id="dot-4"></div>
      </div>
    </div>
  </div>
</div>

<!-- MAIN APP SHELL -->
<div id="app" class="screen hidden">

  <!-- Top Nav -->
  <div class="top-bar">
    <div class="flex items-center gap-2">
      <span class="text-2xl">🌅</span>
      <span class="font-bold text-orange-700 text-lg">Morning Mate</span>
    </div>
    <button onclick="showScreen('settings')" class="text-gray-500 hover:text-orange-600 text-xl">
      <i class="fas fa-cog"></i>
    </button>
  </div>

  <!-- Screen Container -->
  <div class="screen-container">

    <!-- HOME SCREEN -->
    <div class="app-screen active" id="screen-home">
      <div class="p-4 space-y-4 pb-24">

        <!-- Greeting + Meltdown Warning -->
        <div class="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-5 text-white shadow-lg">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-orange-100 text-sm" id="greeting-time">Good morning!</p>
              <h2 class="text-2xl font-bold" id="greeting-name">Ready to go?</h2>
              <p class="text-orange-100 text-sm mt-1" id="date-display"></p>
            </div>
            <div class="text-4xl" id="home-weather-icon">☀️</div>
          </div>

          <!-- Countdown -->
          <div class="mt-4 bg-white/20 rounded-2xl p-4 text-center">
            <p class="text-orange-100 text-sm mb-1">Leave for school in</p>
            <div class="text-4xl font-bold tracking-tight" id="countdown-display">--:--</div>
            <p class="text-orange-100 text-sm mt-1" id="leave-time-display">Target: 08:30</p>
          </div>

          <!-- Meltdown warning -->
          <div id="meltdown-warning" class="hidden mt-3 bg-red-500/30 border border-red-300/50 rounded-xl p-3">
            <p class="text-sm font-semibold">⚠️ Meltdown Window Active</p>
            <p class="text-xs text-orange-100 mt-1">Peak stress time (30–45 mins after waking). Keep tasks simple, voice calm, one thing at a time.</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-2 gap-3">
          <button onclick="showScreen('routine')" class="quick-action-card bg-white">
            <span class="text-3xl">✅</span>
            <span class="font-semibold text-gray-700">Morning Routine</span>
            <span class="text-xs text-gray-400" id="routine-progress-label">0 of 0 done</span>
          </button>
          <button onclick="showScreen('calm')" class="quick-action-card bg-red-50 border-red-100">
            <span class="text-3xl">🧘</span>
            <span class="font-semibold text-red-600">Calm Reset</span>
            <span class="text-xs text-red-400">Tap when overwhelmed</span>
          </button>
          <button onclick="showScreen('bag')" class="quick-action-card bg-white">
            <span class="text-3xl">🎒</span>
            <span class="font-semibold text-gray-700">Bag Check</span>
            <span class="text-xs text-gray-400" id="bag-progress-label">Check items</span>
          </button>
          <button onclick="showScreen('evening')" class="quick-action-card bg-purple-50 border-purple-100">
            <span class="text-3xl">🌙</span>
            <span class="font-semibold text-purple-600">Tonight's Prep</span>
            <span class="text-xs text-purple-400">Be ready tomorrow</span>
          </button>
        </div>

        <!-- Children Overview -->
        <div class="bg-white rounded-3xl p-4 shadow-sm">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-gray-700">👧 Children</h3>
            <button onclick="showScreen('children')" class="text-sm text-orange-500 font-medium">Manage</button>
          </div>
          <div id="children-overview" class="space-y-2">
            <!-- Populated by JS -->
          </div>
        </div>

        <!-- Streak -->
        <div class="bg-white rounded-3xl p-4 shadow-sm">
          <h3 class="font-bold text-gray-700 mb-3">🔥 Morning Streak</h3>
          <div class="flex gap-2" id="streak-display">
            <!-- Populated by JS -->
          </div>
          <p class="text-sm text-gray-500 mt-2" id="streak-message">Keep it up!</p>
        </div>

      </div>
    </div>

    <!-- ROUTINE SCREEN -->
    <div class="app-screen hidden" id="screen-routine">
      <div class="p-4 pb-24">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="text-gray-400 text-xl"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-bold text-gray-800">Morning Routine</h2>
        </div>

        <!-- Child Selector -->
        <div id="child-tabs" class="flex gap-2 mb-4 overflow-x-auto pb-1">
          <!-- Populated by JS -->
        </div>

        <!-- Mum's own routine -->
        <div class="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-4 mb-4 border border-pink-200">
          <h3 class="font-bold text-pink-700 mb-3">💅 Your Morning (Mum First!)</h3>
          <div id="mum-tasks" class="space-y-2">
            <!-- Populated by JS -->
          </div>
        </div>

        <!-- Active Child Routine -->
        <div id="child-routine-panel">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-bold text-gray-700" id="active-child-name">Child Tasks</h3>
            <div class="bg-orange-100 rounded-xl px-3 py-1">
              <span class="text-orange-700 font-bold text-sm" id="child-task-count">0/0</span>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="bg-gray-200 rounded-full h-3 mb-4">
            <div id="routine-progress-bar" class="bg-gradient-to-r from-orange-400 to-amber-400 h-3 rounded-full transition-all duration-500" style="width:0%"></div>
          </div>

          <div id="child-tasks" class="space-y-2">
            <!-- Populated by JS -->
          </div>

          <!-- All done -->
          <div id="all-done-banner" class="hidden mt-4 bg-green-100 border border-green-300 rounded-2xl p-4 text-center">
            <div class="text-4xl mb-2">🎉</div>
            <p class="font-bold text-green-700">All tasks done!</p>
            <p class="text-sm text-green-600">Amazing morning! You're a superstar!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CALM RESET SCREEN -->
    <div class="app-screen hidden" id="screen-calm">
      <div class="p-4 pb-24">
        <div class="flex items-center gap-3 mb-6">
          <button onclick="showScreen('home')" class="text-gray-400 text-xl"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-bold text-gray-800">Calm Reset</h2>
        </div>

        <!-- Emergency button -->
        <div class="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-6 text-white text-center shadow-xl mb-6">
          <div class="text-5xl mb-3">🆘</div>
          <h3 class="text-xl font-bold mb-2">Overwhelmed?</h3>
          <p class="text-red-100 text-sm mb-4">Tap the button. We'll guide you through it.</p>
          <button onclick="startCalmMode()" class="bg-white text-red-600 font-bold py-3 px-8 rounded-2xl text-lg shadow">
            Start Calm Mode
          </button>
        </div>

        <!-- Breathing exercise -->
        <div id="breathing-panel" class="hidden bg-white rounded-3xl p-6 shadow-lg mb-4">
          <h3 class="font-bold text-gray-800 text-center mb-4">4-4-4 Breathing</h3>
          <div class="flex flex-col items-center">
            <div id="breath-circle" class="breath-circle mb-4">
              <span id="breath-text" class="text-white font-bold text-lg">Ready</span>
            </div>
            <p id="breath-instruction" class="text-gray-600 text-center">Tap to begin</p>
            <button onclick="startBreathing()" id="breath-btn" class="btn-primary mt-4">Begin</button>
          </div>
        </div>

        <!-- Calm scripts -->
        <div class="bg-white rounded-3xl p-5 shadow-sm mb-4">
          <h3 class="font-bold text-gray-700 mb-3">💬 Calm Scripts</h3>
          <p class="text-sm text-gray-500 mb-3">Say this out loud — it works:</p>
          <div id="calm-scripts" class="space-y-3">
            <!-- Populated by JS -->
          </div>
          <button onclick="nextScript()" class="btn-outline w-full mt-3">Next Script →</button>
        </div>

        <!-- Grounding technique -->
        <div class="bg-amber-50 rounded-3xl p-5 border border-amber-200">
          <h3 class="font-bold text-amber-800 mb-3">🌿 5-4-3-2-1 Grounding</h3>
          <div class="space-y-2 text-sm text-amber-700">
            <div class="flex gap-3"><span class="font-bold">5</span><span>things you can SEE right now</span></div>
            <div class="flex gap-3"><span class="font-bold">4</span><span>things you can TOUCH</span></div>
            <div class="flex gap-3"><span class="font-bold">3</span><span>things you can HEAR</span></div>
            <div class="flex gap-3"><span class="font-bold">2</span><span>things you can SMELL</span></div>
            <div class="flex gap-3"><span class="font-bold">1</span><span>thing you can TASTE</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- BAG CHECK SCREEN -->
    <div class="app-screen hidden" id="screen-bag">
      <div class="p-4 pb-24">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="text-gray-400 text-xl"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-bold text-gray-800">🎒 Bag Check</h2>
        </div>

        <!-- Day display -->
        <div class="bg-orange-100 rounded-2xl p-3 mb-4 text-center border border-orange-200">
          <p class="text-orange-700 font-semibold" id="bag-day-display">Today's checklist</p>
        </div>

        <!-- Child bag tabs -->
        <div id="bag-child-tabs" class="flex gap-2 mb-4 overflow-x-auto pb-1"></div>

        <!-- Bag items -->
        <div id="bag-items" class="space-y-2 mb-4"></div>

        <!-- Add custom item -->
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <h3 class="font-semibold text-gray-700 mb-2">➕ Add Item</h3>
          <div class="flex gap-2">
            <input id="bag-item-input" type="text" placeholder="e.g. Swimming kit" class="input-field flex-1"/>
            <select id="bag-item-day" class="input-field w-28">
              <option value="daily">Daily</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>
          <button onclick="addBagItem()" class="btn-primary w-full mt-2">Add to Bag</button>
        </div>
      </div>
    </div>

    <!-- EVENING PREP SCREEN -->
    <div class="app-screen hidden" id="screen-evening">
      <div class="p-4 pb-24">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="text-gray-400 text-xl"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-bold text-gray-800">🌙 Tonight's Prep</h2>
        </div>

        <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white mb-5 shadow-lg">
          <h3 class="text-lg font-bold mb-1">Tomorrow starts tonight</h3>
          <p class="text-indigo-100 text-sm">Tick these off before bed = smooth morning guaranteed.</p>
          <div class="mt-3 bg-white/20 rounded-xl p-3 text-center">
            <span class="text-2xl font-bold" id="evening-progress-display">0/0</span>
            <span class="text-indigo-100 text-sm ml-2">items ready</span>
          </div>
        </div>

        <div id="evening-tasks" class="space-y-2 mb-4"></div>

        <!-- Tips -->
        <div class="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
          <h3 class="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h3>
          <ul class="text-sm text-yellow-700 space-y-1">
            <li>• Lay out tomorrow's clothes the night before</li>
            <li>• Pack the bag before the kids go to bed</li>
            <li>• Prepare lunch box before bedtime</li>
            <li>• Check the school app for any notices</li>
            <li>• Set two alarms — yours 20 mins before kids</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- CHILDREN MANAGEMENT SCREEN -->
    <div class="app-screen hidden" id="screen-children">
      <div class="p-4 pb-24">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="text-gray-400 text-xl"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-bold text-gray-800">👧 Children</h2>
        </div>

        <div id="children-list" class="space-y-3 mb-4"></div>

        <!-- Add child form -->
        <div class="bg-white rounded-3xl p-5 shadow-sm border-2 border-dashed border-orange-200">
          <h3 class="font-bold text-gray-700 mb-3">➕ Add Child</h3>
          <div class="space-y-3">
            <input id="new-child-name" type="text" placeholder="Child's name" class="input-field" maxlength="20"/>
            <select id="new-child-age" class="input-field">
              <option value="3-5">3–5 years (Mum-led)</option>
              <option value="6-9" selected>6–9 years (Shared)</option>
              <option value="10+">10+ years (Independent)</option>
            </select>
            <div>
              <label class="text-sm font-medium text-gray-600 mb-1 block">Choose avatar</label>
              <div class="flex gap-2 flex-wrap">
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
            <!-- Sensory toggle -->
            <div class="flex items-center justify-between bg-orange-50 rounded-xl p-3">
              <div>
                <p class="font-medium text-gray-700 text-sm">Sensory Sensitive</p>
                <p class="text-xs text-gray-500">Clothing/texture issues</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="new-child-sensory"/>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="flex items-center justify-between bg-blue-50 rounded-xl p-3">
              <div>
                <p class="font-medium text-gray-700 text-sm">School Anxious</p>
                <p class="text-xs text-gray-500">Sometimes refuses school</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="new-child-anxiety"/>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <button onclick="addChild()" class="btn-primary w-full mt-4">Add Child</button>
        </div>
      </div>
    </div>

    <!-- SETTINGS SCREEN -->
    <div class="app-screen hidden" id="screen-settings">
      <div class="p-4 pb-24">
        <div class="flex items-center gap-3 mb-4">
          <button onclick="showScreen('home')" class="text-gray-400 text-xl"><i class="fas fa-arrow-left"></i></button>
          <h2 class="text-xl font-bold text-gray-800">⚙️ Settings</h2>
        </div>

        <div class="space-y-4">
          <!-- Profile -->
          <div class="bg-white rounded-2xl p-4 shadow-sm">
            <h3 class="font-bold text-gray-700 mb-3">👩 Your Profile</h3>
            <div class="space-y-3">
              <div>
                <label class="text-sm text-gray-600 mb-1 block">Your name</label>
                <input id="settings-mum-name" type="text" class="input-field" placeholder="Your name"/>
              </div>
              <div>
                <label class="text-sm text-gray-600 mb-1 block">School leave time</label>
                <input id="settings-leave-time" type="time" class="input-field text-center font-bold"/>
              </div>
              <div>
                <label class="text-sm text-gray-600 mb-1 block">Meltdown warning (mins after wake)</label>
                <select id="settings-meltdown" class="input-field">
                  <option value="30">30 minutes</option>
                  <option value="35" selected>35 minutes</option>
                  <option value="40">40 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="0">Off</option>
                </select>
              </div>
            </div>
            <button onclick="saveSettings()" class="btn-primary w-full mt-3">Save Changes</button>
          </div>

          <!-- Reset -->
          <div class="bg-red-50 rounded-2xl p-4 border border-red-100">
            <h3 class="font-bold text-red-700 mb-2">⚠️ Reset</h3>
            <p class="text-sm text-red-500 mb-3">Clear all data and start fresh</p>
            <button onclick="resetApp()" class="bg-red-500 text-white rounded-xl py-2 px-4 text-sm font-medium w-full">Reset App</button>
          </div>

          <!-- About -->
          <div class="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div class="text-3xl mb-2">🌅</div>
            <p class="font-bold text-gray-700">Morning Mate</p>
            <p class="text-xs text-gray-400 mt-1">Version 1.0 • Calm mornings. Happy families.</p>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Bottom Nav -->
  <nav class="bottom-nav">
    <button onclick="showScreen('home')" class="nav-btn active" id="nav-home">
      <i class="fas fa-home text-xl"></i>
      <span>Home</span>
    </button>
    <button onclick="showScreen('routine')" class="nav-btn" id="nav-routine">
      <i class="fas fa-check-circle text-xl"></i>
      <span>Routine</span>
    </button>
    <button onclick="showScreen('bag')" class="nav-btn" id="nav-bag">
      <i class="fas fa-backpack text-xl"></i>
      <span>Bag</span>
    </button>
    <button onclick="showScreen('evening')" class="nav-btn" id="nav-evening">
      <i class="fas fa-moon text-xl"></i>
      <span>Tonight</span>
    </button>
    <button onclick="showScreen('calm')" class="nav-btn emergency-nav" id="nav-calm">
      <i class="fas fa-spa text-xl"></i>
      <span>Calm</span>
    </button>
  </nav>
</div>

<!-- TASK TIMER MODAL -->
<div id="timer-modal" class="modal-overlay hidden">
  <div class="modal-card">
    <div class="text-center">
      <div class="text-6xl mb-3" id="modal-task-icon">🧦</div>
      <h3 class="text-xl font-bold text-gray-800 mb-1" id="modal-task-name">Put on socks</h3>
      <p class="text-gray-500 text-sm mb-4" id="modal-child-name-display">Challenge mode!</p>
      <div class="relative w-32 h-32 mx-auto mb-4">
        <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#fed7aa" stroke-width="12"/>
          <circle id="timer-circle" cx="60" cy="60" r="54" fill="none" stroke="#f97316" stroke-width="12"
            stroke-dasharray="339.3" stroke-dashoffset="0" stroke-linecap="round"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span id="timer-countdown" class="text-3xl font-bold text-orange-600">3:00</span>
        </div>
      </div>
      <p id="timer-motivational" class="text-sm text-orange-500 font-medium mb-4">⚡ Beat the timer!</p>
      <div class="flex gap-3">
        <button onclick="closeTimer()" class="btn-outline flex-1">Skip</button>
        <button onclick="completeTimerTask()" id="timer-done-btn" class="btn-primary flex-1">Done! ✅</button>
      </div>
    </div>
  </div>
</div>

<!-- CELEBRATION MODAL -->
<div id="celebration-modal" class="modal-overlay hidden">
  <div class="modal-card text-center">
    <div class="text-6xl mb-3 animate-bounce">🎉</div>
    <h3 class="text-2xl font-bold text-gray-800 mb-2" id="celebration-title">Amazing!</h3>
    <p class="text-gray-600 mb-5" id="celebration-msg">You completed the task!</p>
    <div class="stars-display text-4xl mb-4" id="celebration-stars">⭐⭐⭐</div>
    <button onclick="closeCelebration()" class="btn-primary w-full">Keep Going! 🚀</button>
  </div>
</div>

<script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
