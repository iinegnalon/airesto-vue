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
  background: #222222;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  padding: 8px 14px;
  color: white;
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
      background: rgba(255, 255, 255, 0.08);
      border: none;
      color: white;
      font-size: 16px;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.16);
      }
    }
  }
}
</style>
