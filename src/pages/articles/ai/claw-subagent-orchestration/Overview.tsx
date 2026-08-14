const orchestrationFlow = [
  ["분해", "독립적으로 조사하거나 구현할 수 있는 경계를 찾습니다."],
  ["계약", "각 sub-agent의 목표, 읽기 범위, 출력 형식과 완료 조건을 정합니다."],
  ["선택", "작업 난이도와 필요한 도구에 맞는 agent와 모델을 고릅니다."],
  ["격리 실행", "별도 문맥과 필요하면 별도 worktree에서 작업을 수행합니다."],
  [
    "검증·통합",
    "자기 보고가 아니라 산출물과 테스트를 확인한 뒤 결과를 합칩니다.",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Sub-agent는 역할 수가 아니라 경계가 분명할 때 유용하다
      </h2>
      <ContentBoundary article="claw-subagent-orchestration" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          긴 작업을 여러 agent에 나누면 탐색 결과가 메인 문맥을 가득 채우는 일을
          줄이고 독립적인 조사를 병렬로 진행할 수 있습니다. 그러나 같은 파일을
          동시에 수정하거나 목표가 겹치면 통합 비용과 충돌이 더 커집니다. 따라서
          multi-agent가 항상 토큰을 절약하거나 품질을 높인다고 볼 수는 없습니다.
        </p>
        <p>
          오케스트레이션의 핵심은 agent 수가 아니라{" "}
          <strong>작업 계약, 격리, 검증, 중단 조건</strong>입니다. 메인 agent는
          사용자와의 목표를 유지하고, sub-agent는 범위가 좁고 독립적인 산출물을
          반환해야 합니다.
        </p>
        <p>
          이 글에서 pinned 구현 사실은 commit <code>b71afdd…</code>의
          <code>claw-analog agents</code> runner에 한정합니다. 이 source는 agent
          spec, permission 기본값, split session과 순차 실행을 보여 주지만,
          아래의 병렬 dependency scheduler·durable cancellation·artifact merge를
          모두 구현했다는 증거는 아닙니다. 후자는 별도 hardening 계약입니다.
        </p>

        <div id="paper-claw-analog-agents-source" className="scroll-mt-24">
          <CitationBlock
            source="Claw Code claw-analog agents.rs @ b71afdd"
            href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/claw-analog/src/agents.rs"
            citeKey={1}
            type="code"
          >
            <p>
              <strong>문제:</strong> 여러 preset의 agent를 동일 workspace와 base
              session에서 실행합니다. <strong>기여:</strong> pinned source는 agent
              spec parser, preset별 permission default, split session path와 순차
              run loop를 제공합니다. <strong>전제:</strong> commit·config·base
              session과 agent list를 고정합니다. <strong>근거 범위:</strong>
              claw-analog CLI의 실제 call path입니다. <strong>일반화 금지:</strong>
              concurrent execution, dependency DAG, shared-file merge, distributed
              lease와 child cancellation을 제공한다는 뜻은 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 lg:grid-cols-5">
        {orchestrationFlow.map(([title, description], index) => (
          <div key={title} className="rounded-xl border bg-card p-4">
            <span className="text-xs font-bold text-primary">{index + 1}</span>
            <strong className="mt-2 block text-sm">{title}</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          Agent tool은 새 세션과 권한 범위를 만든다
        </h3>
        <p>
          메인 agent가 Agent tool을 호출하면 작업 설명만 넘기는 것이 아니라,
          사용할 도구, 모델, 격리 방식, 반환 형식을 함께 정해야 합니다.
          Explore나 Plan 같은 이름은 편의상 붙인 역할일 뿐이며, 실제 안전성과
          품질은 허용 도구와 작업 계약에서 나옵니다. 원래 세션의 모든 secret과
          권한을 그대로 상속하는 것은 피해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          결과 요약보다 검증 가능한 산출물이 먼저다
        </h3>
        <p>
          sub-agent가 “완료했다”고 반환해도 파일, commit, 테스트 결과가 실제로
          존재하는지 확인해야 합니다. 읽기 전용 조사는 근거 경로와 인용 위치를,
          구현 작업은 diff와 검증 명령을 반환하게 하면 메인 agent가 결과를 다시
          판단할 수 있습니다. 병렬 작업은 소유 파일을 분리하고, 겹치는 변경은 한
          통합 주체가 순서대로 합치는 편이 안전합니다.
        </p>
        <p>
          다음에는 <strong>team lead와 worker</strong>의 책임 경계를,
          <strong>agent selection</strong>에서 작업별 모델·도구 선택을
          확인합니다. 마지막 <strong>guardrails</strong>는 깊이, 동시성, 토큰
          예산과 권한 상속을 어디에서 제한하는지 다룹니다.
        </p>
      </div>
    </section>
  );
}
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
