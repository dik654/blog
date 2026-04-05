import SessionStructViz from './viz/SessionStructViz';
import MessageTypesViz from './viz/MessageTypesViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Session 구조 &amp; 메시지 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SessionStructViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Session — 대화 단위 상태 컨테이너</h3>
        <p>
          <code>Session</code>은 "하나의 대화 턴 집합 + 연관 메타데이터"를 담는 최상위 구조체<br />
          생명주기: 프로세스 시작 ~ 종료, 또는 <code>fork</code>로 분기된 시점 ~ 병합<br />
          모든 메시지·도구 호출·권한 결정·토큰 사용량이 하나의 Session에 누적
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct Session {
    pub id: SessionId,                   // UUID v4 — 세션 식별자
    pub parent: Option<SessionId>,       // 부모 세션 (fork 시 설정)
    pub messages: Vec<Message>,          // 대화 메시지 배열
    pub tool_calls: Vec<ToolCallLog>,    // 도구 호출 이력
    pub permission_log: Vec<PermDecision>, // 권한 판정 이력
    pub token_usage: TokenUsage,         // 누적 토큰 사용량
    pub workspace_root: PathBuf,         // 작업 디렉토리
    pub started_at: DateTime<Utc>,
    pub metadata: SessionMeta,
}`}</pre>
        <p>
          <strong>9개 필드의 역할</strong>:<br />
          - <code>id</code>: UUID v4 — 세션 식별자, 로그·추적 키<br />
          - <code>parent</code>: fork로 파생된 경우 원본 세션 참조<br />
          - <code>messages</code>: 대화 메시지 배열 (아래 Message 구조)<br />
          - <code>tool_calls</code>: 도구 호출 로그 (디버깅·텔레메트리용)<br />
          - <code>permission_log</code>: 모든 권한 판정 이력 — Allow/Deny/Prompt 기록<br />
          - <code>token_usage</code>: 입력·출력·캐시 토큰 누적<br />
          - <code>workspace_root</code>: 워크스페이스 경계 검증 기준<br />
          - <code>started_at</code>: 세션 시작 시각 (UTC)<br />
          - <code>metadata</code>: 사용자 정의 태그·플래그
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Message — 대화 턴의 기본 단위</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct Message {
    pub role: Role,                 // User | Assistant | System | Tool
    pub content: Vec<ContentBlock>, // 여러 콘텐츠 블록 (멀티모달)
    pub timestamp: DateTime<Utc>,
    pub metadata: MessageMeta,
}

pub enum Role {
    User,       // 사용자 입력
    Assistant,  // LLM 응답
    System,     // 시스템 프롬프트, 설정
    Tool,       // 도구 실행 결과
}

pub enum ContentBlock {
    Text(String),
    ToolUse { id: String, name: String, input: Value },
    ToolResult { tool_use_id: String, output: String, is_error: bool },
    Image { media_type: String, data: Vec<u8> },
}`}</pre>
        <p>
          <strong>4가지 Role</strong>: User, Assistant, System, Tool — Anthropic Messages API 스키마와 정렬<br />
          <strong>ContentBlock 4종</strong>: Text(일반 텍스트), ToolUse(도구 호출 요청), ToolResult(도구 결과), Image(이미지)<br />
          하나의 Message에 여러 ContentBlock 가능 — 예: 텍스트 + 병렬 도구 호출 3개
        </p>
      </div>
      <MessageTypesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">TokenUsage — 세부 토큰 회계</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TokenUsage {
    pub input_tokens: u64,              // 입력 토큰 (누적)
    pub output_tokens: u64,             // 출력 토큰 (누적)
    pub cache_creation_tokens: u64,     // 프롬프트 캐시 생성 비용
    pub cache_read_tokens: u64,         // 캐시 적중으로 절약된 토큰
}

impl TokenUsage {
    pub fn total_cost_usd(&self) -> f64 {
        // 모델별 단가 테이블 조회 (ModelInfo::pricing)
        let m = self.model_pricing();
        (self.input_tokens as f64) * m.input_per_million / 1_000_000.0
            + (self.output_tokens as f64) * m.output_per_million / 1_000_000.0
            + (self.cache_creation_tokens as f64) * m.cache_creation / 1_000_000.0
            + (self.cache_read_tokens as f64) * m.cache_read / 1_000_000.0
    }
}`}</pre>
        <p>
          <strong>4종 토큰</strong>: input/output/cache_creation/cache_read — Anthropic API 응답의 <code>usage</code> 필드 구조와 동일<br />
          <code>cache_creation_tokens</code>: 프롬프트 캐시에 올리는 비용 (1.25배 요금)<br />
          <code>cache_read_tokens</code>: 캐시 적중 시 사용 (0.1배 요금) — 대폭 절감<br />
          <code>total_cost_usd()</code>는 모델별 단가 테이블로 USD 비용 계산 — 사용자에게 실시간 표시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">세션 생성 & 초기화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl Session {
    pub fn new(workspace_root: PathBuf) -> Self {
        Self {
            id: SessionId::new(),          // UUID v4 생성
            parent: None,
            messages: Vec::new(),
            tool_calls: Vec::new(),
            permission_log: Vec::new(),
            token_usage: TokenUsage::default(),
            workspace_root,
            started_at: Utc::now(),
            metadata: SessionMeta::default(),
        }
    }

    pub fn fork(&self) -> Self {
        // 현재 상태를 복사하되 부모를 설정
        Self {
            id: SessionId::new(),
            parent: Some(self.id.clone()),
            messages: self.messages.clone(),
            ..self.clone()
        }
    }
}`}</pre>
        <p>
          <code>Session::new()</code>: 빈 세션 생성 — 워크스페이스 경로만 필수<br />
          <code>Session::fork()</code>: 현재 상태를 복제 후 부모 링크 설정 — "대화 분기" 지원<br />
          Fork는 <strong>시도해보고 싶은 가설 탐색</strong>에 유용 — 원본 대화를 깨뜨리지 않고 실험 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ContentBlock 직렬화 — Anthropic API 매핑</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Rust enum → JSON (serde로 자동 변환)
impl Serialize for ContentBlock {
    fn serialize<S: Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        match self {
            ContentBlock::Text(text) => {
                let mut m = s.serialize_map(Some(2))?;
                m.serialize_entry("type", "text")?;
                m.serialize_entry("text", text)?;
                m.end()
            }
            ContentBlock::ToolUse { id, name, input } => {
                let mut m = s.serialize_map(Some(4))?;
                m.serialize_entry("type", "tool_use")?;
                m.serialize_entry("id", id)?;
                m.serialize_entry("name", name)?;
                m.serialize_entry("input", input)?;
                m.end()
            }
            // ToolResult, Image 유사
        }
    }
}

// 결과 JSON (API 요청 payload)
// { "type": "tool_use", "id": "toolu_01", "name": "read_file",
//   "input": {"path": "src/main.rs"} }`}</pre>
        <p>
          <strong>Rust → JSON 일대일 대응</strong>: Anthropic Messages API 스키마 그대로 재현<br />
          <code>type</code> 필드가 discriminator — 수신 측에서 enum 분기 결정<br />
          이 설계는 Rust 내부 표현과 API wire format 사이에 <strong>변환 층 없음</strong> → 오버헤드 최소
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Session Lifecycle 상태 전이</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Session의 생명주기는 3가지 상태
enum SessionState {
    Active,       // 정상 동작 — 메시지 수신·처리
    Suspended,    // 일시 정지 — UI 닫혔지만 복원 가능
    Terminated,   // 종료 — 리소스 해제, 복원 불가
}

// 상태 전이
// Active → Suspended: 사용자가 UI 닫음 or 네트워크 끊김
// Suspended → Active: 사용자 재연결
// Active → Terminated: 사용자가 /exit or 에러로 종료
// Suspended → Terminated: 일정 시간 경과 (기본 24시간)

// 상태별 저장 위치
// Active:      메모리 (핫 데이터)
// Suspended:   메모리 + 디스크 (checkpoint)
// Terminated:  디스크 전용 (immutable archive)`}</pre>
        <p>
          <strong>3단계 lifecycle</strong>로 메모리 사용량과 복원 가능성의 균형<br />
          Suspended 상태의 세션은 토큰 사용량이 합산되지 않음 — 비용 절감<br />
          Terminated 후에도 archive에서 세션 로그 조회 가능 — 디버깅 지원
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Session 중심 아키텍처의 장점</p>
          <p>
            "모든 상태를 Session 하나에 모음" → 디버깅·재현·테스트가 간결<br />
            - <strong>재현</strong>: Session을 JSON으로 직렬화하여 버그 리포트에 첨부 가능<br />
            - <strong>테스트</strong>: 원하는 Session 상태를 만들어 특정 시나리오 재현<br />
            - <strong>fork</strong>: 상태 복제 비용이 낮음 (clone 가능한 구조체만)
          </p>
          <p className="mt-2">
            반대 극: "상태를 여러 서비스에 분산" — 관측은 편하지만 재현 어려움<br />
            claw-code는 단일 프로세스·단일 세션 모델로 복잡도 최소화
          </p>
        </div>

      </div>
    </section>
  );
}
