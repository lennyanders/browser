<script lang="ts" setup>
  import type { Tab } from '../../../main/modules/tabs';
  import { computed, onMounted, ref, watch } from 'vue';
  import { targetUrl } from './Pages.vue';
  import { tabsStore } from '../stores/tabs';

  const props = defineProps<{ tab: Tab }>();

  const { preloadPath, getUserAgentForUrl, registerTabWebview } = window.browser.page;

  const webview = ref<Electron.WebviewTag>();
  const isActive = computed(() => props.tab.id === tabsStore.activeTabId);

  onMounted(() => {
    const view = webview.value!;

    const domReady = new Promise((resolve) => view.addEventListener('dom-ready', resolve));
    (async () => (await domReady, registerTabWebview(view.getWebContentsId(), props.tab.id)))();

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
    :preload="preloadPath"
    :nodeIntegration="false"
    :contextIsolation="true"
    :useragent="isActive || tab.loadInBackground ? getUserAgentForUrl(tab.url) : undefined"
    :src="isActive || tab.loadInBackground ? tab.url : undefined"
    :hidden="!isActive"
    class="page"
    @updateTargetUrl="targetUrl = decodeURIComponent($event.url)"
  ></webview>
</template>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100%;
  }
</style>
