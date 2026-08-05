export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          claw 의 telemetry 는 <strong><code>TelemetrySink</code> + 10 event + Exporter (stdout/file/HTTP) + EventFilter + SessionTracer</strong><br />
          원본은 <strong><code>services/analytics</code> + <code>utils/telemetry</code> 합쳐 약 8,200 LOC</strong> — Datadog APM, Bigquery, Perfetto, OpenTelemetry, Statsig/Growthbook feature flag 통합
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">본질 차이</h3>
        <div className="overflow-x-auto not-prose my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">claw (이 글)</th>
                <th className="border border-border px-3 py-2 text-left">원본 Claude Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Sink 종류</td>
                <td className="border border-border px-3 py-2">stdout / file / HTTP</td>
                <td className="border border-border px-3 py-2">Datadog APM + Bigquery exporter + Perfetto tracing + OpenTelemetry instrumentation + Anthropic 1st-party</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">OTel 통합</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">표준 OTel attributes + traces + sample rate</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Feature flag 통합</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">Statsig + Growthbook — 이벤트 자동 A/B 분석</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Kill switch</td>
                <td className="border border-border px-3 py-2">EventFilter (이벤트 마스킹)</td>
                <td className="border border-border px-3 py-2"><code>sinkKillswitch.ts</code> — sink 자체 비활성 (회사 / 사용자 모두)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">메타데이터 깊이</td>
                <td className="border border-border px-3 py-2">basic</td>
                <td className="border border-border px-3 py-2"><code>metadata.ts</code> 973 LOC — browser / OS / terminal / model / IDE detection</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Plugin telemetry</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">per-plugin event 추적</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">User consent flow</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">1st-party logger 동의 기반 + <code>metricsOptOut</code></td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">CPU/IO profiling</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">Perfetto trace (Chrome trace format) — perfetto.dev 시각화</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sink 다양성 — Datadog / Bigquery / Perfetto / OTel</h3>
        <p>
          claw 는 sink interface 만 정의 — Datadog/Bigquery/Perfetto/OTel 같은 production exporter 는 별도 구현 필요<br />
          원본은 각각이 운영 시나리오에 매핑:<br />
          <strong>Datadog APM</strong> — production observability (latency / error rate / throughput)<br />
          <strong>Bigquery exporter</strong> — 대규모 분석. 다른 글에서 본 <code>"BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures"</code> 같은 코멘트가 그 데이터의 부산물<br />
          <strong>Perfetto tracing</strong> — Chrome trace format. CPU / 메모리 / IO 프로파일링. 사용자가 "Claude 가 느린데" 라고 신고하면 trace 떠서 분석<br />
          <strong>OpenTelemetry instrumentation</strong> — 표준 OTel attributes 로 외부 observability 도구 (Honeycomb / Tempo / Grafana 등) 연결
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Feature flag × Telemetry — Statsig / Growthbook</h3>
        <p>
          원본의 <code>growthbook.ts</code> + Statsig 통합 — 모든 이벤트가 자동 A/B 분석 단위<br />
          예: <code>REACTIVE_COMPACT</code>, <code>KAIROS</code>, <code>TRANSCRIPT_CLASSIFIER</code> 같은 feature flag 가 사용자별 random 할당 → 그 그룹의 event metric 비교 → 자동 winner 결정<br />
          claw 는 feature flag 자체가 약함 — 모든 사용자가 같은 코드 path<br />
          telemetry 와 flag 의 분리는 LLM 제품에서 중요한 production layer
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">메타데이터 973 LOC — 풍부한 컨텍스트</h3>
        <p>
          <code>metadata.ts</code> 973 LOC 가 모든 이벤트에 자동 첨부하는 컨텍스트:<br />
          browser / OS / terminal type / model id / IDE detection (VSCode / Cursor / Continue / nvim-claude / 기타) / Claude Code version / git remote / hostname<br />
          claw 의 basic 메타데이터와 비교 — debug / segment 분석 깊이가 차원 차이
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 이렇게 갈라졌나</p>
          <p>
            <strong>claw 의 sink interface + 10 event</strong> — telemetry 의 핵심 추상 (sink / event / filter) 만 정의. production exporter 는 사용자가 자기 환경 (Datadog / Splunk / Loki 등) 에 맞게 구현. 의존성 제로
          </p>
          <p className="mt-2">
            <strong>원본의 8,200 LOC</strong> — Anthropic 자체가 production 운영 + Statsig/Growthbook 으로 feature 실험 + Bigquery 로 patterns 발견 + Datadog 로 latency 모니터. claw-compaction 의 circuit breaker 같은 운영 인사이트는 모두 이 telemetry 가 만든 데이터
          </p>
          <p className="mt-2">
            <strong>OTel 통합 부재</strong>가 enterprise 도입 장벽 — 회사가 이미 깔아둔 observability 스택 (Tempo / Jaeger / Honeycomb) 과 자연 통합되어야 함. claw 의 다음 lane 후보
          </p>
        </div>

      </div>
    </section>
  );
}
