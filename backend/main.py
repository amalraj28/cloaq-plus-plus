from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.encryption import router as encrypt_router
from app.api.image import router as image_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(encrypt_router)
app.include_router(image_router)
