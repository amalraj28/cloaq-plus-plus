"""Helpers for inserting operations into existing quantum circuits."""

import random
from collections.abc import Sequence

from basis_transformation import apply_selective_basis_obfuscation
from qiskit import QuantumCircuit
from qiskit.circuit import CircuitInstruction, Gate
from qiskit.quantum_info import Operator
from qiskit.synthesis import OneQubitEulerDecomposer
from qiskit.circuit.library import (
    UGate,
    XGate,
    YGate,
    ZGate,
    HGate,
    SGate,
    SdgGate,
    TGate,
    TdgGate,
    IGate,
    CXGate,
    CYGate,
    CZGate,
    SwapGate,
    CCXGate,
    CSwapGate,
)

_GATES = {
    "x": XGate,
    "y": YGate,
    "z": ZGate,
    "h": HGate,
    "s": SGate,
    "sdg": SdgGate,
    "t": TGate,
    "tdg": TdgGate,
    "i": IGate,
    "id": IGate,
    "cx": CXGate,
    "cy": CYGate,
    "cz": CZGate,
    "swap": SwapGate,
    "ccx": CCXGate,
    "cswap": CSwapGate,
}


def combine_random_gates(sequence: Sequence[str | Gate]) -> list[str | Gate]:
    """Apply selective basis obfuscation within a random contiguous block.

    All selected gates must act on the same single qubit.
    Returns a new list, leaving the input sequence unchanged. Short sequences
    are returned as copies. The selective routine chooses its default fraction
    of gates within the block and adds basis-change gates around them. Only
    obfuscated triples are converted to standard U gates, equivalent up to
    a global phase; untouched entries retain their original representation.
    Angle parameters retain full precision. The block expands
    rather than collapsing into a single gate.
    """
    updated = list(sequence)
    if len(updated) < 2:
        return updated

    count = random.randint(2, len(updated))
    start = random.randint(0, len(updated) - count)
    selected = []
    for entry in updated[start : start + count]:
        if isinstance(entry, str):
            try:
                entry = _GATES[entry.lower()]()
            except KeyError:
                raise ValueError(f"Unsupported gate name: {entry!r}") from None
        if not isinstance(entry, Gate):
            raise TypeError(
                "Sequence entries must be gate names or Qiskit Gate objects"
            )
        selected.append(entry)

    if any(g.num_qubits != 1 for g in selected):
        raise ValueError("A standard U gate can only combine single-qubit gates")

    subcircuit = QuantumCircuit(1)
    for gate in selected:
        subcircuit.append(gate, [0])
    transformed = apply_selective_basis_obfuscation(subcircuit)

    decomposer = OneQubitEulerDecomposer("U")
    replacement = []
    position = 0
    for original in updated[start : start + count]:
        # The selective routine emits either the original instruction or a
        # triple: inverse basis, Obf_<gate>_<id>, forward basis.
        is_obfuscated = (
            position + 2 < len(transformed.data)
            and transformed.data[position + 1].operation.name.startswith("Obf_")
        )
        if not is_obfuscated:
            replacement.append(original)
            position += 1
            continue
        for instruction in transformed.data[position : position + 3]:
            decomposition = decomposer(Operator(instruction.operation).data, simplify=False)
            # Keep plain U gates and omit only their separate global phases.
            replacement.append(UGate(*decomposition.data[0].operation.params))
        position += 3
    updated[start : start + count] = replacement
    return updated


def insert_gate_before_measurements(
    circuit: QuantumCircuit,
    gate: str | Gate,
    qubits: list[int],
) -> QuantumCircuit:
    """Insert a gate in place before measurements of any supplied qubit.

    Search backwards through the circuit, inserting before the earliest
    measurement touching these qubits. Append if none are measured.
    Unrelated measurements remain in their original positions. Repeated calls
    preserve insertion order. Accepts gate names (case insensitive) or Gate
    objects, and an iterable of qubit indices or circuit Qubit objects.
    """
    if isinstance(gate, str):
        try:
            gate = _GATES[gate.lower()]()
        except KeyError:
            raise ValueError(f"Unsupported gate name: {gate!r}") from None

    if not isinstance(gate, Gate):
        raise TypeError("gate must be a gate name or a Qiskit Gate object")

    # Let Qiskit validate the qubits and gate arity before changing the circuit.
    temporary = circuit.copy_empty_like()
    temporary.append(gate, qubits)
    if len(temporary.data) != 1:
        raise ValueError("Supply exactly one set of qubits for the gate")
    instruction = temporary.data[0]
    targets = tuple(
        circuit.qubits[temporary.find_bit(q).index] for q in instruction.qubits
    )
    target_set = set(targets)

    position = len(circuit.data)
    for index in range(len(circuit.data) - 1, -1, -1):
        current = circuit.data[index]
        if current.operation.name == "measure" and target_set.intersection(
            current.qubits
        ):
            position = index

    circuit.data.insert(position, CircuitInstruction(gate, targets, ()))
    return circuit
