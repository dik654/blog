import ExplainedFormula from "@/components/ui/explained-formula";
import CompositionViz from "./viz/CompositionViz";

export default function Multiplication() {
  return (
    <section id="multiplication" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">행렬 곱은 두 linear map을 적용하는 순서를 합친다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          B가 input을 중간 representation으로 바꾸고 A가 그 representation을 다시
          바꾸면 전체 함수는 A(Bx)입니다. Matrix multiplication은 이 합성을 AB라는
          행렬 하나로 미리 계산합니다. B의 output dimension과 A의 input dimension이
          같아야 하는 이유도 중간 interface의 좌표 수가 맞아야 하기 때문입니다.
        </p>
      </div>
      <CompositionViz />
      <ExplainedFormula
        question="왜 A가 p×m이고 B가 m×n일 때만 AB를 만들 수 있을까요?"
        idea={<>AB의 (i,j) entry는 A의 i번째 row와 B의 j번째 column의 dot product입니다. 두 vector가 공유하는 중간 좌표가 m개로 같아야 곱하고 더할 수 있습니다.</>}
        formula={String.raw`A\in\mathbb R^{p\times m},\ B\in\mathbb R^{m\times n}\quad\Longrightarrow\quad (AB)_{ij}=\sum_{r=1}^{m}A_{ir}B_{rj},\quad AB\in\mathbb R^{p\times n}`}
        annotatedFormula={String.raw`A\in\mathbb R^{p\times m},\ B\in\mathbb R^{m\times n}\quad\Longrightarrow\quad (AB)_{ij}=\underbrace{\sum_{r=1}^{m}A_{ir}B_{rj},\quad AB\in\mathbb R^{p\times n}}_{\text{composed map 계산}}`}
        operations={[
          { expression: String.raw`\sum_{r=1}^{m}A_{ir}B_{rj},\quad AB\in\mathbb R^{p\times n}`, annotation: ["composed map이(가) 식의 결과에 기여하는 방식을","계산합니다.","AB의 (i,j) entry는 A의 i번째 row와 B의","j번째 column의 dot product입니다."] },
        ]}
        terms={[
          { symbol: "m", name: "contracted dimension", description: "B가 만드는 중간 coordinate 수이면서 A가 읽는 coordinate 수입니다." },
          { symbol: "r", name: "intermediate coordinate", description: "두 map 사이에서 전달되는 같은 위치의 성분을 순회합니다." },
          { symbol: "AB", name: "composed map", description: "B를 먼저, A를 나중에 적용한 전체 p×n transformation입니다." },
        ]}
        assumptions={["Matrix와 vector가 같은 coordinate convention과 compatible shape을 사용합니다.", "일반적으로 AB≠BA이며 둘 중 하나는 shape가 맞지 않아 정의되지 않을 수도 있습니다."]}
        interpretation="Matrix multiplication의 순서는 코드의 함수 호출과 반대로 읽힙니다. (AB)x에서는 오른쪽 B가 먼저 실행되고 왼쪽 A가 다음에 실행됩니다."
      />
    </section>
  );
}
