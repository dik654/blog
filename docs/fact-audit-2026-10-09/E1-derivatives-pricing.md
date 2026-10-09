# E1-derivatives-pricing 감사 원장
확인일: 2026-10-09. 글 29편. 열어 본 URL 61개(성공 59 / 실패 2: Basel 통합 PDF 404, CME 스왑션 백서 403·아카이브 잘림; CME·OCC 라이브 403 9건은 web.archive.org 스냅샷으로 열었음).

데이터 파일 약어(모두 `src/pages/articles/markets/derivatives/`): D=`derivative-data.ts`, M=`derivative-model-data.ts`, A=`derivative-advanced-model-data.ts`, R=`derivative-risk-data.ts`, C=`derivative-curriculum-gaps-data.ts`, S=`derivative-specialized-market-gaps-data.ts`, L=`derivative-applied-ledgers-data.ts`, O=`derivative-operations-and-governance-data.ts`. 근거 링크 사본은 `src/content/article-evidence.ts`의 `"markets/<slug>"` 키에도 같은 href가 있으므로 LINK 판정은 두 곳 모두에 적용된다.

## 적용 결과
적용일 2026-10-09. 21건 중 적용 21(그중 일부 항목은 후속 작업 병행 4), 공용 파일 이관 2(1·2·3·4번의 article-evidence/learning 사본), 보류 0. 수식은 `DerivativeDeepArticle`에 `formulas` 필드를 새로 붙여(기존 `WorldHistoryArticle` 복사본 + `CloudCertificationArticle`과 같은 `{ section, content: ExplainedFormula props }` 모양) 5편에 7개를 넣었다. 숫자는 Python으로 재계산했다.

| # | 처리 | 내용 |
|---|---|---|
| 1 | 적용 + 공용파일 목록 | `D` 2번 출처를 CFTC 2013-27849(DCO 국제기준, 78 FR 72476)로 교체하고 excerpt를 원문(Cover One 문장)으로, 1번 출처 excerpt를 "The daily transfer of gains and losses is referred to as variation margin."으로. 9절 문단은 순서를 스트레스 시험 보고서(2016) §6에 귀속하고 2013 규칙의 재원 규모·평가분담금 제외를 덧붙임. evidence·learning 사본은 아래 목록 |
| 2 | 적용 + 공용파일 목록 | `M` 변동성 표면 출처 → MAR99 장 URL, citation MAR99.22(5), excerpt 원문 |
| 3 | 적용 + 공용파일 목록 | `A` LSV 출처 → MAR31 장 URL, MAR31.4·31.26(5), excerpt 원문 |
| 4 | 적용 + 공용파일 목록 | `R` ES 출처 → MAR33 장 URL, MAR33.3 원문 문장 |
| 5 | 적용 | `D` note "학부" → "대학원(MIT Sloan MBA 핵심 과목, OCW 표기 Level: Graduate)", `M` note도 같은 문구로 통일 |
| 6 | 적용 | CME fair value excerpt를 원문 문장으로, note에 식과 403·아카이브 사본 명시 |
| 7 | 적용 | OIC excerpt를 실제 문장으로 |
| 8 | 적용 | MIT 15.401 excerpt → "Binomial and Black-Scholes pricing models" |
| 9 | 적용 | MAR50.3(5) 실제 문장으로 |
| 10 | 적용 | Cboe 백서 실제 문장으로 |
| 11 | 적용 | 저자 순서 Zhang·Blanchet·Glynn·Giesecke, WSC 2009 |
| 12 | 적용 | CME SOFR FAQ: "할인계수와 무이표금리(연속복리, ACT/365.25)", 선도금리는 할인계수 비율로 유도; excerpt·note 교정 |
| 13 | 적용(범위 명시) + 후속 | 8절 본문을 "2차 자료로 확인한 범위에서…, CME 원문은 본문 대조 못 함"으로, note에 403·아카이브 잘림·Clarus 2차 확인 명시 |
| 14 | 적용 | 5절에 CRR·Black-Scholes(1973)·Merton(1973) 계보 문단 + `ExplainedFormula` 2개(CRR u·d·q, BS 콜 → 풋콜 등식 풋 6.70; CRR 2/10/100/1,000단계 5.42/6.42/6.67/6.70) |
| 15 | 적용(이름) + 후속 | 6절에 Dupire(1994)·Heston(1993)·Merton(1976)과 각 모형의 "보정 대상 매개변수" 문단. 식·원 논문 인용은 후속 |
| 16 | 적용 + 후속 | 6절에 Vasicek(1977)·HJM(1992) 명명, `ExplainedFormula` 2개(바시첵 dr=κ(θ−r)dt+σdW → 0.2bp·6.30bp; HJM μ=σ∫σds → 2bp/년·0.0079bp/일). Hull-White 확장은 후속 |
| 17 | 적용 + 후속 | 베이스 상관 글 6절에 1요인 가우시안 코풀라(Li, 2000) 정의(√ρ·M+√(1−ρ)·Z, 문턱 Φ⁻¹(PD)), 해저드 글 7절에 같은 이름 |
| 18 | 적용 + 후속 | MC 글 5절에 Longstaff-Schwartz(2001) 최소제곱 MC 문단(조기상환과 보유자 행사 구분) |
| 19 | 적용 | 7절 `ExplainedFormula`(Bachelier 지급 스왑션: σ_N√T=35bp, d=−0.2857, 9.53bp → 약 81만 원), 5절에 σ_N≈σ_B·F 근사(20%×4%=80bp, 70bp≈17.5%) |
| 20 | 적용 | 6절 `ExplainedFormula`(λ=½σ²S²Δt/ΔS²≤½ ⇔ Δt≤ΔS²/(σ²S²): 0.25년, S=110에서 0.207년, λ=0.02로 0.2 재현) |
| 21 | 적용 | 4절 `ExplainedFormula`(CVA=(1−R)∫EE*dPD ≈ LGD·ΣEE·ΔPD·DF, 한 칸 0.12, WWR 0.54), 8절에 CRE53.24 MPOR 하한 5/10/20영업일·CRE53.25 분쟁 시 2배(원문 재확인) |

## 요약
- 발견: WRONG 1 · OUTDATED 0 · MISLEADING 1 · CALC 0 · LINK 10 · MISSING 8 · UNVERIFIED 1
- 29편의 수치 사례 전부(이항 풋 7.99/6.29, DF₂ 0.9067·선도 5.88%, 이토 1.59, MC 표준오차 2.39→1.25, FD 0.2, HJM 2bp, 생존 98.02%, CIP 선도 1,343, SIMM √64=8, 분산 14.14%/17.32%, 희귀사건 상대오차 31.6%, 트랜치 3·4·0, 그릭스 +1.45, 백테스트 승수 1.83 등)을 Python으로 재계산했고 **계산 오류는 0건**이다.
- 가장 중요한 발견:
  1. `clearing-margin-and-default-waterfall`이 "CFTC DCO default resources rule"로 인용한 `FinalRules/2013-07970.html`은 실제로는 **「Clearing Exemption for Swaps Between Certain Affiliated Entities」(계열사 간 스왑 청산 면제, 78 FR 21749)** 이며 청산소 손실 재원 순서와 무관하다(LINK). 순서 서술 자체는 같은 글이 인용한 CFTC 스트레스테스트 보고서 §6 "Sequence of Resource Use in a Default"가 그대로 뒷받침한다.
  2. 세 글(`implied-volatility-surface…`, `local-stochastic-volatility…`, `var-expected-shortfall…`)이 인용한 `https://www.bis.org/baselframework/BaselFramework.pdf`가 **404** 다. 내용(ES 97.5%, 표면 재보정)은 MAR33.3·MAR99.22(5)로 확인되므로 장(chapter) URL로 교체하면 된다.
  3. `option-replication-and-put-call-parity`는 MIT 15.401을 "학부 금융론"이라 적었지만 OCW는 `Level: Graduate`로 표시하며, 같은 과정을 `binomial-black-scholes…`는 "대학원 금융론"이라 적어 서로 모순된다(WRONG).
  4. `sources[].excerpt` 7건이 원문에 없는 문구다(CME fair value "cash, financing charges, and dividends", OIC "guideposts, not guaranteed predictions", MIT "The Binomial Model", MAR50 "risk-neutral marginal default probabilities", Cboe "average implied correlation", Basel "volatility surface across strike and tenor", Stanford 저자 순서).
  5. 모형 계보·공식이 비어 있다: 제목에 Black-Scholes가 들어간 글에 BS 공식·CRR 모수가 없고, Dupire(1994)·Heston(1993)·Merton(1976)·Heath-Jarrow-Morton(1992)·Vasicek(1977)·Li(2000)·Longstaff-Schwartz(2001)가 29편 어디에도 이름으로 등장하지 않는다(MISSING).

## 발견 (심각도 순)
| # | route | 위치(file:line) | 주장(원문 인용) | 판정 | 근거(URL + 인용문) | 제안 수정 |
|---|---|---|---|---|---|---|
| 1 | markets/clearing-margin-and-default-waterfall | D:134 (`sources[1].href`), `article-evidence.ts` 같은 키 | `citation: "U.S. CFTC, Derivatives Clearing Organization General Provisions", href: ".../FinalRules/2013-07970.html"`, excerpt `"defaulting clearing member's initial margin"` | LINK | https://www.cftc.gov/LawRegulation/FederalRegister/FinalRules/2013-07970.html — 200. 문서 제목: "Clearing Exemption for Swaps Between Certain Affiliated Entities; Final Rule", 78 FR 21749 (2013-04-11). 본문에 "defaulting clearing member's initial margin" 문구 없음. 실제 DCO 국제기준 규칙은 https://www.cftc.gov/LawRegulation/FederalRegister/FinalRules/2013-27849.html ("Derivatives Clearing Organizations and International Standards", 78 FR 72476)이고, 손실 재원 순서는 같은 글의 1번 출처 CFTC 스트레스테스트 보고서 p.9: "The initial margin of the clearing member in default is the first resource a clearinghouse would draw upon to cover any loss. … If initial margin were insufficient to cover a loss, the clearinghouse would next draw on the guaranty fund contribution of the clearing member in default. If that was insufficient … the clearinghouse would draw on a pre-determined portion of its own capital. If there was still a loss, the next layer of protection would be the guaranty fund contributions of non-defaulting clearing members." | 2번 출처를 2013-27849(또는 2011년 DCO 일반규정 2011-27536)로 바꾸거나, 9절의 순서 서술 출처를 스트레스테스트 보고서 §6로 돌리고 excerpt를 위 문장으로 교체 |
| 2 | markets/implied-volatility-surface-skew-and-smile | M:204 | `href: "https://www.bis.org/baselframework/BaselFramework.pdf"`, `citation: "Basel Framework, MAR33 and MAR99"`, excerpt `"volatility surface across strike and tenor"` | LINK | 위 URL과 `https://www.bis.org/basel_framework/BaselFramework.pdf` 모두 **HTTP 404**(curl·WebFetch 각각 확인). 글의 178~179행 주장은 MAR99.22(5)에 있다: "Liquid options at moneyness, tenor and option expiry points may be used to calibrate level, volatility, drift and correlation parameters for a single-name or benchmark volatility surface. … must be updated and recalibrated periodically as new data arrive and trades occur. … In the event that these risk factors are used to proxy for other single-name option surface points, there must be an additional-basis non-modellable risk factor overlay" (https://www.bis.org/basel_framework/chapter/MAR/99.htm?inforce=20230101&published=20200327). MAR33은 자본 계산 장이라 이 주장의 근거가 아니다. excerpt 문구는 원문에 없다. | href를 MAR99 장 URL로, citation을 "MAR99.22(5), MAR31.16"으로, excerpt를 위 원문으로 교체 |
| 3 | markets/local-stochastic-volatility-jumps-and-calibration | A:274 | `href: ".../baselframework/BaselFramework.pdf"`, excerpt `"volatility surfaces"` | LINK | 동일 404. 대체 근거: MAR99.22(5)(위 인용), MAR31.4 "address non-linearities for options and other relevant products … as well as correlation risk and relevant basis risks", MAR31.26(5) "Calibration of pricing models to current market prices must also be sufficiently frequent" (https://www.bis.org/basel_framework/chapter/MAR/31.htm?inforce=20230101&published=20200327) | href·citation 교체 |
| 4 | markets/var-expected-shortfall-stress-and-model-risk | R:413 | `href: ".../baselframework/BaselFramework.pdf"`, `citation: "Basel Framework, MAR33"`, excerpt `"97.5th percentile, one-tailed"` | LINK | 동일 404. 내용은 정확: MAR33.3 "In calculating ES, a bank must use a 97.5th percentile, one-tailed confidence level." (https://www.bis.org/basel_framework/chapter/MAR/33.htm?inforce=20230101&published=20200327); 유동성 기간은 MAR33.4·33.12 | href를 MAR33 장 URL로 교체 |
| 5 | markets/option-replication-and-put-call-parity | D:203 (`sources[0].note`) | "옵션의 성질, 이항모형, 블랙숄즈 모형과 실물옵션으로 이어지는 **학부** 금융론의 학습 순서" | WRONG | https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/resources/options/ — 200 — "Level: Graduate". 같은 과정을 M:133(`binomial-black-scholes…`)은 "대학원 금융론 자료"로 적어 내부 모순. 15.401은 Sloan MBA 핵심 과목. | "학부"→"대학원(MBA)" |
| 6 | markets/no-arbitrage-cost-of-carry-and-basis | D:63 | excerpt `"cash, financing charges, and dividends"` | LINK | http://web.archive.org/web/20260412065844/https://www.cmegroup.com/trading/equity-index/fairvalue.html (원 URL은 봇 차단 403) — 페이지 문구: "Fair value is the theoretical assumption of where a futures contract should be priced given such things as the current index level, index dividends, days to expiration and interest rates. The actual futures price will not necessarily trade at the theoretical price, as short-term supply and demand will cause price to fluctuate around fair value." 식: "= Cash [1+r (x/360)] - Dividends". "financing charges" 문구 없음. 34~35행 본문 서술 자체는 이 식과 일치. | excerpt를 "Cash [1+r (x/360)] - Dividends" 또는 위 문장으로 교체 |
| 7 | markets/option-greeks-volatility-and-dynamic-hedging | D:273 | excerpt `"guideposts, not guaranteed predictions"` | LINK | https://www.optionseducation.org/advancedconcepts/volatility-the-greeks — 200 — 페이지 전문(7,951자)에 "guidepost" 없음. 가장 가까운 문장: "It is not guaranteed that the future performance of the stock will behave according to the historical numbers." 245행 "이 자료도 그릭스를 정확한 예측이 아니라 이론적 안내로 다룹니다"는 요약으로는 성립. | excerpt를 위 실제 문장으로 교체 |
| 8 | markets/option-replication-and-put-call-parity | D:203 | excerpt `"The Binomial Model"` (MIT 15.401 course outline) | LINK | https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/fc2d55329f1bf7e5af23b4724ee594c2_MIT15_401F08_courseOutline.pdf — 200 — 실제 항목: "Options (Chapters 21-22) • Basic properties of options • Valuation of options • Binomial and Black-Scholes pricing models". "The Binomial Model"이라는 항목 없음. (D:63의 "Forward and Futures Contracts"는 원문 그대로 존재.) | excerpt를 "Binomial and Black-Scholes pricing models"로 |
| 9 | markets/hazard-rate-curve-recovery-and-credit-correlation | A:414 | excerpt `"risk-neutral marginal default probabilities"` (MAR50) | LINK | https://www.bis.org/committees/bcbs/basel-framework/standard/mar/50/inforce/2019-12-15/published/2019-12-15 — 200 — 해당 문구 없음. 실제 문장 MAR50.3(5): "Market implied default probability (also known as risk-neutral probability) represents the market price of buying protection against a default and is in general different from the real-world likelihood of a default." 388행 주장은 이 문장으로 성립. | excerpt 교체 |
| 10 | markets/equity-dispersion-implied-correlation-and-variance | S:63 | excerpt `"average implied correlation"` (Cboe 백서) | LINK | https://cdn.cboe.com/resources/indices/documents/Implied_Correlation-WhitePaper-v1.0.5.pdf — 200 — 백서에 "average implied correlation" 연속 문구 없음. 실제: "The implied correlation is a measure of the average correlation between SPX index components" / "The correlation index is calculated by first finding the difference between the SPX option implied variance and the implied variance of an uncorrelated portfolio of the top 50 SPX components by market capitalization. This value is then divided by the sum of pairwise weighted implied volatility products". 34행 식 서술은 정확(두 종목 대입 0.01/0.02=0.5 재계산 일치). | excerpt 교체 |
| 11 | markets/multi-asset-options-correlation-and-rare-event-simulation | O:344 | `citation: "Blanchet, Zhang, Glynn and Giesecke, Rare Event Simulation for a Generalized Hawkes Process"` | LINK | https://web.stanford.edu/~glynn/papers/2009/ZhangBlanchetGieseckeG09.pdf — 200 — 표제 저자 순서 "Xiao-Wei Zhang, Jose Blanchet, Peter W. Glynn, Kay Giesecke", Proceedings of the 2009 Winter Simulation Conference. excerpt "importance sampling algorithm"은 §4 제목 "THE IMPORTANCE SAMPLING ALGORITHM"에 존재. | 저자 순서·출전(WSC 2009) 정정 |
| 12 | markets/yield-curve-bootstrapping-multicurve-and-key-rate-hedging | M:244, M:273(note) | "CME의 SOFR 자료 설명은 만기별 할인계수와 **선도금리**를 제공하고" / note "할인계수·선도금리" | MISLEADING | http://web.archive.org/web/20260420122845/https://www.cmegroup.com/market-data/faq-sofr-third-party-data.html — FAQ 필드: "Discount Factor - The discount factor corresponding for tenor offset on a trade date / Rate - The zero rate corresponding for tenor offset on a trade date computed based on continuous compounding and ACT/365.25 convention." 'forward rate' 문구 0회. 용도 문장은 일치: "The curve is used for forecasting the SOFR OIS index rate as well as discounting the cashflows for any swap referencing USD-SOFR-OIS-COMPOUND index." | "할인계수와 (연속복리·ACT/365.25) 무이표금리"로 고치고 선도금리는 거기서 유도된다고 적기 |
| 13 | markets/swaption-annuity-volatility-quotes-and-cube | C:343 | "CME의 스왑션 평가 설명은 옵션 만기, 기초 스왑 tenor와 ATM 대비 행사가별 normal 변동성을 모으고, 보정 모형으로 전체 표면을 구성" (C:314), href SOFR discounting whitepaper | UNVERIFIED | https://www.cmegroup.com/trading/interest-rates/files/cme-sofr-discounting-and-pa-transition-whitepaper.pdf — **403**(curl·WebFetch). web.archive.org 사본(2024-06-18)은 원본 1,269,877바이트 중 1,048,576바이트에서 잘려 pdftotext 실패("Couldn't find trailer dictionary"). 2차 자료(Clarus FT "Swaptions Clearing at CME")는 회원 제출 변동성 큐브 + shifted SABR 보정을 서술해 방향은 일치하나 본문 문장은 원문 대조 못 함. | CME 청산 스왑션 방법론 문서(예: CME Swaption Valuation Methodology 공개 페이지)로 교체하거나 2차 자료를 함께 인용 |
| 14 | markets/binomial-black-scholes-and-early-exercise | M:92, M:73~141 전체 | "기간을 잘게 나누면 … 나무 가격은 일정한 가정 아래 블랙숄즈 가격에 가까워집니다. 블랙숄즈는 유럽형 옵션을 연속적으로 복제한다는 생각을 닫힌 식으로 표현합니다." | MISSING | 제목(`binomial-black-scholes`)과 92행 주장을 쓰려면 (a) 수렴을 보장하는 CRR 모수 u=e^{σ√Δt}, d=1/u, q=(e^{rΔt}−d)/(u−d)와 (b) 블랙숄즈 식 C=SΦ(d₁)−Ke^{−rT}Φ(d₂)가 있어야 하는데 둘 다 없다. 글의 1.2/0.8/1.05는 σ·r과 연결되지 않아 독자가 "촘촘히 만들면 수렴"을 확인할 수 없다. Cox-Ross-Rubinstein(1979)·Black-Scholes(1973)·Merton(1973) 이름도 없다. 참고: 글이 인용한 OIC 페이지는 BS 입력 6개와 "American-style equity options are typically priced using a bi-nomial model due to the early exercise feature."를 제시. | 5절에 CRR 모수식·BS 식·계보 한 단락 추가 |
| 15 | markets/local-stochastic-volatility-jumps-and-calibration | A:236~237 | "지역변동성은 현재 주가와 시간의 함수로 흔들림을 정합니다. 확률변동성은 … 점프확산은 … 보정은 이 모형의 가격이 관측한 옵션가격에 가까워지도록 매개변수나 함수를 찾는 과정입니다." | MISSING | 세 모형 가운데 어느 것도 식이 없다. 지역변동성의 "보정"(240행)을 구현하려면 Dupire(1994) 식 σ_loc²(K,T)=2∂_T C/(K²∂_KK C)가 필요하고, 확률변동성은 Heston(1993)의 분산 과정 dv=κ(θ−v)dt+ξ√v dW₂·상관 ρ, 점프확산은 Merton(1976)의 λ·점프 크기 분포가 "매개변수"의 실체다. 29편 전체에서 Dupire·Heston·Merton·Gatheral 이름이 0회. | 6절에 세 모형의 최소 식과 원 논문 인용 추가 |
| 16 | markets/short-rate-hjm-and-interest-rate-model-risk | A:306, A:314~315, A:286 | "HJM 틀은 … 차익이 없도록 평균 몫을 흔들림 구조에 묶습니다" / "선도금리의 평균을 흔들림과 그 만기 적분의 곱으로 둡니다" / 1절의 κ=0.5·θ=4%·σ=1% 사례 | MISSING | 인용한 MIT 18.S096 강의 24는 조건을 식으로 준다: "in order for the bond price to grow on average with the risk-free rate, the sum of the last 2 terms … should be equal to zero, i.e. μ(t,T)=σ(t,T)∫_t^T σ(t,s)ds" 및 "the forward rate f(t,t) is equal to the short rate r(t)". 글은 말로만 쓰고 식이 없어 2bp 계산(1%×1%×2)의 출처 식을 독자가 재현할 수 없다. 1절 사례는 Vasicek(1977) dr=κ(θ−r)dt+σdW 그 자체인데 이름이 없고, "현재 곡선을 정확히 출발점으로"(299·322행) 논의에 Hull-White 확장도 없다. Heath-Jarrow-Morton(1992) 원전도 미인용. | 6·8절에 HJM 드리프트 식, Vasicek/Hull-White 이름, 원 논문 인용 추가 |
| 17 | markets/credit-tranche-base-correlation-and-default-auction, markets/hazard-rate-curve-recovery-and-credit-correlation | S:96·104, A:381 | "0부터 각 끝점까지의 가상 구간을 시장가격에 맞추는 상관 입력을 베이스 상관" / "공통 충격이나 다른 결합 모형으로 동시부도를 생성합니다" | MISSING | 베이스 상관은 특정 모형(1요인 가우시안 코풀라, Li 2000) 안에서만 정의되는 값이다. 인용한 BIS 2005 논문도 그 모형으로 implied/base correlation을 계산한다("market-implied base correlation against the upper bound for each tranche"). 두 글 모두 "어느 모형의" 상관인지 밝히지 않아 10절 "일관되지 않거나 차익 가격"(S:112) 주장의 전제가 비어 있다. Li(2000) 미인용. | 6절에 1요인 가우시안 코풀라 한 줄(공통인자 √ρ·M+√(1−ρ)·Z, 부도 문턱 Φ⁻¹(PD))과 Li(2000) 인용 추가 |
| 18 | markets/monte-carlo-path-dependent-pricing-and-variance-reduction | A:92~93 | "평균가격 옵션은 … 장벽 옵션은 … 조기상환 상품은 관찰일마다 지급을 끝낼지 판단합니다." | MISSING | 경로의존 몬테카를로 정본이면 미국형(보유자 조기행사)의 MC 처리법이 있어야 한다. `binomial…` M:93은 "미국형은 … 나무나 수치 방법"이라 하고 MC 글은 자동조기상환(발행자 조건)만 다뤄, 보유자 행사권을 MC로 푸는 Longstaff-Schwartz(2001) 최소제곱 MC가 29편 어디에도 없다. | 5절 또는 10절에 LSM 한 단락 추가 |
| 19 | markets/swaption-annuity-volatility-quotes-and-cube | C:311 | "호가형에 맞는 Bachelier 또는 Black 계열 식에 명목·만기·금리·연금계수·변동성을 넣습니다." | MISSING | 85만 원(C:294)에서 프리미엄으로 가려면 Bachelier 식 P=A·N·[(F−K)Φ(d)+σ_N√T·φ(d)], d=(F−K)/(σ_N√T)가 필요한데 없다. 5절(normal 70bp vs lognormal 20%)의 "같은 숫자표에 넣을 수 없다"도 σ_N≈σ_B·F 근사 한 줄이 있어야 독자가 판정 가능. | 7절에 Bachelier 식과 normal↔lognormal 근사 추가 |
| 20 | markets/black-scholes-pde-finite-difference-and-numerical-error | A:167, A:154~155 | "명시적 계산은 … 시간 칸이 너무 크면 불안정할 수 있고" | MISSING | 안정성은 조건식 Δt ≤ (ΔS)²/(σ²S²)(금리 0, 명시적 격자)로 판정한다. 글의 입력(ΔS=10, σ=0.2, S=100)이면 상한은 100/(0.04×10,000)=0.25년이라 Δt=0.01은 안전하다는 사실 자체가 글에 없다. 재계산: 두 번째 차분 (10−0+0)/100=0.1, 0.5×0.04×10,000×0.1=20, ×0.01=0.2 ✓. | 6절에 안정성 조건식과 글의 숫자로 검산 추가 |
| 21 | markets/xva-funding-margin-and-wrong-way-risk | M:298~299, M:306 | "단순 기대손실은 10×0.02×0.60=0.12" / FVA·MVA 정의 | MISSING | CVA 정의식 CVA≈LGD·Σ EE(t_i)·ΔPD(t_i)·DF(t_i)(바젤 III 2010 §98 형태)가 없어 0.12가 '한 기간 근사'임은 적혀 있지만 어느 식의 근사인지 알 수 없다. 글이 인용한 CRE53.24의 MPOR 하한(10영업일, 5,000건 초과·비유동 담보 20영업일)도 314행에 숫자 없이 "더 긴 위험기간"으로만 적혔다. | 4·8절에 CVA 식과 MPOR 하한 수치 추가 |

## 글별 검증 기록

### markets/no-arbitrage-cost-of-carry-and-basis (D:3~71)
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료: https://www.cmegroup.com/trading/equity-index/fairvalue.html — 403(봇 차단) → http://web.archive.org/web/20260412065844/… — 200 — 식 "= Cash [1+r (x/360)] - Dividends", "short-term supply and demand will cause price to fluctuate around fair value"; excerpt 불일치(발견 6)
- 연 자료: MIT 15.401 course outline PDF — 200 — "Forward and Futures Contracts (Chapter 27) • Definitions of forwards and futures • Arbitrage pricing relations • Using forwards and futures to hedge" → "선도·선물 정의→무차익→헤지→옵션→이항" 순서 주장 OK
- 재계산: 100+5−2=103 ✓; 108−105+2=5 ✓; 선물 99 역방향 서술 ✓
- 빠진 내용: 일반식 F=S(1+r·τ)−D(또는 S·e^{(r−q)T})가 숫자 밖에 한 번도 식으로 안 적혔다(경미, 표에 미기재)
- OK: CME가 공정가치를 현금지수·금리·배당으로 설명(위 archive); 베이시스 부호가 문맥 의존이라는 서술은 정의상 타당

### markets/clearing-margin-and-default-waterfall (D:73~141)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: CFTC Supervisory Stress Test of Clearinghouses (Nov 2016) PDF — 200 — "The daily transfer of gains and losses is referred to as variation margin." / "A clearinghouse also holds initial margin from its clearing members as a performance bond to cover potential future losses in the value of open positions. … initial margin models to capture at least 99% of all price changes during … the margin period of risk." / §6 순서 문장(발견 1 인용). excerpt "variation margin transfers gains and losses"는 요약으로 성립.
- 연 자료: FinalRules/2013-07970.html — 200이지만 다른 문서(발견 1)
- 재계산: 12−8=4<9 → 추가 납부 8 ✓
- 빠진 내용: 없음(순서·역할 서술은 스트레스테스트 보고서와 일치). 선물 증거금은 "유지 기준 아래면 개시 수준으로 복원"이 통례라는 서술도 OK.
- OK: 워터폴 순서(부도회원 IM→부도회원 보증기금→청산소 자기자본 일부→비부도 회원 보증기금→평가분담금) = CFTC 보고서 p.9

### markets/option-replication-and-put-call-parity (D:143~211)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: MIT 15.401 outline PDF — 200(발견 8); https://ocw.mit.edu/courses/15-401-…/resources/options/ — 200 — "Level: Graduate"(발견 5)
- 연 자료: https://www.optionseducation.org/advancedconcepts/put-call-parity — 200 — "The pricing relationship that exists between put and call options on the same underlying, the same strike price and expiration date is known as put/call parity." 식 "c = S + p – Xe^–r(T–t)". excerpt는 근접 인용으로 OK.
- 재계산: Δ=(20−0)/(120−80)=0.5; 0.5×100−40=10; 상승 20·하락 0 ✓; r=0 위험중립 q=(100−80)/(120−80)=0.5 ✓; C+K=S+P → P=10 ✓
- 빠진 내용: 배당·금리 있는 일반 등식 C+Ke^{−rT}=S+P−PV(D)는 말로만("행사가격의 현재가치") 있음(경미)

### markets/option-greeks-volatility-and-dynamic-hedging (D:213~281)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: OIC Volatility & the Greeks — 200 — 델타·감마·세타·베가·로 정의, "Implied Volatility is a measure of how much the marketplace expects the asset price to move based on the price of the option." excerpt 불일치(발견 7)
- 연 자료: https://www.theocc.com/…/options-disclosure-document — 403(봇 차단) → archive 2026-10-01 — 200 — "Prior to buying or selling an option, investors must read a copy of the Characteristics and Risks of Standardized Options, also known as the options disclosure document (ODD)." OK
- 재계산: 0.5×2=1.00; 0.5×0.04×2²=0.08; 0.09×5=0.45; −0.08; 합 1.45 ✓; 새 델타 0.50+0.04×2=0.58 ✓
- 빠진 내용: 없음

### markets/interest-rate-derivatives-from-fra-to-swaptions (D:283~351)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: MIT 15.433 calendar — 200 — Lecture 14 "The Yield Curve", Lecture 15 "Futures, Swaps, Caps/Floors, Swaptions, and Other Derivatives". excerpt "Swaps, Caps, Floors, Swaptions"는 근접 인용.
- 연 자료: https://www.cmegroup.com/articles/2026/introduction-to-interest-rates-products.html — 403 → archive 2026-09-24 — 200 — "SR3 futures are economically similar to a single-period 3-month OIS", "Packs and Bundles can be used to execute a strip of consecutive SR3 futures to replicate or hedge longer-period swaps.", "A strip of consecutive quarterly options can be used to r[eplicate caps/floors]". excerpt 원문 그대로.
- 재계산: 10억×0.02×0.25=500만 원 ✓; FRA 기간 초 할인 지급 서술 ✓
- 빠진 내용: FRA 결제식 N·(L−K)·τ/(1+L·τ)가 식으로 없음(경미)

### markets/minimum-variance-hedge-ratio-and-basis-risk (M:3~71)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: CME Hedging with E-mini S&P 500 Futures — 403 → archive 2026-06-13 — 200 — "the optimal number of contracts is the value of the portfolio divided by the value of the futures contract times a factor called a 'hedge ratio.'" / "The hedge ratio is the ratio of the variance … of the portfolio to the variance of the futures contract multiplied by the correlation between the two." / "beta … will stand in for our variances in the hedge ratio". (CME 원문은 '분산의 비율'이라 느슨하지만 글은 올바른 '두 변동성의 비율'로 적어 이론상 정확.)
- 연 자료: KIFIN 과정 — 200 — 13과목 20시간, "수익률, 리스크와 파생상품 활용 1시간". excerpt "수익·위험과 파생상품 활용"은 근접 요약.
- 재계산: 1억/250만=40; ×0.8=32 ✓; 2% 하락 손실 200만, 32계약×250만×1.6%=128만, 잔여 72만 ✓; 40계약 160만·잔여 40만 ✓
- 빠진 내용: 없음

### markets/binomial-black-scholes-and-early-exercise (M:73~141)
- 추출한 고유 사실 주장 수: 9, 검증 9, 미검증 0
- 연 자료: MIT options resource — 200(Graduate); OIC Black-Scholes — 200 — 입력 "Underlying stock price, Options strike price, Time until expiration, Implied volatility, Dividend status, Interest rates", "American-style equity options are typically priced using a bi-nomial model due to the early exercise feature."
- 재계산(Python): q=(1.05−0.8)/0.4=0.625; 만기 144/96/64→0/4/36; 하락 노드 계속가치 (0.625×4+0.375×36)/1.05=15.238→15.24 ✓, 행사 20 ✓; 상승 노드 (0.625×0+0.375×4)/1.05=1.4286→1.43 ✓; 미국형 (0.625×1.4286+0.375×20)/1.05=7.9932→7.99 ✓; 유럽형 6.2925→6.29 ✓; 차이 1.70 ✓. article-learning.ts 워크드 예제(0.625·15.24·20) 일치.
- 빠진 내용: 발견 14
- OK: "배당 없는 주식의 미국형 콜은 조기행사 유인이 없다"(Merton 1973 결과, 이름 없음)

### markets/implied-volatility-surface-skew-and-smile (M:143~211)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: CME Introduction to CVOL Skew — 403 → archive 2026-06-14 — 200 — "One common measure of skew is the difference in implied volatility of two options – one put, one call – with the same absolute value of delta or same moneyness. This is known as the risk reversal." / "CVOL skew calculations use all the available option prices on each side of the at-the-money rather than just two individual options." → 174행 주장 OK; excerpt "difference in implied volatility" 원문 존재
- 연 자료: Basel pdf — 404(발견 2); MAR99·MAR31 장 페이지로 대체 확인
- 재계산: 24−30=−6 ✓
- 빠진 내용: 발견 2의 citation 정정 외 없음

### markets/yield-curve-bootstrapping-multicurve-and-key-rate-hedging (M:213~281)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: CME SOFR third-party data FAQ — 403 → archive 2026-04-20 — 200(발견 12)
- 연 자료: BIS Beyond LIBOR (Schrimpf·Sushko, BIS QR March 2019) — 200 — "They should also allow for the creation of term benchmarks beyond overnight tenors, which makes them well suited to many purposes and market needs (eg … discounting and valuation in derivatives markets)." / "Term rates based on derivatives reflect the market-implied expected path of future O/N rates over the term of the contract, but do not embed premia for term funding risk." → 248행 OK; excerpt "OIS rates for discounting and valuation"는 요약
- 재계산: DF₂=(100−4.8)/105=0.906667 ✓; (1/0.906667)^0.5−1=5.021% ✓; 0.96/0.906667−1=5.882% ✓; 재가격 4.8+95.2=100 ✓
- 빠진 내용: 없음(발견 12 외)

### markets/xva-funding-margin-and-wrong-way-risk (M:283~351)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: CRE53 — 200 — CRE53.12 "Effective EE is computed by estimating expected exposure (EEt) as the average exposure at future date t." CRE53.24 "a supervisory floor of … 10 business days for all other netting sets is imposed on the margin period of risk" / "20 business days" (5,000건 초과·비유동 담보) / CRE53.25 분쟁 시 2배. excerpt "expected exposure and margin period of risk" 요약 OK
- 연 자료: ISDA Collateral Management SOP — 200 — 최종 갱신 "February 24, 2026"(344행 "2026년 2월 갱신본" ✓); "Collateral substitutions, whether for Variation Margin, Initial Margin, or Independent Amount, is an operational process necessary."
- 재계산: 10−0.6+0.2−0.3−0.1=9.2 ✓; 5×0.02×1=0.1 ✓; 10×0.02×0.6=0.12 ✓; 18×0.05×0.6=0.54 ✓; 0.54/0.12=4.5배, 18/10=1.8배 ✓
- 빠진 내용: 발견 21

### markets/market-risk-backtesting-pnl-attribution-and-model-governance (M:353~421)
- 추출한 고유 사실 주장 수: 10, 검증 10, 미검증 0
- 연 자료: MAR32 — 200 — MAR32.5 "Backtesting of the bank-wide risk model must be based on a VaR measure calibrated at a 99th percentile confidence level." / "Exceptions for actual losses are counted separately from exceptions for hypothetical losses; the overall number of exceptions is the greater of these two amounts." / Table 1(MAR32.9): 0–4 green 1.50, 5 amber 1.70, 6 1.76, **7 1.83**, 8 1.88, 9 1.92, 10+ red 2.00 → 364행 ✓ / MAR32.42 PLA: "The correlation metric is above 0.80" and "the KS distributional test metric is below 0.09 (p-value = 0.264)" green; "<0.7 or KS >0.12 (p-value = 0.055)" red → 385행 ✓
- 연 자료: https://www.federalreserve.gov/supervisionreg/srletters/SR2602.htm — 200 — "SR 26-2", "April 17, 2026", "Revised Guidance on Model Risk Management", Fed·OCC·FDIC, SR 11-7·SR 21-8 대체 → 388행·414행 ✓
- 재계산: 손실 1,2,6,3,7,2,1,8,4,3 중 >5는 6·7·8 세 날 ✓
- 빠진 내용: 없음

### markets/brownian-motion-ito-and-risk-neutral-pricing (A:3~71)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: MIT 18.642 lec19_1 (Kempthorne, Fall 2024) PDF — 200 — "Var[∆X] = σ²∆t", "∆X = X(t+∆t) − X(t) = µ∆t + σ∆B(t)" → excerpt 원문 존재
- 연 자료: MIT 18.642 lec21 (Strela) PDF — 200 — "Q is the risk neutral measure under which", "(dS)² = σ²S²dt", "Finite difference methods"
- 재계산: 0.2/√252=1.2599% ✓; 101.26²−100²=253.5876→253.59 ✓; 253.59−252=1.59 ✓(1.26²=1.5876); 100e^{0.05/252}=100.01984 ✓
- 빠진 내용: 없음

### markets/monte-carlo-path-dependent-pricing-and-variance-reduction (A:73~141)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: MIT 15.450 handout02 (Kogan) PDF — 200 — "Variance reduction: antithetic variates, control variates." / "Good control variates: highly correlated with the variable of interest, [known expectation]" / "Examples of control variates: stock price, payoff of similar option" → 104행·97행 ✓
- 연 자료: MAR30 — 200 — MAR30.5(9) 독립 검토, MAR30.18 스트레스, MAR30.27(1) "Tests to demonstrate that any assumptions made within the internal model are appropriate and do not underestimate risk."
- 재계산: 평균 3.75 ✓; 표본 sd 4.787, /√4=2.394→2.39 ✓; 쌍 평균 2.5·5 sd 1.768, /√2=1.25 ✓; 경로 4배→오차 1/2 ✓
- 빠진 내용: 발견 18

### markets/black-scholes-pde-finite-difference-and-numerical-error (A:143~211)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: 18.642 lec21 PDF — 200 — "Finite difference methods"(excerpt 원문), BS 방정식 유도(∂f/∂t+∂f/∂S dS+½∂²f/∂S²(dS)²); MAR30 — 200
- 재계산: 발견 20에 기재(0.1→20→0.2 ✓; 안정성 상한 0.25년)
- 빠진 내용: 발견 20

### markets/local-stochastic-volatility-jumps-and-calibration (A:213~281)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: 18.642 lec17_1 "Volatility Modeling" PDF — 200 — 표제 일치, 역사적 변동성·GBM·시변 변동성 다룸; Basel pdf — 404(발견 3)
- 재계산: 10+0+4=14%p ✓; −10/1.26=−7.94→7.9배 ✓
- 빠진 내용: 발견 15

### markets/short-rate-hjm-and-interest-rate-model-risk (A:283~351)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: MIT 18.S096 lecture 24 (Gorokhov) PDF — 200 — "HJM (Heath-Jarrow-Morton) model", "First of all, the forward rate f(t,t) is equal to the short rate r(t). Second, in order for the bond price to grow on average with the risk-free rate, the sum of the last 2 terms in the equation above should be equal to zero, i.e. [μ(t,T)=σ(t,T)∫_t^T σ(t,s)ds]" → excerpt·314행 ✓; MAR30 — 200
- 재계산: 0.5×(4−3)%=0.5%p/년, /252=0.198bp→0.2bp ✓; 1%/√252=6.30bp ✓; 0.01×(0.01×2)=0.0002=2bp/년 ✓, /252=0.0079bp ✓
- 빠진 내용: 발견 16

### markets/hazard-rate-curve-recovery-and-credit-correlation (A:353~421)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: MIT 15.433 Class 17 PDF — 200 — "Survival Probability: Prob(τ ≥ t) = e^{−λt}", "P0 = $100 · e^{−r·τ} · e^{−λ·τ}" → 384행(회수 0일 때 스프레드=λ) ✓
- 연 자료: MAR50 — 200 — MAR50.3(5)(발견 9)
- 재계산: 1.2%/60%=2% ✓; e^{−0.02}=0.98020 ✓; 1.980% ✓; 100×10%×60%=6, 합 12 ✓; 독립 1%, 완전 공통 10% ✓
- 빠진 내용: 발견 17

### markets/currency-hedging-forward-points-and-cross-currency-basis (R:3~71)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: CME Reconciling FX Spot Futures Prices — 403 → archive 2026-04-12 — 200 — "The difference between spot and futures prices is said to be driven by 'cost of carry.' And cost of carry is essentially a function of short-term interest rates prevailing in the two countries whose currencies are being exchanged." / "Futures Price = Spot Price + U.S. Interest - Foreign Interest" → 34행 ✓
- 연 자료: BIS QR Dec 2025 "International finance through the lens of BIS statistics: derivatives markets"(McGuire·von Peter·Avdjiev, 2025-12-08) — 200 — "the cross-currency basis, ie the premium received (relative to dollar cash rates) for lending dollars against yen via FX swaps", "Hedging demand by banks and NBFIs gives rise to … the cross-currency basis trade", "NBFIs … inherent currency mismatch makes FX hedging an integral part of their investment decisions." → 38~39행 요약 OK(딜러 대차대조표 제약은 페이지에 명시 문장 없음, 경미)
- 재계산: 1,350×1.0075/1.0125=1,343.33 ✓; ×80만=1,074,666,667→10억7,467만 ✓; (1,350−1,250)×100만=1억 ✓
- 빠진 내용: 없음

### markets/commodity-carry-convenience-yield-and-roll (R:73~141)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: CME What is Contango and Backwardation — 403 → archive 2026-04-23 — 200 — "Physically delivered futures contracts may be in a contango because of fundamental factors like storage, financing (cost to carry) and insurance costs." / "This is known as the convenience yield, which is an implied return on warehouse inventory. The convenience yield is inversely related to inventory levels." / "as the futures contract approaches maturity, the futures price will converge with the spot price, otherwise an arbitrage opportunity would exist." → 104행 ✓
- 연 자료: CME Delivery of WTI futures — 403 → archive 2026-06-12 — 200 — "Physical delivery means that a futures position is turned into real oil." / "make or take delivery of actual Crude Oil at the WTI delivery point in Cushing, OK." → 108행·excerpt ✓
- 재계산: 75+0.75+1−2=74.75 ✓; 1,000배럴 1,750/2,000 ✓
- 빠진 내용: 없음

### markets/option-strategies-and-structured-notes (R:143~211)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: OIC Options Strategies Quick Guide PDF — 200 — "BULL CALL SPREAD … Buy 1 call; sell 1 call at higher strike … Risk: Limited / Reward: Limited" → excerpt 요약 OK
- 연 자료: SEC Investor Bulletin: Structured Notes — WebFetch 403, curl 200 — "Structured notes have a fixed maturity and include two components – a bond component and an embedded derivative." / "Structured notes are unsecured debt obligations of the issuer … These promises, including any principal protection, are only as good as the financial h[ealth of the issuer]" / "This pre-specified level may be called a barrier, trigger, or knock-in." / "structured notes (other than exchange-traded notes known as ETNs) are not listed for trading on secur[ities exchanges]" → 178~179행 ✓
- 재계산: 92+8=100; 콜스프레드 S=90→0, 110→10, 130→20 ✓
- 빠진 내용: 없음

### markets/credit-derivatives-default-risk-and-tranches (R:213~281)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: ISDA 2012-05-01 DC 3년 보고 — 200 — "whether a Credit Event has occurred; whether an auction should be held to determine the final price for CDS settlement; which obligations should be delivered or valued in the auction; and whether a Succession Event has occurred" → excerpt·244행 ✓
- 연 자료: BIS QR March 2005 r_qt0503g.pdf — 직접 URL은 HTML 초록 페이지로 리다이렉트(200); 실제 PDF https://www.bis.org/publications/cds-index-tranches-and-pricing-credit-risk-correlations_1.pdf — 200 — Amato·Gyntelberg, "where each tranche references a different segment of the loss distribution of the underlying CDS index", "The next tranche (mezzanine) absorbs losses of 3–7% … The 7–10% and 10–15% tranches are known as the senior tranches, while the super-senior tranche covers losses of 15–30%." → excerpt 원문 존재, 229행 구간 ✓
- 재계산: 1억×2%=200만; 1억×60%=6,000만; 0.02/0.6=3.33% ✓; 0~3%=300만, 3~7%=400만 ✓
- 빠진 내용: 없음(가우시안 코풀라 미명명은 발견 17에 묶음)

### markets/var-expected-shortfall-stress-and-model-risk (R:353~421)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: Basel pdf — 404(발견 4) → MAR33.3 확인; BCBS Stress testing principles — 200 — "17 October 2018", "objectives, governance, policies, processes, methodology, resources and documentation" → excerpt·388행 ✓
- 재계산: 정렬 0,0,1,1,2,2,3,4,6,10 → 8번째 값 4 = 80% VaR ✓; (6+10)/2=8 ✓
- 빠진 내용: 없음(이산 표본에서 ES 정의가 규칙 의존이라는 경계는 365행에 명시)

### markets/ccp-default-management-hedging-auction-and-porting (C:213~281)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: CPMI-IOSCO CCP default management auctions (CPMI Papers 192, 2020-06-25) — HTML 200; PDF https://www.bis.org/publications/central-counterparty-default-management-auctions-issues-consideration.pdf — 200 — "a default management auction is one of the tools that a CCP may use to transfer a defaulting participant's positions or subset thereof to a non-defaulting participant, thereby restoring the CCP to a matched book." 목차 3.1 "CCP Board of Directors' Responsibility and Delegation of Responsibilities", 4.1 "Hedging strategy", 4.2.1 "Preparing the defaulted participant's portfolio for auction", 4.2.5 "Bidding requirements or incentives", 5.1.2 "Information-sharing", 5.3 "Testing" → 244행 ✓
- 연 자료: PFMI overview — 200 — Principle 13 "Participant-default rules and procedures", Principle 14 "Segregation and portability", "Such testing and review should be conducted at least annually" → 248행 ✓
- 재계산: 80−60=20; 20×5=100; min(4,6,9)=4 ✓
- 빠진 내용: 없음

### markets/swaption-annuity-volatility-quotes-and-cube (C:283~351)
- 추출한 고유 사실 주장 수: 7, 검증 6, 미검증 1(발견 13)
- 연 자료: CME SOFR discounting whitepaper PDF — 403; archive 잘림(발견 13)
- 연 자료: LSEG IRD Swaption Volatility Cubes — 200 — "Our volatility cubes span option expiries, underlying swap tenors and strike or delta dimensions by currency and underlying index." / "LSEG delivers both Black and normal Bachelier volatility representations" / "We include SABR smile parameters and calibration metrics" → 318행 ✓, excerpt 근접
- 재계산: 0.001×1억×8.5=85만 ✓
- 빠진 내용: 발견 19

### markets/uncleared-initial-margin-simm-and-model-governance (O:3~71)
- 추출한 고유 사실 주장 수: 8, 검증 8, 미검증 0
- 연 자료: Basel MGN(전체 장) — 200 — MGN20.9 "consistent with a one-tailed 99 per cent confidence interval over a 10-day horizon" / MGN20.13 "Any quantitative model that is used for initial margin purposes must be approved by the relevant supervisory authority … tests the model's assessments against realised data and experience, and validates the applicability of the model" → 34~35행·excerpt ✓
- 연 자료: https://www.isda.org/?p=1243627 — 200 — "ISDA Publishes ISDA SIMM® Methodology, Version 2.8+2512", June 12, 2026, "full recalibration of the model using historical data up to 31 December 2025", "effective date of 11 July 2026" → 22행·38행·excerpt ✓
- 연 자료: https://www.isda.org/2026/09/18/isda-publishes-updated-isda-simm-governance-framework/ — 200 — "This version reflects the commitment to recalibrate ISDA SIMM on at least a semi-annual basis." → 38행 ✓
- 재계산: √(36+16+2×0.25×24)=√64=8 ✓
- 빠진 내용: 없음

### markets/multi-asset-options-correlation-and-rare-event-simulation (O:283~351)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: MIT 15.450 lec03 PDF — 200 — 표제 "Generating Random Numbers / Variance Reduction / Quasi-Monte Carlo"(excerpt 원문); Stanford PDF — 200(발견 11)
- 재계산: ρ=0 → √0.02=14.14%, ρ=1 → √0.04=20% ✓; p=10/100,000=0.01%, SE=√(p(1−p)/n)=3.162e-5=0.00316%p, 상대 31.6% ✓
- 빠진 내용: 없음

### markets/equity-dispersion-implied-correlation-and-variance (S:3~71)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: Cboe 백서 v1.0.5 — 200(발견 10); https://www.cboe.com/us/indices/implied/ — 200 — "dispersion quantifies diversification benefits by measuring the spread between the average variance of component securities and portfolio variance." → excerpt 근접 ✓
- 재계산: 0.25×0.04×2=0.02→14.14%; 교차항 2×0.5×0.5×0.2×0.2×0.5=0.01; √0.03=17.32% ✓; (0.03−0.02)/0.02=0.5 ✓; 0.04−0.03=0.01 ✓
- 빠진 내용: 없음

### markets/credit-tranche-base-correlation-and-default-auction (S:73~141)
- 추출한 고유 사실 주장 수: 7, 검증 7, 미검증 0
- 연 자료: BIS 2005 PDF — 200 — "It plots the market-implied base correlation against the upper bound for each tranche. For example, in the case of the CDX.NA.IG index, the base correlation for the 0–10% interval would be defined as the correlation which equates the price of this synthetic first loss tranche to the combined observed market values of the 0–3%, 3–7% and 7–10% tranches." → 104행 원문 일치, excerpt 원문 존재
- 연 자료: ISDA Big Bang Protocol — 200 — "The Supplement adds auction settlement as a settlement method for credit derivative transactions." / "Establishes the Credit Derivatives Determinations Committees … and incorporates the resolutions of the DCs into the Definitions", 2009-03-12 → 108행 ✓
- 재계산: min(7,3)=3; min(7,7)−3=4; max(min(7,10)−7,0)=0 ✓; 1,000만×0.65=650만 ✓
- 빠진 내용: 발견 17

### markets/equity-dispersion-pnl-attribution-and-rebalancing-costs (L:3~71)
- 추출한 고유 사실 주장 수: 6, 검증 6, 미검증 0
- 연 자료: Cboe S&P 500 Dispersion Index Methodology (July 2023) PDF — 200 — "The Dispersion Index is calculated as the square root of the difference between (i) the weighted average expected variance of constituents of the Basket Index … and (ii) the expected variance of the S&P 500, as represented by the square of the current level of the Cboe Volatility Index ('VIX'). If that difference is negative, the Dispersion Index will equal zero." → 34행 ✓(단, 지수 분산을 VIX²로 대표한다는 세부는 글에 없음, 경미)
- 연 자료: Cboe_USO_ImpliedCorrelation_0421_v2.0.2.pdf — 200 — "A long dispersion trade involves selling an ATM straddle on the SPX and buying ATM straddles on [components]" → excerpt 요약 ✓
- 재계산: 12,000×1.5−10,000×0.5=13,000 ✓; 13,000+7,000−4,000−3,000=13,000 ✓; 2,000+1,000=3,000 ✓
- 빠진 내용: 없음

## 열지 못한 자료
| URL | 상태 | 대체 확인 |
|---|---|---|
| https://www.bis.org/baselframework/BaselFramework.pdf (M:204, A:274, R:413) | 404 (basel_framework 경로도 404) | MAR33.3·MAR99.22(5)·MAR31 장 HTML로 내용 확인 |
| https://www.cmegroup.com/trading/interest-rates/files/cme-sofr-discounting-and-pa-transition-whitepaper.pdf (C:343) | 403; web.archive 2024-06-18 사본은 1,048,576/1,269,877바이트에서 잘려 파싱 불가 | Clarus FT 2차 자료로 방향만 확인, UNVERIFIED |
| https://www.cftc.gov/LawRegulation/FederalRegister/FinalRules/2013-07970.html (D:134) | 200이나 인용 목적과 다른 문서 | 2013-27849(DCO 국제기준) 확인, 순서 서술은 CFTC 스트레스테스트 보고서 §6로 확인 |
| cmegroup.com 교육·FAQ 페이지 8건(D:344, M:63·273, R:63·133·134, M:203, D:63) | 라이브 403(봇 차단) | web.archive.org 2026년 4~9월 스냅샷(curl)으로 전부 원문 확인 |
| https://www.theocc.com/…/options-disclosure-document (D:274) | 라이브 403(봇 차단) | archive 2026-10-01 스냅샷으로 확인 |
| https://www.bis.org/publ/qtrpdf/r_qt0503g.pdf (R:274, S:133) | 200이지만 HTML 초록으로 리다이렉트 | …/cds-index-tranches-and-pricing-credit-risk-correlations_1.pdf 원문 PDF로 확인 |

## 후속 작업
- (13) CME 청산 스왑션 평가 방법론 원문(공개 PDF 또는 CFTC 제출본)을 찾아 `C` 2번 출처를 교체하고 8절의 "2차 자료" 단서를 지운다.
- (15) Dupire 국소변동성 식 σ_loc²=2∂_T C/(K²∂_KK C), Heston 분산 과정, Merton 점프 강도의 `ExplainedFormula`와 원 논문(Dupire 1994 Risk, Heston 1993 RFS, Merton 1976 JFE) 서지를 `article-evidence.ts`에 추가. 이번에는 인용 출처(MIT 18.642 lec17, MAR31)에 식이 없어 이름만 넣었다.
- (16) Hull-White(1990) 확장(θ(t)로 현재 곡선 재현)은 인용 출처에 없어 넣지 않았다. HJM(1992)·Vasicek(1977) 원 논문 서지도 evidence 추가 후보.
- (17·18) Li(2000) "On Default Correlation: A Copula Function Approach", Longstaff-Schwartz(2001) RFS 서지를 해당 글 evidence에 추가(데이터 `sources`는 2개 고정이라 넣지 못함).
- 경미 MISSING(표 미기재): no-arbitrage 일반식 F=S(1+rτ)−D, FRA 결제식, 배당 있는 풋콜 등식 — 각 글 식 추가 여부 판단.

## 공용 파일 수정 목록
통합자가 순서대로 적용. 모든 old 문자열은 해당 파일에서 1회만 나옴을 2026-10-09에 확인했다.

### src/content/article-evidence.ts
```
OLD:
      "label": "CFTC · DCO default resources rule",
      "href": "https://www.cftc.gov/LawRegulation/FederalRegister/FinalRules/2013-07970.html",
      "note": "회원 채무불이행 때 사용할 손실 흡수 재원과 순서를 다룹니다."
NEW:
      "label": "CFTC · DCO 국제기준 최종 규칙(2013-27849)",
      "href": "https://www.cftc.gov/LawRegulation/FederalRegister/FinalRules/2013-27849.html",
      "note": "가장 큰 노출을 만드는 회원(일부는 두 회원)의 부도를 덮을 재원과 평가분담금 제외를 정합니다. 손실 재원 사용 순서는 CFTC 스트레스 시험 보고서 §6에 있습니다."
```
```
OLD:
      "label": "Basel Framework · Expected Shortfall",
      "href": "https://www.bis.org/baselframework/BaselFramework.pdf",
NEW:
      "label": "Basel Framework · Expected Shortfall (MAR33)",
      "href": "https://www.bis.org/basel_framework/chapter/MAR/33.htm?inforce=20230101&published=20200327",
```
```
OLD:
      "label": "Basel Framework · Volatility Surface Risk",
      "href": "https://www.bis.org/baselframework/BaselFramework.pdf",
NEW:
      "label": "Basel Framework · Volatility Surface Risk (MAR99.22)",
      "href": "https://www.bis.org/basel_framework/chapter/MAR/99.htm?inforce=20230101&published=20200327",
```
```
OLD:
      "label": "Basel Framework · Market Risk",
      "href": "https://www.bis.org/baselframework/BaselFramework.pdf",
NEW:
      "label": "Basel Framework · Market Risk (MAR31)",
      "href": "https://www.bis.org/basel_framework/chapter/MAR/31.htm?inforce=20230101&published=20200327",
```

### src/content/article-learning.ts
```
OLD:
        "title": "CFTC · DCO default resources rule",
        "href": "https://www.cftc.gov/LawRegulation/FederalRegister/FinalRules/2013-07970.html",
NEW:
        "title": "CFTC · DCO 국제기준 최종 규칙(2013-27849)",
        "href": "https://www.cftc.gov/LawRegulation/FederalRegister/FinalRules/2013-27849.html",
```
```
OLD:
        "contribution": "회원 채무불이행 때 사용할 손실 흡수 재원과 순서를 다룹니다.",
NEW:
        "contribution": "가장 큰 노출을 만드는 회원의 부도를 덮을 재원 규모와 평가분담금 제외를 정합니다. 사용 순서는 스트레스 시험 보고서 §6이 설명합니다.",
```
```
OLD:
        "title": "Basel Framework · Expected Shortfall",
        "href": "https://www.bis.org/baselframework/BaselFramework.pdf",
NEW:
        "title": "Basel Framework · Expected Shortfall (MAR33)",
        "href": "https://www.bis.org/basel_framework/chapter/MAR/33.htm?inforce=20230101&published=20200327",
```
```
OLD:
        "title": "Basel Framework · Volatility Surface Risk",
        "href": "https://www.bis.org/baselframework/BaselFramework.pdf",
NEW:
        "title": "Basel Framework · Volatility Surface Risk (MAR99.22)",
        "href": "https://www.bis.org/basel_framework/chapter/MAR/99.htm?inforce=20230101&published=20200327",
```
```
OLD:
        "title": "Basel Framework · Market Risk",
        "href": "https://www.bis.org/baselframework/BaselFramework.pdf",
NEW:
        "title": "Basel Framework · Market Risk (MAR31)",
        "href": "https://www.bis.org/basel_framework/chapter/MAR/31.htm?inforce=20230101&published=20200327",
```

## 후속 작업 결과
처리일 2026-10-09. 서지는 출판사 페이지(OUP·Risk.net)를 직접 열거나, 출판사가 403일 때 DOI 리다이렉트(linkinghub.elsevier.com)와 Crossref 출판사 등록 메타데이터(api.crossref.org/works/<DOI>)로 확인했다. 식은 "독자가 글의 숫자로 무엇을 판정하는가"가 있을 때만 `formulas`에 넣었다. KaTeX 렌더(throwOnError) 44개 식 오류 0, eslint 통과, check-article은 다른 글의 prose "재검토 필요"만 남음.

| 항목 | 처리 | 근거·내용 |
|---|---|---|
| (13) CME 스왑션 평가 원문 | 적용 | web.archive.org의 **2022-01-19 사본은 완전본**(1,269,877바이트, pdftotext 1,497행)이었다: http://web.archive.org/web/20220119134843/https://www.cmegroup.com/trading/interest-rates/files/cme-sofr-discounting-and-pa-transition-whitepaper.pdf (원 주소는 여전히 403, 2020-11-25·2024-06-18 사본은 1 MiB에서 잘림). §2.2 "Cash Adjustment Methodology for Cleared Swaptions"의 Current Process (i)a~c·(ii)·(iii)과 각주 2(moneyness = ATM forward − Strike)를 원문 대조. `C` 8절 첫 문단을 원문 3단계로 다시 쓰고 "2차 자료"·"대조 못 함" 단서 삭제, 'shifted SABR' → 원문 용어 'CME 수정 SABR(MSABR)'로 정정, moneyness 부호 관례(1절 +10bp 사례 = CME 표기 −10bp)와 EFFR→SOFR(2020-10-16) 할인 문단 추가. 2번 출처 excerpt를 원문 연속 문장 "CME Modified SABR (MSABR) parameters are calibrated to these blended prices to construct the whole volatility surface across all expiry/tenor points and all moneyness."로, citation에 §2.2, note에 아카이브 사본 주소 기재. href는 공식 원 주소 유지(봇 차단일 뿐 죽은 문서 아님). evidence label 갱신은 아래 목록 |
| (15) Dupire 식 | 적용(식 1개) | `A` volatilityModelsData에 `formulas`(6절) 신설: σ_loc²=2∂_T P/(K²∂_KK P)(금리·배당 0). 원 논문(Risk 1994-01, 유료)은 본문을 못 열어 식 출처는 Itkin·Lipton(2016) arXiv:1608.05145 §1 식 (1) "The Dupire equation for the put P(K,T) reads … P_T = ½σ²(K,T)K²∂²P/∂K² − (r−q)K∂P/∂K − qP"(r=q=0으로 둠). 사례(가정): 흔들림 20% 하나로 만든 풋 3.589/7.966/14.292(1년, 90·100·110), 8.290(13개월 100) → ∂_T P≈3.889, ∂_KK P≈0.0195, σ_loc≈19.97%(Python 재계산). 판정 규칙: 나비 묶음 값·만기 기울기가 양수여야 값이 나오며 100 풋이 8.94보다 비싸면 보정 전에 호가 점검. 서지 확인: https://www.risk.net/derivatives/equity-derivatives/1500211/pricing-with-a-smile meta description "In the January 1994 issue of Risk, Bruno Dupire showed how the Black-Scholes model can be extended to make it compatible with observed market volatility smiles" |
| (15) Heston 분산 과정 | 적용(문장) + 공용파일 목록 | 식은 넣지 않음: 원 논문 본문을 열지 못했고, 글의 사례(30/20/24%, −10% 충격)에 이 식으로 판정하는 계산이 없다. 6절에 저널명과 "유럽형 콜 가격을 닫힌 식으로 구했다"만 추가. 근거: https://academic.oup.com/rfs/article-lookup/doi/10.1093/rfs/6.2.327 초록 첫 문장 "I use a new technique to derive a closed-form solution for the price of a European call option on an asset with stochastic volatility." RFS 6(2):327–343, 1993-04 |
| (15) Merton 점프 강도 | 적용(저널명) + 공용파일 목록 | 식은 넣지 않음(본문·초록 미열람, 글에 λ로 판정하는 사례 없음). 서지: ScienceDirect 403, DOI 10.1016/0304-405X(76)90022-2 → linkinghub pii 0304405X76900222 200, Crossref "Option pricing when underlying stock returns are discontinuous", JFE 3(1–2):125–144, 1976 |
| (16) Hull-White 확장 | 적용(문장) + 공용파일 목록 | `A` interestRateModelsData 6절에 "헐·화이트(1990)는 바시첵 같은 한 상태 단기금리 모형을 확장해 오늘의 금리 기간구조와 현재 금리 변동성까지 맞추도록" 추가, 바시첵 식 assumptions에 연결 문장. 근거: OUP https://academic.oup.com/rfs/article/3/4/573/1577209 초록 "This article shows that the one-state-variable interest-rate models of Vasicek (1977) and Cox, Ingersoll, and Ross (1985b) can be extended so that they are consistent with both the current term structure of interest rates and either the current volatilities of all spot interest rates or the current volatilities of all forward interest rates." θ(t) 식은 초록에 없어 넣지 않음 |
| (16) HJM·Vasicek 서지 | 공용파일 목록 | HJM: JSTOR 2951677은 Client Challenge로 자동 조회 불가, Crossref(등록 주체 JSTOR) "Bond Pricing and the Term Structure of Interest Rates: A New Methodology for Contingent Claims Valuation", Econometrica 60(1):77, 1992. Vasicek: ScienceDirect 403, linkinghub 200, Crossref "An equilibrium characterization of the term structure", JFE 5(2):177–188, 1977 |
| (17) Li 2000 | 공용파일 목록 | pm-research.com은 로그인 리다이렉트, Crossref: "On Default Correlation" 부제 "A Copula Function Approach", David X. Li, Journal of Fixed Income 9(4):43–54, 2000, DOI 10.3905/jfi.2000.319253. 베이스 상관·해저드 두 글 evidence에 추가 |
| (18) Longstaff-Schwartz 2001 | 공용파일 목록 | OUP https://academic.oup.com/rfs/article-lookup/doi/10.1093/rfs/14.1.113: Longstaff·Schwartz, RFS 14(1):113–147, 2001-01, 초록이 "the conditional expected payoff to the optionholder from continuation"을 최소제곱으로 추정한다고 설명. MC 글 evidence에 추가 |
| 경미: F=S(1+rτ)−D | 적용(식 1개) | `D` noArbitrageData 8절 `formulas`: CME 식 F=Cash[1+r(x/360)]−Dividends(본 원장 6번이 web.archive 2026-04-12 사본에서 확인한 원문). 100·5%·360일·배당 2 → 103, 호가 108(+5)·99(−4) 판정. 8절 문단에 연결 문장 |
| 경미: FRA 결제식 | 보류 | 할인 결제식 N(L−K)τ/(1+Lτ)는 1차 자료(ISDA 정의집 유료, 거래소·감독기관 공개 문서)를 찾지 못했고 검색 결과는 교육 사이트뿐. 글 295행이 이미 "지급 시점 할인, 정확한 일수와 할인식 확인"을 문장으로 적고 있어 그대로 둠 |
| 경미: 배당 있는 풋콜 등식 | 적용(문장만) | 글이 인용한 OIC 페이지(https://www.optionseducation.org/advancedconcepts/put-call-parity)에 배당형 식은 없고 무배당식 "c = S + p – Xe–r(T– t)"와 "higher dividends tend to reduce call option prices and increase put option prices."만 있음 → `D` replicationData 9절에 그 경향 문장만 추가, 식은 넣지 않음 |

## 후속 공용 파일 수정 목록
통합자가 순서대로 적용. old 문자열은 2026-10-09에 `src/content/article-evidence.ts`에서 각각 1회만 나옴을 grep으로 확인했다.

### src/content/article-evidence.ts
```
OLD:
      "label": "CME Group 스왑션 평가 방법",
      "href": "https://www.cmegroup.com/trading/interest-rates/files/cme-sofr-discounting-and-pa-transition-whitepaper.pdf",
      "note": "만기·tenor·moneyness 호가와 곡선·보정의 평가 순서를 확인합니다."
NEW:
      "label": "CME Group · SOFR 할인 전환 설명서 §2.2(청산 스왑션 평가)",
      "href": "https://www.cmegroup.com/trading/interest-rates/files/cme-sofr-discounting-and-pa-transition-whitepaper.pdf",
      "note": "회원 제출 normal 변동성을 섞고 CME 수정 SABR(MSABR)로 전체 표면을 채우는 순서를 확인합니다. 원 주소는 자동 조회 403이라 web.archive.org 2022-01-19 완전본으로 대조했습니다."
```
```
OLD:
      "note": "행사가·만기 표면, 시간 변화, 점프와 상관을 검증 항목으로 확장합니다."
    }
NEW:
      "note": "행사가·만기 표면, 시간 변화, 점프와 상관을 검증 항목으로 확장합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Dupire (1994) · Pricing with a Smile",
      "href": "https://www.risk.net/derivatives/equity-derivatives/1500211/pricing-with-a-smile",
      "note": "Risk 1994년 1월호. 옵션가격 표면에서 지역변동성 함수를 읽어 내는 출발점입니다. 유료 원문이라 서지와 요약만 확인했습니다."
    },
    {
      "kind": "선행·비교 논문",
      "label": "Itkin·Lipton (2016) · Filling the gaps smoothly",
      "href": "https://arxiv.org/abs/1608.05145",
      "note": "§1 식 (1)에 풋 가격에 대한 듀파이어 방정식을 적었습니다. 본문 수식의 금리·배당 0 형태가 여기서 나옵니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Heston (1993) · Closed-Form Solution for Options with Stochastic Volatility",
      "href": "https://doi.org/10.1093/rfs/6.2.327",
      "note": "Review of Financial Studies 6(2):327–343. 확률변동성 아래 유럽형 콜의 닫힌 해를 제시합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Merton (1976) · Option pricing when underlying stock returns are discontinuous",
      "href": "https://doi.org/10.1016/0304-405X(76)90022-2",
      "note": "Journal of Financial Economics 3(1–2):125–144. 연속 움직임에 점프를 더한 점프확산 모형의 원전입니다. 출판사 페이지 자동 조회 403이라 서지만 확인했습니다."
    }
```
```
OLD:
      "note": "곡선·옵션 보정 뒤 장기 대용값, 극단 상황과 독립 가격을 검증합니다."
    }
NEW:
      "note": "곡선·옵션 보정 뒤 장기 대용값, 극단 상황과 독립 가격을 검증합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Vasicek (1977) · An equilibrium characterization of the term structure",
      "href": "https://doi.org/10.1016/0304-405X(77)90016-2",
      "note": "Journal of Financial Economics 5(2):177–188. 1절 되돌림 단기금리 사례의 원전입니다. 출판사 페이지 자동 조회 403이라 서지만 확인했습니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Hull·White (1990) · Pricing Interest-Rate-Derivative Securities",
      "href": "https://doi.org/10.1093/rfs/3.4.573",
      "note": "Review of Financial Studies 3(4):573–592. 바시첵 같은 한 상태 모형을 현재 기간구조와 금리 변동성에 맞게 확장합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Heath·Jarrow·Morton (1992) · Bond Pricing and the Term Structure of Interest Rates",
      "href": "https://doi.org/10.2307/2951677",
      "note": "Econometrica 60(1), 1992, 77쪽부터. 선도금리 곡선 전체를 움직이는 HJM 틀의 원전입니다. JSTOR 자동 조회가 막혀 서지만 확인했습니다."
    }
```
```
OLD:
      "note": "가격 장부 확률을 실제 부도 추정과 분리하고 스프레드·회수·상관으로 확장합니다."
    }
NEW:
      "note": "가격 장부 확률을 실제 부도 추정과 분리하고 스프레드·회수·상관으로 확장합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Li (2000) · On Default Correlation: A Copula Function Approach",
      "href": "https://doi.org/10.3905/jfi.2000.319253",
      "note": "Journal of Fixed Income 9(4):43–54. 동시부도를 만드는 코풀라 접근의 원전입니다. 출판사 페이지는 로그인이 필요해 서지만 확인했습니다."
    }
```
```
OLD:
      "note": "결정위원회 판단과 경매 결제를 표준 계약 흐름에 넣은 범위를 확인합니다."
    }
NEW:
      "note": "결정위원회 판단과 경매 결제를 표준 계약 흐름에 넣은 범위를 확인합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Li (2000) · On Default Correlation: A Copula Function Approach",
      "href": "https://doi.org/10.3905/jfi.2000.319253",
      "note": "Journal of Fixed Income 9(4):43–54. 베이스 상관이 정의되는 1요인 가우시안 코풀라 접근의 원전입니다. 출판사 페이지는 로그인이 필요해 서지만 확인했습니다."
    }
```
```
OLD:
      "note": "표본오차 밖의 가격 과정·자료·스트레스와 독립 검증을 연결합니다."
    }
NEW:
      "note": "표본오차 밖의 가격 과정·자료·스트레스와 독립 검증을 연결합니다."
    },
    {
      "kind": "핵심 논문",
      "label": "Longstaff·Schwartz (2001) · Valuing American Options by Simulation",
      "href": "https://doi.org/10.1093/rfs/14.1.113",
      "note": "Review of Financial Studies 14(1):113–147. 보유자가 계속 들고 갈 때의 조건부 기대지급을 최소제곱 회귀로 추정해 미국형 옵션을 몬테카를로로 평가합니다."
    }
```

## 후속 작업 결과 (3차)
담당: 보류였던 "경미: FRA 결제식". 처리일 2026-10-10. 글: `src/pages/articles/markets/derivatives/derivative-data.ts`(`ratesData`, route `markets/interest-rate-derivatives-from-fra-to-swaptions`).

| 항목 | 처리 | 근거·내용 |
|---|---|---|
| FRA 결제식 | 적용(식 1개 + 3절 둘째 문단 교체 + numericCase "차액" detail 보강) + 공용파일 목록 | 1차 자료: Federal Reserve Board, *Trading and Capital-Markets Activities Manual*, Section 4315.1 "Forward Rate Agreements"(해당 절 면주 "February 1998"), 전체 PDF https://www.federalreserve.gov/boarddocs/supmanual/trading/trading.pdf (200, 2.5 MB, pdftotext; 절별 PDF 4000p2.pdf도 200). 연속 문장: "Settlement on an FRA contract is made in advance, that is at the settlement date of the contract. The settlement sum is calculated by discounting the interest differential due from the maturity date to the settlement date using the relevant market rate." / "Let f = the FRA rate (as a decimal), s = the spot rate at maturity (as a decimal), t = the tenor of the notional principal in number of days, P = the notional principal, and V = the sum due at settlement. Assume that the basis is actual/360-day. The interest due the buyer before discounting is (s − f)P(t/360). The discount factor is 1 − s(t/360). V is the sum due at settlement: V = [(s − f)P(t/360)][1 − s(t/360)]" / "The basis used in discounting is actual/360-day for all currencies except pounds sterling, which uses an actual/365-day count convention." → `formulas`(section `case`)에 이 식을 `ExplainedFormula`로 넣고 글의 숫자(10억·4%·6%·(가정) 90일/360)를 대입: 차액 500만 원, 할인계수 0.985, 결제금 492만 5천 원. **주의**: 연준 지침서의 할인계수는 1−s(t/360)(단리 할인 근사)이고, 흔히 쓰는 1/(1+s·t/360) 나눗셈 형태는 1차 자료에서 확인하지 못함 — RBI 1999 FRA/IRS 지침(https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=612, WebFetch)은 식 없음, HMRC CFM13150(https://www.gov.uk/hmrc-internal-manuals/corporate-finance-manual/cfm13150, 200)은 "computed and discounted back to the settlement date"까지만, ACI 공식 사이트 syllabus는 검색에서 못 찾음(제3자 호스팅 사본만), ISDA 정의집은 유료. 그래서 assumptions에 "1+s(t/360)로 나누는 형태를 적은 1차 자료는 확인하지 못해 쓰지 않았다"와 두 식의 차이(이 사례 약 1,108원)를 명시하고, 본문의 "계약서가 쓰는 할인식을 확인해야 한다" 단서는 유지. |

검증: KaTeX throwOnError 렌더 5개 식 오류 0, `node scripts/audit-formula-annotations.mjs --strict --require-explicit` 통과, `bash scripts/check-article.sh markets/interest-rate-derivatives-from-fra-to-swaptions` 통과, `npx eslint src/pages/articles/markets/derivatives/derivative-data.ts` 통과.

## 후속 공용 파일 수정 목록 (3차)
old는 2026-10-10 현재 `src/content/article-evidence.ts`에 1회만 나옴(grep -c 1). `markets/interest-rate-derivatives-from-fra-to-swaptions` 배열 끝(CME 항목)에 항목 1개 추가.

### src/content/article-evidence.ts
```old
      "note": "SOFR 선물·옵션으로 OIS와 캡·플로어 노출을 구성하는 현재 사례를 설명합니다."
    }
  ],
```
```new
      "note": "SOFR 선물·옵션으로 OIS와 캡·플로어 노출을 구성하는 현재 사례를 설명합니다."
    },
    {
      "kind": "공식 문서",
      "label": "Federal Reserve Board · Trading and Capital-Markets Activities Manual §4315.1 Forward Rate Agreements",
      "href": "https://www.federalreserve.gov/boarddocs/supmanual/trading/trading.pdf",
      "note": "FRA 결제금을 이자 차액을 만기일에서 결제일까지 시장금리로 할인한 금액으로 정의하고 V=(s−f)P(t/360)[1−s(t/360)] 식과 actual/360(파운드는 actual/365) 기준을 적습니다. 1998년 2월 절, 전체 PDF 2026-10-10 확인."
    }
  ],
```
