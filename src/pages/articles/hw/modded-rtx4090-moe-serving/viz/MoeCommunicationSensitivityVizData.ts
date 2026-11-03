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
    label: "TP의 all-reduce — 라우팅과 무관",
    body: "Tensor parallel collective는 router 선택과 무관하다.\n다만 실제 wire traffic은 TP degree와 collective 알고리즘에 따라 달라진다.",
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
    label: "TP vs EP — 서로 다른 변수가 payload를 정한다",
    body: "TP는 degree·알고리즘, EP는 토큰 수·top-k·배치·load balance의 영향을 받는다.\n구조만 보고 어느 쪽이 항상 더 많다고 단정할 수 없다.",
  },
  {
    label: "PCIe 전용 구성에서 드러나는 병목",
    body: "균일한 고대역폭 fabric은 쏠림의 영향을 줄일 수 있다.\n4090 다중 구성은 P2P 미지원과 host staging까지 포함해 특정 rank의 p95·p99가 나빠질 수 있다.",
  },
];
