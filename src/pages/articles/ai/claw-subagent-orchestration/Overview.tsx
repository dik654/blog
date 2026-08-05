import { InternalLink } from '@/components/learning/ArticleLearning';
import AgentSelection from './AgentSelection';
import OrchestrationOverviewViz from './viz/OrchestrationOverviewViz';

const manifestFields = [
  ['identity', 'agentId, name, description, subagentType와 model'],
  ['lifecycle', 'status, createdAt, startedAt, completedAt'],
  ['disk paths', 'outputFile과 manifestFile'],
  ['evidence', 'laneEvents, currentBlocker, derivedState와 error'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Agent tool은 답을 기다리는 함수가 아니라 background job과 disk manifest를 만드는 함수다</h2>
          <p>
            입력의 <code>description</code>과 <code>prompt</code>가 유효하면 output markdown과 manifest
            경로를 먼저 만든다. task packet과 <code>status: running</code> manifest를 쓴 뒤에야
            background thread를 spawn한다. spawn이 성공하면 caller가 받는 것은 worker의 최종 답이 아니라
            아직 진행 중인 <code>AgentOutput</code>이다.
          </p>
          <p>
            이 구분이 필요한 이유는 시간이 다르기 때문이다. 부모가 <code>running</code> 값을 받았다고
            해서 task가 성공한 것이 아니며, background worker가 나중에 completed 또는 failed manifest를
            다시 기록해야 terminal evidence가 생긴다.
          </p>
          <p>
            여기서 disk에 썼다는 말을 crash-safe commit으로 확대하면 안 된다. manifest write에는
            임시 파일을 원자적으로 rename하는 protocol, file lock, <code>sync_all</code>, write
            receipt가 없다. background terminal path는 persistence 오류를 부모에게 다시 전달하지도
            않는다. 따라서 오래 남은 <code>running</code>은 “아직 실행 중”뿐 아니라 “끝났지만 terminal
            기록을 잃음”도 포함하는 <strong>unknown state</strong>다.
          </p>
        </div>
        <OrchestrationOverviewViz />
      </section>

      <AgentSelection />

      <section id="worker-runtime" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Worker는 새 Session과 같은 allowlist의 두 경계 안에서 실행된다</h2>
          <p>
            <code>build_agent_runtime</code>은 <code>Session::new()</code>로 대화를 비우고,
            <code>ConversationRuntime</code>의 최대 iteration을 32로 제한한다. 부모 transcript 전체를
            복제하는 코드가 아니라 delegated prompt와 system prompt로 시작하는 독립 runtime이다.
          </p>
          <p>
            type별 <code>allowed_tools</code>는 두 곳에 전달된다. <code>ProviderRuntimeClient</code>는
            model에 보이는 tool definition을 그 집합으로 줄이고, <code>SubagentToolExecutor</code>는
            model이 실제 이름을 호출했을 때 같은 집합을 다시 확인한다. 첫 경계는 선택 공간을 줄이고,
            두 번째 경계는 모델 출력만 믿지 않는 enforcement다.
          </p>
          <p>
            permission policy도 executor에 들어가지만 현재 기본 mode는 <code>DangerFullAccess</code>다.
            따라서 type allowlist가 실질적인 최소 경계다. 특히 unknown type이 넓은 default branch로
            들어가는 문제를 permission mode가 자동으로 고쳐 준다고 가정할 수 없다.
          </p>
          <h3>새 Session은 transcript isolation이지 process sandbox가 아니다</h3>
          <p>
            worker는 부모 transcript를 받지 않지만 같은 process의 background thread에서 실행되고 현재
            directory와 host resource를 사용한다. 실제 test도 child가 host의 임시 파일을 읽는 것으로
            이 경계를 확인한다. 그러므로 격리는 세 축으로 나눠야 한다. 새 Session은 대화 문맥을
            분리하고, tool allowlist는 capability를 줄이지만, filesystem·process·network containment는
            별도 sandbox가 맡아야 한다.
          </p>
        </div>
      </section>

      <section id="terminal-evidence" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>성공·runtime 오류·panic·spawn 실패는 같은 시점에 기록되지 않는다</h2>
          <p>
            정상 path에서는 background thread가 최종 assistant text를 output markdown에 추가하고
            completed manifest를 쓴다. runtime이 error를 반환하거나 thread가 panic하면
            <code>persist_agent_terminal_state</code>가 failed 상태와 blocker·lane event를 남긴다.
            <code>catch_unwind</code>가 panic 문자열을 terminal evidence로 바꾸는 경계다.
          </p>
          <p>
            thread 자체를 만들지 못한 spawn failure는 다르다. 이미 running manifest를 쓴 상태에서
            failed로 갱신한 뒤, caller에도 <code>Err</code>를 반환한다. 따라서 “Agent tool return은 항상
            running manifest”도 정확하지 않다.
          </p>
        </div>
        <dl className="not-prose my-6 divide-y divide-border border-y border-border">
          {manifestFields.map(([group, fields]) => (
            <div key={group} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
              <dt className="text-xs font-bold">{group}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">{fields}</dd>
            </div>
          ))}
        </dl>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>Manifest completed는 외부 effect 완료와 같지 않다</h3>
          <p>
            manifest는 worker runtime이 끝나고 text를 남겼다는 증거다. worker가 “파일을 고쳤다”거나
            “배포가 성공했다”고 쓴 문장이 실제 environment state를 보장하지 않는다. 부모는 artifact hash,
            test, git state나 service 상태를 별도로 관찰해 acceptance evidence를 만들어야 한다.
          </p>
        </div>
      </section>

      <section id="parent-handoff" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>부모의 acceptance와 late-result 처리는 다음 coordinator 계약이다</h2>
          <p>
            현재 path에는 deadline, lease, 전체 token budget, late-result merge window가 없다.
            이것들은 필요한 운영 정책이지만 구현 사실처럼 말하면 안 된다. 부모는 manifest와 artifact를
            읽고 독립 검증해야 한다.
          </p>
          <p>
            더 중요한 단절은 identity다. 현재 Agent input·output에는 parent session, task, lane,
            trace id가 없고 child runtime에도 tracer가 자동 연결되지 않는다. 따라서 이 snapshot에서
            <InternalLink slug="claw-policy-engine">Policy Gate</InternalLink>,
            <InternalLink slug="claw-telemetry">Telemetry</InternalLink>,
            <InternalLink slug="claw-recovery">Recovery simulation</InternalLink>이 하나의 실행
            pipeline으로 이어진다고 주장할 수 없다. production coordinator가 task id와 parent trace를
            manifest까지 전파하고, acceptance revision을 고정한 뒤, late terminal result를 lease와
            비교해야 record → worker → policy의 인과가 닫힌다.
          </p>
          <h3>부모가 보는 상태는 running·terminal·accepted의 세 단계여야 한다</h3>
          <p>
            <code>running</code>은 thread를 시작했다는 접수 증거이고, terminal manifest는 worker가
            자신의 실행을 끝냈다는 제안이다. 부모가 artifact hash와 독립 test를 확인해 같은 task
            revision에 귀속시킨 뒤에야 <code>accepted</code>가 된다. 이 세 상태를 하나의
            <code>completed</code>로 접으면 늦게 도착한 오래된 결과가 새 작업을 덮을 수 있다.
          </p>
          <p>
            예를 들어 부모가 timeout 뒤 task를 다른 worker에게 다시 맡겼다면, 첫 worker의 terminal
            manifest는 내용이 맞더라도 자동 merge 대상이 아니다. coordinator는 lease와 task revision을
            비교해 stale result로 보관하거나 다시 검증해야 한다. 현재 source에는 이 acceptance
            reducer가 없으므로 disk manifest를 곧바로 정책 evidence로 승격하면 안 된다.
          </p>
        </div>
      </section>
    </>
  );
}
