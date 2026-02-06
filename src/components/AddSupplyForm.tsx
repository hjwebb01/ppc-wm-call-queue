import { useState, useEffect } from 'react'
import { X, Package, Hash, Layers, AlertCircle } from 'lucide-react'
import type { Supply, FormData } from '../lib/types'

interface AddSupplyFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (supply: Omit<Supply, 'id' | 'lastUpdated'>) => void
  editingSupply: Supply | null
}

const DEFAULT_FORM_DATA: FormData = {
  name: '',
  quantity: '',
  unit: '',
  lowThreshold: '50',
}

export function AddSupplyForm({
  isOpen,
  onClose,
  onSubmit,
  editingSupply,
}: AddSupplyFormProps) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  )

  useEffect(() => {
    if (editingSupply) {
      setFormData({
        name: editingSupply.name,
        quantity: editingSupply.quantity.toString(),
        unit: editingSupply.unit,
        lowThreshold: editingSupply.lowThreshold.toString(),
      })
    } else {
      setFormData(DEFAULT_FORM_DATA)
    }
    setErrors({})
  }, [editingSupply, isOpen])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required'
    }

    const quantity = parseFloat(formData.quantity)
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity = 'Enter a valid quantity'
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit type is required (e.g., boxes, kg, pieces)'
    }

    const threshold = parseFloat(formData.lowThreshold)
    if (isNaN(threshold) || threshold <= 0) {
      newErrors.lowThreshold = 'Enter a valid threshold'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        name: formData.name.trim(),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit.trim(),
        lowThreshold: parseFloat(formData.lowThreshold),
      })
      setFormData(DEFAULT_FORM_DATA)
      onClose()
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#c97b39] to-[#e89b5c] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="text-white" size={24} />
              <h2 className="text-xl font-bold text-white">
                {editingSupply ? 'Edit Supply' : 'Add New Supply'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Safety Gloves, Printer Paper"
              className={`
                w-full px-4 py-2.5 rounded-lg border-2 transition-all
                ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-stone-200 focus:border-[#c97b39] focus:ring-[#c97b39]/20'
                }
                focus:outline-none focus:ring-4
              `}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Quantity and Unit Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Current Quantity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={18}
                />
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="0"
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all
                    ${
                      errors.quantity
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-stone-200 focus:border-[#c97b39] focus:ring-[#c97b39]/20'
                    }
                    focus:outline-none focus:ring-4 font-mono
                  `}
                />
              </div>
              {errors.quantity && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Unit Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Layers
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  placeholder="boxes, kg"
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all
                    ${
                      errors.unit
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-stone-200 focus:border-[#c97b39] focus:ring-[#c97b39]/20'
                    }
                    focus:outline-none focus:ring-4
                  `}
                />
              </div>
              {errors.unit && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.unit}
                </p>
              )}
            </div>
          </div>

          {/* Low Threshold */}
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Low Stock Threshold <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <AlertCircle
                className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500"
                size={18}
              />
              <input
                type="number"
                min="1"
                step="any"
                value={formData.lowThreshold}
                onChange={(e) => handleChange('lowThreshold', e.target.value)}
                placeholder="50"
                className={`
                  w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-all
                  ${
                    errors.lowThreshold
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-stone-200 focus:border-[#c97b39] focus:ring-[#c97b39]/20'
                  }
                  focus:outline-none focus:ring-4 font-mono
                `}
              />
            </div>
            <p className="mt-1.5 text-xs text-stone-500">
              You'll be alerted when stock falls below this amount
            </p>
            {errors.lowThreshold && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.lowThreshold}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border-2 border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 hover:border-stone-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-[#c97b39] text-white font-semibold hover:bg-[#a06028] transition-colors shadow-md hover:shadow-lg"
            >
              {editingSupply ? 'Save Changes' : 'Add Supply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
