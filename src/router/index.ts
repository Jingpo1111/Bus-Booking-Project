import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/trips',
      name: 'trips',
      component: () => import('@/views/TripListView.vue'),
    },
    {
      path: '/trips/:id',
      name: 'trip-detail',
      component: () => import('@/views/TripDetailView.vue'),
      props: true,
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: () => import('@/views/MyBookingsView.vue'),
    },
    {
      path: '/trips/:id/seats',
      name: 'seat-selection',
      component: () => import('@/views/SeatSelectionView.vue'),
      props: true,
    },
    {
      path: '/trips/:id/passengers',
      name: 'passenger-info',
      component: () => import('@/views/PassengerInfoView.vue'),
      props: true,
    },
    {
      path: '/trips/:id/payment',
      name: 'payment',
      component: () => import('@/views/PaymentView.vue'),
      props: true,
    },
  ],
})

export default router
