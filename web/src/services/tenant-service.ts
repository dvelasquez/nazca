import type { components } from '../types/api.d.ts'

export type CreateTenantDto = components['schemas']['CreateTenantDto']
export type UpdateTenantDto = components['schemas']['UpdateTenantDto']

const API_ROOT = import.meta.env.VITE_API_ENDPOINT || ''
const TENANTS_BASE = `${API_ROOT}/tenants`

/**
 * Fetch all tenants from the API.
 */
export async function fetchTenants(): Promise<any[]> {
  const res = await fetch(TENANTS_BASE)
  if (!res.ok) {
    throw new Error('Failed to fetch tenants')
  }
  return res.json()
}

/**
 * Fetch a single tenant by ID.
 */
export async function fetchTenantById(id: string): Promise<any> {
  const res = await fetch(`${TENANTS_BASE}/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch tenant')
  }
  return res.json()
}

/**
 * Create a new tenant.
 */
export async function createTenant(data: CreateTenantDto): Promise<any> {
  const res = await fetch(TENANTS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create tenant')
  }
  return res.json()
}

/**
 * Update an existing tenant by ID.
 */
export async function updateTenant(id: string, data: UpdateTenantDto): Promise<void> {
  const res = await fetch(`${TENANTS_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update tenant')
  }
} 