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
  {
    slug: "state-and-legitimacy",
    title: "강제력을 한 곳에 몰아주고 정당성으로 묶습니다",
    subcategory: "polity-state",
    sections: [
      {
        id: "overview",
        title: "같은 힘이 보호도 하고 약탈도 하며, 그 차이를 정당성이 만듭니다",
      },
      {
        id: "why-monopoly",
        title: "부품 1. 강제력이 여럿이면 마지막에 누가 맞는지 정할 수 없습니다",
      },
      {
        id: "protection-or-predation",
        title: "부품 2. 몰린 힘은 지켜 주기도 하고 빼앗기도 합니다",
      },
      {
        id: "legitimacy",
        title: "부품 3. 순응이 흔할수록 통치에 드는 힘이 줄어듭니다",
      },
      {
        id: "state-capacity",
        title: "부품 4. 받아들여지는 것과 실제로 할 수 있는 것은 다릅니다",
      },
      {
        id: "boundary",
        title: "작동한다는 것이 옳다는 뜻은 아니며, 그 구분이 다음 글을 만듭니다",
      },
    ],
    component: () => import("@/pages/articles/polity/state-and-legitimacy"),
  },
];
