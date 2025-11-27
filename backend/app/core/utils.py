from uuid import uuid4
from typing import Any


def generate_unique_string() -> str:
    return str(uuid4()).replace("-", "")
