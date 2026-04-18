import TelemetryArchViz from './viz/TelemetryArchViz';
import TelemetryEventsViz from './viz/TelemetryEventsViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">텔레메트리 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TelemetryArchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">텔레메트리 시스템 목적</h3>
        <p>
          텔레메트리: <strong>시스템 동작 관찰·측정·분석</strong><br />
          claw-code가 추적하는 것:<br />
          - 토큰 사용량·비용<br />
          - 도구 호출 빈도·지연시간<br />
          - 에러·실패 이력<br />
          - 사용자 상호작용 패턴
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TelemetryEvent 타입</h3>
        <TelemetryEventsViz />
        <p>
          <strong>10종 표준 이벤트</strong>: 세션·도구·LLM·권한·훅·컴팩션<br />
          <code>Custom</code>: 사용자 정의 이벤트 — 플러그인에서 활용<br />
          enum variant로 타입 안전 — 추가 시 컴파일러가 누락 경고
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TelemetrySink 구조</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">TelemetrySink 필드</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">buffer: Arc&lt;Mutex&lt;VecDeque&lt;TelemetryEvent&gt;&gt;&gt;</code>
              <p className="text-xs text-muted-foreground mt-1">FIFO 순서 유지, 효율적 push/pop</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">exporters: Vec&lt;Box&lt;dyn Exporter&gt;&gt;</code>
              <p className="text-xs text-muted-foreground mt-1">동시에 stdout + 파일 + HTTP 전송</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">filters: Vec&lt;Box&lt;dyn EventFilter&gt;&gt;</code>
              <p className="text-xs text-muted-foreground mt-1">민감 이벤트 제외 — 예: 개인 정보 포함된 Custom 이벤트</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">flush_interval</code> / <code className="text-xs font-mono text-blue-600 dark:text-blue-400">max_buffer_size</code>
              <p className="text-xs text-muted-foreground mt-1">주기적 전송 간격 + 버퍼 상한</p>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-sm font-semibold text-muted-foreground mb-2">트레이트</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">Exporter::export(&self, events)</code>
                <p className="text-xs text-muted-foreground mt-1">이벤트 배치를 외부로 전송하는 비동기 메서드</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">EventFilter::should_emit(&self, event)</code>
                <p className="text-xs text-muted-foreground mt-1">이벤트 기록 여부 결정 — false 반환 시 드롭</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">emit() — 이벤트 기록</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">emit() 처리 흐름</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium">필터 적용</p>
                <p className="text-xs text-muted-foreground"><code>filters.iter().all(f.should_emit)</code> — 모든 필터 통과한 이벤트만 기록</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium">버퍼에 추가</p>
                <p className="text-xs text-muted-foreground"><code>buffer.lock().await</code> → <code>push_back(event)</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-medium">오버플로 처리</p>
                <p className="text-xs text-muted-foreground"><code>max_buffer_size</code> 초과 시 <strong>FIFO 드롭</strong> — 오래된 이벤트 우선 제거 + 경고 로그</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">flush_loop() — 주기적 export</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">flush_loop() 동작</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium">주기 대기</p>
                <p className="text-xs text-muted-foreground"><code>tokio::time::sleep(flush_interval)</code> — 기본 10초 간격</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium">버퍼 비우기</p>
                <p className="text-xs text-muted-foreground"><code>buffer.drain(..).collect()</code> — 배치 전송으로 오버헤드 제거</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-medium">모든 Exporter에 전송</p>
                <p className="text-xs text-muted-foreground">Exporter 실패는 경고만 — 다른 Exporter는 계속 작동</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Exporter 구현체 3종</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-sm font-semibold">StdoutExporter</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">디버그용 — 터미널 출력</p>
            <div className="bg-muted/50 rounded p-2">
              <code className="text-xs font-mono">println!("[telemetry] {'{'}...{'}'}")</code>
            </div>
            <p className="text-xs text-muted-foreground mt-2">이벤트별 JSON 직렬화 → stdout</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <p className="text-sm font-semibold">FileExporter</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">JSONL 파일 — 줄 단위 저장</p>
            <div className="bg-muted/50 rounded p-2">
              <code className="text-xs font-mono">OpenOptions::append(true)</code>
            </div>
            <p className="text-xs text-muted-foreground mt-2"><code className="text-xs">PathBuf</code> 경로에 append 모드로 기록</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <p className="text-sm font-semibold">HttpExporter</p>
            </div>
            <p className="text-xs text-muted-foreground mb-2">원격 수집 서버 전송</p>
            <div className="bg-muted/50 rounded p-2">
              <code className="text-xs font-mono">reqwest::post().bearer_auth()</code>
            </div>
            <p className="text-xs text-muted-foreground mt-2"><code className="text-xs">Url</code> + <code className="text-xs">api_key</code>로 JSON 배치 POST</p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 텔레메트리의 프라이버시 고려</p>
          <p>
            claw-code는 <strong>기본적으로 텔레메트리 비활성</strong><br />
            사용자가 명시적으로 활성화해야 수집<br />
            이유: 코드·프롬프트에 민감 정보 포함 가능
          </p>
          <p className="mt-2">
            <strong>옵트인 정책</strong>:<br />
            - <code>config.telemetry_sink: null</code> → 비활성 (기본)<br />
            - <code>config.telemetry_sink: "file"</code> → 로컬 파일만<br />
            - <code>config.telemetry_sink: "http://..."</code> → 원격 전송 (명시 URL)
          </p>
          <p className="mt-2">
            <strong>필터 예시</strong>: 민감 정보 마스킹<br />
            - Custom 이벤트의 payload에 "api_key" 필드 제거<br />
            - LlmRequest의 input_tokens는 OK, 실제 프롬프트 내용은 제외<br />
            - 파일 경로에서 사용자 홈 디렉토리 익명화
          </p>
          <p className="mt-2">
            claw-code는 <strong>"관찰 가능성과 프라이버시의 균형"</strong> 추구<br />
            사용자가 직접 통제권 가짐 — 전송 여부·대상·필터 모두 설정 가능
          </p>
        </div>

      </div>
    </section>
  );
}
