import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import SimilarityViz from "./viz/SimilarityViz";

export default function Similarity() {
  return (
    <section id="similarity" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">거리에는 의미가 아닌 것도 섞여 들어옵니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          벡터를 만들었으면 거리를 재야 합니다. 관행은 L2 정규화 후 내적, 곧 코사인 유사도입니다. 정규화를 하는
          이유는 벡터 길이에 담긴 정보가 대개 우리가 원하는 의미가 아니기 때문입니다. 밝기나 대비 같은 저수준
          성질이 길이로 새어 나오는 경우가 흔합니다.
        </p>

        <p className="leading-7">
          정규화해도 남는 문제가 있습니다. 같은 사진을 밝기만 바꿔 넣으면 벡터가 조금 움직이는데, 그 이동량이
          다른 물체 사이의 거리보다 클 수 있습니다. 그러면 검색 결과가 "같은 대상"이 아니라 "비슷한 촬영 조건"으로
          모입니다. 색인 대상이 한 소스에서 왔을 때 특히 잘 나타납니다.
        </p>

        <p className="leading-7">
          확인 방법은 단순합니다. 같은 이미지에 밝기·대비·JPEG 압축 같은 변형을 걸어 여러 벌 만들고, 그 변형본
          사이의 거리와 서로 다른 대상 사이의 거리를 비교합니다. 앞의 거리가 뒤의 거리에 근접하면 저수준 단서가
          검색을 지배하고 있다는 신호입니다.
        </p>
      </div>

      <ExplainedFormula
        question="변형에 얼마나 흔들리는지를 어떻게 숫자로 재나요"
        idea="같은 대상의 변형본 사이 평균 거리를 서로 다른 대상 사이 평균 거리로 나눠, 1에 가까울수록 구분이 무너진 것으로 읽습니다."
        formula={String.raw`\rho = \frac{\overline{d}_{\text{same}}}{\overline{d}_{\text{diff}}}`}
        annotatedFormula={String.raw`\rho = \frac{\overbrace{\overline{d}_{\text{same}}}^{\text{같은 대상의 변형본 사이}}}{\underbrace{\overline{d}_{\text{diff}}}_{\text{다른 대상 사이}}}`}
        operations={[
          {
            expression: String.raw`\overline{d}_{\text{same}}`,
            annotation: [
              "한 이미지에 밝기·대비·압축 변형을 건 벌들 사이의 코사인 거리를 평균합니다",
              "변형 목록이 곧 이 지표가 측정하는 범위입니다",
            ],
          },
          {
            expression: String.raw`\overline{d}_{\text{diff}}`,
            annotation: "서로 다른 대상에서 뽑은 쌍의 코사인 거리를 평균합니다",
          },
          {
            expression: String.raw`\frac{\overline{d}_{\text{same}}}{\overline{d}_{\text{diff}}}`,
            annotation: "0에 가까우면 변형에 견고하고 1에 가까우면 같은 대상과 다른 대상이 구별되지 않습니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\rho`, name: "변형 민감도 비", description: "값이 클수록 저수준 변형이 의미 거리를 잠식하고 있다는 뜻입니다." },
          { symbol: String.raw`\overline{d}_{\text{same}}`, name: "같은 대상 내 평균 거리", description: "변형만 다른 벌들 사이의 거리입니다." },
          { symbol: String.raw`\overline{d}_{\text{diff}}`, name: "다른 대상 간 평균 거리", description: "비교 기준이 되는 거리입니다." },
        ]}
        assumptions={[
          "거리는 L2 정규화 후 코사인 거리로 계산한다고 가정합니다.",
          "변형 목록과 대상 표본이 바뀌면 값이 달라지므로 절대 기준이 아니라 같은 조건에서의 비교에만 씁니다.",
        ]}
        interpretation="이 비가 낮다고 검색 품질이 좋다는 뜻은 아닙니다. 변형에 둔감한 것과 의미를 잘 구분하는 것은 다른 성질이며, 이 지표는 저수준 단서 누출만 잡아냅니다."
      />

      <SimilarityViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          완화 방법은 둘입니다. 하나는 학습 단계에서 그 변형을 양성 쌍으로 넣어 모델이 무시하도록 만드는
          것이고, 다른 하나는 색인 전에 전처리로 변형 자체를 줄이는 것입니다. 후자는 색인과 질의 양쪽에 똑같이
          적용해야 의미가 있습니다.
        </p>

        <p className="leading-7">
          벡터 사이의 각도와 내적이 무엇을 재는지 자체는{" "}
          <Link to="/cs/ai/math-vectors-inner-products">벡터와 내적</Link>이 다룹니다. 여기서 더한 것은 그 거리에
          의미가 아닌 성분이 섞일 수 있고, 그 양을 실제로 재 볼 수 있다는 점입니다.
        </p>
      </div>
    </section>
  );
}
