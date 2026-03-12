export default function ServingArchitecture() {
  return (
    <section id="serving-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">서빙 아키텍처 & 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">모델 실행 최적화</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`CUDA 커널 최적화:

1. Attention 백엔드 (자동 선택):
   FlashAttention 3/4: Hopper/Blackwell GPU 최적화
   FlashInfer:  Prefill + Decode 통합 커널
   FlashMLA:    DeepSeek MLA 아키텍처 전용
   Triton:      커스텀 커널 (PyTorch 통합)
   → Prefill: FlashAttention, Decode: FlashInfer 조합이 일반적

2. PagedAttention 커널:
   비연속 물리 블록에서 KV 캐시를 효율적으로 읽기
   → Decode 단계에서 주로 사용
   → Block Table을 통한 간접 참조

3. CUDA Graphs (V1 3가지 모드):
   PIECEWISE: 그래프를 조각별로 캡처 → 유연성 최고
   FULL:      전체 forward를 단일 그래프로 캡처
   FULL_DECODE_ONLY: Decode만 그래프화 (권장)
   → CPU 오버헤드 거의 제거 (커널 런치 비용 절감)
   → Decode 지연 ~30% 감소

4. 양자화 지원:
   ┌──────────┬──────────┬──────────────────────┐
   │ 방식     │ 비트 수   │ 특징                  │
   ├──────────┼──────────┼──────────────────────┤
   │ FP8      │ 8-bit    │ HW 지원 (Hopper+)    │
   │ INT8     │ 8-bit    │ W8A8 smoothquant     │
   │ GPTQ     │ 4-bit    │ 가중치만 양자화        │
   │ AWQ      │ 4-bit    │ Activation-aware     │
   │ NVFP4    │ 4-bit    │ Blackwell HW 지원    │
   │ GGUF     │ 2-8bit   │ llama.cpp 호환       │
   └──────────┴──────────┴──────────────────────┘
   → 메모리 절약 + 처리량 향상`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">분산 추론</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Tensor Parallelism (TP):
  하나의 레이어를 여러 GPU에 분할
  → Attention head를 GPU 간 나눔
  → 매 레이어마다 All-Reduce 통신
  → 지연 시간 ↓ (단일 요청 빠르게)

  GPU 0: [Head 0-15] ←All-Reduce→ GPU 1: [Head 16-31]

Pipeline Parallelism (PP):
  레이어 그룹을 GPU에 순차 배치
  → 마이크로배치로 파이프라인 채움
  → 처리량 ↑ (여러 요청 동시)

  GPU 0: [Layer 0-15] → GPU 1: [Layer 16-31]

Expert Parallelism (EP, MoE 모델):
  Mixture-of-Experts의 expert를 GPU에 분배
  → 활성 expert만 계산 (예: 8/64 experts)
  → All-to-All 통신으로 토큰 라우팅

Data Parallelism (DP):
  동일 모델을 여러 인스턴스로 복제
  → 요청을 인스턴스에 분배
  → 처리량 선형 확장`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Speculative Decoding</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Speculative Decoding (추측 디코딩):

일반 디코딩:
  [토큰1] → [토큰2] → [토큰3] → ...
  매번 대형 모델 실행 (느림)

추측 디코딩:
  1. Draft 모델(소형)이 K개 토큰 빠르게 생성
     draft: [토큰1, 토큰2, 토큰3, 토큰4, 토큰5]

  2. Target 모델(대형)이 한 번에 검증
     verify: [✓, ✓, ✓, ✗, -]
     → 3개 수락, 4번째부터 재생성

  3. 수락된 토큰은 확정, 나머지는 재시도

효과:
  Draft 모델 수락률 ~70-80% 시
  → 유효 토큰 생성 속도 2-3x 향상
  → Target 모델의 출력 분포는 정확히 보존

vLLM 지원 방식:
  EAGLE 1/3:   Feature-level draft (최대 2.5x 가속)
  MTP:         Multi-Token Prediction 헤드 활용
  별도 Draft:  Llama-70B + Llama-7B 조합
  n-gram:      입력 패턴 기반 추측 (모델 불필요)
  PARD:        병렬 디코딩 (draft 없이)
  → EAGLE이 가장 높은 수락률, n-gram이 가장 낮은 오버헤드`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">OpenAI 호환 API 서버</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`vLLM API 서버 (FastAPI 기반):

지원 엔드포인트:
  POST /v1/completions          # 텍스트 완성
  POST /v1/chat/completions     # 채팅 (OpenAI 호환)
  POST /v1/embeddings           # 임베딩
  GET  /v1/models               # 모델 목록

서버 시작:
  vllm serve meta-llama/Llama-3.1-8B-Instruct \\
    --tensor-parallel-size 2 \\
    --max-model-len 32768 \\
    --gpu-memory-utilization 0.9

요청 처리 흐름:
  HTTP 요청 수신
  → 토크나이징 (tokenizer)
  → Scheduler에 SequenceGroup 등록
  → Engine 루프에서 배칭 & 실행
  → 스트리밍 응답 (SSE) 또는 일괄 응답`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (V1 아키텍처)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`vllm/ (V1 멀티프로세스 구조)
├── vllm/
│   ├── v1/                  # V1 엔진 (멀티프로세스)
│   │   ├── engine/
│   │   │   ├── core.py      # EngineCore (별도 프로세스)
│   │   │   ├── async_llm.py # AsyncLLM (API 프로세스)
│   │   │   └── processor.py # 입력 전처리
│   │   ├── core/
│   │   │   ├── sched/       # V1 스케줄러
│   │   │   └── kv_cache_manager.py  # KV 캐시 관리
│   │   └── worker/
│   │       ├── gpu_worker.py    # GPU Worker 프로세스
│   │       └── gpu_model_runner.py  # CUDA Graph 통합
│   ├── attention/           # Attention 백엔드
│   │   └── backends/        # Flash 3/4, FlashInfer, MLA, Triton
│   ├── model_executor/      # 모델 실행
│   │   ├── models/          # 200+ 모델 지원
│   │   └── layers/          # 양자화, 병렬화 레이어
│   ├── distributed/         # TP/PP/EP/DP (NCCL)
│   ├── spec_decode/         # EAGLE, MTP, n-gram, PARD
│   ├── lora/                # Multi-LoRA 지원
│   └── entrypoints/         # API 서버
│       ├── openai/          # OpenAI 호환 API
│       └── llm.py           # 오프라인 배치 추론
├── csrc/                    # CUDA/C++ 커널
│   ├── attention/           # PagedAttention 커널
│   ├── quantization/        # FP8/INT8/GPTQ/AWQ 커널
│   └── ops.cu               # 기타 CUDA 연산
└── benchmarks/              # 성능 벤치마크

성능 요약:
  HuggingFace 대비: 최대 24x 처리량 향상
  V1 vs V0:         ~1.7x 처리량 향상
  KV 메모리 낭비:    4% 미만
  CUDA Graphs:      Decode 지연 ~30% 감소
  EAGLE 추측 디코딩: 최대 2.5x 가속`}</code>
        </pre>
      </div>
    </section>
  );
}
