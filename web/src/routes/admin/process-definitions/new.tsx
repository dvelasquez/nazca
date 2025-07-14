import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { fetchTenants } from '../../../services/tenant-service'
import { createProcessDefinition } from '../../../services/bpmn-service'
import { DEFAULT_BPMN_XML } from '../../../components/bpmn/bpmn-default-xml'
import BpmnEditor from '../../../components/bpmn/Editor'
import Modeler from 'bpmn-js/lib/Modeler'
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

export const Route = createFileRoute('/admin/process-definitions/new')({
  loader: async () => {
    const tenants = await fetchTenants()
    return { tenants }
  },
  component: NewProcessDefinitionEditor,
})

function NewProcessDefinitionEditor({ loader }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processDefinitionName, setProcessDefinitionName] = useState('')
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null)
  const modelerRef = useRef<Modeler | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const propertiesPanelRef = useRef<HTMLDivElement>(null)

  // Initialize Modeler on mount
  useState(() => {
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
    return () => {
      modelerRef.current?.destroy()
      modelerRef.current = null
    }
  })

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
      const newDef = {
        name: processDefinitionName,
        bpmnXml: xml,
        tenantId: selectedTenantId
      }
      const created = await createProcessDefinition(newDef)
      navigate({ to: `/admin/process-definitions/${created.id}` })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ProcessDefinition')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create Process Definition</h1>
      <BpmnEditor
        models={[]}
        selectedProcessDefinitionId={null}
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