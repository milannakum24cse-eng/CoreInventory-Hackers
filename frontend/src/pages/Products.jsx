import { useEffect, useState, useCallback } from 'react'
import {
  getProducts, getCategories, getSuppliers,
  createProduct, updateProduct, deleteProduct,
  adjustStock, getMovements
} from '../api'
import Modal from '../components/Modal'

const EMPTY = {
  name: '', sku: '', description: '', category: '',
  supplier: '', price: '', costPrice: '', quantity: '',
  lowStockThreshold: 10, unit: 'pcs', location: '',
}

function StockBadge({ qty, threshold }) {
  if (qty === 0)           return <span className="badge-red">Out of Stock</span>
  if (qty <= threshold)    return <span className="badge-yellow">Low Stock</span>
  return                          <span className="badge-green">In Stock</span>
}

export default function Products() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers,  setSuppliers]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filterCat,  setFilterCat]  = useState('')

  // Modals
  const [showForm,   setShowForm]   = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [form,       setForm]       = useState(EMPTY)
  const [saving,     setSaving]     = useState(false)
  const [formErr,    setFormErr]    = useState('')

  // Stock adjustment modal
  const [stockModal, setStockModal] = useState(null) // product
  const [stockForm,  setStockForm]  = useState({ type: 'IN', quantity: '', reason: '' })
  const [stockErr,   setStockErr]   = useState('')

  // Movements modal
  const [movProduct, setMovProduct] = useState(null)
  const [movements,  setMovements]  = useState([])

  const load = useCallback(() => {
    setLoading(true)
    const params = {}
    if (search)    params.search   = search
    if (filterCat) params.category = filterCat
    getProducts(params)
      .then(r => setProducts(r.data.data))
      .finally(() => setLoading(false))
  }, [search, filterCat])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    getCategories().then(r => setCategories(r.data.data))
    getSuppliers().then(r => setSuppliers(r.data.data))
  }, [])

  // ── Form helpers ────────────────────────────────────────────
  const openCreate = () => { setEditItem(null); setForm(EMPTY); setFormErr(''); setShowForm(true) }
  const openEdit   = (p) => {
    setEditItem(p)
    setForm({
      name: p.name, sku: p.sku, description: p.description || '',
      category: p.category?._id || '', supplier: p.supplier?._id || '',
      price: p.price, costPrice: p.costPrice, quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold, unit: p.unit, location: p.location || '',
    })
    setFormErr(''); setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setFormErr('')
    try {
      if (editItem) await updateProduct(editItem._id, form)
      else          await createProduct(form)
      setShowForm(false); load()
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    await deleteProduct(id); load()
  }

  // ── Stock adjustment ────────────────────────────────────────
  const openStock = (p) => { setStockModal(p); setStockForm({ type: 'IN', quantity: '', reason: '' }); setStockErr('') }
  const handleStock = async (e) => {
    e.preventDefault(); setStockErr('')
    try {
      await adjustStock(stockModal._id, {
        ...stockForm, quantity: Number(stockForm.quantity)
      })
      setStockModal(null); load()
    } catch (err) {
      setStockErr(err.response?.data?.message || 'Failed')
    }
  }

  // ── Movements ───────────────────────────────────────────────
  const openMovements = async (p) => {
    const r = await getMovements(p._id)
    setMovements(r.data.data); setMovProduct(p)
  }

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Products</h2>
          <p className="text-xs font-mono text-gray-500 mt-0.5">{products.length} items</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Product</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          className="input max-w-xs"
          placeholder="Search name or SKU…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input max-w-xs" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-mono text-sm animate-pulse">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-mono text-sm">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {['Name','SKU','Category','Supplier','Price','Stock','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id} className={`border-b border-border/40 hover:bg-surface2/50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface2/20'}`}>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-accent">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-400">{p.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{p.supplier?.name || '—'}</td>
                    <td className="px-4 py-3 font-mono">₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono font-bold">{p.quantity} <span className="text-gray-600 font-normal">{p.unit}</span></td>
                    <td className="px-4 py-3"><StockBadge qty={p.quantity} threshold={p.lowStockThreshold} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openStock(p)}      className="btn-ghost !px-2 !py-1 text-xs">Stock</button>
                        <button onClick={() => openMovements(p)}  className="btn-ghost !px-2 !py-1 text-xs">Log</button>
                        <button onClick={() => openEdit(p)}       className="btn-ghost !px-2 !py-1 text-xs">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="btn-danger !px-2 !py-1 text-xs">Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <Modal title={editItem ? 'Edit Product' : 'New Product'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Name *</label>
                <input className="input" value={form.name} onChange={e => F('name', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">SKU *</label>
                <input className="input" value={form.sku} onChange={e => F('sku', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Category *</label>
                <select className="input" value={form.category} onChange={e => F('category', e.target.value)} required>
                  <option value="">Select…</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Supplier</label>
                <select className="input" value={form.supplier} onChange={e => F('supplier', e.target.value)}>
                  <option value="">None</option>
                  {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Price (₹) *</label>
                <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={e => F('price', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Cost Price (₹)</label>
                <input className="input" type="number" min="0" step="0.01" value={form.costPrice} onChange={e => F('costPrice', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Initial Qty</label>
                <input className="input" type="number" min="0" value={form.quantity} onChange={e => F('quantity', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Low Stock Alert</label>
                <input className="input" type="number" min="0" value={form.lowStockThreshold} onChange={e => F('lowStockThreshold', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Unit</label>
                <input className="input" value={form.unit} onChange={e => F('unit', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Location</label>
                <input className="input" value={form.location} onChange={e => F('location', e.target.value)} placeholder="e.g. Shelf A-3" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-mono mb-1 block">Description</label>
              <textarea className="input resize-none" rows={2} value={form.description} onChange={e => F('description', e.target.value)} />
            </div>
            {formErr && <p className="text-red text-xs font-mono">{formErr}</p>}
            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Stock Adjustment Modal */}
      {stockModal && (
        <Modal title={`Adjust Stock — ${stockModal.name}`} onClose={() => setStockModal(null)}>
          <p className="text-xs font-mono text-gray-500 mb-4">
            Current: <span className="text-white font-bold">{stockModal.quantity} {stockModal.unit}</span>
          </p>
          <form onSubmit={handleStock} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-mono mb-1 block">Type</label>
              <select className="input" value={stockForm.type} onChange={e => setStockForm(f => ({ ...f, type: e.target.value }))}>
                <option value="IN">IN — Receive stock</option>
                <option value="OUT">OUT — Dispatch stock</option>
                <option value="ADJUSTMENT">ADJUSTMENT — Set absolute qty</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-mono mb-1 block">Quantity *</label>
              <input className="input" type="number" min="0" value={stockForm.quantity}
                onChange={e => setStockForm(f => ({ ...f, quantity: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-mono mb-1 block">Reason</label>
              <input className="input" value={stockForm.reason}
                onChange={e => setStockForm(f => ({ ...f, reason: e.target.value }))}
                placeholder="e.g. Purchase order #123" />
            </div>
            {stockErr && <p className="text-red text-xs font-mono">{stockErr}</p>}
            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={() => setStockModal(null)} className="btn-ghost">Cancel</button>
              <button type="submit" className="btn-primary">Apply</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Movements Modal */}
      {movProduct && (
        <Modal title={`Stock Log — ${movProduct.name}`} onClose={() => setMovProduct(null)}>
          {movements.length === 0 ? (
            <p className="text-gray-600 text-sm font-mono">No movements recorded</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {movements.map(m => (
                <div key={m._id} className="flex items-center justify-between text-sm border-b border-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                      m.type === 'IN' ? 'bg-green/10 text-green' :
                      m.type === 'OUT' ? 'bg-red/10 text-red' : 'bg-yellow/10 text-yellow'
                    }`}>{m.type}</span>
                    <span className="text-gray-300">{m.reason || '—'}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-gray-400">{m.quantityBefore} → {m.quantityAfter}</p>
                    <p className="font-mono text-xs text-gray-600">{new Date(m.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
