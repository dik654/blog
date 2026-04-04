import type { CodeRef } from './codeRefsTypes';

export const metricsCodeRef: Record<string, CodeRef> = {
  'metrics-trait': {
    path: 'commonware/runtime/src/lib.rs — Metrics trait',
    lang: 'rust',
    highlight: [1, 18],
    desc: 'Metrics — 계층적 레이블 기반 메트릭 수집.\nwith_label()로 네임스페이스 중첩, with_attribute()로 동적 차원 추가.\nwith_scope()로 에폭 기반 자동 정리.',
    code: `/// Interface to register and encode metrics.
pub trait Metrics: Clone + Send + Sync + 'static {
    /// Get the current label of the context.
    fn label(&self) -> String;

    /// Create a new instance with the given label
    /// appended to the current label.
    fn with_label(&self, label: &str) -> Self;

    /// Add a key-value attribute dimension
    /// to all metrics in this context.
    fn with_attribute(
        &self, key: &str,
        value: impl std::fmt::Display
    ) -> Self;

    /// Register a metric with the runtime.
    fn register<N: Into<String>, H: Into<String>>(
        &self, name: N, help: H,
        metric: impl Metric
    );

    /// Encode all metrics into a buffer.
    fn encode(&self) -> String;

    /// Create a scoped context for bounded-lifetime
    /// metrics (e.g., per-epoch engines).
    fn with_scope(&self) -> Self;
}`,
    annotations: [
      { lines: [2, 2], color: 'sky', note: 'Clone + Send + Sync — Context를 복제하면 자식 메트릭 네임스페이스 생성' },
      { lines: [8, 8], color: 'emerald', note: 'with_label() — "engine" → "engine_votes_total" 형태로 prefix 자동 추가' },
      { lines: [12, 15], color: 'amber', note: 'with_attribute() — {epoch="5"} 같은 동적 차원. Family 대체용' },
      { lines: [27, 28], color: 'violet', note: 'with_scope() — 에폭 종료 시 자동 해제. 메트릭 누적 방지' },
    ],
  },
};
