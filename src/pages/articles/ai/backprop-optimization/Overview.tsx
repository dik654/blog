import M from '@/components/ui/math';
import GPSMapScene from './viz/GPSMapScene';
import BackpropEfficiencyScene from './viz/BackpropEfficiencyScene';
import LocalGradChainScene from './viz/LocalGradChainScene';
import DiffModesOverviewScene from './viz/DiffModesOverviewScene';
import DiffModesIntroScene from './viz/DiffModesIntroScene';
import DiffModeOverviewCardScene from './viz/DiffModeOverviewCardScene';
import ForwardVsReverseScene from './viz/ForwardVsReverseScene';
import NParamScalingScene from './viz/NParamScalingScene';
import ReverseModeScene from './viz/ReverseModeScene';
import TrainingLoopScene from './viz/TrainingLoopScene';
import TwoDiffModesScene from './viz/TwoDiffModesScene';
import LocalGradStoreScene from './viz/LocalGradStoreScene';
import ForwardNPassScene from './viz/ForwardNPassScene';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 역전파인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GPT-4 — 약 <strong>수천억 개의 파라미터</strong>(가중치)<br />
          이 파라미터를 각각 어떤 방향으로, 얼마나 업데이트할지 계산하는 알고리즘 = <strong>역전파(Backpropagation)</strong>
        </p>
        <p>
          학습의 본질을 수식 한 줄로 쓰면 아래와 같다 — 각 파라미터 <M>{'\\theta'}</M> 를 손실 <M>L</M> 의
          감소 방향으로 조금씩 미는 것뿐:
        </p>
        <M display>{'\\underbrace{\\theta_{\\text{new}}}_{\\text{업데이트 후}} = \\underbrace{\\theta_{\\text{old}}}_{\\text{현재 파라미터}} - \\underbrace{\\eta}_{\\text{학습률}} \\cdot \\underbrace{\\nabla_\\theta L}_{\\text{loss 증가 방향}}'}</M>
        <ul>
          <li>
            <M>{'\\theta_{\\text{old}}, \\theta_{\\text{new}} \\in \\mathbb{R}^N'}</M> — 업데이트 전·후의 파라미터 벡터.
            모델의 모든 가중치·편향을 한 줄로 쌓은 것이며 <M>N</M> 은 전체 파라미터 수 (GPT-4 급은 <M>{'\\sim 10^{12}'}</M>).
          </li>
          <li>
            <M>{'L \\in \\mathbb{R}'}</M> — 스칼라 손실. 정답과의 거리를 한 숫자로 요약한 값.
          </li>
          <li>
            <M>{'\\eta \\in \\mathbb{R}^+'}</M> — 학습률 (step size). 보통 <M>{'10^{-3} \\sim 10^{-5}'}</M> 사이의 작은 양수.
            너무 크면 발산, 너무 작으면 학습이 느리다.
          </li>
          <li>
            <M>{'\\nabla_\\theta L \\in \\mathbb{R}^N'}</M> — <M>L</M> 을 <M>{'\\theta'}</M> 각 성분으로 편미분한 <strong>gradient 벡터</strong>.
            <M>{'\\theta'}</M> 와 같은 차원이며, "loss 가 가장 빨리 증가하는 방향" 을 가리킨다 — 그래서 음부호로 빼서 감소 방향으로 이동.
          </li>
        </ul>
        <p>
          역전파는 이 <M>{'\\nabla_\\theta L'}</M> 을 <strong>효율적으로 계산</strong>하는 절차를 가리킨다.
        </p>
        <p>
          추상적 수식 대신, <strong>가장 작은 모델 하나를 처음부터 끝까지</strong> 학습시켜 본다
        </p>

        <h3>예제: 경도 → 도시 분류</h3>
        <p>
          상황 — 유럽 여행 중 GPS가 <strong>경도(longitude) 숫자 하나</strong>만 알려줌<br />
          이 숫자만으로 지금 <strong>마드리드(-3.7°) / 파리(2.4°) / 베를린(13.4°)</strong> 중 어디인지 맞추는 모델<br />
          뉴런 3개, 가중치 6개뿐인 최소 신경망 — 역전파의 모든 단계를 손으로 따라갈 수 있는 크기
        </p>
        <p>
          각 도시 뉴런의 계산은 <M>{'z_i = w_i \\cdot x + b_i'}</M> 형태. 여기서 <M>x</M> 는 입력 경도 (스칼라),
          <M>{'w_i'}</M> 는 i 번째 도시에 대응하는 가중치, <M>{'b_i'}</M> 는 편향. 세 뉴런의 출력 <M>{'z = (z_m, z_p, z_b)'}</M> 를
          softmax 에 넣어 확률분포로 만들고, 정답 (one-hot) 과의 cross-entropy 로 loss 를 얻는다.
        </p>
        <p>
          처음엔 <strong>랜덤 가중치</strong>로 엉터리 확률을 내놓음<br />
          역전파를 반복할수록 <strong>경도 -3.7 입력 → 마드리드 확률 상승</strong>하도록 가중치가 조정되는 과정을 따라간다
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-6 mb-2">
        아래 Scene은 입력 경도 축 위에 세 도시가 어떻게 분리되는지 — 분류기가 풀어야 할 문제 지형을 먼저 눈으로 잡는다.
      </p>
      <div className="not-prose mt-2">
        <GPSMapScene />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Backpropagation 개념 정리</h3>
        <p>
          Backprop = <strong>Chain rule + Dynamic programming</strong>. 합성함수
          <M>{'L = f_n(f_{n-1}(\\cdots f_1(x)))'}</M> 의 미분은 chain rule 로
        </p>
        <M display>{'\\frac{\\partial L}{\\partial x} = \\underbrace{\\frac{\\partial L}{\\partial f_n}}_{\\text{출력 쪽 시드}} \\cdot \\underbrace{\\frac{\\partial f_n}{\\partial f_{n-1}} \\cdots \\frac{\\partial f_1}{\\partial x}}_{\\text{각 층의 local 미분 곱}}'}</M>
        <p>
          여기서 <M>{'f_k'}</M> 는 k 번째 층의 출력 (벡터), 각 <M>{'\\partial f_k / \\partial f_{k-1}'}</M> 는 야코비 행렬
          (한 층이 전 층에 대해 가지는 편미분 테이블). 항들을 오른쪽 → 왼쪽으로 곱해도 되고 왼쪽 → 오른쪽으로 곱해도 되지만,
          출력이 스칼라 (<M>L</M>) 면 <strong>왼쪽 = 출력 쪽에서 시작</strong>해 곱하는 것이 압도적으로 싸다. 이것이 reverse mode.
        </p>
        <p>
          Dynamic programming 파트는 각 중간 <M>{'\\partial L / \\partial f_k'}</M> 를 <strong>한 번 계산해 저장</strong>하고
          재사용한다는 의미. naive 재귀로는 같은 편미분을 지수적으로 중복 계산하게 되고, 역전파는 이 중복을 완전히 제거해 수조 배의 효율 차이를 만든다.
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-4 mb-2">
        아래 Scene은 naive 미분과 backprop 의 연산량 격차 — 왜 현대 DNN 학습이 backprop 없이는 성립하지 않는지를 로그 스케일로 보여준다.
      </p>
      <BackpropEfficiencyScene />
      <p className="text-sm text-muted-foreground mt-6 mb-2">
        Chain rule 을 "저장된 local gradient 를 순서대로 곱해 내려간다" 는 실제 메커니즘으로 풀어본다.
      </p>
      <div className="not-prose mt-2">
        <LocalGradChainScene />
      </div>
      <p className="text-sm text-muted-foreground mt-6 mb-2">
        각 노드가 forward 때 저장해 둬야 하는 값 (입력값·local gradient) 을 시각화 — 이것이 activation memory 의 정체.
      </p>
      <div className="not-prose mt-2">
        <LocalGradStoreScene />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Reverse Mode Autodiff — 왜 신경망에 최적인가</h3>
        <p>
          미분을 계산하는 방식은 크게 두 가지다 — Forward mode 와 Reverse mode.
          함수 <M>{'f: \\mathbb{R}^n \\to \\mathbb{R}^m'}</M> 의 야코비 <M>{'J \\in \\mathbb{R}^{m \\times n}'}</M> 에 대해
          forward mode 는 열 하나 <M>{'J v'}</M> (입력 방향 v 하나의 JVP), reverse mode 는 행 하나
          <M>{'v^T J'}</M> (출력 방향 v 하나의 VJP) 를 각각 한 번의 sweep 으로 계산한다.
        </p>
        <p>
          신경망은 <M>n =</M> 파라미터 수 (수억~수천억), <M>m = 1</M> (scalar loss). 야코비는 <M>{'1 \\times n'}</M> 이라
          <strong>행 하나</strong>면 전부 — reverse mode 한 번에 끝난다. Forward mode 로 같은 걸 얻으려면
          열 n 개를 모두 뽑아야 하니 <M>n</M> 번의 sweep 이 필요하다. <M>n</M> 이 10<sup>11</sup> 이면 승부는 자명.
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-4 mb-2">
        두 autodiff 전략의 데이터 흐름 차이를 같은 그래프 위에서 비교.
      </p>
      <div className="not-prose mt-2">
        <TwoDiffModesScene />
      </div>
      <div className="not-prose mt-4">
        <DiffModesOverviewScene />
      </div>
      <div className="not-prose mt-4">
        <DiffModeOverviewCardScene />
      </div>
      <div className="not-prose mt-6">
        <DiffModesIntroScene />
      </div>
      <div className="not-prose mt-6">
        <ForwardVsReverseScene />
      </div>
      <p className="text-sm text-muted-foreground mt-6 mb-2">
        파라미터 수 <M>n</M> 에 대한 전체 연산량은 두 방식 모두 <M>{'O(n)'}</M> 이다.
        다만 scalar loss의 전체 gradient를 얻는 데 forward mode는 입력 방향마다 <M>n</M> 번의 sweep이 필요하고,
        reverse mode는 forward 계산의 상수배 비용인 backward sweep 한 번이면 된다.
      </p>
      <div className="not-prose mt-2">
        <NParamScalingScene />
      </div>
      <div className="not-prose mt-6">
        <ForwardNPassScene />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p>
          아래 시각화에서 <M>{'w_1 = 0.5, \\; x = 2.0, \\; w_2 = 0.2'}</M> 인 단순 그래프를 단계별로 따라간다.<br />
          순전파로 <M>{'z = w_1 \\cdot x = 1.0'}</M>, 그리고 다음 층을 지나 <M>{'L = 0.85'}</M> 를 계산하고,
          역전파 단 1회로 <M>{'\\partial L / \\partial w_1 = 1.48'}</M>, <M>{'\\partial L / \\partial w_2 = 0.74'}</M> 를 동시에 얻는다.
          두 gradient 는 동일한 backward sweep 에서 각 노드의 local 미분을 누적한 결과다.
        </p>
      </div>
      <ReverseModeScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">학습 전체 루프</h3>
        <p>
          초기화 → 순전파 → 손실 → 역전파 → 업데이트 → 반복 — 수렴까지 loop.
          매 iteration 의 파라미터 갱신은 위에서 본
        </p>
        <M display>{'\\underbrace{\\theta_{t+1}}_{\\text{다음 step}} = \\underbrace{\\theta_t}_{\\text{현재 step}} - \\underbrace{\\eta}_{\\text{학습률}} \\cdot \\underbrace{\\nabla_\\theta L(\\theta_t)}_{\\text{현재 위치 gradient}}'}</M>
        <ul>
          <li><M>{'t \\in \\mathbb{N}'}</M> — iteration index. 한 번의 forward+backward+update 가 끝날 때마다 +1.</li>
          <li><M>{'\\theta_t \\in \\mathbb{R}^N'}</M> — t 번째 step 의 파라미터 벡터 (그 시점의 모델 상태).</li>
          <li><M>{'\\nabla_\\theta L(\\theta_t) \\in \\mathbb{R}^N'}</M> — 현재 파라미터 <M>{'\\theta_t'}</M> 에서 평가한 gradient (backward pass 의 결과물).</li>
          <li><M>{'\\eta \\in \\mathbb{R}^+'}</M> — 학습률. 너무 크면 발산, 너무 작으면 수렴 느림.</li>
        </ul>
        <p>
          Optimizer (Adam, SGD-momentum 등) 는 이 <M>{'\\eta'}</M> 와 gradient 조합을 더 영리하게 다루는 변형이다 —
          예컨대 momentum 은 과거 gradient 의 EMA 를 누적해 진동을 줄이고, Adam 은 1·2 차 모멘트를 둘 다 추적해 좌표별 step 크기를 자동 조절.
        </p>
      </div>
      <TrainingLoopScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm font-mono text-muted-foreground bg-muted/30 rounded-lg px-4 py-3 mt-4">
          <strong className="text-foreground not-italic">PyTorch 코드:</strong>{' '}
          <code>y_pred = model(x); loss = criterion(y_pred, y)</code><br />
          <code>optimizer.zero_grad(); loss.backward(); optimizer.step()</code>
        </p>
        <p className="leading-7">
          요약 1: Backprop은 <strong>chain rule + dynamic programming</strong> — 효율성의 핵심.<br />
          요약 2: <strong>Reverse mode autodiff</strong>가 신경망에 최적 (VJP vs JVP 비대칭).<br />
          요약 3: <M>{'\\theta \\leftarrow \\theta - \\eta \\nabla_\\theta L'}</M> 의 4단계
          (Forward → Loss → Backward → Update) 가 학습의 본질.
        </p>
      </div>
    </section>
  );
}
