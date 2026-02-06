// Supply Tracker Types
export interface Supply {
  id: string
  name: string
  quantity: number
  unit: string
  lowThreshold: number
  lastUpdated: string
}

export interface SupplyStore {
  supplies: Supply[]
}

export type SortOption = 'name' | 'quantity' | 'status'
export type FilterOption = 'all' | 'low' | 'ok'

export interface FormData {
  name: string
  quantity: string
  unit: string
  lowThreshold: string
}
