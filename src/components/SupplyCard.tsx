import { useState } from 'react'
import {
  Package,
  AlertTriangle,
  Minus,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'
import type { Supply } from '../lib/types'

interface SupplyCardProps {
  supply: Supply
  onUpdateQuantity: (id: string, delta: number) => void
  onEdit: (supply: Supply) => void
  onDelete: (id: string) => void
  index: number
}

export function SupplyCard({
  supply,
  onUpdateQuantity,
  onEdit,
  onDelete,
  index,
}: SupplyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isLow = supply.quantity <= supply.lowThreshold
  const percentage = Math.min(
    (supply.quantity / supply.lowThreshold) * 100,
    100,
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      className={`
        relative group rounded-lg p-5 transition-all duration-300 ease-out
        animate-slide-in stagger-${Math.min(index + 1, 6)}
        ${
          isLow
            ? 'bg-red-50 border-2 border-red-400 shadow-lg shadow-red-100 animate-pulse-border'
            : 'bg-white border border-stone-200 hover:border-[#c97b39] hover:shadow-lg hover:shadow-stone-200/50'
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Low Stock Indicator Badge */}
      {isLow && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 animate-scale-in">
          <AlertTriangle size={12} />
          LOW STOCK
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`
            w-10 h-10 rounded-lg flex items-center justify-center transition-colors
            ${isLow ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-[#c97b39]'}
          `}
          >
            <Package size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-stone-900 leading-tight">
              {supply.name}
            </h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Updated {formatDate(supply.lastUpdated)}
            </p>
          </div>
        </div>

        {/* Action Buttons - Show on hover */}
        <div
          className={`
          flex gap-1 transition-all duration-200
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
        `}
        >
          <button
            onClick={() => onEdit(supply)}
            className="p-1.5 text-stone-400 hover:text-[#c97b39] hover:bg-stone-100 rounded-md transition-colors"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(supply.id)}
            className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Quantity Display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span
            className={`
            text-4xl font-bold font-mono tracking-tight
            ${isLow ? 'text-red-600' : 'text-stone-900'}
          `}
          >
            {supply.quantity}
          </span>
          <span className="text-sm text-stone-500 font-medium">
            {supply.unit}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span
            className={isLow ? 'text-red-600 font-medium' : 'text-stone-500'}
          >
            Stock Level
          </span>
          <span className="font-mono text-stone-400">
            threshold: {supply.lowThreshold}
          </span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`
              h-full rounded-full transition-all duration-700 ease-out animate-fill-bar
              ${
                isLow
                  ? 'bg-gradient-to-r from-red-400 to-red-500'
                  : percentage >= 100
                    ? 'bg-gradient-to-r from-[#16a34a] to-green-500'
                    : 'bg-gradient-to-r from-[#c97b39] to-[#e89b5c]'
              }
            `}
            style={{ width: `${Math.max(percentage, 8)}%` }}
          />
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(supply.id, -1)}
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center transition-all
              ${
                supply.quantity > 0
                  ? 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  : 'bg-stone-50 text-stone-300 cursor-not-allowed'
              }
            `}
            disabled={supply.quantity <= 0}
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-mono font-semibold text-stone-900">
            {supply.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(supply.id, 1)}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#c97b39] text-white hover:bg-[#a06028] transition-colors shadow-sm hover:shadow"
          >
            <Plus size={16} />
          </button>
        </div>

        <span
          className={`
          text-xs font-semibold px-2 py-1 rounded-md
          ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
        `}
        >
          {isLow ? '⚠ REPLENISH' : '✓ ADEQUATE'}
        </span>
      </div>
    </div>
  )
}
