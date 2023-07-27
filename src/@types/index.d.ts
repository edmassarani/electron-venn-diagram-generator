import { ElectronAPI } from '../../electron/preload'

declare global {
  interface Window {
    electron: ElectronAPI
  }

  type Source = {
    name: string
    file: string
    columns?: string[]
    pivot?: string
    pivotValues?: Set<string>
  }

  type State = {
    sources: Source[]
    destinationPath: string
    minCount: number
    maxCount: number
    step: number
    loading: boolean
  }
}

export {}
