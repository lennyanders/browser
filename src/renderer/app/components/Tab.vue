<script setup lang="ts">
  import { mdiVolumeOff, mdiClose, mdiFileOutline } from '@mdi/js';
  import { Tab } from '../../main/stores/tabs';
  import Icon from './Icon.vue';

  defineProps<{ tab: Tab }>();

  const { setActiveTab, deleteTab } = window.browser.tabs;
</script>

<template>
  <li class="tab" :class="{ 'tab--active': tab.active }" @click.passive.middle="deleteTab(tab.id)">
    <button type="button" class="tab__title" @click.passive="setActiveTab(tab.id)">
      {{ tab.title }}
    </button>
    <div class="tab__icons">
      <button type="button" class="tab__icon" aria-label="mute tab">
        <svg v-if="tab.loading" class="tab__spinner" viewBox="0 0 50 50">
          <circle fill="none" cx="25" cy="25" r="20" stroke="currentColor" stroke-width="5" />
        </svg>
        <img v-else-if="tab.faviconUrl" :src="tab.faviconUrl" alt="" />
        <Icon v-else :path="mdiFileOutline" />
        <Icon v-if="false" :path="mdiVolumeOff" size="s" class="tab__audio" />
      </button>
      <button
        type="button"
        class="tab__icon"
        aria-label="close tab"
        @click.passive="deleteTab(tab.id)"
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

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  .tab {
    --tab-bg: var(--bg-color);

    position: relative;
    height: 2rem;
    line-height: 2rem;
    overflow: hidden;
    background-color: var(--tab-bg);
    font-size: 0.875rem;
    transition: --tab-bg 0.2s ease, color 0.2s ease;

    &:hover {
      color: var(--font-color-hover);
      --tab-bg: var(--bg-color-hover);
    }

    &--active {
      color: var(--font-color-active);
      --tab-bg: var(--bg-color-active);
    }

    &--dragged-tab {
      outline: 0.125rem dashed var(--bg-color-active);
      outline-offset: -0.5rem;
      background-color: transparent;

      > * {
        opacity: 0;
      }
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
      padding-left: 0.25rem;
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

    &:hover &__icons {
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

    &__spinner {
      animation: rotate 2s linear infinite;

      circle {
        animation: dash 1.5s ease-in-out infinite;
      }
    }
  }
</style>
