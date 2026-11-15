import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Passenger {
  fullName: string
  gender: string
  phone: string
}

export interface PendingBooking {
  tripId: number
  date: string
  passengers: number
  seats: string[]
  total: number
  passengersInfo: Passenger[]
  contact: { email: string; phone: string }
}

export const useBookingStore = defineStore('booking', () => {
  const booking = ref<PendingBooking | null>(null)
  try {
    const saved = sessionStorage.getItem('pendingBooking')
    if (saved) {
      const data = JSON.parse(saved)
      if (data && typeof data.tripId === 'number' && typeof data.date === 'string' &&
          Number.isInteger(data.passengers) && Array.isArray(data.seats) &&
          data.seats.every((seat: unknown) => typeof seat === 'string') && typeof data.total === 'number') {
        booking.value = { ...data, passengersInfo: Array.isArray(data.passengersInfo) ? data.passengersInfo : [],
          contact: data.contact ?? { email: '', phone: '' } }
      }
    }
  } catch { /* Ignore invalid saved data. */ }
  watch(booking, (value) => {
    if (value) sessionStorage.setItem('pendingBooking', JSON.stringify(value))
    else sessionStorage.removeItem('pendingBooking')
  }, { deep: true, flush: 'sync' })
  function setBooking(value: PendingBooking) { booking.value = value }
  function clear() { booking.value = null }
  return { booking, setBooking, clear }
})
