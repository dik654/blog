# 후속 작업 브리프 · 2026-10-09

각 원장 끝의 `## 후속 작업` 항목을 실제로 처리한다. 대부분 "1차 자료를 직접 열어 확인한 뒤 본문에 넣는" 일이다.
기본 규칙은 `BRIEF-fix.md`를 그대로 따른다(판정별 조치, 공용 파일 직접 수정 금지, `(가정)` 표기, sources 2개 고정 등).

## 처리 순서

1. 항목마다 1차 자료를 실제로 연다(WebFetch/WebSearch). 법령은 law.go.kr·eur-lex, 규정은 거래소·감독기관 원문,
   논문은 출판사·JSTOR·저자 PDF·archive.org. PDF는 `curl -L -o <scratch>/x.pdf` 후 `pdftotext`, 스캔본은
   `pdftoppm -r 150 -png`로 이미지를 만들어 Read로 읽는다. 봇 차단(403·Cloudflare)이면 Wayback(`web.archive.org/web/2026*/<url>`)
   → 다른 공식 사본(CFTC 제출본, 정부 관보, 기관 연차보고서) 순으로 찾는다.
2. 원문에서 확인한 **연속 문장**만 인용·근거로 쓴다. 확인하지 못하면 본문에 넣지 않고, 이미 있는 "확인하지 않았습니다"
   범위 문장도 그대로 둔다. 2차 보도만으로는 넣지 않는다.
3. 본문을 쓰거나 고칠 때는 teach-system 규칙(`~/.claude/skills/teach-system/SKILL.md`)을 따른다: 숫자·작은 사례를
   이름보다 먼저, 새 용어는 첫 등장에서 설명, 관할·확인일 명시, 한 문단 한 생각. 수식은 실제 판단 규칙일 때만 쓰고,
   쓰면 `ExplainedFormula`로 각 항에 뜻을 붙이고 글의 숫자를 대입한다(`\text{}` 안에 `_`·`^`·그리스 문자 금지).
   식이 필요 없는 내용은 문장이나 작은 표로 쓴다.
4. 새 출처는 글의 `sources`(2개 고정)를 바꾸지 말고 `article-evidence.ts`에 올릴 항목으로 원장에 적는다.

## 공용 파일

`src/content/article-evidence.ts`·`article-learning.ts`·`knowledge-graph.ts`·`editorial-ownership.ts`·`*/articles.ts`와
`src/content/registrations/*.ts`는 **직접 고치지 않는다**. 원장 끝에 `## 후속 공용 파일 수정 목록` 절을 만들고
`### <파일 경로>` 아래에 old/new 쌍을 코드 블록으로 적는다(old는 그 파일에 한 번만 나오는 충분히 긴 조각, new에는
지시문이 아니라 실제로 들어갈 텍스트만). 배열에 항목을 추가할 때는 old를 바로 앞 항목의 끝 조각으로 잡고 new에 그 조각+새 항목을 쓴다.

## 끝나면

- 원장에 `## 후속 작업 결과` 절을 추가해 항목마다 `적용(근거 URL·인용 위치) / 공용파일 목록으로 이관 / 보류(이유: 열어 본 주소와 결과)`를 적는다.
- 고친 글마다 `bash scripts/check-article.sh <cat>/<slug>`(prose "재검토 필요"는 무시), `npx eslint <고친 파일>`.
- `git`·포매터·`merge-registrations.mjs --all`은 실행하지 않는다. 자기 원장의 글 파일만 고친다.
