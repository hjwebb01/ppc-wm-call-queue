import { useState } from 'react'
import { Check } from 'lucide-react'
import type { Store } from '../lib/types'

export default function StoreCard({
  store,
  onToggle,
  onUpdateNotes,
}: {
  store: Store
  onToggle: () => void
  onUpdateNotes: (n: string) => void
}) {
  const [notes, setNotes] = useState(store.notes)
  const isCompleted = store.status === 'completed'

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
          <button
            onClick={onToggle}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2
              ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-slate-500 text-transparent hover:border-cyan-400'
              }
            `}
          >
            <Check className="w-5 h-5" strokeWidth={3} />
          </button>
          <div>
            <h3
              className={`text-xl font-bold ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}
            >
              {store.name}
            </h3>
            <span
              className={`
              inline-block px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider mt-1
              ${isCompleted ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}
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
