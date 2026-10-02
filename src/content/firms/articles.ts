import type { Article } from "../types";

export const firmsArticles: Article[] = [
  {
    slug: "why-firms-exist",
    title: "시장을 쓰는 데에도 값이 듭니다",
    subcategory: "firm-boundary",
    sections: [
      {
        id: "overview",
        title: "값이 조정한다고 했는데 공장 안에는 값이 없습니다",
      },
      {
        id: "cost-of-market",
        title: "부품 1. 값을 알아내는 일 자체가 공짜가 아닙니다",
      },
      {
        id: "one-contract",
        title: "부품 2. 조직은 여러 약속을 하나로 바꿉니다",
      },
      {
        id: "boundary",
        title: "부품 3. 경계는 두 값이 같아지는 자리에서 멈춥니다",
      },
      {
        id: "what-moves",
        title: "부품 4. 경계를 옮기는 것은 조직의 뜻이 아닙니다",
      },
      {
        id: "handoff",
        title: "경계 안에서는 값이 아니라 지시가 정합니다",
      },
    ],
    component: () => import("@/pages/articles/firms/why-firms-exist"),
  },
];
