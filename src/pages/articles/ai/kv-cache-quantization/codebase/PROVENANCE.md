# KV cache quantization source snapshots

Retrieved 2026-10-14. Full unmodified files (byte-for-byte). vLLM v0.27.1 commit 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac; llama.cpp commit 091b6a7fc561b78da90a0ed2d524ec995458c657 (commit snapshot, no release label claimed).

`vllm/` and `llama.cpp/` are project roots; upstream paths remain underneath. `?raw` imports are read-only source panels; the website does not execute these files. The four-value FP8 E4M3 round trip in the article was computed with a small Python reimplementation of E4M3 round-to-nearest with 448 saturation; no GPU kernel or model accuracy was measured.

- `llama.cpp/ggml/src/ggml-common.h` — 135161 bytes; SHA256 `0061131b615c5721fc88a78feeb22c1f8c450f1c2646a317d80796a653bf595c`; [pinned original](https://raw.githubusercontent.com/ggml-org/llama.cpp/091b6a7fc561b78da90a0ed2d524ec995458c657/ggml/src/ggml-common.h)
- `llama.cpp/LICENSE` — 1078 bytes; SHA256 `94f29bbed6a22c35b992c5c6ebf0e7c92f13b836b90f36f461c9cf2f0f1d010d`; [pinned original](https://raw.githubusercontent.com/ggml-org/llama.cpp/091b6a7fc561b78da90a0ed2d524ec995458c657/LICENSE)
- `llama.cpp/src/llama-context.cpp` — 169201 bytes; SHA256 `2a25e556cb0d16725e01ce853fb1b76da91dcb41b803ce1a6bacec89bfb94aa5`; [pinned original](https://raw.githubusercontent.com/ggml-org/llama.cpp/091b6a7fc561b78da90a0ed2d524ec995458c657/src/llama-context.cpp)
- `vllm/csrc/libtorch_stable/cache_kernels.cu` — 76654 bytes; SHA256 `7f47bca5f46bbf77c64f77c25715491e92be398d23d25292463a238d1d4b7e9a`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/csrc/libtorch_stable/cache_kernels.cu)
- `vllm/csrc/quantization/w8a8/fp8/nvidia/quant_utils.cuh` — 21472 bytes; SHA256 `95cc778701c56e0cb7c65e8d2cd59bc1e345a036599be9fbf523033918d7f90b`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/csrc/quantization/w8a8/fp8/nvidia/quant_utils.cuh)
- `vllm/LICENSE` — 11357 bytes; SHA256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/LICENSE)
- `vllm/vllm/envs.py` — 105852 bytes; SHA256 `567c99293678739cdd133897e3c7edfeba3a7fc5c635c43b29aea6bb89251244`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/envs.py)
- `vllm/vllm/model_executor/layers/attention/attention.py` — 35604 bytes; SHA256 `dae6d1f09448adc1d67c776089e77e8b75378332166844a234cd8fa45c18195e`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/model_executor/layers/attention/attention.py)
