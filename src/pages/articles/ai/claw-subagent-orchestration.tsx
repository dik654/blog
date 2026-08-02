import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-subagent-orchestration/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawSubagentOrchestrationArticle() {
  return (
    <>
      <QuestionLead
        question="Agent tool이 running manifest를 반환하면 worker 작업도 이미 완료된 걸까?"
        answer={<>아니다. task와 running manifest를 먼저 쓴 뒤 background thread를 시작하고 즉시 반환한다. 최종 답은 나중에 completed·failed manifest와 output에 기록된다. type도 동적으로 ranking하지 않고 alias 정규화와 고정 allowlist로 해석한다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'delegation packet', meaning: 'description, prompt, type, 선택적 name/model로 된 worker 입력.', why: '부모의 모든 context 대신 필요한 작업만 전달한다.' },
          { term: 'allowlist', meaning: 'worker type이 호출할 수 있는 tool 이름의 고정 집합.', why: '모델에 숨기는 것과 executor에서 차단하는 것을 함께 적용한다.' },
          { term: 'manifest', meaning: 'running, completed, failed와 산출물 경로를 담는 JSON 기록.', why: '즉시 반환과 background terminal state를 분리한다.' },
          { term: 'acceptance evidence', meaning: '부모가 artifact와 외부 상태를 다시 검증한 증거.', why: 'worker의 완료 문장을 실제 effect와 구분한다.' },
        ]}
      />
      <Misconception>
        알 수 없는 subagent type이 fail-closed로 거부되지는 않는다. 현재는 기본 allowlist branch로 들어가므로
        type registry를 보안 경계로 쓰려면 추가 검증이 필요하다. 새 <code>Session</code>도 부모 transcript만
        분리할 뿐 filesystem·process·network sandbox를 만들지는 않는다.
      </Misconception>
      <Overview />
      <StopRule>
        여기서는 multi-agent 연구 전체 계보까지 내려가지 않는다. 입력 packet, type 해석, 두 allowlist 경계,
        즉시 running 반환과 terminal persistence, 부모 acceptance의 미구현 경계를 설명할 수 있으면 멈춘다.
      </StopRule>
      <CapabilityCheck
        items={[
          'Agent input의 필수 필드와 선택 필드를 구분한다.',
          'type alias 정규화와 tool allowlist 선택 순서를 설명한다.',
          'API-visible tools와 executor allowlist가 같은 집합을 받는 이유를 설명한다.',
          'spawn 성공 때 caller가 받는 running manifest와 나중 terminal manifest를 구분한다.',
          'spawn failure와 background runtime error의 반환·기록 시점을 구분한다.',
          'background thread의 panic이 manifest failed 상태로 남는 경로를 찾는다.',
          'unknown type이 넓은 기본 branch로 가는 위험을 설명한다.',
          '새 Session, tool allowlist, resource containment라는 세 격리 축을 구분한다.',
          'terminal manifest write 실패가 stale running으로 남을 수 있는 이유를 설명한다.',
          'manifest completed와 parent acceptance evidence를 구분한다.',
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'Claw tools/src/lib.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/tools/src/lib.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. Agent input, type, allowlist, spawn, runtime과 terminal persistence의 원문.` },
          { label: 'Claw conversation.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/conversation.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 새 Session 기반 ConversationRuntime과 max iteration 경계.` },
        ]}
      />
    </>
  );
}
