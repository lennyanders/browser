<script lang="ts" setup>
  import type { UpdateTargetUrlEvent } from 'electron';
  import type { Tab } from '../../main/stores/tabs';
  import { onMounted, ref, watch } from 'vue';
  import { targetUrl } from './Pages.vue';

  const props = defineProps<{ tab: Tab }>();

  const { updateTab } = window.browser.tabs;
  const { getUserAgentForUrl } = window.browser.views;

  const setTargetUrl = (event: UpdateTargetUrlEvent) => (targetUrl.value = event.url);

  const webview = ref<Electron.WebviewTag>();

  onMounted(() => {
    const view = webview.value!;

    watch(
      () => props.tab.active,
      (active) => (view.hidden = !active),
    );

    watch(
      () => props.tab.url,
      (url) => {
        if (view.isLoading() || view.getURL() === url) return;

        view.setUserAgent(getUserAgentForUrl(url));
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
    @updateTargetUrl.passive="setTargetUrl"
    @didNavigate.passive="({ url }) => updateTab(tab.id, { url })"
    @didNavigateInPage.passive="({ url }) => updateTab(tab.id, { url })"
    @pageTitleUpdated.passive="({ title }) => updateTab(tab.id, { title })"
    @pageFaviconUpdated.passive="({ favicons }) => updateTab(tab.id, { faviconUrl: favicons[0] })"
  ></webview>
</template>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
  }
</style>
