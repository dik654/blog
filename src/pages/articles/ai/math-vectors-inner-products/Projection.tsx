import ExplainedFormula from "@/components/ui/explained-formula";
import ProjectionViz from "./viz/ProjectionViz";

export default function Projection() {
  return (
    <section id="projection" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Projection: 한 방향에 해당하는 성분만 남기기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          햇빛 아래 물체의 그림자를 생각하면 projection이 쉽습니다. Vector u를 기준 방향 v에 비추었을 때 v와 평행하게 남는 그림자가 projection입니다. 먼저
          dot product로 v 방향의 signed 크기를 구하고 v의 길이 제곱으로 scale을 보정한 뒤 v 방향을 다시 곱합니다.
        </p>
      </div>
      <ProjectionViz />
      <ExplainedFormula
        question="u=(3,4)를 x축 방향 v=(1,0)에 projection하면 무엇이 남을까요?"
        idea={<>u가 v 방향으로 가진 양을 dot product로 재고, 단위가 아닌 v에도 쓸 수 있도록 v·v로 나눕니다. 그 scalar를 v에 곱하면 기준 방향과 평행한 vector가 됩니다.</>}
        formula={String.raw`\operatorname{proj}_{v}(u)=\frac{u\cdot v}{v\cdot v}v\qquad\Longrightarrow\qquad \operatorname{proj}_{(1,0)}(3,4)=\frac{3}{1}(1,0)=(3,0)`}
        annotatedFormula={String.raw`\operatorname{proj}_{v}(u)=\underbrace{\frac{u\cdot v}{v\cdot v}v\qquad\Longrightarrow\qquad \operatorname{proj}_{(1,0)}(3,4)=\frac{3}{1}(1,0)=(3,0)}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\frac{u\cdot v}{v\cdot v}v\qquad\Longrightarrow\qquad \operatorname{proj}_{(1,0)}(3,4)=\frac{3}{1}(1,0)=(3,0)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","u가 v 방향으로 가진 양을 dot product로 재고,","단위가 아닌 v에도 쓸 수 있도록 v·v로 나눕니다."] },
        ]}
        terms={[
          { symbol: String.raw`u\cdot v`, name: "signed alignment", description: "u가 v 방향을 얼마나 포함하는지 길이와 방향을 함께 측정합니다." },
          { symbol: String.raw`v\cdot v`, name: "기준 길이의 제곱", description: "v의 scale을 두 번 세지 않도록 나누는 normalization 항입니다." },
          { symbol: String.raw`\operatorname{proj}_v(u)`, name: "parallel component", description: "u에서 v와 평행한 성분만 남긴 vector입니다." },
        ]}
        assumptions={["기준 vector v는 zero vector가 아니어야 합니다.", "수직 성분은 u−projᵥ(u)로 남으며 projection 하나가 원래 vector 전체를 보존하지는 않습니다.", "실제 구현은 이 수학적 전제를 그대로 두지 않습니다 — torch.nn.functional.normalize나 cosine_similarity는 분모에 작은 eps(기본값 1e-8~1e-12)를 더해 v≈0에서도 0으로 나누지 않고 안정적인(다만 무의미한) 값을 반환합니다."]}
        interpretation="u=(3,4)는 x축으로 3, x축에 수직인 방향으로 4를 가집니다. Perceptron score w·x도 input이 weight 방향으로 가진 signed 성분을 scale과 함께 재는 계산입니다."
      />
    </section>
  );
}
