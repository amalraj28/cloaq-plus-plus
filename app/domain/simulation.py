from qiskit_aer import AerSimulator
from qiskit import transpile
from app.domain.qcircuit import QCircuit, append_measurements


def get_measurements(qc: QCircuit, shots=1024):
    qc = append_measurements(qc)
    sim = AerSimulator()
    tr = transpile(qc.qc, sim)
    result = sim.run(tr, shots=shots).result()
    return result.get_counts()
