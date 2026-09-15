import type { Article } from "../types";

export const legalSystemArticles: Article[] = [
  {
    slug: "what-makes-law-law",
    title: "무엇이 이 문장을 법으로 만듭니까",
    subcategory: "ls-validity",
    sections: [
      {
        id: "overview",
        title: "정해진 문장과 내 사건의 판단 사이에는 아직 거리가 있습니다",
      },
      {
        id: "command-vs-law",
        title: "부품 1. 총을 든 요구와 고지서는 어디서 갈라집니까",
      },
      {
        id: "validity-chain",
        title: "부품 2. 효력은 위에서 오고, 사슬은 규범이 아닌 곳에서 멈춥니다",
      },
      {
        id: "form-conditions",
        title: "부품 3. 효력이 있다고 해서 사람을 이끌 수 있는 것은 아닙니다",
      },
      {
        id: "why-form-matters",
        title: "부품 4. 이 조건들이 요구되는 이유는 도덕이 아니라 기능입니다",
      },
      {
        id: "boundary",
        title: "여기까지는 어떤 문장이 법인지까지입니다",
      },
    ],
    component: () => import("@/pages/articles/legal-system/what-makes-law-law"),
  },
  {
    slug: "rules-standards-and-interpretation",
    title: "미리 적어 둘 것인가 그때 판단할 것인가",
    subcategory: "ls-interpretation",
    sections: [
      {
        id: "overview",
        title: "같은 내용을 언제 정하느냐가 제도를 가릅니다",
      },
      {
        id: "two-timings",
        title: "부품 1. 차이는 내용이 아니라 시점입니다",
      },
      {
        id: "cost-comparison",
        title: "부품 2. 어느 쪽이 싼지는 사안이 몇 건이냐가 정합니다",
      },
      {
        id: "interpretation",
        title: "부품 3. 어느 쪽을 택해도 해석은 남습니다",
      },
      {
        id: "gaps-and-analogy",
        title: "부품 4. 적혀 있지 않은 사안에서 두 방향이 갈립니다",
      },
      {
        id: "boundary",
        title: "한 번 메운 회색은 그 사건에서 끝나지 않습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/legal-system/rules-standards-and-interpretation"),
  },
];
