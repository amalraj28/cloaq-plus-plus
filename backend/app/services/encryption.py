import logging
from pathlib import Path
from typing import Dict, Any
from fastapi import HTTPException

from app.domain.qcircuit import generate_qc
from app.domain.encryption import encrypt_qc, decrypt_measurements
from app.domain.simulation import get_measurements
from app.domain.visualization import get_image_url, get_temp_folder_path
from app.core.utils import generate_unique_string

logger = logging.getLogger(__name__)


def encrypt_and_measure(qasm_string: str, key_size: int, shots: int) -> Dict[str, Any]:
    """Encrypt a quantum circuit and measure both original and encrypted versions."""
    
    if not qasm_string or not isinstance(qasm_string, str):
        raise ValueError("qasm_string must be a non-empty string")
    if key_size < 1 or shots < 1:
        raise ValueError("key_size and shots must be positive integers")
    
    try:
        logger.info(f"Generating quantum circuit from QASM")
        qc = generate_qc(qasm_string)
        
        logger.info(f"Encrypting circuit with key_size={key_size}")
        encrypted_qc, key = encrypt_qc(qc, key_size)
        encrypted_artifact_id = generate_unique_string()
        encrypted_qasm_path = (
            get_temp_folder_path() / f"encrypted_circuit_{encrypted_artifact_id}.qasm"
        )
        encrypted_qc.to_qasm2(str(encrypted_qasm_path))
        
        logger.info(f"Measuring original and encrypted circuits with shots={shots}")
        original_res = get_measurements(qc, shots)
        encrypted_res = get_measurements(encrypted_qc, shots)
        
        logger.info("Generating circuit visualizations")
        orig_img = get_image_url(qc, filename=f"original_circuit_{encrypted_artifact_id}.png")
        enc_img = get_image_url(
            encrypted_qc,
            filename=f"encrypted_circuit_{encrypted_artifact_id}.png",
        )
        
        return {
            "original_results": original_res,
            "encrypted_results": encrypted_res,
            "original_circuit": orig_img,
            "encrypted_circuit": enc_img,
            "key": key,
        }
    
    except Exception as e:
        logger.exception(f"Error in encrypt_and_measure")
        raise


def get_saved_encrypted_circuit(encrypted_circuit: str) -> Path:
    """Resolve the exact saved encrypted circuit QASM file for a prior /encrypt response."""

    if not encrypted_circuit or not isinstance(encrypted_circuit, str):
        raise ValueError("encrypted_circuit must be a non-empty string")

    image_name = Path(encrypted_circuit).name
    if not image_name.startswith("encrypted_circuit_") or not image_name.endswith(".png"):
        raise ValueError("encrypted_circuit is not a valid circuit image path")

    artifact_id = image_name[len("encrypted_circuit_"):-len(".png")]
    qasm_path = get_temp_folder_path() / f"encrypted_circuit_{artifact_id}.qasm"

    if not qasm_path.exists():
        raise HTTPException(status_code=404, detail="Encrypted circuit download not found")

    return qasm_path


def decrypt_results(encrypted_values: Dict, key: str) -> Dict[str, Any]:
    """Decrypt measurement results using the provided key."""
    
    if not key or not isinstance(key, str):
        raise ValueError("key must be a non-empty string")
    if not encrypted_values:
        raise ValueError("encrypted_values cannot be empty")
    
    try:
        logger.info("Decrypting measurement results")
        decrypted = decrypt_measurements(encrypted_values, key)
        return {"decrypted_results": decrypted}
    
    except Exception as e:
        logger.exception(f"Error in decrypt_results")
        raise
