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

## 다음에 할 수 있는 일
- 각 원장 `## 후속 작업`(글 전체를 다시 써야 하는 공백).
- 위 Viz 높이·흔들림 기준 위반은 별도 회차로 정리.
