import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/admin/')({
  component: AdminLanding,
})

function AdminLanding() {
  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Area</h1>
      <ul className="space-y-4">
        <li>
          <Button asChild className="w-full">
            <Link to="/admin/process-definitions">Manage Process Definitions</Link>
          </Button>
        </li>
        <li>
          <Button asChild className="w-full">
            <Link to="/admin/tenants">Manage Tenants</Link>
          </Button>
        </li>
        <li>
          <Button asChild className="w-full">
            <Link to="/admin/actor-groups">Manage Actor Groups</Link>
          </Button>
        </li>
        <li>
          <Button asChild className="w-full">
            <Link to="/admin/actors">Manage Actors</Link>
          </Button>
        </li>
      </ul>
    </div>
  )
} 