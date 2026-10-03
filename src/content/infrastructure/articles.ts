import type { Article } from "../types";

export const infrastructureArticles: Article[] = [
  {
    slug: "electricity-grid-and-power",
    title: "전기는 발전소보다 전력망의 연결과 시간 제약을 함께 봐야 한다",
    subcategory: "infrastructure-networks",
    sections: [{"id": "overview", "title": "발전소가 충분해도 공장에 전기가 닿지 않을 수 있습니다"}, {"id": "mechanism", "title": "발전·망·운영·요금을 네 장부로 나눕니다"}, {"id": "comparison", "title": "국가마다 가격 결정과 망 소유의 경계가 다릅니다"}, {"id": "limits", "title": "전기 요금만 내려도 투자가 늘어난다고 단정할 수 없습니다"}],
    component: () => import("@/pages/articles/infrastructure/electricity-grid-and-power"),
  },
  {
    slug: "food-chain-and-prices",
    title: "식품 가격은 농장의 생산량에서 식탁까지의 손실과 권력으로 만들어진다",
    subcategory: "infrastructure-supply",
    sections: [{"id": "overview", "title": "소비자가 200원을 내도 농가가 200원을 받지는 않습니다"}, {"id": "mechanism", "title": "상하기 쉬운 상품은 시간과 협상력이 가격을 움직입니다"}, {"id": "comparison", "title": "국가별 식량 문제는 수입 의존과 유통망에서 갈립니다"}, {"id": "limits", "title": "가격이 올랐다는 이유만으로 폭리 주체를 지목할 수 없습니다"}],
    component: () => import("@/pages/articles/infrastructure/food-chain-and-prices"),
  },
  {
    slug: "water-utility-and-tariffs",
    title: "수도 요금은 물값과 배관을 계속 유지할 돈을 함께 묻는다",
    subcategory: "infrastructure-networks",
    sections: [{"id": "overview", "title": "물을 싸게 공급해도 낡은 관은 언젠가 바꿔야 합니다"}, {"id": "mechanism", "title": "사용량 요금과 고정 설비비의 부담을 분리합니다"}, {"id": "comparison", "title": "기후와 도시 밀도에 따라 같은 요금표도 효과가 다릅니다"}, {"id": "limits", "title": "낮은 요금도 높은 요금도 그 자체로 공정하다고 말할 수 없습니다"}],
    component: () => import("@/pages/articles/infrastructure/water-utility-and-tariffs"),
  },
  {
    slug: "transport-access-and-land-value",
    title: "교통은 이동 시간을 바꿔 일자리와 땅값을 다시 배분한다",
    subcategory: "infrastructure-networks",
    sections: [{"id": "overview", "title": "새 역은 시간을 줄이지만 이익이 모두 승객에게 남지 않습니다"}, {"id": "mechanism", "title": "건설비·운영비·접근성 이익을 다른 장부에 둡니다"}, {"id": "comparison", "title": "같은 철도라도 도시의 토지 규칙에 따라 결과가 달라집니다"}, {"id": "limits", "title": "시간 절약을 곧바로 경제 성장액으로 더할 수 없습니다"}],
    component: () => import("@/pages/articles/infrastructure/transport-access-and-land-value"),
  },
  {
    slug: "housing-land-and-supply",
    title: "집값은 건축비만이 아니라 토지 권리와 지을 수 있는 양에 좌우된다",
    subcategory: "infrastructure-supply",
    sections: [{"id": "overview", "title": "같은 집을 지어도 땅의 권리가 다르면 가격이 달라집니다"}, {"id": "mechanism", "title": "허가부터 입주까지의 시간과 권리 사슬을 봅니다"}, {"id": "comparison", "title": "나라별 소유권과 계획 제도가 공급을 다르게 묶습니다"}, {"id": "limits", "title": "공급 증가 한 가지로 모든 주거 문제를 설명할 수 없습니다"}],
    component: () => import("@/pages/articles/infrastructure/housing-land-and-supply"),
  },
  {
    slug: "climate-risk-and-exposure",
    title: "기후 위험은 날씨의 세기와 그곳에 놓인 사람·자산이 만나 생긴다",
    subcategory: "infrastructure-risk",
    sections: [{"id": "overview", "title": "같은 비가 와도 손실은 지역마다 다릅니다"}, {"id": "mechanism", "title": "위험·노출·취약성을 따로 줄이는 수단이 있습니다"}, {"id": "comparison", "title": "국가와 지역마다 위험 자료와 대응 능력이 다릅니다"}, {"id": "limits", "title": "보험료나 과거 피해만으로 미래의 안전을 확정할 수 없습니다"}],
    component: () => import("@/pages/articles/infrastructure/climate-risk-and-exposure"),
  },
];
