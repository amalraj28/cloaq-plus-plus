import random
from qiskit import QuantumCircuit, ClassicalRegister
from app.core.sequences import sequences
from app.core.qasm_io import read_qasm_from_string, write_qasm2, write_qasm3
from app.core.dequeue import Deque
from app.core.utils import get_num_digits
from app.core.circuit_ops import insert_gate_before_measurements, combine_random_gates


class QCircuit:
    gate_index = {
        0: "X",
        1: "CX",
        2: "SWAP",
        3: "CCX",
        4: "CSWAP",
        5: "S",
        6: "Y",
        7: "T",
    }
    qubit_count = {
        "X": 1,
        "CX": 2,
        "SWAP": 2,
        "CCX": 3,
        "CSWAP": 3,
        "S": 1,
        "Y": 1,
        "T": 1,
    }

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
        """Spend the key budget while covering as many available qubits as possible.

        Budget counts gate-index digits plus one per operand qubit, as before;
        expanded basis-transformation operations do not add to this budget.
        """
        if not isinstance(key_size, int) or key_size < 0:
            raise ValueError("key_size must be a non-negative integer")
        if effective_qubits == -1:
            effective_qubits = self.qc.num_qubits
        if not isinstance(effective_qubits, int) or not 0 <= effective_qubits <= self.qc.num_qubits:
            raise ValueError("effective_qubits must be within the circuit's qubit count")
        if key_size == 0:
            return ""

        # Each option is (gate index, gate name, number of qubits, budget cost).
        options = [
            (idx, gate, self.qubit_count[gate],
             self.qubit_count[gate] + get_num_digits(idx))
            for idx, gate in self.gate_index.items()
            if self.qubit_count[gate] <= effective_qubits
        ]
        # best[b] is the greatest number of operand slots attainable with
        # exactly budget b. -1 marks budgets that cannot be filled.
        best = [-1] * (key_size + 1)
        best[0] = 0
        for budget in range(1, key_size + 1):
            for _, _, arity, cost in options:
                if cost <= budget and best[budget - cost] >= 0:
                    best[budget] = max(best[budget], arity + best[budget - cost])
        if best[key_size] < 0:
            raise ValueError("key_size cannot be filled with the available qubits and gates")

        rem = key_size
        key = []
        unused = set(range(effective_qubits))
        while rem > 0:
            candidates = [
                option for option in options
                if option[3] <= rem and best[rem - option[3]] >= 0
            ]
            # Retain choices that achieve the most distinct qubit coverage
            # possible with this budget; choose randomly among those choices.
            coverage = max(min(len(unused), arity + best[rem - cost])
                           for _, _, arity, cost in candidates)
            candidates = [
                option for option in candidates
                if min(len(unused), option[2] + best[rem - option[3]]) == coverage
            ]
            idx, gate, arity, contr = random.choice(candidates)
            qubits = random.sample(sorted(unused), min(arity, len(unused)))
            remaining = [q for q in range(effective_qubits) if q not in qubits]
            qubits.extend(random.sample(remaining, arity - len(qubits)))
            random.shuffle(qubits)

            seq = random.choice(sequences.get(gate.lower(), [[gate]]))
            if len(seq) > 1:
                seq = combine_random_gates(seq)
            for g in seq:
                insert_gate_before_measurements(self.qc, g, qubits)

            key.append(f"{idx}#" + "|".join(str(q) for q in qubits))
            unused.difference_update(qubits)
            rem -= contr

        return "@".join(key)

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
