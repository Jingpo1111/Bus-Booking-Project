<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { trips as routes } from '@/services/tripService'
import { useRoute, useRouter } from 'vue-router'
import '@/assets/styles/routes.css'

const route = useRoute()
const router = useRouter()

const cities = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampot', 'Kampong Cham']

const origin = ref('')
const destination = ref('')
const travelDate = ref('')
const selectedPrices = ref<string[]>([])
const selectedCompanies = ref<string[]>([])
const sortBy = ref('departure')
const error = ref('')

const companies = [...new Set(routes.map((r) => r.company))]

function readQuery(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

watch(
  () => route.query,
  (query) => {
    origin.value = readQuery(query.origin)
    destination.value = readQuery(query.destination)
    travelDate.value = readQuery(query.date)
  },
  { immediate: true },
)

function inPriceRange(price: number, range: string): boolean {
  switch (range) {
    case 'under10':
      return price < 10
    case '10to15':
      return price >= 10 && price <= 15
    case '15to20':
      return price > 15 && price <= 20
    case 'above20':
      return price > 20
    default:
      return true
  }
}

const filteredRoutes = computed(() => {
  const results = routes.filter((bus) => {
    const matchOrigin = !origin.value || bus.from === origin.value

    const matchDestination = !destination.value || bus.to === destination.value

    const matchPrice =
      selectedPrices.value.length === 0 ||
      selectedPrices.value.some((range) => inPriceRange(bus.price, range))

    const matchCompany =
      selectedCompanies.value.length === 0 || selectedCompanies.value.includes(bus.company)

    return matchOrigin && matchDestination && matchPrice && matchCompany
  })

  return [...results].sort((a, b) => {
    if (sortBy.value === 'price-low') {
      return a.price - b.price
    }
    if (sortBy.value === 'price-high') {
      return b.price - a.price
    }
    if (sortBy.value === 'duration') {
      const minutes = (value: string) => {
        const match = value.match(/(\d+)h\s*(\d+)m/)
        return match ? Number(match[1]) * 60 + Number(match[2]) : 0
      }
      return minutes(a.duration) - minutes(b.duration)
    }
    return a.departure.localeCompare(b.departure)
  })
})

function searchRoutes() {
  error.value = ''

  if (origin.value && destination.value && origin.value === destination.value) {
    error.value = 'Please select different cities.'
    return
  }

  if (travelDate.value && travelDate.value < new Date().toLocaleDateString('en-CA')) {
    error.value = 'Please select a valid future date.'
    return
  }

  router.push({
    path: '/trips',
    query: {
      ...(origin.value && { origin: origin.value }),
      ...(destination.value && { destination: destination.value }),
      ...(travelDate.value && { date: travelDate.value }),
    },
  })
}

function viewTrip(id: number) {
  router.push({ path: `/trips/${id}`, query: travelDate.value ? { date: travelDate.value } : {} })
}

function resetFilters() {
  origin.value = ''
  destination.value = ''
  travelDate.value = ''
  selectedPrices.value = []
  selectedCompanies.value = []
  error.value = ''
  router.push('/trips')
}
</script>

<template>
  <div class="routes-page">
    <!-- NAVBAR -->
    <header class="routes-navbar">
      <RouterLink to="/" class="routes-logo">
        <img src="/images/logo.png" alt="BookingBus Logo" />
      </RouterLink>

      <nav class="routes-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/trips">Routes</RouterLink>
        <RouterLink to="/my-bookings">My Bookings</RouterLink>
        <a href="#route-content">Help</a>
      </nav>

      <div class="routes-account">
        <RouterLink to="/login" class="routes-signin"> Sign In </RouterLink>
        <RouterLink to="/register" class="routes-signup"> Sign Up </RouterLink>
      </div>
    </header>

    <!-- HERO -->
    <section class="routes-hero">
      <div class="routes-hero-overlay">
        <div class="routes-hero-inner">
          <h1>Bus Routes</h1>
          <p>Explore popular bus routes across Cambodia.</p>
        </div>
      </div>
    </section>

    <main id="route-content" class="routes-main">
      <!-- BREADCRUMBS -->
      <div class="routes-breadcrumb">
        <RouterLink to="/">⌂ Home</RouterLink>
        <span>›</span>
        <strong>Routes</strong>
      </div>

      <div class="routes-layout">
        <!-- FILTER SIDEBAR -->
        <aside class="routes-filter">
          <h2>Filter Routes</h2>

          <form @submit.prevent="searchRoutes">
            <div class="routes-form-group">
              <label for="route-from">From</label>
              <select id="route-from" v-model="origin">
                <option value="">All departure cities</option>
                <option v-for="city in cities" :key="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="routes-form-group">
              <label for="route-to">To</label>
              <select id="route-to" v-model="destination">
                <option value="">All destinations</option>
                <option v-for="city in cities" :key="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="routes-form-group">
              <label for="route-date">Depart Date</label>
              <input id="route-date" v-model="travelDate" type="date" />
            </div>

            <p v-if="error" class="routes-error" role="alert">
              {{ error }}
            </p>

            <button type="submit" class="routes-search-btn">Search Routes</button>
          </form>

          <div class="routes-filter-divider"></div>

          <fieldset class="routes-filter-section">
            <legend>Price Range</legend>

            <label>
              <input v-model="selectedPrices" type="checkbox" value="under10" />
              Under $10
            </label>

            <label>
              <input v-model="selectedPrices" type="checkbox" value="10to15" />
              $10 – $15
            </label>

            <label>
              <input v-model="selectedPrices" type="checkbox" value="15to20" />
              $15 – $20
            </label>

            <label>
              <input v-model="selectedPrices" type="checkbox" value="above20" />
              Above $20
            </label>
          </fieldset>

          <div class="routes-filter-divider"></div>

          <fieldset class="routes-filter-section">
            <legend>Bus Company</legend>

            <label v-for="company in companies" :key="company">
              <input v-model="selectedCompanies" type="checkbox" :value="company" />
              {{ company }}
            </label>
          </fieldset>

          <button type="button" class="routes-reset-btn" @click="resetFilters">
            Reset Filters
          </button>
        </aside>

        <!-- RESULTS -->
        <section class="routes-results">
          <div class="routes-results-header">
            <h2>{{ filteredRoutes.length }} Routes Found</h2>

            <div class="routes-sort">
              <label for="sort-routes">Sort by:</label>
              <select id="sort-routes" v-model="sortBy">
                <option value="departure">Departure Time (Earliest)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="duration">Shortest Duration</option>
              </select>
            </div>
          </div>

          <!-- EMPTY STATE -->
          <div v-if="filteredRoutes.length === 0" class="routes-empty">
            <div class="routes-empty-icon">🚌</div>
            <h3>No routes found</h3>
            <p>Try changing your departure, destination, or price filters.</p>
            <button @click="resetFilters">Clear Filters</button>
          </div>

          <!-- ROUTE CARDS -->
          <div v-else class="routes-cards">
            <article v-for="bus in filteredRoutes" :key="bus.id" class="routes-card">
              <img :src="bus.image" :alt="`${bus.from} to ${bus.to}`" class="routes-card-image" />

              <div class="routes-card-info">
                <h3>
                  {{ bus.from }}
                  <span>→</span>
                  {{ bus.to }}
                </h3>

                <p class="routes-company">
                  {{ bus.company }}
                </p>

                <div class="routes-card-meta">
                  <span>🚌 {{ bus.type }} ({{ bus.seats }} seats)</span>
                  <span>◷ {{ bus.duration }}</span>
                  <span>{{ bus.departure }}</span>
                </div>
              </div>

              <div class="routes-card-action">
                <div class="routes-price">
                  <strong>${{ bus.price }}</strong>
                  <span>per seat</span>
                </div>

                <button @click="viewTrip(bus.id)">View Trips →</button>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>

    <footer class="routes-footer">© 2026 BookingBus. All rights reserved.</footer>
  </div>
</template>
