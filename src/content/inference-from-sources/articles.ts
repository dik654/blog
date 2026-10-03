import type { Article } from "../types";

export const inferenceFromSourcesArticles: Article[] = [
  {
    slug: "ruins-mislead",
    title: "폐허는 두 방향으로 잘못 말합니다",
    subcategory: "what-survived",
    sections: [
      {
        id: "overview",
        title: "두 도시가 같은 폐허가 되면 뒷사람은 반대 방향으로 틀립니다",
      },
      {
        id: "two-cities",
        title: "부품 1. 힘은 생김새를 따르지 않습니다",
      },
      {
        id: "what-remains",
        title: "부품 2. 남는 것이 종류를 가려서 남습니다",
      },
      {
        id: "the-rule",
        title: "부품 3. 겉모습을 보되 힘을 따로 따지라는 규칙입니다",
      },
      {
        id: "using-the-rule",
        title: "부품 4. 같은 규칙으로 전해지는 수를 내려 잡습니다",
      },
      {
        id: "handoff",
        title: "다음은 사라짐이 우연이 아닌 경우입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/inference-from-sources/ruins-mislead"),
  },
  {
    slug: "the-gap-was-made",
    title: "조항 번호가 65에서 100으로 건너뜁니다",
    subcategory: "what-survived",
    sections: [
      { id: "overview", title: "65조 다음이 100조입니다" },
      {
        id: "how-it-vanished",
        title: "부품 1. 깨진 것이 아니라 긁어내고 다시 다듬은 것입니다",
      },
      {
        id: "the-numbering",
        title: "부품 2. 조항 번호 안에 추정값이 들어 있습니다",
      },
      {
        id: "what-was-lost",
        title: "부품 3. 사라진 것의 주제는 알고 내용은 모릅니다",
      },
      {
        id: "copies",
        title: "부품 4. 돌아온 세 조항에는 다른 표시가 붙어 있습니다",
      },
      { id: "handoff", title: "다음은 우리가 붙인 이름입니다" },
    ],
    component: () =>
      import("@/pages/articles/inference-from-sources/the-gap-was-made"),
  },
  {
    slug: "naming-the-past",
    title: "우리가 법전이라 부르는 것이 스스로를 부르는 이름",
    subcategory: "reading-back",
    sections: [
      { id: "overview", title: "돌은 자기를 법전이라고 부르지 않습니다" },
      {
        id: "four-names",
        title: "부품 1. 한 대상이 네 이름으로 불렸습니다",
      },
      {
        id: "what-the-name-adds",
        title: "부품 2. 법전이라는 이름에서 떠올릴 네 기대를 점검합니다",
      },
      {
        id: "imposed-structure",
        title: "부품 3. 장과 조항 번호도 뒷사람이 붙인 것입니다",
      },
      {
        id: "translated-words",
        title: "부품 4. 번역어가 조용히 같은 일을 합니다",
      },
      { id: "handoff", title: "세 분류가 물은 것" },
    ],
    component: () =>
      import("@/pages/articles/inference-from-sources/naming-the-past"),
  },
];
