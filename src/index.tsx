import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
const app = new Hono()
app.use('/static/*', serveStatic({ root: './' }))

// ── ROOT → Astyra Look Engine ──────────────────────────────
app.get('/', (c) => c.redirect('/makeup'))

// ── Astyra core routes ────────────────────────────────────
app.get('/makeup', (c) => c.redirect('/static/makeup.html'))
app.get('/makeup-admin', (c) => c.redirect('/static/makeup-admin.html'))
app.get('/astyra-manual', (c) => c.redirect('/static/lume-manual.html'))
app.get('/lume-manual', (c) => c.redirect('/static/lume-manual.html'))

// ── TikTok bio / link-in-bio landing page ─────────────────
app.get('/go', (c) => c.redirect('/static/go.html'))

// ── Legal pages ───────────────────────────────────────────
app.get('/privacy', (c) => c.redirect('/static/privacy.html'))
app.get('/terms', (c) => c.redirect('/static/terms.html'))

// ── Legacy Morning Mate / Power India pages ───────────────
app.get('/app', (c) => c.redirect('/static/gold.html'))
app.get('/bilingual', (c) => c.redirect('/static/bilingual.html'))
app.get('/night-mate', (c) => c.redirect('/static/landing.html'))
app.get('/landing', (c) => c.redirect('/static/landing.html'))
app.get('/power-india', (c) => c.redirect('/static/india-cover.html'))
app.get('/india-cover', (c) => c.redirect('/static/india-cover.html'))
app.get('/india-synopsis', (c) => c.redirect('/static/india-synopsis.html'))
app.get('/gold', (c) => c.redirect('/static/gold-landing.html'))

export default app
