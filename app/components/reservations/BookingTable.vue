<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { BookingResponse } from '~/models/reservations';
import TableColumn from '~/components/reservations/TableColumn';
import { fetchReservations } from '~/api/reservations';

const reservations = ref<BookingResponse>(null);
const loading = ref(true);

onMounted(() => {
  initTable();
});

async function initTable() {
  try {
    reservations.value = await fetchReservations();
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>

    <div v-else-if="reservations">
      <TableColumn />
    </div>

    <div v-else>No reservations</div>
  </div>
</template>

<style lang="scss" scoped></style>
