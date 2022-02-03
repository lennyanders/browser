<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { Tab } from '../../main/stores/tabs';
  import { targetUrl } from './Pages.vue';

  const props = defineProps<{ tab: Tab }>();

  const { updateTab } = window.browser.tabs;
  const { getUserAgentForUrl } = window.browser.views;

  const setTargetUrl = (event: Event & { url: string }) => (targetUrl.value = event.url);

  const webview = ref<HTMLElement>();

  onMounted(() => {
    const view = webview.value!;

    watch(
      () => props.tab.active,
      (active) => (view.hidden = !active),
    );

    watch(
      () => props.tab.url,
      (url) => {
        // @ts-ignore
        if (view.isLoading()) return;
        // @ts-ignore
        if (view.getURL() === url) return;

        // @ts-ignore
        view.setUserAgent(getUserAgentForUrl(url));
        // @ts-ignore
        view.loadURL(url);
      },
    );
  });
</script>

<template>
  <webview
    v-once
    ref="webview"
    :key="tab.id"
    :useragent="getUserAgentForUrl(tab.url)"
    :src="tab.url"
    :hidden="!tab.active"
    class="page"
    @update-target-url.passive="setTargetUrl"
    @did-navigate.passive="(event: Event & { url: string }) => updateTab(tab.id, { url: event.url })"
    @did-navigate-in-page.passive="(event: Event & { url: string }) => updateTab(tab.id, { url: event.url })"
    @page-title-updated.passive="(event: Event & { title: string }) => updateTab(tab.id, { title: event.title })"
    @page-favicon-updated.passive="(event: Event & { favicons: string[] }) => updateTab(tab.id, { faviconUrl: event.favicons[0] })"
  ></webview>
</template>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
  }
</style>
