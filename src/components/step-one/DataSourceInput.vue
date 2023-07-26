<script setup lang="ts">
import { mdiClose } from '@mdi/js'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon'
import InputField from '@utils/InputField.vue'
import { useSourceStore } from '@/stores/SourceStore'
import { computed } from 'vue'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
})

const store = useSourceStore()

const { isAtMinCapacity } = storeToRefs(store)

const name = computed({
  get() {
    return store.sources[props.index].name
  },
  set: debounce((value: string) => {
    store.setSourceName(props.index, value)
  }, 200),
})

const file = computed(() => store.sources[props.index].file)

const getFilePath = (e: any) => {
  store.setSourceFile(props.index, e.target.files[0].path)
}

const removeSource = () => {
  store.removeSource(props.index)
}
</script>

<template>
  <div class="relative rounded bg-white p-2 dark:bg-gray-600">
    <h4 class="mb-2 text-xl font-bold">Data Source {{ index + 1 }}</h4>

    <div class="pl-2">
      <InputField
        v-model="name"
        label="Source Name"
        class="mb-1"
        placeholder="Enter a name for this source"
        :tabindex="1"
        required
      />
      <div class="flex items-center">
        <div class="relative mr-2 mt-2">
          <input type="file" name="file" required @change="getFilePath" />
        </div>
        <p>{{ file }}</p>
      </div>
    </div>

    <button
      v-if="!isAtMinCapacity"
      type="button"
      class="absolute right-2 top-2"
      title="Remove data source"
      tabindex="2"
      @click="removeSource"
    >
      <svg-icon type="mdi" :path="mdiClose"></svg-icon>
    </button>
  </div>
</template>
