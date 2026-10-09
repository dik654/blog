# 2026-10-09 정본 감사·개선 세션 — 최종 상태

**완료·커밋됨.** 이 디렉터리는 감사 기록이다. 남은 일은 각 원장의 `## 후속 작업` 절에만 있다.

## 한 일
- 10월 신규 정본 248편을 10개 원장(A·B1·B2·C·D1·E1·E2·E3·F·G)으로 1차 자료 대조, 발견 308건을 `BRIEF-fix.md` 기준으로 글 본문에 적용. 공용 파일 수정은 `apply-shared.py --mirror`로 원장의 old→new를 적용하고 `src/content/registrations/*.ts`에도 같은 치환을 넣어 병합 때 되돌아가지 않게 했다.
- 기계 생성 수식 주석(`formula-clusters/BRIEF-formulas.md` 1차 마커·2차 범용 템플릿 문구)을 약 480개 파일에서 재작성. 각 cluster 원장의 `검토 필요` 항목이 판단 근거다.
- cloud `cloud-kubernetes` 소분류(03단계)와 gpu `hw-ai-cluster` 소분류 분리, 불필요한 수식·메타 문구 제거(`structure-plan-cloud-k8s.md`). 읽기 순서 확인: `node scripts/print-reading-order.mjs cloud gpu`.

## 검증
- 감사 13종(learning·graph·formula·calculations·pseudocode·articles·topology·reading·order·prose·korean·runtime·hw-cloud-teach), ESLint, tsc, GitHub Pages build(7,350 modules) 통과. 로컬 `tsc -b`는 기본 힙에서 메모리가 부족하므로 `NODE_OPTIONS=--max-old-space-size=12288`로 돌린다(CI 러너는 기본값으로 통과해 왔다).
- 저장소 전체 KaTeX 식 7,172개를 `throwOnError`로 파싱해 오류 0. 브라우저 점검에서 나온 실제 결함을 고쳤다: `\text{}` 안 `_`·`^` 4곳(lstm-timeseries 2, stark-theory 2), `\left\lfloor…\right\rfloor` 안 underbrace가 KaTeX SVG 경로를 깨뜨리는 문제 4곳(uniswap-v3·bplus-tree·helios-consensus·helios-update → `\Bigl`/`\biggl` 고정 크기 괄호).
- Playwright로 변경 route 약 440개를 1,440px·390px에서 점검. KaTeX 오류·console 오류·가로 넘침은 0으로 정리했다. 기존부터 있던 결함 두 건도 함께 고쳤다: 파생상품 두 글의 학습 계약에 똑같이 두 번 들어간 복습 질문(React 중복 key 경고), `FlowRail` 카드가 화살표로 이어진 긴 토큰 때문에 모바일 폭을 넘던 문제(`min-w-0`·`overflow-wrap:anywhere`).
- 남은 실패는 모두 이번 변경과 무관한 기존 Viz 기준이다: 모바일에서 Viz 프레임이 844px보다 큼(약 150건), 장면 전환 때 프레임·버튼 높이 변화(약 75건). 이번 세션의 Viz 파일 수정은 macro 3개 Viz의 출처 문구뿐이다.

## 후속 작업 처리 (같은 날 2차, `BRIEF-followup.md`)
- 원장 7개(A·B2·D1·E1·E2·E3·F)의 `## 후속 작업` 약 53항목을 8개 묶음으로 나눠 1차 자료를 직접 열고 반영했다. 각 원장 끝 `## 후속 작업 결과`에 항목별 근거 URL·인용 위치·보류 사유가 있다. 공용 파일 수정 71쌍은 `apply-shared.py --section="후속 공용 파일 수정 목록…"`으로 적용했다.
- 반영 중 기존 본문의 오류도 정정했다: KRX 레버리지 ETF LP 괴리율 3%/6%→현행 2%/5%(투자유의 4%/10%), NYMEX 인수 통지 순서(T+1 15시 통지→T+3 시설 지정), CBOT 4센트 할인 조건(두 기준 모두 해당할 때, 하나면 2센트), Slurm DRAIN 예시 출력(실제 문자열 `gpu count too low (7 < 8)`), 깃대 반례 귀속(Bromberger, Salmon 1989 47쪽).
- 새 절: `firms/why-firms-exist` 13절 "전용 설비가 필요하면 밖의 비용 b가 4에서 5로 오른다"(Williamson 1979 원문 대조, 14절로 밀림, topology 결정 갱신).
- 등록 모듈 노후화(F #7): `src/content/registrations/*.ts`가 정본보다 낡아 `merge-registrations.mjs --all`이 약 26,000줄을 되돌리는 상태였다. `scripts/sync-registrations-from-canonical.mjs`로 정본에서 다시 만들고, sync→merge가 정본을 바꾸지 않는 고정점임을 확인했다. merge의 `null`→`"null"` 버그(LEDGER 행 중복)도 고쳤다. **정본 공용 파일을 직접 고친 뒤에는 이 sync를 한 번 돌린다.**

## 3차 후속 작업 (2026-10-10, 보류분·Viz 기준)
- 2차에서 보류한 항목을 다시 1차 자료로 열어 반영했다(각 원장 끝 `## 후속 작업 결과 (3차…)`). 적용: 남아시아 식민 이전 직물·해상 교역(Riello & Roy 2009 서론·Prakash 장, OAPEN 사본), Donaldson 2018 실질소득 문장, Pomeranz 2000 서론, Englund 2011 원시 쐐기문자 회계, 1833년 노예제폐지법 제정본·1883년 인도 이민법의 동산 노예제 vs 계약노동, Ghana Cocoa Board 법령·연차보고서의 마케팅 보드, Eichengreen–Hausmann 1999 '원죄'와 FRH 중남미 부채, IMF 1975 연차보고서의 oil facility(petrodollar-recycling 학습계약 연결), PNA VDS 관리제도 원문, Ricardo 1817 2장 차액지대·1801년 인클로저 통합법, OECD TiVA 2025 지표 안내(EXGR_DVA·DDC·IDC·RIM·FVA), Port Houston의 Ideal X·ISO 668:2020 범위, 연준 Trading Manual §4315.1의 FRA 결제식(ExplainedFormula 1개), KRX 파생상품시장 업무규정 현행 조문의 최종결제 방식(통화선물만 실물인수도 — KRX 영문 안내 페이지의 "10년 국채선물 실물인도"는 현행 규정과 어긋남을 본문에 명시), 운용사 공시(미래에셋 2024-09-19·삼성 2024-09-23)의 커버드콜 ETF 종목명 변경, SNIA PTS 2.0.2 원문(2.1.24 Steady State 정의·측정 창·WIPC). 공용 파일 수정 18쌍은 `apply-shared.py --section=…(3차…)`으로 적용하고 sync를 돌렸다.
- 아직 보류: 금감원 커버드콜 소비자경보의 원 주소(fss.or.kr 점검이 2026-10-10 24:00까지라 Wayback에도 사본 없음 — 재개 뒤 nttId 확보해 citeKey 11·evidence href 교체), ISO 668 치수 표(OBP 약관 동의 필요), Englund 1998·Archaic Bookkeeping(CDLI 링크 404), 1947년 Gold Coast/Nigeria 마케팅 보드 조례 원문.
- Viz 기준 위반 238건(155 route)을 전부 정리했다. (1) 모바일 "화면보다 큰 프레임" 192건은 모두 공용 `ArticleLessonFlowViz` 한 컴포넌트였다 — `src/index.css` 136~154행이 모바일 figure·canvas를 자연 높이로 푸는 설계라 내부 스크롤이 아니라 레이아웃 압축으로 풀었다(개요 지도 → 한 줄 가로 스트립 + 선택 단계 캡션, 스토리보드 5컷 → 모바일 한 컷 보기, 형태 컷 한 줄 배치; 전부 `max-sm:` 변형이라 데스크톱 스크린샷 9장 바이트 동일). 390px에서 닫힘 412~555px·펼침 최대 840px. 모바일 조작부를 `sticky bottom-0`로 바꾸고 `ArticleLearningContract.tsx`의 wrapper를 `overflow-hidden`→`overflow-clip`으로 바꿔 sticky 스크롤포트 문제를 없앴다. (2) 장면 전환 흔들림 83건 중 수천 px짜리는 sweep의 측정 결함이었다: `html { scroll-behavior: smooth }` 때문에 `scrollIntoView` 직후 좌표를 읽었고, 모바일에서 `display:none`인 데스크톱 장면 버튼(aria-pressed)의 0 좌표를 쟀다. `scripts/sweep-routes.mjs`를 즉시 스크롤+정착 대기, 보이는 컨트롤만 측정, "다음" 버튼으로 장면 전환하도록 고쳤다(`--out`·`--base` 값이 route로 오인되던 결함도 수정). 남은 진짜 흔들림(31~268px, 20 route·37 Viz 파일)은 장면마다 길이가 다른 설명 문단·제목·수치 블록에 390·320px 실측 최댓값의 `min-h`를 주어 없앴다(`min-h-[320값] min-[390px]:min-h-[390값] sm:min-h-0` 관례; 공용 `AnimatedSceneControls`의 모바일 라벨 2줄 접힘은 canvas에서 `[&_[data-viz-mobile-controls]>p]:min-h-[3rem]`으로 고정).
- 검증: 감사 13종·ESLint·tsc·production build(7,350 modules) 통과, 파생상품 데이터 파일 KaTeX 98식 오류 0, 변경 route 70개 sweep 데스크톱·모바일 실패 0(dev 서버 dep 캐시 504는 재시작으로 해소). topology 지문 42건은 HEAD worktree와 구조 필드(개념·단계·파일·절·식·Viz 수)가 동일함을 확인하고 갱신했다. prose baseline은 `firms/why-firms-exist` 점수 8 그대로(지문만 갱신).

## 다음에 할 수 있는 일
- 금감원 커버드콜 소비자경보 원 주소 교체(fss.or.kr 재개 뒤), ISO 668 치수 표(OBP 약관 동의 뒤), Englund 1998·Archaic Bookkeeping 원문, 1947년 마케팅 보드 조례 원문.
- 320px 폭에서 펼친 학습 흐름 Viz가 568px 뷰포트보다 큰 것(804~966px)은 텍스트 폭 한계로 남겼다. 조작부는 sticky라 닿는다.
