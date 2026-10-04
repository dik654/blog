# CPython source

Tag: v3.9.6

Revision: db3ff76da19004f266b62e98a81bdfd322861436

Retrieved: 2026-10-04

Full source files are unmodified; PSF license in LICENSE.

{
  "Objects/complexobject.c": {
    "bytes": 32391,
    "sha256": "9b3800be72b6ae969f5da2307d3114822816be3c9efde1c1e65d91164c5576e8"
  },
  "Include/complexobject.h": {
    "bytes": 1806,
    "sha256": "7c224e629e3d2576ccbf045773863dcbef566f89b78d2a78e61418cae9c282cc"
  },
  "LICENSE": {
    "bytes": 13925,
    "sha256": "599826df92bfdcd2702eac691072498bb096c55af04ee984cf90f70ed77b5a70"
  }
}

Authored example: quarter_turn.py (not a CPython source file). Executed with Python 3.9.6 on macOS 26.0.1 arm64. Uses exact four-direction powers for the four-point DFT; cmath exponential values are local floating-point observations. Source-path review covers Py_complex, complex_mul, and _Py_c_prod, not the internal cmath.exp approximation.
