<template>
  <div :class="wrapClass">
    <table :class="tableClass">
      <slot />
    </table>
  </div>
</template>

<script setup>
defineProps({
  wrapClass: {
    type: [String, Array, Object],
    default: 'app-scroll-table'
  },
  tableClass: {
    type: [String, Array, Object],
    default: ''
  }
})
</script>
