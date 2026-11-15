<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/login.css'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')

function handleLogin() {
  error.value = ''

  if (!email.value.trim() || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }

  // Prototype only: no real authentication yet.
  router.push('/')
}
</script>

<template>
  <div class="login-page">
    <header class="login-header">
      <RouterLink to="/" class="brand"> 🚌 <span>BusBooking</span> </RouterLink>
    </header>

    <main class="login-container">
      <section class="login-welcome">
        <h1>Book Your Bus Ticket<br />Quick & Easy</h1>
        <p>Find routes, choose your seat, and book online in minutes.</p>
      </section>

      <section class="login-card">
        <div class="login-icon">🚌</div>

        <h2>Sign In</h2>
        <p>Access your BusBooking account</p>

        <form @submit.prevent="handleLogin">
          <label for="email">Email or Username</label>
          <input
            id="email"
            v-model.trim="email"
            type="text"
            placeholder="Enter your email or username"
            autocomplete="username"
            required
          />

          <div class="password-label">
            <label for="password">Password</label>
            <RouterLink to="/forgot-password"> Forgot Password? </RouterLink>
          </div>

          <div class="password-field">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              autocomplete="current-password"
              minlength="6"
              required
            />
            <button type="button" @click="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>

          <p v-if="error" class="login-error" role="alert">
            {{ error }}
          </p>

          <button type="submit" class="login-submit">Sign In</button>
        </form>

        <div class="login-register">
          Don't have an account?
          <RouterLink to="/register">Sign Up</RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
