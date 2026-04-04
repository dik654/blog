import CodePanel from '@/components/ui/code-panel';
import ProvingDetailViz from './viz/ProvingDetailViz';
import { WITNESS_CODE, A_DETAIL_CODE, B_DETAIL_CODE, C_DETAIL_CODE } from './ProvingDetailData';

export default function ProvingDetail() {
  return (
    <section id="proving-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proving 상세</h2>
      <div className="not-prose mb-8"><ProvingDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          증명 생성의 핵심은 <strong>Witness 할당 → A,B,C 원소의 MSM 계산</strong>입니다.<br />
          각 원소의 수학적 구성과 멀티스레드 최적화를 상세히 분석합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">Witness 계산</h3>
        <CodePanel
          title="SynthesisMode::Prove — 값 할당"
          code={WITNESS_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'Prove 모드: 실제 값 할당' },
            { lines: [4, 4], color: 'emerald', note: 'witness 벡터 구조' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">A 계산 상세</h3>
        <p>
          ② A 계산 (G1 점)<br />
          A = [α]₁ + Σⱼ wⱼ · a_query[j] + r · [δ]₁<br />
          태그 MSM (O(n)) 블라인딩<br />
          MSM: Pippenger 윈도우 방식 + 멀티스레드<br />
          → rayon::scope로 각 윈도우 병렬 처리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">B 계산 상세</h3>
        <CodePanel
          title="B (G2 + G1 이중 MSM)"
          code={B_DETAIL_CODE}
          annotations={[
            { lines: [1, 3], color: 'emerald', note: 'G2/G1 두 버전 동시 계산' },
            { lines: [5, 7], color: 'violet', note: 'rayon::join 병렬화' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">C 계산 상세</h3>
        <CodePanel
          title="C = private LC + h·t + 블라인딩"
          code={C_DETAIL_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: '3개 MSM 구성 요소' },
            { lines: [6, 9], color: 'amber', note: '순서대로 실행 (의존성)' },
          ]}
        />
      </div>
    </section>
  );
}
