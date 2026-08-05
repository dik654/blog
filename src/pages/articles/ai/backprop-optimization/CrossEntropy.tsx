import M from '@/components/ui/math';
import CrossEntropyScene from './viz/CrossEntropyScene';
import InfoTheoryScene from './viz/InfoTheoryScene';
import CeStabilityScene from './viz/CeStabilityScene';
import LabelSmoothingScene from './viz/LabelSmoothingScene';

export default function CrossEntropy() {
  return (
    <section id="cross-entropy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">교차 엔트로피 손실</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        Softmax 가 확률 <M>{'p = (p_1, \\ldots, p_K)'}</M> 를 뽑아냈다면, 이제 "이 확률이 정답과 얼마나 어긋났는지" 를 하나의 스칼라 loss 로 요약해야 한다.<br />
        one-hot 정답 <M>{'y'}</M> 에 대한 교차 엔트로피는 <M>{'L = -\\log p_{\\text{정답}}'}</M> — 정답 확률 하나에 <M>{'-\\log'}</M> 를 씌운 값.<br />
        <M>{'p_{\\text{정답}} \\to 1'}</M> 이면 <M>{'L \\to 0'}</M>, <M>{'p_{\\text{정답}} \\to 0'}</M> 이면 <M>{'L \\to \\infty'}</M>.
      </p>
      <CrossEntropyScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">정보이론에서 유도</h3>
        <p>
          교차 엔트로피는 Shannon 정보이론에서 자연스럽게 유도된다. 먼저 <strong>정보량 (information content)</strong>:
        </p>
        <M display>{'\\underbrace{I(x)}_{\\text{정보량 (놀라움)}} = -\\log \\underbrace{p(x)}_{\\text{사건 확률}}'}</M>
        <p>
          여기서 <M>{'p(x)'}</M> 는 사건 <M>{'x'}</M> 가 일어날 확률, <M>{'I(x)'}</M> 는 그 사건을 관측했을 때 얻는 정보량 (단위는 log 밑에 따라 bit 또는 nat).
          드문 사건일수록 놀라움(=정보)이 크다는 직관을 그대로 수식화한 것 — <M>{'p \\to 0'}</M> 이면 <M>{'I \\to \\infty'}</M>.
        </p>
        <p>분포 <M>{'P'}</M> 전체의 평균 정보량이 <strong>엔트로피</strong>:</p>
        <M display>{'\\underbrace{H(P)}_{\\text{엔트로피}} = -\\sum_i \\underbrace{P(i)}_{\\text{확률}} \\cdot \\underbrace{\\log P(i)}_{\\text{정보량}} = \\mathbb{E}_{x \\sim P}[-\\log P(x)]'}</M>
        <p>
          <M>{'P(i)'}</M> 는 i 번째 사건 확률, 합 <M>{'\\sum_i P(i) = 1'}</M>. <M>{'H(P)'}</M> 는 분포 <M>{'P'}</M> 를 따르는 메시지를 평균적으로 몇 bit 로 인코딩할 수 있는지에 대한 하한 (Shannon 1948).
        </p>
        <p><strong>교차 엔트로피</strong>는 두 분포 사이의 비대칭 거리:</p>
        <M display>{'\\underbrace{H(P, Q)}_{\\text{교차 엔트로피}} = -\\sum_i \\underbrace{P(i)}_{\\text{참 분포}} \\cdot \\underbrace{\\log Q(i)}_{\\text{모델 분포로 만든 코드 길이}}'}</M>
        <p>
          <M>{'P'}</M> 는 참(true) 분포, <M>{'Q'}</M> 는 모델 예측 분포.
          직관은 "Q 로 만든 최적 코드로 P 에서 뽑은 샘플을 전송할 때 필요한 평균 비트 수".
          <M>{'P = Q'}</M> 일 때 최소값 <M>{'H(P)'}</M> 에 도달하고, <M>{'Q'}</M> 가 <M>{'P'}</M> 에서 멀어질수록 커진다.
        </p>
        <p><strong>KL divergence</strong> 와의 관계:</p>
        <M display>{'\\underbrace{D_{\\mathrm{KL}}(P \\| Q)}_{\\text{KL 발산 (P→Q 비대칭 거리)}} = \\underbrace{H(P, Q)}_{\\text{교차 엔트로피}} - \\underbrace{H(P)}_{\\text{P 자체 엔트로피 (상수)}} = \\sum_i P(i) \\log \\frac{P(i)}{Q(i)}'}</M>
        <p>
          <M>{'H(P)'}</M> 는 모델 파라미터에 무관한 상수이므로, <strong>교차 엔트로피를 최소화 = KL divergence 를 최소화</strong> — 즉 예측 분포 Q 를 참 분포 P 에 최대한 가깝게 만드는 작업과 동치.
        </p>
        <p><strong>분류 문제에서의 단순화</strong>: one-hot 라벨은 정답 인덱스 <M>{'c'}</M> 에서만 <M>{'P(c) = 1'}</M>, 나머지는 0. 그러면:</p>
        <M display>{'H(P, Q) = -\\sum_i P(i) \\log Q(i) = -\\log Q(c)'}</M>
        <p>
          <M>{'Q(c)'}</M> 는 모델이 정답 클래스에 할당한 확률 <M>{'p_c'}</M>.
          <M>{'K'}</M> 개 항 중 <M>{'K-1'}</M> 개가 <M>{'0 \\cdot \\log(\\cdot) = 0'}</M> 으로 사라지고 한 항만 살아남는다.
          이것이 아티클 서두의 "L = -log(y_정답)" 의 기원.
        </p>
        <p>아래 Scene은 Information → Entropy → Cross-Entropy → KL 의 계층을 시각적으로 잇는다.</p>
      </div>
      <InfoTheoryScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">수치 안정성 · Weighted CE · Focal Loss</h3>
        <p>
          <M>{'-\\log p_c'}</M> 는 <M>{'p_c \\to 0'}</M> 에서 <M>{'-\\infty'}</M> 로 발산한다. softmax 출력이 float 정밀도 아래로 내려가 <M>{'p_c = 0'}</M> 이 되면 <M>{'\\log 0 = -\\infty'}</M> → NaN.
          해결은 softmax 섹션에서 본 logsumexp 와 결합:
        </p>
        <M display>{'L = -\\log p_c = \\underbrace{-x_c + \\log \\sum_j e^{x_j}}_{\\text{logsumexp 형태}} = \\underbrace{-x_c + m}_{\\text{logit shift}} + \\underbrace{\\log \\sum_j e^{x_j - m}}_{\\text{overflow 제거 (모두 } \\le 1 \\text{)}}'}</M>
        <p>
          <M>{'x_c'}</M> 는 정답 클래스의 logit, <M>{'m = \\max_j x_j'}</M>.
          우변은 <M>{'x_j - m \\leq 0'}</M> 이므로 모든 <M>{'e^{x_j - m}'}</M> 가 <M>{'(0, 1]'}</M> 에 있어 overflow 없음.
          <strong>softmax 확률을 거치지 않고 logit 에서 바로 loss 로</strong> — PyTorch <code>nn.CrossEntropyLoss</code> 의 내부 구현.
        </p>
        <p><strong>Weighted CE</strong> — 클래스 불균형 대응:</p>
        <M display>{'L = -\\sum_i w_i \\cdot y_i \\log p_i'}</M>
        <p>
          <M>{'w_i'}</M> 는 i 번째 클래스의 가중치 (희귀 클래스일수록 크게).
          one-hot 이면 결국 <M>{'L = -w_c \\log p_c'}</M> — 희귀 정답에 gradient 가 강하게 흐르도록 scale.
        </p>
        <p><strong>Focal Loss</strong> (Lin et al. 2017) — 이미 잘 맞추는 샘플의 영향력을 줄이는 변형:</p>
        <M display>{'L_{\\mathrm{focal}} = -\\underbrace{(1 - p_c)^\\gamma}_{\\text{easy sample 다운가중}} \\cdot \\underbrace{\\log p_c}_{\\text{기본 CE}}'}</M>
        <p>
          <M>{'\\gamma \\geq 0'}</M> 는 focusing 파라미터 (보통 2).
          <M>{'p_c'}</M> 가 크면 (잘 맞춤) <M>{'(1 - p_c)^\\gamma \\to 0'}</M> 으로 loss 가 거의 0 이 되고,
          <M>{'p_c'}</M> 가 작으면 (못 맞춤) 일반 CE 와 비슷하게 동작.
          object detection 처럼 easy-negative 가 많은 문제에서 hard example 에 학습 자원을 집중시키는 용도.
        </p>
      </div>
      <CeStabilityScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Label Smoothing</h3>
        <p>
          one-hot 정답은 <M>{'y_c = 1'}</M>, 나머지는 0. 학습이 진행되면 모델은 <M>{'p_c \\to 1'}</M> 을 달성하려고 logit 을 무한히 키우려 들고 — overconfidence 가 발생한다.
          Label smoothing 은 정답 라벨을 살짝 "부드럽게" 만든다:
        </p>
        <M display>{'y_i^{\\mathrm{LS}} = \\underbrace{(1 - \\varepsilon) \\cdot y_i}_{\\text{원래 정답 약화}} + \\underbrace{\\frac{\\varepsilon}{K}}_{\\text{모든 클래스에 균등 분배}}'}</M>
        <p>
          <M>{'\\varepsilon \\in [0, 1]'}</M> 는 smoothing 강도 (보통 0.1);
          <M>{'K'}</M> 는 클래스 수;
          원래 정답 위치는 <M>{'1 - \\varepsilon + \\varepsilon/K \\approx 0.9033'}</M>, 오답 위치는 <M>{'\\varepsilon/K \\approx 0.0033'}</M> (K=10, ε=0.1 기준).
        </p>
        <p>
          효과는 두 가지 — 모델이 <M>{'p_c = 1'}</M> 에 도달하려 과도하게 logit 을 키우는 것을 억제하고, 모든 클래스에 최소 <M>{'\\varepsilon/K'}</M> 의 확률을 인정하도록 강제해 calibration 을 개선.
        </p>
        <p>
          PyTorch 에서는 <code>nn.CrossEntropyLoss(label_smoothing=0.1)</code> 로 한 줄 적용.
          내부적으로는 위의 smoothed <M>{'y^{\\mathrm{LS}}'}</M> 에 대해 <M>{'L = -\\sum_i y_i^{\\mathrm{LS}} \\log p_i'}</M> 를 계산.
        </p>
        <p>아래 Scene은 smoothing 전후의 gradient 분포를 비교한다.</p>
      </div>
      <LabelSmoothingScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Cross-Entropy의 우아함</p>
          <p>
            <strong>MLE 와의 동치</strong>: 데이터 <M>{'\\{(x^{(n)}, y^{(n)})\\}_{n=1}^N'}</M> 에 대한 log-likelihood 는
            <M display>{'\\log \\prod_n p_\\theta(y^{(n)} | x^{(n)}) = \\sum_n \\log p_\\theta(y^{(n)} | x^{(n)})'}</M>
            이걸 음수로 뒤집으면 정확히 <M>{'\\sum_n (- \\log p_{y^{(n)}}^{(n)})'}</M> — 평균 교차 엔트로피.
            즉 <strong>CE 최소화 = MLE 최대화</strong>. 확률론과 정보이론이 같은 목적 함수에 수렴한다.
          </p>
          <p className="mt-2">
            <strong>Softmax 와의 공명</strong>: CE 와 softmax 를 묶어 미분하면
            <M display>{'\\frac{\\partial L}{\\partial x_i} = \\underbrace{p_i}_{\\text{모델 확신}} - \\underbrace{y_i}_{\\text{정답 지시}}'}</M>
            <M>{'p_i - y_i'}</M> 는 "모델 확신 − 정답 지시함수" — <strong>error 그 자체</strong>.
            gradient 가 loss 크기에 비례한다 = self-regulating. 잘 맞출수록 gradient 가 작아져 자연스럽게 수렴.
            이 유도는 다음 Chain Rule 섹션에서 진행.
          </p>
          <p className="mt-2">
            <strong>실무적 강점</strong>:<br />
            - 확률적 해석 가능 (log-likelihood 직통)<br />
            - logsumexp 로 수치 안정 구현<br />
            - Multi-class 로 자연 확장 (binary CE 는 K=2 특수 케이스)
          </p>
          <p className="mt-2">
            <strong>주의사항</strong>:<br />
            - Class imbalance 에 민감 → weighted / focal 로 완화<br />
            - Label noise 에 취약 → label smoothing 으로 완화<br />
            - ECE (expected calibration error) 로 측정되는 overconfidence 문제 지속<br />
            - Boundary 가 모호한 regression-like 문제에는 MSE/Huber 가 더 적합
          </p>
        </div>

      </div>
    </section>
  );
}
