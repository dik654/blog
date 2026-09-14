import type { Article } from "../types";

export const constitutionArticles: Article[] = [
  {
    slug: "constitutionalism-and-separation",
    title: "헌법은 종이인데도 힘을 묶습니다",
    subcategory: "const-limits",
    sections: [
      {
        id: "overview",
        title: "강제력을 쥔 쪽이 왜 자기를 묶는 문서를 지키는지가 먼저입니다",
      },
      {
        id: "why-paper-binds",
        title: "부품 1. 헌법은 무엇이 위반인지를 모두에게 같은 신호로 알려 줍니다",
      },
      {
        id: "separation",
        title: "부품 2. 규칙을 만드는 쪽과 집행하는 쪽과 판정하는 쪽을 가릅니다",
      },
      {
        id: "checks",
        title: "부품 3. 나누기만 하면 부족해서 서로 막을 수단을 줍니다",
        subsections: [
          {
            id: "judicial-review",
            title: "선출되지 않은 기관이 선출된 결정을 뒤집어도 되는가",
          },
        ],
      },
      {
        id: "entrenchment",
        title: "부품 4. 바꾸기 어렵게 만들면 지켜지지만 굳어 버립니다",
      },
      {
        id: "boundary",
        title: "조문이 같아도 같은 제약이 되지는 않습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/constitution/constitutionalism-and-separation"),
  },
];
