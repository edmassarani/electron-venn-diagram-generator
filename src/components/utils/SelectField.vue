<script setup lang="ts">
import { PropType } from 'vue/dist/vue.js'

defineProps({
  hasLabel: {
    type: Boolean,
    default: true,
  },

  label: {
    type: String,
    default: '',
  },

  labelClass: {
    type: String,
    default: '',
  },

  tabindex: {
    type: Number,
    default: 0,
  },

  modelValue: {
    type: String,
    default: '',
  },

  placeholder: {
    type: String,
    default: 'Select an option',
  },

  options: {
    type: Array as PropType<string[]>,
    required: true,
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label v-if="hasLabel" :class="labelClass">
    <span class="block">
      {{ label }}
    </span>

    <select
      :value="modelValue"
      class="w-full rounded border border-zinc-600 p-1 dark:border-zinc-400"
      :tabindex="tabindex"
      v-bind="$attrs"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    >
      <option value="" disabled selected>-- {{ placeholder }} --</option>
      <option v-for="option of options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </label>
</template>
