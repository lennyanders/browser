<script setup lang="ts">
  const { paths } = defineProps<{ paths: string[] }>();
</script>

<template>
  <button class="window-action">
    <svg viewBox="0 0 12 12" class="icon">
      <path v-for="path of paths" :d="path" />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
  .window-action {
    background-color: transparent;

    border: 0;
    padding: 8px 17px;

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.22);

      &:last-child {
        background-color: hsl(355, 86%, 49%);
      }
    }
  }

  .icon {
    display: block;
    fill: none;
    width: 0.75rem;
    stroke-width: 0.9;
    stroke: currentColor;
  }
</style>
