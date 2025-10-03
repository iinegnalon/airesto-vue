<script lang="ts" setup>
import { computed } from 'vue';
import EventCard from './EventCard.vue';
import type {
  BookingEvent,
  EventType,
  Restaurant,
  Table,
} from '~/models/reservations';
import { getMinutesFromISO } from '~/utils/utils';

const props = defineProps<{
  table: Table;
  restaurant: Restaurant;
}>();

const mergedEvents = computed<BookingEvent[]>(() => {
  // Merged and sorted events
  const events: BookingEvent[] = mergeEvents(props.table);

  if (events.length === 0) return [];

  // Check if events intersect
  checkIntersections(events);

  // Check if events overlap
  checkOverlaps(events);

  return events;
});

function mergeEvents(table: Table): BookingEvent[] {
  return [
    ...table.orders.map((o) => ({
      id: o.id,
      start_time: o.start_time,
      end_time: o.end_time,
      status: o.status,
      type: 'order' as EventType,
      start_min: getMinutesFromISO(o.start_time),
      end_min: getMinutesFromISO(o.end_time),
      offset_index: 0,
      row_index: 0,
      row_count: 1,
    })),
    ...table.reservations.map((r) => ({
      id: r.id,
      start_time: r.seating_time,
      end_time: r.end_time,
      status: r.status,
      type: 'reservation' as EventType,
      name_for_reservation: r.name_for_reservation,
      start_min: getMinutesFromISO(r.seating_time),
      end_min: getMinutesFromISO(r.end_time),
      num_people: r.num_people,
      phone_number: r.phone_number,
      offset_index: 0,
      row_index: 0,
      row_count: 1,
    })),
  ].sort((a, b) => a.start_min - b.start_min);
}

function checkIntersections(events: BookingEvent[]) {
  let groupStart = 0;
  for (let i = 1; i < events.length; i++) {
    const prev = events[i - 1]!;
    const cur = events[i]!;

    if (cur.start_min - prev.start_min <= 30) {
      cur.row_index = i - groupStart;
    } else {
      const groupSize = i - groupStart;
      for (let j = groupStart; j < i; j++) {
        events[j]!.row_count = groupSize;
      }
      groupStart = i;
      cur.row_index = 0;
    }
  }

  // Last row
  const lastGroupSize = events.length - groupStart;
  for (let j = groupStart; j < events.length; j++) {
    events[j]!.row_count = lastGroupSize;
  }
}

function checkOverlaps(events: BookingEvent[]) {
  for (let i = 0; i < events.length; i++) {
    for (let j = 0; j < i; j++) {
      const iEvent = events[i]!;
      const jEvent = events[j]!;

      if (
        iEvent.start_min >= jEvent.start_min &&
        iEvent.start_min < jEvent.end_min &&
        iEvent.row_index < 1
      ) {
        iEvent.offset_index = Math.max(
          iEvent.offset_index,
          jEvent.offset_index + 1,
        );
      }
    }
  }
}
</script>

<template>
  <div class="table-column">
    <div class="table-column__info">
      <div>
        <span>
          #<span class="bold">{{ table.number }}&nbsp;</span>
        </span>
        <span>{{ table.capacity }} чел</span>
      </div>
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
  border-right: 1px solid rgba(255, 255, 255, 0.16);
  width: 100%;
  min-width: 80px;

  &:last-child {
    border-right: none;
  }

  &__info {
    position: sticky;
    top: 0;
    margin-top: calc(-1 * var(--table-column-info-height));
    height: var(--table-column-info-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    color: rgba(255, 255, 255, 0.64);
    z-index: 12;
    background: #1b1b1d;

    .bold {
      font-weight: bold;
      color: white;
    }
  }
}
</style>
