export const C = {
  hs1: "#6366f1",
  hs2: "#10b981",
  fast: "#f59e0b",
  err: "#ef4444",
};

export const STEPS = [
  {
    label: "HotStuff의 3단계: 왜 필요했나",
    body: "O(n) View Change를 위해 Prepare→Pre-Commit→Commit 3단계 필요",
  },
  {
    label: "HotStuff-2: 2단계로 축소",
    body: "TC(timeout-certificate) 도입으로 Pre-Commit 제거 — 2단계 달성",
  },
  {
    label: "낙관적 경로 (Optimistic Path)",
    body: "정상 시 2단계(4 delays) + View Change도 O(n) 유지",
  },
];
