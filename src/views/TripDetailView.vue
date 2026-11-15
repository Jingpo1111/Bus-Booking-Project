<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/bookingStore'
import { getTrip } from '@/services/tripService'
import '@/assets/styles/trip-detail.css'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()

const trip = computed(() => getTrip(Number(route.params.id)))

const passengers = ref(1)

const travelDate = computed(() => {
  const value = route.query.date
  return typeof value === 'string' ? value : ''
})

const total = computed(() => (trip.value?.price ?? 0) * passengers.value)

function selectSeats() {
  if (!trip.value) return

  const existing = bookingStore.booking
  if (!existing || existing.tripId !== trip.value.id || existing.date !== travelDate.value || existing.passengers !== passengers.value) {
    bookingStore.setBooking({ tripId: trip.value.id, date: travelDate.value, passengers: passengers.value, seats: [], total: 0, passengersInfo: [], contact: { email: '', phone: '' } })
  }
  router.push(`/trips/${trip.value.id}/seats`)
}
</script>

<template>
  <div class="trip-detail-page">
    <!-- NAVIGATION -->
    <Navbar prefix="detail" />

    <!-- HERO -->
    <section class="detail-hero">
      <div class="detail-hero-overlay">
        <div class="detail-hero-inner">
          <span>YOUR JOURNEY DETAILS</span>
          <h1>Trip Details</h1>
          <p>Review your journey before selecting your seat.</p>
        </div>
      </div>
    </section>

    <main class="detail-container">
      <div class="detail-breadcrumb">
        <RouterLink to="/">Home</RouterLink>
        <span>›</span>
        <RouterLink to="/trips">Routes</RouterLink>
        <span>›</span>
        <strong>Trip Details</strong>
      </div>

      <!-- INVALID TRIP -->
      <div v-if="!trip" class="detail-not-found">
        <h2>Trip not found</h2>
        <p>The requested trip does not exist.</p>
        <RouterLink to="/trips">Back to Routes</RouterLink>
      </div>

      <div v-else class="detail-layout">
        <!-- MAIN TRIP INFORMATION -->
        <div class="detail-main">
          <section class="detail-card">
            <div class="detail-card-header">
              <div>
                <span class="detail-small-label">BUS OPERATOR</span>
                <h2>{{ trip.company }}</h2>
              </div>
              <span class="detail-bus-badge">
                {{ trip.type }}
              </span>
            </div>

            <img :src="trip.image" :alt="`${trip.from} to ${trip.to}`" class="detail-bus-image" />

            <div class="detail-route">
              <div class="detail-location">
                <span class="detail-dot"></span>
                <div>
                  <small>DEPARTURE</small>
                  <h3>{{ trip.from }}</h3>
                  <p>{{ trip.departure }}</p>
                </div>
              </div>

              <div class="detail-journey">
                <span>{{ trip.duration }}</span>
                <div class="detail-journey-line">
                  <span>●</span>
                  <div></div>
                  <span>●</span>
                </div>
                <small>Direct Journey</small>
              </div>

              <div class="detail-location detail-arrival">
                <span class="detail-dot"></span>
                <div>
                  <small>DESTINATION</small>
                  <h3>{{ trip.to }}</h3>
                  <p>Estimated travel time</p>
                </div>
              </div>
            </div>
          </section>

          <!-- TRIP INFORMATION -->
          <section class="detail-card">
            <h2>Trip Information</h2>

            <div class="detail-info-grid">
              <div>
                <span>Bus Type</span>
                <strong>{{ trip.type }}</strong>
              </div>

              <div>
                <span>Departure Time</span>
                <strong>{{ trip.departure }}</strong>
              </div>

              <div>
                <span>Travel Duration</span>
                <strong>{{ trip.duration }}</strong>
              </div>

              <div>
                <span>Total Seats</span>
                <strong>{{ trip.seats }} seats</strong>
              </div>

              <div>
                <span>Travel Date</span>
                <strong>{{ travelDate || 'Not selected' }}</strong>
              </div>

              <div>
                <span>Trip ID</span>
                <strong>#{{ trip.id }}</strong>
              </div>
            </div>
          </section>

          <!-- AMENITIES -->
          <section class="detail-card">
            <h2>Bus Amenities</h2>

            <div class="detail-amenities">
              <div v-for="amenity in trip.amenities" :key="amenity">
                <span>✓</span>
                {{ amenity }}
              </div>
            </div>
          </section>
        </div>

        <!-- BOOKING SUMMARY -->
        <aside class="detail-booking-card">
          <h2>Booking Summary</h2>

          <div class="detail-summary-route">
            <strong>{{ trip.from }}</strong>
            <span>→</span>
            <strong>{{ trip.to }}</strong>
          </div>

          <div class="detail-summary-row">
            <span>Bus Operator</span>
            <strong>{{ trip.company }}</strong>
          </div>

          <div class="detail-summary-row">
            <span>Departure</span>
            <strong>{{ trip.departure }}</strong>
          </div>

          <div class="detail-summary-row">
            <span>Price per Seat</span>
            <strong>${{ trip.price }}</strong>
          </div>

          <div class="detail-passengers">
            <label for="passengers">Passengers</label>
            <select id="passengers" v-model.number="passengers">
              <option v-for="n in 6" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
          </div>

          <div class="detail-total">
            <span>Total Price</span>
            <strong>${{ total }}</strong>
          </div>

          <button type="button" class="detail-select-btn" @click="selectSeats">
            Select Seats →
          </button>

          <p class="detail-summary-note">Seat availability will be confirmed during booking.</p>
        </aside>
      </div>
    </main>

    <footer class="detail-footer">© 2026 BookingBus. All rights reserved.</footer>
  </div>
</template>
