<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { toRaw } from 'vue'
import { mdiCheckCircleOutline, mdiLoading } from '@mdi/js'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon'
import { useSourceStore } from '@/stores/SourceStore'
import StepOne from '@components/step-one/StepOne.vue'
import StepTwo from '@components/step-two/StepTwo.vue'
import TextButton from '@utils/TextButton.vue'

const store = useSourceStore()

const { step, sources, destinationPath, loading } = storeToRefs(store)

const proceed = async () => {
  loading.value = true
  // trigger functions on step increase (starts at 0)
  switch (step.value) {
    case 0: {
      const res = await window.electron.getColumnsFromCsvFiles(
        toRaw(sources.value)
      )

      if (!res.result) {
        alert(res.error)
        loading.value = false
        return
      } else {
        console.log(res.result)
        store.setSources(res.result)
      }

      break
    }

    case 1: {
      const res = await window.electron.generateOutput(
        toRaw(sources.value),
        toRaw(destinationPath.value)
      )

      if (!res.result) {
        alert(res.error)
        loading.value = false
        return
      }

      break
    }

    default:
      break
  }

  store.advanceStep()
  loading.value = false
}

const goBack = () => {
  store.retreatStep()
}

const resetStore = () => {
  store.$reset()
}
</script>

<template>
  <form
    class="flex max-h-screen flex-col overflow-hidden p-4"
    @submit.prevent="proceed"
  >
    <StepOne v-if="step === 0" />
    <StepTwo v-else-if="step === 1" />
    <div
      v-if="step === 2"
      class="flex h-[50vh] flex-col items-center justify-center text-center"
    >
      <svg-icon
        type="mdi"
        :path="mdiCheckCircleOutline"
        size="100"
        class="text-green-600"
      ></svg-icon>
      <p>Your files have been created and stored successfully.</p>
      <p>You can now restart the process or close this application.</p>
    </div>

    <text-button v-if="step < 2" type="submit"> Continue </text-button>
    <text-button v-if="step > 0" class="my-2" @click="goBack">
      Go Back
    </text-button>
    <text-button v-if="step > 0" type="button" @click="resetStore">
      Restart
    </text-button>
  </form>
  <div
    v-if="loading"
    class="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center bg-zinc-300/70 dark:bg-zinc-700/70"
  >
    <svg-icon
      type="mdi"
      :path="mdiLoading"
      size="100"
      class="animate-spin text-zinc-600 dark:text-zinc-200"
    ></svg-icon>
  </div>
</template>
