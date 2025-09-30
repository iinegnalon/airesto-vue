import { defineStore } from 'pinia';
import type { BookingResponse, Table } from '~/models/reservations';
import { fetchReservations } from '~/api/reservations';
import moment from 'moment/moment';

interface ReservationsStore {
  data: BookingResponse | null;
  loading: boolean;
  selectedDay: string | null;
  selectedZones: string[];
}

export const useReservationsStore = defineStore('reservations', {
  state: (): ReservationsStore => ({
    data: null,
    loading: true,
    selectedDay: null,
    selectedZones: [],
  }),

  getters: {
    availableDays: (state): string[] => state.data?.available_days ?? [],

    allZones: (state): string[] => {
      if (!state.data) return [];
      return Array.from(new Set(state.data.tables.map((t) => t.zone)));
    },

    filteredTables: (state): Table[] => {
      if (!state.data) return [];

      let tables = state.data.tables;

      // Filter by zones
      if (state.selectedZones.length > 0) {
        tables = tables.filter((t) => state.selectedZones.includes(t.zone));
      }

      // Filter by day
      if (state.selectedDay) {
        tables = tables.map((table) => ({
          ...table,
          orders: table.orders.filter(
            (order) =>
              moment.parseZone(order.start_time).format('YYYY-MM-DD') ===
              state.selectedDay,
          ),
          reservations: table.reservations.filter(
            (reservation) =>
              moment
                .parseZone(reservation.seating_time)
                .format('YYYY-MM-DD') === state.selectedDay,
          ),
        }));
      }

      return tables;
    },
  },

  actions: {
    async load() {
      this.loading = true;

      try {
        this.data = await fetchReservations();

        this.selectedDay = this.data?.current_day ?? null;
        this.selectedZones = this.data
          ? Array.from(new Set(this.data.tables.map((t) => t.zone)))
          : [];
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false;
      }
    },

    setDay(day: string) {
      this.selectedDay = day;
    },

    toggleZone(zone: string) {
      if (this.selectedZones.includes(zone)) {
        this.selectedZones = this.selectedZones.filter((z) => z !== zone);
        return;
      }

      this.selectedZones.push(zone);
    },
  },
});
