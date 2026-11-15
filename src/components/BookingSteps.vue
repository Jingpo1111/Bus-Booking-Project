<script setup lang="ts">
defineProps<{ prefix: string; current: number }>()
const labels = ['Select Bus', 'Select Seat', 'Passenger Info', 'Confirm Booking']
</script>
<template>
  <div :class="`${prefix}-step-wrapper`"><div :class="`${prefix}-steps`">
    <template v-for="(label, index) in labels" :key="label">
      <div :class="[`${prefix}-step`, { current: index + 1 === current, [prefix === 'payment' ? 'done' : 'completed']: index + 1 < current }]">
        <span>{{ index + 1 < current ? '✓' : index + 1 }}</span> {{ label }}
      </div>
      <div v-if="index < labels.length - 1" :class="[prefix === 'payment' ? 'payment-line' : `${prefix}-step-line`, { active: index + 1 < current }]"></div>
    </template>
  </div></div>
</template>
