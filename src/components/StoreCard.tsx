import { useState } from 'react'
import type { Store, StoreStatus } from '../lib/types'

const statusStyles: Record<StoreStatus, { bg: string; text: string }> = {
  'in-progress': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  completed: { bg: 'bg-green-500/10', text: 'text-green-400' },
  warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  'needs-action': { bg: 'bg-red-500/10', text: 'text-red-400' },
}

export default function StoreCard({
  store,
  onStatusChange,
  onUpdateNotes,
}: {
  store: Store
  onStatusChange: (status: StoreStatus) => void
  onUpdateNotes: (n: string) => void
}) {
  const [notes, setNotes] = useState(store.notes)
  const isCompleted = store.status === 'completed'
  const currentStyles = statusStyles[store.status]

  return (
    <div
      className={`
      group p-6 rounded-xl border transition-all duration-200
      ${
        isCompleted
          ? 'bg-slate-900/50 border-slate-800 opacity-75'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600 shadow-sm'
      }
    `}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <select
            value={store.status}
            onChange={(e) => onStatusChange(e.target.value as StoreStatus)}
            className="px-1.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none cursor-pointer transition-colors hover:border-slate-600"
          >
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="warning">Warning</option>
            <option value="needs-action">Needs Action</option>
          </select>
          <div>
            <h3
              className={`text-xl font-bold ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}
            >
              {store.name}
            </h3>
            <span
              className={`
              inline-block px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider mt-1
              ${currentStyles.bg} ${currentStyles.text}
            `}
            >
              {store.status}
            </span>
          </div>
        </div>
        <div className="text-xs text-slate-500 font-mono">#{store.id}</div>
      </div>

      <div className="pl-12">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onUpdateNotes(notes)}
          placeholder="Add notes here..."
          rows={2}
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none resize-none transition-colors placeholder-slate-600"
        />
      </div>
    </div>
  )
}
