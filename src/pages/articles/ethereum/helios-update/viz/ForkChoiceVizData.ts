/** ForkChoice Viz — 색상 + 스텝 정의 */

export const C = {
  best: '#6366f1',     // 보라 — 최선 update
  opt: '#3b82f6',      // 파랑 — optimistic
  fin: '#10b981',      // 녹색 — finalized
  alert: '#ef4444',    // 빨강 — 탈락/잠금
  muted: '#94a3b8',    // 회색 — 비활성
};

export const STEPS = [
  {
    label: 'best_valid_update 선택 — 3가지 기준으로 최선 Update 결정',
    body: '① 참여자 수 많은 update 우선\n② FinalityUpdate > OptimisticUpdate\n③ 같은 조건이면 최신 슬롯 우선',
  },
  {
    label: 'Reorg 처리 — optimistic은 교체, finalized는 불가',
    body: 'optimistic 헤더는 포인터 교체 = O(1).\nfinalized 헤더는 2/3 stake 확정 — 되돌리려면 ~100억 달러 슬래싱 비용.\nReth는 Pipeline.unwind()로 블록 롤백 — Helios는 포인터만 바꾸면 끝.',
  },
];
