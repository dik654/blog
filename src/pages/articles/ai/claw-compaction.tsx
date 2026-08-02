import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-compaction/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawCompactionArticle() {
  return (
    <>
      <QuestionLead
        question="보존 구간의 첫 메시지가 tool_result라면, 설정한 개수만 남기고 그대로 잘라도 될까?"
        answer={<>안 된다. 그 결과를 만든 바로 앞 <code>tool_use</code>까지 경계를 한 칸 뒤로 옮겨 함께 보존해야 한다. 그렇지 않으면 OpenAI 호환 요청에는 원인 호출 없이 결과만 남아 400 오류가 날 수 있다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'context budget', meaning: '한 요청에 모델이 읽을 수 있는 입력 토큰의 한계.', why: '대화가 계속 쌓이면 다음 요청 자체가 실패하므로 오래된 기록을 줄여야 한다.' },
          { term: 'lossy compaction', meaning: '원문 일부를 짧은 요약으로 바꾸는 비가역 변환.', why: '무엇을 남겼는지만큼 무엇을 잃었는지 알아야 다음 행동을 신뢰할 수 있다.' },
          { term: 'preserved tail', meaning: '압축하지 않고 원문 그대로 남기는 최근 메시지 구간.', why: '현재 작업과 도구 호출의 바로 앞뒤 관계를 유지한다.' },
          { term: 'state installation', meaning: '계산한 compacted session을 실제 runtime 상태로 교체하는 단계.', why: '결과를 계산한 것과 실행 중 세션이 바뀐 것은 서로 다른 계약이다.' },
        ]}
      />
      <Misconception>
        이 revision의 요약은 별도 LLM을 호출하지 않는다. <code>SummaryCompressor</code>,
        relevance weight, <code>max_summary_tokens</code>도 없다. 문자열과 메시지 block을
        정해진 규칙으로 읽는 결정론적 휴리스틱이다.
      </Misconception>
      <Overview />
      <StopRule>
        여기서는 압축 연구 전체 계보까지 내려가지 않는다. trigger의 두 조건, 안전한 경계,
        요약의 보존·손실 항목, 재압축 merge, 수동 결과와 자동 상태 교체를 코드에서 추적할 수
        있으면 최소 기반에서 멈춘다.
      </StopRule>
      <CapabilityCheck
        items={[
          '기존 compact summary가 trigger 계산에서 빠지는 이유를 설명한다.',
          '메시지 수와 추정 토큰 수의 두 조건을 모두 계산한다.',
          'tool_use와 tool_result가 잘리지 않도록 keep_from이 이동하는 경우를 찾는다.',
          '요약이 보존하는 항목과 160자 절단으로 잃는 정보를 구분한다.',
          '두 번째 압축이 이전 highlights와 새 timeline을 어떻게 합치는지 설명한다.',
          'runtime.compact() 반환과 maybe_auto_compact() 상태 교체를 구분한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="claw-session" learningPathId="ai-claw-core">Session의 메시지 소유권</InternalLink></span>
        <span>다음: <InternalLink slug="claw-tool-system" learningPathId="ai-claw-core">도구 호출의 네 계약</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw compact.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/compact.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. trigger, safe boundary, deterministic summary와 merge 원문.` },
          { label: 'Claw conversation.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/conversation.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 수동 compact 반환과 자동 state installation의 차이.` },
          { label: 'Claw session.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/session.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. compaction count·summary·removed count 영속화.` },
        ]}
      />
    </>
  );
}
