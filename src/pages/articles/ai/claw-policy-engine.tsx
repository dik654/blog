import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import PolicyEvaluationLab from './claw-policy-engine/viz/PolicyEvaluationLab';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

const contextFields = [
  ['lane_id', '어느 lane의 evidence인지 식별한다.'],
  ['green_level', '현재는 raw u8이다. 별도 GreenContract enum과 아직 직접 연결되지 않는다.'],
  ['branch_freshness', 'StaleBranch와 TimedOut이 함께 읽는 경과 시간이다.'],
  ['blocker', 'None, Startup, External 중 하나다. StartupBlocked만 Startup을 검사한다.'],
  ['review_status', 'Pending, Approved, Rejected 중 Approved만 ReviewPassed다.'],
  ['diff_scope', 'Full과 Scoped를 구분한다. ScopedDiff는 후자만 통과한다.'],
  ['completed', '작업 완료 evidence다. action 실행 완료를 뜻하지 않는다.'],
  ['reconciled', '이미 병합·대체·수동 종료 등으로 후속 작업이 불필요한 상태다.'],
] as const;

export default function ClawPolicyEngineArticle() {
  return (
    <>
      <QuestionLead
        question="merge 규칙이 맞으면 PolicyEngine이 실제 branch를 병합할까?"
        answer={<>아니다. 현재 구현은 <code>LaneContext</code>를 읽고 정렬된 규칙을 모두 평가한 뒤, 실행해야 할 <code>PolicyAction</code> 목록만 반환한다. 실제 merge, 상태 변경, 재시도와 영수증 확인은 이 함수 밖의 executor·orchestrator 책임이다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'evidence packet', meaning: '한 lane을 판정하는 데 필요한 관찰값을 모은 LaneContext.', why: '정책이 shell, CI와 git을 직접 조회하지 않게 한다.' },
          { term: 'condition', meaning: 'evidence packet을 bool로 바꾸는 순수 predicate.', why: '같은 evidence를 replay하면 같은 판정이 나와야 한다.' },
          { term: 'action intent', meaning: 'MergeToDev, RecoverOnce, Escalate처럼 실행 요청을 표현한 enum.', why: '판정과 실제 side effect를 분리한다.' },
          { term: 'effect receipt', meaning: 'executor가 실제 환경 변화를 확인해 돌려주는 증거.', why: 'action을 반환한 사실만으로 완료 처리하지 않게 한다.' },
        ]}
      />
      <Misconception>
        현재 source에는 lane 저장소, event log, 30초 polling loop, YAML/custom script loader, CI cache,
        first-match <code>break</code>가 없다. 아래 설명은 현재 Rust source가 실제로 보장하는
        판정 계약까지만 다룬다.
      </Misconception>

      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>PolicyEngine은 상태 머신이 아니라 상태에서 action을 계산하는 함수다</h2>
          <p>
            모델은 “테스트를 통과했으니 merge하자”고 말할 수 있다. 그러나 그 문장은 관찰 증거가 아니다.
            PolicyEngine은 model transcript 대신 구조화된 <code>LaneContext</code>를 입력으로 받는다.
            그리고 조건이 맞는 규칙의 action을 모아 반환한다. 이 경계를 지키면 같은 context를 다시 넣어
            왜 merge·recovery·escalation이 선택됐는지 재현할 수 있다.
          </p>
          <p>
            이 글에서 가장 중요한 구분은 <strong>결정</strong>과 <strong>효과</strong>다.
            <code>MergeToDev</code>가 반환됐다는 것은 merge 명령을 실행해도 된다는 typed proposal이지,
            branch가 실제로 합쳐졌다는 사실이 아니다. 실행 후에는 git state나 commit hash를 다시 읽어
            effect receipt를 만들어야 한다.
          </p>
        </div>
        <PolicyEvaluationLab />
      </section>

      <section id="evaluation-semantics" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>실행 순서는 priority 정렬 → 모든 규칙 평가 → Chain 평탄화다</h2>
          <p>
            <code>PolicyEngine::new</code>은 규칙을 numeric priority 오름차순으로 정렬한다.
            <code>evaluate</code>는 정렬된 규칙을 끝까지 순회한다. 첫 규칙이 맞아도 멈추지 않는다.
            따라서 같은 lane에서 merge와 stale recovery 조건이 동시에 참이면 두 rule의 action이 모두
            결과에 들어갈 수 있다.
          </p>
          <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <div className="bg-background p-4">
              <span className="text-2xl font-black">01</span>
              <strong className="mt-2 block text-sm">priority 정렬</strong>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">작은 숫자의 규칙부터 안정된 순서로 본다.</p>
            </div>
            <div className="bg-background p-4">
              <span className="text-2xl font-black">02</span>
              <strong className="mt-2 block text-sm">all-match 평가</strong>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">일치한 모든 규칙이 action을 기여한다.</p>
            </div>
            <div className="bg-background p-4">
              <span className="text-2xl font-black">03</span>
              <strong className="mt-2 block text-sm">recursive flatten</strong>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">중첩 Chain을 원래 위치에서 1차원 action으로 편다.</p>
            </div>
          </div>
          <h3>왜 all-match가 위험하면서도 유용할까?</h3>
          <p>
            merge 뒤 notify, closeout 뒤 cleanup처럼 여러 action을 함께 내보내려면 all-match가 편하다.
            반대로 상충하는 규칙도 함께 맞을 수 있다. 예를 들어 merge와 recovery가 동시에 반환되면
            PolicyEngine은 어느 쪽을 취소할지 결정하지 않는다. 규칙 세트의 mutual exclusion을 검증하거나,
            executor 앞에 conflict resolver를 두는 책임이 남는다.
          </p>
          <p>
            빈 <code>And([])</code>는 Rust iterator의 <code>all</code> 규칙 때문에 참이고,
            빈 <code>Or([])</code>는 <code>any</code> 규칙 때문에 거짓이다. 작은 edge case지만
            잘못 비어 있는 설정이 “항상 실행” 규칙이 될 수 있으므로 rule 생성 단계에서 별도 validation이 필요하다.
          </p>
          <h3>상충 intent는 순서만으로 해결되지 않는다</h3>
          <p>
            priority는 결과 배열의 순서를 정하지만 뒤 action을 취소하지 않는다. 예를 들어 freshness가
            오래됐고 동시에 review가 승인된 context라면 recovery와 merge가 함께 나올 수 있다.
            executor가 “앞에 있으니 merge부터”라고 해석하면 stale branch에 effect를 적용할 수 있다.
            production resolver는 서로 양립할 수 없는 action 집합을 먼저 정의하고, 충돌하면 둘 다
            보류한 채 새 evidence를 요구해야 한다.
          </p>
        </div>
      </section>

      <section id="lane-context" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>LaneContext는 판단에 필요한 최소 evidence packet이다</h2>
          <p>
            PolicyEngine이 deterministic하려면 입력 packet이 이미 관찰을 끝낸 상태여야 한다.
            “CI가 통과했나?”를 평가 중에 network로 묻지 않고, upstream collector가 만든 값을 읽는다.
            이 분리는 test에서 임의 context를 만들고 같은 action 순서를 검증하게 해준다.
          </p>
        </div>
        <dl className="not-prose my-6 divide-y divide-border border-y border-border">
          {contextFields.map(([field, description]) => (
            <div key={field} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
              <dt className="font-mono text-xs font-bold">{field}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">{description}</dd>
            </div>
          ))}
        </dl>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>StaleBranch와 TimedOut은 같은 시계를 다른 기준으로 읽는다</h3>
          <p>
            <code>StaleBranch</code>는 고정 60분 threshold를 사용하고, <code>TimedOut</code>은 rule이 가진
            duration을 사용한다. 둘 다 <code>branch_freshness</code>를 읽는다. 이름만 보고 하나는
            commit freshness, 다른 하나는 task wall-clock이라고 가정하면 안 된다. 현재 source에서 시계의
            의미는 하나다.
          </p>
          <h3>결정론적인 입력이 곧 최신 입력은 아니다</h3>
          <p>
            현재 <code>LaneContext</code>에는 evidence source, observed timestamp, revision, hash,
            expiry가 없다. 그러므로 같은 packet을 replay하면 같은 action은 얻지만, 그 packet이 action
            실행 시점에도 유효한지는 증명하지 못한다. production executor는 intent에 lane id,
            evidence revision과 policy revision을 묶고, effect 직전 compare-and-set으로 최신 revision을
            확인해야 한다. 이 precondition이 없으면 “재현 가능한 stale decision”을 정확하게 실행하는
            문제가 생긴다.
          </p>
          <p>
            구체적으로 revision 41에서 test green을 관찰해 merge intent를 만들었더라도, effect 직전에
            branch가 revision 42로 바뀌었다면 이전 판정은 폐기해야 한다. intent에 revision 41을
            precondition으로 넣고 compare-and-set이 실패하도록 해야 “판정은 재현 가능하지만 대상은
            이미 바뀐” 경쟁 조건을 막을 수 있다.
          </p>
        </div>
      </section>

      <section id="green-contract" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>GreenContract는 별도 모듈이며 PolicyEngine과 아직 type으로 닫히지 않았다</h2>
          <p>
            <code>green_contract.rs</code>는 TargetedTests, Package, Workspace, MergeReady 네 단계를
            순서가 있는 enum으로 정의한다. required level보다 observed level이 같거나 높으면
            <code>Satisfied</code>, 관찰이 없거나 낮으면 <code>Unsatisfied</code>다.
          </p>
          <p>
            하지만 <code>policy_engine.rs</code>의 <code>GreenLevel</code>은 아직 <code>u8</code> alias다.
            통합 테스트도 이 차이를 명시한다. 즉 “Workspace가 숫자 3이다”라는 mapping은 상위 adapter가
            일관되게 보장해야 하며, 현재 두 모듈의 type system이 그 변환을 강제하지 않는다.
          </p>
          <div className="not-prose my-6 border-l-2 border-amber-600 bg-amber-500/[0.04] px-4 py-3 text-sm leading-6">
            <strong>설계 과제:</strong> typed <code>GreenLevel</code>을 LaneContext에 직접 사용하거나,
            변환 함수와 test를 한 곳에 두어 raw 숫자의 의미가 drift하지 않게 해야 한다.
          </div>
        </div>
      </section>

      <section id="runtime-handoff" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>현재 snapshot은 intent에서 멈추고, production bridge는 별도로 필요하다</h2>
          <p>
            현재 source에는 반환된 action을 실행하는 coordinator도, policy action 전용 telemetry event도,
            recovery context로 넘기는 wiring도 없다. 아래 순서는 구현 설명이 아니라 production에서
            추가해야 할 계약이다. executor가 <code>intent_id</code>와 idempotency key를 예약하고,
            evidence revision을 재검사하고, effect를 실행한 뒤 환경을 다시 읽은 receipt로 reducer를
            닫아야 한다.
          </p>
          <p>
            실패 기록은 <InternalLink slug="claw-telemetry">Telemetry</InternalLink>의 현재 enum만으로
            자동 완성되지 않으며, <InternalLink slug="claw-recovery">Recovery simulation</InternalLink>도
            action id를 받지 않는다. task·agent·lane·incident·intent·action id를 같은 causal chain에
            전달하고, 상충 intent는 실행 전에 모두 보류하는 resolver가 있어야 “policy → effect →
            observation → recovery”가 실제 pipeline이 된다.
          </p>
          <p>
            이 구조는 <InternalLink slug="claw-subagent-orchestration">Worker Coordination</InternalLink>에도
            그대로 적용된다. worker가 “완료”라고 쓴 manifest는 proposal이다. artifact hash와 독립 test가
            verified event가 된 뒤에만 merge policy의 evidence로 들어가야 한다.
          </p>
        </div>
        <StopRule>
          이 글에서는 planning과 강화학습의 전체 계보로 내려가지 않는다. 현재 source의
          evidence → condition → action intent 경계와 effect verification 책임을 설명할 수 있으면 멈춘다.
        </StopRule>
      </section>

      <CapabilityCheck
        items={[
          'PolicyEngine이 branch나 lane state를 직접 바꾸지 않는 이유를 설명한다.',
          'priority 순서와 all-match가 반환 action 순서에 미치는 영향을 계산한다.',
          '중첩 Chain이 어느 위치에서 어떤 순서로 평탄화되는지 예측한다.',
          'LaneContext의 여덟 필드를 observation과 action으로 오해하지 않는다.',
          '결정론적 replay와 evidence freshness·CAS가 서로 다른 보장임을 설명한다.',
          'raw u8 green level과 typed GreenContract의 현재 통합 gap을 설명한다.',
          '현재 wiring과 production에 필요한 executor·receipt·reducer bridge를 구분한다.',
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'Claw policy_engine.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/policy_engine.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. PolicyRule, condition, action, LaneContext, priority sort, all-match와 Chain flatten의 원문.` },
          { label: 'Claw green_contract.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/green_contract.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 네 typed green level과 satisfied/unsatisfied 판정.` },
          { label: 'Claw runtime integration tests', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/tests/integration_tests.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. raw green_level 경계와 policy·recovery 연결을 검산하는 테스트.` },
        ]}
      />
    </>
  );
}
