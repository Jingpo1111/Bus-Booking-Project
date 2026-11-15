<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import '@/assets/styles/payment.css'

interface Passenger {
  fullName: string
  gender: string
  phone: string
}

interface PendingBooking {
  tripId: number
  date: string
  passengers: number
  seats: string[]
  total: number
  passengersInfo: Passenger[]
  contact: {
    email: string
    phone: string
  }
}

interface Trip {
  id: number
  from: string
  to: string
  company: string
  type: string
  departure: string
  duration: string
  price: number
}

const router = useRouter()
const route = useRoute()

// Mock data: use the same trip IDs as your other pages.
const trips: Trip[] = [
  {
    id: 1,
    from: 'Phnom Penh',
    to: 'Siem Reap',
    company: 'Angkor Express',
    type: 'VIP Bus',
    departure: '06:30 AM',
    duration: '5h 30m',
    price: 12,
  },
  {
    id: 2,
    from: 'Phnom Penh',
    to: 'Battambang',
    company: 'Mekong Bus',
    type: 'Standard Bus',
    departure: '08:00 AM',
    duration: '4h 30m',
    price: 10,
  },
  {
    id: 3,
    from: 'Phnom Penh',
    to: 'Sihanoukville',
    company: 'Virak Buntham',
    type: 'VIP Bus',
    departure: '01:00 PM',
    duration: '6h 00m',
    price: 15,
  },
  {
    id: 4,
    from: 'Phnom Penh',
    to: 'Kampot',
    company: 'Angkor Express',
    type: 'Standard Bus',
    departure: '09:30 AM',
    duration: '3h 45m',
    price: 9,
  },
  {
    id: 5,
    from: 'Siem Reap',
    to: 'Phnom Penh',
    company: 'Mekong Bus',
    type: 'VIP Bus',
    departure: '02:00 PM',
    duration: '5h 30m',
    price: 12,
  },
]

const booking = ref<PendingBooking | null>(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const agreeTerms = ref(false)
const completed = ref(false)
const bookingId = ref('')

const trip = computed(() => trips.find((t) => t.id === Number(route.params.id)))

const totalPrice = computed(() => (trip.value?.price ?? 0) * (booking.value?.seats.length ?? 0))

const validBooking = computed(() => {
  const b = booking.value

  if (!b || !trip.value) return false

  return (
    b.tripId === trip.value.id &&
    Number.isInteger(b.passengers) &&
    b.passengers >= 1 &&
    b.passengers <= 6 &&
    Array.isArray(b.seats) &&
    b.seats.length === b.passengers &&
    new Set(b.seats).size === b.seats.length &&
    b.seats.every((s) => typeof s === 'string' && /^(?:[1-9]|10|11)[A-D]$/.test(s)) &&
    Array.isArray(b.passengersInfo) &&
    b.passengersInfo.length === b.passengers &&
    b.passengersInfo.every(
      (p) => typeof p?.fullName === 'string' && p.fullName.trim().length >= 2,
    ) &&
    typeof b.contact?.email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.contact.email) &&
    typeof b.contact?.phone === 'string' &&
    b.contact.phone.trim().length >= 8 &&
    typeof b.date === 'string' &&
    b.date.length > 0
  )
})

onMounted(() => {
  try {
    const saved = sessionStorage.getItem('pendingBooking')

    if (!saved) {
      error.value = 'No booking found. Please select a bus first.'
      return
    }

    const parsed: unknown = JSON.parse(saved)

    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid booking')
    }

    booking.value = parsed as PendingBooking

    if (!validBooking.value) {
      error.value = 'Booking information is incomplete or invalid.'
    }
  } catch {
    error.value = 'Unable to load booking details.'
    booking.value = null
  } finally {
    loading.value = false
  }
})

function confirmBooking() {
  error.value = ''

  if (!validBooking.value || !booking.value || !trip.value) {
    error.value = 'Please complete your booking details.'
    return
  }

  if (!agreeTerms.value) {
    error.value = 'Please accept the booking terms.'
    return
  }

  if (submitting.value) return

  submitting.value = true

  try {
    const id = `BK-${Date.now()}`
    const b = booking.value
    const t = trip.value

    const record = {
      id,
      tripId: t.id,
      from: t.from,
      to: t.to,
      company: t.company,
      busType: t.type,
      date: b.date,
      time: t.departure,
      duration: t.duration,
      seats: [...b.seats],
      passengers: b.passengers,
      passengersInfo: b.passengersInfo,
      contact: b.contact,
      total: totalPrice.value,
      status: 'Pending',
      paymentMethod: 'Pay at Counter',
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString(),
    }

    const saved = localStorage.getItem('bookingBusBookings')
    const parsed: unknown = saved ? JSON.parse(saved) : []

    const existing = Array.isArray(parsed) ? parsed : []

    localStorage.setItem('bookingBusBookings', JSON.stringify([record, ...existing]))

    bookingId.value = id
    completed.value = true
    sessionStorage.removeItem('pendingBooking')
  } catch {
    error.value = 'Unable to save booking. Please try again.'
  } finally {
    submitting.value = false
  }
}

function goBack() {
  router.push(`/trips/${route.params.id}/passengers`)
}

function viewBookings() {
  router.push('/my-bookings')
}
</script>

<template>
  <div class="payment-page">
    <!-- NAVBAR -->
    <header class="payment-navbar">
      <RouterLink to="/" class="payment-logo">
        <img src="/images/logo.png" alt="BookingBus" />
      </RouterLink>

      <nav class="payment-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/trips">Routes</RouterLink>
        <RouterLink to="/my-bookings">My Bookings</RouterLink>
        <RouterLink to="/">Help</RouterLink>
      </nav>

      <div class="payment-account">
        <RouterLink to="/login">Sign In</RouterLink>
        <RouterLink to="/register" class="payment-signup"> Sign Up </RouterLink>
      </div>
    </header>

    <!-- PROGRESS -->
    <div class="payment-step-wrapper">
      <div class="payment-steps">
        <div class="payment-step done"><span>✓</span> Select Bus</div>
        <div class="payment-line active"></div>

        <div class="payment-step done"><span>✓</span> Select Seat</div>
        <div class="payment-line active"></div>

        <div class="payment-step done"><span>✓</span> Passenger Info</div>
        <div class="payment-line active"></div>

        <div class="payment-step current"><span>4</span> Confirm Booking</div>
      </div>
    </div>

    <main class="payment-container">
      <!-- LOADING -->
      <div v-if="loading" class="payment-state">
        <div class="payment-spinner"></div>
        <h2>Loading your booking...</h2>
        <p>Please wait a moment.</p>
      </div>

      <!-- SUCCESS -->
      <div v-else-if="completed" class="payment-success">
        <div class="payment-success-icon">✓</div>

        <h1>Booking Submitted!</h1>

        <p>Your booking request has been saved successfully.</p>

        <div class="payment-confirmation-id">
          <span>Booking Reference</span>
          <strong>{{ bookingId }}</strong>
        </div>

        <div class="payment-success-note">
          <strong>Payment Method: Pay at Counter</strong>
          <p>Payment is pending. Please follow the bus operator's payment instructions.</p>
          <p>This is a frontend prototype booking, not a confirmed operator reservation.</p>
        </div>

        <button type="button" class="payment-primary-btn" @click="viewBookings">
          View My Bookings →
        </button>
      </div>

      <!-- EMPTY OR ERROR -->
      <div v-else-if="!validBooking" class="payment-state">
        <div class="payment-state-icon">!</div>
        <h2>Booking Not Found</h2>
        <p>{{ error }}</p>
        <RouterLink to="/trips" class="payment-primary-link"> Find a Bus </RouterLink>
      </div>

      <!-- CONFIRMATION PAGE -->
      <template v-else-if="trip && booking">
        <div class="payment-heading">
          <h1>Confirm Your Booking</h1>
          <p>Please review your booking details before confirming.</p>
        </div>

        <div class="payment-layout">
          <!-- LEFT CONTENT -->
          <div class="payment-main">
            <!-- JOURNEY DETAILS -->
            <section class="payment-card">
              <div class="payment-section-heading">
                <span class="payment-section-icon">🚌</span>
                <h2>Journey Details</h2>
              </div>

              <div class="payment-journey">
                <div class="payment-journey-location">
                  <small>FROM</small>
                  <strong>{{ trip.from }}</strong>
                </div>

                <div class="payment-journey-arrow">→</div>

                <div class="payment-journey-location">
                  <small>TO</small>
                  <strong>{{ trip.to }}</strong>
                </div>
              </div>

              <div class="payment-info-grid">
                <div>
                  <span>Bus Operator</span>
                  <strong>{{ trip.company }}</strong>
                </div>
                <div>
                  <span>Bus Type</span>
                  <strong>{{ trip.type }}</strong>
                </div>
                <div>
                  <span>Travel Date</span>
                  <strong>{{ booking.date }}</strong>
                </div>
                <div>
                  <span>Departure Time</span>
                  <strong>{{ trip.departure }}</strong>
                </div>
                <div>
                  <span>Duration</span>
                  <strong>{{ trip.duration }}</strong>
                </div>
                <div>
                  <span>Total Passengers</span>
                  <strong>{{ booking.passengers }}</strong>
                </div>
              </div>
            </section>

            <!-- PASSENGERS -->
            <section class="payment-card">
              <div class="payment-section-heading">
                <span class="payment-section-icon">♙</span>
                <h2>Passenger Information</h2>
              </div>

              <div
                v-for="(passenger, index) in booking.passengersInfo"
                :key="index"
                class="payment-passenger-row"
              >
                <div class="payment-passenger-avatar">
                  {{ index + 1 }}
                </div>

                <div class="payment-passenger-details">
                  <strong>{{ passenger.fullName }}</strong>
                  <small>{{ passenger.gender }}</small>
                </div>

                <span class="payment-seat-tag"> Seat {{ booking.seats[index] }} </span>
              </div>

              <div class="payment-contact">
                <h3>Contact Information</h3>
                <p>
                  <strong>Email:</strong>
                  {{ booking.contact.email }}
                </p>
                <p>
                  <strong>Phone:</strong>
                  {{ booking.contact.phone }}
                </p>
              </div>
            </section>

            <!-- SIMPLE PAYMENT -->
            <section class="payment-card">
              <div class="payment-section-heading">
                <span class="payment-section-icon">💵</span>
                <h2>Payment Information</h2>
              </div>

              <div class="payment-method-simple">
                <div class="payment-method-check">✓</div>

                <div>
                  <strong>Pay at Counter</strong>
                  <p>
                    No online payment required. Payment will be made according to the bus operator's
                    instructions.
                  </p>
                </div>
              </div>

              <div class="payment-notice">
                <strong>Important</strong>
                <p>
                  Your booking will have Pending status. No real payment or seat reservation is
                  processed by this prototype.
                </p>
              </div>
            </section>

            <!-- AGREEMENT -->
            <section class="payment-card">
              <label class="payment-agreement">
                <input v-model="agreeTerms" type="checkbox" />
                <span>
                  I confirm that all passenger and journey information is correct and agree to the
                  booking terms.
                </span>
              </label>
            </section>

            <p v-if="error" class="payment-error" role="alert">
              {{ error }}
            </p>
          </div>

          <!-- RIGHT SUMMARY -->
          <aside class="payment-sidebar">
            <section class="payment-card payment-summary">
              <h2>Booking Summary</h2>

              <div class="payment-route">
                <strong>{{ trip.from }}</strong>
                <span>→</span>
                <strong>{{ trip.to }}</strong>
              </div>

              <div class="payment-summary-row">
                <span>Operator</span>
                <strong>{{ trip.company }}</strong>
              </div>

              <div class="payment-summary-row">
                <span>Travel Date</span>
                <strong>{{ booking.date }}</strong>
              </div>

              <div class="payment-summary-row">
                <span>Departure</span>
                <strong>{{ trip.departure }}</strong>
              </div>

              <div class="payment-summary-row">
                <span>Passengers</span>
                <strong>{{ booking.passengers }}</strong>
              </div>

              <div class="payment-summary-row">
                <span>Selected Seats</span>
                <strong>{{ booking.seats.join(', ') }}</strong>
              </div>

              <div class="payment-summary-divider"></div>

              <div class="payment-summary-row">
                <span>Price per Seat</span>
                <strong>${{ trip.price.toFixed(2) }}</strong>
              </div>

              <div class="payment-summary-row">
                <span>Number of Seats</span>
                <strong>{{ booking.seats.length }}</strong>
              </div>

              <div class="payment-summary-total">
                <span>Total Amount</span>
                <strong>${{ totalPrice.toFixed(2) }}</strong>
              </div>

              <div class="payment-status">
                <span>Payment Status</span>
                <strong>Unpaid</strong>
              </div>

              <button
                type="button"
                class="payment-primary-btn"
                :disabled="submitting || !agreeTerms"
                @click="confirmBooking"
              >
                {{ submitting ? 'Submitting...' : 'Confirm Booking →' }}
              </button>

              <p class="payment-safe-note">
                Simple booking confirmation. No online payment required.
              </p>
            </section>
          </aside>
        </div>

        <div class="payment-actions">
          <button type="button" class="payment-back-btn" @click="goBack">
            ← Back to Passenger Info
          </button>
        </div>
      </template>
    </main>
  </div>
</template>
