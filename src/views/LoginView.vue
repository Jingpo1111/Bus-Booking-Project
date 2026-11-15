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
  loading.value = true

  try {
    const result = await login(email.value, password.value)
    sessionStorage.setItem('token', result.access_token)

    if (result.user.role === 'ADMIN') {
      // Operator dashboard will be added later.
      await router.push('/')
    } else {
      await router.push('/')
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unable to sign in'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <header class="auth-header">
      <RouterLink to="/" class="auth-brand"> <span>🚌</span> BusBooking </RouterLink>
      <RouterLink to="/" class="back-link">← Back to Home</RouterLink>
    </header>

    <main class="auth-layout">
      <section class="auth-intro">
        <span class="eyebrow">WELCOME BACK</span>
        <h1>Your Journey<br />Starts Here.</h1>
        <p>
          Sign in to manage your bookings, choose your favorite seats, and travel across Cambodia.
        </p>

        <div class="auth-benefits">
          <div>✓ Find available bus trips</div>
          <div>✓ Select your preferred seat</div>
          <div>✓ View and cancel your bookings</div>
        </div>
      </section>

      <section class="auth-card">
        <div class="auth-symbol">🚌</div>
        <h2>Sign In</h2>
        <p class="auth-subtitle">Welcome back to BusBooking</p>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login-email">Email Address</label>
            <input
              id="login-email"
              v-model.trim="email"
              type="email"
              placeholder="Enter your email address"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="login-password">Password</label>
            <div class="password-input">
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />
              <button type="button" @click="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <p v-if="error" class="form-error" role="alert">
            {{ error }}
          </p>

          <button class="primary-button" :disabled="loading">
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-switch">
          Don't have an account?
          <RouterLink to="/register">Sign Up</RouterLink>
        </p>
      </section>
    </main>
  </div>
</template>
