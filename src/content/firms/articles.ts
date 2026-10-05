import type { Article } from "../types";

export const firmsArticles: Article[] = [
  {
    slug: "why-firms-exist",
    title: "기업은 왜 존재할까: 같은 여섯 일의 비용과 계약",
    subcategory: "firm-boundary",
    sections: [
  {
    "id": "overview",
    "title": "1. 일을 맡길 때마다 다시 협상해야 한다면"
  },
  {
    "id": "black-box",
    "title": "2. 밖에 주문하거나 안에서 배정한다"
  },
  {
    "id": "case",
    "title": "3. 전부 밖에 두면 24, 전부 안에 두면 21이다"
  },
  {
    "id": "picture",
    "title": "4. 여섯 일을 옮길 때 합계가 어떻게 변하는가"
  },
  {
    "id": "need",
    "title": "5. 물건값을 알아보고 약속을 지키는 데에도 돈이 든다"
  },
  {
    "id": "names",
    "title": "6. 방식의 비용과 기업의 경계를 구분한다"
  },
  {
    "id": "cost-of-market",
    "title": "7. 넷째 일을 바꿔도 합계가 18인 이유"
  },
  {
    "id": "one-contract",
    "title": "8. 세부 작업을 나중에 정할 수 있는 범위를 약속한다"
  },
  {
    "id": "source",
    "title": "9. Coase의 원문은 시장을 사용하는 비용부터 묻는다"
  },
  {
    "id": "boundary",
    "title": "10. 하나 더 들일 때의 차이는 안의 비용 빼기 밖의 비용이다"
  },
  {
    "id": "what-moves",
    "title": "11. 회사가 커졌어도 안쪽이 좋아진 것은 아닐 수 있다"
  },
  {
    "id": "limits",
    "title": "12. 설립비가 생기면 첫 작업만 보고 멈출 수 없다"
  },
  {
    "id": "handoff",
    "title": "13. 같은 일을 끝내는 전체 비용으로 예측한다"
  }
],
    component: () => import("@/pages/articles/firms/why-firms-exist"),
  },
  {
    slug: "scale-and-cost-structure",
    title: "규모와 비용: 같은 부품의 세 생산 방법",
    subcategory: "firm-pricing",
    sections: [
  {
    "id": "overview",
    "title": "1. 부품 20개와 100개에 같은 설비를 골라도 될까"
  },
  {
    "id": "black-box",
    "title": "2. 같은 물건과 기간을 맞춘 뒤 전체 비용을 비교한다"
  },
  {
    "id": "case",
    "title": "3. 20개라면 200, 140, 320 중에서 고른다"
  },
  {
    "id": "picture",
    "title": "4. 5개·10개·20개·80개·100개를 같은 표로 비교한다"
  },
  {
    "id": "need",
    "title": "5. 방법을 바꾸지 않아도 평균은 내려갈 수 있다"
  },
  {
    "id": "names",
    "title": "6. 고정비·변동비·평균비용과 방법 선택을 구분한다"
  },
  {
    "id": "roundabout",
    "title": "7. 60을 내기 전의 선택과 이미 낸 뒤의 선택은 다르다"
  },
  {
    "id": "minimum-market",
    "title": "8. 준비 비용 차이를 하나당 절약액으로 나눈다"
  },
  {
    "id": "all-methods",
    "title": "9. 더 비싼 설비라는 이름만으로 차례대로 넘어가지 않는다"
  },
  {
    "id": "differentiation",
    "title": "10. 30개씩 세 주문을 모으면 90개용 방법을 고를 수 있다"
  },
  {
    "id": "market-is-produced",
    "title": "11. 생산 능력과 구매력이 서로의 조건을 바꾼다"
  },
  {
    "id": "not-monopoly",
    "title": "12. 비용이 줄어든다는 사실만으로 판매자가 하나가 되지는 않는다"
  },
  {
    "id": "handoff",
    "title": "13. 같은 방법의 절약과 방법을 바꾸는 절약을 각각 계산한다"
  }
],
    component: () =>
      import("@/pages/articles/firms/scale-and-cost-structure"),
  },
  {
    slug: "market-power-and-markup",
    title: "시장 지배력과 가격: 더 팔 때 매출과 이익이 달라지는 이유",
    subcategory: "firm-pricing",
    sections: [
  {
    "id": "overview",
    "title": "1. 값을 내려 더 팔았는데 남는 돈은 줄었다"
  },
  {
    "id": "black-box",
    "title": "2. 가격별 판매량과 비용을 알아야 선택할 수 있다"
  },
  {
    "id": "case",
    "title": "3. 3개와 4개의 매출·비용·이익을 각각 센다"
  },
  {
    "id": "picture",
    "title": "4. 새로 받는 9에서 세 개의 차이 3을 뺀다"
  },
  {
    "id": "why",
    "title": "5. 매출만 키우거나 새 한 개의 가격만 보면 답이 달라진다"
  },
  {
    "id": "names",
    "title": "6. 수요·한계수입·한계비용을 서로 다른 값으로 읽는다"
  },
  {
    "id": "facing-demand",
    "title": "7. 판매자 수만으로 가격을 고르는 힘을 정하지 않는다"
  },
  {
    "id": "marginal-revenue",
    "title": "8. 한 개를 더 파는 차이와 아주 작은 변화의 비율을 구분한다"
  },
  {
    "id": "stopping-point",
    "title": "9. 연속적인 수량에서는 이익식 전체로 최대점을 확인한다"
  },
  {
    "id": "cournot-source",
    "title": "10. Cournot의 식도 매출에서 생산 비용을 뺀다"
  },
  {
    "id": "markup-size",
    "title": "11. 마크업 식은 최적점의 탄력성과 연결된다"
  },
  {
    "id": "elasticity-comparison",
    "title": "12. 수요를 바꿀 때와 비용을 바꿀 때를 나눠 본다"
  },
  {
    "id": "what-is-lost",
    "title": "13. 이전된 9와 일어나지 않은 거래의 가치 4.5를 나눈다"
  },
  {
    "id": "limits",
    "title": "14. 생산 한도·진입 비용·시장 제도가 있으면 다시 비교한다"
  },
  {
    "id": "handoff",
    "title": "15. 가격과 수량에서 남는 돈까지 한 번에 따라간다"
  }
],
    component: () =>
      import("@/pages/articles/firms/market-power-and-markup"),
  },
];
