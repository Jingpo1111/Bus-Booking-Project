<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/register.css'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const error = ref('')

function handleRegister() {
  error.value = ''

  if (
    !fullName.value.trim() ||
    !email.value.trim() ||
    !phone.value.trim() ||
    !password.value ||
    !confirmPassword.value
  ) {
    error.value = 'Please fill in all fields.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Please enter a valid email.'
    return
  }

  if (!/^\+?[0-9]{8,15}$/.test(phone.value)) {
    error.value = 'Please enter a valid phone number.'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  // Frontend prototype only.
  // No account is created until a backend is connected.
  alert('Form validated! Registration API not connected yet.')
  router.push('/login')
}
</script>

<template>
  <div class="register-page">
    <header class="register-header">
      <RouterLink to="/login" class="brand"> 🚌 <span>BusBooking</span> </RouterLink>
    </header>

    <main class="register-container">
      <section class="register-welcome">
        <h1>Start Your Journey<br />With BusBooking</h1>
        <p>Create your account, explore routes, and book your bus tickets easily.</p>
      </section>

      <section class="register-card">
        <div class="register-icon">🚌</div>
        <h2>Create Account</h2>
        <p>Sign up to start booking your trips</p>

        <form @submit.prevent="handleRegister">
          <label for="fullName">Full Name</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            placeholder="Enter your full name"
            autocomplete="name"
            required
          />

          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            autocomplete="email"
            required
          />

          <label for="phone">Phone Number</label>
          <input
            id="phone"
            v-model="phone"
            type="tel"
            placeholder="Enter your phone number"
            autocomplete="tel"
            required
          />

          <label for="password">Password</label>
          <div class="register-password">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
              autocomplete="new-password"
              required
            />
            <button type="button" @click="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>

          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Confirm your password"
            autocomplete="new-password"
            required
          />

          <p v-if="error" class="register-error" role="alert">
            {{ error }}
          </p>

          <button type="submit" class="register-submit">Sign Up</button>
        </form>

        <div class="register-login">
          Already have an account?
          <RouterLink to="/login">Sign In</RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
