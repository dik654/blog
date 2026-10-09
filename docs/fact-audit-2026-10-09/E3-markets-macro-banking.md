# E3-markets-macro-banking 감사 원장

## 적용 결과
적용일 2026-10-09. 본문 적용 15(#1~10·12~14·16·17) · OK 참고행 반영 2(#15·#18) · 후속 작업 2(#11·#19) · 보류 0. 이 가운데 11건(#1·2·3·4·8·9·10·12·14·16·17)은 공용 데이터 동기화가 필요해 끝의 `## 공용 파일 수정 목록`에 old→new로 올림.

| # | 판정 | 조치 |
|---|---|---|
| 1 | LINK | 적용: `funds-etfs-and-etns.tsx` citeKey 3의 href를 `…/investor-alerts/sec`로 바꾸고 원문 발췌·확인일·교체 사유를 적음. evidence·registration 쪽은 공용파일 목록으로 이관 |
| 2 | WRONG | 적용: 본문 머리 주석·인용 블록 2곳을 "초판 6장(3판 기준 7장)"으로 바꾸고 V* 중복 번호 설명을 추가함. `FourNumbersViz.tsx` 주석·note, 같은 오류가 있던 `CapitalMovesViz.tsx` note도 수정. evidence·learning·registration은 공용파일 목록 |
| 3 | WRONG | 적용: 쪽수를 14·20~21·21~23·24·25·26쪽(“512 to 10”은 26쪽 첫 줄)으로 고치고 "26쪽 이미지 대조" 주장을 지움. 대신 "쪽수는 OCR 쪽 머리글 기준, 쪽 이미지로 따로 대조하지 않음"이라고 적음. `TwoRatiosViz.tsx` 주석 3곳과 note도 수정. 공용 데이터는 목록 |
| 4 | LINK | 적용: href를 ETF 팩트시트 `etfs/FS-JEPI.PDF`로 바꿈. 2026-10-09에 직접 내려받아(200, 2쪽, "Fact Sheet August 31, 2026 / JPMorgan Equity Premium Income ETF / Ticker: JEPI") 같은 ELN Risk Summary 문장이 있는 것을 확인했고, 본문 귀속은 "JEPI의 2026년 8월 31일 팩트시트"로 고침 |
| 5 | MISLEADING | 적용(근거를 고쳐서): 행사가격 서술을 "현재 지수와 같거나 그보다 높게(at or above)"로 바꿈. **원장의 "80% 커버 하한"은 원문과 다름**: SEC 497K 원문을 다시 열어 보니 "The Fund invests at least 80% of its total assets in the securities of the Cboe NASDAQ-100® BuyWrite V2 Index"였고, 이것은 콜 매도 비율이 아니라 투자 정책 하한(60일 전 통지로 변경 가능)임. 9절에 원문 그대로 이 하한을 넣고 "커버 비율 80%"라고는 쓰지 않음 |
| 6 | CALC | 적용: AlgorithmBlock note를 "E −1, U +1, 분모 E+U는 그대로이고 분자만 늘어남. 9/69=13.0% → 10/69=14.5%. 나머지 두 조건을 통과하지 못하면 분모만 1 줄어 9/68=13.2%"로 고침 |
| 7 | MISLEADING | 적용: who-counts의 예고문에서 "전제 하나가 오늘날에는 성립하지 않습니다"를 지우고 "그 전제가 무엇에 기댔는지를 읽습니다. 오늘날에도 성립하는지는 자료로 따질 문제여서 그 글도 판정하지 않습니다"로 바꿔 리카도 글과 맞춤 |
| 8 | LINK | 적용: 라벨을 "pp.6–7, 17"로 고침. 공용 데이터는 목록 |
| 9 | LINK | 적용: 라벨에서 "definition"을 지우고 "Global X · QYLD 펀드 페이지(미국 상장)"로 바꿈. 본문 각주에 "수치만 있고 정의 문구 없음, 팩트시트 403으로 미대조"를 적음 |
| 10 | MISSING | 적용: FSC 2020-05-18 보도자료를 2026-10-09에 다시 열어 문구를 대조함. 7절에 한국 괴리율 의무 범위 3%/6%와 투자유의종목 기준 30%→6%/12%(단일가 매매, 거래 정지)를 넣고 1만 원 NAV 사례(1만300원, 1만600원, 1만100원의 괴리율 1%)를 붙임. 9절에는 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만 원, 신용거래 제외, 위탁증거금 100%, 사전 온라인 교육을 넣음. 둘 다 "한국 관할, 2020년 발표 시점의 방안, 현행 KRX 규정 원문으로는 미확인"을 밝힘. citeKey 6으로 인용 블록 추가 |
| 11 | MISSING | 후속 작업: 금감원 1차 자료(fss.or.kr)를 열 수 없어 본문에 넣지 않음 |
| 12 | UNVERIFIED | 적용: CME 인용 블록 2개에 "2026-10-09 재확인 시 자동 조회 차단, 검색 요약으로만 확인(미검증)"을 적음. 원문 재대조는 후속 작업 |
| 13 | LINK | 적용: "20~21쪽"으로 고침(#3과 같은 인용 블록) |
| 14 | MISLEADING | 적용: 라벨을 "2013 결의의 2023년 개정 통합본(ICLS/21/2023/RES. II)"로 고치고, 2013 원문 Wayback 링크와 "인용한 항은 두 판에서 같음"을 본문 인용 블록에 넣음. 공용 데이터는 목록 |
| 15 | OK | 반영: "19~20쪽"을 "20쪽"으로 고침 |
| 16 | LINK | 적용: "금융회사별 1인당"을 지우고 FSC 2025-07-22 보도자료 「’25.9.1일부터 예금을 1억원까지 보호합니다」(https://fsc.go.kr/edu/news/85077)를 2026-10-09에 열어 확인한 내용으로 바꿈. 같은 금융회사 안에서 합산하고, 여러 회사에 나누면 회사마다 따로 적용하며, 퇴직연금(DC·IRP 등 보호상품 운용분)·연금저축·사고보험금은 같은 회사 안에서도 별도 1억 원임. citeKey 12 추가. "1인당" 표현은 보도자료에 없어 쓰지 않음 |
| 17 | LINK | 적용: SEC 보도자료 2023-129(2023-07-12)를 열어 게이트 폐지, 기관용 prime·tax-exempt MMF의 순환매 5% 초과 시 유동성 수수료 의무, 비정부 MMF의 재량 수수료를 확인하고 본문과 citeKey 13에 넣음. citeKey 10 각주에 "이 페이지엔 수수료 설명 없음"을 적음 |
| 18 | OK | 반영: 신한 각주를 실제 문구(분류, "낙아웃형 ELB는 … 원금이 지급됩니다")와 "JS 렌더링 필요"로 바꿈 |
| 19 | MISSING | 후속 작업: 인용할 통계(Maddison, UN WPP)를 이번에 1차 자료로 열지 않음. 본문에는 "이 두 판정은 일반적 서술이고 통계 자료를 직접 인용하지 않았다"는 범위 문장만 넣음 |

부수 반영: Ricardo 인용 블록 2에 원문 "no other difference in the real or labour price of commodities, than the additional quantity of labour required to convey them to the various markets"를 이어 붙임(원장 글별 기록의 경미한 빠진 내용).

변경한 글 파일(직접 수정):
- `src/pages/articles/markets/funds-etfs-and-etns.tsx`
- `src/pages/articles/markets/covered-calls-and-income-funds.tsx`
- `src/pages/articles/markets/financial-products-and-claims.tsx`
- `src/pages/articles/markets/forwards-and-futures.tsx`
- `src/pages/articles/macro/what-ricardo-assumed.tsx`, `…/viz/FourNumbersViz.tsx`, `…/viz/CapitalMovesViz.tsx`
- `src/pages/articles/macro/who-counts-as-unemployed.tsx`
- `src/pages/articles/macro/why-per-head-stalls.tsx`, `…/viz/TwoRatiosViz.tsx`
- `src/pages/articles/macro/what-the-price-level-hides.tsx`

검증: 8개 route마다 check-article의 개별 검사(learning-contract, viz-style, korean-naturalness, term-density, term-pair-wrapping, knowledge-graph, reading-order)는 통과. prose-readability는 다른 글(gpu/ai/blockchain 등)의 기존 항목 때문에 rc=1이지만 이 원장의 글은 "재검토 필요" 목록에 없음. 이번에 늘어난 긴 문단은 260자 미만으로 나눔. `npx eslint`(11개 파일) 통과. check-article.sh 안의 `merge-registrations` 단계는 공용 파일에 쓰기 때문에 돌리지 않음. `tsc`는 통합자 몫.

확인일: 2026-10-09. 글 15편. 열어 본 URL 87개(성공 70 / 실패 17; 실패는 봇 차단·404·web.archive.org 접근 불가, 아래 표).

검증 방법: 15편의 본문(tsx 인라인)·차트 컴포넌트(`CoveredCallPayoffChart.tsx`·`OptionPayoffChart.tsx`·macro 4편의 `viz/*.tsx`)·`src/content/*/articles.ts` 카탈로그·`article-evidence.ts`·`article-learning.ts`·`knowledge-graph.ts` 정의를 전부 읽고, 수치 사례는 Python으로 전수 재계산했다(아래 CALC 기록). 링크는 WebFetch로 열고, 403·타임아웃 페이지는 curl(브라우저 UA)·로컬 PDF/DOCX 텍스트 추출로 2차 시도했다. 1차 자료(Ricardo·Fisher·Malthus·ILO)와 공식 문서 29건은 두 보조 검증 작업으로 분담해 원문 전문을 내려받아 대조했다.

## 요약
- 발견: WRONG 2 · OUTDATED 0 · MISLEADING 3 · CALC 1 · LINK 8 · MISSING 3 · UNVERIFIED 2 (표 19행 중 #15·#18은 OK 참고행)
- 수치 사례 재계산: 15편 전부 일치(CALC 오류 0건; 단 who-counts의 분모 서술 1건은 논리 오류로 CALC 분류).
- 가장 중요한 발견:
  1. `funds-etfs-and-etns.tsx:97` — "SEC · Leveraged and Inverse ETFs" 인용 링크(`investor-bulletins-12`)가 실제로는 "Financial Professionals' Use of Professional Honors" 게시물로 연결됨(엉뚱한 문서). 올바른 문서는 `…/alerts-bulletins/investor-alerts/sec`("Updated Investor Bulletin: Leveraged and Inverse ETFs").
  2. `what-ricardo-assumed.tsx:17,93,293` + `article-evidence.ts:10603` — Gutenberg eBook 33310은 1817년 초판이 맞지만, 초판에서 「On Foreign Trade」는 **제6장**(V·V* 중복 번호 때문)이고 7장은 「On Taxes」. "초판 7장"은 3판(1821) 장 번호를 초판에 붙인 것.
  3. `why-per-head-stalls.tsx:121–137` + `TwoRatiosViz.tsx:5,20,59` + `article-evidence.ts:10576` — Malthus 초판 쪽수가 전부 어긋남: 1억1200만/3500만/7700만 문장은 **24쪽**(글: 25~26쪽), 1·2·4…512 대 1·2…10은 **25쪽**, "512 to 10"은 **26쪽 첫 줄**(글: 28쪽, 차트: 27쪽), 미국 25년 배가는 **20~21쪽**(글: 21쪽). "26쪽 문장을 쪽 이미지로 대조했다"는 서술과 모순.
  4. `covered-calls-and-income-funds.tsx:98,103` — "J.P. Morgan · JEPI Fact Sheet" 링크(`fs-epi-c.pdf`)는 ETF JEPI가 아니라 **뮤추얼펀드 "JPMorgan Equity Premium Income Fund"(Class A/C/I/R5/R6, JEPAX·JEPCX·JEPIX)** 2026-06-30 팩트시트. ELN 위험 문구는 있으나 본문의 "JEPI 공식 자료"라는 귀속이 틀림.
  5. `covered-calls-and-income-funds.tsx:95,101` — QYLD 요약설명서(2026-03-01)는 콜 행사가를 "generally **at or above** the prevailing market price"로, 커버 비율을 "**at least 80%**"로 적는데, 본문은 "현재 지수 근처"로 옮기고 80% 하한은 어디에도 없음. 9절이 매도 비율(50% 사례)을 다루면서 실제 펀드의 비율 조항을 빠뜨림.

## 발견 (심각도 순)
| # | route | 위치(file:line) | 주장(원문 인용) | 판정 | 근거(URL + 인용문) | 제안 수정 |
|---|---|---|---|---|---|---|
| 1 | markets/funds-etfs-and-etns | `src/pages/articles/markets/funds-etfs-and-etns.tsx:97`; `src/content/article-evidence.ts:11122` | `<CitationBlock source="SEC · Leveraged and Inverse ETFs" citeKey={3} href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-12">` | LINK | curl 200, 페이지 `<title>`: "Investor Bulletin: Financial Professionals' Use of Professional Honors – Awards, Rankings, and Designations \| Investor.gov". 레버리지 ETF 내용 없음. 올바른 문서: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/sec — `<title>` "Updated Investor Bulletin: Leveraged and Inverse ETFs", 본문 "Most leveraged and inverse ETFs "reset" daily, meaning that they are designed to achieve their stated objectives on a daily basis. Their performance over longer periods of time -- over weeks or months or years -- can differ significantly from the stated multiple of the performance (or inverse of the performance) of their underlying index" | href를 `…/alerts-bulletins/investor-alerts/sec`로 교체하고 evidence.ts도 동일 수정 |
| 2 | macro/what-ricardo-assumed | `src/pages/articles/macro/what-ricardo-assumed.tsx:17,93,293`; `src/content/article-evidence.ts:10603–10608`; `what-ricardo-assumed/viz/FourNumbersViz.tsx:5,46` | "원자료는 Ricardo(1817) 초판 7장", source="… (London: John Murray, 1817) 초판, 7장 「On Foreign Trade」" | WRONG | https://www.gutenberg.org/cache/epub/33310/pg33310.txt (200) — 표제지 "LONDON: JOHN MURRAY, ALBEMARLE-STREET 1817"(초판 확인). 목차: "V. On Wages 90 / V*. On Profits 116 / **VI. On Foreign Trade** 146 / VII. On Taxes 186"; 본문 표제 "CHAPTER VI. / ON FOREIGN TRADE." 초판은 「On Profits」를 두 번째 V장(V*)으로 매겨 외국무역이 VI장. 7장이 되는 것은 3판(1821)/Sraffa판. 인용문 7건(100·120·eighty·ninety, "Such an exchange could not take place…", "by considering the difficulty with which capital moves…", "It would undoubtedly be advantageous…", "if capital freely flowed…", "the fancied or real insecurity…", "These feelings, which I should be sorry to see weakened") 전부 원문 그대로 확인 | "초판 6장(초판은 「On Profits」를 V*로 매겨 외국무역이 VI장; 3판 기준 7장)"으로 고치고 evidence·viz 주석도 수정 |
| 3 | macro/why-per-head-stalls | `src/pages/articles/macro/why-per-head-stalls.tsx:121,127–136`; `why-per-head-stalls/viz/TwoRatiosViz.tsx:5,13,20,59`; `src/content/article-evidence.ts:10576–10582` | "초판, 14·21·25~28쪽", "섬의 100년 셈은 25~26쪽", "225년 뒤의 "512 to 10"은 28쪽", "21쪽에 적습니다", "14쪽과 26쪽의 문장은 해당 쪽 이미지를 직접 열어 대조"; 차트 "Malthus 27쪽: 세계로 넓혔을 때의 두 수열", "초판 25~27쪽" | WRONG | https://archive.org/stream/essayonprincipl00malt/essayonprincipl00malt_djvu.txt (200; 표제지 "PRINTED FOR J. JOHNSON … 1798"). 14쪽 "Population, when unchecked, increases in a geometrical ratio. Subsistence increases only in an arithmetical ratio." ✓. **20~21쪽**: "In the United States of America … the population has been found to double itself in twenty-five years. This ratio of increase … [p.21] as the result of actual experience, we will take as our rule". **21~23쪽** 섬 설정("this Island", "about seven millions"). **24쪽**(머리글 "24 AN ESSAY ON THE"): "the population would be one hundred and twelve millions, and the means of subsistence only equal to the support of thirty-five millions; which would leave a population of seventy-seven millions totally unprovided for". **25쪽**: "1, 2, 4, 8, 16, 32, 64, 128, 256, 512, &c. and subsistence as — 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, &c. In two centuries and a quarter, the population would be to the means of sub-" **26쪽** 첫 줄 "sistence as 512 to 10". 글의 25~26·28·21쪽, 차트의 27쪽 전부 불일치; "26쪽 쪽 이미지 대조" 주장과도 모순 | 쪽수를 14·20~21·21~24·25~26으로 정정, 본문·evidence·TwoRatiosViz 주석을 한 값으로 통일 |
| 4 | markets/covered-calls-and-income-funds | `src/pages/articles/markets/covered-calls-and-income-funds.tsx:98,103`; `src/content/article-evidence.ts:11715` | "JEPI 공식 자료는 ELN의 유동성과 발행 상대방 위험을 설명합니다", `source="J.P. Morgan · JEPI Fact Sheet, ELN Risk Summary" href="…/fact-sheet/specialty/fs-epi-c.pdf"` | LINK | PDF 다운로드(200, 136KB) → pdftotext 1~3행: "Fact Sheet June 30, 2026 / **JPMorgan Equity Premium Income Fund** / A Shares: JEPAX C Shares: JEPCX I Shares: JEPIX R5 Shares: JEPSX R6 Sh…". ETF JEPI가 아니라 같은 전략의 뮤추얼펀드(Class C 기준) 팩트시트. ELN 문구는 존재: "Investments in Equity-Linked Notes (ELNs) are subject to liquidity risk, which may make ELNs difficult to sell and value. Lack of liquidity may also cause the value of the ELN to decline. Since ELNs are in note form, they are subject to certain debt securities risks, such as credit or counterparty risk." ETF 팩트시트는 별도 파일 https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/etfs/FS-JEPI.PDF (검색 결과 제목 "Fact Sheet August 31, 2026 JPMorgan Equity Premium Income ETF Ticker: JEPI") | href를 FS-JEPI.PDF로 바꾸거나 라벨을 "JPMorgan Equity Premium Income Fund(뮤추얼펀드) 팩트시트"로 정정 |
| 5 | markets/covered-calls-and-income-funds | `covered-calls-and-income-funds.tsx:95,101` | "콜은 통상 현재 지수 근처 가격으로 정하고 만기 하루 전에 닫습니다"; 9절 매도 비율 논의 | MISLEADING | https://www.sec.gov/Archives/edgar/data/1432353/000143235326000239/a497knasdaq100coveredcall.htm (200, "March 1, 2026"): 펀드는 "at least 80%"를 커버드콜 전략에 투자하고, 콜은 "an exercise price generally **at or above** the prevailing market price of the Reference Index", "held until one day prior to the expiration date … liquidated at a volume-weighted average price", "be settled in cash", "only be subject to exercise on its expiration date" | "현재 지수 또는 그 위"로 옮기고, 9절에 "QYLD 설명서 자체가 포트폴리오의 80% 이상을 커버드콜 전략에 두도록 정해 100% 매도를 보장하지 않는다"를 추가 |
| 6 | macro/who-counts-as-unemployed | `src/pages/articles/macro/who-counts-as-unemployed.tsx:302–304` | "최소 시간을 올린다 → 일하는 사람이 줄고 실업자가 는다 … 분자와 분모가 모두 움직이지만 분자가 더 크게 늘어 실업률이 올라갑니다" | CALC | 사람이 E에서 U로 옮기면 U→U+1, E→E−1이므로 분모 E+U는 **불변**. 재계산: 100명 보기(E=60,U=9)에서 1명 이동 시 10/69=14.5% > 9/69=13.0%, 분모 69 그대로. 같은 글의 ExplainedFormula(`:166–178`)는 분자·분모가 함께 1씩 줄어드는 경우(탈락)를 정확히 적고 있어 내부 불일치 | "분모(E+U)는 그대로이고 분자만 늘어 실업률이 올라갑니다"로 수정(나머지 두 조건을 통과하지 못해 아예 빠지는 경우만 분모가 줄어듦) |
| 7 | macro/who-counts-as-unemployed ↔ macro/what-ricardo-assumed | `who-counts-as-unemployed.tsx:434–437` vs `what-ricardo-assumed.tsx:339–345` | 전자: "그 논증이 세워진 자리로 돌아가 … 전제 하나가 오늘날에는 성립하지 않습니다." 후자: "그러면 오늘날에는 그 전제가 깨진 것입니까 — 이 글은 그 판정을 하지 않습니다. … 이 글은 그 자료를 읽지 않았으니 그 판정을 싣지 않습니다." | MISLEADING | 두 글의 본문 대조(내부 일관성). 리카도 글은 명시적으로 "오늘날 깨졌다"는 판정을 보류하는데, 앞 글의 예고문은 그 판정을 단정 | who-counts 핸드오프를 "전제 하나가 무엇에 기댔는지를 읽습니다"로 바꾸거나, 리카도 글에 자료 근거(예: BIS·IMF 자본이동 통계)를 붙여 판정을 실제로 싣기 |
| 8 | markets/covered-calls-and-income-funds | `covered-calls-and-income-funds.tsx:88`; `article-evidence.ts:11691` | `source="Fidelity/OIC · Exercise and Assignment, transcript pp.6–7,18"` "조기 행사와 기존 계약 종료·새 계약 개시를 확인" | LINK | PDF 다운로드(200, 192KB), pdftotext 쪽 분리: 배당락 조기행사는 6~7쪽 ✓ ("ex-dividend date, you might consider exercising early" p.6; "the day before the ex-dividend" p.7). 롤링 정의는 **17쪽**(인쇄 쪽번호 17): "All rolling means, is you're closing the existing position and opening up a new one, that's all you're doing, that's all rolling means." 18쪽 아님 | "pp.6–7, 17"로 정정 |
| 9 | markets/covered-calls-and-income-funds | `covered-calls-and-income-funds.tsx:103` citeKey 6; `article-evidence.ts:11726` | `source="Global X · QYLD distribution rate definition" href="https://www.globalxetfs.com/funds/qyld"` | LINK | WebFetch 200: 페이지에 "Distribution Rate 11.16%", "30-Day SEC Yield", "Trailing 12-Month Distribution" 수치만 있고 정의 문구·각주 없음(두 번 프롬프트로 확인). 팩트시트 PDF(https://assets-cms.globalxetfs.com/QYLD-factsheet.pdf)는 curl 403 | 정의가 실린 문서(팩트시트·설명서)로 href를 바꾸거나 라벨에서 "definition"을 빼기 |
| 10 | markets/funds-etfs-and-etns | `funds-etfs-and-etns.tsx:89,105–107` | "한국에서도 상장명만 보지 말고 투자설명서의 발행자·신탁재산·만기·중도상환 조건을 확인해야 합니다", 7절 괴리 축소 메커니즘, 10절 "설정 중단 조건" | MISSING | https://fsc.go.kr/po010101/74332 (200, 금융위 2020-05-18 「ETFㆍETN시장을 보다 건전하게 발전시키겠습니다」): "규정상 괴리율 의무 범위(국내 기초자산 3%, 해외 기초자산 6%)", 투자유의종목 지정 기준 "괴리율 30% → 6% or 12%하여 괴리율 확대를 조기에 차단", "레버리지(±2배) ETFㆍETN을 매수하려는 개인 일반투자자에 대하여 기본예탁금 1,000만원을 적용", "레버리지 ETF·ETN을 투자하려는 개인 투자자(전문투자자 제외)에 대해 사전 온라인 교육 이수를 의무화". 글의 괴리 설명(7절)은 미국 AP 차익거래만 다루고, 한국 시장의 LP 괴리율 의무·투자유의종목·레버리지 진입 요건이 없음 | 7절 또는 9절에 KRX LP 괴리율 의무(3%/6%)·투자유의종목(6%/12%)·레버리지 기본예탁금·사전교육을 한 단락 추가(국내 규정은 2020년 이후 개정 여부를 KRX 규정으로 재확인) |
| 11 | markets/covered-calls-and-income-funds | `covered-calls-and-income-funds.tsx:99,111` | 분배금·자본환급·한국 과세 구분 서술(QYLD 19a만 인용) | MISSING | 한국 투자자용 글인데 국내 커버드콜 ETF 명칭·분배율 규제가 없음. 금감원 2024-07~08 소비자경보(종목명 분배율은 목표치이며 확정 아님, '프리미엄'은 옵션 프리미엄)와 상품명 변경 조치 — 1차 자료(fss.or.kr)는 확인일 현재 점검 중(10-08~10 전기안전점검 공지만 표시)이라 열지 못했고, 2차 보도(https://core.asiae.co.kr/article/2024080116120820847, https://biz.newdaily.co.kr/site/data/html/2024/08/23/2024082300072.html)로만 확인 | 금감원 소비자경보·명칭 규제 단락 추가; fss.or.kr 복구 후 원문 링크 부착 |
| 12 | markets/forwards-and-futures | `forwards-and-futures.tsx:75,84–85` | `excerpt="We mark positions to market twice a day"`; "CME · Contango, Backwardation and Convergence" | UNVERIFIED | https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes — WebFetch 60초 타임아웃 2회, curl(브라우저 헤더) 403(Akamai, 602바이트); `.html` 변형·institute.cmegroup.com 미러도 403. https://www.cmegroup.com/education/courses/introduction-to-ferrous-metals/what-is-contango-and-backwardation — 동일(타임아웃 2회·403). 검색 스니펫에서는 "CME Group marks positions to market twice a day"와 "When a market is in contango, the forward price of a futures contract is higher than the spot price… Over time, as the futures contract approaches maturity, the futures price will converge with the spot price"가 확인되나 페이지 직접 대조 불가 | 접근 가능한 환경에서 원문 재대조; 대체 근거로 CME Rulebook 또는 CME Clearing 공시 PDF 병기 |
| 13 | macro/why-per-head-stalls | `why-per-head-stalls.tsx:131–133` | "25년마다 두 배라는 비율은 당시 미국의 관찰을 근거로 삼은 것이라고 21쪽에 적습니다" | LINK | 위 #3 근거: 해당 문장은 20쪽에서 시작해 21쪽에서 끝남("the population has been found to double itself in twenty-five years. This ratio of increase … [p.21] as the result of actual experience, we will take as our rule"). 원문 표현은 "In the United States of America" | "20~21쪽"으로 정정 |
| 14 | macro/who-counts-as-unemployed | `who-counts-as-unemployed.tsx:106–108`; `article-evidence.ts:10594–10600` | "19차 결의(2013) · 21차 회의(2023)에서 개정, 47항", href `wcms_230304.pdf` | MISLEADING(경미) | PDF(200, 27쪽) 표지: "ICLS/21/2023/RES. II / Resolution II / Resolution to amend the 19th ICLS resolution concerning statistics of work, employment and labour underutilization / 21st International Conference of Labour Statisticians (Geneva, 11–20 October 2023)"; 서문 "Adopts this 20th day of October 2023 the following amendments". 즉 이 파일은 2023 개정 통합본이며 2013 원문(19쪽)은 Wayback(https://web.archive.org/web/20140429080051id_/http://www.ilo.org/wcmsp5/groups/public/---dgreports/---stat/documents/normativeinstrument/wcms_230304.pdf)에만 있음. 글이 인용한 16·21·27·47·51·55·73(c)항은 두 판에서 동일(개정은 21·22·34·38·60·62항 등) | "2023년 개정 통합본(ICLS/21/2023/RES. II)" 명시; 2013 원문은 Wayback 링크 병기 |
| 15 | macro/what-the-price-level-hides | `what-the-price-level-hides.tsx:314–316` | "손 바뀜이 두 배가 되면 … 0.20·10.00·2.00달러가 되고, 오간 물량이 두 배가 되면 0.05·2.50·0.50달러가 됩니다(19~20쪽)" | OK(참고) | https://archive.org/stream/purchasingpower00fish/purchasingpower00fish_djvu.txt (200): 두 경우 모두 **20쪽** — "$5,000,000 X 40 times a year = 200,000,000 loaves X $ .20 a loaf + 10,000,000 tons X 10.00 a ton + 30,000,000 yards X 2.00 a yard", "$5,000,000 X 20 times a year = 400,000,000 loaves X $ .05 a loaf + 20,000,000 tons X 2.50 a ton + 60,000,000 yards X .50 a yard"; 19쪽은 돈 두 배($10,000,000×20) 사례. "19~20쪽"은 허용 범위 | 그대로 두어도 됨("20쪽"이 더 정확) |
| 16 | markets/financial-products-and-claims | `src/pages/articles/markets/financial-products-and-claims.tsx:97,101–102` | "일반적인 보호 대상 예금의 한도가 금융회사별 1인당 원금과 소정의 이자를 합해 1억 원", "같은 은행의 계좌를 나누어도 합산합니다. 일부 별도 보호 대상의 합산 단위는 구분해야 하며", `excerpt="예금보호한도 1억원(원금 및 이자 포함)"` | LINK | https://www.fsc.go.kr/po010105/85200 (200, 「오늘부터 새로운 예금보호한도 1억원 시대가 열립니다」 2025-09-01, 첨부 PDF 3쪽 포함 전문 확인): "’25.9.1일부터 예금보호한도 1억원(원금 및 이자 포함)이 시행된다" → 발췌·시행일·금액 ✓. 그러나 본문의 "금융회사별 1인당"·"별도 보호 대상(퇴직연금·연금저축·사고보험금 등) 합산 단위" 서술은 이 보도자료 본문·첨부 어디에도 없음(금융회사별/1인당/별도/퇴직연금/연금저축 검색 0건) | 금융회사별 1인당·별도 한도는 예금보험공사 안내 또는 예금자보호법 시행령 개정 보도자료를 추가 인용 |
| 17 | markets/financial-products-and-claims | `financial-products-and-claims.tsx:110,114` | "미국 MMF도 유형에 따라 고정 또는 변동 NAV를 쓰며 유동성 수수료 조건이 다를 수 있습니다", citeKey 10 SEC Money Market Funds | LINK | https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-5 (curl 200): "Stable NAV. Most money market funds – including money market funds intended for retail investors and government money market funds – seek to keep their NAV at a stable $1.00 per share… Floating NAV. Institutional prime and institutional tax-exempt money market funds must "float" their NAV" ✓. 그러나 "liquidity fee"·"gate" 0건 — 유동성 수수료 서술은 인용처가 뒷받침하지 않음(2023년 SEC 개정 규칙에서 게이트 폐지·수수료 의무화는 별도 문서) | SEC 2023 MMF 개혁 릴리스 또는 "Updated Investor Bulletin: Focus on Money Market Funds" 추가 인용 |
| 18 | markets/financial-products-and-claims | `financial-products-and-claims.tsx:82,91` | "ELB·DLB는 만기 원금 지급을 약속하는 파생결합사채로 구별", citeKey 11 신한투자증권 "원금 지급 약정의 차이를 확인합니다" | OK(참고) | https://www.shinhansec.com/wts/wealth-management/els/els_guide_invest_tab1/contents.do — 200이나 JS 셸(4.4KB)이라 WebFetch/curl은 "본문 바로가기"만 보임; 브라우저 렌더링으로 확인: "기초자산에 따른 분류 / 주식/주가지수 ELS 주가연계증권 ELB 주가연계파생결합사채 … / 기타 (실물 등) DLS 파생결합증권 DLB 기타파생결합사채 원자재(금,은,원유), 환율, 금리, 신용 등"; "낙아웃형 ELB는 주가가 하락하더라도 만기까지 보유 시 원금이 지급됩니다". "원금지급형"이라는 라벨 자체는 페이지에 없음 | 인용 각주에 "JS 렌더링 필요" 표시; "원금지급형"을 신한 인용으로 따옴표 처리하지 않기 |
| 19 | macro/why-per-head-stalls | `why-per-head-stalls.tsx:333–336` | "같은 땅에서 거두는 양 자체가 바뀌었고 … 곱해지는 쪽에 가까웠습니다. 둘째, 한 사람 몫이 늘었을 때 사람 수가 그만큼 늘지 않았습니다 … 넉넉해질수록 아이를 덜 낳는 쪽으로 오히려 방향이 뒤집힌 곳도 있습니다." | MISSING | 부품 4의 두 "깨진 가정"은 20세기 농업생산성·인구변천에 관한 사실 주장인데 출처가 없음(evidence.ts에는 Malthus 한 건뿐). 글이 "결론을 지지하지 않는다"고 범위를 선언했어도, "빗나갔다"는 판정 자체는 자료가 필요 | Maddison Project(1인당 GDP 장기 시계열) 또는 UN WPP 출산율 자료 한 건을 인용 블록으로 추가 |

## 글별 검증 기록

### markets/covered-calls-and-income-funds
- 추출한 고유 사실 주장 수: 27, 검증 24, 미검증 3(QYLD 분배율 정의 문구·YouTube 영상 내용·CME 외)
- CALC(전부 일치): Π(S)=100[S−100+3−max(S−105,0)] → S=90: −700, S=103: +600, S=120: +800, S=0: −9700; 손익분기 97; 수익률 −7%/6%/8%; 50% 매도 주당 20−7.5+1.5=14; NAV (88+12−100)/100=0%; 300−45−5=250; 1.08×0.90−1=−2.8%; 19a 0.0022+0.1745=0.1767 ✓. 차트 `CoveredCallPayoffChart.tsx` 함수 `min(price,105)−100+3`과 점(97,0)·(105,8) 일치.
- 연 자료:
  - https://www.optionseducation.org/strategies/all-strategies/covered-call-buy-write — 200 — "Strike price - stock purchase price + premium received" 원문 그대로; 배당락 조기배정 문구 "An exception to that general rule occurs the day before a stock goes ex-dividend, in which case an early assignment would deprive the covered call writer of the stock dividend."
  - https://www.sec.gov/Archives/edgar/data/1432353/000143235326000239/a497knasdaq100coveredcall.htm — 200 — March 1, 2026 요약설명서; "be settled in cash" ✓; "at least 80%", "at or above", "one day prior to the expiration date", "only be subject to exercise on its expiration date"(위 #5).
  - https://assets.globalxetfs.com/funds/tax_supplements/QYLD_Form-19a_09242026.docx — 200(DOCX, XML 본문 추출) — "Record Date: September 21, 2026 Pay Date: September 24, 2026 Distribution Amount Per Share: $0.1767 … Net Investment Income $0.0022 1.24% … Return of Capital $0.1745 98.76%", "The amounts and sources of distributions reported in the Notice are only estimates and are not being provided for tax reporting purposes." 본문 수치·"only estimates" 발췌 ✓.
  - https://am.jpmorgan.com/…/specialty/fs-epi-c.pdf — 200 — 뮤추얼펀드 팩트시트(위 #4).
  - https://globalxetfs.eu/funds/qyld — 200 — "synthetic strategy", "Swap Counterparties: Citi", 지수 "Cboe Nasdaq-100 BuyWrite v2 UCITS Index" → 본문 "합성 운용 명시" ✓.
  - https://www.globalxetfs.com/funds/qyld — 200 — 정의 문구 없음(위 #9).
  - https://www.irs.gov/publications/p515 — 200 — "Publication 515 … For use in 2026"; "Most types of U.S. source income received by a foreign person are subject to U.S. tax of 30%. A reduced rate, including exemption, may apply if there is a tax treaty"; W-8BEN 다수 언급 ✓.
  - https://s.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350542 — 200 — 국세청 2026-04-24 보도자료 "펀드 투자로 해외소득 얻은 금융소득종합과세 대상자는 5월 종합소득세 신고 때 펀드가 낸 세금 공제받으세요"; 대상 "①국내상장 S&P 500 또는 나스닥 100 지수 추종 ETF, ②국내상장 해외부동산 리츠 ETF, ③국내에 설정된 해외 채권형 공모펀드 등" → 본문 "국내 설정 펀드 등" ✓.
  - https://www.fidelity.com/…/Exercise_an_%20assignment_TRANSCRIPT.pdf — 200 — "Monitoring your option trades: Exercise and assignment / Presenters: Edward Modla and Bill Purvin"(Modla는 OIC 강사) ✓; 쪽수 1건 불일치(위 #8).
  - https://www.youtube.com/watch?v=5fRa78w8f0k — oEmbed 200 — title "The Covered Call Options Strategy", author "The Options Industry Council (OIC)", publishDate 2024-07-19; 설명란 챕터 "(4:31) Basics and Example (16:40) Planning (21:06) Managing (35:33) Stock Down (40:38) Stock Up (44:11) At Expiration (48:15) Common Misconceptions" → 본문 4:31·35:33·40:38·48:15 ✓.
  - OIC–OCC 관계: https://www.optionseducation.org/abouttheoptionsindustrycouncil/about-oic (검색 스니펫) "The Options Industry Council® (OIC®), formed in 1992, is an industry educational resource provided by The Options Clearing Corporation® (OCC®)" → "OCC가 운영하는 OIC" ✓ (/about, /about-oic 경로는 404).
- 빠진 내용: QYLD 설명서의 "at least 80%" 커버 비율(#5); 국내 커버드콜 ETF 명칭·분배율 규제(#11); 미국 지수옵션(Section 1256) vs 개별주식옵션 과세 차이는 10절이 "소득 분류"로만 언급 — 한국 거주자 관점에서는 생략 가능.
- OK로 확인한 주요 주장: 최대이익 식 105−100+3=8(OIC); 미국 표준 주식옵션 100주(OIC Options Basics "Equity option contracts usually represent 100 shares"); QYLD 월간 지수콜·만기 전 청산·현금결제·만기일 행사(SEC 497K); 19a 수치·잠정 분류(DOCX); UCITS QYLD 합성(globalxetfs.eu); W-8BEN·조세조약(IRS p515); 국세청 안내 대상(국세청).

### markets/financial-products-and-claims
- 추출한 고유 사실 주장 수: 22, 검증 20, 미검증 2(금융회사별 1인당 합산·유동성 수수료는 인용처 밖)
- CALC(전부 일치): 1000×4%=40 → 1040; 만기일시 60만; 월 원금균등 0.5%×1000만×(12+…+1)/12=32만5000, 마지막 달 원금 83만3333; 구조화 min(0.5×30%,10%)=10% → 1100만; ELS 61%→1060 / 59%→590, 차 470; TDF 0.8×−20%=−16%, 0.4×−20%=−8%; 9900+400=1억300, 초과 300; 리츠 100−30−20−25=25 ✓.
- 연 자료:
  - https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/ — WebFetch 200(curl 403) — "Most of your monthly payment is applied to the interest you owe, and the remainder is applied to paying off the principal." → 7절 원리금균등 서술 ✓
  - https://www.investor.gov/…/investor-bulletins-76 — WebFetch 403 → curl 200 — "Investor Bulletin: Structured Notes"(2015-01-12), "Structured notes have a fixed maturity and include two components – a bond component and an embedded derivative." 발췌 ✓; "Structured notes are unsecured debt obligations of the issuer"
  - https://www.dol.gov/general/topic/retirement/typesofplans — WebFetch 200 — "A defined benefit plan promises a specified monthly benefit at retirement." / "A defined contribution plan, on the other hand, does not promise a specific amount of benefits at retirement." ✓
  - https://kind.krx.co.kr/external/2026/07/30/000632/20260730001461/10603.htm — 200 — "투자설명서 2026년 07월 30일 DB증권 … DB 드림빅 제92회 주가연계파생결합사채(ELB) 5등급(낮은 위험) 금 10,000,000,000원"; "발행인이 재무상태의 악화로 지급불능 상황에 처할 경우 투자자는 투자원금 및 투자수익 모두에 대하여 지급받지 못할수 있다"; "만기 이전에 중도환매 할 경우 발행조건에 따른 원금보장여부와 관계없이 시장상황에 따라 원금손실이 발생할 수 있습니다"; 중도상환가 "공정가액(기준가)의 95% 이상(단, 발행후 6개월까지는 90% 이상)"; "이 금융상품은 예금자보호법에 따라 보호되지 않습니다" → 8·9절 ✓
  - https://www.investor.gov/…/target-date-funds-investor-bulletin — WebFetch 403 → curl 200 — "March 25, 2025" ✓; "Target date retirement funds structured as mutual funds and ETFs do not guarantee that you will have sufficient retirement income, or a specific level of retirement income, at or after the target date."; "to"/"through" 글라이드패스, "Target date funds with the same target date may charge different fees." → 본문 "목표일의 원금이나 생활비를 보장하지 않습니다"는 SEC 문구(은퇴소득 미보장)의 의역
  - 신한투자증권 ELS 안내 — 200(JS 렌더링 필요, 위 #18)
  - https://www.fsc.go.kr/po010105/85200 — 200 — 위 #16
  - https://edie.fdic.gov/print.html — 200 — "The standard insurance amount is $250,000 per depositor, per insured bank, for each ownership category." ✓
  - https://www.eba.europa.eu/…/deposit-guarantee-schemes-data — 200 — "The level of deposit protection in the EU is harmonised at €100,000 (or equivalent amount in the local currency)" ✓(예금자·은행 단위 문구는 DGSD 지침 쪽)
  - https://www.investor.gov/…/investor-bulletins-65 — WebFetch 403 → curl 200 — "Investor Bulletin: Publicly Traded REITs"(2016-08-30), "REITs have to distribute at least 90 percent of their taxable income for the year." ✓
  - https://www.investor.gov/…/mutual-funds-and-exchange-traded-5 — WebFetch 403 → curl 200 — 위 #17
- 빠진 내용: 예금보호 "별도 한도"(퇴직연금·연금저축·사고보험금 각 1억)를 "일부 별도 보호 대상"이라고만 적고 어떤 상품인지·근거가 없음(#16에 포함). 한국 ELS의 녹인(knock-in)·조기상환 관측일 구조는 "붙을 수 있습니다"로 언급만 — 코스피200 기초 ELB 설명서를 인용했으므로 그 설명서의 실제 상환식 한 줄을 넣으면 사례가 닫힘(선택).
- OK로 확인한 주요 주장: SEC Structured Notes "Structured notes have a fixed maturity and include two components – a bond component and an embedded derivative."(curl 200, Investor Bulletin: Structured Notes) ✓; SEC REIT "REITs have to distribute at least 90 percent of their taxable income for the year"(curl 200) — 본문은 "법적 배당 기준" 정도로만 언급; SEC MMF "Most money market funds – including money market funds intended for retail investors and government money market funds – seek to keep their NAV at a stable $1.00 per share… Institutional prime and institutional tax-exempt money market funds must "float""(curl 200) → 본문 "유형에 따라 고정 또는 변동 NAV" ✓.

### markets/forwards-and-futures
- 추출한 고유 사실 주장 수: 14, 검증 11, 미검증 3(CME 2개 페이지·FAQ 발췌)
- CALC(전부 일치): 35만: 3500−500=3000, 25만: 2500+500=3000; 36만 vs 정산 35만: 3600−500=3100; 롤 100×(30−31.5)=−150만; CIP 1000×1.04/1.02=1019.61 ✓.
- 연 자료:
  - https://www.bis.org/publ/qtrpdf/r_qt1609e.htm — 200 — "Covered interest parity lost: understanding the cross-currency basis", Borio·McCauley·McGuire·Sushko, BIS Quarterly Review 2016-09-18; "Covered interest parity verges on a physical law in international finance. And yet it has been systematically violated since the Great Financial Crisis." 본문의 CIP 단순식은 Box A의 S·F·r·r* 틀과 일치하되, 본문이 "차입·예치 자유, 거래비용 없음 가정"이라고 경계를 적은 점 적절.
  - CME 3개(understanding-margin-changes, contango 과정, performance-bonds FAQ) — 타임아웃/403(위 #12; FAQ는 아래 risk 글 기록 참조).
- 빠진 내용: 선물 초기증거금(initial)과 변동증거금(variation)의 구분은 risk 글로 미룸(링크 있음) — 보완 불필요. 외환선도 사례에서 교차통화 베이시스(인용한 BIS 글의 주제)가 "가정" 한 줄로만 처리됨 — 별도 정본(`currency-hedging-forward-points-and-cross-currency-basis`)이 있으므로 링크만 추가하면 됨(MISSING 아님).
- OK로 확인한 주요 주장: CIP 산식·BIS 인용 제목/저자; 콘탱고·백워데이션·수렴 정의(검색 스니펫 수준).

### markets/funds-etfs-and-etns
- 추출한 고유 사실 주장 수: 18, 검증 17, 미검증 1
- CALC(전부 일치): 900/10100=8.91%; 40% 회수 4400, 손실 5700; 일일 2배 100→120→98.18, 3배 →130→94.55, −1배 →90→98.18, −2배 →80→94.55, −3배 →70→89.09; 상승연속 2배 100→120→144 vs 지수 121; 고정수량 차입 200→220→200, 자기몫 100→120→100; 듀레이션 −5%×1000만=−50만; 1.10×0.90=0.99 ✓.
- 연 자료:
  - https://www.investor.gov/…/investor-bulletins-24 — WebFetch 403 → curl(UA) 200 — `<title>` "Updated Investor Bulletin: Exchange-Traded Funds (ETFs)"; "ETF investors receive an interest in that investment pool. This means each ETF share represents an investor's proportionate ownership of the fund's portfolio and the income the portfolio generates." ✓; 범위 "This Investor Bulletin discusses only ETFs that are registered as open-end investment companies or unit investment trusts under the Investment Company Act of 1940. It does not address other types of exchange-traded products (ETPs) … such as exchange traded commodity funds or exchange-traded notes." → 본문 8절 범위 서술 ✓; 프리미엄/디스카운트 문장 ✓.
  - https://www.investor.gov/…/investor-bulletins-50 — WebFetch 403 → curl 200 — "Investor Bulletin: Exchange Traded Notes (ETNs) Dec. 1, 2015 … ETNs are unsecured debt obligations of financial institutions that trade on a securities exchange." 발췌 ✓; "you are subject to the creditworthiness of the issuing financial institution and would be a creditor if the issuer defaults".
  - https://www.investor.gov/…/investor-bulletins-12 — curl 200이지만 엉뚱한 문서(위 #1).
  - https://prod.proshares.com/globalassets/proshares/prospectuses/tqqq_summary_prospectus.pdf — 200(PDF 텍스트 추출) — 표지 "SEPTEMBER 28, 2026"; "three times (3x) the daily performance of the Nasdaq-100® Index"; "longer than a single day will likely differ from the Daily Target. This difference may be significant." ✓
  - https://prod.proshares.com/…/sqqq_summary_prospectus.pdf — 200 — "SEPTEMBER 28, 2026"; "three times the inverse (-3x) of the daily performance of the Nasdaq-100® Index" ✓
  - https://globalxetfs.eu/funds/qyld — 200 — "synthetic strategy", "Swap Counterparties: Citi" ✓
- 빠진 내용: 한국 LP 괴리율 의무·투자유의종목·레버리지 진입요건(위 #10). ETN의 국내 조기청산·만기 상환 규정(지표가치 하락, 발행사 요건)도 없음 — KRX 규정 페이지를 직접 열지 못해(regulation.krx.co.kr 해당 경로는 단기과열완화제도 페이지) 원장에는 FSC 보도자료 근거만 기록.
- OK로 확인한 주요 주장: ETF 지분 소유(SEC); ETN 무담보 채무(SEC); 1940년법 등록 ETF 한정·원자재 신탁 제외(SEC); TQQQ/SQQQ 2026-09-28 표지·일일 ±3배 목표(ProShares).

### markets/options-and-asymmetric-payoffs
- 추출한 고유 사실 주장 수: 12, 검증 12, 미검증 0
- CALC(전부 일치): 콜 매수 max(S−100,0)−8 → 90:−8, 100:−8, 108:0, 120:12, 200:92; 풋 90: 10−8=2; 주식+풋 바닥 100−108=−8; KRX 20×25만=500만, 8×25만=200만, 차 300만; 10×8−92=−12 ✓. 차트 함수·손익분기 108 일치.
- 연 자료:
  - https://www.optionseducation.org/optionsoverview/options-basics — 200 — "the right, but not the obligation, to buy (in the case of a call) or sell (in the case of a put) shares" ✓; "Equity option contracts usually represent 100 shares of the underlying stock." ✓
  - https://global.krx.co.kr/contents/GLB/02/0201/0201040202/GLB0201040202.jsp — 200 — "KOSPI 200 Options price times KRW 250,000"; "European(exercisable only at expiration)" 발췌 그대로; Final Settlement "Cash"; 월물 최종거래일 "Second Thursday of the contract month"; 위클리옵션(월·목 상장) 존재.
- 빠진 내용: 없음(필수 부품 충족). KRX 페이지에 있는 위클리옵션·최종거래일(둘째 목요일)은 9절에 한 줄 추가하면 좋음(선택).
- OK로 확인한 주요 주장: 권리/의무 비대칭(OIC); 100주 단위(OIC); KOSPI200 옵션 유럽형·현금결제·25만 원 승수(KRX).

### markets/securitization-and-tranches
- 추출한 고유 사실 주장 수: 11, 검증 11, 미검증 0
- CALC(전부 일치): L=8: 후순위 8/중 0/선 0; L=15: 10/5/0, 잔여 85; L=35: 10/20/5, 선순위 회수 65, 손실률 5/70=7.14%; 각 트랜치 5% 보유 3.5+1+0.5=5 ✓. AlgorithmBlock 의사코드(min/max 구조)도 수치와 일치.
- 연 자료:
  - https://www.imf.org/external/pubs/ft/fandd/2008/09/basics.htm — WebFetch 200(curl 403) — Andreas Jobst, "What Is Securitization?", F&D 2008-09: "The conventional securitization structure assumes a three-tier security design—junior, mezzanine, and senior tranches." 발췌 ✓
  - https://www.esma.europa.eu/…/secr/article-6-risk-retention — 200 — 6(1) "The originator, sponsor or original lender of a securitisation shall retain on an ongoing basis a material net economic interest in the securitisation of not less than 5 %."; 6(3)(a) "the retention of not less than 5 % of the nominal value of each of the tranches sold or transferred to investors" 발췌 ✓; (b)~(e) 회전형·무작위 선택·최초손실 트랜치·익스포저별 최초손실 옵션 확인 → 본문 "조문은 그 보유 방식도 정합니다" ✓
  - https://www.fsc.go.kr/po010102/81349 — 200 — "‘24.1.12일 개정 「자산유동화에 관한 법률」이 시행됩니다"(2023-12-27): "자산을 유동화전문회사등에 양도·신탁한 자 … 는 유동화증권 발행잔액의 5%를 보유하여야 한다. 시장 자율성을 위해 수평·수직·혼합 등 다양한 방법으로"; 면제 "신용위험 또는 이해상충 발생 가능성이 낮다고 인정되는 유동화증권 … 국가·지자체·공공기관이 … 신용보강을 한 경우", 예 "① 기업 자금조달 지원목적의 P-CBO, ② 은행 정기예금 기초 유동화증권, ③ … NPL 유동화증권, ④ 기업구매전용카드·당좌수표 기초" → 본문 "원칙적인 5% 위험보유와 예외 대상" ✓ (기준은 "발행잔액의 5%")
- 빠진 내용: 없음(필수 부품 충족). 한국 규정의 기준이 "유동화증권 발행잔액의 5%"임을 한 줄 명시하면 EU "각 트랜치 명목가치 5%"와의 분모 차이가 닫힘(선택).
- OK로 확인한 주요 주장: 3단 구조(IMF); Article 6(1)·6(3)(a)(ESMA); 한국 5%·면제·2024-01-12 시행(FSC).

### markets/swaps-and-credit-risk
- 추출한 고유 사실 주장 수: 10, 검증 10, 미검증 0
- CALC(전부 일치): 6%: 은행 6000만, 스왑 순수취 2000만, 합 4000만; 2%: 은행 2000만 + 스왑 지급 2000만 = 4000만; 가산 1%: 7000−2000=5000만; CDS 회수 40% → 채권 4억 + 보호 6억 ✓.
- 연 자료:
  - https://www.cftc.gov/MarketReports/SwapsReports/DataDictionary/index.htm — 200 — Fixed-Float: "based on a fixed rate of interest multiplied by a notional amount in exchange for receipt of periodic payments (the floating leg) based on a floating rate index multiplied by the same notional amount" 발췌 ✓; 예시 "Party B makes quarterly payments to Party A of the 3 Month USD LIBOR rate times $10,000,000" → 본문 "지금 쓰지 않는 기준금리 명칭이 남아 있을 수 있습니다" ✓. CDS: "agrees to provide payment (the protection leg) to the other party, the protection buyer, should a credit event occur against a specified debt" 발췌 ✓; "The maximum amount of protection provided by the protection seller is equal to the notional amount of the swap."
  - https://www.esma.europa.eu/post-trading/clearing-obligation-and-risk-mitigation-techniques-under-emir — 200 — "EMIR includes the obligation to centrally clear certain classes of over-the-counter (OTC) derivative contracts through Central Counterparty Clearing (CCPs)."
  - https://data.bis.org/topics/OTC_DER — 200 — "outstanding notional value, market value and credit exposure"; "Outstanding - gross credit exposure: Gross market value minus amounts netted with the same counterparty … under legally enforceable bilateral netting agreements." → 본문 10절 "명목원금·총시가·상계 후 신용노출" ✓
- 빠진 내용: 없음. CDS 현금결제가 실제로는 ISDA 경매 최종가격으로 정해진다는 점은 별도 정본(`credit-derivatives-default-risk-and-tranches`)에 있으므로 링크만 추가(선택).
- OK로 확인한 주요 주장: 고정·변동 다리 정의, CDS 신용사건 지급, BIS 세 집계.

### banking/repo-and-collateral-funding
- 추출한 고유 사실 주장 수: 11, 검증 11, 미검증 0
- CALC(전부 일치): 95억×0.0365/365=95만; 90×0.95=85.5, 부족 9.5; 95/0.95=100 → 10억 추가; 90×0.90=81, 부족 14; 100/95=105.26% ✓.
- 연 자료:
  - https://www.icmagroup.org/…/21-what-is-a-haircut/ — 200 — "A haircut is the difference between the initial market value of an asset and the purchase price paid for that asset at the start of a repo." 발췌 ✓; "A haircut is expressed as the percentage deduction from the market value of collateral (eg 2%)"; "an initial margin is the initial market value of collateral expressed as a percentage of the purchase price (eg 105%) or as a simple ratio (eg 105:100)" → 8절 "5% 헤어컷 ≠ 담보비율 105%" 구분이 ICMA 용어(haircut vs initial margin)와 정확히 대응
  - https://www.newyorkfed.org/…/repo-reverse-repo-agreements — 200 — "A repo transaction is economically similar to a loan collateralized by securities and temporarily increases the supply of reserve balances in the banking system." 발췌 ✓; repo "the Desk purchases securities from a counterparty subject to an agreement to resell", reverse repo "the Desk sells securities … subject to an agreement to repurchase" → 9절 명칭·방향 서술 ✓
  - https://www.bok.or.kr/portal/bbs/B0000347/view.do?menuNo=201106&nttId=10088622 — 200 — 「RP매입을 통한 시장안정화 조치 이해하기」(2024-12-16): "RP매입을 실시하여 유동성을 공급한다", "RP매입을 통해 공급된 유동성은 매입기간 종료 후 자동적으로 회수" ✓
- 빠진 내용: 없음. 8절에 ICMA의 "initial margin(105%)" 용어를 그대로 적으면 "담보 비율"이라는 비공식 표현이 표준 용어로 닫힘(선택).
- OK로 확인한 주요 주장: 헤어컷 정의·분모, 연준 레포 방향, 한국은행 RP매입 공급.

### risk/margin-collateral-and-leverage
- 추출한 고유 사실 주장 수: 11, 검증 11, 미검증 0(CME FAQ는 브라우저 렌더링으로 확인)
- CALC(전부 일치): 90×0.8=72 → 현금 8; 80/0.8=100 → 담보 10 추가; 80−x=0.8(90−x) → x=40, 잔여 자산 50·빚 40; 70%: 현금 80−63=17, 80−x=0.7(90−x) → x=56.67; 선물 10−6=4 ✓.
- 연 자료:
  - https://www.finra.org/sites/default/files/InvestorDocument/p005895.pdf — WebFetch 200(PDF, curl 403) — "Margin Disclosure Statement": "The firm can sell your securities or other assets without contacting you. Some investors mistakenly believe that a firm must contact them for a margin call to be valid … This is not the case." 발췌 ✓; "You are not entitled to an extension of time on a margin call."
  - https://www.cmegroup.com/…/faq-performance-bonds-margins.html — WebFetch 타임아웃·curl 403(Akamai) → 브라우저 렌더링 확인(2023-09-13) — "As prices change throughout the life of a futures contract, the trading accounts where performance bonds are held are debited and credited accordingly." 발췌 ✓; "If subsequently margin equity falls below maintenance margin, a call must be issued to bring the account up to initial margin." / 예시 "If the price variations of the contract bring the account balance under $3200, the trader will have to deposit additional funds to bring the account back up to $4,000." → 9절 "유지 기준 아래이면 처음 요구액까지 복원"(6→10억, 추가 4억) 구조 ✓
  - https://www.iosco.org/library/pubdocs/pdf/ioscopd377-pfmi.pdf — WebFetch/curl 403(챌린지 페이지), 브라우저에서는 열림; 동일 문서 BIS 미러 https://www.bis.org/publications/cpmi-paper/d101a.pdf (200) 표지 "Principles for financial market infrastructures / April 2012"
  - https://www.bis.org/speeches/20160502-market-and-funding-liquidity-overview — 200 — William C Dudley(NY Fed 총재) 2016-05-02, "Declines in market liquidity, in turn, may further impair funding liquidity, creating a negative feedback dynamic."
- 빠진 내용: 없음. 한국 신용거래의 실제 담보유지비율·반대매매 규칙은 "특정 나라의 실제 허용 비율이 아니다"로 명시적으로 범위 밖에 둠 — 한국 독자용이므로 금융투자협회 규정 링크 한 줄은 권장(선택).
- OK로 확인한 주요 주장: FINRA 처분 권한·연장권 없음; CME 증거금 차감·가산·복원; PFMI 2012; BIS 연설 되먹임.

### macro/global-capital-and-policy
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- CALC(전부 일치): 1억$×1000=1000억, ×1200=1200억, 차 200억; 4%=400만$=40억, 6%=600만$×1200=72억, 차 32억; 2000만$×1200=240억, 현금 200억 → 부족 40억 ✓.
- 연 자료:
  - https://data.bis.org/topics/GLI — 200 — "The main focus is on foreign currency credit denominated in three major reserve currencies (US dollars, euros and Japanese yen) to non-residents" 발췌 ✓; "track credit to non-bank borrowers, covering both loans extended by banks and funding from global bond markets through the issuance of international debt securities (IDS)" → 8절 ✓
  - https://www.ecb.europa.eu/ecb/orga/escb/html/index.en.html — 200 — "The euro area came into being when responsibility for monetary policy was transferred from the national central banks of 11 EU Member States to the ECB in January 1999." 발췌 ✓
  - https://www.hkma.gov.hk/eng/key-functions/money/linked-exchange-rate-system/ — 200(WebFetch는 빈 본문, curl 전문; 2024-06-27 개정) — "the LERS ensures that the Hong Kong dollar exchange rate remains stable within a band of HK$7.75-7.85 to one US dollar." → 9절 "정해진 범위" ✓(태환보장 문구는 하위 페이지 how-does-the-lers-work)
- 빠진 내용: 없음. 9절 홍콩 서술에 7.75–7.85 밴드 숫자를 넣으면 "정해진 범위"가 구체화됨(선택).
- OK로 확인한 주요 주장: BIS GLI 범위, ECB 1999 권한 이전, HKMA 밴드.

### macro/narratives-and-market-regimes
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- CALC(전부 일치): 100/0.10=1000, 150/0.08=1875; V=(C+V)/(1+r) ⇒ V=C/r ✓; 200/1200=16.67%, 200/2075=9.64%; (105+1875)/1.08=1833.33; 105/0.08=1312.5(−30%); 105/0.10=1050 ✓.
- 연 자료:
  - https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/ — 200 — "The statement classifies cash flows during a period into cash flows from operating, investing and financing activities"; 발췌 "investing or financing cash flows"는 간접법 설명 문장 안에 그대로 있음 ✓
  - https://www.bis.org/speeches/20160502-market-and-funding-liquidity-overview — 200 — Dudley(NY Fed 총재) 2016-05-02, "creating a negative feedback dynamic" 발췌 ✓ → 9절 "뉴욕 연방준비은행 총재의 연설" ✓
- 빠진 내용: 없음. 발췌 "investing or financing cash flows"는 간접법 조정 항목을 설명하는 문장의 일부라 "활동별 구분" 근거로는 "classifies cash flows … into … operating, investing and financing activities" 문장이 더 직접적(선택).
- OK로 확인한 주요 주장: IAS 7 활동 구분; 영구현금 V=C/r; 희석 비율; Dudley 연설.

### macro/what-ricardo-assumed
- 추출한 고유 사실 주장 수: 10, 검증 10, 미검증 0
- CALC: 100/120=0.83, 90/80=1.125→"1.13" ✓(반올림).
- 연 자료: https://www.gutenberg.org/ebooks/33310 → 전문 https://www.gutenberg.org/cache/epub/33310/pg33310.txt — 200 — 표제지 1817 John Murray(초판 ✓, "Corrections in the ERRATA section have been made and duplicate Chapter numbers are marked by asterisks"); 7개 인용문 전부 원문 그대로(예: "Such an exchange could not take place between the individuals of the same country. The labour of 100 Englishmen cannot be given for that of 80 Englishmen, but the produce of the labour of 100 Englishmen may be given for the produce of the labour of 80 Portuguese, 60 Russians, or 120 East Indians."; "if capital freely flowed towards those countries where it could be most profitably employed, there could be no difference in the rate of profit, and no other difference in the real or labour price of commodities, than the additional quantity of labour required to convey them to the various markets"; "These feelings, which I should be sorry to see weakened, induce most men of property to be satisfied with a low rate of profits in their own country"). 장 번호만 불일치(위 #2).
- 빠진 내용: 부품 3의 "물건 값의 차이로 남는 것은 시장까지 옮기는 데 더 드는 품뿐"은 원문 "no other difference in the real or labour price of commodities, than the additional quantity of labour required to convey them"과 일치. 인용 블록에 이 문장이 빠져 있어 부품 3의 둘째 결론이 인용 없이 서술됨 — 2번 인용 블록에 해당 문장을 추가하면 닫힘(경미).
- OK로 확인한 주요 주장: 네 숫자·안/밖 구분·자본 이동 난이도·반사실·이윤율·심리적 근거 전부(Gutenberg 전문).

### macro/what-the-price-level-hides
- 추출한 고유 사실 주장 수: 12, 검증 12, 미검증 0
- CALC(전부 일치): 2억×0.1+1000만×5+3000만×1=1억 = 500만×20 ✓; 차트 `ExchangeBalanceViz`·`FourKnobsViz` 상수(5,000,000·20·0.1/5/1·0.2/10·0.05/2.5) 원문과 일치.
- 연 자료: https://archive.org/details/purchasingpower00fish → 전문 djvu.txt — 200 — 표제지 "NEW AND REVISED EDITION / THE MACMILLAN COMPANY / 1926", 판권 "COPYRIGHT, 1911… Published March, 1911", 2판 서문 "I have endeavored to avoid disturbing the plates of the first edition" → "개정판(1926년 인쇄), 쪽수는 개정판 기준" ✓(판형 유지라 초판과 동일 쪽). 16쪽 "Suppose, for instance, that a person buys 10 pounds of sugar at 7 cents per pound." ✓, "It is obtained simply by adding together the equations of exchange for all individual transactions." ✓, "true solely on the particular hypothesis assumed" ✓; 17쪽 "And in the grand total of all exchanges for a year, the total money paid is equal in value to the total value of the goods bought." ✓, 속도 정의 "Each person has his own rate of turnover which he can readily calculate by dividing the amount of money he expends per year by the average amount he carries." ✓(본문 부품 2); 17~18쪽 5,000,000×20 및 빵·석탄·옷감 ✓; 21쪽 "To double the quantity of money, therefore, is not always to double prices. We must distinctly recognize that the quantity of money is only one of three factors, all equally important in determining the price level." ✓. 19~20쪽 사례는 20쪽(위 #15).
- 빠진 내용: ExplainedFormula 가정 "여기서는 수표와 예금을 뺀 현금만 셉니다. 저자는 뒤에서 이것을 따로 더해 같은 꼴로 확장합니다"는 3장(MV+M'V')에 해당 — 쪽/장 표기 없음(경미, 선택).
- OK로 확인한 주요 주장: 전부.

### macro/who-counts-as-unemployed
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- CALC: ThreeGatesViz 9/(60+9)=13.0% ✓; FourMeasuresViz LU1 9/69=13.0%, LU2 16/69=23.2%, LU3 17/77=22.1%, LU4 24/77=31.2% — 식(73(c))과 일치. AlgorithmBlock 분모 서술 1건 오류(위 #6).
- 연 자료: https://www.ilo.org/sites/default/files/wcmsp5/groups/public/@dgreports/@stat/documents/normativeinstrument/wcms_230304.pdf — 200(27쪽, 2023 개정 통합본; 위 #14) — 47항 "Persons in unemployment are defined as all those of working age who were not in employment, carried out activities to seek employment during a specified recent period and were currently available to take up employment given a job opportunity" ✓; (b) "the last four weeks or one month" ✓, 활동 목록 (i)~(vii)은 (b) 안 ✓; (d) ""currently available" serves as a test of readiness to start a job in the present", (d)(i) "not exceeding two weeks in total" ✓; 27(a) "employed persons "at work", i.e. who worked in a job for at least one hour" ✓(일반 규칙은 21항); 51항 잠재노동력 두 집단 ✓; 55항 "extended labour force, defined as the sum of the labour force plus the potential labour force" ✓; 73(c) "more than one amongst the following headline indicators is needed" 및 LU1~LU4 식 ✓; 16항 "Priority is given to employment over the other two categories" ✓(ExplainedFormula 가정). 21차 ICLS 개정 제목: "Resolution II: Resolution to amend the 19th ICLS resolution concerning statistics of work, employment and labour underutilization"(https://www.ilo.org/resource/conference-paper/resolution-ii-resolution-amend-19th-icls-resolution-concerning-statistics, 200).
- 빠진 내용: 부품 1에서 "찾는 활동 … 일곱 가지"의 (i)·(ii)(자금·허가, 토지·설비)는 창업 준비 활동인데 본문은 "사업을 차리려고 자금이나 허가를 알아보기"로 묶어 적음 — 적절. 한국 통계청 경제활동인구조사의 구직기간(4주)·취업가능성 적용은 언급 없음 — 글 범위(국제 기준) 밖이라 MISSING으로 두지 않음.
- OK로 확인한 주요 주장: 전부(조항 번호·원문 일치).

### macro/why-per-head-stalls
- 추출한 고유 사실 주장 수: 11, 검증 11, 미검증 0
- CALC(전부 일치): 인구 7·14·28·56·112, 식량 7·14·21·28·35(백만); 한 사람 몫 1·1·0.75·0.5·0.3125(본문 0.31); 부족 77; 식량 5배; 세계 수열 9회 배가=225년, 512:10 ✓. `TwoRatiosViz` 상수 일치.
- 연 자료: https://archive.org/details/essayonprincipl00malt → 전문 djvu.txt — 200 — 1798 J. Johnson 초판 ✓; 14쪽 인용 ✓; 나머지 쪽수 불일치(위 #3·#13). 원문 표현: "two centuries and a quarter"(225라는 숫자는 없음), "this Island"(Great Britain 미명시), "In the United States of America".
- 빠진 내용: 부품 4 "두 세기 동안 사람도 늘고 한 사람 몫도 함께 올랐다"는 자료 인용이 없음(Maddison 등) — 이 글의 범위 선언("결론을 지지하지 않는다")상 필수 아님, 그러나 "고리의 마지막 화살표가 약해졌고 … 방향이 뒤집힌 곳도 있습니다"(인구변천)는 최소 한 출처가 있어야 할 사실 주장 → MISSING(경미).
- OK로 확인한 주요 주장: 두 비율 선언(14쪽); 미국 관찰 근거; 섬 셈의 숫자; 세계 수열.

## 열지 못한 자료
| URL | 상태 | 대체 확인 |
|---|---|---|
| https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes | WebFetch 타임아웃 ×2, curl 403(Akamai), `.html` 변형 403 | 검색 스니펫("CME Group marks positions to market twice a day")만 확인 — UNVERIFIED |
| https://www.cmegroup.com/education/courses/introduction-to-ferrous-metals/what-is-contango-and-backwardation | WebFetch 타임아웃 ×2, curl 403, institute.cmegroup.com 미러 403 | 검색 스니펫으로 정의 문구만 확인 |
| https://www.cmegroup.com/solutions/risk-management/performance-bonds-margins/faq-performance-bonds-margins.html | WebFetch 타임아웃 ×2, curl 403 | 보조 검증 작업이 브라우저(Chrome)로 렌더링해 발췌 원문 확인 |
| https://www.investor.gov/…/investor-bulletins-24, -50, -12, -76, -65, mutual-funds-and-exchange-traded-5 | WebFetch 403 | curl(브라우저 UA) 200으로 전문 확인 |
| https://web.archive.org/… | "Claude Code is unable to fetch from web.archive.org"(본 세션) | 보조 검증 작업에서는 ILO 2013 원문을 Wayback으로 확보 |
| https://assets-cms.globalxetfs.com/QYLD-factsheet.pdf | 301→403 | 미확인(분배율 정의) |
| https://www.fss.or.kr/… (소비자경보·보도자료 목록) | 200이나 2026-10-08~10 전기안전점검 중단 공지만 표시 | 2차 보도로만 확인(#11) |
| https://www.optionseducation.org/about, /about-oic | 404 | /abouttheoptionsindustrycouncil/about-oic 검색 스니펫 |
| https://regulation.krx.co.kr/contents/RGL/03/03010408/RGL03010408.jsp | 200이나 단기과열완화제도 페이지(ETF/ETN 괴리율 규정 아님) | FSC 2020-05-18 보도자료로 대체 |
| https://www.iosco.org/library/pubdocs/pdf/ioscopd377-pfmi.pdf | WebFetch/curl 403(챌린지) | 브라우저에서 열림; BIS 미러 d101a.pdf(200)로 표지·날짜 확인 |
| https://www.consumerfinance.gov/…, https://www.dol.gov/…, https://www.imf.org/…/basics.htm | curl 403 | WebFetch 200으로 전문 확인 |
| https://www.ilo.org/international-conference-labour-statisticians/21st-… 외 ILO 경로 3건 | 404 | https://www.ilo.org/resource/conference-paper/resolution-ii-resolution-amend-19th-icls-resolution-concerning-statistics (200)로 개정 제목 확인 |
| https://ilostat.ilo.org/about/standards/icls/ | 403(라이브) | Wayback 2024-12-31 사본으로 21차 ICLS 개정 목록 확인 |
| https://www.sec.gov/investor/pubs/leveragedetfs-alert.htm | 403("Request Rate Threshold Exceeded") | investor.gov 정식 페이지(…/investor-alerts/sec)로 대체 |

## 후속 작업
- #11 covered-calls: 금감원 2024-07~08 커버드콜 ETF 소비자경보(종목명 분배율은 목표치, '프리미엄'은 옵션 프리미엄)와 상품명 변경 조치. fss.or.kr 점검(2026-10-08~10)이 끝난 뒤 1차 원문을 열어 10절에 한 단락과 인용을 넣을 것. 2차 보도만으로는 넣지 않음.
- #19 why-per-head-stalls: 부품 4의 두 판정(20세기 농업 생산성의 곱셈적 증가, 소득 상승기의 출산율 하락)에 Maddison Project 또는 UN WPP 한 건을 1차 자료로 열어 인용 블록을 추가할 것. 지금은 "통계 자료를 직접 인용하지 않았다"는 범위 문장만 있음.
- #12 forwards-and-futures: CME 두 페이지(understanding-margin-changes, ferrous contango)를 브라우저로 렌더링해 발췌를 다시 대조할 것. 막히면 CME Rulebook이나 Clearing 공시 PDF로 바꿀 것.
- #10 funds-etfs-and-etns: 2020 FSC 방안 수치(3%/6%, 6%/12%, 1,000만 원, 사전교육)가 현행 KRX 유가증권시장 업무규정·시행세칙에서도 그대로인지 확인한 뒤 "2020년 발표 기준" 단서를 갱신할 것.
- (선택) funds-etfs-and-etns registration의 "SEC Leveraged and Inverse ETF Alert"(`https://www.sec.gov/files/investor/pubs/leveragedetfs-alert.htm`, 감사 때 403)를 investor.gov 정식 페이지로 맞출지 통합자가 판단할 것.

## 공용 파일 수정 목록
통합자가 아래 순서대로 적용한다. old 문자열은 각 파일에서 한 번만 나오는 것을 2026-10-09에 `grep -cF`로 확인했다. `src/content/registrations/*.ts`도 check-article의 merge 단계가 공용 파일에 병합하므로 여기에 적는다.

### 1. `src/content/article-evidence.ts`

(1-a) #1 SEC 레버리지 ETF 링크
```
old:
      "label": "SEC · Leveraged and Inverse ETFs",
      "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-12",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
new:
      "label": "SEC · Updated Investor Bulletin: Leveraged and Inverse ETFs",
      "href": "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/sec",
      "note": "2026-10-09 원문 확인(“Most leveraged and inverse ETFs “reset” daily…”). 이전 주소 investor-bulletins-12는 다른 게시물(Professional Honors)로 연결되어 교체했습니다."
```

(1-b) #10 FSC 2020 보도자료 추가(funds-etfs-and-etns 배열, SQQQ 항목 뒤)
```
old:
      "href": "https://prod.proshares.com/globalassets/proshares/prospectuses/sqqq_summary_prospectus.pdf",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
new:
      "href": "https://prod.proshares.com/globalassets/proshares/prospectuses/sqqq_summary_prospectus.pdf",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
      "href": "https://fsc.go.kr/po010101/74332",
      "note": "2026-10-09 원문 확인. 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육. 한국 관할이며 2020년 발표 시점의 방안이라 현행 거래소 규정과는 대조하지 못했습니다."
    },
```
주의: 이 old 조각은 article-evidence.ts에 SQQQ 항목이 하나뿐이라 유일하다. 그 뒤 원소가 바로 `{`로 시작하는지 적용 전에 확인할 것(배열 끝이면 `},` 대신 `}`).

(1-c) #12 CME 두 항목 note
```
old:
      "href": "https://www.cmegroup.com/education/courses/introduction-to-ferrous-metals/what-is-contango-and-backwardation",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
new:
      "href": "https://www.cmegroup.com/education/courses/introduction-to-ferrous-metals/what-is-contango-and-backwardation",
      "note": "2026-10-09 재확인 시 자동 조회 불가(시간 초과·403). 정의 문구는 검색 요약으로만 확인해 미검증입니다."
```
```
old:
      "href": "https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
new:
      "href": "https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes",
      "note": "2026-10-09 재확인 시 자동 조회 불가(시간 초과·403). “marks positions to market twice a day”는 검색 요약으로만 확인해 미검증입니다."
```

(1-d) #16 예금보호
```
old:
      "href": "https://www.fsc.go.kr/po010105/85200",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
new:
      "href": "https://www.fsc.go.kr/po010105/85200",
      "note": "2026-10-09 원문 확인. 한도 1억원(원금 및 이자 포함)과 2025-09-01 시행만 뒷받침합니다. 합산 단위와 별도 한도는 다음 항목이 근거입니다."
    },
    {
      "kind": "공식 문서",
      "label": "금융위원회 · ’25.9.1일부터 예금을 1억원까지 보호합니다 (2025-07-22 보도자료)",
      "href": "https://fsc.go.kr/edu/news/85077",
      "note": "2026-10-09 원문 확인. 같은 금융회사 안에서도 퇴직연금(DC·IRP·중소기업퇴직연금기금 중 예금 등 보호상품 운용분)·연금저축·사고보험금은 일반 예금과 별도로 1억원까지 보호. 펀드 등 실적연동 상품은 비보호. 한국 관할."
    },
```

(1-e) #17 MMF
```
old:
      "href": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-5",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
new:
      "href": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-5",
      "note": "2026-10-09 원문 확인. 고정 NAV(stable $1.00)와 기관용 prime·tax-exempt MMF의 변동 NAV만 뒷받침합니다. 유동성 수수료는 다음 항목이 근거입니다."
    },
    {
      "kind": "공식 문서",
      "label": "SEC · Press Release 2023-129, Money Market Fund Reforms (2023-07-12)",
      "href": "https://www.sec.gov/newsroom/press-releases/2023-129",
      "note": "2026-10-09 원문 확인. 게이트 조항 폐지, 기관용 prime·tax-exempt MMF는 하루 순환매가 순자산 5%를 넘으면 유동성 수수료 의무(비용이 미미하면 제외), 비정부 MMF는 이사회 재량 수수료. 미국 관할."
    }
```

(1-f) #8 Fidelity 쪽수
```
old:
      "label": "Fidelity/OIC · Exercise and Assignment, transcript pp.6–7,18",
new:
      "label": "Fidelity/OIC · Exercise and Assignment, transcript pp.6–7, 17",
```

(1-g) #4 JEPI
```
old:
      "label": "J.P. Morgan · JEPI Fact Sheet, ELN Risk Summary",
      "href": "https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/specialty/fs-epi-c.pdf",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
new:
      "label": "J.P. Morgan · JPMorgan Equity Premium Income ETF (JEPI) Fact Sheet, 2026-08-31, Risk Summary",
      "href": "https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/etfs/FS-JEPI.PDF",
      "note": "2026-10-09 원문 확인(ELN 유동성·신용·상대방 위험 문장). 이전 링크 fs-epi-c.pdf는 같은 전략의 뮤추얼펀드(JEPAX 등) 팩트시트라 ETF 팩트시트로 교체했습니다."
```

(1-h) #9 Global X
```
old:
      "label": "Global X · QYLD distribution rate definition",
      "href": "https://www.globalxetfs.com/funds/qyld",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
new:
      "label": "Global X · QYLD 펀드 페이지(미국 상장)",
      "href": "https://www.globalxetfs.com/funds/qyld",
      "note": "2026-10-09 확인. 분배율·30일 SEC 수익률 수치만 있고 정의 문구는 없습니다. 팩트시트 PDF는 자동 조회 불가(403)."
```

(1-i) #3 Malthus
```
old:
        "T. R. Malthus, 『An Essay on the Principle of Population』, London: J. Johnson, 1798 (초판), 14·21·25~28쪽",
      href: "https://archive.org/details/essayonprincipl00malt",
      note: "두 비율의 선언(14쪽), 25년마다 두 배의 근거(21쪽), 섬의 100년 셈과 7,700만 명(25~26쪽), 세계로 넓힌 512 대 10(28쪽)의 출처. Internet Archive의 1798년 초판 스캔을 읽었고 14·26쪽은 쪽 이미지로 대조, 나머지는 OCR 쪽 머리글로 확인했음",
new:
        "T. R. Malthus, 『An Essay on the Principle of Population』, London: J. Johnson, 1798 (초판), 14·20~26쪽",
      href: "https://archive.org/details/essayonprincipl00malt",
      note: "두 비율의 선언(14쪽), 미국에서 25년마다 두 배라는 근거(20~21쪽), 섬 설정(21~23쪽), 100년 셈과 7,700만 명(24쪽), 세계로 넓힌 두 수열(25쪽)과 512 대 10(26쪽 첫 줄)의 출처. Internet Archive의 1798년 초판 스캔을 읽었고 쪽수는 OCR 쪽 머리글 기준(2026-10-09 재대조)이며 쪽 이미지로 따로 대조하지는 않았음",
```

(1-j) #14 ILO
```
old:
        "ICLS, 「Resolution concerning statistics of work, employment and labour underutilization」, 19차 결의(2013) · 21차 회의(2023) 개정, 47·51·55·73항",
new:
        "ICLS, 「Resolution concerning statistics of work, employment and labour underutilization」, 19차 결의(2013)의 2023년 개정 통합본(ICLS/21/2023/RES. II), 47·51·55·73항",
```
그리고 같은 항목 note 끝에 덧붙임:
```
old:
LU1~LU4의 식과 둘 이상을 쓰라는 요구(73항 c)의 출처. ILO 공개 PDF를 읽고 47항은 쪽 이미지로 대조했음. 본문의 100명 보기와 백분율은 이 글이 만든 설명용 수치",
new:
LU1~LU4의 식과 둘 이상을 쓰라는 요구(73항 c)의 출처. ILO 공개 PDF를 읽고 47항은 쪽 이미지로 대조했음. 링크의 PDF는 2023년 개정 통합본이고 2013 원문은 Wayback(https://web.archive.org/web/20140429080051id_/http://www.ilo.org/wcmsp5/groups/public/---dgreports/---stat/documents/normativeinstrument/wcms_230304.pdf)에 있으며, 인용한 16·21·27·47·51·55·73(c)항은 두 판의 문구가 같음(2026-10-09 확인). 본문의 100명 보기와 백분율은 이 글이 만든 설명용 수치",
```

(1-k) #2 Ricardo
```
old:
        "David Ricardo, 『On the Principles of Political Economy, and Taxation』, London: John Murray, 1817 초판, 7장 「On Foreign Trade」",
new:
        "David Ricardo, 『On the Principles of Political Economy, and Taxation』, London: John Murray, 1817 초판, 6장 「On Foreign Trade」(3판 기준 7장)",
```
```
old:
Project Gutenberg 1817년 초판 전사본으로 7장 전체를 읽었음. facsimile이 아니어서
new:
Project Gutenberg 1817년 초판 전사본으로 6장 전체를 읽었음(초판은 「On Profits」를 V*로 중복 번호 매겨 외국무역이 VI장, 3판 1821년부터 7장). facsimile이 아니어서
```

### 2. `src/content/article-learning.ts`
```
old:
          "Internet Archive의 1798년 초판 스캔(430쪽)을 내려받아 해당 장을 읽었습니다. 14쪽의 두 비율 선언과 26쪽의 100년 셈은 쪽 이미지를 직접 열어 대조했고, 21·25·28쪽은 같은 스캔 OCR 본문의 쪽 머리글로 확인했습니다. 이후 판본에서 저자가 논지를 상당히 수정했으나 이 글은 초판만 읽었습니다.",
new:
          "Internet Archive의 1798년 초판 스캔(430쪽)을 내려받아 해당 장을 읽었습니다. 두 비율 선언은 14쪽, 미국 25년 배가는 20~21쪽, 100년 셈은 24쪽, 세계 수열은 25쪽, 512 대 10은 26쪽 첫 줄이며, 쪽수는 같은 스캔 OCR 본문의 쪽 머리글로 확인했습니다(2026-10-09 재대조, 쪽 이미지로 따로 대조하지는 않음). 이후 판본에서 저자가 논지를 상당히 수정했으나 이 글은 초판만 읽었습니다.",
```
```
old:
          "David Ricardo, 『On the Principles of Political Economy, and Taxation』 (1817) 초판, 7장",
new:
          "David Ricardo, 『On the Principles of Political Economy, and Taxation』 (1817) 초판, 6장(3판 기준 7장)",
```
```
old:
          "Project Gutenberg의 1817년 초판 전사본(eBook 33310)으로 7장 전체를 읽었습니다.
new:
          "Project Gutenberg의 1817년 초판 전사본(eBook 33310)으로 6장 「On Foreign Trade」 전체를 읽었습니다(초판은 V*장 중복 번호 때문에 외국무역이 VI장이고, 3판부터 7장입니다).
```
```
old:
          "ICLS, 「Resolution concerning statistics of work, employment and labour underutilization」 (19차 2013 · 21차 2023 개정)",
new:
          "ICLS, 「Resolution concerning statistics of work, employment and labour underutilization」 (19차 2013, 2023년 개정 통합본 ICLS/21/2023/RES. II)",
```

### 3. `src/content/registrations/what-ricardo-assumed.ts` (article-learning·evidence와 같은 문자열; merge 원천)
- 351행: (2)의 Ricardo title old→new와 같은 쌍.
- 360행: (2)의 "Project Gutenberg의 1817년 초판 전사본(eBook 33310)으로 7장 전체를 읽었습니다." old→new와 같은 쌍.
- 374행: (1-k) 첫 쌍과 같은 문자열.
- 376행: (1-k) 둘째 쌍과 같은 문자열.

### 4. `src/content/registrations/why-per-head-stalls.ts`
- 391행: (2)의 Malthus evidenceScope old→new와 같은 쌍.
- 405·407행: (1-i)와 같은 쌍(label·note).

### 5. `src/content/registrations/who-counts-as-unemployed.ts`
- 382행: (2)의 ICLS title 쌍과 같은 문자열.
- 405행: (1-j) 첫 쌍과 같은 문자열.

### 6. `src/content/registrations/finance-audit-current.ts` (article-evidence.ts와 같은 JSON 형식)
(1-a) · (1-b) · (1-c) · (1-d) · (1-e) · (1-f) · (1-g) · (1-h)의 old→new 쌍을 그대로 적용한다. 각 old 조각이 이 파일에서도 한 번만 나오는 것을 확인했다(investor-bulletins-12, sqqq, ferrous contango, understanding-margin-changes, po010105/85200, mutual-funds-and-exchange-traded-5, "pp.6–7,18", fs-epi-c.pdf, "QYLD distribution rate definition" 각 1건).

### 7. `src/content/registrations/forwards-and-futures.ts` (한 줄 JSON)
```
old:
"label": "CME Understanding Margin Changes", "href": "https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes", "note": "선물 증거금과 일별 평가·유지 요건의 공식 설명입니다."
new:
"label": "CME Understanding Margin Changes", "href": "https://www.cmegroup.com/education/articles-and-reports/understanding-margin-changes", "note": "선물 증거금과 일별 평가·유지 요건의 공식 설명입니다. 2026-10-09 재확인 시 자동 조회 불가(시간 초과·403)라 발췌는 검색 요약으로만 확인해 미검증입니다."
```

## 후속 작업 결과
처리일 2026-10-09. 적용 4 · 확인만(이미 반영) 1 · 부분 보류 2(아래 각 항목 안).

| 항목 | 결과 |
|---|---|
| #11 covered-calls 금감원 소비자경보 | **적용(사본 근거, 원 주소 재대조 필요)**. fss.or.kr은 2026-10-09에도 "대국민 서비스 중단(2026.10.08 18:00 ~ 10.10 24:00)" 공지만 반환했고 Wayback은 "Temporarily Offline"이었다. 대신 삼성화재가 소비자보호 자료로 게시한 같은 보도자료 PDF(https://samsungfire.com/download/consumer/ca_d71.pdf, 4쪽, PDF 작성자 메타데이터 "금융감독원", 머리 "보도 2024.7.29.(월) 조간 배포 2024.7.26.(금) … 소비자경보 2024-26호")를 내려받아 3쪽을 쪽 이미지로 대조했다. 인용: "커버드콜 ETF 종목명에 기재된 분배율은 운용사가 제시하는 목표 분배율을 의미할 뿐, 사전에 약정된 확정분배율이 아님에 유의", "커버드콜 ETF 종목명의 “프리미엄”은 옵션 프리미엄*을 의미할 뿐, 사전적 의미의 “고급스럽고, 좋은” 상품을 의미하는 것이 아님", 919원 표(매월 NAV 5% 하락·매월 NAV 1% 분배 가정, 100+95+…+57=919 재계산 일치). 10절 셋째 문단 뒤에 두 문단과 citeKey 11 인용 블록을 넣었다. **보류 부분**: 상품명 변경 조치(2024-09)는 금감원 원문을 찾지 못해(2차 보도만 있음) 넣지 않고 본문에 "확인하지 못해 다루지 않는다"고 적었다. fss.or.kr 재개 뒤 원 주소(보도자료 게시물)로 href를 바꾸는 일이 남는다. |
| #19 why-per-head-stalls 1차 통계 | **적용**. Maddison Project Database 2023: GGDC 페이지(https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023)가 연결한 dataverse.nl 파일 mpd2023_web.xlsx를 내려받아 Regional data 시트 World 행을 읽음(1820년 GDPpc 1,127.7·인구 1,042,017천, 1950년 3,360.2, 2022년 16,676.7·7,802,034천; 단위는 Notes 시트 "Real GDP per capita in 2011$", "Population, mid-year (thousands)"). UN WPP 2024: WPP2024_Demographic_Indicators_Medium.csv.gz를 내려받아 World 행 TFR 1950=4.8519, 2023=2.2505 확인. 부품 4 첫 문단에 인구 7.5배·1인당 GDP 약 15배, 셋째 문단 뒤에 출산율 문단을 넣고 citeKey 2·3 인용 블록 추가. "인과는 보여 주지 않는다"는 범위와 "첫째 판정(농업 생산성)은 통계로 확인하지 않은 일반적 서술"이라는 범위 문장은 남겼다. |
| #12 forwards-and-futures CME 두 페이지 | **적용**. Chrome으로 두 페이지를 렌더링해 본문을 읽음. understanding-margin-changes(Matthew Waldis, 25 MAR 2020): "We mark positions to market twice a day to prevent losses from accumulating over time." / ferrous contango 2강: "When a market is in contango, the forward price of a futures contract is higher than the spot price.", "as the futures contract approaches maturity, the futures price will converge with the spot price, otherwise an arbitrage opportunity would exist." 두 인용 블록의 "미검증" 문구를 원문 인용으로 바꾸고, 8절 첫 문장의 비문("문구는 … 알 수 있습니다")을 원문 취지("손실이 쌓이지 않게")에 맞게 고쳤다. |
| #10 funds-etfs-and-etns 현행 KRX 규정 | **적용(수치 변경)**. KRX 법무포털(https://rule.krx.co.kr/)에서 유가증권시장 업무규정(제61차 개정, 2026-09-14 시행, 규정 제2497호)과 시행세칙(제177차, 세칙 제2499호) 현행 전문을 열어 확인. **2020년 수치는 현행과 다르다**: 제20조의4제2항 LP 괴리율 의무는 "2%(해외기초자산의 경우 5%를 말한다…)"(개정 2026.8.18·9.9, 부칙상 2026-08-19·09-14 시행), 세칙 제134조의5 투자유의 지정예고는 "규정 제20조의4제2항 또는 제3항에서 정한 비율의 2배 이상"(즉 4%/10%), 제134조의6 예고 후 10매매거래일 이내 재해당 시 지정. 기본예탁금은 업무규정 제87조의2제1항제2호(1배 초과 배율, 음의 배율 포함, 개인 매수)와 세칙 제111조의3(1단계 1천만원 미만(면제 포함)·2단계 1천만원·3단계 1천만원 초과 3천만원 이하, 최초 계좌는 2·3단계, 단일종목 상품 3천만원 이상 현금). 사전교육은 거래소 규정에 없어 FSC 2026-04-21 보도자료(https://www.fsc.go.kr/po010101/86751, "현재 국내상장 및 해외상장 레버리지 ETF·ETN에 투자하는 경우 사전교육(1시간)을 받아야 했다")로 확인. 7절 사례 선을 1만300/1만600 → 1만200/1만500, 투자유의 1만600 → 1만400으로 고치고 2020년 수치(3%/6%, 6%/12%)는 연혁으로 남겼다. 9절은 현행 조문 기준으로 다시 썼다. **보류 부분**: 2020 발표의 신용거래 제외·위탁증거금 100%는 현행 원문을 확인하지 못해 본문에 그렇게 적었다. 인용 블록 citeKey 7(업무규정)·8(시행세칙)·9(FSC 2026)를 추가하고 FSC 2020을 10으로 옮겨 기존 Global X Europe과 겹치던 citeKey 6 중복을 없앴다. |
| (선택) SEC leveraged ETF alert 주소 | **확인만**. src 전체에서 `sec.gov/files/investor/pubs/leveragedetfs-alert.htm`은 이미 없고, 본문·article-evidence·registration 모두 investor.gov 주소(…/investor-alerts/sec)로 바뀌어 있다. 2026-10-09 curl로 그 페이지 200, 제목 "Leveraged and Inverse ETFs", 날짜 "Aug. 29, 2023"를 확인했다. sec.gov 원 주소는 여전히 403. 추가 조치 없음. |

고친 글 파일(직접 수정):
- `src/pages/articles/markets/covered-calls-and-income-funds.tsx`
- `src/pages/articles/macro/why-per-head-stalls.tsx`
- `src/pages/articles/markets/forwards-and-futures.tsx`
- `src/pages/articles/markets/funds-etfs-and-etns.tsx`

검증: 4개 route마다 audit-learning-contract(--require-registration)·viz-style·korean-naturalness·term-density·term-pair-wrapping 통과, knowledge-graph·reading-order 통과. prose-readability는 covered-calls에 새 긴 문단이 걸려 둘로 나눈 뒤 4개 글 모두 "재검토 필요" 목록에서 빠짐(rc=1은 다른 글 항목). `npx eslint` 4개 파일 통과. check-article.sh의 merge-registrations 단계는 공용 파일을 쓰므로 돌리지 않았다. 아래 공용 파일 수정 목록은 13쌍 모두 2026-10-09에 각 파일에서 old가 정확히 1번 나오는 것을 확인했고, 적용한 사본을 TypeScript 파서로 읽어 구문 오류 0을 확인했다.

참고(통합자): `article-evidence.ts`·`finance-audit-current.ts`·`registrations/funds-etfs-and-etns.ts`에 FSC 2020 항목이 **두 번 연속** 들어가 있다(앞 원장 (1-b)가 두 번 적용된 것으로 보임). 아래 해당 쌍은 그 중복 두 항목을 한꺼번에 old로 잡아 하나로 줄이고 새 항목 셋을 앞에 넣는다.

## 후속 공용 파일 수정 목록
통합자가 위에서 아래 순서로 적용한다. 각 old는 2026-10-09 현재 해당 파일에서 한 번만 나온다.

### `src/content/article-evidence.ts`
```
old:
      "href": "https://s.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350542",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    }
new:
      "href": "https://s.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350542",
      "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "금융감독원 · 커버드콜 ETF 명칭 및 수익구조에 대한 소비자 경보(주의) 발령 (소비자경보 2024-26호, 2024-07-26 배포·07-29 조간)",
      "href": "https://samsungfire.com/download/consumer/ca_d71.pdf",
      "note": "2026-10-09 원문 확인(쪽 이미지 대조). 종목명 분배율은 운용사가 제시하는 목표 분배율일 뿐 확정분배율이 아니고, 분배율은 분배기준일 NAV 대비라 투자원금과 무관하며, 종목명의 “프리미엄”은 옵션 프리미엄을 뜻한다는 문구와 919원 표(3쪽, 매월 NAV 5% 하락·매월 NAV 1% 분배 가정)의 출처. 한국 관할. 금감원 누리집(fss.or.kr)이 2026-10-08~10 전기설비 점검으로 중단되어, 삼성화재가 소비자보호 자료로 게시한 같은 보도자료 PDF(문서 작성자 금융감독원)로 대조했습니다. fss.or.kr 재개 후 원 주소로 바꿀 것."
    }
```
```
old:
      "note": "2026-10-09 재확인 시 자동 조회 불가(시간 초과·403). 정의 문구는 검색 요약으로만 확인해 미검증입니다."
new:
      "note": "2026-10-09 브라우저 렌더링으로 원문 대조. “When a market is in contango, the forward price of a futures contract is higher than the spot price.”와 만기 수렴 문장(“as the futures contract approaches maturity, the futures price will converge with the spot price”) 확인."
```
```
old:
      "note": "2026-10-09 재확인 시 자동 조회 불가(시간 초과·403). “marks positions to market twice a day”는 검색 요약으로만 확인해 미검증입니다."
new:
      "note": "2026-10-09 브라우저 렌더링으로 원문 대조(Matthew Waldis, 2020-03-25). “We mark positions to market twice a day to prevent losses from accumulating over time.” 확인. 미국 CME Clearing 관행."
```
```
old:
    {
      "kind": "공식 문서",
      "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
      "href": "https://fsc.go.kr/po010101/74332",
      "note": "2026-10-09 원문 확인. 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육. 한국 관할이며 2020년 발표 시점의 방안이라 현행 거래소 규정과는 대조하지 못했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
      "href": "https://fsc.go.kr/po010101/74332",
      "note": "2026-10-09 원문 확인. 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육. 한국 관할이며 2020년 발표 시점의 방안이라 현행 거래소 규정과는 대조하지 못했습니다."
    }
new:
    {
      "kind": "공식 문서",
      "label": "한국거래소 · 유가증권시장 업무규정 (제61차 일부개정, 2026-09-14 시행, 규정 제2497호)",
      "href": "https://rule.krx.co.kr/",
      "note": "2026-10-09 KRX 법무포털에서 현행 조문 확인. 제20조의4제2항·제3항 LP 괴리율 2%(해외 기초자산 5%), 제87조의2제1항제2호 1배 초과 배율(음의 배율 포함) ETF·ETN 개인 매수 시 기본예탁금, 제106조의4 투자유의종목, 제38조의2 체결 방법 변경, 제26조제1항제2호의3 매매거래정지. 한국 관할. 조문별 고정 주소가 없어 포털 첫 화면으로 연결"
    },
    {
      "kind": "공식 문서",
      "label": "한국거래소 · 유가증권시장 업무규정 시행세칙 (제177차 일부개정, 2026-09-14 시행, 세칙 제2499호)",
      "href": "https://rule.krx.co.kr/",
      "note": "2026-10-09 KRX 법무포털에서 현행 조문 확인. 제134조의5·제134조의6 장종료시 실시간 괴리율이 규정 비율의 2배 이상이면 지정예고, 10매매거래일 이내 재해당 시 투자유의종목 지정. 제111조의3 기본예탁금 1단계 1천만원 미만(면제 포함)·2단계 1천만원·3단계 1천만원 초과 3천만원 이하, 최초 계좌는 2·3단계, 단일종목 상품 3천만원 이상(현금). 한국 관할"
    },
    {
      "kind": "공식 문서",
      "label": "금융위원회 · 국내-해외상장 ETF 간 비대칭 규제 해소를 위한 자본시장법 시행령 개정안 국무회의 의결 (2026-04-21 보도자료)",
      "href": "https://www.fsc.go.kr/po010101/86751",
      "note": "2026-10-09 원문 확인. 국내상장·해외상장 레버리지 ETF·ETN 사전교육 1시간, 단일종목 레버리지·인버스 ETF·ETN 심화 사전교육 1시간 추가(금융투자협회 규정 개정). 한국 관할"
    },
    {
      "kind": "공식 문서",
      "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
      "href": "https://fsc.go.kr/po010101/74332",
      "note": "2026-10-09 원문 확인. 2020년 발표 시점의 방안: 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육·신용거래 제외·위탁증거금 100%. 괴리율 수치는 현행 거래소 규정(2%·5%, 투자유의 2배)과 다름. 한국 관할"
    }
```

### `src/content/registrations/finance-audit-current.ts`
```
old:
    "href": "https://s.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350542",
    "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
  }
new:
    "href": "https://s.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350542",
    "note": "2026-10-04 원문 확인. 본문의 제도 적용 범위와 가정 계산을 구분했습니다."
  },
  {
    "kind": "공식 문서",
    "label": "금융감독원 · 커버드콜 ETF 명칭 및 수익구조에 대한 소비자 경보(주의) 발령 (소비자경보 2024-26호, 2024-07-26 배포·07-29 조간)",
    "href": "https://samsungfire.com/download/consumer/ca_d71.pdf",
    "note": "2026-10-09 원문 확인(쪽 이미지 대조). 종목명 분배율은 운용사가 제시하는 목표 분배율일 뿐 확정분배율이 아니고, 분배율은 분배기준일 NAV 대비라 투자원금과 무관하며, 종목명의 “프리미엄”은 옵션 프리미엄을 뜻한다는 문구와 919원 표(3쪽, 매월 NAV 5% 하락·매월 NAV 1% 분배 가정)의 출처. 한국 관할. 금감원 누리집(fss.or.kr)이 2026-10-08~10 전기설비 점검으로 중단되어, 삼성화재가 소비자보호 자료로 게시한 같은 보도자료 PDF(문서 작성자 금융감독원)로 대조했습니다. fss.or.kr 재개 후 원 주소로 바꿀 것."
  }
```
```
old:
    "note": "2026-10-09 재확인 시 자동 조회 불가(시간 초과·403). 정의 문구는 검색 요약으로만 확인해 미검증입니다."
new:
    "note": "2026-10-09 브라우저 렌더링으로 원문 대조. “When a market is in contango, the forward price of a futures contract is higher than the spot price.”와 만기 수렴 문장(“as the futures contract approaches maturity, the futures price will converge with the spot price”) 확인."
```
```
old:
    "note": "2026-10-09 재확인 시 자동 조회 불가(시간 초과·403). “marks positions to market twice a day”는 검색 요약으로만 확인해 미검증입니다."
new:
    "note": "2026-10-09 브라우저 렌더링으로 원문 대조(Matthew Waldis, 2020-03-25). “We mark positions to market twice a day to prevent losses from accumulating over time.” 확인. 미국 CME Clearing 관행."
```
```
old:
  {
    "kind": "공식 문서",
    "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
    "href": "https://fsc.go.kr/po010101/74332",
    "note": "2026-10-09 원문 확인. 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육. 한국 관할이며 2020년 발표 시점의 방안이라 현행 거래소 규정과는 대조하지 못했습니다."
  },
  {
    "kind": "공식 문서",
    "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
    "href": "https://fsc.go.kr/po010101/74332",
    "note": "2026-10-09 원문 확인. 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육. 한국 관할이며 2020년 발표 시점의 방안이라 현행 거래소 규정과는 대조하지 못했습니다."
  }
new:
  {
    "kind": "공식 문서",
    "label": "한국거래소 · 유가증권시장 업무규정 (제61차 일부개정, 2026-09-14 시행, 규정 제2497호)",
    "href": "https://rule.krx.co.kr/",
    "note": "2026-10-09 KRX 법무포털에서 현행 조문 확인. 제20조의4제2항·제3항 LP 괴리율 2%(해외 기초자산 5%), 제87조의2제1항제2호 1배 초과 배율(음의 배율 포함) ETF·ETN 개인 매수 시 기본예탁금, 제106조의4 투자유의종목, 제38조의2 체결 방법 변경, 제26조제1항제2호의3 매매거래정지. 한국 관할. 조문별 고정 주소가 없어 포털 첫 화면으로 연결"
  },
  {
    "kind": "공식 문서",
    "label": "한국거래소 · 유가증권시장 업무규정 시행세칙 (제177차 일부개정, 2026-09-14 시행, 세칙 제2499호)",
    "href": "https://rule.krx.co.kr/",
    "note": "2026-10-09 KRX 법무포털에서 현행 조문 확인. 제134조의5·제134조의6 장종료시 실시간 괴리율이 규정 비율의 2배 이상이면 지정예고, 10매매거래일 이내 재해당 시 투자유의종목 지정. 제111조의3 기본예탁금 1단계 1천만원 미만(면제 포함)·2단계 1천만원·3단계 1천만원 초과 3천만원 이하, 최초 계좌는 2·3단계, 단일종목 상품 3천만원 이상(현금). 한국 관할"
  },
  {
    "kind": "공식 문서",
    "label": "금융위원회 · 국내-해외상장 ETF 간 비대칭 규제 해소를 위한 자본시장법 시행령 개정안 국무회의 의결 (2026-04-21 보도자료)",
    "href": "https://www.fsc.go.kr/po010101/86751",
    "note": "2026-10-09 원문 확인. 국내상장·해외상장 레버리지 ETF·ETN 사전교육 1시간, 단일종목 레버리지·인버스 ETF·ETN 심화 사전교육 1시간 추가(금융투자협회 규정 개정). 한국 관할"
  },
  {
    "kind": "공식 문서",
    "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
    "href": "https://fsc.go.kr/po010101/74332",
    "note": "2026-10-09 원문 확인. 2020년 발표 시점의 방안: 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육·신용거래 제외·위탁증거금 100%. 괴리율 수치는 현행 거래소 규정(2%·5%, 투자유의 2배)과 다름. 한국 관할"
  }
```

### `src/content/registrations/forwards-and-futures.ts`
```
old:
    "note": "2026-10-09 재확인 시 자동 조회 불가(시간 초과·403). 정의 문구는 검색 요약으로만 확인해 미검증입니다."
new:
    "note": "2026-10-09 브라우저 렌더링으로 원문 대조. “When a market is in contango, the forward price of a futures contract is higher than the spot price.”와 만기 수렴 문장(“as the futures contract approaches maturity, the futures price will converge with the spot price”) 확인."
```
```
old:
    "note": "2026-10-09 재확인 시 자동 조회 불가(시간 초과·403). “marks positions to market twice a day”는 검색 요약으로만 확인해 미검증입니다."
new:
    "note": "2026-10-09 브라우저 렌더링으로 원문 대조(Matthew Waldis, 2020-03-25). “We mark positions to market twice a day to prevent losses from accumulating over time.” 확인. 미국 CME Clearing 관행."
```

### `src/content/registrations/funds-etfs-and-etns.ts`
```
old:
  {
    "kind": "공식 문서",
    "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
    "href": "https://fsc.go.kr/po010101/74332",
    "note": "2026-10-09 원문 확인. 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육. 한국 관할이며 2020년 발표 시점의 방안이라 현행 거래소 규정과는 대조하지 못했습니다."
  },
  {
    "kind": "공식 문서",
    "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
    "href": "https://fsc.go.kr/po010101/74332",
    "note": "2026-10-09 원문 확인. 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육. 한국 관할이며 2020년 발표 시점의 방안이라 현행 거래소 규정과는 대조하지 못했습니다."
  }
new:
  {
    "kind": "공식 문서",
    "label": "한국거래소 · 유가증권시장 업무규정 (제61차 일부개정, 2026-09-14 시행, 규정 제2497호)",
    "href": "https://rule.krx.co.kr/",
    "note": "2026-10-09 KRX 법무포털에서 현행 조문 확인. 제20조의4제2항·제3항 LP 괴리율 2%(해외 기초자산 5%), 제87조의2제1항제2호 1배 초과 배율(음의 배율 포함) ETF·ETN 개인 매수 시 기본예탁금, 제106조의4 투자유의종목, 제38조의2 체결 방법 변경, 제26조제1항제2호의3 매매거래정지. 한국 관할. 조문별 고정 주소가 없어 포털 첫 화면으로 연결"
  },
  {
    "kind": "공식 문서",
    "label": "한국거래소 · 유가증권시장 업무규정 시행세칙 (제177차 일부개정, 2026-09-14 시행, 세칙 제2499호)",
    "href": "https://rule.krx.co.kr/",
    "note": "2026-10-09 KRX 법무포털에서 현행 조문 확인. 제134조의5·제134조의6 장종료시 실시간 괴리율이 규정 비율의 2배 이상이면 지정예고, 10매매거래일 이내 재해당 시 투자유의종목 지정. 제111조의3 기본예탁금 1단계 1천만원 미만(면제 포함)·2단계 1천만원·3단계 1천만원 초과 3천만원 이하, 최초 계좌는 2·3단계, 단일종목 상품 3천만원 이상(현금). 한국 관할"
  },
  {
    "kind": "공식 문서",
    "label": "금융위원회 · 국내-해외상장 ETF 간 비대칭 규제 해소를 위한 자본시장법 시행령 개정안 국무회의 의결 (2026-04-21 보도자료)",
    "href": "https://www.fsc.go.kr/po010101/86751",
    "note": "2026-10-09 원문 확인. 국내상장·해외상장 레버리지 ETF·ETN 사전교육 1시간, 단일종목 레버리지·인버스 ETF·ETN 심화 사전교육 1시간 추가(금융투자협회 규정 개정). 한국 관할"
  },
  {
    "kind": "공식 문서",
    "label": "금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)",
    "href": "https://fsc.go.kr/po010101/74332",
    "note": "2026-10-09 원문 확인. 2020년 발표 시점의 방안: 괴리율 의무 범위(국내 3%·해외 6%), 투자유의종목 적출요건 30%→6%·12%, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육·신용거래 제외·위탁증거금 100%. 괴리율 수치는 현행 거래소 규정(2%·5%, 투자유의 2배)과 다름. 한국 관할"
  }
```

### `src/content/article-evidence.ts`
```
old:
      note: "두 비율의 선언(14쪽), 미국에서 25년마다 두 배라는 근거(20~21쪽), 섬 설정(21~23쪽), 100년 셈과 7,700만 명(24쪽), 세계로 넓힌 두 수열(25쪽)과 512 대 10(26쪽 첫 줄)의 출처. Internet Archive의 1798년 초판 스캔을 읽었고 쪽수는 OCR 쪽 머리글 기준(2026-10-09 재대조)이며 쪽 이미지로 따로 대조하지는 않았음",
    },
new:
      note: "두 비율의 선언(14쪽), 미국에서 25년마다 두 배라는 근거(20~21쪽), 섬 설정(21~23쪽), 100년 셈과 7,700만 명(24쪽), 세계로 넓힌 두 수열(25쪽)과 512 대 10(26쪽 첫 줄)의 출처. Internet Archive의 1798년 초판 스캔을 읽었고 쪽수는 OCR 쪽 머리글 기준(2026-10-09 재대조)이며 쪽 이미지로 따로 대조하지는 않았음",
    },
    {
      kind: "공식 문서",
      label:
        "Jutta Bolt · Jan Luiten van Zanden, Maddison Project Database, version 2023 (Groningen Growth and Development Centre)",
      href: "https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023",
      note: "2026-10-09에 mpd2023_web.xlsx(dataverse.nl 배포 파일)를 내려받아 Regional data 시트의 World GDP pc·World Population을 읽음. 1820년 1,127.7달러·1,042,017천 명, 1950년 3,360.2달러, 2022년 16,676.7달러·7,802,034천 명(2011년 달러, 연중 인구). 7.5배·15배는 이 글이 나눈 비율. 방법은 Bolt · Van Zanden (2024), Journal of Economic Surveys, DOI 10.1111/joes.12618",
    },
    {
      kind: "공식 문서",
      label:
        "United Nations, DESA Population Division, World Population Prospects 2024, Demographic Indicators (Medium variant)",
      href: "https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz",
      note: "2026-10-09에 배포 CSV를 내려받아 Location=World 행의 TFR(여성 1명당 출생아 수)을 읽음. 1950년 4.8519, 2023년 2.2505. 소득과 출산이 같은 기간에 함께 움직였다는 것만 뒷받침하고 인과는 뒷받침하지 않음",
    },
```

### `src/content/registrations/why-per-head-stalls.ts`
```
old:
    note: "두 비율의 선언(14쪽), 미국에서 25년마다 두 배라는 근거(20~21쪽), 섬 설정(21~23쪽), 100년 셈과 7,700만 명(24쪽), 세계로 넓힌 두 수열(25쪽)과 512 대 10(26쪽 첫 줄)의 출처. Internet Archive의 1798년 초판 스캔을 읽었고 쪽수는 OCR 쪽 머리글 기준(2026-10-09 재대조)이며 쪽 이미지로 따로 대조하지는 않았음",
  },
new:
    note: "두 비율의 선언(14쪽), 미국에서 25년마다 두 배라는 근거(20~21쪽), 섬 설정(21~23쪽), 100년 셈과 7,700만 명(24쪽), 세계로 넓힌 두 수열(25쪽)과 512 대 10(26쪽 첫 줄)의 출처. Internet Archive의 1798년 초판 스캔을 읽었고 쪽수는 OCR 쪽 머리글 기준(2026-10-09 재대조)이며 쪽 이미지로 따로 대조하지는 않았음",
  },
  {
    kind: "공식 문서",
    label:
      "Jutta Bolt · Jan Luiten van Zanden, Maddison Project Database, version 2023 (Groningen Growth and Development Centre)",
    href: "https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023",
    note: "2026-10-09에 mpd2023_web.xlsx(dataverse.nl 배포 파일)를 내려받아 Regional data 시트의 World GDP pc·World Population을 읽음. 1820년 1,127.7달러·1,042,017천 명, 1950년 3,360.2달러, 2022년 16,676.7달러·7,802,034천 명(2011년 달러, 연중 인구). 7.5배·15배는 이 글이 나눈 비율. 방법은 Bolt · Van Zanden (2024), Journal of Economic Surveys, DOI 10.1111/joes.12618",
  },
  {
    kind: "공식 문서",
    label:
      "United Nations, DESA Population Division, World Population Prospects 2024, Demographic Indicators (Medium variant)",
    href: "https://population.un.org/wpp/assets/Excel%20Files/1_Indicator%20(Standard)/CSV_FILES/WPP2024_Demographic_Indicators_Medium.csv.gz",
    note: "2026-10-09에 배포 CSV를 내려받아 Location=World 행의 TFR(여성 1명당 출생아 수)을 읽음. 1950년 4.8519, 2023년 2.2505. 소득과 출산이 같은 기간에 함께 움직였다는 것만 뒷받침하고 인과는 뒷받침하지 않음",
  },
```

## 후속 작업 결과 (3차)
처리일 2026-10-10. 담당 2건: 금감원 소비자경보 원 주소 교체(보류) · 상품명 변경 조치(적용).

| 항목 | 판정 | 근거 URL·인용·보류 사유 |
|---|---|---|
| #11-(a) fss.or.kr 원 주소로 citeKey 11·evidence href 교체 | **보류** | 2026-10-10 curl: https://www.fss.or.kr/ 와 https://www.fss.or.kr/fss/bbs/B0000188/list.do?menuNo=200218 모두 HTTP 200이지만 본문은 `<title>금융감독원 대국민 서비스 중단 안내</title>`(점검 2026.10.08 18:00 ~ 10.10 24:00)라 게시물 검색 불가. Wayback CDX(`fss.or.kr/fss/bbs/B0000188/view.do?menuNo=200218&nttId=1368*~1374*`, matchType=prefix)로 2024-07~08 보도자료 사본 60여 건을 훑고 이웃 게시물을 직접 열어 날짜를 맞춤(nttId 137323=2024-07-24 은행권 내부통제 점검결과, 137326·137346·137349, 137352=2024-07-29 위메프·티몬 합동 현장점검) — 2024-07-26 배포 커버드콜 경보 게시물은 Wayback에 수집된 적이 없음. 소비자경보 게시판(B0000175) 사본은 2024-11 이후(nttId 138761, 187545=2024-32호 공개매수)만 있음. korea.kr(정책브리핑) 검색도 해당 보도자료 없음. Internet Archive 자체도 이날 간헐적으로 "Temporarily Offline"이었음. **재시도 시점: 2026-10-11 00:00 점검 종료 이후** fss.or.kr 보도자료 검색("커버드콜")으로 nttId를 받아 href를 바꿀 것. 글의 citeKey 11 본문·evidence note의 "삼성화재 사본" 설명은 사실 그대로라 손대지 않음. |
| #11-(b) 상품명 변경 조치(2024-09) 1차 원문 | **적용 + 공용파일 목록으로 이관** | 금감원·거래소·협회 문서는 못 찾음(fss.or.kr 중단, KIND 뷰어 `acptNo=20240923000063` "[KODEX 미국배당커버드콜액티브] ETF기타시장안내"는 본문이 JS 렌더링이라 curl로 읽지 못함, 미래에셋 공지가 링크한 koscom 공시 relay는 404). 대신 지시문이 1차로 인정한 **운용사 공시** 두 건을 원문 HTML로 직접 읽음(둘 다 HTTP 200, 2026-10-10). ① https://investments.miraeasset.com/tigeretf/ko/customer/notice/view.do?detailsKey=557 — "커버드콜 월배당 ETF 9종 명칭 변경 사전 안내의 건 2024.09.19", 표 9종(TIGER 미국배당+3%프리미엄다우존스 → TIGER 미국배당다우존스타겟커버드콜1호, … TIGER 배당프리미엄액티브 → TIGER 배당커버드콜액티브), "2. 효력 발생일 : 2024년 9월 25일", "3. 변경 사유 : 커버드콜 ETF 목표분배수익률, 수익구조 등 투자에 있어 투자자 오인발생 가능성을 고려, 상장명 명칭 변경을 통해 투자자 보호를 강화하고자 함", "기존의 ETF 운용 전략 및 타겟 분배율은 변함이 없는 점 참고 부탁 드리며". ② https://www.samsungfund.com/etf/lounge/notice-view.do?no=62474 — "Kodex ETF 5종 명칭 변경 안내 2024.09.23", "2024년 9월 25일부로 Kodex ETF 5종의 펀드명 변경 사항이 있어 아래와 같이 공지드립니다.", "투자전략 인지 제고를 위한 종목명 변경", 표(483280 Kodex 미국AI테크TOP10+15%프리미엄 → Kodex 미국AI테크TOP10타겟커버드콜, 481060 Kodex 미국30년국채+12%프리미엄(합성 H) → Kodex 미국30년국채타겟커버드콜(합성 H), 483290, 441640, 475080). 보조로 삼성 규약 변경 공시 https://www.samsungfund.com/fund/lounge/announcement/fund-view.do?no=227331 ("명칭 변경(KODEX 미국30년국채+12%프리미엄 → KODEX 미국30년국채타겟커버드콜), 커버드콜 공시서식 개정 반영", "3. 효력발생일 : 2024-09-25") 확인. **본문**: 10절 여섯째 문단 끝의 "이후 상품명을 바꾼 조치는 금융감독원 원문으로 확인하지 못해 여기서 다루지 않습니다." 범위 문장을 지우고, 그 뒤에 문단 3개(날짜·사례 이름 먼저 → 미래에셋 공지의 사유 인용 → 919원 계산이 새 이름에도 적용되며 감독당국 요구 문서 자체는 미확인이라는 범위)를 넣고 citeKey 12(미래에셋)·13(삼성) 인용 블록을 citeKey 11 뒤에 추가. 2차 보도(mt.co.kr 등)는 근거로 쓰지 않음. |

고친 글 파일: `src/pages/articles/markets/covered-calls-and-income-funds.tsx`. 검증: `bash scripts/check-article.sh markets/covered-calls-and-income-funds` — learning contract·knowledge graph·viz·naturalness·term-density·term-pair·reading-order 통과, prose-readability는 처음 긴 문단 1개가 걸려 둘로 나눈 뒤 이 글은 재검토 목록에서 빠짐(남은 rc=1은 firms/why-firms-exist). `npx eslint` 통과.

## 후속 공용 파일 수정 목록 (3차)
각 old는 2026-10-10 현재 해당 파일에서 한 번만 나온다(python count==1 확인). 두 파일 모두 기존 금감원 소비자경보(삼성화재 사본) 항목 바로 뒤에 두 항목을 추가한다.

### `src/content/article-evidence.ts`
```old
PDF(문서 작성자 금융감독원)로 대조했습니다. fss.or.kr 재개 후 원 주소로 바꿀 것."
    }
```
```new
PDF(문서 작성자 금융감독원)로 대조했습니다. fss.or.kr 재개 후 원 주소로 바꿀 것."
    },
    {
      "kind": "공식 문서",
      "label": "미래에셋자산운용 · 커버드콜 월배당 ETF 9종 명칭 변경 사전 안내의 건 (TIGER ETF 공지사항, 2024-09-19)",
      "href": "https://investments.miraeasset.com/tigeretf/ko/customer/notice/view.do?detailsKey=557",
      "note": "2026-10-10 원문 확인. 미래에셋자산운용 TIGER ETF 공지사항(2024-09-19). “2. 효력 발생일 : 2024년 9월 25일”, “3. 변경 사유 : 커버드콜 ETF 목표분배수익률, 수익구조 등 투자에 있어 투자자 오인발생 가능성을 고려, 상장명 명칭 변경을 통해 투자자 보호를 강화하고자 함”, “기존의 ETF 운용 전략 및 타겟 분배율은 변함이 없는 점 참고 부탁 드리며”. 변경 전·후 9종 표(TIGER 미국배당+3%프리미엄다우존스 → TIGER 미국배당다우존스타겟커버드콜1호 등). 한국 관할. 운용사 공지이며 감독당국이 운용사에 보낸 요구 문서 자체는 확인하지 못했습니다."
    },
    {
      "kind": "공식 문서",
      "label": "삼성자산운용 · Kodex ETF 5종 명칭 변경 안내 (Kodex 공지사항, 2024-09-23)",
      "href": "https://www.samsungfund.com/etf/lounge/notice-view.do?no=62474",
      "note": "2026-10-10 원문 확인. 삼성자산운용 Kodex 공지사항(2024-09-23). “2024년 9월 25일부로 Kodex ETF 5종의 펀드명 변경 사항이 있어 아래와 같이 공지드립니다.”, 사유 “투자전략 인지 제고를 위한 종목명 변경”, 표 5종(481060 Kodex 미국30년국채+12%프리미엄(합성 H) → Kodex 미국30년국채타겟커버드콜(합성 H) 등). 같은 운용사의 규약 변경 공시(https://www.samsungfund.com/fund/lounge/announcement/fund-view.do?no=227331, 2024-09-25, 효력발생일 2024-09-25)도 같은 명칭 변경을 적습니다. 한국 관할."
    }
```

### `src/content/registrations/finance-audit-current.ts`
```old
PDF(문서 작성자 금융감독원)로 대조했습니다. fss.or.kr 재개 후 원 주소로 바꿀 것."
  }
```
```new
PDF(문서 작성자 금융감독원)로 대조했습니다. fss.or.kr 재개 후 원 주소로 바꿀 것."
  },
  {
    "kind": "공식 문서",
    "label": "미래에셋자산운용 · 커버드콜 월배당 ETF 9종 명칭 변경 사전 안내의 건 (TIGER ETF 공지사항, 2024-09-19)",
    "href": "https://investments.miraeasset.com/tigeretf/ko/customer/notice/view.do?detailsKey=557",
    "note": "2026-10-10 원문 확인. 미래에셋자산운용 TIGER ETF 공지사항(2024-09-19). “2. 효력 발생일 : 2024년 9월 25일”, “3. 변경 사유 : 커버드콜 ETF 목표분배수익률, 수익구조 등 투자에 있어 투자자 오인발생 가능성을 고려, 상장명 명칭 변경을 통해 투자자 보호를 강화하고자 함”, “기존의 ETF 운용 전략 및 타겟 분배율은 변함이 없는 점 참고 부탁 드리며”. 변경 전·후 9종 표(TIGER 미국배당+3%프리미엄다우존스 → TIGER 미국배당다우존스타겟커버드콜1호 등). 한국 관할. 운용사 공지이며 감독당국이 운용사에 보낸 요구 문서 자체는 확인하지 못했습니다."
  },
  {
    "kind": "공식 문서",
    "label": "삼성자산운용 · Kodex ETF 5종 명칭 변경 안내 (Kodex 공지사항, 2024-09-23)",
    "href": "https://www.samsungfund.com/etf/lounge/notice-view.do?no=62474",
    "note": "2026-10-10 원문 확인. 삼성자산운용 Kodex 공지사항(2024-09-23). “2024년 9월 25일부로 Kodex ETF 5종의 펀드명 변경 사항이 있어 아래와 같이 공지드립니다.”, 사유 “투자전략 인지 제고를 위한 종목명 변경”, 표 5종(481060 Kodex 미국30년국채+12%프리미엄(합성 H) → Kodex 미국30년국채타겟커버드콜(합성 H) 등). 같은 운용사의 규약 변경 공시(https://www.samsungfund.com/fund/lounge/announcement/fund-view.do?no=227331, 2024-09-25, 효력발생일 2024-09-25)도 같은 명칭 변경을 적습니다. 한국 관할."
  }
```
