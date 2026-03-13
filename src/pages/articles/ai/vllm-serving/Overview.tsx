import { CitationBlock } from '../../../../components/ui/citation';

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

        <CitationBlock source="Kwon et al., SOSP 2023 — Abstract" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2309.06180">
          <p className="italic text-muted-foreground">
            "We propose PagedAttention, an attention algorithm inspired by the classical virtual memory
            and paging techniques in operating systems. On top of this, we build vLLM, an LLM serving
            system that achieves (1) near-zero waste in KV cache memory and (2) flexible sharing of
            KV cache within and across requests to further reduce memory usage."
          </p>
          <p className="mt-2 text-xs">
            PagedAttention 논문의 핵심 기여입니다. OS의 가상 메모리 기법을
            KV 캐시 관리에 적용한 최초의 연구로, SOSP 2023에 발표되었습니다.
          </p>
        </CitationBlock>

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
      → 동시 처리 요청 수가 메모리에 의해 제한`}</code>
        </pre>

        <CitationBlock source="PagedAttention 논문 §2.2 — Memory Waste" citeKey={2} type="paper">
          <p className="italic text-muted-foreground">
            "Existing systems waste 60%-80% of the KV cache memory due to fragmentation and
            over-reservation. In contrast, PagedAttention reduces the waste to under 4%."
          </p>
          <p className="mt-2 text-xs">
            기존 시스템의 사전 할당 방식은 최대 시퀀스 길이를 기준으로 메모리를 예약하므로,
            실제 사용량과의 차이가 크게 발생합니다. vLLM은 이를 블록 단위 동적 할당으로 해결했습니다.
          </p>
        </CitationBlock>

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
└──────────────────────────────────────────────────┘`}</code>
        </pre>

        <CitationBlock source="vllm/v1/engine/core.py — EngineCore" citeKey={3} type="code"
          href="https://github.com/vllm-project/vllm">
          <pre className="text-xs overflow-x-auto"><code>{`# v1/engine/core.py — 멀티프로세스 EngineCore
class EngineCore:
    """Core engine running in a separate process.
    Communicates with API server via ZeroMQ IPC."""

    def __init__(self, vllm_config, executor_class, log_stats):
        self.scheduler = Scheduler(vllm_config.scheduler_config)
        self.kv_cache_manager = KVCacheManager(...)
        self.model_executor = executor_class(vllm_config)

    def step(self) -> List[EngineCoreOutput]:
        # 1. 스케줄러가 다음 배치 결정
        scheduler_output = self.scheduler.schedule()
        # 2. GPU Worker에서 모델 실행
        model_output = self.model_executor.execute(scheduler_output)
        # 3. 결과를 API Server로 전송 (ZeroMQ)
        return self.scheduler.update(model_output)`}</code></pre>
          <p className="mt-2 text-xs text-muted-foreground">
            V1의 EngineCore는 별도 프로세스에서 실행되며, ZeroMQ IPC로 API Server와 통신합니다.
            V0에서는 단일 프로세스 내에서 asyncio로 동작했지만, V1은 멀티프로세스로 분리하여
            ~1.7x 처리량 향상을 달성했습니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
