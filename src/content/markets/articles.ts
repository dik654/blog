import type { Article } from "../types";

export const marketsArticles: Article[] = [
  {
    slug: "bond-pricing-and-yield-curve",
    title: "채권 가격과 수익률은 같은 정보를 반대 방향으로 적은 것입니다",
    subcategory: "markets-bond",
    sections: [
      {
        id: "overview",
        title: "채권은 2편의 할인 식에 현금흐름을 꽂아 넣은 첫 사례입니다",
      },
      {
        id: "cashflow-to-price",
        title: "부품 1. 현금흐름이 적혀 있으면 가격은 계산의 결과입니다",
      },
      {
        id: "ytm",
        title: "부품 2. 시장 가격을 식에 거꾸로 넣으면 수익률 하나가 나옵니다",
        subsections: [
          { id: "ytm-assumption", title: "만기수익률은 실제로 얻게 될 수익률이 아닙니다" },
        ],
      },
      {
        id: "duration",
        title: "부품 3. 가격이 얼마나 흔들릴지는 현금흐름의 무게중심이 정합니다",
        subsections: [
          { id: "duration-use", title: "같은 만기라도 듀레이션은 다를 수 있습니다" },
        ],
      },
      {
        id: "yield-curve",
        title: "부품 4. 만기마다 금리가 다르므로 하나의 y로는 부족합니다",
        subsections: [
          { id: "curve-shapes", title: "곡선이 뒤집히면 무엇을 읽어야 하는가" },
        ],
      },
      {
        id: "boundary",
        title: "현금흐름이 적혀 있지 않은 청구권은 어떻게 값을 매길까요",
      },
    ],
    component: () => import("@/pages/articles/markets/bond-pricing-and-yield-curve"),
  },
  {
    slug: "equity-claims-and-valuation",
    title: "주주는 아무것도 약속받지 못한 대신 남는 것을 전부 갖습니다",
    subcategory: "markets-equity",
    sections: [
      {
        id: "overview",
        title: "같은 회사에 걸린 청구권들이 순위대로 줄을 서 있습니다",
      },
      {
        id: "residual-claim",
        title: "부품 1. 마지막 순위이면서 아래가 막혀 있다는 것이 핵심입니다",
      },
      {
        id: "leverage",
        title: "부품 2. 같은 사업이라도 빚을 섞으면 주주 몫의 진폭이 커집니다",
        subsections: [
          {
            id: "structure-neutrality",
            title: "그렇다면 빚을 늘리는 것만으로 회사가 더 가치 있어질까요",
          },
        ],
      },
      {
        id: "ddm",
        title: "부품 3. 적혀 있지 않은 현금흐름은 모양을 가정해야 합니다",
      },
      {
        id: "multiples",
        title: "부품 4. 실무는 가정을 줄이는 대신 비교 대상을 빌려 씁니다",
        subsections: [
          { id: "multiple-traps", title: "배수를 비교할 때 자주 어긋나는 지점" },
        ],
      },
      {
        id: "boundary",
        title: "분자를 다뤘으니 남은 것은 분모입니다",
      },
    ],
    component: () => import("@/pages/articles/markets/equity-claims-and-valuation"),
  },
  {
    slug: "financial-products-and-claims",
    title: "금융상품은 누가 언제 무엇을 지급하는지로 구별한다",
    subcategory: "markets-products",
    sections: [{"id": "overview", "title": "1. 상품 이름보다 내가 받을 권리부터 읽습니다"}, {"id": "black-box", "title": "2. 판매한 사람과 실제로 갚는 사람이 다를 수 있습니다"}, {"id": "case", "title": "3. 1000만 원을 맡긴 경우와 1000만 원을 빌린 경우를 비교합니다"}, {"id": "picture", "title": "4. 계약에서 지급 조건과 출구를 찾습니다"}, {"id": "need", "title": "5. 돈이 필요한 시점과 떠안을 위험이 다르기 때문에 상품이 갈립니다"}, {"id": "names", "title": "6. 상품 이름을 지급 구조에 대응시킵니다"}, {"id": "mechanism", "title": "7. 같은 연 6%라도 갚는 일정에 따라 총이자가 다릅니다"}, {"id": "source", "title": "8. 원금 보장이라는 문구도 지급자의 약속입니다"}, {"id": "comparison", "title": "9. 예금 보호는 같은 창구의 모든 상품에 붙지 않습니다"}, {"id": "limits", "title": "10. 배당률과 약정금리만으로 위험을 줄 세울 수 없습니다"}],
    component: () => import("@/pages/articles/markets/financial-products-and-claims"),
  },
  {
    slug: "funds-etfs-and-etns",
    title: "ETF와 ETN은 거래 화면이 비슷해도 손에 쥔 청구권이 다르다",
    subcategory: "markets-products",
    sections: [{"id": "overview", "title": "1. 같은 숫자를 따라가는 상품도 받을 돈의 근거가 다릅니다"}, {"id": "black-box", "title": "2. 돈을 내는 사람과 돈을 보관하는 곳을 나눕니다"}, {"id": "case", "title": "3. 1만 원어치 자산을 1만100원에 삽니다"}, {"id": "picture", "title": "4. 한 좌의 가치와 체결 가격은 서로 다른 곳에서 정해집니다"}, {"id": "need", "title": "5. 보관과 거래를 분리해야 작은 돈도 여러 자산에 닿습니다"}, {"id": "names", "title": "6. 모은 재산의 지분과 발행자의 채무를 구별합니다"}, {"id": "mechanism", "title": "7. 100원의 괴리는 거래할 수 있을 때 줄어듭니다"}, {"id": "source", "title": "8. 공식 ETF 설명은 보유 자산의 지분을 말합니다"}, {"id": "comparison", "title": "9. 발행자 약속과 일일 목표를 원문에서 읽습니다"}, {"id": "limits", "title": "10. 좋은 지수라도 비싼 체결과 급한 환매는 수익을 깎습니다"}],
    component: () => import("@/pages/articles/markets/funds-etfs-and-etns"),
  },
  {
    slug: "securitization-and-tranches",
    title: "유동화는 대출의 현금흐름을 옮기고 손실을 받는 순서를 나눈다",
    subcategory: "markets-products",
    sections: [{"id": "overview", "title": "1. 미래에 들어올 대출 상환액을 오늘의 자금으로 바꿉니다"}, {"id": "black-box", "title": "2. 돈을 빌린 사람과 최종 투자자 사이에 별도 장부가 놓입니다"}, {"id": "case", "title": "3. 100억 원을 70·20·10으로 나눕니다"}, {"id": "picture", "title": "4. 권리의 이전과 지급 순서를 따로 확인합니다"}, {"id": "need", "title": "5. 안전한 몫을 원하는 사람과 먼저 손실을 받을 사람이 만납니다"}, {"id": "names", "title": "6. 유동화와 트랜치는 재산과 순서를 가리킵니다"}, {"id": "mechanism", "title": "7. 손실 15억 원과 35억 원이 어디에 닿는지 계산합니다"}, {"id": "source", "title": "8. 원문은 세 지급 순서를 실제 구조로 설명합니다"}, {"id": "comparison", "title": "9. 위험 보유 규칙은 지급 보증과 다릅니다"}, {"id": "limits", "title": "10. 많이 묶어도 같은 충격에 함께 무너지면 선순위까지 닿습니다"}],
    component: () => import("@/pages/articles/markets/securitization-and-tranches"),
  },
  {
    slug: "forwards-and-futures",
    title: "선물은 미래 가격을 고정하면서 반대편에 같은 크기의 위험을 건넨다",
    subcategory: "markets-derivatives",
    sections: [{"id": "overview", "title": "1. 앞으로 살 물건의 값이 바뀌면 사업 계획도 바뀝니다"}, {"id": "black-box", "title": "2. 사는 사람과 파는 사람의 약속을 누군가 관리합니다"}, {"id": "case", "title": "3. 100톤을 30만 원에 사기로 약속합니다"}, {"id": "picture", "title": "4. 약속을 계산 가능한 다섯 칸으로 엽니다"}, {"id": "need", "title": "5. 규격을 맞추면 바꾸기 쉽고 지급을 앞당기면 버틸 돈이 필요합니다"}, {"id": "names", "title": "6. 선도·선물·헤지는 서로 다른 질문에 답합니다"}, {"id": "mechanism", "title": "7. 현물 구매와 계약 손익을 합해야 고정된 가격이 보입니다"}, {"id": "source", "title": "8. 거래소의 중간 평가는 만기를 기다리지 않습니다"}, {"id": "comparison", "title": "9. 농가의 위험 감소와 투기자의 위험 증가는 같은 계약에서 생깁니다"}, {"id": "limits", "title": "10. 가격을 고정해도 수확과 현금의 위험은 남습니다"}],
    component: () => import("@/pages/articles/markets/forwards-and-futures"),
  },
  {
    slug: "options-and-asymmetric-payoffs",
    title: "옵션은 손해를 피할 선택권을 사고 그 값으로 프리미엄을 낸다",
    subcategory: "markets-derivatives",
    sections: [{"id": "overview", "title": "1. 불리하면 거래하지 않을 권리에도 가격이 있습니다"}, {"id": "black-box", "title": "2. 작은 선지급과 나중의 큰 의무가 교환됩니다"}, {"id": "case", "title": "3. 100에 살 권리를 8에 삽니다"}, {"id": "picture", "title": "4. 정해진 값·마감일·단위가 지급액을 만듭니다"}, {"id": "need", "title": "5. 기간이 길수록 선택할 여지가 늘고 의무도 오래 남습니다"}, {"id": "names", "title": "6. 콜은 살 권리이고 풋은 팔 권리입니다"}, {"id": "mechanism", "title": "7. 20의 행사 가치에서 8의 구입비를 뺍니다"}, {"id": "source", "title": "8. 공식 권리 문구에는 행사할 의무가 없습니다"}, {"id": "comparison", "title": "9. 같은 20의 차액도 시장의 계약 단위에 따라 달라집니다"}, {"id": "limits", "title": "10. 자주 받는 작은 이익만 보면 드문 큰 손실을 놓칩니다"}],
    component: () => import("@/pages/articles/markets/options-and-asymmetric-payoffs"),
  },
  {
    slug: "covered-calls-and-income-funds",
    title: "커버드콜은 상승 일부를 팔아 현금을 받고 주가 하락은 감당한다",
    subcategory: "markets-derivatives",
    sections: [{"id": "overview", "title": "1. 매달 받는 돈이 전체 재산의 증가를 뜻하지는 않습니다"}, {"id": "black-box", "title": "2. 주식을 가진 사람이 미래의 구매자에게 선택권을 줍니다"}, {"id": "case", "title": "3. 100에 산 주식 100주에 105의 판매 약속을 붙입니다"}, {"id": "picture", "title": "4. 손익을 주식과 판매 약속의 두 줄로 나눕니다"}, {"id": "need", "title": "5. 가까운 현금을 얻는 대신 큰 상승의 몫을 줄입니다"}, {"id": "names", "title": "6. 주식 보유와 콜 매도를 결합한 것이 커버드콜입니다"}, {"id": "mechanism", "title": "7. 90·103·120에서 손익은 −700·600·800달러입니다"}, {"id": "source", "title": "8. 공식 설명의 최대 이익에 105·100·3을 넣습니다"}, {"id": "comparison", "title": "9. 실제 ETF는 매도 비율과 만기·분배 재원을 확인합니다"}, {"id": "limits", "title": "10. 분배 이후에도 하락·재매도·세금·환율이 남습니다"}],
    component: () => import("@/pages/articles/markets/covered-calls-and-income-funds"),
  },
  {
    slug: "swaps-and-credit-risk",
    title: "스왑은 서로 다른 조건의 현금흐름을 교환한다",
    subcategory: "markets-derivatives",
    sections: [{"id": "overview", "title": "1. 빚을 없애지 않고 갚는 방식만 바꿀 수 있습니다"}, {"id": "black-box", "title": "2. 빌린 곳에 갚고 다른 곳에서 일부를 돌려받습니다"}, {"id": "case", "title": "3. 10억 원의 4%와 6% 차이는 2000만 원입니다"}, {"id": "picture", "title": "4. 같은 숫자를 곱해도 날짜와 기준이 다르면 어긋납니다"}, {"id": "need", "title": "5. 필요한 위험만 바꾸면 원금을 다시 조달할 필요가 줄어듭니다"}, {"id": "names", "title": "6. 스왑의 두 지급 흐름과 신용 보호를 이름 붙입니다"}, {"id": "mechanism", "title": "7. 6%가 2%가 되어도 합친 부담은 4%입니다"}, {"id": "source", "title": "8. 고정 지급 원문에 명목원금과 기간을 대입합니다"}, {"id": "comparison", "title": "9. 신용 보호는 손실이 아니라 계약의 사건을 보고 지급합니다"}, {"id": "limits", "title": "10. 명목원금도 현재 시가도 최악의 손실과 같지 않습니다"}],
    component: () => import("@/pages/articles/markets/swaps-and-credit-risk"),
  },
];
