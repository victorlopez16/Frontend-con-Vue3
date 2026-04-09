<template>
  <div class="detail">

    <button class="btn-back" @click="router.push('/')">
      ← Tornar
    </button>

    <div v-if="store.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregant...</p>
    </div>

    <div v-else-if="!conflict" class="not-found">
      <p>❌ Conflicte no trobat.</p>
    </div>

    <div v-else class="detail-wrapper">

      <!-- HERO -->
      <div class="detail-hero" :class="conflict.status.toLowerCase()">
        <div class="hero-left">
          <div class="flags">
            <img
              v-for="country in conflict.countries"
              :key="country.id"
              :src="getFlag(country.code)"
              :alt="country.name"
              class="flag"
            />
          </div>
          <div>
            <h1>{{ conflict.name }}</h1>
            <p class="countries-list">
              📍 {{ conflict.countries.map(c => c.name).join(' vs ') }}
            </p>
          </div>
        </div>
        <span class="badge" :class="conflict.status.toLowerCase()">
          <span class="dot"></span>
          {{ conflict.status === 'ACTIVE' ? 'Conflicte Actiu' : 'Conflicte Finalitzat' }}
        </span>
      </div>

      <!-- INFO -->
      <div class="info-grid">
        <div class="info-box">
          <span class="info-label">📅 Data d'inici</span>
          <span class="info-value">{{ formatDate(conflict.startDate) }}</span>
        </div>
        <div class="info-box">
          <span class="info-label">🏁 Data de fi</span>
          <span class="info-value" :class="{ ongoing: !conflict.endDate }">
            {{ conflict.endDate ? formatDate(conflict.endDate) : 'En curs' }}
          </span>
        </div>
        <div class="info-box">
          <span class="info-label">🌍 Països implicats</span>
          <span class="info-value">{{ conflict.countries.length }}</span>
        </div>
        <div class="info-box">
          <span class="info-label">⚡ Estat</span>
          <span class="info-value" :class="conflict.status.toLowerCase()">
            {{ conflict.status === 'ACTIVE' ? 'ACTIU' : 'FINALITZAT' }}
          </span>
        </div>
      </div>

      <!-- DESCRIPCIÓ -->
      <div class="description-box">
        <h2>📋 Descripció del conflicte</h2>
        <p>{{ conflict.description }}</p>
      </div>

      <!-- MAPA -->
      <ConflictMap v-if="conflict.countries?.length" :countries="conflict.countries" />

      <!-- PAÏSOS -->
      <div class="countries-box">
        <h2>🌍 Països implicats</h2>
        <div class="countries-grid">
          <div
            v-for="country in conflict.countries"
            :key="country.id"
            class="country-card"
          >
            <img
              :src="getFlag(country.code)"
              :alt="country.name"
              class="country-flag"
            />
            <span class="country-name">{{ country.name }}</span>
            <span class="country-code">{{ country.code }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import ConflictMap from '../components/ConflictMap.vue'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConflictsStore } from '../stores/conflicts'

const route = useRoute()
const router = useRouter()
const store = useConflictsStore()

const iso3to2 = {
  ESP: 'es', ITA: 'it', USA: 'us', RUS: 'ru', JPN: 'jp',
  KOR: 'kr', FRA: 'fr', DEU: 'de', GBR: 'gb', CHN: 'cn',
  UKR: 'ua', SYR: 'sy', IRQ: 'iq', IRN: 'ir', SAU: 'sa',
  TUR: 'tr', BRA: 'br', ARG: 'ar', MEX: 'mx', IND: 'in',
  PAK: 'pk', AFG: 'af', NGA: 'ng', EGY: 'eg', ZAF: 'za',
  PRK: 'kp', ISR: 'il', PSE: 'ps', YEM: 'ye', LBY: 'ly',
  SDN: 'sd', SSD: 'ss', ETH: 'et', SOM: 'so', COD: 'cd',
  MMR: 'mm', PHL: 'ph', IDN: 'id', VNM: 'vn', THA: 'th',
  NOR: 'no', SWE: 'se', FIN: 'fi', DNK: 'dk', POL: 'pl',
  UZB: 'uz', KAZ: 'kz', AZE: 'az', ARM: 'am', GEO: 'ge',
}

function getFlag(code) {
  const iso2 = iso3to2[code?.toUpperCase()] || code?.toLowerCase()
  return `https://flagcdn.com/w80/${iso2}.png`
}

const conflict = computed(() => store.getConflictById(route.params.id))

onMounted(() => {
  if (store.conflicts.length === 0) {
    store.fetchConflicts()
  }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ca-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}
</script>

<style scoped>
.detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

.btn-back {
  background: transparent;
  border: 1px solid #1e293b;
  color: #64748b;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
  transition: all 0.2s;
}

.btn-back:hover {
  border-color: #38bdf8;
  color: #38bdf8;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem;
  gap: 1rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #1e293b;
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.not-found {
  text-align: center;
  color: #64748b;
  font-size: 1.5rem;
  padding: 4rem;
}

.detail-hero {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.detail-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px;
  height: 100%;
}

.detail-hero.active::before { background: #dc2626; }
.detail-hero.ended::before  { background: #16a34a; }

.hero-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.flags {
  display: flex;
  gap: 0.5rem;
}

.flag {
  width: 60px;
  border-radius: 6px;
  box-shadow: 0 4px 12px #00000050;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.3rem;
  letter-spacing: -0.5px;
}

.countries-list {
  color: #64748b;
  font-size: 0.95rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.badge.active { background: #dc262615; color: #f87171; border: 1px solid #dc262630; }
.badge.ended  { background: #16a34a15; color: #4ade80; border: 1px solid #16a34a30; }

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.badge.active .dot { animation: pulse 1.5s infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-box {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.8rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #f1f5f9;
}

.info-value.ongoing { color: #f87171; }
.info-value.active  { color: #f87171; }
.info-value.ended   { color: #4ade80; }

.description-box, .countries-box {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 12px;
  padding: 1.8rem;
  margin-bottom: 1.5rem;
}

.description-box h2, .countries-box h2 {
  font-size: 1rem;
  color: #38bdf8;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.description-box p {
  color: #64748b;
  line-height: 1.9;
  font-size: 1rem;
}

.countries-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.country-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: #060b18;
  border: 1px solid #1a2540;
  border-radius: 12px;
  padding: 1rem 1.5rem;
}

.country-flag {
  width: 60px;
  border-radius: 4px;
}

.country-name {
  font-size: 0.9rem;
  color: #f1f5f9;
  font-weight: 600;
}

.country-code {
  font-size: 0.75rem;
  color: #475569;
  background: #1e293b;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
}
</style>