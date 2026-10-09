# F-applied-economics 감사 원장
확인일: 2026-10-09. 글 32편(institutions 9 · infrastructure 7 · business 7 · property 4 · firms 3 · labor 2). 열어 본 URL 196개(성공 182 / 실패 14). 실패 14개 중 대부분은 이 환경에서의 403·타임아웃(UNDRR·IEA·FERC·OECD×2·UNEP·HDB·floodsmart.gov·NSW Small Business Commissioner×2+1·OUP 목차·M49 FAQ 하위 경로 404 등)이며, 가능한 것은 web.archive.org·RePEc·Chrome·관보 미러로 대체 확인했다. 작업은 네 묶음(property+labor+firms / business / institutions / infrastructure)으로 나눠 수행했고 묶음별 원본 원장은 `F-parts/`에 있다. 글 파일은 수정하지 않았다.

## 적용 결과
적용일 2026-10-09. 글 본문 27편(`src/pages/articles/{property,labor,firms,business,institutions,infrastructure}/…tsx`)을 고쳤고, 공용 파일은 손대지 않고 끝의 `## 공용 파일 수정 목록`(old→new 54쌍, `apply-shared.py --dry`로 54쌍 모두 1회 일치 확인)에 올렸다. 손대지 않은 글: business-model-cashflow, scale-and-cost-structure, electricity-grid-and-power, water-utility-and-tariffs(이 네 편은 공용 파일 쌍만), media-attention-and-public-belief(후속 작업). 새로 넣은 문단은 260자 미만으로 나눠 문장 호흡 검사의 긴 문단 신호를 만들지 않게 했다.

| # | 처리 | 내용 |
|---|---|---|
| 1 | 적용 + 공용파일 목록으로 이관 | `shop-site-selection` 3절을 1,333.33÷30≈44.44건(1,334건 기준 44.47건)으로 정정. learning 체크리스트는 목록으로 |
| 2 | 적용 + 공용파일 목록으로 이관 | UNESCO 두 인용 8+11=19단어로 정정, evidence note는 목록으로 |
| 3 | 적용 + 공용파일 목록으로 이관 | `shop-fitout-and-opening`·`shop-daily-operations` 인용 블록의 "10월 8일 변경을 앞당겨 적용하지 않는다"를 "2026-10-08 시행분(결격조항 정비)은 이미 시행, 제40·41조 불변, 다음 예고는 2026-12-31"로 갱신. evidence note 2곳은 목록으로 |
| 4 | 적용 + 공용파일 목록으로 이관 | `land-development-residual` 8절·인용·10절에 2019년 10월 발행·2020-02-01 발효, 현재 RICS Professional Standard 분류를 기입. evidence·learning은 목록으로 |
| 5 | 적용 | `measuring-the-spread` 4절: 현대 관례(가로=사람, 세로=몫) 조건을 붙이고, 두 번째 장면은 214쪽 표를 다시 그린 것이며 Lorenz 218쪽 원 그림은 축이 바뀌어 곡선이 대각선 위로 휜다고 고침 |
| 6 | 적용 | `wage-floor-natural-experiment`: "일부 가맹점주" → 1995년 EPI 연구에 펜실베이니아 자료를 처음 제공한 한 가맹점주의 소수 매장, 보고 간격별 추세 차이 |
| 7 | 적용 | `shop-transfer-and-goodwill` FlowRail receives를 "기존 점주가 새 점주로부터 먼저 받기로 한 300만 원"으로 |
| 8 | 공용파일 목록으로 이관 | 일곱 글 21개 개념을 본문과 하나씩 대조. 16개의 `sectionId`·`intuition`(필요하면 `workedExample`·`boundary`)을 실제 정의 문단으로 옮기고 KG `canonicalHref` 12개를 고침(허가 시간·부패성·수도 부담 귀속·세 요소 등 → `names`, 전력 시스템 비용·금융 전달 → `mechanism`). 이미 맞는 5개(food-price-causality-boundary, climate-history-boundary, collection-recovery-yield, waste-financing-responsibility, circularity-displacement-boundary)는 그대로 둠 |
| 9 | 적용 + 공용파일 목록으로 이관 | `climate-risk-and-exposure` 3절 위해 = "자연적·인위적 물리 사건이나 추세가 일어날 가능성", 취약성 = 민감성 + 대응·적응 능력 부족, 사례 손상률은 민감성만 단순화. KG 정의는 목록으로 |
| 10 | 적용 | `food-chain-and-prices` 5절: 100=생산, 30=집하, 50=유통, 운송 20은 FAO 그림 3의 지원 서비스, 가공 단계 없음 |
| 11 | 적용 | `transport-access-and-land-value` 6절 제목·본문·인용의 "영국" → "잉글랜드"(Applies to England, 2026-02-18 갱신) |
| 12 | 적용(일부) + 후속 작업 | `materials-waste-and-circularity` 3절: 일반 개념 "확대생산자책임(EPR)"과 한국 제도명 "생산자책임재활용제도"를 분리. 한국 제도의 대상·의무 방식은 법령 원문 미개봉이라 후속 |
| 13 | 적용 | `shop-closure-and-restoration` 10절에 2026-01-19 공고의 폐업일별 한도(’23.1.1~’25.7.10 400만 원, ’25.7.11~ 600만 원)와 3.3㎡당 20만 원 중 작은 값, 공급가액만, 33㎡·99㎡ × 폐업일 두 가지 (가정) 사례, ’23.1.1 이후 폐업·1회 한정·사업자등록 업체·자력철거 제외·동일 장소 3년 재창업 제한 |
| 14 | 적용 | `commercial-lease-and-rent` 7절에 제19조의2 관리비 내역 요청권(2026-05-12 시행, 부칙 제2조: 시행 후 체결·갱신 계약부터)과 30만 원 (가정) 사례 |
| 15 | 적용 | 같은 글 8절에 환산보증금 = 보증금 + 월세 × 100, 사례 2억3천만 원, 시행령 제2조 지역 기준(서울 9억·과밀억제권역/부산 6억9천만·광역시 등 5억4천만·그 밖 3억7천만, 2026-07-01 시행본), 서울 10억 원 (가정) 초과 사례와 법 제2조③ 예외 목록. 9절에 시행령 제4조 5% 상한(200만→210만, 3천만→3천150만)과 기준 초과 시 미적용 |
| 16 | 적용 + 공용파일 목록으로 이관 | 지니계수 이름과 Gini 1912(평균차)·1914(넓이 비 = 집중비 R의 극한) 귀속 추가, KG aliases는 목록으로 |
| 17 | 적용(일부) + 후속 작업 | `why-firms-exist` 12절에 Coase 노벨 강연의 Williamson 언급과 Williamson(1979) 서지만 연결. 자산 특수성·홀드업을 같은 사례로 푸는 절은 후속 |
| 18 | 적용 | `market-power-and-markup` 6절에 러너 지수(Lerner 1934, 서지만), μ = P/MC ≈ 1.43 ↔ L = 1 − 1/μ = 0.3, DEU 2020 QJE 21%→61%(L ≈ 0.17→0.38), NBER판 18%→67%, 중앙값 불변 |
| 19 | 적용 | `franchise-incentives` 9절에 가맹사업법 제7조③·제11조① 14일(자문 시 7일)과 제6조의5 가맹금 예치(피해보상보험 예외), 7절 비용 목록에 예치 여부 질문 |
| 20 | 적용 | 같은 글 5절 제12조의4 영업지역(반경 500m (가정) 사례), 6절 제11조②12호 필수품목 종류·공급가격 산정방식, 7절 제12조의2 강요 금지·100분의 40 이내 분담(5천만 원 (가정) → 최대 2천만 원, 비율은 시행령 확인), 온라인·배달 배분은 계약 사항 |
| 21 | 적용 | `shop-site-selection` 9절에 휴게음식점·제과점 300㎡ 기준 제1·2종, 일반음식점 제2종, 120㎡ (가정) 사례, 건축법 제19조 용도변경. `shop-fitout-and-opening` 7절에 용도변경 기간 별도 칸 |
| 22 | 적용 | `shop-daily-operations` 3절에 근로 도중 휴게 30분 조건, 7절에 근로기준법 제54조(4시간→30분, 5인 미만 포함), 2026 최저임금 10,320원(4시간 41,280원), 주 16시간/12시간 (가정) 사례와 제18조③ |
| 23 | 적용 | 같은 글 7절에 우대수수료(3억 이하 신용 0.40%·체크 0.15%, 2025-02-14 적용) → 16만 원이면 640원 |
| 24 | 적용 | `shop-fitout-and-opening` 7절·`shop-daily-operations` 10절에 다중이용업소 100㎡(지하 66㎡)·지상 1층 주출입구 직결 제외, 세 매장 (가정) 판정 |
| 25 | 적용 | `shop-fitout-and-opening` 8절에 간이과세 1억400만 원 기준·제외 업종 존재, 하루 30만/25만 원 (가정) 판정 |
| 26 | 적용 | `supply-chain-bargaining` 7절에 WTO 관세평가협정 제8조 제2항, 운임 포함국이면 7달러, 사례는 운임 제외 가정으로 명시 |
| 27 | 적용 | `healthcare-payment-systems` 6절에 행위별수가제 근간, 7개 질병군 포괄수가제(2013-07 전 의료기관), 정액수가, 심평원 심사·공단 지급, 심평원 안내 링크 |
| 28 | 적용 + 공용파일 목록으로 이관 | `insurance-risk-pooling` 3절에 역선택·도덕적 해이(Akerlof 1970·Rothschild–Stiglitz 1976 서지만)와 정보 비대칭 정본 글 #unravelling·#hidden-action 링크, 7절에 대수의 법칙. KG 간선 2개는 목록으로 |
| 29 | 적용 + 공용파일 목록으로 이관 | `evidence-measurement-and-causality` 4절에 이중차분·평행 추세 이름, KG 정의는 목록으로 |
| 30 | 적용 + 공용파일 목록으로 이관 + 후속 작업 | `education-skills-and-signals` 3절에 Spence(1973) 서지와 분리 조건을 가르치는 정본 글 `/economics/market-failure/information-asymmetry#signaling` 링크, KG 간선(costly-signal-separation → education-signal)은 목록으로. KG `#comparison`→`#names`는 #45. 원 논문 본문 대조는 후속 |
| 31 | 적용 | `public-budget-and-taxes` 6절에 통합재정수지 − 사회보장성기금 수지 = 관리재정수지, −10/+40 → −50 (가정) |
| 32 | 적용 | `population-migration-and-care` 3절 총부양비, 5절 코호트 요인법(CCMPP)과 순국제이동(+1명) |
| 33 | 후속 작업 | DSA 제38조는 원장이 원문을 대조하지 않았으므로 넣지 않음 |
| 34 | 적용(일부) + 후속 작업 | `culture-norms-and-coordination` 7절에 Ostrom의 "설계 원리(design principles)" 이름 연결. 원리 목록과의 짝짓기는 1990년 원전 확인 후 |
| 35 | 적용 | `climate-risk-and-exposure` 5절 excerpt를 "…, shaped by responses"까지 늘리고 그림 1.5의 대응 강조, 용어집의 "human responses" 위험 문단 추가 |
| 36 | 적용 | `transport-access-and-land-value` 6절에 DfT TAG Unit A2.2(2025-05) 중복 계산 경고와 Economic Narrative, 인용 블록에 PDF 링크 |
| 37 | 적용 | 같은 기후 글 3절 취약성 정의에 대응·적응 능력, 6절 회복 능력을 그 요소로 연결하고 UNDRR 노출 주석 반영 |
| 38 | 적용 | `food-chain-and-prices` 4절에 손실(12.3.1a)·폐기(12.3.1b) 구분, 2023년 13.3%(2015년 13.0%), 사례 2개의 귀속 |
| 39 | 적용(보조 출처 명시) + 후속 작업 | `housing-land-and-supply` 6절에 "2023년 3월 기준" 설명임과 2024-10 Standard·Plus·Prime, Plus·Prime 10년 최소 거주·보조금 환수·전체 임대 불가를 보조 출처(EdgeProp)로만 확인했다고 명시. HDB 1차 페이지(403) 재확인은 후속 |
| 40 | 적용 + 공용파일 목록으로 이관 | `shop-transfer-and-goodwill` 인용 href를 lsiSeq=285339로, 본문에 제39조③ 1개월 이내 신고·제78조 처분기간 종료 후 1년 승계·선의 증명 예외. evidence 2곳·learning 3곳은 목록으로 |
| 41 | 적용 + 공용파일 목록으로 이관 | `shop-closure-and-restoration` 근로기준법 제36조 인용을 2026-10-08 시행판(법률 제21533호) 재확인으로, learning assumptions는 목록으로 |
| 42 | 적용 + 공용파일 목록으로 이관 | easylaw 다중이용업소 안내 기준일을 "2026-09-15 기준 작성"으로(두 글), evidence 2곳은 목록으로 |
| 43 | 적용 + 공용파일 목록으로 이관 | 인용 출처를 "[카드뉴스] 5인미만 사업장 적용 노동법(2022-05-10)"으로, 2022년 최저임금 9,160원 자료임을 표시. evidence label은 목록으로 |
| 44 | 적용 + 공용파일 목록으로 이관 | ICH E8(R1) §5.3·§6 → §5.5·§5.6, 두 절의 실제 내용 기입. evidence는 목록으로 |
| 45 | 공용파일 목록으로 이관 | KG education-signal·health-financing-three-functions canonicalHref → `#names` |
| 46 | 적용 | `how-to-read-a-country` excerpt를 "for strictly statistical purposes"로 |
| 47 | 적용 + 공용파일 목록으로 이관 | `housing-land-and-supply` 5절을 "전문 표준(professional standard)"으로, 인용 블록에 1판 PDF(인용문·24쪽 근거라 href 유지)와 RICS 현행 페이지 링크. evidence note는 목록으로 |
| 48 | 해당 없음 | 원장 판단대로 403은 봇 차단이고 사실 결함이 아니므로 수정하지 않음 |
| 49 | 적용 | NSW 양도 안내 인용에 "2026-10-09 응답 없음·보관 사본 없음, 10-04 열람에 기댐" 범위 기입 |
| 50 | 적용 | NSW make good 인용 2곳에 "2026-10-09 응답 없음, 검색 색인 문장으로만 대조" 기입 |
| 51 | 적용 + 공용파일 목록으로 이관 | `shop-unit-economics` 9절을 Retail Tenancy Guide(Wayback 2026-05-03) 문장으로 바꾸고 "직접적·합리적 관련" 요건 미확인을 인용 블록에 명시. evidence·learning은 목록으로 |
| 52 | 적용 + 공용파일 목록으로 이관 | NFIP 인용에 "자동 조회 불가(403), 같은 문구가 FEMA/NFIP 자료 제목에 있음을 검색으로 2차 확인" 기입. evidence note는 목록으로 |
| 53 | 해당 없음 | 원장 판단대로 가정 수치라 수정하지 않음. 한국 전력시장 문장은 미검증이라 넣지 않음 |

집계: 글 본문에 적용 48건(일부 적용 6건 포함), 공용 파일 목록만 2건(#8, #45), 공용 파일 쌍이 있는 발견 19건(쌍 54개: evidence 13 · learning 23 · knowledge-graph 18), 후속 작업 7건(#33 전체, #12·#17·#30·#34·#39 일부, 등록 모듈 노후화), 해당 없음 2건(#48, #53).

검증(2026-10-09): `npx eslint` 27개 파일 통과. `scripts/check-article.sh`는 첫 단계 `merge-registrations.mjs`가 노후 등록 모듈로 공용 파일을 되돌리므로(아래 공용 파일 절 참고) 병합 단계만 뺀 같은 감사 묶음(learning-contract·knowledge-graph·viz-style·prose-readability·korean-naturalness·term-density·term-pair-wrapping·reading-order)을 27개 route에 돌렸고, 실행 전후 공용 파일 md5가 같음을 확인했다. 결과는 아래 검증 기록 줄에 적는다.

검증 기록: 27개 route 모두 learning-contract·knowledge-graph·viz-style·korean-naturalness·term-density·term-pair-wrapping·reading-order 통과. 실패는 `audit-prose-readability --strict` 하나뿐이며, 전역 baseline에 걸린 다른 글(ai/claw-api-client 등 171개) 때문이다. 이 클러스터에서 자기 route가 "재검토 필요"로 뜬 것은 `firms/why-firms-exist` 하나로, 새 긴 문단이 아니라 기존 목록형 문단 4개(score 8, baseline과 같음)에 본문 수정으로 fingerprint만 바뀐 경우다. tsc는 통합자 몫.

## 요약
- 발견: WRONG 0 · OUTDATED 1 · MISLEADING 9 · CALC 2 · LINK 9 · MISSING 27 · UNVERIFIED 5 (총 53건)
- 사실 수치·계산·인용문의 정확도는 높다. 인용 excerpt 약 55개는 원문과 글자 그대로 일치했고(판정 가능분 기준), 모든 모형 함수(`sale`·`optimum`·`welfare`·`methodCosts`·`choices`·`laborPlan`·`monopsonyHours` 등)와 가정 사례 계산을 python3로 재계산해 2건 외에는 맞았다. Card–Krueger 1994 Table 3·7, Lorenz 1905, Coase 1937, Young 1928, Cournot(1897 영역) 인용은 원문 스캔 페이지와 일치. how-to-read-a-country 국가 탐색기 값 856개는 World Bank API(2026-10-08 갱신)와 값·연도 전부 일치. 상가건물 임대차보호법 §3·§5·§10·§10-3·§10-4 서술은 law.go.kr 현행(2026-05-12 시행본)과 일치.
- 결함의 중심은 **한국 제도 정본으로서 빠진 부품(MISSING 27)** 과 **학습 데이터의 개념-문단 배치 오류**다.
- 가장 중요한 발견
  1. **희망리턴패키지 점포철거비 한도를 영상 수치로만 다룸** — `property/shop-closure-and-restoration.tsx:130-133` (MISSING). 2026-01-19 원스톱폐업지원 공고 자체가 폐업일 기준 한도를 정함('23.1.1~'25.7.10 폐업 400만 원, '25.7.11 이후 600만 원)과 1회 한정·동일 장소 3년 재창업 제한·자가철거 제외를 명시하는데 글은 3.3㎡당 20만 원만 공고에서 읽는다.
  2. **가맹사업법의 핵심 보호 장치 부재** — `business/franchise-incentives.tsx:96-97, 58, 68, 78` (MISSING). 미국 FDD 14일 규칙은 설명하면서 한국 가맹사업법 제7조③·제11조①(정보공개서 제공 후 14일, 변호사·가맹거래사 자문 시 7일), 제6조의5 가맹금 예치, 제12조의4 영업지역, 제11조②12호 필수품목·가격 산정방식, 제12조의2 점포환경개선 강요 금지·비용 최대 40% 부담이 빠짐(시행 2026-10-02본 기준).
  3. **상가임대차 환산보증금 계산식·지역 기준·5% 상한 및 2026-05-12 개정(§19-2 관리비 내역 요구권) 누락** — `property/commercial-lease-and-rent.tsx:68,78,96,98,107,114` (MISSING ×2). 글이 2026-05-12 시행본을 인용하면서도 그 개정의 핵심인 관리비 세부내역 요구권을 다루지 않음.
  4. **infrastructure 7편의 개념 `intuition`이 내용과 무관한 문단으로 배정됨** — `src/content/article-learning.ts:129536`(주택 허가 시간 = HDB 99년 임차권 문단), `:128965`, `:129718`, `:129725`, `knowledge-graph.ts:28493,28502,28505` (MISLEADING). mechanism→comparison→limits 순서로 기계 배정된 패턴이 일곱 글 21개 개념에 퍼져 있음.
  5. **CALC 2건** — `business/shop-site-selection.tsx:85`·`article-learning.ts:124955` "하루 평균 약 44.45건"(실제 1,333.33÷30=44.44, 1,334÷30=44.47), `institutions/culture-norms-and-coordination.tsx:91`·`article-evidence.ts:11500` UNESCO 두 인용 "합계 21단어"(실제 8+11=19).
- 그 밖에 주목할 것: 식품위생법 링크 `lsiSeq=277149`가 조문 없는 머리말만 표시(현행 lsiSeq=285339, 2026-10-08 시행) — `property/shop-transfer-and-goodwill.tsx:99` 외 evidence·learning 4곳(LINK); "2026-10-08 시행 변경을 앞당겨 적용하지 않는다"는 주의문이 확인일 기준 이미 시행돼 낡음 — `business/shop-daily-operations.tsx:141`, `shop-fitout-and-opening.tsx:99`(OUTDATED); ICH E8(R1) 절 번호 오기(§5.3·§6 → 실제 근거는 §5.5·§5.6) — `institutions/evidence-measurement-and-causality.tsx:120`(LINK); IPCC 위해 정의를 "자연 현상"으로 좁힘 — `infrastructure/climate-risk-and-exposure.tsx:54,56`(MISLEADING).

## 발견 (심각도 순)
판정 순서: CALC → OUTDATED → MISLEADING → MISSING → LINK → UNVERIFIED (같은 판정 안에서는 property·labor·firms → business → institutions → infrastructure 순, 각 묶음 원장의 심각도 순서 유지).

| # | route | 위치(file:line) | 주장(원문 인용) | 판정 | 근거(URL + 인용문) | 제안 수정 |
|---|---|---|---|---|---|---|
| 1 | business/shop-site-selection | `shop-site-selection.tsx:85` "8,000,000÷6,000=1,333.33건이므로 월 최소 1,334건이 필요합니다. 하루 평균 약 44.45건이며", `src/content/article-learning.ts:124955` "30일에 약 44.45건과 45건입니다" | CALC | python3: 8,000,000/6,000/30 = 44.444…, 1,334/30 = 44.466… — 어느 기준으로도 44.45가 아님. | "하루 평균 약 44.44건(1,334건 기준이면 44.47건)"으로 고치거나 "약 44.4건"으로 반올림 자리를 맞춘다. learning 체크리스트도 함께 고친다. |
| 2 | institutions/culture-norms-and-coordination | `src/pages/articles/institutions/culture-norms-and-coordination.tsx:91` "같은 선언의 두 짧은 인용은 합계 21단어입니다.", `src/content/article-evidence.ts:11500` note 동일 | CALC | https://www.unesco.org/en/legal-affairs/unesco-universal-declaration-cultural-diversity — 인용 두 개: "Culture takes diverse forms across time and space."(8단어), "No one may invoke cultural diversity to infringe upon human rights"(11단어) → 합계 19단어 | "합계 19단어"로 정정하거나 단어 수 언급을 삭제한다. |
| 3 | business/shop-daily-operations (+ shop-fitout-and-opening) | `shop-daily-operations.tsx:141` "안내에 예고된 2026-10-08 시행 변경을 확인일인 10월 4일의 시행 규정으로 앞당겨 적용하지 않습니다", `shop-fitout-and-opening.tsx:99` "예고된 10월 8일 변경을 10월 4일 현재 규정에 적용하지 않습니다", `article-evidence.ts:10851`, `:11502` 같은 문구 | OUTDATED | 식품위생법 https://www.law.go.kr/LSW/lsInfoR.do?lsiSeq=285339&efYd=20261008&ancYnChk=0 — "[시행 2026. 10. 8.] [법률 제21525호, 2026. 4. 7., 타법개정]", 부칙 "(파산선고 등에 따른 결격조항 정비를 위한 보건복지위원회 소관 12개 법률 일부개정을 위한 법률)". 확인일(10-09) 현재 이미 시행 중이며, 제40조·제41조에는 2026년 개정 표시가 없음. 인용한 easylaw 식품위생교육 페이지 상단은 지금 "「식품위생법」 2026년 12월 31일 시행(개정 사항을 검토하여 향후 업데이트 예정입니다.)"로 바뀜. | "10월 8일 시행분(결격조항 정비)은 이미 시행됐고 제40·41조 내용은 바뀌지 않았다. 다음 예고는 12월 31일 시행분이다"로 갱신한다. |
| 4 | property/land-development-residual | `src/pages/articles/property/land-development-residual.tsx:104` "RICS 2019 지침의 6.1.1절", `:110` "RICS Valuation of development property · 2019", `:122` "RICS 2019 지침의 잔여법은 계산의 구조를 확인하는 근거로 사용합니다" | MISLEADING | https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/valuation-standards/valuation-of-development-property — "The aim of this Professional Standard is to guide the valuer …" / "Published date: 01 October 2019". 인용 PDF 표지 "RICS guidance note … 1st edition, October 2019", 꼬리말 "Effective from 1 February 2020". | "RICS 2019(2020-02-01 발효) 지침, 현재 RICS는 같은 문서를 Professional Standard로 분류"로 지위를 갱신. 내용(6.1.1 식·용어집)은 그대로 유효. |
| 5 | labor/measuring-the-spread | `measuring-the-spread.tsx:169` "고르지 않게 나뉘면 선이 그 아래로 처집니다", `:177-180` "위 그림의 두 번째 장면이 그가 실제로 그린 자료입니다. … 1901년 선이 1892년 선보다 아래에 놓입니다" | MISLEADING | https://archive.org/download/jstor-2276207/2276207.pdf 218쪽 그림 — 세로축 "Percents of Number", 가로축 "Percents of Total Income"로 축이 현대 관례와 바뀌어 있어 원 그림의 프로이센 곡선은 대각선 위쪽으로 휨. 217쪽 원문은 "Plot along one axis … and along the other …"로 축을 지정하지 않음. | "그가 실제로 그린 자료"를 "그가 쓴 자료(214쪽 표)를 현대 관례(가로 = 사람, 세로 = 몫)로 다시 그린 것. Lorenz의 218쪽 원 그림은 두 축이 바뀌어 곡선이 대각선 위로 휜다"로 고침. |
| 6 | labor/wage-floor-natural-experiment | `src/pages/articles/labor/wage-floor-natural-experiment.tsx:309` "또한 앞선 급여 표본의 일부 가맹점주와 주별·격주·월별 보고 간격이 결과 차이에 관련된다고 분석했습니다" | MISLEADING | https://www.nber.org/system/files/working_papers/w6386/w6386.pdf 초록(3쪽 이미지) — "The differences between this sample and both the BLS data and our earlier sample are attributable to a small set of restaurants owned by a single franchisee who provided the original Pennsylvania data for a 1995 EPI study." | "일부 가맹점주"를 "1995년 EPI 연구에 펜실베이니아 자료를 처음 제공한 한 가맹점주가 소유한 소수 매장"으로 바꿈. 저자 주장의 핵심(한 명의 자료 제공자)이 흐려짐. |
| 7 | property/shop-transfer-and-goodwill | `shop-transfer-and-goodwill.tsx:54` receives "기존 점주가 먼저 지급하기로 한 돈을 받습니다." | MISLEADING | 같은 줄 movement "…실패 시 반환 조건을 정한 뒤 300만 원을 지급합니다."와 `:37` "새 점주가 먼저 300만 원을 지급하고" — 지급자는 새 점주인데 문장이 "기존 점주가 … 지급하기로 한"으로 읽힘(내부 문장 대조). | "기존 점주가 새 점주로부터 먼저 받기로 한 300만 원을 받습니다."로 고침. |
| 8 | infrastructure/housing-land-and-supply, food-chain-and-prices, climate-risk-and-exposure (같은 생성 패턴이 일곱 글 전부에 있음) | `src/content/article-learning.ts:129536-129539` (housing-permit-lag, sectionId "comparison", intuition "싱가포르 정부는 일반적인 새 HDB 주택의 구매자가 99년 동안 주택 권리를 소유한다고 설명합니다…"), `:128965-128968` (perishable-bargaining-power, intuition "미국 농무부 ERS의 Food Dollar는 …"), `:129725-129728` (climate-financial-transmission, intuition "UNDRR은 위험 지역에 있는 사람, 주택과 기반 시설 등을 노출에 포함합니다…"), `:129718-129721` (climate-risk-components, intuition "B의 손실 60 중 보험이 40을 지급하고…"); `src/content/knowledge-graph.ts:28493` perishable-bargaining-power canonicalHref `#comparison`, `:28502` housing-permit-lag `#comparison`, `:28505` climate-financial-transmission `#comparison` | MISLEADING | 내부 대조. 해당 개념이 실제로 정의된 위치: 허가 시간 = `housing-land-and-supply.tsx:56`("권리 확인과 인허가, 기반 시설, 시공 때문에 수요 증가가 입주로 이어지는 데 걸리는 시간이 공급의 허가 시간입니다", `#names`). 부패성·협상력 = `food-chain-and-prices.tsx:55-56`(`#names`)과 `:46-47`(`#need`). 금융 전달 = `climate-risk-and-exposure.tsx:64`("이 경로가 기후 손실의 금융 전달입니다", `#mechanism`). 세 요소 = `:54-56`(`#names`). 일곱 글 21개 개념의 sectionId가 예외 없이 mechanism / comparison / limits 순서다. 내용이 아니라 순번으로 배정됐다는 뜻이다. | 각 개념의 `sectionId`·`intuition`과 KG `canonicalHref`를 실제 정의 문단의 절로 옮긴다(허가 시간→`names`, 부패성→`need`/`names`, 금융 전달→`mechanism`, 세 요소→`names`). 나머지 글(전력 시스템 비용→`mechanism` 4절 셋째 문단, 수도 부담 귀속→`names`)도 같은 방식으로 점검한다. |
| 9 | infrastructure/climate-risk-and-exposure | `src/pages/articles/infrastructure/climate-risk-and-exposure.tsx:54` "피해를 일으킬 수 있는 홍수 같은 자연 현상을 위해라고 부릅니다", `:56` "같은 현상에서 더 쉽게 손상되는 성질은 취약성입니다"; `src/content/knowledge-graph.ts:28504` "자연 현상의 위험, 그곳에 있는 사람·자산의 노출, 피해를 키우거나 줄이는 취약성" | MISLEADING | https://www.ipcc.ch/report/ar6/wg2/downloads/report/IPCC_AR6_WGII_Annex-II.pdf — "Hazard The potential occurrence of a natural or human-induced physical event or trend that may cause loss of life, injury or other health impacts, as well as damage and loss to property, infrastructure, livelihoods…" / "Vulnerability The propensity or predisposition to be adversely affected. Vulnerability encompasses a variety of concepts and elements, including sensitivity or susceptibility to harm and lack of capacity to cope and adapt." | 위해: "피해를 일으킬 수 있는 자연적·인위적 물리 사건이나 추세가 일어날 가능성". 취약성: "피해 민감성과 대응·적응 능력의 부족을 함께 담는 성향". 사례의 손상률은 그중 민감성만 단순화한 값이라고 적는다. KG 정의의 "자연 현상의 위험"은 본문 용어에 맞춰 "위해(hazard)"로 바꾼다. |
| 10 | infrastructure/food-chain-and-prices | `src/pages/articles/infrastructure/food-chain-and-prices.tsx:70` "5 · FAO의 네 기능에 추가 금액을 배치합니다", `:72` "우리 사례의 100·30·20·50을 이 기능에 대응시키되", `:75` application "농가 출하 100원 뒤 선별·저장 30원, 운송 20원, 소매 50원을 배치합니다" | MISLEADING | https://www.fao.org/sustainable-food-value-chains/what-is-it/en/ — "These actors carry out four functions: production (farming, fishing, forest harvesting or agroforestry), aggregation, processing, and distribution (wholesale and retail). The aggregation step is especially important to FVCs in developing countries, where efficiently aggregating and storing small volumes of produce…" 운송은 네 기능 가운데 하나가 아니다. | "농가 100=production, 선별·저장 30=aggregation, 소매 50=distribution, 운송 20은 FAO의 지원 서비스(그림 3의 support providers)에 가깝고 이 사례에는 processing 단계가 없다"처럼 대응을 바로잡는다. 또는 사례 단계를 가공(processing)으로 바꾼다. |
| 11 | infrastructure/transport-access-and-land-value | `transport-access-and-land-value.tsx:82,84,86` "영국 MHCLG…", "영국 지침" | MISLEADING | https://www.gov.uk/government/publications/the-mhclg-appraisal-guide/the-mhclg-appraisal-guide — "Updated 18 February 2026 Applies to England" | "영국"을 "잉글랜드"로 바꾼다(#5와 함께 처리). |
| 12 | infrastructure/materials-waste-and-circularity | `src/pages/articles/infrastructure/materials-waste-and-circularity.tsx:72` "제품을 판매한 뒤의 수거와 처리까지 생산자의 책임을 넓히는 정책을 생산자책임재활용, EPR이라고 부릅니다" | MISLEADING | OECD(2024) 초록(RePEc 사본 https://ideas.repec.org/p/oec/envaac/41-en.html) — "Extended Producer Responsibility (EPR) is a policy approach that makes producers responsible for their products along the entire lifecycle, including at the post-consumer stage." EPR의 직역은 '확대생산자책임'이다. '생산자책임재활용(제도)'는 한국의 시행 제도 이름이고, 재활용의무율·분담금 방식으로 운영된다(검색 결과 요약 수준만 확인, 법령 원문은 미개봉). | "확대생산자책임(EPR). 한국에서는 '생산자책임재활용제도'라는 이름으로 포장재·제품별 재활용 의무를 부과한다"처럼 일반 개념과 한국 제도명을 나눈다. 한국 제도 서술을 넣으려면 「자원의 절약과 재활용촉진에 관한 법률」 해당 조문을 열어 인용한다. |
| 13 | property/shop-closure-and-restoration | `src/pages/articles/property/shop-closure-and-restoration.tsx:130` "중소벤처기업부의 2025년 1월 영상 03:50에는 최대 400만 원이, 같은 해 7월 영상 01:53에는 400만 원에서 600만 원으로의 변경이 표시됩니다", `:131` "2026년 1월 19일 공고는 면적 3.3㎡당 20만 원 한도, 부가세 제외, 사업자등록 업체 시공과 지출 증빙, 중복지원 제외를 함께 둡니다", `:133` "견적 600만 원에서 영상의 최대 지원금 600만 원을 바로 빼지 않습니다" | MISSING | https://ssrf.or.kr/site/kr/html/sub04/0401.html?category=sc04&file_id=3953&mode=D&no=abaae44719e649e9f32b348bdd1d35f0 (2026년『희망리턴패키지 원스톱폐업지원』 소상공인 모집 공고, 2026년 1월 19일) — "◦ 폐업일에 따라 지원한도 차등 적용 (’25년 7월 11일 기준) … ’25년 7월 11일 전(’23.1.1~’25.7.10) 400만원 … ’25년 7월 11일 이후(’25.7.11~) 600만원 … 전용면적(3.3m2)당 한도 20만원 이내" / "점포철거비 지원을 이미 받은 경우 (주민등록번호 기준 1회만 신청 가능)" / "(기 폐업) 폐업일이 ‘23년 1월 1일 이후인 경우 지원" / "동일장소 재창업 제한 기간: 점포철거비 지원금 수혜일로부터 3년" / "(자력철거 시 지원불가)" | 10절에 "2026년 1월 공고의 상한은 폐업일별 최대한도(’25.7.10 이전 400만 원, ’25.7.11 이후 600만 원)와 전용면적 3.3㎡당 20만 원 중 작은 값이며 부가세 제외 공급가액만 인정한다"를 넣고, 1회 한정·’23.1.1 이후 폐업·동일 장소 3년 재창업 제한을 조건 목록에 추가. 33㎡ 사례는 min(600만, 200만) = 200만으로 다시 적기. |
| 14 | property/commercial-lease-and-rent | `src/pages/articles/property/commercial-lease-and-rent.tsx:68` "월 200만 원은 월별 사용에 대응하고, 관리비와 부가세 포함 여부는 별도로 확인합니다", `:78` "36개월 동안 월세 200만 원과 관리비를 구분해 기록합니다", `:98` "2026-05-12 시행 조문을 2026-10-04 확인했습니다", `:114` 같은 시행판 인용 | MISSING | 같은 법 2026-05-12판 전문 https://www.law.go.kr/LSW/lsInfoR.do?lsiSeq=279651&efYd=20260512&ancYnChk=0 — "제19조의2(관리비 내역의 제공) ① 임대차계약 시 합의로 임차인이 임대인에게 상가건물의 유지관리를 위하여 필요한 관리비를 납부하는 경우 임차인은 임대인에게 그 부과된 관리비 내역의 제공을 요청할 수 있다. ② … 요청받은 임대인은 이에 따라야 한다." / 부칙 "제2조(관리비 내역의 제공에 관한 적용례) 제19조의2의 개정규정은 이 법 시행 이후 임대차계약을 체결하거나 갱신하는 경우부터 적용한다." | 7절 관리비 기록 문단에 "2026-05-12 시행 개정으로 관리비를 내는 임차인은 부과 내역 제공을 요청할 수 있고 임대인은 따라야 한다(제19조의2, 시행 후 체결·갱신 계약부터)"를 추가하고 구체 항목은 시행령 위임임을 밝힘. |
| 15 | property/commercial-lease-and-rent | `commercial-lease-and-rent.tsx:96` "제2조는 보증금 규모에 따른 일반 적용 범위를 정하면서 제3조 등 일부 조항은 그 범위를 넘는 임대차에도 적용합니다", `:107` "제10조는 종료 6개월 전부터 1개월 전까지의 요구, 처음 기간을 포함한 총 10년 한도, 차임 연체 등 예외를 규정합니다" (환산 방법·기준액·증액 상한 없음) | MISSING | 시행령(lsiSeq=287139, "[시행 2026. 7. 1.] [대통령령 제36423호, 2026. 6. 23., 타법개정]") 제2조 https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=287139&joNo=0002&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR — "1. 서울특별시 : 9억원 2. … 과밀억제권역(서울특별시는 제외한다) 및 부산광역시: 6억9천만원 3. 광역시 … 5억4천만원 4. 그 밖의 지역 : 3억7천만원" / "③ … “대통령령으로 정하는 비율”이라 함은 1분의 100을 말한다." 제4조(joNo=0004) — "… 청구당시의 차임 또는 보증금의 100분의 5의 금액을 초과하지 못한다." 법 제2조③(joNo=0002) — 예외 목록 "제3조 , 제10조 제1항 , 제2항 , 제3항 본문, 제10조의2부터 제10조의9 까지의 규정, 제11조의2 및 제19조"에 제11조가 없음. 법 제10조③ "차임과 보증금은 제11조 에 따른 범위에서 증감할 수 있다." | 8절에 "환산보증금 = 보증금 + 월차임 × 100. 사례는 3천만 + 200만 × 100 = 2억3천만 원으로 모든 지역 기준액 이하"를 계산해 넣고, 9절 갱신 문단에 "기준 이하 임대차의 증액 청구는 5% 이내(시행령 제4조), 기준 초과 임대차는 갱신요구권·대항력은 있으나 제11조 5% 상한은 적용되지 않음"을 추가. 기준액은 시행령 확인일과 함께 적기. |
| 16 | labor/measuring-the-spread | `src/pages/articles/labor/measuring-the-spread.tsx:225` "G = A/(A+B)", `:297` "프로이센 1892년 0.357, 1901년 0.394", `:303-305` "이 나눗셈은 Lorenz의 1905년 글에 없습니다. … 넓이를 재어 한 숫자로 바꾸는 일은 이후의 작업입니다"; `src/content/knowledge-graph.ts:27431` area-ratio-summary aliases ["넓이 비", "집중도 지수"] | MISSING | https://www.dss.uniroma1.it/RePec/mtn/articoli/2005-1-1.pdf (Gini 1914 영역본, Metron LXIII(1) 2005) — "In this paper not only did Gini propose some formulae for the computation of the concentration ratio (R) … but he also investigated the relationships between R, the Lorenz curve and the mean difference" / "we consider the ratio between the area limited by the concentration curve and the egalitarian line (concentration area) and the area of the triangle obc … this ratio is the limit the concentration ratio R tends to" | 부품 3에 "이 값이 지니계수(Gini coefficient)이며 Gini가 1912년(평균차)·1914년(집중비와 Lorenz 곡선의 넓이 관계)에 제시했다"를 넣고 KG aliases에 "지니계수", "Gini coefficient"를 추가. 독자가 통계표에서 같은 지표를 찾을 수 있게 됨. |
| 17 | firms/why-firms-exist | `src/pages/articles/firms/why-firms-exist.tsx:119-123` "논문은 장기 공급 계약에서 앞일을 전부 구체화하기 어려운 문제도 함께 다룹니다", `:190` "현실에서는 품질·자금·권한·법적 책임·작업 간 연결과 변경 비용도 다릅니다" (Williamson·자산 특수성·홀드업 언급 없음) | MISSING | https://www.nobelprize.org/prizes/economic-sciences/1991/coase/lecture/ — "The work of Oliver Williamson and others has led to a greater understanding of the factors which govern what a firm does and how it does it." / https://api.crossref.org/works/10.1086/466942 — Williamson, "Transaction-Cost Economics: The Governance of Contractual Relations", The Journal of Law and Economics 22(2), 233-261 (1979) | "기업은 왜 존재할까"의 정본이라면 Coase 이후 경계를 가르는 핵심 변수, 즉 관계 특수적 투자(자산 특수성)·불확실성·거래 빈도와 그로 인한 홀드업 위험을 한 절로 추가. 여섯 일 모형에서 "특정 공급자에게 맞춘 설비가 필요하면 밖의 비용 b가 재협상 위험만큼 커진다"처럼 같은 사례로 연결. |
| 18 | firms/market-power-and-markup | `src/pages/articles/firms/market-power-and-markup.tsx:91` "가격에서 한계비용을 뺀 차이를 가격으로 나눈 비율을 이 글의 마크업 지표로 씁니다 … 비용 7을 분모로 삼는 3 ÷ 7, 약 42.9%의 원가 가산율과 구분합니다", `:178-179` "(p − MC)/p = −1/ε" (지표 이름·실증 측정 없음) | MISSING | https://api.crossref.org/works/10.2307/2967480 — Lerner, "The Concept of Monopoly and the Measurement of Monopoly Power", The Review of Economic Studies 1(3), 157-175 (1934). https://academic.oup.com/qje/article/135/2/561/5714769 — "In 1980, aggregate markups start to rise from 21% above marginal cost to 61% now. … Quite strikingly, the median is unchanged." (같은 연구의 NBER w23687 초록은 "from 18% above marginal cost to 67% now") | `:91`에 "(p−MC)/p는 러너 지수(Lerner 1934)"라고 이름을 붙이고, 실증 문헌의 마크업은 대개 μ = P/MC(예: DEU 2020의 1.21→1.61, 러너 지수로는 약 0.17→0.38)로 보고된다는 환산 관계를 한 문단으로 추가. 판본별 수치 차이(작업논문 18→67%, QJE 21→61%)와 "중앙값은 그대로"라는 분포 단서도 함께. |
| 19 | business/franchise-incentives | `src/pages/articles/business/franchise-incentives.tsx:96` "면제 대상이 아닌 미국·미국령 점포 거래는 구속력 있는 계약에 서명하거나 본부·관계회사에 돈을 내기 최소 14일 전에 문서를 제공받아야 합니다", `:97` "한국 공정거래위원회의 비교 화면에는 연간 평균 매출과 산정기준 …"(한국 법정 숙려기간·가맹금 예치 언급 없음), `:78` "문을 열 때의 가맹·교육·장비 비용" | MISSING | 가맹사업법 [시행 2026. 10. 2.] 제7조③ (law.go.kr `LSW/lsSideInfoP.do?lsiSeq=288583&joNo=0007&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR`) — "정보공개서등을 제공한 날부터 14일(가맹희망자가 정보공개서에 대하여 변호사 또는 제27조에 따른 가맹거래사의 자문을 받은 경우에는 7일로 한다)이 지나지 아니한 경우에는 다음 각 호의 어느 하나에 해당하는 행위를 하여서는 아니 된다. … 1. 가맹희망자로부터 가맹금을 수령하는 행위 … 2. 가맹희망자와 가맹계약을 체결하는 행위"; 제11조①도 가맹계약서 내용 문서에 같은 14일(7일) 금지; 제6조의5① "가맹본부는 가맹점사업자 … 로 하여금 가맹금 … 을 대통령령으로 정하는 기관 … 에 예치하도록 하여야 한다. 다만, 가맹본부가 제15조의2에 따른 가맹점사업자피해보상보험계약 등을 체결한 경우에는 그러하지 아니하다." | 9절 둘째 문단에 다음을 추가한다. "한국은 가맹사업법 제7조·제11조에 따라 등록 정보공개서·인근가맹점 현황문서와 가맹계약서 내용을 받은 날부터 14일(변호사·가맹거래사 자문 시 7일)이 지나기 전에는 가맹금 수령과 계약 체결이 금지된다. 가맹금은 원칙적으로 예치기관에 맡긴다(피해보상보험 가입 시 예외)." 7절 '문을 열 때의 비용' 옆에 예치 여부를 묻는 질문을 넣는다. |
| 20 | business/franchise-incentives | `franchise-incentives.tsx:58` "본부가 가까이에 새 점포를 열면 기존 점주의 손님이 나뉠 수 있습니다", `:68` "어떤 품목과 가격 결정 방식이 계약에 정해졌는지 보면", `:78` "갱신 때의 시설 교체", `:79` "영업지역과 온라인·배달 주문의 배분" | MISSING | 가맹사업법 제12조의4 — "① 가맹본부는 가맹계약 체결 시 가맹점사업자의 영업지역을 설정하여 가맹계약서에 이를 기재하여야 한다. … ③ 가맹본부는 정당한 사유 없이 가맹계약기간 중 가맹점사업자의 영업지역 안에서 가맹점사업자와 동일한 업종 … 의 자기 또는 계열회사 … 의 직영점이나 가맹점을 설치하는 행위를 하여서는 아니 된다."; 제11조②12호 — "가맹본부가 가맹점사업자에게 가맹본부 또는 가맹본부가 지정한 자와 거래할 것을 강제할 경우 그 강제의 대상이 되는 부동산ㆍ용역ㆍ설비ㆍ상품ㆍ원재료 또는 부재료ㆍ임대차 등의 종류 및 공급 가격 산정방식에 관한 사항"(<개정 … 2024. 1. 2.>); 제12조의2 — "① 가맹본부는 대통령령으로 정하는 정당한 사유 없이 점포환경개선을 강요하여서는 아니 된다. ② 가맹본부는 가맹점사업자의 점포환경개선에 소요되는 비용으로서 대통령령으로 정하는 비용의 100분의 40 이내의 범위에서 대통령령으로 정하는 비율에 해당하는 금액을 부담하여야 한다." | 5·6·7절의 해당 문장에 한국 법 조항을 붙인다. 영업지역은 계약서 필수 기재 사항이고 계약기간 중 동일 업종 출점이 금지된다. 필수품목은 종류와 공급가격 산정방식이 계약서 기재 사항이다. 갱신 시 시설 교체는 강요가 금지되고 본부가 비용을 분담한다(비율은 시행령 확인). 온라인·배달 주문 배분은 법이 직접 정하지 않으므로 계약 확인 사항으로 남긴다. |
| 21 | business/shop-site-selection (+ business/shop-fitout-and-opening) | `src/pages/articles/business/shop-site-selection.tsx:106` "한국 음식점도 건축물 용도와 식품위생 시설기준, 지역의 세부 요건을 계약 전에 따져야 합니다", `:110` "건축물 용도와 임대차의 업종 허용 … 확인한 뒤에야", `knowledge-graph.ts` site-permitted-use 정의 "계약상 사용 허용과 건축·위생·소방 등 공법상 영업 가능 여부를 별도로 확인"; `src/pages/articles/business/shop-fitout-and-opening.tsx:65` "관할 부서와 소방서의 적용 요건을 설계 전에 확인", `:114` "한국의 일반음식점은 식품위생법 시행규칙의 업종별 시설기준을 확인해야 합니다" | MISSING | 법제처 생활법령 「음식점 창업 > 음식점 영업이 가능한 입지」 https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=839&ccfNo=2&cciNo=1&cnpClsNo=1 — "제1종 근린생활시설(「건축법 시행령」 별표 1 제3호나목) √ 휴게음식점, 제과점 등 … 바닥면적의 합계가 300㎡ 미만인 것 제2종 근린생활시설(「건축법 시행령」 별표 1 제4호아목, 자목 및 더목) √ 휴게음식점, 제과점 등 … 300㎡ 이상인 것 √ 일반음식점" / "건축물의 용도가 음식점 창업에 적합하지 않은 경우에는 건축물의 용도를 변경하여 음식점을 창업할 수 있습니다(「건축법」 제19조 참조). … 허가를 받거나 신고해야 합니다(「건축법」 제19조 제2항)" / "건축물의 용도는 해당 건축물대장에서 확인할 수 있으며" | 입지 글 9절에 다음을 넣는다. "일반음식점은 제2종 근린생활시설이어야 한다. 휴게음식점·제과점은 같은 건물의 해당 용도 면적이 300㎡ 미만이면 제1종, 이상이면 제2종 근린생활시설이어야 한다. 건축물대장에서 용도를 확인하고, 맞지 않으면 건축법 제19조 용도변경(상위군은 허가, 하위군은 신고)을 거친다." 공사 글 7절 일정에는 용도변경 기간을 별도 칸으로 둔다. |
| 22 | business/shop-daily-operations | `src/pages/articles/business/shop-daily-operations.tsx:37` "이날 직원 한 사람이 실제 일한 시간은 4시간입니다. 자유롭게 이용한 휴게시간은 이 4시간과 별도로 기록했다고 놓겠습니다. 임금률과 유급 휴게·수당 등은 계약과 현지 규정에 맞춰 계산합니다", `:61`, `:83` "휴게 제공 의무와 유급·무급 처리를 적용법으로 확인합니다", `:113` "한국은 근로계약과 출퇴근·임금대장·명세서 …" | MISSING | 근로기준법 [시행 2026. 10. 8.] 제54조 (law.go.kr `lsSideInfoP.do?lsiSeq=285279&joNo=0054`) — "① 사용자는 근로시간이 4시간인 경우에는 30분 이상, 8시간인 경우에는 1시간 이상의 휴게시간을 근로시간 도중에 주어야 한다. ② 휴게시간은 근로자가 자유롭게 이용할 수 있다."; 제18조③ — "4주 동안(4주 미만으로 근로하는 경우에는 그 기간)을 평균하여 1주 동안의 소정근로시간이 15시간 미만인 근로자에 대하여는 제55조와 제60조를 적용하지 아니한다."; 고용노동부 https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144 — "2026년도 적용 최저임금을 올해보다 290원, 2.9% 인상된 시간급 10,320원으로 확정·고시했다. … 업종 구분 없이 모든 사업장에 동일하게 적용된다." (인용한 2022 카드뉴스에도 "근로계약, 휴게시간, 주휴일 등은 5인 미만 사업장을 포함해 규모에 상관없이 모든 사업장이 지켜야 합니다", "주 15시간 이상 근무하면 주휴수당을 지급해야 합니다"가 있음) | 3·7절에 확인 기준을 적는다. "한국에서 4시간 근로면 근로 도중 30분 이상 휴게를 줘야 하고(5인 미만 사업장 포함), 주 소정근로 15시간 이상이면 주휴수당 대상이며, 2026년 최저임금은 시간급 10,320원이다." 사례의 4시간이 휴게를 뺀 실근로라는 가정은 유지하되, 휴게 30분을 근로 도중에 별도로 줬다는 조건을 명시한다. |
| 23 | business/shop-daily-operations | `shop-daily-operations.tsx:35` "결제업체는 판매대금에서 2%를 떼어 이틀 뒤 보냅니다", `:84` "이 사례의 카드 2%를 그대로 쓰지 않습니다"(배달 주문에만 해당) | MISSING | 정책브리핑 2025-08-15 https://www.korea.kr/news/policyNewsView.do?newsId=148953893 — 우대수수료율: 연매출 3억 이하 신용 0.40%·체크 0.15%, 3~5억 1.00%·0.75%, 5~10억 1.15%·0.90%, 10~30억 1.45%·1.15%(WebFetch로 표 추출); 정책브리핑 2025-02-13 https://www.korea.kr/news/policyNewsView.do?newsId=148939594 — "우대수수료율을 매출액 구간별로 0.05∼0.10%p 인하한다"(2025-02-14 적용). 하루 16만 원 규모 점포는 연매출 3억 이하 구간일 가능성이 큼. | 2%가 가정이라는 점은 이미 적혀 있다. 한국 독자를 위해 "한국 신용카드 가맹점은 연매출 구간별 우대수수료가 적용된다(2025-02-14 이후 3억 이하 신용 0.40%). 실제 율은 카드사 정산 내역으로 확인한다"를 한 문장 추가한다. |
| 24 | business/shop-fitout-and-opening (+ shop-daily-operations) | `shop-fitout-and-opening.tsx:90` "소방 안전시설 완비증명과 의무보험은 다중이용업소 해당 여부 등에 따라 달라지므로", `shop-daily-operations.tsx:129-130` "한국 다중이용업소 해당 여부에는 면적·층·출입구 같은 조건이 있습니다" | MISSING | https://easylaw.go.kr/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=91&onhunqueSeq=4365 — "휴게음식점영업·제과점영업 또는 일반음식점영업으로서 영업장으로 사용하는 바닥면적의 합계가 100제곱미터(영업장이 지하층에 설치된 경우에는 그 영업장의 바닥면적 합계가 66제곱미터) 이상인 것 √ 다만, 영업장(내부계단으로 연결된 복층구조의 영업장을 제외)이 지상 1층 또는 지상과 직접 접하는 층에 설치되고 그 영업장의 주된 출입구가 건축물 외부의 지면과 직접 연결되는 곳에서 하는 영업을 제외합니다." | 인용 자료에 있는 기준 수치(100㎡, 지하 66㎡, 지상 1층·주출입구 직결 예외)를 본문에 적어 독자가 자기 점포를 판정할 수 있게 한다. |
| 25 | business/shop-fitout-and-opening | `shop-fitout-and-opening.tsx:105` "세무서의 사업자등록은 납세자를 등록하는 절차이므로", `:107` SourceApplication(등록 시기만 다룸) | MISSING | 같은 인용 페이지 https://g.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7777&mi=2444 — "개인사업자는 공급대가에 따라 간이과세자와 일반과세자로 구분되므로 자기에게 맞는 올바른 과세유형을 선택하여야 함 간이과세자 : 연간 공급대가 예상액이 10,400만원 미만인 개인사업자 다만, 아래 사업자는 연간 공급대가 예상액이 10,400만원 미만이라도 간이과세를 적용받을 수 없음" | 8절에 다음을 추가한다. "등록 신청 때 간이·일반과세 유형을 고른다. 연간 공급대가 예상액이 1억400만 원 미만이면 간이과세를 고를 수 있다(일부 업종 제외). 공사비 매입세액을 공제받는 방식이 유형마다 다르므로 4천800만 원 공사 전에 정한다." |
| 26 | business/supply-chain-bargaining | `src/pages/articles/business/supply-chain-bargaining.tsx:100` "완제품을 들여오는 판매자가 과세가격 60달러에 10% 관세를 부담하는 경우를 추가로 가정해 봅시다", `:101` "이때 관세는 6달러입니다" | MISSING | WTO Customs Valuation Agreement Art. 8.2 https://www.wto.org/english/docs_e/legal_e/20-val_01_e.htm — "In framing its legislation, each Member shall provide for the inclusion in or the exclusion from the customs value, in whole or in part, of the following: (a) the cost of transport of the imported goods to the port or place of importation; (b) loading, unloading and handling charges … (c) the cost of insurance." | 과세가격이 60달러(운임 제외)인지 70달러(운임 포함)인지는 수입국 법이 정한다는 경계 조건을 한 문장 넣는다(운임을 포함하는 나라라면 같은 10%가 7달러). 사례는 "운임을 과세가격에서 빼는 나라라고 가정"으로 명시한다. |
| 27 | institutions/healthcare-payment-systems | `src/pages/articles/institutions/healthcare-payment-systems.tsx:82` "한국 국민건강보험공단은 급여 항목을 안내합니다. 비용 부담도 구분해 설명합니다." (4절 `:63-65`에 건별 지급·묶음 지급·인두제 정의) | MISSING | https://www.hira.or.kr/dummy.do?pgmid=HIRAA020028000000 — "건강보험 행위별수가제(fee-for-service)는 … 사용량과 가격에 의해 진료비를 지불하는 제도로 우리나라는 의료보험 도입 당시부터 채택하고 있습니다. 또한, 행위별수가제의 보완 및 의료자원의 효율적 활용을 위하여 「질병군별 포괄수가제(DRG)」와 「정액수가제(요양병원, 보건기관 등)」도 병행하여 실시하고 있습니다." / "2013년 7월부터 전국 모든 의료기관"(7개 질병군) | 6절 한국 문단에 한 문장 추가: 한국은 행위별수가제(건별 지급)가 근간이고, 7개 질병군 포괄수가제(2013-07부터 전 의료기관)와 요양병원 정액수가가 묶음·정액 지급에 해당한다. 심평원 링크도 붙인다. 1절 "지급자 확인"은 한국에서 심평원 심사와 공단 지급으로 나뉜다는 점도 보강한다. |
| 28 | institutions/insurance-risk-pooling | `src/pages/articles/institutions/insurance-risk-pooling.tsx:46` "위험이 큰 사람만 모이면 처음 예상한 20명보다 사고가 많아질 수 있습니다 … 보장이 있다는 이유로 예방을 줄이면 실제 사고 비용이 늘 수도 있습니다." / `:53-57` 3절은 "위험 풀·면책·한도"만 명명 | MISSING | https://api.crossref.org/works/10.2307/1879431 — Akerlof, "The Market for "Lemons": Quality Uncertainty and the Market Mechanism", QJE 84(3), 1970 / https://api.crossref.org/works/10.2307/1885326 — Rothschild & Stiglitz, "Equilibrium in Competitive Insurance Markets: An Essay on the Economics of Imperfect Information", QJE 90(4), 1976 | 3절에 "역선택(adverse selection)"과 "도덕적 해이(moral hazard)"를 2절 현상에 대응시켜 추가하고 knowledge-graph 개념 노드에 연결한다. 7절의 "독립적인 작은 사고를 모을 때의 효과"에는 "대수의 법칙"이라는 이름을 붙인다. |
| 29 | institutions/evidence-measurement-and-causality | `src/pages/articles/institutions/evidence-measurement-and-causality.tsx:42` "두 변화의 차이는−2−(−1)=−1kWh/가구·일", `:75` "A도 개입 없이 B와 같은 추세를 따랐을 것이라고 가정해 추가감소 1을 얻습니다" | MISSING | 표준 용어 부재: 본문·article-learning·knowledge-graph `:28546-28548`을 전수 grep한 결과 "이중차분"·"difference-in-differences"·"평행 추세"·"parallel trends" 0건 | 4절에 한 문장 추가: 이 계산을 이중차분(difference-in-differences), 이 가정을 평행 추세(parallel trends) 가정이라 부른다. counterfactual-comparison-design 정의에도 연결한다. |
| 30 | institutions/education-skills-and-signals | `src/content/knowledge-graph.ts:28511` "학위·자격이 능력 자체를 바꾸지 않아도 고용주에게 정보를 제공해 채용과 임금을 바꾸는 효과입니다.", `education-skills-and-signals.tsx:54` | MISSING | https://api.crossref.org/works/10.2307/1882010 — Spence, "Job Market Signaling", The Quarterly Journal of Economics 87(3):355–374, 1973-08. 신호가 정보를 전하려면 신호 취득 비용이 능력에 따라 달라야 한다(분리 조건)는 것이 이 모형의 핵심이다. 원 논문 본문은 JSTOR 유료라 열지 않았고, 서지만 Crossref로 확인했다. | 3절에 조건 한 줄과 원전 인용을 추가한다: 자격이 신호로 작동하려면 능력이 높은 사람에게 그 자격을 얻는 비용이 더 낮아야 한다(Spence 1973). |
| 31 | institutions/public-budget-and-taxes | `src/pages/articles/institutions/public-budget-and-taxes.tsx:82` "중앙정부인지 지방정부와 사회보험을 포함한 일반정부인지 맞춰야 합니다." | MISSING | https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1104 — "관리재정수지 - 재정건전성 여부를 명확히 판단하기 위해 통합재정수지에서 사회보장성기금 수지를 제외한 수치 … * 사회보장성기금 : 국민연금, 사학연금, 고용보험, 산재보험" | 6절에 한 문장 추가: 한국의 통합재정수지와 관리재정수지 구분은 사회보험 포함 여부가 실제 공식 지표를 가르는 예다. |
| 32 | institutions/population-migration-and-care | `src/pages/articles/institutions/population-migration-and-care.tsx:99-102` "나이와 성별을 나눈 현재 인구에 출생·사망·이동을 적용해 다음 해를 만듭니다 … 전입 3명과 전출 2명은 각자의 나이 위치에 반영됩니다", `:77` "여기서는 연령 부양비라고 부릅니다" | MISSING | https://population.un.org/wpp/assets/Files/WPP2024_Methodology.pdf — "the core approach underlying the population estimates and projections in the 2024 revision is the cohort-component method for projecting population (CCMPP)"; 목차 "E. ESTIMATING NET INTERNATIONAL MIGRATION" | 5절에 방법 이름 "코호트 요인법(CCMPP)"을 넣고, UN은 전입·전출이 아니라 순국제이동을 쓴다는 점을 밝힌다. 3절에는 UN 표준명 "총부양비(total dependency ratio)"를 병기한다. |
| 33 | institutions/media-attention-and-public-belief | `src/pages/articles/institutions/media-attention-and-public-belief.tsx:73` "EU 디지털서비스법 제27조는 … 주요 기준을 이용자가 이해할 수 있게 설명하도록 규정합니다." | MISSING | https://publications.europa.eu/resource/celex/32022R2065.ENG.xhtml — 제27조(1) 원문 일치 확인. 같은 규정 제38조(초대형 온라인 플랫폼·검색엔진은 프로파일링에 기반하지 않은 추천 옵션을 최소 1개 제공)는 본문에 없음. 제38조 문구는 이번에 원문 대조하지 않았다. | 5절에 한 문장 추가: 초대형 플랫폼(VLOP)은 제38조에 따라 프로파일링 없는 추천 옵션도 제공해야 한다(심각도 낮음, 추가 전 제38조 원문 대조 필요). |
| 34 | institutions/culture-norms-and-coordination | `culture-norms-and-coordination.tsx:55-57`(분담·관찰·이의 절차), `:114`(Ostrom 인터뷰) | MISSING | https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/ — "I tried to move up a level and ask what were the generalities across the long-lasting robust systems, I called them design principles" | 2절의 장치들이 Ostrom의 "설계 원리(design principles)"에 대응한다는 점을 이름으로 연결한다(심각도 낮음). 대응 원리 목록(감시·단계적 제재·갈등 해결)은 Ostrom 1990 원전으로 따로 확인해야 한다. |
| 35 | infrastructure/climate-risk-and-exposure | `climate-risk-and-exposure.tsx:72` "IPCC AR6 WGII의 그림 1.4는 위해, 노출, 취약성의 상호작용을 제시합니다", `:75` excerpt "Risk results from interactions among the determinants of risk—hazard, vulnerability, and exposure" | MISSING | https://www.ipcc.ch/report/ar6/wg2/downloads/report/IPCC_AR6_WGII_Chapter01.pdf — Figure 1.4 캡션 원문: "Risk results from interactions among the determinants of risk—hazard, vulnerability, and exposure, shaped by responses—which can interact in complex ways." / Figure 1.5: "(b) In the current assessment, the role of responses in modulating the determinants of risk is a new emphasis (the 'wings' of the hazard, vulnerability, and exposure 'propellers' represents the ways in which responses modulate each of these risk determinants)." 용어집 Risk: "risks can arise from potential impacts of climate change as well as human responses to climate change." | excerpt를 "…hazard, vulnerability, and exposure, shaped by responses"까지 늘린다. 5절에 "AR6는 방재·보험·이주 같은 대응이 세 요소를 조정하고, 잘못된 대응(maladaptation) 자체가 위험이 될 수 있다고 본다"를 넣어 2·4절과 잇는다. |
| 36 | infrastructure/transport-access-and-land-value | `src/pages/articles/infrastructure/transport-access-and-land-value.tsx:80` "6 · 영국의 평가 원칙은 이익을 두 번 세지 말라고 요구합니다", `:82` "영국 MHCLG의 사업 평가 안내는 토지가치 변화와 다른 편익을 합칠 때 중복을 확인하도록 합니다", `:84` "영국 지침을 다른 나라의 법적 의무로 적용하는 것은 아닙니다" | MISSING | https://assets.publishing.service.gov.uk/media/6899eafbe7be62b4f0643223/tag-unit-a2-2-induced-investment-unit-may-25.pdf (DfT TAG Unit A2.2, May 2025) — "Land value uplift will capture any impacts capitalised into land, such that causal factors are ambiguous: it could potentially include the welfare associated with wider economic impacts and complementary interventions, which could potentially lead to double-counting or the false attribution of benefits respectively. For this reason, consideration should be given in the Economic Narrative on the degree to which there is an overlap between land value uplift, direct transport benefits and other wide[r economic impacts]". 반면 MHCLG 지침 페이지 머리말: "Updated 18 February 2026 Applies to England". | 교통 사업의 중복 계산 근거로 DfT TAG A2.2를 추가하거나 MHCLG 대신 쓴다. MHCLG 인용은 유지하되 "잉글랜드 주택·재생 사업 평가 지침"으로 적용 범위를 바로 적는다. |
| 37 | infrastructure/climate-risk-and-exposure | `climate-risk-and-exposure.tsx:56` "같은 현상에서 더 쉽게 손상되는 성질은 취약성입니다", `:83` "생계 손실과 회복 능력의 차이가 가려집니다" | MISSING | UNDRR 노출 주석(https://www.undrr.org/terminology/exposure, 2026-09-05 아카이브) — "These can be combined with the specific vulnerability and capacity of the exposed elements to any particular hazard to estimate the quantitative risks…". IPCC 용어집 취약성 정의의 "lack of capacity to cope and adapt"(#2). | 6절의 "회복 능력"이 취약성(대응·적응 능력)의 일부임을 3절 정의에 연결한다. 그래야 "손상률 차이 = 취약성"이라는 단순화의 경계가 드러난다. |
| 38 | infrastructure/food-chain-and-prices | `food-chain-and-prices.tsx:63` "2개를 버리면 판매 가능한 8개당 187.5원", `:65` "실제 폐기는 어느 단계에서 생기고 누가 비용을 부담하는지 다릅니다", `:95` "출하량, 판매량, 폐기량의 세 수량" | MISSING | https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/1231-global-food-losses/en — "The percentage of food lost globally after harvest on farm, transport, storage, wholesale and processing levels is estimated at 13.3 percent in 2023, up slightly from 13.0 percent in 2015, when global monitoring began." 국제 통계는 소매 전 단계의 손실(SDG 12.3.1a Food Loss Index)과 소매·외식·가정 단계의 폐기(12.3.1b Food Waste Index)를 나눠 잰다. | 4·7절에 "국제 통계는 소매 전 손실(loss)과 소매 이후 폐기(waste)를 나눠 집계한다(FAO 12.3.1a, 2023년 13.3%)"를 넣는다. 그러면 사례의 '2개'가 어느 지표에 해당하는지 독자가 정할 수 있다. |
| 39 | infrastructure/housing-land-and-supply | `src/pages/articles/infrastructure/housing-land-and-supply.tsx:84` "싱가포르 정부는 일반적인 새 HDB 주택의 구매자가 99년 동안 주택 권리를 소유한다고 설명합니다", `:85` "남은 기간과 처분 조건이 다르면 같은 권리를 산 것이 아닙니다", `:89` "2023년 설명을 2026-10-04 재확인" | MISSING | https://www.gov.sg/explainers/do-hdb-flat-buyers-own-their-flat/ — "HDB flat buyers who purchase a typical new 99-year lease flat own the rights to their flats for 99 years." / "This article is accurate as of March 2023." 이 설명은 2024년 10월 BTO부터 도입된 Standard/Plus/Prime 분류보다 앞선다. 보조 출처(정부 1차 페이지는 403): https://edgeprop.sg/property-news/october-2024-bto-will-introduce-plus-flats-and-open-concept-layouts — Plus·Prime 주택은 10년 MOP, 매각 시 subsidy recovery, MOP 뒤에도 전체 임대 불가. | "99년" 서술은 유지한다. 처분 조건 예시로 "2024년 10월 이후 Plus·Prime 유형은 10년 최소 거주와 매각 시 보조금 환수가 붙는다"를 HDB 원문 링크와 함께 넣는다. 1차 페이지는 이 환경에서 403이어서 보조 출처로만 확인했다. |
| 40 | property/shop-transfer-and-goodwill | `src/pages/articles/property/shop-transfer-and-goodwill.tsx:99` CitationBlock "한국 식품위생법 제39조·제78조" href `…lsSideInfoP.do?lsiSeq=277149&joNo=0039…` "2026-10-04 시행 중인 조문의 영업자 지위승계·신고와 행정 제재처분 효과의 승계·예외를 확인했습니다"; `src/content/article-evidence.ts:10938,10944`; `src/content/article-learning.ts:125845,125855` (같은 href, joNo=0039·0078) | LINK | 두 링크 모두 HTTP 200이지만 본문이 "[시행 2025. 10. 1.] [법률 제21065호, 2025. 10. 1., 타법개정]" 머리와 담당 부서 목록뿐이고 조문 텍스트가 없음. 현행판 https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=285339&joNo=0039&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR — "[시행 2026. 10. 8.] [법률 제21525호, 2026. 4. 7., 타법개정]" "③ … 1개월 이내에 그 사실을 … 신고하여야 한다." / joNo=0078 — "… 행정 제재처분의 효과는 그 처분기간이 끝난 날부터 1년간 양수인 … 에 승계되며 … 다만, 양수인 … 이 … 알지 못하였음을 증명하는 때에는 그러하지 아니하다." | href 4곳을 lsiSeq=285339(또는 시행일 독립 링크 `lsLinkCommonInfo.do?lsJoLnkSeq=…`)로 교체. 본문 `:96`에 "1개월 이내 신고"와 "처분기간 종료 후 1년 승계·선의 증명 예외"를 구체적으로 적으면 링크가 다시 깨져도 판정 가능. |
| 41 | property/shop-closure-and-restoration | `shop-closure-and-restoration.tsx:98` "2026-10-02 시행 조문을 2026-10-04 확인했습니다" (근로기준법 제36조), `src/content/article-evidence.ts:10963` 같은 링크 | LINK | https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029728519 — 현재 "[시행 2026. 10. 8.] [법률 제21533호, 2026. 4. 7., 일부개정]"을 표시. 제36조 문언은 동일("… 14일 이내에 … 지급하여야 한다. 다만, 특별한 사정이 있을 경우에는 당사자 사이의 합의에 의하여 기일을 연장할 수 있다."). | 시행일 표기를 "확인 시점의 현행판"으로 바꾸거나 2026-10-08판으로 갱신. 내용 수정은 불필요. |
| 42 | business/shop-fitout-and-opening (+ shop-daily-operations) | `shop-fitout-and-opening.tsx:97` "2026-08-15 안내를 2026-10-04 확인", `article-evidence.ts:10839` "2026-08-15 안내의 대상 업종…", `:11490` "2026-08-15 기준 안내에서" | LINK | https://easylaw.go.kr/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=91&onhunqueSeq=4365 — 페이지 하단 "이 정보는 2026년 9월 15일 기준으로 작성된 것입니다." (10-04 이후 페이지가 갱신됐을 가능성은 배제하지 못함) | 기준일을 "2026-09-15 기준"으로 맞추거나 확인한 시점의 기준일만 적는다. |
| 43 | business/shop-daily-operations | `shop-daily-operations.tsx:94` CitationBlock source "고용노동부 · 소규모 사업장 7가지 노동법" | LINK | https://www.moel.go.kr/news/cardinfo/view.do?bbs_seq=20220500493 — 실제 제목 "[카드뉴스] 5인미만 사업장 적용 노동법", "등록일 2022-05-10". "7가지"라는 표현은 없음(evidence 라벨 "5인 미만 사업장 적용 노동법"은 맞음). | source를 "고용노동부 · [카드뉴스] 5인미만 사업장 적용 노동법(2022-05-10)"으로 바꾸고, 2022년 수치(최저임금 9,160원)가 담긴 자료임을 함께 표시한다. |
| 44 | institutions/evidence-measurement-and-causality | `evidence-measurement-and-causality.tsx:120` CitationBlock "ICH · E8(R1), §5.3 및 §6 … 배정 이후 탈락·측정·분석의 차이도 결과 해석에 영향을 준다는 설계 원칙", `src/content/article-evidence.ts:11501` 같은 label | LINK | https://database.ich.org/sites/default/files/E8-R1_Guideline_Step4_2022_0204%20%281%29.pdf — §5.3 제목은 "Choice of Control Group", §6은 "CONDUCT, SAFETY MONITORING, AND REPORTING". 해당 내용은 §5.5 "Methods to Reduce Bias"에 있음: "Randomisation at the start of the study addresses differences between the groups at the time of randomisation but does not prevent bias due to differences arising during the study. Events after randomisation … may affect the validity and interpretation of comparisons between treatment groups." 및 §5.6 "sensitivity analyses should be planned to assess the impact of that assumption on the study results" | label을 "ICH · E8(R1), §5.5·§5.6"으로 정정한다. §5.3을 비교군 선택 근거로 남기려면 "§5.3(비교군)·§5.5(배정 후 편향)"으로 나눠 적는다. |
| 45 | institutions/education-skills-and-signals (+ healthcare-payment-systems) | `src/content/knowledge-graph.ts:28511` education-signal canonicalHref "/economics/institutions/education-skills-and-signals#comparison"; `:28475` health-financing-three-functions canonicalHref "/economics/institutions/healthcare-payment-systems#mechanism" | LINK | 본문에서 "신호 효과"를 정의하는 곳은 `education-skills-and-signals.tsx:54`(section id="names")이고, #comparison은 영국 학자금 상환 절이다. "재원 조달·위험 풀·구매" 세 기능의 정의도 `healthcare-payment-systems.tsx`의 section id="names"(3절)에 있고, #mechanism은 건별/묶음 지급 절이다. | 두 canonicalHref를 #names로 바꾼다. |
| 46 | institutions/how-to-read-a-country | `src/pages/articles/institutions/how-to-read-a-country.tsx:127` SourceApplication excerpt "for statistical convenience"를 412·158 별도 코드 설명의 근거로 사용 | LINK | https://unstats.un.org/unsd/methodology/m49/ — 이 구절의 원문은 "The assignment of countries or areas to specific groupings is for statistical convenience …"(지역 묶음 배정에 관한 문장). 412·158에 관한 원문 구절은 "However, for strictly statistical purposes, the numerical code 412 can be used to represent this area." / "…the numerical code 158 can be used to represent this area." | excerpt를 "for strictly statistical purposes"로 바꿔 application 문맥과 맞춘다. |
| 47 | infrastructure/housing-land-and-supply | `housing-land-and-supply.tsx:76-77` source "RICS Valuation of development property · 6.1.1, p.24", href `…/to-be-sorted/valuation-of-development-property---first-edition.pdf`; `:73` "RICS의 개발 부동산 평가 안내는"; `src/content/article-evidence.ts` 같은 route 블록 | LINK | 링크 PDF(200)의 표지: "RICS guidance note, global 1st edition, October 2019 … Effective from 1 February 2020". 6.1.1(p.24) 원문 "minus the cost of undertaking that development, including a profit for the developer … gross development value (GDV) - total development costs (including profit) = residual land value". 인용문과 쪽수는 맞다. 그러나 현행 RICS 페이지 https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/valuation-standards/valuation-of-development-property — "The aim of this Professional Standard is to guide the valuer…"는 다른 PDF(`Valuation%20of%20development%20property_ready%20for%20approvals.pdf`, 표지 "RICS PROFESSIONAL STANDARD … 1st edition, October 2019")를 가리킨다. 내용은 같고 지위만 guidance note에서 professional standard로 재분류됐다. | href를 RICS 현행 페이지나 professional standard PDF로 바꾸고 "안내" 대신 "RICS 전문 표준(professional standard)"으로 적는다. |
| 48 | infrastructure/electricity-grid-and-power, climate-risk-and-exposure, materials-waste-and-circularity | `electricity-grid-and-power.tsx:76,87`, `climate-risk-and-exposure.tsx:91`, `materials-waste-and-circularity.tsx:97,109,127` (IEA·FERC·UNDRR·OECD×2·UNEP href) | LINK | 원 URL 6개가 2026-10-09 이 환경의 curl과 WebFetch 모두에서 "HTTP 403"(Cloudflare 봇 차단)을 반환했다. 각 URL의 web.archive.org 스냅샷(2025-09-15~2026-10-06)에서는 페이지가 존재하고 excerpt도 원문 그대로 있다(글별 기록 참고). OECD EPR 페이지만 스냅샷이 없어 RePEc 초록으로 확인했다. | 사실 결함은 아니다. 링크 자동 점검에서 403을 "깨짐"으로 오판하지 않도록 기록만 한다. 수정은 필요 없다. |
| 49 | property/shop-transfer-and-goodwill | `shop-transfer-and-goodwill.tsx:122-125` "호주 NSW의 소매 임대차 양도 안내는 임대인에게 서면으로 동의를 요청하고 기존 임대 조건과 양도인의 공개 문서를 새 임차인·임대인에게 제공하는 절차를 설명합니다", `:130` 링크 | UNVERIFIED | https://www.smallbusiness.nsw.gov.au/help/common-questions/transferring-your-lease — WebFetch 60초 타임아웃 2회, curl 응답 없음(000), archive.org 스냅숏 없음("archived_snapshots": {}). | 다른 네트워크에서 재확인. 대체 근거로 NSW Retail Leases Act 1994 s.39–41(양도 동의·공개)의 legislation.nsw.gov.au 조문을 함께 인용 권장. |
| 50 | property/commercial-lease-and-rent (+ shop-closure-and-restoration) | `commercial-lease-and-rent.tsx:112` excerpt "restore the premises to the state agreed in the lease", `:113`; `shop-closure-and-restoration.tsx:119` | UNVERIFIED | 같은 사이트 https://www.smallbusiness.nsw.gov.au/help/common-questions/what-to-do-at-the-end-of-the-lease — 직접 접속 타임아웃. 검색 색인 스니펫으로만 "When the lessee is vacating the premises, be sure to leave enough time to remove your property and restore the premises to the state agreed in the lease." / "Parties often agree to a payment by the lessee to the lessor in lieu of the lessee carrying out the make good" 확인(문구 일치 가능성 높음). | 페이지 직접 열람으로 재확인. |
| 51 | business/shop-unit-economics | `src/pages/articles/business/shop-unit-economics.tsx:102` "호주 NSW의 소매 임차인은 임대료 외에 부담할 outgoings가 계약과 임대인의 공개서에 어떻게 적혔는지 확인합니다. 청소·관리·수선 등의 비용이며 법에서 허용한 범위도 맞아야 합니다", `:108` "점포와의 직접적·합리적 관련 및 건물 운영 등의 범위를 확인했습니다" | UNVERIFIED | https://www.smallbusiness.nsw.gov.au/help/common-questions/what-are-outgoings — HTTP/2 INTERNAL_ERROR, HTTP/1.1·WebFetch timeout, Wayback 스냅샷 없음. 같은 기관 Retail Tenancy Guide 스냅샷(2026-05-03)으로 부분만 확인: "Any outgoings the lessee must pay (e.g. land tax, cleaning, security, council rates, water/utility charges, etc)", "Undisclosed outgoings might not have to be paid." "직접적·합리적 관련" 요건은 확인 못 함. | 다시 접속해 "직접적·합리적 관련" 요건 원문을 확인하고, 확인 전까지는 근거를 Retail Tenancy Guide 문장으로 바꾼다. |
| 52 | institutions/insurance-risk-pooling | `src/pages/articles/institutions/insurance-risk-pooling.tsx:84` SourceApplication excerpt "most homeowners insurance does not cover flood damage", href https://www.floodsmart.gov/get-insured/eligibility | UNVERIFIED | 인용 페이지는 curl·WebFetch 403, Chrome도 Cloudflare 차단. 웹 검색상 같은 문구가 FEMA/NFIP 공식 자료 제목 "fema nfip most homeowners insurance does not cover flood damage postcard 08 2025"(agents.floodsmart.gov)에 있으나, 인용 URL 페이지 자체의 원문은 확인하지 못했다. | 접근 가능한 환경에서 해당 페이지 원문을 대조하거나, href를 FEMA 공식 PDF로 바꾼다. |
| 53 | infrastructure/electricity-grid-and-power | `electricity-grid-and-power.tsx:63` "먼 발전의 단가를 MWh당 5만 원, 공장 근처 대체 공급을 10만 원으로 둡니다(가정)" 등 원화 사례 | UNVERIFIED | 가정 수치이고 한국 요금표가 아니라고 `:84`에서 밝혔다. 한국 전력시장(SMP·계통한계가격, 한전 단일 판매) 대비 현실성은 판정하지 않았다. 사실 주장이 아니어서 검증 대상에서 뺐다. | 수정은 필요 없다. 한국 독자를 위해 "한국은 전력거래소가 계통운영과 도매시장을, 한전이 송배전·판매를 맡는다"를 6절 비교에 넣을지는 편집 판단에 맡긴다(미검증 상태라 판정은 하지 않음). |

## 글별 검증 기록

### property/commercial-lease-and-rent
- 추출한 고유 사실 주장 수: 16, 검증 15, 미검증 1(NSW 페이지 직접 접속 실패, 검색 색인 스니펫으로만 대조)
- 연 자료:
  - https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1013685403 — 200 — "[시행 2026. 5. 12.] [법률 제21083호, 2025. 11. 11., 일부개정]" / "제3조(대항력 등) ① 임대차는 그 등기가 없는 경우에도 임차인이 건물의 인도와 … 사업자등록을 신청하면 그 다음 날부터 제3자에 대하여 효력이 생긴다." / "② 임차건물의 양수인(그 밖에 임대할 권리를 승계한 자를 포함한다)은 임대인의 지위를 승계한 것으로 본다." excerpt 원문 일치.
  - https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=279651&joNo=0005… — 200 — "② 제3조 제1항 의 대항요건을 갖추고 관할 세무서장으로부터 임대차계약서상의 확정일자를 받은 임차인은 … 후순위권리자나 그 밖의 채권자보다 우선하여 보증금을 변제받을 권리가 있다." 일치.
  - https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=279651&joNo=0002… — 200 — "③ 제1항 단서에도 불구하고 제3조 , 제10조 제1항 , 제2항 , 제3항 본문, 제10조의2부터 제10조의9 까지의 규정, 제11조의2 및 제19조 는 제1항 단서에 따른 보증금액을 초과하는 임대차에 대하여도 적용한다." — 본문 "제3조 등 일부 조항은 그 범위를 넘는 임대차에도 적용" 일치.
  - https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651 — 200 — 껍데기만 정적 HTML, 본문은 JS 로딩. 같은 판의 본문은 `lsInfoR.do?lsiSeq=279651&efYd=20260512`와 조문별 lsSideInfoP로 대조: 제10조 "① … 임대차기간이 만료되기 6개월 전부터 1개월 전까지 사이에 계약갱신을 요구할 경우 정당한 사유 없이 거절하지 못한다 … 1. 임차인이 3기의 차임액에 해당하는 금액에 이르도록 차임을 연체한 사실이 있는 경우" / "② … 전체 임대차기간이 10년을 초과하지 아니하는 범위에서만 행사할 수 있다." / "③ … 차임과 보증금은 제11조 에 따른 범위에서 증감할 수 있다." 제10조의4 "① 임대인은 임대차기간이 끝나기 6개월 전부터 임대차 종료 시까지 …"
  - 시행령(lsiSeq=287139, "[시행 2026. 7. 1.] [대통령령 제36423호, 2026. 6. 23., 타법개정]") 제2조 "1. 서울특별시 : 9억원 2. … 과밀억제권역(서울특별시는 제외한다) 및 부산광역시: 6억9천만원 3. 광역시 … 5억4천만원 4. 그 밖의 지역 : 3억7천만원" / "③ … “대통령령으로 정하는 비율”이라 함은 1분의 100을 말한다." 제4조 "… 청구당시의 차임 또는 보증금의 100분의 5의 금액을 초과하지 못한다."
  - 같은 법 전문(2026-05-12판) 제19조의2 "① 임대차계약 시 합의로 임차인이 임대인에게 상가건물의 유지관리를 위하여 필요한 관리비를 납부하는 경우 임차인은 임대인에게 그 부과된 관리비 내역의 제공을 요청할 수 있다." / 부칙 "제2조(관리비 내역의 제공에 관한 적용례) 제19조의2의 개정규정은 이 법 시행 이후 임대차계약을 체결하거나 갱신하는 경우부터 적용한다." (발견 #3)
  - https://lawcom.gov.uk/project/business-tenancies-the-right-to-renew/ — 200 — "On 16 June 2026, we published our second consultation paper" / "The consultation period closed on 16 September 2026." / "We are now analysing consultation responses and will, in due course, publish a final report" — 본문 서술 일치.
  - https://www.gov.uk/government/publications/renewing-and-ending-business-leases-a-guide-for-tenants-and-landlords — 200 — "Applies to: England and Wales", 최종 갱신 "30 July 2026", contracting out 설명 — 일치.
  - https://www.smallbusiness.nsw.gov.au/help/common-questions/what-to-do-at-the-end-of-the-lease — WebFetch·curl 모두 타임아웃(접속 불가). 검색 색인 스니펫: "When the lessee is vacating the premises, be sure to leave enough time to remove your property and restore the premises to the state agreed in the lease." / "Parties often agree to a payment by the lessee to the lessor in lieu of the lessee carrying out the make good" — excerpt와 금전 정산 서술 일치(페이지 직접 열람은 못 함).
- 계산: 200만×36 = 7천200만, +3천만 = 1억200만, 순지급 7천200만 OK. 2천400만 − 400만 = 2천만 OK.
- 빠진 내용: 환산보증금 공식·지역별 기준액과 5% 증액 상한(발견 #4), 2026-05-12 개정의 관리비 내역 제공 요청권(발견 #3).
- OK 확인: 제3조 ①② 요건·효력, 제5조② 확정일자 우선변제, 제2조③ 예외 조항, 제10조 6개월~1개월·10년·3기 연체, 제10조의4 회수기회 보호, Law Commission 2차 의견수렴 2026-09-16 종료, GOV.UK 적용지역·갱신일.
- 참고: 사례(보증금 3천만 + 월 200만)의 환산보증금은 3천만 + 200만×100 = 2억3천만 원으로 시행령 제2조의 모든 지역 기준액(최저 3억7천만 원) 이하라 제5조·제11조 적용 범위 안이다. 글은 이 계산을 하지 않고 "적용 범위도 확인해야 합니다"로만 둔다.

### property/shop-closure-and-restoration
- 추출한 고유 사실 주장 수: 18, 검증 18, 미검증 0(영상 프레임 03:50·01:53 자체는 보지 않고 게시기관 자막으로 대조)
- 연 자료:
  - https://law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029728519 — 200 — "[시행 2026. 10. 8.] [법률 제21533호, 2026. 4. 7., 일부개정]" / "제36조(금품 청산) 사용자는 근로자가 사망 또는 퇴직한 경우에는 그 지급 사유가 발생한 때부터 14일 이내에 … 지급하여야 한다. 다만, 특별한 사정이 있을 경우에는 당사자 사이의 합의에 의하여 기일을 연장할 수 있다." 내용 일치. 인용 블록의 "2026-10-02 시행"은 현재 링크가 보여 주는 판(2026-10-08 시행)과 다름(발견 #11, 경미).
  - https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335625 — 200 — "[시행 2026. 9. 11.]" 개인정보 보호법 제21조 ①~④ 파기·다른 법령 보존 예외·분리 저장 일치.
  - https://nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2448&nttSn=1393 — 200 — "폐업일이 속한 달의 다음달 25일 이내에 폐업시까지의 거래분과 잔존하는 재화 등에 대하여 부가가치세 신고를 하여야 합니다." excerpt 원문 일치.
  - https://www.law.go.kr/LSW/precInfoP.do?precSeq=194367 — 200 — "[대법원 2002. 12. 10. 선고 2002다52657 판결]" 판결요지 [2] "… 임대인이 원상복구할 의사 없이 임차인이 설치한 시설을 그대로 이용하여 타에 다시 임대하려 하는 경우에는 원상복구비용을 임대차보증금에서 공제할 수 없다고 보아야 한다." excerpt 일치. 판결요지 [1](약정 원상복구 보증금은 당연 공제 불가)은 글에 없음(정본 범위상 낮은 우선순위).
  - https://www.mss.go.kr/…searchSeq=ST_000000001222422 — 200 — 방송날짜 "2025.01.24" / "24년도 점포 철거비를 최대 250만 원까지 지원했는데요. 올해는 최대 400만 원까지 지원합니다." 일치.
  - https://www.mss.go.kr/…searchSeq=ST_000000001231716 — 200 — 방송날짜 "2025.07.11" / "점포철거비를 당초 400만원까지 지원해드렸는데요 2차 추경 예산을 통해서 최대 600만원까지 지원해드립니다." 일치.
  - https://www.mss.go.kr/site/smba/ex/bbs/View.do?bcIdx=1060542… — 200 — 등록일 "2025.07.30" / "수정공고를 31일(목) 실시한다" / "2025년 7월 11일 이후 폐업한 소상공인을 대상으로 최대 600만원(기존 400만원)까지 점포 철거비 지원을 확대" 일치.
  - https://www.youtube.com/watch?v=T6KNxj3hawQ — oEmbed·watch 200 — 제목 "역대급 정책이 나타났다! 2025년 소상공인 지원사업은?ㅣ머니포차 특별편 EP 01"(중소벤처기업부), "publishDate":"2025-01-23T17:17:32-08:00"(= KST 1월 24일). 글의 "2025-01-23 공개"는 태평양시 기준.
  - https://www.youtube.com/watch?v=A55z8XrEEdM — 200 — "폐업 지원부터 AI 스타트업까지, 9,258억원 2차 추경 요약.zip", "publishDate":"2025-07-11T00:59:41-07:00" 일치.
  - https://ssrf.or.kr/…file_id=3953… — 200, application/pdf 7쪽 — "2026년『희망리턴패키지 원스톱폐업지원』 소상공인 모집 공고 … 2026년 1월 19일" / 표 "’25년 7월 11일 전(’23.1.1~’25.7.10) 400만원 · ’25년 7월 11일 이후(’25.7.11~) 600만원 · 전용면적(3.3m2)당 한도 20만원 이내" / "* 전자세금계산서 상 공급가액만 지원하며(부가세 지원 제외), 반드시 국세청에 사업자등록이 되어있는 업체를 통해 철거해야 함 (자력철거 시 지원불가)" / "점포철거비 지원을 이미 받은 경우 (주민등록번호 기준 1회만 신청 가능)" / "동일장소 재창업 제한 기간: 점포철거비 지원금 수혜일로부터 3년" / 정산서류 "공사내역서 … 전자세금계산서(또는 카드전표) … 철거공사 전·후 사업장 내·외부 사진". 글의 3.3㎡당 20만·부가세 제외·업체 시공·증빙·중복지원 제외 일치.
- 계산: 3천만 − 400만 − 600만 = 2천만, 3천만 − 400만 = 2천600만, 2천600만 − 600만 = 2천만, 300만 − 100만 = 200만 부족, 33 ÷ 3.3 × 20만 = 200만 — 모두 OK.
- 빠진 내용: 2026년 공고 자체에 폐업일별 최대한도 400만/600만 표가 있는데 글은 600만 원을 "영상"의 수치로만 다루고 공고에서는 면적 한도만 읽음(발견 #1).
- OK 확인: 제36조 14일·합의 연장, 부가세 다음 달 25일, 2002다52657 요지[2], 2025년 1월 250→400만, 7월 400→600만, 7월 11일 이후 폐업 적용, 7월 31일 수정공고.

### property/shop-transfer-and-goodwill
- 추출한 고유 사실 주장 수: 14, 검증 13, 미검증 1(NSW 양도 안내 접속 실패)
- 연 자료:
  - https://www.law.go.kr/LSW/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335679 — 200 — "[시행 2026. 9. 11.]" 제27조 "① … 미리 다음 각 호의 사항을 대통령령 으로 정하는 방법에 따라 해당 정보주체에게 알려야 한다. 1. 개인정보를 이전하려는 사실 2. … 성명 …, 주소, 전화번호 및 그 밖의 연락처 3. 정보주체가 개인정보의 이전을 원하지 아니하는 경우 조치할 수 있는 방법 및 절차" — excerpt·적용 문장 일치.
  - https://law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1029331507 — 200 — "② 영업양수자등은 … 지체 없이 그 사실을 … 알려야 한다. 다만, 개인정보처리자가 제1항에 따라 그 이전 사실을 이미 알린 경우에는 그러하지 아니하다." 일치.
  - https://law.go.kr/LSW/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=1006185845 — 200 — "③ … 이전 당시의 본래 목적으로만 개인정보를 이용하거나 제3자에게 제공할 수 있다. 이 경우 영업양수자등은 개인정보처리자로 본다." 일치.
  - https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=279651&joNo=0010&joBrNo=03… — 200 — "제10조의3(권리금의 정의 등) ① 권리금이란 … 영업시설ㆍ비품, 거래처, 신용, 영업상의 노하우, 상가건물의 위치에 따른 영업상의 이점 등 유형ㆍ무형의 재산적 가치의 양도 또는 이용대가로서 … 보증금과 차임 이외에 지급하는 금전 등의 대가" 일치.
  - 제10조의4(2026-05-12판, lsSideInfoP joNo=0010&joBrNo=04) — 200 — "… 권리금을 지급받는 것을 방해하여서는 아니 된다 . 다만, 제10조 제1항 각 호의 어느 하나에 해당하는 사유가 있는 경우에는 그러하지 아니하다." / "② … 1. … 보증금 또는 차임을 지급할 자력이 없는 경우" — excerpt·6개월·예외·자력 일치.
  - https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=277149&joNo=0039… 및 joNo=0078 — 200이지만 "[시행 2025. 10. 1.] [법률 제21065호, 2025. 10. 1., 타법개정]" 머리만 있고 조문 본문이 비어 있음(발견 #2). 현행판 lsiSeq=285339("[시행 2026. 10. 8.] [법률 제21525호, 2026. 4. 7., 타법개정]")로 대조: 제39조 "③ … 1개월 이내에 그 사실을 … 신고하여야 한다." 제78조 "… 행정 제재처분의 효과는 그 처분기간이 끝난 날부터 1년간 양수인 … 에 승계되며, … 절차를 계속할 수 있다. 다만, 양수인 … 이 … 알지 못하였음을 증명하는 때에는 그러하지 아니하다." — 본문 서술("조건과 예외") 일치.
  - https://www.smallbusiness.nsw.gov.au/help/common-questions/transferring-your-lease — WebFetch·curl 타임아웃, archive.org 스냅숏 없음 → UNVERIFIED(서면 동의·공개 문서·책임 종료 서술).
- 계산: 2천만 + 300만 + 1천만 = 3천300만, 3천300만 − 300만 = 3천만, 2천만 + 250만 + 1천만 = 3천250만, − 300만 = 2천950만, 1천만 ÷ 100만 = 10개월, ÷ 50만 = 20개월 — 모두 OK.
- 빠진 내용: 식품위생법 제39조③의 "1개월 이내" 신고 기한과 제78조의 "1년간" 승계 기간·선의 증명 예외가 글에 구체적으로 없음(본문은 "조건과 예외"로만 적음, 낮은 우선순위라 표에는 넣지 않음).
- OK 확인: 제10조의3 정의, 제10조의4 6개월~종료·예외·정당 사유, 개인정보 보호법 제27조 ①②③.
- 표현: `shop-transfer-and-goodwill.tsx:54` "기존 점주가 먼저 지급하기로 한 돈을 받습니다" — 지급자는 새 점주(같은 줄 movement "…300만 원을 지급합니다")인데 주어가 섞여 읽힘(발견 #12, 경미).

### property/land-development-residual
- 추출한 고유 사실 주장 수: 12, 검증 12, 미검증 0
- 연 자료:
  - https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf — 200, PDF — 표지 "Valuation of development property 1st edition, October 2019", 꼬리말 "Effective from 1 February 2020". 6.1.1(인쇄 24쪽): "gross development value (GDV) - total development costs (including profit) = residual land value" excerpt 원문 일치. 용어집 "Total development cost The total cost of undertaking a development excluding profit and land." — 본문의 "용어집은 total development cost를 토지와 이익 제외로 정의" 일치. GDV 정의 "assessed on the special assumption that the development is complete on the date of valuation" 일치. B1.2.8.8 "assuming no debt and a project target rate of return. The debt analysis should be undertaken outside of the market valuation" — 본문 B1.2.8~9 요약 일치.
  - https://www.rics.org/profession-standards/…/valuation-of-development-property — 200 — "The aim of this Professional Standard is to guide the valuer …" / "Published date: 01 October 2019" (발견 #8).
  - https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1016204783 — 200 — "[시행 2026. 7. 1.] [법률 제21447호, 2026. 3. 5., 타법개정]" 제56조 "① … 2. 토지의 형질 변경(경작을 위한 경우로서 대통령령 으로 정하는 토지의 형질 변경은 제외한다)" excerpt 일치, 2026-07-01 시행 일치.
  - https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=273437&joNo=0011… — 200 — "[시행 2026. 2. 27.] [법률 제21035호, 2025. 8. 26., 일부개정]" 제11조 ⑤ "3. 「국토의 계획 및 이용에 관한 법률」 제56조 에 따른 개발행위허가" 의제, ⑥ 사전 협의 15일 — 일치.
  - https://www.gov.uk/planning-permission-england-wales — 200 — "contact your local planning authority ( LPA ) through your local council" 일치.
  - https://www.gov.uk/building-regulations-approval — 200 — "Building regulations approval is different from planning permission . You might need both." 일치.
- 계산: 100−70−15 = 15, 15−2 = 13, 100−80−15 = 5, 90−70−15 = 5, 90−80−15 = −5, 50×0.08×6/12 = 2, 100−72−15 = 13 — 모두 OK. FlowRail 지출 합계 15+70 = 85, 100−85 = 15 OK.
- 빠진 내용: 없음(시점 할인·B3 언급 있음).
- OK 확인: RICS 6.1.1 식·용어집·B1.2.8.8, 국토계획법 제56조 형질 변경, 건축법 제11조 ⑤3호 의제·⑥ 협의, GOV.UK 두 승인 별개.

### labor/wage-floor-natural-experiment
- 추출한 고유 사실 주장 수: 24(모형 계산 14 + 논문·후속연구 사실 10), 검증 24, 미검증 0
- 연 자료:
  - https://davidcard.berkeley.edu/papers/njmin-aer.pdf — 200, 26쪽 PDF — 초록 "On April 1, 1992, New Jersey's minimum wage rose from $4.25 to $5.05 per hour. To evaluate the impact of the law we surveyed 410 fast-food restaurants". 표 1 "Wave 1, February 15-March 4, 1992 … Number interviewed: 410" / "Wave 2, November 5 - December 31, 1992 … Number closed: 6 … Number under renovation: 2 … Number temporarily closed: 2". 표 3(인쇄 780쪽, 쪽 이미지로 대조): 3행 "-2.16 (1.25) 0.59 (0.54) 2.76 (1.36)", 4행 "-2.28 (1.25) 0.47 (0.48) 2.75 (1.34)", 주석 "FTE (full-time-equivalent) employment counts each part-time worker as half a full-time worker. Employment at six closed stores is set to zero. Employment at four temporarily closed stores is treated as missing." / "ᵈIn this row only, wave-2 employment at four temporarily closed stores is set to 0." 본문 "number of full-time workers [including managers] plus 0.5 times the …". 표 7(인쇄 788쪽 이미지): "New Jersey dummy 0.033 (0.014)", "The sample contains 315 stores", 종속변수 "change in the log price of a full meal". 787쪽 "after-tax meal prices rose 3.2-percent faster in New Jersey than in Pennsylvania". excerpt "balanced sample of stores"(표 3 4행)·"change in the log price"(표 7) 원문 일치.
  - https://www.nber.org/system/files/working_papers/w5224/w5224.pdf — 200(스캔본, 초록 쪽 이미지로 판독) — "NBER Working Paper #5224 August 1995" / "using new data based on actual payroll records from 230 Burger King, KFC, Wendy's, and Roy Rogers restaurants" / "the data collected by CK appear to indicate greater employment variation over the eight-month period" / "estimates based on the payroll data suggest that the New Jersey minimum wage increase led to a 4.6 percent decrease in employment in New Jersey relative to the Pennsylvania control group" — 본문 서술 일치.
  - https://www.nber.org/system/files/working_papers/w6386/w6386.pdf — 200(스캔본, 3쪽 이미지) — "Working Paper 6386 … January 1998" / "Both a longitudinal sample and a repeated-cross-section sample drawn from these data indicate similar or slightly faster employment growth in New Jersey relative to eastern Pennsylvania" / "The differences between this sample and both the BLS data and our earlier sample are attributable to a small set of restaurants owned by a single franchisee who provided the original Pennsylvania data for a 1995 EPI study." / "employment trends in the EPI/Neumark-Wascher sample are strikingly different for firms that reported their data on a weekly, biweekly or monthly basis" (발견 #10).
- 계산(model.ts를 python3로 재현, 0~13을 0.0001 간격 전수 탐색): 3·4시간 수입 34.5·44, 임금 18·28, 이익 16.5·16; F=9의 3·4·5시간 이익 7.5·8·7.5; 수요독점 최적 n=10/3·이익 50/3·w=19/3·v=W′=29/3; ε_s = 1×(19/3)/(10/3) = 1.9, (v−w)/w = 10/19 ≈ 52.63%; 전수 탐색 최적 F=0·5·6·19/3 → 3.3333, 6.5 → 3.5, 7 → 4, 8 → 5, 9 → 4, 10 → 3, 12 → 1, 13·14 → 0 — `monopsonyHours()`의 구간식과 전부 일치. 정수 사례(integerMaxima): 임금 수용 시급 8 → {4,5} 이익 10, 하한 없음 → {3} 이익 15(4단위 14), F=9 → {3,4} 이익 6, F=12 → {0,1} 이익 0 — 본문 일치. 연속식의 n번째 한 시간 증분 13.5−n(12.5, 11.5, 10.5, 9.5) 일치. exp(0.033)−1 = 0.03355 → "약 3.36%" 일치. 0.59+2.16 = 2.75, 0.47+2.28 = 2.75 일치. 가정 DiD (21−20)−(23−25) = 3 일치.
- 빠진 내용: 없음(2000년 AER 출판 교환은 본문이 범위 밖이라고 명시).
- OK 확인: 1992-04-01 4.25→5.05, PA 4.25 유지, 410곳, 2~3월/11~12월, 표 3 수치·표준오차, FTE 정의(관리자 포함), 영구 폐업 6·일시 휴업 4 처리, 표 7 0.033(0.014)·315곳, 3.2%(세후), NW 230곳·변동 3배·상대 감소, CK 1998 ES-202 결과.

### labor/measuring-the-spread
- 추출한 고유 사실 주장 수: 15, 검증 15, 미검증 0
- 연 자료:
  - https://archive.org/details/jstor-2276207 (+ /download/jstor-2276207/2276207.pdf, 12쪽 스캔) — 200 — 쪽 이미지로 대조:
    - 209쪽: "at what point a community is to be placed between the two extremes,—equality, on the one hand, and the ownership of all wealth by one individual on the other." 일치.
    - 210쪽 표 "INCOME TAX ASSESSMENTS UNDER SCHEDULE D": "Between £150 and £500 … 21.4 (Increase) / 500 " 1,000 … nil / 1,000 " 5,000 … 2.5 (Decrease) / Over 5,000 … 2.3 (Decrease)", 연도 1877·1886. 인용 "It is impossible to tell from such a table whether there has been a concentration or diffusion of wealth because it might be true that the incomes over five thousand pounds, although a smaller proportion of the total number in the second epoch, nevertheless constitute a much larger proportion of the total income." 일치.
    - 214쪽 프로이센 표: 1892 "Under 900 … 70.1 41.2 / 900–3,000 26.0 30.0 / 3,000–6,000 2.5 8.6 / 6,000–9,500 .7 4.2 / 9,500–30,500 .6 7.4 / 30,500 and over .1 8.6", 1901 "60.5 31.7 / 34.8 35.3 / 3.0 9.3 / .8 4.5 / .7 8.1 / .2 11.1". `BowAndAreaViz.tsx:16-21`의 누적값 전부 일치.
    - 217쪽: "Plot along one axis cumulated per cents. of the population from poorest to richest, and along the other the per cent. of the total wealth held by these per cents. of the population." / "With an unequal distribution, the curves will always begin and end in the same points as with an equal distribution, but they will be bent in the middle; and the rule of interpretation will be, as the bow is bent, concentration increases." 일치(본문은 "per cents," 쉼표로 옮김 — 무시 가능한 전사 차이).
    - 218쪽: 그림(세로축 "Percents of Number", 가로축 "Percents of Total Income") / "It is evident at a glance that the figures for 1901 show a greater concentration than those for 1892." / "The curves may not always give so clear an answer … but the diagram will always tell what has happened. To take an extreme case, let the following figures represent the distribution of $100 among a group of ten persons at two epochs" / "Case I 6 7 8 9 10 12 12 12 12 12 · Case II 8 8 8 8 8 8 8 14 14 16" 일치.
  - https://api.crossref.org/works/10.2307/2276207 — 200(301 후) — "Methods of Measuring the Concentration of Wealth", "Publications of the American Statistical Association", 9, 70, "209-219", 1905-06-01, Lorenz — 서지 일치.
  - https://www.dss.uniroma1.it/RePec/mtn/articoli/2005-1-1.pdf — 200 — Gini(1914) 영역본(Metron 2005): "we consider the ratio between the area limited by the concentration curve and the egalitarian line (concentration area) and the area of the triangle obc … this ratio is the limit the concentration ratio R tends to" (발견 #5 근거).
- 계산: 사다리꼴 공식으로 프로이센 1892 G = 0.3573, 1901 G = 0.3935 → "0.357·0.394" 일치. Case I 누적 6,13,21,30,40,52,64,76,88,100 / Case II 8,16,24,32,40,48,56,70,84,100 일치, G = 0.120·0.144(평균 절대 차이 공식으로도 0.12·0.144) 일치.
- 빠진 내용: 넓이 비의 표준 이름(지니계수)과 Gini(1912·1914) 귀속이 본문·KG 어디에도 없음(발견 #5). Lorenz 원 그림은 축이 현대 관례와 바뀌어 곡선이 대각선 위로 휨(발견 #9).
- OK 확인: 영국 표 증감률, 210·217·218쪽 인용, 프로이센 표, 반례 숫자, "넓이 비는 Lorenz 1905에 없다", 사다리꼴 직선 보간이 하향 편의를 낳는다는 서술, 음수 몫이면 1 초과 가능.

### firms/why-firms-exist
- 추출한 고유 사실 주장 수: 12(모형 계산 7 + 원문 사실 5), 검증 12, 미검증 0
- 연 자료:
  - https://msuweb.montclair.edu/~lebelp/coasenatfirmec1937.pdf — 200, 21쪽 스캔(텍스트층 없음, 쪽 이미지로 판독; PDF 5쪽 = 인쇄 389쪽) — 390쪽 "The main reason why it is profitable to establish a firm would seem to be that there is a cost of using the price mechanism. The most obvious cost of "organising" production through the price mechanism is that of discovering what the relevant prices are." excerpt 일치. 395쪽 "a firm will tend to expand until the costs of organising an extra transaction within the firm become equal to the costs of carrying out the same transaction by means of an exchange on the open market or the costs of organising in another firm." excerpt 일치, 같은 쪽 "diminishing returns to management" 일치. 397쪽 본문 "the costs of organising and the losses through mistakes will increase with an increase in the spatial distribution of the transactions organised, in the dissimilarity of the transactions, and in the probability of changes in the relevant prices" / 각주 3 "most inventions will change both the costs of organising and the costs of using the price mechanism. In such cases, whether the invention tends to make firms larger or smaller will depend on the relative effect on these two sets of costs." — 본문 11절 서술 일치.
  - https://api.crossref.org/works/10.1111/j.1468-0335.1937.tb00002.x — 200 — "The Nature of the Firm", Economica 4(16), 386-405, 1937-11 — 서지 일치.
  - https://www.nobelprize.org/prizes/economic-sciences/1991/coase/lecture/ — 200 — "The Institutional Structure of Production" / "there were costs of using the pricing mechanism … These costs have come to be known as transaction costs." / "The work of Oliver Williamson and others has led to a greater understanding of the factors which govern what a firm does and how it does it." / "we can also hope to learn much more in future from the studies of the activities of firms which have recently been initiated by the Center for Economic Studies of the Bureau of the Census" — 본문 "실제 자료가 더 필요" 요약 일치.
  - https://api.crossref.org/works/10.1086/466942 — 200 — Williamson, "Transaction-Cost Economics: The Governance of Contractual Relations", J. Law & Econ. 22(2), 233-261, 1979 (발견 #6 근거).
- 계산(model.ts `choices()` 재현): 밖 4 → [24,21,19,18,18,19,21] 최저 18 {3,4}; 밖 3.5 → 최저 16.5 {3}; 밖 5 → 최저 20 {4,5}; 밖 2 → 최저 11 {1,2}; 밖 4·설립비 5 → [24,26,24,23,23,24,26] 최저 23 {3,4}; 안 항상 5 → 0개(24), 안 항상 3 → 6개(18) — 본문·표·Viz 전부 일치.
- 빠진 내용: Williamson의 자산 특수성·홀드업 등 거래비용 이론의 핵심 결정 요인(발견 #6).
- OK 확인: Coase 390·395·397쪽 인용과 요약, 1991 노벨 강연 제목·내용, Economica 서지.

### firms/scale-and-cost-structure
- 추출한 고유 사실 주장 수: 16(모형 계산 11 + Young 원문 5), 검증 16, 미검증 0
- 연 자료:
  - https://gwern.net/doc/economics/automation/1928-young.pdf — 200, 16쪽(JSTOR 다운로드본 재게시) — 530쪽 "It would be wasteful to make a hammer to drive a single nail; it would be better to use whatever awkward implement lies conveniently at hand." excerpt 일치. 527쪽 "a safeguard against the common error of assuming that wherever increasing returns operate there is necessarily an effective tendency towards monopoly" — 12절 서술 일치. 533쪽 "Not area or population alone, but buying power, the capacity to absorb a large annual output of goods." 일치. 538쪽 "an increasingly intricate nexus of specialised undertakings has inserted itself between the producer of raw materials and the consumer", 539쪽 "These potential economies, then, are segregated and achieved by the operations of specialised undertakings which, taken together, constitute a new industry." — excerpt "specialised undertakings"(539쪽) 일치.
  - https://api.crossref.org/works/10.2307/2224097 — 200 — "Increasing Returns and Economic Progress", The Economic Journal 38(152), 527, 1928-12, Young — 서지 일치.
  - https://academic.oup.com/ej/issue/38/152 — 403(열람 불가, Crossref로 대체 확인).
- 계산(methodCosts 재현): 20개 A200·B140·C320(B), 100개 1,000·460·400(C), 10개 A=B=100, 80개 B=C=380, 11개부터 B, 81개부터 C, 5개 A50(B 평균 16), B 평균 20개 7·100개 4.6; C′(75,1): 9개 A90·B96·C′84, 75/9 = 8.33, B≤C′ ⇔ n≤5; 30×3 B = 540, C 90개 = 390, +60 = 450(절약 90), +180 = 570(+30); 시장 8개 A 80 = 40+40; 100개 C 400 < B 50개×2 = 520 — 전부 일치.
- 빠진 내용: 12절의 "한 업체 비용 vs 여러 업체 분할 비용" 비교는 비용 준가법성(subadditivity)의 정의인데 표준 용어가 없음(낮은 우선순위, 표에는 넣지 않음).
- OK 확인: Young 527·530·533·538~539쪽, DOI·권호.

### firms/market-power-and-markup
- 추출한 고유 사실 주장 수: 18(모형 계산 13 + Cournot 원문 5), 검증 18, 미검증 0
- 연 자료:
  - https://archive.org/details/researchesintom00fishgoog (메타데이터·djvu 텍스트) — 200 — "TRANSLATED BY NATHANIEL T. BACON … 1897". 56쪽 §26 "proprietor of a mineral spring … adopting the value of p which renders the product pF(p) a maximum … (1) F(p)+pF′(p) = o." / 57쪽 §27 "It will no longer be the function pF(p), or the annual gross receipts, which the producer should strive to carry to its maximum value, but the net receipts, or the function pF(p) — φ(D)" — excerpt "the net receipts" 일치. 56~57쪽 "or which does not exceed the annual flow of this spring; otherwise the owner could not … reduce the price" — 한도 서술 일치. 58쪽 §28 "But in a great many other cases there may be such a limitation, and if Δ expresses the limit which the production or the demand cannot exceed, the price will be fixed by the relation F(p) = Δ" — excerpt 일치. (아카이브 메타데이터의 date "1971"은 스캔 메타 오류로 보이며 본문은 1897년판.)
  - https://api.crossref.org/works/10.2307/2967480 — 200 — Lerner, "The Concept of Monopoly and the Measurement of Monopoly Power", Review of Economic Studies 1(3), 157-175, 1934 (발견 #7 근거).
  - https://api.crossref.org/works/10.1093/qje/qjz041 — 200 — De Loecker·Eeckhout·Unger, "The Rise of Market Power and the Macroeconomic Implications", QJE 135(2), 561-644, 2020.
  - https://academic.oup.com/qje/article/135/2/561/5714769 — 200(초록) — "In 1980, aggregate markups start to rise from 21% above marginal cost to 61% now. … Quite strikingly, the median is unchanged."
  - https://www.nber.org/papers/w23687 — 200 — 작업논문판 초록은 "In 1980, average markups start to rise from 18% above marginal cost to 67% now." — 판본마다 수치가 다름(21→61%는 QJE 출판본).
- 계산(sale()/optimum()/welfare() 재현): q=2·3·4·5 → p 11·10·9·8, R 22·30·36·40, C 14·21·28·35, π 8·9·8·5; R′(3)=7, R′(4)=5; 최적 q3·p10·ε −10/3·마크업 0.3; p=19−2q → q3·p13·|ε|13/6·6/13 = 46.15%; MC 9 → q2·p11·|ε|11/2·2/11 = 18.18%; 원가 가산율 3/7 = 42.86%; 잉여 (CS,PS,합,손실) q6 = (18,0,18,0), q3 = (4.5,9,13.5,4.5); 한도 2에서 MR 9 — 전부 일치.
- 빠진 내용: (p−MC)/p의 표준 이름(러너 지수)과 실증 마크업 측정·추세(발견 #7).
- OK 확인: Cournot 56~58쪽 인용·식 (1)(2)·한도 조건, 1897 Bacon 번역.


### business/business-model-cashflow
- 파일: `src/pages/articles/business/business-model-cashflow.tsx`(본문 tsx 내장), evidence `src/content/article-evidence.ts:10726-10751`, learning `src/content/article-learning.ts:124361-124603`, 개념 `knowledge-graph.ts:28078-28094`
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/ — 200 — excerpt 원문 일치: "recognise revenue when a performance obligation is satisfied by transferring a promised good or service to a customer (which is when the customer obtains control of that good or service)". 5단계 중 마지막 단계라는 서술 OK.
  - https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/ — 200 — excerpt 원문 일치: "the indirect method, whereby profit or loss is adjusted for the effects of transactions of a non-cash nature, any deferrals or accruals of past or future operating cash receipts or payments …"
  - https://www.ifrs.org/news-and-events/updates/ifric/2022/ifric-update-april-2022/ — 200 — "The Committee met on 20 April 2022" / "If the IASB does not object to the agenda decision, it will be published in May 2022 in an addendum to this IFRIC Update" / 결정문 "Published in May 2022" / "Paragraphs B34–B38 set out a framework to determine whether an entity is a principal or agent." → "(2022년 5월)" 표기와 B34~B38 인용 OK.
  - https://www.ifrs.org/issued-standards/list-of-standards/ifrs-16-leases/ — 200 — "IFRS 16 sets out the principles for the recognition, measurement, presentation and disclosure of leases." 인용 설명 OK.
- 계산(python3): 100×12,000=1,200,000 / 100×20,000=2,000,000 / 2,000,000−60,000=1,940,000 / 1,940,000−1,200,000=740,000 / 7+14=21일 / 120만×2=240만 — 모두 OK. 수수료율 3%(가정).
- 빠진 내용: 없음(교육용 단일 거래 사례로서 필요한 부품은 갖춤. 한국 K-IFRS 1115호·일반기업회계기준 대응 명칭은 "한국의 기업별 적용 기준"으로만 언급 — 낮은 중요도라 발견으로 올리지 않음).
- OK 확인: IFRS 15 5단계·통제 이전, B34~B38 본인·대리인 틀, IAS 7 간접법 문구, IFRS 16 범위, 2022년 4월 회의·5월 발행.

### business/franchise-incentives
- 파일: `src/pages/articles/business/franchise-incentives.tsx`, evidence `article-evidence.ts:11016-11047`, learning `article-learning.ts:126176-126423`, 개념 `knowledge-graph.ts:28246-28262`
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료:
  - https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise — curl은 404(봇 차단, 1,301 bytes), WebFetch로 열림 — 제목 "A Consumer's Guide to Buying a Franchise". "Typically, you must pay royalties for the right to use the franchisor's name, even if you are losing money." excerpt 일치. "you must receive the document at least 14 days before you are asked to sign any contract or pay any money to the franchisor or an affiliate of the franchisor."
  - https://www.ftc.gov/business-guidance/blog/2023/05/franchise-fundamentals-taking-deep-dive-franchise-disclosure-document — curl 404(봇 차단), WebFetch로 열림 — 2023-05-24 게시. "Item 19 contains claims the franchisor chooses to make about sales or earnings. The Franchise Rule doesn't require a franchisor to provide that information, but most do." excerpt 일치, 좁은 예외 2개 언급도 일치.
  - https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-436/subpart-B/section-436.2 — 브라우저 외 접근 시 unblock.federalregister.gov로 302. eCFR API(`/api/versioner/v1/full/2026-10-01/title-16.xml?section=436.2`)와 https://www.law.cornell.edu/cfr/text/16/436.2 로 대체 확인 — "In connection with the offer or sale of a franchise to be located in the United States of America or its territories, unless the transaction is exempted under subpart E … (a) … at least 14 calendar-days before the prospective franchisee signs a binding agreement with, or makes any payment to, the franchisor or an affiliate". 본문 서술 일치.
  - eCFR API `section=436.5` — Item 1~23이 (a)~(w)로 23개. "23개 항목" OK.
  - https://franchise.ftc.go.kr/firHope/comparePopup.do — 200 — "가맹점 변동 현황 연도 연초 신규개점 계약종료 계약해지 명의변경 연말", "가맹점 사업자의 연간 평균 매출액과 산정기준", "평균 매출액 및 면적(3.3㎡) 당 매출액(단위 : 개, 천원 )". 본문 서술 일치.
  - https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A52022XC0630%2801%29 — 202(빈 응답, 봇 챌린지) 3회 재시도 실패. 같은 관보(OJ C 248, 30.6.2022) 스페인어판 PDF https://www.boe.es/doue/2022/248/Z00001-00085.pdf 로 대체 확인 — "165) Los acuerdos de franquicia incluyen licencias de DPI …", "166) La franquicia … el pago de cánones …", "167) Los acuerdos de franquicia pueden beneficiarse de la exención prevista en el artículo 2, apartado 1, del Reglamento (UE) 2022/720, en los casos en que las cuotas de mercado del proveedor y del comprador no superan el 30 %", "168) Los acuerdos de franquicia que no están cubiertos por Reglamento (UE) 2022/720 requieren una evaluación individual". 165~168항이 가맹계약 항목이라는 서술 OK.
  - 한국 가맹사업법(시행 2026. 10. 2., 법률 제21857호) 제7조·제6조의5·제11조·제12조의2·제12조의4 — law.go.kr `lsSideInfoP.do?lsiSeq=288583&joNo=…` 200 (발견 참조).
- 계산: 30,000,000×5%=1,500,000 / 30,000,000−1,500,000−10,000,000−3,000,000=15,500,000 OK.
- 빠진 내용: 한국 정보공개서 14일(자문 시 7일) 숙려·가맹금 예치·영업지역 보호·점포환경개선 비용 분담·필수품목 계약서 기재(발견 참조).
- OK 확인: FTC 로열티 문구, FDD 23항목·14달력일·관계회사 지급, Item 19 임의 제공, 한국 비교 화면 항목, EU 가이드라인 165~168항 범위.

### business/shop-unit-economics
- 파일: `src/pages/articles/business/shop-unit-economics.tsx`, evidence `article-evidence.ts:10752-10777`, learning `article-learning.ts:124604-124842`, 개념 `knowledge-graph.ts:28102-28118`
- 추출한 고유 사실 주장 수: 8(사실) + 계산 12, 검증 7, 미검증 1(NSW outgoings 페이지 접속 불가)
- 연 자료:
  - https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/ — 200 — "When inventories are sold, the carrying amount of those inventories is recognised as an expense in the period in which the related revenue is recognised." excerpt "When inventories are sold" 일치.
  - https://www.business.qld.gov.au/running-business/finance/essentials/break-even-profit — 200 — "This is the point where your total revenue (sales or turnover) equals total costs." excerpt 일치.
  - https://www.gov.uk/introduction-to-business-rates — 200 — "Business rates are charged on most non-domestic properties" / "Business rates are handled differently if: your property is in Scotland your property is in Northern Ireland". 서술 일치.
  - https://www.smallbusiness.nsw.gov.au/help/common-questions/what-are-outgoings — 접속 실패(HTTP/2 INTERNAL_ERROR, HTTP/1.1 30초 timeout, WebFetch 60초 timeout, Wayback 스냅샷 없음). 같은 기관 Retail Tenancy Guide 스냅샷(2026-05-03)에서 "Any outgoings the lessee must pay (e.g. land tax, cleaning, security, council rates, water/utility charges, etc)" / "Undisclosed outgoings might not have to be paid." 확인 — 본문의 "계약과 공개서에 어떻게 적혔는지 확인" 취지와 부합. "직접적·합리적 관련" 범위는 UNVERIFIED.
- 계산(python3): 6,000−2,000=4,000 / 8,000,000÷4,000=2,000 / 2,000÷30=66.67 / 67×30=2,010 / 8,000,000÷3,000=2,666.67→2,667 / 6,000×2,000−2,000×2,000−8,000,000=0 / 1,500잔: 9,000,000−3,000,000=6,000,000→부족 2,000,000 / 2,500잔: 10,000,000−8,000,000=2,000,000 / 60,000,000÷36=1,666,667 / (8,000,000+1,666,667)÷4,000=2,416.67→2,417 — 모두 OK.
- 빠진 내용: 없음(한국 부가세·카드수수료 등은 "부가세 제외 같은 기준" 가정으로 명시함).
- OK 확인: 공헌이익·손익분기 정의, IAS 2 판매 시 비용 인식, Business Queensland 정의, 영국 business rates 지역 차이.

### business/shop-site-selection
- 파일: `src/pages/articles/business/shop-site-selection.tsx`, evidence `article-evidence.ts:10778-10797`, learning `article-learning.ts:124843-125070`, 개념 `knowledge-graph.ts:28126-28142`
- 추출한 고유 사실 주장 수: 8(사실) + 계산 12, 검증 8, 미검증 0
- 연 자료:
  - https://business.gov.au/planning/new-businesses/choose-your-business-location — 200 — "Is high foot traffic (the number of people who visit the area) important?" excerpt 일치. "Check with your local government or council They can tell you about: zoning – the rules that say if you can run your type of business in the area rates you may need to pay permits or approvals" — 9절 서술 일치.
  - https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900 — 200 — "식품위생법 시행규칙 [시행 2026. 9. 1.] [총리령 제2150호, 2026. 9. 1., 일부개정] … 제36조(업종별 시설기준) 법 제36조 에 따른 업종별 시설기준은 별표 14 과 같다." excerpt 일치.
  - https://www.mss.go.kr/site/chungbuk/ex/bbs/View.do?bcIdx=1055594&cbIdx=180 — 200 — "등록일 2025.01.02" / "입지평가와 배달정보 분석 리포트를 추가해 사업장 입지 및 업종 선택에 필요한 정보를 제공" / "시간대별 인기 메뉴, 유동인구 등 소상공인의 경영전략 수립에 필요한 정보를 제공". 서술 일치.
  - (교차 확인) 법제처 생활법령 「음식점 창업 > 입지 선정」 https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=839&ccfNo=2&cciNo=1&cnpClsNo=1 — 200 (발견 참조).
- 계산(python3): 1,000×0.05=50, 50×0.4=20, 20×8,000=160,000, 20×6,000=120,000, ×30=3,600,000, 부족 4,400,000 OK / 8,000,000÷6,000=1,333.33→1,334 OK / **하루 평균 "약 44.45건"은 1,333.33÷30=44.44 또는 1,334÷30=44.47이며 어느 쪽도 44.45가 아님**(발견) / 통행 2배: 40×30×6,000=7,200,000, 부족 800,000 OK / 10건: 300×6,000=1,800,000, 부족 6,200,000 OK / 600×6,000=3,600,000 OK / 전체 전환 50×0.4÷1,000=2% OK.
- 빠진 내용: 한국 음식점 업종별 건축물 용도(제1종·제2종 근린생활시설 구분)와 용도변경 허가·신고(발견).
- OK 확인: 호주 정부 질문 원문, 시행규칙 제36조·별표 14, 소상공인365 기능 범위·날짜.

### business/shop-fitout-and-opening
- 파일: `src/pages/articles/business/shop-fitout-and-opening.tsx`, evidence `article-evidence.ts:10798-10853`, learning `article-learning.ts:125071-125318`, 개념 `knowledge-graph.ts:28150-28166`
- 추출한 고유 사실 주장 수: 14(사실) + 계산 5, 검증 14, 미검증 0
- 연 자료:
  - https://g.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7777&mi=2444 — 200 — "사업자등록 신청 절차(부가가치세법 제8조) … 사업개시 전 또는 사업을 시작한 날로부터 20일 이내에 구비서류를 갖추어 관할세무서 … 신청하여야 함" excerpt 일치. 같은 페이지 "간이과세자 : 연간 공급대가 예상액이 10,400만원 미만인 개인사업자"(본문 미언급, 발견).
  - https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide — 라이브 접속 실패(HTTP/2 INTERNAL_ERROR·timeout), Wayback 2026-05-03 스냅샷 200 — "Agree in writing (in the lease if possible) what fit-out items can stay and what must be removed, and how the premises will be 'made good' at the end of the lease." excerpt 일치. 단 CitationBlock 제목 "Shopping centre tips" 절 위치는 스냅샷에서 확인 못 함(같은 문단 다음 문장이 "If the premises is in a shopping centre…").
  - https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900 — 200 — 시행규칙 2026-09-01 시행본 제36조·별표 14 일치.
  - https://www.gov.uk/guidance/when-is-permission-required — 200 — "Paragraph: 011 … Movement from one primary use to another within the same use class is not development, and does not require planning permission." / "Paragraph: 012 … Any associated development, such as physical works, may require separate planning and or buildings regulations approval." / "Paragraph: 012a … (Amendment) (England) Regulations 2020". 서술 일치.
  - https://www.youtube.com/oembed?url=…odwii7_bJww — 200 — "Ggiata Ep. 3: The build out", author "Square".
  - https://squareup.com/us/en/the-bottom-line/videos/making-a-restaurant-with-ggiata/the-build-out — 200 — "Ggiata was compensated for their time and participation by Square." / "We started paying rent the second we took this space so every day that we're not open we're paying. You need a certain amount of gas … the amount of gas that we can get to the space based on the line right now is under that amount." / "We can go into final inspections and they can say, 'yeah you didn't get this permitted or that permitted and you have to go back and fix it.'" 서술 일치.
  - https://www.gov.uk/renting-business-property-tenant-responsibilities — 200 — "Your lease should say who is responsible for repairs and maintenance of the property." / "When you move out, you may have to pay for certain repairs, or return the property to the state it was in when you first rented it." 일치.
  - https://easylaw.go.kr/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=91&onhunqueSeq=4365 — 200 — "휴게음식점영업·제과점영업 또는 일반음식점영업으로서 영업장으로 사용하는 바닥면적의 합계가 100제곱미터(영업장이 지하층에 설치된 경우에는 … 66제곱미터) 이상인 것 √ 다만, 영업장 … 이 지상 1층 또는 지상과 직접 접하는 층에 설치되고 그 영업장의 주된 출입구가 건축물 외부의 지면과 직접 연결되는 곳에서 하는 영업을 제외" / 페이지 하단 "이 정보는 2026년 9월 15일 기준으로 작성된 것입니다."(본문은 "2026-08-15 안내", 발견).
  - https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=4&cciNo=1&cnpClsNo=1&csmSeq=839&popMenu=ov — 200 — 건강진단, "2026년 9월 15일 기준", 상단 "「식품위생법」 2026년 12월 31일 시행(개정 사항을 검토하여 향후 업데이트 예정입니다.)"
  - https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=839&ccfNo=4&cciNo=1&cnpClsNo=2 — 200 — 식품위생교육, "2026년 9월 15일 기준". 현재 페이지에는 "10월 8일" 예고 문구 없음(12월 31일 예고로 바뀜).
  - (교차 확인) 식품위생법 전문 https://www.law.go.kr/LSW/lsInfoR.do?lsiSeq=285339&efYd=20261008&ancYnChk=0 — "[시행 2026. 10. 8.] [법률 제21525호, 2026. 4. 7., 타법개정]", 부칙 "(파산선고 등에 따른 결격조항 정비를 위한 보건복지위원회 소관 12개 법률 일부개정을 위한 법률)". 제40조·제41조에는 2026년 개정 표시 없음.
  - (교차 확인) 법제처 생활법령 「음식점 창업 > 입지 선정」 ccfNo=2&cciNo=1&cnpClsNo=1, 「영업신고」 ccfNo=5&cciNo=1&cnpClsNo=1 — 200 (발견 참조).
- 계산(python3): 40,000,000+8,000,000=48,000,000 / +2,000,000=50,000,000 / +2,000,000=52,000,000 / 10,000,000+20,000,000+18,000,000=48,000,000 — 모두 OK.
- 빠진 내용: 건축물 용도(근린생활시설 구분·용도변경 허가/신고), 다중이용업소 기준 수치, 사업자등록 때의 간이·일반과세 선택(발견).
- OK 확인: 사업자등록 20일, 시행규칙 제36조, 잉글랜드 011·012·012a, Square 전사 내용·보수 공개, GOV.UK 임차인 책임.

### business/shop-daily-operations
- 파일: `src/pages/articles/business/shop-daily-operations.tsx`, evidence `article-evidence.ts:11449-11504`(감사 중 파일 줄 번호가 6줄 밀림), learning `article-learning.ts:130459-130710`, 개념 `knowledge-graph.ts:28522-28538`
- 추출한 고유 사실 주장 수: 15(사실) + 계산 8, 검증 15, 미검증 0
- 연 자료:
  - https://www.moel.go.kr/news/cardinfo/view.do?bbs_seq=20220500493 — 200 — 실제 제목 "[카드뉴스] 5인미만 사업장 적용 노동법", "등록일 2022-05-10". "1. 근로계약서 작성 - 임금, 소정근로시간, 주휴일 등이 명시된 근로계약서를 작성하고 교부해야 합니다. 2. 임금명세서 교부 - … 임금의 구성항목, 계산방법, 공제내역등을 기재해야 합니다." 내용은 일치하나 CitationBlock 제목 "소규모 사업장 7가지 노동법"은 페이지 제목과 다름(발견).
  - https://www.law.go.kr/법령/소득세법/제160조의5 — 200(iframe 껍데기) → `lsSideInfoP.do?lsiSeq=280405&joNo=0160&joBrNo=05` 200 — "소득세법 [시행 2026. 1. 1.] [법률 제21221호, 2025. 12. 23., 일부개정]" / "제160조의5(사업용계좌의 신고ㆍ사용의무 등) ① 복식부기의무자는 … 사업용계좌 … 를 사용하여야 한다" / "③ … 과세기간의 개시일 … 부터 6개월 이내에 사업용계좌를 … 신고하여야 한다". 본문 "복식부기의무자 등 적용 대상" 일치.
  - https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/ — 200 — "all losses of inventories are recognised as an expense in the period the write-down or loss occurs" excerpt 일치.
  - https://docs.stripe.com/reports/payout-reconciliation — 200 — "The payout reconciliation report is only available for users with automatic payouts enabled, or a platform on manual payouts whose Connected Accounts have automatic payouts enabled" 서술 일치.
  - https://www.fairwork.gov.au/tools-and-resources/fact-sheets/rights-and-obligations/record-keeping-pay-slips — 라이브 접속 실패(HTTP/2 INTERNAL_ERROR, WebFetch timeout), Wayback 2026-09-09 스냅샷 200 — "Employers who engage employees under relevant Commonwealth workplace laws are required to: make and keep accurate and complete records for all of their employees … issue pay slips to each employee." / "be kept for 7 years". excerpt 일치.
  - https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335625 — 200 — "개인정보 보호법 [시행 2026. 9. 11.] [법률 제21445호, 2026. 3. 10., 일부개정] … 제21조(개인정보의 파기) ① … 지체 없이 그 개인정보를 파기하여야 한다. 다만, 다른 법령에 따라 보존하여야 하는 경우에는 그러하지 아니하다. … ③ … 다른 개인정보와 분리하여서 저장ㆍ관리하여야 한다." 일치.
  - easylaw 3건(화재배상책임보험·건강진단·식품위생교육) — 위 fitout 기록과 동일 결과.
  - (교차 확인) 근로기준법 `lsSideInfoP.do?lsiSeq=285279&joNo=0054`·`joNo=0018` — "[시행 2026. 10. 8.] [법률 제21533호]" / "제54조(휴게) ① 사용자는 근로시간이 4시간인 경우에는 30분 이상 … 휴게시간을 근로시간 도중에 주어야 한다." / "제18조 ③ … 1주 동안의 소정근로시간이 15시간 미만인 근로자에 대하여는 제55조와 제60조를 적용하지 아니한다."
  - (교차 확인) 고용노동부 보도자료 https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144 — "2026년도 적용 최저임금을 … 시간급 10,320원으로 확정·고시했다. 이는 월 환산액 기준으로 2,156,880원(주 40시간, 월 209시간 기준)".
  - (교차 확인) 카드 우대수수료 https://www.korea.kr/news/policyNewsView.do?newsId=148953893 (2025-08-15) — 연매출 3억 이하 신용 0.40%·체크 0.15%, 3~5억 1.00%/0.75%, 5~10억 1.15%/0.90%, 10~30억 1.45%/1.15%(WebFetch 요약표); https://www.korea.kr/news/policyNewsView.do?newsId=148939594 (2025-02-13) — "우대수수료율을 매출액 구간별로 0.05∼0.10%p 인하한다", 2025-02-14 적용.
- 계산(python3): 20×8,000=160,000 / ×2%=3,200 / 156,800 / 20×2,000=40,000 / 160,000−3,200−40,000−2,000=114,800 / 10+15−20−1=4 — 모두 OK.
- 빠진 내용: 4시간 근로의 법정 휴게(30분)·주휴 적용 경계(15시간)·2026 최저임금 / 카드 우대수수료(발견).
- OK 확인: 사업용계좌 대상, 개인정보 제21조, IAS 2 손실 인식, Stripe 보고서 범위, Fair Work 기록 의무, 다중이용업 화재배상책임보험 대상 조건.

### business/supply-chain-bargaining
- 파일: `src/pages/articles/business/supply-chain-bargaining.tsx`, evidence `article-evidence.ts:11080-11105`, learning `article-learning.ts:126674-126911`, 개념 `knowledge-graph.ts:28294-28310`
- 추출한 고유 사실 주장 수: 7(사실) + 계산 6, 검증 7, 미검증 0
- 연 자료:
  - https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html — 기본 curl·WebFetch는 403, HTTP/1.1과 브라우저 헤더로 200 — "Trade in Value-Added (TiVA) indicators provide insights into: Domestic and foreign value added content of gross exports by exporting industry" excerpt 일치. "TiVA indicators are derived from OECD Inter-Country Input-Output (ICIO) tables", "Domestic value added content of imports"(재수입된 자국 가치) 확인.
  - https://www.worldbank.org/en/publication/wdr2020 — 200 — "Public policies and economic conditions in one country strongly affect trade partners through production linkages." excerpt 일치.
  - https://www.worldbank.org/ext/en/topic/trade/global-value-chains — 200 — "Context" 절 "Global Value Chains are a powerful driver of productivity growth…", "Strategy" 절 "The World Bank Group helps client countries design and implement effective, solutions-oriented reforms to improve their ability to participate in global production." 존재 확인.
  - https://www.cbp.gov/trade/basic-import-export/importer-exporter-tips — 200 — "Remember, even when using a broker, you, the importer of record, are ultimately responsible for the correctness of the entry documentation presented to CBP and all applicable duties, taxes and fees." 서술 일치.
  - (교차 확인) https://www.wto.org/english/docs_e/legal_e/20-val_01_e.htm — 200 — Art. 8.2(발견 #12).
- 계산(python3): 40+20=60, 60+10+30=100 / 20÷60=33.3% / 20÷100=20% / 60×10%=6 / 60+10+6+24=100 / 100+6=106 — 모두 OK.
- 빠진 내용: 과세가격에 운임을 넣는지 여부(발견 #12).
- OK 확인: TiVA 지표 원문, WDR 2020 문장, CBP의 importer of record 책임, 부가가치 정의(중간투입 차감).


### institutions/culture-norms-and-coordination
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료:
  - https://www.unesco.org/en/legal-affairs/unesco-universal-declaration-cultural-diversity — 200 — 제1조 "Culture takes diverse forms across time and space."(excerpt 원문 일치) / 제4조 "No one may invoke cultural diversity to infringe upon human rights guaranteed by international law, nor to limit their scope."(excerpt는 앞부분 원문 일치) / 채택일 "2 November 2001 Paris, France" 일치.
  - https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/ — 200 — "I tried to move up a level and ask what were the generalities across the long-lasting robust systems, I called them design principles, not from the perspective that they were what you should do … but how you would actually apply that would differ from system to system." → CitationBlock 요약 일치.
- 계산: 10×2=20, 20−16=4, 8×2=16, 7×2=14(−2), 9×2=18−16=2 전부 OK. article-learning 연습문제 체크리스트("처음 4만원보다 2만원감소") OK.
- 인용 단어 수: "합계 21단어"(tsx:91, article-evidence.ts:11500 note) — 실제 8+11=19단어(발견 #8).
- 빠진 내용: 본문의 "분담·관찰·이의 절차"(tsx:55-57)는 Ostrom이 인터뷰에서 말한 "design principles"와 같은 층위의 장치인데, 이를 이름으로 연결하지 않음(발견 #12, 낮은 심각도). 원리 목록과의 구체 대응은 Ostrom 1990 원전으로 따로 확인해야 하며 이번 감사에서는 원전을 열지 않음.
- OK: UNESCO 제1조·제4조 내용, 2001-11-02 채택, Ostrom 인터뷰 요지.

### institutions/education-skills-and-signals
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료:
  - https://www.oecd.org/en/publications/education-at-a-glance-2026_b4968bbc-en/full-report/key-system-level-indicators-of-education-finance_d143f855.html — curl·WebFetch 403, Chrome 브라우저로 열람 200 — 제목 "Chapter C1. Key system-level indicators of education finance", 발행 "29 September 2026"(Crossref 10.1787/b4968bbc-en issued 2026-09-29와 일치). "Distribution of expenditure by source of funds" 절: "This section presents expenditure by source of funds before government transfers to the private sector. This means that funding is attributed to the source that initially provides it … For example, if a household pays tuition fees using a government scholarship or a student loan intended for tuition, this amount is counted as government funding before transfers, rather than as private funding." → excerpt가 원문과 일치하고, 5절의 장학금 400/가계 600 사례가 원문 정의에 그대로 대응한다. "Data refer to the financial year 2023" → CitationBlock의 "2023 관측자료" OK. 지표 번호 C1 OK.
  - https://www.gov.uk/repaying-your-student-loan/how-you-repay — 200 — "You start repaying when your income is more than the minimum amount ." excerpt 원문 일치.
  - https://api.crossref.org/works/10.2307/1882010 — Spence, "Job Market Signaling", The Quarterly Journal of Economics 87(3):355–374, 1973-08 (신호 개념 원전 확인용).
- 계산: 1,000/200=5년, (1,000+2,000)/200=15년, 400+600=1,000 OK.
- 빠진 내용: 신호 효과 정의(knowledge-graph "자격의 신호 효과")가 "능력 자체를 바꾸지 않아도 정보를 제공"까지만 말하고, 신호가 정보를 전하려면 자격 취득 비용이 능력에 따라 달라야 한다는 분리 조건(Spence 1973)이 빠짐. 이 조건 없이 "자격이 능력 정보를 전한다"는 4절 비교 설계(자격 표시만 다른 상황)의 해석 근거가 약함.
- OK: UK 상환 소득 연계 문구, 기회비용·회수기간 계산.

### institutions/evidence-measurement-and-causality
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-d1-terminology — 200 — "D.1.1.2 repeatability (of results of measurements) [VIM 3.6] closeness of the agreement between the results of successive measurements of the same measurand carried out under the same conditions of measurement. … Repeatability conditions include: - the same measurement procedure - the same observer - the same measuring instrument, used under the same conditions - the same location - repetition over a short period of time." → excerpt "the same measuring instrument, used under the same conditions" 원문 일치, 본문 tsx:89의 다섯 조건 나열 일치.
  - https://database.ich.org/sites/default/files/E9_Guideline.pdf — 200 (PDF) — "2.3.2 Randomisation Randomisation introduces a deliberate element of chance into the assignment of treatments to subjects in a clinical trial." excerpt 일치, 절 번호 일치.
  - https://database.ich.org/sites/default/files/E8-R1_Guideline_Step4_2022_0204%20%281%29.pdf — 200 (PDF) — §5.3은 "Choice of Control Group", §6은 "CONDUCT, SAFETY MONITORING, AND REPORTING". 배정 이후 탈락에 관한 문장은 §5.5 "Methods to Reduce Bias"에 있음: "Randomisation at the start of the study addresses differences between the groups at the time of randomisation but does not prevent bias due to differences arising during the study. Events after randomisation … may affect the validity and interpretation of comparisons between treatment groups." 결측 민감도 분석은 §5.6. (발견 표 참조)
- 계산: A 8−10=−2, B 9−10=−1, −2−(−1)=−1; A 감소율 2/10=20%; (8.0+8.1+7.9)/3=8.0; 1−0.5=0.5 전부 OK.
- 빠진 내용: 본문 1·4절이 계산하는 것은 표준 용어로 이중차분(difference-in-differences)이고, 4절의 "A도 개입 없이 B와 같은 추세를 따랐을 것" 가정은 평행 추세(parallel trends) 가정인데, 두 용어가 본문·terms·knowledge-graph 어디에도 없음. 독자가 문헌(Card–Krueger 1994 등)·교과서에서 같은 설계를 찾을 이름이 빠짐.
- OK: NIST 반복성 정의·조건, E9 무작위 배정 문구, 무작위 배정≠무작위 표본추출 구분, 표시 분해능≠불확실성.

### institutions/healthcare-payment-systems
- 추출한 고유 사실 주장 수: 10, 검증 10, 미검증 0
- 연 자료:
  - https://www.who.int/activities/pooling/pooling — 200 — "Pooling is a core function of health financing policy. The purpose of pooling is to spread financial risk across the population so that no individual carries the full burden of paying for health care." excerpt 원문 일치. 세 기능: "Pooling is the accumulation and management of prepaid financial resources and, together with the two other health financing functions – revenue raising…"(페이지 내 연관 문서 요약) — 3절 "재원 조달·위험 풀·구매" OK.
  - https://www.cms.gov/medicare/payment/fee-schedules — 200 — "A fee schedule is a complete listing of fees used by Medicare to pay doctors or other providers/suppliers. This comprehensive listing of fee maximums is used to reimburse a physician and/or other providers on a fee-for-service basis." excerpt 원문 일치.
  - https://www.nhis.or.kr/static/html/wbma/c/wbmac0103.html — 200 — "요양급여를 받은 자는 건강보험법 제44조에 따라 그 비용의 일부만을 본인이 부담한다." / "① 입원진료 : 요양급여비용 총액의 20%" / "② 외래진료 : 요양기관 종별 및 소재지에 따라 차이" / 상급종합병원 외래 "진찰료 총액 + (요양급여비용 총액 - 진찰료총액) × 60/100". 본문 "사례의 20%를 실제 진료에 일괄 적용할 수 없고" OK(입원 20%와 우연히 같으나 외래는 종별·소재지별로 다름).
  - https://www.england.nhs.uk/pay-syst/nhs-payment-scheme/ — curl·WebFetch 202 빈 응답, Chrome 브라우저로 열람 200 — "The NHS Payment Scheme is a set of rules, prices and guidance that determine how providers of NHS-funded healthcare are paid for the services they provide. … It does not dictate the total amount of funding available." / "The Payment Scheme mainly applies to secondary care services … It does not cover primary care (GPs, dentists and pharmacies) or public health services like vaccinations." / "The 2026/27 NHS Payment Scheme came into effect on 1 April 2026." → 6절과 CitationBlock의 "총 NHS 재원을 정하지 않음", 2026/27 기준 OK. 참고: 2026/27 NHSPS의 네 지급 방식 가운데 API는 "fixed and variable elements"를 섞은 혼합 지급으로, 4절의 건별/묶음 이분법 밖에 있는 실제 예다.
  - https://www.hira.or.kr/dummy.do?pgmid=HIRAA020028000000 (교차 확인) — 200 — "건강보험 행위별수가제(fee-for-service)는 … 서비스 별로 가격(수가)을 정하여 사용량과 가격에 의해 진료비를 지불하는 제도로 우리나라는 의료보험 도입 당시부터 채택하고 있습니다. 또한, 행위별수가제의 보완 및 의료자원의 효율적 활용을 위하여 「질병군별 포괄수가제(DRG)」와 「정액수가제(요양병원, 보건기관 등)」도 병행하여 실시하고 있습니다." / "2013년 7월부터 전국 모든 의료기관(의원, 병원, 종합병원 …)" 7개 질병군 포괄수가제.
- 계산: 2+8=10, 10−7=3, 2회 20·4·16 OK. 환자 몫 2/10=20% OK.
- 빠진 내용: 4절이 건별 지급 vs 묶음 지급을 정의하고 6절이 한국을 비교 대상으로 놓는데, 한국 절에는 "급여 항목·비용 부담 안내"만 있고 한국이 행위별수가제를 근간으로 하면서 7개 질병군 포괄수가제(2013-07 전 의료기관)·요양병원 정액수가를 병행한다는 사실이 없음. 또 1절의 "지급자가 자격·보장·가격을 확인"이 한국에서는 심사(건강보험심사평가원)와 지급(국민건강보험공단)으로 나뉜다는 점도 없음.
- OK: WHO pooling 목적 문구, CMS fee schedule 문구·Original Medicare 범위, 한국 본인부담 구조.

### institutions/how-to-read-a-country
- 추출한 고유 사실 주장 수: 12, 검증 12, 미검증 0 (탐색기 수치 856개 셀 별도 전수 대조)
- 연 자료:
  - https://databank.worldbank.org/home — 200 — "World Development Indicators (WDI) is the primary World Bank collection of development indicators, compiled from officially recognized international sources." excerpt 원문 일치.
  - https://unstats.un.org/unsd/methodology/m49/ — 200 — "The assignment of countries or areas to specific groupings is for statistical convenience and does not imply any assumption regarding political or other affiliation…" excerpt 일치(단, 원문 맥락은 지역 묶음 배정이며 412·158 코드 설명 문장은 아님). 같은 페이지 Q&A: "Kosovo is currently considered part of Serbia (numerical code 688). However, for strictly statistical purposes, the numerical code 412 can be used to represent this area." / "Taiwan Province of China is considered part of China (numerical code 156). However, for strictly statistical purposes, the numerical code 158 can be used to represent this area." → 본문 412·158 OK.
  - https://unstats.un.org/unsd/methodology/m49/overview/ — 200 — 영문 다운로드 표(downloadTableEN)의 M49 국가·지역 코드 행을 파싱: 248개(중복 없음) → "기본 목록 248개" OK. (https://unstats.un.org/unsd/methodology/m49/faq/ 는 404, Q&A는 루트 페이지에 있음)
  - https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures — 200 — API 호출 구조 문서(내용 일반, 인용 없음).
  - https://api.worldbank.org/v2/country?format=json&per_page=400 — 200 — total 296, region≠Aggregates 217개 → "집계 지역을 뺀 217개 경제" OK. 탐색기가 매핑하지 않은 WB 경제는 "JG Channel Islands" 1개뿐 → 본문 설명과 일치.
  - https://api.worldbank.org/v2/country/all/indicator/{SP.POP.TOTL, NY.GDP.PCAP.CD, SP.POP.65UP.TO.ZS, EG.ELC.ACCS.ZS}?format=json&per_page=20000&date=2020:2025 — 4건 200, "lastupdated: 2026-10-08". 탐색기 스냅샷(`src/content/data/country-explorer.json`, checkedAt 2026-10-04, updated 2026-07-13)의 국가별 최근 비결측 값 856개를 오늘 API와 대조: 값·연도 모두 일치 856, 불일치 0, 새로 생긴 값 0, 사라진 값 0. 예: KOR 인구 51,684,564(2025)·1인당 GDP 36,226.97 USD(2025)·65세+ 20.33%(2025)·전력 100%(2024); USA 341,784,857·90,026.52·18.39%·100%.
- 계산: 100−60=40, 30×1.2=36(+6), 248+2=250 OK.
- 빠진 내용: 없음(일곱 장부는 글 고유 분석틀이라고 명시함).
- 참고: 스냅샷 메타 `updated: 2026-07-13`은 WDI 갱신일(현재 2026-10-08)과 다르나 값 변동은 없음.

### institutions/insurance-risk-pooling
- 추출한 고유 사실 주장 수: 8, 검증 6, 미검증 2
- 연 자료:
  - https://content.naic.org/consumer/how-does-insurance-work — curl 403, WebFetch 200 — "Insurance starts with a contract called a policy." excerpt 원문 일치. "When you need to use your insurance, you'll usually have to pay another fee called a deductible." / "Some policies will also share what is not covered".
  - https://www.floodsmart.gov/get-insured/eligibility — 403(curl·WebFetch), Chrome 브라우저도 Cloudflare 차단("Sorry, you have been blocked"). 웹 검색에서 FEMA/NFIP 공식 자료 제목 "fema nfip most homeowners insurance does not cover flood damage postcard 08 2025"(agents.floodsmart.gov PDF, 다운로드는 403/429) 확인 → 문구 자체는 FEMA 자료에 있으나 인용 URL 페이지에 그 문장이 있는지는 UNVERIFIED.
  - Crossref https://api.crossref.org/works/10.2307/1879431 — Akerlof, "The Market for \"Lemons\": Quality Uncertainty and the Market Mechanism", QJE 84(3):488–, 1970-08. https://api.crossref.org/works/10.2307/1885326 — Rothschild & Stiglitz, "Equilibrium in Competitive Insurance Markets: An Essay on the Economics of Imperfect Information", QJE 90(4):629–, 1976-11. (빠진 내용 판단용)
- 계산: 1,000×10만=1억, 20×300만=6천만, 차 4천만; 300−20=280→min(280,230)=230, 잔여 70; 20×230=4,600만, 6,000−4,600=1,400만; 500×300만=15억 전부 OK.
- 빠진 내용: 2절이 "위험이 큰 사람만 모이면 사고가 많아진다"(역선택)와 "보장이 있다는 이유로 예방을 줄인다"(도덕적 해이)를 설명하면서 3절 "이름" 단계·terms·knowledge-graph에 두 표준 용어가 없음. 3절은 위험 풀·면책·한도만 이름 붙임. 독자가 Akerlof(1970)·Rothschild–Stiglitz(1976) 문헌과 연결할 고리가 빠짐. 7절의 "독립적인 작은 사고를 모을 때의 효과"도 대수의 법칙이라는 이름 없이 서술.
- OK: NAIC 계약 문구, 계산 전부.

### institutions/media-attention-and-public-belief
- 추출한 고유 사실 주장 수: 6, 검증 6, 미검증 0
- 연 자료:
  - https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng — 202 빈 응답(curl·WebFetch, EUR-Lex 봇 차단). 대체: https://publications.europa.eu/resource/celex/32022R2065.ENG.xhtml — 200 — "Article 27 Recommender system transparency 1. Providers of online platforms that use recommender systems shall set out in their terms and conditions, in plain and intelligible language, the main parameters used in their recommender systems, as well as any options for the recipients of the service to modify or influence those main parameters." excerpt 원문 일치, 본문 tsx:73 요지 일치. "적용 대상과 법의 예외"도 실재(같은 절 소기업 예외 조항 존재).
  - https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements — curl 404(봇 응답), WebFetch 200 — 제목 "Federal Trade Commission Announces Updated Advertising Guides to Combat Deceptive Reviews and Endorsements", 2023-06-29, "adding a definition of 'clear and conspicuous' and saying that a platform's built-in disclosure tool might not be an adequate disclosure". excerpt 원문 일치.
- 계산: 20÷1,000=2%, 2÷20=10% OK.
- 빠진 내용: 5절이 DSA를 "추천 기준 공개"로만 소개하는데, 같은 법 제38조(초대형 플랫폼 VLOP·VLOSE는 프로파일링에 기반하지 않은 추천 옵션을 최소 1개 제공)는 언급 없음 — "100개 중 10개를 고르는 기준"을 이용자가 바꿀 수 있는지와 직결되는 조항(낮은 심각도). 한국 쪽은 "현지 규정 확인"으로만 처리.
- OK: DSA 27(1) 문구, FTC 2023 개정 보도자료 문구, CTR·전환율 계산.

### institutions/population-migration-and-care
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - https://population.un.org/wpp/assets/Files/WPP2024_Methodology.pdf — 200 (PDF) — 용어집 "accounting for the three components of population change (fertility, mortality, and migration)" → excerpt 원문 일치. "advancing the population through successive single-year intervals of time using the cohort-component method for projecting population (CCMPP)" / "the core approach underlying the population estimates and projections in the 2024 revision is the cohort-component method for projecting population (CCMPP)". 목차 "G. POPULATION PROJECTION METHOD"(II.G) 실재, "F. THIRTEEN PROJECTION SCENARIOS".
  - https://www.ilo.org/topics-and-sectors/care-economy — 200 — "The care economy encompasses care work — paid and unpaid, direct and indirect — delivered through the public and private sectors, including MSMEs, non-profit organizations, the social and solidarity economy, and households. It includes care providers and recipients, as well as the employers and institutions offering care services." excerpt·CitationBlock 요약 일치.
  - https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationprojections/methodologies/methodologyusedtoproducethenationalpopulationprojections — 200 — "The numbers of births, deaths and migrants are calculated using assumptions of future levels of fertility, mortality and migration…" / "The NPPs are made for successive years using a standard demographic cohort component method." 단 페이지 표기 "Last revised: 4 February 2016"(오래된 방법론 문서 — 인용 요지와는 일치).
- 계산: 100+2−1+3−2=102, (20+20)/60×100=66.67, 60−45=15, 2×2만−2×1.5만=1만 OK.
- 빠진 내용: (1) 5절이 설명하는 방법의 표준 이름 "코호트 요인법(cohort-component method, CCMPP)"이 본문·terms에 없음 — 원문이 핵심 용어로 반복하는 이름. (2) WPP는 이동을 전입·전출 각각이 아니라 순국제이동(net international migration)으로 추정·전망함(목차 "E. ESTIMATING NET INTERNATIONAL MIGRATION") — 5절 "전입 3명과 전출 2명은 각자의 나이 위치에 반영"은 마을 가정 설명으로는 맞지만 UN 방법을 그대로 옮긴 것처럼 읽힘. (3) "연령 부양비"는 글 고유 명칭임을 밝혔으나 UN 표준 지표명 "총부양비(total dependency ratio)"가 없음.
- OK: WPP 세 구성요소·연 단위 전진·시나리오, ILO 돌봄 범위, ONS 가정 기반 전망.

### institutions/public-budget-and-taxes
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료:
  - https://www.imf.org/external/pubs/ft/gfs/manual/aboutgfs.htm — curl 403, WebFetch 200 — "The difference between revenue and expense is the net operating balance. Subtracting the net acquisition of nonfinancial assets from the net operating balance yields net lending/ borrowing, which in turn is equal to the net acquisition of financial assets less the net incurrence of liabilities (that is, government's financing)." excerpt 원문 일치. "Revenue: Transactions that increase net worth." → 3절 "세금처럼 정부의 순자산을 늘리는 수입" OK.
  - https://data.imf.org/en/Datasets/QGFS — curl 403, WebFetch 200 — "The GFS includes government revenues and expenditures, government net lending/net borrowing (the surplus/deficit), financing transactions, and balance sheet data on government assets and liabilities." excerpt 일치.
  - https://www.cbo.gov/about/overview — curl·WebFetch 403, Chrome 브라우저로 열람 200 — "CBO was established by the Congressional Budget Act of 1974 (the Budget Act) to provide objective, nonpartisan information to support the Congressional budget process and to help Congress make effective budget and economic policy." / "The agency does not make policy recommendations." → 본문 "의회의 예산 판단을 지원하는 분석 기관" OK.
  - https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1104 (교차 확인, 지표누리 통합·관리재정수지) — 200 — "관리재정수지 - 재정건전성 여부를 명확히 판단하기 위해 통합재정수지에서 사회보장성기금 수지를 제외한 수치 … * 사회보장성기금 : 국민연금, 사학연금, 고용보험, 산재보험".
- 계산: 80+20=100=40+30+20+10; 40+30+10=80, 80−80=0; 0−20=−20; 200+20=220; 세금 전가 1=0.6+0.4 OK.
- 빠진 내용: 6절이 "중앙정부만 볼지 사회보험까지 볼지"를 비교 함정으로 드는데, 한국 독자가 가장 먼저 마주치는 한국 재정수지 이원 체계(통합재정수지 vs 사회보장성기금 수지를 뺀 관리재정수지)를 언급하지 않음. 같은 "사회보험 포함 여부" 문제가 한국 공식 지표에서 어떻게 갈리는지가 빠져 있음(낮은~중간).
- OK: GFS 순운영수지·순융자/순차입 정의, 이자=비용 처리, 현금/발생 구분, QGFS 범위, CBO 역할.


### infrastructure/climate-risk-and-exposure
- 추출한 고유 사실 주장: 7개(IPCC 그림 1.4 내용, 인용 원문, 위해·노출·취약성 정의 3개, UNDRR 노출 정의 인용, UNDRR 노출 범위). 7개 모두 검증했고 미검증은 0개다.
- 연 자료:
  - https://www.ipcc.ch/report/ar6/wg2/downloads/report/IPCC_AR6_WGII_Chapter01.pdf — 200. "Figure 1.4 | Increasingly complex climate-related risks. Risk results from interactions among the determinants of risk—hazard, vulnerability, and exposure, shaped by responses—which can interact in complex ways." excerpt는 원문 그대로이나 "shaped by responses" 앞에서 잘렸다(발견 #3).
  - https://www.ipcc.ch/report/ar6/wg2/downloads/report/IPCC_AR6_WGII_Annex-II.pdf — 200. Hazard·Exposure·Vulnerability·Risk 정의를 확인했다(발견 #2).
  - https://www.undrr.org/terminology/exposure — 403. 아카이브 https://web.archive.org/web/20260905232353/https://www.undrr.org/terminology/exposure 에서 확인: "Definition: Exposure The situation of people, infrastructure, housing, production capacities and other tangible human assets located in hazard-prone areas." excerpt와 정확히 일치한다.
- 계산: 100×0.10=10, 300×0.20=60, 60/10=6배, 자산 절반 150×0.20=30, 손상률 절반 300×0.10=30, 보험 40이면 잔여 60−40=20. 모두 맞다. `article-learning.ts`의 exercise(150×20%=30, 300×10%=30)도 맞다.
- 빠진 내용: AR6가 강조하는 대응(responses)(발견 #3). 취약성의 대응·적응 능력 요소(발견 #7).
- OK로 확인한 주요 주장: 그림 1.4가 세 결정 요인의 상호작용을 제시한다(IPCC Ch.1). UNDRR 노출에 사람·주택·기반 시설이 포함된다(UNDRR). "100×10%는 IPCC의 보편 피해 함수가 아니다"라는 경계 서술은 IPCC 원문과 모순되지 않는다.
- 내부 일관성: `article-learning.ts`의 개념 설명 배치 오류(발견 #1). KG 정의의 "자연 현상의 위험" 표현(발견 #2).

### infrastructure/electricity-grid-and-power
- 추출한 고유 사실 주장: 8개(MW/MWh 정의, 100MW×1h=100MWh, IEA 망 병목 인용과 해석, FERC 시장 구분 서술과 인용, 계통운영자·망 소유 분리는 지역마다 다르다는 서술, 저장 출력과 용량의 구분). 8개 모두 검증했다.
- 연 자료:
  - https://www.iea.org/reports/electricity-2026/grids — 403. 아카이브 https://web.archive.org/web/20260919203425/https://www.iea.org/reports/electricity-2026/grids 에서 확인. 소제목이 "Grids are emerging as a bottleneck for connecting supply, demand and storage"로 excerpt와 일치한다. 본문: "Grid connection queues have reached record levels worldwide." / "Over 2 500 GW of renewable, large‑load and storage projects are currently stalled in grid queues worldwide." / "annual grid investment to increase by approximately 50% by 2030 from today's USD 400 billion". 5절의 "생산 설비만 늘려서는 연결 대기를 해결할 수 없다"는 해석과 맞다.
  - https://www.ferc.gov/electric-power-markets — 403. 아카이브 https://web.archive.org/web/20261001000640/https://www.ferc.gov/electric-power-markets 에서 확인: "Traditional wholesale electricity markets exist primarily in the Southeast, Southwest and Northwest where utilities are responsible for system operations and management… Utilities in these markets are frequently vertically integrated – they own the generation, transmission and distribution systems used to serve electricity consumers." excerpt와 일치하고, 6절의 구분 서술도 맞다.
  - https://www.eia.gov/energyexplained/electricity/electricity-in-the-us-generation-capacity-and-sales.php — 200. "One kW of electricity generated or used for one hour is a kilowatthour (kWh)… Megawatt (MW)=1,000 kW; megawatthour (MWh)=1,000 kWh". 3절 단위 서술과 맞다.
- 계산: min(100,80)=80, 부족분 100−80=20. 80×5만=400만, 20×10만=200만, 합계 600만. 제약이 없을 때 100×5만=500만, 차이 100만. 5MW×1h=5MWh<20MWh. 모두 맞다. learning exercise도 같다.
- 빠진 내용: 결함 수준의 누락은 없다. 한국 제도(전력거래소·한전) 비교는 넣지 않았고, 사실 주장이 아니므로 UNVERIFIED로만 남겼다(발견 #13).
- OK로 확인한 주요 주장: 그리드 병목(IEA), 미국 내 수직통합 지역과 RTO 지역의 구분(FERC), MW와 MWh의 구분(EIA).

### infrastructure/food-chain-and-prices
- 추출한 고유 사실 주장: 7개(FAO 네 기능, FAO 인용, ERS Food Dollar 정의, farm share는 순이익률이 아니라는 서술, marketing bill 인용, "2026년 개편 자료와 예전 자료가 직접 비교되지 않는다", 미국 국내 생산 식품 범위). 7개 모두 검증했다.
- 연 자료:
  - https://www.fao.org/sustainable-food-value-chains/what-is-it/en/ — 200. "Figure 3 – The Sustainable Food Value Chain framework" 다음 문단에 "These actors carry out four functions: production (…), aggregation, processing, and distribution (wholesale and retail)."가 있어 excerpt와 일치한다. 사례와의 대응 오류는 발견 #4.
  - https://www.ers.usda.gov/data-products/food-dollar — 200. "The marketing bill divides food dollars into the farm share, the amount contributed by the total sales proceeds of farm commodities linked to food, and the marketing share…" excerpt와 일치한다. "On March 10, 2026, the Food Dollar model and underlying data system were updated…" / "The Archived Data are not directly comparable to the current data." 6절의 2026년 개편·비교 불가 서술과 맞다. 페이지 상단 "Updated: 5/11/2026", 다음 갱신 예정일 "November 17, 2026"(확인일 기준 아직 오지 않음).
  - https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/1231-global-food-losses/en — 200. 누락 보강 근거(발견 #8).
- 계산: 100+30+20+50=200, 100/200=50%, 100+30+20=150. 1,000+300+200=1,500, 1,500/10=150, 1,500/8=187.5, 1,500+500=2,000, 2,000/8=250. 모두 맞다.
- 빠진 내용: 손실(loss)과 폐기(waste)의 국제 집계 경계(발견 #8).
- OK로 확인한 주요 주장: ERS farm share는 농가 판매액 비중이며 순이익률이 아니다(ERS 정의상 "total sales proceeds"). Food Dollar는 미국 국내 생산 식품 지출이다("all U.S. spending on domestically produced food").

### infrastructure/housing-land-and-supply
- 추출한 고유 사실 주장: 5개(RICS 잔여법이 개발 비용에 이익을 포함한다는 서술, 인용 "including profit", 6.1.1·p.24 위치, HDB 99년 권리, 2023년 설명). 5개 모두 검증했다.
- 연 자료:
  - https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/valuation-of-development-property---first-edition.pdf — 200. 인쇄 쪽 24(PDF 29쪽) 6.1.1: "…minus the cost of undertaking that development, including a profit for the developer. Put simply: gross development value (GDV) - total development costs (including profit) = residual land value". excerpt와 쪽수가 맞다.
  - https://www.rics.org/profession-standards/rics-standards-and-guidance/sector-standards/valuation-standards/valuation-of-development-property — 200. 현행 지위는 "Professional Standard"이고, 다른 PDF로 연결된다(발견 #11).
  - https://www.rics.org/content/dam/ricsglobal/documents/to-be-sorted/Valuation%20of%20development%20property_ready%20for%20approvals.pdf — 200. 표지 "RICS PROFESSIONAL STANDARD … 1st edition, October 2019". 같은 6.1.1 문구다.
  - https://www.gov.sg/explainers/do-hdb-flat-buyers-own-their-flat/ — 200. "23 March 2023" / "HDB flat buyers who purchase a typical new 99-year lease flat own the rights to their flats for 99 years." / "This article is accurate as of March 2023." excerpt와 날짜 서술이 맞다.
  - https://www.hdb.gov.sg/…/standard-plus-and-prime-flats — 403(발견 #9는 보조 출처로만 확인).
- 계산: 10−(5+1+1)=3. 지연 비용 +0.5이면 3−0.5=2.5. 토지를 이미 3억에 샀다면 이익 1−0.5=0.5. 판매가 9억이면 9−7=2. 판매가 10% 하락이 잔여가치 33% 하락으로 이어진다(본문의 "큰 비율"과 맞다). 모두 맞다.
- 빠진 내용: Plus·Prime 처분 제약(발견 #9).
- OK로 확인한 주요 주장: 정상 이익을 비용에 넣어 한 번만 뺀다(RICS 6.1.1). HDB 99년 권리(gov.sg).

### infrastructure/materials-waste-and-circularity
- 추출한 고유 사실 주장: 7개(OECD Figure 6.4의 실선=물질·점선=돈 구분, 인용문, OECD 2024 EPR 정의와 인용, EPR 용어, UNEP GRO 2024의 2060년 +60%(2020년 대비), 순환경제 정의). 7개 모두 검증했다.
- 연 자료:
  - https://www.oecd.org/en/publications/global-plastics-outlook_de747aef-en/full-report/component-11.html — 403. 아카이브 https://web.archive.org/web/20250915133744/https://www.oecd.org/en/publications/global-plastics-outlook_de747aef-en/full-report/component-11.html 에서 확인: "Figure 6.4. Extended producer responsibility … Note: The block arrows represent physical flows of products, packaging or waste. The dotted lines represent financial flows." excerpt와 일치한다. Box 6.4 "Extended Producer Responsibility has proven its worth, but challenges remain"도 있다. Crossref 10.1787/de747aef-en: "Global Plastics Outlook", 2022-02-22.
  - https://www.oecd.org/en/publications/extended-producer-responsibility_67587b0b-en.html — 403이고 아카이브 스냅샷도 없다. https://ideas.repec.org/p/oec/envaac/41-en.html 초록: "…along the entire lifecycle, including at the post-consumer stage." excerpt와 일치한다. Crossref 10.1787/67587b0b-en: "Extended Producer Responsibility", OECD Environment Policy Papers, 2024-04-17. 인용 연도 2024가 맞다.
  - https://www.unep.org/resources/Global-Resource-Outlook-2024 — 403. 아카이브 https://web.archive.org/web/20261006020119/https://www.unep.org/resources/Global-Resource-Outlook-2024 에서 확인: "without urgent and concerted action, by 2060 resource extraction could rise by 60% from 2020 levels". 본문 10절의 조건부 서술과 맞다. 표기 "Global Resources Outlook2024"는 띄어쓰기만 빠졌다.
- 계산: 80×0.75=60, 처리 잔여 80−60=20, 미회수 합계 20+20=40, 100=20+20+60. 비용 4+6+2=12만, 판매 60×1,000=6만, 부족 6만. 단가 800원이면 4.8만, 부족 7.2만. 발생량 80일 때 80×0.8×0.75=48. 수요 100이면 100−60=40, 120이면 120−60=60. 모두 맞다. ReviewPrompts의 "답: 7절/9절/10절"은 이 글의 번호 없는 10개 절 순서와 맞는다(mechanism=7, comparison=9, limits=10).
- 빠진 내용: 결함 수준의 누락은 없다. 재활용 실적의 법적 인정 시점은 7절에서 이미 경고하고 있다.
- 형식 메모(사실 결함 아님): `:39,81,82,83,92,105,119`에 "있습니다.80kg", "60kg을kg당", "있습니다.6만원"처럼 문장 사이·숫자 앞 띄어쓰기가 빠진 곳이 있다.
- OK로 확인한 주요 주장: Figure 6.4의 화살표 구분(OECD 2022). EPR의 post-consumer 단계 정의(OECD 2024). 2060년 +60%(UNEP GRO 2024).

### infrastructure/transport-access-and-land-value
- 추출한 고유 사실 주장: 5개(World Bank LUTP가 도시별 접근성 필요를 평가하게 한다는 서술, 인용, MHCLG 4.39 중복 금지, 인용, 2026-10-04 확인 기준). 5개 모두 검증했다.
- 연 자료:
  - https://academy.worldbank.org/en/infrastructure/transport/leaders-in-urban-transport-planning — 200. "LUTP is a program that helps professionals assess the accessibility needs and challenges facing their own cities, balance different perspectives, and develop a solution that is the "best fit" to local circumstances." excerpt와 일치한다. 같은 페이지: "Since its inception in 2011, the LUTP program has trained more than 2600 practitioners from 105 countries through 81 different workshops."
  - https://www.gov.uk/government/publications/the-mhclg-appraisal-guide/the-mhclg-appraisal-guide — 200. "4.39 When carrying out an appraisal it is essential that there is no double counting of impacts. This could be an issue where local land value data is used. Land value data captures the full net private benefit of a change in land value." 절 번호와 excerpt가 맞다. "Updated 18 February 2026 Applies to England"(발견 #6).
  - https://assets.publishing.service.gov.uk/media/6899eafbe7be62b4f0643223/tag-unit-a2-2-induced-investment-unit-may-25.pdf — 200. 누락 보강 근거(발견 #5).
- 계산: 60−35=25, 25×20=500(편도), ×2=1,000분=16시간 40분. 35+10+10=55. 2+10=12만. 모두 맞다.
- 빠진 내용: 교통 사업 전용 영국 지침(TAG A2.2)(발견 #5).
- OK로 확인한 주요 주장: 중복 계산 금지 원칙(MHCLG 4.39). LUTP의 접근성 평가 강조(World Bank).

### infrastructure/water-utility-and-tariffs
- 추출한 고유 사실 주장: 5개(World Bank의 요금 수입과 전체 비용의 간격 개념, 인용, PUB 세 구성요소, 각 구성요소의 목적, 인용). 5개 모두 검증했다.
- 연 자료:
  - https://documents1.worldbank.org/curated/en/568291635871410812/pdf/Troubled-Tariffs-Revisiting-Water-Pricing-for-Affordable-and-Sustainable-Water-Services.pdf — 200. Andrés, Saltiel, Misra, Joseph, Lombana Cordoba, Thibert, Fenwick, © 2021. PDF 29쪽 소제목 "How Should Costs Be (re)Covered?" 아래: "the difference between revenues collected through tariffs and full economic cost recovery constitutes an economic shortfall that must be offset by a subsidy if the service is to be sustained." excerpt와 일치한다(2단 편집이라 줄이 섞여 있음). 원문의 'full economic cost'는 현금 지출보다 넓은 개념이다. 글은 3절 "감가상각을 계산한 회계 비용과 같지 않습니다"와 출처 설명 "사례는 현금 지출을 단순화했습니다"로 이 차이를 밝혔다.
  - https://www.pub.gov.sg/Public/WaterLoop/Water-Price — 200. "There are three components to the water price in the monthly bill. Water Tariff Water Conservation Tax Waterborne Tax" / "The Water Tariff covers the costs incurred in various stages of the water production process…" / "The Water Conservation Tax (WCT) was introduced in 1991 to encourage water conservation and to reflect its scarcity value." excerpt와 6절 서술(공급 요금·절약 세금·하수 처리 세금)이 맞다.
- 계산: 60+30=90, 80+10=90, 60+10=70, 90−70=20, 90−60=30. 모두 맞다.
- 빠진 내용: 결함 수준의 누락은 없다.
- OK로 확인한 주요 주장: economic shortfall 개념(World Bank 2021). PUB 세 구성요소와 그 목적(PUB).

## 열지 못한 자료
| URL | 상태 | 대체 확인 |
|---|---|---|
| https://www.smallbusiness.nsw.gov.au/help/common-questions/what-to-do-at-the-end-of-the-lease | WebFetch 타임아웃(60초), curl 000 | 검색 색인 스니펫으로 excerpt 문구 대조(발견 #14). archive.org 스냅숏 없음. |
| https://www.smallbusiness.nsw.gov.au/help/common-questions/transferring-your-lease | WebFetch 타임아웃(60초), curl 000 | 없음(발견 #13). archive.org 스냅숏 없음. |
| https://academic.oup.com/ej/issue/38/152 | 403 | https://api.crossref.org/works/10.2307/2224097 — "Increasing Returns and Economic Progress", The Economic Journal 38(152), 527, 1928-12. |
| https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651 | 200이나 본문은 JS 로딩(정적 HTML은 목차 껍데기) | `lsInfoR.do?lsiSeq=279651&efYd=20260512` 및 조문별 `lsSideInfoP.do`로 전문 대조. |
| https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=277149&joNo=0039… / joNo=0078 | 200이나 조문 본문 없음 | 현행판 lsiSeq=285339로 대조(발견 #2). |
| https://www.nber.org/system/files/working_papers/w5224/w5224.pdf, …/w6386/w6386.pdf | 200이나 텍스트층 깨진 스캔 | pdftoppm으로 초록 쪽 이미지를 직접 판독. |
| https://msuweb.montclair.edu/~lebelp/coasenatfirmec1937.pdf, https://archive.org/download/jstor-2276207/2276207.pdf | 200, 스캔(텍스트층 없음/부정확) | 해당 쪽 이미지를 렌더링해 판독. |
| 유튜브 영상 03:50·01:53 프레임 | 영상 자체는 재생하지 않음 | oEmbed·watch 페이지의 제목·publishDate와 중기부 게시 공식 자막(250→400만, 400→600만)으로 대조. |
| https://www.smallbusiness.nsw.gov.au/help/common-questions/what-are-outgoings | HTTP/2 INTERNAL_ERROR, HTTP/1.1 30초 timeout, WebFetch 60초 timeout, Wayback 스냅샷 없음 | 같은 기관 Retail Tenancy Guide 스냅샷으로 일부만 확인(발견 #13, UNVERIFIED) |
| https://www.minimumwage.go.kr/ | 200이나 194 bytes 껍데기(JS) | 고용노동부 보도자료 news_seq=18144로 확인 |
| https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A52022XC0630%2801%29 | 202 빈 응답(봇 챌린지), TXT/HTML·PDF 경로도 202 | 같은 관보 스페인어판 https://www.boe.es/doue/2022/248/Z00001-00085.pdf 165~168항 |
| https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-436/subpart-B/section-436.2 | 302 → unblock.federalregister.gov | eCFR API(`/api/versioner/v1/full/2026-10-01/title-16.xml?section=436.2`, `436.5`), https://www.law.cornell.edu/cfr/text/16/436.2 |
| https://www.ftc.gov/business-guidance/resources/consumers-guide-buying-franchise | curl 404(봇 차단, 1,301 bytes) | WebFetch로 본문 확인 |
| https://www.ftc.gov/business-guidance/blog/2023/05/franchise-fundamentals-taking-deep-dive-franchise-disclosure-document | curl 404(봇 차단) | WebFetch로 본문 확인 |
| https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide | HTTP/2 INTERNAL_ERROR, WebFetch timeout | Wayback 2026-05-03 스냅샷 |
| https://www.fairwork.gov.au/tools-and-resources/fact-sheets/rights-and-obligations/record-keeping-pay-slips | HTTP/2 INTERNAL_ERROR, WebFetch timeout | Wayback 2026-09-09 스냅샷 |
| https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html | 기본 curl·WebFetch 403 | `curl --http1.1`과 브라우저 헤더로 200 |
| https://www.floodsmart.gov/get-insured/eligibility | curl 403, WebFetch 403, Chrome Cloudflare 차단("Sorry, you have been blocked") | 웹 검색으로 FEMA/NFIP 공식 자료 제목·요약에 "Most homeowners insurance does not cover flood damage"가 있음을 확인. agents.floodsmart.gov PDF는 403/429로 다운로드 실패. 판정 UNVERIFIED(#13) |
| https://unstats.un.org/unsd/methodology/m49/faq/ (교차 확인용으로 시도한 경로, 글에 적힌 링크 아님) | 404 | 같은 Q&A가 https://unstats.un.org/unsd/methodology/m49/ 루트 페이지에 있어 그곳에서 412·158 원문 확인 |
| https://www.oecd.org/en/publications/education-at-a-glance-2026_b4968bbc-en/full-report/key-system-level-indicators-of-education-finance_d143f855.html | curl·WebFetch 403 | Chrome으로 열람 성공(원문 인용 확인) |
| https://www.england.nhs.uk/pay-syst/nhs-payment-scheme/ | curl·WebFetch 202 빈 응답 | Chrome으로 열람 성공 |
| https://www.cbo.gov/about/overview | curl·WebFetch 403 | Chrome으로 열람 성공 |
| https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng | curl·WebFetch 202 빈 응답 | https://publications.europa.eu/resource/celex/32022R2065.ENG.xhtml 에서 같은 규정 원문 열람 |
| https://www.imf.org/external/pubs/ft/gfs/manual/aboutgfs.htm, https://data.imf.org/en/Datasets/QGFS, https://content.naic.org/consumer/how-does-insurance-work, https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements | curl 403/404(봇 응답) | WebFetch 200으로 원문 인용 확인 |
| Spence 1973 / Akerlof 1970 / Rothschild–Stiglitz 1976 원 논문 본문 | JSTOR 유료, 열지 않음 | Crossref로 서지(저자·연도·학술지·권호·쪽)만 확인. 세 논문 모두 글에 인용되지 않았고, 빠진 내용(MISSING) 판단의 참고로만 사용 |
| https://www.undrr.org/terminology/exposure | 403(curl·WebFetch) | web.archive.org 2026-09-05 스냅샷. 인용문 일치 |
| https://www.iea.org/reports/electricity-2026/grids | 403 | web.archive.org 2026-09-19 스냅샷. 인용문 일치 |
| https://www.ferc.gov/electric-power-markets | 403 | web.archive.org 2026-10-01 스냅샷. 인용문 일치 |
| https://www.oecd.org/en/publications/global-plastics-outlook_de747aef-en/full-report/component-11.html | 403 | web.archive.org 2025-09-15 스냅샷. 인용문 일치. Crossref 10.1787/de747aef-en |
| https://www.oecd.org/en/publications/extended-producer-responsibility_67587b0b-en.html | 403, 아카이브 없음 | RePEc 초록 https://ideas.repec.org/p/oec/envaac/41-en.html 에서 인용문 일치. Crossref 10.1787/67587b0b-en(2024-04-17) |
| https://www.unep.org/resources/Global-Resource-Outlook-2024 | 403 | web.archive.org 2026-10-06 스냅샷. "rise by 60% from 2020 levels" 일치 |
| https://www.hdb.gov.sg/residential/buying-a-flat/understanding-your-eligibility-and-housing-loan-options/flat-and-grant-eligibility/standard-plus-and-prime-flats | 403 | edgeprop.sg 등 보조 출처의 검색 요약만 확인(발견 #9는 그 수준의 근거임) |
| 한국 「자원의 절약과 재활용촉진에 관한 법률」(생산자책임재활용) | 미개봉 | 웹 검색 요약만 확인(발견 #10의 한국 제도명 부분) |

## 후속 작업
1. **#33 DSA 제38조** (`institutions/media-attention-and-public-belief` 5절): 초대형 플랫폼(VLOP·VLOSE)의 프로파일링 없는 추천 옵션 의무는 원장이 제38조 원문을 대조하지 않았다. publications.europa.eu CELEX 32022R2065 원문에서 제38조를 읽은 뒤 "100개 중 10개" 사례에 한 문단으로 넣는다.
2. **#17 거래비용 이론의 결정 변수** (`firms/why-firms-exist`): Williamson(1979)·자산 특수성·불확실성·거래 빈도·홀드업을 여섯 일 사례("특정 공급자에 맞춘 설비가 필요하면 밖의 비용 b가 재협상 위험만큼 커진다")로 푸는 절이 필요하다. 원 논문 본문을 열어 인용할 문장을 확보한 뒤 새 절 또는 정본 글 링크로 닫는다. 이번에는 Coase 강연 문장과 서지만 연결했다.
3. **#30 Spence 분리 조건 원문 대조**: 이번에는 정본 글(`/economics/market-failure/information-asymmetry#signaling`) 링크로 개념을 닫았다. Spence(1973) 본문(JSTOR)을 열 수 있으면 분리 조건 문장을 인용으로 추가한다.
4. **#34 Ostrom 설계 원리 대응**: 분담·관찰·이의 절차가 Ostrom(1990) 『Governing the Commons』의 어느 원리(감시·단계적 제재·갈등 해결 장치 등)에 해당하는지 원전으로 확인한 뒤 짝짓는다.
5. **#12 한국 생산자책임재활용제도**: 「자원의 절약과 재활용촉진에 관한 법률」의 해당 조문(대상 품목, 재활용의무율, 분담금)을 law.go.kr에서 열어 `materials-waste-and-circularity` 6절에 한국 사례로 넣는다.
6. **#39 HDB Plus·Prime 1차 출처**: HDB 공식 페이지가 403이라 EdgeProp 보도로만 확인했다. 다른 네트워크나 브라우저로 HDB 원문을 열어 10년 MOP·보조금 환수·임대 제한 문장을 인용으로 바꾼다.
7. **등록 모듈 노후화(이번 감사 범위 밖이지만 검증을 막음)**: 이 클러스터 27편의 `src/content/registrations/<slug>.ts`가 정본(`article-learning.ts` 등)보다 오래된 학습 계약·근거를 담고 있다(예: `housing-land-and-supply.ts`의 `conceptExplanations`가 정본과 다름). `scripts/check-article.sh`의 첫 단계 `merge-registrations.mjs`가 route 전체를 교체하므로, 그대로 돌리면 정본의 최신 내용과 이번 공용 파일 수정이 되돌아간다. 통합자는 공용 파일 수정을 적용한 뒤 정본에서 등록 모듈을 다시 생성하거나, 이 route들에서는 병합 단계를 건너뛰어야 한다.
8. **문장 호흡 baseline**: 본문을 고친 route는 fingerprint가 바뀌어 `audit-prose-readability`가 "재검토 필요"로 표시한다(이번에 새로 만든 긴 문단은 없음. 예: `firms/why-firms-exist`는 기존 목록형 문단 4개로 score 8, baseline과 같음). STATUS.md 5단계 방식대로 바뀐 route의 fingerprint만 교체한다.

## 공용 파일 수정 목록

통합자는 `python3 docs/fact-audit-2026-10-09/apply-shared.py docs/fact-audit-2026-10-09/F-applied-economics.md --dry`로 먼저 확인한 뒤 적용한다. 각 old는 2026-10-09 작성 시점에 해당 파일에서 정확히 1회 나오는 것을 확인했다. **주의:** 이 클러스터의 `src/content/registrations/*.ts` 다수(예: `housing-land-and-supply.ts`)는 정본 파일보다 오래된 학습 계약을 담고 있어, `scripts/check-article.sh`가 먼저 돌리는 `merge-registrations.mjs`가 정본의 최신 내용을 되돌린다(`--dry-run`에서 learning·evidence·concept 전부 "replaced"). 그래서 이번 검증은 병합 단계를 뺀 같은 감사 묶음으로 돌렸다. `--mirror`를 쓰면 등록 모듈에 같은 문자열이 있는 경우에만 반영되고, 오래된 등록 모듈의 다른 내용은 그대로 남는다. 등록 모듈을 정본에 맞춰 다시 쓰는 일은 `## 후속 작업`에 남겼다.

### src/content/article-evidence.ts

#40 식품위생법 제39조 링크(shop-transfer-and-goodwill)
```
old: "href": "https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=277149&joNo=0039&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR",
      "note": "제39조 실제 HTML의 승계·신고·수리와 제한 규정 연결을 읽었습니다.
new: "href": "https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=285339&joNo=0039&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR",
      "note": "2026-10-08 시행판(법률 제21525호) 제39조의 승계·신고·수리와 제3항 1개월 이내 신고를 2026-10-09 읽었습니다. 이전 링크(lsiSeq=277149)는 조문 없이 머리말만 보여 교체했습니다.
```

#40 식품위생법 제78조 링크(shop-transfer-and-goodwill)
```
old: "href": "https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=277149&joNo=0078&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR",
      "note": "제78조 실제 HTML에서 처분 효과 승계·진행 중 절차·예외를 읽었습니다.
new: "href": "https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=285339&joNo=0078&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR",
      "note": "2026-10-08 시행판 제78조에서 처분기간 종료 후 1년 승계·진행 중 절차·선의 증명 예외를 2026-10-09 읽었습니다.
```

#4 RICS 지위(land-development-residual)
```
old: "note": "실제 PDF의 용어집,6.1~6.3,7.1,B1.2.8~9,B3을 읽고 인쇄24쪽 식을 화면으로 확인했습니다. 개별 감정평가·시장 거래가격·적정 할인율을 확정하지 않습니다."
new: "note": "실제 PDF의 용어집,6.1~6.3,7.1,B1.2.8~9,B3을 읽고 인쇄24쪽 식을 화면으로 확인했습니다. 2019년 10월 guidance note 1판(2020-02-01 발효)이며 2026-10-09 RICS 현행 페이지는 같은 문서를 Professional Standard로 분류합니다. 개별 감정평가·시장 거래가격·적정 할인율을 확정하지 않습니다."
```

#42 다중이용업소 안내 기준일(shop-fitout-and-opening)
```
old: "note": "2026-08-15 안내의 대상 업종·면적·층·출입구와 예외를 읽었습니다."
new: "note": "페이지 하단 '2026년 9월 15일 기준으로 작성' 안내의 대상 업종·면적(100㎡, 지하 66㎡)·층·출입구와 예외를 2026-10-09 읽었습니다."
```

#3 식품위생교육 주의문(shop-fitout-and-opening)
```
old: "note": "2026-09-15 안내의 제41조 교육·대리·예외를 읽었습니다. 10월8일 예고 내용을 10월4일 현재 규정으로 적용하지 않습니다."
new: "note": "2026-09-15 안내의 제41조 교육·대리·예외를 읽었습니다. 식품위생법 2026-10-08 시행분(법률 제21525호, 결격조항 정비)은 이미 시행됐으나 제40조·제41조 내용은 바뀌지 않았고, 안내가 예고한 다음 개정은 2026-12-31 시행분입니다(2026-10-09 확인)."
```

#42 다중이용업소 안내 기준일(shop-daily-operations)
```
old: "note": "2026-08-15 기준 안내에서 업종·면적·층·주출입구와 예외를 확인했습니다. 실제 점포의 가입 대상 판정은 별도입니다."
new: "note": "페이지 하단 '2026년 9월 15일 기준으로 작성' 안내에서 업종·면적(100㎡, 지하 66㎡)·층·주출입구와 예외를 2026-10-09 확인했습니다. 실제 점포의 가입 대상 판정은 별도입니다."
```

#3 식품위생교육 주의문(shop-daily-operations)
```
old: "note": "2026-09-15 기준 제41조의 교육·대리·면제 범위를 읽었습니다. 안내에 예고된 10월8일 시행 변경을 10월4일 현재 규정으로 적용하지 않습니다."
new: "note": "2026-09-15 기준 제41조의 교육·대리·면제 범위를 읽었습니다. 식품위생법 2026-10-08 시행분(결격조항 정비)은 이미 시행됐으나 제41조 내용은 바뀌지 않았고, 다음 예고는 2026-12-31 시행분입니다(2026-10-09 확인)."
```

#43 고용노동부 카드뉴스 제목
```
old: "label": "고용노동부 · 5인 미만 사업장 적용 노동법",
new: "label": "고용노동부 · [카드뉴스] 5인미만 사업장 적용 노동법(2022-05-10)",
```

#51 NSW outgoings 미검증 범위(shop-unit-economics)
```
old: "note": "공식 본문의 정의·계약 및 공개서 명시·직접적이고 합리적인 관련 범위를 읽었습니다.
new: "note": "2026-10-09 이 페이지는 응답하지 않았고 보관 사본도 없어 원문을 다시 대조하지 못했습니다. 같은 기관 Retail Tenancy Guide의 web.archive.org 2026-05-03 사본에서 outgoings 예시(land tax, cleaning, security, council rates, water/utility charges)와 'Undisclosed outgoings might not have to be paid.'만 확인했고, 직접적·합리적 관련 요건은 확인하지 못했습니다.
```

#2 UNESCO 인용 단어 수(culture-norms-and-coordination)
```
old: "note": "2001-11-02 채택. 같은 선언의 두 짧은 인용은 합계 21단어입니다. 확인 2026-10-04."}
new: "note": "2001-11-02 채택. 같은 선언의 두 짧은 인용은 8단어와 11단어로 합계 19단어입니다. 확인 2026-10-04, 단어 수 재확인 2026-10-09."}
```

#52 NFIP 미검증 범위(insurance-risk-pooling)
```
old: "note": "미국 일반 주택보험과 홍수보험의 구분. 2026-10-04 확인."
new: "note": "미국 일반 주택보험과 홍수보험의 구분. 2026-10-04 확인. 2026-10-09 재확인 때는 자동 조회 불가(403, Cloudflare 차단)로 원문을 다시 대조하지 못했고, 같은 문구가 FEMA/NFIP 공식 자료 제목에 있다는 것만 검색으로 2차 확인했습니다."
```

#44 ICH E8(R1) 절 번호(evidence-measurement-and-causality)
```
old: {"kind": "공식 문서", "label": "ICH · E8(R1), §5.3 및 §6", "href": "https://database.ich.org/sites/default/files/E8-R1_Guideline_Step4_2022_0204%20%281%29.pdf", "note": "배정 이후 탈락·측정·분석의 차이도 결과 해석에 영향을 준다는 설계 원칙."}
new: {"kind": "공식 문서", "label": "ICH · E8(R1), §5.5·§5.6", "href": "https://database.ich.org/sites/default/files/E8-R1_Guideline_Step4_2022_0204%20%281%29.pdf", "note": "§5.5 Methods to Reduce Bias(무작위 배정은 배정 시점의 차이만 다루고 연구 중 생기는 차이의 편향은 막지 못함)와 §5.6(가정의 영향을 보는 민감도 분석 계획). 배정 이후 탈락·측정·분석의 차이도 결과 해석에 영향을 준다는 설계 원칙. 절 번호는 2026-10-09 원문 PDF로 재확인했습니다(이전 표기 §5.3은 비교군 선택, §6은 시행·안전 모니터링 절)."}
```


#47 RICS 지위(housing-land-and-supply)
```
old: "note": "개발 비용에 정상 이익을 포함하는 잔여 평가 설명. 본문5절에서10−7=3과 이익 이중차감 방지 적용."
new: "note": "개발 비용에 정상 이익을 포함하는 잔여 평가 설명. 본문5절에서10−7=3과 이익 이중차감 방지 적용. 링크는 인용문·24쪽이 있는 2019년 10월 guidance note 1판(2020-02-01 발효) PDF이며, 2026-10-09 RICS 현행 페이지는 같은 문서를 Professional Standard로 분류합니다."
```

### src/content/article-learning.ts

#41 근로기준법 제36조 시행판 표기(shop-closure-and-restoration)
```
old: "assumptions": "2026-10-02 시행 조문을 2026-10-04 확인했습니다.",
new: "assumptions": "2026-10-04 확인 당시 시행 조문을 읽었고 2026-10-09 같은 링크가 2026-10-08 시행판(법률 제21533호)을 보여 주며 제36조 문언은 같음을 다시 확인했습니다.",
```

#40 식품위생법 제39조 링크(shop-transfer-and-goodwill)
```
old: "href": "https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=277149&joNo=0039&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR",
new: "href": "https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=285339&joNo=0039&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR",
```

#40 식품위생법 제39조 시행판 표기
```
old: "assumptions": "2026-10-04 시행 중인 법률 제21065호이며 실제 영업 양도인지 판단해야 합니다.",
new: "assumptions": "2026-10-09 확인한 2026-10-08 시행판(법률 제21525호)이며 승계 신고 기한은 1개월입니다. 실제 영업 양도인지 판단해야 합니다.",
```

#40 식품위생법 제78조 링크
```
old: "href": "https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=277149&joNo=0078&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR",
new: "href": "https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=285339&joNo=0078&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR",
```

#4 RICS 지위(land-development-residual)
```
old: "assumptions": "2019년 지침의 설명이며 2026년 최신 전문기준 전체를 대신하지 않습니다.",
new: "assumptions": "2019년 10월 펴내 2020-02-01 발효한 문서이며 2026-10-09 RICS는 같은 문서를 Professional Standard로 분류합니다. 2026년 최신 전문기준 전체를 대신하지 않습니다.",
```

#1 하루 평균 건수 계산(shop-site-selection)
```
old: 하루 평균과 매일 같은 정수 목표를 구별하면 30일에 약 44.45건과 45건입니다.
new: 하루 평균과 매일 같은 정수 목표를 구별하면 1,333.33÷30≈44.44건(1,334건 기준 1,334÷30≈44.47건)과 45건입니다.
```

#51 NSW outgoings 미검증 범위(shop-unit-economics)
```
old: "evidenceScope": "공식 본문의 정의·계약 및 공개서 명시·직접적이고 합리적인 관련 범위를 읽었습니다.",
new: "evidenceScope": "2026-10-09 원 페이지는 응답하지 않아 재대조하지 못했고, 같은 기관 Retail Tenancy Guide의 web.archive.org 2026-05-03 사본에서 outgoings 예시와 미공개 outgoings는 내지 않아도 될 수 있다는 문장만 확인했습니다. 직접적·합리적 관련 요건은 확인하지 못했습니다.",
```

#8 infrastructure 개념-문단 배치(article-learning.ts). 21개 개념을 모두 본문과 대조해 16개를 고치고 5개(food-price-causality-boundary, climate-history-boundary, collection-recovery-yield, waste-financing-responsibility, circularity-displacement-boundary)는 이미 정의 문단과 맞아 그대로 둔다.

#8 grid-connection-constraint (sectionId mechanism → names)
```
old: "id": "grid-connection-constraint",
        "sectionId": "mechanism",
        "intuition": "먼 발전의 단가를 MWh당 5만 원, 공장 근처 대체 공급을 10만 원으로 둡니다(가정). 먼 곳에서 80MWh를 받아 400만 원, 가까운 곳에서 20MWh를 받아 200만 원을 냅니다. 에너지 조달비는 합계 600만 원입니다.",
        "workedExample": "먼 발전의 단가를 MWh당 5만 원, 공장 근처 대체 공급을 10만 원으로 둡니다(가정). 먼 곳에서 80MWh를 받아 400만 원, 가까운 곳에서 20MWh를 받아 200만 원을 냅니다. 에너지 조달비는 합계 600만 원입니다.",
        "boundary": "저장 설비가 20MWh를 담을 수 있어도 한 시간에 5MW만 낼 수 있다면 그 시간의 부족 20MWh를 모두 채우지 못합니다(가정). 저장량과 방전 속도를 함께 확인해야 합니다."
new: "id": "grid-connection-constraint",
        "sectionId": "names",
        "intuition": "전기를 장거리로 옮기는 길이 송전망이고, 그 길에 새 발전소나 공장을 연결할 조건을 망 접속이라고 부릅니다. 이 사례의 접속 제약은 발전소가 100MWh를 만들 수 있어도 그 한 시간의 공급을 80MWh로 제한합니다.",
        "workedExample": "발전소가 내보낼 수 있는 100과 길이 허용하는 80을 동시에 지켜야 하므로 이 단순한 한 경로에서는 작은 쪽인 80이 도착 상한입니다. 나머지 20MWh는 공장 근처의 다른 공급원에서 구하거나 사용을 줄여야 합니다(가정).",
        "boundary": "IEA 보고서가 모든 공장의 접속량을 계산해 주는 것은 아닙니다. 실제 80이라는 한도는 해당 망사업자의 접속 검토, 보강 공사 범위와 공급 개시일 문서에서 확인해야 합니다."
```

#8 electricity-system-cost (sectionId comparison → mechanism)
```
old: "id": "electricity-system-cost",
        "sectionId": "comparison",
        "intuition": "미국 FERC의 시장 안내는 독립 운영자가 도매시장을 여는 지역과 발전·송전·배전을 함께 맡는 전력회사가 있는 지역을 구분합니다. 따라서 미국 전력요금 하나로 사례의 600만 원 청구 방식을 정할 수 없습니다.",
        "workedExample": "길의 제약이 없어서 먼 곳에서 100MWh를 모두 살 수 있었다면 500만 원입니다. 두 조건의 차이 100만 원은 이 한 시간의 추가 조달비입니다. 이것만으로 송전선 건설비를 회수할 수 있는지는 연간 혼잡 시간과 공사비를 더 알아야 합니다.",
        "boundary": "전력 가격과 공급 안정성의 경계는 계약상 받을 권리, 실제 연결 용량, 정전 때의 대체 수단에 있습니다. 낮은 평균 요금과 연간 발전량만으로 공장의 생산 손실을 추정할 수 없습니다."
new: "id": "electricity-system-cost",
        "sectionId": "mechanism",
        "intuition": "최종 전력 시스템 비용에는 에너지 조달비 600만 원 외에 망 유지, 운영, 고장 대비와 저장 비용도 들어갑니다. 600만 원은 최종 청구서의 일부입니다.",
        "workedExample": "길의 제약이 없어서 먼 곳에서 100MWh를 모두 살 수 있었다면 500만 원입니다. 두 조건의 차이 100만 원은 이 한 시간의 추가 조달비입니다. 이것만으로 송전선 건설비를 회수할 수 있는지는 연간 혼잡 시간과 공사비를 더 알아야 합니다.",
        "boundary": "같은 100MWh라도 지역 도매 규칙, 소매 계약, 망 요금, 수요를 줄여 달라는 약정이 다르면 지급액이 달라집니다. 미국 FERC 안내처럼 독립 운영자 지역과 통합 전력회사 지역이 나뉘므로 요금 하나로 청구 방식을 정할 수 없습니다."
```

#8 power-price-reliability-boundary (sectionId limits → limits)
```
old: "id": "power-price-reliability-boundary",
        "sectionId": "limits",
        "intuition": "저장 설비가 20MWh를 담을 수 있어도 한 시간에 5MW만 낼 수 있다면 그 시간의 부족 20MWh를 모두 채우지 못합니다(가정). 저장량과 방전 속도를 함께 확인해야 합니다.",
        "workedExample": "최종 전력 시스템 비용에는 망 유지, 운영, 고장 대비와 저장 비용도 들어갑니다. 600만 원은 최종 청구서 전체가 아니며, 실제 도매시장에서는 단가 결정과 혼잡 비용의 배분 방식도 계약에 따라 달라집니다.",
        "boundary": "실제 투자에서는 최대 사용량의 시간표와 접속일을 맞추고, 공급 지연과 정전 때 손실을 계산합니다. 100·80·20 모델은 이 질문을 열어 주지만 복잡한 전력 흐름이나 고장 확률을 대신 계산하지는 않습니다."
new: "id": "power-price-reliability-boundary",
        "sectionId": "limits",
        "intuition": "전력 가격과 공급 안정성의 경계는 계약상 받을 권리, 실제 연결 용량, 정전 때의 대체 수단에 있습니다. 낮은 평균 요금과 연간 발전량만으로 공장의 생산 손실을 추정할 수 없습니다.",
        "workedExample": "저장 설비가 20MWh를 담을 수 있어도 한 시간에 5MW만 낼 수 있다면 그 시간의 부족 20MWh를 모두 채우지 못합니다(가정). 저장량과 방전 속도를 함께 확인해야 합니다.",
        "boundary": "실제 투자에서는 최대 사용량의 시간표와 접속일을 맞추고, 공급 지연과 정전 때 손실을 계산합니다. 100·80·20 모델은 이 질문을 열어 주지만 복잡한 전력 흐름이나 고장 확률을 대신 계산하지는 않습니다."
```

#8 food-value-chain-gap (sectionId mechanism → names)
```
old: "id": "food-value-chain-gap",
        "sectionId": "mechanism",
        "intuition": "처음의 한 단위를 10개 묶음으로 늘려 봅니다(가정). 출하 1,000원, 선별·저장 300원, 운송 200원이 들면 가게에 들어오기까지 1,500원입니다. 모두 팔면 개당 150원이지만 2개를 버리면 판매 가능한 8개당 187.5원이 됩니다.",
        "workedExample": "처음의 한 단위를 10개 묶음으로 늘려 봅니다(가정). 출하 1,000원, 선별·저장 300원, 운송 200원이 들면 가게에 들어오기까지 1,500원입니다. 모두 팔면 개당 150원이지만 2개를 버리면 판매 가능한 8개당 187.5원이 됩니다.",
        "boundary": "작황이 나빠져 가격이 올라도 보관 물량과 대체 수입이 충격을 줄일 수 있습니다. 반대로 농가가격이 그대로여도 폐기율, 연료비나 임금이 오르면 소매가격이 바뀝니다."
new: "id": "food-value-chain-gap",
        "sectionId": "names",
        "intuition": "농가에서 소비자까지 같은 수량의 판매가격 차이를 식품 가치사슬의 가격 간격으로 읽습니다. 운송과 가공처럼 추가된 서비스의 비용과 이익을 모두 담습니다.",
        "workedExample": "농가 출하액 100원에 선별·저장 30원, 운송 20원, 소매 50원이 더해져 소비자가 200원을 냅니다(가정). 농가 몫은 100÷200=50%이고, 각 단계의 구매액을 또 더하면 앞 단계 돈을 중복해 세므로 추가된 금액만 잇습니다.",
        "boundary": "나머지 50%가 유통업자의 순이익은 아닙니다. 추가 금액에서 노동과 전기, 임차료 같은 비용을 빼야 각 사업자의 이익이 남습니다."
```

#8 perishable-bargaining-power (sectionId comparison → names)
```
old: "id": "perishable-bargaining-power",
        "sectionId": "comparison",
        "intuition": "미국 농무부 ERS의 Food Dollar는 미국에서 생산한 식품에 대한 지출이 어디로 가는지 나누는 통계입니다. 그 안의 농가 몫은 농가의 순이익률과 다릅니다.",
        "workedExample": "소매 단계가 총 500원을 추가로 회수해야 한다면 전체 필요액은 2,000원입니다. 8개로 나눠 개당 250원을 받아야 같은 총액을 회수합니다. 200원에서 250원으로 올라도 이 가정에서는 총이익이 늘었다고 볼 수 없습니다.",
        "boundary": "같은 품질·수량·기간으로 맞췄는데 비용은 그대로이고 특정 단계의 순마진만 커졌다면 계약과 구매자 집중도를 조사할 이유가 생깁니다. 가격 차이 자체만으로 누가 폭리를 취했는지는 확정되지 않습니다."
new: "id": "perishable-bargaining-power",
        "sectionId": "names",
        "intuition": "시간이 지나면서 판매 가능한 양이나 품질이 줄어드는 성질이 부패성이고, 거래를 거절하거나 다음 기회를 기다릴 힘이 협상력입니다. 물건이 상하는 속도, 구매자의 수, 보관과 자금 여유가 그 힘을 바꿉니다.",
        "workedExample": "내일 상할 물건 10단위를 가진 농가는 오늘 사겠다는 구매자를 쉽게 거절하기 어렵습니다(가정). 보관하면 다음 구매자를 기다릴 수 있지만 냉장 설비와 전기, 먼저 지급한 돈의 부담이 생깁니다.",
        "boundary": "구매자가 소수이고 반품까지 요구할 수 있다면 농가가 더 많은 위험을 떠안을 수 있습니다. 저장 시설과 공동 판매가 비용을 낮추는 시설인지 거래 조건을 바꾸는 시설인지 구분해서 봅니다."
```

#8 water-full-service-cost (sectionId mechanism → names)
```
old: "id": "water-full-service-cost",
        "sectionId": "mechanism",
        "intuition": "가구 수입 80과 정부 지급 10이면 서비스 90을 충당합니다. 가구 수입을 60으로 낮추고 지원은 10에 두면 총수입은 70, 부족액은 20입니다(가정). 지원을 더 받거나 다른 수입을 마련하지 않으면 교체나 운영을 줄여야 합니다.",
        "workedExample": "가구 수입 80과 정부 지급 10이면 서비스 90을 충당합니다. 가구 수입을 60으로 낮추고 지원은 10에 두면 총수입은 70, 부족액은 20입니다(가정). 지원을 더 받거나 다른 수입을 마련하지 않으면 교체나 운영을 줄여야 합니다.",
        "boundary": "이미 연결된 집의 요금을 낮추면 물을 많이 쓰는 집이 더 큰 금액을 지원받을 수 있습니다. 연결되지 않은 집은 여전히 다른 판매자에게 더 비싸게 물을 살 수 있습니다. 연결비 지원과 매달 요금 지원은 서로 다른 문제를 풉니다."
new: "id": "water-full-service-cost",
        "sectionId": "names",
        "intuition": "취수와 정수, 배관의 유지와 교체까지 넣어 서비스의 전체 비용을 셉니다. 이 글의 90은 한 해 필요한 현금 지출을 단순화한 값이며 감가상각을 계산한 회계 비용과 같지 않습니다.",
        "workedExample": "한 해 정수·운영에 60, 배관 교체에 30이 필요하면 서비스에 필요한 자원은 합계 90입니다(가정). 정부 지원 10이 같은 요금을 대신 내는 돈이라면 서비스 비용에 다시 더해 100이라고 쓰면 안 됩니다.",
        "boundary": "요금을 낮추려고 교체 30을 미루면 올해 수입과 지출은 맞을 수 있습니다. 그러나 설비 상태가 나빠지면 누수와 단수의 비용이 뒤로 넘어가므로 현재와 미래 이용자의 부담을 함께 봅니다."
```

#8 water-tariff-incidence (sectionId comparison → names)
```
old: "id": "water-tariff-incidence",
        "sectionId": "comparison",
        "intuition": "싱가포르 PUB는 물 생산·공급 요금, 물 절약과 희소성을 반영하는 세금, 사용한 물 처리의 세금을 구분합니다. 하나의 단가 안에 어떤 비용과 정책 목적이 들어 있는지 먼저 읽어야 합니다.",
        "workedExample": "사용량과 무관하게 받는 기본 금액을 늘리면 수입은 안정되지만 적게 쓰는 집의 부담이 커질 수 있습니다. 사용량별 가격을 높이면 절수를 유도할 수 있지만 가구원 수가 많은 저소득 가구가 불리할 수 있습니다.",
        "boundary": "부담 가능성과 안정 공급을 함께 보려면 가구 소득 대비 청구액, 수질, 공급 시간, 누수와 미연결 가구를 봅니다. 낮은 요금만으로 공정성을 판정할 수 없습니다."
new: "id": "water-tariff-incidence",
        "sectionId": "names",
        "intuition": "돈을 최종적으로 누가 내는지 보는 질문이 부담 귀속입니다. 같은 서비스 비용 90도 가구가 전부 내거나 세금이 일부를 대신할 수 있습니다.",
        "workedExample": "가구 수입 80과 정부 지급 10이면 서비스 90을 충당합니다. 가구 수입을 60으로 낮추고 지원은 10에 두면 총수입은 70, 부족액은 20입니다(가정). 지원을 더 받거나 다른 수입을 마련하지 않으면 교체나 운영을 줄여야 합니다.",
        "boundary": "사용량과 무관하게 받는 기본 금액을 늘리면 수입은 안정되지만 적게 쓰는 집의 부담이 커질 수 있습니다. 사용량별 가격을 높이면 절수를 유도할 수 있지만 가구원 수가 많은 저소득 가구가 불리할 수 있습니다."
```

#8 water-affordability-reliability (sectionId limits → limits)
```
old: "id": "water-affordability-reliability",
        "sectionId": "limits",
        "intuition": "이미 연결된 집의 요금을 낮추면 물을 많이 쓰는 집이 더 큰 금액을 지원받을 수 있습니다. 연결되지 않은 집은 여전히 다른 판매자에게 더 비싸게 물을 살 수 있습니다. 연결비 지원과 매달 요금 지원은 서로 다른 문제를 풉니다.",
        "workedExample": "어떤 요금표든 수도 서비스의 전체 비용을 사라지게 하지는 않습니다. 요금·세금·차입 중 누가 언제 부담할지를 바꾸므로 차입을 쓰면 뒤의 상환 재원도 적습니다.",
        "boundary": "90의 가정 장부는 부담 이전을 보여 줄 뿐 실제 공사 수명이나 물 수요를 추정하지 않습니다. 실제 조정에서는 사업자의 설비 상태와 현지 지원 규칙을 대조합니다."
new: "id": "water-affordability-reliability",
        "sectionId": "limits",
        "intuition": "부담 가능성과 안정 공급을 함께 보려면 가구 소득 대비 청구액, 수질, 공급 시간, 누수와 미연결 가구를 봅니다. 낮은 요금만으로 공정성을 판정할 수 없습니다.",
        "workedExample": "이미 연결된 집의 요금을 낮추면 물을 많이 쓰는 집이 더 큰 금액을 지원받을 수 있습니다. 연결되지 않은 집은 여전히 다른 판매자에게 더 비싸게 물을 살 수 있으므로 연결비 지원과 매달 요금 지원은 서로 다른 문제를 풉니다.",
        "boundary": "90의 가정 장부는 부담 이전을 보여 줄 뿐 실제 공사 수명이나 물 수요를 추정하지 않습니다. 실제 조정에서는 사업자의 설비 상태와 현지 지원 규칙을 대조합니다."
```

#8 transport-accessibility (sectionId mechanism → names)
```
old: "id": "transport-accessibility",
        "sectionId": "mechanism",
        "intuition": "한 달 왕복 1,000분을 아끼고 추가 요금 2만 원, 월세 10만 원을 낸다는 사례를 다시 봅니다. 시간을 쉴 때 쓸지 일을 더 할지는 개인의 선택입니다. 16시간 40분에 시급을 곱한 값이 통장에 자동으로 들어오지는 않습니다.",
        "workedExample": "한 달 왕복 1,000분을 아끼고 추가 요금 2만 원, 월세 10만 원을 낸다는 사례를 다시 봅니다. 시간을 쉴 때 쓸지 일을 더 할지는 개인의 선택입니다. 16시간 40분에 시급을 곱한 값이 통장에 자동으로 들어오지는 않습니다.",
        "boundary": "노선이 좋아진 뒤 사람이 더 모여 혼잡과 대기가 늘 수 있습니다. 다른 상권의 소비가 새 역 주변으로 옮겨 온 것이라면 한 지역의 매출 증가를 나라 전체의 새 매출로 세기 어렵습니다."
new: "id": "transport-accessibility",
        "sectionId": "names",
        "intuition": "주어진 시간과 비용 안에서 갈 수 있는 일자리와 서비스의 범위를 교통 접근성이라고 부릅니다. 속도가 같아도 주변 일자리와 환승망이 다르면 접근성은 다릅니다.",
        "workedExample": "한 달 왕복 1,000분을 아끼고 추가 요금 2만 원, 월세 10만 원을 낸다는 사례를 다시 봅니다. 시간을 쉴 때 쓸지 일을 더 할지는 개인의 선택입니다. 16시간 40분에 시급을 곱한 값이 통장에 자동으로 들어오지는 않습니다.",
        "boundary": "열차가 빨라도 배차가 드물면 대기가 길어지고, 정류장까지 안전하게 걷기 어렵거나 마지막 운행이 이르면 일부 사람은 그 노선을 쓸 수 없습니다. 차량 속도만으로 접근성을 재지 않는 이유입니다."
```

#8 transit-land-rent-shift (sectionId comparison → names)
```
old: "id": "transit-land-rent-shift",
        "sectionId": "comparison",
        "intuition": "영국 MHCLG의 사업 평가 안내는 토지가치 변화와 다른 편익을 합칠 때 중복을 확인하도록 합니다. 이 원칙을 사례에 적용하면 1,000분 절약의 가치와 월세 상승 10만 원이 같은 접근성 개선을 반영하는지부터 봅니다.",
        "workedExample": "집주인은 월세 인상의 수입을 얻고 교통 운영자는 요금을 받습니다. 정부는 공사비와 운영 지원을 부담할 수 있습니다. 통근자 이익을 계산한 뒤 임대료 상승액을 사회 전체의 새 이익으로 그대로 더하면 같은 접근성 가치를 두 번 셀 수 있습니다.",
        "boundary": "공사비 초과, 개통 지연, 유지비, 소음과 이주 부담도 지역별로 나눠 봅니다. 특히 평균 이용자 수가 맞아도 출근시간 한 방향에 수요가 몰리면 필요한 차량과 설비가 달라집니다."
new: "id": "transit-land-rent-shift",
        "sectionId": "names",
        "intuition": "좋아진 위치의 이익이 임대료에 반영되는 경로가 교통 이익의 지대 이동입니다. 여기서 지대는 토지의 위치와 이용권에서 얻는 수입을 뜻합니다.",
        "workedExample": "집주인은 월세 인상의 수입을 얻고 교통 운영자는 요금을 받습니다. 정부는 공사비와 운영 지원을 부담할 수 있습니다. 통근자 이익을 계산한 뒤 임대료 상승액을 사회 전체의 새 이익으로 그대로 더하면 같은 접근성 가치를 두 번 셀 수 있습니다.",
        "boundary": "접근성 향상도 모든 주민에게 같지 않습니다. 기존 임차인이 월세를 감당하지 못해 더 먼 곳으로 이동하면 원래 기대한 시간 절약을 누리지 못할 수 있습니다."
```

#8 transport-benefit-boundary (sectionId limits → limits)
```
old: "id": "transport-benefit-boundary",
        "sectionId": "limits",
        "intuition": "노선이 좋아진 뒤 사람이 더 모여 혼잡과 대기가 늘 수 있습니다. 다른 상권의 소비가 새 역 주변으로 옮겨 온 것이라면 한 지역의 매출 증가를 나라 전체의 새 매출로 세기 어렵습니다.",
        "workedExample": "접근성 향상도 모든 주민에게 같지 않습니다. 기존 임차인이 월세를 감당하지 못해 더 먼 곳으로 이동하면 원래 기대한 시간 절약을 누리지 못할 수 있습니다.",
        "boundary": "교통 편익 계산의 경계는 시간·소득·지가가 무엇을 대표하는지에 있습니다. 같은 1,000분을 실제 절약했는지 먼저 확인한 뒤 편익의 분배와 추가 비용을 계산합니다."
new: "id": "transport-benefit-boundary",
        "sectionId": "limits",
        "intuition": "교통 편익 계산의 경계는 시간·소득·지가가 무엇을 대표하는지에 있습니다. 같은 1,000분을 실제 절약했는지 먼저 확인한 뒤 편익의 분배와 추가 비용을 계산합니다.",
        "workedExample": "잉글랜드 MHCLG의 평가 지침처럼 토지가치 변화와 다른 편익을 합칠 때는 중복을 확인합니다. 1,000분 절약의 가치와 월세 상승 10만 원이 같은 접근성 개선을 반영한다면 둘을 독립 편익으로 더하지 않습니다.",
        "boundary": "노선이 좋아진 뒤 사람이 더 모여 혼잡과 대기가 늘 수 있습니다. 다른 상권의 소비가 새 역 주변으로 옮겨 온 것이라면 한 지역의 매출 증가를 나라 전체의 새 매출로 세기 어렵습니다."
```

#8 housing-residual-land (sectionId mechanism → names)
```
old: "id": "housing-residual-land",
        "sectionId": "mechanism",
        "intuition": "처음 판매 10억 원, 토지 외 비용·정상 이익 7억 원을 고정합니다. 허가나 공사 지연으로 금융·관리 비용이 5천만 원 늘면 토지에 남는 금액은 2억5천만 원입니다(가정). 토지를 아직 안 샀다면 제안 가격을 낮출 수 있습니다.",
        "workedExample": "처음 판매 10억 원, 토지 외 비용·정상 이익 7억 원을 고정합니다. 허가나 공사 지연으로 금융·관리 비용이 5천만 원 늘면 토지에 남는 금액은 2억5천만 원입니다(가정). 토지를 아직 안 샀다면 제안 가격을 낮출 수 있습니다.",
        "boundary": "새 공급이 늘어도 소득이 낮은 가구가 보증금이나 대출 조건을 충족하지 못할 수 있습니다. 기존 임차인의 이주 비용과 일자리에서 멀어지는 비용도 남습니다."
new: "id": "housing-residual-land",
        "sectionId": "names",
        "intuition": "판매가치에서 사업 비용과 정상 이익을 빼 토지에 남는 금액을 주택 토지 잔여가치라고 부릅니다. 판매 10억 원에서 토지 외 비용·정상 이익 7억 원을 뺀 3억 원이 이 값입니다(가정).",
        "workedExample": "처음 판매 10억 원, 토지 외 비용·정상 이익 7억 원을 고정합니다. 허가나 공사 지연으로 금융·관리 비용이 5천만 원 늘면 토지에 남는 금액은 2억5천만 원입니다(가정). 토지를 아직 안 샀다면 제안 가격을 낮출 수 있습니다.",
        "boundary": "판매 예상이 10억에서 9억으로 줄면 원래 조건에서도 토지 잔여가치는 2억입니다. 가격과 비용의 작은 변화가 마지막에 남는 토지 금액에는 큰 비율로 나타납니다."
```

#8 housing-permit-lag (sectionId comparison → names)
```
old: "id": "housing-permit-lag",
        "sectionId": "comparison",
        "intuition": "싱가포르 정부는 일반적인 새 HDB 주택의 구매자가 99년 동안 주택 권리를 소유한다고 설명합니다. 이것은 거주할 때마다 임대료를 내는 단순 임차와 다르면서, 기간이 없는 소유권과도 다릅니다.",
        "workedExample": "이미 토지비 3억 원을 지급했다면 땅값을 소급해 줄일 수 없습니다. 판매가나 다른 비용이 그대로라면 요구했던 이익 1억 원 중 5천만 원을 잃습니다. 토지 거래 전 계산과 거래 후 손익은 다른 결정을 만듭니다.",
        "boundary": "반대로 공급을 제한한 채 구매 보조만 늘리면 지을 수 있는 양이 짧은 기간에 늘지 않아 가격에 일부 반영될 수 있습니다. 얼마나 반영되는지는 지역 수요와 공급 조건을 따로 확인해야 합니다."
new: "id": "housing-permit-lag",
        "sectionId": "names",
        "intuition": "권리 확인과 인허가, 기반 시설, 시공 때문에 수요 증가가 입주로 이어지는 데 걸리는 시간이 공급의 허가 시간입니다. 허가 건수가 늘었다는 통계와 완공 물량은 다릅니다.",
        "workedExample": "허가를 기다리는 동안 돈을 빌려 두었다면 이자와 관리비를 계속 냅니다. 지연으로 금융·관리 비용이 5천만 원 늘면 토지에 남는 금액은 3억에서 2억5천만 원이 되고, 이미 토지비 3억 원을 지급했다면 요구했던 이익 1억 원 중 5천만 원을 잃습니다(가정).",
        "boundary": "반대로 공급을 제한한 채 구매 보조만 늘리면 지을 수 있는 양이 짧은 기간에 늘지 않아 가격에 일부 반영될 수 있습니다. 얼마나 반영되는지는 지역 수요와 공급 조건을 따로 확인해야 합니다."
```

#8 housing-affordability-distribution (sectionId limits → limits)
```
old: "id": "housing-affordability-distribution",
        "sectionId": "limits",
        "intuition": "새 공급이 늘어도 소득이 낮은 가구가 보증금이나 대출 조건을 충족하지 못할 수 있습니다. 기존 임차인의 이주 비용과 일자리에서 멀어지는 비용도 남습니다.",
        "workedExample": "판매 예상이 10억에서 9억으로 줄면 원래 조건에서도 토지 잔여가치는 2억입니다. 가격과 비용의 작은 변화가 마지막에 남는 토지 금액에는 큰 비율로 나타납니다.",
        "boundary": "실제 선택에서는 거래가, 신규 허가·착공·입주, 공실과 월세, 가구 소득과 대출 부담을 시간순으로 읽습니다. 10억의 사업 계산으로 모든 가구의 살림을 대신 판단할 수 없습니다."
new: "id": "housing-affordability-distribution",
        "sectionId": "limits",
        "intuition": "가구가 실제 감당하는 주거비는 매매가나 월세 외에도 대출 이자, 관리비, 교통비에 걸칩니다. 주거비 부담의 분배를 보려면 가구 소득과 거주 권리도 함께 봅니다.",
        "workedExample": "새 공급이 늘어도 소득이 낮은 가구가 보증금이나 대출 조건을 충족하지 못할 수 있습니다. 기존 임차인의 이주 비용과 일자리에서 멀어지는 비용도 남습니다.",
        "boundary": "실제 선택에서는 거래가, 신규 허가·착공·입주, 공실과 월세, 가구 소득과 대출 부담을 시간순으로 읽습니다. 10억의 사업 계산으로 모든 가구의 살림을 대신 판단할 수 없습니다."
```

#8 climate-risk-components (sectionId mechanism → names)
```
old: "id": "climate-risk-components",
        "sectionId": "mechanism",
        "intuition": "B의 손실 60 중 보험이 40을 지급하고 소유자가 20을 부담한다고 놓습니다(가정). 총물리 손실은 여전히 60입니다. 지급이 복구를 도울 수 있지만 보험금이 손상 자체를 없애지는 않습니다.",
        "workedExample": "B의 손실 60 중 보험이 40을 지급하고 소유자가 20을 부담한다고 놓습니다(가정). 총물리 손실은 여전히 60입니다. 지급이 복구를 도울 수 있지만 보험금이 손상 자체를 없애지는 않습니다.",
        "boundary": "같은 지역에 건물이 늘면 날씨가 그대로여도 노출이 커집니다. 배수 시설이 낡거나 보강되면 취약성이 바뀝니다. 기후 변화까지 있으면 과거 발생 빈도가 미래를 그대로 대표하지 않을 수 있습니다."
new: "id": "climate-risk-components",
        "sectionId": "names",
        "intuition": "같은 홍수라도 위해(손실을 일으킬 수 있는 자연적·인위적 물리 사건의 가능성), 노출(그곳에 놓인 사람과 자산), 취약성(피해 민감성과 대응·적응 능력의 부족)을 나누어 보면 손실이 왜 다른지 설명할 수 있습니다.",
        "workedExample": "동일 홍수에서 A는 자산 100에 손상 비율 10%를 적용해 10, B는 자산 300에 20%를 적용해 60의 손실이 생깁니다(가정). 노출과 취약성의 차이가 같은 위해에서 다른 손실을 만듭니다.",
        "boundary": "사례의 10%와 20%는 취약성 가운데 민감성만 단순화한 값이고 복구 기간이나 회복 능력의 차이는 들어 있지 않습니다. 실제 위험은 세 숫자를 언제나 단순 곱하는 공식 하나로 정해지지 않습니다."
```

#8 climate-financial-transmission (sectionId comparison → mechanism)
```
old: "id": "climate-financial-transmission",
        "sectionId": "comparison",
        "intuition": "UNDRR은 위험 지역에 있는 사람, 주택과 기반 시설 등을 노출에 포함합니다. 따라서 사례의 자산 300만으로 지역 B의 위험 전체를 대표할 수 없습니다. 거주 인구, 병원 접근과 생활 기반도 따로 조사합니다.",
        "workedExample": "다음 해에 보험료가 오르거나 보장 한도가 줄면 소유자의 지출과 잔여 부담이 커집니다. 대출자는 담보 복구 가능성과 보험 조건을 다시 살필 수 있습니다. 이 경로가 기후 손실의 금융 전달입니다.",
        "boundary": "연간 예상 손실을 계산하려면 다양한 사건의 확률과 각 사건의 손실을 함께 알아야 합니다. 이번 사건의 손실 60만으로 연 보험료나 대출 손실률을 정할 수 없습니다."
new: "id": "climate-financial-transmission",
        "sectionId": "mechanism",
        "intuition": "다음 해에 보험료가 오르거나 보장 한도가 줄면 소유자의 지출과 잔여 부담이 커집니다. 대출자는 담보 복구 가능성과 보험 조건을 다시 살필 수 있습니다. 이 경로가 기후 손실의 금융 전달입니다.",
        "workedExample": "B의 손실 60 중 보험이 40을 지급하고 소유자가 20을 부담한다고 놓습니다(가정). 총물리 손실은 여전히 60이고, 다음 계약에서 보장이 줄면 소유자 몫 20이 더 커지는 쪽으로 손실이 옮겨 갑니다.",
        "boundary": "연간 예상 손실을 계산하려면 다양한 사건의 확률과 각 사건의 손실을 함께 알아야 합니다. 이번 사건의 손실 60만으로 연 보험료나 대출 손실률을 정할 수 없습니다."
```

### src/content/knowledge-graph.ts

#16 지니계수 별칭(measuring-the-spread)
```
old:     aliases: ["넓이 비", "집중도 지수"],
new:     aliases: ["넓이 비", "집중도 지수", "지니계수", "Gini coefficient"],
```

#45 신호 효과 canonicalHref(education-skills-and-signals)
```
old: "canonicalHref": "/economics/institutions/education-skills-and-signals#comparison"}
new: "canonicalHref": "/economics/institutions/education-skills-and-signals#names"}
```

#45 의료 재정 세 기능 canonicalHref(healthcare-payment-systems)
```
old: "canonicalHref": "/economics/institutions/healthcare-payment-systems#mechanism"},
new: "canonicalHref": "/economics/institutions/healthcare-payment-systems#names"},
```

#28 보험 위험 풀 → 역선택·숨은 행동 연결(insurance-risk-pooling). 기존 정본 노드 `adverse-selection-unravelling`·`hidden-action-and-retained-share`에 간선만 추가한다.
```
old: {"to": "insurance-exclusion-limit", "relation": "produces", "reason": "보험 위험 풀의 결과를 확인해야 보험의 면책과 한도가 어디서 생기는지 같은 사례로 추적할 수 있습니다.", "from": "insurance-risk-pool"},
new: {"to": "insurance-exclusion-limit", "relation": "produces", "reason": "보험 위험 풀의 결과를 확인해야 보험의 면책과 한도가 어디서 생기는지 같은 사례로 추적할 수 있습니다.", "from": "insurance-risk-pool"},
  {"to": "insurance-risk-pool", "relation": "extends", "reason": "위험이 큰 사람이 더 많이 가입하면 20명으로 잡은 사고 수가 늘어나는 이유를 보험 위험 풀 사례에 적용합니다.", "from": "adverse-selection-unravelling"},
  {"to": "insurance-risk-pool", "relation": "extends", "reason": "가입 뒤 예방을 줄이는 행동과 자기부담금의 역할을 보험 위험 풀 사례에 적용합니다.", "from": "hidden-action-and-retained-share"},
```

#30 신호 효과 ← 값비싼 표시의 분리 조건(education-skills-and-signals). 기존 정본 노드 `costly-signal-separation`에 간선만 추가한다.
```
old: {"to": "education-signal", "relation": "produces", "reason": "교육의 능력 축적의 결과를 확인해야 자격의 신호 효과가 어디서 생기는지 같은 사례로 추적할 수 있습니다.", "from": "education-human-capital"},
new: {"to": "education-signal", "relation": "produces", "reason": "교육의 능력 축적의 결과를 확인해야 자격의 신호 효과가 어디서 생기는지 같은 사례로 추적할 수 있습니다.", "from": "education-human-capital"},
  {"to": "education-signal", "relation": "extends", "reason": "자격을 얻는 비용이 능력마다 달라야 자격이 능력 정보를 전한다는 분리 조건을 자격의 신호 효과에 적용합니다.", "from": "costly-signal-separation"},
```

#29 이중차분·평행 추세 이름 연결(evidence-measurement-and-causality)
```
old: "definition": "개입한 집단이 개입 없이 어떻게 되었을지를 적절한 비교와 가정으로 평가하는 방법입니다.", "canonicalHref": "/economics/institutions/evidence-measurement-and-causality#mechanism"},
new: "definition": "개입한 집단이 개입 없이 어떻게 되었을지를 적절한 비교와 가정으로 평가하는 방법입니다. 두 집단의 전후 변화 차이를 빼는 이중차분(difference-in-differences)과 그 전제인 평행 추세(parallel trends) 가정이 대표 예입니다.", "canonicalHref": "/economics/institutions/evidence-measurement-and-causality#mechanism"},
```


#8 grid-connection-constraint canonicalHref #mechanism → #names
```
old: "id": "grid-connection-constraint", "kind": "concept", "domain": "economics", "label": "전력망 접속 제약", "definition": "발전이나 수요 설비가 있어도 연결 가능한 송배전 용량과 인허가가 부족하면 전기를 주고받지 못하는 조건입니다.", "canonicalHref": "/economics/infrastructure/electricity-grid-and-power#mechanism"}
new: "id": "grid-connection-constraint", "kind": "concept", "domain": "economics", "label": "전력망 접속 제약", "definition": "발전이나 수요 설비가 있어도 연결 가능한 송배전 용량과 인허가가 부족하면 전기를 주고받지 못하는 조건입니다.", "canonicalHref": "/economics/infrastructure/electricity-grid-and-power#names"}
```

#8 electricity-system-cost canonicalHref #comparison → #mechanism
```
old: "id": "electricity-system-cost", "kind": "concept", "domain": "economics", "label": "전력 시스템 비용", "definition": "발전비뿐 아니라 망·운영·예비력·저장 비용을 합쳐 최종 공급에 필요한 자원을 보는 장부입니다.", "canonicalHref": "/economics/infrastructure/electricity-grid-and-power#comparison"}
new: "id": "electricity-system-cost", "kind": "concept", "domain": "economics", "label": "전력 시스템 비용", "definition": "발전비뿐 아니라 망·운영·예비력·저장 비용을 합쳐 최종 공급에 필요한 자원을 보는 장부입니다.", "canonicalHref": "/economics/infrastructure/electricity-grid-and-power#mechanism"}
```

#8 food-value-chain-gap canonicalHref #mechanism → #names
```
old: "id": "food-value-chain-gap", "kind": "concept", "domain": "economics", "label": "식품 가치사슬의 가격 간격", "definition": "농가에서 소비자까지 단계별 비용·손실·마진을 같은 단위로 더해 소비자가격을 설명하는 장부입니다.", "canonicalHref": "/economics/infrastructure/food-chain-and-prices#mechanism"}
new: "id": "food-value-chain-gap", "kind": "concept", "domain": "economics", "label": "식품 가치사슬의 가격 간격", "definition": "농가에서 소비자까지 단계별 비용·손실·마진을 같은 단위로 더해 소비자가격을 설명하는 장부입니다.", "canonicalHref": "/economics/infrastructure/food-chain-and-prices#names"}
```

#8 perishable-bargaining-power canonicalHref #comparison → #names
```
old: "id": "perishable-bargaining-power", "kind": "concept", "domain": "economics", "label": "부패성과 협상력", "definition": "저장 기간이 짧은 상품에서 판매 시점을 선택할 수 있는 능력이 거래 조건에 미치는 힘입니다.", "canonicalHref": "/economics/infrastructure/food-chain-and-prices#comparison"}
new: "id": "perishable-bargaining-power", "kind": "concept", "domain": "economics", "label": "부패성과 협상력", "definition": "저장 기간이 짧은 상품에서 판매 시점을 선택할 수 있는 능력이 거래 조건에 미치는 힘입니다.", "canonicalHref": "/economics/infrastructure/food-chain-and-prices#names"}
```

#8 water-full-service-cost canonicalHref #mechanism → #names
```
old: "id": "water-full-service-cost", "kind": "concept", "domain": "economics", "label": "수도 서비스의 전체 비용", "definition": "취수·정수·배관·누수·하수 처리와 장기 설비 교체를 포함해 급수 서비스를 지속하는 비용입니다.", "canonicalHref": "/economics/infrastructure/water-utility-and-tariffs#mechanism"}
new: "id": "water-full-service-cost", "kind": "concept", "domain": "economics", "label": "수도 서비스의 전체 비용", "definition": "취수·정수·배관·누수·하수 처리와 장기 설비 교체를 포함해 급수 서비스를 지속하는 비용입니다.", "canonicalHref": "/economics/infrastructure/water-utility-and-tariffs#names"}
```

#8 water-tariff-incidence canonicalHref #comparison → #names
```
old: "id": "water-tariff-incidence", "kind": "concept", "domain": "economics", "label": "수도 요금의 부담 귀속", "definition": "고정요금·사용량요금·세금 보조를 누가 실제로 내고 누가 서비스 혜택을 받는지 보는 장부입니다.", "canonicalHref": "/economics/infrastructure/water-utility-and-tariffs#comparison"}
new: "id": "water-tariff-incidence", "kind": "concept", "domain": "economics", "label": "수도 요금의 부담 귀속", "definition": "고정요금·사용량요금·세금 보조를 누가 실제로 내고 누가 서비스 혜택을 받는지 보는 장부입니다.", "canonicalHref": "/economics/infrastructure/water-utility-and-tariffs#names"}
```

#8 transport-accessibility canonicalHref #mechanism → #names
```
old: "id": "transport-accessibility", "kind": "concept", "domain": "economics", "label": "교통 접근성", "definition": "사람이 주어진 시간·비용 안에서 일자리와 서비스에 도달할 수 있는 범위입니다.", "canonicalHref": "/economics/infrastructure/transport-access-and-land-value#mechanism"}
new: "id": "transport-accessibility", "kind": "concept", "domain": "economics", "label": "교통 접근성", "definition": "사람이 주어진 시간·비용 안에서 일자리와 서비스에 도달할 수 있는 범위입니다.", "canonicalHref": "/economics/infrastructure/transport-access-and-land-value#names"}
```

#8 transit-land-rent-shift canonicalHref #comparison → #names
```
old: "id": "transit-land-rent-shift", "kind": "concept", "domain": "economics", "label": "교통 이익의 지대 이동", "definition": "공공 교통 투자로 좋아진 위치의 이익 일부가 토지 임대료와 가격에 반영되는 경로입니다.", "canonicalHref": "/economics/infrastructure/transport-access-and-land-value#comparison"}
new: "id": "transit-land-rent-shift", "kind": "concept", "domain": "economics", "label": "교통 이익의 지대 이동", "definition": "공공 교통 투자로 좋아진 위치의 이익 일부가 토지 임대료와 가격에 반영되는 경로입니다.", "canonicalHref": "/economics/infrastructure/transport-access-and-land-value#names"}
```

#8 housing-residual-land canonicalHref #mechanism → #names
```
old: "id": "housing-residual-land", "kind": "concept", "domain": "economics", "label": "주택 토지 잔여가치", "definition": "주택 판매 또는 임대 가치에서 공사·금융·허가·정상 이익을 빼 토지에 지불할 수 있는 금액입니다.", "canonicalHref": "/economics/infrastructure/housing-land-and-supply#mechanism"}
new: "id": "housing-residual-land", "kind": "concept", "domain": "economics", "label": "주택 토지 잔여가치", "definition": "주택 판매 또는 임대 가치에서 공사·금융·허가·정상 이익을 빼 토지에 지불할 수 있는 금액입니다.", "canonicalHref": "/economics/infrastructure/housing-land-and-supply#names"}
```

#8 housing-permit-lag canonicalHref #comparison → #names
```
old: "id": "housing-permit-lag", "kind": "concept", "domain": "economics", "label": "주택 공급의 허가 시간", "definition": "토지 권리와 인허가·기반 시설·시공 기간 때문에 수요 변화가 신규 입주로 이어지는 데 걸리는 시간입니다.", "canonicalHref": "/economics/infrastructure/housing-land-and-supply#comparison"}
new: "id": "housing-permit-lag", "kind": "concept", "domain": "economics", "label": "주택 공급의 허가 시간", "definition": "토지 권리와 인허가·기반 시설·시공 기간 때문에 수요 변화가 신규 입주로 이어지는 데 걸리는 시간입니다.", "canonicalHref": "/economics/infrastructure/housing-land-and-supply#names"}
```

#8·#9 climate-risk-components canonicalHref #mechanism → #names, 위해 정의를 IPCC 원문(자연적·인위적)으로
```
old: "id": "climate-risk-components", "kind": "concept", "domain": "economics", "label": "기후 위험의 세 요소", "definition": "자연 현상의 위험, 그곳에 있는 사람·자산의 노출, 피해를 키우거나 줄이는 취약성을 나누는 틀입니다.", "canonicalHref": "/economics/infrastructure/climate-risk-and-exposure#mechanism"}
new: "id": "climate-risk-components", "kind": "concept", "domain": "economics", "label": "기후 위험의 세 요소", "definition": "손실을 일으킬 수 있는 자연적·인위적 물리 사건이나 추세의 가능성인 위해(hazard), 그곳에 있는 사람·자산의 노출, 피해 민감성과 대응·적응 능력의 부족을 담는 취약성을 나누는 틀입니다(IPCC AR6 WGII 용어집).", "canonicalHref": "/economics/infrastructure/climate-risk-and-exposure#names"}
```

#8 climate-financial-transmission canonicalHref #comparison → #mechanism
```
old: "id": "climate-financial-transmission", "kind": "concept", "domain": "economics", "label": "기후 손실의 금융 전달", "definition": "재난 손실과 보험 조건 변화가 담보·대출·지방 재정에 전달되는 경로입니다.", "canonicalHref": "/economics/infrastructure/climate-risk-and-exposure#comparison"}
new: "id": "climate-financial-transmission", "kind": "concept", "domain": "economics", "label": "기후 손실의 금융 전달", "definition": "재난 손실과 보험 조건 변화가 담보·대출·지방 재정에 전달되는 경로입니다.", "canonicalHref": "/economics/infrastructure/climate-risk-and-exposure#mechanism"}
```
