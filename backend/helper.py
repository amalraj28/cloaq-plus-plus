from qiskit.qasm2 import dump as q2_dump, loads as q2_loads
from qiskit.qasm3 import dump as q3_dump, loads as q3_loads
from typing import Literal
from qiskit import QuantumCircuit
from uuid import uuid4



class Input:
    @staticmethod
    def integer(query: str) -> int:
        while True:
            try:
                n = int(input(query))
            except ValueError:
                print("Invalid input! Try again")
            else:
                break

        return n
    

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


def generate_unique_string() -> str:
    return str(uuid4()).replace("-", "")


def calculate_median(values):
    sorted_values = sorted(values)
    n = len(sorted_values)

    if n == 0:
        raise ValueError("List is empty")

    mid = n // 2
    median = (
        (sorted_values[mid - 1] + sorted_values[mid]) / 2
        if n % 2 == 0
        else sorted_values[mid]
    )

    return median


def tvd(original_res, encrypted_res):
    if sum(list(original_res.values())) != sum(list(encrypted_res.values())):
        raise Exception("Size difference for tvd")

    print(f"Count = {sum(list(original_res.values()))}")
    all_keys = set(original_res.keys()).union(encrypted_res.keys())

    return 0.5 * sum(
        abs(original_res.get(k, 0) - encrypted_res.get(k, 0))
        / sum(encrypted_res.values())
        for k in all_keys
    )


def dfc(original_res, encrypted_res):
    correct_output = max(original_res, key=original_res.get)
    correct_count = encrypted_res.get(correct_output, 0)

    incorrect_counts = {k: v for k, v in encrypted_res.items() if k != correct_output}
    max_incorrect_count = max(incorrect_counts.values(), default=0)
    total_shots = sum(encrypted_res.values())
    dfc_score = (correct_count - max_incorrect_count) / total_shots

    return dfc_score
