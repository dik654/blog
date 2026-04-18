import { CitationBlock } from '../../../../components/ui/citation';

export default function ModelOptimization() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">모델 실행 최적화</h3>

      <p className="text-sm font-medium text-foreground/80 mb-2">Attention 백엔드 (자동 선택)</p>
      <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-4 my-4">
        <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">FlashAttention 3/4</p>
          <p className="text-xs">Hopper/Blackwell GPU 최적화</p>
          <p className="text-xs mt-1 text-foreground/50">Prefill 기본 백엔드</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">FlashInfer</p>
          <p className="text-xs">Prefill + Decode 통합 커널</p>
          <p className="text-xs mt-1 text-foreground/50">Decode 기본 백엔드</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">FlashMLA</p>
          <p className="text-xs">DeepSeek MLA 아키텍처 전용</p>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-4">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">Triton</p>
          <p className="text-xs">커스텀 커널 (PyTorch 통합)</p>
        </div>
      </div>

      <p className="text-sm font-medium text-foreground/80 mb-2">CUDA Graphs (V1 3가지 모드)</p>
      <div className="not-prose grid gap-3 sm:grid-cols-3 my-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">PIECEWISE</p>
          <p className="text-xs">그래프를 조각별로 캡처</p>
          <p className="text-xs mt-1 text-foreground/50">유연성 최고</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">FULL</p>
          <p className="text-xs">전체 forward를 단일 그래프로 캡처</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">FULL_DECODE_ONLY</p>
          <p className="text-xs">Decode만 그래프화 (권장)</p>
          <p className="text-xs mt-1 text-foreground/50">Decode 지연 ~30% 감소</p>
        </div>
      </div>
      <p className="text-xs text-foreground/60 mb-4">CPU 오버헤드 거의 제거 — 커널 런치 비용 절감</p>

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
