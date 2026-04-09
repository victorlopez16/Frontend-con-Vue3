<template>
  <BaseCard
    :status="conflict.status.toLowerCase()"
    :clickable="true"
    @click="$emit('view-detail', conflict.id)"
  >
    <!-- HEADER slot -->
    <template #header>
      <div class="meta">
        <div class="flags">
          <img
            v-for="(country, index) in conflict.countries"
            :key="index"
            :src="getFlag(country.code)"
            :alt="country.name"
            class="flag"
          />
        </div>
        <div class="countries-names">
          <span v-for="(country, index) in conflict.countries" :key="index">
            {{ country.name }}<span v-if="index < conflict.countries.length - 1"> vs </span>
          </span>
        </div>
      </div>
      <span class="badge" :class="conflict.status.toLowerCase()">
        <span class="dot"></span>
        {{ conflict.status === 'ACTIVE' ? 'Actiu' : 'Finalitzat' }}
      </span>
    </template>

    <!-- DEFAULT slot: cos de la card -->
    <h2>{{ conflict.name }}</h2>
    <p class="desc">{{ conflict.description.slice(0, 110) }}...</p>

    <!-- FOOTER slot -->
    <template #footer>
      <div class="pills">
        <span class="pill">📅 {{ formatDate(conflict.startDate) }}</span>
        <span v-if="conflict.endDate" class="pill ended">🏁 {{ formatDate(conflict.endDate) }}</span>
        <span v-else class="pill active-pill">🔴 En curs</span>
      </div>
      <span class="arrow">→</span>
    </template>
  </BaseCard>
</template>

<script setup>
import BaseCard from './BaseCard.vue'

defineProps({
  conflict: { type: Object, required: true }
})

defineEmits(['view-detail'])

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
  PRT: 'pt', NLD: 'nl', BEL: 'be', CHE: 'ch', AUT: 'at',
  GRC: 'gr', HRV: 'hr', SRB: 'rs', BIH: 'ba', MKD: 'mk',
  ALB: 'al', BGR: 'bg', ROU: 'ro', HUN: 'hu', SVK: 'sk',
  CZE: 'cz', LTU: 'lt', LVA: 'lv', EST: 'ee', BLR: 'by',
  MDA: 'md', LBN: 'lb', JOR: 'jo', KWT: 'kw', QAT: 'qa',
  ARE: 'ae', OMN: 'om', BHR: 'bh', CAN: 'ca', AUS: 'au',
  NZL: 'nz', MAR: 'ma', DZA: 'dz', TUN: 'tn', SEN: 'sn',
}

function getFlag(code) {
  if (!code) return ''
  const upper = code.toUpperCase()
  // Si és ISO3 (3 lletres), converteix a ISO2
  const iso2 = upper.length === 3
    ? (iso3to2[upper] || upper.slice(0, 2).toLowerCase())
    : upper.toLowerCase()
  return `https://flagcdn.com/w40/${iso2}.png`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ca-ES', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
.meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.flags {
  display: flex;
  gap: 0.3rem;
}

.flag {
  width: 28px;
  border-radius: 3px;
  box-shadow: 0 2px 4px #00000040;
}

.countries-names {
  font-size: 0.8rem;
  color: #64748b;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  white-space: nowrap;
}

.badge.active { background: #dc262615; color: #f87171; }
.badge.ended  { background: #16a34a15; color: #4ade80; }
.badge.frozen { background: #38bdf815; color: #38bdf8; }

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.badge.active .dot { animation: pulse 1.5s infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

h2 {
  font-size: 1.15rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 0.3rem;
}

.desc {
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.6;
}

.pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pill {
  font-size: 0.75rem;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  background: #1e293b;
  color: #64748b;
}

.pill.active-pill { background: #dc262615; color: #f87171; }
.pill.ended       { background: #16a34a15; color: #4ade80; }

.arrow {
  color: #334155;
  font-size: 1.2rem;
  transition: color 0.2s, transform 0.2s;
}

.base-card:hover .arrow {
  color: #38bdf8;
  transform: translateX(4px);
}
</style>