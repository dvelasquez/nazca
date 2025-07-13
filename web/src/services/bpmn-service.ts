import type { components } from '../types/api.d.ts'

// Types for process definitions
export type ProcessDefinition = components['schemas']['ProcessDefinition']
export type ProcessDefinitionWithRelations = components['schemas']['ProcessDefinitionWithRelations']
export type NewProcessDefinition = components['schemas']['NewProcessDefinition']

type TenantWithRelations = components['schemas']['TenantWithRelations']

const API_ROOT = import.meta.env.VITE_API_ENDPOINT || ''
const API_BASE = `${API_ROOT}/api/process-definitions`

/**
 * Fetch all BPMN process definitions from the API.
 */
export async function fetchProcessDefinitions(): Promise<ProcessDefinitionWithRelations[]> {
  const res = await fetch(API_BASE)
  if (!res.ok) {
    throw new Error('Failed to fetch process definitions')
  }
  return res.json()
}

/**
 * Fetch a single BPMN process definition by ID.
 */
export async function fetchProcessDefinitionById(id: string): Promise<ProcessDefinitionWithRelations> {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch process definition')
  }
  return res.json()
}

/**
 * Create a new BPMN process definition.
 */
export async function createProcessDefinition(data: NewProcessDefinition): Promise<ProcessDefinition> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create process definition')
  }
  return res.json()
}

/**
 * Update an existing BPMN process definition by ID.
 */
export async function updateProcessDefinition(id: string, data: ProcessDefinition): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update process definition')
  }
}

/**
 * Fetch all tenants from the API.
 */
export async function fetchTenants(): Promise<TenantWithRelations[]> {
  const API_ROOT = import.meta.env.VITE_API_ENDPOINT || ''
  const API_BASE = `${API_ROOT}/api/tenants`
  const res = await fetch(API_BASE)
  if (!res.ok) {
    throw new Error('Failed to fetch tenants')
  }
  return res.json()
} 