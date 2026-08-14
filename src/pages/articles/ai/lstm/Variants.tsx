import ExplainedFormula from "@/components/ui/explained-formula";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import GRUFlowViz from "./viz/GRUFlowViz";

export default function Variants() {
  return (
    <section id="state-update" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Reset→candidate→update를 순서대로 조합한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          GRU(Gated Recurrent Unit)는 별도의 cell state 없이 hidden state 하나에서
          retention과 candidate update를 섞는다. LSTM의 네 affine block보다 적은 세
          block을 사용해 같은 input·hidden size에서 parameter와 recurrent state가
          줄어들지만, 어느 unit이 더 정확한지는 dependency와 data scale, kernel
          implementation에 따라 달라진다.
        </p>
      </div>

      <TermBreakdown
        title="GRU 네 줄 식의 물체를 먼저 한 줄씩 고정합니다"
        items={[
          { term: "Reset gate rₜ", description: "Candidate를 만들 때 이전 hidden의 각 channel을 얼마나 허용할지 정합니다.", boundary: "최종 state를 직접 지우는 gate가 아닙니다." },
          { term: "Filtered history mₜ", description: "rₜ⊙hₜ₋₁로 계산한 candidate 전용 과거 입력입니다.", example: "r 좌표가 0이면 그 history 좌표는 candidate projection에 들어가지 않습니다." },
          { term: "Candidate h̃ₜ", description: "현재 input과 filtered history에서 만든 새 내용 후보입니다.", boundary: "아직 최종 hₜ가 아닙니다." },
          { term: "Update gate zₜ", description: "기존 hₜ₋₁와 candidate h̃ₜ 사이를 channel별로 보간합니다.", example: "z=0이면 기존 state를 유지하고 z=1이면 candidate로 교체합니다." },
          { term: "Final state hₜ", description: "유지 항과 기록 항을 더한 single recurrent state입니다.", boundary: "LSTM의 C와 h 두 state 구조와 다릅니다." },
        ]}
      />

      <ExplainedFormula
        question="Cell state를 따로 두지 않고 기존 hidden과 candidate를 어떻게 보간할까?"
        idea={<>Update gate zₜ가 기존 state와 candidate 사이의 element-wise interpolation 비율을 정하고, reset gate rₜ는 candidate를 만들 때 과거 state를 얼마나 볼지 조절합니다.</>}
        formula={String.raw`\begin{aligned}r_t&=\sigma(W_r x_t+U_r h_{t-1}+b_r)\\z_t&=\sigma(W_z x_t+U_z h_{t-1}+b_z)\\\widetilde h_t&=\tanh(W_hx_t+U_h(r_t\odot h_{t-1})+b_h)\\h_t&=(1-z_t)\odot h_{t-1}+z_t\odot\widetilde h_t\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
a_r
  &=\underbrace{W_rx_t}_{\text{현재 input}}
   +\underbrace{U_rh_{t-1}}_{\text{과거 state}}+b_r\\
r_t
  &=\underbrace{\sigma(a_r)}_{\text{0--1 reset 비율}}\\[3pt]
a_z
  &=\underbrace{W_zx_t}_{\text{현재 input}}
   +\underbrace{U_zh_{t-1}}_{\text{과거 state}}+b_z\\
z_t
  &=\underbrace{\sigma(a_z)}_{\text{0--1 update 비율}}\\[3pt]
m_t
  &=\underbrace{r_t\odot h_{t-1}}_{\text{candidate용 과거 mask}}\\
\widetilde h_t
  &=\tanh\!\left(
      \underbrace{W_hx_t}_{\text{현재 내용}}
      +\underbrace{U_hm_t}_{\text{허용 history}}+b_h\right)\\[3pt]
h_t
  &=\underbrace{(1-z_t)\odot h_{t-1}}_{\text{기존 state 유지}}\\
  &\quad+\underbrace{z_t\odot\widetilde h_t}_{\text{새 candidate 기록}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\sigma(W_rx_t+U_rh_{t-1}+b_r)`, annotation: ["현재 입력과 과거 state를 합쳐", "candidate용 reset 비율 생성"] },
          { expression: String.raw`\sigma(W_zx_t+U_zh_{t-1}+b_z)`, annotation: ["유지할 과거와 쓸 새 내용 사이", "각 좌표의 update 비율 생성"] },
          { expression: String.raw`r_t\odot h_{t-1}`, annotation: ["candidate를 만들기 전에", "과거 state를 reset gate로 거름"] },
          { expression: String.raw`\tanh(W_hx_t+U_h(r_t\odot h_{t-1})+b_h)`, annotation: ["현재 입력과 허용된 history를 합쳐", "-1과 1 사이 candidate 생성"] },
          { expression: String.raw`(1-z_t)\odot h_{t-1}`, annotation: ["update하지 않을 비율만큼", "기존 hidden을 그대로 보존"] },
          { expression: String.raw`z_t\odot\widetilde h_t`, annotation: ["update gate가 연 좌표에", "새 candidate 내용을 기록"] },
        ]}
        terms={[
          { symbol: "r_t", name: "reset gate", description: "Candidate 계산에서 이전 hidden state의 contribution을 조절합니다." },
          { symbol: "z_t", name: "update gate", description: "기존 state와 새 candidate 사이의 interpolation 비율입니다." },
          { symbol: "\\widetilde h_t", name: "candidate state", description: "현재 input과 gated history에서 만든 새 내용입니다." },
          { symbol: "h_t", name: "single recurrent state", description: "Memory와 공개 output 역할을 한 vector가 함께 맡습니다." },
          { symbol: "x_t", name: "현재 input", description: "이번 timestep에 새로 들어온 feature vector입니다." },
          { symbol: "h_{t-1}", name: "이전 hidden state", description: "직전 timestep까지의 recurrent memory입니다." },
          { symbol: "W_*,U_*", name: "Input·recurrent projection", description: "W는 현재 input, U는 이전 hidden을 각 gate·candidate 좌표로 투영합니다." },
          { symbol: "b_*", name: "Bias", description: "Input이 0이어도 gate와 candidate의 기본 offset을 학습하게 합니다." },
          { symbol: "a_r,a_z", name: "Gate preactivation", description: "Sigmoid 전의 현재 input·과거 state affine evidence입니다." },
          { symbol: "m_t", name: "Reset-filtered history", description: "Candidate에 허용하도록 reset gate를 곱한 이전 hidden입니다." },
        ]}
        assumptions={["Cho 등의 GRU 계열 표기 중 하나이며 reset 적용 위치와 update convention은 구현마다 다를 수 있습니다.", "LSTM과 공정하게 비교하려면 hidden size가 아니라 parameter·FLOP·state memory budget을 맞춥니다."]}
        interpretation="z가 0이면 과거를 유지하고 1이면 candidate로 교체한다. LSTM의 input·forget gate를 하나의 interpolation policy로 결합한 것으로 볼 수 있지만 완전히 같은 parameterization은 아닙니다."
      />

      <GRUFlowViz />
      <ContentBoundary article="gru" />

      <ExplainedFormula
        question="같은 input·hidden 크기에서 GRU와 LSTM의 parameter·state 예산은 어떻게 다를까?"
        idea={<>각 affine block은 input D개와 이전 hidden H개를 받아 H개 값을 만듭니다. GRU는 세 block과 state H개, LSTM은 네 block과 C·h 두 state를 둡니다.</>}
        formula={String.raw`\begin{aligned}P_{\rm GRU}&=3H(D+H+1)\\P_{\rm LSTM}&=4H(D+H+1)\\M_{\rm state}^{\rm GRU}&=H\,B\\M_{\rm state}^{\rm LSTM}&=2H\,B\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
A&=\underbrace{H(D+H+1)}_{\text{한 affine block}}\\
P_{\rm GRU}&=\underbrace{3}_{\text{affine block 세 묶음}}\,A\\
P_{\rm LSTM}&=\underbrace{4}_{\text{affine block 네 묶음}}\,A\\
M_{\rm state}^{\rm GRU}&=\underbrace{H\,B}_{\text{hidden H개 × B byte}}\\
M_{\rm state}^{\rm LSTM}&=\underbrace{2H\,B}_{\text{cell·hidden 2H개 × B byte}}
\end{aligned}`}
        operations={[
          { expression: String.raw`3H(D+H+1)`, annotation: ["세 affine block의 크기를 더해", "GRU parameter 예산 계산"] },
          { expression: String.raw`4H(D+H+1)`, annotation: ["네 affine block의 크기를 더해", "LSTM parameter 예산 계산"] },
          { expression: String.raw`H\,B`, annotation: ["Hidden 원소 수에 dtype byte를 곱해", "GRU recurrent state byte 계산"] },
          { expression: String.raw`2H\,B`, annotation: ["Cell과 hidden 두 vector를 세어", "LSTM recurrent state byte 계산"] },
        ]}
        terms={[
          { symbol: "D", name: "input width", description: "한 timestep의 input feature 수입니다." },
          { symbol: "H", name: "hidden width", description: "Gate·candidate와 recurrent state의 channel 수입니다." },
          { symbol: "B", name: "bytes per element", description: "Recurrent state tensor dtype의 한 원소 byte 수입니다." },
          { symbol: "3,4", name: "affine block count", description: "GRU의 reset·update·candidate와 LSTM의 forget·input·candidate·output입니다." },
        ]}
        assumptions={["Peephole·projection·normalization이 없는 단일 layer·direction 기본 cell입니다.", "Checkpoint bias layout과 fused-kernel workspace는 별도 receipt로 확인합니다."]}
        interpretation="같은 D=3,H=2면 GRU는 36개, LSTM은 48개 parameter다. 그러나 실제 선택은 같은 task·quality·hardware에서 latency와 state traffic까지 측정해야 합니다."
      />

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
