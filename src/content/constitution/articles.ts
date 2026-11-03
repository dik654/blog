import type { Article } from "../types";

export const constitutionArticles: Article[] = [
  {
    slug: "constitutionalism-and-separation",
    title: "헌법은 종이인데 어떻게 힘을 묶습니까",
    subcategory: "const-limits",
    sections: [
      {
        id: "overview",
        title: "영장 없는 폐쇄 명령 E에서 시작합니다",
      },
      {
        id: "why-paper-binds",
        title: "부품 1. 헌법은 무엇이 위반인지를 모두에게 같은 신호로 알려 줍니다",
      },
      {
        id: "separation",
        title: "부품 2. 규칙·집행·최종 판정의 독점을 막습니다",
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
  {
    slug: "government-forms",
    title: "같은 권력분립에서 왜 다른\u00A0체계가 나옵니까",
    subcategory: "const-forms",
    sections: [
      {
        id: "overview",
        title: "같은 부품으로 조립했는데 전혀 다른 기계가 나옵니다",
      },
      {
        id: "two-axes",
        title: "부품 1. 먼저 정책 패배가 정부 퇴진으로 이어지는지 묻습니다",
      },
      {
        id: "presidential",
        title: "부품 2. 대통령제에서는 정책 패배와 대통령 생존이 분리됩니다",
        subsections: [
          {
            id: "deadlock-exit",
            title: "교착이 풀리지 않으면 무엇이 남는가",
          },
        ],
      },
      {
        id: "parliamentary",
        title: "부품 3. 의원내각제는 과반을 정책과 정부 생존에 연결합니다",
      },
      {
        id: "power-index",
        title: "부품 4. 의석 비율과 형식적 투표력은 같은 수가 아닙니다",
      },
      {
        id: "semi-presidential",
        title: "부품 5. 준대통령제에서는 대통령과 총리를 따로 추적합니다",
      },
      {
        id: "boundary",
        title: "형태는 무엇이 위험한지를 말할 뿐 결과를 말하지 않습니다",
      },
    ],
    component: () => import("@/pages/articles/constitution/government-forms"),
  },
];
