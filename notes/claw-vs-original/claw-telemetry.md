# claw-telemetry vs 원본 Claude Code

## 블로그 글 요지 (claw 기준)

블로그는 telemetry 를 **TelemetrySink + 10 event type + Exporter + Filter + SessionTracer + SSE + Usage tracking** 으로 설명한다.

- 10 event: 세션·도구·LLM·권한·훅·컴팩션·Custom
- Exporter: stdout/파일/HTTP 동시
- EventFilter: 민감 정보 제외

## 원본 Claude Code 실제 동작

원본 telemetry 는 **services/analytics + utils/telemetry 합쳐 ~8,200 LOC** + Datadog/Bigquery/Perfetto/Statsig 등 외부 sink 다수.

### 핵심 모듈

| 파일 | LOC | 역할 |
|---|---|---|
| `services/analytics/metadata.ts` | 973 | 이벤트 메타데이터 (브라우저, 모델, env, 등) |
| `services/analytics/datadog.ts` | ? | Datadog APM exporter |
| `services/analytics/firstPartyEventLogger.ts` | ? | 1st-party event logger |
| `services/analytics/firstPartyEventLoggingExporter.ts` | ? | exporter |
| `services/analytics/growthbook.ts` | ? | feature flag (이벤트로 사용) |
| `services/analytics/sink.ts` | 114 | sink interface |
| `services/analytics/sinkKillswitch.ts` | 25 | 회사/사용자 telemetry kill switch |
| `services/analytics/index.ts` | 173 | logEvent + AnalyticsMetadata |
| `services/analytics/config.ts` | ? | telemetry config |
| `utils/telemetry/instrumentation.ts` | ? | OpenTelemetry instrumentation |
| `utils/telemetry/sessionTracing.ts` | ? | session-level trace (claw 의 SessionTracer 와 가장 유사) |
| `utils/telemetry/betaSessionTracing.ts` | ? | beta tracing |
| `utils/telemetry/bigqueryExporter.ts` | ? | Bigquery exporter |
| `utils/telemetry/perfettoTracing.ts` | ? | Perfetto trace (Chrome trace format) |
| `utils/telemetry/pluginTelemetry.ts` | ? | plugin 별 telemetry |
| `utils/telemetry/skillLoadedEvent.ts` | ? | skill load event |
| `utils/telemetry/events.ts` | ? | event 정의 |
| `utils/telemetry/logger.ts` | ? | 통합 logger |
| `utils/telemetryAttributes.ts` | 71 | OTel attributes |

### 핵심 차이

1. **Datadog APM** — production observability. claw 는 stdout/file/HTTP.
2. **Bigquery exporter** — 대규모 분석 (사용 데이터 → BQ). 원본의 BQ 코멘트 (`BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures`) 가 그 예.
3. **Perfetto tracing** — Chrome trace format, perfetto.dev 시각화. CPU/메모리/IO 프로파일링.
4. **OpenTelemetry instrumentation** — 표준 OTel attributes + traces.
5. **Statsig / Growthbook** — feature flag 시스템과 통합. event 발생 → 자동 A/B 분석.
6. **Kill switch** — `sinkKillswitch.ts` 회사/사용자가 telemetry 끄기. claw 의 EventFilter 와 다름 (sink 자체 비활성).
7. **Session tracing** — claw 의 SessionTracer 와 유사하지만 OTel 기반 + sample rate.
8. **Plugin telemetry** — plugin 별 사용 통계.
9. **메타데이터 풍부** — 973 LOC metadata.ts — 브라우저, OS, terminal, model, IDE detection 등 다 추적.
10. **firstPartyEventLogger** — Anthropic 1st-party 이벤트 (사용자 동의 후만).

## 주요 차이점

| 항목 | 블로그(claw) | 원본 | 차이 |
|---|---|---|---|
| 코드 규모 | telemetry crate ~수천 | 8,155 LOC + analytics | 단순화 |
| 이벤트 종류 | 10 + Custom | 더 많음 (session/tool/perm/hook/compact + classifier/permission/cron/teammate/skill/...) | 단순화 |
| Sink 종류 | stdout/file/HTTP | Datadog + Bigquery + Perfetto + OTel + 1st-party | 누락 (모두) |
| OTel 통합 | 없음 | 표준 attributes + tracing | 누락 |
| Kill switch | EventFilter | sinkKillswitch (sink 자체 끄기) | 다른 메커니즘 |
| Feature flag 통합 | 없음 | Growthbook + Statsig | 누락 |
| Perfetto profiling | 없음 | CPU/메모리 trace | 누락 |
| Plugin telemetry | 없음 | per-plugin event | 누락 |
| 메타데이터 깊이 | basic | 973 LOC (browser/OS/terminal/model/IDE/...) | 단순화 |
| User consent flow | 없음 | 1st-party logger 동의 기반 | 누락 |

## 보강 제안

- "claw 는 sink interface 만 정의 — Datadog/Bigquery/Perfetto/OTel 같은 production exporter 는 별도 구현 필요" 명시
- OTel 표준 통합 부재가 enterprise 도입 장벽이라는 점 한 단락
- Statsig/Growthbook 같은 feature flag 시스템과의 자연스러운 통합 (이벤트 = A/B 결과 측정 단위)

## 참조 파일

- `/home/heru/code/claude-analysis/src/services/analytics/metadata.ts` (973)
- `/home/heru/code/claude-analysis/src/services/analytics/index.ts` (173)
- `/home/heru/code/claude-analysis/src/services/analytics/datadog.ts`, `firstPartyEventLogger.ts`, `growthbook.ts`
- `/home/heru/code/claude-analysis/src/utils/telemetry/perfettoTracing.ts`, `bigqueryExporter.ts`, `sessionTracing.ts`, `instrumentation.ts`
- `/home/heru/code/claude-analysis/src/utils/telemetryAttributes.ts` (71)
