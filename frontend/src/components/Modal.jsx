import { useEffect } from 'react'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-base">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
