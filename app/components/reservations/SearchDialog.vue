<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import moment from 'moment/moment';
import { useReservationsStore } from '~/store/reservations';
import { Reservation } from '~/models/reservations';

interface SearchResult extends Reservation {
  table_zone: string;
  table_number: number;
}

const reservationsStore = useReservationsStore();

const query = ref('');
const inputEl = ref<HTMLInputElement | null>(null);

const results = computed<SearchResult[]>(() => {
  const data = reservationsStore.data;

  if (!query.value.trim() || !data) return [];

  const matches = [];
  for (const table of data.tables) {
    for (const r of table.reservations) {
      if (
        r.name_for_reservation.toLowerCase().includes(query.value.toLowerCase())
      ) {
        matches.push({
          ...r,
          table_zone: table.zone,
          table_number: table.number,
        });
      }
    }
  }

  return matches;
});

onMounted(() => {
  window.addEventListener('keydown', handleKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey);
});

// Focus input when dialog opens
watch(
  () => reservationsStore.searchOpen,
  async (open) => {
    if (open) {
      await nextTick();
      inputEl.value?.focus();
    }
  },
);

function handleKey(e: KeyboardEvent) {
  if (!reservationsStore.searchOpen) return;

  if (e.code === 'Escape') {
    e.preventDefault();
    closeDialog();
  }
}

function closeDialog() {
  query.value = '';
  reservationsStore.closeSearch();
}

function selectReservation(res: SearchResult) {
  reservationsStore.selectedDay = formatDate(res.seating_time);
  reservationsStore.selectedZones = [res.table_zone];
  closeDialog();

  console.log('Бронь:', res);
}

function formatDate(iso: string) {
  return moment.parseZone(iso).format('YYYY-MM-DD');
}
</script>

<template>
  <transition name="search-fade">
    <div
      v-if="reservationsStore.searchOpen"
      class="search-dialog"
      @click.self="closeDialog"
    >
      <div v-show="reservationsStore.searchOpen" class="search-dialog__box">
        <input
          ref="inputEl"
          v-model="query"
          autofocus
          class="search-dialog__input"
          placeholder="Введите имя..."
        />

        <div v-if="results.length" class="search-dialog__results">
          <div
            v-for="r in results"
            :key="r.id"
            class="search-dialog__result"
            @click="selectReservation(r)"
          >
            <div class="search-dialog__result-name">
              {{ r.name_for_reservation }}
            </div>
            <div class="search-dialog__result-meta">
              {{ formatDate(r.seating_time) }} · {{ r.num_people }} чел ·
              {{ r.status }} · {{ r.table_zone }} (стол {{ r.table_number }})
            </div>
          </div>
        </div>

        <div v-else-if="query.length" class="search-dialog__no-results">
          Ничего не найдено
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.search-dialog {
  position: fixed;
  inset: 0;
  background: var(--black-64);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: start;
  padding-top: 10vh;
  z-index: 200;

  &__box {
    background: var(--surface-2);
    padding: 16px;
    border-radius: 12px;
    width: 420px;
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: 0 0 24px var(--black-40);
  }

  &__input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid var(--white-12);
    outline: none;
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    margin-bottom: 12px;

    &:focus {
      border-color: var(--white-32);
    }
  }

  &__results {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__result {
    background: var(--white-4);
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s;

    @media (prefers-color-scheme: light) {
      background: var(--bg);
    }

    &:hover {
      background: var(--white-12);

      @media (prefers-color-scheme: light) {
        background: var(--surface);
      }
    }

    &-name {
      font-weight: 600;
      display: block;
    }

    &-meta {
      font-size: 12px;
      opacity: 0.8;
    }
  }

  &__no-results {
    color: var(--white-48);
    text-align: center;
    padding: 16px 0;
  }
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.25s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
</style>
