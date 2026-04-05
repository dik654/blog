import ParityHarnessViz from './viz/ParityHarnessViz';
import SseFlowViz from './viz/SseFlowViz';
import ParityPipelineViz from './viz/ParityPipelineViz';

export default function ParityHarness() {
  return (
    <section id="parity-harness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Mock 패리티 하네스 — 결정론적 검증 인프라</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ParityHarnessViz />

        {/* ── 하네스 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">mock-anthropic-service 크레이트</h3>
        <p>
          <code>mock-anthropic-service</code>는 Anthropic Messages API를 완벽히 모사하는 로컬 HTTP 서버<br />
          포트 바인딩: 기본값 <code>localhost:3070</code> — 환경 변수 <code>ANTHROPIC_BASE_URL</code>로 리다이렉션<br />
          핵심 가치: <strong>API 키 없이 전체 에이전트 루프를 재현</strong> — CI 환경에서 네트워크 격리 상태로 테스트 가능
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// rust/crates/mock-anthropic-service/src/main.rs
fn main() -> Result<()> {
    let listener = TcpListener::bind("127.0.0.1:3070")?;
    for stream in listener.incoming() {
        let scenario = parse_scenario_from_headers(&stream);
        //    ↑ 요청 헤더에서 시나리오 선택 (X-Mock-Scenario)
        serve_scenario(stream, scenario)?;
    }
    Ok(())
}`}</pre>
        <p>
          클라이언트가 <code>X-Mock-Scenario: streaming-text</code> 헤더를 보내면 서버가 해당 시나리오의
          SSE 스트림을 재생<br />
          시나리오 미지정 시 기본값 <code>streaming-text</code> 사용<br />
          요청-응답이 1:1 결정론 — 동일 시나리오는 항상 동일 바이트 시퀀스 반환
        </p>

        {/* ── 12개 시나리오 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">12개 시나리오 상세</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// scenarios.rs
pub enum Scenario {
    StreamingText,           // 1. 순수 텍스트 스트리밍 (제어군)
    ReadFileRoundtrip,       // 2. read_file tool_use → tool_result 왕복
    BashPermissionPrompt,    // 3. bash 호출 → Prompt 응답 → 재시도
    MultiToolParallel,       // 4. 병렬 3개 도구 호출
    McpToolCall,             // 5. MCP 브릿지 경유 도구 호출
    SessionCompact,          // 6. 토큰 초과 → 압축 트리거
    HookPreExec,             // 7. pre-exec 훅 차단 시나리오
    SubAgentSpawn,           // 8. Task 서브에이전트 생성
    ErrorRecovery,           // 9. API 429 → 재시도 → 성공
    TokenLimitExceeded,      // 10. 토큰 한계 초과 응답
    ToolResultTruncation,    // 11. 도구 결과 절단 (>8K 바이트)
    ConversationFork,        // 12. 대화 분기 & 되감기
}`}</pre>
        <p>
          <strong>시나리오 선정 기준</strong>: 에이전트 루프의 모든 주요 경로를 망라<br />
          1. 정상 흐름 — #1, #2, #4<br />
          2. 보안 경로 — #3(권한), #7(훅)<br />
          3. 확장 경로 — #5(MCP), #8(서브에이전트)<br />
          4. 예외 경로 — #6(압축), #9(재시도), #10(한계), #11(절단), #12(포크)
        </p>

        {/* ── SSE 프레임 구조 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">SSE 프레임 구조 — content_block_* 이벤트</h3>

        <SseFlowViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Anthropic SSE 프레임 순서 (단순 텍스트)
event: message_start
data: {"type":"message_start","message":{"id":"msg_...","role":"assistant"}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"안녕"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"하세요"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":42}}

event: message_stop
data: {"type":"message_stop"}`}</pre>
        <p>
          <strong>프레임 6단계</strong>: message_start → content_block_start → (delta × N) →
          content_block_stop → message_delta → message_stop<br />
          각 프레임은 <code>event:</code> 이름과 <code>data:</code> JSON 페이로드로 구성<br />
          <code>content_block_delta</code>가 실제 텍스트를 청크 단위로 전달 — 토큰 단위 스트리밍 구현
        </p>

        {/* ── tool_use SSE ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">tool_use SSE 프레임 — JSON 델타 스트리밍</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 도구 호출 시 content_block 구조가 달라진다
event: content_block_start
data: {"type":"content_block_start","index":0,
       "content_block":{"type":"tool_use","id":"toolu_...","name":"read_file","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,
       "delta":{"type":"input_json_delta","partial_json":"{\\"path\\""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,
       "delta":{"type":"input_json_delta","partial_json":":\\"/tmp/x\\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}`}</pre>
        <p>
          <code>input_json_delta</code>는 도구 입력 JSON을 부분 문자열로 스트리밍<br />
          클라이언트는 이 조각들을 이어붙여 완전한 JSON으로 파싱 — 중간 스트리밍 중에는 파싱 불가<br />
          <code>partial_json</code> 누적값: <code>{`{"path":"/tmp/x"}`}</code> (두 델타 병합 결과)
        </p>
        <p>
          <strong>설계 의도</strong>: 사용자에게 "LLM이 도구 호출 중"이라는 진행 상황을 실시간 표시하기 위함<br />
          UI는 <code>content_block_start</code>에서 도구 아이콘 표시, <code>content_block_stop</code>에서
          입력 완성 표시
        </p>

        {/* ── 패리티 검증 흐름 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">Rust ↔ Python 패리티 검증 파이프라인</h3>
        <ParityPipelineViz />
        <p>
          <strong>검증 주기</strong>: 매 PR마다 12개 시나리오 × (Rust, Python) 조합 실행 — 총 24회<br />
          실행 시간: 약 3초 (시나리오당 250ms) — 실제 LLM 호출 대비 수백 배 빠름<br />
          <strong>검증 범위</strong>: Session 전체 상태 — 메시지, 도구 호출, 권한 체크, 토큰 사용량
        </p>

        {/* ── 확장성 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">하네스 확장성</h3>
        <p>
          새로운 에이전트 기능 추가 시 절차:<br />
          1. <code>Scenario</code> enum에 새 variant 추가<br />
          2. <code>scenarios/&lt;name&gt;.sse</code> 파일에 SSE 프레임 시퀀스 작성<br />
          3. Python PortRuntime에 시뮬레이션 로직 추가<br />
          4. Rust runtime에 구현 추가<br />
          5. CI에서 패리티 검증 자동 실행
        </p>
        <p>
          <strong>시나리오 파일 포맷</strong>:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# scenarios/read_file_roundtrip.sse
# 주석 — SSE 파싱 시 무시

event: message_start
data: {"type":"message_start","message":{"id":"msg_rf_01","role":"assistant"}}
---
event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"tool_use","id":"toolu_rf_01","name":"read_file","input":{}}}
# ... (나머지 프레임)`}</pre>
        <p>
          <code>---</code> 구분자로 프레임 분리 — 읽기 쉬운 텍스트 포맷<br />
          주석 라인(<code>#</code>)은 파서가 무시 — 시나리오 문서화 가능<br />
          신규 시나리오 작성 난이도 낮음 — 기존 프레임 복사 후 수정
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 결정론적 Mock의 3가지 가치</p>
          <p>
            <strong>1. API 비용 절감</strong>:<br />
            실제 LLM 호출은 토큰당 과금 — CI 매 PR마다 12개 시나리오 × 각 수천 토큰 = 누적 비용 상당<br />
            Mock은 비용 0 — 제한 없는 테스트 가능
          </p>
          <p className="mt-2">
            <strong>2. 결정론 보장</strong>:<br />
            실제 LLM은 샘플링으로 비결정론적 응답 — 같은 입력에 다른 결과<br />
            Mock은 항상 동일 바이트 시퀀스 — 회귀 탐지가 정확
          </p>
          <p className="mt-2">
            <strong>3. 오프라인 개발</strong>:<br />
            네트워크 없는 환경(비행기, 격리 VPC)에서도 개발 가능<br />
            API 키 부재 기여자도 즉시 PR 가능
          </p>
        </div>

      </div>
    </section>
  );
}
