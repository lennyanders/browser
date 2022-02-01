<script lang="ts" setup>
  import { ref } from 'vue';
  import { tabs } from '../stores/tabs';

  const targetUrl = ref('');
  const setTargetUrl = (event: Event & { url: string }) => (targetUrl.value = event.url);
</script>

<template>
  <div class="webpage">
    <webview
      v-for="tab of tabs"
      class="webpage__view"
      src="https://lenny.fyi"
      :hidden="!tab.active"
      @update-target-url.passive="setTargetUrl"
    ></webview>
    <span class="target-url" :hidden="!targetUrl">{{ targetUrl }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .webpage {
    grid-area: webpage;
    position: relative;

    &__view {
      width: 100%;
      height: 100%;
    }
  }

  .target-url {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 0 0.25rem;
    background-color: var(--bg-color);
    border: var(--border);
    border-left: 0;
    border-bottom: 0;
  }
</style>
