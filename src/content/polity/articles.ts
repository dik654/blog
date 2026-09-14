import type { Article } from "../types";

export const polityArticles: Article[] = [
  {
    slug: "collective-choice-problem",
    title: "각자 고르면 되는 일과 하나로 정해야 하는 일은 다릅니다",
    subcategory: "polity-collective",
    sections: [
      {
        id: "overview",
        title: "정치는 한 사회에 하나만 있을 수 있는 결정을 다루는 일입니다",
      },
      {
        id: "two-kinds-of-choice",
        title: "부품 1. 남을 빼놓을 수 있느냐가 두 종류를 가릅니다",
      },
      {
        id: "free-riding",
        title: "부품 2. 각자 합리적으로 판단하면 아무도 내지 않습니다",
      },
      {
        id: "self-governance",
        title: "부품 3. 조건이 맞으면 강제 없이도 유지되는 경우가 있습니다",
        subsections: [
          { id: "scale-limit", title: "그런데 이 조건들은 규모가 커지면 대부분 깨집니다" },
        ],
      },
      {
        id: "coercion",
        title: "부품 4. 강제는 문제를 푸는 동시에 새 문제를 만듭니다",
      },
      {
        id: "boundary",
        title: "시장이 못 한다는 것이 정부가 잘한다는 뜻은 아닙니다",
      },
    ],
    component: () => import("@/pages/articles/polity/collective-choice-problem"),
  },
];
