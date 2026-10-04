# SGNS original-source observation

Run from the repository root:

    python3 src/pages/articles/ai/word2vec-negative-sampling/verification/observe.py

The script includes the full unchanged pinned original, calls its InitUnigramTable,
and extracts the original SG negative-sampling loop/input update and the
subsampling/append block without changing their bytes. Authored callers provide
the five-row assumed tables, one pair, seeds and the five input IDs.

The draw-report loop is an authored observation calculation alongside the
original block; it is not an instrumentation change to the original loop.
The original sigmoid table initialization expression is retained.

This runs native CPU C, not full TrainModelThread, corpus training, a GPU kernel,
a quality evaluation, or a runtime benchmark. InitUnigramTable allocates
100,000,000 int entries; only the resulting five-bin histogram is saved.
Source SHA, extracted line ranges and compile command are in source-scope.json.
run.log contains actual results. The generated executable is not retained.
