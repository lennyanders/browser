<script setup lang="ts">
  import { mdiPlus } from '@mdi/js';
  import { tabs } from '../stores/tabs';
  import Icon from './Icon.vue';
  import Tab from './Tab.vue';

  const { newTab } = window.browser.tabs;
</script>

<template>
  <div class="tabs">
    <div class="tabs__inner">
      <ul class="tabs__list">
        <Tab v-for="(tab, index) of tabs" :tab="tab" :index="index" />
      </ul>
      <button type="button" class="tabs__newtab" @click.passive="newTab">
        <Icon :path="mdiPlus" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .tabs {
    grid-area: tabs;
    width: 2.5rem;
    z-index: 1;

    &__inner {
      float: right;
      width: 20rem;
      height: 100%;
      display: grid;
      align-content: start;
      gap: 0.25rem;
      background-color: var(--bg-color);
      padding: 0.25rem;
      padding-right: 0.25rem - 0.0625rem;
      border-right: var(--border);
      transition: transform 0.2s ease;

      // &,
      &:hover {
        transform: translateX(-2.5rem) translateX(100%);
      }
    }

    &__list {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.25rem;
    }

    &__newtab {
      padding: 0 0.5rem;
      height: 2rem;
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      align-items: center;
      transition: background-color 0.2s ease, color 0.2s ease;

      &:hover {
        color: var(--font-color-hover);
        background-color: var(--bg-color-hover);
      }
    }
  }
</style>
