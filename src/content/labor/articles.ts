import type { Article } from "../types";

export const laborArticles: Article[] = [
  {
    slug: "wage-floor-natural-experiment",
    title: "최저임금: 총임금 계산과 두 지역의 고용 비교",
    subcategory: "wage-formation",
    sections: [
  {
    "id": "overview",
    "title": "1. 시급이 높아졌는데 노동을 더 쓰는 경우가 있을까"
  },
  {
    "id": "black-box",
    "title": "2. 수입과 임금 합계를 받아 같은 하루의 계획을 비교한다"
  },
  {
    "id": "case",
    "title": "3. 임금 합계가 18에서 28로 늘 때 수입은 9.5 늘어난다"
  },
  {
    "id": "picture",
    "title": "4. 새 시간의 7과 다른 세 시간의 3을 함께 센다"
  },
  {
    "id": "why",
    "title": "5. 지급 시급 하나로 고용의 방향을 정할 수 없다"
  },
  {
    "id": "names",
    "title": "6. 노동의 추가 수입, 임금 수용, 수요독점을 구분한다"
  },
  {
    "id": "two-counts",
    "title": "7. 한 시간의 차이와 순간적인 변화율은 다르다"
  },
  {
    "id": "many-buyers",
    "title": "8. 시급을 주어진 값으로 받으면 5시간을 고른다"
  },
  {
    "id": "one-buyer",
    "title": "9. 임금 총액을 미분하면 시급보다 큰 추가 비용이 나온다"
  },
  {
    "id": "two-predictions",
    "title": "10. 최저시급은 총액을 바꾸고 그 뒤에 추가 비용을 계산한다"
  },
  {
    "id": "finite-units",
    "title": "11. 정수 인원에서는 동률을 숨기지 않는다"
  },
  {
    "id": "what-happened",
    "title": "12. 실제 연구에서는 법정 하한과 두 지역의 고용을 조사했다"
  },
  {
    "id": "comparison-conditions",
    "title": "13. 비교 지역은 바뀌지 않았을 때의 경로를 대신한다"
  },
  {
    "id": "prices-and-models",
    "title": "14. 고용이 늘었다는 관측만으로 수요독점을 입증하지 않는다"
  },
  {
    "id": "measurement-and-reanalysis",
    "title": "15. 전화 응답과 급여 자료, 표본 선택도 검토 대상이다"
  },
  {
    "id": "limits",
    "title": "16. 방향을 이해하는 모형과 정책을 결정하는 자료를 구분한다"
  },
  {
    "id": "handoff",
    "title": "17. 임금 차이의 이유와 측정의 범위를 함께 묻는다"
  }
],
    component: () =>
      import("@/pages/articles/labor/wage-floor-natural-experiment"),
  },
  {
    slug: "measuring-the-spread",
    title: "벌어진 정도는 표가 아니라 곡선으로 잽니다",
    subcategory: "distribution",
    sections: [
      {
        id: "overview",
        title: "같은 100달러를 열 사람이 나눠 가진 두 경우가 있습니다",
      },
      {
        id: "why-tables-fail",
        title: "부품 1. 계급별 표로는 벌어졌는지 좁아졌는지 알 수 없습니다",
      },
      {
        id: "cumulate-and-draw",
        title: "부품 2. 가난한 쪽부터 쌓아서 그리면 보입니다",
      },
      {
        id: "one-number",
        title: "부품 3. 휜 정도를 한 숫자로 줄입니다",
      },
      {
        id: "what-one-number-loses",
        title: "부품 4. 그 한 숫자가 못 보는 것이 입구의 두 경우입니다",
      },
      {
        id: "where-the-spread-comes-from",
        title: "부품 5. 벌어지는 자리는 앞 글의 틈이 사람마다 다른 자리입니다",
      },
      {
        id: "handoff",
        title: "다섯 편으로 조직과 사람까지 왔습니다",
      },
    ],
    component: () => import("@/pages/articles/labor/measuring-the-spread"),
  },
];
