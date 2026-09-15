import type { Article } from "../types";

export const privateLawArticles: Article[] = [
  {
    slug: "contract-and-enforceable-promise",
    title: "어떤 약속을 법이 지켜 줍니까",
    subcategory: "priv-contract",
    sections: [
      {
        id: "overview",
        title: "강제할 곳이 있을 때 약속은 어떻게 달라집니까",
      },
      {
        id: "which-promises",
        title: "부품 1. 모든 약속을 지켜 주지는 않습니다",
      },
      {
        id: "remedy-choice",
        title: "부품 2. 시키는 것과 물리는 것은 다릅니다",
      },
      {
        id: "damages",
        title: "부품 3. 얼마를 물리느냐가 어길지 말지를 정합니다",
      },
      {
        id: "incomplete",
        title: "부품 4. 계약서는 미래를 다 적을 수 없습니다",
      },
      {
        id: "boundary",
        title: "이 힘은 두 사람 사이에만 미칩니다",
      },
    ],
    component: () =>
      import("@/pages/articles/private-law/contract-and-enforceable-promise"),
  },
  {
    slug: "property-and-entitlement",
    title: "소유는 무엇을 주고 무엇을 요구합니까",
    subcategory: "priv-property",
    sections: [
      {
        id: "overview",
        title: "어떤 권리는 약속하지 않은 사람에게도 미칩니다",
      },
      {
        id: "publicity",
        title: "부품 1. 모두에게 지키라고 하려면 모두가 알 수 있어야 합니다",
      },
      {
        id: "bundle",
        title: "부품 2. 소유는 하나가 아니라 여러 권능의 묶음입니다",
      },
      {
        id: "two-protections",
        title: "부품 3. 지키는 방식이 둘이고, 고르는 기준이 있습니다",
      },
      {
        id: "forced-transfer",
        title: "부품 4. 동의 없이 옮기는 제도들이 같은 자리에 놓입니다",
      },
      {
        id: "boundary",
        title: "누구의 것인지를 정해도 사고는 남습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/private-law/property-and-entitlement"),
  },
];
