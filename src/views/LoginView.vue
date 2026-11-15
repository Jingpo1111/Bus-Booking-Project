<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/authService'
import '@/assets/styles/auth.css'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!email.value.trim() || !password.value) {
    error.value = 'Please enter your email and password.'
    return
  }

  loading.value = true

  try {
    const result = await login(email.value.trim(), password.value)

    if (!result.access_token) {
      throw new Error('Invalid login response from server.')
    }

    sessionStorage.setItem('token', result.access_token)

    // Both passenger and operator temporarily go Home.
    // Change ADMIN redirect when dashboard is ready.
    await router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to sign in.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <!-- HEADER -->
    <header class="auth-header">
      <RouterLink to="/" class="auth-brand">
        <img src="/images/logo.png" alt="BookingBus Logo" class="auth-logo" />
      </RouterLink>

      <RouterLink to="/" class="back-link"> ← Back to Home </RouterLink>
    </header>

    <!-- MAIN CONTENT -->
    <main class="auth-layout">
      <!-- LEFT SIDE -->
      <section class="auth-intro">
        <span class="eyebrow">WELCOME BACK</span>

        <h1>
          Your Journey
          <br />
          Starts Here.
        </h1>

        <p>
          Sign in to manage your bookings, choose your favorite seats, and travel across Cambodia.
        </p>

        <div class="auth-benefits">
          <div>
            <span class="check-icon">✓</span>
            Find available bus trips
          </div>

          <div>
            <span class="check-icon">✓</span>
            Select your preferred seat
          </div>

          <div>
            <span class="check-icon">✓</span>
            View and cancel your bookings
          </div>
        </div>

        <div class="auth-decoration">
          <img src="/images/bus-hero.png" alt="BookingBus transportation" class="auth-bus-image" />
        </div>
      </section>

      <!-- RIGHT SIDE LOGIN CARD -->
      <section class="auth-card">
        <div class="auth-symbol">
          <img src="/images/logo.png" alt="BookingBus" class="auth-card-logo" />
        </div>

        <h2>Sign In</h2>

        <p class="auth-subtitle">Welcome back to BookingBus</p>

        <form @submit.prevent="handleLogin">
          <!-- EMAIL -->
          <div class="form-group">
            <label for="login-email"> Email Address </label>

            <input
              id="login-email"
              v-model.trim="email"
              type="email"
              placeholder="Enter your email address"
              autocomplete="email"
              required
            />
          </div>

          <!-- PASSWORD -->
          <div class="form-group">
            <label for="login-password"> Password </label>

            <div class="password-input">
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />

              <button
                type="button"
                class="password-toggle"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <!-- ERROR -->
          <p v-if="error" class="form-error" role="alert">
            {{ error }}
          </p>

          <!-- SUBMIT -->
          <button type="submit" class="primary-button" :disabled="loading">
            <span v-if="loading">Signing In...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>New to BookingBus?</span>
        </div>

        <RouterLink to="/register" class="register-button"> Create an Account </RouterLink>

        <p class="auth-footer-text">© 2026 BookingBus. All rights reserved.</p>
      </section>
    </main>
  </div>
</template>
