"""Authored example: quarter-turns, series, and an unnormalized four-point DFT."""
import cmath
import math
import platform

print("Python", platform.python_version(), platform.platform())
z = 3 + 4j
points = [z * 1j**n for n in range(4)]
print("points", points)
print("four_turns", z * 1j**4)
print("norm", abs(z), "conjugate", z.conjugate())
rotation = cmath.exp(1j * math.pi / 2)
print("exp_quarter", rotation, "rotated", z * rotation)
print("exp_180_radians", cmath.exp(180j))
print("phase_zero_api", cmath.phase(0j))

t = math.pi / 2
for degree in (4, 8):
    partial = sum((1j * t)**n / math.factorial(n) for n in range(degree + 1))
    bound = t**(degree + 1) / math.factorial(degree + 1) / (1 - t / (degree + 2))
    print("series", degree, partial, "error", abs(partial - 1j), "bound", bound)

def dft_exact_root(values):
    """For N=4, powers of -1j avoid trigonometric rounding in the roots."""
    return [sum(value * (-1j)**(k * n) for n, value in enumerate(values)) for k in range(4)]

print("complex_dft", dft_exact_root(points))
print("real_dft", dft_exact_root([p.real for p in points]))
print("off_bin_sum", sum(cmath.exp(1j * math.pi * n / 4) for n in range(4)))
