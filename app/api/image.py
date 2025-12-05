from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.domain.visualization import get_temp_folder_path

router = APIRouter(tags=["images"])


@router.get("/image/{filename}")
def read_image(filename: str):
    safe_name = Path(filename).name
    path = get_temp_folder_path() / safe_name

    if not path.exists():
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(path, media_type="image/png", filename=safe_name)
