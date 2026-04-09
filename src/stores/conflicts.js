import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConflictsStore = defineStore('conflicts', () => {
  const conflicts = ref([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref(null)

  const filteredConflicts = computed(() => {
    return conflicts.value.filter(c =>
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.countries?.some(country =>
        country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )
  })

  const totalActive = computed(() =>
    conflicts.value.filter(c => c.status === 'ACTIVE').length
  )

  const totalEnded = computed(() =>
    conflicts.value.filter(c => c.status === 'ENDED').length
  )

  const conflictsByStatus = computed(() => {
    const result = {}
    conflicts.value.forEach(c => {
      result[c.status] = (result[c.status] || 0) + 1
    })
    return result
  })

  const conflictsByRegion = computed(() => {
    const result = {}
    conflicts.value.forEach(c => {
      const region = c.region || 'Desconeguda'
      result[region] = (result[region] || 0) + 1
    })
    return result
  })

  async function fetchConflicts() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch('http://localhost:8080/api/v1/conflicts')
      if (!res.ok) throw new Error('Error del servidor')
      conflicts.value = await res.json()
    } catch (e) {
      error.value = 'Error carregant els conflictes. Comprova que l\'API està activa.'
    } finally {
      loading.value = false
    }
  }

  function getConflictById(id) {
    return conflicts.value.find(c => c.id === parseInt(id))
  }

  return {
    conflicts,
    searchQuery,
    loading,
    error,
    filteredConflicts,
    totalActive,
    totalEnded,
    conflictsByStatus,
    conflictsByRegion,
    fetchConflicts,
    getConflictById
  }
})