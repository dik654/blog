import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import RecurrentStateFlowViz from "./viz/RecurrentStateFlowViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-20 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">RNN의 핵심은 순서가 아니라 state transition이다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          문장의 세 번째 단어를 해석하려면 앞의 두 단어가 무엇이었는지 알아야 합니다.
          일반적인 feed-forward network에 고정 길이 window를 넣을 수도 있지만, window가
          길어질 때마다 입력 차원과 parameter가 달라집니다. Recurrent neural
          network(RNN)는 이 문제를 <strong>고정 크기 hidden state를 다음 시점으로
          전달하는 계산</strong>으로 바꿉니다.
        </p>
        <p>
          여기서 <M>{"h_t"}</M>를 과거 문장의 저장소로 생각하면 곧 오해가 생깁니다.
          cell은 원문 token 전체를 다시 읽지 않고 직전 state <M>{"h_{t-1}"}</M>만 받기
          때문에, 과거는 이 벡터에 남아 있는 정보만큼만 영향을 줍니다. 즉 hidden state는
          task에 유용하도록 학습되는 <strong>손실 압축(lossy summary)</strong>입니다.
        </p>
      </div>

      <TermBreakdown
        title="RNN을 읽기 전에 네 이름을 한 줄씩 고정합니다"
        description="이 네 항을 구분한 뒤에만 하나의 recurrent transition으로 조합합니다."
        items={[
          { term: "현재 입력 xₜ", description: "이번 timestep에 새로 관측한 token embedding이나 sensor vector입니다.", example: "문장 ‘개가 사람을’에서 두 번째 step의 x₂는 ‘사람을’ embedding입니다.", boundary: "과거 전체가 아니라 지금 들어온 한 step입니다." },
          { term: "이전 state hₜ₋₁", description: "직전 step까지의 정보를 H개 좌표로 압축한 vector입니다.", example: "h₁에는 첫 token을 처리한 흔적이 남습니다.", boundary: "원문 token을 주소로 다시 꺼내는 KV 저장소가 아닙니다." },
          { term: "공유 transition fθ", description: "xₜ와 hₜ₋₁를 받아 hₜ를 만드는 같은 계산 규칙입니다.", example: "세 token을 읽어도 Wₓₕ·Wₕₕ·bₕ는 한 벌을 재사용합니다.", boundary: "시간마다 다른 layer 세 개를 학습하는 것이 아닙니다." },
          { term: "새 state hₜ", description: "현재 입력까지 반영한 다음 요약이며 다음 step과 output head에 전달됩니다.", example: "x₂=0이어도 h₁의 영향으로 h₂가 0이 아닐 수 있습니다.", boundary: "무엇을 오래 보존할지는 학습 목적과 state capacity에 달렸습니다." },
        ]}
      />

      <RecurrentStateFlowViz />
      <ContentBoundary article="rnn" />

      <div id="paper-elman" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Finding Structure in Time</p>
        <h3 className="mt-2 text-base font-bold">시간을 별도 좌표로 펼치기보다 이전 처리 결과를 다시 입력으로 돌렸다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Elman의 simple recurrent network는 직전 hidden activation의 복사본을 다음 시점 입력에 제공해 sequence의 시간 구조를 학습했습니다. 논문 실험은 작은 synthetic language와 당시의 network·training 조건에서 recurrent context가 구조를 포착한 근거이며, state가 원문을 손실 없이 저장하거나 임의 길이 dependency를 학습한다는 보장은 아닙니다.
        </p>
      </div>

      <ExplainedFormula
        question="현재 입력과 직전 기억을 같은 크기의 새 state로 어떻게 합칠까?"
        idea={<>두 정보를 각각 linear projection한 뒤 더하고, <M>{"\\tanh"}</M>로 값의 범위를 제한합니다. 같은 transition을 모든 시점에서 반복합니다.</>}
        formula={String.raw`a_t=W_{xh}x_t+W_{hh}h_{t-1}+b_h,\qquad h_t=\tanh(a_t)`}
        annotatedFormula={String.raw`\begin{aligned}
a_t&=\underbrace{W_{xh}x_t}_{\text{현재 input을 hidden 좌표로 투영}}\\
&\quad+\underbrace{W_{hh}h_{t-1}}_{\text{직전 state의 흔적을 전달}}+b_h\\[3pt]
h_t&=\underbrace{\tanh(a_t)}_{\text{합친 증거를 bounded 새 state로 압축}}
\end{aligned}`}
        operations={[
          { expression: String.raw`W_{xh}x_t`, annotation: ["현재 input D개를", "hidden H개 좌표로 옮김"] },
          { expression: String.raw`W_{hh}h_{t-1}`, annotation: ["직전 요약을 변환해", "이번 state에 전달"] },
          { expression: String.raw`\tanh(a_t)`, annotation: ["두 evidence의 합을", "−1과 1 사이 새 state로 압축"] },
        ]}
        terms={[
          { symbol: "x_t\\in\\mathbb{R}^{D}", name: "현재 입력", description: "t번째 token embedding 또는 센서 관측입니다." },
          { symbol: "h_t\\in\\mathbb{R}^{H}", name: "hidden state", description: "지금까지의 입력을 H차원으로 요약한 값입니다." },
          { symbol: "W_{xh}\\in\\mathbb{R}^{H\\times D}", name: "input projection", description: "현재 입력을 state 좌표계로 옮깁니다." },
          { symbol: "W_{hh}\\in\\mathbb{R}^{H\\times H}", name: "recurrent projection", description: "이전 state에서 다음 state로 전달할 정보를 변환합니다." },
        ]}
        assumptions={["vanilla Elman RNN과 tanh activation을 기준으로 합니다.", "batch dimension은 표기를 단순하게 하려고 생략했습니다.", "초기 state h₀는 0 또는 학습 가능한 값으로 둘 수 있습니다."]}
        interpretation="sequence가 길어져도 Wxh와 Whh는 한 벌뿐입니다. 대신 각 다음 state가 직전 state에 의존하므로 time axis 계산을 한꺼번에 끝낼 수 없습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>작은 숫자로 state update 읽기</h3>
        <p>
          한 차원짜리 예로 <M>{"h_t=\\tanh(0.8h_{t-1}+0.5x_t)"}</M>라 하고
          <M>{"h_0=0"}</M>, 입력이 <M>{"x_1=1, x_2=0"}</M>이라고 해봅시다.
          첫 state는 <M>{"h_1=\\tanh(0.5)\\approx0.462"}</M>이고, 다음 입력이 0이어도
          <M>{"h_2=\\tanh(0.8\\times0.462)\\approx0.354"}</M>입니다. 두 번째 출력에는
          첫 입력의 흔적이 남지만, transition을 거치며 크기와 표현이 바뀝니다.
        </p>
        <p>
          이 예는 “RNN은 과거를 기억한다”보다 정확한 설명을 줍니다. 과거 입력은 state
          transition을 통해 감쇠하거나 증폭되고, 여러 feature가 한 벡터에서 섞입니다.
          무엇이 얼마나 오래 남는지는 <M>{"W_{hh}"}</M>, activation derivative, 학습
          objective가 함께 결정합니다.
        </p>
      </div>
    </section>
  );
}
