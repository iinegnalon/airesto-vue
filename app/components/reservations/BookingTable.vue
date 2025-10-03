<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import moment from 'moment/moment';
import TableColumn from './TableColumn.vue';
import { useReservationsStore } from '~/store/reservations';
import { formatMinutesToTime, getDay } from '~/utils/utils';

const stepMinutes = 30;

const reservationsStore = useReservationsStore();

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
const restaurantOpenMinutes = computed(
  () => reservationsStore.restaurantOpenMinutes,
);
const restaurantTotalMinutes = computed(
  () => reservationsStore.restaurantTotalMinutes,
);

onMounted(() => {
  reservationsStore.load();
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
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>

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

      <div class="booking-table">
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
    </div>

    <div v-else>No reservations</div>
  </div>
</template>

<style lang="scss" scoped>
.booking-table-wrapper {
  padding: 20px;
}

.booking-table {
  display: flex;
  width: 100%;
  min-height: 1040px;
  position: relative;
  margin-top: var(--table-column-info-height);
  margin-bottom: 20px;

  &__title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  &__filters {
    display: inline-flex;
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
