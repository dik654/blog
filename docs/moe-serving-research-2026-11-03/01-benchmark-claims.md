# 01 — ChatGPT 벤치마크 주장 원문 대조 (1T급 MoE 셀프호스팅 사이징용)

작성: 2026-11-03. 원칙: 직접 열어 읽은 원문만 근거로 삼는다. 2차 요약(검색 스니펫, 미러, 애그리게이터)은 원문을 못 열었을 때만 쓰고, 그때는 그 사실을 표시했다.
원문 사본/스크린샷: `raw/01-benchmark-claims/` (아래 각 항목에 파일명 표기).

## 요약 표

| # | 주장 | 판정 | 실제 원문 | 핵심 차이 |
|---|---|---|---|---|
| 1a | magik6k 저장소: K2.5 INT4 8×PRO 6000 → 100동시 900 tok/s(요청당 ~40K) | **CONTRADICTED(출처 오귀속)** / 수치 자체는 PARTLY | 900은 magik6k가 아니라 `local-inference-lab/rtx6kpro`(구 voipmonitor/rtx6kpro)의 Festr 디스코드 스크린샷 | vLLM, FP8 KV, TP8 DCP8, **P2P 끈 상태에서 ~800–999**, P2P 켜면 **~600–700**. 요청당 ≈ 6–9 tok/s |
| 1b | K2.5 INT4 1000동시 985 tok/s | **PARTLY** | magik6k FINDINGS.md | 985는 **total(입력+출력)** 처리량. **출력은 281 tok/s**. 256 in/100 out, SGLang, CUDA graph 끔. KV 4,578토큰뿐이라 실제 동시 실행은 ~12개 수준(나머지는 큐), TTFT 85.6초 |
| 1c | K2-Thinking NVFP4 2048동시 5,816 tok/s | **PARTLY** | magik6k README/FINDINGS | 역시 **total**. **출력 1,650 tok/s**, TPOT 576 ms → 요청당 ≈1.7 tok/s |
| 1d | 단일요청 65–90 tok/s | **VERIFIED**(출처는 rtx6kpro) | rtx6kpro `models/kimi-k25.md`, `benchmarks/results.md` | 65=vLLM FP8 KV DCP8 P2P on, 79=DCP1 FP8, 90=BF16 KV FA2 DCP1(컨텍스트 ~190K로 작음), 101=SGLang EP8 + 커스텀 allreduce + GDDR7 오버클럭(Max-Q, PCIe 스위치) |
| 1e | P2P on/off 0K 65/44, 100K 36/29, 200K 27/23 | **VERIFIED**(출처 rtx6kpro) | 같은 파일 | Festr Turin, vLLM, INT4, FP8 KV, DCP=8, 단일 배치 |
| 1f | Turin DDR5-6400 12ch vs Genoa ~32 tok/s | **VERIFIED**(출처 rtx6kpro) | 같은 파일 | Turin=2×EPYC 9575F, DDR5-6400 24×96GB, xGMI 3링크. Genoa=DDR5-4800 12ch/CPU. 둘 다 vLLM FP8 KV DCP8 단일배치 |
| 1g | vLLM TP=8 DCP=8 | **VERIFIED**(출처 rtx6kpro) | 같은 파일 | PR #34597, #34795 체리픽 필요, TRITON_MLA, Marlin MoE |
| 1h | SGLang 462 tok/s @ batch 16 | **PARTLY(출처 다름)** | r/LocalLLaMA 댓글(u/ufrat333), **미러로만 확인** | 8×PRO 6000 **300W 제한**, SGLang, "1600 PP, 462 TG aggregate at BS=16". 양자화·길이·버전 미기재 |
| 1i | MiniMax M2.5 P2P 끄면 총 처리량 ↑ | **VERIFIED as written, 근거 빈약** | rtx6kpro results.md | "P2P 5,000 vs 비활성 10,000 tok/s (high concurrency)" 한 줄뿐. GPU 수·엔진·동시성 미기재 |
| 2 | MLX TB5 RDMA K2-Thinking PP4 14.49 / TP4 14.82 / PP5 14.45, 로드 22.3/99.9/5.2s | **VERIFIED** | github.com/ml-explore/mlx/discussions/2990 | M3 Ultra 512GB ×5 노드, MLX Q4, **batch=1**, 컨텍스트 미기재. PP는 ~1.5K 토큰 넘으면 Metal 타임아웃, TP4 4K 프롬프트에서 2.45 TPS(프리필 포함) |
| 3a | Kimi K2 Q4, RTX 4090 + EPYC 오프로드 ~15 tok/s | **PARTLY** | ktransformers `doc/en/Kimi-K2.md` | "단일 소켓 + 소비자 GPU 1장, Q4_K_M ≈10 TPS, 듀얼소켓 NUMA ≈14 TPS". 4090이라고 명시 안 함. Reddit 원문은 못 찾음 |
| 3b | K2.5 4×PRO 6000 + CPU 오프로드, 100요청 → 27–37 tok/s | **VERIFIED(미러)** | r/LocalLLaMA "Kimi K2.5 on 4x RTX 6000 Pro Blackwell runpod Benchmarks", **미러로만 확인** | SGLang+KT-Kernel, ShareGPT 100프롬프트, rate=inf. 출력 26.77/29.62/37.46 tok/s(설정 3종). 평균 동시성 40–44, TPOT 중앙값 1.08–1.74 **초** |
| 4 | Luminal: K2.5 8×H200 32유저 1,682 tok/s | **VERIFIED(조건 일부 미공개)** | luminal.com/report/moonshotai-kimi-k2-5-8xh200 | Chatbot 1,024 in/256 out, 32동시. 32동시 per-user 18.2–52.6 tok/s(32K 입력 시나리오가 하한). **엔진·양자화 미공개** |
| 5 | vLLM 블로그 wide-EP H200+IB ~2,200 출력 tok/s/GPU, GB200 더 높음 | 2,200은 **VERIFIED**, GB200은 **NOT FOUND** | vllm.ai/blog/2025-12-17-large-scale-serving | 디코드 전용(P/D 분리) 차트: EP32 ≈2.2K, EP72 ≈2.07K, EP96 ≈1.97K, **EP 랭크당 256 동시요청**, 2000 ISL/2000 OSL. 요청당 ≈8.6 tok/s. GB200 수치는 블로그에 없음(로드맵 문구만) |
| 6a | K2.5 1T/32B, 384 experts, 8 active, 256K | **VERIFIED** | HF 모델카드+config.json | + shared expert 1, 61층(dense 1), hidden 7168 |
| 6b | MoE 층 수 ~58/60 | **VERIFIED** | config.json | K2.5: 61−1=**60** MoE층. DeepSeek-R1: 61−3=**58** MoE층(+MTP 1층) |
| 6c | 체크포인트 크기 R1 FP8 805GB / NVFP4 403GB / K2.5 NVFP4 600GB / INT4 714GB | **CONTRADICTED(지표 혼동)** | vLLM recipes YAML, HF API | 이 숫자들은 recipes의 **`vram_minimum_gb`**(필요 VRAM 하한)이지 디스크 크기가 아님. 실제 HF 저장 크기: R1 FP8 **688.6GB**, R1-0528-NVFP4-v2 **413.3GB**, K2.5 INT4 **595.2GB**, K2.5-NVFP4 **590.9GB** |
| 7a | Kimi K3 2.8T/104B, 896 experts 16 active, 1M ctx, KDA+AttnRes | **VERIFIED** | HF moonshotai/Kimi-K3 모델카드 | 93층(69 KDA + 24 Gated MLA), shared expert 2, MXFP4 가중치/MXFP8 활성(QAT). HF 저장 1,561GB |
| 7b | Modal: K3 100→460 tok/s(DFlash), "1.5M TPM per GPU" | 수치 **VERIFIED**, 조건 **NOT FOUND** | modal.com/blog/kimi-k3-by-moonshot-now-available-on-modal | "on agentic workloads" 외 GPU 종류·수·동시성·길이·지표 정의 전부 미기재. 학습용으로 B300 32노드 사용만 명시 |
| 8a | PRO 6000 Server Edition 1,597 GB/s, PCIe 5.0, 600W | **VERIFIED** | nvidia.com 제품 페이지, Lenovo LP2263 | FP4 "4 PFLOPS"(희소성 여부 서버 페이지엔 각주 없음), 450W 캡 SKU 존재 |
| 8b | 다른 변형 1.8 TB/s | **VERIFIED** | Workstation 페이지 1,792 GB/s 600W; Max-Q 데이터시트 1,792 GB/s **300W**, 3,511 AI TOPS(FP4 희소) | Workstation 4,000 AI TOPS는 "FP4 with sparsity" 각주 |
| 8c | RTX 4090 1,008 GB/s, 450W, PCIe 4.0 | **VERIFIED** | NVIDIA 4090 페이지(450W, PCIe Gen 4) + Ada 백서(1,008 GB/s) | 제품 페이지엔 대역폭 없음 → 백서에서 확인 |

---

## 1. "magik6k/glm-kimi-sm120-rtx6000bw" 및 RTX PRO 6000 커뮤니티 벤치

### 1-A. magik6k 저장소 실제 내용

- URL: https://github.com/magik6k/glm-kimi-sm120-rtx6000bw (커밋 `3ef3c8d8`, 2026-01-29, 브랜치 master 하나, 커밋 3개. 그 뒤 업데이트 없음)
- 하드웨어(`configs/gpu-info.txt`, `cpu-info.txt`): 8× **RTX PRO 6000 Blackwell Server Edition** (97,887 MiB, driver 580.95.05, CC 12.0), CPU **AMD EPYC 9B14 96코어 ×2**(Genoa 계열), NUMA 2노드, PCIe only. GPU 토폴로지: PIX 쌍(0↔1, 2↔3, 4↔5, 6↔7), 교차 NUMA는 SYS.
- 소프트웨어: PyTorch 2.9.1, Triton 3.5.1, FlashInfer 0.6.1, Transformers 4.57.1, **SGLang main + 자체 SM120 패치**. vLLM은 Kimi에 쓰지 않음.
- 엔진 설정(로그 `logs/sglang-k2-thinking-final-bench.log`의 ServerArgs): `tp_size=8`, `attention_backend='triton'`, `moe_runner_backend='auto'`, **`disable_cuda_graph=True`**, `chunked_prefill_size=8192`, `mem_fraction_static=0.848`, `quantization='modelopt_fp4'`(K2-Thinking).
- 커널/문제:
  - SM120은 SM당 공유메모리 ~100KB(101,376B). SGLang `extend_attention.py`가 Hopper 블록 크기를 써서 106,496B 요구 → `OutOfResources` 크래시. SM120 전용 블록(64,64)/(32,64)/(32,32) 패치로 해결. 업스트림 PR https://github.com/sgl-project/sglang/pull/17908 은 **2026-01-31 머지 없이 CLOSED**(gh로 확인).
  - K2.5 INT4 MoE: `CompressedTensorsWNA16MarlinMoEMethod`(Marlin). K2-Thinking NVFP4: 저자는 "cuDNN FP4 GEMM"이라고 적음.
  - GLM-4.7 FP8: vLLM CUTLASS FP8 MoE 커널이 SM120용으로 컴파일 안 됨(vllm#32109), Triton fused_moe 147KB 공유메모리 초과 → SGLang PR #16975(amittell, SM120 MXFP4) 브랜치 + 직접 튜닝한 MoE config로 해결.
- K2.5 INT4 결과(`FINDINGS.md`, **256 input / 100 output**, SGLang bench_serving):

| 동시성 | 출력 tok/s | total tok/s | Mean TTFT | Mean TPOT |
|---|---|---|---|---|
| 32 | 171 | 712 | 363 ms | 96 ms |
| 64 | 214 | 864 | 2,026 ms | 84 ms |
| 128 | 258 | 884 | 8,330 ms | 85 ms |
| 256 | 267 | 935 | 19,010 ms | 84 ms |
| 500 | 270 | 985 | 38,647 ms | 88 ms |
| 1000 | 281 | **985** | 85,590 ms | 91 ms |

  저자 주석: "K2.5 INT4 has limited KV cache (4,578 tokens)". 4,578토큰 ÷ (256+100) ≈ 12개 요청만 동시에 KV에 들어감 → "1000 동시"는 대부분 큐 대기. TTFT가 85초인 이유. **사이징 근거로 쓰면 안 되는 수치.**
- K2-Thinking NVFP4 결과(같은 조건, KV 180,191 토큰):

| 동시성 | 출력 tok/s | total tok/s | TTFT | TPOT |
|---|---|---|---|---|
| 128 | 524 | 1,795 | 1,324 ms | 160 ms |
| 256 | 867 | 3,039 | 827 ms | 207 ms |
| 512 | 1,192 | 4,345 | 1,954 ms | 401 ms |
| 1024 | 1,610 | 5,655 | 3,560 ms | 687 ms |
| 2048 | 1,650 | **5,816** | 12,406 ms | 576 ms |

  README의 "5,816 tok/s @ 2048"은 total. 입력 256토큰짜리 짧은 요청이고 CUDA graph도 꺼져 있다.
- **magik6k에 없는 것**: 900 tok/s@100, 40K 컨텍스트, P2P on/off 표, Turin/Genoa 비교, vLLM DCP, SGLang 462, MiniMax. 저장소 전체 grep으로 확인했다. ChatGPT가 아래 rtx6kpro 내용을 magik6k로 잘못 귀속한 것으로 보인다.

### 1-B. 실제 출처: local-inference-lab/rtx6kpro (구 voipmonitor/rtx6kpro)

- URL: https://github.com/local-inference-lab/rtx6kpro (리다이렉트 확인: `gh api repos/voipmonitor/rtx6kpro` → local-inference-lab/rtx6kpro). 클론 시점 커밋 `1b6de11b`(2026-11-02). 디스코드 커뮤니티 기록을 정리한 위키.
- 파일: `models/kimi-k25.md`, `benchmarks/results.md`

**단일 배치 디코드(8× RTX PRO 6000, INT4 네이티브 체크포인트)** — results.md 표 그대로:

| 시스템 | 엔진 | KV | DCP | tok/s (0K) | 비고 |
|---|---|---|---|---|---|
| luke (switches) | SGLang | BF16 | -- | 101 | INT4, EP=8, custom AR, GDDR7 OC |
| CyySky | SGLang | BF16 | -- | 90 | 232K context |
| Festr Turin | vLLM | BF16 | 1 | 90 | FA2 |
| Festr Turin | vLLM | FP8 | 1 | 79 | Triton MLA |
| Festr Turin | vLLM | FP8 | 8 | 65 | Triton MLA, 3.6M context |
| Grimulkan (switches) | vLLM | FP8 | 8 | 62 | |
| nvidia NVFP4 ckpt | SGLang | FP8 | -- | 53–55 | ~450K context |
| Festr Turin | vLLM | FP8 | 8 (no P2P) | 44 | NCCL_P2P_DISABLE=1 |
| orangezed | vLLM | FP8 | 8 | 32–35 | Genoa 5ch DIMM, 2× xGMI |

**컨텍스트 스케일링(vLLM, INT4, FP8 KV, DCP=8)**: Festr Turin P2P 65/36/27 (0K/100K/200K), no-P2P 44/29/23, Festr Genoa ~32/~32/–, Grimulkan 62/32/21, orangezed 32–35/30–35/19–20. DCP 없이 150K에서는 6–7 tok/s.

**900 tok/s의 정확한 조건** — results.md: "Festr, 100 concurrent requests at 40K context each: 900 tok/s total with vLLM, FP8 KV, DCP=8, TP=8". 근거 스크린샷 `images/1475986922798190803_image.png`(사본: `raw/01-benchmark-claims/rtx6kpro-festr-kimi-k25-100req-40k-p2p.png`, 디스코드 스노플레이크로 계산한 시각 2026-02-24 22:45 UTC)를 직접 보니:
- "this is 100 requests with 40k tokens prefill each, DCP on"
- **P2P disabled**: 899.2 / 998.7 / 799.4 / 898.3 tokens/s, Running: 100 reqs
- **P2P enabled**: 598.5 / 600.0 / 698.8 / 598.5 / 599.9 tokens/s
- 지표는 vLLM 주기 로그의 "tokens/s"(잘린 화면이라 정확한 필드명은 안 보임. 맥락상 생성 처리량)로, bench 도구의 출력 처리량이 아니다. 출력 길이·측정 구간은 기재되지 않았다.
- 위키 본문은 "900"이 **P2P를 끈 상태**라는 걸 빠뜨렸다. P2P를 켜면(단일 배치 권장 설정) 약 600이다.
- 요청당 속도: 900/100 ≈ **9 tok/s**, P2P on이면 ≈ **6 tok/s**.
- 정합성 체크: 같은 문서의 KV 용량은 FP8+DCP8+gpu-util 0.93에서 3,621,504 토큰인데, 100×40K = 4.0M이라 0.93 설정으로는 다 들어가지 않는다(0.95 설정이었을 가능성이 있지만 명시는 없음).

**런치/버전/패치**: Docker `voipmonitor/vllm-openai:cu130-nightly-patched`, `--tensor-parallel-size 8 --decode-context-parallel-size 8 --attention-backend TRITON_MLA --kv-cache-dtype fp8 --max-num-batched-tokens 4096 --async-scheduling`. env `VLLM_TEST_FORCE_FP8_MARLIN=1`, `VLLM_MARLIN_USE_ATOMIC_ADD=1`, `VLLM_MARLIN_INPUT_DTYPE=fp8`(MoE는 **Marlin**). 체리픽 PR: vLLM #34597(SM120 Triton MLA decode FP8 KV), #34795(FP8 KV + DCP for MLA). NCCL: 단일 배치는 `NCCL_P2P_LEVEL=SYS` + 커스텀 토폴로지 XML(`NCCL_GRAPH_FILE`, NCCL이 xGMI를 16 GB/s로 오인식하는 버그 우회) 또는 `NCCL_PROTO=LL`. 고동시성은 `NCCL_P2P_DISABLE=1` + `NCCL_MIN_NCHANNELS=32/MAX=64`, `NCCL_BUFFSIZE=67108864`, `CUDA_DEVICE_MAX_CONNECTIONS=64`. BIOS/커널: IOMMU off, `uvm_disable_hmm=1`(없으면 NCCL lockup), Resizable BAR 96GB.
- 알려진 문제(문서 기재): SGLang에서 원본 체크포인트 + FP8 KV면 16 tok/s로 붕괴. flashinfer_cutlass FP4 GEMM 정확성 버그(flashinfer#2708). 150K 이상에서 tool call 깨짐·반복(SGLang, 미해결). 4 GPU는 OOM(INT4라도 8장 필요).
- **문서 품질 경고**: 같은 kimi-k25.md 개요 표에 "Total parameters ~530B"라고 적혀 있다. 공식은 1T(아래 6절). 위키 수치는 일차 측정 로그가 아니라 디스코드 대화 요약이라는 점을 감안해야 한다.

**MiniMax M2.5 P2P 주장**: results.md "P2P enabled: 5000 tok/s / P2P disabled: 10000 tok/s"가 전부다. GPU 수, 엔진, 동시성, 길이가 없다. `models/minimax-m25.md`에는 오히려 "Don't disable P2P if GPUs are on same NUMA node"라고 적혀 있다. 근거 강도가 낮다.

### 1-C. 고동시성 실측으로 가장 쓸 만한 것: 같은 위키의 Kimi K2.6 정밀 재측정

- 파일: `models/kimi-k26-prometheus-benchmark-refresh-2026-04-25.md`(rtx6kpro). K2.6은 K2.5와 같은 1T/384-expert 구조다(vLLM recipes가 같은 INT4 ~595GB로 기술).
- 조건: 이미지 `voipmonitor/vllm:kimi-k26-mtp-upstream-stack-pcie-env-test-20260424`, 8×PRO 6000(Festr), TP8, **EAGLE3 speculative 3토큰**(draft `lightseekorg/kimi-k2.5-eagle3-mla`), TRITON_MLA, FP8 KV, `max_num_seqs=128`. 측정: Prometheus `vllm:generation_tokens` 델타, 셀당 10초, **`ignore_eos=true`**, 20초 워밍업. 프롬프트는 `/tokenize`로 정확한 토큰 수를 맞췄다. **값은 집계(aggregate) 디코드 tok/s**이고 프리필은 제외(`--skip-prefill`).
- DCP=1 + MTP3(P2P 강제 모듈 미적용):

| ctx \ conc | 1 | 8 | 16 | 32 | 64 | 128 |
|---|---|---|---|---|---|---|
| 0 | 76.2* (재측정 110–123) | 527.5 | 781.0 | 1100.8 | 1749.6 | 2235.4 |
| 16k | 101.6 | 373.1 | 468.5 | 597.8 | 786.3 | 980.4 |
| 32k | 95.3 | 286.8 | 345.9 | 430.5 | 538.5 | 624.1 |
| 64k | 78.8 | 191.9 | 228.4 | 282.5 | 345.4 | 349.0 |
| 128k | 52.5 | 126.0 | 146.1 | 190.5 | 176.8 | 62.2(불안정) |

- DCP=8 + MTP3(forced P2P 모듈):

| ctx \ conc | 1 | 8 | 16 | 32 | 64 | 128 |
|---|---|---|---|---|---|---|
| 0 | 98.6 | 358.9 | 553.9 | 645.3 | 959.9 | 1317.2 |
| 16k | 91.9 | 316.5 | 473.9 | 554.2 | 832.3 | 1115.9 |
| 32k | 86.7 | 278.7 | 399.5 | 499.8 | 742.0 | 911.8 |
| 64k | 79.7 | 236.9 | 314.0 | 401.3 | 515.5 | 664.2 |
| 128k | 68.1 | 173.2 | 224.1 | 303.9 | 369.9 | 26.2*(용량 초과) |

  - 요청당으로 환산하면: 32K 컨텍스트 C64는 DCP8 742/64 ≈ **11.6 tok/s**, DCP1 538/64 ≈ **8.4**. 0K C128은 DCP1 ≈ 17.5, DCP8 ≈ 10.3. 64K C64는 DCP8 ≈ 8.1.
  - DCP별 KV: DCP4 1,115,136 토큰, DCP8 1,753,088 토큰(262,144 max_model_len 기준 동시 6.69배).
  - 프리필(정확 측정): 8K 7,283–7,646 tok/s, 32K 6,604–6,803, 128K 4,643–4,766.
  - 주의: speculative decoding 수치라서 수락률이 프롬프트 내용에 따라 달라진다. ignore_eos라 실제 에이전트 트래픽과도 다르다. 커스텀 allreduce를 forced-P2P 없이 켜면 0/C16이 716.8 → 140.7로 붕괴한다(같은 문서 표).

### 1-D. 그 외 커뮤니티 데이터 (최대 3개)

1. **r/LocalLLaMA "Running Kimi K2.5? - Tell us your Build…"** (u/bigh-aus, 2026-02). Reddit 직접 접근이 차단돼 **미러** https://reddit.sentinel-team.org/posts/1rdv3v0/snapshots/2026-02-25T19%3A22%3A50.330313Z 로만 읽었다. u/ufrat333: 8×RTX PRO 6000, **300W 제한**, SGLang. BS=1에서 ~1450 PP / 70 TG, **BS=16에서 1600 PP / 462 TG aggregate**(요청당 ≈29 tok/s). 양자화·길이·버전은 미기재. 같은 사람이 EPYC 9655P 12×DDR5-6000 CPU-only로 ~20 TG@BS=1.
2. **Helix "SGLang vs DwarfStar vs vLLM+DSpark: Running DeepSeek 4 on the RTX Pro 6000"** (2026-08-14) https://helix.ml/blog/running-ds4-on-rtx-pro-6000 — 1T급은 아니지만(DeepSeek-V4-Flash-0731 FP8 ~156GB) 실제 코딩 에이전트 운영 데이터라 참고 가치가 있다. 8×PRO 6000 Server Edition을 TP4×2 인스턴스로 운영. vLLM+DSpark: 단일 ~204, C8(인스턴스 1개) 603, **C32(2개) 946.6 aggregate**. SGLang 1×TP4: C16 349.1(요청당 21.8), C32 236.9(7.4). CUDA graph를 bs32까지만 캡처한 상태에서 EAGLE 검증 배치가 2배가 되면 C32에서 78 tok/s로 붕괴했다가 `max-running-requests 16`으로 복구.
3. 위 1-B/1-C의 rtx6kpro 위키 자체가 가장 큰 모음이다. Level1Techs에서는 8×PRO 6000 Kimi 동시성 수치를 찾지 못했다.

---

## 2. MLX TB5 RDMA (Kimi K2 Thinking)

- URL: https://github.com/ml-explore/mlx/discussions/2990 (u/guruswami-ai, 2026-01-12, GraphQL로 본문·댓글 전부 읽음)
- 하드웨어: M3 Ultra Mac Studio 512GB × **5노드**, TB5 풀메시(케이블 10개), macOS 26.2 RDMA/JACCL, Exo 미사용(순수 mlx.distributed).
- 모델: Kimi-K2-Thinking, MLX Q4.
- 표(원문): PP5 14.45 TPS / 로드 5.2s / 피크 102.5GB; **PP4 14.49 / 22.3s / 145.9GB**; **TP4 14.82 / 99.9s / 185.7GB**; TP2 13.15 / 92.6s / 345.0GB; TP5 실패(12288÷5).
- 조건: "batch size = 1 and a fixed context length"(컨텍스트 길이는 미기재). 단일 스트림 수치라 동시성 서빙 근거로는 쓸 수 없다.
- 후속 댓글: PP는 ~1,472–1,523 토큰 이상에서 Metal GPU timeout. TP4 4,117 컨텍스트/50 출력은 **2.45 TPS**(프리필 포함 wall-clock). AppleThunderboltRDMA 드라이버(v0.0.1) 커널 패닉 21건.
- 판정: 수치는 VERIFIED. EXO 측 "28 tok/s" 주장은 검색 스니펫으로만 봤고 원문은 열지 않았다.

## 3. CPU 전문가 오프로드

- **3a**: ktransformers `doc/en/Kimi-K2.md`(클론 커밋 `c9873312`, 2026-10-28): "On a single-socket CPU with one consumer-grade GPU, running the Q4_K_M model yields roughly 10 TPS and requires about 600 GB of DRAM. With a dual-socket CPU … NUMA optimizations … about 14 TPS." GPU가 4090이라는 명시는 없다. 주장된 Reddit 원문(4090+EPYC 15 tok/s)은 찾지 못했다.
  - 참고 실측: ktransformers issue #1816 (https://github.com/kvcache-ai/ktransformers/issues/1816) u/KebobZ: **Kimi K2.5**, 2× Xeon 8480+ + RTX PRO 6000 Max-Q 1장, SGLang+kt-kernel RAWINT4, `--kt-num-gpu-experts 24`. tg512 **16.5 → 18 t/s**(cpuinfer 56→78). ik_llama.cpp는 ~13 t/s. 같은 이슈에 GPU-prefill 임계값을 넘으면 출력이 깨지는 버그 보고가 있다(`CUDA_LAUNCH_BLOCKING=1`로 회피).
- **3b**: r/LocalLLaMA "Kimi K2.5 on 4x RTX 6000 Pro Blackwell runpod Benchmarks"(u/skysthelimit187). **미러**로만 읽음: https://reddit.sentinel-team.org/posts/1qxbl7j/snapshots/2026-02-06T08%3A30%3A23.666946Z
  - SGLang + KT-Kernel, ShareGPT 100프롬프트, request rate inf. 합계 입력 33,147 / 출력 21,350 토큰(평균 ~331 in / ~214 out).
  - 출력 tok/s: 26.77(mem 0.90, gpu-experts 20) / 29.62(0.80, 64) / **37.46**(0.85, 180). Total 68.33/75.60/95.63. 평균 동시성 40.28–44.35. Mean TTFT 43.7–75.9초. TPOT 중앙값 1.08–1.74**초**.
  - 요청당으로 보면 1 tok/s 미만이다. CPU 오프로드는 동시성 서빙이 사실상 불가능하다는 근거.

## 4. Luminal 8×H200

- URL: https://www.luminal.com/report/moonshotai-kimi-k2-5-8xh200 (요약 페이지 https://www.luminal.com/report 에는 "Peak Decode Speed 115.1 tok/s"만 있음)
- "Max system throughput: **1682 tok/s** (Chatbot at 32 users)". Chatbot = 1,024 in / 256 out. Peak 테스트는 정확히 N개 동시 요청에 큐 없음(N=1…32).
- 32동시 per-user decode 18.2–52.6 tok/s(Tool Calling Agentic 32,768 in이 18.2). 1,682/32 ≈ 52.6이라 Chatbot 시나리오와 맞는다. 32동시 ITL 최악 54.9 ms, TTFT 최악 6.25초(32K 입력).
- 큐 테스트: TTFT ≤3초 기준 최대 큐 깊이는 Chatbot 154, RAG 127, **Agentic(16K in) 11, Tool Calling(32K in) 3**.
- **엔진·양자화·날짜·방법론 미공개.** 집계 차트 수치는 이미지라 텍스트로 확인하지 못했다.

## 5. vLLM wide-EP 블로그

- URL: https://vllm.ai/blog/2025-12-17-large-scale-serving (원문 마크다운은 https://github.com/vllm-project/vllm-project.github.io/pull/145 에서 읽음, 2025-12-18 머지)
- 본문: "community benchmarks on a Coreweave H200 cluster connected using Infiniband with ConnectX-7 NICs now show a sustained throughput of 2.2k tokens/s per H200 GPU in production-like, multi-node deployments." 이전 ~1.5k에서 개선(silu-mul-quant fusion, Cutlass QKV, DBO).
- 차트(사본 `raw/01-benchmark-claims/vllm-blog-2025-12-17-decode_throughput.png`):
  - **Decode Throughput — "2000 ISL, 2000 OSL (avg), 256 Concurrent Requests / EP Rank"**: EP32 ≈ 2,180, EP72 ≈ 2,070, EP96 ≈ 1,970 output tok/s/GPU(막대 판독).
  - Prefill Throughput — "2000 ISL, 1 OSL, Inf request rate": EP8 ≈ 6,500, EP16 ≈ 7,000, EP32 ≈ 5,100 prompt tok/s/GPU.
- 구성 요소: P/D 분리(llm-d / Dynamo / Ray Serve), DeepEP(high-throughput/low-latency), DBO(`--enable-dbo`), EPLB(`--enable-eplb`), DeepGEMM 기본, FULL_AND_PIECEWISE CUDA graph, async scheduling.
- 모델명은 본문에 "DeepSeek"(제목)·"DeepSeek-R1" 수준으로만 나온다. 현재 llm-d `guides/wide-ep/README.md` 기본값은 DeepSeek-R1-0528, 32×H200(prefill DP16 + decode DP16, 각 2노드), DeepEP + NIXL. 다만 이는 2026-11 시점 가이드라 2025-12 벤치 구성과 같다고 확인되지는 않는다.
- **요청당 속도**: 256 동시/랭크에서 ~2,200 tok/s/GPU면 요청당 ≈ **8.6 tok/s**. 처리량 최대화 지점이지 인터랙티브 지점이 아니다.
- **GB200 수치: 블로그에 없음.** 로드맵 항목 "GB200 Optimizations for large scale serving"뿐이다.
- llm-d v0.3 블로그(https://llm-d.ai/blog/llm-d-v0.3-expanded-hardware-faster-perf-and-igw-ga)도 "2.2k tokens/s per H200 GPU" 한 문장뿐이고 구성 세부는 없다.

## 6. 모델 사실·체크포인트 크기

- Kimi K2.5 모델카드(https://huggingface.co/moonshotai/Kimi-K2.5): Total 1T, Activated 32B, 61층(dense 1), Attention hidden 7168, MoE hidden 2048/expert, heads 64, **experts 384, selected 8, shared 1**, vocab 160K, **context 256K**, MLA.
- config.json(K2.5 text_config): `hidden_size 7168`, `num_hidden_layers 61`, `first_k_dense_replace 1` → **MoE 60층**, `max_position_embeddings 262144`, 양자화 compressed-tensors INT4 group 32 symmetric(attention·shared expert는 ignore → BF16), `num_nextn_predict_layers 0`(MTP 없음).
- DeepSeek-R1 config.json: hidden 7168, 61층, `first_k_dense_replace 3` → **MoE 58층**, 256 routed + 1 shared, 8 active, heads 128, `max_position_embeddings 163840`, FP8 e4m3 block 128×128, MTP 1층.
- HF API(`?blobs=true`)로 계산한 저장 크기(10진 GB):

| 저장소 | 크기 | 파라미터(HF 메타) |
|---|---|---|
| deepseek-ai/DeepSeek-R1 (FP8) | 688.6 GB (641.3 GiB), 163 shards | 684.5B |
| deepseek-ai/DeepSeek-R1-0528 | 688.6 GB | 684.5B |
| nvidia/DeepSeek-R1-0528-NVFP4-v2 | 413.3 GB | 393.6B(패킹 기준) |
| nvidia/DeepSeek-R1-NVFP4 | 423.7 GB | – |
| moonshotai/Kimi-K2.5 (INT4) | 595.2 GB (554.3 GiB), 64 shards | 1,026.9B |
| nvidia/Kimi-K2.5-NVFP4 | 590.9 GB | – |
| moonshotai/Kimi-K2-Thinking | 594.3 GB | 1,026.4B |
| nvidia/Kimi-K2-Thinking-NVFP4 | 594.3 GB | – |
| moonshotai/Kimi-K3 | 1,561.0 GB | 2,779.9B |

  magik6k는 K2.5 다운로드를 "~557GB"로 적었는데 GiB 단위로 보면 554와 대략 맞는다.
- vLLM recipes(https://github.com/vllm-project/recipes, 커밋 `9894c645`, 2026-11-02):
  - `models/deepseek-ai/DeepSeek-R1.yaml`: fp8 `vram_minimum_gb: 805`, nvfp4(`nvidia/DeepSeek-R1-0528-NVFP4-v2`) `vram_minimum_gb: 403`, RedHat NVFP4+FP8-block 444. 하드웨어 문구 "FP8: 8x H200", "NVFP4: 4x B200".
  - `models/moonshotai/Kimi-K2.5.yaml`: default INT4 `vram_minimum_gb: 714`, 설명 "Packed INT4 via compressed-tensors (~595 GB on disk); fits 8×H200". nvfp4 `vram_minimum_gb: 600`. AMD MXFP4 669(디스크 ~557GB).
  - → ChatGPT는 **VRAM 하한을 체크포인트 크기로 오독**했다. 사이징에서는 디스크 크기(가중치 상주량)와 VRAM 하한(가중치+KV+워크스페이스 최소)을 구분해야 한다. 8×96GB = 768GB에 K2.5 INT4(VRAM 하한 714)를 올리면 KV 여유가 매우 작다는 점은 magik6k(SGLang KV 4,578토큰)와 rtx6kpro(vLLM FP8 KV DCP1 ~449K, DCP8 ~3.6M)가 모두 보여준다. KV 차이는 엔진·KV dtype·DCP 설정 차이에서 나온다.

## 7. Kimi K3

- 모델카드 https://huggingface.co/moonshotai/Kimi-K3 (사본 `raw/01-benchmark-claims/hf-moonshotai-Kimi-K3-README.md`): "2.8T-parameter model built on Kimi Delta Attention (KDA) and Attention Residuals (AttnRes) … 1-million-token context window". "activates 16 out of 896 experts". 표: Total **2.8T**, Activated **104B**, 93층(dense 1), **69 KDA + 24 Gated MLA**, attention hidden 7168, heads 96, Latent MoE dim 3584, expert hidden 3072, **experts 896 / selected 16 / shared 2**, vocab 160K, context **1,048,576**, vision MoonViT-V2 401M, **MXFP4 weights / MXFP8 activations (QAT)**. 기술 보고서 링크 https://github.com/MoonshotAI/Kimi-K3/blob/main/k3_tech_report.pdf (PDF는 열지 않음).
- HF 저장 1,561GB → 8×PRO 6000(768GB)에는 공식 MXFP4가 들어가지 않는다. rtx6kpro `models/kimi-k3/production-runtime.md` 기준 공식 MXFP4는 **16×PRO 6000, TP16/DCP16**으로 구동하며, 단일 시퀀스·256토큰 프롬프트에서 target-only **55.8**, Inferact DSpark 122.7, modal DFlash **155.1** tok/s("one active sequence and must not be read as a concurrency result"). 9-GPU는 2bpw급 QSRT-K2 커뮤니티 양자화(`lukealonso/Kimi-K3-QSRT-K2`)로만 가능하다.
- Modal 블로그 https://modal.com/blog/kimi-k3-by-moonshot-now-available-on-modal (2026-07-27): "Modal runs it at 460 tokens per second, on release day", "360% faster interactivity (from 100 to 460 tokens per second)", "88% higher throughput (from 800k to 1.5 million TPM per GPU)", "On agentic workloads". **서빙 GPU 종류·수·병렬화·동시성·길이·TPM 정의(입력 포함 여부)가 모두 미기재.** 명시된 하드웨어는 드래프터 학습용 "32 B300 nodes (28 running K3 at TP8 … 4 training)"뿐이다.
- 보조: modal-labs/Kimi-K3-DFlash 모델카드(https://huggingface.co/modal-labs/Kimi-K3-DFlash): SGLang, **8×B300, TP8, bf16**, greedy, max out 4096. 동시성 1에서 최대 877(GSM8K)/862(MATH500) tok/s(block 16, 실험 백엔드). 평균 accept length는 block 8 기준 3.46(LongBench-v2) ~ 6.01(HumanEval). 블로그의 460과 같은 설정이라는 확인은 없다.

## 8. GPU 스펙

| 항목 | PRO 6000 Server Ed. | PRO 6000 Workstation | PRO 6000 Max-Q WS | RTX 4090 |
|---|---|---|---|---|
| 메모리 | 96GB GDDR7 ECC, 512-bit | 96GB GDDR7 ECC | 96GB GDDR7 ECC, 512-bit | 24GB GDDR6X, 384-bit |
| 대역폭 | **1,597 GB/s** | **1,792 GB/s** | **1,792 GB/s** | **1,008 GB/s**(Ada 백서) |
| 전력 | Up to 600W (configurable), Lenovo 450W 캡 SKU 있음 | 600W | **300W** | 450W TGP |
| 인터페이스 | PCIe 5.0 x16 | PCIe Gen 5 | PCIe 5.0 x16 | PCIe Gen 4 |
| FP4 | "4 PFLOPS"(서버 페이지엔 희소성 각주 없음) | 4,000 AI TOPS "Theoretical FP4 TOPS using sparsity" | 3,511 AI TOPS "Effective FP4 TOPS with sparsity" | 1,321 AI TOPS |
| FP32 | 120 TFLOPS | 125 TFLOPS | 110 TFLOPS | – |
| 냉각 | Passive, dual-slot FHFL (액랭 single-slot 변형) | Double flow-through | 블로워 | – |

출처: https://www.nvidia.com/en-us/data-center/rtx-pro-6000-blackwell-server-edition/ , Lenovo https://lenovopress.lenovo.com/lp2263.pdf (FP8 2 PFLOPS, FP4 4 PFLOPS "peak", 600W/450W 캡), https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/ , Max-Q 데이터시트 PDF https://www.nvidia.com/content/dam/en-zz/Solutions/products/workstations/professional-desktop-gpus/rtx-pro-6000-max-q/workstation-datasheet-blackwell-rtx-pro-6000-max-q-nvidia-us-5349650-web.pdf , https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/ , Ada 백서 https://images.nvidia.com/aem-dam/Solutions/geforce/ada/nvidia-ada-gpu-architecture.pdf .
- 서버판 대역폭은 워크스테이션판보다 약 11% 낮다(1,597 vs 1,792). 디코드 메모리 바운드 구간에서는 이 차이가 그대로 반영될 수 있다.
- rtx6kpro 위키: GDDR7 메모리 오버클럭은 Max-Q에서만 되고 Server Edition은 `NVMLError_Unknown`. 300W vs 500W는 단일 유저에서 ~4%, 64동시에서 최대 ~30% 차이(MiniMax 기준). MaxQ vs WS는 프리필 ~20% 차이, 디코드는 비슷.

---

## 사이징 관점 핵심 정리

1. **8×PRO 6000으로 1T MoE(K2.5/K2.6)를 고동시성 서빙한 실측은 "집계 600–2,200 tok/s, 요청당 6–17 tok/s"대다.** 100동시×40K에서 P2P off 900(요청당 9), P2P on 600(요청당 6). K2.6 + EAGLE3로 32K/C64 540–742(요청당 8–12), 0K/C128 1,317–2,235(요청당 10–17). 이 중 어떤 수치도 실제 에이전트 트래픽(EOS 있음, 툴콜, 프리필 혼재)으로 측정한 것은 아니다.
2. **유명 수치 985 / 5,816은 total(입력 포함) 처리량이고, 짧은 256/100 요청에 CUDA graph까지 끈 SGLang 측정이다.** 출력 기준으로는 281 / 1,650이다. 985 쪽은 KV 4,578토큰이라 실제로 ~12요청만 돌았다. 사이징 근거에서 제외해야 한다.
3. **단일 스트림 65–101 tok/s는 설정 의존성이 크다.** P2P/NCCL 토폴로지 XML, CPU 세대(Turin vs Genoa: 65 vs 32), PCIe 스위치 유무, BF16 vs FP8 KV, DCP 여부에 따라 2–3배 차이가 난다. 고동시성 최적 설정(P2P off)과 저지연 최적 설정(P2P on)이 서로 반대라서 한 클러스터가 두 목표를 동시에 최적화하기 어렵다.
4. **비교 기준점**: 8×H200(Luminal)은 32동시에서 per-user 52.6(1K 입력)~18.2(32K 입력) tok/s, 집계 1,682. 대형 H200 wide-EP(P/D 분리, 32–96 GPU)는 GPU당 ~2.2K지만 요청당 ~8.6 tok/s(256동시/랭크). 즉 "GPU당 처리량" 헤드라인은 대부분 요청당 한 자릿수 tok/s 운영점에서 나온 값이다.
5. **CPU 오프로드는 동시성 서빙 대안이 아니다**(4×PRO 6000 + KT: 100요청에 출력 27–37 tok/s, TPOT ~1–1.7초). **Kimi K3는 8×PRO 6000에 공식 가중치가 들어가지 않는다**(1,561GB, 16장 필요, 단일 시퀀스 56–155 tok/s). Modal의 460 tok/s는 하드웨어 조건이 공개되지 않아 사이징 근거로 쓸 수 없다.

## 열지 못했거나 미러로만 본 페이지

- reddit.com 원문은 WebFetch와 curl 모두 차단됐다. 1h(462 tok/s)와 3b(27–37 tok/s)는 reddit.sentinel-team.org 스냅샷 미러로만 확인했다.
- 3a의 "RTX 4090 + EPYC ~15 tok/s" Reddit 원문은 찾지 못했다(ktransformers 공식 문서의 10/14 TPS로 대체).
- Kimi K3 기술 보고서 PDF(k3_tech_report.pdf)는 열지 않았다(모델카드로 충분).
- NVIDIA Server Edition 공식 데이터시트 PDF(resources.nvidia.com)는 열지 않았다. 제품 페이지와 Lenovo 스펙 PDF로 대체했으며, 서버판 FP4 4 PFLOPS의 희소성 여부는 공식 각주로 확인하지 못했다.
- Luminal 페이지의 시나리오별 집계 차트 값(이미지)과 엔진/양자화는 확인 불가.
- EXO Labs의 "28 tok/s" X 게시물은 열지 않았다.
