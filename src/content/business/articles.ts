import type { Article } from "../types";

export const businessArticles: Article[] = [
  {
    slug: "business-model-cashflow",
    title: "사업 모델은 누가 먼저 돈을 내고 어떤 약속으로 회수하는가",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "매출 200만 원을 봤다면 누가 그 돈을 잠시 보관하는지부터 봅니다"}, {"id": "mechanism", "title": "매출·이익·현금은 세 장의 다른 장부입니다"}, {"id": "comparison", "title": "나라가 달라도 계약과 회계의 두 질문은 남습니다"}, {"id": "limits", "title": "높은 성장률 하나로 좋은 사업이라고 판단할 수 없습니다"}],
    component: () => import("@/pages/articles/business/business-model-cashflow"),
  },
  {
    slug: "shop-unit-economics",
    title: "가게 한 곳은 하루 몇 건을 팔아야 월세와 인건비를 내는가",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "문이 열리기 전에도 나가는 돈부터 셉니다"}, {"id": "mechanism", "title": "가격을 올리기보다 한 건의 남는 돈과 필요한 건수를 함께 봅니다"}, {"id": "comparison", "title": "점주와 임대인의 숫자는 다른 속도로 움직입니다"}, {"id": "limits", "title": "손익분기점에 도달해도 투자금 회수가 끝난 것은 아닙니다"}],
    component: () => import("@/pages/articles/business/shop-unit-economics"),
  },
  {
    slug: "shop-site-selection",
    title: "가게 자리는 발길보다 구매할 사람과 허용된 용도를 먼저 본다",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "천 명이 지나가도 하루 매출은 16만 원일 수 있습니다"}, {"id": "mechanism", "title": "후보지는 관찰·전환·비용 세 장으로 비교합니다"}, {"id": "comparison", "title": "계약 전에 용도와 설비가 업종을 받아주는지 확인합니다"}, {"id": "limits", "title": "입지 점수는 미래 매출의 보증서가 아닙니다"}],
    component: () => import("@/pages/articles/business/shop-site-selection"),
  },
  {
    slug: "shop-fitout-and-opening",
    title: "가게 인테리어는 도면보다 사용 동의와 설비 검사가 먼저다",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "예쁜 가게의 첫 비용은 손님이 없는 달의 월세입니다"}, {"id": "mechanism", "title": "동의·실측·설계·견적·시공·검수·신고가 한 줄로 이어집니다"}, {"id": "comparison", "title": "나라와 업종에 따라 허가의 문턱이 달라집니다"}, {"id": "limits", "title": "완성 사진은 준공·영업 가능·회수 가능의 증거가 아닙니다"}],
    component: () => import("@/pages/articles/business/shop-fitout-and-opening"),
  },
  {
    slug: "franchise-incentives",
    title: "프랜차이즈는 브랜드를 빌려 주는 계약이면서 비용을 나누는 시스템이다",
    subcategory: "business-network",
    sections: [{"id": "overview", "title": "본부의 매출 증가와 점주의 이익 증가는 같은 문장이 아닙니다"}, {"id": "mechanism", "title": "초기 가맹비보다 계약 전체의 현금흐름을 봅니다"}, {"id": "comparison", "title": "공시 제도는 나라가 달라도 수익률 보증은 아닙니다"}, {"id": "limits", "title": "평균 매출이 높아도 점주 한 사람의 삶은 다를 수 있습니다"}],
    component: () => import("@/pages/articles/business/franchise-incentives"),
  },
  {
    slug: "supply-chain-bargaining",
    title: "공급망의 힘은 공장 소유보다 규격·주문·판매처를 쥔 곳에 생긴다",
    subcategory: "business-network",
    sections: [{"id": "overview", "title": "100달러 수출품에서 한 나라에 100달러가 남지 않습니다"}, {"id": "mechanism", "title": "통제 지점을 찾으면 이익이 어디에 남는지 보입니다"}, {"id": "comparison", "title": "국가의 산업정책도 같은 권한 지도를 바꿉니다"}, {"id": "limits", "title": "공급망 재편이 곧 한 국가의 승리라는 결론은 빠릅니다"}],
    component: () => import("@/pages/articles/business/supply-chain-bargaining"),
  },
];
