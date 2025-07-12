import { useEffect, useRef, useState } from 'react'
import Modeler from 'bpmn-js/lib/Modeler'
import type { BaseViewerOptions, ImportXMLResult } from 'bpmn-js/lib/BaseViewer'

const DEFAULT_BPMN_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Sample Task">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="EndEvent_1" name="End">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="145" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="240" y="80" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="392" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="400" y="145" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="392" y="120" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`

function BpmnEditor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const modelerRef = useRef<Modeler | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      .then(() => setIsLoading(false))
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset diagram')
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
          onClick={handleReset}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          data-testid="reset-diagram"
        >Reset</button>
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