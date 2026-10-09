# 수식 주석 재작성 브리프 (2026-10-09)

## 문제

`scripts/migrate-formula-annotations.mjs`가 `ExplainedFormula`의 `annotatedFormula`·`operations`를 기계적으로 생성해 독자에게 보이는 주석이 뜻 없는 문구로 남아 있다. 저장소 전체 315개 파일. 독자 화면에는 식 아래 underbrace 라벨과 "연산 주석" 카드로 그대로 노출된다.

기계 생성 흔적(이 문구가 있으면 전부 재작성 대상):

- `…이(가) 식의 결과에 기여하는 방식을 계산합니다.`
- `오른쪽 항으로 결과 계산`, `입력에서 결과 계산`, `<용어> 계산`(예: `fault bound 계산`)
- `왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.`
- `이 식의 입력을 결합해 필요한 결과를 계산합니다.`
- `\underbrace{\underbrace{X}_{...}}_{...}` 같은 중첩 underbrace(같은 라벨 두 번)
- annotation 배열 끝에 붙은 잘린 조각(`"둘 다"`, 문장 중간에서 끊긴 줄)
- 범용 문구만 있는 것: `index마다 만든 기여를 지정 범위 전체에 누적합니다`, `분자에 둔 관심량을 분모의 기준량으로 정규화합니다`, `계산한 양을 허용 경계와 비교해 상태를 판정합니다` 등. 식의 도메인 뜻이 전혀 없으면 재작성, 도메인 뜻이 이미 있으면 유지.

## 기준 (teach-system rule 13, `~/.claude/skills/teach-system/references/formula-meaning.md`)

표시된 식은 라벨이 달린 그림이어야 한다. 각 중요한 구간(항·분자·분모·괄호·연산)에 **이 시스템에서의 뜻**을 붙이고, 바로 아래에서 글의 수치 사례를 대입한다.

나쁨: `\underbrace{2f+1}_{\text{fault bound 계산}}` + "fault bound이(가) 식의 결과에 기여하는 방식을 계산합니다."
좋음: `\underbrace{2f+1}_{\text{정직한 replica 둘이 반드시 겹치는 최소 수}}` + annotation `["3f+1 중 f가 거짓말해도", "두 quorum이 정직한 하나를 공유하도록 2f+1을 모읍니다", "n=4, f=1이면 3개"]`

## 작업 규칙

1. 글을 먼저 읽는다. 식 앞뒤 문단, `question`·`idea`·`terms`·`interpretation`·`assumptions`에 이미 적힌 수치 사례와 용어를 주석에 재사용한다. 새 사실을 지어내지 않는다.
2. 고치는 prop은 `annotatedFormula`, `operations`(expression·annotation), 그리고 `terms[].name`이 뜻 없는 경우에 한해 `terms`. `formula`·`question`·`idea`·`interpretation`·`assumptions`·본문 prose는 바꾸지 않는다(기계 문구가 들어 있을 때만 예외).
3. `operations[].expression`은 `formula`에 실제로 있는 조각을 그대로 쓴다(`String.raw`). 하나의 연산당 annotation은 1~3줄, 한 줄 34자 이내(화면 폭). 같은 식 안에서 같은 조각을 두 번 주석하지 않는다.
4. `annotatedFormula`의 underbrace 라벨은 `\text{…}` 안에 짧게(12자 안팎). 긴 설명은 `operations.annotation`에 둔다. 중첩 underbrace는 한 겹으로 편다.
5. KaTeX가 깨지지 않게 한다: 중괄호 짝, `\text{}` 안 특수문자, `String.raw` 유지. TSX 문법을 깨지 않는다(한 줄 JSX 파일이 많다).
6. 자기 cluster 파일 외에는 손대지 않는다. 다른 에이전트가 동시에 다른 파일을 고치고 있으니 저장소 전체 포매터·`git` 명령을 실행하지 않는다.
7. 끝나면 검증:
   - `grep -nE '이\(가\) 식의 결과에|오른쪽 항으로 결과 계산|입력에서 결과 계산|왼쪽 결과를 오른쪽의 실제 항으로|이 식의 입력을 결합해|\\underbrace\{\\underbrace\{|"둘 다"' <cluster 파일들>` → 0건
   - `node scripts/audit-formula-annotations.mjs --strict --require-explicit` 통과
   - `npx eslint <cluster 파일들>` 0 error
   - `npx tsc -b --noEmit` — 자기 파일에서 난 오류만 고친다. 다른 파일의 오류는 원장에 적고 넘어간다.
8. 원장 `docs/fact-audit-2026-10-09/formula-clusters/<cluster>-ledger.md`: 파일별 재작성한 식 수, 대표 before/after 1개, 판단이 어려웠던 식(도메인 뜻을 확신하지 못한 것)은 `검토 필요`로 따로 적는다.

## 2차: 범용 템플릿 문구 (2026-10-09 추가)

기계 마커는 0건이 됐지만 아래 범용 문구만으로 된 주석이 144개 파일에 남아 있다. 이 문구 자체가 주석의 전부(라벨이거나 annotation 첫 줄)이면 재작성한다. 같은 연산에 이미 도메인 문장이 붙어 있으면 범용 줄만 도메인 문장으로 바꾸거나 지운다.

- 라벨: `판정 조건 결합`, `경계 후보 선택`, `기준량당 비율`, `허용 경계 판정`
- annotation: `필요한 gate가 모두 참일 때만…`, `허용 후보 중 목적에 맞는 경계값을 선택…`, `분자에 둔 관심량을 분모의 기준량으로 정규화…`, `계산한 양을 허용 경계와 비교해 상태를 판정…`

검증 grep: `grep -nE '판정 조건 결합|경계 후보 선택|기준량당 비율|허용 경계 판정|필요한 gate가 모두 참일 때만|목적에 맞는 경계값을 선택|분자에 둔 관심량을 분모의 기준량으로|계산한 양을 허용 경계와 비교해' <files>` → 0건. KaTeX `\text{}` 안에 그리스 문자·`^`·`_`·첨자 숫자를 넣지 않는다(렌더 실패). 모든 expression은 formula의 실제 조각과 일치해야 한다.
