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

## 다음에 할 수 있는 일
- 보류로 남은 후속 항목(각 원장 `## 후속 작업 결과`의 보류 줄): 남아시아 식민 이전 직물·해상 교역 규모(A #37 일부), A 기타 목록 10건(마케팅 보드, 원죄, petrodollar 연결, PNA VDS, 차액지대, TiVA 지표명, Donaldson, 동산 노예제, Pomeranz, Englund)과 컨테이너 Ideal X·ISO 668, FRA 결제식(E1), 커버드콜 글의 금감원 원 주소 교체와 상품명 변경 조치(E3 — fss.or.kr 점검 종료 후), SNIA PTS 3.1절(D1), KRX 실물인수도 상품 목록(E2).
- 기존 Viz 높이(모바일 844px 초과)·장면 전환 흔들림 기준 위반 약 225건.
