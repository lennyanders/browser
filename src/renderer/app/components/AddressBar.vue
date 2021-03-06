<script setup lang="ts">
  import {
    mdiArrowLeft,
    mdiArrowRight,
    mdiReload,
    mdiInformationOutline,
    mdiDotsHorizontal,
    mdiBookmarkPlusOutline,
    mdiBookmarkOutline,
    mdiPuzzleOutline,
  } from '@mdi/js';
  import { computed, ref } from 'vue';
  import { defaultNewTab } from '../../../shared/consts';
  import { tabsStore } from '../stores/tabs';
  import { reloadActiveTab } from '../utils';
  import Icon from './Icon.vue';
  import WindowControls from './WindowControls.vue';

  const activeTabUrl = computed({
    get: () => {
      const activeTabUrl = tabsStore.tabs.find((tab) => tab.id === tabsStore.activeTabId)?.url;
      if (!activeTabUrl || activeTabUrl === defaultNewTab.url) return '';

      return decodeURIComponent(activeTabUrl);
    },
    set: () => {},
  });

  let urlInputFocused = ref(false);
  const urlInput = ref<HTMLInputElement>();
  const updateActiveTab = () => {
    if (urlInput.value?.value === activeTabUrl.value) return reloadActiveTab();

    window.browser.tabs.updateActiveTab({ url: urlInput.value?.value });
  };

  const onClick = () => {
    if (urlInputFocused.value) return;
    urlInputFocused.value = true;
    urlInput.value!.select();
  };

  const onBlur = () => {
    urlInputFocused.value = false;
    window.getSelection()?.removeAllRanges();
  };
</script>

<template>
  <div class="address-bar">
    <button class="address-bar__button" aria-label="backwards in history">
      <Icon :path="mdiArrowLeft" size="l" />
    </button>
    <button class="address-bar__button" aria-label="forwards in hsitory">
      <Icon :path="mdiArrowRight" size="l" />
    </button>
    <button class="address-bar__button" aria-label="reload page" @click.passive="reloadActiveTab">
      <Icon :path="mdiReload" size="l" />
    </button>
    <form class="url-bar" @submit.prevent="updateActiveTab">
      <button type="button" class="url-bar__button url-bar__button--info" aria-label="page info">
        <Icon :path="mdiInformationOutline" size="l" />
      </button>
      <input
        type="url"
        class="url-bar__input"
        placeholder="Search with DuckDuckGo or enter address"
        ref="urlInput"
        :value="activeTabUrl"
        @keyup.passive.esc="() =>  urlInput!.value = activeTabUrl"
        @click.passive="onClick"
        @blur.passive="onBlur"
      />
      <button
        type="button"
        class="url-bar__button url-bar__button--bookmark"
        aria-label="add to bookmarks"
      >
        <Icon :path="mdiBookmarkPlusOutline" size="l" />
      </button>
    </form>
    <button class="address-bar__button" aria-label="extensions">
      <Icon :path="mdiPuzzleOutline" size="l" />
    </button>
    <button class="address-bar__button" aria-label="bookmarks">
      <Icon :path="mdiBookmarkOutline" size="l" />
    </button>
    <button class="address-bar__button" aria-label="menu">
      <Icon :path="mdiDotsHorizontal" size="l" />
    </button>
    <WindowControls />
  </div>
</template>

<style lang="scss" scoped>
  .address-bar {
    grid-area: topbar;
    padding: 0.375rem 0 0.375rem - 0.0625rem 0.375rem;
    display: flex;
    gap: 0.5rem;
    border-bottom: var(--border);
    background-color: var(--bg-color-topbar);
    -webkit-app-region: drag;

    &__button {
      -webkit-app-region: no-drag;
      padding: 0.25rem;
      width: 2rem;
      height: 2rem;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--bg-color-topbar-hover);
      }
    }
  }

  .url-bar {
    flex: 1;
    position: relative;

    &__input {
      -webkit-app-region: no-drag;
      height: 2rem;
      width: 100%;
      padding: 0 2rem;
      flex: 1;
      outline: none;
      background-color: var(--bg-color-urlbar);
      outline: var(--border);
      transition: outline-color 0.1s ease;

      &:not(:hover, :focus) {
        outline-color: transparent;
      }
    }

    &__button {
      position: absolute;
      width: 1.5rem;
      height: 1.5rem;
      top: 0.25rem;

      &--info {
        left: 0.25rem;
      }

      &--bookmark {
        right: 0.25rem;
      }
    }
  }
</style>
