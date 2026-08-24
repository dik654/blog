import ExplainedFormula from "@/components/ui/explained-formula";
import CauchyBoundViz from "./viz/CauchyBoundViz";

export default function CauchySchwarz() {
  return (
    <section id="cauchy-schwarz" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Cauchy–Schwarz: 방향 성분은 전체 길이를 넘지 못한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          길이 5인 막대의 x축 그림자가 5보다 길 수는 없습니다. Cauchy–Schwarz
          inequality는 이 당연해 보이는 기하학을 모든 차원의 vector에 적용합니다. 두
          vector가 완전히 같은 직선 방향일 때 dot product의 절댓값이 가장 크고, 방향이
          어긋날수록 그보다 작아집니다.
        </p>
      </div>
      <CauchyBoundViz />
      <ExplainedFormula
        question="두 vector의 dot product는 얼마나 커질 수 있을까요?"
        idea={<>u를 v와 평행한 projection과 수직 성분으로 나눕니다. 평행 성분의 길이는 u 전체 길이를 넘을 수 없으므로, dot product의 절댓값도 두 전체 길이의 곱을 넘을 수 없습니다.</>}
        formula={String.raw`\underbrace{|u\cdot v|}_{\text{방향이 겹치는 양}}\le \underbrace{\lVert u\rVert_2\lVert v\rVert_2}_{\text{두 전체 길이의 곱}}`}
        annotatedFormula={String.raw`\underbrace{|u\cdot v|}_{\text{방향이 겹치는 양}}\le \underbrace{\underbrace{\lVert u\rVert_2\lVert v\rVert_2}_{\text{두 전체 길이의 곱}}}_{\text{length budget 계산}}`}
        operations={[
          { expression: String.raw`\underbrace{\lVert u\rVert_2\lVert v\rVert_2}_{\text{두 전체 길이의 곱}}`, annotation: ["length budget이(가) 식의 결과에 기여하는 방식을","계산합니다.","u를 v와 평행한 projection과 수직 성분으로","나눕니다."] },
        ]}
        terms={[
          { symbol: String.raw`|u\cdot v|`, name: "absolute dot product", description: "같은 방향과 반대 방향을 모두 alignment의 크기로 비교합니다." },
          { symbol: String.raw`\lVert u\rVert_2\lVert v\rVert_2`, name: "length budget", description: "두 vector가 가진 전체 길이로 만들 수 있는 최대 dot product입니다." },
          { symbol: String.raw`\le`, name: "upper bound", description: "왼쪽 값이 오른쪽을 초과할 수 없다는 보장이지, 항상 같다는 뜻은 아닙니다." },
        ]}
        assumptions={["실수 coordinate와 Euclidean dot product·L2 norm을 사용합니다.", "등호는 u와 v 중 하나가 zero이거나 두 vector가 같은 직선 위에 있을 때 성립합니다."]}
        interpretation="u=(3,4), v=(6,8)이면 |u·v|=50이고 길이의 곱도 5×10=50이라 등호입니다. v=(4,−3)이면 길이의 곱은 25지만 dot product는 0입니다. 오른쪽은 가능한 최댓값이지 실제 유사도 자체가 아닙니다."
        title="상한이 나오는 이유"
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>증명 아이디어를 한 단계 더 풀어 보기</h3>
        <p>
          v의 길이를 1로 맞춘 뒤 u를 v 방향의 그림자와 그에 수직인 나머지로 나눕니다.
          직각삼각형에서 빗변 u는 어느 한 변보다 짧을 수 없으므로 그림자 길이
          |u·v|/||v||는 ||u|| 이하입니다. 양변에 ||v||를 곱하면 위 부등식이 됩니다.
          이 설명은 좌표가 두 개일 때만의 그림이 아니라, projection과 orthogonal
          decomposition이 가능한 모든 유한 차원에서 그대로 성립합니다.
        </p>
        <h3>어디까지 읽으면 안 되는가</h3>
        <p>
          부등식은 raw dot product가 곧 의미 유사도라고 말하지 않습니다. 길이가 100인
          vector와 길이가 1인 같은 방향 vector의 dot product는 100이지만, 두 방향은 이미
          완전히 같습니다. 방향만 비교하려면 두 길이로 나눈 cosine similarity를 사용하며,
          embedding의 norm 자체가 의미를 담는 모델이라면 그 normalization이 정보를 지울
          수도 있습니다.
        </p>
      </div>
    </section>
  );
}
