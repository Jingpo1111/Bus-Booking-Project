<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/authService'
import '@/assets/styles/auth.css'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  error.value = ''

  if (password.value.length < 8) {
    error.value = 'Password must contain at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    await register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
    })

    await router.push({
      path: '/login',
      query: { registered: '1' },
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed'
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
        <span class="eyebrow">JOIN BUSBOOKING</span>
        <h1>Explore More.<br />Travel Better.</h1>
        <p>Create your free passenger account and enjoy a simple way to book bus tickets.</p>

        <div class="auth-benefits">
          <div>✓ Search trips across Cambodia</div>
          <div>✓ Choose your bus seat</div>
          <div>✓ Manage your bookings online</div>
        </div>
      </section>

      <section class="auth-card">
        <div class="auth-symbol">🚌</div>
        <h2>Create Account</h2>
        <p class="auth-subtitle">Join BusBooking and start your journey</p>

        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              placeholder="Enter your full name"
              autocomplete="name"
              required
            />
          </div>

          <div class="form-group">
            <label for="register-email">Email Address</label>
            <input
              id="register-email"
              v-model.trim="email"
              type="email"
              placeholder="Enter your email address"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="register-password">Password</label>
            <div class="password-input">
              <input
                id="register-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Create your password"
                autocomplete="new-password"
                minlength="8"
                required
              />
              <button type="button" @click="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              autocomplete="new-password"
              required
            />
          </div>

          <p v-if="error" class="form-error" role="alert">
            {{ error }}
          </p>

          <button class="primary-button" :disabled="loading">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-switch">
          Already have an account?
          <RouterLink to="/login">Sign In</RouterLink>
        </p>
      </section>
    </main>
  </div>
</template>
