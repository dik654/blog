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
  {
    slug: "no-arbitrage-cost-of-carry-and-basis",
    title: "선물 가격은 전망보다 먼저 보유비용으로 묶인다: 무차익·베이시스",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"현물 100과 1년 뒤 인도 가격 108을 함께 봅니다"},{"id":"black-box","title":"현물 매수·자금 조달·보유 수입·선물 매도를 한 묶음으로 엽니다"},{"id":"case","title":"100을 빌려 사고 2를 받은 뒤 108에 넘깁니다"},{"id":"picture","title":"미래 전망과 지금 복제할 수 있는 가격을 구분합니다"},{"id":"need","title":"서로 복제되는 현금흐름의 가격이 오래 벌어질 수 없습니다"},{"id":"names","title":"무차익 가격·보유비용·베이시스에 이름을 붙입니다"},{"id":"mechanism","title":"가격 차이가 거래를 부르고 만기에 0으로 모이는 경로를 봅니다"},{"id":"source","title":"CME의 공정가치 식에 자금비용과 배당을 넣습니다"},{"id":"comparison","title":"대학 파생상품론은 가격 결정과 가격 예측을 다른 문제로 둡니다"},{"id":"limits","title":"차입·공매도·세금·보관 제약이 있으면 띠가 넓어집니다"}],
    component: () => import("@/pages/articles/markets/derivatives/no-arbitrage-cost-of-carry-and-basis"),
  },
  {
    slug: "clearing-margin-and-default-waterfall",
    title: "선물의 이익과 손실은 매일 현금으로 움직인다: 청산·증거금",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"만기에는 이익이어도 오늘 현금이 모자랄 수 있습니다"},{"id":"black-box","title":"고객·중개사·청산회원·중앙청산소의 장부를 나눕니다"},{"id":"case","title":"증거금 12에서 하루 손실 8이 빠져 추가 납부가 생깁니다"},{"id":"picture","title":"계약 가치와 담보 잔액과 실제 현금을 구분합니다"},{"id":"need","title":"손실을 매일 옮겨 부도가 쌓이기 전에 드러냅니다"},{"id":"names","title":"중앙청산·개시증거금·변동증거금과 손실 분담 순서에 이름을 붙입니다"},{"id":"mechanism","title":"체결에서 일일정산과 채무불이행 처리까지 따라갑니다"},{"id":"source","title":"CFTC의 스트레스 시험이 두 증거금의 역할을 나눕니다"},{"id":"comparison","title":"규정의 손실 분담 순서는 누가 먼저 돈을 내는지 보여 줍니다"},{"id":"limits","title":"청산소가 있어도 유동성·집중·모형 위험은 남습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/clearing-margin-and-default-waterfall"),
  },
  {
    slug: "option-replication-and-put-call-parity",
    title: "옵션 가격은 같은 지급을 만드는 주식과 현금에서 출발한다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"주가가 120 또는 80이 되는 한 기간 시장에서 시작합니다"},{"id":"black-box","title":"옵션의 미래 지급을 주식과 빚의 조합으로 다시 만듭니다"},{"id":"case","title":"주식 반 주와 빚 40이 콜의 20 또는 0을 그대로 만듭니다"},{"id":"picture","title":"실제 확률과 가격을 맞추는 가중치를 구분합니다"},{"id":"need","title":"같은 미래 지급에는 같은 오늘 가격이 필요합니다"},{"id":"names","title":"복제 포트폴리오·위험중립 가격·풋콜 등식에 이름을 붙입니다"},{"id":"mechanism","title":"두 미래 상태를 맞춰 델타와 오늘 가격을 풉니다"},{"id":"source","title":"MIT의 이항모형 순서로 복제 가격을 확인합니다"},{"id":"comparison","title":"OIC의 풋콜 등식으로 네 계약의 값을 맞춥니다"},{"id":"limits","title":"연속 거래와 고정 변동성을 현실의 약속으로 보지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/option-replication-and-put-call-parity"),
  },
  {
    slug: "option-greeks-volatility-and-dynamic-hedging",
    title: "옵션 손익은 가격·시간·변동성 변화가 함께 만든다: 그릭스와 헤지",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"기초자산이 그대로여도 옵션 가격이 바뀌는 날에서 시작합니다"},{"id":"black-box","title":"가격·곡률·시간·변동성의 네 움직임을 따로 엽니다"},{"id":"case","title":"주가 2 상승·변동성 5포인트 상승·하루 경과를 근사합니다"},{"id":"picture","title":"한 번의 민감도와 계속 고쳐야 하는 헤지를 구분합니다"},{"id":"need","title":"옵션의 위험은 만기 손익표 한 장에 다 보이지 않습니다"},{"id":"names","title":"델타와 감마·내재변동성·동적 헤지와 모형 위험에 이름을 붙입니다"},{"id":"mechanism","title":"시장 이동 뒤 델타가 바뀌어 다시 거래하는 과정을 봅니다"},{"id":"source","title":"OIC의 그릭스를 설명용 수치에 적용합니다"},{"id":"comparison","title":"OCC의 위험 설명은 모형값과 실제 계약 손실을 연결합니다"},{"id":"limits","title":"그릭스를 정확한 예언이나 독립된 손익으로 더하지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/option-greeks-volatility-and-dynamic-hedging"),
  },
  {
    slug: "interest-rate-derivatives-from-fra-to-swaptions",
    title: "한 번의 금리 고정이 스왑·캡·스왑션으로 이어진다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"3개월 뒤부터 적용될 대출 금리를 오늘 정합니다"},{"id":"black-box","title":"명목금액·기준금리·기간·지급 방향을 네 칸으로 엽니다"},{"id":"case","title":"10억 원에서 4%와 6%의 3개월 차이는 약 500만 원입니다"},{"id":"picture","title":"한 기간 계약과 여러 기간 계약과 선택권을 겹쳐 봅니다"},{"id":"need","title":"대출 원금을 옮기지 않고 금리 변화만 나눌 수 있습니다"},{"id":"names","title":"FRA·캡과 플로어·스왑션과 스왑곡선에 이름을 붙입니다"},{"id":"mechanism","title":"한 기간의 차액이 스왑 다발과 옵션 보호로 이어집니다"},{"id":"source","title":"MIT의 금리 과정이 곡선에서 스왑과 옵션으로 이어집니다"},{"id":"comparison","title":"CME의 SOFR 사례로 현물 계약과 선물 묶음을 대조합니다"},{"id":"limits","title":"명목금액·듀레이션·담보 할인·기준금리 위험을 섞지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/interest-rate-derivatives-from-fra-to-swaptions"),
  },
  {
    slug: "derivatives-suitability-disclosure-and-sales-practice",
    title: "파생상품 판매는 고객 정보·적합성·설명·기록을 남기는 일이다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"수출기업에 환헤지 상품을 권하는 상담에서 시작합니다"},{"id":"black-box","title":"고객 상황·상품 손익·대안·이해 확인을 한 줄로 잇습니다"},{"id":"case","title":"월 1억 달러 매출에 2억 달러 의무를 붙이면 위험이 커집니다"},{"id":"picture","title":"권유가 있는 적합성과 스스로 찾은 거래의 적정성을 구분합니다"},{"id":"need","title":"같은 상품도 고객의 목적과 감당 능력에 따라 달라집니다"},{"id":"names","title":"적합성·핵심 위험 설명·판매 과정의 증거에 이름을 붙입니다"},{"id":"mechanism","title":"정보 수집에서 이해 확인과 사후 기록까지 따라갑니다"},{"id":"source","title":"금융소비자보호법의 적합성과 설명 절차를 상담에 대입합니다"},{"id":"comparison","title":"투자권유자문 과정은 상품 지식과 윤리·분쟁을 함께 둡니다"},{"id":"limits","title":"자격증·서명·수익 결과 하나로 올바른 판매를 판정하지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/derivatives-suitability-disclosure-and-sales-practice"),
  },
  {
    slug: "currency-hedging-forward-points-and-cross-currency-basis",
    title: "환헤지는 받을 돈과 낼 돈을 맞춘 뒤 선도포인트와 베이시스를 본다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"석 달 뒤 받을 100만 달러의 원화 매출부터 봅니다"},{"id":"black-box","title":"매출·원가·통화·날짜를 따로 엽니다"},{"id":"case","title":"금리 차이를 넣으면 석 달 선도는 약 1,343원입니다"},{"id":"picture","title":"환율 위험과 매출량 위험을 두 갈래로 봅니다"},{"id":"need","title":"같은 달러라도 만기와 기준이 다르면 위험이 남습니다"},{"id":"names","title":"순통화노출·선도포인트·교차통화 베이시스에 이름을 붙입니다"},{"id":"mechanism","title":"노출을 찾고 비율을 정한 뒤 만기마다 다시 맞춥니다"},{"id":"source","title":"CME의 두 통화 보유비용 식을 사례에 적용합니다"},{"id":"comparison","title":"BIS의 교차통화 베이시스는 세계 자금 흐름의 압력을 보여 줍니다"},{"id":"limits","title":"환율을 없애려다 수량·유동성·상대방 위험을 만들지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/currency-hedging-forward-points-and-cross-currency-basis"),
  },
  {
    slug: "commodity-carry-convenience-yield-and-roll",
    title: "원자재 선물은 창고·편의수익·인도와 롤오버를 함께 봐야 한다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"공장에 지금 필요한 원유와 석 달 뒤 선물을 구분합니다"},{"id":"black-box","title":"현물·창고·자금·인도 약속을 네 칸으로 엽니다"},{"id":"case","title":"현물 75달러에 비용 1.75와 편익 2를 넣으면 74.75달러입니다"},{"id":"picture","title":"콘탱고·백워데이션과 롤 손익을 한 줄로 봅니다"},{"id":"need","title":"가격 헤지와 실제 납품은 다른 일을 해결합니다"},{"id":"names","title":"편의수익·선물곡선·롤수익에 이름을 붙입니다"},{"id":"mechanism","title":"재고가 줄면 편의수익과 가까운 만기 가격이 함께 움직입니다"},{"id":"source","title":"CME의 콘탱고·백워데이션 설명에 재고 장부를 넣습니다"},{"id":"comparison","title":"WTI 인도 규칙은 화면 가격을 쿠싱의 원유와 연결합니다"},{"id":"limits","title":"곡선 모양을 수익 보장이나 재고의 단일 신호로 읽지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/commodity-carry-convenience-yield-and-roll"),
  },
  {
    slug: "option-strategies-and-structured-notes",
    title: "구조화 상품은 채권과 옵션으로 풀어 지급식과 꼬리손실을 읽는다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"원금 100을 채권과 선택권으로 다시 나눕니다"},{"id":"black-box","title":"채권·옵션·수수료·중도매각 가격을 따로 엽니다"},{"id":"case","title":"채권 92와 옵션 예산 8이 만기 지급 모양을 만듭니다"},{"id":"picture","title":"스프레드·스트래들·장벽·디지털을 지급식으로 봅니다"},{"id":"need","title":"쿠폰이 생기는 반대편 의무를 찾아야 합니다"},{"id":"names","title":"옵션 조합·내재 옵션·장벽 조건에 이름을 붙입니다"},{"id":"mechanism","title":"지급식을 그린 뒤 각 구간의 최대손익을 검산합니다"},{"id":"source","title":"OIC의 콜스프레드 지급을 상품 부품에 적용합니다"},{"id":"comparison","title":"SEC의 구조화채권 설명은 발행자 신용과 유동성을 다시 붙입니다"},{"id":"limits","title":"익숙한 이름과 높은 쿠폰이 꼬리손실을 가리지 않게 합니다"}],
    component: () => import("@/pages/articles/markets/derivatives/option-strategies-and-structured-notes"),
  },
  {
    slug: "credit-derivatives-default-risk-and-tranches",
    title: "CDS는 부도 손실을 옮기고 지수 트랜치는 손실 순서를 나눈다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"회사채를 팔지 않고 부도 손실만 옮깁니다"},{"id":"black-box","title":"기준기업·보호매수자·보호매도자·결제를 따로 엽니다"},{"id":"case","title":"연 2% 프리미엄과 회수율 40%의 지급을 계산합니다"},{"id":"picture","title":"단일기업에서 지수와 트랜치로 넓힙니다"},{"id":"need","title":"부도확률과 손실률과 함께 부도날 가능성을 나눕니다"},{"id":"names","title":"CDS 스프레드·회수율·손실 트랜치에 이름을 붙입니다"},{"id":"mechanism","title":"신용사건 판단에서 경매와 지급까지 따라갑니다"},{"id":"source","title":"ISDA 결정 절차는 사건과 결제 기준을 공동으로 정합니다"},{"id":"comparison","title":"BIS의 지수 트랜치는 평균 부도보다 상관을 거래합니다"},{"id":"limits","title":"신용보호가 상대방·베이시스·잘못된 방향의 위험을 남깁니다"}],
    component: () => import("@/pages/articles/markets/derivatives/credit-derivatives-default-risk-and-tranches"),
  },
  {
    slug: "otc-master-agreement-collateral-netting-and-cva",
    title: "장외파생의 실제 위험은 기본계약·상계·담보·CVA가 함께 정한다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"거래 네 건의 총액 16을 마지막 한 금액 2로 줄입니다"},{"id":"black-box","title":"기본계약·확인서·담보부속서·운영 장부를 따로 엽니다"},{"id":"case","title":"순노출 2에서 담보 1.5를 빼면 남은 노출은 0.5입니다"},{"id":"picture","title":"거래 체결부터 종료까지 한 요청을 따라갑니다"},{"id":"need","title":"오늘의 순가치와 부도 때까지 커질 미래노출을 나눕니다"},{"id":"names","title":"일괄상계·CSA 담보·CVA에 이름을 붙입니다"},{"id":"mechanism","title":"순액·담보·예상손실을 차례로 계산합니다"},{"id":"source","title":"ISDA의 종료 사례는 총액 16이 순액 2가 되는 법적 경로를 보여 줍니다"},{"id":"comparison","title":"바젤의 CVA는 상대 신용과 시장 가격이 함께 움직이는 손실을 봅니다"},{"id":"limits","title":"계약 표준화가 법률·운영·모형 위험을 없애지는 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/otc-master-agreement-collateral-netting-and-cva"),
  },
  {
    slug: "var-expected-shortfall-stress-and-model-risk",
    title: "시장위험은 VaR의 문턱, 예상손실의 꼬리, 스트레스의 사건으로 본다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"열 번의 손실 가운데 평범한 나쁜 날과 최악의 꼬리를 나눕니다"},{"id":"black-box","title":"포지션·시장 충격·가격 모형·보유기간을 따로 엽니다"},{"id":"case","title":"80% VaR는 4이고 그 바깥 평균인 ES는 8입니다"},{"id":"picture","title":"같은 장부에 스트레스 손실 18을 추가합니다"},{"id":"need","title":"그릭스와 VaR·ES와 스트레스는 서로 다른 질문에 답합니다"},{"id":"names","title":"VaR·예상손실·스트레스 시험에 이름을 붙입니다"},{"id":"mechanism","title":"데이터에서 한도와 행동까지 이어지는 과정을 봅니다"},{"id":"source","title":"바젤은 97.5% ES와 유동성 기간을 시장위험 기준에 넣습니다"},{"id":"comparison","title":"바젤의 스트레스 원칙은 모형 결과보다 사용과 검증을 묻습니다"},{"id":"limits","title":"낮은 VaR를 안전의 증명으로 쓰지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/var-expected-shortfall-stress-and-model-risk"),
  },
  {
    slug: "minimum-variance-hedge-ratio-and-basis-risk",
    title: "헤지 계약 수는 금액보다 두 가격이 함께 움직인 기록으로 정한다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 재고 1,000개의 가격 흔들림을 선물로 줄입니다"},{"id":"black-box","title":"2. 재고 변화·선물 변화·계약 크기를 따로 엽니다"},{"id":"case","title":"3. 함께 움직이는 기울기 0.8이면 32계약을 팝니다"},{"id":"picture","title":"4. 40계약과 32계약의 남은 흔들림을 비교합니다"},{"id":"need","title":"5. 과거의 0.8이 다음 석 달에도 같은지 묻습니다"},{"id":"names","title":"6. 최소분산 헤지비율·베이시스 위험·동적 재조정에 이름을 붙입니다"},{"id":"mechanism","title":"7. 자료 창과 비용을 바꾸며 계약 수를 다시 계산합니다"},{"id":"source","title":"8. CME의 주가지수 선물 헤지비율을 재고 사례에 적용합니다"},{"id":"comparison","title":"9. 자격 과정의 헤지는 수익률뿐 아니라 고객 목적과 현금도 묻습니다"},{"id":"limits","title":"10. 가장 작은 과거 분산을 손실 한도나 미래 보장으로 읽지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/minimum-variance-hedge-ratio-and-basis-risk"),
  },
  {
    slug: "binomial-black-scholes-and-early-exercise",
    title: "옵션 가격은 나무를 거꾸로 접으며 조기행사 선택까지 비교한다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 주가가 100에서 두 번 움직이는 나무를 그립니다"},{"id":"black-box","title":"2. 상승·하락·금리·행사 선택을 네 칸으로 엽니다"},{"id":"case","title":"3. 하락 가지에서는 기다린 15.24보다 지금 20이 큽니다"},{"id":"picture","title":"4. 만기만 보는 풋 6.29와 중간 선택이 있는 풋 7.99를 비교합니다"},{"id":"need","title":"5. 나무를 촘촘히 만들면 연속시간 공식에 가까워집니다"},{"id":"names","title":"6. 위험중립 가중치·역진 계산·조기행사 경계에 이름을 붙입니다"},{"id":"mechanism","title":"7. 만기 지급에서 오늘 가격까지 가지를 거꾸로 접습니다"},{"id":"source","title":"8. MIT의 이항 나무는 복제와 조기행사를 같은 계산에 둡니다"},{"id":"comparison","title":"9. OIC는 블랙숄즈와 미국형 이항모형의 쓰임을 구분합니다"},{"id":"limits","title":"10. 정교한 모형도 잘못된 입력과 계약 조건을 고치지는 못합니다"}],
    component: () => import("@/pages/articles/markets/derivatives/binomial-black-scholes-and-early-exercise"),
  },
  {
    slug: "implied-volatility-surface-skew-and-smile",
    title: "옵션 가격의 변동성은 행사가와 만기마다 다른 표면을 만든다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 같은 주식·같은 만기 옵션 세 개의 변동성이 다릅니다"},{"id":"black-box","title":"2. 시장가격·행사가·만기·가격모형을 따로 엽니다"},{"id":"case","title":"3. 110 콜 24%에서 90 풋 30%를 빼면 −6 변동성포인트입니다"},{"id":"picture","title":"4. 한 달 곡선 위에 세 달·여섯 달 곡선을 쌓습니다"},{"id":"need","title":"5. 포트폴리오는 표면 전체가 움직일 때 손익이 납니다"},{"id":"names","title":"6. 내재변동성 표면·스큐·미소에 이름을 붙입니다"},{"id":"mechanism","title":"7. 호가를 골라 역산하고 보간한 뒤 다시 가격을 검사합니다"},{"id":"source","title":"8. CME의 스큐는 같은 델타의 풋과 콜을 비교합니다"},{"id":"comparison","title":"9. 바젤은 행사가와 만기 축의 변동성 위험을 함께 요구합니다"},{"id":"limits","title":"10. 표면은 확률 예언 지도가 아니라 현재 상대가격의 정리입니다"}],
    component: () => import("@/pages/articles/markets/derivatives/implied-volatility-surface-skew-and-smile"),
  },
  {
    slug: "yield-curve-bootstrapping-multicurve-and-key-rate-hedging",
    title: "금리곡선은 할인계수를 차례로 풀고 만기별 위험을 따로 헤지한다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 1년 가격 96과 2년 고정금리 5%에서 시작합니다"},{"id":"black-box","title":"2. 현금흐름·할인·미래 변동금리를 따로 엽니다"},{"id":"case","title":"3. 100=5×0.96+105×DF₂를 풀면 DF₂는 0.9067입니다"},{"id":"picture","title":"4. 할인계수 두 점에서 지급의 오늘값을 다시 만듭니다"},{"id":"need","title":"5. 할인 곡선과 지급 예상 곡선이 갈리면 베이시스가 생깁니다"},{"id":"names","title":"6. 할인계수 부트스트랩·다중곡선·핵심만기 민감도에 이름을 붙입니다"},{"id":"mechanism","title":"7. 시장상품을 정렬하고 계수를 풀어 민감도를 다시 계산합니다"},{"id":"source","title":"8. CME의 SOFR 곡선은 예상과 할인을 같은 데이터 항목으로 공개합니다"},{"id":"comparison","title":"9. BIS의 기준금리 전환은 할인과 기간 자금 위험을 분리합니다"},{"id":"limits","title":"10. 매끈한 곡선을 유일한 시장 진실로 보지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/yield-curve-bootstrapping-multicurve-and-key-rate-hedging"),
  },
  {
    slug: "xva-funding-margin-and-wrong-way-risk",
    title: "파생상품 가격에는 신용·자금·증거금 비용과 함께 움직이는 위험이 붙는다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 모형가격 10이 실제 거래 장부에서는 9.2가 됩니다"},{"id":"black-box","title":"2. 상대방·자기 신용·자금·개시증거금을 따로 엽니다"},{"id":"case","title":"3. 개시증거금 5의 1년 조달비용은 0.1입니다"},{"id":"picture","title":"4. 노출과 부도 가능성이 함께 커지면 손실이 네 배 넘게 뜁니다"},{"id":"need","title":"5. 담보를 많이 받는 것과 자금 부담을 줄이는 것은 다릅니다"},{"id":"names","title":"6. FVA·MVA·잘못된 방향의 위험에 이름을 붙입니다"},{"id":"mechanism","title":"7. 거래 시나리오마다 노출·담보·부도·자금을 함께 전진시킵니다"},{"id":"source","title":"8. 바젤의 상대방 위험 기준은 담보와 청산기간을 함께 봅니다"},{"id":"comparison","title":"9. ISDA의 담보 운영은 계산값이 실제 자산 이동이 되는 길을 보여 줍니다"},{"id":"limits","title":"10. xVA 합계 하나로 계약·자금·모형 위험을 숨기지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/xva-funding-margin-and-wrong-way-risk"),
  },
  {
    slug: "market-risk-backtesting-pnl-attribution-and-model-governance",
    title: "시장위험 모형은 예외·손익 차이·독립 검증으로 계속 시험한다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 손실이 위험 한도 5를 넘은 날을 표시합니다"},{"id":"black-box","title":"2. 위험값·가상 손익·실제 손익·모형 손익을 따로 엽니다"},{"id":"case","title":"3. 250일에 예외 7번이면 바젤 표의 amber 구간입니다"},{"id":"picture","title":"4. 같은 날 실제 손실 4와 가상 손실 6이 다를 수 있습니다"},{"id":"need","title":"5. 예외 수가 적어도 가격 모형과 위험 모형이 다를 수 있습니다"},{"id":"names","title":"6. 백테스트·P&L 귀속 검사·유효한 독립 검증에 이름을 붙입니다"},{"id":"mechanism","title":"7. 예외 한 건을 거래·자료·모형·운영 원인으로 분해합니다"},{"id":"source","title":"8. 바젤은 250일 예외와 두 종류의 손익을 함께 봅니다"},{"id":"comparison","title":"9. 2026년 미국 은행 지침은 모형 전 생애의 반박 기능을 요구합니다"},{"id":"limits","title":"10. 통과 표시는 모형이 참이라는 증명서가 아닙니다"}],
    component: () => import("@/pages/articles/markets/derivatives/market-risk-backtesting-pnl-attribution-and-model-governance"),
  },
  {
    slug: "brownian-motion-ito-and-risk-neutral-pricing",
    title: "짧은 가격 흔들림의 제곱이 옵션값을 만든다: 브라운 운동·이토·위험중립",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 주가 100이 하루 동안 얼마나 흔들리는지부터 봅니다"},{"id":"black-box","title":"2. 시간의 몫과 무작위 흔들림의 몫을 따로 엽니다"},{"id":"case","title":"3. 하루 흔들림의 제곱은 약 1.59만큼 남습니다"},{"id":"picture","title":"4. 실제 전망과 가격 계산용 세계를 두 장부로 나눕니다"},{"id":"need","title":"5. 경로가 너무 거칠어 보통 미분법만으로는 부족합니다"},{"id":"names","title":"6. 브라운 운동·이토 보정·위험중립 측도에 이름을 붙입니다"},{"id":"mechanism","title":"7. 100의 하루 움직임을 옵션 가격 식까지 다시 따라갑니다"},{"id":"source","title":"8. MIT의 확률계산 강의에서 제곱항이 남는 위치를 확인합니다"},{"id":"comparison","title":"9. MIT의 가격 강의는 복제와 확률 가중치를 같은 결과로 잇습니다"},{"id":"limits","title":"10. 매끈한 경로와 완전한 복제를 시장의 사실로 두지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/brownian-motion-ito-and-risk-neutral-pricing"),
  },
  {
    slug: "monte-carlo-path-dependent-pricing-and-variance-reduction",
    title: "경로를 반복해 가격을 구하고 계산 잡음을 줄인다: 몬테카를로 평가",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 매달 가격 네 개의 평균으로 지급이 정해지는 옵션을 봅니다"},{"id":"black-box","title":"2. 무작위 수·가격 경로·지급·평균의 네 칸으로 엽니다"},{"id":"case","title":"3. 네 지급 5·0·10·0의 평균은 3.75입니다"},{"id":"picture","title":"4. 경로를 더 만드는 방법과 한 경로에서 더 배우는 방법을 나눕니다"},{"id":"need","title":"5. 평균·장벽·조기상환은 지나온 길을 기억해야 합니다"},{"id":"names","title":"6. 몬테카를로 평가·대칭표본·통제변수에 이름을 붙입니다"},{"id":"mechanism","title":"7. 지급 5·0·10·0에서 보고 가능한 가격까지 따라갑니다"},{"id":"source","title":"8. MIT 강의의 두 오차 줄이기 방법을 작은 표본에 적용합니다"},{"id":"comparison","title":"9. 바젤의 모형 검증은 표본오차 밖의 경계도 묻습니다"},{"id":"limits","title":"10. 좁은 신뢰구간을 정확한 시장가치의 증명으로 쓰지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/monte-carlo-path-dependent-pricing-and-variance-reduction"),
  },
  {
    slug: "black-scholes-pde-finite-difference-and-numerical-error",
    title: "만기 지급을 격자로 거슬러 가격을 구한다: 블랙숄즈 방정식과 유한차분",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 만기 직전 주가 90·100·110의 지급부터 봅니다"},{"id":"black-box","title":"2. 시간 변화·기울기·굽음·금리의 네 몫을 엽니다"},{"id":"case","title":"3. 한 칸 뒤로 옮기면 주가 100의 값은 0.2입니다"},{"id":"picture","title":"4. 마지막 줄의 0·0·10을 앞줄 전체로 퍼뜨립니다"},{"id":"need","title":"5. 복잡한 지급과 여러 상태는 닫힌 식으로 풀리지 않습니다"},{"id":"names","title":"6. 블랙숄즈 편미분방정식·유한차분·안정성에 이름을 붙입니다"},{"id":"mechanism","title":"7. 값 0.2를 격자 수렴과 계약 검산까지 따라갑니다"},{"id":"source","title":"8. MIT의 가격 방정식에 0·0·10 격자를 넣습니다"},{"id":"comparison","title":"9. 은행 검증은 식보다 경계·수렴·독립 가격을 다시 봅니다"},{"id":"limits","title":"10. 촘촘한 격자를 정확한 시장모형과 혼동하지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/black-scholes-pde-finite-difference-and-numerical-error"),
  },
  {
    slug: "local-stochastic-volatility-jumps-and-calibration",
    title: "옵션 표면과 큰 가격 이동을 설명한다: 지역·확률변동성·점프",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 같은 만기의 세 옵션이 30%·20%·24%를 요구합니다"},{"id":"black-box","title":"2. 현재 위치·시간 변화·갑작스러운 이동을 따로 엽니다"},{"id":"case","title":"3. 20% 하나의 날개 오차는 모두 14%포인트입니다"},{"id":"picture","title":"4. 지도를 맞추는 함수·움직이는 상태·점프 사건을 겹쳐 봅니다"},{"id":"need","title":"5. 오늘의 완벽한 맞춤과 내일의 좋은 헤지는 다른 시험입니다"},{"id":"names","title":"6. 지역변동성·확률변동성·점프확산에 이름을 붙입니다"},{"id":"mechanism","title":"7. 30%·20%·24%를 맞춘 뒤 −10% 충격까지 다시 계산합니다"},{"id":"source","title":"8. MIT의 변동성 과정에서 시간에 따라 바뀌는 상태를 확인합니다"},{"id":"comparison","title":"9. 바젤은 표면·시간 변화·점프와 상관을 함께 검증합니다"},{"id":"limits","title":"10. 많은 매개변수를 더 정확한 미래 설명으로 읽지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/local-stochastic-volatility-jumps-and-calibration"),
  },
  {
    slug: "short-rate-hjm-and-interest-rate-model-risk",
    title: "한 금리와 곡선 전체의 미래를 그린다: 단기금리·HJM·모형위험",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 오늘 3%인 하루 금리가 내일 어떻게 움직일지 그립니다"},{"id":"black-box","title":"2. 오늘의 한 점·미래 만기들·할인채 가격을 따로 엽니다"},{"id":"case","title":"3. 2년 앞 금리의 차익 없는 평균 몫은 연 2bp입니다"},{"id":"picture","title":"4. 한 점을 움직이는 모형과 곡선 전체를 움직이는 모형을 비교합니다"},{"id":"need","title":"5. 금리 옵션은 오늘 곡선뿐 아니라 미래 곡선의 모양에 가격이 붙습니다"},{"id":"names","title":"6. 단기금리 모형·HJM 틀·금리 모형위험에 이름을 붙입니다"},{"id":"mechanism","title":"7. 3% 한 점과 2년 곡선의 2bp를 같은 거래에 넣어 봅니다"},{"id":"source","title":"8. MIT HJM 강의의 평균 제약에 1%·2년을 넣습니다"},{"id":"comparison","title":"9. 바젤 검증은 보정 상품과 보이지 않는 만기까지 묻습니다"},{"id":"limits","title":"10. 현재 곡선의 완벽한 맞춤을 미래 움직임의 정답으로 보지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/short-rate-hjm-and-interest-rate-model-risk"),
  },
  {
    slug: "hazard-rate-curve-recovery-and-credit-correlation",
    title: "신용 스프레드를 생존과 동시손실로 푼다: 위험강도·회수율·부도상관",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 연 1.2% 보호료와 회수 40%에서 시작합니다"},{"id":"black-box","title":"2. 생존·부도 도착·회수·동시 손실을 따로 엽니다"},{"id":"case","title":"3. 연 2%의 도착 세기는 1년 부도확률 약 1.98%입니다"},{"id":"picture","title":"4. 회사 두 곳의 평균손실과 동시손실을 나눠 봅니다"},{"id":"need","title":"5. 만기별 가격과 손실 순서를 보려면 한 숫자로는 부족합니다"},{"id":"names","title":"6. 위험강도곡선·회수율 가정·부도상관에 이름을 붙입니다"},{"id":"mechanism","title":"7. 1.2%에서 1.98%를 풀고 두 회사의 꼬리까지 따라갑니다"},{"id":"source","title":"8. MIT의 생존식에 연 2%를 그대로 넣습니다"},{"id":"comparison","title":"9. 바젤은 실제 확률과 가격 장부 확률을 구분합니다"},{"id":"limits","title":"10. 스프레드를 부도확률 하나로 완전히 설명하지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/hazard-rate-curve-recovery-and-credit-correlation"),
  },
  {
    slug: "korea-singapore-retail-derivatives-entry-and-knowledge-tests",
    title: "첫 파생상품 주문 앞의 문이 다르다: 한국·싱가포르 진입과 지식 심사",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 파생상품 계좌에 1,000만 원을 넣기 전부터 문이 갈립니다"},{"id":"black-box","title":"2. 사람 분류·이해 확인·거래 허용의 세 문을 엽니다"},{"id":"case","title":"3. 한국의 1·3·1,000과 싱가포르의 6·3을 같은 표에 놓습니다"},{"id":"picture","title":"4. 같은 초보자의 주문이 두 나라에서 멈추는 지점을 봅니다"},{"id":"need","title":"5. 국경을 넘으면 계좌 상태가 그대로 복사되지 않습니다"},{"id":"names","title":"6. 진입 문·지식 심사·적합성에 이름을 붙입니다"},{"id":"mechanism","title":"7. 첫 주문 전에 확인할 장부를 순서대로 다시 따라갑니다"},{"id":"source","title":"8. 한국거래소의 단계별 진입표에 사례 숫자를 대입합니다"},{"id":"comparison","title":"9. 싱가포르는 복잡상품의 지식과 경험을 별도 심사합니다"},{"id":"limits","title":"10. 교육 이수와 예탁금을 안전 보증서로 읽지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/korea-singapore-retail-derivatives-entry-and-knowledge-tests"),
  },
  {
    slug: "eu-uk-cfd-appropriateness-leverage-and-negative-balance",
    title: "현금 100이 노출 3,000이 될 때: EU·영국 CFD 고객 보호",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 현금 100으로 3,000의 환율 CFD를 잡는 주문을 봅니다"},{"id":"black-box","title":"2. 거래 전 심사·거래 중 청산·거래 뒤 잔액을 따로 엽니다"},{"id":"case","title":"3. 1% 이동은 현금의 30%, 50% 청산선은 손실 50입니다"},{"id":"picture","title":"4. 한도를 출발선, 강제 청산을 제동장치로 봅니다"},{"id":"need","title":"5. 이름을 바꾼 영구선물도 지급 구조를 다시 봐야 합니다"},{"id":"names","title":"6. 적정성 심사·상품 개입·마이너스 잔액 보호에 이름을 붙입니다"},{"id":"mechanism","title":"7. 현금 100의 주문을 광고에서 강제 청산까지 따라갑니다"},{"id":"source","title":"8. ESMA의 2026년 영구계약 안내에 지급 구조를 대입합니다"},{"id":"comparison","title":"9. 영국 FCA의 30대 1~2대 1 범위로 노출을 확인합니다"},{"id":"limits","title":"10. 마이너스 잔액 보호를 손실 방지로 오해하지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/eu-uk-cfd-appropriateness-leverage-and-negative-balance"),
  },
  {
    slug: "japan-australia-retail-leverage-and-product-governance",
    title: "같은 현금의 손실 속도가 달라진다: 일본·호주 레버리지와 상품 유통",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 같은 현금 100이 일본에서는 2,500, 호주에서는 상품별로 달라집니다"},{"id":"black-box","title":"2. 증거금률·기초자산·판매 대상의 세 칸을 엽니다"},{"id":"case","title":"3. 1% 이동의 손실은 25·30·2로 갈립니다"},{"id":"picture","title":"4. 일본은 FX 한도를, 호주는 상품군과 유통을 함께 봅니다"},{"id":"need","title":"5. 해외 업체가 ‘전문 고객’ 전환을 권할 때 보호 손실도 계산합니다"},{"id":"names","title":"6. 소매 레버리지 한도·상품별 증거금·목표시장 결정에 이름을 붙입니다"},{"id":"mechanism","title":"7. 현금 100에서 실제 주문 한도까지 다시 따라갑니다"},{"id":"source","title":"8. 일본 금융청의 4% 규칙을 25배로 바꿔 읽습니다"},{"id":"comparison","title":"9. 호주는 레버리지와 목표시장 통제를 함께 집행합니다"},{"id":"limits","title":"10. 25배와 30배를 나라의 위험 순위로 쓰지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/japan-australia-retail-leverage-and-product-governance"),
  },
  {
    slug: "us-derivatives-regulatory-map-and-customer-segregation",
    title: "계약마다 감독 문과 돈 보관함이 다르다: 미국 파생상품 규제 지도",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 금리스왑과 한 회사의 신용스왑이 다른 감독 문으로 갑니다"},{"id":"black-box","title":"2. 상품 관할·거래상대 보호·고객 돈의 세 장부를 엽니다"},{"id":"case","title":"3. 고객 돈 100 중 증거금 20을 맡겨도 100 전체의 표시는 남습니다"},{"id":"picture","title":"4. 계약 이름에서 감독기관과 보관 계정으로 내려갑니다"},{"id":"need","title":"5. 같은 은행 이름 아래에서도 법인과 역할이 달라질 수 있습니다"},{"id":"names","title":"6. 관할 분할·외부 영업행위 기준·고객자금 분리에 이름을 붙입니다"},{"id":"mechanism","title":"7. 한 기업의 두 계약과 고객 돈 100을 끝까지 따라갑니다"},{"id":"source","title":"8. SEC 자료에서 증권기반스왑의 별도 문을 확인합니다"},{"id":"comparison","title":"9. CFTC는 고객 돈 100을 회사 돈과 분리하도록 요구합니다"},{"id":"limits","title":"10. 감독기관 이름을 보상 보증으로 읽지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/us-derivatives-regulatory-map-and-customer-segregation"),
  },
  {
    slug: "otc-clearing-reporting-and-bilateral-risk-mitigation",
    title: "청산 60건과 보고 100건은 함께 성립한다: 장외파생 기반시설",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 장외계약 100건 가운데 60건만 중앙청산 대상이라고 놓습니다"},{"id":"black-box","title":"2. 청산 대상·담보 방식·보고 의무의 세 문을 엽니다"},{"id":"case","title":"3. 60건 청산과 100건 보고는 서로 모순이 아닙니다"},{"id":"picture","title":"4. 한 계약이 청산소와 저장소로 갈라지는 길을 봅니다"},{"id":"need","title":"5. 비금융회사의 실제 헤지도 문턱과 예외를 확인해야 합니다"},{"id":"names","title":"6. 청산 범위·거래보고·비청산 위험 완화에 이름을 붙입니다"},{"id":"mechanism","title":"7. 100건을 계약별 상태표로 끝까지 따라갑니다"},{"id":"source","title":"8. EU EMIR에서 청산과 보고의 다른 범위를 확인합니다"},{"id":"comparison","title":"9. 미국 CFTC도 특정 금리·신용스왑을 의무청산 대상으로 둡니다"},{"id":"limits","title":"10. 보고 완료를 위험 이전으로, 청산을 무위험으로 읽지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/otc-clearing-reporting-and-bilateral-risk-mitigation"),
  },
  {
    slug: "cross-border-netting-enforceability-and-regulatory-recognition",
    title: "계약상 순액 3이 파산 때도 3인지 묻는다: 국경 간 상계와 법률의견",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 세 계약의 +12·−7·−2를 한 금액 +3으로 줄입니다"},{"id":"black-box","title":"2. 계약 묶음·준거법·도산 법원의 세 칸을 엽니다"},{"id":"case","title":"3. 법률효과가 없으면 노출 3이 아니라 받을 돈 12를 따로 봅니다"},{"id":"picture","title":"4. 부도 순간에 종료·평가·합산·한 번 결제가 이어집니다"},{"id":"need","title":"5. 국경을 넘으면 같은 거래에 본국과 현지 규칙이 겹칩니다"},{"id":"names","title":"6. 상계 법적 집행가능성·관할별 법률의견·규제 상호인정에 이름을 붙입니다"},{"id":"mechanism","title":"7. +12·−7·−2에서 법률의견 갱신까지 따라갑니다"},{"id":"source","title":"8. UNIDROIT 원칙에서 상계가 지키려는 법률효과를 확인합니다"},{"id":"comparison","title":"9. 바젤·IOSCO는 국경 간 증거금 규칙의 중복을 줄이려 합니다"},{"id":"limits","title":"10. 법률의견 한 장을 모든 나라·상품의 영구 보증으로 쓰지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/cross-border-netting-enforceability-and-regulatory-recognition"),
  },
  {
    slug: "bank-irrbb-alm-and-derivatives-hedging",
    title: "은행의 금리 위험은 EVE·NII와 ALM 헤지를 함께 봐야 한다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 예금금리만 오르면 은행의 이자마진이 줄어듭니다"},{"id":"black-box","title":"2. 경제가치와 앞으로 벌 이자를 다른 장부로 엽니다"},{"id":"case","title":"3. 금리 1%포인트 상승으로 연 이자 차이가 0.8 줄어듭니다"},{"id":"picture","title":"4. 만기 틈·기준금리 차이·고객 선택을 함께 봅니다"},{"id":"need","title":"5. ALCO는 대출·예금·채권·헤지를 한 표에서 결정합니다"},{"id":"names","title":"6. EVE·NII와 갭·베이시스·옵션 위험에 이름을 붙입니다"},{"id":"mechanism","title":"7. 예금 비용 0.8 증가를 헤지 결정까지 따라갑니다"},{"id":"source","title":"8. 바젤 기준은 경제가치와 이익 측정을 함께 요구합니다"},{"id":"comparison","title":"9. 은행 FP의 고객 재무설계와 은행 ALM을 구분합니다"},{"id":"limits","title":"10. 스왑으로 이자 0.8을 맞춰도 다른 위험은 남습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/bank-irrbb-alm-and-derivatives-hedging"),
  },
  {
    slug: "hedge-accounting-designation-effectiveness-and-rebalancing",
    title: "경제적 헤지를 재무제표에 잇는다: 지정·효과·재조정",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 경제적 헤지와 회계상 헤지는 같은 기록이 아닙니다"},{"id":"black-box","title":"2. 위험항목·헤지수단·비율·손익 표시를 따로 엽니다"},{"id":"case","title":"3. 차입 100억 중 80억을 지정하면 헤지비율은 80%입니다"},{"id":"picture","title":"4. 위험관리 목적과 회계 지정이 한 줄로 이어집니다"},{"id":"need","title":"5. 차입금이 줄면 스왑을 그대로 두지 않고 관계를 다시 맞춥니다"},{"id":"names","title":"6. 지정·효과·재조정에 이름을 붙입니다"},{"id":"mechanism","title":"7. 80% 지정에서 160% 불일치까지 따라갑니다"},{"id":"source","title":"8. IFRS 9는 시작 시점의 공식 지정과 문서를 요구합니다"},{"id":"comparison","title":"9. 재조정은 목적을 유지하며 지정 수량을 고치는 절차입니다"},{"id":"limits","title":"10. 회계상 통과가 현금 손실을 없애 주지는 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/hedge-accounting-designation-effectiveness-and-rebalancing"),
  },
  {
    slug: "derivatives-tax-character-timing-and-jurisdiction",
    title: "파생상품 세금은 계약 성격·인식 시점·거주지에서 갈린다",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 같은 파생상품 이익도 나라와 계약에 따라 세금 시점이 다릅니다"},{"id":"black-box","title":"2. 사람·계약·시점·통산 범위의 네 칸을 엽니다"},{"id":"case","title":"3. 이익 12와 손실 5를 합치면 과세 전 순손익은 7입니다"},{"id":"picture","title":"4. 거래 화면의 손익에서 세금 신고 숫자까지 내려갑니다"},{"id":"need","title":"5. 헤지의 경제적 상쇄와 세금의 상쇄 시점이 어긋날 수 있습니다"},{"id":"names","title":"6. 소득 성격·인식 시점·거주지 관할에 이름을 붙입니다"},{"id":"mechanism","title":"7. 계약 한 건을 체결일부터 신고일까지 따라갑니다"},{"id":"source","title":"8. 한국은 과세대상 파생상품 손익을 별도 장부에서 계산합니다"},{"id":"comparison","title":"9. 미국 Section 1256은 연말 평가와 60·40 분류를 함께 둡니다"},{"id":"limits","title":"10. 세전 수익률과 세율 하나로 거래를 비교하지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/derivatives-tax-character-timing-and-jurisdiction"),
  },
  {
    slug: "derivatives-market-abuse-position-limits-and-surveillance",
    title: "관련 계좌 600계약을 함께 본다: 한도·헤지 예외·시장감시",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 계좌 둘로 나눠도 같은 사람이 잡은 포지션은 합쳐질 수 있습니다"},{"id":"black-box","title":"2. 포지션 크기·지배관계·주문 의도를 따로 엽니다"},{"id":"case","title":"3. 400과 200을 합친 600은 한도 500보다 100 큽니다"},{"id":"picture","title":"4. 거래소와 감독기관은 주문부터 실물인도까지 이어 봅니다"},{"id":"need","title":"5. 큰 헤지와 시장지배는 숫자만 보면 비슷할 수 있습니다"},{"id":"names","title":"6. 포지션 한도·선의의 헤지·시장감시에 이름을 붙입니다"},{"id":"mechanism","title":"7. 600계약을 사전 통제에서 조사 기록까지 따라갑니다"},{"id":"source","title":"8. CFTC 한도는 핵심 계약과 연결 계약을 함께 봅니다"},{"id":"comparison","title":"9. 일일 시장감시는 포지션과 주문의 이야기를 다시 만듭니다"},{"id":"limits","title":"10. 경보와 큰 수익을 조작의 증거로 단정하지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/derivatives-market-abuse-position-limits-and-surveillance"),
  },
  {
    slug: "derivatives-aml-kyc-and-suspicious-transaction-monitoring",
    title: "자금 1,000의 경로를 잇는다: 파생상품 KYC·거래감시·STR",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 1,000이 들어와 980이 나간 거래를 손실 20으로만 보지 않습니다"},{"id":"black-box","title":"2. 고객·실소유자·자금·거래 목적을 한 사건으로 묶습니다"},{"id":"case","title":"3. 예상 100보다 900 큰 자금이 들어온 경로를 확인합니다"},{"id":"picture","title":"4. 은행 송금과 파생상품 주문을 같은 시간줄에 놓습니다"},{"id":"need","title":"5. 빠른 국경 간 거래와 복잡한 법인 구조가 확인 비용을 키웁니다"},{"id":"names","title":"6. 파생상품 자금경로와 거래·자금 연결에 이름을 붙입니다"},{"id":"mechanism","title":"7. 1,000 입금부터 담당자의 신고 판단까지 따라갑니다"},{"id":"source","title":"8. FATF는 증권 부문 위험에 선물·옵션·스왑을 포함합니다"},{"id":"comparison","title":"9. 한국 과정은 고객확인과 STR·CTR을 파생상품 영업과 함께 둡니다"},{"id":"limits","title":"10. 경보를 범죄 판정이나 자동 계좌정지로 바꾸지 않습니다"}],
    component: () => import("@/pages/articles/markets/derivatives/derivatives-aml-kyc-and-suspicious-transaction-monitoring"),
  },
  {
    slug: "derivatives-complaints-dispute-resolution-and-evidence",
    title: "손실 30의 책임은 시간줄로 가린다: 파생상품 민원과 증거",
    subcategory: "markets-derivatives",
    sections: [{"id":"overview","title":"1. 증거금 부족 10이 생기면 가격·시간·설명을 함께 되짚습니다"},{"id":"black-box","title":"2. 판매·체결·증거금·민원 기록을 네 묶음으로 엽니다"},{"id":"case","title":"3. 자금 70에서 필요액 80을 빼면 10이 부족합니다"},{"id":"picture","title":"4. 주문 전 설명부터 최종 답변까지 한 시간줄을 만듭니다"},{"id":"need","title":"5. 판매가 맞았어도 체결이 잘못될 수 있고 그 반대도 가능합니다"},{"id":"names","title":"6. 증거 꾸러미와 분쟁 구제 경로에 이름을 붙입니다"},{"id":"mechanism","title":"7. 부족액 10 사건을 접수부터 재발 방지까지 따라갑니다"},{"id":"source","title":"8. 영국 옴부즈맨은 약관과 가격·헤지 자료까지 요구할 수 있습니다"},{"id":"comparison","title":"9. 국내 자격 과정은 분쟁 예방과 주요 사례를 별도 과목으로 둡니다"},{"id":"limits","title":"10. 손실이 컸다는 사실도 서명했다는 사실도 결론은 아닙니다"}],
    component: () => import("@/pages/articles/markets/derivatives/derivatives-complaints-dispute-resolution-and-evidence"),
  },
  {
      slug: "uncleared-initial-margin-simm-and-model-governance",
      title: "비청산 개시증거금은 부도 뒤의 빈 시간을 막는다: SIMM과 모형 통제",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 개시증거금은 오늘 손실보다 부도 뒤의 빈 시간을 막습니다"
    },
    {
      "id": "black-box",
      "title": "2. 대상·계산·보관·모형 통제의 네 칸을 엽니다"
    },
    {
      "id": "case",
      "title": "3. 가중 민감도 6과 4는 단순 합 10보다 작은 8로 묶입니다"
    },
    {
      "id": "picture",
      "title": "4. 현재 노출 2.5와 잠재 노출 8은 다른 통로로 움직입니다"
    },
    {
      "id": "need",
      "title": "5. 공통 모형은 분쟁을 줄이지만 같은 결과를 보장하지 않습니다"
    },
    {
      "id": "names",
      "title": "6. 잠재 미래 노출·양방향 IM·SIMM 통제에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 거래 분류에서 담보 결제와 모형 검증까지 따라갑니다"
    },
    {
      "id": "source",
      "title": "8. 국제 기준은 99% 한쪽 꼬리와 10일을 출발점으로 둡니다"
    },
    {
      "id": "comparison",
      "title": "9. 최신 SIMM 버전과 회사별 승인 기록을 함께 봅니다"
    },
    {
      "id": "limits",
      "title": "10. 개시증거금 8은 가격 위험과 유동성 위험을 함께 만듭니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/uncleared-initial-margin-simm-and-model-governance"),
    },
  {
      slug: "derivatives-trade-lifecycle-confirmation-settlement-and-reconciliation",
      title: "체결 뒤가 더 길다: 파생상품 확인·결제·대사와 예외 처리",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 체결된 거래도 확인·결제·대사를 지나야 살아 있는 장부가 됩니다"
    },
    {
      "id": "black-box",
      "title": "2. 경제조건·법률조건·현금·장부 상태를 따로 엽니다"
    },
    {
      "id": "case",
      "title": "3. 3.00%와 3.05%의 차이는 해마다 0.05를 만듭니다"
    },
    {
      "id": "picture",
      "title": "4. 주문 한 건은 체결 뒤 여러 운영 사건으로 이어집니다"
    },
    {
      "id": "need",
      "title": "5. 확인과 대사는 같은 오류를 다른 시점에 잡습니다"
    },
    {
      "id": "names",
      "title": "6. 거래 확인·결제 완결·포트폴리오 대사에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 5bp 오류를 발견하고 고친 뒤 현금까지 확인합니다"
    },
    {
      "id": "source",
      "title": "8. CFTC 규칙은 확인·대사·압축·문서를 한 통제군으로 둡니다"
    },
    {
      "id": "comparison",
      "title": "9. 오래된 운영 보고서도 자동화와 수동 예외의 경계를 보여 줍니다"
    },
    {
      "id": "limits",
      "title": "10. 거래가 맞아도 결제 실패와 보고 오류는 따로 남습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/derivatives-trade-lifecycle-confirmation-settlement-and-reconciliation"),
    },
  {
      slug: "collateral-operations-margin-calls-disputes-and-substitution",
      title: "호출액 5가 실제 담보가 되기까지: 대사·분쟁·교체·결제",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 노출 12가 생겨도 담보 호출액은 계약 조건을 거쳐 5가 됩니다"
    },
    {
      "id": "black-box",
      "title": "2. 노출·계약 조건·자산 가치·결제 상태를 따로 엽니다"
    },
    {
      "id": "case",
      "title": "3. 시장가 6인 채권도 10%를 깎으면 담보가치는 5.4입니다"
    },
    {
      "id": "picture",
      "title": "4. 계산·합의·배정·결제·대사가 하루 안에 이어집니다"
    },
    {
      "id": "need",
      "title": "5. 담보 교체는 새 자산을 받은 뒤 옛 자산을 돌려줘야 안전합니다"
    },
    {
      "id": "names",
      "title": "6. 담보 호출·할인 가치·교체 동시성에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 호출액 5의 합의와 5.4 채권의 결제를 끝까지 따라갑니다"
    },
    {
      "id": "source",
      "title": "8. ISDA 운영 지침은 호출 데이터와 응답 시간을 구체적으로 잇습니다"
    },
    {
      "id": "comparison",
      "title": "9. 개시증거금 대사와 변동증거금 대사는 계산 성질이 다릅니다"
    },
    {
      "id": "limits",
      "title": "10. 담보가 충분해도 결제·보관·집중 위험은 남습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/collateral-operations-margin-calls-disputes-and-substitution"),
    },
  {
      slug: "derivatives-product-approval-target-market-and-post-sale-monitoring",
      title: "수익 8보다 손실 40을 먼저 본다: 상품 승인·목표시장·사후 점검",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 상품 승인은 수익식보다 누구에게 어떤 손실이 생기는지 먼저 묻습니다"
    },
    {
      "id": "black-box",
      "title": "2. 설계자·목표 고객·판매 채널·사후 자료의 네 칸을 엽니다"
    },
    {
      "id": "case",
      "title": "3. 지수가 60이면 고객은 40을 잃지만 표시 수익은 8에 멈춥니다"
    },
    {
      "id": "picture",
      "title": "4. 아이디어가 고객 결과 자료를 거쳐 다시 승인표로 돌아옵니다"
    },
    {
      "id": "need",
      "title": "5. 개별 고객 적합성만으로 상품 설계의 결함을 고칠 수 없습니다"
    },
    {
      "id": "names",
      "title": "6. 목표시장·반대시장·사후 검토에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 손실 40 시나리오에서 판매 중단 판단까지 따라갑니다"
    },
    {
      "id": "source",
      "title": "8. FCA는 출시 전 승인과 중요한 사건 뒤의 재검토를 요구합니다"
    },
    {
      "id": "comparison",
      "title": "9. 제조자와 판매자는 같은 고객을 다른 자료로 봅니다"
    },
    {
      "id": "limits",
      "title": "10. 민원 8건은 경보이지 상품 결함의 자동 판정은 아닙니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/derivatives-product-approval-target-market-and-post-sale-monitoring"),
    },
  {
      slug: "multi-asset-options-correlation-and-rare-event-simulation",
      title: "함께 떨어질 때 가격이 바뀐다: 다중자산 옵션과 희귀사건 시뮬레이션",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 자산을 둘로 늘리면 가격은 변동성보다 함께 움직이는 방식에 민감해집니다"
    },
    {
      "id": "black-box",
      "title": "2. 개별 분포·의존 구조·지급식·표본 오차를 따로 엽니다"
    },
    {
      "id": "case",
      "title": "3. 상관 0과 1에서 바구니 변동성은 14.14%와 20%로 갈립니다"
    },
    {
      "id": "picture",
      "title": "4. 같은 난수에서 두 자산 경로와 지급액을 함께 만듭니다"
    },
    {
      "id": "need",
      "title": "5. 10만 경로에서 10번만 나오면 0.01%도 매우 거친 추정입니다"
    },
    {
      "id": "names",
      "title": "6. 상관 위험·꼬리 의존·중요도 표본추출에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 상관행렬을 보정하고 희귀 지급의 오차까지 보고합니다"
    },
    {
      "id": "source",
      "title": "8. MIT 강의는 난수 생성 뒤 분산감소와 준몬테카를로를 잇습니다"
    },
    {
      "id": "comparison",
      "title": "9. 희귀사건 표본추출은 자주 보게 만든 뒤 확률 무게를 되돌립니다"
    },
    {
      "id": "limits",
      "title": "10. 평시 상관행렬 하나로 위기 동시하락을 확정하지 않습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/multi-asset-options-correlation-and-rare-event-simulation"),
    },
  {
      slug: "canada-hong-kong-switzerland-retail-derivatives-and-market-rules",
      title: "같은 5배 상품도 질문이 다르다: 캐나다·홍콩·스위스 파생상품 규칙",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 같은 5배 파생상품도 세 나라에서 먼저 묻는 질문이 다릅니다"
    },
    {
      "id": "black-box",
      "title": "2. 고객 분류·서비스·상품 복잡성·시장 통제의 네 칸을 엽니다"
    },
    {
      "id": "case",
      "title": "3. 20으로 100을 움직이면 12% 하락 손실 12가 한도 10을 넘습니다"
    },
    {
      "id": "picture",
      "title": "4. 공통 사실관계를 세 갈래 법률 질문으로 나눕니다"
    },
    {
      "id": "need",
      "title": "5. 고객 자산 규모만으로 지식과 손실 감당력을 대신하지 않습니다"
    },
    {
      "id": "names",
      "title": "6. 당사자 지위·복잡상품 판단·서비스별 검사에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 손실 12 사례를 분류에서 주문 기록까지 따라갑니다"
    },
    {
      "id": "source",
      "title": "8. 캐나다 NI 93-101은 당사자 정보와 적합성을 연결합니다"
    },
    {
      "id": "comparison",
      "title": "9. 홍콩의 복잡상품과 스위스의 서비스 검사는 출발점이 다릅니다"
    },
    {
      "id": "limits",
      "title": "10. 세 나라 비교표는 최신 법률의 적용 판단을 대신하지 않습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/canada-hong-kong-switzerland-retail-derivatives-and-market-rules"),
    },
  {
      slug: "krx-derivatives-contract-orders-and-daily-settlement",
      title: "지수 2포인트가 50만 원이 되는 길: KRX 계약·주문·일일정산",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 지수선물 1계약이 2포인트 내리면 장부에서 50만 원이 빠집니다"
    },
    {
      "id": "black-box",
      "title": "2. 계약명세·주문·체결·청산의 네 장부를 나눕니다"
    },
    {
      "id": "case",
      "title": "3. 330에서 328로 간 2포인트는 50만 원 손실입니다"
    },
    {
      "id": "picture",
      "title": "4. 주문 1건이 우선순위와 일일정산을 거쳐 현금이 됩니다"
    },
    {
      "id": "need",
      "title": "5. 주문이 체결됐다는 말과 계약이 끝났다는 말은 다릅니다"
    },
    {
      "id": "names",
      "title": "6. 계약승수·주문조건·일일정산에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 지정가 매수에서 50만 원 출금까지 따라갑니다"
    },
    {
      "id": "source",
      "title": "8. KRX 계약명세는 포인트를 현금으로 바꾸는 규칙을 정합니다"
    },
    {
      "id": "comparison",
      "title": "9. KRX는 시장가 외에도 남은 수량의 처리 조건을 구분합니다"
    },
    {
      "id": "limits",
      "title": "10. 거래소 규격을 알아도 유동성과 급변 손실은 남습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/krx-derivatives-contract-orders-and-daily-settlement"),
    },
  {
      slug: "portfolio-compression-risk-tolerances-and-records",
      title: "총 명목 200을 0으로 줄여도 위험은 따로 잰다: 거래 압축",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 위험이 0인 스왑 세 건에도 명목원금 200이 남을 수 있습니다"
    },
    {
      "id": "black-box",
      "title": "2. 거래자료·허용오차·대체계약·법률효과를 따로 엽니다"
    },
    {
      "id": "case",
      "title": "3. 100−60−40=0이면 총 명목 200을 0으로 줄일 수 있습니다"
    },
    {
      "id": "picture",
      "title": "4. 장부 대사에서 종료 확인서까지 한 주기를 따라갑니다"
    },
    {
      "id": "need",
      "title": "5. 총 명목을 줄여도 시장위험이 같은지는 따로 검사해야 합니다"
    },
    {
      "id": "names",
      "title": "6. 압축 주기·위험 허용오차·총 명목 경계에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 세 거래를 종료하고 네 장부를 다시 맞춥니다"
    },
    {
      "id": "source",
      "title": "8. CFTC 규칙은 압축을 종료와 대체를 통한 거래 감소로 설명합니다"
    },
    {
      "id": "comparison",
      "title": "9. BIS는 총 명목 감소만으로 위험 감소를 읽지 말라고 경계합니다"
    },
    {
      "id": "limits",
      "title": "10. 압축은 부도 위험과 현금 부족을 없애지 않습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/portfolio-compression-risk-tolerances-and-records"),
    },
  {
      slug: "collateral-optimization-eligibility-haircuts-and-liquidity",
      title: "담보 10을 가장 싸게 채우는 법: 적격성·할인율·유동성",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 같은 담보 10을 채워도 묶이는 자금 비용은 다릅니다"
    },
    {
      "id": "black-box",
      "title": "2. 의무·자산·계약·유동성의 네 장부를 엽니다"
    },
    {
      "id": "case",
      "title": "3. 할인율 5%와 15%는 필요한 시장가를 10.53과 11.77로 바꿉니다"
    },
    {
      "id": "picture",
      "title": "4. 적격성 필터를 먼저 통과한 뒤 비용을 비교합니다"
    },
    {
      "id": "need",
      "title": "5. 오늘 가장 싼 배정이 내일의 현금 부족을 만들 수 있습니다"
    },
    {
      "id": "names",
      "title": "6. 최소비용 담보·적격성 제약·유동성 완충에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. B를 5만 쓰고 나머지 5를 A로 채웁니다"
    },
    {
      "id": "source",
      "title": "8. BCBS·IOSCO는 적격성·할인율·집중·잘못된 방향을 함께 봅니다"
    },
    {
      "id": "comparison",
      "title": "9. ISDA 운영 지침은 계산 뒤 배정·교체·결제까지 잇습니다"
    },
    {
      "id": "limits",
      "title": "10. 최저비용 숫자는 법률·결제·시장 충격을 대신하지 않습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/collateral-optimization-eligibility-haircuts-and-liquidity"),
    },
  {
      slug: "ccp-default-management-hedging-auction-and-porting",
      title: "회원 부도 뒤 +80을 누가 떠안는가: CCP 헤지·경매·포지션 이전",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 회원이 부도나면 청산소는 +80의 민감도를 먼저 줄입니다"
    },
    {
      "id": "black-box",
      "title": "2. 고객계정·부도 포트폴리오·시장·손실재원을 따로 엽니다"
    },
    {
      "id": "case",
      "title": "3. +80에서 −60을 헤지하면 경매 전 잔여 민감도는 +20입니다"
    },
    {
      "id": "picture",
      "title": "4. 부도 선언에서 장부를 다시 맞출 때까지 따라갑니다"
    },
    {
      "id": "need",
      "title": "5. 많이 헤지할수록 안전하다는 규칙은 없습니다"
    },
    {
      "id": "names",
      "title": "6. 임시 헤지·부도 경매·고객 포지션 이전에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 잔여 +20을 경매하고 부족 손실을 규칙대로 배분합니다"
    },
    {
      "id": "source",
      "title": "8. CPMI·IOSCO는 경매 설계와 사전 연습을 함께 다룹니다"
    },
    {
      "id": "comparison",
      "title": "9. PFMI는 부도 절차와 고객 포지션 이전을 별도 원칙으로 둡니다"
    },
    {
      "id": "limits",
      "title": "10. 경매 낙찰로 시스템 위험이 모두 사라지지는 않습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/ccp-default-management-hedging-auction-and-porting"),
    },
  {
      slug: "swaption-annuity-volatility-quotes-and-cube",
      title: "3개월×10년×+10bp를 찾는다: 스왑션 연금계수·호가형·큐브",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 3개월 뒤 10년 스왑을 고르는 권리는 세 좌표로 가격을 찾습니다"
    },
    {
      "id": "black-box",
      "title": "2. 곡선·연금계수·변동성 호가·보정의 네 칸을 엽니다"
    },
    {
      "id": "case",
      "title": "3. 10bp 차이는 명목 1억과 연금계수 8.5에서 85만 원입니다"
    },
    {
      "id": "picture",
      "title": "4. 한 호가를 큐브 좌표에서 가격과 위험으로 바꿉니다"
    },
    {
      "id": "need",
      "title": "5. normal 70bp와 lognormal 20%는 같은 숫자표에 넣을 수 없습니다"
    },
    {
      "id": "names",
      "title": "6. 스왑 연금계수·변동성 호가형·스왑션 큐브에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 3개월×10년×+10bp 한 점을 평가 엔진에 넣습니다"
    },
    {
      "id": "source",
      "title": "8. CME 자료는 만기·테너·moneyness 호가에서 전체 표면을 만듭니다"
    },
    {
      "id": "comparison",
      "title": "9. LSEG 큐브는 만기·스왑기간·행사가와 두 호가형을 함께 제공합니다"
    },
    {
      "id": "limits",
      "title": "10. 매끈한 큐브가 거래 가능한 가격을 보장하지 않습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/swaption-annuity-volatility-quotes-and-cube"),
    },
  {
      slug: "derivatives-sales-records-access-retention-and-deletion",
      title: "18분 녹취만으로는 부족하다: 판매 기록·열람·보존·파기",
      subcategory: "markets-derivatives",
      sections: [
    {
      "id": "overview",
      "title": "1. 18분 녹취가 있어도 누가 어떤 자료로 판단했는지는 비어 있을 수 있습니다"
    },
    {
      "id": "black-box",
      "title": "2. 판단 자료·통신·거래·보존 근거의 네 장부를 엽니다"
    },
    {
      "id": "case",
      "title": "3. 14시10분 자료와 14시32분 주문 사이의 22분을 잇습니다"
    },
    {
      "id": "picture",
      "title": "4. 고객 입력에서 열람과 파기까지 한 줄로 추적합니다"
    },
    {
      "id": "need",
      "title": "5. 오래 보관할수록 증거는 늘지만 개인정보 피해도 커집니다"
    },
    {
      "id": "names",
      "title": "6. 판매기록 계보·열람 통제·보존과 파기 경계에 이름을 붙입니다"
    },
    {
      "id": "mechanism",
      "title": "7. 18분 녹취를 주문과 묶고 열람 요청에 답합니다"
    },
    {
      "id": "source",
      "title": "8. 금융소비자보호법은 기록·변조 방지·열람을 한 조문에 둡니다"
    },
    {
      "id": "comparison",
      "title": "9. 금융위원회 안내는 고난도 상품의 녹취와 숙려를 판매 흐름에 넣습니다"
    },
    {
      "id": "limits",
      "title": "10. 완전한 기록도 올바른 권유와 고객 이해를 자동 증명하지 않습니다"
    }
  ],
      component: () => import("@/pages/articles/markets/derivatives/derivatives-sales-records-access-retention-and-deletion"),
    },

];
