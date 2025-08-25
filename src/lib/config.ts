export type PartyConfig = { key: string, name: string, color: string }
export type CSVConfig = {
  delimiter?: string
  csvPath: string
  latColumn: string
  lonColumn: string
  precinctIdColumn: string
  parties: PartyConfig[]
}

// Dominio_Abs -> color: PDC=verde, LIBRE=rojo, otros=gris
export const dominioColor = (dominio?: string): string => {
  if(!dominio) return '#9ca3af'
  const d = dominio.toLowerCase()
  if(d.includes('pdc')) return '#22c55e' // verde
  if(d.includes('libre')) return '#ef4444' // rojo
  return '#9ca3af' // gris
}

// Config basado en el CSV proporcionado
export const csvConfig: CSVConfig = {
  delimiter: ',',
  csvPath: '/data/sql_resultados_2025_100.csv',
  latColumn: 'latitu',
  lonColumn: 'longitud',
  // No hay ID explícito: usamos Recinto + Municipio para derivar uno
  precinctIdColumn: 'Recinto',
  parties: [
    { key: 'AP', name: 'AP', color: '#64748b' },
    { key: 'ADN', name: 'ADN', color: '#475569' },
    { key: 'APB_SUMATE', name: 'APB SÚMATE', color: '#60a5fa' },
    { key: 'LIBRE', name: 'LIBRE', color: '#ef4444' }, // rojo
    { key: 'FP', name: 'FP', color: '#f59e0b' },
    { key: 'MAS_IPSP', name: 'MAS-IPSP', color: '#3b82f6' },
    { key: 'MORENA', name: 'MORENA', color: '#22d3ee' },
    { key: 'UNIDAD', name: 'UNIDAD', color: '#a78bfa' },
    { key: 'PDC', name: 'PDC', color: '#22c55e' }, // verde
  ]
}
