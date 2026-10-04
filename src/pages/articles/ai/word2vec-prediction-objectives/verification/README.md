# One-center observation

Run `python3 observe.py` in this directory with a C compiler. It generates a caller and binary locally. The caller includes the unchanged original C, calls original CreateBinaryTree, and executes the exact CBOW statement extracted from original lines 435–495 in an authored one-center function. The generation script checks and records its source range/hash.

The assumed values are the article’s W, internal vectors, sentence IDs and two frequency lists. hs=1, negative=0, window=2, b=1, alpha=.1. macOS compiler options map fgetc_unlocked to getc_unlocked. This does not run full TrainModelThread, train a corpus, measure quality or benchmark speed. Float observations and ideal sigmoid arithmetic are distinguished.

run.log records the native CPU result. The generated executable is not a source artifact.
