import ExplainedFormula from "@/components/ui/explained-formula";

export default function Norm() {
  return (
    <section id="norm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Norm: 여러 좌표를 길이 하나로 줄이기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          원점 (0,0)에서 (3,4)까지 가려면 가로로 3, 세로로 4만큼 움직입니다. 두 이동은
          직각이므로 피타고라스 정리에 따라 실제 직선거리는 5입니다. 이 계산을 차원이 더
          많은 vector로 확장한 것이 Euclidean norm, 또는 L2 norm입니다.
        </p>
      </div>
      <ExplainedFormula
        question="Vector x=(3,4)의 원점으로부터 길이는 얼마일까요?"
        idea={<>서로 직각인 coordinate의 이동량을 제곱해 더한 뒤 제곱근을 취합니다. 제곱은 음수 좌표도 양의 거리 기여로 바꾸고, 제곱근은 단위를 원래 scale로 돌립니다.</>}
        formula={String.raw`\lVert x\rVert_2=\sqrt{\sum_{j=1}^{d}x_j^2}\qquad\Longrightarrow\qquad \lVert(3,4)\rVert_2=\sqrt{3^2+4^2}=5`}
        annotatedFormula={String.raw`\lVert x\rVert_2=\underbrace{\sqrt{\sum_{j=1}^{d}x_j^2}\qquad\Longrightarrow\qquad \lVert(3,4)\rVert_2=\sqrt{3^2+4^2}=5}_{\text{L2 norm 계산}}`}
        operations={[
          { expression: String.raw`\sqrt{\sum_{j=1}^{d}x_j^2}\qquad\Longrightarrow\qquad \lVert(3,4)\rVert_2=\sqrt{3^2+4^2}=5`, annotation: ["L2 norm이(가) 식의 결과에 기여하는 방식을 계산합니다.","서로 직각인 coordinate의 이동량을 제곱해 더한 뒤","제곱근을 취합니다."] },
        ]}
        terms={[
          { symbol: "x_j", name: "j번째 coordinate", description: "Vector를 이루는 한 방향의 signed 값입니다." },
          { symbol: "d", name: "dimension", description: "Vector에 들어 있는 coordinate 수입니다." },
          { symbol: String.raw`\lVert x\rVert_2`, name: "L2 norm", description: "원점에서 x까지의 Euclidean length인 nonnegative scalar입니다." },
        ]}
        assumptions={["좌표축이 서로 직교하고 같은 scale로 측정된 Euclidean 공간을 사용합니다.", "Norm에는 L1·L∞ 등 여러 종류가 있으므로 아래첨자 2를 생략했을 때 문맥을 확인합니다."]}
        interpretation="Norm은 vector의 전체 크기를 한 값으로 줄이지만 방향 정보는 없앱니다. (3,4)와 (−3,−4)는 방향은 반대여도 L2 norm은 모두 5입니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          두 점 x와 y 사이의 거리는 둘의 차이 x−y를 먼저 만든 뒤 그 vector의 norm을
          계산합니다. 따라서 “input norm이 R 이하”라는 말은 모든 input이 원점을 중심으로
          반지름 R인 범위 안에 있다는 뜻입니다.
        </p>
      </div>
    </section>
  );
}
