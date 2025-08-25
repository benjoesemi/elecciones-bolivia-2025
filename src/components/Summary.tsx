import type { PartyConfig } from '../lib/config'
import type { NationalStats } from '../lib/data'

type Props = { stats: NationalStats, parties: PartyConfig[] }

export function Summary({ stats, parties }: Props){
  if(!stats || stats.totalDenominator === 0){
    return <div className="pill">Sin datos</div>
  }
  return (
    <div>
      {parties.map(p => {
        const pct = (stats.byParty[p.key] || 0) / stats.totalDenominator * 100
        return (
          <div key={p.key} style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, margin:'6px 0'}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <span className="sw" style={{width:12, height:12, background:p.color, borderRadius:2}}></span>
              <span>{p.name}</span>
            </div>
            <div style={{opacity:.9}}>{pct.toFixed(1)}%</div>
          </div>
        )
      })}
      <div style={{marginTop:8, fontSize:12, color:'#94a3b8'}}>
        Denominador = Σ votos partidos + Σ VotosNulos_Ajus
      </div>
    </div>
  )
}
