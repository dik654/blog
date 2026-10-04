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
    title: "중앙은행: 오늘의 거래 조건이 미래 금리와 지출에 닿는 과정",
    subcategory: "banking-policy",
    sections: [
  {
    "id": "overview",
    "title": "1. 오늘 6억 원이 부족한 은행은 누구에게 얼마를 내고 빌릴까요?"
  },
  {
    "id": "black-box",
    "title": "2. 거래 조건을 바꾸면 빌리는 비용과 앞으로의 선택이 달라집니다"
  },
  {
    "id": "small-case",
    "title": "3. 같은 6억 원에 세 가지 거래 조건을 놓습니다"
  },
  {
    "id": "picture",
    "title": "4. 다른 선택이 남아 있을 때 협상이 어떻게 달라지는지 봅니다"
  },
  {
    "id": "why",
    "title": "5. 오늘의 비용과 앞으로의 예상은 따로 움직일 수 있습니다"
  },
  {
    "id": "names",
    "title": "6. 이미 본 거래와 비용에 이름을 붙입니다"
  },
  {
    "id": "cb-balance-sheet",
    "title": "7. 중앙은행 대출과 은행 간 대출은 전체 장부에서 다릅니다"
  },
  {
    "id": "rate-setting",
    "title": "8. 목표·거래 조건·실제 시장금리를 나눠 읽습니다"
  },
  {
    "id": "source-operations",
    "title": "9. 실제 운영 문서에서 같은 6의 방향을 대조합니다"
  },
  {
    "id": "corridor-boundary",
    "title": "10. 접근할 수 없는 거래는 그 사람의 하한이 아닙니다"
  },
  {
    "id": "operation-procedure",
    "title": "11. 부족분을 메울 때와 넉넉한 상태를 유지할 때의 수단"
  },
  {
    "id": "transmission",
    "title": "12. 미래 경로를 바꾸면 오늘 인상해도 장기금리가 내릴 수 있습니다"
  },
  {
    "id": "no-arbitrage",
    "title": "13. 미래에 다시 빌릴 금리를 모르면 확정 수익 비교가 아닙니다"
  },
  {
    "id": "transmission-lag",
    "title": "14. 같은 공장의 이자·수주·설비 주문을 따라갑니다"
  },
  {
    "id": "balance-sheet-policy",
    "title": "15. 채권을 누구에게 사는지에 따라 예금의 직접 변화가 다릅니다"
  },
  {
    "id": "countries",
    "title": "16. 국가별로 정책을 전달하는 거래 조건이 다릅니다"
  },
  {
    "id": "limits",
    "title": "17. 결정문과 시장 반응을 읽을 때 남겨 둘 불확실성"
  },
  {
    "id": "review",
    "title": "18. 조건을 바꾼 뒤 금리와 장부를 먼저 예측해 봅니다"
  }
],
    component: () =>
      import("@/pages/articles/banking/central-bank-and-policy-transmission"),
  },
  {
    slug: "payment-clearing-settlement",
    title: "지급·청산·결제: 같은 여섯 거래를 끝내는 돈과 규칙",
    subcategory: "banking-settlement",
    sections: [
  {
    "id": "overview",
    "title": "1. 고객 화면이 바뀐 뒤 은행끼리는 무엇을 끝내야 할까요?"
  },
  {
    "id": "black-box",
    "title": "2. 보낼 지시를 받고 서로 대조한 뒤 의무를 이행합니다"
  },
  {
    "id": "case",
    "title": "3. 세 은행의 같은 지급 여섯 건을 적습니다"
  },
  {
    "id": "picture",
    "title": "4. 260의 지시에서 누가 최종적으로 10을 보내는지 봅니다"
  },
  {
    "id": "why",
    "title": "5. 받은 돈을 다시 쓸 수 있지만 기다리는 시간도 생깁니다"
  },
  {
    "id": "names",
    "title": "6. 이미 본 절차와 완료 상태에 이름을 붙입니다"
  },
  {
    "id": "three-layers",
    "title": "7. 지시 처리와 기관 간 의무 이행은 다른 기록입니다"
  },
  {
    "id": "netting-efficiency",
    "title": "8. 총액과 순액의 차이를 같은 여섯 건으로 계산합니다"
  },
  {
    "id": "source-finality",
    "title": "9. 원문의 최종 이전 조건을 A의 10에 적용합니다"
  },
  {
    "id": "rtgs-vs-dns",
    "title": "10. 총 지급량 260과 최초 필요한 돈 120·100은 다릅니다"
  },
  {
    "id": "hybrid-design",
    "title": "11. 대기 지시를 묶어 처리할 조건을 실제 계산으로 봅니다"
  },
  {
    "id": "exposure",
    "title": "12. 줄어든 지급량 250이 곧바로 위험액은 아닙니다"
  },
  {
    "id": "finality",
    "title": "13. 원이체의 최종 처리와 별도 반환 청구를 구분합니다"
  },
  {
    "id": "cross-currency",
    "title": "14. 두 통화의 교환에서는 먼저 보낸 원금이 노출됩니다"
  },
  {
    "id": "pvp",
    "title": "15. 한쪽 최종 이전을 다른 쪽 이전에 묶습니다"
  },
  {
    "id": "boundary",
    "title": "16. 한국의 차액 결제와 해외 즉시 결제를 비교합니다"
  },
  {
    "id": "limits",
    "title": "17. 화면·계정·법적 완료를 구분해 한 거래를 읽습니다"
  },
  {
    "id": "review",
    "title": "18. 순서와 부도 조건을 바꾸기 전에 결과를 예상해 봅니다"
  }
],
    component: () => import("@/pages/articles/banking/payment-clearing-settlement"),
  },
  {
    slug: "repo-and-collateral-funding",
    title: "레포는 증권을 맡겨 짧은 돈을 구하고 만기마다 다시 연결한다",
    subcategory: "banking-funding",
    sections: [
  {
    "id": "overview",
    "title": "1. 오래 보유할 자산도 오늘 결제할 돈이 필요합니다"
  },
  {
    "id": "black-box",
    "title": "2. 증권과 돈은 반대 방향으로 움직이고 만기에 되돌아갑니다"
  },
  {
    "id": "case",
    "title": "3. 100억 원 자산에서 5%를 남기면 현금은 95억 원입니다"
  },
  {
    "id": "picture",
    "title": "4. 현금액·증권가치·되살 값을 따로 기록합니다"
  },
  {
    "id": "need",
    "title": "5. 증권을 팔기 전의 가격 변화와 만기 공백을 감당합니다"
  },
  {
    "id": "names",
    "title": "6. 레포·역레포·헤어컷은 관점과 금액을 가리킵니다"
  },
  {
    "id": "mechanism",
    "title": "7. 가격 하락과 공제율 상승을 동시에 계산합니다"
  },
  {
    "id": "source",
    "title": "8. 원문 공제 정의에 100과 95를 대입합니다"
  },
  {
    "id": "comparison",
    "title": "9. 중앙은행이 사는지 파는지에 따라 준비금 방향이 달라집니다"
  },
  {
    "id": "limits",
    "title": "10. 담보가 있어도 만기 연장과 처분 가격은 보장되지 않습니다"
  }
],
    component: () => import("@/pages/articles/banking/repo-and-collateral-funding"),
  },
];
