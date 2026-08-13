# Blog workspace instructions

블로그 본문, category flow, 수식 또는 Viz를 작성·수정할 때는 작업 전에 반드시 다음 두 문서를 끝까지 읽는다.

1. `docs/blog-rewrite-contract.md`
2. `docs/viz-design-standard.md`

대화에서 새 편집 요구가 나오면 개별 페이지부터 고치지 말고 먼저 위 정본 문서에 기존 기준과
충돌 없이 병합한다. 이후 `docs/rewrite-status.md`에 범위와 검수 상태를 남긴다. 대화 context나
작업자가 바뀌어도 이 세 파일을 기준으로 이어 간다.

새 문서·논문에서 용어를 발견하면 `src/content/knowledge-graph.ts`의 기존 concept와 canonical owner를 먼저 확인한다. 같은 정의를 새 글에 복제하지 말고 relation과 현재 글의 역할을 추가한다. 새 concept라면 node·edge·canonical href를 함께 등록하고, 정본 설명이 비어 있으면 완료하지 않는다.

새 concept의 정본은 초심자가 용어를 모른다고 가정한다. 특히 theorem·bound는 직관적 상황, 숫자 예, 기호 역할, 증명 아이디어와 적용할 수 없는 반례까지 설명해야 하며 사전식 정의와 수식만으로 완료 처리하지 않는다.

선수 지식은 AI·블록체인 같은 현재 카테고리 안에서 끝내지 않는다. 설명에 수학·통계·물리·컴퓨터 구조 등 더 아래 개념이 필요하면 같은 knowledge graph에 prerequisite로 등록하고 canonical article을 만든다. 이 경로는 재귀적으로 entry-level 설명까지 이어져야 하며, 현재 글에는 링크를 열지 않아도 흐름을 이해할 짧은 직관을 함께 남긴다.

물리·화학·생물·지구과학처럼 관측을 바탕으로 하는 기초과학 concept는 `scientificGrounding`을 작성한다. 관측량, 단위와 차원, 모델의 이상화 전제, 작은 측정 예, 성립하지 않는 조건을 모두 적고, 물리 concept에는 좌표계·기준계까지 명시한다. 이 항목이 비면 learning audit를 통과시키지 않는다.

한 글을 완료했다고 보고하려면 다음을 모두 충족해야 한다.

- article contract의 Definition of Done 전 항목 확인
- 변경한 Viz에 `npm run audit:viz -- --strict <paths>` 실행
- desktop 1440px와 mobile 390px Playwright 렌더 확인
- 주요 KaTeX가 `질문·아이디어 → 식 → 기호·전제·해석` 순서인지 DOM과 화면에서 확인
- 모든 글은 작성 전에 기초·심화 문제와 정답 체크리스트를 만들고 `npm run audit:learning -- --strict --require-registration <category/article>`로 선수 개념·문제 coverage·논문 해설 anchor 확인
- 전역 완료를 판단할 때는 `npm run audit:learning -- --strict --require-registration --all-articles`가 통과해야 함
- `npm run build` 통과

한 항목이라도 미확인이면 “완료”가 아니라 “진행 중” 또는 구체적인 미통과 상태로 보고한다.
레거시 파일이 디렉터리에 남아 있더라도 실제 article entry에서 import되지 않으면 현재 렌더의
실패로 세지 않는다. 반대로 build가 통과해도 내용 깊이·한국어·브라우저 검수를 생략하지 않는다.
