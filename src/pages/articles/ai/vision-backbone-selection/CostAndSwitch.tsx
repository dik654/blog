import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import SwitchViz from "./viz/SwitchViz";

export default function CostAndSwitch() {
  return (
    <section id="cost-and-switch" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">교체 비용을 먼저 계산하고 고릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          백본 선택은 한 번으로 끝나지 않습니다. 더 나은 모델이 나오면 바꾸고 싶어지는데, 그때 드는 비용이
          처음 고를 때의 성능 차이보다 큰 경우가 많습니다. 그래서 선택 단계에서 교체 시나리오를 함께 계산해
          두는 편이 낫습니다.
        </p>

        <p className="leading-7">
          가장 큰 항목은 재색인입니다. 백본이 바뀌면 기존 벡터는 전부 쓸 수 없으므로 색인 대상 전체를 다시
          계산해야 합니다. 1,000만 장 규모에서 장당 추론 시간이 10밀리초라면 단일 장비로 약 28시간이고,
          병렬화해도 그동안 두 벌의 색인을 어떻게 운영할지 정해야 합니다.
        </p>

        <p className="leading-7">
          두 번째는 질의 경로입니다. 색인과 질의가 같은 지문을 써야 하므로 전환은 원자적으로 일어나야 합니다.
          점진 전환을 하려면 두 색인을 동시에 유지하고 질의를 한쪽으로만 보내는 구조가 필요하며, 그 기간
          저장 비용은 두 배입니다.
        </p>

        <p className="leading-7">
          세 번째는 다운스트림입니다. 임계값이나 규칙이 벡터 분포에 맞춰져 있다면 백본을 바꿀 때 함께 다시
          잡아야 합니다. 유사도 0.8을 중복으로 보던 기준이 새 모델에서는 다른 의미가 됩니다.
        </p>
      </div>

      <SwitchViz />

      <TermBreakdown
        title="선택 전에 계산해 둘 세 가지 비용"
        description="성능 차이가 이 비용을 넘는지가 실제 판단 기준입니다."
        items={[
          {
            term: "추론 비용",
            description: "장당 계산량과 지연입니다. 해상도를 올리면 패치 수가 제곱으로 늘어 함께 커집니다.",
            example: "기준 모델 대비 배수로 적어 두면 선택 점수의 감점 항으로 바로 쓸 수 있습니다.",
            boundary: "배치 크기와 하드웨어에 따라 배수가 달라지므로 배포 환경에서 재야 합니다.",
          },
          {
            term: "재색인 비용",
            description: "색인 대상 전체를 다시 계산하는 시간과 자원입니다.",
            example: "1,000만 장·장당 10밀리초면 단일 장비 기준 약 28시간입니다.",
            boundary: "그 기간 동안 두 색인을 함께 운영할지, 검색 품질 저하를 감수할지 미리 정해야 합니다.",
          },
          {
            term: "임계값 재조정",
            description: "유사도 임계나 규칙이 벡터 분포에 묶여 있으면 함께 다시 잡아야 합니다.",
            example: "중복 판정 임계, 추천 컷오프, 알림 조건 등이 해당합니다.",
            boundary: "이 작업은 자동화하기 어려워 사람이 데이터를 보며 정하는 시간이 듭니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          이 비용 때문에 "지금 가장 좋은 것"보다 "당분간 바꾸지 않아도 되는 것"이 나은 선택일 때가 있습니다.
          모델 계열이 활발히 갱신되는 시기라면 작은 모델로 시작해 파이프라인을 먼저 안정시키고, 교체 절차를
          한 번 연습해 두는 편이 실질적입니다.
        </p>

        <p className="leading-7">
          벡터와 함께 저장하는 지문과 재색인 트리거는{" "}
          <Link to="/ai/image-embedding-pipeline#pipeline-contract">임베딩 파이프라인</Link>이 소유하고, 모델
          크기와 품질의 일반적인 교환은{" "}
          <Link to="/ai/image-backbone-scaling#budget-comparison">백본 예산 비교</Link>에 있습니다.
        </p>
      </div>
    </section>
  );
}
