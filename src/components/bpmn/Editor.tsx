import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import type { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import Modeler from 'bpmn-js/lib/Modeler'
import { useEffect, useRef, useState } from 'react'

import { DEFAULT_BPMN_XML } from './bpmn-default-xml';

// Helper to safely serialize BPMN moddle objects
function safeStringify(obj: any) {
  const seen = new WeakSet()
  return JSON.stringify(obj, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return
      seen.add(value)
    }
    // Remove circular references and parent links
    if (key === '$parent') return
    return value
  }, 2)
}

function storeProcessJson(modeler: Modeler | null, setProcessJson: (json: string) => void) {
  if (!modeler) return
  try {
    // Get the full definitions object
    const definitions = (modeler as any).getDefinitions ? (modeler as any).getDefinitions() : null
    if (definitions) {
      setProcessJson(safeStringify(definitions))
    }
  } catch (err) {
    setProcessJson('')
  }
}

function logCurrentModel(modeler: Modeler | null, setProcessJson?: (json: string) => void) {
  if (!modeler) return
  try {
    const elementRegistry = modeler.get('elementRegistry') as { getAll: () => any[] }
    const allElements = elementRegistry.getAll()
    // Optionally, you can also log the root element:
    const canvas = modeler.get('canvas') as { getRootElement: () => any }
    const rootElement = canvas.getRootElement()
    // Log a simplified snapshot
    console.log('[BPMN MODEL] Root Element:', rootElement)
    console.log('[BPMN MODEL] All Elements:', allElements)
    // For a more detailed view, you could log the businessObject of the root
    if (rootElement && rootElement.businessObject) {
      console.log('[BPMN MODEL] Root BusinessObject:', rootElement.businessObject)
    }
    // Store JSON for download if setProcessJson is provided
    if (setProcessJson) {
      storeProcessJson(modeler, setProcessJson)
    }
  } catch (err) {
    console.error('Failed to log BPMN model:', err)
  }
}

function getProcessElement(modeler: Modeler) {
  // Find the first process element in the registry
  const elementRegistry = modeler.get('elementRegistry') as {
    getAll: () => any[]
  }
  const allElements = elementRegistry.getAll()
  return allElements.find((el) => el && typeof el.type === 'string' && el.type === 'bpmn:Process')
}

function BpmnEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<Modeler | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processName, setProcessName] = useState('')
  const [processJson, setProcessJson] = useState('')

  // Extract process name from model
  async function updateProcessNameFromModeler() {
    if (!modelerRef.current) return
    const processElement = getProcessElement(modelerRef.current)
    if (processElement && processElement.businessObject && typeof processElement.businessObject.name === 'string') {
      setProcessName(processElement.businessObject.name)
    } else {
      setProcessName('')
    }
  }

  // Initialize Modeler
  useEffect(() => {
    if (!containerRef.current) return
    const options: BaseViewerOptions = {
      container: containerRef.current,
      width: '100%',
      height: '100%'
    }
    modelerRef.current = new Modeler(options)
    // Load default diagram
    modelerRef.current.importXML(DEFAULT_BPMN_XML)
      .then(() => {
        setIsLoading(false)
        updateProcessNameFromModeler()
        logCurrentModel(modelerRef.current, setProcessJson)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load default diagram')
        setIsLoading(false)
      })
    return () => {
      modelerRef.current?.destroy()
      modelerRef.current = null
    }
  }, [])

  // Import BPMN XML from file
  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setIsLoading(true)
    setError(null)
    try {
      const xml = await file.text()
      await modelerRef.current?.importXML(xml)
      await updateProcessNameFromModeler()
      logCurrentModel(modelerRef.current, setProcessJson)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import BPMN XML')
    } finally {
      setIsLoading(false)
    }
  }

  // Export BPMN XML
  async function handleExportXml() {
    try {
      const { xml } = await modelerRef.current!.saveXML({ format: true })
      downloadFile(xml || '', 'diagram.bpmn')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export BPMN XML')
    }
  }

  // Export SVG
  async function handleExportSvg() {
    try {
      const { svg } = await modelerRef.current!.saveSVG()
      downloadFile(svg, 'diagram.svg')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export SVG')
    }
  }

  // Reset diagram
  async function handleReset() {
    setIsLoading(true)
    setError(null)
    try {
      await modelerRef.current?.importXML(DEFAULT_BPMN_XML)
      await updateProcessNameFromModeler()
      logCurrentModel(modelerRef.current, setProcessJson)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset diagram')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle process name change from input
  async function handleProcessNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newName = event.target.value
    setProcessName(newName)
    if (!modelerRef.current) return
    const processElement = getProcessElement(modelerRef.current)
    if (processElement) {
      const modeling = modelerRef.current.get('modeling') as { updateProperties: (el: any, props: any) => void }
      modeling.updateProperties(processElement, { name: newName })
      logCurrentModel(modelerRef.current, setProcessJson)
    }
  }

  // Download helper
  function downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Download process JSON
  function handleDownloadJson() {
    downloadFile(processJson, 'process.json')
  }

  return (
    <div className="bpmn-editor">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="file"
          accept=".bpmn,.xml"
          onChange={handleImport}
          className="file-input file-input-bordered"
          data-testid="import-bpmn"
        />
        <button
          onClick={handleExportXml}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          data-testid="export-xml"
        >Export XML</button>
        <button
          onClick={handleExportSvg}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          data-testid="export-svg"
        >Export SVG</button>
        <button
          onClick={handleDownloadJson}
          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          data-testid="export-json"
        >Download JSON</button>
        <button
          onClick={handleReset}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          data-testid="reset-diagram"
        >Reset</button>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="process-name" className="font-medium">Process Name:</label>
        <input
          id="process-name"
          type="text"
          value={processName}
          onChange={handleProcessNameChange}
          className="input input-bordered"
          placeholder="Enter process name"
          data-testid="process-name-input"
        />
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading BPMN editor...</div>
        </div>
      )}
      {error && (
        <div className="error-message text-red-700 bg-red-100 border border-red-400 rounded px-4 py-3 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div
        ref={containerRef}
        className="bpmn-container"
        style={{
          width: '100%',
          height: '600px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          minHeight: '400px',
          background: '#fff',
        }}
        data-testid="bpmn-editor-canvas"
      />
    </div>
  )
}

export default BpmnEditor 