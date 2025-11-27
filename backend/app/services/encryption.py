import logging
from typing import Dict, Any

from app.domain.qcircuit import generate_qc
from app.domain.encryption import encrypt_qc, decrypt_measurements
from app.domain.simulation import get_measurements
from app.domain.visualization import get_image_url

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
        
        logger.info(f"Measuring original and encrypted circuits with shots={shots}")
        original_res = get_measurements(qc, shots)
        encrypted_res = get_measurements(encrypted_qc, shots)
        
        logger.info("Generating circuit visualizations")
        orig_img = get_image_url(qc)
        enc_img = get_image_url(encrypted_qc)
        
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
