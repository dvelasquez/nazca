// TODO: Document in Cursor rules: API endpoints for BPMN model management (GET/PUT/POST /process-definitions, types from web/src/types/api.d.ts) must be defined and kept up to date for frontend-backend contract.
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import type { BaseViewerOptions } from 'bpmn-js/lib/BaseViewer'
import Modeler from 'bpmn-js/lib/Modeler'
import { useEffect, useRef, useState } from 'react'

import { DEFAULT_BPMN_XML } from './bpmn-default-xml';
import {
  fetchProcessDefinitions,
  fetchProcessDefinitionById,
  updateProcessDefinition,
  createProcessDefinition,
  type ProcessDefinitionWithRelations,
  type ProcessDefinition,
  type NewProcessDefinition
} from '../../services/bpmn-service'
import BpmnEditorToolbar from './BpmnEditorToolbar'

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
  const [processDefinitionName, setProcessDefinitionName] = useState('')
  const [models, setModels] = useState<ProcessDefinitionWithRelations[]>([])
  const [selectedProcessDefinitionId, setSelectedProcessDefinitionId] = useState<string | null>(null)
  const [isNewProcessDefinition, setIsNewProcessDefinition] = useState(false)
  const [processJson, setProcessJson] = useState('')

  // Extract process name from model
  async function updateProcessNameFromModeler() {
    if (!modelerRef.current) return
    const processElement = getProcessElement(modelerRef.current)
    if (processElement && processElement.businessObject && typeof processElement.businessObject.name === 'string') {
      setProcessDefinitionName(processElement.businessObject.name)
    } else {
      setProcessDefinitionName('')
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

  // Fetch models on mount
  useEffect(() => {
    fetchProcessDefinitions()
      .then(setModels)
      .catch((err) => setError(err.message || 'Failed to fetch models'))
  }, [])

  // Load selected model
  useEffect(() => {
    if (!selectedProcessDefinitionId) return
    setIsLoading(true)
    setError(null)
    fetchProcessDefinitionById(selectedProcessDefinitionId)
      .then((model) => {
        modelerRef.current?.importXML(model.bpmnXml)
        setProcessDefinitionName(model.name)
        logCurrentModel(modelerRef.current, setProcessJson)
      })
      .catch((err) => setError(err.message || 'Failed to load model'))
      .finally(() => setIsLoading(false))
  }, [selectedProcessDefinitionId])

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
    setProcessDefinitionName(newName)
    if (!modelerRef.current) return
    const modeler = modelerRef.current
    const processElement = getProcessElement(modeler)
    if (processElement) {
      const modeling = modeler.get('modeling') as { updateProperties: (el: any, props: any) => void }
      modeling.updateProperties(processElement, { name: newName })
      logCurrentModel(modeler, setProcessJson)
    }
  }

  // New ProcessDefinition handler
  function handleNewProcessDefinition() {
    setIsNewProcessDefinition(true)
    setSelectedProcessDefinitionId(null)
    setProcessDefinitionName('')
    setError(null)
    setIsLoading(true)
    modelerRef.current?.importXML(DEFAULT_BPMN_XML)
      .then(() => {
        setIsLoading(false)
        logCurrentModel(modelerRef.current, setProcessJson)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load default diagram')
        setIsLoading(false)
      })
  }

  // Save ProcessDefinition (create or update)
  async function handleSave() {
    if (!modelerRef.current) {
      setError('Editor is not ready.')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const { xml } = await modelerRef.current.saveXML({ format: true })
      if (!xml) {
        setError('Cannot save: BPMN XML is undefined.')
        setIsLoading(false)
        return
      }
      if (isNewProcessDefinition || !selectedProcessDefinitionId) {
        // Create new
        const newDef: NewProcessDefinition = {
          name: processDefinitionName,
          bpmnXml: xml
        }
        const created = await createProcessDefinition(newDef)
        setIsNewProcessDefinition(false)
        setSelectedProcessDefinitionId(created.id || null)
        setProcessDefinitionName(created.name)
        // Refresh list
        const updatedModels = await fetchProcessDefinitions()
        setModels(updatedModels)
      } else {
        // Update existing
        const model = models.find((m) => m.id === selectedProcessDefinitionId)
        if (!model) throw new Error('ProcessDefinition not found')
        const updated: ProcessDefinition = {
          id: model.id!,
          name: processDefinitionName,
          bpmnXml: xml,
          tenantId: model.tenantId
        }
        await updateProcessDefinition(model.id!, updated)
        // Refresh list
        const updatedModels = await fetchProcessDefinitions()
        setModels(updatedModels)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ProcessDefinition')
    } finally {
      setIsLoading(false)
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
      <BpmnEditorToolbar
        models={models}
        selectedProcessDefinitionId={selectedProcessDefinitionId}
        onSelectProcessDefinition={setSelectedProcessDefinitionId}
        onNewProcessDefinition={handleNewProcessDefinition}
        onSave={handleSave}
        onImport={handleImport}
        onExportXml={handleExportXml}
        onExportSvg={handleExportSvg}
        onDownloadJson={handleDownloadJson}
        onReset={handleReset}
        processDefinitionName={processDefinitionName}
        onProcessDefinitionNameChange={e => setProcessDefinitionName(e.target.value)}
        isLoading={isLoading}
        error={error}
      />
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