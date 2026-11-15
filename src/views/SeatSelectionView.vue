<script setup lang="ts">
import SeatMap from '@/components/SeatMap.vue'
import BookingSteps from '@/components/BookingSteps.vue'
import Navbar from '@/components/Navbar.vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '@/stores/bookingStore'
import { storeToRefs } from 'pinia'
import { getTrip } from '@/services/tripService'
import '@/assets/styles/seat-selection.css'

const route = useRoute()
const router = useRouter()
const bookingStore = useBookingStore()
const { booking } = storeToRefs(bookingStore)

const trip = computed(() => getTrip(Number(route.params.id)))

const passengers = computed(() => {
  const raw = Number(route.query.passengers ?? (booking.value?.tripId === trip.value?.id ? booking.value?.passengers : 1))
  return Number.isInteger(raw) ? Math.max(1, Math.min(6, raw)) : 1
})

const travelDate = computed(() => (typeof route.query.date === 'string' ? route.query.date : (booking.value?.tripId === trip.value?.id ? booking.value?.date ?? '' : '')))

const occupiedSeats = ref<string[]>([
  '1A',
  '1B',
  '2C',
  '3D',
  '4A',
  '5B',
  '6C',
  '7D',
  '8A',
  '9B',
  '10C',
  '11D',
])

const selectedSeats = computed({
  get: () => booking.value && booking.value.tripId === trip.value?.id ? booking.value.seats : [],
  set: (seats: string[]) => {
    if (!trip.value) return
    bookingStore.setBooking({ tripId: trip.value.id, date: travelDate.value, passengers: passengers.value, seats, total: seats.length * trip.value.price, passengersInfo: [], contact: { email: '', phone: '' } })
  },
})
const error = ref('')

const totalPrice = computed(() => selectedSeats.value.length * (trip.value?.price ?? 0))

function toggleSeat(seat: string) {
  error.value = ''

  if (occupiedSeats.value.includes(seat)) return

  if (selectedSeats.value.includes(seat)) {
    selectedSeats.value = selectedSeats.value.filter((s) => s !== seat)
    return
  }

  if (selectedSeats.value.length >= passengers.value) {
    error.value = `You can select only ${passengers.value} seat(s).`
    return
  }

  selectedSeats.value = [...selectedSeats.value, seat]
}

function continueBooking() {
  if (!trip.value) return

  if (selectedSeats.value.length !== passengers.value) {
    error.value = `Please select ${passengers.value} seat(s) to continue.`
    return
  }


  router.push(`/trips/${trip.value.id}/passengers`)
}

function goBack() {
  router.push({
    path: trip.value ? `/trips/${trip.value.id}` : '/trips',
    query: {
      ...(travelDate.value && {
        date: travelDate.value,
      }),
    },
  })
}
</script>

<template>
  <div class="seat-page">
    <!-- NAVBAR -->
    <Navbar prefix="seat" routes-label="Book Bus" />

    <!-- BOOKING STEPS -->
    <BookingSteps prefix="seat" :current="2" />


    <main class="seat-container">
      <!-- NOT FOUND -->
      <div v-if="!trip" class="seat-not-found">
        <h2>Trip not found</h2>
        <RouterLink to="/trips"> Back to Routes </RouterLink>
      </div>

      <template v-else>
        <div class="seat-layout">
          <!-- LEFT: BUS INFORMATION -->
          <aside class="seat-trip-card">
            <img src="/images/bus-hero.png" alt="BookingBus coach" class="seat-trip-image" />

            <div class="seat-trip-content">
              <span class="seat-type-badge">
                {{ trip.type }}
              </span>

              <h2>{{ trip.company }}</h2>

              <div class="seat-trip-route">
                <strong>{{ trip.from }}</strong>
                <span>→</span>
                <strong>{{ trip.to }}</strong>
              </div>

              <div class="seat-trip-detail">
                <span>📅</span>
                {{ travelDate || 'Date not selected' }}
              </div>

              <div class="seat-trip-detail">
                <span>◷</span>
                {{ trip.departure }}
                ({{ trip.duration }})
              </div>

              <div class="seat-trip-detail">
                <span>▣</span>
                {{ trip.seats }} seats
              </div>

              <div class="seat-amenities">
                <div>◉<small>Wi-Fi</small></div>
                <div>❄<small>AC</small></div>
                <div>⚡<small>USB</small></div>
                <div>♧<small>Reclining</small></div>
              </div>
            </div>
          </aside>

          <!-- CENTER: SEAT SELECTION -->
          <section class="seat-center">
            <div class="seat-heading">
              <div>
                <h1>Select Your Seat</h1>
                <p>
                  Choose {{ passengers }}
                  seat(s) for your journey.
                </p>
              </div>

              <span class="seat-count">
                {{ selectedSeats.length }}/{{ passengers }}
                selected
              </span>
            </div>

            <SeatMap :selected-seats="selectedSeats" :occupied-seats="occupiedSeats" @toggle="toggleSeat" />

            <p v-if="error" class="seat-error" role="alert">
              {{ error }}
            </p>
          </section>

          <!-- RIGHT SIDEBAR -->
          <aside class="seat-sidebar">
            <!-- LEGEND -->
            <div class="seat-side-card">
              <h3>Seat Legend</h3>

              <div class="seat-legend-row">
                <span class="seat-legend-icon available"></span>
                Available
              </div>

              <div class="seat-legend-row">
                <span class="seat-legend-icon selected"></span>
                Selected
              </div>

              <div class="seat-legend-row">
                <span class="seat-legend-icon occupied"></span>
                Occupied
              </div>
            </div>

            <!-- SELECTED SEATS -->
            <div class="seat-side-card">
              <h3>Selected Seats ({{ selectedSeats.length }})</h3>

              <p v-if="selectedSeats.length === 0" class="seat-empty-text">
                No seats selected yet.
              </p>

              <div v-for="seat in selectedSeats" :key="seat" class="seat-selected-row">
                <span>♧ {{ seat }}</span>

                <div>
                  <strong>${{ trip.price }}</strong>

                  <button
                    type="button"
                    :aria-label="`Remove seat ${seat}`"
                    @click="toggleSeat(seat)"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div class="seat-total">
                <strong>Total</strong>
                <strong>${{ totalPrice }}</strong>
              </div>

              <p class="seat-limit">
                Select exactly
                {{ passengers }} seat(s).
              </p>
            </div>
          </aside>
        </div>

        <!-- BOTTOM BUTTONS -->
        <div class="seat-bottom-actions">
          <button type="button" class="seat-back-btn" @click="goBack">← Back to Bus Details</button>

          <button
            type="button"
            class="seat-continue-btn"
            :disabled="selectedSeats.length !== passengers"
            @click="continueBooking"
          >
            Continue to Passenger Info →
          </button>
        </div>
      </template>
    </main>
  </div>
</template>
