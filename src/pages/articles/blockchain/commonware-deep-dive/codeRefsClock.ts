import type { CodeRef } from './codeRefsTypes';

export const clockCodeRef: Record<string, CodeRef> = {
  'clock-trait': {
    path: 'commonware/runtime/src/lib.rs — Clock trait',
    lang: 'rust',
    highlight: [1, 16],
    desc: 'Clock — 시간 추상화 trait.\n결정론적 런타임에서는 가상 시간, tokio에서는 실제 SystemTime.\ntimeout()은 Clock::sleep을 사용해 구현.',
    code: `/// Interface that any task scheduler must implement
/// to provide time-based operations.
///
/// It is necessary to mock time to provide
/// deterministic execution of arbitrary tasks.
pub trait Clock:
    governor::clock::Clock<Instant = SystemTime>
    + ReasonablyRealtime
    + Clone + Send + Sync + 'static
{
    /// Returns the current time.
    fn current(&self) -> SystemTime;

    /// Sleep for the given duration.
    fn sleep(&self, duration: Duration)
        -> impl Future<Output = ()> + Send + 'static;

    /// Sleep until the given deadline.
    fn sleep_until(&self, deadline: SystemTime)
        -> impl Future<Output = ()> + Send + 'static;

    /// Await a future with a timeout.
    fn timeout<F, T>(&self, duration: Duration, future: F)
        -> impl Future<Output = Result<T, Error>> + Send
    where
        F: Future<Output = T> + Send + 'static,
        T: Send + 'static;
}`,
    annotations: [
      { lines: [6, 9], color: 'sky', note: 'governor::Clock 구현 — 내장 rate limiter가 Clock을 직접 참조' },
      { lines: [12, 12], color: 'emerald', note: 'current() — deterministic에서는 시뮬레이션 시간, tokio에서는 실제 시간' },
      { lines: [15, 16], color: 'amber', note: 'sleep() — deterministic에서는 즉시 완료 가능 (시간 전진 시)' },
      { lines: [23, 27], color: 'violet', note: 'timeout() — 기본 구현: select! { result = future, _ = sleep }' },
    ],
  },
};
