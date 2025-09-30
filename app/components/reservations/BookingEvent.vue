<script lang="ts" setup>
import { computed } from 'vue';
import {
  durationMinutes,
  getMinutesFromHHmm,
  getMinutesFromISO,
} from '~/utils/utils';

interface BookingEvent {
  id: string | number;
  status: string;
  start_time: string;
  end_time: string;
  name_for_reservation?: string;
}

type EventType = 'order' | 'reservation';

const props = defineProps<{
  event: BookingEvent;
  openingTime: string;
  closingTime: string;
  index?: number;
  total?: number;
  type: EventType;
}>();

const openMinutes = getMinutesFromHHmm(props.openingTime);
const closeMinutes = getMinutesFromHHmm(props.closingTime);
const totalMinutes = durationMinutes(openMinutes, closeMinutes);

const startMinutes = getMinutesFromISO(props.event.start_time);
const endMinutes = getMinutesFromISO(props.event.end_time);
const eventDuration = durationMinutes(startMinutes, endMinutes);

const topPercent = computed(
  () => ((startMinutes - openMinutes) / totalMinutes) * 100,
);
const heightPercent = computed(() => (eventDuration / totalMinutes) * 100);
const leftOffset = computed(() =>
  props.total && props.total > 1 ? (100 / props.total) * (props.index ?? 0) : 0,
);
const widthPercent = computed(() =>
  props.total && props.total > 1 ? 100 / props.total : 100,
);
const startHour = computed(
  () =>
    String(Math.floor(startMinutes / 60)).padStart(2, '0') +
    ':' +
    String(startMinutes % 60).padStart(2, '0'),
);
const endHour = computed(
  () =>
    String(Math.floor(endMinutes / 60)).padStart(2, '0') +
    ':' +
    String(endMinutes % 60).padStart(2, '0'),
);
const eventClass = computed(() => {
  if (props.event.status.toLowerCase() === 'banquet') {
    return 'booking-event--banquet';
  }

  if (props.event.status.toLowerCase() === 'живая очередь') {
    return 'booking-event--queue';
  }

  if (props.type === 'order') {
    return 'booking-event--order';
  }

  if (props.type === 'reservation') {
    return 'booking-event--reservation';
  }
});
</script>

<template>
  <div
    :class="eventClass"
    :style="{
      top: topPercent + '%',
      height: heightPercent + '%',
      left: leftOffset + '%',
      width: widthPercent + '%',
    }"
    class="booking-event"
  >
    <div class="booking-event__content">
      <div class="booking-event__title">
        {{ event.name_for_reservation ?? event.status }}
      </div>
      <div class="booking-event__time">{{ startHour }}–{{ endHour }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.booking-event {
  position: absolute;
  border-radius: 4px;
  padding: 2px 4px;
  box-sizing: border-box;
  font-size: 12px;
  overflow: hidden;
  color: #fff;
  background: #7fd7cc;

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
    background: #7fd7cc;
  }

  &--banquet {
    background: #b348f7;
  }

  &--queue {
    background: #0097fd;
  }

  &--reservation {
    background: #ff7043;
  }
}
</style>
