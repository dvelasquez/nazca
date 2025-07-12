interface BpmnExample {
  name: string
  path: string
  description?: string
}

interface BpmnExampleSelectorProps {
  onSelect: (xmlUrl: string) => void
  selectedExample?: string
}

// List of available BPMN XML examples
const BPMN_EXAMPLES: BpmnExample[] = [
  { name: 'Default Example', path: '', description: 'Simple start-task-end process' },
  { name: 'Hello Camel Body', path: '/bpmn-xml-examples/HelloCamelBody.bpmn20.xml', description: 'Camel integration example' },
  { name: 'Hello Camel Body Map', path: '/bpmn-xml-examples/HelloCamelBodyMap.bpmn20.xml', description: 'Camel body mapping example' },
  { name: 'Async Process', path: '/bpmn-xml-examples/async.bpmn20.xml', description: 'Asynchronous process example' },
  { name: 'Async Ping', path: '/bpmn-xml-examples/asyncPing.bpmn20.xml', description: 'Simple async ping process' },
  { name: 'Custom Process', path: '/bpmn-xml-examples/custom.bpmn20.xml', description: 'Custom BPMN process' },
  { name: 'Empty Process', path: '/bpmn-xml-examples/empty.bpmn20.xml', description: 'Empty BPMN process' },
  { name: 'Error Handling', path: '/bpmn-xml-examples/errorHandling.bpmn20.xml', description: 'Error handling example' },
  { name: 'Basic Example', path: '/bpmn-xml-examples/example.bpmn20.xml', description: 'Basic BPMN example' },
  { name: 'Map Exception Default', path: '/bpmn-xml-examples/mapExceptionDefaultMap.bpmn20.xml', description: 'Exception mapping with default' },
  { name: 'Map Exception Parent', path: '/bpmn-xml-examples/mapExceptionParentMap.bpmn20.xml', description: 'Exception mapping with parent' },
  { name: 'Map Exception Single', path: '/bpmn-xml-examples/mapExceptionSingleMap.bpmn20.xml', description: 'Exception mapping single' },
  { name: 'Multi Instance Camel', path: '/bpmn-xml-examples/multiInstanceCamel.bpmn20.xml', description: 'Multi-instance with Camel' },
  { name: 'Multi Instance Receive', path: '/bpmn-xml-examples/multiinstanceReceive.bpmn20.xml', description: 'Multi-instance receive process' },
  { name: 'Parallel Process', path: '/bpmn-xml-examples/parallel.bpmn20.xml', description: 'Parallel execution example' },
  { name: 'Parallel Revisited', path: '/bpmn-xml-examples/revisited/parallel-revisited.bpmn20.xml', description: 'Updated parallel process' },
  { name: 'Async Revisited', path: '/bpmn-xml-examples/revisited/async-revisited.bpmn20.xml', description: 'Updated async process' }
]

function BpmnExampleSelector({ onSelect, selectedExample }: BpmnExampleSelectorProps) {
  function handleExampleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedPath = event.target.value
    onSelect(selectedPath || '')
  }

  return (
    <div className="bpmn-example-selector">
      <label htmlFor="example-select" className="block text-sm font-medium text-gray-700 mb-2">
        Select BPMN Example:
      </label>
      <select
        id="example-select"
        value={selectedExample || ''}
        onChange={handleExampleChange}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {BPMN_EXAMPLES.map((example) => (
          <option key={example.path} value={example.path}>
            {example.name}
          </option>
        ))}
      </select>
      {selectedExample && (
        <p className="mt-2 text-sm text-gray-600">
          {BPMN_EXAMPLES.find(ex => ex.path === selectedExample)?.description}
        </p>
      )}
    </div>
  )
}

export default BpmnExampleSelector 