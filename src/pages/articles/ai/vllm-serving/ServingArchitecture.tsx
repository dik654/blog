import { CitationBlock } from '../../../../components/ui/citation';

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

2. CUDA Graphs (V1 3가지 모드):
   PIECEWISE: 그래프를 조각별로 캡처 → 유연성 최고
   FULL:      전체 forward를 단일 그래프로 캡처
   FULL_DECODE_ONLY: Decode만 그래프화 (권장)
   → CPU 오버헤드 거의 제거 (커널 런치 비용 절감)
   → Decode 지연 ~30% 감소`}</code>
        </pre>

        <CitationBlock source="Dao et al., NeurIPS 2022 — FlashAttention" citeKey={7} type="paper"
          href="https://arxiv.org/abs/2205.14135">
          <p className="italic text-muted-foreground">
            "We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to
            reduce the number of memory reads/writes between GPU high bandwidth memory (HBM) and
            GPU on-chip SRAM... FlashAttention trains GPT-2 2.4x faster than a highly optimized
            implementation and requires 20x less memory than vanilla attention."
          </p>
          <p className="mt-2 text-xs">
            FlashAttention은 Attention 연산을 타일링하여 HBM↔SRAM 간 데이터 이동을 최소화합니다.
            O(N²) 메모리 → O(N)으로 감소. vLLM에서는 FlashAttention을 Prefill 단계의 기본 백엔드로 사용합니다.
          </p>
        </CitationBlock>

        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm mt-4">
          <code>{`양자화 지원:
   ┌──────────┬──────────┬──────────────────────┐
   │ 방식     │ 비트 수   │ 특징                  │
   ├──────────┼──────────┼──────────────────────┤
   │ FP8      │ 8-bit    │ HW 지원 (Hopper+)    │
   │ INT8     │ 8-bit    │ W8A8 smoothquant     │
   │ GPTQ     │ 4-bit    │ 가중치만 양자화        │
   │ AWQ      │ 4-bit    │ Activation-aware     │
   │ NVFP4    │ 4-bit    │ Blackwell HW 지원    │
   │ GGUF     │ 2-8bit   │ llama.cpp 호환       │
   └──────────┴──────────┴──────────────────────┘`}</code>
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

vLLM 지원 방식:
  EAGLE 1/3:   Feature-level draft (최대 2.5x 가속)
  MTP:         Multi-Token Prediction 헤드 활용
  별도 Draft:  Llama-70B + Llama-7B 조합
  n-gram:      입력 패턴 기반 추측 (모델 불필요)`}</code>
        </pre>

        <CitationBlock source="Li et al., ICML 2024 — EAGLE" citeKey={8} type="paper"
          href="https://arxiv.org/abs/2401.15077">
          <p className="italic text-muted-foreground">
            "EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) proposes drafting
            at the feature level rather than the token level... EAGLE achieves a speedup ratio of
            2.13x-3.06x across various tasks, significantly outperforming existing methods."
          </p>
          <p className="mt-2 text-xs">
            EAGLE는 토큰 수준이 아닌 feature 수준에서 draft하여 수락률을 높입니다.
            vLLM에서는 EAGLE 1/3 두 버전을 모두 지원합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">분산 추론</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Tensor Parallelism (TP):
  하나의 레이어를 여러 GPU에 분할
  → Attention head를 GPU 간 나눔
  → 매 레이어마다 All-Reduce 통신

Pipeline Parallelism (PP):
  레이어 그룹을 GPU에 순차 배치
  → 마이크로배치로 파이프라인 채움

Expert Parallelism (EP, MoE 모델):
  Mixture-of-Experts의 expert를 GPU에 분배
  → 활성 expert만 계산 (예: 8/64 experts)

Data Parallelism (DP):
  동일 모델을 여러 인스턴스로 복제
  → 요청을 인스턴스에 분배`}</code>
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
│   ├── spec_decode/         # EAGLE, MTP, n-gram, PARD
│   └── entrypoints/         # API 서버

성능 요약:
  HuggingFace 대비: 최대 24x 처리량 향상
  V1 vs V0:         ~1.7x 처리량 향상
  CUDA Graphs:      Decode 지연 ~30% 감소
  EAGLE 추측 디코딩: 최대 2.5x 가속`}</code>
        </pre>

        <CitationBlock source="vLLM 공식 벤치마크 — V1 성능" citeKey={9} type="paper"
          href="https://docs.vllm.ai">
          <p className="text-xs">
            V1 멀티프로세스 아키텍처는 API Server와 EngineCore를 ZeroMQ IPC로 분리하여,
            토크나이징/디토크나이징이 모델 실행을 블로킹하지 않습니다.
            이 설계로 V0 대비 ~1.7x 처리량 향상, HuggingFace 대비 최대 24x 향상입니다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
