# Pinned source snapshots

vLLM v0.27.1 @ 6e448d0ea9bf3d88d898b65449ca6dc2aec170ac; SGLang @ 35f3c96ff4794a4de15daf12caad371084a037ee. Checked 2026-10-04.

Complete original files, unchanged. The nested vllm prefix in NIXL paths separates the repository directory from the upstream package path. The scheduler snapshot uses the same revision. Apache-2.0 LICENSE files are included for both repositories. No GPU execution or timing benchmark is claimed.

```json
[
  {
    "path": "sglang/LICENSE",
    "bytes": 11346,
    "sha256": "1495e1e757ef4d0925a2350563cf5754bb23c51701a8ec4fb3c5cdcbedae6747"
  },
  {
    "path": "sglang/sgl-model-gateway/src/policies/cache_aware.rs",
    "bytes": 63405,
    "sha256": "ce4393bf099a8f7462380eede47356d072488ee42736f07772046cf0224e4b96"
  },
  {
    "path": "sglang/sgl-model-gateway/src/policies/mod.rs",
    "bytes": 6868,
    "sha256": "dda7b0dd549cb85df54e379a7a3112aebeb48758e6525d7d8362331a8bd4677a"
  },
  {
    "path": "sglang/sgl-model-gateway/src/policies/tree.rs",
    "bytes": 78745,
    "sha256": "0b3e4f27a1ac7513cfc8534619bac5d391d61db78cc037eb0d00719a5647a443"
  },
  {
    "path": "vllm/LICENSE",
    "bytes": 11357,
    "sha256": "c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4"
  },
  {
    "path": "vllm/tests/v1/kv_connector/nixl_integration/toy_proxy_server.py",
    "bytes": 9051,
    "sha256": "0ba88d1e77d0bd5f4f2f6e69f1bf6e29fbc258e64dbed695c0d968ff14720fd8"
  },
  {
    "path": "vllm/v1/core/sched/scheduler.py",
    "bytes": 137118,
    "sha256": "c67bda2886b52865ddafabaae7d797c359e930752f374421a33e537d94a5f45a"
  },
  {
    "path": "vllm/vllm/distributed/kv_transfer/kv_connector/v1/nixl/base_worker.py",
    "bytes": 116924,
    "sha256": "9a4476985935c7371f3373e3c8bc8a82b5085fd5a8e4ba0cc803f1bab3ea3c17"
  },
  {
    "path": "vllm/vllm/distributed/kv_transfer/kv_connector/v1/nixl/connector.py",
    "bytes": 14711,
    "sha256": "95b0a138309ff6de80440a5cf604acda6187ab3125ccaa2d04ccf745afb809e4"
  },
  {
    "path": "vllm/vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_scheduler.py",
    "bytes": 11480,
    "sha256": "6cb9492870e518a6f21aa00dbe3f6616b4bc4d62dd79aa6fd2a7bee9a4b13033"
  },
  {
    "path": "vllm/vllm/distributed/kv_transfer/kv_connector/v1/nixl/pull_worker.py",
    "bytes": 17563,
    "sha256": "da0477b4e0fc186913d578db07e5937c0b269067e7f88e7fa8886b9808d6d71a"
  }
]
```
