<template>
  <div class="create">

    <div class="create-header">
      <button class="btn-back" @click="router.push('/')">← Tornar</button>
      <div class="header-text">
        <h1>🛰️ Nou Registre de Conflicte</h1>
        <p>Omple tots els camps per afegir un nou conflicte al sistema</p>
      </div>
    </div>

    <div class="create-layout">

      <!-- ── FORMULARI ── -->
      <div class="form-panel">

        <!-- Nom -->
        <div class="field">
          <label>📌 Nom del conflicte</label>
          <input v-model="form.name" type="text" placeholder="Ex: Guerra Rússia-Ucraïna" />
        </div>

        <!-- Descripció -->
        <div class="field">
          <label>📋 Descripció</label>
          <textarea v-model="form.description" rows="4" placeholder="Descriu el conflicte..."></textarea>
        </div>

        <!-- Regió -->
        <div class="field">
          <label>🌍 Regió</label>
          <select v-model="form.region">
            <option value="">Selecciona una regió...</option>
            <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <!-- Estat -->
        <div class="field">
          <label>⚡ Estat</label>
          <div class="status-options">
            <button
              v-for="s in statuses"
              :key="s.value"
              class="status-btn"
              :class="{ active: form.status === s.value, [s.value.toLowerCase()]: true }"
              @click="form.status = s.value"
            >
              <span class="status-dot"></span>
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- Dates -->
        <div class="fields-row">
          <div class="field">
            <label>📅 Data d'inici</label>
            <input v-model="form.startDate" type="date" />
          </div>
          <div class="field">
            <label>🏁 Data de fi <span class="optional">(opcional)</span></label>
            <input v-model="form.endDate" type="date" />
          </div>
        </div>

        <!-- Països -->
        <div class="field">
          <label>🏳️ Països implicats</label>
          <div class="country-input-row">
            <input
              v-model="countryInput.name"
              type="text"
              placeholder="Nom del país (ex: Espanya)"
              @input="onCountryNameInput"
            />
            <input
              v-model="countryInput.code"
              type="text"
              placeholder="Codi ISO (ex: ES)"
              maxlength="3"
              style="text-transform:uppercase"
              @input="countryInput.code = countryInput.code.toUpperCase()"
            />
            <div class="flag-preview" v-if="flagPreviewUrl">
              <img :src="flagPreviewUrl" :alt="countryInput.name" />
            </div>
            <button class="btn-add-country" @click="addCountry" :disabled="!countryInput.name || !countryInput.code">
              + Afegir
            </button>
          </div>

          <!-- Llista de països afegits -->
          <div class="countries-added" v-if="form.countries.length > 0">
            <div class="country-tag" v-for="(c, i) in form.countries" :key="i">
              <img :src="getFlag(c.code)" :alt="c.name" class="tag-flag" />
              <span>{{ c.name }}</span>
              <span class="tag-code">{{ c.code }}</span>
              <button class="tag-remove" @click="removeCountry(i)">✕</button>
            </div>
          </div>
        </div>

        <!-- Errors i submit -->
        <div class="form-error" v-if="formError">⚠️ {{ formError }}</div>

        <div class="form-actions">
          <button class="btn-cancel" @click="router.push('/')">Cancel·lar</button>
          <button class="btn-submit" @click="submitForm" :disabled="submitting">
            <span v-if="submitting">⏳ Guardant...</span>
            <span v-else>🛰️ Crear Conflicte</span>
          </button>
        </div>

        <!-- Èxit -->
        <div class="success-msg" v-if="successMsg">
          ✅ {{ successMsg }}
        </div>

      </div>

      <!-- ── PREVIEW ── -->
      <div class="preview-panel">
        <div class="preview-label">PREVISUALITZACIÓ EN TEMPS REAL</div>

        <!-- Banderes preview -->
        <div class="preview-flags" v-if="form.countries.length > 0">
          <img
            v-for="(c, i) in form.countries"
            :key="i"
            :src="getFlag(c.code)"
            :alt="c.name"
            class="preview-flag"
          />
        </div>
        <div class="preview-no-flags" v-else>
          <span>Afegeix països per veure les banderes</span>
        </div>

        <h2 class="preview-name">{{ form.name || 'Nom del conflicte' }}</h2>
        <p class="preview-region">🌍 {{ form.region || 'Regió no definida' }}</p>

        <div class="preview-badges">
          <span class="preview-badge" :class="form.status.toLowerCase()">
            <span class="dot"></span>
            {{ form.status === 'ACTIVE' ? 'Actiu' : form.status === 'ENDED' ? 'Finalitzat' : 'Congelat' }}
          </span>
          <span class="preview-date" v-if="form.startDate">📅 {{ formatDate(form.startDate) }}</span>
        </div>

        <p class="preview-desc">{{ form.description || 'La descripció apareixerà aquí...' }}</p>

        <!-- Mapa preview -->
        <div class="map-preview-box">
          <div class="map-label">🗺️ MAPA DEL CONFLICTE</div>
          <div ref="mapPreviewContainer" class="map-preview"></div>
          <p class="map-hint" v-if="form.countries.length === 0">Afegeix països per veure el mapa</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()

const regions = ['Europa', 'Àsia', 'Àfrica', 'Amèrica', 'Orient Mitjà', 'Àrtic', 'Global']
const statuses = [
  { value: 'ACTIVE', label: 'Actiu' },
  { value: 'ENDED', label: 'Finalitzat' },
  { value: 'FROZEN', label: 'Congelat' },
]

const form = ref({
  name: '',
  description: '',
  region: '',
  status: 'ACTIVE',
  startDate: '',
  endDate: '',
  countries: []
})

const countryInput = ref({ name: '', code: '' })
const flagPreviewUrl = ref('')
const formError = ref('')
const successMsg = ref('')
const submitting = ref(false)
const mapPreviewContainer = ref(null)
let mapInstance = null

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

const countryCoordsMap = {
  ES: [40.4637, -3.7492], IT: [41.8719, 12.5674], US: [37.0902, -95.7129],
  RU: [61.5240, 105.3188], JP: [36.2048, 138.2529], KR: [35.9078, 127.7669],
  FR: [46.2276, 2.2137], DE: [51.1657, 10.4515], GB: [55.3781, -3.4360],
  CN: [35.8617, 104.1954], UA: [48.3794, 31.1656], SY: [34.8021, 38.9968],
  IQ: [33.2232, 43.6793], IR: [32.4279, 53.6880], SA: [23.8859, 45.0792],
  TR: [38.9637, 35.2433], BR: [14.2350, -51.9253], AR: [-38.4161, -63.6167],
  MX: [23.6345, -102.5528], IN: [20.5937, 78.9629], PK: [30.3753, 69.3451],
  AF: [33.9391, 67.7100], NG: [9.0820, 8.6753], EG: [26.8206, 30.8025],
  ZA: [-30.5595, 22.9375], KP: [40.3399, 127.5101], IL: [31.0461, 34.8516],
  PS: [31.9522, 35.2332], YE: [15.5527, 48.5164], LY: [26.3351, 17.2283],
  SD: [12.8628, 30.2176], SS: [6.8770, 31.3070], ET: [9.1450, 40.4897],
  SO: [5.1521, 46.1996], CD: [-4.0383, 21.7587], MM: [21.9162, 95.9560],
  PH: [12.8797, 121.7740], ID: [-0.7893, 113.9213], VN: [14.0583, 108.2772],
  TH: [15.8700, 100.9925], NO: [60.4720, 8.4689], SE: [60.1282, 18.6435],
  FI: [61.9241, 25.7482], DK: [56.2639, 9.5018], PL: [51.9194, 19.1451],
  PT: [39.3999, -8.2245], NL: [52.1326, 5.2913], BE: [50.5039, 4.4699],
  CH: [46.8182, 8.2275], AT: [47.5162, 14.5501], GR: [39.0742, 21.8243],
  RO: [45.9432, 24.9668], HU: [47.1625, 19.5033], CZ: [49.8175, 15.4730],
  SK: [48.6690, 19.6990], HR: [45.1000, 15.2000], RS: [44.0165, 21.0059],
  BG: [42.7339, 25.4858], AL: [41.1533, 20.1683], MK: [41.6086, 21.7453],
  BA: [43.9159, 17.6791], ME: [42.7087, 19.3744], LT: [55.1694, 23.8813],
  LV: [56.8796, 24.6032], EE: [58.5953, 25.0136], BY: [53.7098, 27.9534],
  MD: [47.4116, 28.3699], GE: [42.3154, 43.3569], AM: [40.0691, 45.0382],
  AZ: [40.1431, 47.5769], KZ: [48.0196, 66.9237], UZ: [41.3775, 64.5853],
  LB: [33.8547, 35.8623], JO: [30.5852, 36.2384], KW: [29.3117, 47.4818],
  QA: [25.3548, 51.1839], AE: [23.4241, 53.8478], MA: [31.7917, -7.0926],
  DZ: [28.0339, 1.6596], TN: [33.8869, 9.5375], ML: [17.5707, -3.9962],
  GH: [7.9465, -1.0232], KE: [-0.0236, 37.9062], CA: [56.1304, -106.3468],
  AU: [-25.2744, 133.7751], CL: [-35.6751, -71.5430], CO: [4.5709, -74.2973],
}

function getFlag(code) {
  if (!code) return ''
  const upper = code.toUpperCase()
  const iso2 = upper.length === 3
    ? (iso3to2[upper] || upper.slice(0, 2).toLowerCase())
    : upper.toLowerCase()
  return `https://flagcdn.com/w40/${iso2}.png`
}

function getCode2(code) {
  if (!code) return ''
  const upper = code.toUpperCase()
  return upper.length === 3
    ? (iso3to2[upper] || upper.slice(0, 2)).toUpperCase()
    : upper
}

function onCountryNameInput() {}

watch(() => countryInput.value.code, (code) => {
  if (code && code.length >= 2) {
    const iso2 = getFlag(code).split('/').pop().replace('.png', '')
    flagPreviewUrl.value = `https://flagcdn.com/w40/${iso2}.png`
  } else {
    flagPreviewUrl.value = ''
  }
})

function addCountry() {
  if (!countryInput.value.name || !countryInput.value.code) return
  form.value.countries.push({
    name: countryInput.value.name,
    code: countryInput.value.code.toUpperCase()
  })
  countryInput.value = { name: '', code: '' }
  flagPreviewUrl.value = ''
  nextTick(() => updateMap())
}

function removeCountry(index) {
  form.value.countries.splice(index, 1)
  nextTick(() => updateMap())
}

function updateMap() {
  if (!mapPreviewContainer.value) return
  if (mapInstance) { mapInstance.remove(); mapInstance = null }

  const validCountries = form.value.countries.filter(c => countryCoordsMap[getCode2(c.code)])
  if (validCountries.length === 0) return

  const coords = validCountries.map(c => countryCoordsMap[getCode2(c.code)])

  mapInstance = L.map(mapPreviewContainer.value, { zoomControl: true, scrollWheelZoom: false })
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO', maxZoom: 10,
  }).addTo(mapInstance)

  validCountries.forEach(country => {
    const code2 = getCode2(country.code)
    const latlng = countryCoordsMap[code2]
    L.circleMarker(latlng, {
      radius: 10, fillColor: '#f87171', color: '#dc2626',
      weight: 2, opacity: 1, fillOpacity: 0.8,
    }).addTo(mapInstance).bindPopup(`
      <div style="text-align:center;font-family:Inter,sans-serif;">
        <img src="https://flagcdn.com/w40/${code2.toLowerCase()}.png" style="border-radius:4px;margin-bottom:4px;"/><br/>
        <strong style="color:#1e293b">${country.name}</strong>
      </div>
    `)
  })

  if (coords.length === 1) {
    mapInstance.setView(coords[0], 5)
  } else {
    mapInstance.fitBounds(L.latLngBounds(coords), { padding: [40, 40] })
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

async function submitForm() {
  formError.value = ''
  successMsg.value = ''

  if (!form.value.name) return (formError.value = 'El nom és obligatori.')
  if (!form.value.description) return (formError.value = 'La descripció és obligatòria.')
  if (!form.value.region) return (formError.value = 'Selecciona una regió.')
  if (!form.value.startDate) return (formError.value = 'La data d\'inici és obligatòria.')
  if (form.value.countries.length === 0) return (formError.value = 'Afegeix almenys un país.')

  submitting.value = true
  try {
    const payload = {
      name: form.value.name,
      description: form.value.description,
      region: form.value.region,
      status: form.value.status,
      startDate: form.value.startDate,
      endDate: form.value.endDate || null,
      countries: form.value.countries.map(c => ({
        name: c.name,
        code: c.code
      }))
    }

    const res = await fetch('http://localhost:8080/api/v1/conflicts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('Error del servidor')

    successMsg.value = 'Conflicte creat correctament!'
    setTimeout(() => router.push('/'), 1500)
  } catch (e) {
    formError.value = 'Error en crear el conflicte. Comprova que l\'API està activa.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  setTimeout(() => updateMap(), 200)
})

onUnmounted(() => {
  if (mapInstance) mapInstance.remove()
})
</script>

<style scoped>
.create {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

.create-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
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
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-back:hover { border-color: #38bdf8; color: #38bdf8; }

.header-text h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f1f5f9;
}

.header-text p {
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 0.3rem;
}

.create-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-panel {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-size: 0.82rem;
  color: #38bdf8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.optional {
  color: #475569;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}

.field input,
.field textarea,
.field select {
  background: #060b18;
  border: 1px solid #1a2540;
  border-radius: 8px;
  color: #f1f5f9;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}

.field input:focus,
.field textarea:focus,
.field select:focus { border-color: #38bdf8; }

.field select option { background: #0d1526; }

.fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.status-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  border: 1px solid #1a2540;
  background: #060b18;
  color: #64748b;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.status-btn .status-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.status-btn.active.active   { background: #dc262615; color: #f87171; border-color: #dc262640; }
.status-btn.active.ended    { background: #16a34a15; color: #4ade80; border-color: #16a34a40; }
.status-btn.active.frozen   { background: #38bdf815; color: #38bdf8; border-color: #38bdf840; }

.country-input-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.country-input-row input {
  flex: 1;
  min-width: 120px;
  background: #060b18;
  border: 1px solid #1a2540;
  border-radius: 8px;
  color: #f1f5f9;
  padding: 0.65rem 0.9rem;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

.country-input-row input:focus { border-color: #38bdf8; }

.flag-preview img {
  width: 36px;
  border-radius: 4px;
  box-shadow: 0 2px 8px #00000060;
}

.btn-add-country {
  background: #38bdf820;
  border: 1px solid #38bdf840;
  color: #38bdf8;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-add-country:hover { background: #38bdf830; }
.btn-add-country:disabled { opacity: 0.4; cursor: not-allowed; }

.countries-added {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.country-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #1e293b;
  border: 1px solid #2d3f5a;
  border-radius: 20px;
  padding: 0.3rem 0.7rem;
  font-size: 0.82rem;
  color: #f1f5f9;
}

.tag-flag { width: 20px; border-radius: 2px; }
.tag-code { color: #475569; font-size: 0.75rem; }

.tag-remove {
  background: none;
  border: none;
  color: #475569;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0;
  margin-left: 0.2rem;
  transition: color 0.2s;
}

.tag-remove:hover { color: #f87171; }

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #1e293b;
  color: #64748b;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-cancel:hover { border-color: #64748b; color: #f1f5f9; }

.btn-submit {
  background: linear-gradient(135deg, #dc2626, #e63946);
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(230,57,70,0.3);
}

.btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(230,57,70,0.4); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.form-error {
  background: #dc262615;
  border: 1px solid #dc262640;
  color: #f87171;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.success-msg {
  background: #16a34a15;
  border: 1px solid #16a34a40;
  color: #4ade80;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.preview-panel {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 100px;
}

.preview-label {
  font-size: 0.7rem;
  color: #38bdf8;
  letter-spacing: 0.15em;
  font-weight: 600;
  text-transform: uppercase;
  border-bottom: 1px solid #1a2540;
  padding-bottom: 0.75rem;
}

.preview-flags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preview-flag {
  width: 48px;
  border-radius: 6px;
  box-shadow: 0 4px 12px #00000050;
}

.preview-no-flags {
  color: #334155;
  font-size: 0.82rem;
  font-style: italic;
}

.preview-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
}

.preview-region {
  color: #64748b;
  font-size: 0.9rem;
}

.preview-badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.preview-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
}

.preview-badge.active { background: #dc262615; color: #f87171; border: 1px solid #dc262630; }
.preview-badge.ended  { background: #16a34a15; color: #4ade80; border: 1px solid #16a34a30; }
.preview-badge.frozen { background: #38bdf815; color: #38bdf8; border: 1px solid #38bdf830; }

.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.preview-date {
  font-size: 0.82rem;
  color: #64748b;
}

.preview-desc {
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.7;
  font-style: italic;
}

.map-preview-box { margin-top: 0.5rem; }

.map-label {
  font-size: 0.7rem;
  color: #38bdf8;
  letter-spacing: 0.15em;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.map-preview {
  height: 250px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #1a2540;
}

.map-hint {
  color: #334155;
  font-size: 0.8rem;
  text-align: center;
  margin-top: 0.5rem;
  font-style: italic;
}

@media (max-width: 900px) {
  .create-layout { grid-template-columns: 1fr; }
  .preview-panel { position: static; }
  .fields-row { grid-template-columns: 1fr; }
}
</style>