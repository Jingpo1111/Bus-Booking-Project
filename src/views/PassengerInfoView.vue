<script setup lang="ts">
import BookingSteps from '@/components/BookingSteps.vue'
import Navbar from '@/components/Navbar.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore, type Passenger } from '@/stores/bookingStore'
import { storeToRefs } from 'pinia'
import { getTrip } from '@/services/tripService'
import '@/assets/styles/passenger-info.css'

const route = useRoute()
const router = useRouter()

const bookingStore = useBookingStore()
const { booking } = storeToRefs(bookingStore)
const passengers = ref<Passenger[]>([])
const contactEmail = ref('')
const contactPhone = ref('')
const agreeTerms = ref(false)
const loading = ref(false)
const error = ref('')
const errors = ref<Record<string, string>>({})

const trip = computed(() => getTrip(Number(route.params.id)))

const totalPrice = computed(() => (trip.value?.price ?? 0) * (booking.value?.seats.length ?? 0))

const bookingValid = computed(() => {
  if (!booking.value || !trip.value) return false

  return (
    booking.value.tripId === trip.value.id &&
    booking.value.passengers >= 1 &&
    booking.value.passengers <= 6 &&
    booking.value.seats.length === booking.value.passengers &&
    new Set(booking.value.seats).size === booking.value.seats.length &&
    booking.value.seats.every((seat) => /^(?:[1-9]|10|11)[A-D]$/.test(seat))
  )
})

onMounted(() => {
  if (!bookingValid.value || !booking.value) {
    error.value = 'No valid booking found. Please select your seats first.'
    return
  }
  passengers.value = booking.value.seats.map((_, i) => booking.value?.passengersInfo[i] ?? { fullName: '', gender: '', phone: '' })
  contactEmail.value = booking.value.contact.email
  contactPhone.value = booking.value.contact.phone
})

function validateForm(): boolean {
  errors.value = {}

  passengers.value.forEach((passenger, index) => {
    if (passenger.fullName.trim().length < 2) {
      errors.value[`name-${index}`] = 'Enter a valid full name.'
    }

    if (!passenger.gender) {
      errors.value[`gender-${index}`] = 'Please select gender.'
    }

    if (passenger.phone.trim() && !/^\+?[0-9\s-]{8,16}$/.test(passenger.phone.trim())) {
      errors.value[`phone-${index}`] = 'Enter a valid phone number.'
    }
  })

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.value.trim())) {
    errors.value.email = 'Enter a valid email address.'
  }

  if (!/^\+?[0-9\s-]{8,16}$/.test(contactPhone.value.trim())) {
    errors.value.contactPhone = 'Enter a valid phone number.'
  }

  if (!agreeTerms.value) {
    errors.value.terms = 'Please accept the terms and conditions.'
  }

  return Object.keys(errors.value).length === 0
}

async function continueToPayment() {
  error.value = ''

  if (!bookingValid.value || !booking.value || !trip.value) {
    error.value = 'Booking information is missing or invalid.'
    return
  }

  if (!validateForm()) return

  loading.value = true

  try {
    const paymentData = {
      ...booking.value,
      total: totalPrice.value,
      passengersInfo: passengers.value.map((p) => ({
        fullName: p.fullName.trim(),
        gender: p.gender,
        phone: p.phone.trim(),
      })),
      contact: {
        email: contactEmail.value.trim(),
        phone: contactPhone.value.trim(),
      },
    }

    bookingStore.setBooking(paymentData)

    await router.push({
      path: `/trips/${trip.value.id}/payment`,
    })
  } catch {
    error.value = 'Unable to continue. Please try again.'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push(`/trips/${route.params.id}/seats`)
}
</script>

<template>
  <div class="passenger-page">
    <!-- NAVBAR -->
    <Navbar prefix="passenger" />

    <!-- BOOKING PROGRESS -->
    <BookingSteps prefix="passenger" :current="3" />


    <main class="passenger-container">
      <div class="passenger-heading">
        <h1>Passenger Information</h1>
        <p>Please enter the details for each passenger.</p>
      </div>

      <!-- NO BOOKING -->
      <div v-if="!bookingValid" class="passenger-empty">
        <h2>Booking Information Not Found</h2>
        <p>{{ error || 'Please select your bus and seats first.' }}</p>
        <RouterLink to="/trips">Find a Bus</RouterLink>
      </div>

      <form
        v-else-if="trip && booking"
        class="passenger-layout"
        novalidate
        @submit.prevent="continueToPayment"
      >
        <div class="passenger-main">
          <!-- PASSENGER FORMS -->
          <section v-for="(passenger, index) in passengers" :key="index" class="passenger-card">
            <div class="passenger-card-heading">
              <div class="passenger-card-title">
                <span class="passenger-number">{{ index + 1 }}</span>
                <div>
                  <h2>Passenger {{ index + 1 }}</h2>
                  <p>Enter passenger details</p>
                </div>
              </div>

              <span class="passenger-seat-badge"> Seat {{ booking.seats[index] }} </span>
            </div>

            <div class="passenger-fields">
              <div class="passenger-field full-width">
                <label :for="`passenger-name-${index}`"> Full Name <span>*</span> </label>
                <input
                  :id="`passenger-name-${index}`"
                  v-model.trim="passenger.fullName"
                  type="text"
                  placeholder="Enter full name"
                  autocomplete="off"
                  required
                />
                <small v-if="errors[`name-${index}`]" class="passenger-error">
                  {{ errors[`name-${index}`] }}
                </small>
              </div>

              <div class="passenger-field">
                <label :for="`passenger-gender-${index}`"> Gender <span>*</span> </label>
                <select :id="`passenger-gender-${index}`" v-model="passenger.gender" required>
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <small v-if="errors[`gender-${index}`]" class="passenger-error">
                  {{ errors[`gender-${index}`] }}
                </small>
              </div>

              <div class="passenger-field">
                <label :for="`passenger-phone-${index}`">
                  Phone Number <span class="optional">(Optional)</span>
                </label>
                <input
                  :id="`passenger-phone-${index}`"
                  v-model.trim="passenger.phone"
                  type="tel"
                  placeholder="e.g. 012345678"
                />
                <small v-if="errors[`phone-${index}`]" class="passenger-error">
                  {{ errors[`phone-${index}`] }}
                </small>
              </div>
            </div>
          </section>

          <!-- CONTACT INFORMATION -->
          <section class="passenger-card">
            <div class="passenger-card-heading">
              <div class="passenger-card-title">
                <span class="passenger-contact-icon">✉</span>
                <div>
                  <h2>Contact Information</h2>
                  <p>We'll use these details for booking updates.</p>
                </div>
              </div>
            </div>

            <div class="passenger-fields">
              <div class="passenger-field">
                <label for="contact-email"> Email Address <span>*</span> </label>
                <input
                  id="contact-email"
                  v-model.trim="contactEmail"
                  type="email"
                  placeholder="example@email.com"
                  autocomplete="email"
                  required
                />
                <small v-if="errors.email" class="passenger-error">
                  {{ errors.email }}
                </small>
              </div>

              <div class="passenger-field">
                <label for="contact-phone"> Phone Number <span>*</span> </label>
                <input
                  id="contact-phone"
                  v-model.trim="contactPhone"
                  type="tel"
                  placeholder="012345678"
                  autocomplete="tel"
                  required
                />
                <small v-if="errors.contactPhone" class="passenger-error">
                  {{ errors.contactPhone }}
                </small>
              </div>
            </div>
          </section>

          <!-- TERMS -->
          <section class="passenger-card passenger-terms-card">
            <label class="passenger-checkbox">
              <input v-model="agreeTerms" type="checkbox" />
              <span>
                I confirm that the passenger information is correct and agree to the booking terms
                and conditions.
              </span>
            </label>
            <small v-if="errors.terms" class="passenger-error">
              {{ errors.terms }}
            </small>
          </section>

          <p v-if="error" class="passenger-alert" role="alert">
            {{ error }}
          </p>
        </div>

        <!-- SUMMARY -->
        <aside class="passenger-sidebar">
          <div class="passenger-summary">
            <h2>Booking Summary</h2>

            <div class="passenger-summary-route">
              <strong>{{ trip.from }}</strong>
              <span>→</span>
              <strong>{{ trip.to }}</strong>
            </div>

            <div class="passenger-summary-row">
              <span>Bus Operator</span>
              <strong>{{ trip.company }}</strong>
            </div>

            <div class="passenger-summary-row">
              <span>Bus Type</span>
              <strong>{{ trip.type }}</strong>
            </div>

            <div class="passenger-summary-row">
              <span>Travel Date</span>
              <strong>{{ booking.date || 'Not selected' }}</strong>
            </div>

            <div class="passenger-summary-row">
              <span>Departure</span>
              <strong>{{ trip.departure }}</strong>
            </div>

            <div class="passenger-summary-row">
              <span>Duration</span>
              <strong>{{ trip.duration }}</strong>
            </div>

            <div class="passenger-summary-divider"></div>

            <h3>Selected Seats</h3>

            <div class="passenger-seat-list">
              <span v-for="seat in booking.seats" :key="seat">
                {{ seat }}
              </span>
            </div>

            <div class="passenger-summary-row">
              <span>Passengers</span>
              <strong>{{ booking.passengers }}</strong>
            </div>

            <div class="passenger-summary-row">
              <span>Price per Seat</span>
              <strong>${{ trip.price.toFixed(2) }}</strong>
            </div>

            <div class="passenger-summary-total">
              <span>Total Amount</span>
              <strong>${{ totalPrice.toFixed(2) }}</strong>
            </div>

            <div class="passenger-secure-note">Your information is used for this booking.</div>
          </div>
        </aside>

        <!-- BOTTOM ACTIONS -->
        <div class="passenger-actions">
          <button type="button" class="passenger-back-btn" @click="goBack">
            ← Back to Seat Selection
          </button>

          <button type="submit" class="passenger-next-btn" :disabled="loading">
            {{ loading ? 'Processing...' : 'Continue to Payment →' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>
