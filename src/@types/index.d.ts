import { ElectronAPI } from '../../electron/preload'

declare global {
  interface Window {
    electron: ElectronAPI
  }

  type Source = {
    name: string
    file: string
    pivot?: string
    columns?: string[]
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
