<template>
  <div class="map-box">
    <h2>🗺️ Localització del conflicte</h2>
    <div id="conflict-map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  countries: {
    type: Array,
    required: true
  }
})

const mapContainer = ref(null)
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
}

function getCode2(code) {
  return (iso3to2[code?.toUpperCase()] || code?.toLowerCase() || '').toUpperCase()
}

const countryCoordsMap = {
  UA: [48.3794, 31.1656], RU: [61.5240, 105.3188], SY: [34.8021, 38.9968],
  IL: [31.0461, 34.8516], PS: [31.9522, 35.2332], IQ: [33.2232, 43.6793],
  YE: [15.5527, 48.5164], AF: [33.9391, 67.7100], SD: [12.8628, 30.2176],
  SS: [6.8770, 31.3070], ET: [9.1450, 40.4897], ML: [17.5707, -3.9962],
  CF: [6.6111, 20.9394], CD: [-4.0383, 21.7587], SO: [5.1521, 46.1996],
  LY: [26.3351, 17.2283], MM: [21.9162, 95.9560], CN: [35.8617, 104.1954],
  TW: [23.6978, 120.9605], KP: [40.3399, 127.5101], KR: [35.9078, 127.7669],
  IN: [20.5937, 78.9629], PK: [30.3753, 69.3451], IR: [32.4279, 53.6880],
  US: [37.0902, -95.7129], FR: [46.2276, 2.2137], DE: [51.1657, 10.4515],
  GB: [55.3781, -3.4360], TR: [38.9637, 35.2433], SA: [23.8859, 45.0792],
  AZ: [40.1431, 47.5769], AM: [40.0691, 45.0382], GE: [42.3154, 43.3569],
  RS: [44.0165, 21.0059], BA: [43.9159, 17.6791], XK: [42.6026, 20.9030],
  MX: [23.6345, -102.5528], VE: [6.4238, -66.5897], CO: [4.5709, -74.2973],
  BR: [14.2350, -51.9253], AR: [-38.4161, -63.6167], CL: [-35.6751, -71.5430],
  NG: [9.0820, 8.6753], GH: [7.9465, -1.0232], KE: [-0.0236, 37.9062],
  ZA: [-30.5595, 22.9375], MA: [31.7917, -7.0926], DZ: [28.0339, 1.6596],
  EG: [26.8206, 30.8025], MZ: [-18.6657, 35.5296], TZ: [-6.3690, 34.8888],
  UG: [1.3733, 32.2903], RW: [-1.9403, 29.8739], BI: [-3.3731, 29.9189],
  CM: [3.8480, 11.5021], GN: [9.9456, -11.2012], BF: [12.3641, -1.5337],
  NE: [17.6078, 8.0817], TD: [15.4542, 18.7322], MR: [21.0079, -10.9408],
  ZW: [-19.0154, 29.1549], AO: [-11.2027, 17.8739],
  LB: [33.8547, 35.8623], JO: [30.5852, 36.2384], KW: [29.3117, 47.4818],
  QA: [25.3548, 51.1839], AE: [23.4241, 53.8478], OM: [21.4735, 55.9754],
  BH: [26.0667, 50.5577], LK: [7.8731, 80.7718], NP: [28.3949, 84.1240],
  BD: [23.6850, 90.3563], TH: [15.8700, 100.9925], PH: [12.8797, 121.7740],
  ID: [-0.7893, 113.9213], VN: [14.0583, 108.2772], KH: [12.5657, 104.9910],
  MN: [46.8625, 103.8467], KZ: [48.0196, 66.9237], UZ: [41.3775, 64.5853],
  TM: [38.9697, 59.5563], TJ: [38.8610, 71.2761], KG: [41.2044, 74.7661],
  MD: [47.4116, 28.3699], BY: [53.7098, 27.9534],
  PL: [51.9194, 19.1451], RO: [45.9432, 24.9668],
  HU: [47.1625, 19.5033], SK: [48.6690, 19.6990], CZ: [49.8175, 15.4730],
  HR: [45.1000, 15.2000], SI: [46.1512, 14.9955], ME: [42.7087, 19.3744],
  MK: [41.6086, 21.7453], AL: [41.1533, 20.1683], BG: [42.7339, 25.4858],
  GR: [39.0742, 21.8243], CY: [35.1264, 33.4299], ES: [40.4637, -3.7492],
  PT: [39.3999, -8.2245], IT: [41.8719, 12.5674], NL: [52.1326, 5.2913],
  BE: [50.5039, 4.4699], LU: [49.8153, 6.1296], AT: [47.5162, 14.5501],
  CH: [46.8182, 8.2275], DK: [56.2639, 9.5018], NO: [60.4720, 8.4689],
  SE: [60.1282, 18.6435], FI: [61.9241, 25.7482], EE: [58.5953, 25.0136],
  LV: [56.8796, 24.6032], LT: [55.1694, 23.8813],
  JP: [36.2048, 138.2529],
}

function initMap() {
  if (!mapContainer.value) return
  if (mapInstance) {
    mapInstance.remove()
    mapInstance = null
  }

  const validCountries = props.countries.filter(c => countryCoordsMap[getCode2(c.code)])

  if (validCountries.length === 0) return

  const coords = validCountries.map(c => countryCoordsMap[getCode2(c.code)])

  mapInstance = L.map(mapContainer.value, {
    zoomControl: true,
    scrollWheelZoom: false,
  })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    maxZoom: 10,
  }).addTo(mapInstance)

  validCountries.forEach(country => {
    const code2 = getCode2(country.code)
    const latlng = countryCoordsMap[code2]
    const marker = L.circleMarker(latlng, {
      radius: 10,
      fillColor: '#f87171',
      color: '#dc2626',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(mapInstance)

    marker.bindPopup(`
      <div style="text-align:center; font-family: Inter, sans-serif;">
        <img src="https://flagcdn.com/w40/${code2.toLowerCase()}.png"
             style="border-radius:4px; margin-bottom:4px;" /><br/>
        <strong style="color:#1e293b">${country.name}</strong><br/>
        <small style="color:#64748b">${country.code}</small>
      </div>
    `)
  })

  if (coords.length === 1) {
    mapInstance.setView(coords[0], 5)
  } else {
    const bounds = L.latLngBounds(coords)
    mapInstance.fitBounds(bounds, { padding: [50, 50] })
  }
}

onMounted(() => {
  setTimeout(() => initMap(), 100)
})

onUnmounted(() => {
  if (mapInstance) mapInstance.remove()
})

watch(() => props.countries, () => {
  setTimeout(() => initMap(), 100)
}, { deep: true })
</script>

<style scoped>
.map-box {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 12px;
  padding: 1.8rem;
  margin-bottom: 1.5rem;
}

.map-box h2 {
  font-size: 1rem;
  color: #38bdf8;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

#conflict-map {
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #1a2540;
  z-index: 0;
}
</style>