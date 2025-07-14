import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center">Welcome to Nazca</h1>
      <p className="max-w-xl mx-auto text-lg text-muted-foreground text-center mt-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisl quis neque.
      </p>
      <div className="flex justify-center mt-6">
        <Button size="lg">Get Started</Button>
      </div>
    </>
  )
}