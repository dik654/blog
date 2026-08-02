import M from '@/components/ui/math';
import LossScene from './viz/LossScene';
import LossComparisonScene from './viz/LossComparisonScene';
import LossTaskMapScene from './viz/LossTaskMapScene';
import CeIntuitionScene from './viz/CeIntuitionScene';

export default function LossFunction() {
  return (
    <section id="loss-function" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">손실 함수 비교</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        손실 함수 — 모델 예측과 정답 사이의 거리를 수치화한 스칼라. 학습이 최소화하려는 목표 함수.<br />
        분류는 Cross-Entropy, 회귀는 MSE, 분포 비교는 KL Divergence — task 별 표준 조합이 있다.
      </p>
      <p className="text-sm text-muted-foreground mb-2">
        아래 Scene은 여러 loss 의 곡선과 각각이 어떤 상황을 가정하는지 — 왜 task 마다 다른 loss 가 필요한지의 배경.
      </p>
      <LossScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Entropy — 분류의 표준</h3>
        <p>
          두 확률분포 <M>P</M> (정답), <M>Q</M> (모델 예측) 사이의 교차엔트로피는:
        </p>
        <M display>{'\\underbrace{H(P, Q)}_{\\text{교차 엔트로피}} = -\\sum_{i} \\underbrace{P(i)}_{\\text{정답 분포}} \\cdot \\underbrace{\\log Q(i)}_{\\text{모델 분포의 로그}}'}</M>
        <p>
          여기서 <M>{'P(i), Q(i)'}</M> 는 클래스 <M>i</M> 에 대한 확률 (<M>{'\\sum_i P(i) = \\sum_i Q(i) = 1'}</M>),
          합은 전체 클래스 수에 대해. 분류에서 정답은 보통 one-hot 이라 정답 클래스 <M>c</M> 만
          <M>{'P(c) = 1'}</M> 이고 나머지는 0. 합이 한 항으로 축약된다:
        </p>
        <M display>{'H(P, Q) = -\\log Q(c) = -\\log p_{\\text{정답}}'}</M>
        <p>
          <M>{'p_{\\text{정답}}'}</M> 은 모델이 정답 클래스에 부여한 확률. 이 값이 1 에 가까우면 loss 는 0 에 수렴하고,
          0 에 가까우면 <M>{'-\\log p \\to +\\infty'}</M> 로 폭증한다. "정답을 자신 있게 맞히면 페널티 없음, 자신 있게 틀리면 무한 페널티" 의 정보이론적 형태.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">MSE / MAE / Huber — 회귀의 세 곡선</h3>
        <p>
          회귀 loss 는 예측 <M>{'\\hat{y}'}</M> 과 정답 <M>y</M> 의 차이 <M>{'e = \\hat{y} - y'}</M> 를 스칼라로 요약:
        </p>
        <M display>{'\\mathrm{MSE} = \\underbrace{\\frac{1}{N}}_{\\text{샘플 평균}} \\cdot \\sum_{i=1}^{N} \\underbrace{(\\hat{y}_i - y_i)^2}_{\\text{제곱 오차 — 큰 오차 가중치 폭증}}'}</M>
        <M display>{'\\mathrm{MAE} = \\frac{1}{N} \\sum_{i=1}^{N} |\\hat{y}_i - y_i|'}</M>
        <M display>{'\\mathrm{Huber}_\\delta(e) = \\begin{cases} \\overbrace{\\tfrac{1}{2} e^2}^{\\text{MSE 형태 (smooth)}} & |e| \\le \\delta \\\\ \\underbrace{\\delta(|e| - \\tfrac{1}{2}\\delta)}_{\\text{MAE 형태 (linear)}} & |e| > \\delta \\end{cases}'}</M>
        <p>
          <M>N</M> 은 샘플 수, <M>{'\\delta'}</M> 는 Huber 의 전환점 하이퍼파라미터. MSE 는 error 의 제곱이라 큰 오차에 가중치가 급증
          (이상치 1 개가 전체 loss 를 지배), MAE 는 절댓값이라 모든 오차를 동일 가중치로 본다.
          Huber 는 <M>{'|e| \\le \\delta'}</M> 영역에서 MSE 처럼 부드럽고 그 바깥에서는 MAE 처럼 선형 — 이상치에 강하면서도 0 근처에서 미분 가능.
        </p>
        <p>
          각 loss 의 <strong>미분 형태</strong>가 학습 dynamics 를 좌우한다:
        </p>
        <M display>{'\\frac{\\partial \\mathrm{MSE}}{\\partial \\hat{y}} = 2e, \\quad \\frac{\\partial \\mathrm{MAE}}{\\partial \\hat{y}} = \\mathrm{sign}(e), \\quad \\frac{\\partial \\mathrm{Huber}}{\\partial \\hat{y}} = \\begin{cases} e & |e| \\le \\delta \\\\ \\delta \\cdot \\mathrm{sign}(e) & |e| > \\delta \\end{cases}'}</M>
        <p>
          MSE 의 gradient 는 <strong>error 에 비례</strong>해 커져 이상치의 영향이 폭증, MAE 의 gradient 는
          <strong>부호만</strong> 가지는 ±1 상수라 어떤 크기의 오차든 동일한 업데이트 강도. Huber 는 둘의 장점을 이어 붙인 형태.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">KL Divergence — 분포 간 거리</h3>
        <p>
          분포 <M>P</M> (참) 를 <M>Q</M> (근사) 로 "코딩" 할 때 낭비되는 비트:
        </p>
        <M display>{'\\underbrace{D_{\\mathrm{KL}}(P \\| Q)}_{\\text{KL 발산 (비대칭 거리)}} = \\sum_{i} P(i) \\log \\underbrace{\\frac{P(i)}{Q(i)}}_{\\text{확률 비, } 1 \\text{ 일 때 0}}'}</M>
        <p>
          비대칭 (<M>{'D_{\\mathrm{KL}}(P \\| Q) \\ne D_{\\mathrm{KL}}(Q \\| P)'}</M>) 이라 "거리" 는 아니지만 0 에서 최소.
          Cross-entropy 와의 관계는:
        </p>
        <M display>{'\\underbrace{H(P, Q)}_{\\text{CE (학습 목적)}} = \\underbrace{H(P)}_{\\text{데이터 엔트로피 (상수)}} + \\underbrace{D_{\\mathrm{KL}}(P \\| Q)}_{\\text{모델이 줄여야 할 부분}}'}</M>
        <p>
          여기서 <M>H(P)</M> 는 <M>P</M> 자체의 엔트로피로 데이터에만 의존 — 모델과 무관한 상수.
          그래서 cross-entropy 를 최소화하는 것과 KL 을 최소화하는 것이 학습 입장에서 동치다.
          분포 간 직접 비교가 필요한 경우 (distillation, variational inference) 에는 KL 을 명시적으로 쓴다.
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-4 mb-2">
        아래 Scene은 MSE / MAE / Huber 세 곡선을 같은 축에 올려 전환점과 gradient 크기 차이를 시각화.
      </p>
      <LossComparisonScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">Loss Function 카탈로그</h3>
        <p>
          MSE / MAE / Huber (회귀), CE / BCE (분류), KL (분포) — 각 task 에 매칭되는 표준 조합.
          Binary cross-entropy 는 CE 의 2 클래스 특수 케이스:
        </p>
        <M display>{'\\mathrm{BCE} = -\\big[\\underbrace{y \\log \\hat{y}}_{y=1 \\text{ 일 때만 살아남음}} + \\underbrace{(1 - y) \\log (1 - \\hat{y})}_{y=0 \\text{ 일 때만 살아남음}}\\big]'}</M>
        <p>
          <M>{'y \\in \\{0, 1\\}'}</M> 은 정답 레이블, <M>{'\\hat{y} \\in (0, 1)'}</M> 은 시그모이드 출력 확률.
          정답이 1 이면 첫 항만, 0 이면 두 번째 항만 살아 단일 <M>{'-\\log'}</M> 형태로 축약된다.
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-4 mb-2">
        아래 Scene은 task → loss 매핑을 카드형으로 — 실제 프로젝트에서 어떤 loss 를 집을지 결정 가이드.
      </p>
      <LossTaskMapScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Cross-Entropy 직관적 이해</h3>
        <p>
          GPS 예제 (3 클래스) 에서 모델이 출력한 확률 <M>{'p = [0.10, 0.19, 0.71]'}</M>, 정답은 Madrid (인덱스 0).
          CE loss 는 정답 클래스 확률만 보고:
        </p>
        <M display>{'L = -\\log 0.10 \\approx 2.30'}</M>
        <p>
          만약 모델이 정답에 0.5 를 준다면 <M>{'-\\log 0.5 \\approx 0.69'}</M>, 0.9 라면 <M>{'\\approx 0.10'}</M>, 0.99 라면
          <M>{'\\approx 0.01'}</M>. 확률이 <strong>로그 스케일로</strong> loss 에 매핑되는 특성이 바로 자신감 있는 오답을 강하게 처벌하고,
          맞힌 답은 가볍게 보상하는 학습 pressure 를 만든다.
        </p>
        <p>
          Softmax + CE 의 gradient 가 <M>{'\\partial L / \\partial z_i = p_i - y_i'}</M> 형태로 떨어지는 것도
          이 조합의 매력 — <strong>self-regulating</strong>: 정답에 이미 높은 확률을 주면 <M>{'p - y'}</M> 가 작아져 자동으로 업데이트 속도가 줄고,
          확신 있게 틀리면 <M>{'p - y'}</M> 가 커져 큰 교정 신호가 흐른다.
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-4 mb-2">
        아래 Scene은 구체 숫자로 <M>{'-\\log p_{\\text{정답}}'}</M> 의 곡선을 따라가며 "확률 하락 → loss 폭증" 을 보여준다.
      </p>
      <CeIntuitionScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none">


        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Loss 선택이 학습 dynamics를 결정</p>
          <p>
            <strong>Gradient magnitude</strong>:<br />
            - MSE: <M>{'\\partial L / \\partial \\hat{y} \\propto e'}</M> (error 에 선형)<br />
            - CE: <M>{'\\partial L / \\partial \\hat{y} \\propto 1 / p'}</M> (확률 0 근처에서 폭증)<br />
            - MAE: <M>{'\\partial L / \\partial \\hat{y} = \\pm 1'}</M> (상수 크기)
          </p>
          <p className="mt-2">
            <strong>Training behavior</strong>:<br />
            - MSE + 분류: 출력이 sigmoid 여서 <M>{'\\sigma\'(z) = \\sigma(z)(1 - \\sigma(z))'}</M> 가 곱해져 초반엔 빠르다가 느려짐<br />
            - CE + 분류: softmax 와 결합시 <M>{'\\partial L / \\partial z = p - y'}</M> 로 일관된 학습 속도<br />
            - MAE + 회귀: gradient 가 상수라 느리지만 이상치에 안정적
          </p>
          <p className="mt-2">
            <strong>Production 고려사항</strong>:<br />
            - Class imbalance → weighted loss (<M>{'\\sum_i \\alpha_i \\cdot \\text{CE}_i'}</M>) 또는 focal
            (<M>{'(1 - p_t)^\\gamma \\cdot \\text{CE}'}</M>)<br />
            - Outlier 많음 → MAE 또는 Huber<br />
            - Label noise → label smoothing (<M>{'y \\leftarrow (1 - \\epsilon) y + \\epsilon / K'}</M>)<br />
            - Multi-task → loss weighting (uncertainty-based: <M>{'L = \\sum_t \\tfrac{1}{2 \\sigma_t^2} L_t + \\log \\sigma_t'}</M>)
          </p>
        </div>

      </div>
    </section>
  );
}
