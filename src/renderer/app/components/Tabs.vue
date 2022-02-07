<script setup lang="ts">
  import Draggable from 'vuedraggable';
  import { mdiPlus } from '@mdi/js';
  import { ref } from 'vue';
  import { tabs } from '../stores/tabs';
  import Icon from './Icon.vue';
  import Tab from './Tab.vue';

  const { newTab, updateTabPosition } = window.browser.tabs;

  const dragging = ref(false);

  const onDragEnd = (event: Event & { oldIndex: number; newIndex: number }) => {
    dragging.value = false;
    updateTabPosition(event.oldIndex, event.newIndex);
  };
</script>

<template>
  <div class="tabs">
    <Draggable
      v-model="tabs"
      itemKey="id"
      class="tabs__inner"
      tag="transition-group"
      :component-data="{
        tag: 'ol',
        type: 'transition-group',
        name: 'tab-transition',
        enterFromClass: 'tab-transition--enter-from',
        leaveToClass: 'tab-transition--leave-to',
        leaveActiveClass: 'tab-transition--leave-active',
        enterActiveClass: 'tab-transition--enter-active',
      }"
      group="tabs"
      :animation="100"
      ghostClass="tab--dragged-tab"
      @start="dragging = true"
      @end="onDragEnd"
      @dblclick.passive.self="newTab"
    >
      <template #item="{ element }">
        <Tab :tab="element" :class="{ 'tab-transition': !dragging }" />
      </template>
      <template #footer>
        <li :class="{ 'tab-transition': !dragging }" key="newtab">
          <button type="button" class="newtab" @click.passive="newTab">
            <Icon :path="mdiPlus" />
          </button>
        </li>
      </template>
    </Draggable>
  </div>
</template>

<style lang="scss" scoped>
  .tab-transition {
    transition: transform 0.125s ease, opacity 0.125s ease;

    &--leave-active {
      transform: translateY(calc(-100% - 0.25rem));
      width: calc(100% - 0.5rem);
      position: absolute;
      z-index: 1;
    }

    &--enter-from {
      width: calc(100% - 0.5rem);
      transform: translateY(calc(-100% - 0.25rem));
    }

    &--enter-active {
      z-index: 1;
    }

    &--enter-from,
    &--leave-to {
      opacity: 0;
    }
  }

  .tabs {
    grid-area: tabs;
    width: 2.5rem;
    z-index: 1;

    &__inner {
      float: right;
      position: relative;
      width: 20rem;
      height: 100%;
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
  }

  .newtab {
    padding: 0 0.5rem;
    height: 2rem;
    width: 100%;
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    align-items: center;
    transition: background-color 0.2s ease, color 0.2s ease;
    background-color: var(--bg-color);

    &:hover {
      color: var(--font-color-hover);
      background-color: var(--bg-color-hover);
    }
  }
</style>
