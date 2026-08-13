import AgentScoreChartViz from "./viz/AgentScoreChartViz";
import AgentSelectionViz from "./viz/AgentSelectionViz";

const selectionSignals = [
  {
    title: "Capability",
    body: "탐색·구현·리뷰처럼 실제로 필요한 작업 능력을 확인합니다.",
  },
  {
    title: "Access",
    body: "읽을 경로와 쓸 경로, network와 secret 범위가 맞는지 봅니다.",
  },
  {
    title: "Cost",
    body: "모델 비용, 예상 latency와 병렬 실행의 통합 비용을 함께 봅니다.",
  },
] as const;

export default function AgentSelection() {
  return (
    <section id="agent-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        작업 경계가 먼저이고 agent 선택은 그다음이다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          sub-agent 선택은 이름이 멋진 역할을 고르는 문제가 아니라, 이미 나눈
          작업 계약을 어떤 실행 환경에 맡길지 결정하는 문제입니다. 탐색 결과만
          필요한 작업에 write tool을 줄 이유가 없고, 같은 파일을 수정하는 두
          작업을 동시에 보내면 모델 성능과 무관하게 충돌이 생깁니다.
        </p>
        <p className="leading-7">
          많은 agent description을 매 turn마다 system prompt에 모두 넣으면 선택
          노이즈와 context 비용이 커질 수 있습니다. 먼저 task contract로 후보를
          좁히고, 필요한 capability와 permission을 충족하는 소수만 노출하는
          방식이 더 단순합니다. “상위 11개” 같은 고정 숫자는 설계 원칙이 아니라
          특정 snapshot의 tuning 값으로만 다뤄야 합니다.
        </p>

        <div className="not-prose my-8">
          <AgentSelectionViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        {selectionSignals.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          metadata는 설명보다 contract에 가깝게 쓴다
        </h3>
        <p className="leading-7">
          agent definition에는 자연어 description만 넣지 않고 allowed tools,
          readable·writable path, network policy, model class, expected output
          schema와 isolation mode를 함께 둡니다. 선택기가 description을 잘
          이해하더라도 runtime이 이 제약을 강제하지 않으면 실제 권한은 달라질 수
          있습니다.
        </p>
        <p className="leading-7">
          태그는 빠른 1차 filtering에 유용하지만 keyword와 file extension만으로
          domain fit을 확정하지 않습니다. 모호한 요청은 main agent가 먼저
          deliverable과 scope를 구체화하고, 그래도 여러 후보가 남을 때만
          semantic similarity나 작은 routing model을 사용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          ranking 점수는 결과 품질과 위험을 분리해 본다
        </h3>
        <p className="leading-7">
          tag overlap, domain fit, 최근 성공률을 한 점수로 합치면 구현은 쉽지만,
          낮은 비용과 높은 권한 위험이 같은 숫자 안에서 상쇄될 수 있습니다. 먼저
          hard constraint로 permission과 isolation 조건을 통과시킨 뒤, 남은
          후보의 품질·latency·비용을 비교하는 편이 안전합니다.
        </p>

        <div className="not-prose my-8">
          <AgentScoreChartViz />
        </div>

        <p className="leading-7">
          최근 success rate도 “agent가 완료했다고 응답했는가”가 아니라 검증을
          통과한 산출물로 계산합니다. 쉬운 작업만 받은 agent가 유리해지는
          selection bias를 줄이려면 작업 난이도와 유형별로 지표를 나누고, 표본이
          적을 때는 confidence interval을 함께 봅니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          agent pool은 새 work unit 경계에서 갱신한다
        </h3>
        <p className="leading-7">
          대화 중 단어가 조금 바뀔 때마다 후보를 다시 고르면 prompt cache가
          흔들리고 역할도 일관되지 않습니다. 새로운 deliverable이 생기거나 기존
          작업 계약이 끝났을 때 pool을 갱신하고, 진행 중인 worker는 같은
          contract와 tool set을 유지합니다.
        </p>
        <p className="leading-7">
          단순한 작업은 dedicated agent 없이 main agent가 직접 처리하는 선택지도
          항상 남겨 둡니다. delegation 자체가 목표가 되면 handoff와 검증 비용이
          실제 작업보다 커질 수 있기 때문입니다.
        </p>
      </div>
    </section>
  );
}
