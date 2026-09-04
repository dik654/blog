# 블로그 전체 humanize-korean 진행 ledger

`docs/npu-value-capture-series-status.md`와 별개 트랙. im-not-ai(`/Users/dylan/code/im-not-ai`)의
humanize-korean 파이프라인으로 블로그 전체 아티클의 AI 티 문체를 정리하는 다회차 프로그램이다.

## 실제 규모 (2026-09-04 확인)

- `src/content/*/index.ts` 등록 기준 아티클(component import) **604개**
- 그런데 각 아티클은 조립 파일(.tsx) + 섹션 서브컴포넌트(.tsx, `Overview.tsx`/`KVFundamentals.tsx` 등)로
  쪼개져 있어, 실제 프로즈가 들어있는 **.tsx 파일 총 3,014개** (viz/·codebase/ 서브디렉터리 제외)
  — 카테고리별: ai 1047 · blockchain 1013 · ethereum 382 · tee 138 · gpu 128 · p2p 118 ·
  isms-aml 116 · hw 53 · filecoin 10 · crypto 9
- 처음 가정했던 "604개 아티클"보다 실제 작업 단위가 훨씬 크다. 배치 계획은 이 3,014 기준으로 다시 짠다.

## 파이프라인 (검증 완료)

1. `python3 scripts/humanize_extract.py --list-file <배치 파일목록.txt> --out-dir <im-not-ai>/_workspace/<run_id>`
   — `<p>...</p>` 중 JSX 표현식·중첩 태그가 없는 순수 텍스트 문단만 안전하게 추출(코드 인용·Link가 섞인 문단은
   건너뛰고 수동 처리로 남김). `manifest.json` + `01_input.txt` 생성.
2. `cd <im-not-ai> && python3 scripts/prepare_monolith_input.py --run-dir <run_id> --genre blog`
   — route_hint 산출.
3. `Agent(subagent_type="humanize-monolith", ...)` 로 실제 윤문(경로에 따라 diagnostician·finalizer 추가).
   프롬프트에 마커(`[[F{n}-P{n}]]`) 보존을 명시하고 완료 후 스스로 grep으로 개수 검증하게 지시.
4. `python3 <im-not-ai>/scripts/verify_gates.py --before .../01_input.txt --after .../final.md --genre blog`
   — 결정적 게이트. exit 0 이 아니면 적용하지 않는다.
5. `python3 scripts/humanize_apply.py --manifest ... --final ... --dry-run` 로 먼저 확인 → 문제 없으면
   `--dry-run` 빼고 재실행. 원본 raw 조각이 파일에 정확히 1번 나오지 않으면 자동으로 건너뛰고 경고(안전 실패).
6. `node scripts/audit-prose-readability.mjs --strict --route=<cat>/<slug> [...]` + `npx eslint <files>` +
   `npx tsc -b --noEmit` 로 최종 확인 후 커밋.

## 완료된 배치

| 배치 | 파일 | 문단 | 결과 | 커밋 |
|---|---|---|---|---|
| test (0) | gpu 5개 아티클(assembly만, 실제 문단은 2개 파일에만 있었음) | 46 추출 | 등급 A · 변경률 1.4% · 게이트 OK | `729448a5` |
| 2a·2b·2c | crypto(9)+filecoin(10)+hw(53) = 72개 파일, 3개 서브배치(24개씩) | 178 추출 → 119 반영 | 등급 A×3 · 게이트 OK(2b는 golden 각주 오탐 확인 후 진행) | `d79bd506`, `b5879fba` |
| 3(aa~ae) | p2p(118개 파일), 5개 서브배치(24개씩) | 201 추출 → 140 반영 | 등급 A×5 · 게이트 OK | `d074d157` |
| 4(aa~ae) | isms-aml(116개 파일), 5개 서브배치(24개씩) | 250 추출 → 92 반영 | 등급 A×5 · 게이트 OK(ac는 P1 WARN을 원인 확인 후 진행) | `df3b4e0c` |
| 5(aa~af) | gpu 나머지(125개 파일), 6개 서브배치(24개씩, aa·af는 heavy로 finalize까지) | 390 추출 → 245 반영 | 등급 A×6 · 게이트 OK. finalize가 aa에서 실제 과윤문(hedge→단정) 4건 잡아 롤백 | `ce33d9bc` |

**gpu 카테고리 완료**(Gemmini 신규 1편 + 128개 파일 전부).

| 6(aa~af) | tee(138개 파일), 6개 서브배치(24개씩) | 116 추출 → 15 반영 | 등급 A×6 · 게이트 OK. 대부분 "인사이트: X" 헤딩 라벨이라 실질 산문이 적었음 | `47868be5` |

**tee 카테고리 완료**.

| 7(wave1 aa~ah) | ethereum(192개 파일), 8개 서브배치 | 251 추출 → 92 반영 | 등급 A×8 · 게이트 OK | `dfc7c6cf` |
| 7(wave2 ai~ap) | ethereum(190개 파일), 8개 서브배치(light 5·heavy 3) | 452 추출 → 225 반영 | 등급 A×8 · heavy 3개 finalize 실결함 발견·수정 | `7ed88ac0` |

**ethereum 카테고리 완료**(382개 파일 전부). heavy 경로 finalize가 실제로 잡은 것들:
- aj: 직접 인용 「놓친 reward = 동일한 penalty」의 따옴표·"=" 소실 복원(golden 게이트가 실제 위반이었던 유일한 사례)
- al: hedge 약화 2건 + 없던 인과 승격 1건 + 없던 한정 주입 1건 롤백
- an: hedge→단정 과윤문 5건 + 대구 해체 중 "active peer" 용어 누락 1건 복원

prose-readability에서 2건(prysm-epoch-processing·prysm-gossipsub)이 18→20으로 소폭 상승 —
E-1(장문 분리) 자체가 총 글자 수는 거의 안 줄이면서 문장 수만 늘려 이미 알려진 장문 문단이
압축 임계값을 살짝 더 넘은 경우. 실제 diff로 정보 손실 없음을 확인 후 진행(AI 티 축소 vs
문단 압축 두 지표의 트레이드오프로 기록).

**2026-09-04 세션 누적**: crypto·filecoin·hw·p2p·isms-aml·gpu·tee·ethereum 8개 카테고리
(951개 파일) + Gemmini 신규 아티클 1편 완료. 남은 카테고리(섹션 파일 포함):
blockchain(1013), ai(1047) — 총 2,060개 파일.

| 8(wave1 aa~ah) | blockchain(192개 파일), 8개 서브배치(light 5·standard 1·heavy 2) | 641 추출 → 129 반영 | 등급 A×8 · 게이트 WARN 2건 조사 후 진행 | `7a801fa6` |

**blockchain wave1 완료**(192/1013). heavy 경로 finalize가 실제로 잡은 것들:
- af: 없던 단정("재현되는 지점에서야 같은 block") 주입 1건 + 없던 검증 순서 규정 1건 +
  검증 대상↔수단 격 전환 1건 롤백
- ab: hedge→단정 과윤문 4건 + 없던 인과 메커니즘 주입 1건("원인은 그대로 남습니다") +
  보장→약화 표현 1건 롤백, 윤문이 새로 만든 C-11 쉼표 1건도 제거

구조 게이트 WARN 2건: ae는 P1(ending_comma_rate 미수렴)이 열거·선택지 쉼표 오탐으로 확인,
af는 P2(C-8 대구 5→0 전멸)가 "A가 아니라 B"→"A가 아닙니다. B입니다" 재구성일 뿐 대조 의미
보존으로 확인. prose-readability는 cometbft-types 22→24 1건만 진짜 변동(E-1 문장분리로
260자 임계 초과, 정보 손실 없음 확인) — 나머지 17건은 fingerprint drift.

| 8(wave2 ai~ap) | blockchain(192개 파일), 8개 서브배치(light 5·standard 3) | 362 추출 → 124 반영 | 등급 A×8 · 게이트 golden FAIL 2건 모두 오탐 확인 후 진행 | `3a6e5a3c` |

**blockchain wave2 완료**(384/1013). golden FAIL 2건은 footnote_anchor 검사기가 수학 튜플
표기(`z=(1,3,12,4)`)와 인용연도 표기(`DH(1976)`)를 각주 마커로 오인식한 false positive —
final.md에서 원형 보존 확인 후 진행. prose-readability는 5건 각 +2(da-theory·dag-consensus·
cosmos-sdk·consensus-mechanisms·cuda-basics) 소폭 상승, 전부 wave1과 동일한 E-1 문장분리
패턴으로 정보 손실 없음 확인.

| 8(wave3 aq~ax) | blockchain(192개 파일), 8개 서브배치(light 4·standard 4) | 636 추출 → 138 반영 | 등급 A×8 · aq는 finalize로 진단 오류 발견·수정 | `146de577` |

**blockchain wave3 완료**(576/1013). aq는 이번 세션 중 유일하게 "게이트 지표가 실제로 미개선"으로
나온 사례 — 진단서가 정량 게이트 ★S1 트리거(ending_comma_rate)의 원인을 A-13으로 잘못 짚어
monolith가 진짜 C-11(원문 19건)을 방치했고, A-13 분절 과정에서 C-11을 3건 더 만들어 z-score가
+4.41→+4.67로 악화. finalizer가 metrics.py 정규식을 직접 대조해 원인 재확정 후 19건 국소
보정(인간 baseline 수준까지만, 과교정 방지) + 원문에 없던 "흔히 말하는" 주장 1건 롤백.
golden FAIL 1건(at)은 `(p^k−1)/r` 수학 표기 오탐으로 확인. prose-readability 4건 +2 소폭
상승은 wave1·2와 동일한 E-1 패턴.

남은 blockchain: 437개 파일(19개 서브배치, wave4부터 계속).

`gpu-arch-hopper.tsx` 같은 조립 파일은 자체 `<p>`가 없고 프로즈가 하위 섹션 파일에 있다는 걸
test 배치에서 확인했다 — 그래서 배치2부터는 `find ... -not -path "*/viz/*" -not -path
"*/codebase/*"`로 섹션 파일까지 포함한 전체 목록(3,014개)에서 뽑는다.

**배치 크기 교훈**: 파일 24개 = 문단 30~60개 = 입력 15~25KB 가 light/standard 단일 콜에 안전한
크기였다. 72개를 한 번에 넣었더니 55KB로 커져 heavy/청킹 영역에 들어갔을 것 — **24개/서브배치**로
쪼개는 걸 기본값으로 삼는다.

**prose-readability 재검토 절차(매 배치 필수)**: `--refresh-baseline` 하기 전에 반드시
`git stash`로 편집 전 점수와 대조해 점수가 늘지 않았는지(fingerprint drift인지 진짜 회귀인지)
확인한다. 점수가 그대로면 안전하게 refresh, 늘었으면 원인 파악 후에만 진행한다.

## 다음 세션에서 이어가는 법

1. `find src/pages/articles -iname "*.tsx" -not -path "*/viz/*" -not -path "*/codebase/*" | sort` 로
   전체 목록을 다시 뽑고, 이 표에서 아직 처리 안 된 파일만 걸러 다음 배치 목록(`.txt`)을 만든다.
2. 위 "파이프라인" 6단계를 그대로 반복한다.
3. 매 배치 끝에 이 표에 행을 추가하고 커밋한다.
4. `feat/npu-gemmini-series` 브랜치에서 계속 작업하거나, humanize 전용 브랜치로 분리해도 된다
   (사용자와 상의).
