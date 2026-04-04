import CodePanel from '@/components/ui/code-panel';
import QAPPipelineViz from './viz/QAPPipelineViz';
import { WHY_POLY_CODE, PIPELINE_CODE, LAGRANGE_CODE, SCHWARTZ_ZIPPEL_CODE, VANISHING_CODE } from './QAPData';

export default function QAP() {
  return (
    <section id="qap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QAP (Quadratic Arithmetic Program)</h2>
      <div className="not-prose mb-8"><QAPPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 다항식으로 변환하는가</h3>
        <p>R1CS의 m개 개별 등식을 검증자가 일일이 확인하면 O(m) 비용이 듭니다.
        <br />
          QAP(Quadratic Arithmetic Program)는 이를 하나의 다항식 항등식으로 압축합니다.
        <br />
          O(1) 검증을 가능하게 하며, 이것이 ZK-SNARK의 &quot;Succinct(간결한)&quot;를 실현하는 핵심입니다.</p>
        <CodePanel
          title="R1CS vs QAP 검증 비용"
          code={WHY_POLY_CODE}
          annotations={[
            { lines: [1, 2], color: 'rose', note: 'R1CS: 개별 등식 O(m)' },
            { lines: [4, 5], color: 'emerald', note: 'QAP: 단일 항등식 O(1)' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS → QAP 변환 파이프라인</h3>
        <p>R1CS 행렬의 각 열을 Lagrange 보간(Interpolation, 점들을 지나는 다항식 구성)으로 변환합니다.
        <br />
          witness 벡터로 결합하고, 소거 다항식(Vanishing Polynomial)으로 나누어떨어지는지 확인합니다.</p>
        <CodePanel
          title="R1CS → QAP 5단계"
          code={PIPELINE_CODE}
          annotations={[
            { lines: [1, 5], color: 'sky', note: '변환 5단계' },
            { lines: [7, 9], color: 'violet', note: '핵심 동치 관계' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange 보간</h3>
        <p>n개의 점을 지나는 유일한 degree &lt; n 다항식을 구합니다.
        <br />
          기저 다항식 L_i(x)는 정확히 하나의 도메인 점에서만 1이고 나머지에서 0입니다.
        <br />
          이를 Kronecker delta 성질이라 합니다.</p>
        <CodePanel
          title="Lagrange 보간법"
          code={LAGRANGE_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: '일반 공식' },
            { lines: [4, 7], color: 'emerald', note: '구체적 예시' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Schwartz-Zippel 보조정리</h3>
        <p>차수 d인 비영 다항식이 랜덤 점에서 0일 확률은 d/|F| 이하입니다.
        <br />
          BN254에서 d=1000이면 확률은 약 10^(-74)으로 사실상 0입니다.</p>
        <CodePanel
          title="Schwartz-Zippel 보조정리"
          code={SCHWARTZ_ZIPPEL_CODE}
          annotations={[
            { lines: [1, 1], color: 'amber', note: '확률 상한' },
            { lines: [3, 4], color: 'emerald', note: 'BN254에서의 구체적 확률' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">소거 다항식 (Vanishing Polynomial)</h3>
        <p>도메인의 모든 점에서 0이 되는 다항식입니다.
        <br />
          프로덕션에서는 roots of unity(단위근)를 사용하여 t(x) = x^m - 1로 극도로 희소하게 만듭니다.</p>
        <p>
          t(x) = (x - ω₁)(x - ω₂)···(x - ωₘ)<br />
          교육용: t(x) = (x-1)(x-2)(x-3) = x³ - 6x² + 11x - 6<br />
          프로덕션: roots of unity → t(x) = xᵐ - 1<br />
          → O(1) 저장, O(log m) 평가<br />
          역할: p(x)가 모든 ωᵢ에서 0 ⟺ t(x) | p(x)
        </p>
      </div>
    </section>
  );
}
