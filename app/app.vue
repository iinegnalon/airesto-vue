<script lang="ts" setup>
import { onMounted } from 'vue';
import { useInterfaceStore } from '~/store/interface';

const interfaceStore = useInterfaceStore();

onMounted(() => {
  interfaceStore.initTheme();
});
</script>

<template>
  <div>
    <Head>
      <Title>Airesto</Title>
      <Meta content="Airesto" name="description" />
      <Meta
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        name="viewport"
      />
    </Head>
    <Body :class="{ 'scroll-off': interfaceStore.scrollOff }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </Body>
  </div>
</template>
