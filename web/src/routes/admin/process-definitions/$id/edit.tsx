import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef, useState, useEffect } from 'react'
import { fetchTenants, type Tenant } from '../../../../services/tenant-service'
import { fetchProcessDefinitionById, updateProcessDefinition, type ProcessDefinition } from '../../../../services/bpmn-service'
import BpmnEditorToolbar from '../../../../components/bpmn/BpmnEditorToolbar'
import Modeler from 'bpmn-js/lib/Modeler'
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

export const Route = createFileRoute('/admin/process-definitions/$id/edit')({
  loader: async ({ params }) => {
    const tenants = await fetchTenants()
    const processDefinition = await fetchProcessDefinitionById(params.id)
    return { tenants, processDefinition }
  },
  component: EditProcessDefinitionEditor,
})

function EditProcessDefinitionEditor() {
  const loader = Route.useLoaderData()
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
    if (loader.processDefinition.bpmnXml && loader.processDefinition.bpmnXml.trim()) {
      modelerRef.current.importXML(loader.processDefinition.bpmnXml)
    }
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

  // Handle XML import from file input
  async function handleImportXml(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsLoading(true)
    setError(null)
    try {
      const text = await file.text()
      if (text && text.trim()) {
        await modelerRef.current?.importXML(text)
      } else {
        setError('The selected file is empty or not valid XML.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import XML')
    } finally {
      setIsLoading(false)
    }
  }

  // Find the selected tenant object
  const tenant = loader.tenants.find((t: Tenant) => t.id === selectedTenantId) || null

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Process Definition</h1>
      <BpmnEditorToolbar
        processDefinitionName={processDefinitionName}
        onProcessDefinitionNameChange={(e: React.ChangeEvent<HTMLInputElement>) => setProcessDefinitionName(e.target.value)}
        onImportXml={handleImportXml}
        onSave={handleSave}
        isLoading={isLoading}
        error={error}
        tenant={tenant}
        tenants={loader.tenants}
        onSelectTenant={setSelectedTenantId}
      />
      <div style={{ height: 24 }} />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
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
        <div
          ref={propertiesPanelRef}
          className="bpmn-properties-panel"
          style={{ width: 350, minWidth: 250, height: 600, borderLeft: '1px solid #ccc', background: '#fafafa', overflow: 'auto' }}
        />
      </div>
    </div>
  )
} 