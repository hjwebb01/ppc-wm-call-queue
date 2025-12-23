import { stores } from './stores.get'
import type { Store } from '../../lib/types'

export default function postStore(name: string) {
  const maxId = stores.reduce(
    (max, store) => (store.id > max ? store.id : max),
    0,
  )

  const newStore: Store = {
    id: maxId + 1,
    name: name.trim(),
    status: 'in-progress',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  stores.push(newStore)
  return newStore
}
