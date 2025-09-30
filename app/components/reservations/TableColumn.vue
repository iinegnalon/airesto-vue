<script lang="ts" setup>
import BookingEvent from './BookingEvent.vue';
</script>

<template>
  <div class="table-column">
    <BookingEvent
      :event="{
        id: 1,
        status: 'New',
        start_time: '2025-04-04T13:00:00+10:00',
        end_time: '2025-04-04T14:00:00+10:00',
        name_for_reservation: 'Алина',
      }"
      closingTime="23:40"
      openingTime="11:00"
    />

    <BookingEvent
      :event="{
        id: 2,
        status: 'Bill',
        start_time: '2025-04-04T13:30:00+10:00',
        end_time: '2025-04-04T14:30:00+10:00',
        name_for_reservation: 'Миша',
      }"
      :index="1"
      :total="2"
      closingTime="23:40"
      openingTime="11:00"
    />

    <BookingEvent
      :event="{
        id: 3,
        status: 'Closed',
        start_time: '2025-04-04T13:15:00+10:00',
        end_time: '2025-04-04T14:15:00+10:00',
        name_for_reservation: 'Иван',
      }"
      :index="0"
      :total="2"
      closingTime="23:40"
      openingTime="11:00"
    />
  </div>
</template>

<style lang="scss" scoped>
.table-column {
  position: relative;
  height: 600px;
  border: 1px solid #444;
  flex: 1;
}
</style>
