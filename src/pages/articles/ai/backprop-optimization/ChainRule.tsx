import M from '@/components/ui/math';
import ChainRuleScene from './viz/ChainRuleScene';
import ChainRuleMathScene from './viz/ChainRuleMathScene';
import ComputationalGraphScene from './viz/ComputationalGraphScene';

export default function ChainRule() {
  return (
    <section id="chain-rule" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연쇄 법칙: 층별로 미분</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        신경망 loss <M>{'L'}</M> 은 수많은 함수 합성으로 이뤄진다 — <M>{'L = \\ell \\circ \\mathrm{softmax} \\circ W_L \\circ \\cdots \\circ W_1(x)'}</M>.<br />
        이걸 한 번에 미분하려 하면 폭발하지만, 각 층의 local 미분을 곱해가면 기계적으로 풀린다.<br />
        핵심 관계식: <M>{'\\frac{\\partial L}{\\partial m} = \\frac{\\partial L}{\\partial h} \\cdot \\frac{\\partial h}{\\partial m}'}</M> — 역전파의 본질.
      </p>
      <ChainRuleScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">연쇄 법칙 — 수학에서 VJP까지</h3>
        <p>
          일변수에서 <M>{'y = f(g(x))'}</M> 의 미분은 다음과 같이 전개된다:
        </p>
        <M display>{'\\frac{dy}{dx} = \\underbrace{\\frac{dy}{du}}_{\\text{upstream (u→y 전달률)}} \\cdot \\underbrace{\\frac{du}{dx}}_{\\text{local (x→u 전달률)}}, \\quad u = g(x)'}</M>
        <p>
          여기서 <M>{'u'}</M> 는 중간 변수 (intermediate);
          <M>{'dy/du'}</M> 는 <M>{'u'}</M> 가 움직일 때 <M>{'y'}</M> 의 변화율 (upstream);
          <M>{'du/dx'}</M> 는 <M>{'x'}</M> 가 움직일 때 <M>{'u'}</M> 의 변화율 (local).
          직관은 "x 를 조금 흔들었을 때 u 가 얼마나 움직이고, 그 u 변화가 y 에 얼마나 전달되는지" — 두 전달률의 곱이 전체 전달률.
        </p>
        <p><strong>다층 합성</strong>으로 확장하면, <M>{'L = f_n(f_{n-1}(\\cdots f_1(x)))'}</M> 에 대해</p>
        <M display>{'\\frac{\\partial L}{\\partial x} = \\underbrace{\\frac{\\partial L}{\\partial h_n}}_{\\text{출력 시드}} \\cdot \\underbrace{\\frac{\\partial h_n}{\\partial h_{n-1}} \\cdot \\frac{\\partial h_{n-1}}{\\partial h_{n-2}} \\cdots \\frac{\\partial h_1}{\\partial x}}_{\\text{n개 층의 local 미분 곱}}'}</M>
        <p>
          <M>{'h_k'}</M> 는 k 번째 층의 출력 (activation);
          각 인수는 인접 두 층 사이의 local 미분;
          전체는 그 곱. n 이 커도 순차적으로 곱하기만 하면 된다 — 이것이 O(층수) 복잡도의 근거.
        </p>
        <p>
          <strong>다변수·벡터 확장</strong>: 입력·출력이 벡터면 스칼라 미분 대신 <strong>Jacobian</strong> 이 등장한다.
          <M>{'\\mathbf{h} = f(\\mathbf{x}), \\; \\mathbf{x} \\in \\mathbb{R}^n, \\; \\mathbf{h} \\in \\mathbb{R}^m'}</M> 이면
        </p>
        <M display>{'\\underbrace{J_f}_{\\text{Jacobian 행렬}} = \\frac{\\partial \\mathbf{h}}{\\partial \\mathbf{x}} \\in \\underbrace{\\mathbb{R}^{m \\times n}}_{\\text{출력 m × 입력 n}}, \\quad \\underbrace{(J_f)_{ij}}_{\\text{(i,j) 성분}} = \\frac{\\partial h_i}{\\partial x_j}'}</M>
        <p>
          Jacobian 은 모든 입력-출력 쌍의 편미분을 담은 행렬. 합성의 미분은 행렬 곱이 된다:
        </p>
        <M display>{'J_{f \\circ g}(\\mathbf{x}) = J_f(g(\\mathbf{x})) \\cdot J_g(\\mathbf{x})'}</M>
        <p>
          그런데 딥러닝에서 loss <M>{'L'}</M> 은 스칼라이므로 최상단의 "Jacobian" 은 <M>{'1 \\times m'}</M> 벡터 — 바로 gradient.
          이 때 <strong>Jacobian 전체를 구성할 필요 없이, 벡터 × Jacobian 연산 (VJP, vector-Jacobian product) 만 하면 된다</strong>:
        </p>
        <M display>{'\\underbrace{\\mathbf{v}^\\top J_f}_{\\text{VJP — Jacobian 명시 안 함}}, \\quad \\underbrace{\\mathbf{v} = \\frac{\\partial L}{\\partial \\mathbf{h}}}_{\\text{출력 쪽 gradient}} \\in \\mathbb{R}^m'}</M>
        <p>
          이게 reverse-mode autodiff 의 수학적 핵심 — Jacobian 을 explicit 하게 만들지 않고 한 줄의 VJP 연산으로 gradient 를 뒤로 흘려보낸다.
          PyTorch 의 각 연산은 forward 함수 옆에 "이 연산의 VJP" 를 짝으로 구현하고 있다.
        </p>
        <p>아래 Scene은 일변수 chain → 다변수 Jacobian → VJP 의 추상화 단계를 단계적으로 보여준다.</p>
      </div>
      <ChainRuleMathScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Computational Graph 관점</h3>
        <p>
          신경망 전체를 <strong>computational graph</strong> 로 보면 chain rule 이 기계적 절차가 된다 — 각 노드는 연산 (예: matmul, softmax, relu), 각 엣지는 데이터 (tensor).
          forward 는 그래프를 순방향으로 타고 값을 전파하고, backward 는 역방향으로 gradient 를 누적한다.
        </p>
        <p>구체 예로 2층 네트워크 <M>{'L = \\ell(\\mathrm{softmax}(W_2 \\cdot \\mathrm{relu}(W_1 x)))'}</M> 를 보자. 역전파는 다음처럼 진행된다:</p>
        <M display>{'\\frac{\\partial L}{\\partial W_1} = \\underbrace{\\frac{\\partial L}{\\partial \\mathbf{h}_2}}_{\\text{loss → h₂ (upstream)}} \\cdot \\underbrace{\\frac{\\partial \\mathbf{h}_2}{\\partial \\mathbf{h}_1}}_{\\text{h₂ → h₁ (층 사이 전이)}} \\cdot \\underbrace{\\frac{\\partial \\mathbf{h}_1}{\\partial W_1}}_{\\text{h₁ → W₁ (local)}}'}</M>
        <p>
          <M>{'\\mathbf{h}_1 = \\mathrm{relu}(W_1 x)'}</M>, <M>{'\\mathbf{h}_2 = W_2 \\mathbf{h}_1'}</M>;
          오른쪽부터 읽으면 W_1 부근의 local 미분, 가운데는 층 사이 전이, 왼쪽은 loss 에서 내려온 upstream gradient.
          각 인수는 해당 노드에서 <strong>독립적으로</strong> 계산되므로 autodiff 프레임워크가 노드별 VJP 만 구현하면 임의의 그래프로 자동 확장된다.
        </p>
        <p>
          <strong>Forward 때 저장해야 하는 것</strong>: backward 에서 local 미분을 계산하는 데 필요한 입력 값들.
          예를 들어 <M>{'y = \\mathrm{relu}(x)'}</M> 의 local 미분은 <M>{'\\partial y / \\partial x = \\mathbf{1}[x > 0]'}</M> — 원본 <M>{'x'}</M> (또는 그 부호) 가 필요.
          matmul <M>{'y = W x'}</M> 의 경우 <M>{'\\partial L / \\partial W = (\\partial L / \\partial y) \\cdot x^\\top'}</M> — 입력 <M>{'x'}</M> 가 필요.
          이래서 reverse mode 의 메모리 비용은 "activation 저장" 이 지배한다.
        </p>
        <p>
          PyTorch 의 <code>tensor.backward()</code> 는 이 전체 과정을 자동화한다.
          각 tensor 는 <code>grad_fn</code> 에 자기 생성 연산의 VJP 를 기록하고, backward 호출 시 그래프를 역순회하며 <code>.grad</code> 에 gradient 를 누적한다.
        </p>
        <p>아래 Scene은 forward 저장 → backward 역순회 → <code>.grad</code> 누적의 전 과정을 단계별로 보여준다.</p>
      </div>
      <ComputationalGraphScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 연쇄 법칙이 딥러닝을 가능하게 한 이유</p>
          <p>
            <strong>복잡도의 기적</strong>: n 층 네트워크의 gradient 를 naive 하게 숫자 차분으로 구하면 각 파라미터마다 forward 한 번 — <M>{'O(N_{\\mathrm{params}} \\cdot N_{\\mathrm{layers}})'}</M>.
            chain rule + reverse-mode 는 <M>{'O(N_{\\mathrm{layers}})'}</M> 로 끝낸다. 파라미터 수와 무관.
            GPT-4 수준의 <M>{'\\sim 10^{12}'}</M> 파라미터에서 이 차이는 "불가능 vs 가능".
          </p>
          <p className="mt-2">
            <strong>대안은 없다</strong>: 모든 가중치 조합을 시도하는 grid search 는 <M>{'O(2^n)'}</M>.
            유전 알고리즘·진화 전략은 gradient-free 지만 딥러닝 스케일에서 수렴 속도가 압도적으로 느리다.
            <strong>Backprop = chain rule 을 computational graph 에 체계적으로 적용한 것</strong> — 현재까지의 유일한 실용해.
          </p>
          <p className="mt-2">
            <strong>Vanishing/Exploding Gradient</strong>: chain rule 은 많은 local gradient 의 곱이므로:
            <M display>{'\\underbrace{\\left\\| \\frac{\\partial L}{\\partial h_1} \\right\\|}_{\\text{초기층 gradient 크기}} \\approx \\underbrace{\\prod_{k=1}^{n} \\left\\| \\frac{\\partial h_{k+1}}{\\partial h_k} \\right\\|}_{\\text{n 개 층의 local Jacobian norm 곱}}'}</M>
            각 항이 &lt; 1 이면 지수적 감소 (vanishing — 초기층 학습 불가),
            각 항이 &gt; 1 이면 지수적 증가 (exploding — 수치 폭발).
          </p>
          <p className="mt-2">
            <strong>현대적 해법</strong>:<br />
            - ReLU: sigmoid/tanh 의 포화 구간 대신 <M>{'\\partial/\\partial x = 1'}</M> (for x&gt;0) 로 gradient 보존<br />
            - Residual connection: <M>{'h_{k+1} = h_k + f(h_k)'}</M> → local Jacobian <M>{'I + J_f'}</M>, <M>{'I'}</M> 덕분에 gradient flow 확보<br />
            - BatchNorm/LayerNorm: 각 층 입력 분포를 정규화해 Jacobian magnitude 안정<br />
            - Gradient clipping: explosion 시 norm 으로 잘라냄
          </p>
        </div>

      </div>
    </section>
  );
}
