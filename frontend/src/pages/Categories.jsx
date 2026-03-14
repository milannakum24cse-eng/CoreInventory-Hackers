import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api'
import Modal from '../components/Modal'

export default function Categories() {
  const [cats,    setCats]   = useState([])
  const [loading, setLoading]= useState(true)
  const [showForm,setShowForm]= useState(false)
  const [editItem,setEditItem]= useState(null)
  const [form,    setForm]   = useState({ name: '', description: '' })
  const [saving,  setSaving] = useState(false)
  const [err,     setErr]    = useState('')

  const load = () => {
    setLoading(true)
    getCategories().then(r => setCats(r.data.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditItem(null); setForm({ name: '', description: '' }); setErr(''); setShowForm(true) }
  const openEdit   = (c) => { setEditItem(c); setForm({ name: c.name, description: c.description || '' }); setErr(''); setShowForm(true) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setErr('')
    try {
      if (editItem) await updateCategory(editItem._id, form)
      else          await createCategory(form)
      setShowForm(false); load()
    } catch (e) {
      setErr(e.response?.data?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    await deleteCategory(id); load()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Categories</h2>
          <p className="text-xs font-mono text-gray-500 mt-0.5">{cats.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Category</button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-mono text-sm animate-pulse">Loading…</div>
        ) : cats.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-mono text-sm">No categories yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {['Name','Description','Created','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cats.map((c, i) => (
                <tr key={c._id} className={`border-b border-border/40 hover:bg-surface2/50 transition-colors ${i % 2 ? 'bg-surface2/20' : ''}`}>
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{c.description || '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)}      className="btn-ghost !px-3 !py-1 text-xs">Edit</button>
                      <button onClick={() => handleDelete(c._id)} className="btn-danger !px-3 !py-1 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Modal title={editItem ? 'Edit Category' : 'New Category'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 font-mono mb-1 block">Name *</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-mono mb-1 block">Description</label>
              <textarea className="input resize-none" rows={2} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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
