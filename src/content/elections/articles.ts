import type { Article } from "../types";

export const electionsArticles: Article[] = [
  {
    slug: "electoral-systems",
    title: "표를 의석으로 바꾸는 규칙이 결과를 정합니다",
    subcategory: "elect-systems",
    sections: [
      {
        id: "overview",
        title: "표는 그대로인데 의석만 바뀝니다",
      },
      {
        id: "district-magnitude",
        title: "한 선거구에서 몇 명을 뽑느냐가 왜 중요한가",
      },
      {
        id: "plurality",
        title: "1등만 뽑으면 어떤 표가 사라지는가",
        subsections: [
          {
            id: "districting",
            title: "같은 표에 선거구 경계만 다시 그으면",
          },
        ],
      },
      {
        id: "proportional",
        title: "의석은 쪼갤 수 없는데 어떻게 비례해 나누는가",
      },
      {
        id: "disproportionality",
        title: "득표율과 의석률은 얼마나 어긋났는가",
      },
      {
        id: "mixed",
        title: "두 방식을 섞으면 무엇이 달라지는가",
      },
      {
        id: "boundary",
        title: "제도는 무엇을 버릴지 정할 뿐 옳은 답을 정하지 않습니다",
      },
    ],
    component: () => import("@/pages/articles/elections/electoral-systems"),
  },
  {
    slug: "voting-paradoxes",
    title: "세 번 모두 2대 1인데 왜 마지막 답은 없을까요?",
    subcategory: "elect-aggregation",
    sections: [
      {
        id: "overview",
        title: "세 번 모두 2대 1인데 왜 마지막 답은 없을까요?",
      },
      {
        id: "cycle",
        title: "1. 개인의 순서는 집단으로 자동 복사되지 않습니다",
      },
      {
        id: "agenda",
        title: "2. 순환이 생기면 표결 순서가 승자를 고릅니다",
      },
      {
        id: "other-rules",
        title: "3. 규칙을 바꾸면 결함이 사라지는 대신 자리를 옮깁니다",
      },
      {
        id: "conditions",
        title: "4. 집계 규칙에 바라는 다섯 조건을 먼저 펼칩니다",
      },
      {
        id: "arrow",
        title: "5. 다섯 조건을 모두 지키는 규칙은 존재하지 않습니다",
      },
      {
        id: "median-voter",
        title: "6. 처음의 선호 한 줄을 고치면 가운데 안이 승자가 됩니다",
      },
      {
        id: "boundary",
        title: "7. 실제 판단에서는 규칙과 선호 구조를 함께 봐야 합니다",
      },
    ],
    component: () => import("@/pages/articles/elections/voting-paradoxes"),
  },
  {
    slug: "parties-and-interest-groups",
    title: "열두 후보가 세 정당이 되면 무엇이 쉬워지고 무엇이 사라질까요?",
    subcategory: "elect-parties",
    sections: [
      {
        id: "overview",
        title: "열두 후보가 세 정당이 되면 무엇이 쉬워지고 무엇이 사라질까요?",
      },
      {
        id: "why-parties",
        title: "1. 정당은 열두 후보를 세 묶음으로 압축합니다",
      },
      {
        id: "competition",
        title: "2. 한 축에서는 두 큰 정당이 가운데로 밀립니다",
      },
      {
        id: "who-organizes",
        title: "3. 빠진 면허 쟁점은 조직하기 쉬운 쪽을 통해 돌아옵니다",
      },
      {
        id: "rent-seeking",
        title: "4. 면허를 얻으려는 다툼은 이전과 별개의 비용을 만듭니다",
        subsections: [
          {
            id: "capture",
            title: "5. 규제기관이 듣는 정보도 조직된 쪽으로 기울 수 있습니다",
          },
        ],
      },
      {
        id: "boundary",
        title: "6. 압축 장치를 없애는 대신 빠진 요구의 재진입 통로를 봐야 합니다",
      },
    ],
    component: () =>
      import("@/pages/articles/elections/parties-and-interest-groups"),
  },
];
