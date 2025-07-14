import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { createTenant } from '../../../services/tenant-service'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export default function TenantCreatePage() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: { name: '' },
    onSubmit: async ({ value }) => {
      await createTenant(value)
      navigate({ to: '/admin/tenants' })
    },
  })

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create Tenant</h1>
      <form onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }} className="space-y-4">
        <form.Field
          name="name"
          children={(field) => (
            <div>
              <label htmlFor={field.name} className="block text-sm font-medium mb-1">Name</label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          )}
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/tenants' })}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  )
}

export const Route = createFileRoute('/admin/tenants/new')({
  component: TenantCreatePage,
}) 