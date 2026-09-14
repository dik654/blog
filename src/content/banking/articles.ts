import type { Article } from "../types";

export const bankingArticles: Article[] = [
  {
    slug: "bank-balance-sheet-and-deposit-creation",
    title: "은행은 맡아 둔 돈을 빌려주는 것이 아니라 대출로 예금을 만듭니다",
    subcategory: "banking-deposit",
    sections: [
      {
        id: "overview",
        title: "은행에 관한 거의 모든 질문이 장부 한 장에서 갈립니다",
      },
      {
        id: "balance-sheet",
        title: "부품 1. 장부의 왼쪽은 받을 것, 오른쪽은 갚을 것입니다",
      },
      {
        id: "deposit-creation",
        title: "부품 2. 대출 한 건은 장부의 양쪽을 동시에 늘립니다",
        subsections: [
          { id: "intermediary-myth", title: "중개자 그림은 장부의 어느 줄에서 어긋나는가" },
        ],
      },
      {
        id: "limits",
        title: "부품 3. 만들 수 있다는 것이 무한정 만든다는 뜻은 아닙니다",
        subsections: [
          { id: "money-multiplier", title: "교과서의 통화승수는 상한이지 작동 방식이 아닙니다" },
        ],
      },
      {
        id: "maturity-transformation",
        title: "부품 4. 짧은 빚으로 긴 자산을 떠받치는 구조가 남습니다",
      },
      {
        id: "bank-run",
        title: "부품 5. 그래서 인출은 스스로를 실현시키는 예언이 됩니다",
        subsections: [
          { id: "safety-net", title: "두 안전장치는 서로 다른 실패를 막습니다" },
        ],
      },
      {
        id: "boundary",
        title: "장부를 다 읽었으니 남는 질문은 그 장부 밖에 있습니다",
      },
    ],
    component: () =>
      import("@/pages/articles/banking/bank-balance-sheet-and-deposit-creation"),
  },
  {
    slug: "central-bank-and-policy-transmission",
    title: "중앙은행은 돈을 찍는 곳이 아니라 하나의 가격을 고정하는 곳입니다",
    subcategory: "banking-policy",
    sections: [
      {
        id: "overview",
        title: "한 점의 가격을 못 박아 두면 나머지 금리가 그 점에 매달립니다",
      },
      {
        id: "cb-balance-sheet",
        title: "부품 1. 중앙은행의 부채가 곧 은행들이 쓰는 결제 수단입니다",
      },
      {
        id: "rate-setting",
        title: "부품 2. 목표는 금리이고 수단은 준비금 시장의 수급과 이자입니다",
        subsections: [
          { id: "operation-procedure", title: "공표한 금리를 실제 시장금리로 만드는 하루" },
        ],
      },
      {
        id: "transmission",
        title: "부품 3. 한 점이 곡선 전체를 끌고 가는 것은 기대 때문입니다",
        subsections: [
          { id: "transmission-lag", title: "같은 인상도 경로마다 도착 시각이 다릅니다" },
        ],
      },
      {
        id: "balance-sheet-policy",
        title: "부품 4. 점을 더 내릴 수 없으면 장부의 크기로 넘어갑니다",
      },
      {
        id: "boundary",
        title: "가격은 정해졌고, 이제 그 가격으로 오간 돈이 실제로 옮겨져야 합니다",
      },
    ],
    component: () =>
      import("@/pages/articles/banking/central-bank-and-policy-transmission"),
  },
];
