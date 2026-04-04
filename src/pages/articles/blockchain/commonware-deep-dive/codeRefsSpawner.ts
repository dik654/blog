import type { CodeRef } from './codeRefsTypes';

export const spawnerCodeRef: Record<string, CodeRef> = {
  'spawner-trait': {
    path: 'commonware/runtime/src/lib.rs — Spawner trait',
    lang: 'rust',
    highlight: [1, 18],
    desc: 'Spawner — 태스크 생성/관리의 핵심 trait.\nshared(blocking) vs dedicated() 두 모드 지원.\n부모 종료 시 자식도 자동 abort (Mandatory Supervision).',
    code: `/// Interface that any task scheduler must implement
/// to spawn tasks.
pub trait Spawner: Clone + Send + Sync + 'static {
    /// Return a Spawner on the shared executor.
    /// Set blocking=true for short blocking ops.
    fn shared(self, blocking: bool) -> Self;

    /// Return a Spawner on a dedicated thread.
    /// For long-lived or prioritized tasks.
    fn dedicated(self) -> Self;

    /// Instrument the next spawned task.
    fn instrumented(self) -> Self;

    /// Spawn a task with the current context.
    /// All tasks are supervised — parent finish
    /// or abort → all descendants aborted.
    fn spawn<F, Fut, T>(self, f: F) -> Handle<T>
    where
        F: FnOnce(Self) -> Fut + Send + 'static,
        Fut: Future<Output = T> + Send + 'static,
        T: Send + 'static;

    /// Signal the runtime to stop execution.
    fn stop(self, value: i32, timeout: Option<Duration>)
        -> impl Future<Output = Result<(), Error>> + Send;

    /// Returns a Signal that resolves when stop() is called.
    fn stopped(&self) -> signal::Signal;
}`,
    annotations: [
      { lines: [3, 3], color: 'sky', note: 'Clone + Send + Sync — 모든 태스크 간 자유롭게 전달·공유 가능' },
      { lines: [6, 10], color: 'emerald', note: 'shared vs dedicated — CPU-bound는 dedicated, I/O-bound는 shared(false)' },
      { lines: [18, 22], color: 'amber', note: 'spawn(FnOnce(Self)) — 클로저에 자식 Context를 넘겨 계층적 감독 트리 구성' },
      { lines: [25, 26], color: 'violet', note: 'stop() — 모든 태스크에 종료 신호 전송. idempotent' },
    ],
  },
};
