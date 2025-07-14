import type { components } from '../types/api.d.ts'

export type CreateActorGroupDto = components['schemas']['CreateActorGroupDto']
export type UpdateActorGroupDto = components['schemas']['UpdateActorGroupDto']

const API_ROOT = import.meta.env.VITE_API_ENDPOINT || ''
const ACTOR_GROUPS_BASE = `${API_ROOT}/actor-groups`

export async function fetchActorGroups(): Promise<any[]> {
  const res = await fetch(ACTOR_GROUPS_BASE)
  if (!res.ok) {
    throw new Error('Failed to fetch actor groups')
  }
  return res.json()
}

export async function fetchActorGroupById(id: string): Promise<any> {
  const res = await fetch(`${ACTOR_GROUPS_BASE}/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch actor group')
  }
  return res.json()
}

export async function createActorGroup(data: CreateActorGroupDto): Promise<any> {
  const res = await fetch(ACTOR_GROUPS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create actor group')
  }
  return res.json()
}

export async function updateActorGroup(id: string, data: UpdateActorGroupDto): Promise<void> {
  const res = await fetch(`${ACTOR_GROUPS_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update actor group')
  }
} 