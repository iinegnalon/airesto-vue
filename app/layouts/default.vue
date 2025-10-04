<script lang="ts" setup>
import AppHeader from '~/components/layout/AppHeader.vue';
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <div class="main-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  padding-top: var(--header-height);
}
</style>
