import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import ThresholdViz from "./viz/ThresholdViz";

export default function IdentityMetric() {
  return (
    <section id="identity-metric" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">얼굴 심판은 두 단계이고 앞 단계가 조용히 실패합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          두 얼굴이 같은 사람인지 재는 도구는 하나처럼 보이지만 실제로는 두 모델이 이어 붙은 것입니다. 먼저
          탐지기가 이미지에서 얼굴 상자와 눈·코·입 위치를 찾고, 그다음 인식기가 정렬된 얼굴을 512차원
          벡터로 바꿉니다. 유사도는 그 벡터 두 개의 내적입니다.
        </p>

        <p className="leading-7">
          이 구분이 중요한 이유는 실패 방식이 다르기 때문입니다. 인식기가 틀리면 숫자가 이상하게 나옵니다.
          탐지기가 실패하면 숫자가 아예 나오지 않는데, 결과 표에서는 그 자리가 빈칸이나 0으로 보여서 "유사도가
          낮다"와 구분되지 않습니다.
        </p>

        <p className="leading-7">
          두 벡터를 비교하는 방식도 짚어 둘 필요가 있습니다. 인식기의 출력은 단위 길이로 정규화되어 있으므로
          내적이 곧 코사인이고, 값의 범위는 −1에서 1입니다. 서로 관계없는 두 사람은 0 근처에 모이고 같은
          사람은 위쪽으로 갑니다. 이 분포가 겹치는 구간에서 임계값을 골라야 합니다.
        </p>
      </div>

      <ThresholdViz />

      <TermBreakdown
        title="얼굴 심판의 세 부품"
        description="하나만 고장나도 전체 숫자가 무의미해지는데, 고장 방식이 서로 다릅니다."
        items={[
          {
            term: "탐지기",
            description: "이미지에서 얼굴 상자와 기준점을 찾아 정렬된 크롭을 만듭니다.",
            example: "사진에서는 거의 실패하지 않아 존재 자체를 잊기 쉽습니다.",
            boundary: "학습 분포를 벗어난 그림에서는 통째로 실패하고, 그 실패가 낮은 유사도처럼 보입니다.",
          },
          {
            term: "인식기",
            description: "정렬된 얼굴을 단위 길이 벡터로 바꿉니다.",
            example: "조명과 표정이 달라도 같은 사람이면 벡터가 가깝도록 학습돼 있습니다.",
            boundary: "학습 스케일보다 훨씬 작은 얼굴에서는 신뢰할 수 없습니다.",
          },
          {
            term: "임계값",
            description: "코사인이 이 값을 넘으면 같은 사람으로 판정합니다.",
            example: "운영에서는 허용할 오탐률을 먼저 정하고 거기서 값을 얻습니다.",
            boundary: "모델마다 다르고, 기본값을 근거 없이 물려받으면 조용히 샙니다.",
          },
        ]}
      />

      <h3 id="threshold-choice" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        임계값은 남남 쌍의 분포에서 나옵니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          저는 0.28을 근거 없이 운영값으로 써 왔습니다. 어디선가 본 숫자였고, 그 위에 여러 회차의 판정이
          쌓였습니다. 검증 방법은 단순합니다. 명백히 서로 다른 사람들을 만들어 모든 쌍의 유사도를 재고, 그중
          몇 쌍이 임계값을 넘는지 보면 됩니다.
        </p>

        <p className="leading-7">
          나이·체구·얼굴형을 전부 다르게 지정한 여섯 명을 세 가지 스타일로 생성해 쌍마다 쟀습니다. 모든 쌍이
          남남 쌍이므로 넘는 쌍은 전부 오판입니다. 0.28에서는 45쌍 중 6쌍이 샜고, 0.40에서는 0쌍이었습니다.
        </p>

        <p className="leading-7">
          같은 파이프라인을 훨씬 큰 규모로 돌린 공개 연구가 임계값을 독립적으로 확인해 줍니다. 34만 건의 남남
          비교에서 오탐률 0.1%에 해당하는 값이 0.423으로 보고됐습니다. 제가 45쌍으로 고른 값과 같은 자리입니다.
        </p>

        <p className="leading-7">
          방향에 주의할 점이 하나 있습니다. 새 얼굴을 뱅크에 넣을지 판단하는 거절 루프는 임계값 미만일 때만
          채택하므로, 임계값이 낮을수록 엄격합니다. 0.28은 진짜 남남을 중복으로 보고 버리고 있었습니다.
        </p>
      </div>

      <ExplainedFormula
        question="임계값을 어디에 둘지 무엇이 정합니까"
        idea="남남 쌍의 유사도 분포에서 허용할 오탐률을 먼저 정하면 임계값이 따라 나옵니다. 반대로 임계값을 먼저 정하면 오탐률이 얼마인지 모르는 채로 쓰게 됩니다."
        formula={String.raw`\tau = \min\{t : \mathrm{FMR}(t) \le \alpha\}, \quad \mathrm{FMR}(t) = \frac{|\{(i,j) : \cos_{ij} > t\}|}{\binom{n}{2}}`}
        annotatedFormula={String.raw`\tau = \min\{t : \underbrace{\mathrm{FMR}(t)}_{\text{남남인데 같다고 판정한 비율}} \le \underbrace{\alpha}_{\text{허용할 오탐률}}\}`}
        operations={[
          {
            expression: String.raw`\binom{n}{2}`,
            annotation: [
              "서로 다른 n명에서 만들 수 있는 남남 쌍의 수입니다",
              "n=6이면 15쌍이고 세 스타일을 합쳐 45쌍이 됩니다",
            ],
          },
          {
            expression: String.raw`|\{(i,j) : \cos_{ij} > t\}|`,
            annotation: "그중 유사도가 t를 넘어 같은 사람으로 오판된 쌍의 수입니다",
          },
          {
            expression: String.raw`\mathrm{FMR}(t) \le \alpha`,
            annotation: "t를 올리면 오탐률이 단조 감소하므로 조건을 만족하는 가장 작은 t가 임계값이 됩니다",
          },
        ]}
        terms={[
          { symbol: String.raw`\tau`, name: "임계값", description: "이 값을 넘으면 같은 사람으로 판정합니다." },
          { symbol: String.raw`\alpha`, name: "허용 오탐률", description: "남남을 같다고 볼 수 있는 최대 비율입니다." },
          { symbol: String.raw`\cos_{ij}`, name: "쌍 유사도", description: "두 얼굴 벡터의 코사인입니다." },
        ]}
        assumptions={[
          "측정에 쓴 인물들이 실제로 서로 다르다고 가정합니다. 이 전제가 깨지면 오탐이 아니라 정탐을 세게 됩니다.",
          "45쌍은 작은 표본이라 0.1% 수준의 오탐률을 직접 확인할 수 없습니다. 여기서 얻은 것은 0.28이 샌다는 사실과 0.40이 이 표본에서 새지 않는다는 사실뿐입니다.",
        ]}
        interpretation="식이 말하는 것은 임계값이 모델의 성질이 아니라 운영 결정이라는 점입니다. 얼마나 새도 되는지를 먼저 정해야 값이 나오고, 그 결정 없이 물려받은 숫자는 검증되지 않은 가정입니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          오탐과 미탐을 비용으로 환산해 임계값을 고르는 일반론은{" "}
          <Link to="/ai/cost-sensitive-thresholding#expected-cost">비용 민감 임계</Link>가, 오탐률과 재현율의
          정의는 <Link to="/ai/imbalanced-classification-evaluation#confusion-matrix">불균형 분류 평가</Link>가
          소유합니다. 이 절은 그 틀을 얼굴 임베딩에 적용하면서 드러난 것만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
