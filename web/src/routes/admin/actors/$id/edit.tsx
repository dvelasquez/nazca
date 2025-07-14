import { useNavigate, useParams, useLoaderData } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { updateActor } from '../../../../services/actor-service'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

function ActorEditPage() {
  const navigate = useNavigate()
  const { actor, tenants, actorGroups } = useLoaderData({ from: '/admin/actors/$id/edit' })
  const { id } = useParams({ strict: false }) as { id: string }
  const form = useForm({
    defaultValues: {
      name: actor.name,
      email: actor.email,
      tenantId: actor.tenantId,
      actorGroupId: actor.actorGroupId || '',
    },
    onSubmit: async ({ value }) => {
      await updateActor(id, value)
      navigate({ to: '/admin/actors' })
    },
  })

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Actor</h1>
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
        <form.Field name="email" children={field => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">Email</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
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
        <form.Field name="actorGroupId" children={field => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium mb-1">Actor Group</label>
            <select
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select...</option>
              {actorGroups.map((g: any) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        )} />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/actors' })}>
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/admin/actors/$id/edit')({
  loader: async ({ params }) => {
    const [actor, tenants, actorGroups] = await Promise.all([
      import('../../../../services/actor-service').then(m => m.fetchActorById(params.id)),
      import('../../../../services/tenant-service').then(m => m.fetchTenants()),
      import('../../../../services/actor-group-service').then(m => m.fetchActorGroups()),
    ])
    return { actor, tenants, actorGroups }
  },
  component: ActorEditPage,
}) 