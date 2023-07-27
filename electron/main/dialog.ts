import { dialog } from 'electron'

export async function openDirectory() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (!canceled) {
    return filePaths[0]
  }
}

export async function openFile() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'CSV File', extensions: ['csv'] }],
  })
  if (!canceled) {
    return filePaths[0]
  }
}
