import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState, useMemo } from 'react'
import { GenericMaintainer, type FieldConfig } from '@/components/ui/generic-maintainer'
import {
  fetchProcessDefinitions,
  fetchProcessDefinitionById,
  createProcessDefinition,
  updateProcessDefinition
} from '../../../services/bpmn-service'
import { fetchTenants } from '../../../services/tenant-service'
import { type ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<any, any>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info: any) => <span className="font-mono">{info.getValue()}</span>,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'tenantId',
    header: 'Tenant',
  },
]

export const Route = createFileRoute('/admin/process-definitions/')({
  component: ProcessDefinitionsMaintainer,
})

function ProcessDefinitionsMaintainer() {
  const navigate = useNavigate()
  const [tenants, setTenants] = useState<any[]>([])
  useEffect(() => {
    fetchTenants().then(setTenants)
  }, [])
  const tenantOptions = useMemo(() => tenants.map((t: any) => ({ value: t.id, label: t.name })), [tenants])
  const fields: FieldConfig[] = useMemo(() => [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'tenantId', label: 'Tenant', type: 'text', required: true, options: tenantOptions },
  ], [tenantOptions])
  return (
    <GenericMaintainer
      columns={columns}
      fetchAll={fetchProcessDefinitions}
      fetchOne={fetchProcessDefinitionById}
      create={async (data) => {
        const created = await createProcessDefinition(data)
        navigate({ to: `/admin/process-definitions/${created.id}` })
      }}
      update={async (id, data) => {
        await updateProcessDefinition(id, data)
        navigate({ to: `/admin/process-definitions/${id}` })
      }}
      entityName="Process Definition"
      fields={fields}
      getId={row => row.id}
    />
  )
} 