/** EngineeringRecovery Viz — 색상 상수 + step 정의
 * 본문 spec: PCIe raw bandwidth는 상수. 남은 레버는 두 갈래 —
 *   (byte) 바이트 수 자체를 줄인다: A) Expert 배치, C) Quantization
 *   (time) 통신 위치를 바꾸거나 연산과 겹친다: B) TP·PP·EP A/B, D) Batching
 */

export const C = {
  pcie: "#64748b", // PCIe 상수 — 소프트웨어로 못 바꿈 (슬레이트)
  byte: "#f59e0b", // 바이트 수 줄이기 그룹 (앰버)
  time: "#06b6d4", // 시간 숨기기 그룹 (시안)
  expertA: "#f59e0b", // A) Expert 배치
  quantC: "#fb923c", // C) Quantization
  ppB: "#0891b2", // B) TP·PP·EP 비교
  batchD: "#3b82f6", // D) Batching
  warn: "#ef4444", // 위험/트레이드오프 경고 (버블, VRAM)
  ok: "#10b981", // 개선/성공 표시
} as const;

export const STEPS = [
  {
    label: "두 갈래 레버 — PCIe 상수를 중심으로 갈린다",
    body: "PCIe raw bandwidth는 소프트웨어로 못 바꾸는 상수다. 남은 선택은 링크를 건너는 바이트 수 자체를 줄이거나(A·C), 그 바이트를 옮기는 시간을 연산으로 가려 병목을 체감 못 하게 하는 것(B·D)뿐이다.",
  },
  {
    label: "A) Expert 배치 — 경계를 넘는 라우팅 자체를 없앤다",
    body: "자주 함께 활성화되는 expert를 같은 GPU에 몰아두면 그 조합일 때 GPU 경계를 아예 넘지 않는다. Shared expert는 각 GPU에 복제해 그 경로의 dispatch·combine을 없앤다. PCIe 2-way는 경계가 하나뿐이라 배치 최적화의 보상이 NVSwitch보다 크다.",
  },
  {
    label: "B) TP·PP·EP — 통신 위치를 바꿔 비교한다",
    body: "TP는 layer 내부 collective, PP는 stage 경계 전달을 만든다. PP는 빈도를 줄일 수 있지만 bubble과 첫 토큰 지연을 만들고 EP를 자동 제거하지 않는다. 같은 workload의 TTFT·TPOT·p99로 고른다.",
  },
  {
    label: "C) 통신 정밀도 — activation 바이트를 줄인다",
    body: "BF16 activation을 FP8로 보내면 원소당 바이트는 이론상 절반이다. Weight-only INT4는 EP activation payload를 자동으로 줄이지 않으므로 두 정밀도를 분리한다.",
  },
  {
    label: "D) Batching — 통신을 연산 뒤에 숨긴다",
    body: "Batch가 커지면 연산과 all-to-all payload가 함께 늘어난다. 큰 메시지 효율과 overlap이 좋아질 수 있지만 collective duration·TTFT·메모리를 다시 재야 한다.",
  },
  {
    label: "정리 — 상한은 그대로, 효과는 병목 크기에 비례",
    body: "네 기법 모두 PCIe raw bandwidth 상한 자체는 올리지 못한다. 원격 토큰·activation 바이트·대기 시간을 줄일 뿐이며 효과는 target workload의 trace로 확인한다.",
  },
];
