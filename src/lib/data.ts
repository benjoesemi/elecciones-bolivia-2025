import Papa from 'papaparse'
import type { CSVConfig, PartyConfig } from './config'

export type RecintoFeature = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [number, number] }, // [lon, lat]
  properties: {
    id: string
    recinto?: string
    localidad?: string
    municipio?: string
    departamento?: string
    dominioAbs?: string
    votoEmitidoReal?: number
    totalParties?: number
    votes: Record<string, number>
  }
}

export type NationalStats = {
  byParty: Record<string, number>
  totalDenominator: number // sum(parties) + sum(VotosNulos_Ajus)
}

export async function loadCSV(input: string | File, config: CSVConfig): Promise<RecintoFeature[]> {
  const csvText = typeof input === 'string' ? await fetchText(input) : await readFileText(input)
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    delimiter: config.delimiter || ',',
  })
  if(parsed.errors?.length){
    const first = parsed.errors[0]
    console.warn('CSV parse errors:', parsed.errors)
    throw new Error(`Error en CSV: ${first.message} (Fila ${first.row ?? '?'})`)
  }
  const rows = parsed.data

  const features: RecintoFeature[] = rows.map((row, i) => {
    const lat = parseFloat((row[config.latColumn] ?? '').toString().replace(',', '.'))
    const lon = parseFloat((row[config.lonColumn] ?? '').toString().replace(',', '.'))
    if(Number.isNaN(lat) || Number.isNaN(lon)){
      return null as any
    }
    const votes: Record<string, number> = {}
    for(const p of config.parties){
      const raw = (row[p.key] ?? '0').toString().trim()
      const v = parseInt(raw, 10)
      votes[p.key] = Number.isFinite(v) ? v : 0
    }
    const votoEmitidoReal = parseInt((row['VotoEmitidoReal'] ?? '0') as string, 10) || 0
    const totalParties = Object.values(votes).reduce((a,b)=>a+(b||0),0)

    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lon, lat] },
      properties: {
        id: (row[config.precinctIdColumn] ?? `${i+1}`).toString(),
        recinto: (row['Recinto'] ?? '').toString(),
        localidad: (row['Localidad'] ?? '').toString(),
        municipio: (row['Municipio'] ?? '').toString(),
        departamento: (row['Departamento'] ?? '').toString(),
        dominioAbs: (row['Dominio_Abs'] ?? '').toString(),
        votoEmitidoReal,
        totalParties,
        votes,
      }
    }
  }).filter(Boolean)

  return features
}

export function computeNationalStats(features: RecintoFeature[]): NationalStats{
  const byParty: Record<string, number> = {}
  let nulosAjustTotal = 0
  for(const f of features){
    for(const [k, v] of Object.entries(f.properties.votes)){
      byParty[k] = (byParty[k] || 0) + (v || 0)
    }
  }
  // Sumar VotosNulos_Ajus desde el CSV original no está en features;
  // para obtenerlo, pedimos una segunda pasada en crudo:
  // En esta implementación, lo aproximamos como max(0, votoEmitidoReal - totalParties) por recinto,
  // en caso de que la columna no exista en el feature. Si el CSV trae VotosNulos_Ajus exacto, se puede mapear en loadCSV.
  for(const f of features){
    const approxNulosAjust = Math.max(0, (f.properties.votoEmitidoReal || 0) - (f.properties.totalParties || 0))
    nulosAjustTotal += approxNulosAjust
  }
  const sumParties = Object.values(byParty).reduce((a,b)=>a+b,0)
  const totalDenominator = sumParties + nulosAjustTotal
  return { byParty, totalDenominator }
}

async function fetchText(url: string): Promise<string>{
  const res = await fetch(url)
  if(!res.ok) throw new Error(`No se pudo descargar CSV: ${res.status}`)
  return await res.text()
}

function readFileText(file: File): Promise<string>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error || new Error('No se pudo leer el archivo'))
    reader.readAsText(file, 'utf-8')
  })
}
