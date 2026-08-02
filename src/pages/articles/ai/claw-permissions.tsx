import Overview from './claw-permissions/Overview';
import Policy from './claw-permissions/Policy';
import Enforcer from './claw-permissions/Enforcer';
import ContextOverride from './claw-permissions/ContextOverride';
import OriginalDiff from './claw-permissions/OriginalDiff';
import { CodeSidebar, useCodeSidebar } from '@/components/code';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SpecialistEntry,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { codeRefs } from './claw-permissions/codeRefs';

export default function ClawPermissionsArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <SpecialistEntry
        eyebrow="코드베이스 원문 경로 · 안전한 Side Effect"
        title="도구가 등록되고 실행되는 길을 본 뒤 permission gate를 읽는다"
        description="이 글은 보안 용어 사전이 아니라 Claw Code의 permission 판정 코드와 실제 enforcement 연결을 읽는 전문 경로다. Tool 이름을 찾는 dispatch, 실행 허용을 정하는 authorization, 허용된 실행을 가두는 containment를 서로 다른 책임으로 놓고 검산한다."
        prerequisites={[
          'Model의 tool call이 registry에서 실제 executor로 dispatch되는 흐름',
          '권한을 허용하는 판정과 파일·shell의 실행 범위를 가두는 장치는 다르다는 점',
        ]}
        links={[
          { slug: 'claw-overview', learningPathId: 'ai-claw-core', title: '선행 · Claw Code 실행 경로 지도', reason: '코드 표면과 production 호출 경로의 증거 차이를 먼저 잡는다.' },
          { slug: 'claw-tool-system', learningPathId: 'ai-claw-core', title: '선행 · Tool registry와 dispatch', reason: '어떤 호출 지점 앞에서 permission을 강제해야 하는지 확인한다.' },
        ]}
      />
      <QuestionLead
        question="Allow, Ask, Deny를 잘 판정하면 에이전트의 side effect도 안전해질까?"
        answer={<>권한 판정은 <strong>누가 어떤 action을 요청할 수 있는지</strong> 정한다. 실제 파일 경계와 shell 격리는 다음 단계의 책임이다. authorization과 containment를 분리해야 각 층의 실패를 정확히 볼 수 있다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'authorization', meaning: '주체가 특정 action을 수행하도록 허용할지 판정하는 과정.', why: '파일 경로가 안전한지와 사용자가 write 권한을 가졌는지는 서로 다른 질문이다.' },
          { term: 'least privilege', meaning: '작업에 필요한 최소 권한만, 필요한 동안만 부여하는 원칙.', why: '탐색 작업에 shell이나 write 권한을 함께 주지 않아도 된다.' },
          { term: 'fail-closed', meaning: '규칙 누락, 오류, timeout처럼 불확실한 상태를 허용이 아니라 거부로 닫는 정책.', why: '새 도구나 알 수 없는 action이 조용히 실행되는 일을 막는다.' },
          { term: 'decision point와 enforcement point', meaning: '정책을 계산하는 곳과 그 결과를 실제 실행 앞에서 강제하는 곳.', why: '판정 함수가 있어도 우회 가능한 호출 경로가 남으면 정책은 보안 경계가 아니다.' },
        ]}
      />
      <Misconception>
        현재 PermissionEnforcer는 모든 실행이 통과하는 중앙 gate가 아니다. policy 직접 호출과 enforcer 없는 public helper도 있으며, 허용된 action도 file·shell 계층에서 별도 containment가 필요하다.
      </Misconception>
      <Overview onCodeRef={sidebar.open} />
      <Policy onCodeRef={sidebar.open} />
      <Enforcer onCodeRef={sidebar.open} />
      <ContextOverride onCodeRef={sidebar.open} />
      <OriginalDiff />
      <CapabilityCheck
        items={[
          '다섯 PermissionMode를 작업 범위와 판정 특수 상태로 나눠 설명한다.',
          'static deny, hook context, ask, allow/mode의 실제 우선순위를 반례로 설명한다.',
          '등록되지 않은 tool과 prompter 없는 Ask가 fail-closed로 닫히는 지점을 찾는다.',
          '현재 derived enum order 때문에 Prompt mode가 일반 requirement를 묵시적으로 Allow하는 지점을 찾는다.',
          'authorization decision과 파일·shell containment를 분리한다.',
          'Prompt mode의 Allowed를 최종 사용자 승인으로 오해하면 생기는 우회를 설명한다.',
          'policy 직접 호출, optional enforcer, enforcer 없는 helper를 각각 추적한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-3 text-sm">
        <span>선행 권장: <InternalLink slug="claw-tool-system" learningPathId="ai-claw-core">도구 등록과 dispatch</InternalLink></span>
        <span>다음: <InternalLink slug="claw-file-ops" learningPathId="ai-claw-security">허용된 file action의 workspace 경계</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw permissions.rs · ab4498', href: 'https://github.com/ultraworkers/claw-code/blob/ab44985916cb0d53d2f7a55ea90e0d7be97d4626/rust/crates/runtime/src/permissions.rs', note: '다섯 mode, rule DSL, 실제 authorization 우선순위의 고정 원문. 본문 코드 패널은 이 revision과 byte-identical하다.' },
          { label: 'Claw permission_enforcer.rs · ab4498', href: 'https://github.com/ultraworkers/claw-code/blob/ab44985916cb0d53d2f7a55ea90e0d7be97d4626/rust/crates/runtime/src/permission_enforcer.rs', note: 'runtime check, Prompt handoff, file/bash 보조 판정의 고정 구현.' },
          { label: 'NIST Least Privilege', href: 'https://csrc.nist.gov/glossary/term/least_privilege', note: '작업 수행에 필요한 최소 권한만 부여한다는 기준.' },
          { label: 'Claude Code permissions', href: 'https://code.claude.com/docs/en/permissions', note: '운영 제품의 rule source와 permission mode를 비교하기 위한 공식 설명.' },
          { label: 'Claude Code sandboxing', href: 'https://code.claude.com/docs/en/sandboxing', note: 'permission과 OS-level containment가 상호 보완적이라는 공식 설명.' },
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
