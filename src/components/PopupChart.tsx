import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import type { PartyConfig } from '../lib/config'

type Props = {
  parties: PartyConfig[]
  votes: Record<string, number>
}

export function PopupChart({ parties, votes }: Props){
  const data = parties.map(p => ({ name: p.name, key: p.key, value: votes[p.key] || 0 }))
  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={60} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
