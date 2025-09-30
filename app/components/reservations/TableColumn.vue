<script lang="ts" setup>
import BookingEvent from './BookingEvent.vue';
import { Restaurant, Table } from '~/models/reservations';

const props = defineProps<{
  table: Table;
  restaurant: Restaurant;
}>();
</script>

<template>
  <div class="table-column">
    <BookingEvent
      v-for="event in table.orders"
      :key="event.id"
      :closing-time="restaurant.closing_time"
      :event="{
        start_time: event.start_time,
        end_time: event.end_time,
        id: event.id,
        status: event.status,
      }"
      :opening-time="restaurant.opening_time"
      type="order"
    />

    <BookingEvent
      v-for="event in table.reservations"
      :key="event.id"
      :closing-time="restaurant.closing_time"
      :event="{
        start_time: event.seating_time,
        end_time: event.end_time,
        id: event.id,
        status: event.status,
        name_for_reservation: event.name_for_reservation,
      }"
      :opening-time="restaurant.opening_time"
      type="reservation"
    />
  </div>
</template>

<style lang="scss" scoped>
.table-column {
  position: relative;
  border-right: 1px solid #444;
  width: 100%;

  &:last-child {
    border-right: none;
  }
}
</style>
