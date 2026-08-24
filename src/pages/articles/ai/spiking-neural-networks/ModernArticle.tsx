import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import SpikeLifecycleViz from "./viz/SpikeLifecycleViz";

const categoryRows = [
  ["Model representation", "ANN·Transformer·SNN", "State와 signal을 어떤 형태로 계산하는가"],
  ["Gradient algorithm", "Backprop·BPTT·surrogate gradient", "Loss의 parameter derivative를 어떻게 근사·계산하는가"],
  ["Update rule", "SGD·Adam·local plasticity", "계산한 signal로 weight를 어떻게 바꾸는가"],
  ["Hardware substrate", "GPU·digital neuromorphic·mixed-signal", "연산과 state를 어떤 회로에서 실행하는가"],
] as const;

export default function SpikingNeuralNetworksArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader number="00" eyebrow="먼저 category를 맞추기" title="SNN은 model 표현이고 backpropagation은 gradient 계산법이므로 서로의 대안이라고 바로 비교할 수 없다">
          Spiking Neural Network(SNN)는 시간이 흐르며 membrane state를 누적하고 threshold를 넘을 때 spike event를 내는 network입니다. 이 network도 surrogate derivative를 사용해 BPTT로 학습할 수 있습니다. 따라서 비교는 <strong>ANN 대 SNN</strong>, 또는 <strong>backprop 대 local learning rule</strong>처럼 같은 층에서 해야 합니다.
        </LessonHeader>
        <TermLesson name="Spiking Neural Network" oneLine="연속 activation 하나 대신 시간별 membrane state와 sparse spike event를 사용해 정보를 계산·전달하는 dynamical neural network입니다." shape="input events → membrane integration → threshold spike → reset → next time step" example="[0,0,1,0,1]처럼 발화 시점이 output이고, 발화하지 않은 시간에도 neuron state는 남을 수 있습니다." boundary="Spike를 쓴다는 이유만으로 생물학적 뇌를 충실히 재현하거나 energy가 항상 줄어드는 것은 아닙니다." />
        <div className="not-prose overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead className="bg-muted/20"><tr>{["층위", "예", "답하는 질문"].map((cell) => <th key={cell} className="border-b border-border px-4 py-3 font-black">{cell}</th>)}</tr></thead>
            <tbody>{categoryRows.map(([layer, examples, question]) => <tr key={layer} className="border-b border-border last:border-b-0"><td className="px-4 py-3 font-black">{layer}</td><td className="px-4 py-3 text-muted-foreground">{examples}</td><td className="px-4 py-3 text-muted-foreground">{question}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section id="lif-dynamics" className="space-y-6">
        <LessonHeader number="01" eyebrow="Neuron state" title="LIF neuron은 이전 전압을 조금 잊고 현재 input을 더한 뒤 threshold를 검사한다">
          Leaky Integrate-and-Fire(LIF)의 핵심은 state가 있는 threshold unit입니다. Leak은 오래된 전압을 줄이고, input current가 다시 쌓이면 spike를 낸 뒤 reset합니다. Spike sequence의 의미는 rate·정확한 timing·latency code 등 encoding 선택에 따라 달라집니다.
        </LessonHeader>
        <TermLesson name="LIF membrane-state transition" oneLine="이전 membrane potential을 retention β로 남기고 현재 input을 더한 뒤, 이전 spike만큼 threshold를 빼 reset하는 discrete-time state update입니다." shape="uₜ₋₁ → leak β → + input Iₜ → threshold H → spike sₜ → reset" example="β=.8, uₜ₋₁=.6, Iₜ=.7, θ=1이면 reset 전 전압은 1.18이어서 spike=1입니다." boundary="LIF는 point-neuron abstraction이며 dendrite·neurotransmitter·cell type·structural plasticity를 모두 모델링하지 않습니다." />
        <SpikeLifecycleViz />
        <ExplainedFormula
          question="한 time step에서 membrane state와 spike를 어떤 순서로 갱신할까요?"
          idea="이전 전압을 leak하고 input을 더하되, 직전 spike가 있었다면 threshold만큼 reset한 뒤 현재 threshold crossing을 이진 event로 만듭니다."
          formula={String.raw`u_t=\beta u_{t-1}+I_t-s_{t-1}\theta,\qquad s_t=H(u_t-\theta)`}
          annotatedFormula={String.raw`u_t=\underbrace{\beta u_{t-1}}_{\text{이전 membrane state를 leak 후 보존}}+\underbrace{I_t}_{\text{현재 synaptic input 누적}}-\underbrace{s_{t-1}\theta}_{\text{직전 발화만큼 reset}},\qquad s_t=\underbrace{H(u_t-\theta)}_{\text{threshold를 넘으면 spike 1}}`}
          operations={[
            { expression: String.raw`\beta u_{t-1}`, annotation: ["이전 전압에 0–1 retention을 곱해", "시간이 지날수록 과거 input을 leak"] },
            { expression: String.raw`\beta u_{t-1}+I_t`, annotation: ["남은 전압과 현재 input을 더해", "이번 step의 membrane evidence 누적"] },
            { expression: String.raw`s_{t-1}\theta`, annotation: ["직전 spike가 1일 때 threshold를 빼", "발화 뒤 state reset"] },
            { expression: String.raw`H(u_t-\theta)`, annotation: ["현재 전압과 threshold를 비교해", "이산 spike event 생성"] },
          ]}
          terms={[
            { symbol: String.raw`u_t`, name: "membrane potential", description: "Time t의 neuron state입니다." },
            { symbol: String.raw`\beta`, name: "leak retention", description: "한 step 뒤 이전 전압을 얼마나 남길지 정하는 0–1 coefficient입니다." },
            { symbol: String.raw`I_t`, name: "input current", description: "이번 step의 weighted spike·external input 합입니다." },
            { symbol: String.raw`\theta`, name: "firing threshold", description: "Spike가 발생하는 전압 경계이자 reset-by-subtraction 크기입니다." },
          ]}
          assumptions={["식은 discrete-time reset-by-subtraction LIF의 한 변형입니다.", "Reset-to-zero·soft reset·refractory period 등 구현마다 update가 달라질 수 있습니다.", "β와 time step Δt는 underlying time constant와 함께 정해야 합니다."]}
          interpretation="SNN output은 spike만이 아니라 spike를 만든 membrane trajectory에도 의존합니다. Event가 sparse해도 state update·time discretization 비용이 0이 되지는 않습니다."
        />
        <AlgorithmBlock
          title="LIF layer의 T-step forward simulation"
          input={["input spike/current sequence I[1:T]", "weights W", "retention β", "threshold θ", "initial membrane u₀"]}
          steps={[
            { code: "u ← u₀; s ← 0", note: "Batch·neuron shape의 persistent state를 초기화합니다." },
            { code: "current ← W · I[t]", note: "Input event가 있는 connection만 계산할지는 hardware/runtime에 달려 있습니다." },
            { code: "u ← β ⊙ u + current − s ⊙ θ", note: "Leak·integration·previous-spike reset을 같은 time step convention으로 적용합니다." },
            { code: "s ← H(u − θ)", note: "Forward에서는 hard threshold로 0/1 event를 만듭니다." },
            { code: "record(s, u) according to loss and backward policy", note: "BPTT라면 backward에 필요한 state 또는 checkpoint를 보존합니다." },
          ]}
          repeatUntil="t=1부터 T까지 동일한 state transition을 반복합니다."
          output="spike sequence s[1:T] + final membrane state uT"
        />
      </section>

      <section id="surrogate-gradient" className="space-y-6">
        <LessonHeader number="02" eyebrow="Non-differentiable threshold" title="Forward의 hard spike는 유지하고 backward에서만 부드러운 surrogate slope를 빌린다">
          Step function은 threshold 밖에서 derivative가 0이고 threshold에서 정의되지 않습니다. Surrogate-gradient training은 forward event를 soft probability로 바꾸지 않고, backward chain rule에만 threshold 주변의 nonzero slope를 넣습니다.
        </LessonHeader>
        <TermLesson name="Surrogate-gradient spike training" oneLine="Hard threshold의 exact derivative 대신 threshold 주변에서만 큰 smooth derivative를 정의해 gradient-based training을 가능하게 하는 straight-through 계열 방법입니다." shape="forward: s=H(u−θ) · backward: ∂s/∂u≈g̃(u−θ)" example="u가 θ에 가까우면 큰 slope, 멀면 작은 slope를 주어 발화 경계를 옮길 weight에 신호를 보냅니다." boundary="가짜 derivative는 original hard function의 exact gradient가 아니며 shape·width가 optimization bias를 만듭니다." />
        <ExplainedFormula
          question="Derivative가 없는 spike threshold를 backward에서는 어떻게 통과할까요?"
          idea="Forward는 0/1 step을 그대로 사용하되 backward graph에서만 threshold 거리의 fast-sigmoid derivative를 예시 surrogate로 넣습니다."
          formula={String.raw`s_t=H(u_t-\theta),\qquad \frac{\partial s_t}{\partial u_t}\approx \widetilde g(u_t-\theta)=\frac{1}{(1+\alpha|u_t-\theta|)^2}`}
          annotatedFormula={String.raw`s_t=\underbrace{H(u_t-\theta)}_{\text{forward의 hard spike}},\qquad \frac{\partial s_t}{\partial u_t}\approx\underbrace{\frac{1}{(1+\alpha|u_t-\theta|)^2}}_{\substack{\text{backward에서 threshold 가까이는 크게}\text{멀어질수록 작게 주는 surrogate slope}}}`}
          operations={[
            { expression: String.raw`H(u_t-\theta)`, annotation: ["전압과 threshold의 부호를 검사해", "forward event를 0 또는 1로 유지"] },
            { expression: String.raw`|u_t-\theta|`, annotation: ["현재 전압과 발화 경계의 거리를 재서", "surrogate slope의 크기 결정"] },
            { expression: String.raw`\frac{1}{(1+\alpha|u_t-\theta|)^2}`, annotation: ["threshold에서 멀수록 분모를 키워", "backward 신호를 국소화"] },
          ]}
          terms={[
            { symbol: "H", name: "Heaviside step", description: "Forward에서 hard spike를 만드는 불연속 함수입니다." },
            { symbol: String.raw`\widetilde g`, name: "surrogate derivative", description: "Backward에만 사용하는 smooth slope입니다." },
            { symbol: String.raw`\alpha`, name: "surrogate sharpness", description: "Threshold 주변 gradient 폭을 조절합니다." },
          ]}
          assumptions={["제시한 fast-sigmoid 형태는 여러 surrogate 중 한 예입니다.", "Forward reset과 temporal state graph는 hard spike 결과를 사용합니다.", "Surrogate 선택·time step·gradient clipping을 validation해야 합니다."]}
          interpretation="Surrogate gradient는 미분 불가능성을 없앤 수학적 동일식이 아니라 useful biased gradient estimator입니다. ‘단사 미분’이 아니라 surrogate differentiation 또는 surrogate gradient라고 부릅니다."
        />
        <div id="paper-superspike" className="scroll-mt-24"><CitationBlock source="SuperSpike: Supervised Learning in Multi-layer Spiking Neural Networks" citeKey={1} href="https://arxiv.org/abs/1705.11146"><EvidenceGrid problem="Deterministic spike의 불연속성 때문에 multilayer error credit을 전달하기 어려운 문제" contribution="Voltage-based surrogate gradient로 multilayer SNN을 학습하는 SuperSpike rule" assumptions="논문의 integrate-and-fire model·task·loss·eligibility trace 조건" scope="보고된 spatiotemporal pattern experiment와 learning-rule derivation" notClaim="모든 SNN task에서 동일 surrogate가 최적이거나 생물학적 뇌가 이를 구현한다는 주장" /></CitationBlock></div>
      </section>

      <section id="bptt" className="space-y-6">
        <LessonHeader number="03" eyebrow="Time credit assignment" title="Membrane state를 시간축으로 펼치면 SNN도 recurrent graph가 되고 BPTT를 적용할 수 있다">
          uₜ가 uₜ₋₁에 의존하므로 loss의 영향은 time step을 거슬러 이동합니다. Surrogate slope는 spike node의 local derivative를 제공하고, BPTT는 그 local derivative와 membrane Jacobian을 시간 순서로 합성합니다.
        </LessonHeader>
        <TermLesson name="Spiking BPTT unroll" oneLine="T개 membrane transition과 spike decision을 recurrent graph로 펼치고, surrogate local slope를 사용해 마지막 loss부터 이전 time step으로 gradient를 누적하는 학습입니다." shape="u₀ → u₁,s₁ → … → uT,sT → loss · backward T→1" example="Time 3의 spike loss가 time 2 membrane과 같은 shared W에 미친 기여가 time 1의 기여와 합쳐집니다." boundary="긴 T는 saved activation memory와 vanishing/exploding gradient를 늘리며 online local rule과 같지 않습니다." />
        <p className="text-base leading-8 text-muted-foreground">
          BPTT의 Jacobian product·gradient clipping·truncation은 <Link className="text-primary hover:underline" to="/ai/bptt">BPTT 정본</Link>이 소유합니다. SNN이라고 backprop을 버렸다고 말할 수 없는 이유가 여기 있습니다. 실제 training memory는 weights뿐 아니라 T개 membrane·spike·surrogate backward state에 좌우됩니다.
        </p>
      </section>

      <section id="brain-boundary" className="space-y-6">
        <LessonHeader number="04" eyebrow="Biological analogy" title="Spike 형식이 더 닮았다는 사실과 뇌의 학습 mechanism을 재현했다는 주장은 다르다">
          표준 backprop은 global loss, 정확한 chain-rule derivative, forward weight와 정렬된 feedback, 명시적 forward/backward phase를 가정합니다. 생물학적 회로가 같은 계산을 한다는 확립된 증거는 없고, dendritic error·feedback alignment·predictive coding처럼 근사 가능성을 연구하는 여러 가설이 있습니다.
        </LessonHeader>
        <TermLesson name="Hebbian local plasticity" oneLine="Pre·post neuron activity처럼 synapse 주변에서 관측할 수 있는 신호로 연결 강도를 바꾸는 local learning family의 가장 단순한 직관입니다." shape="pre activity xᵢ × post activity xⱼ → local Δwᵢⱼ" example="두 neuron이 같은 시간창에서 함께 활성화되면 positive coefficient 아래 연결을 강화합니다." boundary="‘함께 발화하면 연결된다’는 요약만으로 안정성·competition·credit assignment·실제 STDP를 설명하지 못하며 표준 backprop과 동치가 아닙니다." />
        <ExplainedFormula
          question="가장 단순한 Hebbian update는 어떤 정보만 사용할까요?"
          idea="현재 synapse 양쪽의 pre·post activity를 곱해 같은 부호·동시 활성의 크기만 local weight change에 반영합니다."
          formula={String.raw`\Delta w_{ij}=\eta\,x_i x_j`}
          annotatedFormula={String.raw`\Delta w_{ij}=\underbrace{\eta}_{\text{local plasticity 크기}}\underbrace{x_i x_j}_{\substack{\text{pre·post activity가 함께 클 때}\text{연결 변화량을 크게 만듦}}}`}
          operations={[
            { expression: String.raw`x_i x_j`, annotation: ["synapse 양쪽 activity를 곱해", "local co-activity signal 생성"] },
            { expression: String.raw`\eta x_i x_j`, annotation: ["co-activity에 step size를 곱해", "한 update의 weight 변화량 제한"] },
          ]}
          terms={[
            { symbol: String.raw`w_{ij}`, name: "synaptic weight", description: "Neuron i에서 j로 가는 연결 강도입니다." },
            { symbol: String.raw`x_i,x_j`, name: "local activities", description: "Pre·post neuron에서 관측한 activation 또는 spike trace입니다." },
            { symbol: String.raw`\eta`, name: "plasticity rate", description: "한 번의 local update 크기입니다." },
          ]}
          assumptions={["동시성 window와 activity trace 정의가 고정돼 있습니다.", "Normalization·decay·competition이 없는 단순 update는 weight가 계속 커질 수 있습니다.", "Global task error를 어느 synapse에 배분할지는 이 식만으로 해결되지 않습니다."]}
          interpretation="Hebbian rule은 local signal의 예이지 뇌 전체 학습의 완성 모델이 아닙니다. Pretraining=고전적 조건화, RL=조작적 조건화처럼 일대일 대응시키는 것도 설명 비유의 범위를 넘습니다."
        />
        <div id="paper-brain-backprop" className="scroll-mt-24"><CitationBlock source="Dendritic Cortical Microcircuits Approximate Backpropagation" citeKey={2} href="https://arxiv.org/abs/1810.11393"><EvidenceGrid problem="Global backprop error를 biological local plasticity와 연결하는 credit-assignment 문제" contribution="Dendritic compartment와 local prediction error가 backprop을 근사하는 회로 model" assumptions="논문의 단순화한 pyramidal/interneuron circuit과 regression·classification task" scope="분석한 approximation과 simulation 결과" notClaim="실제 뇌가 표준 backprop을 그대로 수행한다는 증거" /></CitationBlock></div>
      </section>

      <section id="hardware" className="space-y-6">
        <LessonHeader number="05" eyebrow="Energy·substrate" title="저전력 가능성은 sparse event와 data movement를 실제 hardware가 건너뛸 때 생긴다">
          SNN algorithm만 선택한다고 dense GPU kernel의 MAC와 state traffic이 사라지지 않습니다. Event-driven neuromorphic hardware가 spike가 없는 synapse work를 skip하고 memory와 compute를 가까이 둘 때 이점이 나타나며, accuracy·latency·encoding·I/O·process node가 다른 benchmark 배수는 직접 비교할 수 없습니다.
        </LessonHeader>
        <TermLesson name="Neuromorphic efficiency boundary" oneLine="Spike sparsity가 실제 synaptic operation·state access·communication 감소로 이어지는지 end-to-end energy와 task quality를 같은 조건에서 확인하는 측정 경계입니다." shape="input encoding + active events + state update + routing + I/O → joules per accepted task" example="Spike가 10%여도 membrane을 모든 neuron에서 매 tick 갱신하고 input을 rate-code로 길게 늘리면 기대한 절감이 줄 수 있습니다." boundary="특정 chip·dataset의 10×·1000× 수치를 SNN 일반 효율로 옮기지 않습니다." />
        <ExplainedFormula
          question="Event-driven run의 energy를 어떤 항으로 나눠 비교할까요?"
          idea="실제로 처리한 synaptic events와 state updates의 개수에 단위 energy를 곱하고, encoding·routing·I/O의 고정·변동 비용을 따로 더합니다."
          formula={String.raw`E_{\rm run}=N_{\rm event}e_{\rm event}+N_{\rm state}e_{\rm state}+E_{\rm route}+E_{\rm I/O}`}
          annotatedFormula={String.raw`E_{\rm run}=\underbrace{N_{\rm event}e_{\rm event}}_{\text{실제 spike가 만든 synaptic work}}+\underbrace{N_{\rm state}e_{\rm state}}_{\text{membrane state update 비용}}+\underbrace{E_{\rm route}+E_{\rm I/O}}_{\substack{\text{event 전달과 encoding·host 비용을}\text{end-to-end 장부에 포함}}}`}
          operations={[
            { expression: String.raw`N_{\rm event}e_{\rm event}`, annotation: ["처리한 event 수에 event당 energy를 곱해", "sparsity가 줄인 synaptic work 계산"] },
            { expression: String.raw`N_{\rm state}e_{\rm state}`, annotation: ["실행한 state update 수를 따로 세어", "spike가 없어도 남는 temporal 비용 반영"] },
            { expression: String.raw`E_{\rm route}+E_{\rm I/O}`, annotation: ["chip 내부 전달과 외부 encoding 비용을 더해", "kernel 밖 energy 누락 방지"] },
          ]}
          terms={[
            { symbol: String.raw`N_{\rm event}`, name: "processed events", description: "Runtime이 실제로 수행한 synaptic event 수입니다." },
            { symbol: String.raw`N_{\rm state}`, name: "state updates", description: "Membrane·trace를 갱신한 횟수입니다." },
            { symbol: String.raw`e_{\rm event},e_{\rm state}`, name: "unit energies", description: "특정 chip·dtype·mapping에서 측정한 단위 비용입니다." },
            { symbol: String.raw`E_{\rm route},E_{\rm I/O}`, name: "system overhead", description: "Event network와 sensor/host data conversion 비용입니다." },
          ]}
          assumptions={["같은 task accuracy·latency target과 batch·input pipeline을 사용합니다.", "Unit energy는 hardware process·voltage·frequency·mapping마다 다시 측정합니다.", "ANN baseline의 optimized kernel과 end-to-end 범위를 동일하게 맞춥니다."]}
          interpretation="Sparse event는 기회이지 보장된 배수는 아닙니다. 어떤 항을 실제로 skip했고 어떤 temporal·routing 비용이 새로 생겼는지 장부로 확인해야 합니다."
        />
        <div className="not-prose grid gap-5 md:grid-cols-2">
          <div id="paper-loihi" className="scroll-mt-24"><CitationBlock source="Loihi: A Neuromorphic Manycore Processor with On-Chip Learning" citeKey={3} href="https://ieeexplore.ieee.org/document/8259423"><EvidenceGrid problem="Sparse recurrent SNN과 local learning을 programmable manycore에서 실행" contribution="Asynchronous digital neuromorphic architecture와 on-chip learning engine" assumptions="Loihi 14nm research chip·mapped workloads·측정 protocol" scope="논문 architecture와 해당 benchmark의 power·throughput 측정" notClaim="SNN이 analog여야 하거나 모든 ANN보다 일정 배수 효율적이라는 주장" /></CitationBlock></div>
          <div id="paper-brainscales" className="scroll-mt-24"><CitationBlock source="The BrainScaleS-2 Accelerated Neuromorphic System with Hybrid Plasticity" citeKey={4} href="https://arxiv.org/abs/2201.11063"><EvidenceGrid problem="Analog neuron dynamics와 flexible digital plasticity·routing의 결합" contribution="Analog core, digital processors와 event network를 갖춘 mixed-signal system" assumptions="BrainScaleS-2 chip·calibration·accelerated time constants" scope="공개 hardware 구조와 measured applications" notClaim="모든 SNN hardware가 analog이거나 같은 PVT sensitivity를 갖는다는 주장" /></CitationBlock></div>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>SNN algorithm과 analog hardware는 같은 말이 아닙니다</h3>
          <p>
            Loihi처럼 digital event-driven processor도 있고 BrainScaleS-2처럼 analog neuron core와 digital routing·plasticity processor를 합친 mixed-signal system도 있습니다. Process·voltage·temperature(PVT) variation은 analog circuit의 threshold·time constant와 calibration에 중요한 조건이지만, 이 문제를 SNN 전체의 필연적 속성으로 확대하면 안 됩니다.
          </p>
          <p>
            결론적으로 SNN의 가능성은 dense MAC을 sparse event로 바꾸는 것만이 아니라 workload 모양을 <strong>temporal state update와 event routing</strong>으로 바꾸는 데 있습니다. 기존 Transformer의 KV cache·GEMM·AllReduce 병목과는 다른 accelerator·compiler·measurement가 필요합니다.
          </p>
        </div>
        <ContentBoundary article="spiking-neural-networks" />
      </section>
    </article>
  );
}
