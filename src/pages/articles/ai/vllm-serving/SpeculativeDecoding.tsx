import { CitationBlock } from '../../../../components/ui/citation';

export default function SpeculativeDecoding() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">Speculative Decoding</h3>

      <div className="not-prose grid gap-4 sm:grid-cols-3 my-4">
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950 p-4">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">1. Draft — 소형 모델이 추측</p>
          <p className="text-sm">Draft 모델(소형)이 K개 토큰을 빠르게 생성</p>
          <p className="text-xs font-mono mt-2 text-foreground/70">[토큰1, 토큰2, 토큰3, 토큰4, 토큰5]</p>
          <p className="text-xs mt-1 text-foreground/50">일반 디코딩은 매번 대형 모델을 순차 실행 — 느림</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2. Verify — 대형 모델이 검증</p>
          <p className="text-sm">Target 모델(대형)이 K개 토큰을 한 번에 검증</p>
          <p className="text-xs font-mono mt-2 text-foreground/70">[✓, ✓, ✓, ✗, —]</p>
          <p className="text-xs mt-1 text-foreground/50">대형 모델 forward 1회로 K개 동시 판정</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 p-4">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">3. Accept / Reject</p>
          <p className="text-sm">일치하는 토큰 수락, 불일치 지점부터 재생성</p>
          <p className="text-xs font-mono mt-2 text-foreground/70">3개 수락 → 4번째부터 재생성</p>
          <p className="text-xs mt-1 text-foreground/50">수락률이 높을수록 처리량 증가</p>
        </div>
      </div>

      <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-4 my-4">
        <div className="rounded-lg border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-3">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">EAGLE 1/3</p>
          <p className="text-xs mt-1">Feature-level draft (최대 2.5x 가속)</p>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-3">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">MTP</p>
          <p className="text-xs mt-1">Multi-Token Prediction 헤드 활용</p>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-3">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">별도 Draft</p>
          <p className="text-xs mt-1">Llama-70B + Llama-7B 조합</p>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-950 p-3">
          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">n-gram</p>
          <p className="text-xs mt-1">입력 패턴 기반 추측 (모델 불필요)</p>
        </div>
      </div>

      <CitationBlock source="Li et al., ICML 2024 — EAGLE" citeKey={8} type="paper"
        href="https://arxiv.org/abs/2401.15077">
        <p className="italic">
          "EAGLE (Extrapolation Algorithm for Greater Language-model Efficiency) proposes drafting
          at the feature level rather than the token level... EAGLE achieves a speedup ratio of
          2.13x-3.06x across various tasks, significantly outperforming existing methods."
        </p>
        <p className="mt-2 text-xs">
          EAGLE — 토큰 수준이 아닌 feature 수준에서 draft하여 수락률 향상.
          vLLM에서 EAGLE 1/3 두 버전 모두 지원
        </p>
      </CitationBlock>
    </>
  );
}
