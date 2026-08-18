import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "../reverse-mode-autodiff/codeRefs";
import AutodiffGraphViz from "./viz/AutodiffGraphViz";

export default function ForwardPass({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <p className="mb-3 text-sm font-bold text-primary">용어 1 · computational graph</p>
      <h2 className="mb-6 text-3xl font-bold">계산을 값과 operation의 화살표로 먼저 그린다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Computational graph</strong>는 계산 중 생긴 값을 node로,
          값을 만든 operation을 화살표로 나타낸 실행 지도입니다. 예를 들어
          <code>a=wx</code>, <code>L=a²</code>이면 <code>w·x → a → L</code>이라는
          두 단계가 먼저 생깁니다. 아직 미분하지 않습니다. 어떤 값이 어떤 값에
          의존하는지만 고정합니다.
        </p>
      </div>

      <AutodiffGraphViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="tape" className="scroll-mt-20">용어 2 · autodiff tape</h3>
        <p>
          <strong>Tape</strong>는 이 graph를 거꾸로 실행할 때 필요한 operation 순서와
          중간값을 적어 둔 기록입니다. Linear layer에서는 weight gradient에 입력
          <code>X</code>가 필요하고 activation derivative에는 <code>Z</code> 또는
          <code>A</code>가 필요합니다. 그래서 training forward는 prediction뿐 아니라
          backward용 saved tensor도 만듭니다.
        </p>
      </div>

      <ExplainedFormula
        question="linear layer의 forward가 backward에 필요한 어떤 값을 남겨야 할까?"
        idea={<>matrix multiplication으로 pre-activation Z를 만들고 activation f를 적용합니다. Weight gradient에는 X가, activation backward에는 Z 또는 A가 필요하므로 framework는 이 tensor들을 saved state로 보관합니다.</>}
        formula={String.raw`Z=XW+\mathbf 1b^\top,\qquad A=f(Z)`}
        annotatedFormula={String.raw`\begin{aligned}Z_{\rm lin}&=\underbrace{XW}_{\substack{\text{입력을 weight basis로}\text{투영}}}\\[7pt]Z&=\underbrace{Z_{\rm lin}+\mathbf 1b^\top}_{\substack{\text{공유 bias를}\text{모든 row에 더함}}}\\[7pt]A&=\underbrace{f(Z)}_{\substack{\text{다음 layer 표현으로}\text{변환}}}\end{aligned}`}
        operations={[
          { expression: String.raw`XW`, annotation: ["각 sample을 같은 weight로 투영해", "output feature를 만듦"] },
          { expression: String.raw`\mathbf 1b^\top`, annotation: ["한 bias vector를", "batch 모든 row에 복제해 더함"] },
          { expression: String.raw`f(Z)`, annotation: ["linear 결과에 nonlinearity를 적용해", "다음 layer activation을 만듦"] },
        ]}
        terms={[
          { symbol: "X\\in\\mathbb R^{B\\times D_{in}}", name: "batch input", description: "B개 sample의 input 또는 이전 layer activation입니다." },
          { symbol: "W\\in\\mathbb R^{D_{in}\\times D_{out}}", name: "weight", description: "batch 전체가 공유하는 trainable parameter입니다." },
          { symbol: "b\\in\\mathbb R^{D_{out}}", name: "bias", description: "batch dimension으로 broadcast됩니다." },
          { symbol: "Z_{\\rm lin}", name: "linear projection", description: "bias를 더하기 전 XW의 결과입니다." },
          { symbol: "Z,A", name: "saved activations", description: "Z는 nonlinearity 전 값, A는 적용 후 값입니다." },
        ]}
        assumptions={["row-major batch 표기이며 framework에 따라 weight를 transpose해 저장할 수 있습니다."]}
        interpretation="forward activation memory가 training memory의 큰 비중을 차지하는 이유는 backward가 local derivative를 계산할 때 이 중간값을 다시 사용하기 때문입니다."
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("linear-forward", codeRefs["linear-forward"])
        }
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Activation checkpointing</strong>은 일부 중간값을 저장하지 않고 backward 때
          forward를 다시 계산해 memory를 줄이는 대신 compute를 더 쓰는
          trade-off입니다. 즉 gradient 공식을 바꾸지 않고 tape의 저장 정책을 바꿉니다.
          In-place operation이나 detach가 문제가 되는지도 이 graph와 saved tensor의
          수명 관점에서 확인해야 합니다.
        </p>
        <p id="paper-autodiff" className="scroll-mt-20">
          Forward·reverse accumulation의 계산 차이와 tape 구현 범위는
          <a href="https://jmlr.org/papers/v18/17-468.html" target="_blank" rel="noreferrer"> automatic differentiation survey</a>를
          기준으로 확인합니다. 이 survey는 derivative 계산을 설명하지만 optimizer의
          수렴이나 함수의 differentiability를 대신 보장하지는 않습니다.
        </p>
      </div>
    </section>
  );
}
