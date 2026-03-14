import { useEffect, useState } from 'react'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api'
import Modal from '../components/Modal'

const EMPTY = { name: '', contactPerson: '', email: '', phone: '', address: '' }

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editItem,  setEditItem]  = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [err,       setErr]       = useState('')

  const load = () => {
    setLoading(true)
    getSuppliers().then(r => setSuppliers(r.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditItem(null); setForm(EMPTY); setErr(''); setShowForm(true) }
  const openEdit   = (s) => {
    setEditItem(s)
    setForm({ name: s.name, contactPerson: s.contactPerson || '', email: s.email || '', phone: s.phone || '', address: s.address || '' })
    setErr(''); setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr('')
    try {
      if (editItem) await updateSupplier(editItem._id, form)
      else          await createSupplier(form)
      setShowForm(false); load()
    } catch (e) {
      setErr(e.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return
    await deleteSupplier(id); load()
  }

  const F = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Suppliers</h2>
          <p className="text-xs font-mono text-gray-500 mt-0.5">{suppliers.length} suppliers</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Supplier</button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-mono text-sm animate-pulse">Loading…</div>
        ) : suppliers.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-mono text-sm">No suppliers yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {['Name','Contact','Email','Phone','Address','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s, i) => (
                  <tr key={s._id} className={`border-b border-border/40 hover:bg-surface2/50 transition-colors ${i % 2 ? 'bg-surface2/20' : ''}`}>
                    <td className="px-4 py-3 font-semibold">{s.name}</td>
                    <td className="px-4 py-3 text-gray-400">{s.contactPerson || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{s.address || '—'}</td>
                    <td className="px-4 py-3">
                      {s.isActive
                        ? <span className="badge-green">Active</span>
                        : <span className="badge-red">Inactive</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)}       className="btn-ghost !px-3 !py-1 text-xs">Edit</button>
                        <button onClick={() => handleDelete(s._id)} className="btn-danger !px-3 !py-1 text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <Modal title={editItem ? 'Edit Supplier' : 'New Supplier'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Company Name *</label>
                <input className="input" value={form.name} onChange={e => F('name', e.target.value)} required />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Contact Person</label>
                <input className="input" value={form.contactPerson} onChange={e => F('contactPerson', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Email</label>
                <input className="input" type="email" value={form.email} onChange={e => F('email', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-mono mb-1 block">Phone</label>
                <input className="input" value={form.phone} onChange={e => F('phone', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-mono mb-1 block">Address</label>
              <textarea className="input resize-none" rows={2} value={form.address} onChange={e => F('address', e.target.value)} />
            </div>
            {err && <p className="text-red text-xs font-mono">{err}</p>}
            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
