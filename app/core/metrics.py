from typing import Any


def tvd(dist1: dict[Any, int], dist2: dict[Any, int]):
    if sum(list(dist1.values())) != sum(list(dist2.values())):
        raise Exception("Size difference for tvd")

    all_keys = set(dist1.keys()).union(dist2.keys())

    return 0.5 * sum(
        abs(dist1.get(k, 0) - dist2.get(k, 0)) / sum(dist2.values()) for k in all_keys
    )


def dfc(dist1: dict[Any, int], dist2: dict[Any, int]):
    correct_output = max(dist1, key=lambda k: dist1[k])
    correct_count = dist2.get(correct_output, 0)

    incorrect_counts = {k: v for k, v in dist2.items() if k != correct_output}
    max_incorrect_count = max(incorrect_counts.values(), default=0)
    total_shots = sum(dist2.values())
    dfc_score = (correct_count - max_incorrect_count) / total_shots

    return dfc_score


def calculate_median(values: list[Any]):
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
