import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Check, Loader2, Plus } from 'lucide-react'
import getStores from '../server/api/stores.get'
import postStore from '../server/api/stores.post'
import patchStore from '../server/api/[id].patch'
import type { Store } from '../lib/types'

export const Route = createFileRoute('/')({
  component: StoreTracker,
  loader: async ({ context: { queryClient } }) =>
    await queryClient.ensureQueryData({
      queryKey: ['stores'],
      queryFn: () => getStores(),
    }),
})

function StoreTracker() {
  const router = useRouter()
  // Ensure we have an array (loader returns the array directly)
  const initialStores = Route.useLoaderData()
  const [newStoreName, setNewStoreName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Sort by ID descending (newest first)
  const stores = [...initialStores].sort((a, b) => b.id - a.id)

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStoreName.trim()) return

    setIsAdding(true)
    try {
      postStore(newStoreName)
      setNewStoreName('')
      await router.invalidate()
    } finally {
      setIsAdding(false)
    }
  }

  const handleToggleStatus = async (store: Store) => {
    const newStatus = store.status === 'completed' ? 'in-progress' : 'completed'
    patchStore(store.id, { status: newStatus })
    await router.invalidate()
  }

  const handleUpdateNotes = async (store: Store, notes: string) => {
    if (store.notes === notes) return
    patchStore(store.id, { notes })
    await router.invalidate() // Optional: immediate update not strictly needed if local state matches text, but good for sync
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Store Tracker
            </h1>
            <p className="text-slate-400">Manage store progress and notes</p>
          </div>
        </header>

        {/* Add Store Form */}
        <form
          onSubmit={handleAddStore}
          className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 flex gap-4 items-end shadow-lg"
        >
          <div className="flex-1">
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Store Number / Name
            </label>
            <input
              id="storeName"
              type="text"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              placeholder="e.g. Store 1234"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-white placeholder-slate-600"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !newStoreName.trim()}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {isAdding ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            Add Store
          </button>
        </form>

        {/* Store List */}
        <div className="grid gap-4">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onToggle={() => handleToggleStatus(store)}
              onUpdateNotes={(n) => handleUpdateNotes(store, n)}
            />
          ))}
          {stores.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
              No stores tracked yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StoreCard({
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
