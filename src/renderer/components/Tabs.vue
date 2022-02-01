<script setup lang="ts">
  import { mdiPlus, mdiVolumeOff, mdiClose } from '@mdi/js';
  import { tabs } from '../stores/tabs';
  import Icon from './Icon.vue';
</script>

<template>
  <div class="tabs">
    <div class="tabs__inner">
      <ul class="tabs__list">
        <li v-for="tab of tabs" class="tab" :class="{ 'tab--active': tab.active }">
          <button type="button" class="tab__title">{{ tab.title }}</button>
          <div class="tab__icons">
            <button type="button" class="tab__icon" aria-label="mute tab">
              <img src="https://lenny.fyi/favicon.ico" alt="" />
              <Icon v-if="false" :path="mdiVolumeOff" size="s" class="tab__audio" />
            </button>
            <button type="button" class="tab__icon" aria-label="close tab">
              <Icon :path="mdiClose" />
            </button>
          </div>
        </li>
      </ul>
      <button type="button" class="tabs__newtab">
        <Icon :path="mdiPlus" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .tabs {
    grid-area: tabs;
    width: 2.5rem;

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

  // make transition work on custom property, needed for linear gradient
  // stylelint-ignore
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

    &:is(:hover, :focus-within, .tab--dragged-tab) &__icons {
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
