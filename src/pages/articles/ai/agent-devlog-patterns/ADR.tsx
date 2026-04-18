import ADRViz from './viz/ADRViz';

export default function ADR() {
  return (
    <section id="adr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ADR — 결정의 근거 기록</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Changelog가 "언제 무슨 일"을 적는다면, ADR은 "왜 이 길을 골랐나"를 적는다.<br />
          Architecture Decision Record — 특정 시점에 구조적 선택을 내린 그 순간을 파일 하나로 고정한다.<br />
          code diff에는 결과만 남지만, ADR에는 <strong>검토했지만 버린 대안</strong>까지 같이 남는다.
        </p>
        <p className="leading-7">
          이 섹션의 running example은 실제로 존재하는 파일이다 — <code>knowledge/lessons/decisions/001-dev-journaling-pattern.md</code>.<br />
          context-manager 프로젝트의 첫 번째 ADR이 공교롭게도 이 글이 설명하는 3층 구조 자체를 기록하고 있다.<br />
          메타 재귀적이지만 실용적인 예시라 그대로 쓰겠다.
        </p>

        <div className="not-prose my-8"><ADRViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ADR이 해결하는 것 — "왜 이 길을 골랐나"</h3>
        <p className="leading-7">
          Changelog만 있으면 결정의 결과는 보이지만 과정이 안 보인다.<br />
          "2026-04-15 Memory sandwich을 multi-file로 전환" 한 줄이 있어도, 그 전환을 결정하기까지 어떤 대안을 검토했는지, 왜 단일 JSON이 부족했는지, 뒤집을 수 있는 결정인지는 알 수 없다.
        </p>
        <p className="leading-7">
          ADR은 그 공백을 채운다. 하나의 파일 안에 세 가지를 같이 담는다.
        </p>
        <ul className="leading-7">
          <li><strong>Context</strong> — 이 결정이 왜 필요했는가. 어떤 제약, 어떤 증상, 어떤 목표가 있었는가.</li>
          <li><strong>Decision</strong> — 무엇을 골랐는가. 명시적으로 "이것을 한다"라고 쓴다.</li>
          <li><strong>Consequences</strong> — 얻은 것과 잃은 것. trade-off를 피하지 않고 나열한다.</li>
        </ul>
        <p className="leading-7">
          세 가지를 한 파일에 묶어두면, 6개월 뒤의 내가 "이거 뒤집어도 되나?"라고 물었을 때 답이 바로 나온다.<br />
          "뒤집으면 Consequences의 Pro를 잃는다"가 즉시 보이기 때문이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">승격 문턱은 높게</h3>
        <p className="leading-7">
          ADR의 가장 흔한 실패 모드는 <strong>남발</strong>이다.<br />
          처음에는 "모든 중요 결정을 ADR로 남기자"라는 의욕으로 시작하지만, 30개가 넘어가는 순간 ADR 디렉토리가 오히려 조회 불가능한 늪이 된다.<br />
          각 파일은 진지하게 쓰여 있지만, 너무 많아서 어느 것이 진짜 중요한지 알 수 없다.
        </p>
        <p className="leading-7">
          그래서 승격 기준을 높게 잡는다. 한 가지 질문으로 요약하면:
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>"6개월 뒤의 내가 이 결정의 배경을 이해할 필요가 있을까?"</strong><br />
          답이 "아니오"면 Changelog로 충분하다. "아마도"면 아직은 Changelog + 링크. "그렇다"면 ADR로 승격.<br />
          이 질문을 엄격히 적용하면 프로젝트 전체에서 ADR이 3~5개 수준으로 수렴한다 — 그게 적정선이다.<br />
          10개를 넘어가려 하면 승격 기준을 다시 검토해야 한다.
        </p>
        <p className="leading-7">
          context-manager 프로젝트는 지금 5개 미만의 ADR로 운영되고 있다:
        </p>
        <ul className="leading-7">
          <li>001 — Dev journaling pattern (이 글이 설명하는 구조 그 자체)</li>
          <li>002 — Memory sandwich 아키텍처 (T1/T2/T3 계층)</li>
          <li>003 — Provider-agnostic Gateway (모든 외부 API를 Rust gateway 경유)</li>
        </ul>
        <p className="leading-7">
          이것들은 모두 <strong>뒤집기 어려운 구조적 결정</strong>이다.<br />
          Memory sandwich를 다른 구조로 바꾸려면 여러 MCP tool을 다 고쳐야 하고, Gateway 경유 규칙을 바꾸면 보안 모델이 무너진다.<br />
          반면 "Analyst prompt에 few-shot 2개 추가" 같은 변경은 파일 한 개의 문자열 수정일 뿐 — Changelog에 한 줄로 족하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">파일 명명 — 번호 + 짧은 slug</h3>
        <p className="leading-7">
          ADR 파일 이름은 <code>NNN-short-slug.md</code> 형식으로 통일한다.<br />
          번호는 001부터 순차, slug는 제목의 핵심 단어만.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`knowledge/lessons/decisions/
├── 001-dev-journaling-pattern.md
├── 002-memory-sandwich.md
├── 003-provider-agnostic-gateway.md
├── 004-legacy-single-json.md        (status: superseded by 005)
└── 005-memory-b-multifile.md`}
        </pre>
        <p className="leading-7">
          번호를 매기는 이유는 두 가지다.
        </p>
        <ul className="leading-7">
          <li><strong>연대기 자동 정렬</strong> — 파일명 정렬만으로 "결정의 역사"가 시간순으로 나온다.</li>
          <li><strong>참조 용이성</strong> — 다른 문서에서 "ADR 003"처럼 번호로 참조할 수 있다. slug가 바뀌어도 번호는 그대로.</li>
        </ul>
        <p className="leading-7">
          번호는 <strong>절대 재사용하지 않는다</strong>.<br />
          결정이 폐기되거나 뒤집혀도 원본 파일은 그대로 두고 status만 <code>superseded</code>로 바꾼다.<br />
          번호를 재사용하면 과거 참조가 깨지고, 연대기에 구멍이 생긴다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">템플릿 — frontmatter + 5섹션</h3>
        <p className="leading-7">
          ADR 하나의 표준 구조는 YAML frontmatter와 본문 5섹션이다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`---
id: 005
title: Memory B — single JSON에서 multi-file로 전환
status: accepted
date: 2026-04-14
supersedes: 004
---

## Context
왜 이 결정이 필요했는가.
어떤 제약(시간, 기술, 외부 요구)이 작용했는가.

## Alternatives Considered
검토한 대안 목록. 각 대안의 장점과 버린 이유.

## Decision
선택한 접근을 한 문장으로, 그리고 구체적으로.

## Consequences
### Pro
얻은 것 (수치가 있으면 수치로).
### Con
잃은 것 / 새로 발생한 문제.
### Mitigations
Con을 줄이기 위한 장치.

## Rule
이 결정에서 파생되는 반복 가능한 규칙 한두 줄.`}
        </pre>
        <p className="leading-7">
          frontmatter에 꼭 있어야 하는 필드:
        </p>
        <ul className="leading-7">
          <li><strong>id</strong> — 번호. 파일명과 일치해야 한다.</li>
          <li><strong>title</strong> — 결정 내용을 한 문장으로.</li>
          <li><strong>status</strong> — <code>proposed / accepted / superseded / deprecated</code> 중 하나.</li>
          <li><strong>date</strong> — 결정이 확정된 시점.</li>
          <li><strong>supersedes</strong> / <strong>superseded_by</strong> — 관련 ADR 번호 (해당되는 경우).</li>
        </ul>
        <p className="leading-7">
          본문 5섹션 중 <strong>Consequences가 가장 중요하다</strong>.<br />
          대부분의 사람이 ADR을 쓸 때 Context와 Decision만 열심히 쓰고 Consequences는 얼버무린다.<br />
          하지만 6개월 뒤 결정을 재검토할 때 제일 먼저 보는 게 Consequences다 — "내가 그때 무엇을 얻었고 무엇을 포기했는가."<br />
          이 섹션이 비어 있으면 ADR이 제 역할을 못 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 예시 — 001-dev-journaling-pattern.md</h3>
        <p className="leading-7">
          context-manager 프로젝트의 첫 ADR을 그대로 뜯어보자.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`---
id: 001
title: Dev journaling pattern — changelog + lessons + decisions 3-layer
status: accepted
date: 2026-04-15
---

## Context
개인 에이전트 개발 중 "왜 이렇게 고쳤지?"가 반복적으로 막혔다.
git log는 commit message만 있어 배경 맥락 소실.
공식 리뷰 프로세스가 없는 개인 프로젝트라 기억이 유일한 저장소였다.

## Alternatives Considered
(a) Keep-a-Changelog 단일 파일 — 일상 변경은 잡지만 결정 맥락은 얇음.
(b) ADR만 — 결정은 정밀하지만 일상 흐름이 누락.
(c) 프리폼 devlog — 검색 불가, 구조 없이 증식.

## Decision
3층 분리: changelog.md (시간) + lessons/*.md (원칙) + lessons/decisions/NNN-*.md (결정).
각 층은 서로 markdown 링크로 네트워크를 이룬다.

## Consequences
### Pro
- 조회 질문(시간/원칙/결정)이 한 층을 정확히 지정한다
- 유지 비용이 낮게 유지된다 (짧은 엔트리 규칙)
- 공개 가능 / 비공개 분리가 가능하다
### Con
- 세 층 사이 중복 기록 위험
- 신규 개발자(미래의 나)가 세 층을 이해해야 함
### Mitigations
- 엔트리 규칙 하드코딩 (3~5줄, 링크 의무)
- CLAUDE.md 상단에 3층 구조 한 문단 명시

## Rule
작업 완료 = Changelog 엔트리 prepend가 완료된 시점.
그 전에는 "끝났다"라고 말하지 않는다.`}
        </pre>
        <p className="leading-7">
          이 한 파일만 봐도 결정의 전체 맥락이 보인다.<br />
          왜 단일 파일 방식이 아닌지, 어떤 대안을 탐색했는지, 어떤 trade-off를 수용했는지, 그 trade-off를 어떻게 완화했는지.<br />
          6개월 뒤 "3층 구조 귀찮은데 단일 파일로 돌아갈까?"라는 생각이 들 때, 이 ADR을 다시 읽으면 (c) 프리폼이 왜 실패했는지 즉시 떠오른다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">결정을 뒤집을 때 — superseded</h3>
        <p className="leading-7">
          시간이 지나면 결정이 틀렸거나 맥락이 바뀔 수 있다.<br />
          context-manager 프로젝트에서는 실제로 일어난 일이 있다 — memory 구조를 단일 JSON(004)으로 시작했다가 Claude Code 스타일 multi-file(005)로 전환했다.
        </p>
        <p className="leading-7">
          이때 취하는 조치:
        </p>
        <ol className="leading-7">
          <li><strong>004-legacy-single-json.md를 지우지 않는다</strong>. 파일은 그대로 유지.</li>
          <li>004의 frontmatter status를 <code>accepted</code>에서 <code>superseded by 005</code>로 변경.</li>
          <li>005를 새로 생성하면서 frontmatter에 <code>supersedes: 004</code>를 명시.</li>
          <li>005의 Context 섹션에 "왜 004가 부족했는가"를 명시적으로 기록.</li>
        </ol>
        <p className="leading-7">
          이렇게 하면 두 결정이 파일로 공존한다.<br />
          나중에 "multi-file이 귀찮은데 단일 JSON으로 돌아가면 안 되나?"라는 유혹이 생기면, 004를 다시 읽을 수 있다.<br />
          그 파일에는 왜 단일 JSON을 선택했는지, 그리고 왜 그게 결국 실패했는지가 연속적으로 기록돼 있다.
        </p>
        <p className="leading-7">
          파일을 지우는 대신 superseded로 보존하는 게 중요한 이유는 <strong>순환을 끊기 위해서</strong>다.<br />
          지우고 다시 돌아가면 같은 실패를 반복한다. 연쇄가 기록돼 있으면 미래의 내가 그 실패를 안 겪어도 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ADR vs Lessons — 헷갈리는 경계</h3>
        <p className="leading-7">
          ADR과 Lessons는 자주 헷갈린다. "이건 ADR인가 Lessons인가?"라는 질문이 계속 떠오른다.<br />
          구분 기준은 <strong>unique 결정인가 반복 규칙인가</strong>다.
        </p>
        <ul className="leading-7">
          <li><strong>ADR</strong> — "지금 이것을 고른다"는 특정 시점의 선택. 한 번만 기록하고 끝. 같은 ADR을 여러 번 쓰지 않는다.</li>
          <li><strong>Lessons</strong> — "이런 상황에서는 이렇게 판단한다"는 반복 가능한 원칙. 같은 주제를 계속 업데이트한다.</li>
        </ul>
        <p className="leading-7">
          같은 사건이 두 층 모두로 갈 수 있다.<br />
          예를 들어 Memory B wipeout 사건:
        </p>
        <ul className="leading-7">
          <li><strong>Changelog</strong>: "2026-04-16 Memory B wipeout + 3 defensive lines" — 사건 자체.</li>
          <li><strong>Lessons</strong>: <code>lessons/agent-routing/agent-memory-architecture.md</code>의 "rewrite 방식의 위험" 섹션 — 원칙화된 교훈.</li>
          <li><strong>ADR</strong>: 이 사건은 ADR로 승격되지 <strong>않았다</strong>. 구조 변경이 아니라 방어선 추가였기 때문. 만약 이 사건 때문에 compaction 방식을 root 수준에서 바꿨다면 ADR 하나가 추가됐을 것이다.</li>
        </ul>
        <p className="leading-7">
          같은 사건이 세 층 중 몇 개로 가는가는 "그 사건이 무엇을 바꿨는가"에 달려 있다.<br />
          일상 변경이면 1층, 원칙이 추가되면 2층, 구조 결정이면 3층 — 필요한 층만 사용한다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>실전 조언 — 의심될 때는 ADR로 가지 말 것</strong><br />
          "이거 ADR인가?"라는 의심이 들면 대체로 아직 ADR이 아니다.<br />
          ADR로 승격시킬 만한 결정은 대부분 이미 "이건 명백히 구조적"이라는 감이 있다.<br />
          의심스러우면 일단 Changelog에 적고 링크만 달아 둔다. 나중에 같은 결정이 반복되거나 뒤집기 어려워지면 그때 ADR로 승격한다.<br />
          반대 방향(ADR → Changelog로 격하)은 거의 일어나지 않으므로 안전한 default는 Changelog다.
        </p>
        <p className="leading-7">
          다음 섹션에서는 Lessons 층을 본다 — "ADR도 Changelog도 아닌, 주제별 원칙"이 어디에 쌓이는지.
        </p>
      </div>
    </section>
  );
}
