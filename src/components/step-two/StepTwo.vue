<script setup lang="ts">
import PageTitle from '@utils/PageTitle.vue'
import { useSourceStore } from '@/stores/SourceStore'
import PivotColumnInput from './PivotColumnInput.vue'
import { storeToRefs } from 'pinia'

const store = useSourceStore()

const { sourceCount, destinationPath } = storeToRefs(store)

const getFolderPath = async () => {
  const path = await window.electron.openDirectory()
  if (path) store.setDestinationPath(path)
}
</script>

<template>
  <div class="flex min-h-0 flex-col p-4">
    <page-title>Step 2: Select Pivot Column</page-title>

    <p class="mb-2">
      Select the column that is common in each source to evaluate the
      intersections
    </p>

    <div class="mb-4 overflow-auto bg-zinc-200 p-4 dark:bg-zinc-700">
      <PivotColumnInput
        v-for="i in sourceCount"
        :key="i"
        :index="i - 1"
        class="mb-4"
      />

      <div class="relative rounded bg-white p-2 dark:bg-zinc-600">
        <h4 class="mb-2 text-xl font-bold">Save Files To</h4>

        <div class="flex items-center">
          <div class="relative mr-2 mt-2">
            <input
              type="button"
              class="cursor-pointer rounded border border-zinc-500 p-1 dark:border-zinc-400"
              value="Select destination folder"
              :tabindex="1"
              required
              @click="getFolderPath"
            />
            <input
              type="text"
              name="file"
              :value="destinationPath"
              required
              class="absolute inset-x-1/2 bottom-0 h-px w-px opacity-0"
              tabindex="-1"
              @keypress.prevent="false"
            />
          </div>
          <p>{{ destinationPath }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
