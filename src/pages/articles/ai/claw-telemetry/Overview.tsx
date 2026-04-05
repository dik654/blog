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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TelemetrySink {
    buffer: Arc<Mutex<VecDeque<TelemetryEvent>>>,
    exporters: Vec<Box<dyn Exporter>>,
    filters: Vec<Box<dyn EventFilter>>,
    flush_interval: Duration,
    max_buffer_size: usize,
}

#[async_trait]
pub trait Exporter: Send + Sync {
    async fn export(&self, events: &[TelemetryEvent]) -> Result<()>;
}

#[async_trait]
pub trait EventFilter: Send + Sync {
    fn should_emit(&self, event: &TelemetryEvent) -> bool;
}`}</pre>
        <p>
          <strong>VecDeque 버퍼</strong>: FIFO 순서 유지, 효율적 push/pop<br />
          여러 Exporter 지원 — 동시에 stdout + 파일 + HTTP 전송<br />
          필터로 민감 이벤트 제외 가능 — 예: "개인 정보 포함된 Custom 이벤트 제외"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">emit() — 이벤트 기록</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TelemetrySink {
    pub async fn emit(&self, event: TelemetryEvent) {
        // 필터 적용
        if !self.filters.iter().all(|f| f.should_emit(&event)) {
            return;
        }

        // 버퍼에 추가
        let mut buffer = self.buffer.lock().await;
        buffer.push_back(event);

        // 버퍼 오버플로 — 오래된 것부터 제거
        if buffer.len() > self.max_buffer_size {
            let overflow = buffer.len() - self.max_buffer_size;
            for _ in 0..overflow { buffer.pop_front(); }
            log::warn!("telemetry buffer overflow, dropped {} events", overflow);
        }
    }
}`}</pre>
        <p>
          <strong>필터 후 버퍼</strong>: 모든 필터 통과한 이벤트만 기록<br />
          오버플로 시 <strong>FIFO 드롭</strong> — 오래된 이벤트 우선 제거<br />
          경고 로그로 드롭 알림 — 버퍼 크기 조정 신호
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">flush_loop() — 주기적 export</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TelemetrySink {
    pub async fn flush_loop(self: Arc<Self>) {
        loop {
            tokio::time::sleep(self.flush_interval).await;

            // 버퍼 비우기
            let events: Vec<TelemetryEvent> = {
                let mut buffer = self.buffer.lock().await;
                buffer.drain(..).collect()
            };

            if events.is_empty() { continue; }

            // 모든 exporter에 전송
            for exporter in &self.exporters {
                if let Err(e) = exporter.export(&events).await {
                    log::warn!("exporter failed: {}", e);
                }
            }
        }
    }
}`}</pre>
        <p>
          <strong>주기적 flush</strong>: 기본 10초 간격<br />
          배치 전송 — 이벤트 하나씩 보내는 오버헤드 제거<br />
          Exporter 실패는 경고만 — 다른 Exporter는 계속 작동
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Exporter 구현체 3종</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 1. StdoutExporter — 디버그용
pub struct StdoutExporter;
impl Exporter for StdoutExporter {
    async fn export(&self, events: &[TelemetryEvent]) -> Result<()> {
        for e in events {
            println!("[telemetry] {}", serde_json::to_string(e)?);
        }
        Ok(())
    }
}

// 2. FileExporter — JSONL 파일
pub struct FileExporter { path: PathBuf }
impl Exporter for FileExporter {
    async fn export(&self, events: &[TelemetryEvent]) -> Result<()> {
        let mut file = tokio::fs::OpenOptions::new()
            .create(true).append(true).open(&self.path).await?;
        for e in events {
            let line = format!("{}\\n", serde_json::to_string(e)?);
            file.write_all(line.as_bytes()).await?;
        }
        Ok(())
    }
}

// 3. HttpExporter — 원격 수집 서버
pub struct HttpExporter { url: Url, api_key: String }
impl Exporter for HttpExporter {
    async fn export(&self, events: &[TelemetryEvent]) -> Result<()> {
        let client = reqwest::Client::new();
        client.post(&self.url)
            .bearer_auth(&self.api_key)
            .json(&events)
            .send().await?
            .error_for_status()?;
        Ok(())
    }
}`}</pre>

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
