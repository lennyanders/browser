<script lang="ts" setup>
  import type { NewWindowEvent } from 'electron';
  import type { Tab } from '../../../main/modules/tabs';
  import { computed, onMounted, ref, watch } from 'vue';
  import { targetUrl } from './Pages.vue';
  import { tabsStore } from '../stores/tabs';
  import { mdiVectorCircle } from '@mdi/js';

  const props = defineProps<{ tab: Tab }>();

  const { updateTab, createTab } = window.browser.tabs;
  const { preloadPath, getUserAgentForUrl } = window.browser.page;

  const webview = ref<Electron.WebviewTag>();
  const isActive = computed(() => props.tab.id === tabsStore.activeTabId);

  const updateFavicon = (url: string) => {
    const image = new Image();
    image.onload = () => updateTab(props.tab.id, { faviconUrl: url });
    image.onerror = () => updateTab(props.tab.id, { faviconUrl: '' });
    image.src = url;
  };

  const handleNewWindow = (event: NewWindowEvent) => {
    if (event.disposition === 'background-tab') return createTab({ url: event.url });
    if (event.disposition === 'foreground-tab') return createTab({ url: event.url }, true);
  };

  onMounted(() => {
    const view = webview.value!;

    const domReady = new Promise((resolve) => view.addEventListener('dom-ready', resolve));

    watch(isActive, (isActive) => {
      if (isActive && !view.src) {
        view.useragent = getUserAgentForUrl(props.tab.url);
        view.src = props.tab.url;
      }

      view.hidden = !isActive;
    });

    watch(
      () => props.tab.muted,
      async (muted) => {
        await domReady;
        if (view.isAudioMuted() === (muted = !!muted)) return;

        view.setAudioMuted(muted);
      },
      { immediate: true },
    );

    watch(
      () => props.tab.url,
      async (url) => {
        await domReady;
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
    :preload="preloadPath"
    :nodeIntegration="false"
    :contextIsolation="true"
    :useragent="isActive || tab.loadInBackground ? getUserAgentForUrl(tab.url) : undefined"
    :src="isActive || tab.loadInBackground ? tab.url : undefined"
    :hidden="!isActive"
    class="page"
    @updateTargetUrl="targetUrl = decodeURIComponent($event.url)"
    @didNavigate="updateTab(tab.id, { url: $event.url })"
    @didNavigateInPage="$event.isMainFrame && updateTab(tab.id, { url: $event.url })"
    @newWindow="handleNewWindow"
    @pageTitleUpdated="updateTab(tab.id, { title: $event.title })"
    @pageFaviconUpdated="updateFavicon($event.favicons[0])"
    @didStartLoading="updateTab(tab.id, { loading: true })"
    @didStopLoading="updateTab(tab.id, { loading: false })"
    @mediaStartedPlaying="updateTab(tab.id, { audible: true })"
    @mediaPaused="updateTab(tab.id, { audible: false })"
  ></webview>
</template>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
  }
</style>
