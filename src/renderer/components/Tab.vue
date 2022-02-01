<script setup lang="ts">
  import { mdiVolumeOff, mdiClose } from '@mdi/js';
  import { Tab } from '../../main/stores/tabs';
  import Icon from './Icon.vue';

  defineProps<{ tab: Tab; index: number }>();

  const { setActiveTab, deleteTab } = window.browser.tabs;
</script>

<template>
  <li class="tab" :class="{ 'tab--active': tab.active }">
    <button type="button" class="tab__title" @click.passive="() => setActiveTab(index)">
      {{ tab.title }}
    </button>
    <div class="tab__icons">
      <button type="button" class="tab__icon" aria-label="mute tab">
        <img src="https://lenny.fyi/favicon.ico" alt="" />
        <Icon v-if="false" :path="mdiVolumeOff" size="s" class="tab__audio" />
      </button>
      <button
        type="button"
        class="tab__icon"
        aria-label="close tab"
        @click.passive="() => deleteTab(index)"
      >
        <Icon :path="mdiClose" />
      </button>
    </div>
  </li>
</template>

<style lang="scss" scoped>
  // make transition work on custom property, needed for linear gradient
  @property --tab-bg {
    syntax: 'color';
    inherits: false;
    initial-value: transparent;
  }

  .tab {
    --tab-bg: var(--bg-color);

    position: relative;
    height: 2rem;
    line-height: 2rem;
    overflow: hidden;
    background-color: var(--tab-bg);
    transition: --tab-bg 0.2s ease, color 0.2s ease;

    &:hover {
      color: var(--font-color-hover);
      --tab-bg: var(--bg-color-hover);
    }

    &--active {
      color: var(--font-color-active);
      --tab-bg: var(--bg-color-active);
    }

    &__title {
      padding-left: 0.5rem;
      width: 100%;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
    }

    &__icons {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      background-color: inherit;
      transform: translateX(2rem);
      transition: transform 0.2s ease;

      &::before {
        content: '';
        display: block;
        position: absolute;
        right: 100%;
        height: 100%;
        width: 2rem;
        background-image: linear-gradient(90deg, transparent, var(--tab-bg));
      }
    }

    &:is(:hover, .tab--dragged-tab) &__icons {
      transform: none;
    }

    &__icon {
      position: relative;
      width: 2rem;
      height: 2rem;
      padding: 0.5rem;
    }

    &__audio {
      position: absolute;
      bottom: 0.25rem;
      right: 0.25rem;
    }
  }
</style>
