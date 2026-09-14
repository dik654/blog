import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ProbeViz from "./viz/ProbeViz";

export default function MeasureFirst() {
  return (
    <section id="measure-first" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">고르기 전에 30분짜리 실측을 돌립니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          후보가 두세 개로 줄면 그다음은 읽는 것이 아니라 재는 것입니다. 필요한 것은 큰 학습이 아니라 내
          데이터 몇백 장으로 돌리는 짧은 실측입니다. 백본을 얼린 채 벡터만 뽑아 두면 대부분의 판단이 그 위에서
          끝납니다.
        </p>

        <p className="leading-7">
          세 가지를 잽니다. 첫째는 얇은 head만 올렸을 때의 과제 성능이고, 둘째는 촬영 변형에 얼마나 흔들리는지,
          셋째는 자리별 정보가 필요한 과제라면 패치 수준 성능입니다. 셋 다 학습 없이 또는 선형층 하나만
          학습해 구할 수 있습니다.
        </p>

        <p className="leading-7">
          중요한 것은 후보끼리 조건을 맞추는 일입니다. 전처리와 해상도, 풀링 방식, 정규화 여부를 같게 두지
          않으면 백본 차이가 아니라 설정 차이를 재게 됩니다. 앞 글에서 정의한 파이프라인 지문을 후보마다 명시해
          두고 비교해야 합니다.
        </p>
      </div>

      <AlgorithmBlock
        title="후보 백본 비교용 최소 실측"
        input={["내 데이터 300~1,000장", "과제 라벨 또는 정답 짝", "후보 백본 2~3개"]}
        steps={[
          { code: "freeze(backbone)", note: "가중치를 고정합니다. 이 조건에서만 표현 자체를 비교할 수 있습니다" },
          { code: "cfg = fixed(preproc, pooling, norm)", note: "후보마다 같은 전처리·풀링·정규화를 씁니다" },
          { code: "V = embed(images, cfg)", note: "벡터를 한 번만 뽑아 재사용합니다. 이후 단계는 CPU에서도 됩니다" },
          { code: "acc = linear_probe(V, labels)", note: "선형층 하나만 학습해 과제 성능을 잽니다" },
          { code: "rho = mean_dist(variants) / mean_dist(others)", note: "밝기·압축 변형본과 다른 대상의 거리 비를 구합니다" },
          { code: "dense = linear_seg_probe(patch_V, masks)", note: "자리별 정보가 필요하면 패치 벡터로 한 번 더 잽니다" },
        ]}
        output="후보별 세 숫자 (과제 성능 · 변형 견고성 · 자리별 성능)"
      />

      <ProbeViz />

      <h3 id="probe-protocol" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        비교 가능하려면 무엇을 고정해야 합니까
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          실측이 후보를 가르려면 백본 말고 모든 것이 같아야 합니다. 해상도를 하나는 224로 다른 하나는 336으로
          두면 계산량과 성능이 함께 달라지고, 그 차이가 백본의 성질처럼 보입니다. 반대로 모든 후보를 같은 해상도로
          묶으면 원래 더 큰 해상도로 학습된 모델이 손해를 봅니다.
        </p>

        <p className="leading-7">
          그래서 두 가지 방식이 필요합니다. 하나는 조건을 완전히 같게 맞춘 비교이고, 다른 하나는 각 모델의 권장
          설정을 그대로 쓴 비교입니다. 앞의 것은 표현 자체를 비교하고 뒤의 것은 실제 배포 성능에 가깝습니다. 둘을
          섞으면 어느 쪽 질문에도 답하지 못합니다.
        </p>

        <p className="leading-7">
          선형 head의 학습 조건도 고정합니다. 학습률과 에폭 수, 정규화 강도를 후보마다 따로 튜닝하면 그 튜닝
          품질이 결과에 섞입니다. 같은 설정으로 돌린 뒤, 그 설정이 특정 후보에게 불리하지 않은지만 별도로
          확인하는 편이 낫습니다.
        </p>
      </div>

      <ExplainedFormula
        question="세 숫자를 하나의 선택 기준으로 어떻게 합칩니까"
        idea="과제 성능을 주 기준으로 두고, 견고성과 비용을 감점 항으로 붙여 배포 조건을 반영합니다."
        formula={String.raw`S = a - \lambda\,\rho - \mu\,\frac{c}{c_{0}}`}
        annotatedFormula={String.raw`S = \underbrace{a}_{\text{과제 성능}} - \underbrace{\lambda\,\rho}_{\text{변형 민감도 감점}} - \underbrace{\mu\,\frac{c}{c_{0}}}_{\text{비용 감점}}`}
        operations={[
          {
            expression: "a",
            annotation: [
              "얼린 백본에 선형 head만 올려 잰 과제 성능입니다",
              "후보마다 같은 학습 설정으로 구해야 비교가 됩니다",
            ],
          },
          {
            expression: String.raw`\lambda\,\rho`,
            annotation: "변형 민감도 비에 가중치를 곱한 감점입니다. 촬영 조건이 다양한 서비스일수록 크게 잡습니다",
          },
          {
            expression: String.raw`\mu\,\frac{c}{c_{0}}`,
            annotation: "기준 모델 대비 추론 비용의 배수에 가중치를 곱합니다. 지연 예산이 빡빡할수록 크게 잡습니다",
          },
        ]}
        terms={[
          { symbol: "S", name: "선택 점수", description: "후보 사이 비교에만 쓰는 상대값입니다." },
          { symbol: "a", name: "과제 성능", description: "얼린 조건에서 잰 값이며 미세조정 후 성능이 아닙니다." },
          { symbol: String.raw`\rho`, name: "변형 민감도 비", description: "같은 대상 변형본과 다른 대상의 평균 거리 비입니다." },
          { symbol: String.raw`\lambda,\ \mu`, name: "가중치", description: "서비스 조건에 따라 사람이 정하는 값이며 데이터에서 추정하지 않습니다." },
          { symbol: String.raw`c_{0}`, name: "기준 비용", description: "비교 기준으로 삼은 후보의 추론 비용입니다." },
        ]}
        assumptions={[
          "세 항이 같은 실측 조건에서 나왔다고 가정합니다. 설정이 다르면 합치기 전에 다시 재야 합니다.",
          "가중치는 서비스 요구에서 나오는 값이며 이 식으로 최적화할 대상이 아닙니다.",
        ]}
        interpretation="이 점수는 후보를 줄이는 도구입니다. 값이 비슷하면 점수로 고르지 말고 운영 조건, 곧 교체 비용과 라이선스, 지원 상태로 결정하는 편이 낫습니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          변형 민감도와 정답 정의의 함정은{" "}
          <Link to="/cs/ai/image-embedding-pipeline#evaluation">임베딩 파이프라인</Link>에서 다룬 내용을 그대로
          씁니다. 이 절이 더하는 것은 그 측정을 백본 선택의 입력으로 쓰는 방법입니다.
        </p>
      </div>
    </section>
  );
}
