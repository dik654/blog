import type { Article } from "../types";

export const recordNumbersArticles: Article[] = [
  {
    slug: "how-the-army-was-counted",
    title: "170만이라는 수가 어떤 절차로 나왔는지 적혀 있습니다",
    subcategory: "counting",
    sections: [
      {
        id: "overview",
        title: "보병이 170만이라고 적은 다음 줄에 세는 방법이 적혀 있습니다",
      },
      {
        id: "two-numbers",
        title: "부품 1. 한 문장에 적을 수 없는 수와 적을 수 있는 수가 함께 있습니다",
      },
      {
        id: "procedure",
        title: "부품 2. 절차는 눈금을 만드는 일과 채우는 일로 나뉩니다",
      },
      {
        id: "what-was-counted",
        title: "부품 3. 세어진 것은 사람이 아니라 채움의 횟수입니다",
      },
      {
        id: "where-it-slips",
        title: "부품 4. 어긋날 자리가 셋 있고 모두 눈금 안에 묻힙니다",
      },
      {
        id: "handoff",
        title: "다음은 세기 위한 숫자가 아닌 숫자입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/record-numbers/how-the-army-was-counted"),
  },
];
