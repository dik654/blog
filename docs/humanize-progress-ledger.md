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
