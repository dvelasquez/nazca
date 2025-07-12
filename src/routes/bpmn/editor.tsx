import { createFileRoute } from '@tanstack/react-router'
import BpmnEditor from '../../components/bpmn/BpmnEditor'

export const Route = createFileRoute('/bpmn/editor')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">BPMN Editor</h1>
        <BpmnEditor />
      </div>
    </>
  )
}
