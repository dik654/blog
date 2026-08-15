import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { FlowChangeViz } from "../generative-theory/viz/ModernGenerativeTheoryViz";

export default function NormalizingFlowsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="bijection" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Normalizing flow는 쉬운 분포를 가역적으로 휘어 data 분포를 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Normalizing flow</strong>는 density와 sampling이 쉬운 base
            variable z를 differentiable bijection f로 x에 옮깁니다. 같은 함수를
            역으로도 계산하므로 sample·latent inference·exact likelihood를 모두
            연결합니다.
          </p>
        </div>
        <TermBreakdown
          title="좌표를 옮길 때 필요한 네 물체"
          items={[
            {
              term: "Base z",
              description: "Density와 sampling이 쉬운 출발 좌표입니다.",
              example: "Standard Gaussian입니다.",
              boundary: "Data x와 같은 dimension을 사용합니다.",
            },
            {
              term: "Bijection f",
              description: "각 z와 x를 일대일로 연결하는 가역 함수입니다.",
              example: "x=f(z), z=f⁻¹(x)입니다.",
              boundary:
                "Many-to-one transform에는 단일 inverse 공식을 쓸 수 없습니다.",
            },
            {
              term: "Jacobian",
              description:
                "입력의 작은 길이·면적·부피가 얼마나 변하는지 나타냅니다.",
              example: "x=2z는 길이를 두 배 늘립니다.",
              boundary:
                "High dimension에서는 determinant 계산 구조가 중요합니다.",
            },
            {
              term: "Density correction",
              description: "늘어난 volume에 같은 mass를 나눠 담는 보정입니다.",
              example: "길이가 두 배면 density는 절반입니다.",
              boundary: "Probability mass와 density 값을 혼동하지 않습니다.",
            },
          ]}
        />
        <FlowChangeViz />
        <ContentBoundary article="normalizing-flows" />
      </section>

      <section id="change-of-variables" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Jacobian을 곱하는 이유는 probability mass를 보존하기 위해서입니다
        </h2>
        <ExplainedFormula
          question="x=2z처럼 공간이 늘어날 때 왜 inverse Jacobian을 density에 곱하나요?"
          idea={
            <p>
              같은 probability mass가 두 배 넓은 x 구간에 퍼지면 단위 길이당
              density는 절반이어야 합니다. Inverse derivative가 바로 그 보정
              비율입니다.
            </p>
          }
          formula={String.raw`\begin{aligned}z&=f^{-1}(x)\\r(x)&=\left|\det\frac{\partial z}{\partial x}\right|\\p_X(x)&=p_Z(z)r(x)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}z&=\underbrace{f^{-1}(x)}_{\text{base 좌표로 되돌림}}\\r(x)&=\underbrace{\left|\det\frac{\partial z}{\partial x}\right|}_{\text{local volume 비율}}\\p_X(x)&=\underbrace{p_Z(z)r(x)}_{\text{같은 mass라 volume만큼 보정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`f^{-1}(x)`,
              annotation: [
                "data 좌표를 역변환해",
                "base density를 읽을 위치 계산",
              ],
            },
            {
              expression: String.raw`\left|\det\partial z/\partial x\right|`,
              annotation: [
                "local volume 비율을 측정해",
                "늘어남·줄어듦을 양수 scale로 변환",
              ],
            },
            {
              expression: String.raw`p_Z(z)r(x)`,
              annotation: [
                "base density에 volume ratio를 곱해",
                "같은 probability mass 보존",
              ],
            },
          ]}
          terms={[
            {
              symbol: "f",
              name: "Forward transform",
              description: "Base z를 data x로 보내는 bijection입니다.",
            },
            {
              symbol: String.raw`f^{-1}`,
              name: "Inverse transform",
              description: "Data x를 base 좌표로 되돌립니다.",
            },
            {
              symbol: String.raw`\det(\partial z/\partial x)`,
              name: "Inverse Jacobian determinant",
              description: "Local volume correction scalar입니다.",
            },
          ]}
          assumptions={[
            "f는 differentiable bijection입니다.",
            "x와 z의 dimension이 같습니다.",
            "Inverse와 determinant를 실제로 계산할 수 있는 architecture입니다.",
          ]}
          interpretation="x=2z이면 z=x/2이고 |dz/dx|=1/2이므로 pX(x)=pZ(x/2)/2입니다. 두 배 넓어진 구간에 같은 mass가 퍼져 density가 절반이 됩니다."
        />
      </section>

      <section id="failure-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Exact likelihood의 대가는 가역성 제약입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            x=z²는 z와 −z가 같은 x로 가므로 bijection이 아닙니다. 한 inverse
            branch만 골라 determinant를 곱하면 다른 branch의 mass를 잃습니다.
          </p>
          <p>
            실전 flow는 coupling layer처럼 Jacobian determinant와 inverse를 싸게
            계산하는 구조를 사용합니다. 높은 likelihood가 perceptual quality와
            같은 순위를 만든다는 보장은 없습니다.
          </p>
        </div>
      </section>

      <section id="paper-real-nvp" className="scroll-mt-20">
        <CitationBlock
          source="Density Estimation using Real NVP"
          citeKey={1}
          href="https://arxiv.org/abs/1605.08803"
        >
          <strong>문제:</strong> high-dimensional exact density와 sampling의
          양립. <strong>기여:</strong> tractable inverse·determinant를 가진
          affine coupling. <strong>전제:</strong> differentiable bijection과
          같은 dimension. <strong>근거 범위:</strong> 논문의 density·sample
          실험. <strong>과장 금지:</strong> likelihood와 perceptual quality의
          동일 순위를 뜻하지 않습니다.
        </CitationBlock>
      </section>
    </div>
  );
}
