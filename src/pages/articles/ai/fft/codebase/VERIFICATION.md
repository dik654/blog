# FFT example verification

The upstream files are copied unchanged. `PROVENANCE.json` records full commit IDs, URLs and SHA-256 hashes. Licenses are included beside each source tree.

`verify_kiss.c` is the article's own CPU wrapper. Run from this directory:

```sh
cc -std=c11 -Wall -Wextra -O2 verify_kiss.c kiss/kiss_fft.c -lm -o /tmp/fft-article-check
/tmp/fft-article-check
```

Default float, without `FIXED_POINT` or `USE_SIMD`, was tested. The retained upstream allocation-size comparison emits a signed/unsigned comparison warning. The wrapper compares real and imaginary components with tolerance `1e-5`.

```text
factor [4,1]; scalar_bytes 4
forward [10,0] [-2,2] [-2,0] [-2,-2]
inverse_raw [4,0] [8,0] [12,0] [16,0]
alias_buffers [10,0] [-2,2] [-2,0] [-2,-2]
```

This verifies the four-element example, inverse scale and equal-pointer branch. It is not a benchmark or a proof covering every transform size. The Whisper source is read and traced; the Whisper model and its STFT call were not executed here.
