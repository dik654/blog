# F-applied-economics · institutions 감사 원장
확인일: 2026-10-09. 글 9편. 열어 본 URL 47개(성공 45 / 실패 2 — 글에 적힌 고유 URL 21개 중 20개 열람 성공, 1개(floodsmart.gov)는 모든 경로에서 차단. 나머지 26개는 교차 확인용으로 연 World Bank API 6건·Crossref 4건·HIRA·지표누리·EU Publications Office·M49 overview·FEMA 검색 등이며 그중 M49 FAQ 하위 경로 1건 404). 판정: WRONG 0 · OUTDATED 0 · MISLEADING 0 · CALC 1 · LINK 3 · MISSING 8 · UNVERIFIED 1.

전제: 글의 수치 사례는 전부 (가정)이므로 사실 주장이 아니다. 계산은 전부 python3로 재계산했고 모두 일치했다(아래 글별 기록). 일부 1차 자료(OECD·NHS England·CBO·IMF·FTC·NAIC·EUR-Lex)는 curl에서 403/202 봇 차단을 냈다. 이들은 WebFetch·Chrome 브라우저·EU Publications Office 대체 경로로 원문을 열어 인용문을 대조했다.

## 요약
- 발견: WRONG 0 · OUTDATED 0 · MISLEADING 0 · CALC 1 · LINK 3 · MISSING 8 · UNVERIFIED 1
- 가장 중요한 발견
  1. **의료 지불 글이 한국의 실제 지불제도(행위별수가제 근간 + 7개 질병군 포괄수가제 + 요양병원 정액수가)를 빼고 "급여 항목 안내"만 비교함** — `healthcare-payment-systems.tsx:82` (MISSING). 4절이 건별 지급과 묶음 지급의 차이를 핵심 메커니즘으로 세우는데, 한국 사례와는 연결하지 않았다.
  2. **보험 글이 역선택·도덕적 해이를 설명만 하고 이름을 붙이지 않음** — `insurance-risk-pooling.tsx:46`, 3절 `:53-57` (MISSING). Akerlof(1970)·Rothschild–Stiglitz(1976) 계보로 이어질 표준 용어가 없다.
  3. **인과 글이 계산하는 것은 이중차분(DiD)이고 핵심 가정은 평행 추세인데, 두 용어가 어디에도 없음** — `evidence-measurement-and-causality.tsx:42,75` (MISSING).
  4. **ICH E8(R1) 인용 절 번호가 틀림.** "§5.3 및 §6"이라고 적었지만, 배정 이후 탈락이 해석에 영향을 준다는 문장은 §5.5(Methods to Reduce Bias)와 §5.6에 있다 — `evidence-measurement-and-causality.tsx:120`, `article-evidence.ts:11501` (LINK).
  5. **"두 짧은 인용은 합계 21단어"라고 했지만 실제로는 8+11=19단어** — `culture-norms-and-coordination.tsx:91`, `article-evidence.ts:11500` (CALC, 심각도 낮음).
- 확인된 강점: how-to-read-a-country의 국가 탐색기 스냅샷 값 856개가 2026-10-09 World Bank API(lastupdated 2026-10-08)와 값·연도 모두 100% 일치했다. M49 248개, 코소보 412·대만 158, WB 비집계 경제 217개, 미매핑 Channel Islands 1개도 전부 원자료와 맞는다. 판정 가능한 excerpt 20개는 모두 원문 그대로다.

## 발견 (심각도 순)
| # | route | 위치(file:line) | 주장(원문 인용) | 판정 | 근거(URL + 인용문) | 제안 수정 |
|---|---|---|---|---|---|---|
| 1 | institutions/healthcare-payment-systems | `src/pages/articles/institutions/healthcare-payment-systems.tsx:82` "한국 국민건강보험공단은 급여 항목을 안내합니다. 비용 부담도 구분해 설명합니다." (4절 `:63-65`에 건별 지급·묶음 지급·인두제 정의) | MISSING | https://www.hira.or.kr/dummy.do?pgmid=HIRAA020028000000 — "건강보험 행위별수가제(fee-for-service)는 … 사용량과 가격에 의해 진료비를 지불하는 제도로 우리나라는 의료보험 도입 당시부터 채택하고 있습니다. 또한, 행위별수가제의 보완 및 의료자원의 효율적 활용을 위하여 「질병군별 포괄수가제(DRG)」와 「정액수가제(요양병원, 보건기관 등)」도 병행하여 실시하고 있습니다." / "2013년 7월부터 전국 모든 의료기관"(7개 질병군) | 6절 한국 문단에 한 문장 추가: 한국은 행위별수가제(건별 지급)가 근간이고, 7개 질병군 포괄수가제(2013-07부터 전 의료기관)와 요양병원 정액수가가 묶음·정액 지급에 해당한다. 심평원 링크도 붙인다. 1절 "지급자 확인"은 한국에서 심평원 심사와 공단 지급으로 나뉜다는 점도 보강한다. |
| 2 | institutions/insurance-risk-pooling | `src/pages/articles/institutions/insurance-risk-pooling.tsx:46` "위험이 큰 사람만 모이면 처음 예상한 20명보다 사고가 많아질 수 있습니다 … 보장이 있다는 이유로 예방을 줄이면 실제 사고 비용이 늘 수도 있습니다." / `:53-57` 3절은 "위험 풀·면책·한도"만 명명 | MISSING | https://api.crossref.org/works/10.2307/1879431 — Akerlof, "The Market for "Lemons": Quality Uncertainty and the Market Mechanism", QJE 84(3), 1970 / https://api.crossref.org/works/10.2307/1885326 — Rothschild & Stiglitz, "Equilibrium in Competitive Insurance Markets: An Essay on the Economics of Imperfect Information", QJE 90(4), 1976 | 3절에 "역선택(adverse selection)"과 "도덕적 해이(moral hazard)"를 2절 현상에 대응시켜 추가하고 knowledge-graph 개념 노드에 연결한다. 7절의 "독립적인 작은 사고를 모을 때의 효과"에는 "대수의 법칙"이라는 이름을 붙인다. |
| 3 | institutions/evidence-measurement-and-causality | `src/pages/articles/institutions/evidence-measurement-and-causality.tsx:42` "두 변화의 차이는−2−(−1)=−1kWh/가구·일", `:75` "A도 개입 없이 B와 같은 추세를 따랐을 것이라고 가정해 추가감소 1을 얻습니다" | MISSING | 표준 용어 부재: 본문·article-learning·knowledge-graph `:28546-28548`을 전수 grep한 결과 "이중차분"·"difference-in-differences"·"평행 추세"·"parallel trends" 0건 | 4절에 한 문장 추가: 이 계산을 이중차분(difference-in-differences), 이 가정을 평행 추세(parallel trends) 가정이라 부른다. counterfactual-comparison-design 정의에도 연결한다. |
| 4 | institutions/evidence-measurement-and-causality | `evidence-measurement-and-causality.tsx:120` CitationBlock "ICH · E8(R1), §5.3 및 §6 … 배정 이후 탈락·측정·분석의 차이도 결과 해석에 영향을 준다는 설계 원칙", `src/content/article-evidence.ts:11501` 같은 label | LINK | https://database.ich.org/sites/default/files/E8-R1_Guideline_Step4_2022_0204%20%281%29.pdf — §5.3 제목은 "Choice of Control Group", §6은 "CONDUCT, SAFETY MONITORING, AND REPORTING". 해당 내용은 §5.5 "Methods to Reduce Bias"에 있음: "Randomisation at the start of the study addresses differences between the groups at the time of randomisation but does not prevent bias due to differences arising during the study. Events after randomisation … may affect the validity and interpretation of comparisons between treatment groups." 및 §5.6 "sensitivity analyses should be planned to assess the impact of that assumption on the study results" | label을 "ICH · E8(R1), §5.5·§5.6"으로 정정한다. §5.3을 비교군 선택 근거로 남기려면 "§5.3(비교군)·§5.5(배정 후 편향)"으로 나눠 적는다. |
| 5 | institutions/education-skills-and-signals | `src/content/knowledge-graph.ts:28511` "학위·자격이 능력 자체를 바꾸지 않아도 고용주에게 정보를 제공해 채용과 임금을 바꾸는 효과입니다.", `education-skills-and-signals.tsx:54` | MISSING | https://api.crossref.org/works/10.2307/1882010 — Spence, "Job Market Signaling", The Quarterly Journal of Economics 87(3):355–374, 1973-08. 신호가 정보를 전하려면 신호 취득 비용이 능력에 따라 달라야 한다(분리 조건)는 것이 이 모형의 핵심이다. 원 논문 본문은 JSTOR 유료라 열지 않았고, 서지만 Crossref로 확인했다. | 3절에 조건 한 줄과 원전 인용을 추가한다: 자격이 신호로 작동하려면 능력이 높은 사람에게 그 자격을 얻는 비용이 더 낮아야 한다(Spence 1973). |
| 6 | institutions/public-budget-and-taxes | `src/pages/articles/institutions/public-budget-and-taxes.tsx:82` "중앙정부인지 지방정부와 사회보험을 포함한 일반정부인지 맞춰야 합니다." | MISSING | https://www.index.go.kr/unity/potal/main/EachDtlPageDetail.do?idx_cd=1104 — "관리재정수지 - 재정건전성 여부를 명확히 판단하기 위해 통합재정수지에서 사회보장성기금 수지를 제외한 수치 … * 사회보장성기금 : 국민연금, 사학연금, 고용보험, 산재보험" | 6절에 한 문장 추가: 한국의 통합재정수지와 관리재정수지 구분은 사회보험 포함 여부가 실제 공식 지표를 가르는 예다. |
| 7 | institutions/population-migration-and-care | `src/pages/articles/institutions/population-migration-and-care.tsx:99-102` "나이와 성별을 나눈 현재 인구에 출생·사망·이동을 적용해 다음 해를 만듭니다 … 전입 3명과 전출 2명은 각자의 나이 위치에 반영됩니다", `:77` "여기서는 연령 부양비라고 부릅니다" | MISSING | https://population.un.org/wpp/assets/Files/WPP2024_Methodology.pdf — "the core approach underlying the population estimates and projections in the 2024 revision is the cohort-component method for projecting population (CCMPP)"; 목차 "E. ESTIMATING NET INTERNATIONAL MIGRATION" | 5절에 방법 이름 "코호트 요인법(CCMPP)"을 넣고, UN은 전입·전출이 아니라 순국제이동을 쓴다는 점을 밝힌다. 3절에는 UN 표준명 "총부양비(total dependency ratio)"를 병기한다. |
| 8 | institutions/culture-norms-and-coordination | `src/pages/articles/institutions/culture-norms-and-coordination.tsx:91` "같은 선언의 두 짧은 인용은 합계 21단어입니다.", `src/content/article-evidence.ts:11500` note 동일 | CALC | https://www.unesco.org/en/legal-affairs/unesco-universal-declaration-cultural-diversity — 인용 두 개: "Culture takes diverse forms across time and space."(8단어), "No one may invoke cultural diversity to infringe upon human rights"(11단어) → 합계 19단어 | "합계 19단어"로 정정하거나 단어 수 언급을 삭제한다. |
| 9 | institutions/education-skills-and-signals (+ healthcare-payment-systems) | `src/content/knowledge-graph.ts:28511` education-signal canonicalHref "/economics/institutions/education-skills-and-signals#comparison"; `:28475` health-financing-three-functions canonicalHref "/economics/institutions/healthcare-payment-systems#mechanism" | LINK | 본문에서 "신호 효과"를 정의하는 곳은 `education-skills-and-signals.tsx:54`(section id="names")이고, #comparison은 영국 학자금 상환 절이다. "재원 조달·위험 풀·구매" 세 기능의 정의도 `healthcare-payment-systems.tsx`의 section id="names"(3절)에 있고, #mechanism은 건별/묶음 지급 절이다. | 두 canonicalHref를 #names로 바꾼다. |
| 10 | institutions/how-to-read-a-country | `src/pages/articles/institutions/how-to-read-a-country.tsx:127` SourceApplication excerpt "for statistical convenience"를 412·158 별도 코드 설명의 근거로 사용 | LINK | https://unstats.un.org/unsd/methodology/m49/ — 이 구절의 원문은 "The assignment of countries or areas to specific groupings is for statistical convenience …"(지역 묶음 배정에 관한 문장). 412·158에 관한 원문 구절은 "However, for strictly statistical purposes, the numerical code 412 can be used to represent this area." / "…the numerical code 158 can be used to represent this area." | excerpt를 "for strictly statistical purposes"로 바꿔 application 문맥과 맞춘다. |
| 11 | institutions/media-attention-and-public-belief | `src/pages/articles/institutions/media-attention-and-public-belief.tsx:73` "EU 디지털서비스법 제27조는 … 주요 기준을 이용자가 이해할 수 있게 설명하도록 규정합니다." | MISSING | https://publications.europa.eu/resource/celex/32022R2065.ENG.xhtml — 제27조(1) 원문 일치 확인. 같은 규정 제38조(초대형 온라인 플랫폼·검색엔진은 프로파일링에 기반하지 않은 추천 옵션을 최소 1개 제공)는 본문에 없음. 제38조 문구는 이번에 원문 대조하지 않았다. | 5절에 한 문장 추가: 초대형 플랫폼(VLOP)은 제38조에 따라 프로파일링 없는 추천 옵션도 제공해야 한다(심각도 낮음, 추가 전 제38조 원문 대조 필요). |
| 12 | institutions/culture-norms-and-coordination | `culture-norms-and-coordination.tsx:55-57`(분담·관찰·이의 절차), `:114`(Ostrom 인터뷰) | MISSING | https://www.nobelprize.org/prizes/economic-sciences/2009/ostrom/164465-ostrom-williamson-interview-transcript/ — "I tried to move up a level and ask what were the generalities across the long-lasting robust systems, I called them design principles" | 2절의 장치들이 Ostrom의 "설계 원리(design principles)"에 대응한다는 점을 이름으로 연결한다(심각도 낮음). 대응 원리 목록(감시·단계적 제재·갈등 해결)은 Ostrom 1990 원전으로 따로 확인해야 한다. |
| 13 | institutions/insurance-risk-pooling | `src/pages/articles/institutions/insurance-risk-pooling.tsx:84` SourceApplication excerpt "most homeowners insurance does not cover flood damage", href https://www.floodsmart.gov/get-insured/eligibility | UNVERIFIED | 인용 페이지는 curl·WebFetch 403, Chrome도 Cloudflare 차단. 웹 검색상 같은 문구가 FEMA/NFIP 공식 자료 제목 "fema nfip most homeowners insurance does not cover flood damage postcard 08 2025"(agents.floodsmart.gov)에 있으나, 인용 URL 페이지 자체의 원문은 확인하지 못했다. | 접근 가능한 환경에서 해당 페이지 원문을 대조하거나, href를 FEMA 공식 PDF로 바꾼다. |

## 글별 검증 기록

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

## 열지 못한 자료
| URL | 상태 | 대체 확인 |
|---|---|---|
| https://www.floodsmart.gov/get-insured/eligibility | curl 403, WebFetch 403, Chrome Cloudflare 차단("Sorry, you have been blocked") | 웹 검색으로 FEMA/NFIP 공식 자료 제목·요약에 "Most homeowners insurance does not cover flood damage"가 있음을 확인. agents.floodsmart.gov PDF는 403/429로 다운로드 실패. 판정 UNVERIFIED(#13) |
| https://unstats.un.org/unsd/methodology/m49/faq/ (교차 확인용으로 시도한 경로, 글에 적힌 링크 아님) | 404 | 같은 Q&A가 https://unstats.un.org/unsd/methodology/m49/ 루트 페이지에 있어 그곳에서 412·158 원문 확인 |
| https://www.oecd.org/en/publications/education-at-a-glance-2026_b4968bbc-en/full-report/key-system-level-indicators-of-education-finance_d143f855.html | curl·WebFetch 403 | Chrome으로 열람 성공(원문 인용 확인) |
| https://www.england.nhs.uk/pay-syst/nhs-payment-scheme/ | curl·WebFetch 202 빈 응답 | Chrome으로 열람 성공 |
| https://www.cbo.gov/about/overview | curl·WebFetch 403 | Chrome으로 열람 성공 |
| https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng | curl·WebFetch 202 빈 응답 | https://publications.europa.eu/resource/celex/32022R2065.ENG.xhtml 에서 같은 규정 원문 열람 |
| https://www.imf.org/external/pubs/ft/gfs/manual/aboutgfs.htm, https://data.imf.org/en/Datasets/QGFS, https://content.naic.org/consumer/how-does-insurance-work, https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements | curl 403/404(봇 응답) | WebFetch 200으로 원문 인용 확인 |
| Spence 1973 / Akerlof 1970 / Rothschild–Stiglitz 1976 원 논문 본문 | JSTOR 유료, 열지 않음 | Crossref로 서지(저자·연도·학술지·권호·쪽)만 확인. 세 논문 모두 글에 인용되지 않았고, 빠진 내용(MISSING) 판단의 참고로만 사용 |
