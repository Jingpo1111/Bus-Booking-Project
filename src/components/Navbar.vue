<script setup lang="ts">
defineOptions({ name: 'AppNavbar' })
defineProps<{ prefix: string; routesLabel?: string }>()
</script>
<template>
  <header :class="`${prefix}-navbar`">
    <RouterLink to="/" :class="`${prefix}-logo`"><img src="/images/logo.png" alt="BookingBus" /></RouterLink>
    <nav :class="`${prefix}-nav`">
      <RouterLink to="/">Home</RouterLink><RouterLink to="/trips">{{ routesLabel || 'Routes' }}</RouterLink>
      <RouterLink to="/my-bookings">My Bookings</RouterLink><RouterLink to="/">Help</RouterLink>
    </nav>
    <div :class="`${prefix}-account`"><RouterLink to="/login">Sign In</RouterLink><RouterLink to="/register" :class="`${prefix}-signup`">Sign Up</RouterLink></div>
  </header>
</template>
