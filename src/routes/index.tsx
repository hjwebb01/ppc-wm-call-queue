import { useState, useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Plus,
  Package,
  AlertTriangle,
  TrendingDown,
  Boxes,
  Search,
} from 'lucide-react'
import { SupplyCard } from '../components/SupplyCard'
import { AddSupplyForm } from '../components/AddSupplyForm'
import { ShareButton } from '../components/ShareButton'
import { ImportExport } from '../components/ImportExport'
import type { Supply, SortOption, FilterOption } from '../lib/types'

export const Route = createFileRoute('/')({
  component: Index,
})

// Sample data for initial load
const sampleSupplies: Supply[] = [
  {
    id: '1',
    name: 'Safety Gloves',
    quantity: 5,
    unit: 'pairs',
    lowThreshold: 50,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Printer Paper',
    quantity: 124,
    unit: 'reams',
    lowThreshold: 50,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'AA Batteries',
    quantity: 15,
    unit: 'packs',
    lowThreshold: 50,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Masking Tape',
    quantity: 8,
    unit: 'rolls',
    lowThreshold: 50,
    lastUpdated: new Date().toISOString(),
  },
]

function Index() {
  const [supplies, setSupplies] = useState<Supply[]>(sampleSupplies)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  // Derived data
  const lowStockCount = useMemo(
    () => supplies.filter((s) => s.quantity <= s.lowThreshold).length,
    [supplies],
  )

  const filteredAndSortedSupplies = useMemo(() => {
    let result = [...supplies]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.unit.toLowerCase().includes(query),
      )
    }

    // Filter by status
    if (filterBy === 'low') {
      result = result.filter((s) => s.quantity <= s.lowThreshold)
    } else if (filterBy === 'ok') {
      result = result.filter((s) => s.quantity > s.lowThreshold)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'quantity':
          return b.quantity - a.quantity
        case 'status':
          const aLow = a.quantity <= a.lowThreshold ? 0 : 1
          const bLow = b.quantity <= b.lowThreshold ? 0 : 1
          return aLow - bLow
        default:
          return 0
      }
    })

    return result
  }, [supplies, searchQuery, filterBy, sortBy])

  // Handlers
  const handleAddSupply = (supplyData: Omit<Supply, 'id' | 'lastUpdated'>) => {
    const newSupply: Supply = {
      ...supplyData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    }
    setSupplies((prev) => [...prev, newSupply])
  }

  const handleUpdateSupply = (
    supplyData: Omit<Supply, 'id' | 'lastUpdated'>,
  ) => {
    if (!editingSupply) return

    setSupplies((prev) =>
      prev.map((s) =>
        s.id === editingSupply.id
          ? { ...s, ...supplyData, lastUpdated: new Date().toISOString() }
          : s,
      ),
    )
    setEditingSupply(null)
  }

  const handleUpdateQuantity = (id: string, delta: number) => {
    setSupplies((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newQuantity = Math.max(0, s.quantity + delta)
          return {
            ...s,
            quantity: newQuantity,
            lastUpdated: new Date().toISOString(),
          }
        }
        return s
      }),
    )
  }

  const handleEdit = (supply: Supply) => {
    setEditingSupply(supply)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setSupplies((prev) => prev.filter((s) => s.id !== id))
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSupply(null)
  }

  const handleImport = (importedSupplies: Supply[]) => {
    setSupplies(importedSupplies)
  }

  const handleClearAll = () => {
    setSupplies([])
  }

  return (
    <div className="min-h-screen bg-[#f5f3f0]">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#c97b39] to-[#e89b5c] rounded-lg flex items-center justify-center shadow-md">
                <Boxes className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900 tracking-tight">
                  Supply<span className="text-[#c97b39]">Tracker</span>
                </h1>
                <p className="text-xs text-stone-500 font-mono">
                  INVENTORY MANAGEMENT
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                  <Package className="text-stone-600" size={18} />
                </div>
                <div>
                  <p className="text-xs text-stone-500">Total Items</p>
                  <p className="text-lg font-bold font-mono text-stone-900">
                    {supplies.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${lowStockCount > 0 ? 'bg-red-100' : 'bg-green-100'}`}
                >
                  {lowStockCount > 0 ? (
                    <AlertTriangle className="text-red-600" size={18} />
                  ) : (
                    <TrendingDown className="text-green-600" size={18} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-stone-500">Low Stock</p>
                  <p
                    className={`text-lg font-bold font-mono ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {lowStockCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ShareButton supplies={supplies} />
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#c97b39] text-white rounded-lg hover:bg-[#a06028] transition-colors shadow-md"
              >
                <Plus size={18} />
                <span className="hidden sm:inline font-medium">Add Supply</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supplies..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 bg-white focus:border-[#c97b39] focus:ring-2 focus:ring-[#c97b39]/20 focus:outline-none transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="px-3 py-2.5 rounded-lg border border-stone-200 bg-white text-sm focus:border-[#c97b39] focus:outline-none cursor-pointer"
            >
              <option value="all">All Items</option>
              <option value="low">Low Stock</option>
              <option value="ok">Adequate Stock</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-lg border border-stone-200 bg-white text-sm focus:border-[#c97b39] focus:outline-none cursor-pointer flex items-center gap-2"
            >
              <option value="name">Sort by Name</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="status">Sort by Status</option>
            </select>

            <ImportExport
              supplies={supplies}
              onImport={handleImport}
              onClearAll={handleClearAll}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-stone-500">
            Showing{' '}
            <span className="font-semibold text-stone-900">
              {filteredAndSortedSupplies.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-stone-900">
              {supplies.length}
            </span>{' '}
            supplies
          </p>
          {filterBy !== 'all' && (
            <button
              onClick={() => setFilterBy('all')}
              className="text-sm text-[#c97b39] hover:text-[#a06028] font-medium"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Supply Grid */}
        {filteredAndSortedSupplies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedSupplies.map((supply, index) => (
              <SupplyCard
                key={supply.id}
                supply={supply}
                onUpdateQuantity={handleUpdateQuantity}
                onEdit={handleEdit}
                onDelete={handleDelete}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 border-dashed">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-stone-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              {supplies.length === 0
                ? 'No supplies yet'
                : 'No matching supplies'}
            </h3>
            <p className="text-stone-500 max-w-sm mx-auto mb-4">
              {supplies.length === 0
                ? 'Start building your inventory by adding your first supply item.'
                : "Try adjusting your search or filter to find what you're looking for."}
            </p>
            {supplies.length === 0 ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#c97b39] text-white rounded-lg hover:bg-[#a06028] transition-colors"
              >
                <Plus size={18} />
                Add Your First Supply
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterBy('all')
                }}
                className="text-[#c97b39] font-medium hover:text-[#a06028]"
              >
                Clear search and filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <AddSupplyForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingSupply ? handleUpdateSupply : handleAddSupply}
        editingSupply={editingSupply}
      />
    </div>
  )
}
