import { useAuth0 } from '@auth0/auth0-react'
import { useCallback } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function useApi() {
  const { getAccessTokenSilently } = useAuth0()

  const fetchWithAuth = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      try {
        const token = await getAccessTokenSilently()

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        return response.json()
      } catch (error) {
        console.error('API request failed:', error)
        throw error
      }
    },
    [getAccessTokenSilently]
  )

  const get = useCallback(
    (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
    [fetchWithAuth]
  )

  const post = useCallback(
    (endpoint: string, data: unknown) =>
      fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    [fetchWithAuth]
  )

  const put = useCallback(
    (endpoint: string, data: unknown) =>
      fetchWithAuth(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    [fetchWithAuth]
  )

  const del = useCallback(
    (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
    [fetchWithAuth]
  )

  return { get, post, put, del, fetchWithAuth }
}

