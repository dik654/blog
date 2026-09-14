import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import BlendViz from "./viz/BlendViz";

export default function BlendRegression() {
  return (
    <section id="blend-regression" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">둘을 섞으면 평균 얼굴 쪽으로 끌려갑니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          참조 얼굴이 정체성을 공급한다면, 가진 참조들을 섞어 새 인물을 만들 수 있지 않을까. 자연스러운
          발상이고 배선도 정확히 동작합니다. 같은 이미지를 배치에 반복해 넣으면 정확한 가중 혼합이 됩니다.
        </p>

        <p className="leading-7">
          열두 명의 참조 뱅크에서 단독과 혼합을 예순 번 뽑아 새 인물로 인정되는 것만 남겼습니다. 단독에서 두
          명이 나왔고 혼합 마흔여덟 번에서는 한 명도 나오지 않았습니다.
        </p>

        <p className="leading-7">
          이유는 평균의 정의 그 자체입니다. 혼합 결과끼리가 단독 결과끼리보다 더 뭉치고 전체 평균 얼굴에도 더 가깝습니다. 두 얼굴을 평균하면 평균 얼굴 쪽으로 끌려가므로 혼합은 뱅크를
          넓히는 것이 아니라 좁힙니다.
        </p>
      </div>

      <BlendViz />

      <ExplainedFormula
        question="왜 혼합이 새 인물을 만들지 못합니까"
        idea="정체성 벡터를 평균하면 결과는 항상 두 벡터를 잇는 선분 위에 놓이고, 그 선분은 전체 평균 쪽으로 치우쳐 있어 바깥으로 나갈 수가 없습니다."
        formula={String.raw`\mathbf{v}_{\text{mix}} = \alpha\,\mathbf{v}_a + (1-\alpha)\,\mathbf{v}_b, \quad \alpha \in [0,1]`}
        annotatedFormula={String.raw`\mathbf{v}_{\text{mix}} = \underbrace{\alpha\,\mathbf{v}_a + (1-\alpha)\,\mathbf{v}_b}_{\text{두 벡터를 잇는 선분 위의 한 점}}`}
        operations={[
          {
            expression: String.raw`\|\mathbf{v}_{\text{mix}} - \bar{\mathbf{v}}\| \le \max(\|\mathbf{v}_a - \bar{\mathbf{v}}\|, \|\mathbf{v}_b - \bar{\mathbf{v}}\|)`,
            annotation: [
              "혼합 결과는 두 원본보다 전체 평균에서 더 멀어질 수 없습니다",
              "볼록 결합이므로 바깥으로 나가는 것이 구조적으로 불가능합니다",
            ],
          },
          {
            expression: String.raw`\alpha = 0.75`,
            annotation: "같은 이미지를 네 칸 중 세 칸에 넣으면 정확히 이 비율의 혼합이 됩니다",
          },
          {
            expression: String.raw`\alpha \to 0 \text{ or } 1`,
            annotation: "양 끝에서만 원본에 가까워지므로 혼합의 이점 자체가 사라집니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\mathbf{v}_a, \mathbf{v}_b`, name: "참조 정체성 벡터", description: "뱅크에 있는 두 인물의 벡터입니다." },
          { symbol: String.raw`\alpha`, name: "혼합 비율", description: "배치에서 각 이미지가 차지하는 비율로 정해집니다." },
          { symbol: String.raw`\bar{\mathbf{v}}`, name: "전체 평균", description: "뱅크 전체의 평균 얼굴 벡터입니다." },
        ]}
        assumptions={[
          "정체성 주입이 벡터 평균으로 구현됐다고 가정합니다. 다른 결합 방식이라면 결론이 달라질 수 있습니다.",
          "생성 결과의 정체성이 주입 벡터를 충실히 따른다고 가정합니다. 실제로는 모델의 사전도 함께 작용합니다.",
        ]}
        interpretation="식이 말하는 것은 혼합으로 뱅크를 늘리려는 시도가 구현 문제가 아니라 구조적으로 막혀 있다는 점입니다. 용량을 늘리려면 선분 위가 아니라 바깥에서 새 벡터를 가져와야 합니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          다른 종류의 혼합에서는 배선 자체가 깨졌습니다. 두 프롬프트의 조건 텐서를 가중 평균해 "이쪽 70퍼센트
          저쪽 30퍼센트"를 만드는 방식인데, 구현이 한쪽을 다른 쪽의 토큰 길이에 맞춰 잘라 냅니다. 길이가
          다른 두 문장을 섞으면 토큰 위치가 어긋나 결과가 무너집니다.
        </p>

        <p className="leading-7">
          이걸 모르고 재면 그럴듯한 지표까지 나옵니다. 실제로 "비대칭도가 단조 감소한다"는 관찰을 얻었는데,
          깨진 이미지를 재고 있었던 것입니다. 프롬프트 단독도 자기 자신과의 혼합도 멀쩡했기 때문에 원인을
          찾는 데 시간이 걸렸습니다.
        </p>

        <p className="leading-7">
          그래서 슬라이더형 조절이 필요하면 프롬프트를 섞는 대신 참조로 인물을 고정하고 표현만 단계별 문구로
          바꾸는 쪽이 낫습니다. 이 방식에서는 전 구간 정체성이 0.89에서 0.93으로 유지되면서 추정 나이가
          쉰하나에서 마흔하나로 움직이고 골격은 변하지 않습니다.
        </p>

        <p className="leading-7">
          참조로 정체성을 고정하는 방식 자체는{" "}
          <Link to="/cs/ai/reference-identity-pose-separation">정체성과 포즈 분리</Link>가 소유합니다. 이 절은
          그 고정을 다이얼의 축으로 쓰는 부분만 다뤘습니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 참조 혼합과 조건 혼합 (2026-09-11, RTX 4090 48GB)"
        citeKey={2}
        href="https://github.com/dik654/blog"
      >
        열두 명 뱅크에서 예순 번 시도해 단독이 두 명, 혼합 마흔여덟 번이 0명을 기여했습니다. 혼합 결과끼리의
        평균 유사도가 0.549로 단독끼리의 0.437보다 높고, 전체 평균 얼굴과의 유사도도 0.747로 0.686보다
        높았습니다. 조건 텐서 혼합은 길이가 다른 두 프롬프트에서 토큰 정렬이 깨져 결과가 무너졌습니다.
      </CitationBlock>
    </section>
  );
}
