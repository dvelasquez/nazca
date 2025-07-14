import { useEffect, useState, useMemo } from 'react'
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from '@tanstack/react-table'
import { useForm } from '@tanstack/react-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog'
import { Button } from './button'

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'number' | 'email'
  required?: boolean
  /**
   * If options are provided, the field will be rendered as a select dropdown.
   * Example: options: [{ value: 'id1', label: 'Tenant 1' }, ...]
   */
  options?: { value: string; label: string }[]
}

interface GenericMaintainerProps<T> {
  columns: ColumnDef<T, any>[]
  fetchAll: () => Promise<T[]>
  fetchOne: (id: string) => Promise<T>
  create: (data: any) => Promise<any>
  update: (id: string, data: any) => Promise<any>
  entityName: string
  fields: FieldConfig[]
  getId: (row: T) => string
  tenants?: any[] // Optional tenants prop
}

export function GenericMaintainer<T>({
  columns,
  fetchAll,
  fetchOne,
  create,
  update,
  entityName,
  fields,
  getId,
  tenants,
}: GenericMaintainerProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [pendingValues, setPendingValues] = useState<Record<string, any> | null>(null)

  const form = useForm({
    defaultValues: Object.fromEntries(fields.map(f => [f.name, ''])),
    onSubmit: async ({ value }) => {
      setModalLoading(true)
      setModalError(null)
      try {
        if (editId) {
          await update(editId, value)
        } else {
          await create(value)
        }
        setShowModal(false)
        refresh()
      } catch (err: any) {
        setModalError(err.message || 'Failed to save')
      } finally {
        setModalLoading(false)
      }
    },
  })

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (showModal) {
      if (editId && pendingValues) {
        form.reset(pendingValues)
      } else if (!editId) {
        form.reset(Object.fromEntries(fields.map(f => [f.name, ''])))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, editId, pendingValues])

  function refresh() {
    setIsLoading(true)
    fetchAll()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to fetch'))
      .finally(() => setIsLoading(false))
  }

  async function handleEditOpen(id: string) {
    setEditId(id)
    setModalError(null)
    setModalLoading(true)
    setShowModal(true)
    try {
      const entity = await fetchOne(id)
      const values: Record<string, any> = {}
      for (const field of fields) {
        values[field.name] = (entity as any)[field.name] ?? ''
      }
      setPendingValues(values)
    } catch (err: any) {
      setModalError(err.message || 'Failed to fetch')
      setShowModal(false)
    } finally {
      setModalLoading(false)
    }
  }

  function handleCreateOpen() {
    setEditId(null)
    setModalError(null)
    setPendingValues(null)
    setShowModal(true)
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{entityName}s</h1>
        <Button onClick={handleCreateOpen}>Create {entityName}</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-muted">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-2 text-left">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                  <td className="px-4 py-2 text-center">
                    <Button size="sm" variant="outline" onClick={() => handleEditOpen(getId(row.original))}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? `Edit ${entityName}` : `Create ${entityName}`}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            {fields.map(field => (
              <form.Field
                key={field.name}
                name={field.name}
                children={fieldApi => (
                  <div>
                    <label htmlFor={fieldApi.name} className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    {field.options && field.options.length > 0 ? (
                      <select
                        id={fieldApi.name}
                        name={fieldApi.name}
                        value={fieldApi.state.value ?? ''}
                        onChange={e => fieldApi.handleChange(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        required={field.required}
                        disabled={modalLoading}
                      >
                        <option value="">Select...</option>
                        {field.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={fieldApi.name}
                        name={fieldApi.name}
                        type={field.type}
                        value={fieldApi.state.value ?? ''}
                        onChange={e => fieldApi.handleChange(e.target.value)}
                        onBlur={fieldApi.handleBlur}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        required={field.required}
                        disabled={modalLoading}
                      />
                    )}
                  </div>
                )}
              />
            ))}
            {modalError && <div className="text-red-500 text-sm">{modalError}</div>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={modalLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={modalLoading}>
                {modalLoading ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save Changes' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 