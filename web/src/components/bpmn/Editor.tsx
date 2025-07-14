// TODO: Document in Cursor rules: API endpoints for BPMN model management (GET/PUT/POST /process-definitions, types from web/src/types/api.d.ts) must be defined and kept up to date for frontend-backend contract.
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import Modeler from 'bpmn-js/lib/Modeler'

import type { ProcessDefinitionWithRelations } from '../../services/bpmn-service'
import BpmnEditorToolbar from './BpmnEditorToolbar'

interface BpmnEditorProps {
  models: ProcessDefinitionWithRelations[]
  selectedProcessDefinitionId: string | null
  onSelectProcessDefinition: (id: string | null) => void
  onNewProcessDefinition: () => void
  onSave: () => void
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExportXml: () => void
  onReset: () => void
  processDefinitionName: string
  onProcessDefinitionNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  error: string | null
  tenants: any[]
  selectedTenantId: string | null
  onSelectTenant: (id: string | null) => void
  containerRef: React.RefObject<HTMLDivElement | null>
  modelerRef: React.RefObject<Modeler>
  propertiesPanelRef: React.RefObject<HTMLDivElement>
}

function BpmnEditor(props: BpmnEditorProps) {
  return (
    <div className="bpmn-editor" style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1 }}>
        <BpmnEditorToolbar
          models={props.models}
          selectedProcessDefinitionId={props.selectedProcessDefinitionId}
          onSelectProcessDefinition={props.onSelectProcessDefinition}
          onNewProcessDefinition={props.onNewProcessDefinition}
          onSave={props.onSave}
          onImport={props.onImport}
          onExportXml={props.onExportXml}
          onReset={props.onReset}
          processDefinitionName={props.processDefinitionName}
          onProcessDefinitionNameChange={props.onProcessDefinitionNameChange}
          isLoading={props.isLoading}
          error={props.error}
          tenants={props.tenants}
          selectedTenantId={props.selectedTenantId}
          onSelectTenant={props.onSelectTenant}
        />
        <div
          ref={props.containerRef}
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
        ref={props.propertiesPanelRef}
        className="bpmn-properties-panel"
        style={{ width: 350, minWidth: 250, height: 600, borderLeft: '1px solid #ccc', background: '#fafafa', overflow: 'auto' }}
      />
    </div>
  )
}

export default BpmnEditor 