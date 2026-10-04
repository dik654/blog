# Native observation
The complete selected fastText src directory is preserved byte-for-byte at commit 1142dc4c4ecbc19cc16eee5cdd28472e689267e6. The authored observe.cc creates a three-word dictionary and arbitrary two-coordinate rows, serializes a valid unquantized model, then invokes original public getWordVector. A separate softmax one-step Model::update call observes repeated input indices and normalizeGradient=false. These rows were not learned. This is not end-to-end corpus training, a quality benchmark, or a runtime benchmark. The hand-authored serialization header follows the original format. Full source functions execute unchanged.

Build from this directory:
`c++ -std=c++17 -O1 -pthread observe.cc $(find ../codebase/src -name '*.cc' ! -name main.cc) -o observe`
Run `./observe`; the ephemeral fixture.bin and executable need not be committed.
The source has Clang warnings for defaulted copy operations on a noncopyable aligned buffer; original bytes are retained. compile.log records successful compilation. run.log contains actual output.
