import ECODArchViz from './viz/ECODArchViz';
import ECODCalcDetailViz from './viz/ECODCalcDetailViz';
import ECODVariantsDetailViz from './viz/ECODVariantsDetailViz';
import M from '@/components/ui/math';

export default function Algorithm() {
  return (
    <section id="algorithm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECDF 기반 이상치 점수 계산</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        차원별 ECDF → 꼬리 확률에 -log 변환 → Two-tail max → 합산.<br />
        꼬리 확률 0.01 → 점수 4.6, 0.5 → 점수 0.7. 극단일수록 급증.
      </p>
      <ECODArchViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mb-3">ECOD 수학적 정의</h3>

        <h4>1. 경험적 CDF (각 차원 j)</h4>
        <M display>{'\\underbrace{\\hat{F}_j(x)}_{\\text{경험적 CDF}} = \\frac{1}{n} \\sum_{i=1}^{n} \\underbrace{\\mathbb{1}(X_{ij} \\leq x)}_{\\text{지시함수: 조건 만족 시 1}}'}</M>

        <h4>2. 꼬리 확률 → 이상치 점수</h4>
        <M display>{'\\underbrace{O_{\\text{left}}(i,j) = -\\log \\hat{F}_j(x_{ij})}_{\\text{좌측 꼬리: 극단적으로 작은 값 탐지}} \\qquad \\underbrace{O_{\\text{right}}(i,j) = -\\log(1 - \\hat{F}_j(x_{ij}))}_{\\text{우측 꼬리: 극단적으로 큰 값 탐지}}'}</M>

        <h4>3. Two-tail 결합 & 최종 점수</h4>
        <M display>{'O(i,j) = \\max\\big(O_{\\text{left}},\\, O_{\\text{right}}\\big) \\qquad \\underbrace{O(i) = \\sum_j O(i,j)}_{\\text{차원 독립 가정 하에 합산}}'}</M>

        <div className="not-prose grid grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { sym: 'F̂ⱼ(x)', name: '경험적 CDF', desc: '데이터 중 x 이하인 비율. 비모수적 — 분포 가정 불필요' },
            { sym: '-log(p)', name: '점수 변환', desc: '확률 0.01 → 4.6, 확률 0.5 → 0.7. 꼬리일수록 점수 급증' },
            { sym: 'max(left, right)', name: 'Two-tail', desc: '양쪽 꼬리 중 더 극단적인 방향을 채택' },
            { sym: 'Σⱼ O(i,j)', name: '차원 합산', desc: '차원 간 독립 가정 하에 점수를 합산하여 최종 이상 점수 산출' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">ECOD 상세 계산 예시</h3>
        <div className="not-prose"><ECODCalcDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">수치 안정성과 변형</h3>
        <div className="not-prose"><ECODVariantsDetailViz /></div>
        <p className="leading-7">
          요약 1: <strong>ECDF → -log → max → sum</strong> 4단계로 이상 점수 계산.<br />
          요약 2: <strong>epsilon clamp</strong>로 수치 안정성 확보 필수.<br />
          요약 3: <strong>차원 독립 가정</strong>이 단점 — COPOD가 확장 해결책.
        </p>
      </div>
    </section>
  );
}
