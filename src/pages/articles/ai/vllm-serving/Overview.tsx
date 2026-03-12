export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">vLLM 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          vLLM(UC Berkeley Sky Lab)은 LLM 추론 및 서빙을 위한
          <strong> 고성능 엔진</strong>입니다.
          핵심 혁신인 <strong>PagedAttention</strong>으로 KV 캐시를 OS의
          가상 메모리처럼 관리하여, 기존 서빙 대비 처리량을 2~4배 향상시켰습니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">LLM 서빙의 핵심 병목</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`LLM 추론의 두 단계:

1. Prefill (프롬프트 처리):
   입력 토큰 전체를 한 번에 처리 → KV 캐시 생성
   → GPU 연산 바운드 (행렬 곱셈)

2. Decode (토큰 생성):
   토큰을 하나씩 자기회귀적으로 생성
   → GPU 메모리 바운드 (KV 캐시 읽기)

문제: KV 캐시가 GPU 메모리의 대부분을 차지
  예) Llama-13B, 시퀀스 2048:
      KV 캐시 크기 ≈ 2 × 40 × 2 × 2048 × 5120 × 2 bytes
                    ≈ ~1.6 GB per request
      → 동시 처리 요청 수가 메모리에 의해 제한

기존 서빙 (HuggingFace, FasterTransformer):
  요청마다 최대 시퀀스 길이만큼 KV 캐시 사전 할당
  → 내부 단편화: 실제 사용량 << 할당량
  → 외부 단편화: 요청 간 빈 공간 발생
  → GPU 메모리 활용률 ~50-60%

vLLM의 해결:
  PagedAttention으로 KV 캐시를 블록 단위로 동적 할당
  → 메모리 낭비: 20-38% → 4% 미만으로 감소
  → 동일 GPU로 2-4x 더 많은 요청 동시 처리
  → HuggingFace 대비 최대 24x 처리량 향상`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">V1 멀티프로세스 아키텍처</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`vLLM V1 아키텍처 (멀티프로세스):

┌──────────────────────────────────────────────────┐
│           API Server Process (FastAPI)            │
│  /v1/chat/completions, /v1/completions 등         │
│  → Tokenizer + Detokenizer + 입력 전처리           │
└──────────────┬───────────────────────────────────┘
               │ ZeroMQ IPC (비동기 메시지 패싱)
               ▼
┌──────────────────────────────────────────────────┐
│           EngineCore Process                      │
│  ┌─────────────┬──────────────────────────┐      │
│  │  Scheduler   │  KV Cache Manager       │      │
│  │  - Prefill   │  - 블록 할당/해제         │      │
│  │  - Decode    │  - Prefix Caching (APC)  │      │
│  │  - Preempt   │  - Hierarchical Cache    │      │
│  │  - 청크 관리  │    GPU → CPU → Connector │      │
│  └─────────────┴──────────────────────────┘      │
└──────────────┬───────────────────────────────────┘
               │ multiprocessing / CUDA IPC
               ▼
┌──────────────────────────────────────────────────┐
│           GPU Worker Process(es)                  │
│  ┌──────────┬────────────┬─────────────────┐     │
│  │ Model    │ Attention   │ CUDA Graphs     │     │
│  │ Runner   │ Backend     │ PIECEWISE /     │     │
│  │          │ (Flash 3/4, │ FULL / DECODE   │     │
│  │          │  FlashInfer,│ → CPU 오버헤드   │     │
│  │          │  FlashMLA,  │   거의 제거      │     │
│  │          │  Triton)    │                 │     │
│  └──────────┴────────────┴─────────────────┘     │
│  단일 GPU / TP / PP / EP / DP                     │
└──────────────────────────────────────────────────┘

V0 → V1 개선:
  - 단일 프로세스 → 멀티프로세스 (ZeroMQ IPC)
  - API 서버와 엔진 분리 → 독립적 스케일링
  - V1이 V0 대비 ~1.7x 처리량 향상
  - 프로세스 간 장애 격리 (한 워커 충돌해도 서버 유지)`}</code>
        </pre>
      </div>
    </section>
  );
}
