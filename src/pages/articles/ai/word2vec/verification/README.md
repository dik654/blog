# Word2Vec source observation

Original source: `../codebase/original/word2vec.c`, commit `20c129af10659f7c50e86e3be406df663beff438`, unchanged bytes and upstream Apache license. PyTorch source is read separately and is not executed by this observation.

Run on the checked macOS toolchain with Python 3 and a C compiler:

```sh
python3 src/pages/articles/ai/word2vec/verification/observe.py
```

The script asserts a unique source insertion point and generates `observed-word2vec.c` with **one additional printf** before the original `l1 = last_word * layer1_size` statement. It compiles the retained `observe.c` wrapper and calls the original `ReadWord` and `TrainModelThread` functions. Generated source and executable are local outputs, not substitutes for the unmodified source shown in article panels.

The compile option `-Dfgetc_unlocked=getc_unlocked` maps a stdio function unavailable in the checked macOS headers to the supported unlocked character read. The observed file is private to the single thread. The actual command and output are retained in `observation.json` and `run.log`.

The wrapper supplies a five-entry vocabulary and fixed 5×3 input table. It sets `sample=0`, `hs=0`, `negative=0`, `cbow=0`, `window=2`, `iter=1`, and `num_threads=1`. Objectives are disabled, so this verifies sentence reading, window selection, directed pair enumeration, and unchanged input rows. It does **not** verify normal SGNS training, final semantic quality, performance, multithread reproducibility, or a full PyTorch build. The 64-bit window state starts at 0 and is consumed only once per center in this setup; enabling sampling/training consumes that state elsewhere.

Expected central observations are `from=3 to=2` twice at position 2, among 10 total pairs. The input row for ID 2 remains `[1,2,0]`. Article scores 2 and 1 are separate direct substitutions into the paper-direction and source-direction formulas; the observation run does not enable that objective branch.
