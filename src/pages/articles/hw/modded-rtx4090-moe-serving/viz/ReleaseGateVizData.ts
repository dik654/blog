export const C = { decision: "#64748b", capacity: "#f59e0b", comm: "#6366f1", pipeline: "#10b981", ep: "#8b5cf6", gap: "#ef4444", verdict: "#0ea5e9" };
export const STEPS = [
  { label: "1. 모델이 24GB 한 장에 들어가는가?", body: "안 들어가면 48GB 한 장으로 합쳐지는지 본다.\n합쳐지면 여러 GPU 사이 통신을 제거할 수 있다." },
  { label: "2. 48GB 한 장으로 합쳐지는가?", body: "YES면 용량 증가가 곧 통신 제거로 이어진다.\nNO면 여러 GPU 경로를 계속 검증해야 한다." },
  { label: "3. Direct P2P인가, host staging인가?", body: "RTX 4090은 CUDA P2P 미지원이다.\ntopo -p2p와 nvbandwidth로 실제 pair 경로를 확인한다." },
  { label: "4. TP·PP·EP 후보를 같은 workload로 비교", body: "PP를 자동 기본값으로 두지 않는다.\nTTFT·TPOT·tokens/s·p99와 collective trace를 비교한다." },
  { label: "5. 통신량과 대기 시간을 따로 줄인다", body: "Expert 배치·activation 통신 정밀도·overlap을 한 번에 하나씩 A/B한다.\nWeight-only quantization을 통신 절감으로 오해하지 않는다." },
  { label: "6. Target SLO와 안정성이 최종 판정", body: "명목 9.5×·14.3×는 application speedup이 아니다.\np95·p99·오류·전력·복구 시간과 지원 위험이 기준이다." },
] as const;
