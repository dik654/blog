import type { CodeRef } from './codeRefsTypes';

export const runnerCodeRef: Record<string, CodeRef> = {
  'runner-trait': {
    path: 'commonware/runtime/src/lib.rs — Runner trait',
    lang: 'rust',
    highlight: [1, 12],
    desc: 'Runner는 실행기(Executor)가 구현하는 최상위 trait.\nContext(환경)를 정의하고 start()로 루트 태스크를 실행.\nstart 반환 시 모든 자식 태스크 자동 취소.',
    code: `/// Interface that any task scheduler must implement
/// to start running tasks.
pub trait Runner {
    /// Context defines the environment available to tasks.
    /// Example of possible services:
    /// - Clock for time-based operations
    /// - Network for network operations
    /// - Storage for storage operations
    type Context;

    /// Start running a root task.
    ///
    /// When this function returns, all spawned tasks
    /// will be canceled.
    fn start<F, Fut>(self, f: F) -> Fut::Output
    where
        F: FnOnce(Self::Context) -> Fut,
        Fut: Future;
}`,
    annotations: [
      { lines: [3, 3], color: 'sky', note: 'Runner — 런타임 진입점. tokio::Runner, deterministic::Runner가 구현' },
      { lines: [8, 8], color: 'emerald', note: 'Context — Clock + Network + Storage + Spawner 등을 모두 제공하는 환경 타입' },
      { lines: [15, 18], color: 'amber', note: 'start() — FnOnce(Context) 클로저를 받아 루트 태스크 실행. 반환 시 전체 종료' },
    ],
  },
};
