<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import moment from 'moment/moment';
import momentTimezone from 'moment-timezone';
import TableColumn from './TableColumn.vue';
import TableScaleController from './TableScaleController.vue';
import { useReservationsStore } from '~/store/reservations';
import { formatMinutesToTime, getDay } from '~/utils/utils';
import BaseLoader from '~/components/common/BaseLoader.vue';

const stepMinutes = 30;
const baseCellHeight = 16;
const scaleY = 4;

const reservationsStore = useReservationsStore();

let timer: number | undefined;

const currentTimePercent = ref<number | null>(null);

const reservations = computed(() => reservationsStore.data);
const filteredTables = computed(() => reservationsStore.filteredTables);
const availableDays = computed(() => reservationsStore.availableDays);
const allZones = computed(() => reservationsStore.allZones);
const selectedDay = computed(() => reservationsStore.selectedDay);
const selectedZones = computed(() => reservationsStore.selectedZones);
const loading = computed(() => reservationsStore.loading);
const currentDay = computed(() => reservationsStore.data?.current_day ?? '');
const timeSlots = computed(() => {
  if (!reservations.value) return [];
  return generateTimeSlots();
});
// Restaurant opening time in minutes from midnight (11:00 = 660)
const restaurantOpenMinutes = computed(
  () => reservationsStore.restaurantOpenMinutes,
);
// Total duration the restaurant is open in minutes (11:00-23:40 = 760)
const restaurantTotalMinutes = computed(
  () => reservationsStore.restaurantTotalMinutes,
);
// Calculate table height with scale
const tableHeight = computed(() => {
  return (
    (restaurantTotalMinutes.value / stepMinutes) *
    (baseCellHeight + reservationsStore.scale * scaleY)
  );
});

onMounted(() => {
  reservationsStore.load();

  // Synchronize time every 15 seconds
  timer = window.setInterval(updateCurrentTime, 15 * 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

watch(reservations, () => {
  updateCurrentTime();
});

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let i = 0; i <= restaurantTotalMinutes.value; i += stepMinutes) {
    const minutes = (restaurantOpenMinutes.value + i) % (24 * 60);
    const time = formatMinutesToTime(minutes);
    slots.push(time);
  }

  return slots;
}

function topPercent(index: number): number {
  return ((stepMinutes * index) / restaurantTotalMinutes.value) * 100;
}

function updateCurrentTime() {
  if (!reservations.value) return;

  const tz = reservations.value.restaurant.timezone;
  const now = momentTimezone().tz(tz);
  const nowMinutes = now.hours() * 60 + now.minutes();

  const percent =
    ((nowMinutes - restaurantOpenMinutes.value) /
      restaurantTotalMinutes.value) *
    100;

  currentTimePercent.value = null;
  if (percent >= 0 && percent <= 100) {
    currentTimePercent.value = percent;
  }
}
</script>

<template>
  <div>
    <BaseLoader v-if="loading" />

    <div v-else-if="reservations" class="booking-table-wrapper">
      <div class="booking-table__title">Бронирования</div>

      <div class="booking-table__filters">
        <div class="booking-table__filters-date">
          <button
            v-for="(date, index) in availableDays"
            :key="index"
            :class="{ active: selectedDay === date }"
            class="filter-button"
            @click="reservationsStore.setDay(date)"
          >
            <span class="bold">
              {{ moment(date).locale('ru').format('D MMMM') }}
            </span>
            <span>{{ getDay(date, currentDay) }}</span>
          </button>
        </div>
        <div class="booking-table__filters-zone">
          <button
            v-for="zone in allZones"
            :key="zone"
            :class="{ active: selectedZones.includes(zone) }"
            class="filter-button"
            @click="reservationsStore.toggleZone(zone)"
          >
            {{ zone }}
          </button>
        </div>
      </div>

      <div
        :style="{
          height: `${tableHeight}px`,
        }"
        class="booking-table"
      >
        <div
          v-if="currentTimePercent !== null"
          :style="{ top: currentTimePercent + '%' }"
          class="booking-table__current-time"
        />

        <div class="booking-table__dividers">
          <div
            v-for="(_, index) in timeSlots"
            :key="index"
            :style="{
              top: `${topPercent(index)}%`,
            }"
            class="booking-table__divider"
          ></div>
        </div>

        <div class="booking-table__hours">
          <div
            v-for="(time, index) in timeSlots"
            :key="index"
            :style="{
              top: `${topPercent(index)}%`,
            }"
            class="booking-table__hour"
          >
            {{ time }}
          </div>
        </div>

        <TableColumn
          v-for="table in filteredTables"
          :key="table.id"
          :restaurant="reservations.restaurant"
          :table="table"
        />
      </div>

      <TableScaleController />
    </div>

    <div v-else>No reservations</div>
  </div>
</template>

<style lang="scss" scoped>
.booking-table-wrapper {
  display: flex;
  flex-direction: column;
}

.booking-table {
  display: flex;
  width: fit-content;
  position: relative;
  margin-top: var(--table-column-info-height);
  margin-bottom: 20px;
  padding-right: 2rem;

  &__title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  &__filters {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
    flex-wrap: wrap;

    &-date,
    &-zone {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-button {
      display: flex;
      flex-direction: column;
      text-align: left;

      &.active {
        background-color: #007aff;

        &:hover {
          background-color: rgba(0, 122, 255, 0.8);
        }
      }

      .bold {
        font-weight: bold;
      }
    }

    &-zone .filter-button {
      padding: 4px 6px;
      line-height: 16px;
      background-color: rgba(255, 255, 255, 0.08);

      &:hover {
        background-color: rgba(255, 255, 255, 0.12);
      }
    }
  }

  &__title,
  &__filters {
    width: fit-content;
    position: sticky;
    left: 2rem;
  }

  &__hours {
    position: sticky;
    left: 0;
    display: flex;
    flex-direction: column;
    width: var(--table-column-time-width);
    flex-shrink: 0;
    z-index: 10;
  }

  &__hour {
    position: absolute;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.48);
    padding-right: 8px;
    text-align: right;
    width: 100%;
  }

  &__divider,
  &__current-time {
    position: absolute;
    border-top: 1px solid rgba(255, 255, 255, 0.16);
    width: calc(100% - var(--table-column-time-width) - 2rem);
    transform: translateX(var(--table-column-time-width));
  }

  &__current-time {
    border-color: #ff7043;
  }
}
</style>
