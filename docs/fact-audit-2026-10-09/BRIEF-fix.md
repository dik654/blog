# 감사 원장 적용(수정) 브리프 · 2026-10-09

감사 원장(`<cluster>.md`)의 발견을 실제 글에 반영한다. 목적은 **틀린 것을 고치고, 빠진 것을 근거와 함께 채우는 것**이다.

## 판정별 조치

| 판정 | 조치 |
|---|---|
| WRONG · OUTDATED · CALC | 반드시 고친다. 원장이 제시한 1차 자료 인용문을 근거로 본문·용어·수치·연도를 바꾼다. 확인일을 적을 자리(`asOf`, note, 본문)가 있으면 2026-10-09로 갱신한다. |
| MISLEADING | 문장을 고쳐 오도를 없앤다. 삭제보다 조건·범위를 붙이는 쪽을 택한다. |
| LINK | href를 살아 있는 정확한 문서로 바꾸고, `excerpt`는 그 문서에 **실제로 있는 연속 문장**으로 교체한다. 원 URL이 죽었고 아카이브만 있으면 `web.archive.org` 주소를 쓰고 note에 "원 주소는 ... 리다이렉트/404라 YYYY-MM-DD 사본"을 적는다. 봇 차단(403)으로 못 연 자료는 원장의 2차 확인 결과를 따르고 note에 "자동 조회 불가, 서지 2차 확인"을 남긴다. |
| MISSING | 작은 것(연도·제도 이름·한 줄 조건·선행 자격·수식 한 개)은 해당 절에 바로 넣는다. 한 문단 이상이 필요한 것은 그 절의 `paragraphs`에 문단을 추가하되, **원장이 1차 자료로 확인한 사실만** 쓴다. 넣을 때는 teach-system 규칙(`~/.claude/skills/teach-system/SKILL.md`)을 따른다: 숫자·작은 사례를 이름보다 먼저, 식은 뜻을 붙인 뒤 사례를 대입, 관할권·확인일 명시, 새 용어는 첫 등장에서 설명. 글 전체를 다시 써야 하는 큰 공백은 고치지 말고 원장 끝에 `## 후속 작업` 으로 남긴다. |
| UNVERIFIED | 본문에 "확인하지 못함"을 숨기지 않는다. note나 본문에 범위를 적는다(기존 관행: "서지 정보만 확인"). |
| 내부 불일치 | 본문·`numericCase`·`algorithm`·`review`·학습 계약이 같은 수·같은 이름을 쓰게 맞춘다. 원칙은 본문이 정본이다. |

## 반드시 지킬 것

1. **공용 대형 파일은 직접 수정하지 않는다**: `src/content/article-evidence.ts`, `src/content/article-learning.ts`, `src/content/knowledge-graph.ts`, `src/content/editorial-ownership.ts`, `src/content/article-topology-decisions.ts`, `src/content/*/articles.ts`, `src/content/*/index.ts`. 여러 에이전트가 동시에 쓰면 서로 덮어쓴다. 대신 원장 끝에 `## 공용 파일 수정 목록` 절을 만들고, 파일별로 **정확한 old 문자열 → new 문자열** 쌍을 코드 블록으로 적는다(old는 그 파일에 한 번만 나오는 충분히 긴 조각). 통합자가 순서대로 적용한다.
2. 글 본문 파일(`src/pages/articles/...`)만 직접 고친다. 자기 cluster 목록 밖의 파일은 손대지 않는다.
3. 데이터 객체의 타입 제약을 지킨다: `sources`는 정확히 2개(추가 출처는 공용 파일 목록의 `article-evidence.ts`에 올린다), `paragraphs`는 2개 이상, `review`는 3개. `String.raw`·따옴표·쉼표를 깨지 않는다.
4. `(가정)` 표기 규칙: 설명용 수치는 `(가정)`, 실제 통계는 출처·연도.
5. 끝나면 검증: 자기가 고친 글의 route마다 `bash scripts/check-article.sh <cat>/<slug>` (prose-readability의 "재검토 필요"는 다른 글 것이면 무시), `npx eslint <고친 파일들>`. `tsc`는 통합자가 돌린다. `git` 명령은 쓰지 않는다.
6. 원장 파일 맨 위에 `## 적용 결과` 절을 추가해 발견 번호별로 `적용 / 공용파일 목록으로 이관 / 후속 작업 / 보류(이유)` 를 적는다.
