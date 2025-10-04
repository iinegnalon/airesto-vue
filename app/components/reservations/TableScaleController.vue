<script lang="ts" setup>
import { useReservationsStore } from '~/store/reservations';

const reservationsStore = useReservationsStore();
</script>

<template>
  <div class="scale-control">
    <div class="scale-control__title">Масштаб</div>
    <div class="scale-control__buttons">
      <button @click="reservationsStore.addScale(-1)">−</button>
      <button @click="reservationsStore.addScale(1)">+</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scale-control {
  position: fixed;
  right: 16px;
  bottom: 16px;
  background: var(--surface);
  border: 1px solid var(--divider);
  border-radius: 8px;
  padding: 8px 14px;
  color: var(--text);
  z-index: 50;

  &__title {
    font-size: 13px;
    line-height: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    text-align: center;
  }

  &__buttons {
    display: flex;
    justify-content: center;
    gap: 4px;
    user-select: none;

    button {
      background: var(--white-4);
      border: none;
      color: white;
      font-size: 14px;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: var(--white-8);
      }
    }
  }
}
</style>
