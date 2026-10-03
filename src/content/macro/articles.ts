import type { Article } from "../types";

export const macroArticles: Article[] = [
  {
    slug: "aggregation-and-composition",
    title: "한 사람에게 맞는 답이 모두에게 맞지는 않습니다",
    subcategory: "macro-aggregate",
    sections: [
      {
        id: "overview",
        title: "앞의 여덟 편은 전부 한 사람의 자리에서 본 것입니다",
      },
      {
        id: "spending-is-income",
        title: "부품 1. 한 사람의 지출이 다른 사람의 소득입니다",
      },
      {
        id: "thrift",
        title: "부품 2. 그래서 다 같이 아끼면 아껴지지 않습니다",
      },
      {
        id: "multiplier",
        title: "부품 3. 한 번의 지출이 몇 바퀴를 돌지는 도는 비율이 정합니다",
      },
      {
        id: "aggregates-hide",
        title: "부품 4. 합친 숫자는 그 숫자를 정한 것을 지웁니다",
      },
      {
        id: "boundary",
        title: "이 글의 계산은 값과 이자율을 세워 둔 채로 한 것입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/macro/aggregation-and-composition"),
  },
  {
    slug: "why-per-head-stalls",
    title: "총량이 늘어도 한 사람 몫은 제자리일 수 있습니다",
    subcategory: "macro-numbers",
    sections: [
      {
        id: "overview",
        title: "100년 뒤에 7,700만 명의 몫이 비어 있다는 셈이 있었습니다",
      },
      {
        id: "two-ratios",
        title: "부품 1. 한쪽은 곱으로 늘고 다른 쪽은 더하기로 늡니다",
      },
      {
        id: "per-head",
        title: "부품 2. 두 줄을 나누면 한 사람 몫이 나옵니다",
      },
      {
        id: "the-check",
        title: "부품 3. 줄어든 몫이 사람 수를 도로 눌러 제자리로 되돌립니다",
      },
      {
        id: "what-broke",
        title: "부품 4. 예측은 빗나갔고, 어느 가정이 깨졌는지 짚을 수 있습니다",
      },
      {
        id: "what-it-leaves",
        title: "부품 5. 남는 질문은 무엇이 한 사람 몫을 올리는가입니다",
      },
      {
        id: "handoff",
        title: "더한 숫자를 읽는 규칙이 세 개 더 남았습니다",
      },
    ],
    component: () => import("@/pages/articles/macro/why-per-head-stalls"),
  },
  {
    slug: "what-the-price-level-hides",
    title: "값이 올랐다는 말은 네 자리 중 어디가 움직였는지를 말하지 않습니다",
    subcategory: "macro-numbers",
    sections: [
      {
        id: "overview",
        title: "빵과 석탄과 옷감으로 1억 달러어치가 오갔습니다",
      },
      {
        id: "two-sides",
        title: "부품 1. 거래 하나가 같은 값이므로 한 해를 다 더해도 같습니다",
      },
      {
        id: "velocity",
        title: "부품 2. 같은 돈이 여러 번 쓰이므로 가진 돈만으로는 모자랍니다",
      },
      {
        id: "four-knobs",
        title: "부품 3. 셋이 정해지면 나머지 하나가 따라옵니다",
      },
      {
        id: "not-a-cause",
        title: "부품 4. 이 식은 무엇이 무엇을 움직였는지 말하지 않습니다",
      },
      {
        id: "what-to-ask",
        title: "부품 5. 쓸모는 답이 아니라 물어야 할 목록에 있습니다",
      },
      {
        id: "handoff",
        title: "다음은 사람을 세는 자리입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/macro/what-the-price-level-hides"),
  },
];
