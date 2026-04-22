<template>
  <div style="max-width: 800px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e0e0e0; background-color: #1a1a1a; min-height: 100vh; padding: 20px;">
    <h1 style="text-align: center; color: #42b883;">🚀 Conflict Tracker</h1>
    
    <div v-if="loading" style="text-align: center;">Cargando datos desde Railway...</div>
    
    <div v-else>
      <div v-for="c in conflicts" :key="c.id" style="border: 1px solid #444; border-radius: 8px; padding: 15px; margin-bottom: 15px; background-color: #242424; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
        <h3 style="margin-top: 0; color: #646cff;">{{ c.name }}</h3>
        <p><strong>Estado:</strong> {{ c.status }}</p>
        <p v-if="c.region"><strong>Región:</strong> {{ c.region }}</p>
        <p style="font-size: 0.9em; color: #bbb;">{{ c.description }}</p>
        <small style="color: #777;">Fecha de inicio: {{ c.startDate }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const conflicts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Asegúrate de que la URL de Railway esté bien en tu .env
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/conflicts`)
    conflicts.value = response.data
    console.log("Datos recibidos:", response.data) // Para que veas en la consola qué llega
  } catch (error) {
    console.error("Error cargando conflictos:", error)
  } finally {
    loading.value = false
  }
})
</script>