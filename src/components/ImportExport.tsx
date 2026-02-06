import { useRef, useState } from 'react'
import { Download, Upload, AlertCircle, Check, Trash2 } from 'lucide-react'
import type { Supply, SupplyStore } from '../lib/types'

interface ImportExportProps {
  supplies: Supply[]
  onImport: (supplies: Supply[]) => void
  onClearAll: () => void
}

export function ImportExport({
  supplies,
  onImport,
  onClearAll,
}: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [importStatus, setImportStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleExport = () => {
    const data: SupplyStore = { supplies }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `supplies-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data: SupplyStore = JSON.parse(e.target?.result as string)

        if (!data.supplies || !Array.isArray(data.supplies)) {
          throw new Error('Invalid file format')
        }

        const validSupplies = data.supplies.filter(
          (s) =>
            s.id &&
            s.name &&
            typeof s.quantity === 'number' &&
            s.unit &&
            typeof s.lowThreshold === 'number',
        )

        if (validSupplies.length === 0) {
          throw new Error('No valid supplies found')
        }

        onImport(validSupplies)
        setImportStatus('success')
        setStatusMessage(`Imported ${validSupplies.length} supplies`)

        setTimeout(() => {
          setImportStatus('idle')
          setStatusMessage('')
        }, 3000)
      } catch (err) {
        setImportStatus('error')
        setStatusMessage('Invalid file format')
        setTimeout(() => {
          setImportStatus('idle')
          setStatusMessage('')
        }, 3000)
      }
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {/* Import Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-colors"
        title="Import from JSON"
      >
        <Upload size={16} />
        <span>Import</span>
      </button>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-colors"
        title="Export to JSON"
      >
        <Download size={16} />
        <span>Export</span>
      </button>

      {/* Clear All Button */}
      <button
        onClick={() => setShowClearConfirm(true)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
        title="Clear all supplies"
      >
        <Trash2 size={16} />
        <span>Clear All</span>
      </button>

      {/* Status Message */}
      {importStatus !== 'idle' && (
        <div
          className={`
          flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg
          ${
            importStatus === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }
        `}
        >
          {importStatus === 'success' ? (
            <Check size={14} />
          ) : (
            <AlertCircle size={14} />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          />

          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Clear All Data?
              </h3>
            </div>

            <p className="text-stone-600 mb-6">
              This will permanently delete all {supplies.length} supply items.
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border-2 border-stone-200 text-stone-600 font-medium hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll()
                  setShowClearConfirm(false)
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
