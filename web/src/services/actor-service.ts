import type { components } from '../types/api.d.ts'

export type CreateActorDto = components['schemas']['CreateActorDto']
export type UpdateActorDto = components['schemas']['UpdateActorDto']
export type Actor = components['schemas']['ResponseActorDto']

const API_ROOT = import.meta.env.VITE_API_ENDPOINT || ''
const ACTORS_BASE = `${API_ROOT}/actors`

export async function fetchActors(): Promise<Actor[]> {
  const res = await fetch(ACTORS_BASE)
  if (!res.ok) {
    throw new Error('Failed to fetch actors')
  }
  return res.json()
}

export async function fetchActorById(id: string): Promise<Actor> {
  const res = await fetch(`${ACTORS_BASE}/${id}`)
  if (!res.ok) {
    throw new Error('Failed to fetch actor')
  }
  return res.json()
}

export async function createActor(data: CreateActorDto): Promise<Actor> {
  const res = await fetch(ACTORS_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to create actor')
  }
  return res.json()
}

export async function updateActor(id: string, data: UpdateActorDto): Promise<void> {
  const res = await fetch(`${ACTORS_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    throw new Error('Failed to update actor')
  }
} 