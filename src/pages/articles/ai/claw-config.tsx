import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SpecialistEntry,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-config/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawConfigArticle() {
  return (
    <>
      <SpecialistEntry
        eyebrow="코드베이스 원문 경로 · Provider·MCP·CLI"
        title="설정 파일 문법보다 runtime이 값을 읽고 다시 조립하는 순서를 추적한다"
        description="이 글은 JSON 설정 입문이 아니라 Claw Code의 다섯 설정 출처, deep merge, typed projection과 bootstrap 경계를 source revision에 묶어 검산한다. 먼저 전체 실행 경로와 session state의 소유자를 잡아야 설정 값이 실제 동작이 되는 지점을 찾을 수 있다."
        prerequisites={[
          '프로세스 시작 때 환경 변수와 설정 파일을 읽는다는 기본 흐름',
          '병합된 JSON 값과 runtime이 실제 사용하는 typed state는 다를 수 있다는 점',
        ]}
        links={[
          { slug: 'claw-overview', learningPathId: 'ai-claw-core', title: '선행 · Claw Code의 네 증거 층', reason: 'Production path, porting simulator, manifest와 mock E2E를 먼저 분리한다.' },
          { slug: 'claw-session', learningPathId: 'ai-claw-core', title: '선행 · Session과 한 Turn의 상태 소유권', reason: '설정이 주입되는 runtime state와 turn 경계를 먼저 확인한다.' },
        ]}
      />
      <QuestionLead
        question="user 설정은 model=sonnet, project 호환 설정은 model=project-compat, local 설정은 model=opus다. 최종 모델과 permission은 무엇일까?"
        answer={<>다섯 파일을 정해진 순서로 deep merge하므로 model은 마지막 local의 <code>opus</code>가 된다. local의 <code>acceptEdits</code>는 typed projection에서 <code>WorkspaceWrite</code>로 정규화된다. 단, 앞 파일의 중첩 객체 키는 뒤 파일이 그 키를 직접 덮지 않았다면 남는다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'precedence', meaning: '같은 키가 여러 설정에 있을 때 어느 값이 이기는지 정한 순서.', why: '파일 수가 아니라 정확한 발견 순서가 최종 동작을 결정한다.' },
          { term: 'deep merge', meaning: '객체끼리는 안쪽 키까지 재귀적으로 합치고, 그 밖의 값은 뒤 값으로 바꾸는 병합.', why: 'env와 permissions의 일부만 바꾸면서 나머지를 보존할 수 있다.' },
          { term: 'typed projection', meaning: '병합한 범용 JSON에서 runtime이 쓰는 model·hooks·permission 같은 타입을 다시 읽는 단계.', why: 'JSON에 값이 있다고 곧바로 유효한 runtime 설정이 되는 것은 아니다.' },
          { term: 'bootstrap plan', meaning: '시작 경로에서 고려할 phase의 순서 있는 목록.', why: 'phase 이름 목록과 실제 실행기·성능 측정을 혼동하지 않게 한다.' },
        ]}
      />
      <Misconception>
        이 revision에는 <code>/etc/claw/config.json</code> 계층이나
        <code>CLAW_MODEL</code> 최우선 override가 없다. <code>BootstrapPlan</code>도
        설정·플러그인·MCP를 차례로 실행하는 상태 머신이 아니라, phase를 순서대로 보관하고
        중복 제거하는 작은 값 객체다.
      </Misconception>
      <Overview />
      <StopRule>
        여기서는 설정 시스템 일반론이나 원본 Claude Code의 비공개 구현을 추측하지 않는다.
        다섯 경로의 우선순위, 객체와 배열의 병합 차이, 검증 뒤 typed projection,
        bootstrap helper와 실제 실행의 경계를 원문에서 추적할 수 있으면 멈춘다.
      </StopRule>
      <CapabilityCheck
        items={[
          '다섯 설정 경로를 실제 적용 순서로 나열한다.',
          '중첩 객체는 합쳐지고 배열·문자열은 교체되는 예를 계산한다.',
          '잘못된 legacy와 current settings의 loader 차이, 그리고 caller별 오류 처리 차이를 설명한다.',
          'loaded_entries와 일반 key provenance가 왜 같은 정보가 아닌지 설명한다.',
          'raw JSON env 예시와 provider가 읽는 process environment를 구분한다.',
          'permissionMode 별칭이 세 runtime mode 중 무엇으로 정규화되는지 찾는다.',
          'MCP server가 일반 JSON 병합과 별도로 source scope를 보존하는 이유를 설명한다.',
          'BootstrapPlan의 phase 목록과 main.rs의 실제 runtime 재조립 경로를 구분한다.',
          'OAuth helper와 upstream proxy bootstrap이 보장하지 않는 일을 구분한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="claw-compaction" learningPathId="ai-claw-core">runtime state를 줄이는 법</InternalLink></span>
        <span>다음: <InternalLink slug="claw-api-client" learningPathId="ai-claw-infra">설정이 선택한 provider 호출</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw config.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/config.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 다섯 경로, 검증·병합 순서, typed projection, MCP scope와 permission alias 원문.` },
          { label: 'Claw bootstrap.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/bootstrap.rs`, note: '12개 phase와 순서 보존 중복 제거만 구현된 BootstrapPlan 원문.' },
          { label: 'Claw CLI main.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/main.rs`, note: 'ConfigLoader caller별 오류 처리, plugin·MCP·tool·policy·provider 조립과 turn별 runtime 교체 경로.' },
          { label: 'Claw oauth.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/oauth.rs`, note: 'PKCE·URL·form·callback parsing·credentials JSON helper의 실제 경계.' },
          { label: 'Claw remote.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/remote.rs`, note: '환경 기반 upstream proxy 활성 조건과 subprocess 환경 구성 원문.' },
        ]}
      />
    </>
  );
}
