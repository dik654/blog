import type { Article } from "../types";

export const moneyArticles: Article[] = [
  {
    slug: "money-as-a-claim",
    title: "돈은 물건이 아니라 남이 갚아야 할 약속입니다",
    subcategory: "money-function",
    sections: [
      {
        id: "overview",
        title: "금융은 약속이 층으로 겹친 그물이고, 돈은 그 맨 아래 한 칸입니다",
      },
      {
        id: "exchange-problem",
        title: "첫째 걸음: 물물교환은 두 사람의 필요가 맞물릴 때만 성립합니다",
        subsections: [
          { id: "price-count", title: "매개를 쓰면 발품만이 아니라 외울 것도 줄어듭니다" },
        ],
      },
      {
        id: "three-functions",
        title: "둘째 걸음: 하나로 보이던 일이 사실은 세 가지입니다",
        subsections: [
          { id: "functions-split", title: "셋이 서로 다른 대상에 맡겨지는 순간이 실제로 있습니다" },
        ],
      },
      {
        id: "credit-money",
        title: "셋째 걸음: 조건이 믿음뿐이라면 매개는 약속이어도 됩니다",
        subsections: [
          { id: "issuer-layers", title: "같은 원인데 발행자가 다르면 떠안는 위험도 다릅니다" },
        ],
      },
      {
        id: "money-aggregates",
        title: "그물의 크기를 재려면 어디까지를 돈으로 볼지 먼저 정해야 합니다",
        subsections: [
          {
            id: "aggregation-procedure",
            title: "무엇을 넣고 뺄지는 발행자와 보유자를 먼저 갈라야 정해집니다",
          },
        ],
      },
      {
        id: "boundary",
        title: "그물의 한 칸을 열었으니, 다음은 그 칸이 생기는 자리입니다",
      },
    ],
    component: () => import("@/pages/articles/money/money-as-a-claim"),
  },
  {
    slug: "time-value-and-discounting",
    title: "지금의 1만 원과 1년 뒤의 1만 원은 다른 값입니다",
    subcategory: "money-time",
    sections: [
      {
        id: "overview",
        title: "금융에서 값이 붙는 거의 모든 것이 같은 식 하나에서 나옵니다",
      },
      {
        id: "compounding",
        title: "부품 1. 한 기간을 건너는 배율은 더해지지 않고 곱해집니다",
      },
      {
        id: "discounting",
        title: "부품 2. 그 배율을 뒤집으면 미래를 오늘로 되돌리는 계수가 됩니다",
      },
      {
        id: "npv",
        title: "부품 3. 계수를 곱해 한 시점에 모으면 비로소 더할 수 있습니다",
        subsections: [
          { id: "annuity", title: "매기 금액이 같으면 합이 닫힌 형태로 줄어듭니다" },
        ],
      },
      {
        id: "irr",
        title: "부품 4. 합을 0으로 만드는 비율을 되물으면 수익률이 나옵니다",
        subsections: [
          {
            id: "irr-compare",
            title: "두 지표는 같은 식에서 나오지만 같은 질문에 답하지 않습니다",
          },
        ],
      },
      {
        id: "real-rate",
        title: "단위 점검. 금액이 늘어도 물가가 더 오르면 구매력은 줄어듭니다",
      },
      {
        id: "boundary",
        title: "조립을 마치면 빈칸이 하나 남습니다: r은 어디서 오는가",
      },
    ],
    component: () => import("@/pages/articles/money/time-value-and-discounting"),
  },
];
