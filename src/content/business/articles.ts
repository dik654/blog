import type { Article } from "../types";

export const businessArticles: Article[] = [
  {
    slug: "business-model-cashflow",
    title: "사업 모델은 누가 먼저 돈을 내고 어떤 약속으로 회수하는가",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "누가 먼저 돈을 쓰고 누가 나중에 약속을 이행하는가"}, {"id": "black-box", "title": "고객의 약속, 물건의 이동, 돈의 지급을 따로 본다"}, {"id": "case", "title": "100건을 받기 7일 전에 120만 원을 쓴다"}, {"id": "picture", "title": "같은 200만 원에 물건 화살표와 돈 화살표를 그린다"}, {"id": "need", "title": "기다리는 돈을 따로 세지 않으면 주문 증가가 부담이 된다"}, {"id": "names", "title": "세 숫자에 이름을 붙인다"}, {"id": "mechanism", "title": "매출·이익·현금은 세 장의 다른 장부입니다"}, {"id": "source", "title": "상품을 넘겼는지로 수익을 확인한다"}, {"id": "comparison", "title": "나라가 달라도 계약과 회계의 두 질문은 남습니다"}, {"id": "limits", "title": "높은 성장률 하나로 좋은 사업이라고 판단할 수 없습니다"}],
    component: () => import("@/pages/articles/business/business-model-cashflow"),
  },
  {
    slug: "shop-unit-economics",
    title: "가게 한 곳은 하루 몇 건을 팔아야 월세와 인건비를 내는가",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "하루 장사가 한 달의 생활을 감당하는가"}, {"id": "black-box", "title": "받는 돈에서 주문 때문에 나간 돈을 먼저 뺀다"}, {"id": "case", "title": "6천 원 한 잔이 매달 800만 원을 나눠 부담한다"}, {"id": "picture", "title": "한 잔의 남는 돈을 월 단위로 모은다"}, {"id": "need", "title": "매출이 같아도 주문 방식에 따라 남는 돈이 달라진다"}, {"id": "names", "title": "반복 비용과 한 잔의 기여에 이름을 붙인다"}, {"id": "mechanism", "title": "가격을 올리기보다 한 건의 남는 돈과 필요한 건수를 함께 봅니다"}, {"id": "source", "title": "팔린 재료와 남은 재료를 구분해 잔당 비용을 잡는다"}, {"id": "comparison", "title": "점주와 임대인의 숫자는 다른 속도로 움직입니다"}, {"id": "limits", "title": "손익분기점에 도달해도 투자금 회수가 끝난 것은 아닙니다"}],
    component: () => import("@/pages/articles/business/shop-unit-economics"),
  },
  {
    slug: "shop-site-selection",
    title: "가게 자리는 발길보다 구매할 사람과 허용된 용도를 먼저 본다",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "발길을 내 가게의 반복 구매로 바꿀 수 있는가"}, {"id": "black-box", "title": "손님, 출입구, 건물의 허용 조건을 순서대로 통과한다"}, {"id": "case", "title": "1천 명이 지나가도 구매는 20건이다"}, {"id": "picture", "title": "사람 수가 주문 수로 줄어드는 위치를 그린다"}, {"id": "need", "title": "관찰과 허용 조건을 분리해야 자리의 탈락 이유가 보인다"}, {"id": "names", "title": "관찰한 세 비율에 이름을 붙인다"}, {"id": "mechanism", "title": "후보지는 관찰·전환·비용 세 장으로 비교합니다"}, {"id": "source", "title": "정부의 입지 질문을 현장 관찰표로 바꾼다"}, {"id": "comparison", "title": "계약 전에 용도와 설비가 업종을 받아주는지 확인합니다"}, {"id": "limits", "title": "입지 점수는 미래 매출의 보증서가 아닙니다"}],
    component: () => import("@/pages/articles/business/shop-site-selection"),
  },
  {
    slug: "shop-fitout-and-opening",
    title: "가게 인테리어는 도면보다 사용 동의와 설비 검사가 먼저다",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "공간을 꾸미기 전에 영업 가능한 상태를 정한다"}, {"id": "black-box", "title": "사용 동의, 공사, 개업 확인은 서로 다른 결과를 만든다"}, {"id": "case", "title": "4천만 원 견적이 4천800만 원이 되고 30일 동안 팔지 못한다"}, {"id": "picture", "title": "완료의 표시를 돈 지급 시점에 연결한다"}, {"id": "need", "title": "도면보다 먼저 확인할 것은 돌아가는 설비와 빠져나갈 길이다"}, {"id": "names", "title": "공사 중 돈과 책임을 나누는 말"}, {"id": "mechanism", "title": "공사는 사용 동의에서 영업 신고까지 이어집니다"}, {"id": "source", "title": "영업 신고와 사업자등록을 서로 다른 문서로 준비한다"}, {"id": "comparison", "title": "나라와 업종에 따라 허가의 문턱이 달라집니다"}, {"id": "limits", "title": "완성 사진은 준공·영업 가능·회수 가능의 증거가 아닙니다"}],
    component: () => import("@/pages/articles/business/shop-fitout-and-opening"),
  },
  {
    slug: "shop-daily-operations",
    title: "가게의 하루는 주문·재고·직원·입금을 맞추어 끝난다",
    subcategory: "business-cash",
    sections: [{"id": "overview", "title": "주문을 받는 일과 돈이 남는 일을 매일 연결한다"}, {"id": "black-box", "title": "준비한 것, 팔린 것, 지급할 것을 서로 맞춘다"}, {"id": "case", "title": "20건을 팔았지만 그날 통장에는 아직 들어오지 않는다"}, {"id": "picture", "title": "주문 번호가 재료 사용과 입금까지 이어지게 한다"}, {"id": "need", "title": "잔액만 보면 손실이 난 곳을 찾을 수 없다"}, {"id": "names", "title": "세 장부를 맞추는 작업의 이름"}, {"id": "mechanism", "title": "20건을 준비하고 제공한 뒤 기록으로 마감한다"}, {"id": "source", "title": "실제 재고 손실과 입금 자료의 범위를 원문으로 확인한다"}, {"id": "comparison", "title": "나라를 바꾸어도 근무와 지급의 증거는 필요하다"}, {"id": "limits", "title": "장부가 맞아도 영업의 안전과 책임은 남는다"}],
    component: () => import("@/pages/articles/business/shop-daily-operations"),
  },
  {
    slug: "franchise-incentives",
    title: "프랜차이즈는 브랜드를 빌려 주는 계약이면서 비용을 나누는 시스템이다",
    subcategory: "business-network",
    sections: [{"id": "overview", "title": "같은 간판 아래 세 사람의 돈은 다르게 남는다"}, {"id": "black-box", "title": "본부의 지원, 점포의 운영, 고객의 선택을 따로 둔다"}, {"id": "case", "title": "월 3천만 원에서 150만 원은 먼저 본부로 간다"}, {"id": "picture", "title": "손님에게 받은 돈과 본부가 받는 돈의 기준을 그린다"}, {"id": "need", "title": "통일된 품질을 만드는 약속이 비용 부담도 만든다"}, {"id": "names", "title": "반복 지급과 공급 조건의 이름"}, {"id": "mechanism", "title": "초기 가맹비보다 계약 전체의 현금흐름을 봅니다"}, {"id": "source", "title": "본부에 내는 돈은 점주 적자와 별도로 발생할 수 있다"}, {"id": "comparison", "title": "공시 제도는 나라가 달라도 수익률 보증은 아닙니다"}, {"id": "limits", "title": "평균 매출이 높아도 점주 한 사람의 삶은 다를 수 있습니다"}],
    component: () => import("@/pages/articles/business/franchise-incentives"),
  },
  {
    slug: "supply-chain-bargaining",
    title: "공급망의 힘은 공장 소유보다 규격·주문·판매처를 쥔 곳에 생긴다",
    subcategory: "business-network",
    sections: [{"id": "overview", "title": "만든 사람과 가격을 정하는 사람이 왜 다른가"}, {"id": "black-box", "title": "만드는 곳, 옮기는 곳, 고객을 만나는 곳을 연결한다"}, {"id": "case", "title": "손님이 낸 100달러와 공장 출하 60달러를 구분한다"}, {"id": "picture", "title": "국경 화살표와 새로 더한 몫을 따로 표시한다"}, {"id": "need", "title": "대체할 수 없는 역할이 계약의 가격을 바꾼다"}, {"id": "names", "title": "단계별 가치와 대체 가능성에 이름을 붙인다"}, {"id": "mechanism", "title": "통제 지점을 찾으면 이익이 어디에 남는지 보입니다"}, {"id": "source", "title": "OECD 통계가 분리하려는 것은 수출액 안의 출처다"}, {"id": "comparison", "title": "국가의 산업정책도 같은 권한 지도를 바꿉니다"}, {"id": "limits", "title": "공급망 재편이 곧 한 국가의 승리라는 결론은 빠릅니다"}],
    component: () => import("@/pages/articles/business/supply-chain-bargaining"),
  },
];
