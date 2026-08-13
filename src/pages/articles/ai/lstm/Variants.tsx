import ExplainedFormula from "@/components/ui/explained-formula";
import RecurrentChoiceViz from "./viz/RecurrentChoiceViz";

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">GRU와 다른 변형은 state·gate·parallelism 예산을 다시 배분한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GRU(Gated Recurrent Unit)는 별도의 cell state 없이 hidden state 하나에서
          retention과 candidate update를 섞는다. LSTM의 네 affine block보다 적은 세
          block을 사용해 같은 input·hidden size에서 parameter와 recurrent state가
          줄어들지만, 어느 unit이 더 정확한지는 dependency와 data scale, kernel
          implementation에 따라 달라진다.
        </p>
      </div>

      <ExplainedFormula
        question="Cell state를 따로 두지 않고 기존 hidden과 candidate를 어떻게 보간할까?"
        idea={<>Update gate zₜ가 기존 state와 candidate 사이의 element-wise interpolation 비율을 정하고, reset gate rₜ는 candidate를 만들 때 과거 state를 얼마나 볼지 조절합니다.</>}
        formula={String.raw`\begin{aligned}r_t&=\sigma(W_r x_t+U_r h_{t-1}+b_r)\\z_t&=\sigma(W_z x_t+U_z h_{t-1}+b_z)\\\widetilde h_t&=\tanh(W_hx_t+U_h(r_t\odot h_{t-1})+b_h)\\h_t&=(1-z_t)\odot h_{t-1}+z_t\odot\widetilde h_t\end{aligned}`}
        terms={[
          { symbol: "r_t", name: "reset gate", description: "Candidate 계산에서 이전 hidden state의 contribution을 조절합니다." },
          { symbol: "z_t", name: "update gate", description: "기존 state와 새 candidate 사이의 interpolation 비율입니다." },
          { symbol: "\\widetilde h_t", name: "candidate state", description: "현재 input과 gated history에서 만든 새 내용입니다." },
          { symbol: "h_t", name: "single recurrent state", description: "Memory와 공개 output 역할을 한 vector가 함께 맡습니다." },
        ]}
        assumptions={["Cho 등의 GRU 계열 표기 중 하나이며 reset 적용 위치와 update convention은 구현마다 다를 수 있습니다.", "LSTM과 공정하게 비교하려면 hidden size가 아니라 parameter·FLOP·state memory budget을 맞춥니다."]}
        interpretation="z가 0이면 과거를 유지하고 1이면 candidate로 교체한다. LSTM의 input·forget gate를 하나의 interpolation policy로 결합한 것으로 볼 수 있지만 완전히 같은 parameterization은 아닙니다."
      />

      <RecurrentChoiceViz />

      <div id="paper-gru" className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · Learning Phrase Representations using RNN Encoder–Decoder</p>
        <h3 className="mt-2 text-base font-bold">GRU는 LSTM을 줄인 이름이 아니라 state와 gate를 다시 parameterize한 recurrent unit이다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Cho 등은 phrase representation을 학습하는 encoder–decoder와 reset·update gate를 가진 hidden unit을 제안했습니다. 논문의 machine-translation phrase scoring 결과는 해당 pipeline의 근거이며, GRU가 모든 sequence task에서 LSTM보다 작고 빠르면서 정확도도 높다는 보편 비교는 아닙니다.
        </p>
      </div>

      <div id="paper-recurrent-comparison" className="not-prose mt-6 scroll-mt-24 border-l border-border/80 pl-4">
        <p className="text-xs font-bold text-primary">논문 해설 · An Empirical Exploration of Recurrent Network Architectures</p>
        <h3 className="mt-2 text-base font-bold">Architecture 비교는 hidden size가 아니라 task·parameter·optimizer 조건까지 함께 읽는다</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          대규모 empirical comparison은 LSTM·GRU와 여러 gated architecture를 다양한 task에서 비교해 어떤 unit도 모든 조건에서 일관되게 우세하지 않음을 보여 줍니다. 이 결론 역시 논문이 탐색한 configuration과 task distribution의 범위이며, 현재 hardware kernel과 현대 model scale의 serving 비용을 직접 측정한 결과는 아닙니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Bidirectional과 stacked는 서로 다른 축을 바꾼다</h3>
        <p>
          Bidirectional LSTM은 같은 sequence를 양방향으로 읽어 각 position에서 과거와
          미래 context를 함께 사용하므로 tagging과 offline encoding에 유리하지만 causal
          generation과 strict streaming에는 사용할 수 없다. Stacked LSTM은 layer depth를
          늘려 timestep 내부의 representation hierarchy를 키우므로 time direction과는
          별개의 선택이다.
        </p>
        <h3>Architecture 이름보다 deployment contract를 비교한다</h3>
        <p>
          LSTM과 GRU는 timestep dependency 때문에 training parallelism이 제한되지만
          streaming inference에서는 고정 크기 state만 넘길 수 있다. Transformer,
          state-space model, RWKV·RetNet 계열은 long-context access와 parallel scan,
          recurrent inference를 서로 다른 방식으로 조합한다. 현대 recurrent model을
          LSTM의 단순 후속 버전으로 묶지 말고 state update, training kernel, causal
          semantics와 memory scaling을 각각 비교한다.
        </p>
        <p>따라서 unit 이름만으로 선택하지 말고 같은 input·output 계약에서 parameter 수, state memory, timestep latency, validation metric을 함께 비교한다.</p>
      </div>
    </section>
  );
}
