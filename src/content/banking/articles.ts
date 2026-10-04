import type { Article } from "../types";

export const bankingArticles: Article[] = [
  {
    slug: "bank-balance-sheet-and-deposit-creation",
    title: "은행 장부: 대출·송금·상환이 돈과 위험을 바꾸는 과정",
    subcategory: "banking-deposit",
    sections: [
  {
    "id": "overview",
    "title": "1. 통장 숫자를 바꾸면 누가 누구에게 갚아야 할까요?"
  },
  {
    "id": "why-care",
    "title": "2. 오늘 지급할 돈과 나중에 받을 돈은 쓸 수 있는 때가 다릅니다"
  },
  {
    "id": "small-case",
    "title": "3. 20과 80을 가진 A은행에서 10을 빌립니다"
  },
  {
    "id": "picture",
    "title": "4. 같은 네 칸을 넘기며 어느 숫자가 움직이는지 봅니다"
  },
  {
    "id": "why-two-records",
    "title": "5. 새 통장 잔액의 반대편에는 새 약속이 있습니다"
  },
  {
    "id": "balance-sheet",
    "title": "6. 네 칸의 이름은 준비금·대출·예금·자본입니다"
  },
  {
    "id": "deposit-creation",
    "title": "7. 대출 10을 기록하면 예금도 10 늘어납니다"
  },
  {
    "id": "transfer-repayment",
    "title": "8. 송금은 은행을 바꾸고 원금 상환은 두 기록을 줄입니다"
  },
  {
    "id": "intermediary-myth",
    "title": "9. 영란은행 원문의 두 그림을 같은 사례에 적용합니다"
  },
  {
    "id": "journal",
    "title": "10. 실제 회계의 차변·대변으로 다시 적어도 같은 결과입니다"
  },
  {
    "id": "loss-interest",
    "title": "11. 못 받은 원금과 갚은 원금은 다른 칸을 줄입니다"
  },
  {
    "id": "other-creation",
    "title": "12. 예금이 늘어나는 경로에는 자산 매입도 있습니다"
  },
  {
    "id": "limits",
    "title": "13. 은행은 오늘의 지급과 미래의 손실을 함께 감당해야 합니다"
  },
  {
    "id": "money-multiplier",
    "title": "14. 1을 준비율로 나눈 배수에는 강한 가정이 붙습니다"
  },
  {
    "id": "maturity-transformation",
    "title": "15. 100의 자산을 가진 은행에도 오늘 6이 부족할 수 있습니다"
  },
  {
    "id": "bank-run",
    "title": "16. 오늘의 6을 급매로 메우면 자본 4를 잃을 수 있습니다"
  },
  {
    "id": "safety-net",
    "title": "17. 보험은 손실 불안을 줄이고 유동성 대출은 지급 시점을 연결합니다"
  },
  {
    "id": "korea",
    "title": "18. 한국 예금보호는 계좌 개수보다 금융기관과 상품을 봅니다"
  },
  {
    "id": "boundaries",
    "title": "19. 장부가 맞는다는 사실과 경제의 결과는 구분합니다"
  },
  {
    "id": "predict",
    "title": "20. 한 조건을 바꾸고 장부를 먼저 예상해 보세요"
  }
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
  {
    slug: "payment-clearing-settlement",
    title: "송금은 통장 숫자가 바뀐 뒤에도 아직 끝나지 않았을 수 있습니다",
    subcategory: "banking-settlement",
    sections: [
      {
        id: "overview",
        title: "한 번의 송금이 서로 다른 세 층에서 따로 처리됩니다",
      },
      {
        id: "three-layers",
        title: "부품 1. 지시를 전달하는 일과 돈을 넘기는 일은 다른 일입니다",
      },
      {
        id: "rtgs-vs-dns",
        title: "부품 2. 모아서 정산할수록 자금은 덜 들고 위험은 더 쌓입니다",
        subsections: [
          { id: "hybrid-design", title: "그래서 실제 시스템은 두 극단 사이에 자리를 잡습니다" },
        ],
      },
      {
        id: "finality",
        title: "부품 3. 되돌릴 수 없다는 판정은 기술이 아니라 규칙이 만듭니다",
      },
      {
        id: "cross-currency",
        title: "부품 4. 통화가 다르면 결제가 둘로 갈라지고 그 틈이 위험이 됩니다",
      },
      {
        id: "boundary",
        title: "한국에서는 작은 지급들이 결국 한 곳에서 해소됩니다",
      },
    ],
    component: () => import("@/pages/articles/banking/payment-clearing-settlement"),
  },
  {
    slug: "repo-and-collateral-funding",
    title: "레포는 증권을 맡겨 짧은 돈을 구하고 만기마다 다시 연결한다",
    subcategory: "banking-funding",
    sections: [{"id": "overview", "title": "1. 오래 보유할 자산도 오늘 결제할 돈이 필요합니다"}, {"id": "black-box", "title": "2. 증권과 돈은 반대 방향으로 움직이고 만기에 되돌아갑니다"}, {"id": "case", "title": "3. 100억 원 자산에서 5%를 남기면 현금은 95억 원입니다"}, {"id": "picture", "title": "4. 현금액·증권가치·되살 값을 따로 기록합니다"}, {"id": "need", "title": "5. 증권을 팔기 전의 가격 변화와 만기 공백을 감당합니다"}, {"id": "names", "title": "6. 레포·역레포·헤어컷은 관점과 금액을 가리킵니다"}, {"id": "mechanism", "title": "7. 가격 하락과 공제율 상승을 동시에 계산합니다"}, {"id": "source", "title": "8. 원문 공제 정의에 100과 95를 대입합니다"}, {"id": "comparison", "title": "9. 중앙은행이 사는지 파는지에 따라 준비금 방향이 달라집니다"}, {"id": "limits", "title": "10. 담보가 있어도 만기 연장과 처분 가격은 보장되지 않습니다"}],
    component: () => import("@/pages/articles/banking/repo-and-collateral-funding"),
  },
];
