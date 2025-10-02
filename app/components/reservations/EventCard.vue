<script lang="ts" setup>
import { computed } from 'vue';
import {
  durationMinutes,
  formatMinutesToTime,
  getMinutesFromISO,
} from '~/utils/utils';
import type { BookingEvent } from '~/models/reservations';
import { useReservationsStore } from '~/store/reservations';

const props = defineProps<{
  event: BookingEvent;
}>();

const reservationsStore = useReservationsStore();

const startMinutes = getMinutesFromISO(props.event.start_time);
const endMinutes = getMinutesFromISO(props.event.end_time);
const eventDuration = durationMinutes(startMinutes, endMinutes);

const restaurantOpenMinutes = computed(
  () => reservationsStore.restaurantOpenMinutes,
);
const restaurantTotalMinutes = computed(
  () => reservationsStore.restaurantTotalMinutes,
);
const topPercent = computed(
  () =>
    ((startMinutes - restaurantOpenMinutes.value) /
      restaurantTotalMinutes.value) *
    100,
);
const heightPercent = computed(
  () => (eventDuration / restaurantTotalMinutes.value) * 100,
);
const startHour = computed(() => formatMinutesToTime(startMinutes));
const endHour = computed(() => formatMinutesToTime(endMinutes));
const eventClass = computed(() => {
  const status = props.event.status.toLowerCase();

  if (status === 'banquet') return 'booking-event--banquet';
  if (status === 'живая очередь') return 'booking-event--queue';
  if (props.event.type === 'order') return 'booking-event--order';
  if (props.event.type === 'reservation') return 'booking-event--reservation';

  return '';
});
</script>

<template>
  <div
    :class="eventClass"
    :style="{
      top: topPercent + '%',
      height: heightPercent + '%',
      left: `calc(${100 / event.row_count}% * ${event.row_index} + ${event.offset_index * 4}px)`,
      width: `calc(${100 / event.row_count}% - ${event.offset_index * 4}px)`,
    }"
    class="booking-event"
  >
    <div class="booking-event__content">
      <div class="booking-event__title">
        {{ event.name_for_reservation ?? event.status }}
        {{ event.start_min }}
        {{ event.row_index + 1 }}/{{ event.row_count }}
      </div>
      <div class="booking-event__time">{{ startHour }}–{{ endHour }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.booking-event {
  width: 100%;
  position: absolute;
  border-radius: 4px;
  padding: 2px 6px;
  box-sizing: border-box;
  font-size: 11px;
  overflow: hidden;
  color: #fff;
  border-left: 2px solid #7fd7cc;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    font-weight: 600;
    font-size: 12px;
  }

  &__time {
    font-size: 11px;
    opacity: 0.8;
  }

  &--order {
    background: rgba(127, 215, 204, 0.16);
    border-color: #7fd7cc;
  }

  &--banquet {
    background: rgba(179, 72, 247, 0.16);
    border-color: #b348f7;
  }

  &--queue {
    background: rgba(0, 151, 253, 0.16);
    border-color: #0097fd;
  }

  &--reservation {
    background: rgba(255, 112, 67, 0.16);
    border-color: #ff7043;
  }
}
</style>
