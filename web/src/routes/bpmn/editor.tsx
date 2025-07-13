import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import BpmnEditor from '../../components/bpmn/Editor'
import {
  fetchProcessDefinitions,
  fetchProcessDefinitionById,
  updateProcessDefinition,
  createProcessDefinition,
  fetchTenants,
  type ProcessDefinitionWithRelations,
  type ProcessDefinition,
  type NewProcessDefinition
} from '../../services/bpmn-service'
import { DEFAULT_BPMN_XML } from '../../components/bpmn/bpmn-default-xml'
import Modeler from 'bpmn-js/lib/Modeler'
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

export const Route = createFileRoute('/bpmn/editor')({
  component: RouteComponent,
})

function RouteComponent() {
  // Data state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processDefinitionName, setProcessDefinitionName] = useState('')
  const [models, setModels] = useState<ProcessDefinitionWithRelations[]>([])
  const [selectedProcessDefinitionId, setSelectedProcessDefinitionId] = useState<string | null>(null)
  const [isNewProcessDefinition, setIsNewProcessDefinition] = useState(false)
  const [tenants, setTenants] = useState<any[]>([])
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  // Modeler ref
  const modelerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const propertiesPanelRef = useRef<HTMLDivElement>(null)

  // Helper: log model
  function logCurrentModel(modeler: any) {
    if (!modeler) return
    try {
      const elementRegistry = modeler.get('elementRegistry') as { getAll: () => any[] }
      const allElements = elementRegistry.getAll()
      const canvas = modeler.get('canvas') as { getRootElement: () => any }
      const rootElement = canvas.getRootElement()
      console.log('[BPMN MODEL] Root Element:', rootElement)
      console.log('[BPMN MODEL] All Elements:', allElements)
      if (rootElement && rootElement.businessObject) {
        console.log('[BPMN MODEL] Root BusinessObject:', rootElement.businessObject)
      }
    } catch (err) {
      console.error('Failed to log BPMN model:', err)
    }
  }
  // Helper: get process element
  function getProcessElement(modeler: any) {
    const elementRegistry = modeler.get('elementRegistry') as { getAll: () => any[] }
    const allElements = elementRegistry.getAll()
    return allElements.find((el) => el && typeof el.type === 'string' && el.type === 'bpmn:Process')
  }
  // Helper: update process name from modeler
  async function updateProcessNameFromModeler() {
    if (!modelerRef.current) return
    const processElement = getProcessElement(modelerRef.current)
    if (processElement && processElement.businessObject && typeof processElement.businessObject.name === 'string') {
      setProcessDefinitionName(processElement.businessObject.name)
    } else {
      setProcessDefinitionName('')
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
  // Initialize Modeler
  useEffect(() => {
    if (!containerRef.current) return
    const options = {
      container: containerRef.current,
      width: '100%',
      height: '100%',
      propertiesPanel: {
        parent: propertiesPanelRef.current
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule
      ],
    }
    modelerRef.current = new Modeler(options)
    modelerRef.current.importXML(DEFAULT_BPMN_XML)
      .then(() => {
        setIsLoading(false)
        updateProcessNameFromModeler()
        logCurrentModel(modelerRef.current)
      })
      .catch((err: any) => {
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
  // Fetch tenants on mount
  useEffect(() => {
    fetchTenants()
      .then(setTenants)
      .catch((err) => setError(err.message || 'Failed to fetch tenants'))
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
        logCurrentModel(modelerRef.current)
      })
      .catch((err) => setError(err.message || 'Failed to load model'))
      .finally(() => setIsLoading(false))
  }, [selectedProcessDefinitionId])
  // Handlers
  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setIsLoading(true)
    setError(null)
    try {
      const xml = await file.text()
      await modelerRef.current?.importXML(xml)
      await updateProcessNameFromModeler()
      logCurrentModel(modelerRef.current)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import BPMN XML')
    } finally {
      setIsLoading(false)
    }
  }
  async function handleExportXml() {
    try {
      const { xml } = await modelerRef.current!.saveXML({ format: true })
      downloadFile(xml || '', 'diagram.bpmn')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export BPMN XML')
    }
  }
  async function handleReset() {
    setIsLoading(true)
    setError(null)
    try {
      await modelerRef.current?.importXML(DEFAULT_BPMN_XML)
      await updateProcessNameFromModeler()
      logCurrentModel(modelerRef.current)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset diagram')
    } finally {
      setIsLoading(false)
    }
  }
  async function handleProcessNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newName = event.target.value
    setProcessDefinitionName(newName)
    if (!modelerRef.current) return
    const modeler = modelerRef.current
    const processElement = getProcessElement(modeler)
    if (processElement) {
      const modeling = modeler.get('modeling') as { updateProperties: (el: any, props: any) => void }
      modeling.updateProperties(processElement, { name: newName })
      logCurrentModel(modeler)
    }
  }
  function handleNewProcessDefinition() {
    setIsNewProcessDefinition(true)
    setSelectedProcessDefinitionId(null)
    setProcessDefinitionName('')
    setError(null)
    setIsLoading(true)
    modelerRef.current?.importXML(DEFAULT_BPMN_XML)
      .then(() => {
        setIsLoading(false)
        logCurrentModel(modelerRef.current)
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to load default diagram')
        setIsLoading(false)
      })
    setSelectedTenantId(null)
  }
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
        const newDef: NewProcessDefinition = {
          name: processDefinitionName,
          bpmnXml: xml,
          tenantId: selectedTenantId || undefined
        }
        const created = await createProcessDefinition(newDef)
        setIsNewProcessDefinition(false)
        setSelectedProcessDefinitionId(created.id || null)
        setProcessDefinitionName(created.name)
        const updatedModels = await fetchProcessDefinitions()
        setModels(updatedModels)
      } else {
        const model = models.find((m) => m.id === selectedProcessDefinitionId)
        if (!model) throw new Error('ProcessDefinition not found')
        const updated: ProcessDefinition = {
          id: model.id!,
          name: processDefinitionName,
          bpmnXml: xml,
          tenantId: model.tenantId
        }
        await updateProcessDefinition(model.id!, updated)
        const updatedModels = await fetchProcessDefinitions()
        setModels(updatedModels)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ProcessDefinition')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">BPMN Editor</h1>
      <BpmnEditor
        models={models}
        selectedProcessDefinitionId={selectedProcessDefinitionId}
        onSelectProcessDefinition={setSelectedProcessDefinitionId}
        onNewProcessDefinition={handleNewProcessDefinition}
        onSave={handleSave}
        onImport={handleImport}
        onExportXml={handleExportXml}
        onReset={handleReset}
        processDefinitionName={processDefinitionName}
        onProcessDefinitionNameChange={handleProcessNameChange}
        isLoading={isLoading}
        error={error}
        tenants={tenants}
        selectedTenantId={selectedTenantId}
        onSelectTenant={setSelectedTenantId}
        containerRef={containerRef}
        modelerRef={modelerRef}
        propertiesPanelRef={propertiesPanelRef}
      />
    </div>
  )
}
