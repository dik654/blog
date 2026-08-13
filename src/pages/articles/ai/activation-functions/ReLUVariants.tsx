import ExplainedFormula from "@/components/ui/explained-formula";
import Math from "@/components/ui/math";
import ReLUFamilyViz from "./viz/ReLUFamilyViz";

const comparison = [
  ["Leaky ReLU", "고정", "piecewise linear", "추가 없음", "dead unit 완화", "음수 noise도 통과"],
  ["PReLU", "학습", "piecewise linear", "channel별 a", "기울기를 data에 맞춤", "parameter parity 확인"],
  ["ELU", "고정 α", "음수 포화", "추가 없음", "평균을 0 쪽으로 이동", "exp 연산·포화"],
  ["SELU", "고정 α, λ", "음수 포화", "추가 없음", "조건부 자기정규화", "LeCun init·AlphaDropout 필요"],
  ["GELU", "고정", "smooth gate", "추가 없음", "입력 크기에 따른 연속 gate", "정확/근사 구현 구분"],
  ["SiLU/Swish", "β=1 또는 학습", "smooth gate", "β 선택", "부드러운 비단조 구간", "모든 task에서 우위 아님"],
  ["SwiGLU", "projection 학습", "두 branch 곱", "Wg·Wv·Wo", "feature별 조건부 통과", "FFN width를 맞춰 비교"],
] as const;

export default function ReLUVariants() {
  return (
    <section id="relu-variants" className="mb-20 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ReLU 이후: 함수 모양보다 계산 경로를 먼저 본다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ReLU 이후의 activation을 “더 최신인 함수” 순서로 외우면 SwiGLU에서 흐름이
          끊깁니다. Leaky ReLU와 PReLU는 음수 구간의 gradient를 살리고, ELU와 SELU는
          activation 분포를 다루며, GELU와 SiLU는 입력 자체를 부드러운 gate로 사용합니다.
          반면 SwiGLU는 함수 하나를 바꾸는 것이 아니라 Transformer FFN을 두 branch로
          나누는 구조입니다.
        </p>
        <p>
          따라서 비교의 출발점은 곡선의 모양이 아니라 <strong>무슨 병목을 고치려는지</strong>,
          <strong> local Jacobian이 어떻게 달라지는지</strong>, 그리고 <strong>같은 parameter·FLOP
          예산인지</strong>입니다. 아래 그림은 이 네 질문을 같은 축에 놓습니다.
        </p>
      </div>

      <ReLUFamilyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="paper-prelu" className="scroll-mt-20">1. Leaky ReLU와 PReLU: 0이던 음수 gradient에 우회로를 만든다</h3>
        <p>
          ReLU 뉴런의 pre-activation이 학습 내내 음수라면 local derivative가 0이어서
          그 뉴런으로 돌아오는 update가 끊깁니다. 가장 직접적인 해결책은 음수 쪽을
          완전히 자르지 않고 작은 직선으로 바꾸는 것입니다. Leaky ReLU는 기울기
          <Math>{"a"}</Math>를 고정하고, PReLU는 이를 학습합니다. PReLU 원 논문은 이
          일반화가 계산량을 거의 늘리지 않으면서 rectifier를 data에 맞춘다는 관점에서
          제안됐습니다.
        </p>
      </div>

      <ExplainedFormula
        question="음수 입력에서도 weight가 다시 움직일 수 있게 하려면 무엇을 남겨야 할까?"
        idea={<>출력을 크게 살릴 필요는 없습니다. local derivative가 정확히 0만 아니면 upstream gradient가 작은 비율로 전달됩니다.</>}
        formula={String.raw`f_a(x)=\begin{cases}x,&x\ge 0\\ax,&x<0\end{cases},\qquad f_a'(x)=\begin{cases}1,&x>0\\a,&x<0\end{cases}`}
        terms={[
          { symbol: "x", name: "pre-activation", description: "linear layer가 activation에 넘긴 값입니다." },
          { symbol: "a", name: "음수 기울기", description: "Leaky ReLU에서는 작은 상수, PReLU에서는 학습되는 scalar 또는 channel별 parameter입니다." },
          { symbol: "f_a'(x)", name: "local derivative", description: "backprop에서 upstream gradient에 곱해지는 항입니다." },
        ]}
        assumptions={["x=0의 derivative는 구현이 정한 subgradient를 사용합니다.", "PReLU를 비교할 때는 channel별 parameter 추가와 regularization 조건을 함께 맞춥니다."]}
        interpretation="ReLU의 음수 구간에서는 0이던 gradient가 a배로 흐릅니다. 다만 a가 너무 작으면 회복이 느리고, 너무 크면 ReLU의 sparsity와 noise 억제 성질이 약해집니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          여기서 PReLU가 Leaky ReLU의 무조건적인 상위 호환은 아닙니다. channel마다
          <Math>{"a_i"}</Math>를 두면 표현력은 늘지만 작은 dataset에서는 그 자유도가
          필요하지 않을 수 있습니다. 또한 “dead unit을 막는다”는 말은 최적화 전체가
          해결된다는 뜻이 아니라, 음수 구간에서 local gradient가 0이 되는 특정 실패를
          완화한다는 뜻입니다.
        </p>

        <h3 id="paper-elu" className="scroll-mt-20">2. ELU와 SELU: 음수 값을 살리는 목적이 서로 다르다</h3>
        <p>
          ELU는 음수 출력을 허용해 activation 평균을 0에 가깝게 옮기면서, 큰 음수에서는
          <Math>{"-\\alpha"}</Math>로 포화합니다. 선형 음수 꼬리를 가진 Leaky ReLU와 달리
          “특징이 매우 없을 때”의 출력을 제한해 forward variation을 줄이려는 설계입니다.
          따라서 음수 gradient를 끝까지 일정하게 보존하는 함수가 아니라, 분포의 평균과
          noise-robust deactivation을 함께 겨냥합니다.
        </p>
      </div>

      <ExplainedFormula
        question="양수 쪽의 비포화 경로를 유지하면서 음수 activation의 평균 이동을 어떻게 줄일까?"
        idea={<>양수에서는 identity를 유지하고, 음수에서는 0 아래로 부드럽게 내려가되 하한을 둡니다. 경계 <Math>{"x=0"}</Math>에서 값과 기울기가 이어지도록 보통 <Math>{"\\alpha=1"}</Math>을 사용합니다.</>}
        formula={String.raw`\operatorname{ELU}_\alpha(x)=\begin{cases}x,&x>0\\ \alpha(e^x-1),&x\le0\end{cases},\qquad
\operatorname{ELU}_\alpha'(x)=\begin{cases}1,&x>0\\ \alpha e^x,&x<0\end{cases}`}
        terms={[
          { symbol: "\\alpha", name: "음수 포화값의 크기", description: "x가 매우 작아질 때 출력은 -α에 가까워집니다." },
          { symbol: "e^x", name: "부드러운 음수 곡선", description: "0 근처에서 기울기를 제공하지만 큰 음수에서는 derivative가 0에 가까워집니다." },
        ]}
        interpretation="α=1, x=−5라면 output은 e⁻⁵−1≈−0.993이고 local derivative는 e⁻⁵≈0.0067입니다. ELU는 dead unit 위험을 줄이면서 음수 출력으로 activation 평균을 0 쪽으로 당기지만, 큰 음수에서는 다시 포화하므로 장거리 gradient를 보장하는 장치는 아닙니다."
      />

      <div id="paper-selu" className="scroll-mt-20" />

      <ExplainedFormula
        question="SELU 하나만 교체하면 어떤 network에서도 자동으로 정규화될까?"
        idea={<>아닙니다. SELU는 정해진 scale과 음수 포화값을 사용해 층을 지날 때 평균 0·분산 1 근처로 돌아오는 mapping을 만들며, 그 성질은 초기화와 architecture 조건을 포함합니다.</>}
        formula={String.raw`\operatorname{SELU}(x)=\lambda\begin{cases}x,&x>0\\ \alpha(e^x-1),&x\le0\end{cases},\quad \alpha\approx1.6733,\;\lambda\approx1.0507`}
        terms={[
          { symbol: "\\alpha", name: "negative saturation", description: "평균과 분산 mapping의 fixed point를 만들기 위해 정한 상수입니다." },
          { symbol: "\\lambda", name: "전체 scale", description: "출력 분산을 1 근처로 되돌리는 배율입니다." },
        ]}
        assumptions={["feed-forward layer와 독립에 가까운 입력을 가정합니다.", "LeCun normal initialization과 fan-in scaling을 사용합니다.", "일반 dropout 대신 zero mean·variance를 보존하는 AlphaDropout을 사용합니다."]}
        interpretation="SELU의 핵심은 함수 모양 하나가 아니라 조건을 갖춘 self-normalizing network입니다. BatchNorm을 아무 조건 없이 대체하는 범용 규칙으로 읽으면 안 됩니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="paper-gelu" className="scroll-mt-20">3. GELU와 SiLU: 입력 자체를 연속적인 gate로 사용한다</h3>
        <p>
          ReLU는 <Math>{"x>0"}</Math>인지에 따라 통과 여부를 hard하게 결정합니다. GELU와
          SiLU는 이 결정을 0과 1 사이의 연속적인 gate로 바꿉니다. GELU의
          <Math>{"\\Phi(x)"}</Math>는 표준정규분포 CDF이므로 입력이 분포 안에서 얼마나 큰지를
          이용하고, SiLU는 sigmoid로 입력 자체를 gate합니다. 두 함수 모두 작은 음수
          구간에서 출력이 음수가 되었다가 다시 0에 접근하는 비단조 구간을 가집니다.
        </p>
      </div>

      <ExplainedFormula
        question="binary mask처럼 자르지 않고 입력의 크기에 따라 통과량을 연속적으로 정할 수 있을까?"
        idea={<>입력 <Math>{"x"}</Math>에 0–1 gate를 곱합니다. gate가 입력에 의존하므로 작은 값은 약하게, 큰 양수는 거의 그대로 통과합니다.</>}
        formula={String.raw`\operatorname{GELU}(x)=x\Phi(x),\qquad \operatorname{SiLU}(x)=x\sigma(x)`}
        terms={[
          { symbol: "\\Phi(x)", name: "Gaussian CDF gate", description: "표준정규분포에서 x 이하일 누적확률입니다. GELU의 원 논문은 입력의 크기에 따른 stochastic regularization 관점으로 설명합니다." },
          { symbol: "\\sigma(x)", name: "sigmoid gate", description: "SiLU 또는 β=1인 Swish가 사용하는 부드러운 gate입니다." },
          { symbol: "x", name: "value이자 gate의 입력", description: "별도 projection 없이 같은 scalar가 값과 통과율을 함께 정합니다." },
        ]}
        interpretation="ReLU의 0/1 선택이 연속적인 통과율로 바뀝니다. smooth하다는 사실만으로 성능 우위가 보장되지는 않으며 approximation kernel, dtype, 모델 규모까지 포함해 측정해야 합니다."
      />

      <div id="paper-swish" className="scroll-mt-20" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Mish는 <Math>{"x\\tanh(\\operatorname{softplus}(x))"}</Math>로 같은 부드러운 gate
          계열에 놓을 수 있지만, 더 복잡한 연산이 실제 task에서 일관된 이득을 준다는
          보장은 없습니다. “smooth할수록 좋다”가 아니라 hardware kernel과 전체
          architecture를 포함한 validation 결과가 선택 기준입니다.
        </p>

        <h3 id="paper-swiglu" className="scroll-mt-20">4. GLU와 SwiGLU: activation이 아니라 FFN을 두 갈래로 바꾼다</h3>
        <p>
          표준 FFN은 projection 하나를 activation에 통과시킨 뒤 다시 model dimension으로
          되돌립니다. GLU 계열은 같은 입력에서 gate branch와 value branch를 따로 만들고
          element-wise product로 합칩니다. 즉 GELU의 <Math>{"x\\Phi(x)"}</Math>처럼 scalar
          하나를 변환하는 것과 달리, 서로 다른 weight가 만든 feature가 서로를 gate합니다.
        </p>
      </div>

      <ExplainedFormula
        question="값을 만드는 feature와 그 값을 통과시킬 조건을 서로 다른 projection으로 학습하려면?"
        idea={<>하나는 content <Math>{"xW_v"}</Math>를 만들고, 다른 하나는 gate <Math>{"\\operatorname{SiLU}(xW_g)"}</Math>를 만듭니다. 두 branch를 곱한 뒤 output projection으로 되돌립니다.</>}
        formula={String.raw`\operatorname{FFN}_{\text{SwiGLU}}(x)=\left[\operatorname{SiLU}(xW_g)\odot(xW_v)\right]W_o`}
        terms={[
          { symbol: "W_g", name: "gate projection", description: "어떤 intermediate feature를 얼마나 통과시킬지 계산합니다." },
          { symbol: "W_v", name: "value projection", description: "실제로 전달할 intermediate content를 만듭니다." },
          { symbol: "\\odot", name: "element-wise product", description: "같은 intermediate coordinate의 gate와 value를 결합합니다." },
          { symbol: "W_o", name: "output projection", description: "gated intermediate를 model dimension으로 되돌립니다." },
        ]}
        assumptions={["bias 유무와 정확한 FFN 정의는 모델마다 다를 수 있습니다.", "표준 FFN과 비교할 때 intermediate width를 조정해 parameter/FLOP 예산을 맞춰야 합니다."]}
        interpretation="SwiGLU의 이득은 SiLU 곡선만의 효과가 아니라 두 projection 사이의 multiplicative interaction까지 포함합니다."
      />

      <ExplainedFormula
        question="projection이 2개에서 3개로 늘었는데 같은 hidden width로 비교해도 될까?"
        idea={<>model dimension을 <Math>{"d"}</Math>, intermediate width를 <Math>{"m"}</Math>이라 하면 bias를 뺀 표준 FFN은 대략 <Math>{"2dm"}</Math>, gated FFN은 <Math>{"3dm"}</Math> parameter를 사용합니다.</>}
        formula={String.raw`2d\,m_{\text{plain}}\approx3d\,m_{\text{gated}}\quad\Longrightarrow\quad m_{\text{gated}}\approx\frac{2}{3}m_{\text{plain}}`}
        terms={[
          { symbol: "d", name: "model dimension", description: "FFN으로 들어오고 나가는 hidden dimension입니다." },
          { symbol: "m", name: "intermediate width", description: "FFN 내부에서 확장되는 dimension입니다." },
        ]}
        interpretation="같은 width의 SwiGLU는 더 큰 모델입니다. activation 선택을 비교하려면 gated FFN의 intermediate width를 줄이거나 실제 parameter와 FLOP를 따로 보고해야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>같은 조건에서 고르는 체크리스트</h3>
        <p>
          activation 이름만 교체하고 결과를 비교하면 initialization, normalization,
          intermediate width, fused kernel 지원이 뒤섞입니다. 아래 표의 열을 고정한 뒤
          training loss뿐 아니라 activation 분포, dead unit 비율, gradient norm,
          throughput을 함께 보는 편이 안전합니다.
        </p>
      </div>

      <div className="not-prose my-9 overflow-x-auto rounded-lg border border-border/70">
        <table className="min-w-[900px] w-full text-left text-xs">
          <thead className="bg-muted/25 text-foreground">
            <tr>
              {["선택지", "gate/기울기", "음수 경로", "추가 구조", "주요 의도", "주의점"].map((head) => (
                <th key={head} className="border-b border-border/70 px-4 py-3 font-bold">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row[0]} className="border-b border-border/50 last:border-0">
                {row.map((cell, index) => (
                  <td key={cell} className={`px-4 py-3 leading-5 ${index === 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CNN에서 ReLU 계열, BERT 계열에서 GELU, decoder-only LLM에서 SwiGLU가 흔한 것은
          좋은 출발점이지만 법칙은 아닙니다. 기존 checkpoint 호환성, parameter budget,
          quantization과 kernel 지원, 실제 validation 성능이 함께 맞을 때 선택이
          완성됩니다.
        </p>
      </div>
    </section>
  );
}
