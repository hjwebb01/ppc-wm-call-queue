import { useState, useEffect } from 'react'
import {
  Share2,
  Check,
  Copy,
  ClipboardList,
  AlertTriangle,
  Package,
} from 'lucide-react'
import type { Supply } from '../lib/types'

interface ShareButtonProps {
  supplies: Supply[]
}

export function ShareButton({ supplies }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const lowStockCount = supplies.filter(
    (s) => s.quantity <= s.lowThreshold,
  ).length
  const totalItems = supplies.length

  const generateReport = (): string => {
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const lowStock = supplies.filter((s) => s.quantity <= s.lowThreshold)
    const adequateStock = supplies.filter((s) => s.quantity > s.lowThreshold)

    let report = `📦 SUPPLY INVENTORY REPORT\n`
    report += `📅 ${date}\n`
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

    if (lowStock.length > 0) {
      report += `⚠️  LOW STOCK ALERT (${lowStock.length} items)\n`
      report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      lowStock.forEach((supply) => {
        const status = supply.quantity === 0 ? '⚠️ EMPTY' : '⚠️ LOW'
        report += `${supply.name.padEnd(20)} ${String(supply.quantity).padStart(6)} ${supply.unit.padEnd(12)} ${status}\n`
      })
      report += `\n`
    }

    if (adequateStock.length > 0) {
      report += `✓ ADEQUATE STOCK (${adequateStock.length} items)\n`
      report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      adequateStock.forEach((supply) => {
        report += `${supply.name.padEnd(20)} ${String(supply.quantity).padStart(6)} ${supply.unit.padEnd(12)} ✓ OK\n`
      })
    }

    report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    report += `Total Items: ${totalItems} | Low Stock: ${lowStockCount}\n`

    return report
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateReport())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors shadow-md"
      >
        <Share2 size={18} />
        <span className="font-medium">Share Report</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl animate-scale-in overflow-hidden">
            {/* Header */}
            <div className="bg-stone-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="text-[#c97b39]" size={24} />
                <h2 className="text-lg font-bold text-white">
                  Inventory Report
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-4 px-6 py-4 bg-stone-50 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Package className="text-[#c97b39]" size={20} />
                <span className="text-sm text-stone-600">
                  <strong className="text-stone-900">{totalItems}</strong> items
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={20} />
                <span className="text-sm text-stone-600">
                  <strong className="text-red-600">{lowStockCount}</strong> low
                  stock
                </span>
              </div>
            </div>

            {/* Preview */}
            <div className="p-6">
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                Report Preview
              </label>
              <div className="bg-stone-900 rounded-lg p-4 font-mono text-xs text-stone-300 max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{generateReport()}</pre>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6">
              <button
                onClick={handleCopy}
                className={`
                  w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all
                  ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-[#c97b39] text-white hover:bg-[#a06028] shadow-md hover:shadow-lg'
                  }
                `}
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    Copy Report
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-stone-500">
                Paste into email, chat, or document to share with your manager
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
