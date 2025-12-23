import type { Store } from '../../lib/types'

export const stores: Array<Store> = [
  {
    id: 1,
    name: 'Store 1',
    status: 'in-progress',
    notes: 'Notes 1',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
  },
  {
    id: 2,
    name: 'Store 2',
    status: 'completed',
    notes: 'Notes 2',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
  },
  {
    id: 3,
    name: 'Store 3',
    status: 'warning',
    notes: 'Notes 3',
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
  },
]

export default function getStores() {
  return [...stores]
}
