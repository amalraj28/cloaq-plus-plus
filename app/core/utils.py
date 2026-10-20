from uuid import uuid4
from typing import Any


def generate_unique_string() -> str:
    return str(uuid4()).replace("-", "")


def get_num_digits(num: int) -> int:
    if not isinstance(num, int):
        raise ValueError("Wrong argument buddy!")
    
    if num < 0 or num >= 1e4:
        raise ValueError("Argument must be between 0 and 999")
        
    if num < 10:
        return 1
    
    if num < 100:
        return 2
    
    return 3