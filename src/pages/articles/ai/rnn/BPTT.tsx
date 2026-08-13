import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";
import BPTTViz from "./viz/BPTTViz";
import RNNGradientMechanismViz from "./viz/RNNGradientMechanismViz";

export default function BPTT() {
  return (
    <section id="bptt" className="mb-20 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">BPTT: 같은 weight가 만든 모든 시간 경로를 역으로 따라간다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Backpropagation through time(BPTT)은 별도의 학습 알고리즘이라기보다, recurrent
          computation을 유한한 시간만큼 펼친 뒤 reverse-mode autodiff를 적용한 것입니다.
          <M>{"W_{hh}"}</M> 한 벌이 모든 transition에 쓰였으므로, 각 시점에서 같은
          parameter로 들어오는 gradient contribution을 더해 한 번 update합니다.
        </p>
      </div>

      <BPTTViz />

      <div id="paper-bptt" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Backpropagation Through Time</p>
        <h3 className="mt-2 text-base font-bold">순환 계산을 시간축의 finite graph로 펼치면 일반 backpropagation으로 미분할 수 있다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Werbos는 differentiable dynamic system을 시간축으로 펼쳐 ordered derivative를 계산하는 BPTT 식과 구현 관점을 정리했습니다. 이는 recurrent network만의 새로운 미분 법칙이라기보다 알려진 transition을 유한 horizon에서 합성한 exact reverse differentiation이며, 무한 stream을 유한 memory로 자동 처리한다는 알고리즘은 아닙니다.
        </p>
      </div>

      <ExplainedFormula
        question="시점 t의 state는 현재 loss와 미래 loss를 동시에 어떻게 받는가?"
        idea={<>현재 output에서 직접 오는 gradient에, 다음 state를 거쳐 되돌아온 gradient를 더합니다. 이 재귀가 sequence 끝에서 시작해 시간 역방향으로 진행됩니다.</>}
        formula={String.raw`\delta_t\equiv\frac{\partial\mathcal{L}}{\partial h_t}=\frac{\partial\ell_t}{\partial h_t}+\left(\frac{\partial h_{t+1}}{\partial h_t}\right)^{\!\top}\delta_{t+1}`}
        terms={[
          { symbol: "\\delta_t", name: "state gradient", description: "전체 loss가 t시점 hidden state에 얼마나 민감한지 나타냅니다." },
          { symbol: "\\partial\\ell_t/\\partial h_t", name: "현재 시점의 직접 경로", description: "t시점 output loss에서 바로 들어오는 gradient입니다." },
          { symbol: "\\partial h_{t+1}/\\partial h_t", name: "recurrent Jacobian", description: "다음 state가 현재 state 변화에 반응하는 linear map입니다." },
        ]}
        interpretation="현재 state의 update는 현재 token만의 오차가 아닙니다. 그 state가 영향을 준 모든 미래 loss가 Jacobian chain을 통해 합쳐집니다."
      />

      <ExplainedFormula
        question="k시점 전의 state까지 학습 신호가 가는 동안 왜 크기가 불안정해질까?"
        idea={<>tanh RNN의 한 transition Jacobian은 recurrent weight와 activation derivative의 곱입니다. 먼 과거로 갈수록 이 matrix가 시간 수만큼 연속해서 곱해집니다.</>}
        formula={String.raw`\frac{\partial h_t}{\partial h_{t-k}}=\prod_{j=t-k+1}^{t}\underbrace{\operatorname{diag}\!\left(1-h_j^2\right)W_{hh}}_{J_j}`}
        terms={[
          { symbol: "J_j", name: "j시점 local Jacobian", description: "tanh derivative와 recurrent matrix를 합친 transition의 미분입니다." },
          { symbol: "1-h_j^2", name: "tanh derivative", description: "state가 ±1에 가까이 포화할수록 0에 가까워집니다." },
          { symbol: "\\prod J_j", name: "시간 방향 matrix product", description: "singular direction마다 크기가 다르게 줄거나 커질 수 있습니다." },
        ]}
        assumptions={["표기 순서는 Jacobian composition을 뜻하며 scalar 곱처럼 교환할 수 없습니다.", "spectral radius 하나만으로 nonlinear trajectory 전체를 정확히 판정할 수는 없습니다."]}
        interpretation="대부분 방향의 배율이 1보다 작으면 vanishing, 일부 방향이 반복해서 1보다 크면 exploding이 생깁니다. Whh뿐 아니라 매 시점 state가 정하는 tanh derivative도 원인입니다."
      />

      <RNNGradientMechanismViz />

      <div id="paper-rnn-gradient" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · On the Difficulty of Training Recurrent Neural Networks</p>
        <h3 className="mt-2 text-base font-bold">문제는 weight 하나가 아니라 trajectory를 따라 반복되는 Jacobian product다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Pascanu·Mikolov·Bengio는 vanishing·exploding gradient를 분석·기하·동역학 관점에서 설명하고 exploding gradient에 global norm clipping을 제안했습니다. 분석은 반복 Jacobian의 방향별 scale을 이해하는 근거이지만, recurrent matrix의 spectral radius 하나만 보고 nonlinear trajectory 전체의 학습 가능성을 판정할 수 있다는 뜻은 아닙니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Gradient clipping은 explosion을 다루는 안전장치다</h3>
        <p>
          전체 gradient norm이 threshold <M>{"c"}</M>를 넘으면 방향은 유지한 채 크기만
          <M>{"c"}</M>로 줄이는 방식이 흔합니다. 이는 큰 update가 parameter를 불안정한
          영역으로 밀어내는 일을 막지만, 이미 작아진 장기 gradient를 되살리지는 않습니다.
          Pascanu·Mikolov·Bengio의 분석도 clipping을 exploding gradient에 대한 직접적인
          대응으로 제안합니다.
        </p>
      </div>

      <ExplainedFormula
        question="gradient 방향은 유지하면서 과도한 update 크기만 제한하려면?"
        idea={<>norm이 threshold 아래면 그대로 두고, 넘을 때만 전체 vector를 같은 비율로 축소합니다.</>}
        formula={String.raw`g_{\text{clip}}=g\cdot\min\!\left(1,\frac{c}{\lVert g\rVert_2}\right)`}
        terms={[
          { symbol: "g", name: "전체 parameter gradient", description: "optimizer update 전에 모은 gradient vector입니다." },
          { symbol: "c", name: "clip threshold", description: "허용할 global norm의 상한입니다." },
        ]}
        interpretation="norm이 c를 넘을 때 크기만 c로 맞춥니다. element별 clipping과는 동작이 다르며, threshold는 training log의 gradient norm 분포를 보고 정합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Truncated BPTT는 state를 전달하되 gradient history를 끊는다</h3>
        <p>
          긴 stream 전체의 graph를 보관하면 activation memory와 backward latency가
          sequence 길이에 비례해 커집니다. Truncated BPTT는 예를 들어 128 token씩
          forward/backward한 뒤 마지막 state 값은 다음 chunk의 초기 state로 넘기지만,
          그 state를 이전 graph에서 detach합니다. 따라서 forward context는 이어져도
          gradient는 truncation boundary를 건너지 못합니다.
        </p>
        <p>
          이 차이는 중요합니다. “RNN이 1만 token을 읽었다”와 “1만 token 떨어진 원인에
          gradient credit을 배정했다”는 같은 말이 아닙니다. truncation 길이는 memory
          budget뿐 아니라 model이 직접 학습할 수 있는 dependency horizon을 정하는
          hyperparameter입니다.
        </p>

        <div id="paper-truncated-bptt" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
          <p className="text-xs font-bold text-primary">논문 해설 · On Training Recurrent Networks with Truncated BPTT</p>
          <h3 className="mt-2 text-base font-bold">Forward에서 본 history와 gradient가 책임을 배정하는 horizon은 다를 수 있다</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Tang과 Glass는 speech-recognition의 online·batch decoding 및 truncated BPTT를 연결해 history 사용 범위를 분석했습니다. 관측 결과는 해당 decoding·lookahead·speech task 조건의 근거이며, truncation 길이가 곧 모든 task에서 model의 실제 memory 길이라는 보편 법칙은 아닙니다.
          </p>
        </div>

        <h3>그래서 LSTM은 곱셈 경로 자체를 다시 설계했다</h3>
        <p>
          initialization, orthogonal recurrent matrix, normalization은 vanilla RNN을
          안정화할 수 있지만 모든 trajectory에서 장기 정보가 보존되지는 않습니다. LSTM은
          cell state에 additive update 경로와 gate를 두어, 중요한 정보가 매 시점 새로운
          nonlinear transform을 반드시 통과하지 않게 합니다. 다음 글에서는 이 경로의
          derivative가 왜 더 직접적인지 식으로 이어갑니다.
        </p>
      </div>

      <div className="not-prose mt-8 flex flex-col gap-3 border-y border-border/70 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">다음 개념: gate가 시간 방향 gradient path를 바꾸는 방법</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">forget·input·output gate를 계산 graph와 derivative로 연결합니다.</p>
        </div>
        <Link to="/ai/lstm" className="shrink-0 text-sm font-bold text-primary hover:underline">LSTM으로 이어서 보기 →</Link>
      </div>
    </section>
  );
}
