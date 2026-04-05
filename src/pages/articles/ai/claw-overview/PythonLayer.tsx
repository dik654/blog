import PythonSubsystemsViz from './viz/PythonSubsystemsViz';
import ParityFlowViz from './viz/ParityFlowViz';

export default function PythonLayer() {
  return (
    <section id="python-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Python 레이어 — 패리티 추적 엔진</h2>
      <ParityFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── 왜 Python을 유지하나 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Rust 포트 이후에도 Python을 유지하는 이유</h3>
        <p>
          Rust 포트 완성 후에도 <code>src/</code>의 Python 코드(37 파일, ~1,700 LOC)는 의도적으로 유지<br />
          역할: <strong>Rust 구현의 동작 명세(behavioral spec)</strong> — Rust와 Python이 같은 입력에 같은 출력을 내는지 교차 검증<br />
          Python이 가벼운 이유: 실제 LLM 호출 없이 상태 머신과 디스패치 로직만 시뮬레이션
        </p>
        <p>
          <strong>Python = 읽기 쉬운 명세, Rust = 배포 가능한 구현</strong><br />
          언어 설계 철학이 반대 — Python은 명세를 빠르게 표현, Rust는 타입 안전성과 성능 보장<br />
          같은 동작을 두 언어로 유지하면 명세와 구현의 불일치를 자동 탐지
        </p>

        {/* ── PortRuntime 구조 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">PortRuntime — 중앙 디스패처</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# src/port_runtime.py (핵심 발췌)
class PortRuntime:
    """Rust runtime 대비 패리티 검증 엔진"""

    def __init__(self):
        self.registry: dict[str, ToolHandler] = {}  # 도구 레지스트리
        self.session: Session = Session.new()       # 현재 세션
        self.enforcer: PermissionEnforcer = ...     # 권한 강제기

    def route_tool_call(self, name: str, input: dict) -> ToolResult:
        # 1. 권한 게이트
        check = self.enforcer.check(name, input)
        if check.is_deny():
            return ToolResult.error(check.reason)

        # 2. 도구 조회
        handler = self.registry.get(name)
        if handler is None:
            return ToolResult.error(f"unknown tool: {name}")

        # 3. 실행 & 로깅
        result = handler.execute(input)
        self.session.log(name, input, result)
        return result`}</pre>
        <p>
          <code>PortRuntime</code>은 Rust의 <code>tool_dispatch.rs</code>와 1:1 대응<br />
          <strong>route_tool_call()</strong> 3단계 흐름:<br />
          1. 권한 체크 → 거부 시 즉시 에러<br />
          2. 레지스트리 조회 → 미등록 시 unknown tool 에러<br />
          3. 실행 & 세션 로그 기록
        </p>
        <p>
          Rust 버전과의 차이: <strong>I/O 격리</strong> — Python은 실제 파일 시스템을 건드리지 않고
          가짜 파일 시스템(<code>MockFs</code>)으로 시뮬레이션<br />
          덕분에 CI에서 격리된 환경 없이도 전체 에이전트 루프를 재현 가능
        </p>

        {/* ── QueryEnginePort ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">QueryEnginePort — 서브시스템 쿼리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# src/query_engine.py
class QueryEnginePort:
    """서브시스템별 상태 조회 & 시뮬레이션"""

    subsystems: dict[str, Subsystem]  # 20개 서브시스템 인벤토리

    def query(self, path: str) -> Any:
        # 예: "conversation.turn_count" → 대화 턴 수
        # 예: "mcp.server_count"        → 연결된 MCP 서버 수
        # 예: "session.token_usage"     → 토큰 사용량
        namespace, key = path.split(".", 1)
        return self.subsystems[namespace].get(key)

    def mutate(self, path: str, value: Any) -> None:
        namespace, key = path.split(".", 1)
        self.subsystems[namespace].set(key, value)`}</pre>
        <p>
          20개 서브시스템 인벤토리가 원본 TypeScript 아카이브의 모듈 구조를 미러링<br />
          <strong>네이밍 컨벤션</strong>: <code>&lt;namespace&gt;.&lt;key&gt;</code> 점 구분 경로<br />
          Rust에서는 이 경로가 <code>SessionState</code> 구조체의 필드로 매핑 — 예: <code>session.token_usage</code> → <code>session.token_usage: usize</code>
        </p>
      </div>
      <PythonSubsystemsViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 서브시스템은 독립 Python 모듈로 구현 — <code>src/subsystems/&lt;name&gt;.py</code><br />
          네임스페이스별로 단일 책임: 예를 들어 <code>conversation</code>은 대화 턴만, <code>permissions</code>는 정책 판정만
        </p>

        {/* ── 시뮬레이션 레벨 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">시뮬레이션 레벨 3단계</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`Level 1: 상태 머신 추적
  - 각 서브시스템의 상태 전이 기록
  - 예: WorkerBoot Idle → Launching → Ready → Working

Level 2: 도구 호출 & 결과
  - tool_use → tool_result 왕복 시뮬레이션
  - MockFs + MockShell로 파일/명령 결과 생성

Level 3: LLM 응답 시나리오
  - mock-anthropic-service의 12개 시나리오와 동일한 응답 재현
  - Python PortRuntime ↔ Rust runtime 응답 바이트 단위 비교`}</pre>
        <p>
          <strong>Level 1</strong>: 상태 머신만 추적 — 가장 빠른 단위 테스트에 사용<br />
          <strong>Level 2</strong>: 도구 호출 시뮬레이션 — 파일 I/O 없이 MockFs로 재현<br />
          <strong>Level 3</strong>: 전체 대화 루프 — Rust와의 크로스 체크 목적
        </p>
        <p>
          각 레벨은 독립적으로 실행 가능 — 단위 테스트는 Level 1, 통합 테스트는 Level 2,
          Rust 패리티 검증은 Level 3
        </p>

        {/* ── 사용 사례 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">Python 엔진의 실제 사용 사례</h3>
        <p>
          <strong>1. 버그 재현</strong> — Rust에서 예상 외 동작 발생 시, Python으로 동일 시나리오를 재현하여
          스펙 위반인지 확인<br />
          Python은 디버거 친화적 — <code>pdb</code> breakpoint로 상태 추적이 Rust GDB보다 빠름
        </p>
        <p>
          <strong>2. 명세 변경 제안</strong> — 새로운 도구·기능 추가 시 Python에 먼저 구현하여
          동작을 정의, 이후 Rust에 포팅<br />
          "동작이 올바른가?" 질문을 Python에서 먼저 답한 뒤 Rust에서 "구현이 효율적인가?"만 고민
        </p>
        <p>
          <strong>3. CI 스모크 테스트</strong> — PR마다 Python PortRuntime과 Rust runtime의 출력을
          12개 시나리오로 비교<br />
          불일치 발생 시 빌드 실패 — 자동으로 회귀 탐지
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 이중 언어 아키텍처의 비용 vs 편익</p>
          <p>
            <strong>비용</strong>:<br />
            - 두 언어로 같은 로직 유지 — 변경 시 동기화 부담<br />
            - Python 엔진이 커질수록 유지보수 비용 증가<br />
            - 언어 간 타입 시스템 차이(Option, Result 등) 변환 오버헤드
          </p>
          <p className="mt-2">
            <strong>편익</strong>:<br />
            - Rust 구현 실수를 Python 스펙과 교차 검증으로 자동 탐지<br />
            - 신규 기여자는 Python만 읽어도 아키텍처 이해 가능<br />
            - API 키 없는 CI 환경에서도 E2E 테스트 가능
          </p>
          <p className="mt-2">
            claw-code는 이 트레이드오프를 받아들였다 — <strong>"명세-구현 분리"가 유출 소스 클린룸 재현이라는
            특수 요구사항에 부합</strong>하기 때문<br />
            원본 Claude Code 동작을 Python으로 정의하고, Rust로 효율적으로 구현하는 이중 구조
          </p>
        </div>

      </div>
    </section>
  );
}
