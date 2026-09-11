import type { Article } from "../types";

export const saasDeliveryArticles: Article[] = [
  {
    slug: "anycast-delivery-continuity",
    title: "무중단은 고장이 없는 상태가 아니라 고장이 짧은 상태입니다",
    subcategory: "saas-delivery",
    sections: [
      { id: "overview", title: "무중단은 고장이 없는 상태가 아니라 고장이 짧은 상태입니다" },
      {
        id: "anycast-routing",
        title: "같은 주소를 여러 곳에서 광고하면 경로 자체가 장애 조치가 됩니다",
        subsections: [{ id: "catchment-flip", title: "경로가 흔들리면 연결이 끊깁니다" }],
      },
      {
        id: "site-balancing",
        title: "지점 안에서는 해시가 서버를 정합니다",
        subsections: [{ id: "connection-affinity", title: "옮겨 간 연결을 원래 서버로 되돌려 보냅니다" }],
      },
      { id: "health-and-drain", title: "무엇을 고장으로 볼지가 장애 조치의 절반입니다" },
      { id: "correlated-change", title: "중복 구성이 막지 못하는 고장은 모두에게 동시에 옵니다" },
      { id: "continuity-gate", title: "무중단을 주장하려면 옮기는 시간을 셀 수 있어야 합니다" },
    ],
    component: () => import("@/pages/articles/saas/anycast-delivery-continuity"),
  },
];
