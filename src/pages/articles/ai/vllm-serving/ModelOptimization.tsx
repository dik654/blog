import { CitationBlock } from '../../../../components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

export default function ModelOptimization() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">모델 실행 최적화</h3>
      <CodePanel title="CUDA 커널 최적화" code={`CUDA 커널 최적화:

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
   → Decode 지연 ~30% 감소`} annotations={[
        { lines: [3, 8], color: 'sky', note: 'Attention 백엔드 자동 선택' },
        { lines: [10, 15], color: 'emerald', note: 'CUDA Graphs — 지연 30% 감소' },
      ]} />

      <CitationBlock source="Dao et al., NeurIPS 2022 — FlashAttention" citeKey={7} type="paper"
        href="https://arxiv.org/abs/2205.14135">
        <p className="italic">
          "We propose FlashAttention, an IO-aware exact attention algorithm that uses tiling to
          reduce the number of memory reads/writes between GPU high bandwidth memory (HBM) and
          GPU on-chip SRAM... FlashAttention trains GPT-2 2.4x faster than a highly optimized
          implementation and requires 20x less memory than vanilla attention."
        </p>
        <p className="mt-2 text-xs">
          FlashAttention — Attention 연산 타일링으로 HBM↔SRAM 간 데이터 이동 최소화.
          O(N^2) 메모리 → O(N) 감소. vLLM에서 Prefill 단계의 기본 백엔드로 사용
        </p>
      </CitationBlock>

    </>
  );
}
