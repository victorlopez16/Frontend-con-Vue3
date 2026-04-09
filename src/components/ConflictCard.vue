<template>
  <div class="card" :class="conflict.status.toLowerCase()" @click="$emit('view-detail', conflict.id)">

    <div class="card-top">
      <div class="meta">
        <div class="flags">
          <img
            v-for="country in conflict.countries"
            :key="country.id"
            :src="`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`"
            :alt="country.name"
            class="flag"
          />
        </div>
        <div class="countries-names">
          <span v-for="(country, index) in conflict.countries" :key="country.id">
            {{ country.name }}<span v-if="index < conflict.countries.length - 1"> vs </span>
          </span>
        </div>
      </div>
      <span class="badge" :class="conflict.status.toLowerCase()">
        <span class="dot"></span>
        {{ conflict.status === 'ACTIVE' ? 'Actiu' : 'Finalitzat' }}
      </span>
    </div>

    <div class="card-body">
      <h2>{{ conflict.name }}</h2>
      <p class="desc">{{ conflict.description.slice(0, 110) }}...</p>
    </div>

    <div class="card-bottom">
      <div class="pills">
        <span class="pill date">📅 {{ formatDate(conflict.startDate) }}</span>
        <span v-if="conflict.endDate" class="pill ended">🏁 {{ formatDate(conflict.endDate) }}</span>
        <span v-else class="pill active-pill">🔴 En curs</span>
      </div>
      <span class="arrow">→</span>
    </div>

  </div>
</template>

<script setup>
defineProps({
  conflict: { type: Object, required: true }
})

defineEmits(['view-detail'])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ca-ES', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
.card {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px;
  height: 100%;
}

.card.active::before { background: #dc2626; }
.card.ended::before  { background: #16a34a; }

.card:hover {
  transform: translateY(-5px);
  border-color: #38bdf820;
  box-shadow: 0 20px 40px #00000040;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #1e293b;
  padding-top: 1rem;
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

.card:hover .arrow {
  color: #38bdf8;
  transform: translateX(4px);
}
</style>