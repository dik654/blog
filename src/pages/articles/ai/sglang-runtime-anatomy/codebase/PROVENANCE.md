# SGLang runtime source snapshots

Retrieved 2026-10-14. Full unmodified files, byte-for-byte identical to upstream, including original comments and line numbers.

- SGLang: commit `4560da58eebe5660dc2e8833178351085d6f9dac` (main branch snapshot, 2026-10-14; no release label claimed). License Apache-2.0, upstream `LICENSE` kept.
- vLLM: tag v0.27.1, commit `6e448d0ea9bf3d88d898b65449ca6dc2aec170ac`. License Apache-2.0, upstream `LICENSE` kept.

`sglang/` and `vllm/` are project roots; upstream paths remain underneath. Files are imported with `?raw` into a read-only source panel and are not executed by the website. Numbers in the article are hand-derived from these code paths under stated assumptions; no GPU runtime was measured.

- `sglang/LICENSE` — 11346 bytes; SHA256 `1495e1e757ef4d0925a2350563cf5754bb23c51701a8ec4fb3c5cdcbedae6747`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/LICENSE)
- `sglang/python/sglang/srt/environ.py` — 113822 bytes; SHA256 `1653d133123a343916805af2d335c95948ffcb3f2f94bccc9e144fa28773d1c4`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/python/sglang/srt/environ.py)
- `sglang/python/sglang/srt/managers/overlap_utils.py` — 28370 bytes; SHA256 `cb018a567e5ea76861e7e40999d23ab724792253fee561b84b44807fc6c963d3`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/python/sglang/srt/managers/overlap_utils.py)
- `sglang/python/sglang/srt/managers/schedule_batch.py` — 169411 bytes; SHA256 `67ccca37f5d476448be14ad2be872596a3184032ed1001c8b35b30fdd0d4b8d9`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/python/sglang/srt/managers/schedule_batch.py)
- `sglang/python/sglang/srt/managers/schedule_policy.py` — 71053 bytes; SHA256 `03ba021fdd225cc4e7d0d5eb822a725fe6e3907e40157ec6461390f23b7f2cb9`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/python/sglang/srt/managers/schedule_policy.py)
- `sglang/python/sglang/srt/managers/scheduler.py` — 271239 bytes; SHA256 `ab23556739fc4a1a089da5d33f8cb925c14b7c68ae564294b5ed13d96b427c36`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/python/sglang/srt/managers/scheduler.py)
- `sglang/python/sglang/srt/managers/scheduler_components/new_token_ratio_tracker.py` — 1586 bytes; SHA256 `d6ad7ede11e9262318649cc5427ee44fb14973d22f8ada26b6d5383a1e77a271`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/python/sglang/srt/managers/scheduler_components/new_token_ratio_tracker.py)
- `sglang/python/sglang/srt/mem_cache/memory_pool.py` — 253454 bytes; SHA256 `8251fab74646427510d9dc2a358668816c26c35d928c6817bf31fd6d7c8ed92c`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/python/sglang/srt/mem_cache/memory_pool.py)
- `sglang/python/sglang/srt/mem_cache/prefill_budget.py` — 15897 bytes; SHA256 `837ac7c099166d061b9a76e24825d0555f3845e1a3bb53e785c5ae8e6f0092a2`; [pinned original](https://raw.githubusercontent.com/sgl-project/sglang/4560da58eebe5660dc2e8833178351085d6f9dac/python/sglang/srt/mem_cache/prefill_budget.py)
- `vllm/LICENSE` — 11357 bytes; SHA256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/LICENSE)
- `vllm/vllm/v1/core/sched/scheduler.py` — 137118 bytes; SHA256 `c67bda2886b52865ddafabaae7d797c359e930752f374421a33e537d94a5f45a`; [pinned original](https://raw.githubusercontent.com/vllm-project/vllm/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/vllm/v1/core/sched/scheduler.py)
