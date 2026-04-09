<template>
  <BaseCard title="Conflictes per Regió">
    <template #header-action>
      <span class="total-badge">{{ total }} total</span>
    </template>

    <div class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <template #footer>
      <div class="legend">
        <div
          v-for="(item, index) in legendItems"
          :key="item.label"
          class="legend-item"
        >
          <span class="legend-dot" :style="{ background: colors[index] }"></span>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ item.value }}</span>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import BaseCard from './BaseCard.vue'
import { useConflictsStore } from '../stores/conflicts'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const store = useConflictsStore()
const chartCanvas = ref(null)
let chartInstance = null

const colors = ['#38bdf8', '#f87171', '#4ade80', '#fb923c', '#a78bfa', '#fbbf24']

const legendItems = computed(() =>
  Object.entries(store.conflictsByRegion ?? {}).map(([label, value]) => ({ label, value }))
)

const total = computed(() => store.conflicts.length)

function renderChart() {
  const entries = store.conflictsByRegion ?? {}
  const labels = Object.keys(entries)
  const data = Object.values(entries)

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw} conflictes`
          }
        }
      }
    }
  })
}

onMounted(() => {
  if (store.conflicts.length > 0) renderChart()
})

watch(() => store.conflicts, () => {
  renderChart()
}, { deep: true })
</script>

<style scoped>
.chart-wrapper {
  max-width: 220px;
  margin: 0 auto;
  padding: 1rem 0;
}

.total-badge {
  font-size: 0.75rem;
  background: #1e293b;
  color: #64748b;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  color: #94a3b8;
}

.legend-value {
  color: #f1f5f9;
  font-weight: 600;
}
</style>