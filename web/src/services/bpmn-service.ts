import type { components } from '../types/api.d.ts'

export type CreateProcessDefinitionDto = components['schemas']['CreateProcessDefinitionDto']
export type UpdateProcessDefinitionDto = components['schemas']['UpdateProcessDefinitionDto']

const API_ROOT = import.meta.env.VITE_API_ENDPOINT || ''
const API_BASE = `${API_ROOT}/process-definitions`

/**
 * Fetch all BPMN process definitions from the API.
 */
export async function fetchProcessDefinitions(): Promise<any[]> {
  const res = await fetch(API_BASE)
  if (!res.ok) {
    throw new Error('Failed to fetch process definitions')
  }
  return res.json()
}

/**
 * Fetch a single BPMN process definition by ID.
 */
export async function fetchProcessDefinitionById(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch process definition')
  }
  return res.json()
}

/**
 * Create a new BPMN process definition.
 */
export async function createProcessDefinition(data: CreateProcessDefinitionDto): Promise<any> {
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
export async function updateProcessDefinition(id: string, data: UpdateProcessDefinitionDto): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update process definition')
  }
} 