<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps<{ selectedSeats: string[]; occupiedSeats: string[] }>()
const emit = defineEmits<{ toggle: [seat: string] }>()
const viewMode = ref<'seat' | 'list'>('seat')
const seatRows = ['A', 'B', 'C', 'D'].map((letter) => ({ letter, seats: Array.from({ length: 11 }, (_, index) => `${index + 1}${letter}`) }))
const allSeats = computed(() => seatRows.flatMap((row) => row.seats))
function seatStatus(seat: string) { return props.occupiedSeats.includes(seat) ? 'occupied' : props.selectedSeats.includes(seat) ? 'selected' : 'available' }
</script>
<template>
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
                      @click="emit('toggle', seat)"
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
                @click="emit('toggle', seat)"
              >
                {{ seat }}
              </button>
            </div>

</template>
