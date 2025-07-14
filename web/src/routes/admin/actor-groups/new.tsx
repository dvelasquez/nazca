import { useNavigate, useLoaderData } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createActorGroup } from '../../../services/actor-group-service'
import { fetchTenants } from '../../../services/tenant-service'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

function ActorGroupCreatePage() {
  const navigate = useNavigate()
  const tenants = useLoaderData({ from: '/admin/actor-groups/new' })
  const form = useForm({
    defaultValues: { name: '', tenantId: '' },
    onSubmit: async ({ value }) => {
      await createActorGroup(value)
      navigate({ to: '/admin/actor-groups' })
    },
  })

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create Actor Group</h1>
      <form onSubmit={e => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="space-y-4">
        <form.Field name="name" children={field => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">Name</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        )} />
        <form.Field name="tenantId" children={field => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">Tenant</label>
            <select
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select...</option>
              {tenants.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )} />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/actor-groups' })}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/admin/actor-groups/new')({
  loader: async () => fetchTenants(),
  component: ActorGroupCreatePage,
}) 