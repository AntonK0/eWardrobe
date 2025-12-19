from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user, get_user_id
from database import init_db, close_db, get_or_create_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    await init_db()
    yield
    await close_db()


app = FastAPI(title="eWardrobe API", lifespan=lifespan)

# Allow your React frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Public Routes ====================

@app.get("/")
def read_root():
    return {"message": "Hello from eWardrobe API"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# ==================== Protected Routes ====================

@app.get("/api/me")
async def get_user_profile(user: dict = Depends(get_current_user)):
    """Get the current authenticated user's profile and sync to database."""
    # Sync user from Auth0 to our database
    db_user = await get_or_create_user(
        auth0_id=get_user_id(user),
        email=user.get("email", ""),
        name=user.get("name", ""),
        avatar_url=user.get("picture"),
    )
    return db_user


@app.get("/api/clothes")
async def get_clothes(user: dict = Depends(get_current_user)):
    """Get all clothes for the authenticated user."""
    user_id = get_user_id(user)
    # TODO: Replace with actual database query
    return {
        "user_id": user_id,
        "clothes": [],  # Placeholder - connect to your database
    }


@app.post("/api/clothes")
async def add_clothing(
    clothing: dict,
    user: dict = Depends(get_current_user)
):
    """Add a new clothing item for the authenticated user."""
    user_id = get_user_id(user)
    # TODO: Save to database with user_id
    return {
        "message": "Clothing added successfully",
        "user_id": user_id,
        "clothing": clothing,
    }


@app.get("/api/outfits")
async def get_outfits(user: dict = Depends(get_current_user)):
    """Get all saved outfits for the authenticated user."""
    user_id = get_user_id(user)
    # TODO: Replace with actual database query
    return {
        "user_id": user_id,
        "outfits": [],  # Placeholder
    }
