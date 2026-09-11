import type { Article } from "../types";

export const saasAccessArticles: Article[] = [
  {
    slug: "private-access-inbound-closure",
    title: "안쪽 자원을 열지 않고 닿게 하는 방법은 방향을 뒤집는 것입니다",
    subcategory: "saas-access",
    sections: [
      { id: "overview", title: "안쪽 자원을 열지 않고 닿게 하는 방법은 방향을 뒤집는 것입니다" },
      {
        id: "reach-scope",
        title: "네트워크를 주는 것과 자원을 주는 것은 다른 결정입니다",
        subsections: [{ id: "lateral-reach", title: "내부를 신뢰하면 한 번의 통과가 전부를 엽니다" }],
      },
      { id: "outbound-connector", title: "안쪽이 먼저 나가면 밖에서 두드릴 문이 없습니다" },
      { id: "private-endpoint", title: "받는 쪽 주소를 소비자 네트워크 안에 만들어 둡니다" },
      {
        id: "per-request-decision",
        title: "어디서 왔는지가 아니라 누가 무엇으로 요청했는지를 봅니다",
        subsections: [{ id: "credential-lifetime", title: "수명이 짧아야 철회가 실제로 작동합니다" }],
      },
      { id: "access-gate", title: "받는 포트가 없다는 것만으로는 충분하지 않습니다" },
    ],
    component: () => import("@/pages/articles/saas/private-access-inbound-closure"),
  },
];
