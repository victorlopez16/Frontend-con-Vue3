<template>
  <div class="home">

    <!-- ══ HERO ══════════════════════════════════════════════ -->
    <section class="hero">
      <div class="hero-eyebrow">
        <span class="eyebrow-code">REF-7742</span>
        <span class="eyebrow-sep">//</span>
        <span class="eyebrow-label">Informe d'Activitat Global</span>
        <span class="eyebrow-date">{{ currentDate }}</span>
      </div>

      <div class="hero-body">
        <div class="hero-left">
          <h1 class="hero-title">
            <span class="title-line1">MONITOR</span>
            <span class="title-line2">DE <em>CONFLICTES</em></span>
            <span class="title-line3">GLOBALS</span>
          </h1>
          <p class="hero-desc">
            Sistema de seguiment en temps real dels conflictes armats i crisi geopolítiques actives a tot el món. Dades actualitzades contínuament.
          </p>
        </div>
        <div class="hero-right">
          <div class="radar-container">
            <svg class="radar-svg" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="90" cy="90" r="85" stroke="rgba(230,57,70,0.15)" stroke-width="1"/>
              <circle cx="90" cy="90" r="60" stroke="rgba(230,57,70,0.12)" stroke-width="1"/>
              <circle cx="90" cy="90" r="35" stroke="rgba(230,57,70,0.10)" stroke-width="1"/>
              <circle cx="90" cy="90" r="10" fill="rgba(230,57,70,0.3)"/>
              <line x1="90" y1="5" x2="90" y2="175" stroke="rgba(230,57,70,0.08)" stroke-width="1"/>
              <line x1="5" y1="90" x2="175" y2="90" stroke="rgba(230,57,70,0.08)" stroke-width="1"/>
              <line x1="30" y1="30" x2="150" y2="150" stroke="rgba(230,57,70,0.06)" stroke-width="1"/>
              <line x1="150" y1="30" x2="30" y2="150" stroke="rgba(230,57,70,0.06)" stroke-width="1"/>
              <path d="M90 90 L90 5 A85 85 0 0 1 174 110 Z" fill="rgba(230,57,70,0.08)" class="radar-sweep"/>
              <!-- blips -->
              <circle cx="55" cy="42" r="3" fill="#e63946" opacity="0.9" class="blip b1"/>
              <circle cx="130" cy="70" r="3" fill="#e63946" opacity="0.9" class="blip b2"/>
              <circle cx="110" cy="130" r="3" fill="#e63946" opacity="0.9" class="blip b3"/>
              <circle cx="60" cy="115" r="2.5" fill="#f4a261" opacity="0.8" class="blip b4"/>
              <circle cx="145" cy="45" r="2" fill="#f4a261" opacity="0.7" class="blip b5"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ STATS ══════════════════════════════════════════════ -->
    <section class="stats-section">
      <div class="section-header">
        <span class="section-label">▸ RESUM D'ESTAT</span>
        <div class="section-line"></div>
      </div>
      <div class="stats-row">
        <div class="stat-block active-stat">
          <div class="stat-header">
            <span class="stat-status-dot"></span>
            <span class="stat-code">ST-001</span>
          </div>
          <div class="stat-value">{{ store.totalActive }}</div>
          <div class="stat-name">CONFLICTES ACTIUS</div>
          <div class="stat-bar">
            <div class="stat-bar-fill active-fill" :style="{ width: (store.totalActive / store.conflicts.length * 100) + '%' }"></div>
          </div>
        </div>

        <div class="stat-block ended-stat">
          <div class="stat-header">
            <span class="stat-status-dot ended-dot"></span>
            <span class="stat-code">ST-002</span>
          </div>
          <div class="stat-value">{{ store.totalEnded }}</div>
          <div class="stat-name">FINALITZATS</div>
          <div class="stat-bar">
            <div class="stat-bar-fill ended-fill" :style="{ width: (store.totalEnded / store.conflicts.length * 100) + '%' }"></div>
          </div>
        </div>

        <div class="stat-block total-stat">
          <div class="stat-header">
            <span class="stat-status-dot total-dot"></span>
            <span class="stat-code">ST-003</span>
          </div>
          <div class="stat-value">{{ store.conflicts.length }}</div>
          <div class="stat-name">TOTAL REGISTRATS</div>
          <div class="stat-bar">
            <div class="stat-bar-fill total-fill" style="width: 100%"></div>
          </div>
        </div>

        <div class="stat-block coverage-stat">
          <div class="stat-header">
            <span class="stat-status-dot coverage-dot"></span>
            <span class="stat-code">ST-004</span>
          </div>
          <div class="stat-value">{{ store.conflicts.length > 0 ? Math.round(store.totalActive / store.conflicts.length * 100) : 0 }}<span class="stat-unit">%</span></div>
          <div class="stat-name">TAXA D'ACTIVITAT</div>
          <div class="stat-bar">
            <div class="stat-bar-fill coverage-fill" :style="{ width: (store.totalActive / Math.max(store.conflicts.length,1) * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SEARCH ══════════════════════════════════════════════ -->
    <section class="search-section">
      <div class="section-header">
        <span class="section-label">▸ CERCA I FILTRA</span>
        <div class="section-line"></div>
      </div>
      <div class="search-row">
        <div class="search-wrap">
          <div class="search-prefix">
            <span class="search-icon-text">SRH</span>
          </div>
          <input
            v-model="store.searchQuery"
            type="text"
            placeholder="Cerca per nom, país, regió..."
            class="search-input"
            autocomplete="off"
            spellcheck="false"
          />
          <div class="search-suffix">
            <span v-if="!store.searchQuery" class="search-hint">↵ ENTER</span>
            <button v-else class="clear-btn" @click="store.searchQuery = ''">✕ NETEJAR</button>
          </div>
        </div>

        <div class="results-badge" v-if="store.searchQuery">
          <span class="badge-num">{{ store.filteredConflicts.length }}</span>
          <span class="badge-label">RESULTAT{{ store.filteredConflicts.length !== 1 ? 'S' : '' }}</span>
        </div>
      </div>
    </section>

    <!-- ══ LIST ══════════════════════════════════════════════ -->
    <section class="list-section">
      <div class="section-header">
        <span class="section-label">▸ REGISTRE DE CONFLICTES</span>
        <div class="section-line"></div>
        <span class="section-count" v-if="!store.loading && !store.error">
          {{ store.filteredConflicts.length }} ENTRADES
        </span>
      </div>

      <!-- LOADING -->
      <div v-if="store.loading" class="loading-state">
        <div class="loading-bars">
          <span></span><span></span><span></span><span></span>
        </div>
        <p class="loading-text">CARREGANT REGISTRES DEL SISTEMA...</p>
      </div>

      <!-- ERROR -->
      <div v-else-if="store.error" class="error-state">
        <div class="error-icon">⚠</div>
        <p class="error-msg">ERROR DEL SISTEMA: {{ store.error }}</p>
        <button class="retry-btn" @click="store.fetchConflicts()">↺ REINTENTAR CONNEXIÓ</button>
      </div>

      <!-- GRID -->
      <div v-else-if="store.filteredConflicts.length > 0" class="conflicts-grid">
        <ConflictCard
          v-for="(conflict, i) in store.filteredConflicts"
          :key="conflict.id"
          :conflict="conflict"
          :index="i"
          @view-detail="goToDetail"
        />
      </div>

      <!-- EMPTY -->
      <div v-else class="empty-state">
        <div class="empty-crosshair">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30" cy="30" r="25" stroke="#e63946" stroke-width="1" opacity="0.3"/>
            <circle cx="30" cy="30" r="12" stroke="#e63946" stroke-width="1" opacity="0.3"/>
            <line x1="30" y1="5" x2="30" y2="55" stroke="#e63946" stroke-width="1" opacity="0.3"/>
            <line x1="5" y1="30" x2="55" y2="30" stroke="#e63946" stroke-width="1" opacity="0.3"/>
            <line x1="15" y1="15" x2="45" y2="45" stroke="#e63946" stroke-width="1" opacity="0.2"/>
            <line x1="45" y1="15" x2="15" y2="45" stroke="#e63946" stroke-width="1" opacity="0.2"/>
          </svg>
        </div>
        <p class="empty-text">SENSE RESULTATS PER A LA CERCA ACTUAL</p>
        <button class="empty-btn" @click="store.searchQuery = ''">↺ NETEJAR FILTRE</button>
      </div>
    </section>

    <!-- ══ CHART ══════════════════════════════════════════════ -->
    <section class="chart-section">
      <div class="section-header">
        <span class="section-label">▸ DISTRIBUCIÓ REGIONAL</span>
        <div class="section-line"></div>
      </div>
      <div class="chart-wrap">
        <RegionChart />
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConflictsStore } from '../stores/conflicts'
import ConflictCard from '../components/ConflictCard.vue'
import RegionChart from '../components/RegionChart.vue'

const store = useConflictsStore()
const router = useRouter()

const currentDate = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
})

onMounted(() => {
  store.fetchConflicts()
})

function goToDetail(id) {
  router.push({ name: 'conflict-detail', params: { id } })
}
</script>

<style scoped>
/* ─── LAYOUT ──────────────────────────────────────── */
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

/* ─── SECTION HEADER ─────────────────────────────── */
.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-label {
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--red);
  text-transform: uppercase;
  white-space: nowrap;
}

.section-line {
  flex: 1;
  height: 1px;
  background: var(--border);
}

.section-count {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--text3);
}

/* ─── HERO ───────────────────────────────────────── */
.hero {
  padding-top: 1rem;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
}

.eyebrow-code {
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--red);
  background: var(--red-dim);
  border: 1px solid rgba(230,57,70,0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 2px;
}

.eyebrow-sep {
  font-family: var(--mono);
  color: var(--text3);
  font-size: 0.7rem;
}

.eyebrow-label {
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--text3);
  text-transform: uppercase;
}

.eyebrow-date {
  margin-left: auto;
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--text3);
}

.hero-body {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 3rem;
}

.hero-title {
  font-family: var(--cond);
  font-weight: 900;
  text-transform: uppercase;
  line-height: 0.9;
  margin-bottom: 1.5rem;
}

.title-line1 {
  display: block;
  font-size: clamp(3rem, 7vw, 6rem);
  color: var(--text);
  letter-spacing: -0.01em;
}

.title-line2 {
  display: block;
  font-size: clamp(3rem, 7vw, 6rem);
  color: var(--text2);
  letter-spacing: -0.01em;
}

.title-line2 em {
  font-style: normal;
  color: var(--red);
}

.title-line3 {
  display: block;
  font-size: clamp(3rem, 7vw, 6rem);
  color: var(--text);
  letter-spacing: -0.01em;
}

.hero-desc {
  font-family: var(--body);
  font-size: 0.95rem;
  font-weight: 300;
  color: var(--text2);
  line-height: 1.7;
  max-width: 480px;
  border-left: 2px solid var(--border2);
  padding-left: 1rem;
}

.radar-container {
  width: 180px;
  height: 180px;
  position: relative;
  opacity: 0.85;
}

.radar-svg { width: 100%; height: 100%; }

.radar-sweep {
  transform-origin: 90px 90px;
  animation: sweepRotate 4s linear infinite;
}

@keyframes sweepRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.blip { animation: blipPulse 2s ease-in-out infinite; }
.b1 { animation-delay: 0s; }
.b2 { animation-delay: 0.4s; }
.b3 { animation-delay: 0.8s; }
.b4 { animation-delay: 1.2s; }
.b5 { animation-delay: 1.6s; }

@keyframes blipPulse {
  0%, 100% { opacity: 0.9; }
  50%       { opacity: 0.2; }
}

/* ─── STATS ──────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.stat-block {
  background: var(--bg2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition: background 0.2s;
}

.stat-block:hover { background: var(--bg3); }

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.stat-status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--red);
  box-shadow: 0 0 8px var(--red);
  animation: dotBlink 2s ease-in-out infinite;
}

.ended-dot { background: var(--green); box-shadow: 0 0 8px var(--green); animation: none; }
.total-dot { background: var(--blue); box-shadow: 0 0 8px var(--blue); animation: none; }
.coverage-dot { background: var(--amber); box-shadow: 0 0 8px var(--amber); animation: none; }

@keyframes dotBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.stat-code {
  font-family: var(--mono);
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  color: var(--text3);
}

.stat-value {
  font-family: var(--cond);
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  color: var(--text);
}

.stat-unit {
  font-size: 2rem;
  color: var(--text2);
}

.stat-name {
  font-family: var(--mono);
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  color: var(--text3);
  text-transform: uppercase;
}

.stat-bar {
  margin-top: 0.8rem;
  height: 2px;
  background: var(--border);
  border-radius: 1px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 1px;
  transition: width 1s ease;
}

.active-fill   { background: var(--red); }
.ended-fill    { background: var(--green); }
.total-fill    { background: var(--blue); }
.coverage-fill { background: var(--amber); }

/* ─── SEARCH ──────────────────────────────────────── */
.search-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid var(--border2);
  border-radius: 3px;
  background: var(--bg2);
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-wrap:focus-within {
  border-color: var(--red);
  box-shadow: 0 0 0 3px var(--red-dim);
}

.search-prefix {
  padding: 0 1rem;
  border-right: 1px solid var(--border);
  background: var(--surface);
}

.search-icon-text {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--text3);
}

.search-input {
  flex: 1;
  padding: 0.85rem 1rem;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text);
  font-family: var(--mono);
  font-size: 0.85rem;
  letter-spacing: 0.03em;
}

.search-input::placeholder {
  color: var(--text3);
  font-size: 0.8rem;
}

.search-suffix {
  padding: 0 1rem;
  border-left: 1px solid var(--border);
}

.search-hint {
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--text3);
}

.clear-btn {
  background: transparent;
  border: none;
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--red);
  cursor: pointer;
  padding: 0.2rem 0;
  transition: opacity 0.2s;
  text-transform: uppercase;
}

.clear-btn:hover { opacity: 0.7; }

.results-badge {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  background: var(--red-dim);
  border: 1px solid rgba(230,57,70,0.2);
  padding: 0.6rem 1rem;
  border-radius: 3px;
  white-space: nowrap;
}

.badge-num {
  font-family: var(--cond);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--red);
  line-height: 1;
}

.badge-label {
  font-family: var(--mono);
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  color: var(--red);
  opacity: 0.7;
}

/* ─── CONFLICTS GRID ─────────────────────────────── */
.conflicts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
}

/* ─── LOADING ─────────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  gap: 1.5rem;
}

.loading-bars {
  display: flex;
  gap: 4px;
  align-items: flex-end;
}

.loading-bars span {
  display: block;
  width: 4px;
  border-radius: 2px;
  background: var(--red);
  animation: barPulse 0.8s ease-in-out infinite;
}

.loading-bars span:nth-child(1) { height: 20px; animation-delay: 0s; }
.loading-bars span:nth-child(2) { height: 35px; animation-delay: 0.1s; }
.loading-bars span:nth-child(3) { height: 28px; animation-delay: 0.2s; }
.loading-bars span:nth-child(4) { height: 15px; animation-delay: 0.3s; }

@keyframes barPulse {
  0%, 100% { opacity: 0.2; }
  50%       { opacity: 1; }
}

.loading-text {
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--text3);
}

/* ─── ERROR ──────────────────────────────────────── */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 2rem;
  gap: 1rem;
}

.error-icon {
  font-size: 2.5rem;
  color: var(--red);
}

.error-msg {
  font-family: var(--mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--red);
  text-transform: uppercase;
}

.retry-btn {
  background: var(--red-dim);
  border: 1px solid rgba(230,57,70,0.3);
  color: var(--red);
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.6rem 1.2rem;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: rgba(230,57,70,0.2);
}

/* ─── EMPTY ──────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 2rem;
  gap: 1.2rem;
}

.empty-crosshair {
  width: 60px;
  height: 60px;
  opacity: 0.5;
}

.empty-text {
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--text3);
  text-transform: uppercase;
}

.empty-btn {
  background: var(--surface);
  border: 1px solid var(--border2);
  color: var(--text2);
  font-family: var(--mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.6rem 1.2rem;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.empty-btn:hover {
  border-color: var(--red);
  color: var(--red);
}

/* ─── CHART ──────────────────────────────────────── */
.chart-wrap {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2rem;
  max-width: 480px;
}

/* ─── RESPONSIVE ─────────────────────────────────── */
@media (max-width: 768px) {
  .home { padding: 1.5rem 1rem; gap: 2.5rem; }
  .hero-body { grid-template-columns: 1fr; }
  .radar-container { display: none; }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .conflicts-grid { grid-template-columns: 1fr; }
  .hero-eyebrow { flex-wrap: wrap; }
  .eyebrow-date { margin-left: 0; }
}
</style>