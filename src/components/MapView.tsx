import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import type { RecintoFeature } from '../lib/data'
import type { PartyConfig } from '../lib/config'
import { PopupChart } from './PopupChart'

type Props = {
  features: RecintoFeature[]
  parties: PartyConfig[]
  dominioColor: (dominio: string | undefined) => string
}

export function MapView({ features, parties, dominioColor }: Props){

  const bounds = useMemo(() => {
    if(features.length === 0) return undefined
    let minLat=  90, minLon= 180, maxLat= -90, maxLon= -180
    for(const f of features){
      const [lon, lat] = f.geometry.coordinates
      if(lat < minLat) minLat = lat
      if(lat > maxLat) maxLat = lat
      if(lon < minLon) minLon = lon
      if(lon > maxLon) maxLon = lon
    }
    return [[minLat, minLon], [maxLat, maxLon]] as any
  }, [features])

  const maxEmitted = useMemo(() => Math.max(1, ...features.map(f => f.properties.votoEmitidoReal || 0)), [features])

  return (
    <div className="map">
      <MapContainer
        style={{height:'100%', width:'100%'}}
        center={[-16.5, -68.15]}
        zoom={6}
        bounds={bounds}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {features.map((f) => {
          const [lon, lat] = f.geometry.coordinates
          const color = dominioColor(f.properties.dominioAbs)
          const emitted = f.properties.votoEmitidoReal || f.properties.totalParties || 0
          const radius = 1 + 5 * Math.sqrt((emitted) / maxEmitted)
          const fillOpacity = 0.7
          return (
            <CircleMarker
              key={f.properties.id}
              center={[lat, lon]}
              pathOptions={{ color, fillColor: color, fillOpacity, weight: 1 }}
              radius={radius}
            >
              <Popup maxWidth={420}>
                <div style={{minWidth:320}}>
                  <strong>{f.properties.recinto || 'Recinto'}</strong><br/>
                  <span style={{opacity:.7}}>
                    {[f.properties.localidad, f.properties.municipio, f.properties.departamento].filter(Boolean).join(' · ')}
                  </span>
                  <div style={{marginTop:8}}>
                    <PopupChart parties={parties} votes={f.properties.votes} />
                  </div>
                  <div style={{marginTop:6, fontSize:12, opacity:.8}}>
                    Emitidos (real): <strong>{(f.properties.votoEmitidoReal || 0).toLocaleString()}</strong> ·
                    Dominio_Abs: <strong>{f.properties.dominioAbs || '—'}</strong>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      {/* Legend */}
      <div className="legend">
        <h3>Leyenda</h3>
        <div className="item"><span className="sw" style={{background:'var(--green)'}}></span><span>PDC ≥ 50%</span></div>
        <div className="item"><span className="sw" style={{background:'var(--red)'}}></span><span>LIBRE ≥ 50%</span></div>
        <div className="item"><span className="sw" style={{background:'var(--gray)'}}></span><span>Ninguno ≥ 50%</span></div>
        <div className="muted">Tamaño = votos emitidos (Real)</div>
      </div>
    </div>
  )
}
