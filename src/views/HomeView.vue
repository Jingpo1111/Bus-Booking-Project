<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/home.css'

const router = useRouter()

const origin = ref('')
const destination = ref('')
const travelDate = ref('')
const searchError = ref('')

const cities = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampot', 'Kampong Cham']

function searchTrips() {
  searchError.value = ''

  if (origin.value === destination.value) {
    searchError.value = 'Departure and destination must be different.'
    return
  }

  router.push({
    path: '/trips',
    query: {
      origin: origin.value,
      destination: destination.value,
      date: travelDate.value,
    },
  })
}
</script>

<template>
  <div class="home-page">
    <header class="home-navbar">
      <RouterLink to="/" class="home-logo"> 🚌 BusBooking </RouterLink>

      <nav class="home-nav">
        <RouterLink to="/">Home</RouterLink>
        <a href="#features">Why Us</a>
        <RouterLink to="/login" class="signin-link"> Sign In </RouterLink>
        <RouterLink to="/register" class="signup-link"> Sign Up </RouterLink>
      </nav>
    </header>

    <main>
      <section class="home-hero">
        <div class="hero-inner">
          <div class="hero-copy">
            <span class="hero-label"> YOUR JOURNEY STARTS HERE </span>

            <h1>
              Book Your Bus Ticket
              <span>Quick & Easy</span>
            </h1>

            <p>
              Discover available trips across Cambodia. Compare departure times, choose your seat,
              and book with confidence.
            </p>

            <div class="hero-highlights">
              <span>✓ Easy Trip Search</span>
              <span>✓ Seat Selection</span>
              <span>✓ Manage Bookings</span>
            </div>
          </div>

          <div class="hero-visual">
            <div class="hero-bus">🚌</div>
            <div class="hero-visual-title">Explore Cambodia</div>
            <p>Find your next journey with BusBooking</p>
          </div>
        </div>
      </section>

      <section class="search-section">
        <div class="search-panel">
          <div class="search-heading">
            <h2>Find Your Bus</h2>
            <p>Where would you like to go?</p>
          </div>

          <form class="trip-search" @submit.prevent="searchTrips">
            <div class="search-field">
              <label for="origin">From</label>
              <select id="origin" v-model="origin" required>
                <option value="" disabled>Select departure</option>
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="search-field">
              <label for="destination">To</label>
              <select id="destination" v-model="destination" required>
                <option value="" disabled>Select destination</option>
                <option v-for="city in cities" :key="city" :value="city">
                  {{ city }}
                </option>
              </select>
            </div>

            <div class="search-field">
              <label for="travel-date">Travel Date</label>
              <input id="travel-date" v-model="travelDate" type="date" required />
            </div>

            <button class="search-button" type="submit">Search Trips</button>
          </form>

          <p v-if="searchError" class="search-error">
            {{ searchError }}
          </p>
        </div>
      </section>

      <section id="features" class="home-features">
        <div class="section-heading">
          <span>WHY BUSBOOKING?</span>
          <h2>A Better Way to Travel</h2>
          <p>Everything you need for a simple bus booking experience.</p>
        </div>

        <div class="features-grid">
          <article class="feature-card">
            <div class="feature-icon">🔎</div>
            <h3>Find Trips Easily</h3>
            <p>Search available trips by departure, destination, and date.</p>
          </article>

          <article class="feature-card">
            <div class="feature-icon">💺</div>
            <h3>Choose Your Seat</h3>
            <p>View available seats and select your preferred seat number.</p>
          </article>

          <article class="feature-card">
            <div class="feature-icon">📋</div>
            <h3>Manage Bookings</h3>
            <p>View your booked trips and cancel a booking when needed.</p>
          </article>
        </div>
      </section>

      <section class="home-cta">
        <h2>Ready for Your Next Journey?</h2>
        <p>Create an account to start booking your bus seats.</p>
        <RouterLink to="/register"> Get Started </RouterLink>
      </section>
    </main>

    <footer class="home-footer">
      <div>
        <strong>🚌 BusBooking</strong>
        <p>Simple online bus ticket booking.</p>
      </div>
      <span>© 2026 BusBooking</span>
    </footer>
  </div>
</template>
