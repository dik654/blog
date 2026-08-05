import { InternalLink } from '@/components/learning/ArticleLearning';
import RecoveryFlowViz from './viz/RecoveryFlowViz';

const bridgeMappings = [
  ['TrustGate · ToolPermissionGate', 'TrustPromptUnresolved', 'AcceptTrustPrompt'],
  ['PromptDelivery', 'PromptMisdelivery', 'RedirectPromptToAgent'],
  ['Protocol', 'McpHandshakeFailure', 'RetryMcpHandshake(5000ms)'],
  ['Provider · StartupNoEvidence', 'ProviderFailure', 'RestartWorker'],
] as const;

const externalScenarios = [
  ['StaleBranch', 'RebaseBranch → CleanBuild', 'branch freshness를 관찰하는 별도 producer가 필요하다.'],
  ['CompileRedCrossCrate', 'CleanBuild', 'cross-crate compile 실패를 분류하는 별도 producer가 필요하다.'],
  ['PartialPluginStartup', 'RestartPlugin → RetryMcpHandshake(3000ms)', 'plugin startup 상태를 분류하는 별도 producer가 필요하다.'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Recovery는 실패 탐지기가 아니라 이미 분류된 scenario의 reducer다</h2>
          <p>
            실제 시스템에서 먼저 일어나는 일은 “무언가 잘못됐다”는 관찰이다. Recovery module은 로그를
            다시 읽어 원인을 추측하지 않는다. 호출자가 <code>FailureScenario</code> 하나를 넘기면,
            고정 recipe와 그 scenario의 시도 횟수를 읽어 다음 <code>RecoveryResult</code>를 계산한다.
          </p>
          <p>
            이 구조의 장점은 같은 입력 state에서 같은 분기가 나온다는 점이다. 반대로 입력을 누가
            만들었는지, step이 실제로 실행됐는지, escalation policy가 effect로 적용됐는지는 이 모듈
            바깥의 책임으로 남는다.
          </p>
        </div>
        <RecoveryFlowViz />
      </section>

      <section id="failure-bridge" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>일곱 scenario 중 worker boot bridge가 직접 만드는 것은 네 종류다</h2>
          <p>
            <code>from_worker_failure_kind</code>는 여섯 worker failure를 네 scenario로 모은다.
            Trust 관련 두 failure는 하나로, Provider 관련 두 failure도 하나로 합쳐진다. 따라서 enum에
            scenario가 존재한다는 사실과 현재 upstream 경로가 그 값을 생산한다는 사실은 다르다.
          </p>
        </div>
        <div className="not-prose my-6 divide-y divide-border border-y border-border">
          {bridgeMappings.map(([worker, scenario, step]) => (
            <div key={scenario} className="grid gap-2 py-4 md:grid-cols-[minmax(0,1fr)_1.1rem_minmax(0,1fr)_1.1rem_minmax(0,1fr)] md:items-center">
              <code className="break-words text-xs [overflow-wrap:anywhere]">{worker}</code>
              <span className="hidden text-center text-muted-foreground md:block">→</span>
              <strong className="break-words text-sm [overflow-wrap:anywhere]">{scenario}</strong>
              <span className="hidden text-center text-muted-foreground md:block">→</span>
              <code className="break-words text-xs [overflow-wrap:anywhere]">{step}</code>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>나머지 세 scenario는 dead code라고 단정할 수 없다</h3>
          <p>
            <code>StaleBranch</code>, <code>CompileRedCrossCrate</code>,
            <code>PartialPluginStartup</code>은 recipe table에는 있지만 worker boot bridge에는 없다.
            다른 producer가 직접 scenario를 넘길 수 있으므로 “절대 실행되지 않는다”가 아니라
            <strong>이 bridge만으로는 도달하지 않는다</strong>가 정확한 결론이다.
          </p>
        </div>
        <div className="not-prose mt-6 grid gap-px overflow-hidden rounded-md border border-border bg-border lg:grid-cols-3">
          {externalScenarios.map(([scenario, steps, note]) => (
            <div key={scenario} className="min-w-0 bg-background p-4">
              <strong className="block break-words text-sm [overflow-wrap:anywhere]">{scenario}</strong>
              <code className="mt-2 block break-words text-xs leading-5 [overflow-wrap:anywhere]">{steps}</code>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="attempt-algorithm" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>실행 순서는 attempt gate → step simulation → result → event다</h2>
          <p>
            모든 recipe의 <code>max_attempts</code>는 1이다. 이미 해당 scenario count가 1이면 두 번째
            호출은 count를 늘리지 않고 step 전에 닫힌다. 이때 result는 max attempts 이유를 가진
            <code>EscalationRequired</code>이고, event는 <code>RecoveryAttempted</code>와
            <code>Escalated</code>다.
          </p>
        </div>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['01', 'gate', 'attempts[scenario] ≥ 1이면 step을 하나도 보지 않는다.'],
            ['02', 'simulate', '허용된 첫 호출은 fail_at_step 전까지 step을 executed에 넣는다.'],
            ['03', 'derive', '0개 성공은 escalation, 일부 성공은 partial, 전부 성공은 recovered다.'],
            ['04', 'emit', 'Attempted 뒤에 Succeeded, Failed, Escalated 중 하나를 붙인다.'],
          ].map(([number, label, body]) => (
            <div key={number} className="min-w-0 bg-background p-4">
              <span className="text-2xl font-black tabular-nums">{number}</span>
              <strong className="mt-2 block text-sm">{label}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>PartialRecovery의 remaining에는 실패한 step도 포함된다</h3>
          <p>
            두 step recipe에서 index 1이 실패하면 index 0만 <code>recovered</code>에 들어간다.
            <code>remaining</code>은 <code>steps[executed.len()..]</code>이므로 실패한 두 번째 step부터
            끝까지다. “실패한 step을 이미 소비했다”고 계산하면 재개 위치가 한 칸 밀린다.
          </p>
          <h3>fail_at_step은 production executor가 아니다</h3>
          <p>
            현재 loop는 shell, git, MCP 또는 plugin을 호출하지 않는다. 오직 index가
            <code>fail_at_step</code>과 같은지를 비교한다. 따라서 <code>Recovered</code>는 simulation
            안에서 recipe가 끝났다는 결과이지, 외부 환경 변화의 영수증이 아니다.
          </p>
        </div>
      </section>

      <section id="escalation-owner" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>EscalationRequired와 EscalationPolicy는 서로 다른 값이다</h2>
          <p>
            <code>RecoveryResult::EscalationRequired</code>에는 이유 문자열만 있다. 반면
            <code>AlertHuman</code>, <code>LogAndContinue</code>, <code>Abort</code>는
            <code>RecoveryRecipe</code> 안의 metadata다. <code>attempt_recovery</code>는 policy를
            match해 알림을 보내거나 process를 종료하지 않는다.
          </p>
          <p>
            <code>RecoveryEvent::Escalated</code>도 “사람에게 실제 알림이 도착했다”는 receipt가 아니다.
            외부 coordinator가 Attempted event의 recipe를 읽고 policy effect를 실행한 뒤, 별도의 성공
            증거를 남겨야 운영 loop가 닫힌다. 그 시도와 결과를
            <InternalLink slug="claw-telemetry">Runtime Telemetry</InternalLink>에 남기고,
            재시도 여부는 <InternalLink slug="claw-policy-engine">Policy Gate</InternalLink>가
            evidence를 받아 결정하도록 분리할 수 있다.
          </p>
          <h3>한 번의 제한은 incident 단위의 내구성 보장이 아니다</h3>
          <p>
            attempt map의 key는 <code>FailureScenario</code>뿐이다. lane·incident·action id가 없으므로
            같은 context 안에서는 서로 다른 lane의 같은 scenario가 한 budget을 공유하고, 새 context나
            process restart 뒤에는 count가 다시 0에서 시작한다. count도 effect 전에 memory에서 증가할
            뿐 durable reservation이나 idempotency receipt가 아니다.
          </p>
          <p>
            따라서 “bounded”는 현재 <strong>한 RecoveryContext 생명 동안 scenario별 simulation을 한
            번만 계산</strong>한다는 뜻이다. production 복구에는
            <code>(incident_id, action_id)</code> reservation, 절대 목표 상태, effect receipt,
            observation window와 undo가 필요하다. effect 성공 뒤 receipt 전에 crash해도 같은
            idempotency key로 기존 operation을 조회해야 중복 실행을 막을 수 있다.
          </p>
          <h3>두 lane과 한 번의 restart를 대입하면 현재 budget의 범위가 드러난다</h3>
          <p>
            하나의 RecoveryContext에서 lane A가 <code>ProviderFailure</code>를 한 번 시도하면 scenario
            count는 1이 된다. 이어 lane B가 같은 failure를 넘기면 자신의 첫 사고여도 step 전에
            EscalationRequired를 받는다. key에 lane이나 incident가 없기 때문이다. 반대로 process를
            재시작해 새 context를 만들면 같은 사고의 count가 0으로 돌아가 다시 실행 가능하다.
          </p>
          <p>
            따라서 현재 구현은 lane별 한 번도, incident별 한 번도, 재시작을 견디는 한 번도 아니다.
            production에서는 incident를 먼저 durable하게 만들고 action id를 예약한 뒤 effect를
            실행해야 한다. 재시작 후에는 같은 id로 기존 결과를 조회하며, observation window에서 목표
            상태가 실제로 회복됐을 때만 recovered로 닫는다. 확인 실패는 새 시도가 아니라
            UNKNOWN 또는 escalation으로 남겨야 한다.
          </p>
          <p>
            escalation도 같은 원칙을 따른다. <code>Escalated</code> event 생성은 알림 요청을
            만들었다는 뜻일 뿐, 담당자에게 전달됐거나 확인됐다는 뜻이 아니다. 운영 종료 상태는 최소한
            escalation request, delivery receipt, recipient acknowledgement를 구분해야 한다.
            전달 실패나 미확인은 자동 복구 성공으로 바꾸지 말고 열린 incident로 유지해야 한다.
          </p>
        </div>
      </section>
    </>
  );
}
