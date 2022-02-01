<script setup lang="ts">
  const sizes = {
    s: 0.75,
    m: 1,
    l: 1.5,
  } as const;

  const { path, size } = defineProps<{ path: string; size?: keyof typeof sizes }>();
</script>

<template>
  <svg
    role="img"
    aria-hidden="true"
    :width="`${sizes[size || 'm']}rem`"
    viewBox="0 0 24 24"
    class="icon"
  >
    <path :d="path"></path>
  </svg>
</template>

<style lang="scss" scoped>
  .icon {
    fill: currentColor;
  }
</style>
