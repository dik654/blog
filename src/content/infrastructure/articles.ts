import type { Article } from "../types";

export const infrastructureArticles: Article[] = [
  {
    slug: "electricity-grid-and-power",
    title: "전기는 발전소보다 전력망의 연결과 시간 제약을 함께 봐야 한다",
    subcategory: "infrastructure-networks",
    sections: [{"id": "overview", "title": "S · 전기를 만들 장소와 사용할 장소 사이에 무엇이 필요할까요"}, {"id": "black-box", "title": "B · 만드는 곳에서 쓰는 곳까지 세 번 확인합니다"}, {"id": "case", "title": "0 · 한 시간에 100을 만들 수 있지만 80만 보낼 수 있습니다"}, {"id": "picture", "title": "1 · 보내는 쪽은 두 숫자 중 작은 값을 고릅니다"}, {"id": "need", "title": "2 · 안전 여유와 시간별 조정에도 돈이 듭니다"}, {"id": "names", "title": "3 · 출력·사용량·접속을 다른 단위로 부릅니다"}, {"id": "mechanism", "title": "4 · 먼 발전 80과 가까운 발전 20을 합쳐 공급합니다"}, {"id": "source", "title": "5 · IEA의 접속 병목을 우리 공장에 대입합니다"}, {"id": "comparison", "title": "6 · 미국 안에서도 망 운영과 가격 결정이 다릅니다"}, {"id": "limits", "title": "7 · 싼 평균 요금이 필요한 순간의 공급을 보장하지 않습니다"}],
    component: () => import("@/pages/articles/infrastructure/electricity-grid-and-power"),
  },
  {
    slug: "food-chain-and-prices",
    title: "식품 가격은 농장의 생산량에서 식탁까지의 손실과 권력으로 만들어진다",
    subcategory: "infrastructure-supply",
    sections: [{"id": "overview", "title": "S · 식탁의 가격을 밭까지 거슬러 올라갑니다"}, {"id": "black-box", "title": "B · 물건은 앞으로 가고 돈과 반품 책임은 계약을 따라갑니다"}, {"id": "case", "title": "0 · 소비자의 200원은 네 단계에 걸쳐 만들어집니다"}, {"id": "picture", "title": "1 · 같은 물건이 100에서 150을 거쳐 200이 됩니다"}, {"id": "need", "title": "2 · 팔 시점을 미룰 수 있는 사람이 선택권을 얻습니다"}, {"id": "names", "title": "3 · 가격 간격·부패성·협상력으로 부릅니다"}, {"id": "mechanism", "title": "4 · 두 개가 상하면 나머지 여덟 개가 원가를 나눕니다"}, {"id": "source", "title": "5 · FAO의 네 기능에 추가 금액을 배치합니다"}, {"id": "comparison", "title": "6 · 미국의 식품 1달러를 한국의 한 품목 가격과 섞지 않습니다"}, {"id": "limits", "title": "7 · 마진이 뛰었다면 비용과 시장 지배력을 따로 조사합니다"}],
    component: () => import("@/pages/articles/infrastructure/food-chain-and-prices"),
  },
  {
    slug: "water-utility-and-tariffs",
    title: "수도 요금은 물값과 배관을 계속 유지할 돈을 함께 묻는다",
    subcategory: "infrastructure-networks",
    sections: [{"id": "overview", "title": "S · 오늘 나오는 물을 내년에도 받으려면 무엇을 내야 할까요"}, {"id": "black-box", "title": "B · 공급에서 사용과 지원까지 연결됩니다"}, {"id": "case", "title": "0 · 공급 비용 90을 가구 80과 지원 10으로 나눕니다"}, {"id": "picture", "title": "1 · 지원금은 부족한 수입을 메우는 경로입니다"}, {"id": "need", "title": "2 · 사용량이 줄어도 묻힌 관의 비용은 남습니다"}, {"id": "names", "title": "3 · 서비스 비용과 부담자, 접근성을 구분합니다"}, {"id": "mechanism", "title": "4 · 요금 60만 받고 지원 10을 받아도 20이 모자랍니다"}, {"id": "source", "title": "5 · 세계은행의 재원 공백에 70과 90을 넣습니다"}, {"id": "comparison", "title": "6 · 싱가포르의 물값에는 다른 목적의 세 항목이 있습니다"}, {"id": "limits", "title": "7 · 낮은 요금이 누구에게 도착하는지 확인합니다"}],
    component: () => import("@/pages/articles/infrastructure/water-utility-and-tariffs"),
  },
  {
    slug: "transport-access-and-land-value",
    title: "교통은 이동 시간을 바꿔 일자리와 땅값을 다시 배분한다",
    subcategory: "infrastructure-networks",
    sections: [{"id": "overview", "title": "S · 빠르게 가는 길이 누구의 기회를 바꿀까요"}, {"id": "black-box", "title": "B · 건설하는 곳·운영하는 곳·이용하는 사람이 연결됩니다"}, {"id": "case", "title": "0 · 편도 25분 절약은 왕복 한 달에 1,000분입니다"}, {"id": "picture", "title": "1 · 차량 안의 시간과 문 앞까지의 시간을 합칩니다"}, {"id": "need", "title": "2 · 선로가 있어도 자주 오지 않으면 선택지가 줄어듭니다"}, {"id": "names", "title": "3 · 접근성·지대 이동·중복 계산을 구분합니다"}, {"id": "mechanism", "title": "4 · 시간 절약과 임대료 상승을 동시에 적습니다"}, {"id": "source", "title": "5 · 세계은행의 접근성 질문을 출퇴근 경로에 적용합니다"}, {"id": "comparison", "title": "6 · 영국의 평가 원칙은 이익을 두 번 세지 말라고 요구합니다"}, {"id": "limits", "title": "7 · 새 수요와 지연 비용을 빼면 사업을 과대평가합니다"}],
    component: () => import("@/pages/articles/infrastructure/transport-access-and-land-value"),
  },
  {
    slug: "housing-land-and-supply",
    title: "집값은 건축비만이 아니라 토지 권리와 지을 수 있는 양에 좌우된다",
    subcategory: "infrastructure-supply",
    sections: [{"id": "overview", "title": "S · 집을 원하는 사람과 입주 가능한 집 사이를 봅니다"}, {"id": "black-box", "title": "B · 땅의 권리에서 공사와 입주로 이어집니다"}, {"id": "case", "title": "0 · 판매 10억에서 다른 비용 7억을 빼면 3억이 남습니다"}, {"id": "picture", "title": "1 · 땅값에 넣기 전에 비용과 필요한 이익을 차감합니다"}, {"id": "need", "title": "2 · 더 지을 권리와 기다리는 기간이 현금을 바꿉니다"}, {"id": "names", "title": "3 · 잔여가치·허가 지연·주거비 부담을 구분합니다"}, {"id": "mechanism", "title": "4 · 지연으로 비용이 5천만 원 늘면 토지 여유는 줄어듭니다"}, {"id": "source", "title": "5 · 개발 평가 원문은 정상 이익까지 비용에 넣습니다"}, {"id": "comparison", "title": "6 · 싱가포르의 기간 있는 소유권을 영구 소유와 구분합니다"}, {"id": "limits", "title": "7 · 새 집 수와 현재 가구의 거주 안정은 다른 결과입니다"}],
    component: () => import("@/pages/articles/infrastructure/housing-land-and-supply"),
  },
  {
    slug: "climate-risk-and-exposure",
    title: "기후 위험은 날씨의 세기와 그곳에 놓인 사람·자산이 만나 생긴다",
    subcategory: "infrastructure-risk",
    sections: [{"id": "overview", "title": "S · 같은 비가 왜 다른 손실을 만들까요"}, {"id": "black-box", "title": "B · 자연 현상이 자산에 닿고 손실이 계약으로 넘어갑니다"}, {"id": "case", "title": "0 · 같은 홍수에서 10과 60의 손실이 생깁니다"}, {"id": "picture", "title": "1 · 그곳에 있는 양과 손상 비율을 곱합니다"}, {"id": "need", "title": "2 · 개발 제한·방재·보험은 바꾸는 대상이 다릅니다"}, {"id": "names", "title": "3 · 위해·노출·취약성의 상호작용으로 위험을 읽습니다"}, {"id": "mechanism", "title": "4 · B의 손실 60은 보험과 남은 부담으로 나뉩니다"}, {"id": "source", "title": "5 · IPCC는 세 요소가 서로 작용한다고 설명합니다"}, {"id": "comparison", "title": "6 · UNDRR의 노출 정의에는 사람과 기반 시설도 있습니다"}, {"id": "limits", "title": "7 · 과거에 안전했던 땅도 조건이 바뀌면 다시 봐야 합니다"}],
    component: () => import("@/pages/articles/infrastructure/climate-risk-and-exposure"),
  },
  {"slug": "materials-waste-and-circularity", "title": "자원과 폐기물은 수거된 양·다시 쓸 양·비용을 나눠 읽는다", "subcategory": "infrastructure-supply", "sections": [{"id": "overview", "title": "버린 물건이 수거됐다는 사실은 과정의 시작입니다"}, {"id": "black-box", "title": "원료가 물건이 되고 사용 뒤 여러 갈래로 나뉩니다"}, {"id": "case", "title": "100kg 중 80kg을 모으고 그중 75%를 회수합니다"}, {"id": "picture", "title": "60kg은 돌아오고 40kg은 다른 경로에 남습니다"}, {"id": "need", "title": "품질과 판매처가 없으면 모인 양이 쌓이기만 합니다"}, {"id": "names", "title": "수거율·회수 수율·생산자 책임을 구분합니다"}, {"id": "mechanism", "title": "60kg을 팔아 6만원을 받아도 처리비 12만원이 남습니다"}, {"id": "source", "title": "OECD 그림은 물건의 이동과 돈의 지급을 다르게 그립니다"}, {"id": "comparison", "title": "판매 뒤의 책임을 연결해도 실물 비용은 사라지지 않습니다"}, {"id": "limits", "title": "덜 버리는 것과 더 많이 회수하는 것은 다른 성과입니다"}], "component": () => import("@/pages/articles/infrastructure/materials-waste-and-circularity")},
];
