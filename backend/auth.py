import os
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from dotenv import load_dotenv # cspell:ignore dotenv

# Load environment variables from .env file
load_dotenv()

# Auth0 Configuration - set these via environment variables
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE")
AUTH0_ALGORITHMS = ["RS256"]

security = HTTPBearer()

# Cache for JWKS (JSON Web Key Set)
_jwks_cache: Optional[dict] = None


async def get_jwks() -> dict:
    """Fetch Auth0's public keys for token verification."""
    global _jwks_cache
    
    if _jwks_cache is not None:
        return _jwks_cache
    
    jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(jwks_url)
        response.raise_for_status()
        _jwks_cache = response.json()
        return _jwks_cache


def get_rsa_key(token: str, jwks: dict) -> Optional[dict]:
    """Extract the RSA key from JWKS that matches the token's key ID."""
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError:
        return None
    
    for key in jwks.get("keys", []):
        if key.get("kid") == unverified_header.get("kid"):
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Validate JWT token and return user information.
    Use this as a dependency in protected routes.
    """
    token = credentials.credentials
    
    try:
        jwks = await get_jwks()
        rsa_key = get_rsa_key(token, jwks)
        
        if rsa_key is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find appropriate key",
            )
        
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=AUTH0_ALGORITHMS,
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/",
        )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.JWTClaimsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid claims - check audience and issuer",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to parse authentication token",
        )


def get_user_id(user: dict) -> str:
    """Extract the unique user ID from the token payload."""
    return user.get("sub", "")

