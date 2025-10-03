<template>
  <div class="loader"></div>
</template>

<style lang="scss" scoped>
.loader {
  margin: 2rem auto;
  border: 4px solid white;
  border-top: 4px solid rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
