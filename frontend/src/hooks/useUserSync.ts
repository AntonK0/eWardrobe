import { useEffect, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Hook that syncs the authenticated user to the backend database.
 * Call this once in a top-level component after login.
 */
export function useUserSync() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const hasSynced = useRef(false)

  useEffect(() => {
    const syncUser = async () => {
      // Only sync once per session when authenticated
      if (!isAuthenticated || hasSynced.current) return

      try {
        const token = await getAccessTokenSilently()
        
        const response = await fetch(`${API_BASE_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          hasSynced.current = true
          console.log('User synced to database')
        }
      } catch (error) {
        console.error('Failed to sync user:', error)
      }
    }

    syncUser()
  }, [isAuthenticated, getAccessTokenSilently])
}

