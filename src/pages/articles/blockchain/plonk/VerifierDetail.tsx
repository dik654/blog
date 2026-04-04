import CodePanel from '@/components/ui/code-panel';
import VerifierDetailViz from './viz/VerifierDetailViz';
import { FIAT_SHAMIR_CODE, LINEARIZE_CODE, BATCH_VERIFY_CODE } from './VerifierDetailData';

export default function VerifierDetail() {
  return (
    <section id="verifier-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Verifier 상세</h2>
      <div className="not-prose mb-8"><VerifierDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Fiat-Shamir 재생</h3>
        <p>검증자는 증명자와 동일한 transcript를 구성하여 <strong>모든 챌린지를 재생성</strong>한다. 이것이 대화형 → 비대화형 변환의 핵심이다.</p>
        <CodePanel
          title="Fiat-Shamir 챌린지 재생"
          code={FIAT_SHAMIR_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'Round 1 transcript → β,γ' },
            { lines: [6, 8], color: 'emerald', note: 'Round 4 transcript → ν' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">선형화 커밋먼트 [F]₁</h3>
        <p>KZG의 <strong>가법 동형성</strong>을 이용하여 개별 커밋먼트로부터 combined commitment를 재구성한다.</p>
        <CodePanel
          title="선형화 커밋먼트"
          code={LINEARIZE_CODE}
          annotations={[
            { lines: [1, 4], color: 'amber', note: 'r̄ 스칼라 계산' },
            { lines: [6, 8], color: 'violet', note: '[F]₁ 재구성 — ν 결합' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">배치 KZG 검증</h3>
        <p>최종 검증은 <strong>페어링 2회</strong>로 완료된다. 증명 크기와 검증 시간 모두 회로 크기에 무관하다.</p>
        <CodePanel
          title="배치 KZG Pairing Check"
          code={BATCH_VERIFY_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: '[E]₁ 평가값 커밋 구성' },
            { lines: [6, 9], color: 'rose', note: '페어링 등식 — O(1) 검증' },
          ]}
        />
      </div>
    </section>
  );
}
