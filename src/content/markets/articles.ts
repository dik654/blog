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
];
