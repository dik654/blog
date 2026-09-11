import type { Article } from "../types";

export const saasEdgeArticles: Article[] = [
  {
    slug: "edge-request-defense-pipeline",
    title: "요청 하나가 오리진까지 여러 관문을 지납니다",
    subcategory: "saas-edge",
    sections: [
      { id: "overview", title: "막는 위치가 앞일수록 비용이 싸집니다" },
      {
        id: "packet-layer",
        title: "커널에 올리기 전에 버리는 층이 가장 쌉니다",
        subsections: [{ id: "fingerprint-rule", title: "표본에서 지문을 만들어 규칙으로 내립니다" }],
      },
      { id: "request-layer", title: "요청 층은 정확한 대신 한 건당 비쌉니다" },
      {
        id: "client-signals",
        title: "연결을 맺는 방식만으로도 정체가 드러납니다",
        subsections: [{ id: "score-and-action", title: "점수로 모으고 임계로 행동을 정합니다" }],
      },
      { id: "origin-protection", title: "앞단을 세워도 뒷문이 열려 있으면 소용없습니다" },
      { id: "tradeoff-gate", title: "막는 강도는 경로마다 다르게 잡습니다" },
    ],
    component: () => import("@/pages/articles/saas/edge-request-defense-pipeline"),
  },
];
