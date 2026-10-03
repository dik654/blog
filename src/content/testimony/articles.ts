import type { Article } from "../types";

export const testimonyArticles: Article[] = [
  {
    slug: "speeches-were-reconstructed",
    title: "연설문은 그가 지어 적은 것이라고 본인이 밝혔습니다",
    subcategory: "who-wrote",
    sections: [
      {
        id: "overview",
        title: "책에 실린 연설은 그가 지어 넣은 것입니다",
      },
      {
        id: "two-kinds",
        title: "부품 1. 한 책 안에 성격이 다른 두 가지가 들어 있습니다",
      },
      {
        id: "speeches",
        title: "부품 2. 연설은 기억으로 옮길 수 없어 다시 쓴 것입니다",
      },
      {
        id: "events",
        title: "부품 3. 사건은 자기 인상조차 믿지 않고 시험한 것입니다",
      },
      {
        id: "why-they-diverge",
        title: "부품 4. 목격자들이 갈리는 이유가 두 가지로 적혀 있습니다",
      },
      {
        id: "handoff",
        title: "다음은 믿지 않으면서 적는 경우입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/testimony/speeches-were-reconstructed"),
  },
  {
    slug: "told-but-not-believed",
    title: "믿지 않는 이야기도 적는다고 그는 규칙으로 적었습니다",
    subcategory: "two-accounts",
    sections: [
      {
        id: "overview",
        title: "아르고스가 왜 빠졌는지에 대한 답이 셋 적혀 있습니다",
      },
      {
        id: "three-accounts",
        title: "부품 1. 같은 일에 대한 세 설명이 책에 함께 있습니다",
      },
      {
        id: "tags",
        title: "부품 2. 셋을 가르는 것은 문장에 붙은 꼬리표입니다",
      },
      {
        id: "two-duties",
        title: "부품 3. 전할 의무와 믿을 의무를 따로 두었습니다",
      },
      {
        id: "scope",
        title: "부품 4. 그 규칙이 책 전체에 걸린다고 못 박아 두었습니다",
      },
      {
        id: "handoff",
        title: "다음은 적은 사람이 그 자리에 있었던 경우입니다",
      },
    ],
    component: () => import("@/pages/articles/testimony/told-but-not-believed"),
  },
  {
    slug: "the-writer-was-there",
    title: "한쪽에서 싸운 사람이 적은 기록을 읽는 법",
    subcategory: "two-accounts",
    sections: [
      {
        id: "overview",
        title: "적은 사람이 한쪽에서 싸운 당사자였습니다",
      },
      {
        id: "not-enough",
        title: "부품 1. 없던 사람도 있던 사람도 각각 다르게 실패합니다",
      },
      {
        id: "own-position",
        title: "부품 2. 자기가 어느 편에 있었는지를 글머리에 적습니다",
      },
      {
        id: "split",
        title: "부품 3. 사실과 애도를 나눠 읽으라고 독자에게 요청합니다",
      },
      {
        id: "hostile-witness",
        title: "부품 4. 자기 나라를 망친 책임을 적을 때 적장을 증인으로 세웁니다",
      },
      {
        id: "audience",
        title: "부품 5. 그 전쟁을 겪은 사람들을 독자로 두었습니다",
      },
      {
        id: "handoff",
        title: "다음은 사료에 적힌 숫자입니다",
      },
    ],
    component: () => import("@/pages/articles/testimony/the-writer-was-there"),
  },
];
