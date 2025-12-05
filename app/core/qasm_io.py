from qiskit.qasm2 import dump as q2_dump, loads as q2_loads
from qiskit.qasm3 import dump as q3_dump, loads as q3_loads
from typing import Literal
from qiskit import QuantumCircuit


def get_qasm_version(qasm_string: str) -> Literal[2, 3]:
    """
    Detect whether a QASM string is OpenQASM 2.0 or OpenQASM 3.0.

    - Ignores comments (//, #, /* */)
    - Ignores blank lines
    - Accepts only 'OPENQASM 2.0;' or 'OPENQASM 3.0;'
    - Raises ValueError for invalid or missing version lines
    """

    if not isinstance(qasm_string, str) or not qasm_string.strip():
        raise ValueError("Empty or invalid QASM string.")

    lines = qasm_string.splitlines()

    in_block_comment = False

    for raw in lines:
        line = raw.strip()

        # Handle block comment opening
        if "/*" in line:
            in_block_comment = True

        # Skip anything inside a block comment
        if in_block_comment:
            if "*/" in line:
                in_block_comment = False
            continue

        # Skip line comments
        if line.startswith("//") or line.startswith("#"):
            continue

        # Skip empty lines
        if line == "":
            continue

        # At this point, this is the first meaningful code line
        normalized = line.lower().replace(" ", "")

        if normalized.startswith("openqasm2.0;"):
            return 2
        if normalized.startswith("openqasm3.0;"):
            return 3

        # If the first meaningful line is NOT the version
        raise ValueError(
            f"Invalid QASM: first non-comment line must start with OPENQASM, got: '{line}'"
        )

    # If we finished scanning all lines without finding version
    raise ValueError("No valid OPENQASM version header found.")


def read_qasm_from_string(qasm_string: str) -> QuantumCircuit:
    qasm_string = qasm_string.strip()
    version = get_qasm_version(qasm_string)

    return q2_loads(qasm_string) if version == 2 else q3_loads(qasm_string)


def write_qasm3(qc: QuantumCircuit, file_name: str):
    if not file_name.lower().endswith(".qasm"):
        raise ValueError(f"{file_name} is not a valid QASM3 file name.")

    with open(file_name, "w") as file:
        q3_dump(qc, file)


def write_qasm2(qc: QuantumCircuit, file_name: str):
    if not file_name.lower().endswith(".qasm"):
        raise ValueError(f"{file_name} is not a valid QASM2 file name.")

    with open(file_name, "w") as file:
        q2_dump(qc, file)
