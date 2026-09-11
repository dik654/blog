import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import PoolViz from "./viz/PoolViz";

export default function FixedPool() {
  return (
    <section id="fixed-pool" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">총량이 고정이면 오토스케일은 늘리기가 아니라 뺏기입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          클라우드에서 자동 확장은 대체로 더하기입니다. 부하가 늘면 노드가 늘고, 비용이 늘고, 부하가 줄면
          되돌아갑니다. 온프레미스에는 더할 것이 없습니다. 가속기 수는 구매 시점에 정해졌고 다음 분기까지
          바뀌지 않습니다.
        </p>

        <p className="leading-7">
          그래서 같은 설정이 전혀 다른 의미가 됩니다. 모델 A의 복제본을 두 개에서 네 개로 늘리는 규칙은, 남는
          가속기가 없다면 모델 B의 복제본 두 개를 죽이라는 규칙과 같습니다. 자동 확장 규칙을 모델마다 따로
          써 두면 서로를 밀어내는 규칙들이 동시에 도는 상태가 됩니다.
        </p>

        <p className="leading-7">
          기본 스케줄러는 이 다툼을 우선순위와 선점으로 정리합니다. 우선순위가 높은 파드가 자리를 못 찾으면
          낮은 파드를 쫓아내고 그 자리를 씁니다. 문제는 쫓겨나는 쪽이 진행 중이던 요청을 들고 있다는 점이고,
          그래서 이 정리 방식은 어떤 모델이 갑자기 응답을 멈춰도 되는지를 미리 정해 둔 경우에만 안전합니다.
        </p>

        <p className="leading-7">
          더 큰 문제는 되돌아오는 비용입니다. 쫓겨난 복제본이 다시 뜨려면 가중치를 읽어 올리고 예열을 거쳐야
          합니다. 이 시간이 길면 잠깐의 부하 변동에 반응해 복제본을 죽였다 살리는 규칙은 용량을 늘리는 대신
          양쪽 모두를 느리게 만듭니다.
        </p>
      </div>

      <PoolViz />

      <TermBreakdown
        title="고정 총량에서 자리를 나누는 세 가지 방식"
        description="같은 가속기 풀을 다르게 쪼개며, 각각 다른 것을 포기합니다."
        items={[
          {
            term: "정적 분할",
            description: "모델마다 가속기 수를 미리 정해 두고 바꾸지 않습니다.",
            example: "각 모델의 지연이 다른 모델의 부하와 무관해집니다.",
            boundary: "한쪽이 놀고 다른 쪽이 밀려도 자리가 움직이지 않아 전체 사용률이 낮습니다.",
          },
          {
            term: "우선순위 선점",
            description: "높은 우선순위가 자리를 못 찾으면 낮은 쪽을 쫓아냅니다.",
            example: "대화형 요청을 배치 작업보다 확실히 앞세울 수 있습니다.",
            boundary: "쫓겨나는 쪽의 진행 중 요청이 끊기고, 다시 뜨는 데 적재와 예열 시간이 듭니다.",
          },
          {
            term: "시간 분할",
            description: "낮은 우선순위 작업을 부하가 낮은 시간대로 미룹니다.",
            example: "야간 배치와 주간 대화형이 같은 가속기를 나눠 씁니다.",
            boundary: "미룰 수 있는 작업에만 쓸 수 있고, 마감이 있는 작업에는 적용되지 않습니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          세 방식은 배타적이지 않습니다. 실제 구성은 대개 대화형 모델에 정적 분할로 바닥을 깔아 두고, 남는
          자리를 배치 작업이 우선순위 낮게 쓰다가 대화형이 늘어나면 물러나는 형태가 됩니다. 이때 물러나는
          작업은 중단되어도 다시 시작할 수 있어야 합니다.
        </p>

        <p className="leading-7">
          여기서 되짚을 점은 이 결정이 인프라 설정이 아니라 정책이라는 것입니다. 어떤 요청이 밀려도 되는지,
          어떤 모델이 몇 분간 없어도 되는지는 기술로 정해지지 않습니다. 온프레미스에서 배치와 정책이 같은
          것이 되는 이유가 여기 있습니다.
        </p>

        <p className="leading-7">
          부하에 대한 용량 산정과 대기열 이론 쪽 근거는{" "}
          <Link to="/ai/inference-cost-and-capacity-planning">추론 비용과 용량 계획</Link>이 소유합니다. 이
          절은 총량이 고정일 때 그 산정이 무엇으로 바뀌는지만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
