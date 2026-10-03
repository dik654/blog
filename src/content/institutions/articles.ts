import type { Article } from "../types";

export const institutionsArticles: Article[] = [
  {
    slug: "insurance-risk-pooling",
    title: "보험은 작은 보험료를 모아 큰 손실을 나누지만 모든 위험을 없애지는 못한다",
    subcategory: "institutions-risk",
    sections: [{"id": "overview", "title": "S · 혼자 감당하기 어려운 손실을 어떻게 나눌까요"}, {"id": "black-box", "title": "B · 가입자가 내고 운영자가 모아 사고를 당한 사람에게 줍니다"}, {"id": "case", "title": "0 · 1천 명의 10만 원이 20명의 300만 원을 지급합니다"}, {"id": "picture", "title": "1 · 손실이 생겼다는 사실과 계약이 지급한다는 판단은 다릅니다"}, {"id": "need", "title": "2 · 모든 비용을 대신 내주면 가입과 행동도 바뀝니다"}, {"id": "names", "title": "3 · 위험 풀·면책·한도를 구분합니다"}, {"id": "mechanism", "title": "4 · 300만 원 손실에서 지급 230만 원과 부담 70만 원이 갈립니다"}, {"id": "source", "title": "5 · NAIC의 계약 설명은 보장된 사건을 기준으로 지급합니다"}, {"id": "comparison", "title": "6 · 미국의 일반 주택보험과 홍수보험은 보장 범위가 다릅니다"}, {"id": "limits", "title": "7 · 동시에 500명이 손해를 입으면 인원수만으로 버틸 수 없습니다"}],
    component: () => import("@/pages/articles/institutions/insurance-risk-pooling"),
  },
  {
    slug: "healthcare-payment-systems",
    title: "의료비는 환자·보험자·정부·병원 사이를 돌아서 움직인다",
    subcategory: "institutions-risk",
    sections: [{"id": "overview", "title": "S · 진료실에서 낸 돈 밖에도 비용을 낸 사람이 있습니다"}, {"id": "black-box", "title": "B · 미리 모은 돈과 창구에서 낸 돈이 병원에서 합쳐집니다"}, {"id": "case", "title": "0 · 10만 원 진료에서 환자 2만 원과 다른 지급 8만 원이 합쳐집니다"}, {"id": "picture", "title": "1 · 지급자는 보장 대상과 가격을 확인합니다"}, {"id": "need", "title": "2 · 아픈 시점의 소득만으로 치료비를 감당하기 어렵습니다"}, {"id": "names", "title": "3 · 재원 조달·위험 풀·구매라는 세 기능입니다"}, {"id": "mechanism", "title": "4 · 건수로 주는 돈과 묶어서 주는 돈은 다른 선택을 만듭니다"}, {"id": "source", "title": "5 · WHO의 위험 공유 목적을 8만 원에 적용합니다"}, {"id": "comparison", "title": "6 · 한국·잉글랜드·미국의 지급 규칙은 적용 범위부터 다릅니다"}, {"id": "limits", "title": "7 · 비용을 줄였을 때 대기와 건강 결과도 확인합니다"}],
    component: () => import("@/pages/articles/institutions/healthcare-payment-systems"),
  },
  {
    slug: "public-budget-and-taxes",
    title: "세금은 국가가 서비스를 사는 돈이고 예산은 우선순위의 기록이다",
    subcategory: "institutions-country",
    sections: [{"id": "overview", "title": "S · 국가가 올해 쓰는 돈과 미래의 약속을 함께 읽습니다"}, {"id": "black-box", "title": "B · 걷고 빌린 뒤 승인받은 곳에 지급합니다"}, {"id": "case", "title": "0 · 세금 80과 새 차입 20으로 지출 100을 맞춥니다"}, {"id": "picture", "title": "1 · 지금 소비한 서비스와 앞으로 쓸 자산을 나눕니다"}, {"id": "need", "title": "2 · 현금 부족과 자산의 증가는 다른 사실입니다"}, {"id": "names", "title": "3 · 세입·비용·자산 취득·금융 조달을 구분합니다"}, {"id": "mechanism", "title": "4 · 같은 해에 순운영수지 0과 순차입 20이 함께 나옵니다"}, {"id": "source", "title": "5 · IMF의 순운영수지 문장을 그대로 계산합니다"}, {"id": "comparison", "title": "6 · 중앙정부만 볼지 지방과 사회보험까지 볼지 정합니다"}, {"id": "limits", "title": "7 · 부채의 통화와 만기가 재정 여력을 바꿉니다"}],
    component: () => import("@/pages/articles/institutions/public-budget-and-taxes"),
  },
  {
    slug: "education-skills-and-signals",
    title: "교육은 기술을 만들고 자격을 보여 주지만 두 효과는 다르다",
    subcategory: "institutions-capacity",
    sections: [{"id": "overview", "title": "S · 교육을 선택할 때 무엇이 달라질지 묻습니다"}, {"id": "black-box", "title": "B · 학습자가 시간을 쓰고 교육기관이 가르치며 고용주가 선택합니다"}, {"id": "case", "title": "0 · 학비 1천만 원 외에 포기한 소득 2천만 원이 있습니다"}, {"id": "picture", "title": "1 · 같은 사람이 일을 더 잘하게 됐는지 살핍니다"}, {"id": "need", "title": "2 · 고용주는 짧은 면접으로 모든 능력을 알기 어렵습니다"}, {"id": "names", "title": "3 · 능력 축적·신호·기회비용을 구분합니다"}, {"id": "mechanism", "title": "4 · 3천만 원을 연 200만 원으로 나누면 15년입니다"}, {"id": "source", "title": "5 · OECD의 교육 재정은 돈의 처음 출처를 구분합니다"}, {"id": "comparison", "title": "6 · 영국의 소득 연계 상환은 대출 잔액만으로 월 부담을 정하지 않습니다"}, {"id": "limits", "title": "7 · 평균 임금 차이는 개인에게 약속된 수익이 아닙니다"}],
    component: () => import("@/pages/articles/institutions/education-skills-and-signals"),
  },
  {
    slug: "media-attention-and-public-belief",
    title: "정보는 사실이 전달되는 길과 주목을 파는 시장을 동시에 지난다",
    subcategory: "institutions-country",
    sections: [{"id": "overview", "title": "S · 사람들이 보는 정보의 순서도 시장을 움직입니다"}, {"id": "black-box", "title": "B · 정보가 제작자와 배치 담당을 거쳐 독자에게 갑니다"}, {"id": "case", "title": "0 · 100개 중 10개가 반복 보이는 화면을 가정합니다"}, {"id": "picture", "title": "1 · 순서가 바뀌면 보지 못한 정보도 생깁니다"}, {"id": "need", "title": "2 · 취재비를 회수하는 방식이 제작과 배치에 영향을 줍니다"}, {"id": "names", "title": "3 · 노출과 수입, 원인을 구별하는 이름을 붙입니다"}, {"id": "mechanism", "title": "4 · 1천 회 노출에서 20번 클릭과 2건 구매를 분리합니다"}, {"id": "source", "title": "5 · EU 원문은 추천의 주요 기준을 설명하게 합니다"}, {"id": "comparison", "title": "6 · 미국의 광고 관계 공개는 추천 기준 공개와 다른 질문입니다"}, {"id": "limits", "title": "7 · 같은 관심을 가진 비교 대상이 없으면 원인을 확정하기 어렵습니다"}],
    component: () => import("@/pages/articles/institutions/media-attention-and-public-belief"),
  },
  {"slug": "how-to-read-a-country", "title": "어느 나라든 일곱 장부로 읽는 법", "subcategory": "institutions-country", "sections": [{"id": "overview", "title": "나라의 별명보다 누가 벌고 누가 부담하는지 봅니다"}, {"id": "black-box", "title": "사람·물건·돈·결정이 국경을 오갑니다"}, {"id": "case", "title": "수출 100·밖에서 산 부품 60·갚을 외화 30을 놓습니다"}, {"id": "picture", "title": "판매 100에서 밖으로 60이 나가고 안쪽에 40이 남습니다"}, {"id": "need", "title": "전력 부족은 생산뿐 아니라 생활과 정치에도 닿습니다"}, {"id": "names", "title": "일곱 장부는 따로 적고 서로 연결합니다"}, {"id": "mechanism", "title": "A국의 40이 생활과 상환 능력이 되려면 조건이 더 필요합니다"}, {"id": "source", "title": "World Bank의 자료 설명을 A국 장부에 적용합니다"}, {"id": "comparison", "title": "250개 국가·지역을 같은 질문으로 탐색합니다"}, {"id": "limits", "title": "국가에 관한 주장은 틀릴 수 있는 질문으로 바꿉니다"}], "component": () => import("@/pages/articles/institutions/how-to-read-a-country")},
  {"slug": "population-migration-and-care", "title": "인구·이주·돌봄은 사람 수를 일할 시간과 생활 수요로 바꾼다", "subcategory": "institutions-capacity", "sections": [{"id": "overview", "title": "사람이 많다는 말만으로 시장의 크기를 알 수 없습니다"}, {"id": "black-box", "title": "사람은 들어오고 나가며 남은 사람도 나이를 먹습니다"}, {"id": "case", "title": "100명과 하루 8시간을 기준으로 삼습니다"}, {"id": "picture", "title": "태어난 사람과 들어온 사람을 같은 바구니에 더합니다"}, {"id": "need", "title": "나이가 같아도 일할 수 있는 조건이 다릅니다"}, {"id": "names", "title": "인구 장부·연령 부양비·돌봄 노동이라는 이름을 붙입니다"}, {"id": "mechanism", "title": "102명이라는 결과와 가계의 1만원은 다른 경로에서 나옵니다"}, {"id": "source", "title": "UN은 같은 나이 집단을 한 해씩 앞으로 옮깁니다"}, {"id": "comparison", "title": "ILO의 돌봄 범위에는 가정에서 보낸 4시간도 들어갑니다"}, {"id": "limits", "title": "인구 구성은 조건이며 한 나라의 운명표는 아닙니다"}], "component": () => import("@/pages/articles/institutions/population-migration-and-care")},
  {"slug": "culture-norms-and-coordination", "title": "문화와 규범은 서로의 행동을 예상하고 함께 일하는 방식을 바꾼다", "subcategory": "institutions-country", "sections": [{"id": "overview", "title": "계약서에 적지 않은 예상도 사람을 움직입니다"}, {"id": "black-box", "title": "약속한 일·실제 행동·다음 판단이 이어집니다"}, {"id": "case", "title": "가게 10곳이 2만원씩 모아 16만원의 청소비를 냅니다"}, {"id": "picture", "title": "깨끗해진 거리만 봐서는 누가 비용을 냈는지 알 수 없습니다"}, {"id": "need", "title": "분담·관찰·이의 절차가 각각 다른 문제를 해결합니다"}, {"id": "names", "title": "사회 규범은 다른 사람이 무엇을 할지에 대한 기대를 포함합니다"}, {"id": "mechanism", "title": "미납이 2곳일 때와 3곳일 때 결과가 달라집니다"}, {"id": "source", "title": "같은 문화 안에서도 시간과 장소에 따라 규칙은 달라집니다"}, {"id": "comparison", "title": "잘 작동하는 관행도 참여자의 권리를 확인해야 합니다"}, {"id": "limits", "title": "문화라는 한 단어 뒤에 비용과 권력이 숨을 수 있습니다"}], "component": () => import("@/pages/articles/institutions/culture-norms-and-coordination")},
  {"slug": "evidence-measurement-and-causality", "title": "숫자를 믿기 전에 무엇을 재고 무엇과 비교했는지 묻는다", "subcategory": "institutions-capacity", "sections": [{"id": "overview", "title": "10이 8이 되었다는 관찰과 원인을 안다는 말은 다릅니다"}, {"id": "black-box", "title": "대상을 고르고 재고 비교한 뒤 주장을 만듭니다"}, {"id": "case", "title": "A와 B는 각 10가구이며 처음에는 모두 평균 10입니다"}, {"id": "picture", "title": "A의 변화에서 B의 변화를 한 번 더 뺍니다"}, {"id": "need", "title": "계기·대상·동시 변화가 각각 비교를 흔듭니다"}, {"id": "names", "title": "반복성·반사실·교란을 구분합니다"}, {"id": "mechanism", "title": "추가감소 1을 원인으로 읽을 수 있는 조건을 적습니다"}, {"id": "source", "title": "NIST의 반복 조건을 계기 기록에 적용합니다"}, {"id": "comparison", "title": "무작위 배정은 참여한 사람들의 개입을 정하는 절차입니다"}, {"id": "limits", "title": "효과의 크기·불확실성·적용 범위를 함께 보고합니다"}], "component": () => import("@/pages/articles/institutions/evidence-measurement-and-causality")},
];
