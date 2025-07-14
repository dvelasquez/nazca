import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { fetchTenants } from '../../../services/tenant-service'
import { fetchProcessDefinitionById, updateProcessDefinition } from '../../../services/bpmn-service'
import BpmnEditor from '../../../components/bpmn/Editor'
import Modeler from 'bpmn-js/lib/Modeler'
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

export const Route = createFileRoute('/admin/process-definitions/$id')({
  loader: async ({ params }) => {
    const tenants = await fetchTenants()
    const processDefinition = await fetchProcessDefinitionById(params.id)
    return { tenants, processDefinition }
  },
  component: EditProcessDefinitionEditor,
})

function EditProcessDefinitionEditor({ loader }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processDefinitionName, setProcessDefinitionName] = useState(loader.processDefinition.name)
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(loader.processDefinition.tenantId)
  const modelerRef = useRef<Modeler | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const propertiesPanelRef = useRef<HTMLDivElement>(null)

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
    modelerRef.current.importXML(loader.processDefinition.bpmnXml)
    return () => {
      modelerRef.current?.destroy()
      modelerRef.current = null
    }
  }, [loader.processDefinition.bpmnXml])

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
      if (!selectedTenantId) {
        setError('Please select a tenant.')
        setIsLoading(false)
        return
      }
      const updated = {
        id: loader.processDefinition.id,
        name: processDefinitionName,
        bpmnXml: xml,
        tenantId: selectedTenantId
      }
      await updateProcessDefinition(loader.processDefinition.id, updated)
      navigate({ to: `/admin/process-definitions/${loader.processDefinition.id}` })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ProcessDefinition')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Process Definition</h1>
      <BpmnEditor
        models={[]}
        selectedProcessDefinitionId={loader.processDefinition.id}
        onSelectProcessDefinition={() => {}}
        onNewProcessDefinition={() => {}}
        onSave={handleSave}
        onImport={() => {}}
        onExportXml={() => {}}
        onReset={() => {}}
        processDefinitionName={processDefinitionName}
        onProcessDefinitionNameChange={e => setProcessDefinitionName(e.target.value)}
        isLoading={isLoading}
        error={error}
        tenants={loader.tenants}
        selectedTenantId={selectedTenantId}
        onSelectTenant={setSelectedTenantId}
        containerRef={containerRef}
        modelerRef={modelerRef}
        propertiesPanelRef={propertiesPanelRef}
      />
    </div>
  )
} 