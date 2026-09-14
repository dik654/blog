import type { Article } from "../types";

export const governanceArticles: Article[] = [
  {
    slug: "bureaucracy-and-implementation",
    title: "결정된 것과 실제로 일어나는 것은 다릅니다",
    subcategory: "gov-bureaucracy",
    sections: [
      {
        id: "overview",
        title: "표결이 끝난 자리에서 다시 긴 사슬이 시작됩니다",
      },
      {
        id: "why-delegate",
        title: "부품 1. 맡기는 것은 고르는 일이 아니라 피할 수 없는 일입니다",
      },
      {
        id: "agency",
        title: "부품 2. 맡기는 순간 아는 것이 갈립니다",
      },
      {
        id: "rules-or-discretion",
        title: "부품 3. 규칙으로 묶으면 재량이 죽고 재량을 주면 통제가 죽습니다",
        subsections: [
          {
            id: "street-level",
            title: "마지막 창구에서 정책이 다시 쓰입니다",
          },
        ],
      },
      {
        id: "measurement",
        title: "부품 4. 무엇을 재는지가 무엇을 하는지를 정합니다",
      },
      {
        id: "control",
        title: "부품 5. 통제 장치들은 각각 다른 것을 값으로 치릅니다",
      },
      {
        id: "boundary",
        title: "집행 실패를 태도 문제로 읽으면 고칠 곳을 찾지 못합니다",
      },
    ],
    component: () =>
      import("@/pages/articles/governance/bureaucracy-and-implementation"),
  },
];
