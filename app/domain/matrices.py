"""Quantum gate matrices and ordinary, ordered matrix multiplication."""

import numpy as np
from numpy.typing import ArrayLike, NDArray


X = np.array([[0, 1], [1, 0]], dtype=complex)
Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)
H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
S = np.array([[1, 0], [0, 1j]], dtype=complex)


def multiply(a: ArrayLike, b: ArrayLike, *others: ArrayLike) -> NDArray[np.complex128]:
    """Return a @ b @ ... in argument order, without changing the inputs.

    Accepts two or more 2D matrices with compatible inner dimensions.
    For example, multiply(H, Y, H, Z) computes H @ Y @ H @ Z.
    This is matrix multiplication, not a tensor or elementwise product.
    The final result's real and imaginary parts are rounded to two decimals.
    Signed zeros in both parts are normalized to positive zero.
    """
    matrices = [np.asarray(matrix, dtype=complex) for matrix in (a, b, *others)]
    if any(matrix.ndim != 2 for matrix in matrices):
        raise ValueError("Every input must be a two-dimensional matrix.")

    result = matrices[0]
    for index, matrix in enumerate(matrices[1:], start=2):
        if result.shape[1] != matrix.shape[0]:
            raise ValueError(
                f"Matrix {index} has incompatible dimensions: "
                f"cannot multiply shapes {result.shape} and {matrix.shape}."
            )
        result = result @ matrix
    result = np.round(result, decimals=2)
    result.real[result.real == 0] = 0.0
    result.imag[result.imag == 0] = 0.0
    return result

if __name__ == "__main__":
    print(multiply(H, Y, H, Y, Z, X, Z))
