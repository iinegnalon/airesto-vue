<script lang="ts" setup>
import { computed, ref } from 'vue';
import {
  durationMinutes,
  formatMinutesToTime,
  getMinutesFromISO,
} from '~/utils/utils';
import type { BookingEvent } from '~/models/reservations';
import { useReservationsStore } from '~/store/reservations';
import IconPhone from '~/components/icons/IconPhone.vue';

const props = defineProps<{
  event: BookingEvent;
}>();

const reservationsStore = useReservationsStore();

const startMinutes = getMinutesFromISO(props.event.start_time);
const endMinutes = getMinutesFromISO(props.event.end_time);
const eventDuration = durationMinutes(startMinutes, endMinutes);

const hovered = ref(false);

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
const statusClass = computed(() => {
  const status = props.event.status.toLowerCase();

  if (status === 'bill') return 'booking-event__status--bill';
  if (status === 'новая') return 'booking-event__status--new';
  if (status === 'заявка') return 'booking-event__status--application';
  if (status === 'открыт') return 'booking-event__status--open';

  return '';
});
const displayStatus = computed(() => {
  if (props.event.type === 'order') {
    switch (props.event.status) {
      case 'New':
        return 'Новый';
      case 'Bill':
        return 'Пречек';
      case 'Closed':
        return 'Закрыт';
      case 'Banquet':
        return 'Банкет';
      default:
        return props.event.status;
    }
  }

  if (props.event.type === 'reservation') {
    switch (props.event.status) {
      case 'Новая':
        return 'Ожидает подтверждения';
      case 'Открыт':
        return 'В зале';
      case 'Закрыт':
        return 'Отменен';
      case 'Живая очередь':
        return 'Живая очередь';
      case 'Заявка':
        return 'Ожидаем';
      default:
        return props.event.status;
    }
  }

  return props.event.status;
});

function copyNumber(number: string) {
  navigator.clipboard.writeText(number);
}
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
    <div
      class="booking-event__content"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <!-- Banquet -->
      <template v-if="event.status === 'Banquet'">
        <div class="booking-event__title">Банкет</div>
        <div class="booking-event__time">{{ startHour }}–{{ endHour }}</div>
      </template>

      <!-- Order -->
      <template v-else-if="event.type === 'order'">
        <div class="booking-event__title">Заказ</div>
        <div :class="statusClass" class="booking-event__status">
          {{ displayStatus }}
        </div>
        <div class="booking-event__time">{{ startHour }}–{{ endHour }}</div>
      </template>

      <!-- Reservation -->
      <template v-else-if="event.type === 'reservation'">
        <div class="booking-event__number">№{{ event.id }}</div>
        <div class="booking-event__title">
          {{ event.name_for_reservation }}; {{ event.num_people
          }}<span class="regular">чел</span>
        </div>
        <div :class="statusClass" class="booking-event__status">
          {{ displayStatus }}
        </div>
        <div
          class="booking-event__phone"
          @click="copyNumber(event.phone_number)"
        >
          <IconPhone />
          {{ event.phone_number }}
        </div>
        <div class="booking-event__time">{{ startHour }}–{{ endHour }}</div>
      </template>
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
  overflow: hidden;
  color: var(--text);
  border-left: 2px solid var(--green);
  backdrop-filter: none;
  transition: all 0.2s ease;

  &:has(&__content:hover) {
    z-index: 1;
    min-width: fit-content;
    min-height: fit-content;
    backdrop-filter: blur(2px);
    white-space: nowrap;
  }

  &__content {
    display: flex;
    flex-direction: column;
    min-height: 80px;
  }

  &__number {
    font-size: 8px;
    line-height: 8px;
  }

  &__title {
    font-weight: 600;

    .regular {
      font-weight: normal;
      font-size: 8px;
    }
  }

  &__status {
    padding: 2px;
    background: var(--white-12);
    border-radius: 4px;
    width: fit-content;
    font-weight: 600;
    font-size: 8px;
    line-height: 8px;
    white-space: nowrap;
    color: white;

    &--bill {
      background: var(--dark-green-32);
    }

    &--new {
      background: var(--accent);
    }

    &--application {
      background: var(--blue-10);
      color: var(--blue);
    }

    &--open {
      background: var(--dark-green-32);
    }
  }

  &__phone {
    display: flex;
    align-items: center;
    width: fit-content;
    cursor: pointer;

    .icon-phone {
      color: var(--text);
    }
  }

  &--order {
    background: var(--green-16);
    border-color: var(--green);
  }

  &--banquet {
    background: var(--purple-16);
    border-color: var(--purple);
  }

  &--queue {
    background: var(--blue-16);
    border-color: var(--blue);
  }

  &--reservation {
    background: var(--red-16);
    border-color: var(--red);
  }
}
</style>
