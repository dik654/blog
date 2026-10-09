# G-electronics-crypto-chain 감사 원장
확인일: 2026-10-09. 글 29편. 열어 본 URL 101개(성공 99 / 실패 2). PDF 원문 24건은 내려받아 `pdftotext`로 본문·쪽번호를 대조했고, 스캔본(Wilson 1931·Shockley 1949·Kirchhoff 1845·BB84 1984)은 해당 쪽을 이미지로 렌더링해 직접 읽었다. 고정 `codebase/` 스냅샷 18개 파일은 전부 upstream raw 파일과 바이트 단위 `diff`로 대조했고, 태그→커밋 대응(Pico SDK 2.2.0, FreeRTOS V11.2.0, MCUboot v2.2.0)은 GitHub API로 확인했다. 수치 사례는 전부 Python으로 재계산했다.

## 적용 결과
적용일: 2026-10-09. 글 본문 파일 11개를 직접 고쳤고, 공용 파일(article-evidence·article-learning·registrations)의 대응 문구는 맨 끝 `## 공용 파일 수정 목록`으로 넘겼다. 집계: 적용 12 · 보류 0 · 후속 0 · 공용 파일 old→new 31쌍(발견 10건에 걸침: 1·3·4·5·6·7·9·10·11·12).

| # | 결과 | 글 파일에서 한 일 · 비고 |
|---|---|---|
| 1 | 적용 + 공용파일 목록으로 이관 | `glamsterdam-block-execution/ModernArticle.tsx` 개요: "2026-10-09 기준 EIP-7732·EIP-7928은 2026-10-06 Last Call, 마감 2026-11-01; EIP-7773은 Review, 메인넷 활성화 칸 비어 있음"으로 갱신하고 Last Call이 메인넷 일정이 아님을 덧붙임. EIP-7732 CitationBlock의 "Review 상태" → "2026-10-09 기준 Last Call(마감 2026-11-01)". evidence note 3건은 article-evidence·registrations/web3-audit-current 양쪽 목록에 올림. |
| 2 | 적용 | `serial-buses-and-tradeoffs.tsx` 7절에 UM10204 Rev. 7.0의 네 속도 모드(100 k·400 k·1 M·3.4 Mbit/s)와 Fm+ 63 µs 계산, 표 11(인쇄 44쪽) Fast-mode t_LOW 1.3 µs·t_HIGH 0.6 µs로 2.5 µs 주기의 여유 0.6 µs 계산, §3.1.8(인쇄 11쪽) 중재 규칙(SCL HIGH 동안 SDA 비교, HIGH를 보냈는데 LOW면 패배·SDA 출력 끔·버스가 빈 뒤 재시작)과 0x20 대 0x48 첫 비트 사례(가정)를 넣음. ExplainedFormula 가정과 14절 "다른 장치의 점유"를 중재로 연결, CitationBlock 범위 갱신. 비고: 원장이 "표 10"이라 적은 Fast-mode 타이밍 표는 Rev. 7.0에서 **표 11**("Characteristics of the SDA and SCL bus lines…", 44쪽)이다(표 10은 I/O 단 특성). 2026-10-09 PDF를 내려받아 대조함. |
| 3 | 적용 + 공용파일 목록으로 이관 | `ml-kem-and-noisy-equations.tsx` 6절에 FIPS 203 표 2(인쇄 39쪽/PDF 48쪽) ML-KEM-768 k=3·η1=2·η2=2·du=10·dv=4, η의 뜻(−2…2), dv=4 압축 폭 3329/16≈208·최대 반올림 오차 ≈104를 추가. 10절에 표 1(인쇄 15쪽/PDF 24쪽) 복호 실패율 2^−138.8 / 2^−164.8(≈2.5×10^−50) / 2^−174.8과 해시·XOF 무작위성 가정을 넣음. 원장의 "Table 1(p.23)"은 PDF 24쪽·인쇄 15쪽으로 확인. |
| 4 | 적용 + 공용파일 목록으로 이관 | `yield-defect-and-packaging.tsx` 12절에 Murphy 모형(Y=∫e^{−A₀D}f(D)dD, 포아송은 특수한 경우)과 음이항 모형·군집 매개변수 α 문단, 그리고 ExplainedFormula `Y=(1+D₀A_c/α)^−α`(λ=0.1: 포아송 0.9048·α=5 0.9057·α=1 0.9091; λ=0.4: 0.6703 대 α=1 0.7143)을 추가. α=1.5~2 전형값은 강의안 인용. 비고: 원장의 쪽번호(17–18·26–28쪽)는 실제 PDF와 맞지 않아, 슬라이드 이미지를 렌더링해 확인한 PDF 19쪽(Murphy 적분식)·23쪽(감마 f(D), α=cluster parameter, Y_gamma)·25쪽(α→∞ 포아송, α=1.5~2)을 썼다. 강의안 25쪽의 "α→0이면 Seeds 모형"은 수학적으로 α=1일 때 1/(1+A₀D₀)가 되는 것과 어긋나므로 본문에 옮기지 않았다. |
| 5 | 적용 + 공용파일 목록으로 이관 | `quantum-computing-and-cryptographic-risk.tsx` 9절에 Gidney 2025(arXiv 2505.15917, 2025-05-21): 잡음 있는 물리 큐비트 100만 개 미만·1주 미만, 장치 가정(최근접 정사각 격자, 오류율 0.1%, 표면 부호 주기 1 µs, 반응 시간 10 µs), 2019년 2천만 개·8시간과의 비교, ECDLP 추정과 나란히 놓되 서로 다른 회로·시간 계산이라는 경고를 두 문단으로 넣고 CitationBlock(citeKey 6)을 추가. 10절 RSA 문장에 9절 참조 추가. evidence 항목 추가는 공용 목록으로. |
| 6 | 적용 + 공용파일 목록으로 이관 | `switching-energy-and-leakage.tsx` CitationBlock "22–24쪽" → "22–25쪽", 본문 "24쪽은 완전 주기 CV², 25쪽은 평균 전력식 P_D=f·E_D=f·C_LV_DD²". |
| 7 | 적용 + 공용파일 목록으로 이관 | `interrupts-and-latency-budget.tsx` source를 "NVIC priority·pending 설명, DUI 0662A, §4.2.5–§4.2.7 (인쇄 4-5–4-7쪽)"로 넓힘. §4.2.5가 인쇄 4-5쪽임을 Arm PDF 쪽 꼬리말로 확인. |
| 8 | 적용 | `storage-elements-and-transients.tsx` 두 곳의 "6쪽" → "6–7쪽". 비고: 2026-10-09 PDF를 다시 pdftotext로 보니 **6쪽에도** "RC dvC/dt + vC = vI"가 KCL 식 바로 아래에 있다(7쪽은 vI=VI 상수로 둔 예제). 원 표기는 틀리지 않았고, 원장 제안대로 범위를 넓혀도 정확하다. |
| 9 | 적용 + 공용파일 목록으로 이관 | `scheduling-and-real-time.tsx` FreeRTOS CitationBlock 2개에 "스크립트 렌더링이라 2026-10-09 본문 문장을 자동 조회로 대조하지 못함(서지·주소만 확인), 동작은 고정 tasks.c와 Reference Manual V10.0.0 PDF로 확인" 범위를 적고, 뮤텍스 주소의 302 이동 경로를 표기. href는 그대로 둠. |
| 10 | 적용 + 공용파일 목록으로 이관 | `quantum-key-distribution.tsx` "2026-03-16 승인" → "2026년 3월 승인(ITU 권고 목록의 03/26 기준, 승인 일자는 확인하지 못함)". |
| 11 | 적용 + 공용파일 목록으로 이관 | `ml-kem-and-noisy-equations.tsx` "2025-09-18 최종 권고" → "2025년 9월 최종 권고(NIST 게시 페이지 기준, 일자는 확인하지 못함)". |
| 12 | 적용 + 공용파일 목록으로 이관 | `lithography-and-resolution.tsx` ASML source에 "(주소의 2021 게시, 페이지 표기 2023-10-04 갱신)" 추가. |

번호 없는 "빠진 내용" 메모(수율 글의 KGD·웨이퍼 프로브 수율 분모, 리소그래피 글의 k₁ 하한·액침 NA)는 발견으로 등재되지 않았고 원장도 "치명적이지 않음"으로 두어 이번에는 고치지 않았다.

검증(2026-10-09): 고친 11개 route마다 `check-article.sh`의 개별 감사(learning-contract·viz-style·prose-readability·korean-naturalness·term-density·term-pair-wrapping)를 실행. `merge-registrations`는 공용 파일을 쓰므로 건너뜀(이 route 중 7개에 registration 모듈이 있음). prose-readability의 전역 `--strict` 실패는 다른 글의 "재검토 필요" 때문이며, 처음 추가한 긴 문단 탓에 이 클러스터 4개 글(glamsterdam·serial-buses·ml-kem·quantum-risk)이 잡혀서 문단을 나눈 뒤 다시 돌렸고, 이제 이 11개 route는 하나도 목록에 없다. 나머지 감사는 전부 통과. `npx eslint`(11개 파일) 통과. `npm run audit:formula -- --strict --require-explicit` 통과(explainedFormulas 1475, missingExplicitAnnotations 0).

## 요약
- 발견: WRONG 0 · OUTDATED 1 · MISLEADING 0 · CALC 0 · LINK 3 · MISSING 4 · UNVERIFIED 4
- 가장 중요한 발견
  1. **OUTDATED** `blockchain/glamsterdam-block-execution` — "2026-10-04 기준 관련 EIP는 Review"·"EIP-7732 … Review 상태의 제안"이라고 적었으나, EIP-7732와 EIP-7928은 2026-10-06에 **Last Call**(last-call-deadline 2026-11-01)로 바뀌었다. 확인일(10-04) 기준으로는 맞았던 문장이 닷새 뒤 어긋났다. EIP-7773(Glamsterdam 메타)은 여전히 Review이고 Mainnet 활성화 칸은 비어 있다.
  2. **MISSING** `embedded/serial-buses-and-tradeoffs` — "다른 장치의 점유"·"400 kHz가 유지된다"는 가정을 쓰면서 UM10204가 규정하는 Fast-mode Plus(1 Mbit/s)·High-speed(3.4 Mbit/s) 모드와 §3.1.8 중재(arbitration) 규칙이 전혀 없다. 공유 버스에서 "점유"를 판정하려면 중재 규칙이 필요하다.
  3. **MISSING** `crypto/ml-kem-and-noisy-equations` — "실제 표준은 분포·압축·파라미터를 함께 정해 복원 실패 가능성을 관리합니다"라고 주장하지만 FIPS 203 Table 2의 η₁·η₂·d_u·d_v(768: 2·2·10·4)와 Table 1의 복호 실패율(ML-KEM-768: 2^−164.8)을 적지 않아 독자가 그 "관리"를 수치로 확인할 수 없다.
  4. **MISSING** `semiconductors/yield-defect-and-packaging` — 12절이 "결함이 뭉치면 실제 확률은 달라진다"고 쓰지만, 인용한 MIT 2.830J 강의안 자체가 제시하는 Murphy 모형과 음이항(negative binomial) 모형·군집 매개변수 α를 이름조차 적지 않았다. 뭉침이 수율을 어떻게 바꾸는지 계산하려면 그 식이 있어야 한다.
  5. **LINK** `devices/switching-energy-and-leakage` 70행 — "24쪽은 완전한 주기당 C_LV_DD²와 평균 전력식을 적습니다"라고 했으나 평균 전력식 `P_D = f·E_D`는 MIT 6.012 Lecture 14의 25쪽에 있다(24쪽은 `E_D = E_P + E_N = ΣE_S = C_LV_DD²`까지).

## 발견 (심각도 순)
| # | route | 위치(file:line) | 주장(원문 인용) | 판정 | 근거(URL + 인용문) | 제안 수정 |
|---|---|---|---|---|---|---|
| 1 | blockchain/glamsterdam-block-execution | src/pages/articles/blockchain/glamsterdam-block-execution/ModernArticle.tsx:13, :48; src/content/article-evidence.ts:11787 블록(EIP-7732 note) | "2026-10-04 기준 관련 EIP는 Review이고 업그레이드의 메인넷 활성화 날짜는 비어 있습니다." / "EIP-7732 · ePBS … Review 상태의 제안입니다." | OUTDATED | https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-7732.md 머리말: `status: Last Call` / `last-call-deadline: 2026-11-01`; https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-7928.md: `status: Last Call` / `last-call-deadline: 2026-11-01`; GitHub commits API(`EIPS/eip-7732.md`, `EIPS/eip-7928.md`) 최신 커밋 2026-10-06T21:57:47Z "Update EIP-2780: Move to Last Call (#12442)"(동일 커밋이 두 파일을 Last Call로 이동), 직전 2026-07-29 "Update EIP-7732: Move to Review". https://eips.ethereum.org/EIPS/eip-7773 는 "Status: Review", Mainnet 활성화 epoch/timestamp 공란, "EIPs Scheduled for Inclusion"에 7732·7928 포함(WebFetch 2026-10-09). | "2026-10-09 기준 EIP-7732·EIP-7928은 Last Call(마감 2026-11-01), EIP-7773은 Review"로 갱신하고 확인일을 명시. CitationBlock의 "Review 상태의 제안" 문구도 함께 수정. |
| 2 | embedded/serial-buses-and-tradeoffs | src/pages/articles/embedded/serial-buses-and-tradeoffs.tsx:36-37, :84 | "클록이 400 kHz라면 … 100 kHz라면 630 µs입니다." / "풀업과 부하를 확인하고 다른 장치의 점유와 클록 스트레칭 … 함께 계산해야 합니다." | MISSING | https://www.nxp.com/docs/en/user-guide/UM10204.pdf Rev. 7.0 p.1·3: "up to 100 kbit/s in the Standard-mode, up to 400 kbit/s in the Fast-mode, up to 1 Mbit/s in Fast-mode Plus, or up to 3.4 Mbit/s in the High-speed mode."; §3.1.8 Arbitration(p.11): "Arbitration, like synchronization, refers to a portion of the protocol required only if more than one controller is used on the bus … Arbitration is then required". 글은 두 모드만 언급하고 중재 규칙·다중 컨트롤러 조건이 없다. | 7절 또는 14절에 UM10204 §3(모드 4종 속도)과 §3.1.8 중재(SDA 비교로 지는 쪽이 물러남) 한 단락 추가. "400 kHz 유지" 가정 옆에 Fast-mode 최소 t_LOW/t_HIGH 조건(표 10)을 참조. |
| 3 | crypto/ml-kem-and-noisy-equations | src/pages/articles/crypto/ml-kem-and-noisy-equations.tsx:68, :118 | "모듈 차원 k는 2·3·4 중 하나입니다." / "실제 표준은 분포·압축·파라미터를 함께 정해 복원 실패 가능성을 관리합니다." | MISSING | https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf Table 2(p.48): "ML-KEM-768 256 3329 3 2 2 10 4 192"(n,q,k,η₁,η₂,d_u,d_v,RBG strength); Table 1(p.23): "ML-KEM-768 2^−164.8"(Decapsulation failure rate). 글에는 η·d_u·d_v와 실패율 수치가 없다. | 6절에 Table 2의 η₁·η₂·d_u·d_v, 10절에 Table 1의 실패율(2^−138.8 / 2^−164.8 / 2^−174.8)을 넣어 "관리"의 실체를 보여 줄 것. |
| 4 | semiconductors/yield-defect-and-packaging | src/pages/articles/semiconductors/yield-defect-and-packaging.tsx:90-93 | "결함이 뭉치거나 크기별 영향이 다르고 일부 회로에 여분 회로가 있으면 실제 확률은 달라집니다." | MISSING | https://ocw.mit.edu/courses/2-830j-control-of-manufacturing-processes-sma-6303-spring-2008/4aff1e21de13870355ef44dbe71f45c6_lecture10.pdf 17–18쪽 "Murphy Yield Model … Poisson yield model is special case", 26–28쪽 "Negative Binomial Model … α is a 'cluster' parameter … Large α limit (little clustering) yield approaches the Poisson model … Small α limit (strong clustering)". 글이 인용한 같은 강의안이 제공하는 뭉침 모형을 글이 쓰지 않았다. | 12절에 음이항 모형 Y=(1+D₀A_c/α)^−α 한 줄과 α→∞에서 포아송으로 환원됨을 추가하고, 본문 사례(λ=0.1)에 α=1·α=5를 넣은 비교값을 함께 제시. |
| 5 | crypto/quantum-computing-and-cryptographic-risk | src/pages/articles/crypto/quantum-computing-and-cryptographic-risk.tsx:121 | "RSA의 인수분해 가정과 Diffie–Hellman·타원곡선 계열의 이산로그 가정은 Shor의 영향을 받습니다." | MISSING | 글의 9절 자원 추정은 secp256k1 ECDLP(Babbush 외 2026)만 다룬다. RSA-2048 추정의 1차 자료 https://arxiv.org/abs/2505.15917 (Gidney, 2025-05-21): "How to factor 2048 bit RSA integers with less than a million noisy qubits" — "fewer than a million noisy qubits … less than one week … 0.1% uniform gate error rate". 글의 8절 15 인수분해 사례와 바로 이어지는 수치인데 빠져 있다. | 9절에 Gidney 2025의 RSA-2048 추정(<10⁶ 물리 큐비트, <1주, 0.1% 오류율 가정)을 ECDLP 추정과 나란히 두고, 두 논문의 장치 가정이 다르다는 10절 경고와 연결. |
| 6 | devices/switching-energy-and-leakage | src/pages/articles/devices/switching-energy-and-leakage.tsx:70-71, :77 | "24쪽은 완전한 주기당 C_LV_DD²와 평균 전력식을 적습니다." / "24쪽의 완전 주기 식은 ED=EP+EN=ΣES=CLVDD²입니다." | LINK | https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/6bec6dd1b07b02a1a84098b78f068cc3_lec14.pdf pdftotext 24쪽: "Energy dissipated in complete cycle … ED = EP + EN = ΣES = CLVDD²"; 25쪽: "PD = f ED = f CLVDD²". 완전 주기 식은 24쪽이 맞고 평균 전력식은 25쪽. | CitationBlock을 "22–25쪽"으로, 본문 70행을 "24쪽은 완전 주기 식, 25쪽은 평균 전력식"으로 고침. |
| 7 | embedded/interrupts-and-latency-budget | src/pages/articles/embedded/interrupts-and-latency-budget.tsx:58 | CitationBlock source "Arm, Cortex-M0+ Devices Generic User Guide, NVIC pending·priority 설명, DUI 0662A, §4.2.6·§4.2.7 (인쇄 4-6·4-7쪽)" | LINK | https://documentation-service.arm.com/static/5f04aadfdbdee951c1cdc957 목차: "4.2.5 Interrupt Priority Registers", "4.2.6 Level-sensitive and pulse interrupts"(인쇄 4-6), "4.2.7 NVIC usage hints and tips"(인쇄 4-7). 본문 105행의 §4.2.6(재-pending)·§4.2.7("An interrupt can enter pending state even if it is disabled")은 정확하나, "priority 설명"은 §4.2.5다. | source 문구를 "§4.2.5–4.2.7"로 넓히거나 "pending·level/pulse 설명"으로 바꿈. |
| 8 | circuits/storage-elements-and-transients | src/pages/articles/circuits/storage-elements-and-transients.tsx:65 | "MIT 6.002 Lecture 12의 6쪽 원문 식은 RC·dvC/dt + vC = vI입니다." | LINK | https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/84f4b553fc6a1ddd7007465041c4e213_6002_l12.pdf pdftotext 6쪽: "Analyzing an RC circuit … (vC − vI)/R … C dvC/dt"(KCL 형태), 7쪽: "RC dvC/dt + vC = VI". 정리된 식은 7쪽. | "6–7쪽"으로 표기. |
| 9 | embedded/scheduling-and-real-time | src/pages/articles/embedded/scheduling-and-real-time.tsx:32, :53 | CitationBlock "FreeRTOS 공식 설명은 가장 높은 우선순위의 준비된 작업 선택과 절대 주기 기반 대기의 목적을 설명합니다." / "FreeRTOS 공식 문서는 뮤텍스의 우선순위 상속과 ISR에서 기다리는 뮤텍스를 사용하지 않는 이유를 설명합니다." | UNVERIFIED | https://www.freertos.org/Documentation/01-FreeRTOS-quick-start/01-Beginners-guide/01-RTOS-fundamentals (HTTP 200) 및 https://freertos.org/Real-time-embedded-RTOS-mutexes.html → 302 → https://freertos.org/Documentation/02-Kernel/02-Kernel-features/02-Queues-mutexes-and-semaphores/04-Mutexes (HTTP 200). 두 페이지 모두 JS 렌더링이라 curl 본문 31바이트, WebFetch도 "title fragment only"로 본문을 얻지 못함. 인용 요약의 진위를 판정할 수 없다. 대체 근거로 FreeRTOS Reference Manual V10.0.0 PDF(https://www.freertos.org/media/2018/FreeRTOS_Reference_Manual_V10.0.0.pdf, 200, vTaskDelayUntil 26회 등장)는 열렸고 tasks.c 원문은 대조했다. | 요약이 아닌 원문 인용문을 하나 넣고, JS 없는 대체 자료(Reference Manual PDF 쪽)를 병기. |
| 10 | crypto/quantum-key-distribution | src/pages/articles/crypto/quantum-key-distribution.tsx:234 | "ITU-T X.1711은 2026-03-16 승인된 권고이며" | UNVERIFIED | https://www.itu.int/rec/T-REC-X.1711 : "X.1711 (03/26) Framework of quantum key distribution (QKD) protocols in QKD networks — In force"(월까지만). 전문 epublications 페이지(…/itu-t-x-1711-2026-03-…)는 HTTP 200이나 본문을 열지 못해 일자(16일)는 확인 불가. | 전문 PDF의 승인일 기재면을 인용하거나 "2026년 3월 승인"으로 완화. |
| 11 | crypto/ml-kem-and-noisy-equations | src/pages/articles/crypto/ml-kem-and-noisy-equations.tsx:112; src/content/article-evidence.ts:11882 | "NIST SP 800-227 … 2025-09-18 최종 권고." | UNVERIFIED | https://csrc.nist.gov/pubs/sp/800/227/final : "Date Published: September 2025"(일자 없음). 18일은 페이지에서 확인되지 않음. | "2025-09 최종"으로 쓰거나 PDF 표지의 일자를 인용. |
| 12 | semiconductors/lithography-and-resolution | src/pages/articles/semiconductors/lithography-and-resolution.tsx:57; src/content/article-evidence.ts:10353 | CitationBlock source "ASML, 'Six crucial steps in semiconductor manufacturing'"(URL 경로 `stories/2021/`) | UNVERIFIED(경미) | https://www.asml.com/en/company/stories/2021/semiconductor-manufacturing-process-steps 본문: "6 crucial steps in semiconductor manufacturing … Updated - by Alison Li, October 4, 2023". 인용 내용(Photoresist coating→Lithography→Etch: "the wafer is baked and developed, and some of the resist is washed away")은 일치. 발행연도를 글이 적지 않아 결함은 아니나 URL의 2021과 페이지의 2023 갱신을 함께 적어 두는 편이 안전. | source에 "(2023-10-04 갱신)" 추가. |

CALC 판정은 0건이다(아래 글별 기록의 CALC 행 참조 — 전수 재계산 일치).

## 글별 검증 기록

### semiconductors/yield-defect-and-packaging
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료:
  - https://ocw.mit.edu/courses/2-830j-control-of-manufacturing-processes-sma-6303-spring-2008/4aff1e21de13870355ef44dbe71f45c6_lecture10.pdf — 200(41쪽 PDF) — PDF 7쪽 "(Functional) die yield … Parametric (die) yield", 14쪽 "Spatially uncorrelated / Each defect 'kills' one chip", 17쪽 "Poisson Defect Yield Model • defects are 'points' • every defect results in a fault • defects are spatially uncorrelated", 30쪽 "Critical Area … may have a critical area for open faults, may have a different critical area for shorts". 글이 적은 쪽번호(6–7·14·17·30) 일치.
  - https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html — curl 403 / WebFetch 200 — 제목 "How Silicon Die Become Chip Packages", 날짜 February 19, 2025, 순서 die attach("A chip attach module (CAM) affixes die…")→epoxy underfill→heat spreader("place a heat spreader (known as a lid)")→burn-in("heavy dose of high voltage and heat")→electrical test→PPV("mimics end-customer conditions"). 글의 "다이 부착·접합부 채움·덮개·열·전압 시험·전기 시험·사용 환경 검증" 서술 일치.
- CALC: e^−0.1=0.904837 → 1000×=904.84 ✓; ×0.98=886.74 ✓; e^−0.4=0.67032 ✓; e^−0.2=0.81873 ✓; 0.904837×0.98=0.886741 ✓.
- 빠진 내용: 발견 #4(Murphy·음이항 모형). 또한 패키징 단계가 "조립·시험 98%" 한 숫자로 묶여 있어 KGD(known-good-die)·웨이퍼 프로브 수율과 조립 수율의 분모 차이를 실제 용어로 적지 않았다(강의안 6쪽 "Wafer yield / Probe testing yield / (Functional) die yield"가 있음).
- OK로 확인한 주요 주장: 포아송 가정 3개(점 결함·결함 1개=고장·공간 비상관) ✓(17쪽); 임계 면적이 단선·단락별로 다름 ✓(30쪽); P(A)·P(B|A) 조건부 곱 서술 ✓(수학); 인텔 글이 수율 수치를 공개하지 않음 ✓.

### semiconductors/lithography-and-resolution
- 추출한 고유 사실 주장 수: 11, 검증 11, 미검증 0
- 연 자료:
  - https://www.asml.com/en/technology/lithography-principles/rayleigh-criterion — 200 — "CD = k1 • λ / NA … CD is the critical dimension, or smallest possible feature size, and λ is the wavelength of light used. NA is the numerical aperture".
  - https://www.asml.com/en/technology/lithography-principles/measuring-accuracy — 200 — "overlay (the accuracy with which two layers of a chip are aligned)", "YieldStar is used for after-etch metrology to inspect actual device structures".
  - https://www.asml.com/en/company/stories/2021/semiconductor-manufacturing-process-steps — 200 — 발견 #12.
- CALC: 0.4×193/0.8=96.5 ✓; 0.3×193/0.8=72.375 ✓; 0.4×193/1.6=48.25 ✓; (200−120)/2=40, 40−30=10, 40−50=−10 ✓.
- 빠진 내용: Rayleigh 식의 k₁ 하한(단일 노광 0.25)과 "NA를 1.6으로 두 배" 가정이 액침(immersion)에서만 NA>1이 가능하다는 사실은 적지 않았다. 글 자체가 "실제로 NA를 두 배로 만들 수 있다는 뜻은 아니다"라고 경계를 둬 치명적이지 않음.
- OK: 감광막→레티클 투영→베이크·현상→식각 순서 ✓; 오버레이 정의 ✓; 계측 표적·식각 후 계측 ✓.

### semiconductors/interconnect-and-rc-delay
- 추출한 고유 사실 주장 수: 13, 검증 13, 미검증 0
- 연 자료:
  - https://ocw.mit.edu/courses/6-884-complex-digital-systems-spring-2005/fd75994e0ea84378705dd12ee8c16326_l04_wires.pdf — 200(26쪽) — 12쪽 "Simple lumped Π model gives reasonable approximation … Delay = Rdriver × Cw/2 + (Rdriver + Rw) × (Cw/2 + Cload)". 글의 "12쪽" 일치.
  - https://www.intel.com/content/dam/www/public/us/en/documents/research/2002-vol06-iss-2-intel-technology-journal.pdf — curl 403 → https://web.archive.org/web/20250615152405/… 200(76쪽) — PDF 10쪽 "The present technology exhibits 30% lower sheet resistance at the same metal pitch due to the use of Cu with high aspect ratios", 11쪽 "For a given pitch, 50% reduction in RC is achieved by using Cu interconnects and FSG ILD." 글의 "10쪽 30% 시트 저항·11쪽 50% RC" 일치. 호 "130nm Logic Technology Featuring 60nm Transistors, Low-K Dielectrics, and Cu Interconnects"(Vol. 6 Issue 2) ✓.
- CALC: 500×120 fF=60 ps ✓; 200×70=14 ✓; 500×50+700×70=25+49=74 ✓; 2배 길이 500×220=110, 400×120=48, 합 158, 158/74=2.135 ✓; R_wC_w/2 10→40 ps ✓; 140 Ω: 60+9.8=69.8 ✓; 50 fF: 35+9=44 ✓; 둘 다 35+6.3=41.3 ✓; RC·ln2=6.93 ps ✓.
- 빠진 내용: 없음(Elmore 정의·한계 서술 적절).
- OK: π 모형 정의 ✓; Elmore=임펄스 응답 1차 모멘트 ✓; Intel 30%/50%가 서로 다른 측정량이라는 주의 ✓.

### semiconductors/bands-and-doping
- 추출한 고유 사실 주장 수: 15, 검증 15, 미검증 0
- 연 자료:
  - https://ethw-images.s3.us-east-va.perf.cloud.ovh.us/ieee/b/b4/P3_Proc._R._Soc._Lond._A-1931-Wilson-458-91.pdf — 200(스캔 35쪽) — PDF 4쪽=인쇄 460쪽 이미지 직접 판독: "the energy levels break up into a number of bands of allowed energies, separated by bands of disallowed energies … If a field is applied, it will be impossible on account of the Pauli principle for any electron to increase its stream without making a transition to the second band of allowed energies. This it will be unable to do provided the field is small enough". 글의 인용("bands of allowed energies"/"bands of disallowed energies", 작은 전기장에서 전류 불가) 일치.
  - https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-fall-2005/e1a94598c1fd641fc15636a9ad14de1a_lec2.pdf — 200 — Lecture 2-4 "Si atomic density: 5 × 10²² cm⁻³", 2-9 "Go = Ro ⇒ no po = f(T) ≡ ni²(T)", 2-11 "In Si at 300 K: ni ≃ 1×10¹⁰ cm⁻³", 2-14 "no = Nd, po = ni²/Nd … Nd = 10¹⁷ cm⁻³ → no = 10¹⁷, po = 10³". 글의 쪽(4·6·9·11·13·14·17)·원문 예 Nd=10¹⁷ 일치.
  - https://vtda.org/pubs/BSTJ/vol28-1949/articles/bstj28-3-435.pdf — 200(스캔 55쪽) — 1쪽=435쪽 이미지: "silicon and germanium may be either n-type or p-type semiconductors, depending on which of the concentrations N_d of donors or N_a of acceptors, is the larger. If, in a single sample, there is a transition from one type to the other, a rectifying photosensitive p-n junction is formed." 일치.
  - https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/70b3d239e4037abf0856a71f4ef22616_MIT6_012S09_tutor01.pdf(article-evidence만) — 200 — "Problem 1 – Multiple dopants in Silicon … P 10¹⁶ cm⁻³" 존재.
- CALC: (10¹⁰)²/10¹⁶=10⁴ ✓; Nd−Na=8×10¹⁵, 10²⁰/8×10¹⁵=1.25×10⁴ ✓; (10¹³)²/10¹⁶=10¹⁰ ✓; 5×10²²/10¹⁶=5×10⁶ "500만 개 중 1개" ✓.
- 빠진 내용: 없음(글이 ni·Eg를 "교육용 기준값"으로 한정).
- OK: 띠틈 약 1.1 eV 기준값 ✓; 전하 중성식 n=p+N_d, n+N_a=p+N_d ✓; σ=q(nμn+pμp) ✓.

### semiconductors/doping-and-thermal-budget
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료:
  - https://ocw.mit.edu/courses/6-152j-micro-nano-processing-technology-fall-2005/dbad8f442ecf1244e2a257de2671d0e2_lecture4.pdf — 200(20쪽) — "'Drive in' of fixed amount, Q, of dopant; solution is Gaussian … Width of Gaussian = a = 2√Dt = diffusion length a", "C(z,t) = Csurf erfc[z/(2√Dt)]", 예제 "a = 2√Dt, 1 hr ⇒ a0 = 2√(1.30×10⁻¹⁴×3600) = 0.137 µm". 글의 a=2√(Dt)·erfc 해 일치.
  - https://ocw.mit.edu/courses/6-774-physics-of-microfabrication-front-end-processing-fall-2004/149Phbk_yJVmBm_KPM035Wd40as-4iVuA_transcript.pdf — 200(14쪽) — "in the case of Gaussian diffusion that we can write the total effective d2 product as being a measure of the thermal budget … sum up those dt products and add them up, and end up with an effective dt for the entire process … assuming that in each case, the diffusion satisfies the Gaussian assumptions", "the highest temperature steps in the process typically dominate", "2 c sub s over square root of pi times square root of dt"(Q=Cs√(πDt) 관계). 일치.
- CALC: 2√(3.6×10⁻¹¹)=1.2×10⁻⁵ cm=120 nm ✓; 2√(1.08×10⁻¹⁰)=207.85 nm ✓; √(3.6/10.8)=0.577 ✓; e^−4=0.0183 ✓; 0.577×e^−(240/207.85)²=0.577×e^−1.333=0.152 ✓; 120√ln100=257.5 nm ✓; 207.85√ln(100/√3)=418.6 nm ✓; 14400 s→240 nm ✓.
- 빠진 내용: 없음.
- OK: 열 예산 단위 cm² ✓; 접합 깊이≠폭 척도 ✓; erfc 조건부 서술 ✓.

### semiconductors/wafer-and-planar-process
- 추출한 고유 사실 주장 수: 12, 검증 12, 미검증 0
- 연 자료: https://patentimages.storage.googleapis.com/cc/fb/db/690d609db55af5/US3025589.pdf — 200(6쪽) — 1쪽 "Filed May 1, 1959 … Patented Mar. 20, 1962"; 5쪽(인쇄 열 7) 청구항 1: "…while leaving permanently in place the coat[ing]…", 청구항 5·6 존재; 4쪽 "…taken to exclude gallium as a suitable impurity … insofar as the element gallium is concerned"(인쇄 열 6). 글의 "1959 출원·1962 등록", "청구항 1(e) PDF 5쪽 열 7", "PDF 4쪽 열 6 갈륨 경고" 모두 일치.
- CALC: 100+2+2=104 ✓; (104−80)/2=12 ✓; 110→15 ✓; (104−100)/2=2, 2−3=−1 ✓.
- 빠진 내용: 없음.
- OK: 산화막 마스크·접합 보호 서술 ✓; 다이오드(도 1–4)와 트랜지스터(도 10) 구분 ✓.

### embedded/mcu-memory-map-and-registers
- 추출한 고유 사실 주장 수: 16, 검증 16, 미검증 0
- 연 자료:
  - https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf — 200(642쪽) — Colophon "build-version: 3184e62-clean / build-date: 2025-02-20"; "SIO_BASE 0xd0000000"; SIO 레지스터 표 "0x014 GPIO_OUT_SET / 0x018 GPIO_OUT_CLR / 0x024 GPIO_OE_SET"; GPIO_OUT_SET 설명 "Perform an atomic bit-set on GPIO_OUT, i.e. GPIO_OUT |= wdata"; "IO_BANK0_BASE 0x40014000", "0x02c GPIO5_CTRL"; §2.1.2 "Addr + 0x1000 : atomic XOR … + 0x2000 : atomic bitmask set … + 0x3000 : atomic bitmask clear" 및 "The SIO (Section 2.3.1) … does not support atomic accesses at the bus level, although some individual registers (e.g. GPIO) have set/clear/xor aliases." 글 서술 전부 일치.
  - https://raw.githubusercontent.com/raspberrypi/pico-sdk/a1438dff…/src/rp2_common/hardware_gpio/gpio.c 및 …/include/hardware/gpio.h — 200 — 고정본과 `diff` 동일. gpio_init 273–277행, gpio_set_function 35–53행("Zero all fields apart from fsel"), gpio_set_dir 1350–1359행("mask = 1ul << gpio"), gpio_set_dir_out_masked 1218–1224행("sio_hw->gpio_oe_set = mask"), gpio_put 1155–1164행, gpio_set_mask 918–924행("sio_hw->gpio_set = mask") 모두 teachCodeRefs 하이라이트와 일치.
  - https://api.github.com/repos/raspberrypi/pico-sdk/git/refs/tags/2.2.0 — 200 — `"sha": "a1438dff1d38bd9c65dbd693f0e5db4b9ae91779", "type": "commit"` (태그 2.2.0=고정 커밋 ✓).
  - https://www.raspberrypi.com/documentation/pico-sdk/hardware.html — curl 403 / WebFetch 200 — "Hardware APIs" 목록에 hardware_gpio·i2c·spi·uart·adc·timer 존재.
- CALC: 1<<5=32=0x20 ✓; 0xD0000000+0x14 ✓; 0x40014000+0x2C=0x4001402C ✓; 0x01|0x20|0x40=0x61 ✓.
- 빠진 내용: 없음.
- OK: PROVENANCE.md 커밋·태그 ✓.

### embedded/interrupts-and-latency-budget
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료:
  - RP2040 datasheet(위) — IRQ 표 "13 IO_IRQ_BANK0"; INTR0 "11 GPIO2_EDGE_HIGH WC"; 목차 §2.3.2 Interrupts(60쪽)·§2.19.3 Interrupts(239쪽)·§2.19.5 Software Examples(241쪽) 존재.
  - https://documentation-service.arm.com/static/5f04aadfdbdee951c1cdc957 — 200(112쪽, "ARM DUI 0662A") — §4.2.6(인쇄 4-6) "For a level-sensitive interrupt, if the signal is not deasserted before the processor returns from the ISR, the interrupt becomes pending again"; §4.2.7(인쇄 4-7) "An interrupt can enter pending state even if it is disabled. Disabling an interrupt only prevents the processor from taking that interrupt." 글 105행 서술 일치(발견 #7은 source 표기만).
  - gpio.c 고정본 — 153–170행 gpio_default_irq_handler: `gpio_acknowledge_irq(i, events); if (callback) callback(i, events);` 순서 ✓; 174–175행 `// Clear stale events which might cause immediate spurious handler entry / gpio_acknowledge_irq(gpio, events);` ✓("허용을 켜는 내부 함수는 이전 에지 상태를 먼저 지움"); 198–203행 콜백 등록→허용→irq_set_enabled ✓; gpio.h 573–576행 `io_bank0_hw->intr[gpio / 8] = event_mask << (4 * (gpio % 8));` ✓.
- CALC: 5+40+8+20=73 ✓; +40+300+80=493 ✓; 1000−493=507 ✓; 493−40+600=1053 ✓; 8<<(4×2)=0x800, 비트 11 ✓.
- 빠진 내용: 없음.

### embedded/timers-and-sampling
- 추출한 고유 사실 주장 수: 15, 검증 15, 미검증 0
- 연 자료:
  - RP2040 datasheet — 목차 "4.6.1 Overview 534 / 4.6.2 Counter 535 / 4.6.3 Alarms 535", "4.9.2 SAR ADC 559"; 본문 "A single 64-bit counter, incrementing once per microsecond / Four alarms: match on the lower 32 bits of counter, IRQ on match", "After 96 cycles of clk_adc, CS.READY will go high … At a clock frequency of 48MHz, this produces 500ksps", "the voltage on the ADC inputs should not exceed IOVDD". 글의 인쇄 534–535·559쪽, 1 µs·64비트·4알람·하위 32비트·96주기 2 µs·IOVDD 제한 전부 일치.
  - https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/8708ec068ebdea2c4ee2f38fad39fb83_MITRES_6_007S11_lec16.pdf — 200(12쪽) — 1쪽 "a bandlimited time function can be exactly reconstructed from equally spaced samples provided that the sampling rate … is greater than twice the highest frequency present in the signal". 일치.
  - time.c·time.h·adc.h 고정본 vs upstream raw — `diff` 동일. time.c 500–509행 `make_timeout_time_us((uint64_t)(delay_us >= 0 ? delay_us : -delay_us))`, 171–191행 `delta = rpt->callback(rpt) ? rpt->delay_us : 0; … if (delta < 0) next_time = earliest_target - delta; else next_time = ta_time_us_64(timer) + delta;` ✓; adc.h 175–182행 START_ONCE→READY 대기→result ✓.
- CALC: cos(2π·30n/100), n=0..5 = 1, −0.309, −0.809, 0.809, 0.309, −1 ✓(70 Hz 동일); ×1 V+1.65 = 2.65, 1.341, 0.841, 2.459, 1.959, 0.65 ✓; 10000−(−10000)=20000, 10420+10000=20420 ✓; 96/48 MHz=2 µs ✓.
- 빠진 내용: 없음.

### embedded/serial-buses-and-tradeoffs
- 추출한 고유 사실 주장 수: 16, 검증 16, 미검증 0
- 연 자료:
  - https://www.nxp.com/docs/en/user-guide/UM10204.pdf — curl 404(비브라우저 UA 차단) / WebFetch 200(62쪽) — 표지 "Rev. 7.0 — 1 October 2021"; §3.1.4(인쇄 9쪽) START/STOP, §3.1.5 Byte format, §3.1.6(10쪽) Acknowledge(ACK) and Not Acknowledge(NACK), §3.1.9(12쪽) Clock stretching, §3.1.10(12쪽) "The target address and R/W bit", Fig 13 "Combined format"(14쪽). 글의 "Rev. 7.0 (2021), §3.1.4–3.1.6·3.1.9–3.1.10, 인쇄 9–14쪽, 그림 13" 일치.
  - i2c.c·i2c.h 고정본 vs upstream raw — `diff` 동일. 133–164행: `invalid_params_if(HARDWARE_I2C, addr >= 0x80); // 7-bit addresses … i2c->hw->tar = addr; … bool_to_bit(first && i2c->restart_on_next) << RESTART_LSB | bool_to_bit(last && !nostop) << STOP_LSB` ✓; 240–246행 `i2c->restart_on_next = nostop;` 및 `i2c_write_blocking … (…, nostop, NULL, NULL)` ✓; 287–315행 읽기 명령 CMD_BITS·abort 검사 ✓; 338–345행 `i2c_read_blocking_until … init_single_timeout_until(&ts, until)` ✓.
  - RP2040 datasheet GPIO 기능 표 — "16 SPI0 RX UART0 TX I2C0 SDA", "17 SPI0 CSn UART0 RX I2C0 SCL", "8 SPI1 RX", "9 SPI1 CSn", "10 SPI1 SCK", "11 SPI1 TX", "0 … UART0 TX", "1 … UART0 RX" ✓; UART 장(PDF 418–422쪽) "1 or 2 stop bits", "parity" ✓(글 "원본 419–420쪽" 범위 내).
- CALC: (3+4)×9=63 ✓; 63×2.5=157.5 µs ✓; 63/100 kHz=630 ✓; 0x48<<1=0x90, |1=0x91 ✓; 5×8=40 클록, 40 µs@1 MHz ✓; 40/115200=347.2 µs ✓; 157.5+200=357.5 ✓.
- 빠진 내용: 발견 #2(모드 4종·중재·Fm 타이밍). 추가로 프롬프트가 요구한 CAN은 글 범위 밖(I²C·SPI·UART만 비교)이라 결함으로 세지 않음.

### embedded/scheduling-and-real-time
- 추출한 고유 사실 주장 수: 15, 검증 13, 미검증 2(발견 #9)
- 연 자료:
  - https://raw.githubusercontent.com/FreeRTOS/FreeRTOS-Kernel/0adc196d…/tasks.c, …/include/task.h — 200 — 고정본과 `diff` 동일. 194–209행 `taskSELECT_HIGHEST_PRIORITY_TASK() … while( listLIST_IS_EMPTY( &( pxReadyTasksLists[ uxTopPriority ] ) ) …) --uxTopPriority;` ✓; 2385–2428행 `xTimeToWake = *pxPreviousWakeTime + xTimeIncrement; … *pxPreviousWakeTime = xTimeToWake; if( xShouldDelay != pdFALSE ) … prvAddCurrentTaskToDelayedList( xTimeToWake - xConstTickCount, pdFALSE );` ✓; 6652–6690행 `if( pxMutexHolderTCB->uxPriority < pxCurrentTCB->uxPriority ) … pxMutexHolderTCB->uxPriority = pxCurrentTCB->uxPriority; prvAddTaskToReadyList( pxMutexHolderTCB );` ✓.
  - https://api.github.com/repos/FreeRTOS/FreeRTOS-Kernel/git/refs/tags/V11.2.0 → tag object → `"sha": "0adc196d4bd52a2d91102b525b0aafc1e14a2386", "type": "commit"` ✓.
  - FreeRTOS 두 문서 페이지 — 200이나 본문 추출 불가(발견 #9). Reference Manual V10.0.0 PDF — 200(405쪽).
- CALC: 1/5+2/10+3/50=0.46 ✓; 10×1+5×2+1×3=23 ms ✓; 0+10=10, 10−3=7 tick ✓; 12>10 → 대기 없음 ✓; 타임라인 0–1·1–3·3–5·5–6·6–7 ✓; 뮤텍스 사례 3–5 ms→마감 4 ms 1 ms 초과 ✓.
- 빠진 내용: 없음(응답시간 분석의 공식 한계식(RTA)은 글이 의도적으로 범위 밖으로 둠).

### embedded/firmware-update-and-recovery
- 추출한 고유 사실 주장 수: 17, 검증 17, 미검증 0
- 연 자료:
  - https://raw.githubusercontent.com/mcu-tools/mcuboot/2d61c318…/boot/bootutil/src/bootutil_public.c, swap_scratch.c, …/include/bootutil/bootutil_public.h, docs/design.md — 200 — 고정본 4개 `diff` 동일. boot_swap_tables 105–150행: offset 전용 첫 항목 `#if defined(MCUBOOT_SWAP_USING_OFFSET)`, TEST(secondary GOOD·image_ok UNSET), PERM(image_ok SET), REVERT(primary GOOD·image_ok UNSET·copy_done SET) ✓; boot_set_next 523–570행(`if (active && slot_state.image_ok == BOOT_FLAG_UNSET) rc = boot_write_image_ok(fa);` / UNSET·!active → magic, confirm이면 image_ok, swap_type TEST/PERM) ✓; boot_set_pending_multi 684–698행 `flash_area_open(FLASH_AREA_IMAGE_SECONDARY(image_index)…); boot_set_next(fap, false, !(permanent == 0));` ✓; boot_set_confirmed_multi 729–743행 PRIMARY·(true,true) ✓; swap_scratch.c 618–777행 secondary→scratch(649–655)·primary→secondary(690–696)·scratch→primary(726–728)·`boot_write_status` ✓; 50–122행 swap_read_status_bytes `bs->idx = (found_idx / BOOT_STATUS_STATE_COUNT) + 1; bs->state = …+1` ✓.
  - GitHub tag API v2.2.0 → `"sha": "2d61c318933819a0f4954fb2a5a957a62c6128ce"` ✓.
  - https://docs.mcuboot.com/design.html — 200 — "Test: Boot the contents of the secondary slot by swapping images. Unless the swap is made permanent, revert back on the next boot.", "Image OK: A single byte indicating whether the image in this slot has been confirmed as good by the user (0x01=confirmed; 0xff=not confirmed)", "If the bootloader resets in the middle of a swap operation, the two images may be discontiguous in flash. Bootutil recovers from this condition by using the image trailers", "The scratch area must have a size that is enough to store at least the largest sector that is going to be swapped". 일치.
  - RP2040 datasheet — PDF 123쪽 XIP "External Flash is accessed via the QSPI interface using the execute-in-place (XIP) hardware", 130–132쪽 Bootrom 순서("Check if SPI CS pin is tied low ('bootrom button')", "If checksum passes, assume what we have loaded is a valid flash second stage"), 145쪽 UF2/USB 경로 ✓(글 "원본 123·129–132·145쪽").
- CALC: 4096−256−1536×2=768 ✓.
- 빠진 내용: 없음.

### circuits/lumped-circuit-and-conservation
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료:
  - https://live.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/f6ad70417c73f585b7ca065153d25d25_6002_l1.pdf — 200(24쪽) — 21쪽 "The sum of the voltages in a loop is 0.", 23쪽 "The sum of the currents into a node is 0.", 18쪽 "Lumped Matter Discipline (LMD)". 일치.
  - https://live.ocw.mit.edu/…/99b2a662083d1b1f487c55ea0f0d0220_6002_l2.pdf — 200 — 9쪽 "Then power consumed = νi is positive"(3쪽에도 "power consumed by element = vi"). 일치.
  - https://zenodo.org/records/2422851 — 200 — "Ueber den Durchgang eines elektrischen Stromes durch eine Ebene, insbesondere durch eine kreisförmige / Kirchhoff, Studiosus / Published January 1, 1845 / DOI 10.1002/andp.18451400402"; article.pdf(19쪽) PDF 3쪽=인쇄 499쪽 이미지 직접 판독: "∫ds·du/dN = o … wenn dieses Integral über die ganze Curve ausgedehnt wird", "innerhalb der ihr keine Elektricität zugeführt wird, so muſs die Summe aller Elektricitätsmengen, die durch diese Curve flieſsen = o seyn". 글의 499쪽 인용 일치(권수 64는 Poggendorff 번호, Wiley DOI는 140권 — 둘 다 통용).
- CALC: V=6, 6/3/3 mA ✓; R₂=1 kΩ → (12−V)/1000=V/2000+V/1000 → V=4.8, 7.2/2.4/4.8 mA ✓; 72=36+18+18 mW ✓; g=0.002 A/V, 0.012/0.002=6 V ✓.
- 빠진 내용: 없음.

### circuits/resistance-and-power-dissipation
- 추출한 고유 사실 주장 수: 12, 검증 12, 미검증 0
- 연 자료:
  - https://www.vishay.com/docs/20035/dcrcwe3.pdf — 200(13쪽) — 1·2쪽 푸터 "Revision: 14-Apr-2026 … Document Number: 20035"; 2쪽 "Rated dissipation, P70 D11/CRCW0603 e3 0.10 W 0.125 W", "Operating voltage, Umax. ACRMS/DC D11/CRCW0603 e3 75 V 75 V"; 1쪽 "P70 (1)(2)" 조건. 글의 "2026년 4월 개정 2쪽 표준 0.10 W·확장 0.125 W" 일치.
  - https://ocw.mit.edu/…/62cc78db14ad37dede55c361711ba2ae_6002_l22.pdf — 200 — 4쪽 "Example 1: … Power P = VI =". 일치.
- CALC: 2∥1=2/3 kΩ, 5/3 kΩ, 12/(5/3)=7.2 mA ✓; 7.2²×1=51.84, 2.4²×2=11.52, 4.8²×1=23.04, 합 86.4=12×7.2 ✓; 12²/1000=0.144 W ✓; √(0.1×1000)=10 V ✓.
- 빠진 내용: 없음.

### circuits/storage-elements-and-transients
- 추출한 고유 사실 주장 수: 15, 검증 15, 미검증 0
- 연 자료:
  - https://ocw.mit.edu/…/84f4b553fc6a1ddd7007465041c4e213_6002_l12.pdf — 200(13쪽) — 5쪽 "A capacitor is an energy storage device", 6쪽 "Analyzing an RC circuit"(KCL), 7쪽 "RC dvC/dt + vC = VI", 11–12쪽 "vC = VI + (V0 − VI) e^(−t/RC)". 발견 #8(쪽 표기).
  - https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2007/f5c35823a7faac0d893754ab42804e7e_chap11inductance.pdf — 200(53쪽) — 10쪽 "U_B = ½LI² (11.3.4)", 18쪽 식 (11.4.7) I(t)=(ε/R)(1−e^(−t/τ)), 19쪽 "τ = L/R (11.4.8)" 및 "To see that energy is conserved in the circuit, we multiply Eq. (11.4.7) by I". 글의 10·17–19쪽 일치.
- CALC: 5(1−e⁻¹)=3.161 V, 1.839 mA ✓; 5(1−e⁻³)=4.751 V, 0.249 mA ✓; ln100=4.605 ✓; ½·1 µF·25=12.5 µJ ✓; ½·1 H·(5 mA)²=12.5 µJ ✓; 2 kΩ → RC 2 ms, L/R 0.5 ms, 2.5 mA ✓.
- 빠진 내용: 없음.

### circuits/steady-state-and-impedance
- 추출한 고유 사실 주장 수: 13, 검증 13, 미검증 0
- 연 자료: https://ocw.mit.edu/…/66adf4d4611a57b949efa1b00a842a46_6002_l17.pdf — 200(14쪽) — 4쪽 "1/√(1+ω²R²C²)"·"1+jωRC", 6쪽 "vC = VC e^{jωt} … IC e^{jωt} = CVC jω e^{jωt}"(VC=IC/(jωC)), 7쪽 "Vc = Z_C I_c", 8쪽 축전기 임피던스 분배. 글의 4·5–7·8쪽 일치.
- CALC: √2×1000=1414 Ω ✓; 5/1414=3.536 mA ✓; π/4/1000 rad/s=0.785 ms ✓; 3.54·cos45°=2.50 V ✓; 1 µF@1000 rad/s → −j1000 Ω, 1 H → +j1000 Ω ✓; ωRC=0.1/10 → 0.995/0.0995, −5.7°/−84.3° ✓.
- 빠진 내용: 없음.

### circuits/frequency-shaping-and-bode
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료: L17 4쪽(위) ✓; https://ocw.mit.edu/…/d4e136975654a01f7fc2c9b49196d376_6002_l18.pdf — 200(17쪽) — 2–3쪽 "ZC/(ZC+ZR) … 1/(1+jωRC) 'Low Pass Filter'", 7쪽 "High Pass Filter / Low Pass Filter" 나란히. 일치.
- CALC: 1000/2π=159.155 Hz ✓; 1/√(1+0.01)=0.99504, 20log=−0.0432 dB ✓; 1/√2 → −3.0103 dB ✓; 1/√101=0.0995 → −20.0432 dB ✓; 차 −17.0329 dB ✓; 10fc→100fc −19.957 dB ✓; 고역 0.0995/0.707/0.995 ✓; 위상 −5.71°/−45°/−84.29° ✓.
- 빠진 내용: 없음.

### circuits/feedback-gain-and-stability
- 추출한 고유 사실 주장 수: 13, 검증 13, 미검증 0
- 연 자료: https://www.ti.com/lit/an/sboa015/sboa015.pdf — 200(14쪽) — 1쪽 "FEEDBACK PLOTS DEFINE OP AMP AC PERFORMANCE By Jerald G. Graeme", "(Originally published in EDN magazine … on 1/19/89 and 2/2/89)", "ACL = (1/β)/(1/Aβ + 1)", "ACL = A/(1 + Aβ)", "© 1991 Burr-Brown Corporation AB-028A Printed in U.S.A. June, 1991"; 2쪽 "APPROXIMATING PHASE MARGIN … 180° of phase shift". 글의 "1991 발행, 1쪽 두 식, 2쪽 위상 여유" 일치(원 게재는 EDN 1989 — 글의 '1991 발행'은 Burr-Brown 재발행 기준으로 맞음).
- CALC: 100/11=9.0909, 100/51=1.9608 ✓; 1/11=9.09%, 1/51=1.96% ✓; (1+(ω/10)²)(1+(ω/100)²)=(100β)² → x²+10100x+10⁶(1−(100β)²)=0: β=0.1 x=6108.07, ω=78.15; β=0.5 x=45194.4, ω=212.59 ✓; 위상 −120.72°/−152.12°, PM 59.28°/27.88° ✓; 단극 ω=10√99=99.50, −84.26°, PM 95.74° ✓.
- 빠진 내용: 없음.

### devices/pn-junction-and-rectification
- 추출한 고유 사실 주장 수: 13, 검증 13, 미검증 0
- 연 자료: Shockley 1949 PDF 27쪽=인쇄 461쪽 이미지 판독: 식 (4.18) I_pc(v₀)=…≡I_ps(e^{qv₀/kT}−1), (4.19) I_ns, (4.22) "I₀(v₀) = [G_p0 + G_n0](kT/q)[e^{qv₀/kT} − 1] = (I_ps + I_ns)[e^{qv₀/kT} − 1]"; 20쪽=454쪽 식 (3.12) "I_s = gq(L_n + L_p) … is the current density corresponding to the total rate of generation of hole-electron pairs". 글 인용 전부 일치. https://ocw.mit.edu/…/369ddf4748729cfe5fe48c7528fd1d42_lecture14.pdf — 200 — 11쪽 "I = Is(exp(qV/kT) − 1)", 17쪽 "Forward bias: junction barrier ↓ ⇒ carrier injection … I saturates with reverse V" ✓.
- CALC: kT/q(300 K)=25.852 mV ✓; 0.5/0.02585=19.342 → 1 pA(e^19.342−1)=0.2514 mA ✓; 0.6/0.02585=23.211 → 12.03 mA ✓; 비 e^3.8685=47.87 ✓; −0.5 V → −1.000 pA ✓.
- 빠진 내용: 없음.

### devices/mos-capacitor-and-inversion
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료:
  - https://patents.google.com/patent/US3102230A/en — 200 — "Electric field controlled semiconductor device / Kahng Dawon / Filed May 31, 1960 / Published Aug 27, 1963", "The oxide is about 1000 angstrom units thick", "A voltage source 28 providing a voltage V, is connected between electrode 21 and contact 24. In response to an accumulation of charge of one polarity on the electrode 21, a charge of opposite polarity is induced in the surface portion 23". 글의 "1960 출원·1963 등록, 약 1000 Å" 일치.
  - https://ocw.mit.edu/…/42c863e2e1e9744ce6b797646a30e463_MIT6_012F09_lec09.pdf — 200(31쪽) — 4쪽 "will need electrons, and they will come from there.", 23쪽 "−Cox*(vGB − VT)", 30쪽 "Cox* ≡ εox/tox". 일치.
- CALC: 3.9×8.854e−12/1e−8=3.4531e−3 F/m² ✓; ×1e−10 m²=0.3453 pF ✓; ×0.5 V=0.17265 pC ✓; /1.602e−19=1.078×10⁶ ✓; 면적당 1.08×10¹² cm⁻² ✓; 5 nm → 0.6906 pF ✓.
- 빠진 내용: 없음.

### devices/mosfet-regions-and-transfer
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0
- 연 자료: https://ocw.mit.edu/…/8ad0e553fbdaed10f6102b04451e547e_lecture25.pdf — 200(18쪽) — 10쪽 "Qi(y) ≃ −Cox [VGS − V(y) − VT]", 13–14쪽 "Ie dy = −W µe Cox (VGS − V − VT)dV … ID = (W/L) µe Cox (VGS − VT − VDS/2) VDS". https://ocw.mit.edu/…/59850a07f95e9f50d32185eb46503460_lecture26.pdf — 200(16쪽) — 3쪽 "Gradual-channel approximation becomes invalid … Lateral field so large that linearity between field and velocity invalid … when VDS approaches VGS−VT, ID changes very little", 4쪽 "up to about 80% of VGS − VT … up to about 96% of ID,sat", 5쪽 "pinch-off … c) saturation regime", 7쪽 "Current model in saturation", 8쪽 "VDSsat". 글의 25강 10·13쪽, 26강 3·4·5·7·8쪽 전부 일치.
- CALC: 1×(1.0×0.2−0.02)=0.18 mA ✓; 0.5 mA ✓; Vov 1.5 → 1.125 mA ✓; VDS 0.8 → 0.48 mA=96% ✓.
- 빠진 내용: 없음.

### devices/switching-energy-and-leakage
- 추출한 고유 사실 주장 수: 12, 검증 12, 미검증 0 (발견 #6은 쪽 표기)
- 연 자료: https://ocw.mit.edu/…/6bec6dd1b07b02a1a84098b78f068cc3_lec14.pdf — 200(25쪽) — 22쪽 "Energy provided by battery during transient: ES = ∫VDD iDD dt = CLVDD²", "ΔEC = … = ½CLVDD²", "EP = ES − ΔEC = ½CLVDD²"; 23쪽 "ES = 0", "EN = ΔEC = ½CLVDD²"; 24쪽 "ED = EP + EN = ΣES = CLVDD²"; 25쪽 "PD = f ED = f CLVDD²".
- CALC: 10 pF×3.3²=108.9 pJ ✓; ½=54.45 ✓; ×10⁵/s=10.89 µW ✓; 3.3 V×1 µA=3.3 µW, 합 14.19 ✓; 5 pF → 5.445, 8.745 ✓; 1.8 V → 3.24 µW ✓; Q=33 pC ✓.
- 빠진 내용: 없음.

### crypto/ml-kem-and-noisy-equations
- 추출한 고유 사실 주장 수: 16, 검증 15, 미검증 1(발견 #11)
- 연 자료:
  - https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf — 200(56쪽) — "q Denotes the prime integer 3329 = 2⁸·13+1", "n = 256 and q = 3329", "k, η₁, η₂, d_u, d_v" ; Table 3(p.48) "ML-KEM-768 1184 2400 1088 32"; Algorithm 18 "ML-KEM.Decaps_internal(dk, c)" 10행 "K′ ← K̄ ▷ if ciphertexts do not match, 'implicitly reject'"; §7.3 입력 검사("…d_v, and k specified by the relevant parameter set, then input checking has failed"). 글의 n·q·k·크기·Algorithm 18·excerpt 전부 일치.
  - https://csrc.nist.gov/pubs/fips/203/final — 200 — "Date Published: August 13, 2024 / Planning Note (11/17/2025): We've identified an issue that will be corrected in a future update/revision of this publication. For details, see the 'Errata (potential updates)' spreadsheet". 글의 "2025-11-17 errata 안내" 일치.
  - https://csrc.nist.gov/pubs/sp/800/227/final — 200 — "Recommendations for Key-Encapsulation Mechanisms / Date Published: September 2025 / … to securely establish a shared secret key over a public channel". excerpt 일치, 일자는 발견 #11.
  - https://raw.githubusercontent.com/PQClean/PQClean/0586a824…/crypto_kem/ml-kem-768/clean/kem.c — 200 — 고정본 `diff` 동일. 136–163행 `PQCLEAN_MLKEM768_CLEAN_crypto_kem_dec`: 146행 `indcpa_dec(buf, ct, sk)`, 150행 `hash_g(kr, buf, …)`, 153행 `indcpa_enc(cmp, buf, pk, kr + KYBER_SYMBYTES)`, 155행 `fail = verify(ct, cmp, …)`, 158행 `rkprf(ss, sk + … − KYBER_SYMBYTES, ct)`, 161행 `cmov(ss, kr, KYBER_SYMBYTES, (uint8_t)(1 - fail))`. 글의 행 번호 서술 전부 일치.
- CALC: t=As+e=[2+6+1, 4+2+0]=[9,6] ✓; Aᵀr=[6,4], u=[6,5] ✓; v=9+6+8=23≡6 ✓; s·u=16, 6−16=−10≡7 ✓; 오류 1+0−2=−1 → 8−1=7 ✓; e₂=−4 → 3 ✓.
- 빠진 내용: 발견 #3.

### crypto/post-quantum-signatures
- 추출한 고유 사실 주장 수: 17, 검증 17, 미검증 0
- 연 자료:
  - https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf — 200(65쪽) — "q = 2²³ − 2¹³ + 1 = 8380417", Table 1(p.) "ML-DSA-44 … 8380417", Table 2 "ML-DSA-44 2560 1312 2420"(private key, public key, signature), Algorithm 7 Sign_internal(25쪽)·Algorithm 8 Verify_internal(27쪽), "rejection sampling loop follows the Fiat-Shamir With Aborts paradigm". 일치.
  - https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.205.pdf — 200(61쪽) — "stateless hash-based digital signature algorithm (SLH-DSA)", Table 2 "SLH-DSA-SHA2-128s 16 63 7 9 12 14 4 30 1 32 7 856"(pk 32, sig 7856). 일치.
  - https://csrc.nist.gov/pubs/fips/204/final — 200 — "Planning Note (07/31/2026): (7/31/26) See the errata (potential updates) spreadsheet … several minor issues that will be corrected in a future update/revision". 글의 "2026-07-31 정정 예정 안내" 일치.
  - https://csrc.nist.gov/Projects/Post-Quantum-Cryptography — 200 — "In August 2024, NIST released its principal PQC standards", Falcon "selected for ongoing standardization; that process is underway", HQC "4th Round Selection … selected for ongoing standardization". 글의 "FN-DSA·HQC 후속 표준화 중" 일치.
  - sign.c 고정본 vs raw — `diff` 동일. 133–165행: 135행 `polyvecl_uniform_gamma1(&y, rhoprime, nonce++)`, 140행 `polyvec_matrix_pointwise_montgomery(&w1, mat, &z)`, 158–162행 z=y+c·s1, 163행 `if (polyvecl_chknorm(&z, GAMMA1 - BETA)) goto rej;` ✓; 266행 `if (ctxlen > 255 || siglen != CRYPTO_BYTES) return -1;`, 303행 `polyveck_sub(&w1, &w1, &t1)`, 309행 `polyveck_use_hint(&w1, &w1, &h)` ✓.
- CALC: Ay=[7,9] ✓; z=[3,3] ✓; Az=[15,15] ✓; −ct=[6,9]=Ay−ce ✓.
- 빠진 내용: 없음(ML-DSA-44의 보안 범주 2 주장은 글이 하지 않음).

### crypto/quantum-computing-and-cryptographic-risk
- 추출한 고유 사실 주장 수: 15, 검증 15, 미검증 0
- 연 자료:
  - https://arxiv.org/abs/2603.28846v2 — 200 — "Securing Elliptic Curve Cryptocurrencies against Quantum Vulnerabilities: Resource Estimates and Mitigations / Babbush, Zalcman, Gidney, … Boneh / v1 2026-03-30, v2 2026-04-15 / Comments: '57 pages, 14 figures. v2 patches software bug enabling exploit against ZKP soundness' / Abstract: '<1200 logical qubits and <90 million Toffoli gates or <1450 logical qubits and <70 million Toffoli gates … On superconducting architectures with 1e-3 physical error rates and planar connectivity, those circuits can execute in minutes using fewer than half a million physical qubits.'" 글 9절·excerpt 전부 일치.
  - https://arxiv.org/abs/quant-ph/9605043 (+pdf) — 200 — Grover 1996, 본문 "In order to see that D is the inversion about average … which is precisely the inversion about average." excerpt 실재.
  - https://arxiv.org/abs/quant-ph/9508027 — 200 — Shor, "Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer"(1995-08) ✓.
  - https://quantum.cloud.ibm.com/learning/en/courses/fundamentals-of-quantum-algorithms/grover-algorithm/introduction — 200 — "Grover's algorithm requires a number of operations on the order of the square-root of the number of operations required to solve unstructured search classically" ✓.
  - NIST PQC 페이지(위) ✓.
- CALC: 진폭 [−0.5,0.5,0.5,0.5] 평균 0.25 → 2μ−a=[1,0,0,0] ✓; 2회차 [−1,0,0,0] 평균 −0.25 → [0.5,−0.5,−0.5,−0.5], 정답 확률 0.25 ✓; 2^a mod 15: 1,2,4,8,1 주기 4 ✓; gcd(3,15)=3, gcd(5,15)=5 ✓; 256=2⁸, 225≤256<450 ✓; 2ᵃ≡1인 a는 0,4,…,252로 64개 ✓; 피크 0·64·128·192 ✓; 128/256=1/2 → 2²=4≠1 ✓.
- 빠진 내용: 발견 #5(RSA 자원 추정).

### crypto/quantum-key-distribution
- 추출한 고유 사실 주장 수: 20, 검증 19, 미검증 1(발견 #10)
- 연 자료:
  - https://arxiv.org/abs/2003.06557 (+pdf) — 200 — "Quantum cryptography: Public key distribution and coin tossing / Bennett, Brassard / scan of the original … Proceedings of the International Conference on Computers, Systems & Signal Processing, Bangalore, India, pp. 175-179, December 1984"; PDF 3쪽(=177쪽) "eavesdropper measures and retransmits all intercepted … inducing disagreements in 1/4 of those", "…dropping by publicly comparing some of the bits on". excerpt 실재.
  - https://arxiv.org/html/1103.4130v2 — 200 — "Δ = 2ε + (1/2)√(2^(ℓ−H_min^ε(X|E')))"(식 6), "all information Eve learned about X during the protocol—including the classical communication sent by Alice and Bob over the authenticated channel", 식 (2) "ℓ ≤ n(q − h(Q_tol + μ)) − leak_EC − log(2/(ε_sec² ε_cor))", Table I 프로토콜 Φ[n,k,ℓ,Q_tol,ε_cor,leak_EC]. 글은 원문의 "="를 "≤"로 적고 그 사실을 명시("상계로 풀어 적었습니다") — 허용.
  - https://www.itu.int/rec/T-REC-X.1711 — 200 — "X.1711 (03/26) Framework of quantum key distribution (QKD) protocols in QKD networks — In force"; epublications 전문 URL HTTP 200(본문 미열람).
  - https://arxiv.org/abs/quant-ph/0411004 — 200 — Lo·Ma·Chen "Decoy State Quantum Key Distribution"(2005 PRL) ✓; https://arxiv.org/abs/1109.1473 — 200 — Lo·Curty·Qi MDI-QKD(2012 PRL) ✓; https://www.nature.com/articles/s41586-022-04891-y — 200(Zhang 외 2022) ✓.
  - https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/ — 403(curl·WebFetch 모두) → https://web.archive.org/web/20261005075139/… 200 — "NSA does not recommend the usage of quantum key distribution and quantum cryptography for securing the transmission of data in National Security Systems (NSS) unless the limitations below are overcome", "QKD networks frequently necessitate the use of trusted relays", "Quantum key distribution increases the risk of denial of service", "NIST is presently conducting a rigorous selection process"(오래된 문장 — 글이 "현재 상태의 근거로 쓰지 않는다"고 명시 ✓).
- CALC: 같은 기저 1,2,4,5,7,8,10,12 → 8개 ✓; 검사 2·10 제외 → 1,4,5,7,8,12 → A 010110·B 011110 ✓; 패리티 (1·3·5)=1/0, (2·3·6)=1/0, (4·5·6)=0/0 → 110 vs 000, 자리 3 ✓; 해시 (3·4·5)=0, (3·5·6)=1 → 01 ✓; ½×½=¼ ✓; (3/4)²=56.25% ✓; C(7,2)/C(8,2)=21/28=75% ✓; 64→8 후보, log₂8=3 ✓; ½√2^(2−3)=0.3536 ✓.
- 빠진 내용: 없음(decoy·MDI·DI·인증 경계 서술 충분).

### blockchain/glamsterdam-block-execution
- 추출한 고유 사실 주장 수: 14, 검증 14, 미검증 0 (발견 #1 OUTDATED)
- 연 자료:
  - https://eips.ethereum.org/EIPS/eip-7773 — 200 — Status Review, Mainnet 활성화 공란, 7732·7928 "Scheduled for Inclusion" ✓.
  - https://eips.ethereum.org/EIPS/eip-7732 — 200 — **Status: Last Call**; "A subset of validators in the beacon committee is assigned to the Payload Timeliness Committee (PTC), these validators are tasked to attest to whether the corresponding builder has revealed the committed execution payload." ✓(PTC 서술).
  - https://eips.ethereum.org/EIPS/eip-7928 — 200 — **Status: Last Call**; "BlockAccessIndex values MUST be assigned as follows: 0 for pre‑execution system contract calls. 1 … n for transactions (in block order). n + 1 for post‑execution system contract calls."(글 36행 ✓); "block_access_list_hash … Keccak-256 hash of the RLP-encoded block access list" ✓; "Parallel disk reads and transaction execution. Parallel post-state root calculation." ✓.
  - raw EIP md 3건·GitHub commits API — 발견 #1.
  - https://raw.githubusercontent.com/ethereum/consensus-specs/889a389f…/specs/gloas/beacon-chain.md — 200 — 고정본 `diff` 동일. 747–794행 `class ExecutionPayloadBid … block_hash, slot, value: Gwei, execution_payment …`, `class ExecutionPayloadEnvelope … payload: ExecutionPayload` ✓; 2103–2156행 `process_execution_payload_bid`: `assert is_active_builder(…)`, `assert can_builder_cover_bid(state, builder_index, amount)`, `assert verify_execution_payload_bid_signature(…)`, `assert bid.slot == state.slot`, `assert bid.parent_block_hash == state.latest_block_hash`, `state.builder_pending_payments[…] = pending_payment` ✓(excerpt 실재).
  - https://raw.githubusercontent.com/ethereum/execution-specs/a87891f7…/src/ethereum/forks/amsterdam/fork.py, block_access_lists.py — 200 — `diff` 동일. 326–365행 `computed_block_access_list_hash = hash_block_access_list(block_output.block_access_list)` … 362–363행 `if computed_block_access_list_hash != block.header.block_access_list_hash: raise InvalidBlock("Invalid block access list hash")` ✓(excerpt 실재); block_access_lists.py 30–56행 `class StorageChange: block_access_index: BlockAccessIndex / new_value: U256` ✓.
- CALC: 100−10=90, 90+5=95 ✓; 0.01 ETH=10⁷ Gwei ✓; Y=50+5=55 ✓.
- 빠진 내용: Last Call 마감(2026-11-01)과 상태 전이 이력이 없음(발견 #1의 수정에 포함).

### blockchain/robinhood-chain-settlement
- 추출한 고유 사실 주장 수: 19, 검증 19, 미검증 0
- 연 자료:
  - https://docs.robinhood.com/chain/connecting/ — 200 — Mainnet chain ID "4663", Testnet "46630", gas "ETH", "an Arbitrum Layer-2 Chain built on Ethereum, using Ethereum blobs for data availability" ✓.
  - https://docs.robinhood.com/chain/transaction-finality/ — 200 — "Soft Confirmation … Sub-second", "Posted to Ethereum … Minutes", "Ethereum Finality … ~13 minutes after posting", 인출 "7-day challenge period" ✓.
  - https://docs.robinhood.com/chain/bridging/ — 200 — "The deposit can be manually redeemed from the bridge interface within 7 days"(retryable ticket), "Wait for the 7-day challenge period … Claim your funds by submitting a transaction on Ethereum (L1). This final step is required and incurs L1 gas costs.", "A bridged ERC-20's contract address on Robinhood Chain differs from its address on Ethereum." ✓.
  - https://docs.robinhood.com/chain/protocol-contracts/ — 200 — Mainnet/Testnet, L1/L2, "Sequencer Inbox", "Delayed Inbox", "Outbox", "L1/L2 Gateway Router", "L1/L2 ERC20 Gateway" ✓.
  - https://docs.robinhood.com/chain/stock-tokens/ — 200 — "Robinhood Assets (Jersey) Limited", "tokenised debt securities", "do not grant investors any legal or beneficial rights in, or against the issuer of, those underlying securities", ERC-20 18 decimals, `uiMultiplier()`(ERC-8056), "Only Authorised Participants … may subscribe", "Monday 02:00 CET/CEST – Saturday 02:00 CET/CEST" ✓(excerpt 실재).
  - https://docs.robinhood.com/rhj — 200 — "Robinhood Assets (Jersey) Limited ('RHJ') is the issuer of Robinhood Stock Tokens … Issuer disclosures, including the Base Prospectus and Final Terms" ✓.
  - https://raw.githubusercontent.com/OffchainLabs/arbitrum-sdk/cbb96c6f…/packages/sdk/src/lib/message/ChildToParentMessageNitro.ts, ChildTransaction.ts — 200 — `diff` 동일. 241–249행 `status(): if (!sendRootConfirmed) return UNCONFIRMED; return (await this.hasExecuted(childProvider)) ? EXECUTED : CONFIRMED` ✓; 774–806행 `execute(): if (status !== CONFIRMED) throw …; const proof = await this.getOutboxProof(…); outbox.executeTransaction(proof, this.event.position, …, this.event.destination, …, this.event.callvalue, this.event.data, …)` ✓.
- CALC: 100→90/10 → 90/5/5(인출 중) → 90/5/0/5 ✓; 10×10¹⁸ ✓.
- 빠진 내용: 없음.

### ai/world-model-latent-planning
- 추출한 고유 사실 주장 수: 16, 검증 16, 미검증 0
- 연 자료:
  - https://arxiv.org/html/2603.19312v1 — 200 — "ℒ_LeWM ≜ ℒ_pred + λ SIGReg(Z)"(식 3), SIGReg가 등방 Gaussian 분포로 유도, 표현 차원 192(ViT-Tiny [CLS]), 환경 Two-Room·Reacher·Push-T·OGBench-Cube, "a single NVIDIA L40S GPU", 계획 "Horizon 5 action blocks, action block size 5 environment timesteps (frame-skip 5), the entire optimized action sequence is executed before replanning". 글 9절·PaperReading boundary(H=5 block×5=25 timestep 전체 실행) 전부 일치.
  - https://arxiv.org/abs/2506.09985 — 200 — "V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning"(2025-06-11), "post-training a latent action-conditioned world model, V-JEPA 2-AC" ✓.
  - https://arxiv.org/abs/2609.39235 — 200 — "The Planning Limits of Latent World Models"(Alrasheed, Azam, Akhtar; v1 2026-09-30), "a world model guides action selection reliably only when the goal lies within, or slightly beyond, the trajectory it imagines during planning", Meta-World·BridgeData V2 ✓.
  - https://raw.githubusercontent.com/lucas-maes/le-wm/8edfeb33…/jepa.py — 200 — 고정본 `diff` 동일. 87–107행 `# rollout predictor autoregressively … emb = torch.cat([emb, pred_emb], dim=1)` ✓; 112–124행 `cost = F.mse_loss(pred_emb[..., -1:, :], goal_emb[..., -1:, :].detach(), reduction="none").sum(dim=…)` ✓(excerpt `reduction="none"` 실재).
  - https://raw.githubusercontent.com/galilai-group/stable-worldmodel/21446f1e…/stable_worldmodel/planning/solver/cem.py — 200 — `diff` 동일. 215–231행 `torch.topk(costs, k=self.topk, dim=1, largest=False)` ✓; 244–253행 `batch_mean = topk_candidates.mean(dim=1); batch_var = topk_candidates.std(dim=1, correction=0)` ✓. provenance.json의 커밋 날짜 2026-10-02 ✓.
- CALC: 비용 (−2−2)²=16, (0−2)²=4, 4, 0 ✓; 0.8 시작 → 끝점 −1.2/0.8/0.8/2.8, 비용 10.24/1.44/1.44/0.64 ✓; 0.8×2=1.6, 2−1.6=0.4 ✓; elite 평균 [+1,0] ✓.
- 빠진 내용: 없음(Dreamer/TD-MPC 계열을 다루지 않지만 글 범위를 JEPA/LeWM으로 명시).

## 열지 못한 자료
| URL | 상태 | 대체 확인 |
|---|---|---|
| https://www.freertos.org/Documentation/01-FreeRTOS-quick-start/01-Beginners-guide/01-RTOS-fundamentals | 200이나 JS 렌더링(curl 본문 31자, WebFetch 제목만) | 본문 인용 검증 불가 → UNVERIFIED(발견 #9). FreeRTOS Reference Manual V10.0.0 PDF(200)와 tasks.c 원문으로 핵심 동작은 확인. |
| https://freertos.org/Real-time-embedded-RTOS-mutexes.html | 302 → …/02-Kernel/…/04-Mutexes (200, JS 렌더링) | 동일. 리다이렉트 목적지 URL로 교체 권장. |
| https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/ | 403(curl·WebFetch) | web.archive.org 2026-10-05 스냅샷 200으로 전문 확인(일치). |
| https://www.intel.com/content/dam/www/public/us/en/documents/research/2002-vol06-iss-2-intel-technology-journal.pdf | 403(curl) | web.archive.org 2025-06-15 스냅샷 200으로 10–11쪽 확인(일치). |
| https://www.intel.com/content/www/us/en/newsroom/tech101/manufacturing/how-silicon-die-become-chip-packages.html | 403(curl) | WebFetch 200(브라우저 UA)으로 확인(일치). |
| https://www.nxp.com/docs/en/user-guide/UM10204.pdf | 404(curl, 비브라우저 UA) | WebFetch 200으로 PDF 수신 후 pdftotext 대조(일치). |
| https://www.raspberrypi.com/documentation/pico-sdk/hardware.html | 403(curl) | WebFetch 200(일치). |
| https://www.itu.int/epublications/publication/itu-t-x-1711-2026-03-framework-of-quantum-key-distribution-qkd-protocols-in-qkd-networks | 200(존재 확인만, 전문 미열람) | 권고 목록 페이지(T-REC-X.1711)로 판·시행 상태 확인; 승인 일자(16일)는 UNVERIFIED. |

## 공용 파일 수정 목록
통합자가 위에서부터 순서대로 적용한다. 모든 old 문자열은 2026-10-09 기준 해당 파일에서 한 번만 나온다(`grep -cF`로 확인). registrations 파일은 merge 시 정본을 덮어쓰므로 article-evidence와 같은 변경을 함께 적는다.

### src/content/article-evidence.ts

1-a. (발견 1) EIP-7773 note
```
old: "note": "7732·7928의 예정 목록과 활성화 상태. 메인넷 적용 여부는 별도로 확인합니다. 확인일2026-10-04."
new: "note": "7732·7928의 예정 목록과 활성화 상태. 2026-10-09 기준 EIP-7773은 Review이고 메인넷 활성화 칸은 비어 있습니다. 메인넷 적용 여부는 별도로 확인합니다. 확인일 2026-10-09."
```
1-b. (발견 1) EIP-7732 note
```
old: 실행 검증의 시간 분리를 설명합니다. Review 상태의 제안입니다. 확인일2026-10-04."
new: 실행 검증의 시간 분리를 설명합니다. 2026-10-06에 Review에서 Last Call(마감 2026-11-01)로 바뀐 제안입니다. 확인일 2026-10-09."
```
1-c. (발견 1) EIP-7928 note
```
old: 인덱스와 검증 조건을 설명합니다. 제안의 성능 가능성과 실측은 구분합니다. 확인일2026-10-04."
new: 인덱스와 검증 조건을 설명합니다. 제안의 성능 가능성과 실측은 구분합니다. 2026-10-06부터 Last Call(마감 2026-11-01). 확인일 2026-10-09."
```
3. (발견 3) FIPS 203 label·note
```
old: "label": "FIPS 203 · Algorithm 18, Tables 2–3", "href": "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf", "note": "2024 최종 표준 §6·8.
new: "label": "FIPS 203 · Algorithm 18, Tables 1–3", "href": "https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf", "note": "2024 최종 표준 §6·8. 표 1(인쇄 15쪽) 복호 실패율 ML-KEM-768 2^−164.8, 표 2(인쇄 39쪽) k=3·η1=2·η2=2·du=10·dv=4.
```
11. (발견 11) SP 800-227 note
```
old: "note": "2025-09-18 최종 권고. KEM의 기능과
new: "note": "2025년 9월 최종 권고(NIST 게시 페이지는 월까지만 표기, 일자 미확인). KEM의 기능과
```
5. (발견 5) quantum-risk에 Gidney 2025 항목 추가 (NIST 항목 뒤)
```
old: "note": "2026-10-04 확인. 표준화 상태는 최종 FIPS와 후보 선정·표준 작성 중인 상태를 나눠 읽습니다."}],
new: "note": "2026-10-04 확인. 표준화 상태는 최종 FIPS와 후보 선정·표준 작성 중인 상태를 나눠 읽습니다."}, {"kind": "핵심 논문", "label": "Gidney · How to factor 2048 bit RSA integers with less than a million noisy qubits", "href": "https://arxiv.org/abs/2505.15917", "note": "2025-05-21 v1 초록을 2026-10-09 확인. 잡음 있는 물리 큐비트 100만 개 미만·1주 미만, 최근접 정사각 격자·게이트 오류율 0.1%·표면 부호 주기 1 µs·반응 시간 10 µs 가정의 추정이며 실제 인수분해 실행이 아닙니다."}],
```
6-a. (발견 6) switching label
```
old: "MIT OCW 6.012 Lecture 14, ‘CMOS’ (2005), 22–24쪽"
new: "MIT OCW 6.012 Lecture 14, ‘CMOS’ (2005), 22–25쪽"
```
6-b. (발견 6) switching note
```
old: 완전 주기당 CV²와 평균 전력식을 확인했다.
new: 완전 주기당 CV²(24쪽)와 평균 전력식 P_D=f·E_D(25쪽)를 확인했다.
```
7. (발견 7) interrupts note
```
old: "note": "DUI 0662A §4.2.6·§4.2.7, 인쇄 4-6·4-7쪽에서 주변 장치 요청 유지와
new: "note": "DUI 0662A §4.2.5–§4.2.7, 인쇄 4-5–4-7쪽에서 우선순위 레지스터, 주변 장치 요청 유지와
```
4. (발견 4) yield label
```
old: "MIT OCW 2.830J Lecture 10 Yield Modeling, 원본 6–7·14·17·30쪽"
new: "MIT OCW 2.830J Lecture 10 Yield Modeling, 원본 6–7·14·17·19·23·25·30쪽"
```
9-a. (발견 9) FreeRTOS fundamentals note
```
old: "note": "공식 가이드는 준비된 최고 우선순위 작업의 실행과 실시간 마감의 의미를 설명합니다."
new: "note": "공식 가이드는 준비된 최고 우선순위 작업의 실행과 실시간 마감의 의미를 설명합니다. 스크립트 렌더링 페이지라 2026-10-09 본문 문장을 자동 조회로 대조하지 못했습니다(서지·주소만 확인)."
```
9-b. (발견 9) FreeRTOS mutexes note
```
old: "note": "뮤텍스의 기본 우선순위 상속과 ISR에서 뮤텍스를 기다리지 않는 이유를 설명합니다."
new: "note": "뮤텍스의 기본 우선순위 상속과 ISR에서 뮤텍스를 기다리지 않는 이유를 설명합니다. 주소는 Documentation/02-Kernel/02-Kernel-features/02-Queues-mutexes-and-semaphores/04-Mutexes로 302 이동하며, 스크립트 렌더링이라 2026-10-09 본문 문장을 자동 조회로 대조하지 못했습니다(서지·주소만 확인). 동작은 tasks.c 원문으로 확인."
```
10. (발견 10) ITU-T X.1711 note
```
old: "note": "2026-03-16 승인·05-12 게시·in force를 확인했습니다.
new: "note": "2026년 3월판(03/26)·in force를 확인했습니다. 승인·게시 일자는 전문 페이지를 열지 못해 2026-10-09 재확인에서 확인하지 못했습니다.
```
12. (발견 12) ASML label
```
old: "label": "ASML, Six crucial steps in semiconductor manufacturing",
new: "label": "ASML, Six crucial steps in semiconductor manufacturing (2023-10-04 갱신)",
```

### src/content/article-learning.ts

6. (발견 6)
```
old: "evidenceScope": "공식 PDF 22–24쪽의 식과 에너지 장부를 직접 확인했습니다.
new: "evidenceScope": "공식 PDF 22–25쪽의 식과 에너지 장부를 직접 확인했습니다.
```
7. (발견 7)
```
old: "contribution": "DUI 0662A §4.2.6·§4.2.7, 인쇄 4-6·4-7쪽에서 주변 장치 요청 유지와
new: "contribution": "DUI 0662A §4.2.5–§4.2.7, 인쇄 4-5–4-7쪽에서 우선순위 레지스터, 주변 장치 요청 유지와
```
9-a. (발견 9)
```
old: "contribution": "공식 가이드는 준비된 최고 우선순위 작업의 실행과 실시간 마감의 의미를 설명합니다.",
new: "contribution": "공식 가이드는 준비된 최고 우선순위 작업의 실행과 실시간 마감의 의미를 설명합니다. 스크립트 렌더링 페이지라 본문 문장은 자동 조회로 대조하지 못했습니다(2026-10-09).",
```
9-b. (발견 9)
```
old: "contribution": "뮤텍스의 기본 우선순위 상속과 ISR에서 뮤텍스를 기다리지 않는 이유를 설명합니다.",
new: "contribution": "뮤텍스의 기본 우선순위 상속과 ISR에서 뮤텍스를 기다리지 않는 이유를 설명합니다. 스크립트 렌더링 페이지라 본문 문장은 자동 조회로 대조하지 못했습니다(2026-10-09).",
```

### src/content/registrations/web3-audit-current.ts
위 article-evidence의 1-a·1-b·1-c와 **같은 old→new 세 쌍**을 그대로 적용한다(세 old 문자열 모두 이 파일에서도 한 번씩만 나옴).

### src/content/registrations/root-audit-ml-kem-and-noisy-equations.ts
위 article-evidence의 3·11과 같은 old→new 두 쌍을 적용한다.

### src/content/registrations/root-audit-quantum-computing-and-cryptographic-risk.ts
이 파일은 배열 끝이 `}]};`라 쉼표 형태가 다르다. 다음 쌍을 적용한다(old는 한 번만 나옴).
```
old: 나눠 읽습니다."}]};
new: 나눠 읽습니다."}, {"kind": "핵심 논문", "label": "Gidney · How to factor 2048 bit RSA integers with less than a million noisy qubits", "href": "https://arxiv.org/abs/2505.15917", "note": "2025-05-21 v1 초록을 2026-10-09 확인. 잡음 있는 물리 큐비트 100만 개 미만·1주 미만, 최근접 정사각 격자·게이트 오류율 0.1%·표면 부호 주기 1 µs·반응 시간 10 µs 가정의 추정이며 실제 인수분해 실행이 아닙니다."}]};
```

### src/content/registrations/switching-energy-and-leakage.ts
위 6-a·6-b(article-evidence)를 적용하고, 학습 계약 쪽은 키에 따옴표가 없으므로 다음 쌍을 쓴다(각 old는 이 파일에서 한 번씩 나옴).
```
old: evidenceScope: "공식 PDF 22–24쪽의 식과 에너지 장부를 직접 확인했습니다.
new: evidenceScope: "공식 PDF 22–25쪽의 식과 에너지 장부를 직접 확인했습니다.
```

### src/content/registrations/yield-defect-and-packaging.ts
위 article-evidence의 4를 적용한다.

### src/content/registrations/scheduling-and-real-time.ts
위 article-learning의 9-a·9-b 쌍(`"contribution"` 형태)을 적용한다(두 old 모두 이 파일에서 한 번씩 나옴).

### src/content/registrations/qkd-current.ts
위 article-evidence의 10을 적용한다.
