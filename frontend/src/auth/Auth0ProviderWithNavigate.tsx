import { Auth0Provider } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

export default function Auth0ProviderWithNavigate({ children }: Props) {
  const navigate = useNavigate()

  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE

  const onRedirectCallback = () => {
    navigate('/wardrobe')
  }

  if (!domain || !clientId) {
    return <>{children}</>
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

