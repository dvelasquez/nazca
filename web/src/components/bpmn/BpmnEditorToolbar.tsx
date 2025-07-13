import type { ProcessDefinitionWithRelations } from '../../services/bpmn-service'

export interface BpmnEditorToolbarProps {
  models: ProcessDefinitionWithRelations[]
  selectedProcessDefinitionId: string | null
  onSelectProcessDefinition: (id: string | null) => void
  onNewProcessDefinition: () => void
  onSave: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExportXml: () => void
  onExportSvg: () => void
  onDownloadJson: () => void
  onReset: () => void
  processDefinitionName: string
  onProcessDefinitionNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  error: string | null
}

/**
 * Toolbar for BPMN editor: ProcessDefinition selection, create, save, import/export, reset, name, and error display.
 */
export function BpmnEditorToolbar({
  models,
  selectedProcessDefinitionId,
  onSelectProcessDefinition,
  onNewProcessDefinition,
  onSave,
  onImport,
  onExportXml,
  onExportSvg,
  onDownloadJson,
  onReset,
  processDefinitionName,
  onProcessDefinitionNameChange,
  isLoading,
  error
}: BpmnEditorToolbarProps) {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        {/* ProcessDefinition selector */}
        <select
          value={selectedProcessDefinitionId || ''}
          onChange={e => onSelectProcessDefinition(e.target.value || null)}
          className="select select-bordered"
          data-testid="process-definition-selector"
        >
          <option value="">Select ProcessDefinition...</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        {/* New ProcessDefinition button */}
        <button
          onClick={onNewProcessDefinition}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          data-testid="new-process-definition"
          disabled={isLoading}
        >New ProcessDefinition</button>
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
          onChange={onImport}
          className="file-input file-input-bordered"
          data-testid="import-bpmn"
        />
        <button
          onClick={onExportXml}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          data-testid="export-xml"
        >Export XML</button>
        <button
          onClick={onExportSvg}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          data-testid="export-svg"
        >Export SVG</button>
        <button
          onClick={onDownloadJson}
          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          data-testid="export-json"
        >Download JSON</button>
        <button
          onClick={onReset}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          data-testid="reset-diagram"
        >Reset</button>
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