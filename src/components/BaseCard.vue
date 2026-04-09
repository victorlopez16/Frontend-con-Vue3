<template>
  <div class="base-card">
    <div v-if="title" class="base-card-header">
      <span class="base-card-title">{{ title }}</span>
      <slot name="header-action" />
    </div>
    <div class="base-card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="base-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.base-card {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 16px;
  overflow: hidden;
}

.base-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #1a2540;
}

.base-card-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.base-card-body {
  padding: 1.5rem;
}

.base-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #1a2540;
  background: #060b18;
}
</style>