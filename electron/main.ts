import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  IpcMainInvokeEvent,
} from 'electron'
import path from 'node:path'
import { once } from 'node:events'
import { parse } from 'csv-parse'
import * as fs from 'fs'
import * as XLSX from 'xlsx'

XLSX.set_fs(fs)

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

async function openDirectory() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  })
  if (!canceled) {
    return filePaths[0]
  }
}

async function openFile() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'CSV File', extensions: ['csv'] }],
  })
  if (!canceled) {
    return filePaths[0]
  }
}

async function getColumnsFromCsvFiles(
  _ev: IpcMainInvokeEvent,
  sources: Source[]
) {
  try {
    for (const source of sources) {
      const records = []
      const parser = fs.createReadStream(source.file).pipe(
        parse({
          to_line: 1,
          delimiter: [',', ';', '\t'],
          trim: true,
          relax_quotes: true,
        })
      )
      for await (const record of parser) {
        records.push(record)
      }

      source.columns = records[0]
    }
  } catch (error) {
    return { error }
  }

  return { result: sources }
}

async function generateOutput(
  _ev: IpcMainInvokeEvent,
  sources: Source[],
  destinationPath: string
) {
  const date = new Date()
  const dateString = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}`

  const allSourcesPivots = new Map<string, string[]>()

  const workbook = XLSX.utils.book_new()

  try {
    for (const source of sources) {
      source.pivotValues = new Set<string>()
      const records: any[] = []
      const parser = fs
        .createReadStream(source.file)
        .pipe(
          parse({
            columns: true,
            delimiter: [',', ';', '\t'],
            trim: true,
            relax_quotes: true,
          })
        )
        .on('data', (row) => {
          records.push(row)

          if (source.pivot) {
            const pivotValue = (row[source.pivot] as string).toLowerCase()
            source.pivotValues?.add(pivotValue)
            if (allSourcesPivots.has(pivotValue)) {
              allSourcesPivots.set(pivotValue, [
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                ...allSourcesPivots.get(pivotValue)!,
                source.name,
              ])
            } else {
              allSourcesPivots.set(pivotValue, [source.name])
            }
          }
        })

      await once(parser, 'finish')

      const worksheet = XLSX.utils.json_to_sheet(records)

      XLSX.utils.book_append_sheet(workbook, worksheet, source.name)
    }

    XLSX.writeFile(
      workbook,
      path.join(destinationPath, `venn_diagram_${dateString}.xlsx`)
    )
  } catch (error) {
    console.error(error)
    return { error, result: false }
  }

  return { result: true }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: path.join(process.env.PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  ipcMain.handle('dialog:openDirectory', openDirectory)
  ipcMain.handle('dialog:openFile', openFile)
  ipcMain.handle('csv:getColumnsFromFiles', getColumnsFromCsvFiles)
  ipcMain.handle('csv:generateOutput', generateOutput)

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  win = null
  app.quit()
})

app.whenReady().then(createWindow)
