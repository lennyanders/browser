<script lang="ts" setup>
  import type { NewWindowEvent } from 'electron';
  import type { Tab } from '../../../main/modules/tabs';
  import { onMounted, ref, watch } from 'vue';
  import { targetUrl } from './Pages.vue';

  const props = defineProps<{ tab: Tab }>();

  const { updateTab, createTab } = window.browser.tabs;
  const { getUserAgentForUrl, showContextMenu } = window.browser.page;

  const webview = ref<Electron.WebviewTag>();

  const updateFavicon = (url: string) => {
    const image = new Image();
    image.onload = () => updateTab(props.tab.id, { faviconUrl: url });
    image.onerror = () => updateTab(props.tab.id, { faviconUrl: '' });
    image.src = url;
  };

  const handleNewWindow = (event: NewWindowEvent) => {
    if (event.disposition === 'background-tab') return createTab({ url: event.url });
    if (event.disposition === 'foreground-tab') return createTab({ url: event.url, active: true });
  };

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
    :useragent="tab.active || tab.loadInBackground ? getUserAgentForUrl(tab.url) : undefined"
    :src="tab.active || tab.loadInBackground ? tab.url : undefined"
    :hidden="!tab.active"
    class="page"
    @updateTargetUrl.passive="targetUrl = decodeURIComponent($event.url)"
    @didNavigate.passive="updateTab(tab.id, { url: $event.url })"
    @didNavigateInPage.passive="$event.isMainFrame && updateTab(tab.id, { url: $event.url })"
    @newWindow.passive="handleNewWindow"
    @pageTitleUpdated.passive="updateTab(tab.id, { title: $event.title })"
    @pageFaviconUpdated.passive="updateFavicon($event.favicons[0])"
    @didStartLoading.passive="updateTab(tab.id, { loading: true })"
    @didStopLoading.passive="updateTab(tab.id, { loading: false })"
    @contextMenu.passive="showContextMenu($event.params)"
  ></webview>
</template>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
  }
</style>
