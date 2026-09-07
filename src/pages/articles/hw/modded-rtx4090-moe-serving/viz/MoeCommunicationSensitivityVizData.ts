/** MoeCommunicationSensitivityViz — 색상 + step 정의 */

export const C = {
  router: "#8b5cf6", // violet — Router (top-k 선택)
  token: "#fbbf24", // amber — 토큰
  expertActive: "#10b981", // emerald — 연산에 쓰이는(선택된) expert
  expertIdle: "#64748b", // slate — 선택 안 됐지만 메모리엔 상주하는 expert
  gpuBorder: "#f59e0b", // amber — GPU 경계선
  tp: "#3b82f6", // blue — tensor parallel all-reduce
  ep: "#f43f5e", // rose — expert parallel all-to-all (일반)
  epHot: "#dc2626", // red — 라우팅이 쏠린 목적지
  nvswitch: "#10b981", // emerald — NVSwitch(균일 fabric)
  pcie: "#ef4444", // red — PCIe 병목
};

export const STEPS = [
  {
    label: "라우팅 — 연산은 sparse, 메모리는 dense",
    body: "토큰마다 top-k expert만 계산에 쓰인다. 하지만 어느 expert가 선택될지 모르므로\n전체 expert weight가 항상 메모리에 상주해야 한다 — 연산은 sparse, 메모리는 dense.",
  },
  {
    label: "TP의 all-reduce — 대칭·고정",
    body: "Tensor parallel은 attention 뒤·MLP 뒤로 layer마다 all-reduce 2번.\n모든 GPU가 같은 크기의 partial sum을 대칭으로 주고받고, 통신량은 라우팅과 무관하게 고정이다.",
  },
  {
    label: "EP dispatch — 비대칭 all-to-all",
    body: "라우팅 결과에 따라 토큰이 목적지 GPU로 흩뿌려진다.\n특정 expert로 쏠리면(load imbalance) 그 GPU로 가는 링크만 유독 굵어진다.",
  },
  {
    label: "EP combine — 같은 불균형이 되돌아옴",
    body: "Expert 연산 결과를 원래 토큰 위치로 되돌리는 반대 방향 all-to-all.\ndispatch가 만든 불균형 패턴을 combine도 그대로 물려받는다.",
  },
  {
    label: "TP vs EP — 고정 비율 vs 가변 비율",
    body: "TP는 GPU 수가 늘어도 layer당 통신량이 평평한 선으로 남는다.\nEP는 GPU 개수·expert 개수·top-k·batch 구성이 얽혀 라우팅 쏠림에 따라 들쭉날쭉하다.",
  },
  {
    label: "PCIe 전용 구성에서 드러나는 병목",
    body: "NVSwitch처럼 모든 GPU 쌍이 같은 대역폭인 fabric에서는 이 비대칭성이 잘 안 보인다.\nPCIe만 있는 4090 다중 구성에서는 라우팅이 조금만 쏠려도 특정 링크가 포화된다.",
  },
];
