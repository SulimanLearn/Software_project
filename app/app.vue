<script setup lang="ts">
</script>

<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <main class="page-stage">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-stage {
  flex: 1;
}
</style>
