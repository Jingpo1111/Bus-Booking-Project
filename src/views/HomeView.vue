<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function searchBuses() {
  router.push('/buses')
}
</script>

<template>
  <div class="home-page">
    <header class="navbar">
      <RouterLink to="/" class="logo">🚌 BusBooking</RouterLink>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/buses">Routes</RouterLink>
        <RouterLink to="/my-bookings">My Bookings</RouterLink>
        <RouterLink to="/login" class="nav-login">Sign In</RouterLink>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="hero-content">
          <h1>Book Your Bus Ticket<br />Quick & Easy</h1>
          <p>Travel across Cambodia with comfort. Find your route and book your seat today.</p>

          <form class="search-box" @submit.prevent="searchBuses">
            <div class="field">
              <label for="from">From</label>
              <select id="from" required>
                <option value="">Select departure</option>
                <option>Phnom Penh</option>
                <option>Siem Reap</option>
                <option>Battambang</option>
              </select>
            </div>

            <div class="field">
              <label for="to">To</label>
              <select id="to" required>
                <option value="">Select destination</option>
                <option>Siem Reap</option>
                <option>Phnom Penh</option>
                <option>Sihanoukville</option>
              </select>
            </div>

            <div class="field">
              <label for="date">Travel Date</label>
              <input id="date" type="date" required />
            </div>

            <button type="submit">Search Buses</button>
          </form>
        </div>
      </section>

      <section class="features">
        <h2>Why Choose BusBooking?</h2>

        <div class="feature-grid">
          <div class="feature-card">
            <span>⚡</span>
            <h3>Fast Booking</h3>
            <p>Book your bus tickets in just a few clicks.</p>
          </div>

          <div class="feature-card">
            <span>🔒</span>
            <h3>Secure Booking</h3>
            <p>Manage your booking information easily.</p>
          </div>

          <div class="feature-card">
            <span>🚌</span>
            <h3>Many Routes</h3>
            <p>Explore destinations across Cambodia.</p>
          </div>
        </div>
      </section>
    </main>

    <footer>© 2026 BusBooking. All rights reserved.</footer>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  font-family: Arial, sans-serif;
  color: #17233b;
  background: #f8faff;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 7%;
  background: white;
  box-shadow: 0 2px 12px #0000000a;
}

.logo {
  font-size: 25px;
  font-weight: bold;
  color: #0756d9;
  text-decoration: none;
}

nav {
  display: flex;
  gap: 30px;
  align-items: center;
}

nav a {
  color: #344054;
  text-decoration: none;
}

.nav-login {
  background: #0756e8;
  color: white;
  padding: 11px 22px;
  border-radius: 8px;
}

nav .nav-login {
  color: white;
}

.hero {
  padding: 110px 7%;
  background: linear-gradient(120deg, #0756d9, #5a9af5);
  color: white;
}

.hero-content {
  max-width: 1150px;
  margin: auto;
}

.hero h1 {
  font-size: clamp(36px, 5vw, 60px);
  line-height: 1.15;
}

.hero p {
  font-size: 18px;
  line-height: 1.7;
  max-width: 520px;
}

.search-box {
  margin-top: 45px;
  padding: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  align-items: end;
  gap: 15px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 40px #00000020;
}

.field label {
  display: block;
  color: #344054;
  font-weight: 600;
  margin-bottom: 10px;
}

.field select,
.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  background: white;
}

.search-box button {
  padding: 15px 25px;
  background: #0756e8;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.features {
  padding: 75px 7%;
  text-align: center;
}

.features h2 {
  font-size: 32px;
  margin-bottom: 40px;
}

.feature-grid {
  max-width: 1150px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.feature-card {
  background: white;
  padding: 35px 25px;
  border-radius: 15px;
  box-shadow: 0 5px 20px #0000000a;
}

.feature-card span {
  font-size: 35px;
}

.feature-card h3 {
  margin: 20px 0 10px;
}

.feature-card p {
  color: #667085;
}

footer {
  padding: 25px;
  text-align: center;
  color: #667085;
}

@media (max-width: 850px) {
  .navbar,
  nav {
    flex-wrap: wrap;
    gap: 15px;
  }

  .hero {
    padding: 65px 6%;
  }

  .search-box,
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
