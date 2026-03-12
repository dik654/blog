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
  → 메모리 활용률 ~95%+
  → 동일 GPU로 2-4x 더 많은 요청 동시 처리`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">전체 아키텍처</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`vLLM 아키텍처:

┌─────────────────────────────────────────────┐
│          OpenAI-Compatible API Server        │
│  (FastAPI, /v1/chat/completions 등)          │
├─────────────────────────────────────────────┤
│              LLM Engine                      │
│  ┌────────────────┬────────────────────────┐│
│  │   Scheduler    │   Block Manager        ││
│  │  (요청 스케줄링) │  (KV 캐시 블록 관리)    ││
│  │  - Prefill 큐  │  - 물리 블록 할당       ││
│  │  - Decode 큐   │  - Block Table 관리     ││
│  │  - Preemption  │  - Copy-on-Write       ││
│  └────────────────┴────────────────────────┘│
├─────────────────────────────────────────────┤
│              Model Runner                    │
│  ┌─────────┬──────────┬───────────────────┐│
│  │ Model   │ Attention│ CUDA Kernels      ││
│  │ Weights │ Backend  │ (FlashAttention,  ││
│  │         │          │  FlashInfer,      ││
│  │         │          │  PagedAttention)  ││
│  └─────────┴──────────┴───────────────────┘│
├─────────────────────────────────────────────┤
│         GPU Worker(s)                        │
│  단일 GPU 또는 Tensor/Pipeline Parallelism    │
└─────────────────────────────────────────────┘`}</code>
        </pre>
      </div>
    </section>
  );
}
