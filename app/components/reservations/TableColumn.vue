<script lang="ts" setup>
import { computed } from 'vue';
import EventCard from './EventCard.vue';
import {
  BookingEvent,
  EventType,
  Restaurant,
  Table,
} from '~/models/reservations';

const props = defineProps<{
  table: Table;
  restaurant: Restaurant;
}>();

// Merged and sorted events
const mergedEvents = computed<BookingEvent[]>(() => {
  return [
    ...props.table.orders.map((o) => ({
      id: o.id,
      start_time: o.start_time,
      end_time: o.end_time,
      status: o.status,
      type: 'order' as EventType,
    })),
    ...props.table.reservations.map((r) => ({
      id: r.id,
      start_time: r.seating_time,
      end_time: r.end_time,
      status: r.status,
      type: 'reservation' as EventType,
      name_for_reservation: r.name_for_reservation,
    })),
  ].sort((a, b) => a.start_time.localeCompare(b.start_time));
});
</script>

<template>
  <div class="table-column">
    <div class="table-column__info">
      <div>#{{ table.number }}</div>
      <div>{{ table.capacity }} чел</div>
      <div>{{ table.zone }}</div>
    </div>

    <EventCard
      v-for="event in mergedEvents"
      :key="event.id"
      :closing-time="restaurant.closing_time"
      :event="event"
      :opening-time="restaurant.opening_time"
    />
  </div>
</template>

<style lang="scss" scoped>
.table-column {
  position: relative;
  border-right: 1px solid #444;
  width: 100%;
  min-width: 80px;

  &:last-child {
    border-right: none;
  }

  &__info {
    height: var(--table-column-info-height);
    position: absolute;
    top: calc(-1 * var(--table-column-info-height));
    display: flex;
    gap: 4px;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
