import os
import asyncpg
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

# Connection pool (initialized on startup)
pool: Optional[asyncpg.Pool] = None


async def init_db():
    """Initialize database connection pool. Call this on app startup."""
    global pool
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    print("Database initialized")


async def close_db():
    """Close database connection pool. Call this on app shutdown."""
    global pool
    if pool:
        await pool.close()


# ==================== User Functions ====================

async def get_user_by_auth0_id(auth0_id: str) -> Optional[dict]:
    """Get a user by their Auth0 ID."""
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, auth0_id, email, name, avatar_url, created_at, updated_at "
            "FROM users WHERE auth0_id = $1",
            auth0_id
        )
        return dict(row) if row else None


async def get_user_by_email(email: str) -> Optional[dict]:
    """Get a user by their email."""
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, auth0_id, email, name, avatar_url, created_at, updated_at "
            "FROM users WHERE email = $1",
            email
        )
        return dict(row) if row else None


async def get_or_create_user(auth0_id: str, email: str, name: str, avatar_url: str = None) -> dict:
    """
    Get a user by auth0_id, or create if they don't exist.
    Uses UPSERT to handle race conditions and duplicates.
    This is called after Auth0 login to sync the user to our database.
    """
    # Generate a unique placeholder email if none provided
    # This avoids unique constraint violations on empty emails
    safe_email = email if email else f"{auth0_id.replace('|', '_')}@placeholder.local"
    
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO users (auth0_id, email, name, avatar_url)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (auth0_id) DO UPDATE SET
                email = CASE 
                    WHEN EXCLUDED.email NOT LIKE '%@placeholder.local' THEN EXCLUDED.email
                    ELSE users.email
                END,
                name = COALESCE(NULLIF(EXCLUDED.name, ''), users.name),
                avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
                updated_at = CURRENT_TIMESTAMP
            RETURNING id, auth0_id, email, name, avatar_url, created_at, updated_at
            """,
            auth0_id, safe_email, name or 'User', avatar_url
        )
        return dict(row)


async def update_user(auth0_id: str, name: str = None, avatar_url: str = None) -> Optional[dict]:
    """Update a user's profile information."""
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            UPDATE users 
            SET name = COALESCE($2, name),
                avatar_url = COALESCE($3, avatar_url),
                updated_at = CURRENT_TIMESTAMP
            WHERE auth0_id = $1
            RETURNING id, auth0_id, email, name, avatar_url, created_at, updated_at
            """,
            auth0_id, name, avatar_url
        )
        return dict(row) if row else None


async def delete_user(auth0_id: str) -> bool:
    """Delete a user by their Auth0 ID. Returns True if deleted."""
    async with pool.acquire() as conn:
        result = await conn.execute(
            "DELETE FROM users WHERE auth0_id = $1",
            auth0_id
        )
        return result == "DELETE 1"

