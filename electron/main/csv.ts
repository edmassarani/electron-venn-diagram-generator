import { IpcMainInvokeEvent } from 'electron'
import path from 'node:path'
import { once } from 'node:events'
import { parse } from 'csv-parse'
import * as fs from 'fs'
import * as XLSX from 'xlsx'

export async function getColumnsFromCsvFiles(
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

function getDateString() {
  const date = new Date()

  return `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${(
    '0' + date.getDate()
  ).slice(-2)}`
}

function getComparisonData(sources: Source[], allSourcesPivots: Set<string>) {
  const comparisonData: { [x: string]: string | boolean }[] = []

  for (const pivot of allSourcesPivots) {
    const obj: { [x: string]: string | boolean } = {
      pivot,
    }
    for (const source of sources) {
      if (source.pivotValues?.has(pivot)) {
        obj[source.name] = true
      } else {
        obj[source.name] = false
      }
    }
    comparisonData.push(obj)
  }

  return comparisonData
}

export async function generateOutput(
  _ev: IpcMainInvokeEvent,
  sources: Source[],
  destinationPath: string
) {
  XLSX.set_fs(fs)

  const dateString = getDateString()

  const allSourcesPivots = new Set<string>()

  const workbook = XLSX.utils.book_new()

  try {
    for (const source of sources) {
      source.pivotValues = new Set<string>()

      const records: { [x: string]: string }[] = []

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
            allSourcesPivots.add(pivotValue)
          }
        })

      await once(parser, 'finish')

      const worksheet = XLSX.utils.json_to_sheet(records)

      XLSX.utils.book_append_sheet(workbook, worksheet, source.name)
    }

    const sourceComparisonSheetData = getComparisonData(
      sources,
      allSourcesPivots
    )

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(sourceComparisonSheetData),
      'Venn Diagram Data'
    )

    XLSX.writeFile(
      workbook,
      path.join(destinationPath, `venn_diagram_${dateString}.xlsx`)
    )
  } catch (error) {
    return { error, result: false }
  }

  return { result: true }
}
