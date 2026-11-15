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

  if (!name.value.trim()) {
    error.value = 'Please enter your full name.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }

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
    error.value = err instanceof Error ? err.message : 'Registration failed. Please try again.'
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

    <!-- MAIN -->
    <main class="auth-layout">
      <!-- LEFT SIDE -->
      <section class="auth-intro">
        <span class="eyebrow">JOIN BOOKINGBUS</span>

        <h1>
          Explore More.
          <br />
          Travel Better.
        </h1>

        <p>
          Create your free passenger account and enjoy a simple way to book bus tickets across
          Cambodia.
        </p>

        <div class="auth-benefits">
          <div>
            <span class="check-icon">✓</span>
            Search trips across Cambodia
          </div>

          <div>
            <span class="check-icon">✓</span>
            Choose your preferred bus seat
          </div>

          <div>
            <span class="check-icon">✓</span>
            Manage your bookings online
          </div>
        </div>

        <!-- BUS IMAGE -->
        <div class="auth-decoration">
          <img src="/images/bus-hero.png" alt="BookingBus transportation" class="auth-bus-image" />
        </div>
      </section>

      <!-- REGISTER CARD -->
      <section class="auth-card">
        <div class="auth-symbol">
          <img src="/images/logo.png" alt="BookingBus" class="auth-card-logo" />
        </div>

        <h2>Create Account</h2>

        <p class="auth-subtitle">Join BookingBus and start your journey</p>

        <form @submit.prevent="handleRegister">
          <!-- FULL NAME -->
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              placeholder="Enter your full name"
              autocomplete="name"
              minlength="2"
              required
            />
          </div>

          <!-- EMAIL -->
          <div class="form-group">
            <label for="register-email"> Email Address </label>

            <input
              id="register-email"
              v-model.trim="email"
              type="email"
              placeholder="Enter your email address"
              autocomplete="email"
              required
            />
          </div>

          <!-- PASSWORD -->
          <div class="form-group">
            <label for="register-password"> Password </label>

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

          <!-- CONFIRM PASSWORD -->
          <div class="form-group">
            <label for="confirm-password"> Confirm Password </label>

            <input
              id="confirm-password"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              autocomplete="new-password"
              required
            />
          </div>

          <!-- ERROR -->
          <p v-if="error" class="form-error" role="alert">
            {{ error }}
          </p>

          <!-- SUBMIT -->
          <button type="submit" class="primary-button" :disabled="loading">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- LOGIN LINK -->
        <div class="auth-divider">
          <span>Already have an account?</span>
        </div>

        <RouterLink to="/login" class="register-button"> Sign In </RouterLink>

        <p class="auth-footer-text">© 2026 BookingBus. All rights reserved.</p>
      </section>
    </main>
  </div>
</template>
