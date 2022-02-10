<script lang="ts">
  import { computed, ref } from 'vue';

  export const targetUrl = ref('');
</script>

<script lang="ts" setup>
  import Page from './Page.vue';
  import { tabsStore } from '../stores/tabs';

  // order tabs by id, so v-for will not reorder/patch dom after sorting
  const orderedTabs = computed(() => tabsStore.tabs.slice().sort((a, b) => a.id - b.id));
</script>

<template>
  <div class="pages">
    <Page v-for="tab of orderedTabs" :tab="tab" :key="tab.id" />
    <span class="target-url" :hidden="!targetUrl">{{ targetUrl }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .pages {
    grid-area: webpage;
    position: relative;
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
