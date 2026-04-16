from fastapi import APIRouter
from fastapi.responses import FileResponse

from app.models.request_models import (
    EncryptRequest,
    DecryptRequest,
    DownloadEncryptedCircuitRequest,
)
from app.services.encryption import (
    encrypt_and_measure,
    decrypt_results,
    get_saved_encrypted_circuit,
)

router = APIRouter(tags=["encryption"])


@router.post("/encrypt")
def encrypt(req: EncryptRequest):
    return encrypt_and_measure(
        qasm_string=req.qasm_string,
        key_size=req.key_size,
        shots=req.shots,
    )


@router.post("/decrypt")
def decrypt(req: DecryptRequest):
    return decrypt_results(
        encrypted_values=req.encrypted_values,
        key=req.key,
    )


@router.post("/encrypt/download")
def download_encrypted_circuit(req: DownloadEncryptedCircuitRequest):
    path = get_saved_encrypted_circuit(req.encrypt_artifact)
    return FileResponse(
        path,
        media_type="application/qasm",
        filename=path.name,
    )
