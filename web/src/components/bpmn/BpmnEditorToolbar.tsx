import type { Tenant } from '../../services/tenant-service'

export interface BpmnEditorToolbarProps {
  processDefinitionName: string
  onProcessDefinitionNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImportXml: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  isLoading: boolean
  error: string | null
  tenant: Tenant | null
  tenants: Tenant[]
  onSelectTenant: (id: string | null) => void
}

/**
 * Toolbar for editing a single BPMN process definition: tenant, name, import XML, save, error display.
 */
export function BpmnEditorToolbar({
  processDefinitionName,
  onProcessDefinitionNameChange,
  onImportXml,
  onSave,
  isLoading,
  error,
  tenant,
  tenants,
  onSelectTenant
}: BpmnEditorToolbarProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-4 w-full">
        {/* Tenant selector */}
        <select
          value={tenant?.id || ''}
          onChange={e => onSelectTenant(e.target.value || null)}
          className="select select-bordered"
          data-testid="tenant-selector"
        >
          <option value="">Select Tenant...</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {/* Save button */}
        <button
          onClick={onSave}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          data-testid="save-process-definition"
          disabled={isLoading}
        >Save</button>
        <input
          type="file"
          accept=".bpmn,.xml"
          onChange={onImportXml}
          className="file-input file-input-bordered"
          data-testid="import-bpmn"
        />
      </div>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="process-definition-name" className="font-medium">ProcessDefinition Name:</label>
        <input
          id="process-definition-name"
          type="text"
          value={processDefinitionName}
          onChange={onProcessDefinitionNameChange}
          className="input input-bordered"
          placeholder="Enter ProcessDefinition name"
          data-testid="process-definition-name-input"
        />
      </div>
      {error && (
        <div className="error-message text-red-700 bg-red-100 border border-red-400 rounded px-4 py-3 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
    </>
  )
}

export default BpmnEditorToolbar 