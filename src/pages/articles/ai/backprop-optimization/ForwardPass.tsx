import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import ForwardPassScene from './viz/ForwardPassScene';
import ForwardMathScene from './viz/ForwardMathScene';

export default function ForwardPass() {
  return (
    <section id="forward-pass" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">순전파: 뉴런의 선형 모델</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        뉴런 하나의 출력은 본질적으로 직선 방정식이다 — <M>{'h = m \\cdot x + b'}</M>.<br />
        여러 뉴런을 하나의 행렬 연산 <M>{'Z = X W + b'}</M> 로 묶어 GPU 가 동시에 처리하도록 만든 것이
        현대 신경망 forward pass 의 전부.
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mt-4 mb-3">뉴런 한 개 — 직선 방정식</h3>
        <p>
          가장 단순한 뉴런은 입력 <M>x</M> 에 기울기 <M>m</M> 을 곱하고 편향 <M>b</M> 를 더한다:
        </p>
        <M display>{'h = \\underbrace{m}_{\\text{slope}} \\cdot \\underbrace{x}_{\\text{input}} + \\underbrace{b}_{\\text{bias}}'}</M>
        <p>
          여기서 <M>x</M> 는 입력 특징 (예: 경도, 스칼라), <M>m</M> 은 학습 가능한 가중치 (기울기 = "이 입력이 뉴런 출력에
          얼마나 강하게 영향을 주는가"), <M>b</M> 는 편향 (입력이 0 일 때 뉴런 기준 출력). 셋 다 스칼라.
          같은 식을 기계학습 관례로 쓰면 <M>m</M> 을 <M>w</M> 로 바꿔 <M>{'h = w x + b'}</M>. 의미는 동일.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">뉴런 여러 개 — 벡터로 확장</h3>
        <p>
          뉴런이 3 개면 가중치 <M>{'w_1, w_2, w_3'}</M> 와 편향 <M>{'b_1, b_2, b_3'}</M> 가 생긴다. 세 뉴런을 동시에 쓰면:
        </p>
        <M display>{'\\underbrace{z_i}_{\\text{pre-activation}} = \\underbrace{w_i}_{\\text{weight}} \\cdot x + \\underbrace{b_i}_{\\text{bias}}, \\quad i \\in \\{1, 2, 3\\}'}</M>
        <p>
          <M>{'z_i'}</M> 는 i 번째 뉴런의 pre-activation (활성화 전 raw 출력). 이를 벡터로 묶어 쓰면
          <M>{'z = w \\cdot x + b \\in \\mathbb{R}^3'}</M> — <M>{'w, b \\in \\mathbb{R}^3'}</M> 이고 <M>x</M> 는 여전히 스칼라.
          뉴런 수가 많아질수록 <M>{'w, b'}</M> 의 차원만 커지고 구조는 그대로다.
        </p>
      </div>

      <p className="text-sm text-muted-foreground mb-2">
        아래 Scene은 입력 하나가 세 뉴런을 통과하며 어떻게 세 개의 <M>{'z_i'}</M> 로 변환되는지 — 직선 방정식의 3 중 병렬.
      </p>
      <ForwardPassScene />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-1">Step 1 — 입력 행렬 구성</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            여러 샘플을 행렬 <M>X</M> 의 각 행에 배치. 예: 3 개 도시 데이터 → <M>{'X \\in \\mathbb{R}^{3 \\times 1}'}</M> 형태.
            한 번의 행렬곱으로 전체 배치 처리.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Step 2 — 가중치·편향 초기화</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <M>W</M> 는 랜덤 초기화 (예: <M>{'\\mathcal{N}(0, \\sigma^2)'}</M>), <M>b</M> 는 0 으로 시작.
            <M>W</M> 의 형상 <M>{'(1 \\times 3)'}</M> 이 뉴런 수를 결정 — 열 수 = 출력 뉴런 수.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">Step 3 — 선형 변환</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <M>{'Z = X W + b'}</M> — 행렬곱 한 줄로 모든 뉴런 계산.
            <M>{'(3 \\times 1) \\cdot (1 \\times 3) \\to (3 \\times 3)'}</M>: 3 개 샘플 × 3 개 뉴런 출력을 동시에 산출.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-1">Step 4 — 활성화 적용</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <M>{'A = \\sigma(Z)'}</M> — 원소별로 적용해 비선형 확률·스코어로 변환. 시그모이드는
            <M>{'\\sigma(z) = 1 / (1 + e^{-z})'}</M>. 비선형 활성화가 없으면 아무리 깊은 층도 단일 선형 변환과 동일.
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">배치 처리 — 행렬곱 한 줄의 의미</h3>
        <p>
          샘플을 하나씩 처리하는 대신 <M>B</M> 개를 모아 <M>{'X \\in \\mathbb{R}^{B \\times d_{\\text{in}}}'}</M> 로 쌓는다.
          가중치는 <M>{'W \\in \\mathbb{R}^{d_{\\text{in}} \\times d_{\\text{out}}}'}</M>, 편향은
          <M>{'b \\in \\mathbb{R}^{d_{\\text{out}}}'}</M>. 그러면 한 층의 출력은:
        </p>
        <M display>{'\\underbrace{Z}_{B \\times d_{\\text{out}}} = \\underbrace{X}_{B \\times d_{\\text{in}}} \\cdot \\underbrace{W}_{d_{\\text{in}} \\times d_{\\text{out}}} + \\underbrace{b}_{d_{\\text{out}}}'}</M>
        <p>
          여기서 <M>{'d_{\\text{in}}'}</M> 은 입력 특징 수 (GPS 예제에서 1), <M>{'d_{\\text{out}}'}</M> 은 뉴런 수 (여기선 3),
          <M>B</M> 는 배치 크기. 편향 <M>b</M> 는 <M>{'(d_{\\text{out}},)'}</M> 인데 행렬 <M>{'XW'}</M> 의 각 행에 broadcast 되어 더해진다 —
          B 개 샘플 모두에 동일한 편향이 적용된다는 뜻. GPU 는 이 하나의 행렬곱 연산을 수천 CUDA 코어로 쪼개 병렬 처리해
          단일 뉴런 for-loop 대비 수백 배 빠르다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">활성화 함수 — 왜 필요한가</h3>
        <p>
          선형 변환만 쌓으면 <M>{'(W_2 (W_1 x + b_1) + b_2) = W_2 W_1 x + (W_2 b_1 + b_2)'}</M>, 즉 결국 단일 선형층과 동일.
          층마다 비선형 함수 <M>{'\\sigma'}</M> 를 끼워 넣어야 모델이 실제로 깊어진다. 자주 쓰는 선택지:
        </p>
        <M display>{'\\underbrace{\\sigma(z) = \\frac{1}{1 + e^{-z}}}_{(0,1)\\ \\text{probability}}, \\quad \\underbrace{\\tanh(z)}_{(-1,1)\\ \\text{zero-centered}}, \\quad \\underbrace{\\mathrm{ReLU}(z)=\\max(0,z)}_{[0,\\infty)\\ \\text{gradient }1}'}</M>
        <p>
          시그모이드는 0~1 로 짜서 확률 해석에 편하지만 양극단에서 gradient 가 0 에 가까워 학습이 얼어붙는 단점
          (vanishing gradient). ReLU 는 <M>{'z > 0'}</M> 에서 gradient 1 로 일정해 깊은 망 학습에 유리하지만
          <M>{'z < 0'}</M> 영역은 dead neuron 이 될 수 있다. 각 선택은 downstream 의 backward 수식과 직결된다 —
          <M>{'\\partial \\sigma / \\partial z'}</M> 의 모양이 학습 dynamics 를 결정한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">다층 신경망 — 재귀 적용</h3>
        <p>
          층이 여러 개면 같은 패턴을 쌓을 뿐이다. <M>l</M> 번째 층의 출력을 <M>{'a^{(l)}'}</M> 로 쓰면:
        </p>
        <M display>{'z^{(l)} = W^{(l)}a^{(l-1)} + b^{(l)}, \\qquad a^{(l)} = \\sigma(z^{(l)})'}</M>
        <FormulaNote
          meaning={'여기서는 column-vector convention을 쓴다. W^(l)의 행 하나가 현재 층의 한 뉴런을 뜻하고, 이전 층 activation a^(l-1) 전체와 내적되어 z^(l)의 한 원소가 된다. σ는 선형 변환 뒤 원소별로 적용되어 층을 여러 번 쌓아도 하나의 선형식으로 접히지 않게 만든다.'}
          symbols={[
            ['a^(0)=x', '입력 벡터. 네트워크 첫 단계에서는 원본 특징이 그대로 이전 activation이다.'],
            ['a^(l-1) ∈ R^{n_(l-1)}', '이전 층 출력. 현재 층이 읽는 특징 개수는 n_(l-1)이다.'],
            ['W^(l) ∈ R^{n_l × n_(l-1)}', '현재 층 가중치. 행 수 n_l은 현재 층 뉴런 수, 열 수 n_(l-1)은 이전 층 출력 크기다.'],
            ['b^(l), z^(l), a^(l) ∈ R^{n_l}', '편향, 활성화 전 값, 활성화 후 값은 모두 현재 층 뉴런 수만큼 생긴다.'],
            ['σ(z)', 'ReLU, sigmoid, tanh 같은 활성화. 선형층 사이에 비선형 꺾임을 넣는 역할이다.'],
          ]}
        />
        <p>
          <M>{'a^{(0)} = x'}</M> (입력), 마지막 층 <M>L</M> 의 출력 <M>{'a^{(L)}'}</M> 이 최종 예측. 각 <M>{'W^{(l)}'}</M> 은
          층마다 독립적인 가중치 행렬이고 <M>{'b^{(l)}'}</M> 는 편향 벡터. backward 에서는 이 <M>{'a^{(l)}, z^{(l)}'}</M> 가
          모두 저장되어 있어야 chain rule 을 끝까지 내려갈 수 있다 — 뒤 섹션에서 다시 등장한다.
          위쪽 배치 식 <M>{'Z=XW+b'}</M> 는 샘플을 행으로 쌓는 구현 표기라 <M>{'W\\in\\mathbb R^{d_{in}\\times d_{out}}'}</M> 를 쓴다.
          지금 다층 식은 column-vector 표기라 같은 변환을 <M>{'W^{(l)}\\in\\mathbb R^{n_l\\times n_{l-1}}'}</M> 로 쓴다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">순전파 수학 — 뉴런에서 배치까지</h3>
        <p>
          단일 뉴런의 직선 방정식 <M>{'h = w x + b'}</M> → 층 단위 벡터식 <M>{'z = W x + b'}</M> → 배치 단위
          행렬식 <M>{'Z = X W + b'}</M> → 비선형 <M>{'A = \\sigma(Z)'}</M>. 개념적으로는 같은 식의 차원 확장이지만,
          구현에서는 이 "한 번의 행렬곱" 이 GPU 에서 극도로 최적화되어 있어 실제 학습 속도를 결정한다.
        </p>
      </div>
      <p className="text-sm text-muted-foreground mt-4 mb-2">
        아래 Scene은 스칼라 → 벡터 → 행렬의 축 확장을 한 화면에 겹쳐 차원이 어떻게 불어나는지 추적한다.
      </p>
      <ForwardMathScene />
    </section>
  );
}
