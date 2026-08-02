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
import Overview from './claw-overview/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

const readingRoutes = [
  ['01', '한 Turn의 소유권', 'claw-session', '대화 저장·압축·도구 관찰은 누가 맡는가?'],
  ['02', '안전한 Side Effect', 'claw-permissions', '허용 판정과 실제 파일·shell 격리는 어디서 갈리는가?'],
  ['03', '확장과 Lifecycle', 'claw-worker-boot', '외부 worker·hook·plugin은 어떤 신뢰 경계로 합류하는가?'],
  ['04', 'Provider·MCP·CLI', 'claw-config', '설정에서 provider stream, MCP process, terminal 입력까지 어떻게 연결되는가?'],
  ['05', '다중 작업 운영', 'claw-task-team', 'task record를 worker 실행·trace·recovery와 어떻게 구분하는가?'],
] as const;

export default function ClawOverviewArticle() {
  return (
    <>
      <SpecialistEntry
        eyebrow="코드베이스 원문 경로 · Claw Code"
        title="처음이라면 Agent 한 Turn을 먼저 잡고 저장소의 실행 경로로 내려간다"
        description="이 글은 Agent 자체를 처음 소개하는 글이 아니라, 고정한 Claw Code revision에서 production Rust, Python port, manifest와 mock E2E의 증거 수준을 구분하는 코드 읽기 지도다. 아래 선행 글의 한 Turn을 이해한 뒤에는 디렉터리 목록이 아니라 실제 실패 질문을 따라 읽는다."
        prerequisites={[
          '사용자 입력 뒤 model 응답과 tool call이 이어지는 Agent loop',
          '코드에 함수가 존재하는 것과 실제 제품 경로에서 호출되는 것의 차이',
        ]}
        links={[
          { slug: 'agent-runtime-current-first', title: '먼저 읽기 · Agent Runtime은 답변 모델 밖에서 무엇을 맡는가', reason: 'Model·tool·state·approval·retry가 한 작업을 끝내는 최소 실행 흐름을 먼저 잡는다.' },
        ]}
      />
      <QuestionLead
        question="Python QueryEnginePort가 conversation.turn_count를 query하고, Rust runtime이 그 결과를 받아 도구를 실행한다는 설명은 맞을까?"
        answer={<>아니다. Python 쪽은 문자열 path query API가 없는 독립적인 porting simulator다. 실제 필드는 manifest·message·usage·transcript이고, turn 제출·stream event·compaction·session 저장을 자체 수행한다. Rust production path와의 연결은 직접 호출이 아니라 별도의 manifest 추출과 parity test로 검증한다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'production path', meaning: '사용자 입력이 실제 CLI·API·runtime·tool 구현을 지나 실행되는 코드 경로.', why: '보조 분석기와 실제 제품 동작을 혼동하지 않게 한다.' },
          { term: 'porting simulator', meaning: '이식 대상의 표면과 일부 turn 동작을 작고 결정적으로 표현한 Python 작업 공간.', why: '실제 LLM runtime과 같은 보장을 한다고 과장하지 않게 한다.' },
          { term: 'manifest extractor', meaning: 'upstream TypeScript 문자열에서 command·tool·bootstrap 표면을 추출하는 Rust helper.', why: '실행 결과 비교가 아니라 존재하는 표면을 추적하는 도구임을 구분한다.' },
          { term: 'parity harness', meaning: '결정론적 mock API와 실제 CLI binary를 연결해 특정 end-to-end 행동을 재현하는 시험 장치.', why: '구조 유사성보다 실행 가능한 증거가 어디서 생기는지 보여 준다.' },
        ]}
      />
      <Misconception>
        Python <code>PortRuntime</code>에는 <code>route_tool_call()</code>이 없고,
        <code>QueryEnginePort</code>에는 <code>query(path)</code>나 20개 subsystem registry가 없다.
        <code>compat-harness</code>와 <code>mock-anthropic-service</code>도 같은 도구가 아니다.
        전자는 TypeScript 표면을 추출하고, 후자는 CLI가 호출할 로컬 HTTP 응답을 만든다.
      </Misconception>
      <Overview />
      <section id="reading-routes" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>전체 목록 대신 지금 막힌 질문에서 다음 경로를 고른다</h2>
          <p>
            Claw Code의 세부 글을 저장소 디렉터리 순서로 모두 읽을 필요는 없다. 먼저 네 증거 층을
            구분한 뒤, 현재 고치려는 실패가 state, side effect, extension, connection, operations 중
            어디에 속하는지 고른다. 각 경로 안에서는 실제 호출 순서를 따라간다.
          </p>
        </div>
        <ol className="not-prose my-6 divide-y divide-border border-y border-border">
          {readingRoutes.map(([number, title, slug, question]) => (
            <li key={number} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[3rem_11rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xl font-black text-muted-foreground/45">{number}</span>
              <strong className="text-sm">
                <InternalLink slug={slug}>{title}</InternalLink>
              </strong>
              <p className="text-sm leading-6 text-muted-foreground">{question}</p>
            </li>
          ))}
        </ol>
      </section>
      <StopRule>
        저장소 전체 모듈을 한 장에 모두 나열하지 않는다. 실제 사용자 경로, Python porting workspace,
        manifest 추출, mock E2E라는 네 증거 층을 분리하고 각 층이 보장하는 범위를 원문에서
        설명할 수 있으면 다음 세부 아티클로 이동한다.
      </StopRule>
      <CapabilityCheck
        items={[
          '9개 Rust crate의 의존 방향을 Cargo.toml만 보고 거꾸로 추적한다.',
          'CLI registry 조립에서 첫 API 요청, ToolUse, permission·executor, ToolResult와 다음 API 요청까지 추적한다.',
          'PortRuntime.route_prompt()가 command와 tool 후보를 고르는 규칙을 설명한다.',
          'QueryEnginePort가 max turn·budget·transcript·session을 어떻게 갱신하는지 순서대로 말한다.',
          'compat-harness의 manifest 추출과 mock parity E2E의 증거 수준 차이를 설명한다.',
          '12개 mock scenario를 stream·file·permission·plugin·state/usage 축으로 묶는다.',
          'unsafe_code=forbid가 workspace code에 대한 규칙이지 외부 dependency 전체의 무결성 증명은 아닌 이유를 설명한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>다음: <InternalLink slug="claw-session" learningPathId="ai-claw-core">실제 대화 상태와 turn loop</InternalLink></span>
        <span>검증: <InternalLink slug="claw-cli" learningPathId="ai-claw-infra">CLI 입력과 출력 경계</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw Rust workspace', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/Cargo.toml`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 9개 crate workspace와 unsafe workspace lint.` },
          { label: 'Claw CLI main.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/main.rs`, note: 'registry·provider·permission·executor 조립과 CLI turn 진입 원문.' },
          { label: 'Claw conversation.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/runtime/src/conversation.rs`, note: 'User·Assistant·ToolResult를 Session과 다음 API iteration으로 잇는 production turn spine.' },
          { label: 'Claw Python runtime.py', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/src/runtime.py`, note: '실제 PortRuntime route_prompt, bootstrap_session, run_turn_loop 원문.' },
          { label: 'Claw Python query_engine.py', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/src/query_engine.py`, note: 'QueryEnginePort의 실제 필드, turn·stream·compaction·session 계약.' },
          { label: 'Claw compat-harness', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/compat-harness/src/lib.rs`, note: 'upstream TS command·tool·bootstrap 표면 추출 원문.' },
          { label: 'Claw mock Anthropic service', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/mock-anthropic-service/src/lib.rs`, note: '12개 결정론적 scenario와 HTTP/SSE 응답 원문.' },
          { label: 'Claw mock parity CLI test', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/tests/mock_parity_harness.rs`, note: 'clean environment에서 실제 claw binary와 mock service를 잇는 E2E 검증.' },
        ]}
      />
    </>
  );
}
