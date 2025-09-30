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

const props = defineProps<{
  event: BookingEvent;
  openingTime: string;
  closingTime: string;
  index?: number;
  total?: number;
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
</script>

<template>
  <div
    :class="`booking-event--${event.status.toLowerCase()}`"
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

  &--new {
    background: rgba(0, 128, 255, 0.8);
  }

  &--bill {
    background: rgba(255, 165, 0, 0.8);
  }

  &--closed {
    background: rgba(128, 128, 128, 0.8);
  }

  &--banquet {
    background: rgba(128, 0, 128, 0.8);
  }
}
</style>
