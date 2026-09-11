import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RolloutViz from "./viz/RolloutViz";

export default function CorrelatedChange() {
  return (
    <section id="correlated-change" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">중복 구성이 막지 못하는 고장은 모두에게 동시에 옵니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          여기까지의 장치는 전부 "어딘가 하나가 고장 났다"를 전제로 합니다. 지점 하나, 서버 한 대, 회선 하나가
          죽으면 남은 곳이 받습니다. 그런데 실제 대형 장애의 상당수는 그런 모양이 아닙니다. 모든 곳이 같은
          변경을 받고 같은 순간에 같은 방식으로 망가집니다.
        </p>

        <p className="leading-7">
          이런 고장 앞에서는 중복 구성이 도움이 되지 않습니다. 지점을 열 개로 늘려도 열 개가 같은 설정을 받으면
          열 개가 함께 넘어집니다. 오히려 자동 배포가 빠를수록 더 빨리 전부에 퍼집니다.
        </p>

        <p className="leading-7">
          그래서 무중단 설계의 마지막 항목은 장비가 아니라 변경 절차입니다. 어떤 변경이든 한 번에 전부에 닿지 않게 하고 나눠 내보내는 동안 건강 지표를 보고 계속할지 되돌릴지 정합니다.
        </p>
      </div>

      <RolloutViz />

      <ExplainedFormula
        question="단계를 나누면 최악의 피해가 얼마나 줄어듭니까"
        idea="전부에 한 번에 내보내면 나쁜 변경의 피해는 전체 트래픽에 감지 시간을 곱한 값이고, 단계를 나누면 그 단계의 비율만큼만 곱해집니다."
        formula={String.raw`B = f \cdot (t_{\text{detect}} + t_{\text{rollback}})`}
        annotatedFormula={String.raw`B = \underbrace{f}_{\text{이 단계가 받는 트래픽 비율}} \cdot (\underbrace{t_{\text{detect}}}_{\text{나쁘다고 판정할 때까지}} + \underbrace{t_{\text{rollback}}}_{\text{되돌리는 데 걸리는 시간}})`}
        operations={[
          {
            expression: String.raw`f`,
            annotation: [
              "첫 단계를 전체의 1%로 두면 f = 0.01입니다",
              "단계를 나누지 않으면 f = 1이 됩니다",
            ],
          },
          {
            expression: String.raw`t_{\text{detect}}`,
            annotation: "지표가 기준을 벗어났다고 판정하는 데 걸리는 시간이며 관측 창의 길이가 하한입니다",
          },
          {
            expression: String.raw`t_{\text{rollback}}`,
            annotation: "판정 후 이전 상태로 되돌리는 데 걸리는 시간이며 되돌리기가 자동인지에 따라 크게 달라집니다",
          },
        ]}
        terms={[
          { symbol: "B", name: "피해량", description: "영향을 받은 트래픽의 총량입니다." },
          { symbol: "f", name: "단계 비율", description: "이 단계가 받는 트래픽의 비율입니다." },
          { symbol: String.raw`t_{\text{detect}}`, name: "감지 시간", description: "나쁜 변경임을 판정할 때까지의 시간입니다." },
          { symbol: String.raw`t_{\text{rollback}}`, name: "복구 시간", description: "되돌리는 데 걸리는 시간입니다." },
        ]}
        assumptions={[
          "피해가 영향받은 트래픽에 비례한다고 가정합니다. 데이터가 망가지는 변경은 이 가정이 성립하지 않습니다.",
          "단계가 전체를 대표한다고 가정합니다. 첫 단계에 없는 조건에서만 터지는 문제는 이 계산으로 잡히지 않습니다.",
        ]}
        interpretation="식에서 읽어야 할 것은 단계를 잘게 나누는 것보다 감지와 되돌리기를 자동으로 만드는 편이 효과가 큰 구간이 있다는 점입니다. 되돌리기가 사람 손을 거쳐 30분 걸린다면 첫 단계를 1%로 줄여도 그 30분은 그대로 남습니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          공개된 사례에서는 이 판단을 사람이 아니라 지표가 합니다. 서비스마다 성공으로 볼 지표와 기준을 미리 정해 두고 배포가 한 단계 진행될 때마다 그 지표를 확인해 계속할지 멈출지
          되돌릴지 자동으로 결정합니다. 기준의 예로는 오류율이 0.1% 미만이어야 한다는 식의 조건이 제시됩니다.
        </p>

        <p className="leading-7">
          중요한 확장은 이 절차를 코드 배포에만 쓰지 않는 것입니다. 설정 변경도 같은 방식으로 묶어 단계적으로
          내보내고 지표로 매개해야 합니다. 실제로 큰 장애의 원인이 코드가 아니라 전역으로 퍼진 설정인 경우가
          반복해서 보고됐고, 그 대응으로 설정 배포에도 같은 절차를 기본값으로 적용하는 방향이 공개됐습니다.
        </p>

        <p className="leading-7">
          이 절은 앞 절들과 대상이 다릅니다. 인프라가 아니라 조직의 작업 방식입니다. 장비를 아무리 늘려도 변경 절차가 전역 동시 적용이면 무중단은 성립하지 않습니다.
        </p>
      </div>

      <CitationBlock
        source="Cloudflare — 건강 지표 매개 배포와 설정 변경의 단계적 적용에 대한 공개 문서 (2026-09-11 확인)"
        citeKey={4}
        href="https://blog.cloudflare.com/safe-change-at-any-scale/"
      >
        서비스별로 성공 지표와 기준을 정의해 두고 배포 단계마다 그 지표로 계속·중지·되돌리기를 자동
        판정하며, 오류율 0.1% 미만 같은 조건을 기준의 예로 드는 설명입니다. 같은 사업자가 이후 설정 변경에도
        같은 절차를 적용하는 방향을 공개했습니다. 단계 크기와 지속 시간 같은 구체 수치는 공개 범위 밖이며 이
        글도 특정 값을 권고하지 않습니다.
      </CitationBlock>
    </section>
  );
}
