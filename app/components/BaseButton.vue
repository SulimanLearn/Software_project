<template>
  <component
    :is="componentType"
    :to="to || undefined"
    :class="[baseClass, variant]"
    :type="to ? undefined : type"
    :disabled="isDisabled"
    :aria-disabled="to && disabled ? 'true' : undefined"
    :tabindex="to && disabled ? -1 : undefined"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup>
const NuxtLink = resolveComponent('NuxtLink')

const props = defineProps({
  to: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'primary'
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  baseClass: {
    type: [String, Array, Object],
    default: 'base-button'
  }
})

const componentType = computed(() => (props.to ? NuxtLink : 'button'))
const isDisabled = computed(() => (!props.to && props.disabled) || undefined)

const handleClick = (event) => {
  if (props.to && props.disabled) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>
