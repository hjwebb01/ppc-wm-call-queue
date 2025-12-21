import { stores } from './stores.get'
import type { Store } from '../../lib/types'

export default function patchStore(id: number, updates: Partial<Store>) {
  const store = stores.find((s) => s.id === id)
  if (!store) {
    throw new Error(`Store with id ${id} not found`)
  }

  if (updates.status) store.status = updates.status
  if (updates.notes !== undefined) store.notes = updates.notes

  store.updatedAt = new Date().toISOString()

  return store
}
