import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

# Configure Cloudinary with your credentials
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True  # Use HTTPS
)


async def upload_image(file_bytes: bytes, filename: str) -> dict:
    """
    Upload an image to Cloudinary.
    
    Returns:
        dict with 'url', 'public_id', and 'thumbnail_url'
    """
    try:
        # Upload to Cloudinary in the 'ewardrobe' folder
        result = cloudinary.uploader.upload(
            file_bytes,
            folder="ewardrobe",
            resource_type="image",
            # Optional: generate a unique public_id based on filename
            public_id=filename.rsplit(".", 1)[0] if filename else None,
            # Automatically optimize the image
            transformation=[
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )
        
        # Generate a thumbnail URL (200x200, cropped)
        thumbnail_url = cloudinary.utils.cloudinary_url(
            result["public_id"],
            width=200,
            height=200,
            crop="fill",
            fetch_format="auto",
            quality="auto"
        )[0]
        
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "thumbnail_url": thumbnail_url
        }
    except Exception as e:
        raise Exception(f"Failed to upload image: {str(e)}")


async def delete_image(public_id: str) -> bool:
    """
    Delete an image from Cloudinary by its public_id.
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception:
        return False

