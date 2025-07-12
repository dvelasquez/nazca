import { createFileRoute } from '@tanstack/react-router'
import BpmnViewer from '../../components/bpmn/BpmnViewer'
import BpmnExampleSelector from '../../components/bpmn/BpmnExampleSelector'
import { useState } from 'react'

export const Route = createFileRoute('/bpmn/viewer')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selectedExample, setSelectedExample] = useState<string>('')

  function handleExampleSelect(xmlUrl: string) {
    setSelectedExample(xmlUrl)
  }

  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">BPMN Engine</h1>
        
        <div className="mb-6">
          <BpmnExampleSelector 
            onSelect={handleExampleSelect}
            selectedExample={selectedExample}
          />
        </div>
        
        <BpmnViewer xmlUrl={selectedExample} />
      </div>
    </>
  )
}
