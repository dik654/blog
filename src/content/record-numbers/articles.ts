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
        title: "부품 4. 표기 단위는 1만이지만 총오차는 더 클 수 있습니다",
      },
      {
        id: "handoff",
        title: "다음은 세기 위한 숫자가 아닌 숫자입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/record-numbers/how-the-army-was-counted"),
  },
  {
    slug: "what-the-total-cannot-tell",
    title: "총계는 센 수가 아니라 계산한 수입니다",
    subcategory: "counting",
    sections: [
      {
        id: "overview",
        title: "528만 3220이라는 수와 그 수를 만든 계산이 함께 적혀 있습니다",
      },
      {
        id: "ingredients",
        title: "부품 1. 총계는 여섯 개의 비율과 어림을 쌓아 만들어졌습니다",
      },
      {
        id: "tags",
        title: "부품 2. 재료마다 어떤 종류의 수인지가 적혀 있습니다",
      },
      {
        id: "last-digits",
        title: "부품 3. 끝자리는 여러 재료와 자리올림이 함께 만듭니다",
      },
      {
        id: "the-check",
        title: "부품 4. 셀 수 없다고 적은 자리가 있고, 해 둔 검산은 맞지 않습니다",
      },
      {
        id: "handoff",
        title: "다음은 세기 위한 숫자가 아닌 숫자입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/record-numbers/what-the-total-cannot-tell"),
  },
  {
    slug: "numbers-that-command",
    title: "재기 위한 숫자가 아니라 시키기 위한 숫자",
    subcategory: "what-numbers-do",
    sections: [
      {
        id: "overview",
        title: "이 숫자들은 무엇을 센 결과가 아닙니다",
      },
      {
        id: "rungs",
        title: "부품 1. 한 사다리 안에서 답의 종류가 바뀝니다",
      },
      {
        id: "same-ladder",
        title: "부품 2. 같은 10 · 5 · 2가 배상에도 사례금에도 쓰입니다",
      },
      {
        id: "four-kinds",
        title: "부품 3. 네 종류는 서로 다른 기준을 씁니다",
      },
      {
        id: "reading-prices",
        title: "부품 4. 정해진 값은 치러진 값이 아닙니다",
      },
      {
        id: "handoff",
        title: "다음은 남은 것과 사라진 것입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/record-numbers/numbers-that-command"),
  },
];
