<script lang="ts" setup>
  import { tabs } from '../stores/tabs';
</script>

<template>
  <div class="webpage">
    <webview
      v-for="tab of tabs"
      class="webpage__view"
      src="https://lenny.fyi"
      :hidden="!tab.active"
    ></webview>
  </div>
</template>

<style lang="scss" scoped>
  .webpage {
    grid-area: webpage;

    &__view {
      width: 100%;
      height: 100%;
    }
  }
</style>
