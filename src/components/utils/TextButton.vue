<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button
    :type="type"
    class="w-full rounded border border-gray-600 p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
    :class="[disabled ? 'cursor-not-allowed' : '']"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>
