<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/my-bookings.css'

type BookingStatus = 'Upcoming' | 'Completed' | 'Cancelled'
type BookingFilter = 'All' | BookingStatus

interface Booking {
  id: string
  tripId: number
  from: string
  to: string
  company: string
  busType: string
  date: string
  time: string
  seats: string[]
  total: number
  status: BookingStatus
  image: string
}

const router = useRouter()

// Frontend prototype data.
// Replace with your Pinia store and mock API later.
const bookings = ref<Booking[]>([
  {
    id: 'BK000842',
    tripId: 1,
    from: 'Phnom Penh',
    to: 'Siem Reap',
    company: 'Angkor Express',
    busType: 'VIP Bus',
    date: '2026-11-20',
    time: '06:30 AM',
    seats: ['3C', '3D'],
    total: 24,
    status: 'Upcoming',
    image: '/images/siem-reap.jpg',
  },
  {
    id: 'BK000841',
    tripId: 2,
    from: 'Phnom Penh',
    to: 'Battambang',
    company: 'Mekong Bus',
    busType: 'Standard Bus',
    date: '2026-11-18',
    time: '08:00 AM',
    seats: ['5A'],
    total: 10,
    status: 'Upcoming',
    image: '/images/battambang.jpg',
  },
  {
    id: 'BK000838',
    tripId: 3,
    from: 'Phnom Penh',
    to: 'Sihanoukville',
    company: 'Virak Buntham',
    busType: 'VIP Bus',
    date: '2026-11-10',
    time: '01:00 PM',
    seats: ['2A', '2B'],
    total: 30,
    status: 'Completed',
    image: '/images/sihanoukville.jpg',
  },
  {
    id: 'BK000835',
    tripId: 4,
    from: 'Phnom Penh',
    to: 'Kampot',
    company: 'Angkor Express',
    busType: 'Standard Bus',
    date: '2026-11-05',
    time: '09:30 AM',
    seats: ['7C'],
    total: 9,
    status: 'Cancelled',
    image: '/images/kampot.jpg',
  },
])

const activeFilter = ref<BookingFilter>('All')
const search = ref('')
const selectedBooking = ref<Booking | null>(null)
const cancelTarget = ref<Booking | null>(null)
const message = ref('')

const filters: BookingFilter[] = ['All', 'Upcoming', 'Completed', 'Cancelled']

const counts = computed(() => ({
  All: bookings.value.length,
  Upcoming: bookings.value.filter((b) => b.status === 'Upcoming').length,
  Completed: bookings.value.filter((b) => b.status === 'Completed').length,
  Cancelled: bookings.value.filter((b) => b.status === 'Cancelled').length,
}))

const filteredBookings = computed(() => {
  const term = search.value.trim().toLowerCase()

  return bookings.value.filter((booking) => {
    const matchesStatus = activeFilter.value === 'All' || booking.status === activeFilter.value

    const searchable = [booking.id, booking.from, booking.to, booking.company, booking.busType]
      .join(' ')
      .toLowerCase()

    return matchesStatus && searchable.includes(term)
  })
})

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}

function viewBooking(booking: Booking) {
  selectedBooking.value = booking
}

function confirmCancel() {
  if (!cancelTarget.value) return

  const booking = bookings.value.find((b) => b.id === cancelTarget.value?.id)

  if (booking && booking.status === 'Upcoming') {
    booking.status = 'Cancelled'
    message.value = `Booking ${booking.id} cancelled (demo only).`
  }

  cancelTarget.value = null
}

function downloadTicket(booking: Booking) {
  const content = [
    'BOOKINGBUS - TICKET',
    `Booking ID: ${booking.id}`,
    `Route: ${booking.from} -> ${booking.to}`,
    `Operator: ${booking.company}`,
    `Date: ${booking.date}`,
    `Time: ${booking.time}`,
    `Seats: ${booking.seats.join(', ')}`,
    `Total: $${booking.total}`,
    `Status: ${booking.status}`,
    '',
    'Frontend prototype - not a valid travel ticket.',
  ].join('\n')

  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${booking.id}-ticket.txt`
  link.click()
  URL.revokeObjectURL(url)
}

function signOut() {
  sessionStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <div class="my-bookings-page">
    <!-- NAVBAR -->
    <header class="mb-navbar">
      <RouterLink to="/" class="mb-logo">
        <img src="/images/logo.png" alt="BookingBus" />
      </RouterLink>

      <nav class="mb-nav">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/trips">Routes</RouterLink>
        <RouterLink to="/my-bookings">My Bookings</RouterLink>
        <a href="#bookings-content">Help</a>
      </nav>

      <div class="mb-account">
        <span class="mb-avatar">JP</span>
        <span>My Account</span>
        <button type="button" @click="signOut">Sign Out</button>
      </div>
    </header>

    <!-- HERO -->
    <section class="mb-hero">
      <div class="mb-hero-overlay">
        <div class="mb-hero-content">
          <h1>My Bookings</h1>
          <p>Manage your bus tickets, view trip details, and track your journeys.</p>
        </div>
      </div>
    </section>

    <main id="bookings-content" class="mb-container">
      <div class="mb-breadcrumb">
        <RouterLink to="/">Home</RouterLink>
        <span>›</span>
        <strong>My Bookings</strong>
      </div>

      <div class="mb-layout">
        <!-- SIDEBAR -->
        <aside class="mb-sidebar">
          <div class="mb-profile">
            <div class="mb-profile-avatar">JP</div>
            <div>
              <strong>My Account</strong>
              <small>Passenger</small>
            </div>
          </div>

          <div class="mb-sidebar-menu">
            <RouterLink to="/my-bookings" class="mb-menu-active"> ▣ My Bookings </RouterLink>
            <RouterLink to="/login">♙ Account</RouterLink>
            <button type="button" @click="signOut">↪ Sign Out</button>
          </div>
        </aside>

        <!-- BOOKINGS -->
        <section class="mb-results">
          <div class="mb-section-title">
            <h2>Your Bookings</h2>
            <span>{{ bookings.length }} total bookings</span>
          </div>

          <div class="mb-toolbar">
            <div class="mb-tabs">
              <button
                v-for="filter in filters"
                :key="filter"
                type="button"
                :class="{ active: activeFilter === filter }"
                @click="activeFilter = filter"
              >
                {{ filter === 'All' ? 'All Bookings' : filter }}
                ({{ counts[filter] }})
              </button>
            </div>

            <input
              v-model="search"
              type="search"
              placeholder="Search booking ID, route, company..."
              aria-label="Search bookings"
            />
          </div>

          <p v-if="message" class="mb-message" role="status">
            {{ message }}
          </p>

          <!-- EMPTY STATE -->
          <div v-if="filteredBookings.length === 0" class="mb-empty">
            <div>🚌</div>
            <h3>No bookings found</h3>
            <p>You don't have any bookings matching these filters.</p>
            <RouterLink to="/trips">Explore Routes</RouterLink>
          </div>

          <!-- BOOKING CARDS -->
          <div v-else class="mb-booking-list">
            <article v-for="booking in filteredBookings" :key="booking.id" class="mb-booking-card">
              <img :src="booking.image" :alt="booking.to" class="mb-booking-image" />

              <div class="mb-booking-info">
                <h3>
                  {{ booking.from }}
                  <span>→</span>
                  {{ booking.to }}
                </h3>

                <p>{{ booking.company }} | {{ booking.busType }}</p>

                <div class="mb-booking-meta">
                  <span>▣ {{ formatDate(booking.date) }}</span>
                  <span>◷ {{ booking.time }}</span>
                  <span>♧ Seats: {{ booking.seats.join(', ') }}</span>
                </div>
              </div>

              <div class="mb-booking-id">
                <small>Booking ID</small>
                <strong>{{ booking.id }}</strong>
              </div>

              <div class="mb-booking-price">
                <small>Total</small>
                <strong>${{ booking.total }}</strong>
              </div>

              <div class="mb-booking-actions">
                <span class="mb-status" :class="booking.status.toLowerCase()">
                  {{ booking.status }}
                </span>

                <div class="mb-action-buttons">
                  <button type="button" class="mb-outline-btn" @click="viewBooking(booking)">
                    View
                  </button>

                  <button
                    v-if="booking.status === 'Upcoming'"
                    type="button"
                    class="mb-cancel-btn"
                    @click="cancelTarget = booking"
                  >
                    Cancel
                  </button>

                  <button
                    v-if="booking.status === 'Completed'"
                    type="button"
                    class="mb-outline-btn"
                    @click="downloadTicket(booking)"
                  >
                    Download Ticket
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>

    <!-- VIEW BOOKING MODAL -->
    <div v-if="selectedBooking" class="mb-modal-backdrop" @click.self="selectedBooking = null">
      <section class="mb-modal" role="dialog" aria-modal="true" aria-labelledby="mb-modal-title">
        <button
          type="button"
          class="mb-modal-close"
          aria-label="Close"
          @click="selectedBooking = null"
        >
          ×
        </button>

        <h2 id="mb-modal-title">Booking Details</h2>

        <div class="mb-modal-details">
          <p><strong>ID:</strong> {{ selectedBooking.id }}</p>
          <p>
            <strong>Route:</strong>
            {{ selectedBooking.from }} → {{ selectedBooking.to }}
          </p>
          <p><strong>Company:</strong> {{ selectedBooking.company }}</p>
          <p><strong>Date:</strong> {{ formatDate(selectedBooking.date) }}</p>
          <p><strong>Time:</strong> {{ selectedBooking.time }}</p>
          <p><strong>Seats:</strong> {{ selectedBooking.seats.join(', ') }}</p>
          <p><strong>Total:</strong> ${{ selectedBooking.total }}</p>
          <p><strong>Status:</strong> {{ selectedBooking.status }}</p>
        </div>

        <button type="button" class="mb-primary-btn" @click="selectedBooking = null">Close</button>
      </section>
    </div>

    <!-- CANCEL CONFIRMATION -->
    <div v-if="cancelTarget" class="mb-modal-backdrop" @click.self="cancelTarget = null">
      <section
        class="mb-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="mb-cancel-title"
      >
        <h2 id="mb-cancel-title">Cancel Booking?</h2>
        <p>
          Are you sure you want to cancel
          <strong>{{ cancelTarget.id }}</strong
          >?
        </p>

        <div class="mb-modal-buttons">
          <button type="button" class="mb-outline-btn" @click="cancelTarget = null">
            Keep Booking
          </button>

          <button type="button" class="mb-cancel-btn" @click="confirmCancel">Yes, Cancel</button>
        </div>
      </section>
    </div>

    <footer class="mb-footer">© 2026 BookingBus. All rights reserved.</footer>
  </div>
</template>
