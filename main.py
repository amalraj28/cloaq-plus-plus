from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.encryption import router as encrypt_router
from app.api.image import router as image_router

app = FastAPI()

app.include_router(encrypt_router, prefix="/api")
app.include_router(image_router, prefix="/api")
