export interface Trip {
  id: number
  from: string
  to: string
  company: string
  type: string
  departure: string
  duration: string
  seats: number
  price: number
  image: string
  amenities: string[]
}

export const trips: Trip[] = [
  {
    id: 1,
    from: 'Phnom Penh',
    to: 'Siem Reap',
    company: 'Angkor Express',
    type: 'VIP Bus',
    departure: '06:30',
    duration: '5h 30m',
    seats: 44,
    price: 12,
    image: '/images/siem-reap.jpg',
    amenities: ['Air Conditioning', 'Wi-Fi', 'USB Charging', 'Reclining Seats'],
  },
  {
    id: 2,
    from: 'Phnom Penh',
    to: 'Battambang',
    company: 'Mekong Bus',
    type: 'Standard Bus',
    departure: '08:00',
    duration: '4h 30m',
    seats: 45,
    price: 10,
    image: '/images/battambang.jpg',
    amenities: ['Air Conditioning', 'Comfortable Seats'],
  },
  {
    id: 3,
    from: 'Phnom Penh',
    to: 'Sihanoukville',
    company: 'Virak Buntham',
    type: 'VIP Bus',
    departure: '13:00',
    duration: '6h 00m',
    seats: 36,
    price: 15,
    image: '/images/sihanoukville.jpg',
    amenities: ['Air Conditioning', 'Wi-Fi', 'USB Charging'],
  },
  {
    id: 4,
    from: 'Phnom Penh',
    to: 'Kampot',
    company: 'Angkor Express',
    type: 'Standard Bus',
    departure: '09:30',
    duration: '3h 45m',
    seats: 40,
    price: 9,
    image: '/images/kampot.jpg',
    amenities: ['Air Conditioning', 'Comfortable Seats'],
  },
  {
    id: 5,
    from: 'Siem Reap',
    to: 'Phnom Penh',
    company: 'Mekong Bus',
    type: 'VIP Bus',
    departure: '14:00',
    duration: '5h 30m',
    seats: 44,
    price: 12,
    image: '/images/siem-reap.jpg',
    amenities: ['Air Conditioning', 'Wi-Fi', 'USB Charging'],
  },
]

export function getTrip(id: number) {
  return trips.find((trip) => trip.id === id)
}
