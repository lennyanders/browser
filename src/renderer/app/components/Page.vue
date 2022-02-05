<script lang="ts" setup>
  import type { Tab } from '../../../main/stores/tabs';
  import { onMounted, ref, watch } from 'vue';
  import { targetUrl } from './Pages.vue';

  const props = defineProps<{ tab: Tab }>();

  const { updateTab } = window.browser.tabs;
  const { getUserAgentForUrl } = window.browser.views;

  const webview = ref<Electron.WebviewTag>();

  onMounted(() => {
    const view = webview.value!;

    watch(
      () => props.tab.active,
      (active) => {
        if (!view.src) {
          view.useragent = getUserAgentForUrl(props.tab.url);
          view.src = props.tab.url;
        }

        view.hidden = !active;
      },
    );

    watch(
      () => props.tab.url,
      (url) => {
        if (view.isLoading() || view.getURL() === url) return;

        view.loadURL(url, { userAgent: getUserAgentForUrl(url) });
      },
    );
  });
</script>

<template>
  <webview
    v-once
    ref="webview"
    :key="tab.id"
    :useragent="tab.active ? getUserAgentForUrl(tab.url) : undefined"
    :src="tab.active ? tab.url : undefined"
    :hidden="!tab.active"
    class="page"
    @updateTargetUrl.passive="targetUrl = decodeURIComponent($event.url)"
    @didNavigate.passive="updateTab(tab.id, { url: $event.url })"
    @didNavigateInPage.passive="$event.isMainFrame && updateTab(tab.id, { url: $event.url })"
    @pageTitleUpdated.passive="updateTab(tab.id, { title: $event.title })"
    @pageFaviconUpdated.passive="updateTab(tab.id, { faviconUrl: $event.favicons[0] })"
    @didStartLoading.passive="updateTab(tab.id, { loading: true })"
    @didStopLoading.passive="updateTab(tab.id, { loading: false })"
  ></webview>
</template>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
  }
</style>
