import type { Article } from "../types";

export const criminalLawArticles: Article[] = [
  {
    slug: "crime-and-punishment-purpose",
    title: "왜 국가가 직접 벌합니까",
    subcategory: "crim-punishment",
    sections: [
      {
        id: "overview",
        title: "값을 주고받는 방식이 무너지는 자리가 있습니다",
      },
      {
        id: "four-reasons",
        title: "부품 1. 벌하는 이유가 넷이고 각각 다른 것을 요구합니다",
      },
      {
        id: "deterrence",
        title: "부품 2. 넷 가운데 하나는 계산할 수 있습니다",
      },
      {
        id: "why-severity-fails",
        title: "부품 3. 그래서 형량만 올리는 방식은 잘 듣지 않습니다",
        subsections: [
          {
            id: "marginal-deterrence",
            title: "모든 죄에 최고형을 매기면 안 되는 이유",
          },
        ],
      },
      {
        id: "legality",
        title: "부품 4. 이 계산은 미리 적혀 있을 때만 성립합니다",
      },
      {
        id: "boundary",
        title: "벌하기로 정해도 벌하기 전에 해야 할 일이 남습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/criminal-law/crime-and-punishment-purpose"),
  },
  {
    slug: "procedure-and-proof",
    title: "얼마나 확실해야 벌할 수 있습니까",
    subcategory: "crim-procedure",
    sections: [
      {
        id: "overview",
        title: "벌하기로 정해도 벌하기 전에 해야 할 일이 남습니다",
      },
      {
        id: "two-errors",
        title: "부품 1. 두 잘못은 같은 종류가 아닙니다",
      },
      {
        id: "threshold",
        title: "부품 2. 문턱의 위치는 두 무게의 비가 정합니다",
      },
      {
        id: "burden",
        title: "부품 3. 문턱을 정하면 누가 넘어야 하는지도 정해집니다",
      },
      {
        id: "how-evidence",
        title: "부품 4. 얼마나 확실한가와 어떻게 알아냈는가는 다른 질문입니다",
      },
      {
        id: "boundary",
        title: "이 모든 것은 재판이 열렸을 때의 이야기입니다",
      },
    ],
    component: () =>
      import("@/pages/articles/criminal-law/procedure-and-proof"),
  },
];
