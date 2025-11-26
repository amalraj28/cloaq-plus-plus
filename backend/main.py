from fastapi import FastAPI
from qiskit import QuantumCircuit, ClassicalRegister, transpile
from qiskit_aer import AerSimulator
from helper import read_qasm2, write_qasm2, read_qasm2_from_string
from helper import read_qasm3, write_qasm3, read_qasm3_from_string
from helper import get_qasm_version
import random
from dequeue import Deque
from itertools import chain
from pathlib import Path
import tempfile
import matplotlib

matplotlib.use("agg")
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
from fastapi.responses import FileResponse
from fastapi.exceptions import HTTPException
from uuid import uuid4
from copy import deepcopy
from qiskit.visualization import circuit_drawer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class EncryptRequest(BaseModel):
    qasm_string: str
    key_size: int
    shots: int = 1024


class DecryptRequest(BaseModel):
    encrypted_values: dict[str, int]
    key: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QCircuit:
    gate_index = {
        0: "X",
        1: "CX",
        2: "SWAP",
        3: "CCX",
        4: "CSWAP",
        5: "S",
    }

    qubit_count = {
        "X": 1,
        "CX": 2,
        "SWAP": 2,
        "CCX": 3,
        "CSWAP": 3,
        "S": 1,
    }

    def __init__(self, *args, from_qasm=True):
        self.qc = args[0] if from_qasm else QuantumCircuit(*args)
        self.gate_mappings = {
            "X": self.qc.x,
            "Y": self.qc.y,
            "H": self.qc.h,
            "Z": self.qc.z,
            "S": self.qc.s,
            "T": self.qc.t,
            "I": self.qc.id,
            "CX": self.qc.cx,
            "CY": self.qc.cy,
            "CZ": self.qc.cz,
            "SWAP": self.qc.swap,
            "CSWAP": self.qc.cswap,
            "CCX": self.qc.ccx,
        }

    @classmethod
    def from_qasm2(cls, file_name: str):
        qc = read_qasm2(file_name)
        return cls(qc)

    @classmethod
    def from_qasm3(cls, file_name: str):
        qc = read_qasm3(file_name)
        return cls(qc)

    @classmethod
    def from_qasm_string(cls, qasm_string: str):
        version = get_qasm_version(qasm_string)
        qc = (
            read_qasm2_from_string(qasm_string)
            if version == 2
            else read_qasm3_from_string(qasm_string)
        )
        return cls(qc)

    def to_qasm2(self, file_name: str):
        write_qasm2(self.qc, file_name)

    def to_qasm3(self, file_name: str):
        write_qasm3(self.qc, file_name)

    def encrypt(self, key_size: int, effective_qubits: int = -1) -> str:
        rem = key_size
        key = []
        if effective_qubits == -1:
            effective_qubits = self.qc.num_qubits

        while rem > 0:
            idx = random.randint(0, len(list(self.gate_index.keys())) - 1)
            gate = self.gate_index[idx]
            contr = self.qubit_count[gate] + 1

            if (rem - contr == 0 or rem - contr > 1) and contr - 1 <= effective_qubits:
                encryptor: list[int | str] = ["@"]
                encryptor.append(idx)
                encryptor.append("#")

                qubits = random.sample(range(effective_qubits), contr - 1)
                self.gate_mappings[gate](*qubits)
                for qubit in qubits:
                    encryptor.append(qubit)
                    encryptor.append("|")

                if len(encryptor):
                    encryptor.pop()
                key.append(encryptor)
                rem -= contr

        flattened_list = list(map(lambda x: str(x), chain.from_iterable(key)))
        return "".join(flattened_list[1:])

    @staticmethod
    def decrypt(key: str, incorrect_measure: str, effective_qubits: int = -1):
        deque = Deque()
        measurement = [int(x) for x in incorrect_measure]

        n = effective_qubits if effective_qubits != -1 else len(measurement)

        if len(measurement) == 0:
            raise ValueError("Not a valid measurement result!")

        for item in key.split("@"):
            if not item:
                continue
            index, qubits = item.split("#")
            qubits = tuple(map(lambda x: int(x), qubits.split("|")))

            gate_idx = int(index)
            if gate_idx not in QCircuit.gate_index:
                raise ValueError(
                    f"Invalid key {key}. Value at index {gate_idx} is invalid!"
                )

            gate = QCircuit.gate_index[gate_idx]
            deque.push_back((gate, qubits))

        while not deque.empty():
            quantum_gate, qubits = deque.back()
            deque.pop_back()
            bit_pos = list(map(lambda x: n - x - 1, qubits))

            if all(0 <= pos < len(measurement) for pos in bit_pos):
                if quantum_gate == "CX":
                    ctrl, target = bit_pos
                    measurement[target] = measurement[target] ^ measurement[ctrl]

                elif quantum_gate == "CCX":
                    c1, c2, t = bit_pos
                    measurement[t] = (measurement[c1] & measurement[c2]) ^ measurement[
                        t
                    ]

                elif quantum_gate == "SWAP":
                    bit1, bit2 = bit_pos
                    measurement[bit2], measurement[bit1] = (
                        measurement[bit1],
                        measurement[bit2],
                    )

                elif quantum_gate == "CSWAP":
                    ctrl, bit1, bit2 = bit_pos
                    if measurement[ctrl] == 1:
                        measurement[bit2], measurement[bit1] = (
                            measurement[bit1],
                            measurement[bit2],
                        )

                elif quantum_gate == "X":
                    bit = bit_pos[0]
                    measurement[bit] ^= 1

        return "".join(list(map(str, measurement)))

    def measure(
        self,
        qubits_to_measure: list[int],
        add_bits: bool = False,
        measure_all: bool = True,
    ):
        if measure_all:
            self.qc.measure_all(add_bits=add_bits)
        else:
            if add_bits:
                cr = ClassicalRegister(len(qubits_to_measure))
                self.qc.add_register(cr)
                self.qc.measure(
                    qubits_to_measure,
                    [cr[i] for i in range(len(qubits_to_measure))],  # type: ignore
                )
            else:
                self.qc.measure(qubits_to_measure, qubits_to_measure)

    def draw(self, output="mpl", **kwargs):
        if output == "text":
            print(self.qc.draw(output=output, **kwargs))
        else:
            self.qc.draw(output=output, **kwargs)

    def compile_and_run(self, shots=1024):
        simulator = AerSimulator()
        transpiled = transpile(self.qc, simulator)
        result = simulator.run(transpiled, shots=shots).result()
        return transpiled, result.get_counts()

    @staticmethod
    def compute_tvd(original_res, obfus_res, shots):
        all_keys = set(original_res.keys()) | set(obfus_res.keys())
        return sum(
            abs(original_res.get(k, 0) - obfus_res.get(k, 0)) for k in all_keys
        ) / (2 * shots)

    @staticmethod
    def compute_dfc(obfus_res, correct_outputs, shots):
        preserved_count = sum(obfus_res.get(output, 0) for output in correct_outputs)
        max_wrong = max(
            (v for k, v in obfus_res.items() if k not in correct_outputs), default=0
        )
        return (preserved_count - max_wrong) / shots


def get_temp_folder_path():
    path = Path(tempfile.gettempdir()) / "cloaq"
    path.mkdir(parents=True, exist_ok=True)

    return path


def save_to_temp(img: Figure, file_name: str) -> str:
    file_path = get_temp_folder_path() / file_name

    img.savefig(
        fname=file_path, dpi=150, format="png", bbox_inches="tight", pad_inches=0.0
    )
    plt.close()

    return f"/image/{file_name}"


def get_image_url(qc: QCircuit) -> str:
    """
    Render the circuit to a PNG file and return the filesystem path (or URL).
    """

    filename = f"circuit_{uuid4().hex}.png"
    circ: Figure = circuit_drawer(qc.qc, output="mpl")  # type: ignore

    return save_to_temp(circ, file_name=filename)


def _circuit_has_measurements(circ: QuantumCircuit) -> bool:
    """
    Helper: return True if the circuit already contains at least one measure op.
    Supports both old (inst[0]) and new (.operation) Qiskit instruction APIs.
    """
    for inst in circ.data:
        op = getattr(inst, "operation", None) or inst[0]
        if op.name == "measure":
            return True
    return False


def generate_qc(input_qasm: str) -> QCircuit:
    qc = QCircuit.from_qasm_string(input_qasm)
    qc = append_measurements(qc)
    return qc


def append_measurements(qc: QCircuit) -> QCircuit:
    """
    Append measurements on all qubits **only if** there are no measurement
    gates already present. If at least one measurement exists, the circuit
    is left unchanged.

    Returns the same QCircuit instance (for chaining).
    """
    if not _circuit_has_measurements(qc.qc):
        # measure all qubits, automatically adding classical bits
        qc.measure(
            qubits_to_measure=list(range(qc.qc.num_qubits)),
            add_bits=True,
            measure_all=True,
        )
    return qc


def encrypt_qc(qc: QCircuit, key_size: int) -> tuple[QCircuit, str]:
    encrypted = deepcopy(qc)
    key = encrypted.encrypt(key_size=key_size)
    return encrypted, key


def get_measurements(qc: QCircuit, shots: int = 1024):
    # Later you can adapt this to accept a backend argument instead of
    # always using AerSimulator inside QCircuit.compile_and_run().
    _, res = qc.compile_and_run(shots=shots)
    return res


def decrypt_measurements(
    encrypted_measurements: dict[str, int], key: str
) -> dict[str, int]:
    decrypted_results: dict[str, int] = {}

    for measure, count in encrypted_measurements.items():
        decrypted_measure = QCircuit.decrypt(key, incorrect_measure=measure)
        # accumulate counts if multiple encrypted strings map to same decrypted one
        decrypted_results[decrypted_measure] = (
            decrypted_results.get(decrypted_measure, 0) + count
        )

    return decrypted_results


@app.post("/encrypt")
def encrypt(req: EncryptRequest):
    qasm_string, key_size, shots = req.qasm_string, req.key_size, req.shots

    qc = generate_qc(qasm_string)
    encrypted_circuit, key = encrypt_qc(qc, key_size=key_size)

    original_measurements = get_measurements(qc, shots=shots)
    encrypted_measurements = get_measurements(encrypted_circuit, shots=shots)

    original_image = get_image_url(qc)
    encrypted_image = get_image_url(encrypted_circuit)

    return {
        "original_results": original_measurements,
        "encrypted_results": encrypted_measurements,
        "original_circuit": original_image,
        "encrypted_circuit": encrypted_image,
        "key": key,
    }


@app.post("/decrypt")
def decrypt(req: DecryptRequest):
    encrypted_values = req.encrypted_values
    key = req.key
    decrypted_values = decrypt_measurements(
        encrypted_measurements=encrypted_values, key=key
    )

    return {"decrypted_results": decrypted_values}


@app.get("/image/{filename}")
def read_image(filename: str):
    # prevent path traversal by taking only the final path component
    safe_name = Path(filename).name
    path = get_temp_folder_path() / safe_name

    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(path, media_type="image/png", filename=safe_name)
