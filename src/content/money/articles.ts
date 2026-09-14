import type { Article } from "../types";

export const moneyArticles: Article[] = [
  {
    slug: "money-as-a-claim",
    title: "돈은 물건이 아니라 남이 갚아야 할 약속입니다",
    subcategory: "money-function",
    sections: [
      { id: "overview", title: "지갑 속 돈은 물건이 아니라 누군가가 진 빚입니다" },
      {
        id: "exchange-problem",
        title: "물물교환은 두 사람의 필요가 동시에 맞아떨어질 때만 성립합니다",
      },
      {
        id: "three-functions",
        title: "교환을 매개하는 일과 값을 적는 일, 부를 쟁여 두는 일은 서로 다릅니다",
      },
      {
        id: "credit-money",
        title: "받아 주기만 하면 되므로, 매개는 물건 대신 약속이어도 됩니다",
      },
      {
        id: "money-aggregates",
        title: "돈이 얼마나 있는지 세려면 어디까지를 돈으로 볼지 먼저 정해야 합니다",
      },
      {
        id: "boundary",
        title: "결제에 쓰인다고 다 돈은 아니며, 그 경계가 다음 질문을 만듭니다",
      },
    ],
    component: () => import("@/pages/articles/money/money-as-a-claim"),
  },
];
