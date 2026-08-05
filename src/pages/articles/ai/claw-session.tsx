import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-session/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawSessionArticle() {
  return (
    <>
      <QuestionLead
        question="Session 파일을 저장하면 실행을 완전히 재현할 수 있을까?"
        answer={<>아니다. 대화와 분기 계보는 복원할 수 있지만 권한 결정, 외부 side effect의 실제 상태, 사람 승인, 평가 결과는 각 소유자가 따로 보존해야 한다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'conversation state', meaning: '다음 모델 호출에 필요한 message와 usage의 순서.', why: '응답을 이어 가려면 모델이 보았던 대화가 필요하다.' },
          { term: 'lineage', meaning: '어느 session에서 분기됐는지를 나타내는 부모 관계.', why: '같은 시작점에서 다른 가설을 시험한 기록을 구분한다.' },
          { term: 'persistence', meaning: '프로세스가 끝나도 상태가 남도록 디스크에 기록하는 성질.', why: '재시작 뒤 session을 다시 열 수 있다.' },
          { term: 'checkpoint', meaning: '같은 실행을 안전하게 재개할 수 있는 durable 지점.', why: '단순 복사인 fork와 외부 effect까지 정합한 재개를 구분한다.' },
        ]}
      />
      <Misconception>
        Session의 <code>ToolResult</code>는 runtime이 정규화한 observation이지 authorization log나 외부
        effect proof가 아니다. permission denial처럼 executor를 한 번도 호출하지 않은 경로도 error
        ToolResult를 만든다.
        또한 fork는 새 branch를 만드는 기능이지 checkpoint나 merge protocol이 아니다.
      </Misconception>
      <Overview />
      <CapabilityCheck
        items={[
          '실제 Session 필드와 존재하지 않는 권한·도구 로그 필드를 구분한다.',
          'Text, ToolUse, ToolResult가 message 안에서 맡는 역할을 설명한다.',
          'executor 호출 없이 permission denial ToolResult가 생기는 경로를 설명한다.',
          'JSONL snapshot과 append가 각각 언제 일어나는지 설명한다.',
          '외부 effect 뒤 ToolResult append 전 crash가 왜 unknown outcome을 만드는지 설명한다.',
          'workspace fingerprint와 load-time mismatch 검사가 막는 오류를 설명한다.',
          'fork와 checkpoint의 차이를 외부 side effect 관점에서 설명한다.',
          'Session이 여섯 하네스 소유권 중 무엇을 증명하고 무엇을 증명하지 못하는지 말한다.',
        ]}
      />
      <StopRule>
        데이터베이스 event sourcing 전체로 내려가지 않는다. Session이 보존하는 대화 상태와 외부
        permission·effect·evaluation owner를 나눌 수 있고, fork가 checkpoint가 아닌 이유를 설명하면
        다음 단계로 이동한다.
      </StopRule>
      <div className="not-prose my-8 flex flex-wrap gap-3 text-sm">
        <span>선행: <InternalLink slug="llm-harness" learningPathId="ai-agent-system-core">하네스의 여섯 소유권</InternalLink></span>
        <span>다음: <InternalLink slug="claw-compaction" learningPathId="ai-claw-core">메시지를 줄이되 경계를 보존하는 법</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw session.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/session.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. Session, ConversationMessage, ContentBlock, fork, JSONL 저장과 회전.` },
          { label: 'Claw session_control.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/session_control.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. workspace별 저장소, load 검증, fork persistence.` },
          { label: 'Claw conversation.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/conversation.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. Session을 사용하는 turn loop와 tool result 기록 위치.` },
        ]}
      />
    </>
  );
}
