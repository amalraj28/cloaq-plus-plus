from copy import deepcopy
from app.domain.qcircuit import QCircuit


def encrypt_qc(qc: QCircuit, key_size: int):
    encrypted = deepcopy(qc)

    measured = set()
    for inst in qc.qc.data:
        op = getattr(inst, "operation", None) or inst[0]
        if op.name == "measure":
            for q in inst[1]:
                idx = qc.qc.qubits.index(q)
                measured.add(idx)

    encrypted.qc.data = [
        inst
        for inst in encrypted.qc.data
        if (getattr(inst, "operation", None) or inst[0]).name != "measure"
    ]

    key = encrypted.encrypt(key_size=key_size)

    if measured:
        encrypted.qc.measure(sorted(list(measured)), sorted(list(measured)))

    return encrypted, key


def decrypt_measurements(encrypted_measurements: dict, key: str):
    out = {}

    for meas, count in encrypted_measurements.items():
        dec = QCircuit.decrypt(key, meas)
        out[dec] = out.get(dec, 0) + count

    return out
