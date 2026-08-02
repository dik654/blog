import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-recovery/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawRecoveryArticle() {
  return (
    <>
      <QuestionLead
        question="두 번째 복구 호출이 EscalationRequired를 반환하면 AlertHuman·Abort도 이미 실행됐을까?"
        answer={<>아니다. 현재 모든 recipe는 자동 시도를 한 번만 허용해 두 번째 호출을 step 전에 닫지만, 결과에는 이유만 들어간다. <code>AlertHuman</code>·<code>LogAndContinue</code>·<code>Abort</code>는 recipe metadata이고 실제 effect를 적용할 외부 coordinator는 이 module에 없다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'failure scenario', meaning: '이미 분류된 실패 원인을 나타내는 enum.', why: '복구 함수가 로그를 추측하지 않고 명시적 원인을 받는다.' },
          { term: 'recipe', meaning: 'scenario에 고정된 RecoveryStep 목록과 escalation policy.', why: '같은 실패에 예측 가능한 절차를 적용한다.' },
          { term: 'attempt boundary', meaning: 'step 실행 전에 자동 시도 가능 횟수를 검사하는 경계.', why: '복구 자체가 무한 루프가 되는 것을 막는다.' },
          { term: 'effect receipt', meaning: '외부 executor가 실제 환경 변화를 다시 확인한 증거.', why: 'simulation result나 Escalated event를 실제 효과로 오해하지 않게 한다.' },
        ]}
      />
      <Misconception>
        현재 <code>fail_at_step</code>은 실제 shell·git·MCP 실패 detector가 아니라 테스트용 simulation
        knob다. RecoveryContext에는 lane id, incident id, cooldown, idempotency key, durable retry
        budget, observation window나 undo도 없다.
      </Misconception>
      <Overview />
      <section id="handoff" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>이 글의 다음 연결점</h2>
          <p>
            실패가 어디서 왔는지는 <InternalLink slug="claw-worker-boot">Worker Boot</InternalLink>에서,
            실제 시도와 유실 가능성은 <InternalLink slug="claw-telemetry">Telemetry</InternalLink>에서,
            effect 실행 전 판단은 <InternalLink slug="claw-policy-engine">Policy Engine</InternalLink>에서
            이어 읽는다. Recovery는 이 셋을 대신하지 않고 scenario별 한 번의 분기와 결과 기록만 담당한다.
          </p>
        </div>
        <StopRule>
          여기서는 과거의 fault-tolerance 전체 계보까지 내려가지 않는다. scenario bridge, attempt gate,
          exact result/event, policy metadata와 실제 effect owner를 구분할 수 있으면 최소 기반에서 멈춘다.
        </StopRule>
      </section>
      <CapabilityCheck
        items={[
          '일곱 FailureScenario와 대응 recipe를 연결한다.',
          'WorkerFailureKind bridge가 직접 만드는 네 scenario와 별도 producer가 필요한 세 scenario를 구분한다.',
          'attempt count가 scenario별로 저장된다는 점을 설명한다.',
          '두 번째 호출이 step 실행 전에 막히는 위치를 찾는다.',
          'Recovered, PartialRecovery, EscalationRequired의 조건을 구분한다.',
          'EscalationPolicy metadata와 실제 AlertHuman·Abort effect를 구분한다.',
          'fail_at_step result와 production effect receipt를 구분한다.',
          'scenario별 in-memory 1회 제한과 incident별 durable retry budget을 구분한다.',
          'effect 뒤 observation과 undo가 없으면 Recovered를 운영 완료로 볼 수 없는 이유를 설명한다.',
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'Claw recovery_recipes.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/recovery_recipes.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. scenario, recipe, max_attempts=1, simulation, result와 event의 원문.` },
          { label: 'Claw worker_boot.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/worker_boot.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 여섯 WorkerFailureKind와 recovery bridge의 upstream 경계.` },
        ]}
      />
    </>
  );
}
