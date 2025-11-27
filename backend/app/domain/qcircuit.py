import random
from itertools import chain
from qiskit import QuantumCircuit, ClassicalRegister
from app.core.qasm_io import read_qasm_from_string, write_qasm2, write_qasm3
from app.core.dequeue import Deque


class QCircuit:
    gate_index = {0: "X", 1: "CX", 2: "SWAP", 3: "CCX", 4: "CSWAP", 5: "S"}
    qubit_count = {"X": 1, "CX": 2, "SWAP": 2, "CCX": 3, "CSWAP": 3, "S": 1}

    def __init__(self, qc: QuantumCircuit):
        self.qc = qc
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
    def from_qasm_string(cls, s: str):
        qc = read_qasm_from_string(s)
        return cls(qc)

    def to_qasm2(self, f: str):
        write_qasm2(self.qc, f)

    def to_qasm3(self, f: str):
        write_qasm3(self.qc, f)

    def encrypt(self, key_size: int, effective_qubits: int = -1) -> str:
        rem = key_size
        key = []
        if effective_qubits == -1:
            effective_qubits = self.qc.num_qubits

        while rem > 0:
            idx = random.randint(0, len(self.gate_index.keys()) - 1)
            gate = self.gate_index[idx]
            contr = self.qubit_count[gate] + 1

            if (rem - contr == 0 or rem - contr > 1) and contr - 1 <= effective_qubits:
                encryptor = ["@", idx, "#"]
                qubits = random.sample(range(effective_qubits), contr - 1)
                self.gate_mappings[gate](*qubits)
                for q in qubits:
                    encryptor.append(q)
                    encryptor.append("|")
                encryptor.pop()
                key.append(encryptor)
                rem -= contr

        flattened = [str(x) for x in chain.from_iterable(key)]
        return "".join(flattened[1:])

    @staticmethod
    def decrypt(key: str, incorrect: str, effective_qubits: int = -1):
        dq = Deque()
        measurement = [int(x) for x in incorrect]

        n = effective_qubits if effective_qubits != -1 else len(measurement)
        if len(measurement) == 0:
            raise ValueError("Invalid measurement result")

        for item in key.split("@"):
            if not item:
                continue
            index, qubits = item.split("#")
            qubits = tuple(int(x) for x in qubits.split("|"))

            dq.push_back((QCircuit.gate_index[int(index)], qubits))

        while not dq.empty():
            gate, qubits = dq.back()
            dq.pop_back()
            bit_pos = [n - x - 1 for x in qubits]

            if gate == "CX":
                ctrl, target = bit_pos
                measurement[target] ^= measurement[ctrl]

            elif gate == "CCX":
                c1, c2, t = bit_pos
                measurement[t] = (measurement[c1] & measurement[c2]) ^ measurement[t]

            elif gate == "SWAP":
                a, b = bit_pos
                measurement[b], measurement[a] = measurement[a], measurement[b]

            elif gate == "CSWAP":
                ctrl, a, b = bit_pos
                if measurement[ctrl] == 1:
                    measurement[b], measurement[a] = measurement[a], measurement[b]

            elif gate == "X":
                measurement[bit_pos[0]] ^= 1

        return "".join(str(x) for x in measurement)


def _circuit_has_measurements(circ: QuantumCircuit):
    for inst in circ.data:
        op = getattr(inst, "operation", None) or inst[0]
        if op.name == "measure":
            return True
    return False


def measure_with_registers(qc: QCircuit, qubits, add_bits=True):
    num_qubits = len(qubits)
    cregs = qc.qc.cregs
    total_cbits = sum(c.size for c in cregs)

    if total_cbits >= num_qubits:
        mapping = []
        for c in cregs:
            for i in range(c.size):
                if len(mapping) < num_qubits:
                    mapping.append(c[i])
        qc.qc.measure(qubits, mapping)

    elif add_bits:
        remaining = num_qubits - total_cbits
        new = ClassicalRegister(remaining, f"c{len(cregs)}")
        qc.qc.add_register(new)
        mapping = []

        for c in cregs:
            for i in range(c.size):
                mapping.append(c[i])

        for i in range(remaining):
            mapping.append(new[i])
        qc.qc.measure(qubits, mapping)

    else:
        qc.qc.measure(qubits, qubits)

    return qc


def append_measurements(qc: QCircuit):
    if not _circuit_has_measurements(qc.qc):
        measure_with_registers(qc, list(range(qc.qc.num_qubits)))
    return qc


def generate_qc(s: str):
    return QCircuit.from_qasm_string(s)
