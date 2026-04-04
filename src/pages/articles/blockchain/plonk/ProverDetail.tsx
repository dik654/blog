import CodePanel from '@/components/ui/code-panel';
import ProverDetailViz from './viz/ProverDetailViz';
import { ROUND1_CODE, ROUND2_CODE, ROUND3_CODE, ROUND4_CODE, ROUND5_CODE } from './ProverDetailData';

export default function ProverDetail() {
  return (
    <section id="prover-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prover 5-Round 상세</h2>
      <div className="not-prose mb-8"><ProverDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Round 1 — 와이어 커밋먼트</h3>
        <p>witness를 Lagrange 보간 후 <strong>블라인딩 항</strong>을 추가하여 영지식성을 보장한다.</p>
        <CodePanel title="Round 1: Wire Commits" code={ROUND1_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: '블라인딩 스칼라 선택' },
            { lines: [3, 5], color: 'emerald', note: 'Zₕ(X) 블라인딩 + Lagrange 보간' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Round 2 — 순열 누적자</h3>
        <CodePanel title="Round 2: Permutation Z(X)" code={ROUND2_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'Fiat-Shamir 챌린지' },
            { lines: [3, 5], color: 'emerald', note: 'Grand product 누적' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Round 3 — 몫 다항식</h3>
        <CodePanel title="Round 3: Quotient t(X)" code={ROUND3_CODE}
          annotations={[
            { lines: [2, 3], color: 'amber', note: '제약 결합 → Zₕ 나눗셈' },
            { lines: [5, 6], color: 'violet', note: '차수 3n → 3등분' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Round 4 — 평가</h3>
        <CodePanel title="Round 4: Evaluations" code={ROUND4_CODE}
          annotations={[{ lines: [2, 5], color: 'sky', note: 'ζ에서 6개 스칼라 계산' }]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Round 5 — 오프닝 증명</h3>
        <CodePanel title="Round 5: Opening Proofs" code={ROUND5_CODE}
          annotations={[
            { lines: [2, 3], color: 'rose', note: '선형화 다항식' },
            { lines: [4, 5], color: 'emerald', note: '배치 quotient 계산' },
          ]} />
      </div>
    </section>
  );
}
