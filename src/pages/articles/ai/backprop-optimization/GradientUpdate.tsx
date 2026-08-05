import M from '@/components/ui/math';
import GradientUpdateScene from './viz/GradientUpdateScene';
import SGDVariantsScene from './viz/SGDVariantsScene';
import LRSchedulingScene from './viz/LRSchedulingScene';
import GradTrainScene from './viz/GradTrainScene';

export default function GradientUpdate() {
  return (
    <section id="gradient-update" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">경사 하강법 업데이트</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        backward 가 넘겨준 gradient 를 실제 파라미터 업데이트로 바꾸는 단계.<br />
        기본 공식은 한 줄 — <M>{'\\theta_{\\text{new}} = \\theta_{\\text{old}} - \\eta \\nabla L'}</M>.
      </p>
      <GradientUpdateScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">기본 업데이트 공식</h3>
        <M display>{'\\underbrace{\\theta_{t+1}}_{\\text{다음 step}} = \\underbrace{\\theta_t}_{\\text{현재 파라미터}} - \\underbrace{\\eta}_{\\text{학습률}} \\cdot \\underbrace{\\nabla_\\theta L(\\theta_t)}_{\\text{현재 위치 gradient}}'}</M>
        <p>
          여기서 <M>{'\\theta \\in \\mathbb{R}^N'}</M> 는 전체 파라미터 벡터 (가중치 + 편향을 쭉 쌓은 것). <M>N</M> 은 DNN 크기 — GPS 예제에서는 6, 실제 LLM 에서는 <M>{'10^9 \\sim 10^{12}'}</M>.<br />
          <M>{'\\nabla_\\theta L \\in \\mathbb{R}^N'}</M> 는 loss 를 각 파라미터로 편미분한 gradient 벡터 — backward pass 가 계산하는 바로 그 값.<br />
          <M>{'\\eta \\in \\mathbb{R}^+'}</M> 는 학습률 (step size), 스칼라. 보통 <M>{'10^{-3} \\sim 10^{-5}'}</M> 범위.<br />
          <M>t</M> 는 iteration index — 한 번의 update 가 끝날 때마다 증가.
        </p>
        <p>
          왜 이 수식이 맞는가: gradient <M>{'\\nabla L'}</M> 은 정의상 <strong>L 이 가장 빨리 증가하는 방향</strong>을 가리킨다.
          loss 를 줄이려면 <strong>반대</strong> 방향으로 움직여야 하므로 음부호. <M>{'\\eta'}</M> 로 그 크기를 조절 — 너무 크면 최소점을 지나쳐 발산, 너무 작으면 수렴이 느리다.
          1 차 테일러 전개 <M>{'L(\\theta + \\Delta) \\approx L(\\theta) + \\nabla L \\cdot \\Delta'}</M> 에서 <M>{'\\Delta = -\\eta \\nabla L'}</M> 을 대입하면
          <M>{'L \\to L - \\eta \\|\\nabla L\\|^2 < L'}</M> — <M>{'\\eta'}</M> 가 충분히 작은 한 loss 는 반드시 감소한다는 보장.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SGD 변형 계열</h3>
        <p>
          위의 순수 gradient descent 는 "전체 데이터셋의 gradient" 를 한 step 마다 쓰는 것 — 현실에서는 메모리·속도 문제로 변형이 필요.
        </p>
        <p>
          <strong>Batch GD</strong>: <M>{'\\nabla L = \\frac{1}{N}\\sum_{i=1}^{N} \\nabla \\ell_i(\\theta)'}</M>. <M>N</M> = 전체 데이터 개수. 정확하지만 <M>N</M> 이 수백만이면 한 step 이 수 분.<br />
          <strong>SGD (Stochastic)</strong>: <M>{'\\nabla L \\approx \\nabla \\ell_i(\\theta)'}</M> — 샘플 <strong>하나</strong>로 추정. 한 step 은 빠르지만 noise 가 커 수렴이 zigzag.<br />
          <strong>Mini-batch SGD</strong>: <M>{'\\nabla L \\approx \\frac{1}{B}\\sum_{i \\in \\mathcal{B}} \\nabla \\ell_i(\\theta)'}</M>. 배치 크기 <M>{'B = 32 \\sim 512'}</M> 가 표준 — 하드웨어 병렬성과 추정 정확도의 균형점.
        </p>
        <p>
          <strong>Momentum</strong> 은 SGD 의 zigzag 를 완화한다. 속도 벡터 <M>v</M> 를 도입:
        </p>
        <M display>{'\\underbrace{v_{t+1}}_{\\text{새 속도}} = \\underbrace{\\beta v_t}_{\\text{관성 (이전 속도 감쇠)}} + \\underbrace{\\nabla L(\\theta_t)}_{\\text{현재 힘 (gradient)}}, \\quad \\theta_{t+1} = \\theta_t - \\eta v_{t+1}'}</M>
        <p>
          <M>{'v_t \\in \\mathbb{R}^N'}</M> 는 과거 gradient 의 exponential moving average (차원은 <M>{'\\theta'}</M> 와 동일).<br />
          <M>{'\\beta \\in [0, 1)'}</M> 는 momentum coefficient, 스칼라. <M>{'\\beta = 0'}</M> 이면 순수 SGD 와 동일, <M>{'\\beta = 0.9'}</M> 가 표준 (대략 <M>{'1/(1-\\beta) = 10'}</M> step 평균).<br />
          물리 비유: <M>v</M> 는 공의 속도, gradient 는 힘. 관성 덕분에 작은 noise 에 흔들리지 않고 일관된 방향으로 가속.
        </p>
        <p>
          <strong>NAG (Nesterov)</strong> 는 한 발 더 나아간다. "먼저 관성 방향으로 점프한 뒤 gradient 를 계산" — <M>{'\\nabla L(\\theta_t - \\eta \\beta v_t)'}</M>.
          Lookahead 로 overshoot 을 선제 보정. 수렴 속도 이론적으로 <M>{'O(1/t)'}</M> → <M>{'O(1/t^2)'}</M> 로 개선.
        </p>
      </div>

      <SGDVariantsScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="mt-6">
          위 Scene은 동일한 loss landscape 위에서 각 variant 의 궤적이 어떻게 달라지는지 비교한다.
          SGD 의 noise, Mini-batch 의 smoothing, Momentum 의 관성 누적, NAG 의 lookahead 보정이 한눈에 들어온다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Learning Rate Scheduling</h3>
        <p>
          <M>{'\\eta'}</M> 를 상수로 두면 학습 초기에는 느리고 후기에는 overshoot. 시간에 따라 조절하는 게 표준.
        </p>
        <p>
          <strong>Step decay</strong>: <M>{'\\eta_t = \\eta_0 \\cdot \\gamma^{\\lfloor t/s \\rfloor}'}</M>. <M>s</M> step 마다 <M>{'\\gamma'}</M> 배 (보통 <M>{'\\gamma = 0.1'}</M>).<br />
          <strong>Exponential decay</strong>: <M>{'\\eta_t = \\eta_0 e^{-\\lambda t}'}</M>.<br />
          <strong>Cosine annealing</strong>:
        </p>
        <M display>{'\\eta_t = \\underbrace{\\eta_{\\min}}_{\\text{최종 LR (floor)}} + \\underbrace{\\tfrac{1}{2}(\\eta_{\\max} - \\eta_{\\min})}_{\\text{진폭}} \\cdot \\underbrace{\\left(1 + \\cos\\frac{t \\pi}{T}\\right)}_{\\text{0~2 코사인 감쇠}}'}</M>
        <p>
          <M>T</M> 는 전체 스케줄 길이 (예: 총 학습 step 수). <M>{'\\eta_{\\max}'}</M> 는 peak LR (warmup 종료 지점), <M>{'\\eta_{\\min}'}</M> 는 최종 LR (보통 peak 의 0.1 배).<br />
          코사인이 부드럽게 감소해 step/exponential 대비 noise 가 적고 최종 수렴이 안정.
        </p>
        <p>
          2023~ LLM 훈련 표준은 <strong>Linear warmup + Cosine decay</strong>. 초기 <M>{'t < T_w'}</M> 구간에서 <M>{'\\eta_t = \\eta_{\\max} \\cdot t / T_w'}</M> 로 선형 증가 후 코사인 감소.
          Warmup 이 필요한 이유: 학습 초반에는 모델이 random init 상태라 gradient 크기가 과도하게 튀어 곧바로 peak LR 을 쓰면 발산.
          <M>{'T_w = 2000 \\sim 10000'}</M> step 이 일반적.
        </p>
      </div>

      <LRSchedulingScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="mt-6">
          이 Scene은 step/exponential/cosine/warmup+cosine 네 스케줄을 같은 총 길이에서 겹쳐 보여준다.
          "언제 어떤 스케줄을 쓰는지"는 모델 크기·데이터·batch size 에 따라 다르지만, 기하 모양을 눈으로 기억해두면 논문 그래프를 읽는 속도가 붙는다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훈련 루프 · Gradient Clipping</h3>
        <p>
          실전 훈련 한 iteration 의 기본 골격:
        </p>
        <M display>{'\\text{forward} \\to L = \\ell(f_\\theta(x), y) \\to \\text{backward} \\to \\nabla L \\to \\text{clip} \\to \\text{update}'}</M>
        <p>
          매 step 마다 (1) <code>model(x)</code> 로 예측 계산, (2) loss 계산, (3) <code>loss.backward()</code> 로 <M>{'\\nabla L'}</M> 축적,
          (4) optional clipping, (5) <code>optimizer.step()</code> 으로 <M>{'\\theta'}</M> 갱신, (6) <code>optimizer.zero_grad()</code> 로 <M>{'.grad'}</M> 초기화.
        </p>
        <p>
          <strong>Gradient clipping</strong> 은 <M>{'\\|\\nabla L\\|'}</M> 이 임계값 <M>c</M> 를 넘으면 잘라낸다:
        </p>
        <M display>{'\\nabla L \\leftarrow \\nabla L \\cdot \\underbrace{\\min\\!\\left(1, \\frac{c}{\\|\\nabla L\\|_2}\\right)}_{\\text{norm } > c \\text{ 이면 c 까지만 잘라냄}}'}</M>
        <p>
          <M>{'\\|\\nabla L\\|_2 = \\sqrt{\\sum_i (\\partial L / \\partial \\theta_i)^2}'}</M> 는 gradient 의 L2 norm (스칼라).
          <M>{'c = 1.0'}</M> 이 일반 기본값. RNN 이나 깊은 Transformer 에서는 간헐적으로 gradient 가 폭발해
          한 번의 큰 step 으로 파라미터가 망가질 수 있는데, clipping 이 그 사건을 흡수.
        </p>
      </div>

      <GradTrainScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="mt-6">
          위 Scene은 한 training step 의 forward → backward → clip → update 흐름을 tensor 가 움직이는 타이밍과 함께 보여준다.
          PyTorch 코드와 1:1 로 매핑되니, 실전 loop 를 디버깅할 때 "지금 어느 단계에 있는지" 감을 잡기 좋다.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Momentum 이 왜 효과적인가</p>
          <p>
            <strong>물리적 직관</strong>:<br />
            - 공이 경사면을 구를 때 관성을 가짐 — <M>v</M> 가 속도, <M>{'\\nabla L'}</M> 이 힘, <M>{'\\beta'}</M> 가 마찰 계수에 대응<br />
            - 작은 bump 나 noise 에 덜 흔들림 (EMA 가 high-frequency 성분을 저역통과)<br />
            - 경사 방향으로 가속 — 같은 방향 gradient 가 반복되면 <M>v</M> 가 누적
          </p>
          <p className="mt-2">
            <strong>수학적 효과</strong>:<br />
            - <M>{'v_t = \\sum_{k=0}^{t} \\beta^{t-k} \\nabla L_k'}</M> — gradient 의 exponential moving average<br />
            - 반대 방향 gradient 가 상쇄되어 noise cancellation<br />
            - Ravine (한 방향이 급경사, 다른 방향이 평탄) 에서 느린 축의 진행을 돕는다<br />
            - Saddle point 를 관성으로 탈출<br />
            - 수렴 속도 2-3 배 증가가 일반적
          </p>
          <p className="mt-2">
            <strong><M>{'\\beta'}</M> 값 선택</strong>:<br />
            - <M>{'\\beta = 0'}</M>: momentum 없음 (vanilla SGD)<br />
            - <M>{'\\beta = 0.9'}</M>: 표준 (약 10 step 평균)<br />
            - <M>{'\\beta = 0.99'}</M>: longer memory (LLM 훈련에서 자주)<br />
            - <M>{'\\beta \\to 1'}</M>: 과도한 관성, overshoot 위험
          </p>
        </div>
      </div>
    </section>
  );
}
