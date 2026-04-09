<template>
  <div class="base-card" :class="[status, { clickable }]" @click="clickable ? $emit('click') : null">
    <!-- Línia de color lateral segons estat -->
    <div class="status-bar" :class="status"></div>

    <!-- HEADER slot: contingut de capçalera opcional -->
    <div v-if="$slots.header" class="base-card-header">
      <slot name="header" />
    </div>

    <!-- DEFAULT slot: contingut principal -->
    <div class="base-card-body">
      <slot />
    </div>

    <!-- FOOTER slot: contingut de peu opcional -->
    <div v-if="$slots.footer" class="base-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'active' // 'active' | 'ended' | 'frozen'
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.base-card {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.base-card.clickable {
  cursor: pointer;
}

.base-card.clickable:hover {
  transform: translateY(-5px);
  border-color: #38bdf820;
  box-shadow: 0 20px 40px #00000040;
}

.status-bar {
  position: absolute;
  top: 0; left: 0;
  width: 3px;
  height: 100%;
}

.status-bar.active  { background: #dc2626; }
.status-bar.ended   { background: #16a34a; }
.status-bar.frozen  { background: #38bdf8; }

.base-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.base-card-footer {
  border-top: 1px solid #1e293b;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>  