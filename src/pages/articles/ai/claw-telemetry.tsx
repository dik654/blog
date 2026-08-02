import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-telemetry/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawTelemetryArticle() {
  return (
    <>
      <QuestionLead
        question="HTTP 시작 helper를 한 번 호출하면 sequence가 붙은 event도 하나만 저장될까?"
        answer={<>아니다. 먼저 sequence가 없는 <code>HttpRequestStarted</code>를 기록하고, 이어 sequence가 붙은 <code>SessionTrace(http_request_started)</code>를 기록한다. 둘 다 동기 sink 호출이며 JSONL I/O 실패는 호출자에게 반환되지 않는다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'typed event', meaning: 'HTTP 성공·실패, analytics, session trace를 구분하는 enum.', why: '문자열 로그보다 소비자가 안전하게 분기할 수 있다.' },
          { term: 'sink', meaning: 'event를 받아 저장하는 최소 인터페이스.', why: 'producer가 memory와 file 저장 방식을 몰라도 된다.' },
          { term: 'sequence', meaning: 'SessionTracer가 SessionTrace마다 0부터 증가시키는 번호.', why: '같은 tracer가 만든 trace의 순서를 복원한다.' },
          { term: 'delivery guarantee', meaning: 'event가 유실·중복될 수 있는 조건을 정한 계약.', why: '오류를 무시하는 현재 JSONL sink와 durable pipeline을 구분한다.' },
        ]}
      />
      <Misconception>
        현재 구현에는 filter, bounded queue, batch timer, remote exporter, redaction, token/cost event가
        없다. 또한 ConversationRuntime telemetry는 기본값이 꺼져 있고, JSONL write failure는 event
        유실을 호출자에게 알리지 않는다.
      </Misconception>
      <Overview />
      <StopRule>
        여기서는 observability 전체 표준 계보까지 내려가지 않는다. opt-in 지점, exact event topology,
        trace sequence, 두 sink의 동기·유실 경계를 계산할 수 있으면 최소 기반에서 멈춘다.
      </StopRule>
      <CapabilityCheck
        items={[
          'TelemetryEvent의 다섯 variant를 구분한다.',
          'ConversationRuntime이 tracer 없이 시작하고 어디서 opt-in되는지 설명한다.',
          'SessionTrace sequence가 0부터 시작하며 typed HTTP envelope에는 없다는 점을 설명한다.',
          'HTTP helper 한 번이 두 sink record를 만드는 이유를 설명한다.',
          'Memory sink가 bounded queue가 아닌 Vec라는 점을 설명한다.',
          'JSONL sink가 event마다 flush하고 오류를 반환하지 않는 tradeoff를 설명한다.',
          '같은 iteration의 동일 tool 호출에 operation id가 필요한 이유를 설명한다.',
          'typed envelope 또는 SessionTrace 한쪽만 남은 경우를 UNKNOWN으로 판정한다.',
          'remote exporter와 redaction을 현재 구현이 아닌 확장 설계로 구분한다.',
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'Claw telemetry/src/lib.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/telemetry/src/lib.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. event enum, sink, sequence와 helper의 원문.` },
          { label: 'Claw conversation.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/conversation.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. opt-in tracer와 turn·tool record 호출 위치.` },
        ]}
      />
    </>
  );
}
