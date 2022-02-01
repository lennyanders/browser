<script setup lang="ts">
  import AddressBar from './components/AddressBar.vue';
  import Tabs from './components/Tabs.vue';
</script>

<template>
  <AddressBar />
  <Tabs />
  <div class="webpage">
    <webview class="webpage__view" src="https://lenny.fyi"></webview>
  </div>
</template>
