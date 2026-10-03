import type { Article } from "../types";

export const propertyArticles: Article[] = [
  {
    slug: "commercial-lease-and-rent",
    title: "상가 임대는 공간만이 아니라 기간과 나갈 때의 상태를 사는 계약이다",
    subcategory: "property-lease",
    sections: [{"id": "overview", "title": "월세 200만 원과 보증금 3천만 원은 성격이 다릅니다"}, {"id": "mechanism", "title": "공간의 사용권과 끝날 때의 의무를 한 계약에서 읽습니다"}, {"id": "comparison", "title": "갱신과 양도는 국가별로 따로 확인해야 합니다"}, {"id": "limits", "title": "권리금과 보증금, 시설값은 서로 다른 청구권입니다"}],
    component: () => import("@/pages/articles/property/commercial-lease-and-rent"),
  },
  {
    slug: "shop-transfer-and-goodwill",
    title: "가게를 양도할 때 넘기는 것은 하나의 가게가 아니라 서로 다른 권리들이다",
    subcategory: "property-lease",
    sections: [{"id": "overview", "title": "3천300만 원이라는 권리금 한 숫자를 셋으로 쪼갭니다"}, {"id": "mechanism", "title": "자산양도·임대차·채무·영업 신고를 각각 닫습니다"}, {"id": "comparison", "title": "한국의 권리금 회수 보호와 호주의 lease assignment는 제도가 다릅니다"}, {"id": "limits", "title": "과거 매출이 앞으로의 영업권 가치를 보장하지 않습니다"}],
    component: () => import("@/pages/articles/property/shop-transfer-and-goodwill"),
  },
  {
    slug: "shop-closure-and-restoration",
    title: "폐업은 문을 닫는 날이 아니라 보증금과 채무를 정산하는 과정이다",
    subcategory: "property-lease",
    sections: [{"id": "overview", "title": "보증금 3천만 원을 온전히 돌려받는다고 가정하지 않습니다"}, {"id": "mechanism", "title": "폐업 장부는 고객·직원·공급자·임대인·관청별로 닫습니다"}, {"id": "comparison", "title": "원상복구 범위는 계약·인도 상태·관할 판례를 함께 봅니다"}, {"id": "limits", "title": "철거보다 양도가 유리한지는 세 당사자의 동의로 결정됩니다"}],
    component: () => import("@/pages/articles/property/shop-closure-and-restoration"),
  },
  {
    slug: "land-development-residual",
    title: "땅값은 허가 뒤 팔 수 있는 것에서 공사비와 시간을 거꾸로 뺀다",
    subcategory: "property-development",
    sections: [{"id": "overview", "title": "100억 원짜리 건물을 짓는 땅이 100억 원일 수는 없습니다"}, {"id": "mechanism", "title": "소유권·허가·인프라·시간을 각각 확인합니다"}, {"id": "comparison", "title": "나라별 계획권은 다르지만 먼저 허가와 현금의 순서를 봅니다"}, {"id": "limits", "title": "개발 호재라는 말에는 확률과 비용이 빠져 있습니다"}],
    component: () => import("@/pages/articles/property/land-development-residual"),
  },
];
