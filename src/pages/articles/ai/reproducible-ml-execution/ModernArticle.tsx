import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ReproductionTestViz } from "../experiment-tracking/viz/ModernExperimentViz";

export default function ReproducibleMlExecutionArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          재현은 seed 하나가 아니라 어떤 결과를 같다고 볼지 정하고 빈 환경에서
          검증하는 과정입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Reproducible execution</strong>은 같은 immutable inputs와
            실행 계약으로 다시 수행했을 때 미리 선언한 equivalence level을
            통과하는 실행입니다.
          </p>
          <p>
            먼저 같음의 수준을 고릅니다. 다음으로 병렬 worker의 random stream을
            계층적으로 파생합니다. 마지막에는 개발 machine의 cache와 숨은
            state가 없는 clean room에서 첫 divergence를 찾습니다.
          </p>
        </div>
        <TermBreakdown
          title="결과가 같다는 말의 네 수준"
          items={[
            {
              term: "Bitwise equality",
              description: "Output bytes의 digest가 완전히 같습니다.",
              example:
                "같은 checkpoint serialization이 같은 SHA-256 digest를 냅니다.",
              boundary:
                "Hardware·library·parallel reduction이 달라지면 필요 이상으로 강한 요구일 수 있습니다.",
            },
            {
              term: "Numeric equality",
              description:
                "Tensor별 absolute·relative error가 선언된 tolerance 안입니다.",
              example: "logit max error가 1e-5 이하인지 검사합니다.",
              boundary:
                "작은 수치 차이가 ranking·threshold decision을 바꾸는지 별도 확인합니다.",
            },
            {
              term: "Statistical equality",
              description:
                "여러 seed 결과의 분포·신뢰구간이 허용 범위에서 같습니다.",
              example: "10개 seed의 mean F1과 variance를 비교합니다.",
              boundary: "한 번의 우연한 성공으로 분포 claim을 만들지 않습니다.",
            },
            {
              term: "Behavioral equality",
              description:
                "중요 slice와 product decision이 같은 acceptance rule을 통과합니다.",
              example:
                "모든 safety slice에서 false-negative ceiling을 만족합니다.",
              boundary:
                "Aggregate metric 하나가 같아도 slice failure를 숨길 수 있습니다.",
            },
          ]}
        />
        <ReproductionTestViz />
        <ContentBoundary article="reproducible-ml-execution" />
      </section>

      <section id="equivalence-level" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          목적에 맞는 equality gate를 실행 전에 선언합니다
        </h2>
        <ExplainedFormula
          question="두 output이 수치적으로 같다는 판정을 scale이 다른 tensor에도 적용하려면 어떻게 하나요?"
          idea={
            <p>
              각 원소 차이를 absolute tolerance와 값의 크기에 비례한 relative
              tolerance의 합과 비교하고, 모든 원소가 통과해야 numeric equality로
              판정합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}e_i&=|y_i-\hat y_i|\\\tau_i&=\varepsilon_a+\varepsilon_r|y_i|\\Q_{\rm num}&=\bigwedge_i[e_i\le\tau_i]\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}e_i&=\underbrace{|y_i-\hat y_i|}_{\text{두 output의 원소 거리}}\\\tau_i&=\underbrace{\varepsilon_a+\varepsilon_r|y_i|}_{\text{고정·비례 tolerance 결합}}\\Q_{\rm num}&=\underbrace{\bigwedge_i[e_i\le\tau_i]}_{\text{모든 원소 검사를 AND}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`|y_i-\hat y_i|`,
              annotation: [
                "두 값을 빼고 절댓값을 취해",
                "부호와 무관한 원소 오차 계산",
              ],
            },
            {
              expression: String.raw`\varepsilon_a+\varepsilon_r|y_i|`,
              annotation: [
                "고정 허용량과 scale 비례 허용량을 더해",
                "0 근처와 큰 값 모두에 맞는 threshold 생성",
              ],
            },
            {
              expression: String.raw`\bigwedge_i`,
              annotation: [
                "모든 원소 판정을 AND해",
                "일부 tensor만 맞는 결과를 전체 성공으로 오인하지 않음",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`y_i,\hat y_i`,
              name: "Reference · reproduced value",
              description: "기준 실행과 재실행의 같은 위치 output입니다.",
            },
            {
              symbol: String.raw`\varepsilon_a`,
              name: "Absolute tolerance",
              description: "0 근처에서도 유지되는 고정 허용 오차입니다.",
            },
            {
              symbol: String.raw`\varepsilon_r`,
              name: "Relative tolerance",
              description: "기준값 크기에 비례하는 허용 오차 비율입니다.",
            },
            {
              symbol: String.raw`Q_{\rm num}`,
              name: "Numeric equality gate",
              description:
                "대상 원소 전체가 tolerance를 통과했다는 판정입니다.",
            },
          ]}
          assumptions={[
            "Tensor shape·dtype·element correspondence가 먼저 일치합니다.",
            "Tolerance는 결과를 본 뒤 넓히지 않고 사전 등록합니다.",
            "NaN·Inf는 별도 명시 규칙으로 처리합니다.",
          ]}
          interpretation="두 tolerance를 더하는 이유는 작은 값에는 absolute bound가, 큰 값에는 relative bound가 필요하기 때문입니다. 마지막 AND는 단 하나의 큰 divergence도 숨기지 않습니다."
        />
      </section>

      <section id="seed-tree" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          병렬 실행은 root seed를 복사하지 않고 좌표별 child stream을 파생합니다
        </h2>
        <ExplainedFormula
          question="Worker 수와 retry가 달라도 random stream이 충돌하지 않고 다시 만들어지게 하려면 어떻게 하나요?"
          idea={
            <p>
              Root seed와 run·rank·worker·epoch 좌표를 domain-separated hash에
              넣어 child seed를 만듭니다.
            </p>
          }
          formula={String.raw`s_{r,w,e}=H(s_0\Vert\texttt{train}\Vert r\Vert w\Vert e)\bmod 2^{64}`}
          annotatedFormula={String.raw`\begin{aligned}b_{r,w,e}&=\underbrace{\operatorname{encode}(s_0,\texttt{train},r,w,e)}_{\text{root와 stream 좌표를 모호하지 않게 직렬화}}\\d_{r,w,e}&=\underbrace{H(b_{r,w,e})}_{\text{각 좌표를 독립적인 digest로 확산}}\\s_{r,w,e}&=\underbrace{d_{r,w,e}\bmod 2^{64}}_{\text{PRNG가 받는 64-bit seed 범위로 축소}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{encode}(s_0,\texttt{train},r,w,e)`,
              annotation: [
                "root와 역할·병렬 좌표를 길이 구분해 묶어",
                "tuple collision과 stream 재사용 방지",
              ],
            },
            {
              expression: String.raw`H(b_{r,w,e})`,
              annotation: [
                "좌표 bytes를 hash해",
                "가까운 worker 번호도 상관이 낮은 seed로 확산",
              ],
            },
            {
              expression: String.raw`\bmod 2^{64}`,
              annotation: [
                "digest를 64-bit 범위로 나머지 연산해",
                "대상 PRNG input 폭에 맞춤",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`s_0`,
              name: "Root seed",
              description:
                "실험 specification에 고정한 최상위 random identity입니다.",
            },
            {
              symbol: String.raw`r,w,e`,
              name: "Run · worker · epoch",
              description:
                "Random stream의 역할과 병렬 실행 위치를 구분하는 좌표입니다.",
            },
            {
              symbol: String.raw`\texttt{train}`,
              name: "Domain label",
              description:
                "Training, augmentation, sampling처럼 용도가 다른 stream의 재사용을 막습니다.",
            },
            {
              symbol: String.raw`s_{r,w,e}`,
              name: "Child seed",
              description:
                "특정 좌표의 PRNG를 초기화하는 재생 가능한 seed입니다.",
            },
          ]}
          assumptions={[
            "Hash·encoding·endianness version을 execution spec에 고정합니다.",
            "Library 내부에서 추가 생성되는 generator도 seed tree에 등록합니다.",
            "Retry가 같은 random stream을 재사용할지 새 attempt coordinate를 쓸지 정책화합니다.",
          ]}
          interpretation="모든 worker에 같은 seed를 복사하면 augmentation과 dropout stream이 겹칠 수 있습니다. 좌표를 hash에 넣는 연산은 각 child stream을 분리하면서도 root 하나로 다시 생성하기 위함입니다."
        />
      </section>

      <section id="clean-room" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Clean-room test는 숨은 입력을 제거하고 최초 divergence를 보고합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            빈 workspace에서 immutable dataset·code·container·command만 주입해
            다시 실행합니다. Input digest, environment probe, intermediate
            artifact, final metric과 slice gate를 순서대로 비교합니다. 실패
            보고는 “재현 안 됨”으로 끝내지 않고 처음 달라진 stage와 두
            receipts를 남깁니다.
          </p>
        </div>
        <div id="paper-ml-reproducibility" className="scroll-mt-24">
          <CitationBlock
            source="Machine Learning: The High Interest Credit Card of Technical Debt"
            citeKey={1}
            href="https://research.google/pubs/machine-learning-the-high-interest-credit-card-of-technical-debt/"
          >
            <strong>문제:</strong> ML system의 숨은 data
            dependency·configuration·pipeline debt가 결과 신뢰성을 약화함.{" "}
            <strong>기여:</strong> ML-specific technical debt와 boundary
            erosion을 구조화. <strong>전제:</strong> 조직·production ML system
            관점의 position paper. <strong>근거 범위:</strong> 숨은 coupling과
            configuration debt의 위험. <strong>과장 금지:</strong> 특정
            reproducibility protocol을 표준화한 논문은 아닙니다.
          </CitationBlock>
        </div>
        <div id="standard-pytorch-reproducibility" className="scroll-mt-24">
          <CitationBlock
            source="PyTorch: Reproducibility"
            citeKey={2}
            href="https://docs.pytorch.org/docs/stable/notes/randomness.html"
          >
            <strong>문제:</strong> RNG·algorithm·platform 차이가 동일 코드의
            결과를 바꿀 수 있음. <strong>기여:</strong> Randomness 제어와
            deterministic algorithm의 공식 경계를 설명. <strong>전제:</strong>{" "}
            Release·platform·device가 달라지면 완전한 재현이 보장되지 않음.{" "}
            <strong>근거 범위:</strong> PyTorch execution의 randomness control.{" "}
            <strong>과장 금지:</strong> Seed 설정만으로
            data·artifact·environment 재현이 완성된다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
