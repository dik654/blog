export interface CategoryReadingStage {
  eyebrow: string;
  title: string;
  description: string;
  subcategories: readonly string[];
}

export interface CategoryReadingPath {
  title: string;
  description: string;
  organizingPrinciple?: "시간순" | "주제순" | "선수 개념순" | "혼합";
  stages: readonly CategoryReadingStage[];
  featuredArticles: readonly string[];
}

/**
 * 카테고리 입구에서 보여 줄 개념 계층만 관리합니다.
 * 실제 글 목록·개수·링크·근거 배지는 각 manifest에서 읽기 때문에 새 글의
 * 정보를 이 파일에 다시 복제하지 않습니다.
 */
export const CATEGORY_READING_PATHS: Readonly<
  Partial<Record<string, CategoryReadingPath>>
> = {
  "philosophy-topics": {
    organizingPrinciple: "주제순",
    title: "같음·책임·말·경험·취향·의미를 나누는 여섯 질문",
    description: "철학사를 한 줄 연표로 외우기보다, 서로 섞이기 쉬운 질문을 생활 사례와 원전으로 하나씩 분리해 읽습니다.",
    stages: [
      { eyebrow: "01 · 변화와 같음", title: "정체성과 시간", description: "부품을 모두 바꾼 자전거가 같은 자전거인지 물으며 물질·연속성·기능·역사를 나눕니다.", subcategories: ["topics-identity"] },
      { eyebrow: "02 · 선택과 책임", title: "자유의지와 통제", description: "다른 선택지, 자기 이유, 강제와 개입이 책임 판단을 어떻게 바꾸는지 봅니다.", subcategories: ["topics-freedom"] },
      { eyebrow: "03 · 말과 행위", title: "지시·맥락·말로 하는 일", description: "같은 낱말이 가리키는 대상을 맥락이 어떻게 정하고, 약속이 관계를 어떻게 바꾸는지 봅니다.", subcategories: ["topics-language"] },
      { eyebrow: "04 · 경험과 타인", title: "의식과 다른 마음", description: "통증 당사자의 경험과 관찰자의 증거가 어떻게 만나고 어디서 남는지 봅니다.", subcategories: ["topics-consciousness"] },
      { eyebrow: "05 · 취향과 이유", title: "미적 판단", description: "좋아함·다수결·훈련된 판단이 각각 무엇을 말할 수 있는지 공연 사례로 구분합니다.", subcategories: ["topics-aesthetics"] },
      { eyebrow: "06 · 잘 산다는 것", title: "삶의 의미", description: "마음이 끌리는 일, 가치 있는 일, 둘이 만나는 지속적 참여를 한 주의 시간표에 놓습니다.", subcategories: ["topics-meaning"] },
    ],
    featuredArticles: ["identity-through-change", "free-will-control-and-responsibility", "reference-context-and-speech-acts", "consciousness-pain-and-other-minds", "aesthetic-taste-judgment-and-context", "meaning-in-life-attraction-worth-and-commitment"],
  },
  "philosophical-traditions": {
    organizingPrinciple: "주제순",
    title: "역할·개입·경험·행위·인과·사람됨을 묻는 여섯 출발점",
    description: "어느 전통이 먼저라는 서열이나 하나의 발전 연표 대신, 서로 다른 지역과 문헌이 생활 속 문제를 어떤 개념으로 나눴는지 주제순으로 읽습니다.",
    stages: [
      { eyebrow: "01 · 역할과 욕망", title: "유가의 인·예·덕치", description: "부족한 곡물을 나누는 절차에서 관계와 역할을 훈련하는 예의 작동을 봅니다.", subcategories: ["traditions-confucian"] },
      { eyebrow: "02 · 이름과 개입", title: "도가의 구분·도·무위", description: "물을 억지로 밀어 손실을 키우는 사례에서 이름이 만든 욕망과 비강제적 행동을 구분합니다.", subcategories: ["traditions-daoist"] },
      { eyebrow: "03 · 경험과 붙잡음", title: "초기 불교의 다섯 집합·무상·무아", description: "모욕을 들은 10초를 나눠 고정된 나로 붙잡는 과정과 다음 반응의 여지를 봅니다.", subcategories: ["traditions-buddhist"] },
      { eyebrow: "04 · 행위와 열매", title: "『바가바드 기타』의 다르마·카르마 요가", description: "수확을 만드는 통제 가능한 행위와 외부 조건을 나눠 무집착과 무관심을 구분합니다.", subcategories: ["traditions-gita"] },
      { eyebrow: "05 · 원인과 필연", title: "이슬람 철학의 팔사파·칼람", description: "불과 솜의 열 번 관찰에서 규칙적 예측과 필연적 인과라는 주장을 나눕니다.", subcategories: ["traditions-islamic"] },
      { eyebrow: "06 · 공동체와 사람됨", title: "아칸의 인격·기여·행위자성", description: "다리 복구 100시간에서 기본 인간 지위와 길러지는 도덕적 인격을 구분합니다.", subcategories: ["traditions-akan"] },
    ],
    featuredArticles: ["confucian-ritual-role-and-humane-rule", "daoist-names-noncoercive-action-and-change", "buddhist-aggregates-impermanence-and-not-self", "gita-action-results-and-release", "islamic-causation-reason-and-revelation", "akan-personhood-community-and-agency"],
  },
  "philosophy-history": {
    organizingPrinciple: "혼합",
    title: "열두 시간축에서 철학의 질문이 바뀐 경로",
    description: "서로 겹치는 시대는 각 논쟁이 뚜렷해진 시점을 기준으로 배열합니다. 한 문명이 다음 문명으로 발전했다는 한 줄 연표 대신 도시·전쟁·번역·과학·정복과 식민 통치가 여러 지역의 질문과 논증을 어떻게 바꿨는지 교차해 읽습니다.",
    stages: [
      { eyebrow: "01 · 기원전 5세기~서기 2세기", title: "고대 지중해의 문답·덕·통제", description: "운동선수의 10시간을 나누며 아테네의 시민 문답에서 헬레니즘 시대의 생활 훈련까지 이동합니다.", subcategories: ["philosophy-history-ancient-mediterranean"] },
      { eyebrow: "02 · 기원전 5~3세기", title: "전국시대 중국의 경쟁하는 통치 기준", description: "전쟁 중인 나라의 예산 100을 겸애·예·행정 표준이 어떻게 다르게 배분하는지 봅니다.", subcategories: ["philosophy-history-warring-states"] },
      { eyebrow: "03 · 기원전 말기~서기 12세기", title: "고전 인도의 지식 통로 논쟁", description: "시장 개장 정보 네 가지를 놓고 나이야와 불교 인식론이 지각·추론·말을 어떻게 분류했는지 추적합니다.", subcategories: ["philosophy-history-classical-india"] },
      { eyebrow: "04 · 5~15세기", title: "중세의 다언어 번역·문답", description: "그리스어·아랍어·히브리어·라틴어 기록 네 개에서 번역·권위·논증과 인간 지식의 한계를 추적합니다.", subcategories: ["philosophy-history-medieval"] },
      { eyebrow: "05 · 9~17세기", title: "이슬람 철학의 번역·빛·존재", description: "바그다드의 번역과 이븐 시나의 체계에서 수흐라와르디와 물라 사드라의 새 종합까지 네 정거장을 잇습니다.", subcategories: ["philosophy-history-islamic"] },
      { eyebrow: "06 · 11~16세기", title: "송명 유학의 이치·마음·행동", description: "곡물 100자루의 조사와 책임에서 주희의 격물궁리와 왕양명의 지행합일을 비교합니다.", subcategories: ["philosophy-history-song-ming"] },
      { eyebrow: "07 · 12~18세기", title: "초기 근대 인도의 새 나이야", description: "땅 네 구획과 표식 세 개를 이용해 대상·관계·인식 조건을 정밀하게 나누는 분석 전통을 봅니다.", subcategories: ["philosophy-history-new-nyaya"] },
      { eyebrow: "08 · 정복기~현재", title: "원주민의 땅과 라틴아메리카 해방", description: "빈 땅 100ha라는 국가 지도에 계절 이용·공동체 법·자기 결정과 해방 철학의 질문을 겹칩니다.", subcategories: ["philosophy-history-indigenous-latin"] },
      { eyebrow: "09 · 17~18세기", title: "근대 유럽의 의심·경험·인과", description: "당구공의 관찰 10회에서 데카르트·흄·칸트가 지식의 출발과 경험의 조건을 어떻게 달리 물었는지 봅니다.", subcategories: ["philosophy-history-early-modern"] },
      { eyebrow: "10 · 18세기 말~현재", title: "페미니즘 철학의 입장·돌봄·교차성", description: "승진 심사 100명의 평균 아래에서 지식의 위치와 보이지 않는 노동, 단일 축 제도의 누락을 찾습니다.", subcategories: ["philosophy-history-feminist"] },
      { eyebrow: "11 · 1870년대~20세기", title: "프래그머티즘·분석·현상학의 방법", description: "고장 난 가로등의 개입·개념·경험 기록으로 근현대의 세 방법과 서로 겹치는 경계를 봅니다.", subcategories: ["philosophy-history-modern-methods"] },
      { eyebrow: "12 · 19세기 말~20세기", title: "식민 근대의 시선과 탈식민", description: "같은 시험을 보는 100명의 서로 다른 조건에서 뒤부아와 파농이 인종 질서·자기 인식·해방을 연결한 방식을 봅니다.", subcategories: ["philosophy-history-colonial-modernity"] },
    ],
    featuredArticles: ["ancient-mediterranean-inquiry-virtue-and-control", "warring-states-china-care-ritual-and-standards", "classical-india-pramana-self-and-liberation", "medieval-translation-reason-and-revelation", "islamic-philosophy-translation-illumination-and-being", "song-ming-confucianism-pattern-heartmind-and-action", "early-modern-india-new-nyaya-analysis-and-language", "indigenous-land-and-latin-american-liberation", "early-modern-europe-doubt-experience-and-causality", "feminist-philosophy-standpoint-care-and-intersectionality", "modern-methods-pragmatism-analysis-and-phenomenology", "colonial-modernity-race-and-decolonization"],
  },
  "global-history": {
    organizingPrinciple: "시간순",
    title: "제국의 도로에서 탈식민과 세계화까지",
    description: "한 지역의 왕조 목록 대신 사람·물자·권리와 강제력이 지역 사이를 오가며 다음 시대의 선택을 만든 순서로 읽습니다.",
    stages: [
      { eyebrow: "01 · 기원전 3세기 무렵~600년", title: "제국·도로·세금·법", description: "멀리 떨어진 지역을 물류·재정·현지 권력과 여러 법으로 함께 다스린 방식을 봅니다.", subcategories: ["global-history-empires"] },
      { eyebrow: "02 · 600~1500년", title: "교역·종교·번역의 연결망", description: "계절풍과 항구, 상인 공동체와 번역 기관이 물건·신앙·지식을 다른 속도로 옮긴 경로를 봅니다.", subcategories: ["global-history-networks"] },
      { eyebrow: "03 · 1492년 무렵~18세기", title: "정복·질병·은의 대양 회로", description: "대양 정복이 생물 이동·광산 강제 노동·세계 결제 수요를 한 회로에 묶은 과정을 추적합니다.", subcategories: ["global-history-oceanic"] },
      { eyebrow: "04 · 18세기 말~1914년", title: "혁명·시민권·산업 제국", description: "보편 권리 선언과 제한된 시민 명부, 국민국가의 동원과 제국 팽창이 함께 움직인 모순을 봅니다.", subcategories: ["global-history-revolutions"] },
      { eyebrow: "05 · 1914~1945년", title: "세계대전·대공황·대중 국가", description: "전선과 후방, 본국과 식민지를 묶은 총력전 동원과 전간기 불황, 위임통치를 함께 읽습니다.", subcategories: ["global-history-world-wars"] },
      { eyebrow: "06 · 1945년~1990년대 이후", title: "냉전·탈식민·세계화", description: "신생 국가가 양극 질서와 원조·부채·다자 무역 규칙 속에서 만든 선택과 연대를 봅니다.", subcategories: ["global-history-postwar"] },
    ],
    featuredArticles: ["empires-roads-taxes-and-law", "trade-religion-and-translation-networks", "conquest-disease-silver-and-oceanic-exchange", "revolutions-citizenship-and-industrial-empires", "world-wars-depression-and-mass-states", "cold-war-decolonization-and-globalization"],
  },
  "economic-history": {
    organizingPrinciple: "시간순",
    title: "장부에서 교역·식민 경제·산업화·국제 부채까지",
    description: "각 글은 앞 시대의 제도가 다음 시대의 선택지를 어떻게 만들고 좁혔는지 시간순으로 따라갑니다.",
    stages: [
      { eyebrow: "01 · 기원전 3100~2900년 무렵", title: "곡물과 장부", description: "생산물을 모아 나눌 때 측정·기록·권한이 함께 생기는 조건을 봅니다.", subcategories: ["economic-history-early-state"] },
      { eyebrow: "02 · 기원전 2천년기~1500년 무렵", title: "교역·신용·중개", description: "먼 길의 운송 위험을 장부·대출·환전·중개인이 어떻게 나눴는지 봅니다.", subcategories: ["economic-history-trade"] },
      { eyebrow: "03 · 1500년대~19세기", title: "식민 상품망과 강제 노동", description: "무역 이익의 숫자 뒤에서 토지·노동·정치 권리가 누구에게서 빠졌는지 추적합니다.", subcategories: ["economic-history-colonial"] },
      { eyebrow: "04 · 18세기 중엽~19세기 중엽", title: "산업화", description: "임금과 에너지 가격이 기계 선택을 바꾸고 생산과 생활이 다른 속도로 움직인 과정을 봅니다.", subcategories: ["economic-history-industry"] },
      { eyebrow: "05 · 1870년대~1970년대", title: "국제 통화 질서", description: "금 교환 약속, 대공황기의 붕괴, 브레턴우즈의 조정 장치와 변동환율 전환을 잇습니다.", subcategories: ["economic-history-money"] },
      { eyebrow: "06 · 1945년~1980년대", title: "탈식민·석유 충격·부채", description: "정치적 독립 뒤 남은 수출 구조와 1970년대의 싼 대출이 1980년대 부채 위기로 바뀐 경로를 봅니다.", subcategories: ["economic-history-development"] },
    ],
    featuredArticles: ["agrarian-surplus-and-state", "trade-credit-and-long-distance-networks", "colonial-plantations-slavery-and-extraction", "industrial-revolution-wages-and-energy", "gold-standard-depression-bretton-woods", "decolonization-oil-shocks-and-debt"],
  },
  business: {
    title: "한 가게의 시작과 사업 관계 읽기",
    description: "사업 모델의 현금 장부를 만들고, 자리·공사·영업·가맹과 국제 공급망의 권한을 봅니다.",
    stages: [
      { eyebrow: "01 · 현금", title: "모델과 손익", description: "결제액과 실제 남는 돈, 필요한 판매량을 구분합니다.", subcategories: ["business-cash"] },
      { eyebrow: "02 · 관계", title: "브랜드와 공급망", description: "가맹본부·점주·제조업체 사이의 수입과 통제권을 나눕니다.", subcategories: ["business-network"] },
    ],
    featuredArticles: ["business-model-cashflow", "shop-unit-economics", "shop-site-selection", "shop-fitout-and-opening", "shop-daily-operations", "franchise-incentives", "supply-chain-bargaining"],
  },
  property: {
    title: "공간을 쓰고, 넘기고, 돌려주는 순서",
    description: "상가의 계약과 종료를 따라간 뒤 토지의 허가와 개발 잔여가치를 계산합니다.",
    stages: [
      { eyebrow: "01 · 임대", title: "사용권과 종료 책임", description: "보증금·권리금·양도·복구를 서로 다른 청구권으로 봅니다.", subcategories: ["property-lease"] },
      { eyebrow: "02 · 개발", title: "허가와 땅값", description: "완공 가치에서 비용과 개발 이익을 거꾸로 뺍니다.", subcategories: ["property-development"] },
    ],
    featuredArticles: ["commercial-lease-and-rent", "shop-transfer-and-goodwill", "shop-closure-and-restoration", "land-development-residual"],
  },
  institutions: {
    title: "사회의 위험과 나라를 읽는 장부",
    description: "보험·의료·인구·교육·문화·정보의 조건을 살피고 측정과 비교를 배운 뒤 국가별 자료로 이어갑니다.",
    stages: [
      { eyebrow: "01 · 위험", title: "보험과 의료", description: "보험료·세금·본인부담과 지급 상대를 추적합니다.", subcategories: ["institutions-risk"] },
      { eyebrow: "02 · 역량", title: "사람의 시간과 배움", description: "인구와 돌봄, 기술과 자격을 살피고 주장을 검증하는 법을 배웁니다.", subcategories: ["institutions-capacity"] },
      { eyebrow: "03 · 나라", title: "일곱 장부", description: "정치·법·예산·생산·대외거래·생활·인식으로 비교합니다.", subcategories: ["institutions-country"] },
    ],
    featuredArticles: ["insurance-risk-pooling", "healthcare-payment-systems", "population-migration-and-care", "education-skills-and-signals", "evidence-measurement-and-causality", "public-budget-and-taxes", "culture-norms-and-coordination", "media-attention-and-public-belief", "how-to-read-a-country"],
  },
  infrastructure: {
    title: "생활을 지탱하는 망과 공급 읽기",
    description: "전기·식품·수도·교통·주택·자원·기후의 비용과 접근 권리를 같은 장부에 놓습니다.",
    stages: [
      { eyebrow: "01 · 연결", title: "망과 요금", description: "전력·수도·교통의 접속, 유지비와 접근성을 봅니다.", subcategories: ["infrastructure-networks"] },
      { eyebrow: "02 · 공급", title: "상품과 공간", description: "식품과 주택이 생산돼 사람에게 닿는 제약을 봅니다.", subcategories: ["infrastructure-supply"] },
      { eyebrow: "03 · 위험", title: "기후와 노출", description: "자연 현상이 사람과 자산에 닿을 때 손실이 달라지는 이유를 봅니다.", subcategories: ["infrastructure-risk"] },
    ],
    featuredArticles: ["electricity-grid-and-power", "food-chain-and-prices", "water-utility-and-tariffs", "transport-access-and-land-value", "housing-land-and-supply", "materials-waste-and-circularity", "climate-risk-and-exposure"],
  },
  banking: {
    title: "은행의 장부에서 담보 조달까지",
    description: "예금과 대출, 통화정책, 결제를 배운 뒤 증권을 맡겨 단기 자금을 구하는 경로를 봅니다.",
    stages: [
      { eyebrow: "01 · 예금", title: "은행의 돈", description: "대출·예금과 은행의 지급 약속을 구분합니다.", subcategories: ["banking-deposit"] },
      { eyebrow: "02 · 금리", title: "통화정책", description: "정책금리와 시장의 자금 비용이 이어지는 경로를 봅니다.", subcategories: ["banking-policy"] },
      { eyebrow: "03 · 지급", title: "결제와 최종성", description: "기록된 지급과 최종 자금 이전을 구분합니다.", subcategories: ["banking-settlement"] },
      { eyebrow: "04 · 조달", title: "담보와 만기", description: "레포의 현금·증권 교환과 담보 부족을 계산합니다.", subcategories: ["banking-funding"] },
    ],
    featuredArticles: ["repo-and-collateral-funding"],
  },
  markets: {
    title: "청구권에서 전략 상품의 실제 손익까지",
    description: "채권·주식의 기초 위에 상품별 지급 조건을 놓고 파생상품의 가격·청산·헤지·판매 책임까지 따라갑니다.",
    stages: [
      { eyebrow: "01 · 채무", title: "채권과 금리", description: "약정 지급과 현재 가격을 연결합니다.", subcategories: ["markets-bond"] },
      { eyebrow: "02 · 소유", title: "주식의 몫", description: "채무 지급 뒤 남는 청구권을 봅니다.", subcategories: ["markets-equity"] },
      { eyebrow: "03 · 상품", title: "포장과 실제 자산", description: "상품 지도·펀드·ETF·ETN·유동화를 비교합니다.", subcategories: ["markets-products"] },
      { eyebrow: "04 · 계약", title: "손익에서 가격·운영·위험관리까지", description: "선물·옵션의 지급에서 통화·원자재 헤지, 구조화 상품, 신용·장외·시장위험으로 갑니다.", subcategories: ["markets-derivatives"] },
    ],
    featuredArticles: ["bond-pricing-and-yield-curve", "equity-claims-and-valuation", "financial-products-and-claims", "funds-etfs-and-etns", "securitization-and-tranches", "forwards-and-futures", "no-arbitrage-cost-of-carry-and-basis", "clearing-margin-and-default-waterfall", "currency-hedging-forward-points-and-cross-currency-basis", "commodity-carry-convenience-yield-and-roll", "minimum-variance-hedge-ratio-and-basis-risk", "options-and-asymmetric-payoffs", "option-replication-and-put-call-parity", "binomial-black-scholes-and-early-exercise", "brownian-motion-ito-and-risk-neutral-pricing", "black-scholes-pde-finite-difference-and-numerical-error", "option-greeks-volatility-and-dynamic-hedging", "implied-volatility-surface-skew-and-smile", "local-stochastic-volatility-jumps-and-calibration", "covered-calls-and-income-funds", "option-strategies-and-structured-notes", "monte-carlo-path-dependent-pricing-and-variance-reduction", "swaps-and-credit-risk", "interest-rate-derivatives-from-fra-to-swaptions", "yield-curve-bootstrapping-multicurve-and-key-rate-hedging", "short-rate-hjm-and-interest-rate-model-risk", "credit-derivatives-default-risk-and-tranches", "hazard-rate-curve-recovery-and-credit-correlation", "otc-master-agreement-collateral-netting-and-cva", "xva-funding-margin-and-wrong-way-risk", "var-expected-shortfall-stress-and-model-risk", "market-risk-backtesting-pnl-attribution-and-model-governance", "derivatives-suitability-disclosure-and-sales-practice", "korea-singapore-retail-derivatives-entry-and-knowledge-tests", "eu-uk-cfd-appropriateness-leverage-and-negative-balance", "japan-australia-retail-leverage-and-product-governance", "us-derivatives-regulatory-map-and-customer-segregation", "otc-clearing-reporting-and-bilateral-risk-mitigation", "cross-border-netting-enforceability-and-regulatory-recognition", "bank-irrbb-alm-and-derivatives-hedging", "hedge-accounting-designation-effectiveness-and-rebalancing", "derivatives-tax-character-timing-and-jurisdiction", "derivatives-market-abuse-position-limits-and-surveillance", "derivatives-aml-kyc-and-suspicious-transaction-monitoring", "derivatives-complaints-dispute-resolution-and-evidence", "uncleared-initial-margin-simm-and-model-governance", "derivatives-trade-lifecycle-confirmation-settlement-and-reconciliation", "collateral-operations-margin-calls-disputes-and-substitution", "derivatives-product-approval-target-market-and-post-sale-monitoring", "multi-asset-options-correlation-and-rare-event-simulation", "canada-hong-kong-switzerland-retail-derivatives-and-market-rules", "krx-derivatives-contract-orders-and-daily-settlement", "portfolio-compression-risk-tolerances-and-records", "collateral-optimization-eligibility-haircuts-and-liquidity", "ccp-default-management-hedging-auction-and-porting", "swaption-annuity-volatility-quotes-and-cube", "derivatives-sales-records-access-retention-and-deletion", "equity-dispersion-implied-correlation-and-variance", "credit-tranche-base-correlation-and-default-auction", "commodity-grades-location-basis-and-physical-delivery", "derivatives-investigation-audit-trail-and-legal-hold", "us-uk-derivatives-tax-mark-to-market-and-accounting-link", "fractional-investment-trust-beneficiary-certificates"],
  },
  circuits: {
    title: "한 회로를 계산하는 순서",
    description: "갈림길의 전류부터 시간에 따라 바뀌는 신호까지, 매 글에서 같은 물리량을 더 깊게 읽습니다.",
    stages: [
      { eyebrow: "01 · 보존", title: "전압·전류·저항", description: "갈림길과 고리를 따라 전하와 에너지의 보존을 수치로 확인합니다.", subcategories: ["circuit-foundations"] },
      { eyebrow: "02 · 시간", title: "저장된 상태와 변화", description: "전하와 자기장에 에너지가 쌓일 때 전압·전류가 따라오는 속도를 봅니다.", subcategories: ["circuit-dynamics"] },
    ],
    featuredArticles: ["lumped-circuit-and-conservation", "resistance-and-power-dissipation", "storage-elements-and-transients", "steady-state-and-impedance", "frequency-shaping-and-bode", "feedback-gain-and-stability"],
  },
  semiconductors: {
    title: "재료에서 칩까지 읽기",
    description: "재료 안에서 움직일 수 있는 전하를 먼저 세고, 제조 과정과 집적의 제약으로 넘어갑니다.",
    stages: [
      { eyebrow: "01 · 재료", title: "전자와 빈자리", description: "에너지 상태와 불순물에 따라 전자와 정공의 수가 달라지는 이유입니다.", subcategories: ["semiconductor-physics"] },
      { eyebrow: "02 · 제조", title: "막을 열고 층을 잇기", description: "웨이퍼 위에서 영역을 고르고 연결한 뒤 수율을 확인합니다.", subcategories: ["semiconductor-fabrication"] },
    ],
    featuredArticles: ["bands-and-doping", "wafer-and-planar-process", "lithography-and-resolution", "doping-and-thermal-budget", "interconnect-and-rc-delay", "yield-defect-and-packaging"],
  },
  devices: {
    title: "전압으로 흐름을 바꾸기",
    description: "반도체 안의 전자·정공을 세었다면, 두 영역을 붙여 한 방향의 전류가 달라지는 이유를 따라갑니다.",
    stages: [
      { eyebrow: "01 · 접합", title: "전하가 만드는 장벽", description: "두 영역을 붙인 뒤 스스로 생기는 전기장과 외부 전압의 효과를 구분합니다.", subcategories: ["junction-devices"] },
      { eyebrow: "02 · 표면", title: "절연층 너머의 전기장", description: "전극을 직접 닿게 하지 않고 표면의 전하를 모으거나 밀어내는 방법입니다.", subcategories: ["field-effect-devices"] },
    ],
    featuredArticles: ["pn-junction-and-rectification", "mos-capacitor-and-inversion", "mosfet-regions-and-transfer", "switching-energy-and-leakage"],
  },
  embedded: {
    title: "칩에서 동작하는 프로그램 읽기",
    description: "RP2040의 핀 한 개를 제어하는 일에서 시작해 사건 대응과 주기 작업, 통신, 복구까지 연결합니다.",
    stages: [
      { eyebrow: "01 · 장치", title: "주소와 신호", description: "레지스터·인터럽트·타이머·버스가 실제 핀과 어떻게 이어지는지 봅니다.", subcategories: ["embedded-hardware"] },
      { eyebrow: "02 · 운영", title: "마감과 복구", description: "여러 작업이 시간을 나눠 쓰고 업데이트 실패 뒤 돌아오는 방법을 봅니다.", subcategories: ["embedded-software"] },
    ],
    featuredArticles: ["mcu-memory-map-and-registers", "interrupts-and-latency-budget", "timers-and-sampling", "serial-buses-and-tradeoffs", "scheduling-and-real-time", "firmware-update-and-recovery"],
  },
  ai: {
  "title": "AI를 위에서 아래로 읽는 네 단계",
  "description": "먼저 공통 원리를 잡고, 모델 구조와 논문을 읽은 뒤, 서빙·에이전트 시스템과 실제 구현으로 내려갑니다. 이미 아는 단계는 건너뛰어도 됩니다.",
  "stages": [
    {
      "eyebrow": "01 · 기준선",
      "title": "데이터와 모델의 공통 언어",
      "description": "신경망·attention·시계열·생성 모델의 입출력을 먼저 잡고, 관측을 예측해 행동을 고르는 월드모델의 차이를 살펴봅니다.",
      "subcategories": [
        "ai-foundations",
        "ai-nlp",
        "ai-vision",
        "ai-timeseries",
        "ai-generative"
      ]
    },
    {
      "eyebrow": "02 · 원리와 근거",
      "title": "LLM 구조와 논문을 읽는 층",
      "description": "Transformer를 기준 블록으로 삼고, 정렬·긴 문맥·구조 변경을 원 논문과 함께 확인합니다.",
      "subcategories": [
        "ai-llm-theory",
        "ai-llm-applied"
      ]
    },
    {
      "eyebrow": "03 · 시스템",
      "title": "서빙과 에이전트 실행 구조",
      "description": "KV cache·scheduler·tool loop·sandbox처럼 모델 밖에서 성능과 안전성을 결정하는 계층으로 확장합니다.",
      "subcategories": [
        "ai-llm-serving",
        "ai-agents",
        "ai-agents-claw"
      ]
    },
    {
      "eyebrow": "04 · 적용",
      "title": "구현·실험·운영으로 검증",
      "description": "직접 구현하고, 데이터와 평가를 고정한 뒤, 재현 가능한 기록과 운영 판단으로 마무리합니다.",
      "subcategories": [
        "ai-from-scratch",
        "ai-practical",
        "ai-agents-ops"
      ]
    }
  ],
  "featuredArticles": [
    "deep-learning-overview",
    "math-vectors-inner-products",
    "math-functions-composition",
    "math-functions-derivatives-gradients",
    "math-gradients-jacobians",
    "math-exponents-logarithms",
    "math-probability-expectation-variance",
    "math-random-variables-expectation",
    "math-variance-sampling",
    "math-optimization-objectives",
    "math-optimization-convexity",
    "math-gradient-descent-convergence",
    "gan",
    "gan-training-dynamics",
    "gan-wasserstein-critics",
    "gan-conditional-evaluation",
    "modern-image-model-stack",
    "visual-representation-tokenizers",
    "world-model-latent-planning",
    "transformer-architecture",
    "supervised-fine-tuning",
    "grammar-constrained-generation",
    "kimi-k3-architecture",
    "yarn-rope-extension",
    "sionic-eureka",
    "sionic-glm-b300",
    "kv-cache-fundamentals",
    "hybrid-kv-cache-allocation",
    "llm-serving-capacity",
    "agent-sandbox-security"
  ]
},
  blockchain: {
  "title": "블록체인을 프로토콜에서 운영까지 읽는 네 단계",
  "description": "분산 시스템과 합의의 공통 전제를 먼저 잡은 뒤, 체인별 실행 구조와 저장·DeFi·ZK 구현으로 내려갑니다. 프로젝트 이름보다 상태가 만들어지고 확정되는 경로를 기준으로 읽습니다.",
  "stages": [
    {
      "eyebrow": "01 · 공통 전제",
      "title": "상태·네트워크·합의",
      "description": "노드가 서로 다른 정보를 보더라도 하나의 상태에 합의해야 하는 이유와 안전성·활성의 기준을 잡습니다.",
      "subcategories": [
        "fundamentals",
        "bft-consensus"
      ]
    },
    {
      "eyebrow": "02 · 체인 구조",
      "title": "Ethereum과 Cosmos의 실행 경계",
      "description": "실행·합의·mempool·상태 저장이 실제 클라이언트에서 어디까지 분리되는지 비교합니다.",
      "subcategories": [
        "ethereum",
        "cosmos"
      ]
    },
    {
      "eyebrow": "03 · 데이터와 모듈",
      "title": "Filecoin과 재사용 가능한 프리미티브",
      "description": "저장 약속이 증명과 체인 상태로 바뀌는 과정, 그리고 작은 합의·네트워크 부품을 조립하는 방식을 봅니다.",
      "subcategories": [
        "filecoin",
        "commonware"
      ]
    },
    {
      "eyebrow": "04 · 응용과 검증",
      "title": "금융 프로토콜과 ZK 구현",
      "description": "프로토콜의 경제적 불변식과 암호학적 검증을 구현·운영 관점에서 연결합니다.",
      "subcategories": [
        "defi",
        "zk-from-scratch"
      ]
    }
  ],
  "featuredArticles": [
    "distributed-systems",
    "bft-theory",
    "node-architecture",
    "reth",
    "prysm",
    "cometbft",
    "filecoin-lotus",
    "filecoin-proofs",
    "ethereum-future-roadmap",
    "glamsterdam-block-execution",
    "robinhood-chain-settlement",
    "robinhood-chain-blob-demand",
    "hyperliquid",
    "rwa-composition",
    "pq-account"
  ]
},
  crypto: {
  "title": "암호학을 공개키·증명·양자 위협으로 읽는 다섯 단계",
  "description": "무엇을 숨기고 검증하는지부터 시작해 증명 시스템을 읽습니다. 이어 양자 계산이 바꾸는 가정과 새로운 키 합의·서명·물리 키 분배를 비교합니다.",
  "stages": [
    {
      "eyebrow": "01 · 산술 기반",
      "title": "공개키 암호와 유한체",
      "description": "정수 연산과 체 연산의 차이, 이산로그 가정, 곡선 위 연산을 먼저 구분합니다.",
      "subcategories": [
        "classical",
        "zkp-math"
      ]
    },
    {
      "eyebrow": "02 · 대표 증명계",
      "title": "SNARK와 STARK의 설계 축",
      "description": "Groth16·PLONK·STARK를 산술화, commitment, setup, verifier 비용이라는 같은 축에서 읽습니다.",
      "subcategories": [
        "zkp-groth16",
        "zkp-plonk",
        "zkp-stark"
      ]
    },
    {
      "eyebrow": "03 · 재귀와 투명성",
      "title": "Folding·IPA·IOP",
      "description": "재귀 증명과 투명한 setup이 어떤 대수 구조와 상호작용 모델을 선택하는지 비교합니다.",
      "subcategories": [
        "zkp-nova",
        "zkp-bulletproofs",
        "zkp-iop"
      ]
    },
    {
      "eyebrow": "04 · 시스템",
      "title": "zkVM과 다자간 계산",
      "description": "개별 proof를 프로그램 실행과 여러 참여자의 안전한 계산으로 확장합니다.",
      "subcategories": [
        "zkp-vm",
        "mpc"
      ]
    },
    {
      "eyebrow": "05 · 양자 위협과 대응",
      "title": "양자 계산·키 합의·서명·광학 통신",
      "description": "네 후보의 진폭 계산에서 출발해 오류를 섞은 키 합의와 서명, 실제 신호로 키를 나누는 방법을 구분합니다.",
      "subcategories": [
        "post-quantum"
      ]
    }
  ],
  "featuredArticles": [
    "finite-field-theory",
    "elliptic-curve",
    "snark-overview",
    "groth16",
    "plonk",
    "stark-theory",
    "fri",
    "nova",
    "prover-memory-and-verifier-cost",
    "quantum-computing-and-cryptographic-risk",
    "ml-kem-and-noisy-equations",
    "post-quantum-signatures",
    "quantum-key-distribution"
  ]
},
  p2p: {
    title: "P2P를 발견에서 데이터 전달까지 읽는 네 단계",
    description:
      "연결된 노드 목록부터 외우지 않고, 상대를 찾고 연결하고 신뢰를 확인한 뒤 데이터를 교환하는 실제 경로를 따라갑니다.",
    stages: [
      {
        eyebrow: "01 · 네트워크 모델",
        title: "주소·토폴로지·피어 발견",
        description:
          "중앙 서버가 없을 때 노드가 누구를 알고 어떤 거리 기준으로 새 피어를 찾는지 봅니다.",
        subcategories: ["p2p-fundamentals", "p2p-discovery"],
      },
      {
        eyebrow: "02 · 연결",
        title: "전송·NAT·멀티플렉싱",
        description:
          "발견한 피어와 실제 세션을 만들 때 주소 변환, 보안 연결, stream이 어떻게 조립되는지 봅니다.",
        subcategories: ["p2p-transport"],
      },
      {
        eyebrow: "03 · 범용 프로토콜",
        title: "libp2p와 IPFS",
        description:
          "전송 부품을 조립하는 프레임워크와 콘텐츠 주소 기반 데이터 그래프를 연결합니다.",
        subcategories: ["p2p-libp2p", "p2p-ipfs"],
      },
      {
        eyebrow: "04 · 전송 시스템",
        title: "BitTorrent와 Iroh",
        description:
          "대규모 조각 교환과 QUIC 기반 직접 연결이 처리량·복구·운영 문제를 푸는 방식을 비교합니다.",
        subcategories: ["p2p-bittorrent", "p2p-iroh"],
      },
    ],
    featuredArticles: [
      "tls-fundamentals",
      "kademlia",
      "kad-lookup",
      "libp2p",
      "libp2p-tcp",
      "bittorrent",
      "ipfs",
      "iroh",
    ],
  },
  gpu: {
  "title": "GPU를 하드웨어 예산에서 커널 성능까지 읽는 네 단계",
  "description": "64개 배열의 코드에서 출발해 NVIDIA·AMD 실행 단위와 HBM의 실제 접근 경로를 비교하고, CUDA·HIP 최적화와 특화 가속으로 이어갑니다.",
  "stages": [
    {
      "eyebrow": "01 · 시스템 예산",
      "title": "연산·메모리·스토리지·인프라",
      "description": "서버가 감당할 수 있는 전력·대역폭·용량의 상한을 먼저 계산합니다.",
      "subcategories": [
        "hw-compute",
        "hw-memory",
        "hw-storage",
        "hw-infra"
      ]
    },
    {
      "eyebrow": "02 · 실행 모델",
      "title": "CUDA·HIP 실행과 메모리 요청",
      "description": "같은 원소의 번호와 주소를 thread·warp 또는 wave에서 추적하고, register·shared memory·LDS·HBM의 역할을 구분합니다.",
      "subcategories": [
        "gpu-fundamentals"
      ]
    },
    {
      "eyebrow": "03 · 특화 가속",
      "title": "MSM·NTT·증명 파이프라인",
      "description": "수학 연산의 병렬성을 kernel에 배치하고 CPU·GPU 경계 비용까지 포함해 성능을 측정합니다.",
      "subcategories": [
        "zk-acceleration"
      ]
    },
    {
      "eyebrow": "04 · 가속기 설계",
      "title": "PE 한 칸에서 시스톨릭 배열까지",
      "description": "GPU가 소프트웨어로 만드는 재사용을 이번에는 RTL 배선 자체로 만듭니다. 실제 오픈소스 NPU 저장소를 코드 단위로 추적합니다.",
      "subcategories": [
        "accelerator-design"
      ]
    }
  ],
  "featuredArticles": [
    "cuda-basics",
    "gpu-architecture",
    "cuda-thread-hierarchy",
    "amd-gpu-execution-and-hip",
    "gpu-memory-hierarchy-and-roofline",
    "hbm-stack-and-memory-requests",
    "cuda-shared-memory",
    "cuda-perf-analysis",
    "cuda-register-pressure",
    "cuda-kernel-fusion",
    "cuda-persistent-kernels",
    "gpu-arch-hopper",
    "msm-ntt",
    "msm-gpu-impl",
    "ntt-gpu-impl",
    "gemmini-pe-mac-dataflow"
  ]
},
  tee: {
    title: "TEE를 위협 모델에서 배포까지 읽는 네 단계",
    description:
      "제품 이름보다 누가 무엇을 신뢰해야 하는지부터 정합니다. 격리 경계와 원격 증명을 이해한 뒤 CPU별 구현과 실제 인프라·네트워크로 내려갑니다.",
    stages: [
      {
        eyebrow: "01 · 신뢰 경계",
        title: "TCB·격리·원격 증명",
        description:
          "호스트·하이퍼바이저·게스트 중 무엇을 공격자로 두고 어떤 측정값을 신뢰하는지 잡습니다.",
        subcategories: ["tee-fundamentals"],
      },
      {
        eyebrow: "02 · 서버 CPU",
        title: "Intel SGX·TDX와 AMD SEV",
        description:
          "process enclave와 confidential VM이 메모리·페이지 테이블·attestation을 다루는 방식을 비교합니다.",
        subcategories: ["tee-intel", "amd-sev"],
      },
      {
        eyebrow: "03 · 모바일과 Realm",
        title: "ARM TrustZone·CCA",
        description:
          "secure world 분리에서 Realm 기반 기밀 VM으로 확장되는 경계를 봅니다.",
        subcategories: ["tee-arm"],
      },
      {
        eyebrow: "04 · 운영",
        title: "배포 인프라와 TEE 네트워크",
        description:
          "키 프로비저닝·정책 검증·오케스트레이션을 서비스와 분산 네트워크에 연결합니다.",
        subcategories: ["tee-infra", "tee-net"],
      },
    ],
    featuredArticles: [
      "hw-security",
      "intel-sgx",
      "intel-tdx",
      "amd-sev",
      "op-tee",
      "dstack",
      "keylime",
      "oasis",
    ],
  },
  "isms-aml": {
    title: "컴플라이언스를 범위에서 증적까지 읽는 네 단계",
    description:
      "통제 항목을 체크리스트처럼 외우지 않고 자산과 위험을 정한 뒤, 예방 통제·탐지와 대응·규제 보고까지 이어지는 운영 흐름으로 읽습니다.",
    stages: [
      {
        eyebrow: "01 · 관리체계",
        title: "범위·자산·위험·책임",
        description:
          "무엇을 보호하고 누가 책임지며 어떤 위험을 수용할지 정한 뒤 증적 구조를 만듭니다.",
        subcategories: ["isms-management"],
      },
      {
        eyebrow: "02 · 보호와 복구",
        title: "접근통제·개발보안·사고 대응",
        description:
          "예방 통제와 탐지, 백업·복구가 하나의 운영 사이클에서 어떻게 증명되는지 봅니다.",
        subcategories: ["isms-protection"],
      },
      {
        eyebrow: "03 · 개인정보와 AML",
        title: "데이터 생명주기와 위험기반 감시",
        description:
          "수집·보유·파기와 CDD·RBA·FDS·STR을 각각의 입력과 판단 책임으로 구분합니다.",
        subcategories: ["isms-privacy", "aml-cft"],
      },
      {
        eyebrow: "04 · VASP 운영",
        title: "수탁·지갑·시장 감시",
        description:
          "가상자산 보관과 내부통제, 불공정거래 탐지를 실제 운영 증적과 연결합니다.",
        subcategories: ["vasp-compliance"],
      },
    ],
    featuredArticles: [
      "isms-overview",
      "isms-audit-checklist",
      "isms-practical-guide",
      "isms-encryption",
      "isms-dev-security",
      "aml-compliance",
      "aml-rba-deep",
      "vasp-wallet-security",
    ],
  },
};
