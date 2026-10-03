# 공개 글 감사 범위 수정 — 2026-10-04

## 원인과 변경

기존 `audit:articles --strict`와 `audit:viz --strict`는 인자가 없으면 파일 시스템의 과거 디렉터리까지 검사했다. 공개 catalog의 article entry가 불러오지 않는 파일을 현재 화면의 실패로 세지 말라는 AGENTS.md 지시와 맞지 않았다. `--all-articles` 옵션은 이미 존재했으나 기본 실행과 범위가 달랐다.

- 두 명령의 전역 기본 범위를 공개 catalog에 등록된 entry와 그 소스 의존 파일로 통일했다. 별도 파일·디렉터리를 명시하면 공개되지 않은 파일도 계속 검사할 수 있다.
- 공용 source closure는 TypeScript AST로 runtime import, re-export, 문자열 리터럴 dynamic import를 따라간다. `@/pages/articles/...` 별칭과 `/src/...`도 처리한다. 주석·문자열 속 import처럼 보이는 내용, type-only import, raw/url/inline 소스 자산은 본문으로 포함하지 않는다.
- 본문 경계는 기본적으로 **src/pages/articles 하위**다. `@/components/ui`나 content registry를 모든 글에 합치지 않는다. Viz 검사만 `additionalSourceRoots: ["src/components/viz"]`를 추가해 실제로 불러온 공용 Viz를 함께 검사한다. 사용하지 않은 공용 Viz는 현재 공개 화면의 실패로 세지 않는다.
- 소재지·라우트나 문제의 심각도에 따른 허용 목록을 만들지 않았다. Math display 등 article 규칙과 SVG gradient/stroke 등의 Viz ERROR 규칙은 그대로다. REVIEW는 종전과 같이 사람이 확인할 후보이며 자동 오류라는 뜻이 아니다.

## 의미 있는 검증

`scripts/audit-public-scope.test.mjs`의 임시 Vite fixture로 실제 CLI를 실행했다. 네 테스트 모두 통과했다.

1. alias·re-export·literal lazy import·cycle을 추적한다. type/raw/주석/문자열/미사용 파일은 본문에서 제외하고 공용 Viz는 명시한 검사에만 포함한다.
2. 기본 article 감사가 `--all-articles`와 같은 공개 범위를 쓰며, alias로 불러온 실제 Math display 위반은 strict 실패로 잡는다.
3. 기본 Viz 감사는 미사용 파일을 제외하지만, lazy import의 gradient 오류와 실제 공용 Viz의 과도한 stroke를 strict 실패로 잡는다.
4. 공개되지 않은 파일도 명시적으로 지정하면 기존 위반을 strict 실패로 잡는다.

기존 `scripts/audit-learning-routes.test.mjs` 네 테스트도 통과했다. 공개 catalog 전체 경로·실제 소스·등록 범위·카테고리 간 매핑을 다시 확인했다.

## 실제 저장소 결과

- 공개 article contract: material 위반 **0**, 비차단 설명 힌트 **63**. `/tmp/article-contract-public-after.json`
- 공개 Viz: **ERROR 0**, **REVIEW 4,025**. `/tmp/viz-public-after.log`
- 공개 prose: 799개 중 새 review 실패 **0**. `/tmp/audit-scope-prose-after.log`. prose baseline을 갱신해서 통과시키지 않았다.
- 기존 `--all-articles`의 변경 전 결과는 article material 0/힌트 71, Viz ERROR 0/REVIEW 4,025였다. alias를 실제 본문으로 연결하면서 누락돼 있던 Viz가 같은 글에 포함되어 힌트 8개가 줄었다.
- 공용 closure의 변경 전·후를 799개 공개 경로에서 직접 비교했다. 추가 의존 파일이 생긴 경로는 이번 GPU4·AI5의 **9편뿐**이며 나머지 790편은 동일하다. 추가되는 파일도 article 트리의 NumericPath/ReviewPrompts/SourceApplication/codeRefs 네 종류다. `/tmp/audit-closure-impact.json`
- 별도 topology 검사는 진행 중인 본문 수정의 stale/missing fingerprint를 보고한다. 이를 자동 갱신하거나 무시하지 않았다. 최종 본문 검토 후 root가 해당 판단을 확정한다.

리터럴이 아닌 런타임 계산 경로와 번들러 전용 동적 glob은 이 정적 source closure의 대상이 아니다. 현재 공개 catalog entry와 실제 소스의 매핑은 Vite가 로드한 catalog로 검증한다.

- 최종 본문 반영 뒤 전역 article/Viz 감사를 재실행해 material 0, Viz ERROR 0/REVIEW 4,025를 재확인했다. `/tmp/article-contract-dod-final.json`, `/tmp/viz-dod-final.log`.
