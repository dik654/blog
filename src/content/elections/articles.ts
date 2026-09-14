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
        title: "부품 1. 규칙은 여럿이지만 결과를 정하는 것은 거의 하나입니다",
      },
      {
        id: "plurality",
        title: "부품 2. 다수제는 표를 버려서 다수를 만듭니다",
        subsections: [
          {
            id: "districting",
            title: "같은 표에 선거구 경계만 다시 그으면",
          },
        ],
      },
      {
        id: "proportional",
        title: "부품 3. 비례는 나누어 떨어지지 않는 것을 나눕니다",
      },
      {
        id: "disproportionality",
        title: "부품 4. 얼마나 비틀렸는지는 하나의 수로 잴 수 있습니다",
      },
      {
        id: "mixed",
        title: "부품 5. 섞으면 두 논리가 한 선거에 들어옵니다",
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
    title: "규칙을 아무리 잘 골라도 남는 문제가 있습니다",
    subcategory: "elect-aggregation",
    sections: [
      {
        id: "overview",
        title: "더 나은 규칙을 찾는 문제가 아닐 수도 있습니다",
      },
      {
        id: "cycle",
        title: "부품 1. 개인은 멀쩡한데 집단만 순서를 잃습니다",
      },
      {
        id: "agenda",
        title: "부품 2. 순환이 있으면 순서를 쥔 사람이 결과를 정합니다",
      },
      {
        id: "other-rules",
        title: "부품 3. 규칙을 바꾸면 대신 다른 것이 깨집니다",
      },
      {
        id: "arrow",
        title: "부품 4. 교체가 끝나지 않는 이유가 증명되어 있습니다",
      },
      {
        id: "median-voter",
        title: "부품 5. 그런데도 대개 굴러가는 이유는 규칙이 아니라 선호의 모양입니다",
      },
      {
        id: "boundary",
        title: "불가능하다는 말은 무의미하다는 말이 아닙니다",
      },
    ],
    component: () => import("@/pages/articles/elections/voting-paradoxes"),
  },
];
