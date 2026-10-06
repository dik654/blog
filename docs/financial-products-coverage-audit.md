# 금융상품 학습 누락 검증

확인일: 2026-10-07. 이 표는 특정 종목의 매수 목록이 아니라 지급 청구권·재원·상대방·손실 조건이 본문에서 설명되는지 검증한 기록이다. 시장에 존재하는 모든 개별 발행 상품을 열거했다는 뜻은 아니다. 분류가 같아도 실제 만기·준거법·상환식은 투자설명서로 확인한다.

## 상품과 정본의 대응

| 상품·주제 | 돈의 재원과 청구 대상 | 실제로 계산한 조건·반례 | 정본과 위치 | 검증 상태 |
| --- | --- | --- | --- | --- |
| 예금·예금보호 | 은행 지급 의무와 적격 예금 보호 | 1000만 원 4%→1040만 원, 한국·미국·EU 합산 단위 차이 | `markets/financial-products-and-claims#comparison` | 본문·공식 근거 |
| 소비자 대출·상환 일정 | 차주의 원리금 지급 | 만기 일시상환 이자60만 원 / 월 원금균등32만5000원 | `markets/financial-products-and-claims#mechanism` | 본문·수치 |
| 주식 | 채무 지급 뒤 남는 재산·현금 | 잔여 청구권과 가격 기대 | 기존 `markets/equity-claims-and-valuation` | 기존 정본 재사용 |
| 채권·수익률곡선 | 발행자의 약정 현금흐름 | 수정 듀레이션5, 금리+1%포인트→가격 약−5% | 기존 `markets/bond-pricing-and-yield-curve#duration`, ETF 한계절 연결 | 기존 정본 재사용 |
| 펀드·실물 ETF·적극 운용 ETF | 분리된 펀드 재산 지분 | NAV10000 / 매수10100 / 매도11000→8.91% | `markets/funds-etfs-and-etns#mechanism` | 본문·SEC 원문 적용 |
| 합성 ETF | 펀드 지분 안의 스왑 등 계약 | 기초자산 상승에도 상대방 지급 실패 가능, 담보 규정 별도 | `markets/funds-etfs-and-etns#limits`, 커버드콜9절 | 미국 QYLD·유럽 UCITS 구분 |
| ETN | 발행 금융회사의 채무 | 11000원 청구·회수40%→4400원 | `markets/funds-etfs-and-etns#mechanism` | 본문·SEC 원문 적용 |
| MMF | 단기 채무·레포 등의 수익을 받는 펀드 지분 | 1000→995만 원이면5만 손실, 예금 보호와 분리 | `markets/financial-products-and-claims#limits` | SEC 유형·NAV·유동성 근거 |
| 레버리지·인버스 ETF | 매일 목표 노출을 재설정하는 펀드 | 지수100→110→100에서2x98.18 /3x94.55 /−3x89.09 | `markets/funds-etfs-and-etns#comparison` | TQQQ/SQQQ 2026-09-28 설명서 |
| 차입 투자·마진 거래 | 자산에서 빚을 뺀 자기 몫 | 자산90·빚80·허용80%에서 현금8/담보10/내부매각40 | `risk/margin-collateral-and-leverage#mechanism` | 가정 비율 명시·금액 검산 |
| 외화·환헤지형 상품 | 외화 자산과 반대 통화 계약 | 달러 자산+10%, 달러당 원화−10%→원화−1% | ETF10절, 선물9절, `macro/global-capital-and-policy` | 금리차·통화·현금 날짜 연결 |
| 선도·선물 | 계약 상대방·청산 정산 | 밀100톤30만→35만:500만 반대 손익, 중간 현금 별도 | `markets/forwards-and-futures#mechanism` | CME 원문 적용 |
| 무차익 선물 가격·보유비용·베이시스 | 같은 만기 자산을 마련하는 현물·차입·선물 묶음 | 현물100+이자5−배당2=103, 선물108 매도 차이5 | `markets/no-arbitrage-cost-of-carry-and-basis#case` | CME·MIT 과정 대조 |
| 중앙청산·개시/변동증거금 | 고객·회원·청산소 사이의 일일 현금과 부도 재원 | 잔액12−손실8=4, 유지9 아래서8 추가 납부 | `markets/clearing-margin-and-default-waterfall#case` | CFTC 스트레스·규칙 대조 |
| 원자재 선물형 ETF·롤오버 | 만기별 선물 손익과 담보 이자 | 밀 새 만기31.5만→30만·100톤:−150만, 교체 즉시 손실로 오해하지 않음 | `markets/forwards-and-futures#mechanism` | 콘탱고·백워데이션·수렴 조건 |
| 콜·풋·보호적 풋 | 선택권과 이행 의무 | 콜K100·비용8·S120→12, 주식+풋 최대손실8 | `markets/options-and-asymmetric-payoffs#mechanism` | 수식·손익곡선·OCC/KRX |
| 옵션 복제·풋콜 등식 | 같은 미래 지급을 만드는 주식·현금 묶음 | 주식0.5주−차입40→상승20/하락0, 오늘값10 | `markets/option-replication-and-put-call-parity#case` | MIT 이항모형·OIC 대조 |
| 그릭스·내재변동성·동적 헤지 | 가격·곡률·시간·변동성 민감도와 재조정 거래 | Δ0.50·Γ0.04·vega0.09·theta−0.08에서 하루 근사+1.45 | `markets/option-greeks-volatility-and-dynamic-hedging#case` | OIC·OCC 경계 적용 |
| 커버드콜·인컴 펀드 | 보유 주식과 콜 매도대금 | 100주100·K105·비용수취3·S90/103/120→−700/600/800 | `markets/covered-calls-and-income-funds#mechanism` | 독립10층위·손익곡선 |
| 부분 커버드콜·ATM/OTM·0DTE | 매도 수량·가격·만기 선택 | 200주에100주 콜이면 주당120에서14, 초과매도는 미담보 | 커버드콜9절 | 계약 단위와 경로 설명 |
| 분배금·자본환급·총수익 | 자산에서 지급된 현금 | NAV100→88+분배12=총수익0%, ROC는 세무 추정과 구분 | 커버드콜7·9절 | QYLD 실제19a·최종 세무자료 아님 |
| 금리·통화 스왑 | 서로 다른 조건의 지급 교환 | 10억 고정4%·변동6%→순수취2000만, 대출 합산4000만 | `markets/swaps-and-credit-risk#mechanism` | 순현금·명목금액 구분 |
| FRA·캡·플로어·스왑션 | 한 기간 금리 차액과 여러 기간의 의무·선택권 | 10억×(6%−4%)×0.25=약500만 원, 선지급 할인 구분 | `markets/interest-rate-derivatives-from-fra-to-swaptions#case` | MIT·CME SOFR 사례 대조 |
| 파생상품 권유·설명·기록 | 고객 목적·재산·경험과 상품 시나리오의 대응 | 수출1억달러·매도의무2억달러·환율차200원→초과분200억원 | `markets/derivatives-suitability-disclosure-and-sales-practice#case` | 금소법·금융투자교육원 과정 대조 |
| 환헤지·선도포인트·교차통화 베이시스 | 받을 통화−낼 통화의 순노출과 두 통화 조달비용 | 100만달러−20만달러, 현물1350·금리3%/5%→석달 선도 약1343원 | `markets/currency-hedging-forward-points-and-cross-currency-basis#case` | CME·BIS 근거와 과다 헤지 반례 |
| 원자재 보유비용·편의수익·롤 | 현물 재고의 비용·운영 편익과 계약 교체 손익 | 현물75+자금0.75+보관1−편의2=석달 선물74.75 | `markets/commodity-carry-convenience-yield-and-roll#case` | CME 곡선·WTI 인도 규칙 대조 |
| 옵션 조합·구조화채권 | 채권 부품과 내재 옵션의 만기·경로별 지급 | 투자100=채권92+옵션8, 100/120 콜스프레드·장벽70 | `markets/option-strategies-and-structured-notes#case` | OIC·SEC 근거와 발행자 신용 |
| CDS·지수 트랜치 | 신용 사건·회수율 지급과 포트폴리오 손실 순서 | 1억·스프레드2%·회수40%→프리미엄200만·보호6000만 | `markets/credit-derivatives-default-risk-and-tranches#case` | ISDA 결정 절차·BIS 트랜치 구조 |
| 장외 기본계약·CSA·CVA | 거래상대별 상계집합, 담보와 미래 양의 노출 | +5+4−2−5=순액2, 담보1.5 뒤0.5, 노출10×PD2%×LGD60%=0.12 | `markets/otc-master-agreement-collateral-netting-and-cva#case` | ISDA·바젤 근거와 관할 경계 |
| VaR·예상손실·스트레스 | 손실 문턱·꼬리 평균·지정 복합 충격 | 열 손실의 80% VaR4·ES8·별도 스트레스18 | `markets/var-expected-shortfall-stress-and-model-risk#case` | 바젤97.5% ES와 설명용80% 구분 |
| 최소분산 헤지·베이시스 위험 | 현물 노출과 선물 가격 변화의 통계적 관계 | 1억÷250만=40, 회귀 기울기0.8→32계약 | `markets/minimum-variance-hedge-ratio-and-basis-risk#case` | CME 공식 헤지 예제·표본 변화 경계 |
| 이항 옵션가격·미국형 조기행사 | 주식·현금 복제로 만든 각 갈림길의 보유가치와 행사가치 | q=0.625, 하락 노드 보유15.24·행사20, 미국형7.99·유럽형6.29 | `markets/binomial-black-scholes-and-early-exercise#case` | MIT·OIC 자료와 실제 확률 구분 |
| 내재변동성 표면·스큐·미소 | 옵션 호가를 행사가·만기별로 역산한 상대가격 지도 | 90풋30%·중앙20%·110콜24%, 위험반전−6%p | `markets/implied-volatility-surface-skew-and-smile#case` | CME·바젤 근거와 예측값 오해 경계 |
| 금리곡선 부트스트랩·다중곡선 | 시점별 할인계수와 기준금리 지급을 예상하는 곡선 | 100=5×0.96+105×DF₂→0.9067, 2년5.02%·선도5.88% | `markets/yield-curve-bootstrapping-multicurve-and-key-rate-hedging#case` | CME SOFR·BIS 기준금리 전환 대조 |
| xVA·증거금 조달·동시 악화 위험 | 상대방·자기 신용, 무담보 자금과 개시증거금 비용 | 10−0.6+0.2−0.3−0.1=9.2, MVA0.1, 동시 악화 손실0.54 | `markets/xva-funding-margin-and-wrong-way-risk#case` | 바젤 CCR·ISDA 담보 운영과 중복 경계 |
| 시장위험 백테스트·손익 귀속·모형 검증 | 위험값과 가상·실제·위험이론 손익의 비교 및 독립 검증 | 250일 예외7번→amber·승수1.83, 열흘 표본과 분리 | `markets/market-risk-backtesting-pnl-attribution-and-model-governance#case` | 바젤·2026 연준 모형 지침 대조 |
| ELS·DLS | 지수·금리·환율·신용 등 조건부 발행자 채무 | 가정 문턱60%:최종61%→1060만 /59%→590만 | `markets/financial-products-and-claims#source` | 청구권·관측·상환식·발행자 구분 |
| ELB·DLB·원금지급형 구조화증권 | 만기 원금 지급을 약속한 발행자 | 만기 약속과 중도960만 평가·발행자 부도는 별도 | 상품지도7·8절 | 실제 한국 ELB 공시·SEC 구조화 설명 |
| ELN | 주가 등에 연동된 채무 | ETF 내부 ELN은 발행자의 신용·현금화 위험 추가 | 상품지도8절, 커버드콜9절 | JEPI 공식 위험 설명 |
| 리츠 | 임대·부동산 관련 수익에서 비용·차입 지급 차감 | 임대료100−운영30−이자20−수선25=현금25 | 상품지도10절 | SEC 근거·세무이익과 구분 |
| 보험·보장·해약 | 보험료 공동 부담과 보험자의 계약 의무 | 사건·면책·지급 한도 | 기존 `institutions/insurance-risk-pooling` | 별도 정본 재사용 |
| DB·DC·개인 연금계좌 | 급여 산식 또는 적립자산 | 적립1000→900의 손실 부담 차이 | 상품지도8절 | DOL 정의·국가별 지급/세금 경계 |
| TDF·글라이드패스 | 배분을 바꾸는 펀드 자산 | 주식80%/40%, 주가−20%·채권0%→−16%/−8% | 상품지도8절 | SEC 2025-03-25, 목표일 보장 아님 |
| 사모펀드 | 펀드의 실제 자산·차입 및 계약상 환매 | 모집 방식만으로 기초자산 안전성 판단 불가 | 상품지도6절 | 분류 경계, ETF·자산 정본 연결 |
| 유동화·트랜치 | 이전된 대출 현금흐름 | 70/20/10 구조에서손실35→10+20+5 | `markets/securitization-and-tranches#mechanism` | EU/KR 위험보유·상관 반례 |
| 레포·역레포·헤어컷 | 증권 매매와 되사기 약정 | 담보100·5%→현금95, 담보90·10%→현금81·부족14 | `banking/repo-and-collateral-funding#mechanism` | ICMA/NYFed/BOK 원문 적용 |

## 원문 확인 기록

- [QYLD SEC 요약설명서, 2026-03-01](https://www.sec.gov/Archives/edgar/data/1432353/000143235326000239/a497knasdaq100coveredcall.htm): 월간 지수 콜, 만기 전 청산, 현금결제. 개별주식 조기 배정과 구별한다.
- [QYLD 19a 원본 DOCX, 2026-09-24](https://assets.globalxetfs.com/funds/tax_supplements/QYLD_Form-19a_09242026.docx): 0.1767달러를 0.0022와 0.1745로 추정 분류. 원본을 내려받아 DOCX XML 본문을 읽었으며 별도 NAV/총수익 계산과 분리했다.
- [TQQQ 요약설명서](https://prod.proshares.com/globalassets/proshares/prospectuses/tqqq_summary_prospectus.pdf), [SQQQ 요약설명서](https://prod.proshares.com/globalassets/proshares/prospectuses/sqqq_summary_prospectus.pdf): 둘 다 2026-09-28 표지와 하루 투자목표를 확인했다. 여러 날 배수는 예시로 직접 계산했다.
- [CME 콘탱고·백워데이션 교육](https://www.cmegroup.com/education/courses/introduction-to-ferrous-metals/what-is-contango-and-backwardation): 공식 영상이 포함된 교육 페이지와 본문을 읽었다. 영상 전체를 시청하거나 자동 자막을 검증했다는 주장은 하지 않는다.
- [신한투자증권 ELS/DLS 공식 분류](https://www.shinhansec.com/wts/wealth-management/els/els_guide_invest_tab1/contents.do), [DB 제92회 ELB 설명서](https://kind.krx.co.kr/external/2026/07/30/000632/20260730001461/10603.htm): 기초자산 분류와 발행자 지급불능·중도상환 위험을 확인했다.
- [국세청 펀드 외국납부세액공제, 2026 안내](https://s.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350542), [IRS Publication 515](https://www.irs.gov/publications/p515): 관할·소득분류·계좌 구분만 설명하며 개인의 실제 세후 금액은 단정하지 않았다.

## 검수 경계

수치 예시는 특정 종목 전망이나 실제 가입 조건이 아니다. 커버드콜의 50% 비율은 200주에 100주분 계약 하나를 대응시켜 반쪽 계약을 실제 거래하는 것처럼 설명하지 않았다. 연준 레포의 명칭은 거래 현금 방향과 별도로 확인했다. 금융상품의 높은 지급률을 시장 성과·보장 수익으로 전환하지 않았다.

## 영상 조사 범위

[OIC의 2024-07-19 YouTube 강의](https://www.youtube.com/watch?v=5fRa78w8f0k)는 공식 게시자와 공개 설명의 장 구분(기본4:31·하락35:33·상승40:38·오해48:15)을 확인했다. 전체 자막이나 영상 시청을 주장하지 않는다. 조기 행사와 계약 교체는 별도 [Fidelity/OIC 공식 강의록](https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/learning-center/Exercise_an_%20assignment_TRANSCRIPT.pdf) 6–7쪽·18쪽에서 원문으로 대조했다. 영상은 복습 경로이고 지급·세금의 최종 근거는 설명서와 공시다.
