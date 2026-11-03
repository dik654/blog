export const C = { formula: "#6366f1", pcie: "#6366f1", alert: "#ef4444", nvlink3090: "#f59e0b", nvswitch: "#10b981", h100: "#8b5cf6" };
export const STEPS = [
  { label: "PCIe Gen4 x16 — 31.5GB/s 편도 raw", body: "16GT/s × 16 lane × 128/130 ÷ 8 ≈ 31.5GB/s.\n63GB/s는 두 방향을 동시에 더한 값이지 한 번의 전송 분모가 아니다." },
  { label: "4090 — direct P2P가 아니라 host 경로일 수 있다", body: "RTX 4090은 CUDA P2P를 지원하지 않는다.\nGPU↔GPU collective가 host memory를 거치면 raw slot rate보다 낮아진다." },
  { label: "3090 — 지정된 두 카드 사이 NVLink", body: "방향당 56.25GB/s, 양방향 합 112.5GB/s의 2-way bridge다.\n3-way·4-way fabric은 아니다." },
  { label: "A100 — 600GB/s/GPU fabric 사양", body: "HGX/DGX A100의 NVLink+NVSwitch 명목 양방향 수치다.\nApplication goodput은 collective별로 다시 잰다." },
  { label: "H100 — 900GB/s/GPU fabric 사양", body: "DGX H100의 GPU-to-GPU 명목 양방향 수치다.\n동시 모든 pair의 독점 대역폭을 뜻하지 않는다." },
  { label: "9.5×·14.3×는 인터페이스 숫자 비율", body: "600÷63≈9.5, 900÷63≈14.3.\n이 값은 tokens/s나 p99 개선 배수가 아니다." },
  { label: "최종 답은 topo와 nvbandwidth가 낸다", body: "topo -p2p로 direct access를 확인하고 nvbandwidth로 pair별 실제 경로를 잰다.\n그 뒤 NCCL collective와 serving trace를 연결한다." },
] as const;
