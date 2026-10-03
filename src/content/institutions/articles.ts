import type { Article } from "../types";

export const institutionsArticles: Article[] = [
  {
    slug: "insurance-risk-pooling",
    title: "보험은 작은 보험료를 모아 큰 손실을 나누지만 모든 위험을 없애지는 못한다",
    subcategory: "institutions-risk",
    sections: [{"id": "overview", "title": "모두에게 300만 원을 쥐여줄 필요는 없습니다"}, {"id": "mechanism", "title": "같이 모을 수 있는 위험과 같이 터지는 위험을 구분합니다"}, {"id": "comparison", "title": "보험과 사회보장은 위험 풀의 돈을 모으는 방식이 다릅니다"}, {"id": "limits", "title": "보험료가 싸다는 사실만으로 보장이 충분한 것은 아닙니다"}],
    component: () => import("@/pages/articles/institutions/insurance-risk-pooling"),
  },
  {
    slug: "healthcare-payment-systems",
    title: "의료비는 환자·보험자·정부·병원 사이를 돌아서 움직인다",
    subcategory: "institutions-risk",
    sections: [{"id": "overview", "title": "창구에서 2만 원을 냈어도 진료비가 2만 원인 것은 아닙니다"}, {"id": "mechanism", "title": "재원 조달·위험 풀·구매 가격표를 셋으로 나눕니다"}, {"id": "comparison", "title": "한국·영국·미국도 같은 세 질문으로 비교합니다"}, {"id": "limits", "title": "의료 지출이 늘어도 건강 결과가 자동으로 좋아지지는 않습니다"}],
    component: () => import("@/pages/articles/institutions/healthcare-payment-systems"),
  },
  {
    slug: "public-budget-and-taxes",
    title: "세금은 국가가 서비스를 사는 돈이고 예산은 우선순위의 기록이다",
    subcategory: "institutions-country",
    sections: [{"id": "overview", "title": "올해 100을 쓰면 올해 세금 80만 보면 부족합니다"}, {"id": "mechanism", "title": "세입·지출·부채 잔액과 의회 결정권을 분리합니다"}, {"id": "comparison", "title": "나라의 재정 여력은 통화·세금·제도에 따라 달라집니다"}, {"id": "limits", "title": "적자 숫자 하나로 낭비 또는 투자를 판정할 수 없습니다"}],
    component: () => import("@/pages/articles/institutions/public-budget-and-taxes"),
  },
  {
    slug: "education-skills-and-signals",
    title: "교육은 기술을 만들고 자격을 보여 주지만 두 효과는 다르다",
    subcategory: "institutions-capacity",
    sections: [{"id": "overview", "title": "교육비 1천만 원을 내고 연봉 200만 원이 올라도 계산은 끝나지 않습니다"}, {"id": "mechanism", "title": "기술 습득과 신호, 인맥을 분리해 관찰합니다"}, {"id": "comparison", "title": "국가별 공공 부담과 개인 부담을 같이 놓습니다"}, {"id": "limits", "title": "평균 임금 상승을 모든 개인의 수익으로 약속할 수 없습니다"}],
    component: () => import("@/pages/articles/institutions/education-skills-and-signals"),
  },
  {
    slug: "media-attention-and-public-belief",
    title: "정보는 사실이 전달되는 길과 주목을 파는 시장을 동시에 지난다",
    subcategory: "institutions-country",
    sections: [{"id": "overview", "title": "정보가 많아도 사람은 화면에 뜬 일부만 봅니다"}, {"id": "mechanism", "title": "취재 비용·추천 규칙·광고 수입을 따로 추적합니다"}, {"id": "comparison", "title": "나라의 언론 자유와 플랫폼 규칙이 정보 경로를 바꿉니다"}, {"id": "limits", "title": "화면 노출이 생각과 행동을 바꿨다고 바로 단정할 수 없습니다"}],
    component: () => import("@/pages/articles/institutions/media-attention-and-public-belief"),
  },
  {
    slug: "how-to-read-a-country",
    title: "어느 나라든 일곱 장부로 읽는 법",
    subcategory: "institutions-country",
    sections: [{"id": "overview", "title": "수출 100이라는 숫자만으로 그 나라의 힘을 알 수 없습니다"}, {"id": "mechanism", "title": "일곱 장의 장부를 만들면 분야가 서로 이어집니다"}, {"id": "comparison", "title": "국가별 수치를 같은 정의와 시점에 맞춰야 합니다"}, {"id": "limits", "title": "하나의 이야기로 한 나라를 정의하면 변화가 보이지 않습니다"}],
    component: () => import("@/pages/articles/institutions/how-to-read-a-country"),
  },
];
