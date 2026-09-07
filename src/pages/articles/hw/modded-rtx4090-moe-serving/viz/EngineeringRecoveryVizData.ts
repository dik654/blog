/** EngineeringRecovery Viz — 색상 상수 + step 정의
 * 본문 spec: PCIe raw bandwidth는 상수. 남은 레버는 두 갈래 —
 *   (byte) 바이트 수 자체를 줄인다: A) Expert 배치, C) Quantization
 *   (time) 옮기는 시간을 연산으로 가린다: B) TP→PP, D) Batching
 */

export const C = {
  pcie: "#64748b", // PCIe 상수 — 소프트웨어로 못 바꿈 (슬레이트)
  byte: "#f59e0b", // 바이트 수 줄이기 그룹 (앰버)
  time: "#06b6d4", // 시간 숨기기 그룹 (시안)
  expertA: "#f59e0b", // A) Expert 배치
  quantC: "#fb923c", // C) Quantization
  ppB: "#0891b2", // B) TP → PP
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
    label: "B) TP → PP — all-reduce 자체를 피한다",
    body: "TP는 layer마다 all-reduce 2번이 PCIe를 반드시 거친다. PP는 layer 구간을 GPU별로 나눠 구간 경계에서 activation 텐서 하나만 넘기면 되고, all-reduce 자체가 없다. 대신 마이크로배치가 작으면 파이프라인 버블이 생긴다.",
  },
  {
    label: "C) Quantization — 옮기는 바이트 수를 줄인다",
    body: "FP16/BF16 → FP8/INT4로 낮추면 같은 텐서 전송에 필요한 바이트 수가 절반~4분의 1로 준다. 통신 시간 = 바이트 수 ÷ bandwidth이므로 대역폭을 못 올리면 분자(바이트 수)를 줄이는 게 유일한 레버다.",
  },
  {
    label: "D) Batching — 통신을 연산 뒤에 숨긴다",
    body: "Batch가 클수록 GPU 하나가 한 스텝에 처리하는 연산량이 늘어 통신 대비 연산 비율이 커진다. Continuous batching으로 decode 요청을 묶으면 통신을 기다리는 idle 시간이 준다. 단, batch 확대는 activation 메모리와 트레이드오프된다.",
  },
  {
    label: "정리 — 상한은 그대로, 효과는 병목 크기에 비례",
    body: "네 기법 모두 PCIe raw bandwidth 상한 자체는 올리지 못한다. 통신량을 줄이거나(배치·quant) 통신을 숨길(PP·batching) 뿐이며, 효과는 언제나 원래 병목이 얼마나 심했는가에 비례한다.",
  },
];
