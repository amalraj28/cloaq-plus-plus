export const defaultQASM = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

// Random single-qubit rotations
h q[0];
rx(1.234) q[1];
rz(0.872) q[2];

// Random entangling gates
cx q[0], q[1];
cz q[1], q[2];

// More random single-qubit gates
x q[0];
ry(2.513) q[2];

// Measurement
measure q -> c;
`;