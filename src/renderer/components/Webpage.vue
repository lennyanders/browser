<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { tabs } from '../stores/tabs';

  // order tabs by id, so v-for will not reorder/patch dom after sorting
  const orderedTab = computed(() =>
    tabs.value ? tabs.value.slice().sort((a, b) => a.id - b.id) : [],
  );

  const { updateTab } = window.browser.tabs;

  const targetUrl = ref('');
  const setTargetUrl = (event: Event & { url: string }) => (targetUrl.value = event.url);
</script>

<template>
  <div class="webpage">
    <webview
      v-for="tab of orderedTab"
      :key="tab.id"
      class="webpage__view"
      :src="tab.url"
      :hidden="!tab.active"
      @update-target-url.passive="setTargetUrl"
      @did-navigate.passive="(event: Event & { url: string }) => updateTab(tab.id, { url: event.url })"
      @did-frame-navigate.passive="(event: Event & { url: string }) => updateTab(tab.id, { url: event.url })"
      @did-navigate-in-page.passive="(event: Event & { url: string }) => updateTab(tab.id, { url: event.url })"
      @page-title-updated.passive="(event: Event & { title: string }) => updateTab(tab.id, { title: event.title })"
      @page-favicon-updated.passive="(event: Event & { favicons: string[] }) => updateTab(tab.id, { faviconUrl: event.favicons[0] })"
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
