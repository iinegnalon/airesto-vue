<script lang="ts" setup>
import IconLogout from '~/components/icons/IconLogout.vue';
import IconSun from '~/components/icons/IconSun.vue';
import { useReservationsStore } from '~/store/reservations';

const reservationsStore = useReservationsStore();

function changeTheme() {
  console.log('Change theme');
}

function logout() {
  console.log('Logout');
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      AIRESTO
      {{
        reservationsStore.data
          ? ` | ${reservationsStore.data.restaurant.restaurant_name}`
          : ''
      }}
    </div>
    <div class="app-header__right">
      <button class="app-header__theme-btn" @click="changeTheme">
        <IconSun />
      </button>
      <button class="app-header__logout-btn" @click="logout">
        <IconLogout />
        Выйти
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  background: #2d2d2f;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  position: fixed;
  width: 100%;
  height: var(--header-height);

  &__left {
    font-weight: 600;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 24px;
      background: rgba(255, 255, 255, 0.08);

      &:hover {
        background: rgba(255, 255, 255, 0.16);
      }
    }
  }

  &__theme-btn {
    padding: 0;
    width: 24px;
  }

  &__logout-btn {
    gap: 4px;
  }
}
</style>
