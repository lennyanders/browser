<script setup lang="ts">
  import { ref } from 'vue';
  import WindowControlButton from './WindowControlButton.vue';

  const { windowActions } = window.browser;

  const isMaximized = ref(false);
  isMaximized.value = windowActions.getMaximizedState((newState) => (isMaximized.value = newState));
</script>

<template>
  <div class="window-actions">
    <WindowControlButton :paths="['M1 5.5h10']" @click.passive="windowActions.minimize" />
    <WindowControlButton
      :paths="isMaximized ? ['M1.5 3.5h7v7h-7z', 'M3.5 3.5v-2h7v7h-2'] : ['M1.5 1.5h9v9h-9z']"
      @click.passive="() => (isMaximized ? windowActions.unmaximize : windowActions.maximize)()"
    />
    <WindowControlButton :paths="['M1 1l10 10M1 11L11 1']" @click.passive="windowActions.close" />
  </div>
</template>

<style lang="scss" scoped>
  .window-actions {
    -webkit-app-region: no-drag;
    display: flex;
    margin-top: -0.375rem;
    align-self: start;
  }
</style>
