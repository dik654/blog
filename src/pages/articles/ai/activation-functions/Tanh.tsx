import M from '@/components/ui/math';
import TanhViz from './viz/TanhViz';
import TanhDetailViz from './viz/TanhDetailViz';
import LSTMGateViz from './viz/LSTMGateViz';

export default function Tanh() {
  return (
    <section id="tanh" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">하이퍼볼릭 탄젠트 (Tanh)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sigmoid 의 <strong>non-zero centered 문제</strong>를 해결한 변형. 출력 범위가 <M>{'(-1, +1)'}</M> 이라 양·음수 모두 출력 →
          다음 층 가중치 gradient 가 한 부호로 묶이지 않아 sigmoid 의 지그재그 수렴 문제가 사라진다. 정의:
        </p>
        <M display>{'\\tanh(x) = \\frac{\\overbrace{e^{x} - e^{-x}}^{\\sinh x \\text{ (홀함수, 부호 결정)}}}{\\underbrace{e^{x} + e^{-x}}_{\\cosh x \\text{ (짝함수, 양수 보장)}}}'}</M>
        <p>
          여기서 <M>{'x \\in \\mathbb{R}'}</M> 는 입력,
          분자 <M>{'e^x - e^{-x}'}</M> 는 sinh(x) (홀함수, 부호 결정),
          분모 <M>{'e^x + e^{-x}'}</M> 는 cosh(x) (짝함수, 양수 보장).
          극한은 <M>{'\\tanh(-\\infty) = -1,\\; \\tanh(0) = 0,\\; \\tanh(+\\infty) = +1'}</M> — sigmoid 와 달리 원점을 지나는 odd function.
        </p>
        <p>도함수도 출력값으로만 표현된다:</p>
        <M display>{"\\tanh'(x) = 1 - \\underbrace{\\tanh^2(x)}_{\\text{출력 제곱}} \\;\\le\\; \\underbrace{1}_{x=0\\text{에서 최대 (sigmoid의 4배)}}"}</M>
        <p>
          <M>{'\\tanh(0) = 0'}</M> 일 때 <M>{"\\tanh'(0) = 1"}</M> 로 최댓값 — sigmoid 의 0.25 대비 <strong>4 배</strong>의 기울기.
          forward 에서 <M>{'\\tanh(x)'}</M> 한 값만 저장하면 backward 가 곱셈 한 번으로 끝나는 것도 sigmoid 와 같다.
        </p>
        <p>Sigmoid 와의 정확한 관계 — 수직·수평 이동만 하면 동치:</p>
        <M display>{'\\tanh(x) = \\underbrace{2}_{\\text{수직 확대}} \\cdot \\sigma(\\underbrace{2x}_{\\text{수평 압축}}) \\underbrace{- 1}_{\\text{평행 이동}}'}</M>
        <p>
          <M>{'\\sigma(2x)'}</M> 로 입력을 2 배 (수평 압축), <M>{'2 \\sigma(\\cdot) - 1'}</M> 로 출력 범위를 <M>{'(-1, 1)'}</M> 로 늘림 (수직 확대 + 평행이동).
          그래서 도함수도 <M>{"\\tanh'(0) = 4 \\cdot \\sigma'(0) = 4 \\cdot 0.25 = 1"}</M> 로 정확히 4 배.
        </p>
        <p>
          <strong>여전히 남은 문제 — Vanishing Gradient</strong>. <M>{'|x| > 2'}</M> 영역에서 <M>{'\\tanh(x)'}</M> 가 <M>{'\\pm 1'}</M> 에 가까워지면
          <M>{"\\tanh'(x) = 1 - \\tanh^2(x) \\to 0"}</M> 으로 급감. sigmoid 보다 4 배 큰 최댓값이긴 해도 깊이가 충분하면 결국 같은 운명.
          RNN / LSTM 에서 여전히 기본 활성화로 쓰이는 건 다음 절에서 풀이.
        </p>
      </div>
      <div className="not-prose my-8">
        <TanhViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Tanh 특성과 Sigmoid 관계</h3>
        <p>
          tanh 의 핵심 장점 두 가지를 수식으로 못박으면:
          (1) <strong>zero-centered</strong>: <M>{'\\tanh(0) = 0'}</M>, 출력 평균이 양·음수에 균등 분포 →
          다음 층 가중치 gradient 부호가 다양 → sigmoid 의 지그재그 수렴 사라짐.
          (2) <strong>4 배 큰 최대 기울기</strong>: <M>{"\\tanh'(0) = 1"}</M> vs <M>{"\\sigma'(0) = 0.25"}</M> →
          chain rule 곱이 동일 깊이에서 4ⁿ 배 덜 감쇠. 다만 <strong>vanishing 자체는 미해결</strong> (여전히 <M>{"\\tanh' \\to 0"}</M> 양 끝에서).
        </p>
      </div>
      <TanhDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">LSTM 에서 Tanh 역할</h3>
        <p>
          LSTM / GRU 는 sigmoid 와 tanh 를 <strong>역할 분담</strong>해서 쓴다 — 같은 셀 안에서 두 함수가 다른 일을 한다:
        </p>
        <M display>{'\\begin{aligned} f_t &= \\underbrace{\\sigma(W_f [h_{t-1}, x_t] + b_f)}_{\\text{forget gate, } \\in (0,1) \\text{ 밸브}} \\\\ \\tilde{c}_t &= \\underbrace{\\tanh(W_c [h_{t-1}, x_t] + b_c)}_{\\text{candidate, } \\in (-1,1) \\text{ 후보값}} \\\\ c_t &= \\underbrace{f_t \\odot c_{t-1}}_{\\text{과거 보존 비율}} + \\underbrace{i_t \\odot \\tilde{c}_t}_{\\text{새 정보 추가}} \\end{aligned}'}</M>
        <p>
          여기서 <M>{'\\sigma(\\cdot) \\in (0, 1)'}</M> 은 "얼마나 통과시킬지" 를 정하는 게이트 (밸브 비율);
          <M>{'\\tanh(\\cdot) \\in (-1, 1)'}</M> 은 "어떤 값을 더할지" 를 만드는 후보 (방향 + 크기);
          <M>{'\\odot'}</M> 는 element-wise 곱;
          <M>{'c_t'}</M> 는 시간 t 의 cell state, <M>{'h_{t-1}'}</M> 는 직전 hidden state.
          sigmoid 는 출력이 항상 양수라 비율 표현에 자연스럽고, tanh 는 음수 후보까지 만들 수 있어 정보 갱신 방향에 자연스럽다 —
          두 함수의 출력 범위 차이가 LSTM 설계의 핵심.
          Transformer (2017) 등장 전까지 시퀀스 모델의 표준이 이 조합.
        </p>
      </div>
      <LSTMGateViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <M>{'\\tanh(x) = 2\\sigma(2x) - 1'}</M> — sigmoid 의 affine 변환, 수학적 동치.<br />
          요약 2: <strong>zero-centered + 4배 기울기</strong> (<M>{"\\tanh'(0) = 1"}</M>) 로 sigmoid 우월.<br />
          요약 3: LSTM/GRU 의 <strong>sigmoid(gate) + tanh(candidate)</strong> 조합이 필수 패턴.
        </p>
      </div>
    </section>
  );
}
