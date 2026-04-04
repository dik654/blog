import type { CodeRef } from '@/components/code/types';

export const guardCodeRefs: Record<string, CodeRef> = {
  'no-grad': {
    path: 'src/lib.rs — no_grad & thread_local',
    lang: 'rust',
    highlight: [1, 33],
    desc: 'thread_local로 전역 상태 관리.\nRAII 가드로 스코프 종료 시 자동 복원.',
    code: `thread_local! {
    static ENABLE_BACKPROP: Cell<bool> = const { Cell::new(true) };
    static TRAINING: Cell<bool> = const { Cell::new(true) };
}

pub struct NoGradGuard {
    prev: bool,  // 이전 상태 저장 — 중첩 호출 시 안전하게 복원
}

/// let _guard = no_grad(); 형태로 사용
/// 스코프 종료 시 Drop에서 자동 복원
pub fn no_grad() -> NoGradGuard {
    let prev = ENABLE_BACKPROP.with(|c| c.get());
    ENABLE_BACKPROP.with(|c| c.set(false));
    NoGradGuard { prev }
}

impl Drop for NoGradGuard {
    fn drop(&mut self) {
        ENABLE_BACKPROP.with(|c| c.set(self.prev));
    }
}

/// 역전파 그래프 생성을 enable 값으로 설정
/// 이중 역전파에서 사용: using_backprop(create_graph)
fn using_backprop(enable: bool) -> NoGradGuard {
    let prev = ENABLE_BACKPROP.with(|c| c.get());
    ENABLE_BACKPROP.with(|c| c.set(enable));
    NoGradGuard { prev }
}

// 사용 예:
// let _g = no_grad();
// let y = &x + &x;  // 그래프 기록 안 함`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: 'thread_local — 멀티스레드 안전, 스레드별 독립 상태' },
      { lines: [7, 7], color: 'emerald', note: 'prev 저장 — 중첩된 no_grad() 호출에서도 올바르게 복원' },
      { lines: [18, 21], color: 'amber', note: 'RAII Drop — 스코프 종료 시 자동 복원, panic에도 안전' },
      { lines: [27, 30], color: 'violet', note: 'using_backprop — backward()에서 create_graph 플래그 전달용' },
    ],
  },
};
