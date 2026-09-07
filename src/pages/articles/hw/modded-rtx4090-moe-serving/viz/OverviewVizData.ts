/** OverviewViz — 색상 + step 정의
 * 본문 대응: Overview.tsx — "용량은 늘었는데 링크는 그대로다" 전체 흐름 요약
 */

export const C = {
  capacity: "#f59e0b", // VRAM 용량 (앰버)
  bandwidth: "#6366f1", // GPU 간 링크/대역폭 (인디고)
  solved: "#10b981", // 해결된 문제 (에메랄드)
  alert: "#ef4444", // 병목/경고 (레드)
  moe: "#8b5cf6", // MoE 라우팅 (바이올렛)
  neutral: "#64748b", // 중립 (슬레이트)
};

export const STEPS = [
  {
    label: "개조 카드: 24GB → 48GB",
    body: "중국 개조 업체가 GDDR6X 칩을 2GB 밀도로 교체하고 vBIOS를 다시 구워 용량을 두 배로 늘린다.\n워크스테이션·데이터센터 카드보다 훨씬 싸다.",
  },
  {
    label: "두 장 붙여 MoE 서빙 — 용량 문제는 풀린다",
    body: "48GB짜리 두 장이면 큰 MoE weight도 상주시킬 여지가 커진다.\n여기까지는 개조가 정확히 겨냥한 문제다.",
  },
  {
    label: "그런데 GPU 사이 링크는 그대로다",
    body: "RTX 4090은 Ada Lovelace 세대부터 NVLink 핀 자체가 없다.\n개조는 메모리 칩만 바꿀 뿐 카드 사이 통신 경로(PCIe)는 손대지 못한다.",
  },
  {
    label: "MoE는 dense보다 통신에 더 예민하다",
    body: "Top-k 라우팅으로 토큰을 여러 expert에 흩뿌리고 다시 모으는 all-to-all이 매 MoE layer마다 발생한다.\n이 통신은 GPU 간 링크를 그대로 거친다.",
  },
  {
    label: "용량은 늘었는데 가장 좁은 통로가 남는다",
    body: "용량 축은 개조로 위로 올라가지만 대역폭 축은 평평하게 그대로다.\n넉넉해진 용량을 나눠 쓸 통로가 가장 좁은 조합이 만들어진다.",
  },
];
