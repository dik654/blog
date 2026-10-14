import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EvidenceGrid } from "../kimi-k3-shared";
import EnergyBoundaryViz from "./viz/EnergyBoundaryViz";
import HebbianLocalViz from "./viz/HebbianLocalViz";
import SpikeLifecycleViz from "./viz/SpikeLifecycleViz";
import SurrogateGradientViz from "./viz/SurrogateGradientViz";

const categoryRows = [
  {
    question: "숫자를 어떤 형태로 주고받습니까?",
    category: "모델 표현",
    choices: "일반 신경망·Transformer·스파이킹 신경망",
  },
  {
    question: "오차를 이전 계산으로 어떻게 보냅니까?",
    category: "기울기 계산",
    choices: "역전파·시간축 역전파·대체 기울기",
  },
  {
    question: "계산한 신호로 가중치를 어떻게 고칩니까?",
    category: "갱신 규칙",
    choices: "SGD·Adam·국소 가소성 규칙",
  },
  {
    question: "그 계산을 어느 회로에서 실행합니까?",
    category: "실행 하드웨어",
    choices: "GPU·디지털 뉴로모픽·혼합 신호 칩",
  },
] as const;

const decisionRows = [
  {
    signal: "입력 자체가 사건의 시점으로 들어옵니다.",
    implication: "발화 시점을 보존하는 모델 표현을 검토할 이유가 있습니다.",
  },
  {
    signal: "정적인 배열을 GPU에서 큰 배치로 처리합니다.",
    implication: "시간축 반복과 상태 저장이 오히려 비용을 늘릴 수 있습니다.",
  },
  {
    signal: "최종 과제 오차를 낮추는 것이 우선입니다.",
    implication: "대체 기울기와 시간축 역전파를 검증할 수 있습니다.",
  },
  {
    signal: "칩 안에서 온라인으로 국소 갱신해야 합니다.",
    implication:
      "국소 규칙을 쓰되 과제 오차의 귀속 문제를 별도로 해결해야 합니다.",
  },
  {
    signal: "저전력이 목표입니다.",
    implication:
      "발화 수 외에 상태 갱신·전달·입출력을 포함한 줄/정답 에너지를 잽니다.",
  },
] as const;

export default function SpikingNeuralNetworksArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section data-teach-level="1" className="scroll-mt-20">
        <p className="mb-3 text-sm font-semibold text-primary">한 문장 답</p>
        <h2 className="mb-6 text-2xl font-bold">
          스파이킹 신경망은 모은 전압이 문턱을 넘을 때만 1을 보내며,
          저전력·생물학적 학습은 따로 확인해야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            숫자 하나를 바로 다음 층에 넘기는 대신, 작은 전압 통장에 입력을
            조금씩 더한다고 생각해 보겠습니다. 전압이 1을 넘으면 발화 1을 보내고
            통장에서 1을 뺍니다. 넘지 않으면 발화 0을 보내지만 남은 전압은 다음
            시점으로 이어집니다.
          </p>
          <p>
            이 동작을 알면 세 질문이 생깁니다. 0과 1로 끊기는 문턱을 어떻게
            기울기로 학습합니까? 전압이 이전 시점에서 이어질 때 오차는 시간을
            어떻게 거슬러 갑니까? 발화가 드물면 전력도 반드시 줄어듭니까? 같은
            다섯 시점 사례로 세 질문을 이어서 답합니다.
          </p>
        </div>
        <div className="not-prose mt-7 grid gap-3 sm:grid-cols-2">
          {[
            ["시작 전압", "u₀ = 0.6"],
            ["남기는 비율", "β = 0.8"],
            ["발화 문턱", "θ = 1"],
            ["들어오는 값", "[0.7, 0.1, 0.9, 0.3, 0.7]"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border/75 p-4">
              <p className="text-xs font-semibold text-primary">{label}</p>
              <p className="mt-1 break-words font-mono text-sm font-bold">
                {value}
              </p>
            </div>
          ))}
        </div>
        <ContentBoundary article="spiking-neural-networks" />
      </section>

      <section id="lif-dynamics" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          1. 첫 입력 0.7은 남은 전압 0.48과 합쳐져 발화 1을 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 시점에는 이전 전압 0.6의 80%인 0.48만 남깁니다. 여기에 입력 0.7을
            더하면 리셋 전 전압은 1.18입니다. 문턱 1을 넘었으므로 발화 1을 내고
            1을 빼서 다음 전압 0.18을 남깁니다.
          </p>
          <p>
            둘째 시점은 0.18에서 다시 시작합니다. <code>0.18×0.8+0.1</code>은
            0.244이므로 발화하지 않습니다. 이 계산을 다섯 번 반복하면 발화열은
            <code>[1,0,1,0,1]</code>입니다. 아래 그림에서 각 시점의 곱셈·덧셈·
            비교·리셋을 차례대로 확인하십시오.
          </p>
        </div>
        <SpikeLifecycleViz />

        <ExplainedFormula
          question="한 시점의 전압과 발화는 어떤 순서로 바뀝니까?"
          idea={
            <>
              이전 전압 일부와 새 입력을 먼저 더해 리셋 전 전압을 만듭니다. 그
              값이 문턱을 넘었는지 판정한 뒤, 발화했다면 문턱만큼 뺍니다.
            </>
          }
          formula={String.raw`v_t=\beta u_{t-1}+I_t,\qquad s_t=H(v_t-\theta),\qquad u_t=v_t-s_t\theta`}
          annotatedFormula={String.raw`\begin{aligned}v_t&=\underbrace{\beta u_{t-1}}_{\text{남은 이전 전압}}+\underbrace{I_t}_{\text{새 입력}}\\s_t&=\underbrace{H(v_t-\theta)}_{\text{문턱을 넘으면 1}}\\u_t&=\underbrace{v_t-s_t\theta}_{\text{발화했다면 문턱만큼 뺀 다음 전압}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`0.6\times0.8=0.48`,
              annotation: ["이전 전압의 80%만", "첫 시점에 남깁니다."],
            },
            {
              expression: String.raw`0.48+0.7=1.18`,
              annotation: [
                "남은 전압과 새 입력을 더해",
                "리셋 전 전압을 만듭니다.",
              ],
            },
            {
              expression: String.raw`H(1.18-1)=1`,
              annotation: ["리셋 전 전압이 문턱보다 커서", "발화 1을 냅니다."],
            },
            {
              expression: String.raw`1.18-1\times1=0.18`,
              annotation: ["발화했으므로 문턱 1을 빼", "다음 전압을 남깁니다."],
            },
          ]}
          terms={[
            {
              symbol: String.raw`u_t`,
              name: "리셋 뒤 전압",
              description: "다음 시점으로 넘길 뉴런 상태입니다.",
            },
            {
              symbol: String.raw`v_t`,
              name: "리셋 전 전압",
              description: "문턱과 비교할 현재 합계입니다.",
            },
            {
              symbol: String.raw`I_t`,
              name: "입력 전류",
              description: "이번 시점에 들어온 가중 합입니다.",
            },
            {
              symbol: String.raw`s_t`,
              name: "발화",
              description: "현재 문턱 판정의 0 또는 1입니다.",
            },
          ]}
          assumptions={[
            "같은 시점에 문턱을 빼는 subtractive reset을 사용합니다.",
            "β=0.8, θ=1이며 불응기와 전압 하한은 넣지 않습니다.",
            "zero reset이나 한 시점 늦은 reset을 쓰면 같은 입력에서도 전압 기록이 달라집니다.",
          ]}
          interpretation="누설은 과거를 서서히 줄이고, 입력은 현재 증거를 더하며, 리셋은 발화 뒤 남은 양을 다음 시점으로 넘깁니다."
        />

        <AlgorithmBlock
          title="다섯 입력을 같은 LIF 뉴런에 순서대로 넣습니다"
          input={[
            "u=0.6; beta=0.8; threshold=1",
            "inputs=[0.7,0.1,0.9,0.3,0.7]",
          ]}
          steps={[
            {
              code: "v = beta × u + inputs[t]",
              note: "이전 전압에서 남길 양과 지금 입력을 더합니다.",
            },
            {
              code: "s = 1 if v > threshold else 0",
              note: "리셋 전 전압을 문턱과 비교해 발화 0 또는 1을 만듭니다.",
            },
            {
              code: "u = v − s × threshold",
              note: "발화했다면 1을 빼고, 발화하지 않았다면 v를 그대로 남깁니다.",
            },
            {
              code: "append(spikes, s); append(states, u)",
              note: "학습과 해석에 쓸 발화·전압 기록을 같은 시점 번호로 보관합니다.",
            },
            {
              code: "t = t + 1",
              note: "방금 남긴 u가 다음 시점의 이전 전압이 됩니다.",
            },
          ]}
          output="spikes=[1,0,1,0,1]; final_u=0.000928"
          repeatUntil="다섯 입력을 모두 처리할 때까지"
        />
      </section>

      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          2. 이 누설·누적·발화·리셋 계산을 LIF 뉴런이라고 부릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            점 뉴런이 이전 전압을 조금 잊고(leak) 입력을 더합니다(integrate).
            문턱을 넘으면 발화하고(fire) 리셋합니다. 이 모형이
            <strong> 누설 적분 발화(Leaky Integrate-and-Fire, LIF)</strong>
            뉴런입니다. 이런 시간 상태와 이산 발화를 층과 연결로 묶은 계열이
            <strong> 스파이킹 신경망(Spiking Neural Network, SNN)</strong>입니다.
          </p>
          <p>
            발화열 하나도 읽는 규칙에 따라 뜻이 달라집니다. 다섯 시점에서 세 번
            발화했다는 수만 쓰면 <strong>발화율 부호화(rate coding)</strong>
            입니다. 첫 발화가 첫 시점이었다는 지연을 쓰면{" "}
            <strong>최초 발화 시각 부호화(time-to-first-spike coding)</strong>
            입니다. 전체
            <code>[1,0,1,0,1]</code> 순서를 쓰면 정확한 시점 무늬를 보존합니다.
            모델을 비교할 때는 어떤 출력 읽기 규칙을 썼는지 먼저 고정해야
            합니다.
          </p>
        </div>

        <div className="not-prose grid gap-3 md:grid-cols-2">
          {categoryRows.map((row) => (
            <div
              key={row.category}
              className="rounded-xl border border-border/75 p-4"
            >
              <p className="text-xs font-semibold text-primary">
                {row.category}
              </p>
              <p className="mt-2 text-sm font-bold">{row.question}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                비교 대상: {row.choices}
              </p>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
          <p>
            이 구분 때문에 “SNN이 역전파를 대체한다”는 문장은 맞지 않습니다.
            SNN은 값을 나타내고 전달하는 모델 형식입니다. 역전파는 최종 오차를
            이전 계산으로 보내는 방법입니다. 같은 SNN을 시간축 역전파로 학습할
            수도 있고, 국소 가소성 규칙으로 학습할 수도 있습니다.
          </p>
        </div>
      </section>

      <section
        id="surrogate-gradient"
        data-teach-level="4"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          3. 순방향은 0과 1을 유지하고 역방향에만 부드러운 기울기를 빌립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            발화 판정 <code>H(v−θ)</code>는 문턱 아래에서 0이고 위에서 1입니다.
            문턱을 제외한 거의 모든 곳의 정확한 미분은 0이고 문턱에서는 미분이
            정의되지 않습니다. 이 값을 그대로 연쇄 법칙에 넣으면 가중치를 어느
            쪽으로 고칠지 알려 주는 신호가 사라집니다.
          </p>
          <p>
            해결 발상은 앞 계산과 뒤 계산의 규칙을 다르게 두는 것입니다.
            순방향에서는 hard step으로 실제 발화 0 또는 1을 냅니다. 역방향에서는
            문턱과 가까울수록 큰 값을 주는 부드러운 함수의 기울기를 대신 씁니다.
            이를 <strong>대체 기울기(surrogate gradient)</strong>라고 부릅니다.
          </p>
          <p>
            아래 그림은 같은 다섯 전압에 기울기 폭 <code>α=5</code>를
            적용합니다. 다섯째 전압은 문턱에서 0.000928만 떨어져 있어 대체
            기울기가 약 0.990784입니다. 둘째 전압은 0.756 떨어져 있어 약
            0.043767만 남습니다.
          </p>
        </div>
        <SurrogateGradientViz />

        <ExplainedFormula
          question="hard step을 유지하면서 어떻게 역방향 신호를 보냅니까?"
          idea={
            <>
              문턱까지 거리 z를 구합니다. 순방향은 z의 부호만 보고 0 또는 1을
              내고, 역방향은 |z|가 커질수록 작아지는 별도 기울기를 사용합니다.
            </>
          }
          formula={String.raw`s=H(z),\qquad \frac{\partial s}{\partial z}\approx\frac{1}{(1+\alpha|z|)^2},\qquad z=v-\theta`}
          annotatedFormula={String.raw`\begin{aligned}s&=\underbrace{H(z)}_{\text{순방향 발화 0 또는 1}}\\\frac{\partial s}{\partial z}&\approx\underbrace{\frac{1}{(1+\alpha|z|)^2}}_{\text{역방향에서만 쓰는 대체 기울기}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`z=1.000928-1=0.000928`,
              annotation: ["다섯째 리셋 전 전압에서", "문턱 1을 뺍니다."],
            },
            {
              expression: String.raw`H(0.000928)=1`,
              annotation: ["거리가 양수이므로", "순방향은 발화 1입니다."],
            },
            {
              expression: String.raw`\frac{1}{(1+5\times0.000928)^2}\approx0.990784`,
              annotation: ["문턱과 매우 가까워", "역방향 신호를 크게 둡니다."],
            },
          ]}
          terms={[
            {
              symbol: "z",
              name: "문턱 거리",
              description: "리셋 전 전압에서 발화 문턱을 뺀 값입니다.",
            },
            {
              symbol: "H",
              name: "계단 함수",
              description: "순방향에서 0 또는 1을 만드는 불연속 함수입니다.",
            },
            {
              symbol: String.raw`\alpha`,
              name: "기울기 폭 조절값",
              description: "클수록 큰 기울기를 문턱 가까이에 좁게 모읍니다.",
            },
          ]}
          assumptions={[
            "fast-sigmoid 형태와 α=5를 고른 사례입니다.",
            "대체 기울기는 hard step의 정확한 미분이 아니라 치우침이 있는 학습 신호입니다.",
            "α가 너무 크면 신호를 받는 뉴런이 적어지고, 너무 작으면 문턱에서 먼 뉴런도 크게 고칠 수 있습니다.",
          ]}
          interpretation="대체 기울기는 순방향 모델을 부드러운 확률 모델로 바꾸지 않습니다. 역방향에서 어느 가중치를 고칠지 알려 주는 신호만 바꿉니다."
        />

        <div id="paper-superspike" className="scroll-mt-24">
          <CitationBlock
            source="SuperSpike: Supervised Learning in Multi-layer Spiking Neural Networks"
            citeKey={1}
            href="https://arxiv.org/abs/1705.11146"
          >
            <EvidenceGrid
              problem="결정적 발화의 불연속성 때문에 여러 층에 오차를 전달하기 어려운 문제"
              contribution="전압에 따른 대체 기울기와 eligibility trace를 결합한 SuperSpike 학습 규칙"
              assumptions="논문의 적분 발화 뉴런·과제·손실·trace 조건"
              scope="시간 발화 무늬 실험과 학습 규칙 유도"
              notClaim="모든 SNN 과제의 최적 기울기이거나 실제 뇌가 같은 계산을 한다는 주장"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="bptt" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          4. 셋째 발화의 오차는 셋째 시점에서 끝나지 않고 이전 전압까지 거슬러
          갑니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            목표 발화열이 <code>[1,0,0,0,1]</code>인데 뉴런이
            <code>[1,0,1,0,1]</code>을 냈다고 가정하겠습니다. 셋째 발화가
            불필요합니다. 셋째 전압 1.0952는 셋째 입력 0.9뿐 아니라 둘째 전압
            0.244와 남기는 비율 0.8에도 의존합니다. 따라서 셋째 시점의 오차는
            둘째·첫째 시점 계산에도 영향을 줍니다.
          </p>
          <p>
            시간 상태를 <code>u₀→u₁→…→u₅</code>로 펼친 뒤 마지막에서 처음으로
            미분을 보내는 방법이{" "}
            <strong>시간축 역전파(Backpropagation Through Time, BPTT)</strong>
            입니다. 발화 노드에서는 앞 절의 대체 기울기를 쓰고, 전압 연결에서는
            LIF 상태식의 미분을 씁니다. 여러 시점이 같은 가중치를 사용하므로 각
            시점의 기여를 마지막에 더합니다.
          </p>
        </div>

        <AlgorithmBlock
          title="불필요한 셋째 발화의 오차를 시간축으로 돌려보냅니다"
          input={[
            "predicted=[1,0,1,0,1]",
            "target=[1,0,0,0,1]",
            "saved v[1:5], u[0:5], shared weight W",
          ]}
          steps={[
            {
              code: "loss = compare(predicted, target)",
              note: "셋째 시점의 발화 1이 목표 0과 다르다는 오차를 만듭니다.",
            },
            {
              code: "grad_s[3] = derivative of loss at the third spike",
              note: "먼저 출력 발화를 어느 방향으로 바꿀지 계산합니다.",
            },
            {
              code: "grad_v[3] = grad_s[3] × surrogate_slope(v[3] − threshold)",
              note: "hard step의 0인 정확한 기울기 대신 문턱 근처의 대체 기울기를 씁니다.",
            },
            {
              code: "grad_u[2] += grad_v[3] × beta",
              note: "셋째 전압이 둘째 전압의 0.8배를 사용했으므로 오차가 한 시점 뒤로 갑니다.",
            },
            {
              code: "grad_W += contribution from time 3, then continue time 2 → 1",
              note: "같은 W를 여러 시점이 사용하므로 시간별 기여를 하나의 기울기에 더합니다.",
            },
            {
              code: "optimizer updates W and any learnable beta or threshold",
              note: "SGD나 Adam은 계산된 기울기를 받아 실제 매개변수를 고칩니다.",
            },
          ]}
          output="shared parameter gradients that include temporal credit"
          repeatUntil="첫 시점의 상태까지 필요한 오차를 전달할 때까지"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            대가는 시간입니다. 다섯 시점만 펼치면 저장량도 작습니다. T가
            길어지면 전압·발화·대체 기울기의 중간값도 T개 시점만큼 저장해야
            합니다. 일부 구간만 역전파하는 truncated BPTT는 먼 과거와 이어진
            오차를 끊습니다. 활성값 체크포인팅은 메모리를 줄이는 대신 순방향
            구간을 다시 계산합니다. 저장과 재계산 장부는
            <Link to="/cs/ai/training-memory-budget#checkpointing">
              {" "}
              학습 메모리 글
            </Link>
            에서 같은 방식으로 셉니다.
          </p>
        </div>
      </section>

      <section
        id="brain-boundary"
        data-teach-level="6"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          5. 국소 규칙은 가까운 두 뉴런을 보지만 셋째 발화가 오답인지는 모릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            시냅스 앞 뉴런 활동이 0.5이고 뒤 뉴런 활동이 0.8이며 변화율이
            0.1이라고 하겠습니다. 두 활동을 곱하는 단순한 Hebbian 규칙은
            <code>0.1×0.5×0.8=0.04</code>만큼 연결을 강화합니다. 필요한 정보가
            시냅스 양쪽에 있으므로 국소 규칙입니다.
          </p>
          <p>
            그러나 이 규칙만으로는 셋째 발화가 목표에 없는 오답인지 알 수
            없습니다. 앞·뒤 뉴런이 함께 활동했다는 사실만 보고 최종 과제 오차는
            보지 않기 때문입니다. 정답이 늦게 오거나 여러 출력이 서로 경쟁할
            수도 있습니다. 가중치가 계속 커지는 문제도 있습니다. 이를 다루려면
            오차·보상·정규화·억제 같은 장치가 더 필요합니다.
          </p>
        </div>
        <HebbianLocalViz />

        <ExplainedFormula
          question="가장 단순한 국소 Hebbian 갱신은 무엇을 봅니까?"
          idea={
            <>
              연결 양쪽에서 바로 관측할 수 있는 앞 뉴런과 뒤 뉴런의 활동만
              곱하고, 한 번에 바꿀 크기를 곱합니다.
            </>
          }
          formula={String.raw`\Delta w=\eta x_{\rm pre}x_{\rm post}=0.1\times0.5\times0.8=0.04`}
          annotatedFormula={String.raw`\Delta w=\underbrace{\eta}_{\text{한 번의 변화율}}\times\underbrace{x_{\rm pre}x_{\rm post}}_{\text{연결 양쪽의 국소 활동}}`}
          operations={[
            {
              expression: String.raw`0.5\times0.8=0.4`,
              annotation: [
                "앞·뒤 뉴런 활동을 곱해",
                "함께 활동한 크기를 만듭니다.",
              ],
            },
            {
              expression: String.raw`0.1\times0.4=0.04`,
              annotation: ["변화율 0.1을 곱해", "연결 변화량을 제한합니다."],
            },
          ]}
          terms={[
            {
              symbol: String.raw`x_{\rm pre}`,
              name: "앞 뉴런 활동",
              description: "해당 연결로 들어오는 국소 신호입니다.",
            },
            {
              symbol: String.raw`x_{\rm post}`,
              name: "뒤 뉴런 활동",
              description: "연결을 받은 뉴런의 국소 신호입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "가소성 변화율",
              description: "한 번에 연결을 바꾸는 비율입니다.",
            },
          ]}
          assumptions={[
            "활동을 셀 시간창과 부호를 이미 정했다고 가정합니다.",
            "감쇠·정규화·경쟁을 넣지 않은 단순한 예입니다.",
            "최종 과제 오차를 어느 연결에 돌릴지는 이 식만으로 해결되지 않습니다.",
          ]}
          interpretation="국소라는 말은 필요한 정보를 가까이서 얻는다는 뜻입니다. 과제 전체를 잘 푼다는 보장이나 뇌 학습의 완성 모형이라는 뜻은 아닙니다."
        />

        <div id="paper-brain-backprop" className="scroll-mt-24">
          <CitationBlock
            source="Dendritic Cortical Microcircuits Approximate Backpropagation"
            citeKey={2}
            href="https://arxiv.org/abs/1810.11393"
          >
            <EvidenceGrid
              problem="전역 오차를 쓰는 표준 역전파와 생물학적 국소 가소성 사이의 오차 귀속 문제"
              contribution="수상돌기 구획과 국소 예측 오차로 역전파를 근사하는 회로 모형"
              assumptions="논문의 단순화한 피라미드 뉴런·중간 뉴런 회로와 과제"
              scope="분석한 근사 관계와 모의실험 결과"
              notClaim="실제 뇌가 표준 역전파를 그대로 실행한다는 증거"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="hardware" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          6. 발화가 세 번뿐이어도 상태·전달 비용을 더하면 밀집 계산보다 클 수
          있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            발화열 <code>[1,0,1,0,1]</code>을 받는 아래쪽 연결은 세 번만 일할 수
            있습니다. 그러나 위 뉴런의 전압은 발화하지 않은 시점에도 다섯 번
            갱신됩니다. 발화를 칩 안에서 전달하고 원래 입력을 시간 신호로 바꾸는
            비용도 남습니다.
          </p>
          <p>
            비교용 가정에서 밀집 실행은 다섯 시점마다 4pJ를 써서 20pJ입니다.
            발화 계산은 <code>3×1pJ=3pJ</code>로 줄지만, 전압 갱신
            <code>5×2pJ=10pJ</code>와 전달·입출력 10pJ를 더하면 23pJ입니다.
            숫자는 가정이지만 “발화가 드물다”만으로 저전력을 결론 내릴 수 없는
            이유를 보여 줍니다.
          </p>
        </div>
        <EnergyBoundaryViz />

        <ExplainedFormula
          question="한 번의 SNN 실행 에너지는 어떤 일을 함께 세야 합니까?"
          idea={
            <>
              실제 발화가 만든 연결 계산과 모든 시간 상태 갱신을 따로 셉니다.
              여기에 발화 전달과 입력·출력 변환 비용을 더합니다.
            </>
          }
          formula={String.raw`E_{\rm run}=N_{\rm event}e_{\rm event}+N_{\rm state}e_{\rm state}+E_{\rm route}+E_{\rm I/O}`}
          annotatedFormula={String.raw`\begin{aligned}E_{\rm run}={}&\underbrace{N_{\rm event}e_{\rm event}}_{\text{발화가 만든 연결 계산}}+\underbrace{N_{\rm state}e_{\rm state}}_{\text{시간 상태 갱신}}\\&+\underbrace{E_{\rm route}+E_{\rm I/O}}_{\text{발화 전달과 입출력 변환}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`3\times1\ \mathrm{pJ}=3\ \mathrm{pJ}`,
              annotation: ["세 발화가 만든", "아래쪽 연결 계산입니다."],
            },
            {
              expression: String.raw`5\times2\ \mathrm{pJ}=10\ \mathrm{pJ}`,
              annotation: ["다섯 시점에 모두 수행한", "전압 상태 갱신입니다."],
            },
            {
              expression: String.raw`3+10+10=23\ \mathrm{pJ}`,
              annotation: [
                "발화 계산·상태 갱신·전달과 입출력을",
                "같은 실행 범위에서 더합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`N_{\rm event}`,
              name: "처리한 발화 수",
              description: "런타임이 실제 연결 계산으로 바꾼 사건 수입니다.",
            },
            {
              symbol: String.raw`N_{\rm state}`,
              name: "상태 갱신 수",
              description: "전압과 trace를 갱신한 횟수입니다.",
            },
            {
              symbol: String.raw`E_{\rm route}+E_{\rm I/O}`,
              name: "전달·입출력 비용",
              description: "칩 안 전달과 센서·호스트 변환의 에너지입니다.",
            },
          ]}
          assumptions={[
            "20pJ·1pJ·2pJ·10pJ는 원리를 비교하기 위한 가정이며 측정값이 아닙니다.",
            "같은 과제 정확도, 지연 목표, 입력 범위, 배치 조건에서 비교해야 합니다.",
            "단위 에너지는 공정·전압·주파수·배치·연결 배치마다 달라집니다.",
          ]}
          interpretation="발화 계산 3pJ만 떼어 20pJ와 비교하면 범위가 다릅니다. 같은 실행의 상태·전달·입출력을 모두 더한 뒤에만 저전력 여부를 말할 수 있습니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            알고리즘과 회로도 구분해야 합니다. Loihi는 비동기 사건 처리를 하는
            디지털 뉴로모픽 프로세서입니다. BrainScaleS-2는 아날로그 뉴런 코어와
            디지털 전달·가소성 처리를 합친 혼합 신호 시스템입니다.
            아날로그 회로에서는 공정·전압·온도 변화와 보정이 특히 중요합니다.
            그렇다고 모든 SNN이 아날로그인 것은 아닙니다.
          </p>
        </div>

        <div className="not-prose grid gap-5 md:grid-cols-2">
          <div id="paper-loihi" className="scroll-mt-24">
            <CitationBlock
              source="Loihi: A Neuromorphic Manycore Processor with On-Chip Learning"
              citeKey={3}
              href="https://ieeexplore.ieee.org/document/8259423"
            >
              <EvidenceGrid
                problem="희소 순환 SNN과 국소 학습을 프로그래밍 가능한 칩에서 실행하는 문제"
                contribution="비동기 디지털 뉴로모픽 다중 코어와 칩 안 학습 엔진"
                assumptions="Loihi 연구용 칩, 배치한 과제, 논문의 측정 절차"
                scope="공개한 구조와 해당 과제의 전력·처리량 측정"
                notClaim="모든 SNN이 모든 일반 신경망보다 일정 배수 효율적이라는 주장"
              />
            </CitationBlock>
          </div>
          <div id="paper-brainscales" className="scroll-mt-24">
            <CitationBlock
              source="The BrainScaleS-2 Accelerated Neuromorphic System with Hybrid Plasticity"
              citeKey={4}
              href="https://arxiv.org/abs/2201.11063"
            >
              <EvidenceGrid
                problem="아날로그 뉴런 동역학과 유연한 디지털 가소성·전달을 결합하는 문제"
                contribution="아날로그 코어, 디지털 프로세서, 사건망을 갖춘 혼합 신호 시스템"
                assumptions="BrainScaleS-2 칩·보정·가속 시간 상수"
                scope="공개한 하드웨어 구조와 측정한 응용"
                notClaim="모든 SNN 하드웨어가 아날로그이거나 같은 변동 민감도를 갖는다는 주장"
              />
            </CitationBlock>
          </div>
        </div>
      </section>

      <section id="real-code" data-teach-level="8" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          7. 실제 snnTorch 코드에서도 리셋 시점과 대체 기울기를 따로 고릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            아래 코드는 같은 다섯 입력을 실행합니다.{" "}
            <code>reset_delay=False</code>를 명시해야 이 글처럼 발화한 시점에
            바로 문턱을 뺍니다. 대체 기울기 폭은 <code>slope=5</code>로
            맞춥니다.
          </p>
        </div>
        <pre className="not-prose my-6 overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs leading-6">
          <code>{`import torch
import snntorch as snn
from snntorch import surrogate

lif = snn.Leaky(
    beta=0.8,
    threshold=1.0,
    spike_grad=surrogate.fast_sigmoid(slope=5),
    reset_mechanism="subtract",
    reset_delay=False,
)

mem = torch.tensor([0.6])
inputs = torch.tensor([0.7, 0.1, 0.9, 0.3, 0.7])
spikes = []
for current in inputs:
    spike, mem = lif(current.view(1), mem)
    spikes.append(int(spike.item()))

# spikes == [1, 0, 1, 0, 1]
# mem ≈ tensor([0.000928])`}</code>
        </pre>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            고정한 소스의 <code>Leaky.forward</code>는 이전 전압에서 reset
            상태를 구하고, 상태 함수를 실행한 뒤 발화를 냅니다.{" "}
            <code>reset_delay</code>가 거짓이면 같은 호출 안에서 문턱을 즉시
            뺍니다. FastSigmoid의
            <code>forward</code>는 여전히 <code>input &gt; 0</code>인 0/1
            판정이며,
            <code>backward</code>만<code>1/(slope×|input|+1)²</code>을
            사용합니다.
          </p>
        </div>

        <div
          id="source-snntorch-lif"
          className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
        >
          <p className="text-xs font-bold text-primary">
            고정 커밋의 공식 소스
          </p>
          <h3 className="mt-2 text-base font-bold">
            snnTorch는 LIF 상태 갱신과 대체 기울기의 앞·뒤 계산을 코드로
            분리합니다
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            2026-10-14에 확인한 snnTorch 커밋
            <code className="mx-1">37c56ccd</code>입니다. LIF 소스 141~244줄은
            subtract·zero·none 리셋과 즉시 리셋 선택을 보여 줍니다. surrogate
            소스 116~160줄에는 hard forward가 있습니다. 같은 곳의 backward는
            fast-sigmoid 기울기를 계산합니다. 이 Python 경로만으로 특정 가속기가
            내는 에너지 이득을 증명할 수는 없습니다.
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:gap-4">
            <a
              href="https://github.com/jeshraghian/snntorch/blob/37c56ccd0c8eac61b629819c2cc2a2b13261b8cf/snntorch/_neurons/leaky.py#L141-L244"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4"
            >
              LIF 상태 갱신 소스 보기
            </a>
            <a
              href="https://github.com/jeshraghian/snntorch/blob/37c56ccd0c8eac61b629819c2cc2a2b13261b8cf/snntorch/surrogate.py#L116-L160"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline underline-offset-4"
            >
              FastSigmoid 대체 기울기 소스 보기
            </a>
          </div>
        </div>
      </section>

      <section id="decision" data-teach-level="9" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          8. SNN을 고를 때는 시간 정보·학습 신호·실행 비용을 따로 판단합니다
        </h2>
        <div className="not-prose grid gap-3 md:grid-cols-2">
          {decisionRows.map((row) => (
            <div
              key={row.signal}
              className="rounded-xl border border-border/75 p-4"
            >
              <p className="text-sm font-bold">{row.signal}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {row.implication}
              </p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
          <p>
            가장 먼저 비교 범위를 맞춥니다. 모델 표현은 일반 신경망과 SNN을
            비교합니다. 오차 전달은 역전파와 국소 규칙을 비교합니다. 실행은 같은
            과제 정확도와 지연을 맞춘 뒤 GPU·디지털 뉴로모픽·혼합 신호 칩의 전체
            에너지를 비교합니다. 서로 다른 층의 이름을 바로 맞대면 원인과 이득을
            잘못 연결하게 됩니다.
          </p>
          <p>
            LIF는 수상돌기·신경전달물질·세포 유형·구조 가소성을 모두 담는 뇌
            모형이 아닙니다. 발화 형식은 생물학적 뉴런과 한 부분이 닮았습니다.
            이것만으로 실제 뇌의 학습 메커니즘을 재현했다고 말할 수는 없습니다.
          </p>
        </div>
      </section>

      <section
        id="prediction-questions"
        data-teach-level="10"
        className="scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          9. 같은 사례의 조건을 바꾸면 결과를 예측할 수 있습니까
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 시점에 subtract reset 대신 zero reset을 쓰면 다음 전압은 얼마입니까?
            둘째 시점의 리셋 전 전압은 0.18을 남겼을 때와 어떻게 달라집니까?
            (답: 1·7절)
          </p>
          <p>
            기울기 폭 α를 5보다 크게 만들면 다섯 시점 중 어떤 전압이 학습 신호를
            가장 오래 유지합니까? 문턱에서 먼 둘째·넷째 시점은 어떻게 됩니까?
            (답: 3절)
          </p>
          <p>
            발화 수를 세 번에서 한 번으로 줄였는데 입력 변환 시간이 두 배가
            됐습니다. 발화 수만으로 어느 시스템이 낫다고 결론 낼 수 없는 이유는
            무엇입니까? (답: 6·8절)
          </p>
        </div>
      </section>
    </article>
  );
}
