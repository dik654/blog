export const C = { capacity: "#f59e0b", bandwidth: "#6366f1", solved: "#10b981", alert: "#ef4444", moe: "#8b5cf6", neutral: "#64748b" };
export const STEPS = [
  { label: "정품 12칩 → 커스텀 보드 24칩", body: "대표 48GB 사례는 같은 2GB 칩을 두 배로 싣는다.\n용량은 두 배가 되지만 버스 폭은 384-bit다." },
  { label: "두 장의 48GB는 하나의 96GB가 아니다", body: "각 GPU가 자기 48GB를 가진다.\n모델을 나누면 activation이나 토큰이 GPU 경계를 넘어야 한다." },
  { label: "RTX 4090은 CUDA P2P도 지원하지 않는다", body: "31.5GB/s는 슬롯의 편도 raw rate다.\n실제 GPU 간 collective는 host memory를 거칠 수 있어 pair별 측정이 필요하다." },
  { label: "EP는 라우팅 의존 dispatch·combine을 더한다", body: "인기 expert rank로 payload가 몰리면 straggler가 된다.\nMoE가 항상 dense보다 느리다는 뜻은 아니며 p95·p99로 비교한다." },
  { label: "결론은 용량 → 경로 → SLO 순서로 낸다", body: "48GB 한 장으로 통신을 없앨 수 있는지 먼저 본다.\n통신이 남으면 실제 path와 target request profile을 측정한다." },
] as const;
