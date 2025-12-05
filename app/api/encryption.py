from fastapi import APIRouter

from app.models.request_models import EncryptRequest, DecryptRequest
from app.services.encryption import encrypt_and_measure, decrypt_results

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
