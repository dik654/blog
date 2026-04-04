import CodePanel from '@/components/ui/code-panel';
import SetupDetailViz from './viz/SetupDetailViz';
import { SYNTHESIS_CODE, KEY_CALC_CODE, MPC_CODE } from './SetupDetailData';

export default function SetupDetail() {
  return (
    <section id="setup-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Setup 상세</h2>
      <div className="not-prose mb-8"><SetupDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Setup 과정은 <strong>Toxic Waste 생성 → 회로 합성 → QAP 변환 → 키 계산 → MPC</strong>의
          5단계로 구성됩니다. 각 단계의 구현 세부사항을 살펴봅니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">회로 합성과 QAP 변환</h3>
        <CodePanel
          title="SynthesisMode::Setup → R1CS → QAP"
          code={SYNTHESIS_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'Setup 모드: 값 없이 구조만 수집' },
            { lines: [5, 7], color: 'emerald', note: 'Lagrange 보간으로 다항식 생성' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">키 구성 요소 계산</h3>
        <CodePanel
          title="Query 벡터 + 배치 MSM"
          code={KEY_CALC_CODE}
          annotations={[
            { lines: [1, 6], color: 'amber', note: '5종 query 벡터 (SRS 포인트)' },
            { lines: [8, 9], color: 'violet', note: 'Pippenger 윈도우 최적화' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">MPC 세레모니</h3>
        <CodePanel
          title="Powers of Tau — 2단계 MPC"
          code={MPC_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: 'Phase 1: 범용 (여러 회로 공유)' },
            { lines: [5, 6], color: 'emerald', note: 'Phase 2: 회로별 (α,β,γ,δ)' },
          ]}
        />
      </div>
    </section>
  );
}
