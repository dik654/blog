import ArchitectureViz from './viz/ArchitectureViz';
import CrateMapViz from './viz/CrateMapViz';
import MockScenariosViz from './viz/MockScenariosViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Claw Code 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">프로젝트 배경</h3>
        <p>
          2026-03-31, Claude Code 소스가 npm 패키지의 <strong>.map 파일</strong>로 유출<br />
          Sigrid Jin(@instructkr)이 <strong>OmX(oh-my-codex)</strong> 오케스트레이션으로 하룻밤 만에 클린룸 Python 재작성을 완료<br />
          OmX는 여러 LLM을 병렬 호출하여 모듈별 코드 생성을 자동화하는 워크플로우 — 사람이 직접 쓰는 것이 아니라 LLM이 역분석 결과를 기반으로 구조체를 생성<br />
          Python 프로토타입 이후 <strong>Rust 포트</strong>가 진행되어 현재 9개 크레이트 Cargo workspace로 안착<br />
          핵심 동기: 원본 Claude Code의 런타임 동작을 분리·재현하되, 프레임워크 종속(React/Ink) 없이 순수 시스템 프로그래밍 언어로 구현
        </p>

        {/* ── 크레이트 맵 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">9개 크레이트 맵 — Cargo Workspace</h3>
        <p>
          Rust 쪽 코드베이스는 <code>rust/crates/</code> 아래 9개 크레이트로 구성<br />
          각 크레이트는 단일 책임 원칙을 따르며, 런타임(runtime)이 가장 큰 핵심 모듈
        </p>
      </div>
      <CrateMapViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>runtime</strong> 크레이트가 전체 LOC의 약 40%를 차지 — 대화 상태, 도구 디스패치, 권한 검증, 세션 관리가 모두 여기에 집중<br />
          <strong>tools</strong>는 개별 도구 구현체를 보유하되, 디스패치 로직은 runtime이 소유 — 의존 방향이 <code>runtime → tools</code> 단방향<br />
          <strong>api</strong>는 Anthropic, OpenAI, xAI 등 복수 프로바이더를 추상화 — <code>ApiProvider</code> 트레이트로 통합
        </p>

        {/* ── Python 레이어 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Python 패리티 추적 엔진</h3>
        <p>
          <code>src/</code> 디렉토리는 Rust 포트와 별개로 유지되는 <strong>패리티 추적 엔진</strong><br />
          37개 파일, 약 1,700 LOC의 Python 코드로 구성<br />
          핵심 모듈: <strong>PortRuntime</strong>과 <strong>QueryEnginePort</strong>
        </p>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`# PortRuntime — 원본 TypeScript 런타임의 동작을 Python으로 미러링
class PortRuntime:
    """Rust runtime 대비 패리티 검증 엔진"""
    def route_tool_call(self, name: str, input: dict) -> ToolResult:
        handler = self.registry.get(name)       # 도구 이름 → 핸들러
        if handler is None:
            return ToolResult.error(f"unknown tool: {name}")
        return handler.execute(input)           # 실행 결과 반환

# QueryEnginePort — 서브시스템별 쿼리 실행 시뮬레이션
class QueryEnginePort:
    subsystems: dict[str, Subsystem]            # conversation, auth, mcp ...
    def query(self, path: str) -> Any:          # "conversation.turn_count"
        return self.subsystems[path.split(".")[0]].get(path.split(".")[1])`}
        </pre>
        <p>
          20개 서브시스템 패키지가 원본 TypeScript 아카이브의 모듈 인벤토리를 미러링<br />
          conversation, auth, tools, mcp, session, hooks, permissions 등<br />
          Python 엔진은 Rust 포트의 <strong>동작 명세(behavioral spec)</strong> 역할 — Rust 구현과 Python 시뮬레이션의 결과를 교차 검증</p>

        {/* ── Mock 패리티 하네스 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Mock 패리티 하네스</h3>
        <p>
          <strong>mock-anthropic-service</strong> 크레이트가 결정론적 Anthropic API를 제공<br />
          실제 API 호출 없이 12개 시나리오를 재현하여 clean-env 테스트를 가능하게 함
        </p>
        <MockScenariosViz />
        <p>
          각 시나리오는 SSE 프레임 시퀀스를 결정론적으로 생성 — 동일 입력에 항상 동일 출력<br />
          도구 호출 시뮬레이션: <code>tool_use</code> 블록과 <code>tool_result</code> 블록의 왕복을 재현<br />
          CI 환경에서 API 키 없이 전체 에이전트 루프를 테스트할 수 있는 것이 핵심 가치</p>

        {/* ── 설계 원칙 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">설계 원칙</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">원칙</th>
                <th className="border border-border px-4 py-2 text-left">구현</th>
                <th className="border border-border px-4 py-2 text-left">효과</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">unsafe 금지</td>
                <td className="border border-border px-4 py-2"><code>workspace.lints.rust: unsafe_code = &quot;forbid&quot;</code></td>
                <td className="border border-border px-4 py-2">메모리 안전성 보장, 외부 크레이트도 감사 대상</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">스레드 안전</td>
                <td className="border border-border px-4 py-2"><code>Arc&lt;Mutex&lt;HashMap&gt;&gt;</code> 패턴 전역 레지스트리</td>
                <td className="border border-border px-4 py-2">도구 레지스트리, 세션 스토어 동시 접근 안전</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">상태 머신</td>
                <td className="border border-border px-4 py-2"><code>worker_boot</code>, <code>mcp_lifecycle</code>, <code>session_control</code></td>
                <td className="border border-border px-4 py-2">각 서브시스템이 명시적 상태 전이로 동작</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">정책 기반</td>
                <td className="border border-border px-4 py-2"><code>permission_enforcer</code>, <code>policy_engine</code></td>
                <td className="border border-border px-4 py-2">도구 실행 전 정책 검증 — allow/deny/ask 3단 판정</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">우아한 퇴화</td>
                <td className="border border-border px-4 py-2">sandbox fallback, MCP degraded mode</td>
                <td className="border border-border px-4 py-2">샌드박스 불가 시 제한 모드, MCP 서버 다운 시 로컬 도구만 사용</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── 아키텍처 계층도 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">아키텍처 계층도</h3>
      </div>
      <ArchitectureViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          최상위 CLI/REPL이 <strong>ConversationRuntime</strong>을 소유<br />
          ConversationRuntime이 에이전트 루프의 핵심 — API 호출, 응답 파싱, 도구 디스패치를 반복<br />
          <strong>Permission Enforcer</strong>가 모든 도구 호출을 가로채서 정책 검증 수행<br />
          Hooks 시스템은 도구 실행 전후에 사용자 정의 스크립트를 실행하여 커스텀 검증/로깅 가능
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: LOC 압축 비율</p>
          <p>
            원본 Claude Code — 약 <strong>512K LOC</strong> TypeScript<br />
            Rust 포트 — 약 <strong>55K LOC</strong> (원본 대비 ~10.7%)
          </p>
          <p className="mt-2">
            이 극적인 차이의 원인:<br />
            1. <strong>프레임워크 제거</strong> — React, Ink, Yoga 레이아웃 등 UI 프레임워크가 전체의 약 60% 차지<br />
            2. <strong>UI 컴포넌트 제거</strong> — 389개 TSX 컴포넌트(테마, 애니메이션, 접근성) 불필요<br />
            3. <strong>타입 정의 통합</strong> — TypeScript의 별도 .d.ts / interface 파일이 Rust에서는 struct/enum으로 통합<br />
            4. <strong>런타임 코어만 추출</strong> — 에이전트 루프, 도구 시스템, 권한 모델, 세션 관리만 재현
          </p>
          <p className="mt-2">
            결론: 512K LOC 중 실제 <strong>런타임 동작에 기여하는 코드</strong>는 약 10% — 나머지는 UI, 번들링, 호환성 계층
          </p>
        </div>

      </div>
    </section>
  );
}
