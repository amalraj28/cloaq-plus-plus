from pydantic import BaseModel


class EncryptRequest(BaseModel):
    qasm_string: str
    key_size: int
    shots: int = 1024


class DecryptRequest(BaseModel):
    encrypted_values: dict[str, int]
    key: str


class DownloadEncryptedCircuitRequest(BaseModel):
    encrypt_artifact: str
