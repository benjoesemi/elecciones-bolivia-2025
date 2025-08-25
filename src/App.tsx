import { useEffect, useMemo, useState } from 'react'
import { MapView } from './components/MapView'
import { Summary } from './components/Summary'
import { Footer } from './components/Footer'
import { loadCSV, RecintoFeature, computeNationalStats } from './lib/data'
import { csvConfig, dominioColor } from './lib/config'

export default function App(){
  const [features, setFeatures] = useState<RecintoFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try{
        const feats = await loadCSV(csvConfig.csvPath, csvConfig)
        setFeatures(feats)
      }catch(e:any){
        setError(e?.message || 'Error cargando CSV')
      }finally{
        setLoading(false)
      }
    })()
  }, [])

  const stats = useMemo(() => computeNationalStats(features), [features])

  return (
    <div className="app">
      <header>
        <h1>Mapa Elecciones Bolivia 2025</h1>
        <span className="badge">React + Leaflet</span>
        <div className="spacer" />
        <a className="badge" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap</a>
      </header>

      <aside className="sidebar">
        <h2>Resumen nacional</h2>
        <Summary stats={stats} parties={csvConfig.parties} />
        {loading && <div className="pill">Cargando CSV…</div>}
        {error && <div className="pill" style={{borderColor:'#ef4444'}}>⚠ {error}</div>}
        <div style={{marginTop:12, fontSize:12, color:'#94a3b8'}}>
          Fuente de datos: <code>Organo Electoral Plurinacional</code><br/>
          Los porcentajes consideran <code>VotosNulos_Ajus</code> en el denominador.
        </div>
      </aside>

      <div className="map-wrap">
        <MapView features={features} dominioColor={dominioColor} parties={csvConfig.parties} />
      </div>

      <Footer />
    </div>
  )
}
