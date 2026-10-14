# Multi-adapter serving source snapshots

Retrieved 2026-10-14. Full unmodified files, byte-for-byte upstream (original comments and line numbers kept).

- vLLM tag v0.27.1, commit 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac (Apache-2.0, `vllm/LICENSE`).
- TensorRT-LLM main commit 681cff123b96e0a8fd52d977366a62677de7ae08 (commit snapshot, no release label claimed; Apache-2.0, `trtllm/LICENSE`).

`vllm/` and `trtllm/` are project roots; upstream paths remain underneath. `?raw` imports are read-only source panels. These files are not executed by the website and no GPU performance was measured for this article.

- `trtllm/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp` — 38455 bytes; SHA256 `3b1f477947623c95766689a62b4ccbe7c427f4ac0e164e4c1924701ce0b3561b`; [pinned original](https://raw.githubusercontent.com/NVIDIA/TensorRT-LLM/681cff123b96e0a8fd52d977366a62677de7ae08/cpp/tensorrt_llm/batch_manager/capacityScheduler.cpp)
- `trtllm/LICENSE` — 40678 bytes; SHA256 `a56e691155bb532ea212f701d3ecacb2db549fa64757f9bad3e06bc9177f46ea`; [pinned original](https://raw.githubusercontent.com/NVIDIA/TensorRT-LLM/681cff123b96e0a8fd52d977366a62677de7ae08/LICENSE)
- `trtllm/tensorrt_llm/_torch/pyexecutor/llm_request.py` — 82001 bytes; SHA256 `1002328a7f78a3e12350464754a6406141d410180363245d87a557eb61521064`; [pinned original](https://raw.githubusercontent.com/NVIDIA/TensorRT-LLM/681cff123b96e0a8fd52d977366a62677de7ae08/tensorrt_llm/_torch/pyexecutor/llm_request.py)
- `vllm/LICENSE` — 11357 bytes; SHA256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/LICENSE)
- `vllm/vllm/config/lora.py` — 7024 bytes; SHA256 `ed6cf6575f5950f079a62f904caeae93d1a4745dd8c21788b74367883bcd4b08`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/config/lora.py)
- `vllm/vllm/lora/layers/base_linear.py` — 11966 bytes; SHA256 `040d75b4a76cb97f28c507453ab8aea68252c35b8b64d9f83ce40d32e2a3a495`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/lora/layers/base_linear.py)
- `vllm/vllm/lora/model_manager.py` — 53429 bytes; SHA256 `0870ebc5cfceb71605d04039e92e1a7917448d1ee274f33b803ea54b85032bda`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/lora/model_manager.py)
- `vllm/vllm/lora/ops/triton_ops/lora_kernel_metadata.py` — 7695 bytes; SHA256 `7669eeeb491e89df7ef4ff050a79d3934ce7a63b146fe93239f081d176c68881`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/lora/ops/triton_ops/lora_kernel_metadata.py)
- `vllm/vllm/lora/ops/triton_ops/lora_shrink_op.py` — 9191 bytes; SHA256 `7f9eaabb4bdac93252cd7a6c8ac6350eb26eff63e363c20bef463655bc974fd3`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/lora/ops/triton_ops/lora_shrink_op.py)
- `vllm/vllm/lora/punica_wrapper/punica_gpu.py` — 24363 bytes; SHA256 `d0c8ce69191d733d479e50399bfc86d6b89a55915dda4dd0cf32b8921e32bf9d`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/lora/punica_wrapper/punica_gpu.py)
- `vllm/vllm/lora/worker_manager.py` — 13200 bytes; SHA256 `1f7bb394ca92e21a3f0e250943196dd679c145f16fb67cc64e00e011e8e1447a`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/lora/worker_manager.py)
- `vllm/vllm/v1/core/kv_cache_utils.py` — 94588 bytes; SHA256 `0ab5385925f660395612e3f69030cad3b18c2e0bd6fb61d3ff43072a6cefb74f`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/kv_cache_utils.py)
- `vllm/vllm/v1/core/sched/scheduler.py` — 137118 bytes; SHA256 `c67bda2886b52865ddafabaae7d797c359e930752f374421a33e537d94a5f45a`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py)
