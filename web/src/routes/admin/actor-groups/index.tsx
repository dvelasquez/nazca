import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { fetchActorGroups } from '../../../services/actor-group-service'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

const columns = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Name' },
  { key: 'tenantId', header: 'Tenant' },
]

function ActorGroupsPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetchActorGroups()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to fetch'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Actor Groups</h1>
        <Button onClick={() => navigate({ to: '/admin/actor-groups/new' as any })}>Create Actor Group</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
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
                    <Button size="sm" variant="outline" onClick={() => navigate({ to: `/admin/actor-groups/${row.id}/edit` as any })}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/admin/actor-groups/')({
  component: ActorGroupsPage,
}) 