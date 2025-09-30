<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import type { BookingResponse } from '~/models/reservations';
import TableColumn from '~/components/reservations/TableColumn';
import { fetchReservations } from '~/api/reservations';
import { durationMinutes, getMinutesFromHHmm } from '~/utils/utils';

const stepMinutes = 30;

const reservations = ref<BookingResponse>(null);
const loading = ref(true);

const openMinutes = computed(() => {
  return getMinutesFromHHmm(reservations.value.restaurant.opening_time);
});
const closeMinutes = computed(() => {
  return getMinutesFromHHmm(reservations.value.restaurant.closing_time);
});
const totalMinutes = computed(() => {
  return durationMinutes(openMinutes.value, closeMinutes.value);
});
const timeSlots = computed(() => {
  if (!reservations.value) return [];

  return generateTimeSlots();
});

onMounted(() => {
  initTable();
});

async function initTable() {
  try {
    reservations.value = await fetchReservations();
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let i = 0; i <= totalMinutes.value; i += stepMinutes) {
    const minutes = (openMinutes.value + i) % (24 * 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    slots.push(
      `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`,
    );
  }

  return slots;
}
</script>

<template>
  <div class="booking-table-wrapper">
    <div v-if="loading">Loading...</div>

    <div v-else-if="reservations" class="booking-table">
      <div class="booking-table__dividers">
        <div
          v-for="(_, index) in timeSlots"
          :key="index"
          :style="{
            top: `${((stepMinutes * index) / totalMinutes) * 100}%`,
          }"
          class="booking-table__divider"
        ></div>
      </div>

      <div class="booking-table__hours">
        <div
          v-for="(time, index) in timeSlots"
          :key="index"
          :style="{
            top: `${((stepMinutes * index) / totalMinutes) * 100}%`,
          }"
          class="booking-table__hour"
        >
          {{ time }}
        </div>
      </div>

      <TableColumn
        v-for="table in reservations.tables"
        :key="table.id"
        :restaurant="reservations.restaurant"
        :table="table"
      />
    </div>

    <div v-else>No reservations</div>
  </div>
</template>

<style lang="scss" scoped>
.booking-table {
  display: flex;
  width: 100%;
  min-height: 1040px;
  position: relative;

  &__hours {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 60px;
    flex-shrink: 0;
  }

  &__hour {
    position: absolute;
    font-size: 12px;
    color: #666;
    padding-right: 8px;
    text-align: right;
    width: 100%;
  }

  &__dividers {
  }

  &__divider {
    position: absolute;
    font-size: 12px;
    color: #666;
    padding-right: 8px;
    text-align: right;
    border-top: 1px solid #444;
    width: calc(100% - 60px);
    transform: translateX(60px);
  }
}
</style>
