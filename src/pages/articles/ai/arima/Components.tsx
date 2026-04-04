import CodePanel from '@/components/ui/code-panel';
import ARIMAComponentsViz from './viz/ARIMAComponentsViz';

const arimaFormulaCode = `# ARIMA(p, d, q) 통합 수식
# Yt' = c + φ₁Yt-1' + ... + φpYt-p' + εt + θ₁εt-1 + ... + θqεt-q
#
# AR(p) 자기회귀 — 과거 p개 값의 가중합
#   φ₁Yt-1 + φ₂Yt-2 + ... + φpYt-p
#
# I(d) 차분 — d번 차분으로 정상화
#   Yt' = Yt - Yt-1  (1차 차분)
#   Yt'' = Yt' - Yt-1' (2차 차분)
#
# MA(q) 이동평균 — 과거 q개 오차의 가중합
#   θ₁εt-1 + θ₂εt-2 + ... + θqεt-q`;

const formulaAnnotations = [
  { lines: [1, 2] as [number, number], color: 'violet' as const, note: 'ARIMA 통합 수식' },
  { lines: [4, 5] as [number, number], color: 'emerald' as const, note: 'AR(p): 자기회귀' },
  { lines: [7, 9] as [number, number], color: 'amber' as const, note: 'I(d): 차분' },
  { lines: [11, 12] as [number, number], color: 'sky' as const, note: 'MA(q): 이동평균' },
];

export default function Components() {
  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AR(p), I(d), MA(q) 구성요소</h2>
      <div className="not-prose mb-6">
        <ARIMAComponentsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>AR(p) - 자기회귀</h3>
        <p>
          현재 값을 <strong>과거 p개 시점의 값</strong>으로 예측<br />
          계수 φ는 각 시차의 영향력을 표현<br />
          정상성을 위해 특성방정식의 근이 단위원 밖에 있어야 함
        </p>

        <h3>I(d) - 적분 (차분)</h3>
        <p>
          비정상 시계열을 <strong>d번 차분</strong>하여 정상성 확보<br />
          대부분의 실제 시계열은 d=1 또는 d=2로 충분<br />
          과도한 차분은 정보 손실 야기 — ADF 검정으로 최소 d를 결정
        </p>

        <h3>MA(q) - 이동평균</h3>
        <p>
          현재 값을 <strong>과거 q개 시점의 예측 오차</strong>로 보정<br />
          AR이 "과거 값의 관성"을 포착한다면, MA는 "과거 충격의 잔여 효과"를 모델링<br />
          단기 변동성에 효과적
        </p>

        <CodePanel title="ARIMA(p,d,q) 수식" code={arimaFormulaCode}
          annotations={formulaAnnotations} defaultOpen />
      </div>
    </section>
  );
}
