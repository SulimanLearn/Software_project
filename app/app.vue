<script setup lang="ts">
import { F } from 'vue-router/dist/index-D_VEAp3P.js';

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
