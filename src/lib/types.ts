export type StoreStatus =
  | 'in-progress'
  | 'completed'
  | 'warning'
  | 'needs-action'

export interface Store {
  id: number
  name: string
  status: StoreStatus
  notes: string
  createdAt: string
  updatedAt: string
}
