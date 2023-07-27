import { defineStore } from 'pinia'

export const useSourceStore = defineStore('sources', {
  state: (): State => ({
    sources: [
      { name: '', file: '' },
      { name: '', file: '' },
    ],
    destinationPath: '',
    minCount: 2,
    maxCount: 6,
    step: 0,
    loading: false,
  }),

  getters: {
    sourceCount(state: State) {
      return state.sources.length
    },

    isAtMaxCapacity(state: State) {
      return state.sources.length >= state.maxCount
    },

    isAtMinCapacity(state: State) {
      return state.sources.length <= state.minCount
    },
  },

  actions: {
    addSource() {
      if (this.sourceCount < this.maxCount) {
        this.sources.push({ name: '', file: '' })
        return true
      }

      return false
    },

    removeSource(index: number) {
      if (this.sourceCount > this.minCount) {
        this.sources.splice(index, 1)
        return true
      }

      return false
    },

    setSources(sources: Source[]) {
      this.sources = sources
    },

    setSourceName(index: number, name: string) {
      this.sources[index].name = name
    },

    setSourceFile(index: number, file: string) {
      this.sources[index].file = file
    },

    setSourcePivotColumn(index: number, column: string | undefined) {
      this.sources[index].pivot = column
    },

    setDestinationPath(path: string) {
      this.destinationPath = path
    },

    advanceStep() {
      this.step++
    },

    retreatStep() {
      this.step--
    },
  },
})
