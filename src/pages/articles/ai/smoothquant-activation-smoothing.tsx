import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import SmoothquantActivationSmoothingViz from "./smoothquant-activation-smoothing/viz/SmoothquantActivationSmoothingViz";
import GemmScaleAxisViz from "./smoothquant-activation-smoothing/viz/GemmScaleAxisViz";
import { codeRefs } from "./smoothquant-activation-smoothing/codeRefs";
import { smoothquantTrees } from "./smoothquant-activation-smoothing/fileTree";
import QuantizationPathLocator, { QuantizationMapReturn } from "./quantization/QuantizationPathLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function SmoothquantActivationSmoothingArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => (
    <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />
  );

  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <QuantizationPathLocator current="activation-smoothing" />
          <h2 className="mb-6 text-2xl font-bold">1. weight만 8비트로 줄이면 곱셈은 여전히 16비트로 합니다</h2>
          <div className={prose}>
            <p>
              weight만 INT8이나 INT4로 저장하는 방식은 GPU 메모리와 읽기 대역폭을 줄입니다. 그런데 곱하기 직전에 weight를 다시 16비트로 풀면 행렬곱
              자체는 16비트 장치에서 돕니다. 요청을 많이 묶어 곱셈량이 커진 서빙에서는 이 계산 시간이 남습니다. 곱셈까지 정수로 하려면 입력 activation도
              8비트로 바꿔야 합니다. weight와 activation을 모두 8비트로 둔 형식을 W8A8이라고 부릅니다.
            </p>
            <p>
              문제는 activation 쪽에 있습니다. 큰 언어 모델의 activation에는 몇몇 채널만 다른 채널보다 수십 배 큰 값이 늘 나타납니다. 그 한 채널이
              8비트 눈금 간격을 넓혀 버리면 나머지 채널은 눈금 몇 개만 쓰게 됩니다. weight는 비교적 고르게 퍼져 있어 같은 8비트로도 여유가 있습니다.
            </p>
            <p>
              SmoothQuant의 답은 한 문장입니다. 입력 채널마다 activation을 어떤 수로 나누고 같은 수를 weight의 그 행에 곱하면 행렬곱 결과는
              그대로이면서 양자화 난이도만 activation에서 weight로 옮겨 갑니다. 이 글은 2개 token과 4개 채널짜리 작은 행렬로 그 수를 고르는 식과 실제
              코드, 그리고 지금의 서빙 엔진이 이 방법을 어디에 쓰는지까지 따라갑니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 입력과 weight를 8비트로 바꿔도 출력은 같아야 합니다</h2>
          <div className={prose}>
            <p>
              Linear 층 하나를 상자로 봅니다. 들어오는 것은 activation 행렬 X이고 행은 token, 열은 입력 채널입니다. 상자 안에는 weight 행렬 W가 있고 행은
              입력 채널, 열은 출력 채널입니다. 나오는 것은 Y = X·W입니다. 출력 Y의 한 칸은 같은 token 행과 같은 출력 열을 입력 채널 축으로 곱해 더한
              값입니다.
            </p>
            <p>
              상자에 기대하는 계약은 단순합니다. X와 W를 8비트 정수로 바꿔 곱한 뒤 실수로 되돌린 결과가 원래 Y와 가까워야 합니다. 정수로 바꿀 때는 절댓값 최대를 127로 나눈
              간격 Δ로 값을 나누고 반올림합니다. 되돌릴 때는 정수 code에 Δ를 곱합니다. 이 간격 하나를 행렬 전체가 쓰는지 행마다 따로 쓰는지가 뒤에서 중요한 차이가 됩니다.
            </p>
            <p>
              양자화의 기본 식과 반올림 오차는 <Link to="/cs/ai/quantization">양자화 기초</Link>에서, scale을 어디까지 공유하는지는{" "}
              <Link to="/cs/ai/quantization-formats-and-granularity#granularity">granularity</Link>에서 다룹니다. 이 글은 그 위에서 activation
              하나가 눈금을 독차지하는 문제만 봅니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 한 채널의 64가 나머지 채널의 눈금을 가져갑니다</h2>
          <div className={prose}>
            <p>
              token 두 개, 입력 채널 네 개짜리 X를 둡니다. 첫 token은 [1, −2, 64, 0.5], 둘째는 [−1, 1.5, −60, 1]입니다. 채널 3만 두 token 모두에서
              60이 넘습니다. W의 네 행은 [0.5, −0.25], [0.25, 0.5], [0.25, −0.125], [−0.5, 0.25]입니다. 출력은 Y = [[15.75, −9.125], [−15.625,
              8.75]]입니다. (가정)
            </p>
            <p>
              X 전체에 간격 하나를 쓰면 Δ_X = 64 ÷ 127 ≈ 0.504입니다. 채널 1의 1과 −1은 code 2와 −2가 되고 1.008과 −1.008로 돌아옵니다. 채널 4의
              0.5는 code 1, 1은 code 2입니다. 0.5와 1이라는 두 배 차이가 code 1과 2로만 남습니다.
            </p>
            <p>
              논문은 이것을 채널이 쓰는 눈금 수로 셉니다. 채널 j의 최댓값을 m_j, 행렬 전체의 최댓값을 m이라 하면 그 채널이 쓰는 8비트 눈금은 약
              2⁸·m_j/m개입니다. 채널 1은 256 × 1 ÷ 64 = 4개, 채널 2는 8개, 채널 3은 256개입니다. 256개 눈금 가운데 채널 1은 4개만 씁니다.
            </p>
            <p>
              같은 계산을 W에 하면 Δ_W = 0.5 ÷ 127이고 채널 1·2·4의 weight는 256개, 채널 3도 128개를 씁니다. 같은 8비트인데 activation은 채널 대부분이
              눈금 몇 개로 버티고 weight는 넉넉합니다. 이 불균형을 옮기는 것이 다음 절의 발상입니다.
            </p>
          </div>
          <ExplainedFormula
            question="한 채널이 8비트 눈금을 몇 개나 쓰나요?"
            idea={<p>
            행렬 전체가 간격 하나를 쓰면 그 간격은 가장 큰 채널이 정하고 작은 채널은 자기 최댓값까지만 눈금을 씁니다.
          </p>}
            formula={String.raw`L_j \approx 2^{8}\cdot\frac{m_j}{m}`}
            annotatedFormula={String.raw`L_j \approx \underbrace{2^{8}}_{\text{8비트 전체 눈금}}\cdot\frac{\overbrace{m_j}^{\text{채널 }j\text{의 최댓값}}}{\underbrace{m}_{\text{행렬 전체 최댓값}}}`}
            operations={[
              { expression: String.raw`m_j/m`, annotation: ["채널 j가 전체 범위에서", "차지하는 비율입니다."] },
              { expression: String.raw`2^{8}\cdot m_j/m`, annotation: ["그 비율만큼의 눈금만", "채널 j의 값을 구분합니다."] },
            ]}
            terms={[
              { symbol: "L_j", name: "유효 눈금 수", description: "채널 j의 값이 실제로 쓰는 INT8 code의 개수입니다." },
              { symbol: "m_j", name: "채널 최댓값", description: "max|X_j|. 3절의 채널 1은 1, 채널 3은 64입니다." },
              { symbol: "m", name: "전체 최댓값", description: "행렬 하나에 간격 하나를 쓸 때 그 간격을 정하는 값입니다." },
            ]}
            assumptions={["행렬 전체가 간격 하나를 쓰는 per-tensor 양자화입니다.", "부호를 포함한 대칭 범위의 근사입니다. 정확한 code 범위는 −127~127입니다."]}
            interpretation="채널 1은 256 × 1/64 = 4개입니다. 이 수가 작을수록 그 채널의 반올림 오차가 상대적으로 커집니다."
          />
        </section>

        <section id="picture" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 채널을 나눈 만큼 weight 행에 곱하면 결과는 그대로입니다</h2>
          <div className={prose}>
            <p>
              Y의 한 칸은 Σ_j x_j·w_j 꼴입니다. 채널 3의 x를 16으로 나누고 같은 채널의 w 행에 16을 곱해도 x·w는 변하지 않습니다. 첫 token의 채널 3
              항은 64 × 0.25 = 16이고, 나눈 뒤에도 4 × 4 = 16입니다. 다른 채널도 같은 방식으로 각자의 수로 나누고 곱하면 Y는 15.75와 −9.125
              그대로입니다.
            </p>
            <p>
              바뀌는 것은 두 행렬의 모양입니다. 채널 1·2·3·4를 각각 1.414, 2, 16, 1.414로 나누면 X의 채널 최댓값은 0.707, 1, 4, 0.707이 됩니다. W의
              그 행 최댓값도 같은 0.707, 1, 4, 0.707이 됩니다. X 전체의 최댓값이 64에서 4로 내려가 Δ_X가 16배 촘촘해집니다.
            </p>
            <p>
              대가도 바로 보입니다. W의 채널 3 행이 0.25에서 4로 커져 이제 W에서는 채널 3이 최댓값을 정합니다. W의 채널 1은 원래 256개 눈금을 쓰다가
              45개로 줄어듭니다. 그림은 나누는 비율을 바꿀 때 activation과 weight의 눈금이 어떻게 오가는지 보여 줍니다.
            </p>
          </div>
          <SmoothquantActivationSmoothingViz />
        </section>

        <section id="why-outer-axis" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 정수 행렬곱은 합 밖의 두 축에만 간격을 되돌릴 수 있습니다</h2>
          <div className={prose}>
            <p>
              3절의 문제는 채널마다 다른 간격을 쓰면 바로 풀립니다. 채널 1은 1/127, 채널 3은 64/127을 쓰면 됩니다. 논문 Table 1도 activation을 채널별로
              양자화하면 OPT 모델의 정확도가 FP16과 거의 같다고 보고합니다. 그런데 실제 INT8 행렬곱 kernel은 이 방식을 쓰지 못합니다.
            </p>
            <p>
              Y의 한 칸을 정수로 계산하면 Σ_j x̄_j·w̄_j를 정수 누산기에 더해 갑니다. token마다 다른 간격 Δ_t는 같은 행 전체에 같은 값이라 합이 끝난
              뒤 한 번 곱하면 됩니다. 출력 채널마다 다른 Δ_c도 같은 열 전체에 같으므로 마찬가지입니다. 입력 채널마다 다른 Δ_j는 합 안의 항마다 달라서
              더하기 전에 각 항에 실수를 곱해야 합니다.
            </p>
            <p>
              논문은 이 제약을 Y = diag(Δ_X)·(X̄·W̄)·diag(Δ_W)로 적습니다. Tensor Core의 정수 곱셈을 이어 가는 동안 느린 변환 명령을 끼워 넣을 수
              없어서 scale은 token 축과 출력 채널 축에만 둡니다. 그래서 그 전의 방법들도 activation을 token별로만 양자화했습니다. 3절의 채널 3은 모든
              token에서 크므로 token별 간격으로는 풀리지 않습니다.
            </p>
            <p>
              SmoothQuant는 막힌 입력 채널 축의 크기 차이를 실행 전에 W 쪽으로 옮깁니다. 나누는 수 s_j는 X에서 빼고 W의 j행에 미리 곱해 두므로 실행 중에는 바깥 축
              간격만 남습니다. 그림의 셋째 장면이 막힌 축이고 넷째 장면이 옮긴 뒤입니다.
            </p>
          </div>
          <GemmScaleAxisViz />
          <div id="paper-smoothquant-gemm" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Xiao 외 · SmoothQuant (ICML 2023), §3 식 (2)와 Table 1" citeKey={1} href="https://arxiv.org/abs/2211.10438">
              <q>scaling can only be performed along the outer dimensions of the matrix multiplication</q> 같은 절은 token 축 T와 weight의 출력 채널 축
              C_o만 행렬곱 뒤에 되돌릴 수 있다고 설명합니다. Table 1의 채널별 activation 양자화는 kernel에 맞지 않는 모의 실험입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 옮기는 정도를 migration strength α로 정합니다</h2>
          <div className={prose}>
            <p>
              입력 채널마다 나누는 수 s_j를 smoothing factor라고 부릅니다. activation을 X·diag(s)⁻¹로, weight를 diag(s)·W로 바꾸는 이 변환이
              activation smoothing이고, 이 방법 전체를 SmoothQuant라고 부릅니다. 변환 자체는 곱셈 순서만 바꾼 항등식이라 양자화 전에는 오차가 없습니다.
            </p>
            <p>
              s_j를 크게 잡을수록 activation은 평평해지고 weight는 울퉁불퉁해집니다. 둘 사이의 비율을 정하는 지수가 migration strength α입니다. α = 1이면
              s_j = max|X_j|라 activation 채널이 모두 최댓값 1로 맞춰지고, α = 0이면 s_j = 1/max|W_j|라 weight 쪽이 평평해집니다.
            </p>
            <p>
              3절 사례에 넣어 보면 차이가 분명합니다. α = 1에서 activation은 모든 채널이 256개 눈금을 쓰지만 W의 채널 3 행이 0.25 × 64 = 16으로 커져 W의
              채널 1은 8개로 떨어집니다. α = 0에서는 W가 모두 256개를 쓰는 대신 activation 채널 1이 8개입니다. α = 0.5에서는 양쪽에서 가장 적은 눈금이
              45개로 같습니다.
            </p>
          </div>
          <ExplainedFormula
            question="채널 j는 몇으로 나눠야 하나요?"
            idea={<p>activation의 최댓값과 weight의 최댓값을 α 대 1−α로 섞어 두 쪽이 같은 난이도를 나눠 갖게 합니다.</p>}
            formula={String.raw`s_j = \frac{\max|X_j|^{\alpha}}{\max|W_j|^{1-\alpha}}`}
            annotatedFormula={String.raw`s_j = \frac{\overbrace{\max|X_j|^{\alpha}}^{\text{activation에서 덜어 낼 몫}}}{\underbrace{\max|W_j|^{1-\alpha}}_{\text{weight가 이미 가진 크기}}}`}
            operations={[
              { expression: String.raw`\max|X_j|^{\alpha}`, annotation: ["보정 표본에서 본 채널 j의 최댓값을", "α만큼만 반영합니다."] },
              { expression: String.raw`\max|W_j|^{1-\alpha}`, annotation: ["W의 j행 최댓값으로 나눠", "weight가 너무 커지지 않게 합니다."] },
              { expression: String.raw`X_j/s_j,\ s_j\cdot W_j`, annotation: ["같은 s_j로 나누고 곱해", "X·W를 그대로 둡니다."] },
            ]}
            terms={[
              { symbol: "s_j", name: "Smoothing factor", description: "입력 채널 j마다 하나씩 있는 양수입니다." },
              { symbol: String.raw`\alpha`, name: "Migration strength", description: "0이면 weight를, 1이면 activation을 평평하게 합니다. 논문 기본은 0.5입니다." },
              { symbol: String.raw`\max|X_j|`, name: "Activation 채널 최댓값", description: "실행 중이 아니라 보정 표본에서 미리 잰 값입니다." },
              { symbol: String.raw`\max|W_j|`, name: "Weight 행 최댓값", description: "j번째 입력 채널에 대응하는 W의 행에서 절댓값 최대입니다." },
            ]}
            assumptions={["보정 표본의 채널 최댓값이 실제 traffic에서도 비슷하다고 둡니다.", "X를 만드는 앞 연산에 s를 흡수할 수 있어야 실행 비용이 없습니다."]}
            interpretation="α = 0.5이면 X와 W의 채널 j 최댓값이 둘 다 √(max|X_j|·max|W_j|)가 됩니다. 채널 3은 √(64 × 0.25) = 4입니다."
          />
        </section>

        <section id="trace" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 입력 채널 3 하나를 보정부터 실행까지 따라갑니다</h2>
          <div className={prose}>
            <p>
              이제 α = 0.5로 정하고 채널 3이 실제로 거치는 경로를 순서대로 셉니다. 보정 단계에서 표본 문장을 모델에 흘려 채널 3에 들어온 절댓값의 최대를 기록합니다. 3절
              사례에서는 64입니다. W의 채널 3 행 최댓값은 0.25입니다. 여기서 s₃가 정해지고 그 수는 앞의 LayerNorm과 뒤의 W에 미리 흡수됩니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="채널 3의 smoothing과 양자화 간격"
            question="채널 3을 몇으로 나누고, 그 결과 X의 간격과 채널 1의 code는 어떻게 바뀌나요?"
            scope="3절의 X(2×4)·W(4×2)만 셉니다. activation과 weight 모두 행렬 하나에 간격 하나를 쓰는 per-tensor INT8이고 α = 0.5입니다."
            steps={[
              { label: "보정 최댓값", expression: "max|X₃| = 64, max|W₃| = 0.25", result: "64와 0.25", reason: "activation은 두 token 중 큰 절댓값, weight는 채널 3 행의 큰 절댓값입니다." },
              { label: "smoothing factor", expression: "64^0.5 ÷ 0.25^0.5 = 8 ÷ 0.5", result: "s₃ = 16", reason: "α = 0.5라 두 최댓값의 제곱근 비율입니다." },
              { label: "흡수", expression: "LayerNorm weight₃ ÷ 16, W₃ 행 × 16", result: "X₃ 최댓값 4, W₃ 최댓값 4", reason: "X₃를 만드는 LayerNorm 출력이 16배 작아지고 W 행은 16배 커져 곱은 그대로입니다." },
              { label: "X의 간격", expression: "64 ÷ 127 → 4 ÷ 127", result: "0.504 → 0.0315", reason: "다른 채널들도 각자 나눈 뒤라 X 전체의 최댓값이 채널 3의 4가 됩니다." },
              { label: "채널 1의 code", expression: "0.707 ÷ 0.0315", result: "2 → 22", reason: "채널 1은 1.414로 나눠 0.707이 되고, 16배 촘촘한 간격에서 code 22가 됩니다." },
              { label: "W 채널 1의 code", expression: "0.707 ÷ (4 ÷ 127)", result: "127 → 22", reason: "weight 쪽은 거꾸로 거칠어집니다. 이것이 옮긴 난이도입니다." },
            ]}
            conclusion="activation 채널 1의 code는 2에서 22로 늘고 weight 채널 1의 code는 127에서 22로 줄어 두 쪽이 같은 수준에서 만납니다."
            caveats={["X·W 값과 α = 0.5 선택은 설명용입니다.", "실제 모델은 채널이 수천 개이고 W도 출력 채널별 간격을 쓰는 경우가 많습니다."]}
          />
          <div className={prose}>
            <p>
              이 표에서 출력 오차가 반드시 줄어든다는 결론까지 내리지는 않습니다. 장난감 행렬에서는 채널 3 항이 Y를 거의 혼자 정하므로 어느 쪽이든 오차가
              작습니다. 늘어난 것은 작은 채널을 구분하는 눈금 수입니다. 그것이 실제 모델의 품질로 이어지는지는 11절의 논문 실험이 말합니다.
            </p>
          </div>
        </section>

        <section id="source-smooth" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 실제 코드는 LayerNorm을 나누고 Linear를 곱합니다</h2>
          <div className={prose}>
            <p>
              mit-han-lab/smoothquant commit c61476d의 smooth.py 18–45행 smooth_ln_fcs가 6절의 식을 그대로 실행합니다. 함수는 LayerNorm 하나와 그
              출력을 받는 Linear 목록, 보정한 채널별 최댓값을 받습니다. 29–32행이 weight의 입력 채널별 최댓값을 구하고 34–39행이 s를 계산합니다.
            </p>
            <p>
              PyTorch Linear의 weight는 (출력, 입력) 모양이라 dim=0의 최댓값이 입력 채널별 max|W_j|입니다. q·k·v처럼 같은 입력을 받는 Linear가 여럿이면
              셋의 최댓값을 다시 max로 묶어 s 하나를 공유합니다. X는 하나인데 s가 Linear마다 다르면 LayerNorm을 한 가지로 나눌 수 없기 때문입니다.
            </p>
            <p>
              41–45행이 흡수입니다. activation을 실행 중에 나누지 않고 그 activation을 만드는 LayerNorm의 weight와 bias를 s로 나눕니다. 뒤의 Linear
              weight는 열마다 s를 곱합니다. 변환이 끝난 모델은 원래와 같은 연산 그래프를 쓰므로 실행 중 추가 kernel이 없습니다.
            </p>
            <p>
              Llama 계열의 RMSNorm은 bias가 없어 48–71행의 별도 함수가 weight만 나눕니다. 126–141행을 보면 Llama 층에서 smoothing을 받는 곳은
              input_layernorm 뒤의 q·k·v와 post_attention_layernorm 뒤의 gate·up 두 군데입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {code("smooth-ln-fcs", "s 계산과 LayerNorm·Linear 흡수")}
            {code("smooth-llama", "RMSNorm 판의 흡수")}
            {code("smooth-lm-llama", "Llama 층에서 고르는 두 곳")}
          </div>
        </section>

        <section id="source-calibration" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. 보정 표본 512개로 채널별 최댓값을 모읍니다</h2>
          <div className={prose}>
            <p>
              s의 분자인 max|X_j|는 calibration.py 13–51행 get_act_scales가 만듭니다. 모델의 모든 Linear에 forward hook을 걸고 들어온
              입력을 (token, 채널)로 펼쳐 token 축 최댓값을 구한 뒤 이전 표본까지의 값과 다시 max를 취합니다. 결과는 Linear마다 채널 수 길이의 벡터 하나입니다.
            </p>
            <p>
              기본값은 표본 512개, 길이 512입니다. 논문도 Pile에서 무작위 문장 512개로 smoothing factor와 정적 간격을 한 번 보정한 뒤 모든 평가에
              같은 모델을 썼다고 적습니다. 보정 표본이 실제 traffic의 채널 최댓값을 덮지 못하면 s도 틀어집니다. 이 위험은{" "}
              <Link to="/cs/ai/ptq-calibration#coverage">PTQ calibration의 coverage</Link>에서 구간별로 재는 방법을 다룹니다.
            </p>
            <p>
              smoothing 다음의 양자화는 fake_quant.py가 흉내 냅니다. 16–46행에 weight per-tensor, activation per-token, activation per-tensor 세 함수가
              있고 모두 절댓값 최대를 127로 나눈 간격으로 반올림합니다. 3절의 Δ_X = 64/127이 이 per-tensor 식입니다. 논문은 이 조합을 O1·O2·O3의 세
              단계로 묶습니다.
            </p>
          </div>
          <ProgressiveDetail
            title="O1·O2·O3는 무엇이 다른가요?"
            preview="weight는 셋 다 per-tensor이고 activation 간격을 token마다 실행 중에 잴지, 행렬 하나로 실행 중에 잴지, 미리 고정할지가 다릅니다."
          >
            <p>
              논문 Table 2 기준으로 O1은 activation per-token dynamic, O2는 per-tensor dynamic, O3는 per-tensor static입니다. dynamic은 실행 중에 최댓값을
              재고, static은 보정 때 정한 간격을 그대로 씁니다. O3로 갈수록 실행 중 계산이 줄어 지연이 낮아진다고 논문은 설명합니다. 정적 간격은 보정
              표본과 실제 입력의 차이를 그대로 떠안습니다.
            </p>
          </ProgressiveDetail>
          <div className="flex flex-wrap gap-2">
            {code("act-scales", "채널별 activation 최댓값 수집")}
            {code("fake-quant", "absmax/127 세 가지 간격 단위")}
          </div>
        </section>

        <section id="engines" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 지금의 서빙 엔진은 변환 도구 단계에서 SmoothQuant를 씁니다</h2>
          <div className={prose}>
            <p>
              smoothing은 checkpoint를 만들 때 끝나는 변환이라 서빙 엔진 안에 SmoothQuant라는 실행 경로가 따로 있지는 않습니다. 엔진은 smoothing과 양자화가
              끝난 W8A8 checkpoint를 받아 INT8 행렬곱 kernel로 실행합니다. 그래서 확인할 곳은 변환 도구의 recipe와 엔진의 kernel 지원 범위입니다.
            </p>
            <p>
              vLLM 문서의 INT8 W8A8 안내는 llm-compressor에서 SmoothQuantModifier(smoothing_strength=0.8)를 먼저 적용하고 GPTQModifier로 W8A8 양자화를
              이어서 거는 recipe를 보여 줍니다. 결과 이름에는 Dynamic-Per-Token이 붙는데, 5절의 바깥 축인 token별 activation 간격을 실행 중에 잰다는
              뜻입니다. 0.8은 그 예제의 값이며 모든 모델의 권장값으로 읽지 않습니다.
            </p>
            <p>
              같은 문서는 INT8 계산이 Turing부터 Hopper까지의 GPU에서 지원되고 compute capability 10.0 이상의 Blackwell에서는 지원되지 않으니 FP8을 쓰라고
              적습니다. 하드웨어 세대에 따라 W8A8의 숫자 형식 자체가 바뀌는 셈입니다.
            </p>
            <p>
              TensorRT-LLM의 양자화 블로그는 배치가 16 이상인 서빙에서 FP8을 먼저 시도하고 결과가 부족하면 INT8 SmoothQuant를 이어서 시험하라고 권합니다.
              같은 표에서 정확도 영향은 FP8이 Very Low, INT8 SQ가 Medium입니다. 현재 기본 PyTorch backend 문서의 양자화 recipe 목록에는
              FP8·FP4와 W4A16·W4A8 AWQ/GPTQ가 있고 INT8 SmoothQuant는 없습니다.
            </p>
            <p>
              FP8이 먼저 권해지는 이유를 이 글은 이렇게 해석합니다. (가정) FP8 E4M3는 지수 비트가 있어 작은 값도 상대 정밀도를 어느 정도 지키므로, 3절처럼
              한 채널이 커도 나머지 채널이 눈금 4개로 몰리는 일이 INT8보다 덜합니다. 형식별 표현 범위는{" "}
              <Link to="/cs/ai/quantization-formats-and-granularity#floating-point-formats">FP8·FP4 형식</Link>에서 봅니다.
            </p>
          </div>
          <div id="paper-engine-docs" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="vLLM docs · Quantization · INT8 W8A8 (v0.27.1 소스 트리 docs, 2026-10-14 확인)" citeKey={2} href="https://docs.vllm.ai/en/latest/features/quantization/llm_compressor/int8_w8a8/">
              <q>INT8 is not supported on compute capability &gt;= 10.0</q> 같은 문서의 recipe는 SmoothQuantModifier(smoothing_strength=0.8)와
              GPTQModifier(scheme=&quot;W8A8&quot;)를 차례로 적용합니다.
            </CitationBlock>
            <CitationBlock source="TensorRT-LLM · Speed up inference with SOTA quantization techniques (commit 681cff1 docs/source/blogs)" citeKey={3} href="https://github.com/NVIDIA/TensorRT-LLM/blob/681cff123b96e0a8fd52d977366a62677de7ae08/docs/source/blogs/quantization-in-TRT-LLM.md">
              <q>We suggest to prioritize using FP8 first</q> 다음 문장이 INT8 SmoothQuant, AWQ·GPTQ 순으로 시험하라고 이어 갑니다. 현재 기능 문서
              docs/source/features/quantization.md의 recipe 목록에는 INT8 SmoothQuant가 없습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="paper-smoothquant" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 논문의 결과는 OPT·BLOOM·GLM 조건에서 읽습니다</h2>
          <div className={prose}>
            <p>
              논문의 핵심 표는 smoothing 없이 activation을 per-tensor로 양자화했을 때 무엇이 무너지는지 보여 줍니다. OPT-175B에서 단순 W8A8은 일곱 개
              zero-shot 과제 평균 35.5%, WikiText perplexity 93,080으로 거의 무작위였습니다. SmoothQuant-O3는 평균 66.8%, perplexity 11.17로 FP16의
              66.9%와 10.99에 가까웠습니다. 모두 저자가 보고한 값입니다.
            </p>
            <p>
              α도 모델마다 다릅니다. 논문은 OPT와 BLOOM에서 0.5가 균형점이었고, activation 이상치가 더 심한 GLM-130B에서는 0.75를 썼다고 적습니다.
              Pile 검증 집합 일부에서 빠르게 grid search로 고른 값입니다. GLM-130B에서는 O3가 FP16보다 평균 1% 정도 낮았다고 보고합니다.
            </p>
            <p>
              이 결과는 2022년의 OPT·BLOOM·GLM과 당시 INT8 kernel 조건에서 나온 것입니다. 이후 모델과 FP8 GPU에서 같은 차이가 난다는 뜻은 아닙니다. 10절의
              엔진 문서가 FP8을 먼저 권하는 것도 이 조건 변화와 함께 읽습니다.
            </p>
          </div>
          <div className="not-prose my-8">
            <CitationBlock source="Xiao 외 · SmoothQuant (ICML 2023), §4 식 (3)·(4), §5 Table 2–4" citeKey={4} href="https://arxiv.org/abs/2211.10438">
              <q>α = 0.5 is a well-balanced point to evenly split the quantization difficulty</q> 같은 절은 GLM-130B에 0.75를 쓴 이유를 activation 이상치가
              더 심하다는 관찰로 설명합니다. Table 3의 OPT-175B 수치는 저자 측정입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. norm 뒤가 아닌 입력과 분포가 바뀐 입력은 따로 봅니다</h2>
          <div className={prose}>
            <p>
              흡수할 앞 연산이 없으면 s를 공짜로 넣을 수 없습니다. 8절의 Llama 코드는 attention 출력이 들어가는 o_proj와 MLP 끝의 down_proj에는 smoothing을
              걸지 않습니다. 둘의 입력은 norm이 아니라 앞 계산의 출력이기 때문입니다. 논문은 residual add에서 오는 입력이라면 residual 쪽에 별도의 scale을
              더해야 한다고 적습니다.
            </p>
            <p>
              s는 보정 표본에서 잰 최댓값으로 고정됩니다. 서비스 traffic의 언어나 길이 분포가 달라 채널 최댓값이 바뀌면 smoothing이 덜 맞고, static 간격을 쓰는
              O3는 그 차이를 그대로 받습니다. α도 같은 모델 군 안에서 고른 값이라 새 모델에서는 다시 골라야 합니다.
            </p>
            <p>
              weight-only 방식과 섞어 비교할 때는 목적이 다르다는 점을 기억합니다. <Link to="/cs/ai/weight-only-quantization">GPTQ·AWQ</Link>는 weight 바이트를
              줄여 작은 배치의 읽기 시간을 줄이고, SmoothQuant는 activation까지 8비트로 만들어 큰 배치의 곱셈을 정수로 돌립니다. AWQ도 activation 크기를 보고
              채널 scale을 정하지만 그 목적은 weight 오차를 줄이는 것입니다.
            </p>
          </div>
          <ContentBoundary article="smoothquant-activation-smoothing" />
        </section>

        <section id="review" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. 같은 작은 행렬로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>3절의 X에서 채널 3의 64를 128로 바꾸면 per-tensor 양자화에서 채널 1이 쓰는 눈금은 몇 개가 되나요? (답: 3절)</p>
            <p>입력 채널마다 간격을 따로 두면 문제가 풀리는데 INT8 kernel은 왜 그 방식을 쓰지 않나요? (답: 5절)</p>
            <p>α = 1로 두면 activation은 완벽히 평평해지는데 왜 기본값이 0.5인가요? (답: 6절)</p>
            <p>Llama 층의 o_proj 입력에 큰 채널이 있다면 smooth.py가 그 채널을 평평하게 해 주나요? (답: 12절)</p>
          </div>
        </section>
        <QuantizationMapReturn current="activation-smoothing" />
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={smoothquantTrees}
        projectMetas={{
          smoothquant: {
            id: "smoothquant",
            label: "SmoothQuant c61476d 원문",
            badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
          },
        }}
      />
    </>
  );
}
