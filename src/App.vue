<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand" @click="router.push('/')">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="9" stroke="#e63946" stroke-width="1.5"/>
            <circle cx="11" cy="11" r="5" stroke="#e63946" stroke-width="1" stroke-dasharray="2 2"/>
            <circle cx="11" cy="11" r="2" fill="#e63946"/>
            <line x1="11" y1="2" x2="11" y2="0" stroke="#e63946" stroke-width="1.5"/>
            <line x1="11" y1="22" x2="11" y2="20" stroke="#e63946" stroke-width="1.5"/>
            <line x1="0" y1="11" x2="2" y2="11" stroke="#e63946" stroke-width="1.5"/>
            <line x1="20" y1="11" x2="22" y2="11" stroke="#e63946" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-main">CONFLICT<em>WATCH</em></span>
          <span class="brand-sub">Global Monitor · Live</span>
        </div>
      </div>

      <div class="nav-center">
        <div class="live-ticker">
          <span class="ticker-dot"></span>
          <span class="ticker-text">SISTEMA ACTIU — DADES EN TEMPS REAL</span>
        </div>
      </div>

      <div class="nav-links">
        <RouterLink to="/" class="nav-link">
          <span class="link-icon">⬡</span> Inici
        </RouterLink>
        <RouterLink to="/create" class="nav-link nav-link-create">
          <span class="link-icon">＋</span> Nou Conflicte
        </RouterLink>
      </div>
    </nav>

    <div class="scan-line"></div>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <span class="footer-mark">CONFLICTWATCH © {{ new Date().getFullYear() }}</span>
        <span class="footer-sep">|</span>
        <span class="footer-note">Dades de conflictes globals. Ús exclusivament informatiu.</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Barlow+Condensed:ital,wght@0,300;0,500;0,700;0,900;1,700&family=Barlow:wght@300;400;500&display=swap');

:root {
  --bg:        #08090d;
  --bg2:       #0d0f17;
  --bg3:       #12151f;
  --surface:   #161924;
  --border:    rgba(255,255,255,0.07);
  --border2:   rgba(255,255,255,0.12);
  --red:       #e63946;
  --red-glow:  rgba(230,57,70,0.18);
  --red-dim:   rgba(230,57,70,0.08);
  --amber:     #f4a261;
  --green:     #2a9d5c;
  --green-dim: rgba(42,157,92,0.12);
  --blue:      #4895ef;
  --blue-dim:  rgba(72,149,239,0.1);
  --text:      #dde2ec;
  --text2:     #8892a4;
  --text3:     #535e72;
  --mono:      'DM Mono', monospace;
  --cond:      'Barlow Condensed', sans-serif;
  --body:      'Barlow', sans-serif;
}

*, *::before, *::after {
  margin: 0; padding: 0;
  box-sizing: border-box;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  background-image:
    radial-gradient(ellipse 80% 40% at 50% -10%, rgba(230,57,70,0.06) 0%, transparent 60%),
    repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.02) 39px, rgba(255,255,255,0.02) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.015) 39px, rgba(255,255,255,0.015) 40px);
}

/* ─── NAVBAR ──────────────────────────────────────── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 200;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 2rem;
  background: rgba(8, 9, 13, 0.9);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border2);
  box-shadow: 0 1px 0 rgba(230,57,70,0.15);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
}

.brand-icon {
  opacity: 0.95;
  animation: radarSpin 8s linear infinite;
}

@keyframes radarSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.brand-main {
  font-family: var(--cond);
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  color: #fff;
  line-height: 1;
  text-transform: uppercase;
}

.brand-main em {
  font-style: normal;
  color: var(--red);
}

.brand-sub {
  font-family: var(--mono);
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  color: var(--text3);
  text-transform: uppercase;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.live-ticker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--red-dim);
  border: 1px solid rgba(230,57,70,0.2);
  padding: 0.25rem 0.9rem;
  border-radius: 2px;
}

.ticker-dot {
  width: 6px; height: 6px;
  background: var(--red);
  border-radius: 50%;
  animation: blink 1.2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--red); }
  50%       { opacity: 0.2; box-shadow: none; }
}

.ticker-text {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--red);
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  font-family: var(--cond);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text2);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.8rem;
  border: 1px solid transparent;
  border-radius: 2px;
  transition: all 0.2s;
}

.link-icon { font-size: 0.7rem; color: var(--red); }

.nav-link:hover,
.nav-link.router-link-active {
  color: #fff;
  border-color: var(--border2);
  background: var(--surface);
}

.nav-link-create {
  background: var(--red-dim);
  border-color: rgba(230,57,70,0.3) !important;
  color: var(--red) !important;
}

.nav-link-create:hover {
  background: rgba(230,57,70,0.15) !important;
  color: #fff !important;
}

/* ─── SCAN LINE ──────────────────────────────────── */
.scan-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--red), transparent);
  animation: scanMove 3s ease-in-out infinite;
  opacity: 0.5;
}

@keyframes scanMove {
  0%,100% { transform: scaleX(0.3); opacity: 0.2; }
  50%      { transform: scaleX(1);   opacity: 0.7; }
}

/* ─── MAIN ───────────────────────────────────────── */
main {
  min-height: calc(100vh - 120px);
}

/* ─── FOOTER ─────────────────────────────────────── */
.site-footer {
  border-top: 1px solid var(--border);
  padding: 1.2rem 2rem;
  margin-top: 4rem;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-mark {
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--text3);
  text-transform: uppercase;
}

.footer-sep { color: var(--border2); }

.footer-note {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--text3);
}

/* ─── SCROLLBAR ───────────────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--surface); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--border2); }

a { color: inherit; }
</style>