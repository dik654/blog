import { CodeSidebar, useCodeSidebar } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import Rebuilt from './claw-hooks/Rebuilt';
import { codeRefs } from './claw-hooks/codeRefs';

export default function ClawHooksArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <QuestionLead
        question="Pre hook이 input을 바꾸고 allow하면 permission policy와 tool은 정확히 무엇을 보며, Post hook은 이미 난 side effect를 되돌릴 수 있을까?"
        answer={<>Permission과 tool은 모두 Pre가 만든 <strong>effective input</strong>을 본다. Hook의 allow는 policy를 우회하지 않는다. Post는 이미 실행된 side effect를 rollback하지 못하지만, feedback을 붙이고 최종 tool result를 error로 바꿀 수 있다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'middleware', meaning: '핵심 실행 전후에 끼어들어 입력·context·결과를 가공하는 계층.', why: 'Hook은 독립 기능이 아니라 permission과 tool execution 사이의 순서를 바꾸는 연결점이다.' },
          { term: 'effective input', meaning: 'Pre hook의 updatedInput을 적용한 뒤 permission과 tool이 실제로 사용하는 JSON.', why: '검사한 입력과 실행한 입력이 달라지는 보안 결함을 피하려면 하나의 값이 두 단계에 전달돼야 한다.' },
          { term: 'observation과 mutation', meaning: '관찰은 사건을 기록하고, mutation은 이후 실행이나 반환 상태를 바꾼다.', why: 'Post는 side effect를 되돌리지 못해도 model이 받는 result 상태는 바꿀 수 있다.' },
          { term: 'fail-closed', meaning: '불확실한 hook 실패를 실행 허용이 아니라 거부·오류로 닫는 성질.', why: 'Pre script가 시작되지 않거나 비정상 종료됐는데 tool이 그대로 실행되는 일을 막는다.' },
        ]}
      />
      <Misconception>
        별도 shell process는 sandbox가 아니다. 또 <code>permissionDecision: "allow"</code>는 최종 승인도 아니다.
        Static deny·ask와 active mode requirement는 그대로 적용된다.
      </Misconception>
      <Rebuilt onCodeRef={sidebar.open} />
      <CapabilityCheck
        title="이 글을 읽은 뒤 source에서 확인할 것"
        items={[
          'PreToolUse, PostToolUse, PostToolUseFailure 세 event를 실제 call site와 연결한다.',
          'updatedInput이 permission policy와 tool executor 양쪽에 전달되는 지점을 찾는다.',
          'Allow command는 chain을 계속하고 Deny, Failed, Cancelled만 중단한다는 차이를 설명한다.',
          'stdout JSON의 decision과 process exit code를 서로 다른 신호로 구분한다.',
          'Post hook이 side effect는 되돌리지 못하지만 tool result를 error로 바꾸는 지점을 찾는다.',
          'settings hook과 enabled plugin hook이 CLI bootstrap에서 합쳐지는 순서를 설명한다.',
          '현재 없는 timeout, matcher, process-group containment를 hardening 요구사항으로 구분한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-3 text-sm">
        <span>이전: <InternalLink slug="claw-worker-boot" learningPathId="ai-claw-lifecycle">Worker가 runtime state를 준비하는 법</InternalLink></span>
        <span>다음: <InternalLink slug="claw-plugin" learningPathId="ai-claw-lifecycle">Plugin manifest와 process lifecycle</InternalLink></span>
        <span>연결: <InternalLink slug="claw-permissions" learningPathId="ai-claw-security">Permission policy의 실제 우선순위</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw runtime hooks.rs', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/runtime/src/hooks.rs', note: '세 event, command chain, shell protocol, parser와 abort loop의 실제 구현. 본문 코드 패널은 SOURCE.md에 기록한 파일별 byte-identical commit bundle을 사용한다.' },
          { label: 'Claw conversation.rs', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/runtime/src/conversation.rs', note: 'Pre → permission → tool → post/failure 연결과 최종 tool result 조립의 원문.' },
          { label: 'Claw config.rs', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/runtime/src/config.rs', note: 'settings hook의 세 ordered command 배열과 merge 규칙.' },
          { label: 'Claw plugins', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/plugins/src/lib.rs', note: 'plugin hook manifest, enabled registry aggregation, path resolution과 validation.' },
          { label: 'Claw permissions.rs', href: 'https://github.com/ultraworkers/claw-code/blob/main/rust/crates/runtime/src/permissions.rs', note: 'Hook request context가 static deny·ask와 permission mode 사이에서 평가되는 실제 순서.' },
        ]}
      />
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{}}
        projectMetas={{
          'claw-code': {
            id: 'claw-code',
            label: 'Claw Code · Rust',
            badgeClass: 'border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300',
          },
        }}
      />
    </>
  );
}
