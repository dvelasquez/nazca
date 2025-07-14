import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { fetchTenants } from '../../../services/tenant-service'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

const columns = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
]

function TenantsPage() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <Button onClick={() => navigate({ to: '/admin/tenants/new' as any })}>Create Tenant</Button>
      </div>
      <TenantsTable />
    </div>
  )
}

function TenantsTable() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    fetchTenants()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to fetch'))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-muted">
            {columns.map(col => (
              <th key={col.key} className="px-4 py-2 text-left">{col.header}</th>
            ))}
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id} className="border-b">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-2 font-mono">{row[col.key]}</td>
              ))}
              <td className="px-4 py-2 text-center">
                <Button size="sm" variant="outline" onClick={() => navigate({ to: `/admin/tenants/${row.id}/edit` as any })}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Route = createFileRoute('/admin/tenants/')({
  component: TenantsPage,
}) 