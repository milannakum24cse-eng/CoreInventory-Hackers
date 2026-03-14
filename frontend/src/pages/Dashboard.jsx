import { useEffect, useState } from 'react'
import { getDashboard } from '../api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

function StatCard({ label, value, sub, color = 'text-white' }) {
  return (
    <div className="card flex flex-col gap-1">
      <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">{label}</p>
      <p className={`text-3xl font-extrabold tracking-tight ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  )
}

const COLORS = ['#6c63ff','#ff6b9d','#00e5a0','#ffc542','#ff5c6a']

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500 font-mono text-sm animate-pulse">Loading dashboard…</div>
  if (error)   return <div className="text-red font-mono text-sm">{error}</div>

  const chartData = data.topProducts.map(p => ({ name: p.name.slice(0, 14), qty: p.quantity }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Dashboard</h2>
        <p className="text-sm text-gray-500 font-mono mt-1">Inventory at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Products"       value={data.totalProducts}      />
        <StatCard label="Categories"     value={data.totalCategories}    />
        <StatCard label="Suppliers"      value={data.totalSuppliers}     />
        <StatCard label="Low Stock"      value={data.lowStockProducts}   color="text-yellow" sub="qty ≤ threshold" />
        <StatCard label="Out of Stock"   value={data.outOfStockProducts} color="text-red"    sub="qty = 0" />
      </div>

      {/* Inventory value */}
      <div className="card bg-gradient-to-br from-accent/10 to-accent2/5 border-accent/20">
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Total Inventory Value</p>
        <p className="text-4xl font-extrabold tracking-tight mt-1">
          ₹{data.totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products chart */}
        <div className="card">
          <h3 className="font-bold text-sm mb-4 text-gray-300">Top 5 Products by Quantity</h3>
          {chartData.length === 0 ? (
            <p className="text-gray-600 text-sm font-mono">No product data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: '#555', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 11, fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#13131c', border: '1px solid #2a2a3d', borderRadius: 8, fontFamily: 'DM Mono', fontSize: 12 }}
                  cursor={{ fill: 'rgba(108,99,255,0.05)' }}
                />
                <Bar dataKey="qty" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent movements */}
        <div className="card">
          <h3 className="font-bold text-sm mb-4 text-gray-300">Recent Stock Movements</h3>
          {data.recentMovements.length === 0 ? (
            <p className="text-gray-600 text-sm font-mono">No movements yet</p>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {data.recentMovements.map((m) => (
                <div key={m._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                      m.type === 'IN' ? 'bg-green/10 text-green' :
                      m.type === 'OUT' ? 'bg-red/10 text-red' :
                      'bg-yellow/10 text-yellow'
                    }`}>{m.type}</span>
                    <span className="text-sm text-gray-300">{m.product?.name ?? 'Unknown'}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    {m.quantityBefore} → {m.quantityAfter}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
