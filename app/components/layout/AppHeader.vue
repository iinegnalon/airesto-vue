<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import IconLogout from '~/components/icons/IconLogout.vue';
import IconSun from '~/components/icons/IconSun.vue';
import { useReservationsStore } from '~/store/reservations';
import { useInterfaceStore } from '~/store/interface';

const reservationsStore = useReservationsStore();
const interfaceStore = useInterfaceStore();

onMounted(() => {
  window.addEventListener('keydown', handleKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKey);
});

function handleKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
    e.preventDefault();
    reservationsStore.openSearch();
  }
}

function changeTheme() {
  interfaceStore.toggleTheme();
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
      <button
        class="app-header__search-btn"
        @click="reservationsStore.openSearch()"
      >
        ⌘+Л Поиск по имени
      </button>
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
  background: var(--surface-2);
  color: var(--text);
  padding: 8px 20px;
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
    justify-content: end;
    gap: 8px;
    flex: 1;

    button {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 24px;
      background: var(--white-4);

      &.app-header__search-btn {
        width: 100%;
        max-width: 258px;
        height: 28px;
        background: var(--bg);
        border: 1px solid var(--white-12);
        border-radius: 8px;
        color: var(--white-64);
        padding: 8px 12px;
        justify-content: start;
        flex: 1;

        &:hover {
          background: var(--surface-2);
        }
      }

      &.app-header__theme-btn {
        padding: 0;
        width: 24px;
      }

      &.app-header__logout-btn {
        gap: 4px;
      }

      &:hover {
        background: var(--white-8);
      }
    }
  }
}
</style>
