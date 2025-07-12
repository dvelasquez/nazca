import BpmnViewer from './components/BpmnViewer'
import BpmnExampleSelector from './components/BpmnExampleSelector'
import { useState } from 'react'

function App() {
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

export default App
