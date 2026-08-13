import ExplainedFormula from "@/components/ui/explained-formula";
import LSTMStateContractViz from "./viz/LSTMStateContractViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LSTM은 recurrent state에 data-dependent retention path를 만든다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Vanilla RNN은 같은 nonlinear transition을 시간축으로 반복하므로 먼 과거의
          영향과 gradient가 recurrent Jacobian의 긴 곱을 지나야 한다. LSTM(Long
          Short-Term Memory)은 별도의 cell state C와 multiplicative gate를 두어,
          이전 값을 얼마나 남기고 새 candidate를 얼마나 기록하며 현재 output으로
          얼마나 공개할지를 sample과 timestep마다 조절한다.
        </p>
        <p>
          현재 framework에서 흔히 말하는 “standard LSTM”은 1997년 원 논문의 구조에
          1999–2000년에 제안된 forget gate가 결합된 형태다. 따라서 원 논문의
          constant-error carousel과 현대식 update를 완전히 같은 식으로 설명하면 안
          된다. 현대 LSTM의 direct memory path는 forget gate가 1에 가까울 때 오래
          유지되지만, 무한한 기억이나 vanishing gradient의 완전한 제거를 보장하지 않는다.
        </p>
      </div>

      <LSTMStateContractViz />

      <div id="paper-lstm-original" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Long Short-Term Memory</p>
        <h3 className="mt-2 text-base font-bold">원형 LSTM의 핵심은 현재의 forget 식이 아니라 constant error flow를 위한 memory cell이었다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          1997년 논문은 recurrent error가 급격히 사라지는 문제를 다루기 위해 self-connected memory cell과 input·output gate를 제안했습니다. 현재 framework의 forget gate 포함 식은 이후 확장까지 합친 구조이므로, 원 논문이 현대 LSTM의 모든 gate와 구현 convention을 한 번에 제안했다고 읽으면 안 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="이전 memory와 현재 input에서 만든 새 정보를 한 recurrent state에 어떻게 합칠까?"
        idea={<>이전 cell Cₜ₋₁에는 forget gate fₜ를, candidate gₜ에는 input gate iₜ를 element-wise로 곱한 뒤 더합니다. Additive merge가 보존 경로와 쓰기 경로를 분리합니다.</>}
        formula={String.raw`\begin{aligned}g_t&=\tanh(W_g[x_t,h_{t-1}]+b_g)\\[2pt]C_t&=f_t\odot C_{t-1}+i_t\odot g_t\\[2pt]h_t&=o_t\odot\tanh(C_t)\end{aligned}`}
        terms={[
          { symbol: "C_t", name: "cell state", description: "직접 retention·write 경로를 가진 recurrent memory vector입니다." },
          { symbol: "h_t", name: "hidden state", description: "현재 step의 output이며 다음 gate 계산에도 입력됩니다." },
          { symbol: "g_t", name: "candidate", description: "현재 input과 이전 hidden state에서 만든 signed update입니다." },
          { symbol: "f_t,i_t,o_t", name: "gates", description: "각 channel의 보존·기록·공개 비율입니다." },
        ]}
        assumptions={["현대적인 no-peephole LSTM 표기이며 framework에 따라 state 이름·gate order가 다릅니다.", "모든 gate와 state는 vector이고 ⊙는 element-wise multiplication입니다."]}
        interpretation="C와 h의 분리는 의미 label이 아니라 계산 contract다. C는 additive update를 따라 다음 step으로 전달되고, h는 output gate를 거쳐 model의 다른 layer와 다음 gate에 공개됩니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>한 channel을 끝까지 계산하면 gate의 역할이 분리된다</h3>
        <p>
          Cₜ₋₁=2, fₜ=0.5, iₜ=0.75, gₜ=0.5, oₜ=0.5라면 보존분은
          0.5×2=1이고 기록분은 0.75×0.5=0.375이므로 Cₜ=1.375다. 외부에
          공개되는 값은 cell 자체가 아니라 hₜ=0.5×tanh(1.375)≈0.44다. 이
          예에서 forget gate와 input gate는 cell을 만들고, output gate는 만들어진
          cell 중 얼마를 hidden state로 내보낼지만 정한다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>RNN 글과 역할을 나눈다</h3>
        <p>
          Sequence unroll, shared parameter, BPTT와 truncated BPTT의 일반 원리는
          <a href="/ai/rnn">RNN 정본 글</a>에서 설명한다. 이 글은 그 위에서 LSTM
          cell의 state transition, direct derivative와 architecture 선택만 다룬다.
          시계열 windowing과 data leakage 같은 적용 문제는
          <a href="/ai/lstm-timeseries">LSTM 시계열 파이프라인 글</a>로 분리한다.
        </p>
      </div>
    </section>
  );
}
