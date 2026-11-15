<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@/assets/styles/seat-selection.css'

interface Trip {
  id: number
  from: string
  to: string
  company: string
  type: string
  departure: string
  duration: string
  price: number
  image: string
}

const route = useRoute()
const router = useRouter()

const trips: Trip[] = [
  {
    id: 1,
    from: 'Phnom Penh',
    to: 'Siem Reap',
    company: 'Angkor Express',
    type: 'VIP Bus',
    departure: '06:30',
    duration: '5h 30m',
    price: 12,
    image: '/images/siem-reap.jpg',
  },
  {
    id: 2,
    from: 'Phnom Penh',
    to: 'Battambang',
    company: 'Mekong Bus',
    type: 'Standard Bus',
    departure: '08:00',
    duration: '4h 30m',
    price: 10,
    image: '/images/battambang.jpg',
  },
  {
    id: 3,
    from: 'Phnom Penh',
    to: 'Sihanoukville',
    company: 'Virak Buntham',
    type: 'VIP Bus',
    departure: '13:00',
    duration: '6h 00m',
    price: 15,
    image: '/images/sihanoukville.jpg',
  },
  {
    id: 4,
    from: 'Phnom Penh',
    to: 'Kampot',
    company: 'Angkor Express',
    type: 'Standard Bus',
    departure: '09:30',
    duration: '3h 45m',
    price: 9,
    image: '/images/kampot.jpg',
  },
  {
    id: 5,
    from: 'Siem Reap',
    to: 'Phnom Penh',
    company: 'Mekong Bus',
    type: 'VIP Bus',
    departure: '14:00',
    duration: '5h 30m',
    price: 12,
    image: '/images/siem-reap.jpg',
  },
]

const trip = computed(() => trips.find((t) => t.id === Number(route.params.id)))

const passengers = computed(() => {
  const raw = Number(route.query.passengers ?? 1)
  return Number.isInteger(raw) ? Math.max(1, Math.min(6, raw)) : 1
})

const travelDate = computed(() => (typeof route.query.date === 'string' ? route.query.date : ''))

// Horizontal layout:
// 4 seat rows (A, B, C, D)
// 11 columns (1-11)
// Aisle between B and C
const seatLetters = ['A', 'B', 'C', 'D']

const seatRows = seatLetters.map((letter) => ({
  letter,
  seats: Array.from({ length: 11 }, (_, index) => `${index + 1}${letter}`),
}))

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

const selectedSeats = ref<string[]>([])
const viewMode = ref<'seat' | 'list'>('seat')
const error = ref('')

const allSeats = computed(() => seatRows.flatMap((row) => row.seats))

const totalPrice = computed(() => selectedSeats.value.length * (trip.value?.price ?? 0))

function seatStatus(seat: string) {
  if (occupiedSeats.value.includes(seat)) {
    return 'occupied'
  }

  if (selectedSeats.value.includes(seat)) {
    return 'selected'
  }

  return 'available'
}

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

  sessionStorage.setItem(
    'pendingBooking',
    JSON.stringify({
      tripId: trip.value.id,
      date: travelDate.value,
      passengers: passengers.value,
      seats: selectedSeats.value,
      total: totalPrice.value,
    }),
  )

  router.push({
    path: `/trips/${trip.value.id}/passengers`,
    query: {
      ...(travelDate.value && {
        date: travelDate.value,
      }),
    },
  })
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
    <header class="seat-navbar">
      <RouterLink to="/" class="seat-logo">
        <img src="/images/logo.png" alt="BookingBus" />
      </RouterLink>

      <nav class="seat-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/trips">Book Bus</RouterLink>
        <RouterLink to="/my-bookings"> My Bookings </RouterLink>
        <RouterLink to="/">Help</RouterLink>
      </nav>

      <div class="seat-account">
        <RouterLink to="/login">Sign In</RouterLink>
        <RouterLink to="/register" class="seat-signup"> Sign Up </RouterLink>
      </div>
    </header>

    <!-- BOOKING STEPS -->
    <div class="seat-step-wrapper">
      <div class="seat-steps">
        <div class="seat-step completed">
          <span>✓</span>
          Select Bus
        </div>

        <div class="seat-step-line active"></div>

        <div class="seat-step current">
          <span>2</span>
          Select Seat
        </div>

        <div class="seat-step-line"></div>

        <div class="seat-step">
          <span>3</span>
          Passenger Info
        </div>

        <div class="seat-step-line"></div>

        <div class="seat-step">
          <span>4</span>
          Confirm Booking
        </div>
      </div>
    </div>

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
                44 seats
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

            <!-- HORIZONTAL BUS -->
            <div v-if="viewMode === 'seat'" class="seat-bus-scroll">
              <div class="seat-bus-shell">
                <!-- FRONT / DRIVER -->
                <div class="seat-bus-front">
                  <div class="seat-driver">
                    <span>◉</span>
                    <small>DRIVER</small>
                  </div>
                  <span class="seat-front-label"> FRONT </span>
                </div>

                <!-- SEAT GRID -->
                <div class="seat-map-horizontal">
                  <div
                    v-for="row in seatRows"
                    :key="row.letter"
                    class="seat-horizontal-row"
                    :class="{
                      'seat-row-before-aisle': row.letter === 'B',
                    }"
                  >
                    <button
                      v-for="seat in row.seats"
                      :key="seat"
                      type="button"
                      class="seat-chair"
                      :class="seatStatus(seat)"
                      :disabled="seatStatus(seat) === 'occupied'"
                      :aria-label="`Seat ${seat}, ${seatStatus(seat)}`"
                      :aria-pressed="seatStatus(seat) === 'selected'"
                      @click="toggleSeat(seat)"
                    >
                      {{ seat }}
                    </button>
                  </div>
                </div>

                <!-- REAR -->
                <div class="seat-bus-back">
                  <span>REAR</span>
                </div>
              </div>
            </div>

            <!-- VIEW SWITCH -->
            <div class="seat-view-toggle">
              <button
                type="button"
                :class="{
                  active: viewMode === 'seat',
                }"
                @click="viewMode = 'seat'"
              >
                🚌 Seat View
              </button>

              <button
                type="button"
                :class="{
                  active: viewMode === 'list',
                }"
                @click="viewMode = 'list'"
              >
                ☷ List View
              </button>
            </div>

            <!-- LIST VIEW -->
            <div v-if="viewMode === 'list'" class="seat-list-view">
              <button
                v-for="seat in allSeats"
                :key="seat"
                type="button"
                :class="seatStatus(seat)"
                :disabled="seatStatus(seat) === 'occupied'"
                :aria-label="`Seat ${seat}, ${seatStatus(seat)}`"
                :aria-pressed="seatStatus(seat) === 'selected'"
                @click="toggleSeat(seat)"
              >
                {{ seat }}
              </button>
            </div>

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
