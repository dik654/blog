# Retained observation

observe.c and observe.mjs are authored call harnesses, not upstream source.

The C harness calls unchanged utf8proc v2.11.3 source. Build from this directory:

    cc -std=c11 -O2 -I../codebase observe.c ../codebase/utf8proc.c -o /tmp/unicode-observe
    /tmp/unicode-observe
    node observe.mjs

The C trace reports utf8proc 2.11.3 / Unicode 17.0.0. UTF-16 length is counted from decoded scalar values in that C harness; the independent Node trace observes actual UTF-16 string units. Node reports its own ICU and Unicode versions. These are selected-case observations, not complete Unicode 18 conformance testing.

No source modifications or performance measurements are made. Preserve original code and licenses. Invalid UTF-8, surrogate encoding, and explicit versus null-terminated length are intentionally different API cases. The byte arrays have explicit lengths; C string literals are not used to smuggle an internal NUL.
