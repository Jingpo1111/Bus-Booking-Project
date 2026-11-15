<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/home.css'

const router = useRouter()

const cities = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampot', 'Kampong Cham']

const origin = ref('Phnom Penh')
const destination = ref('Siem Reap')
const travelDate = ref('')
const error = ref('')

const routes = [
  {
    id: 1,
    from: 'Phnom Penh',
    to: 'Siem Reap',
    duration: '5h 30m',
    price: 12,
    image: '/images/siem-reap.jpg',
  },
  {
    id: 2,
    from: 'Phnom Penh',
    to: 'Battambang',
    duration: '4h 30m',
    price: 10,
    image: '/images/battambang.jpg',
  },
  {
    id: 3,
    from: 'Phnom Penh',
    to: 'Sihanoukville',
    duration: '6h 00m',
    price: 15,
    image: '/images/sihanoukville.jpg',
  },
  {
    id: 4,
    from: 'Phnom Penh',
    to: 'Kampot',
    duration: '3h 45m',
    price: 9,
    image: '/images/kampot.jpg',
  },
]

function swapCities() {
  const temp = origin.value
  origin.value = destination.value
  destination.value = temp
}

function searchBus(from = origin.value, to = destination.value) {
  error.value = ''

  if (!travelDate.value) {
    error.value = 'Please select a departure date.'
    return
  }

  if (from === to) {
    error.value = 'Departure and destination must be different.'
    return
  }

  router.push({
    path: '/trips',
    query: {
      origin: from,
      destination: to,
      date: travelDate.value,
    },
  })
}
</script>

<template>
  <div class="bus-home">
    <!-- NAVBAR -->
    <header class="bus-navbar">
      <RouterLink to="/" class="bus-logo">
        <img src="/images/logo.png" alt="BookingBus Logo" class="bus-logo-img" />
      </RouterLink>

      <nav class="bus-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/trips">Routes</RouterLink>
        <RouterLink to="/my-bookings"> My Bookings </RouterLink>
        <a href="#features">Help</a>
      </nav>

      <div class="bus-account">
        <RouterLink to="/login">Sign In</RouterLink>
        <RouterLink to="/register" class="bus-signup"> Sign Up </RouterLink>
      </div>
    </header>

    <!-- HERO BANNER -->
    <section class="bus-hero">
      <div class="bus-hero-overlay">
        <div class="bus-hero-content">
          <h1>
            ស្វាគមន៍មកកាន់
            <br />
            Booking Bus
          </h1>
          <p>ស្វែងរកផ្លូវ, ជ្រើសរើសខេត្ត, និងកក់លុយតាមអ៊ីធឺណិតក្នុងរយៈពេលខ្លី</p>
        </div>
      </div>
    </section>

    <!-- SEARCH FORM -->
    <section class="bus-search-wrapper">
      <form class="bus-search-form" @submit.prevent="searchBus()">
        <div class="bus-field">
          <label for="from">From</label>
          <select id="from" v-model="origin" required>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <button
          type="button"
          class="bus-swap"
          aria-label="Swap departure and destination"
          @click="swapCities"
        >
          ⇄
        </button>

        <div class="bus-field">
          <label for="to">To</label>
          <select id="to" v-model="destination" required>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <div class="bus-field">
          <label for="date">Depart Date</label>
          <input id="date" v-model="travelDate" type="date" required />
        </div>

        <button type="submit" class="bus-search-btn">Search Bus</button>

        <p v-if="error" class="bus-search-error">
          {{ error }}
        </p>
      </form>
    </section>

    <!-- FEATURES
    <section id="features" class="bus-features">
      <div class="bus-feature">
        <div class="bus-feature-icon">⚡</div>
        <div>
          <h3>Fast Booking</h3>
          <p>Book in a few clicks</p>
        </div>
      </div>

      <div class="bus-feature">
        <div class="bus-feature-icon">🛡️</div>
        <div>
          <h3>Easy Management</h3>
          <p>View and cancel bookings</p>
        </div>
      </div>

      <div class="bus-feature">
        <div class="bus-feature-icon">🚌</div>
        <div>
          <h3>Many Routes</h3>
          <p>Popular destinations in Cambodia</p>
        </div>
      </div>
    </section> -->

    <!-- POPULAR ROUTES -->
    <section class="bus-popular">
      <div class="bus-section-title">
        <h2>Popular Routes</h2>
        <RouterLink to="/trips"> View All Routes → </RouterLink>
      </div>

      <div class="bus-route-grid">
        <article v-for="route in routes" :key="route.id" class="bus-route-card">
          <img :src="route.image" :alt="route.to" class="bus-route-image" />

          <div class="bus-route-content">
            <h3>
              {{ route.from }}
              <span>→</span>
              {{ route.to }}
            </h3>

            <p>🚌 ~ {{ route.duration }}</p>

            <div class="bus-route-bottom">
              <strong>${{ route.price }}</strong>

              <button type="button" @click="searchBus(route.from, route.to)">Book Now</button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bus-footer">
      <img src="/images/logo.png" alt="BookingBus Logo" class="footer-logo" />
      <p>Easy For Book to Travel</p>
    </footer>
  </div>
</template>
