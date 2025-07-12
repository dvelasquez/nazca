import { useEffect, useRef, useState } from 'react'
import Viewer from 'bpmn-js/lib/Viewer'
import type { BaseViewerOptions, ImportXMLResult } from 'bpmn-js/lib/BaseViewer'
import { layoutProcess } from 'bpmn-auto-layout'

interface BpmnViewerProps {
  xmlUrl?: string
  className?: string
  onLoad?: (result: ImportXMLResult) => void
  onError?: (error: Error) => void
}

// Default BPMN XML for a simple process
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

function BpmnViewer({ xmlUrl, className = '', onLoad, onError }: BpmnViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<Viewer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasDiagramInfo, setHasDiagramInfo] = useState(true)
  const [isMissingDiagramError, setIsMissingDiagramError] = useState(false)

  // Initialize BPMN viewer
  useEffect(() => {
    if (!containerRef.current) return

    const options: BaseViewerOptions = {
      container: containerRef.current,
      width: '100%',
      height: '100%'
    }

    viewerRef.current = new Viewer(options)

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy()
        viewerRef.current = null
      }
    }
  }, [])

  // Load BPMN XML
  useEffect(() => {
    if (!viewerRef.current) return

    async function loadBpmnXml() {
      try {
        setIsLoading(true)
        setError(null)
        setHasDiagramInfo(true)
        setIsMissingDiagramError(false)

        let xml: string

        if (xmlUrl) {
          // Load XML from URL
          const response = await fetch(xmlUrl)
          if (!response.ok) {
            throw new Error(`Failed to load BPMN XML from ${xmlUrl}: ${response.statusText}`)
          }
          xml = await response.text()
        } else {
          // Use default XML
          xml = DEFAULT_BPMN_XML
        }

        // Check if XML has diagram information
        const hasDiagram = xml.includes('<bpmndi:BPMNDiagram') || xml.includes('BPMNDiagram')
        setHasDiagramInfo(hasDiagram)

        // If no diagram info, use bpmn-auto-layout to generate it
        if (!hasDiagram) {
          try {
            xml = await layoutProcess(xml)
            setHasDiagramInfo(true)
          } catch (layoutErr) {
            setError('Failed to auto-generate diagram information: ' + (layoutErr instanceof Error ? layoutErr.message : String(layoutErr)))
            setIsLoading(false)
            return
          }
        }

        const result = await viewerRef.current!.importXML(xml)
        onLoad?.(result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load BPMN diagram'
        
        // Check for specific "no diagram to display" error
        if (errorMessage.includes('no diagram to display')) {
          setIsMissingDiagramError(true)
          setError('This BPMN file is missing diagram information and may have incomplete sequence flow definitions. The file contains process logic but cannot be displayed visually.')
        } else {
          setError(errorMessage)
        }
        
        onError?.(err instanceof Error ? err : new Error(errorMessage))
      } finally {
        setIsLoading(false)
      }
    }

    loadBpmnXml()
  }, [xmlUrl, onLoad, onError])

  return (
    <div className={`bpmn-viewer ${className}`}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading BPMN diagram...</div>
        </div>
      )}
      {error && (
        <div className="error-message">
          <div className="text-red-700 bg-red-100 border border-red-400 rounded px-4 py-3 mb-4">
            <strong>Error:</strong> {error}
            {isMissingDiagramError && (
              <div className="mt-2 text-sm">
                <p>This typically happens when:</p>
                <ul className="list-disc list-inside mt-1 ml-4">
                  <li>The BPMN file is missing diagram information (BPMNDiagram section)</li>
                  <li>Sequence flow elements are missing required ID attributes</li>
                  <li>The file was exported from a tool that only saves process logic</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {!hasDiagramInfo && !isLoading && !error && (
        <div className="warning-message">
          <p className="text-yellow-700 bg-yellow-100 border border-yellow-400 rounded px-4 py-3 mb-4">
            <strong>Note:</strong> This BPMN file contains process logic but is missing diagram information. 
            The process structure is valid, but elements may not be positioned optimally for viewing.
          </p>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="bpmn-container"
        style={{ 
          width: '100%', 
          height: '500px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
    </div>
  )
}

export default BpmnViewer 