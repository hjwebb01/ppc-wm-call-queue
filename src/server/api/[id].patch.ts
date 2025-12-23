import { stores } from './stores.get'
import type { Store } from '../../lib/types'

export default function patchStore(id: number, updates: Partial<Store>) {
  const index = stores.findIndex((s) => s.id === id)

  if (index === -1) {
    throw new Error(`Store with id ${id} not found`)
  }

  // Create a new object to ensure reactivity and avoid direct mutation
  const updatedStore: Store = {
    ...stores[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  stores[index] = updatedStore
  return updatedStore
}
