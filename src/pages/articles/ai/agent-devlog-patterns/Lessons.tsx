import LessonsViz from './viz/LessonsViz';

export default function Lessons() {
  return (
    <section id="lessons" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lessons — 주제별 원칙 저장소</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Changelog가 "언제 무슨 일"을 적고, ADR이 "왜 이 길을 골랐나"를 적는다면,<br />
          Lessons는 "<strong>비슷한 상황에서 어떻게 판단하는가</strong>"를 적는다.<br />
          시간순도 아니고 결정 단위도 아니다 — 주제별로 수렴한 반복 가능한 원칙이다.
        </p>
        <p className="leading-7">
          이 섹션의 running example은 <code>knowledge/lessons/agent-routing/agent-memory-architecture.md</code>다.<br />
          context-manager 프로젝트에서 가장 많이 참조되는 Lessons 파일 중 하나로, memory 시스템의 T1/T2/T3 계층 모델과 "rewrite 방식의 위험"이 축적돼 있다.<br />
          개별 사건이 한 파일 안에 어떻게 원칙으로 수렴하는지를 이 파일이 잘 보여준다.
        </p>

        <div className="not-prose my-8"><LessonsViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">주제별 수렴 — 시간순이 아니다</h3>
        <p className="leading-7">
          Changelog와 Lessons의 가장 큰 차이는 <strong>정렬 축</strong>이다.<br />
          Changelog는 시간순, Lessons는 주제순. 이 차이가 유지 방식과 조회 방식을 완전히 다르게 만든다.
        </p>
        <p className="leading-7">
          시간순 정렬에서는 "언제 그 일이 있었지?"가 핵심이지만, 주제순 정렬에서는 "이 주제에 대해 지금까지 무엇을 배웠지?"가 핵심이다.<br />
          같은 memory 관련 이슈가 2주 간격으로 세 번 발생하면 Changelog에는 세 엔트리가 따로 남지만, Lessons에는 한 파일이 세 번 업데이트된다.
        </p>
        <p className="leading-7">
          주제별 수렴의 핵심 규칙: <strong>두 번째 유사 사건에는 새 파일을 만들지 않는다</strong>.<br />
          기존 파일의 해당 섹션을 업데이트한다. 새 사례를 추가하거나, Known risks 목록에 한 줄 더하거나, Why 섹션에 이유 하나 추가.<br />
          이 규칙이 Lessons 층을 얇게 유지하고 원칙의 일관성을 보존한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">원칙 vs 레시피 — 들어가는 것과 빼는 것</h3>
        <p className="leading-7">
          Lessons에서 가장 흔한 실패는 <strong>레시피로 채우는 것</strong>이다.<br />
          "이 에러는 .env에 X=Y 추가", "이 함수의 null check 누락" 같은 디버깅 해법이 Lessons에 들어가면, 파일이 빠르게 쓸모없어진다.
        </p>
        <p className="leading-7">
          구분 기준은 한 문장으로 요약된다:
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>"저 코드를 왜 저렇게 짜야 하는가"에 답할 수 있으면 원칙.</strong><br />
          답할 수 없고 단지 "어떻게 고치는가"만 있으면 레시피.<br />
          원칙은 Lessons에, 레시피는 코드/커밋 메시지에. 이 경계를 타협하면 Lessons는 몇 주 안에 잡동사니 디렉토리가 된다.
        </p>
        <p className="leading-7">
          구체적 예시 몇 가지:
        </p>
        <ul className="leading-7">
          <li>"이 API는 /v2로 옮겼음" — <strong>docs</strong> 또는 코드 주석. 사실 진술이지 판단 기준이 아님.</li>
          <li>"LLM rewrite는 기존 파일의 delete를 암시할 수 있다" — <strong>Lessons</strong>. "rewrite 접근을 고를 때 이 위험을 고려하라"는 판단 기준.</li>
          <li>"Line 42의 null 처리 추가" — <strong>커밋 diff</strong>. 코드가 진실.</li>
          <li>"Negative few-shot은 positive few-shot보다 약하다" — <strong>Lessons</strong>. prompt 설계 시 반복 적용.</li>
          <li>"Provider-agnostic gateway가 외부 API의 유일한 경로" — <strong>ADR + Lessons</strong>. 결정 자체는 ADR, 그로부터 파생되는 판단 기준은 Lessons.</li>
        </ul>
        <p className="leading-7">
          마지막 예시에서 보듯이 ADR과 Lessons가 공존할 수 있다.<br />
          ADR은 "그때 내린 선택"이고, Lessons는 "그 선택에서 파생되는 반복 규칙".<br />
          보통 ADR 하나 → Lessons 1~2개 파일 업데이트의 흐름으로 이어진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">디렉토리 구조 — 주제가 디렉토리</h3>
        <p className="leading-7">
          Lessons는 디렉토리 단위로 주제를 분리한다. 한 디렉토리 안에 여러 파일이 같은 주제의 다른 측면을 다룬다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`knowledge/lessons/
├── agent-routing/
│   ├── agent-memory-architecture.md
│   ├── memory-b-migration.md
│   ├── llm-promise-vs-actual-capability.md
│   ├── model-selection-not-just-strongest.md
│   └── ... (총 16개 파일)
├── llm-wrapper/
│   └── ... (15개)
├── tool-design/
├── self-improve/
├── user-profile/
├── topics/
└── wiki/`}
        </pre>
        <p className="leading-7">
          context-manager 프로젝트의 실제 구조다.<br />
          <code>agent-routing</code>이 가장 크다 — 라우팅·메모리·모델 선택 등 에이전트의 핵심 의사결정이 여기에 모인다.<br />
          <code>self-improve</code>는 에이전트가 자기 자신을 분석한 로그. 약간 예외적이지만 같은 분류 체계 안에 둔다.
        </p>
        <p className="leading-7">
          디렉토리를 얼마나 잘게 쪼갤지는 경험적으로 조정해야 한다.<br />
          하나의 경험칙: <strong>주제 디렉토리가 8개를 넘으면 재정리 시점</strong>.<br />
          디렉토리가 많을수록 같은 교훈이 여러 곳에 흩어지고, 어느 디렉토리에 넣을지 매번 고민하게 된다.<br />
          8개를 넘기 시작하면 비슷한 디렉토리를 병합하거나, 계층을 한 단계 추가해서 재구성한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Lessons 파일의 전형적 구조</h3>
        <p className="leading-7">
          하나의 Lessons 파일은 대체로 이런 흐름을 따른다.
        </p>
        <ol className="leading-7">
          <li><strong>Problem</strong> — 이 파일이 다루는 주제를 한 문장으로. "무엇에 대한 판단인가."</li>
          <li><strong>Naive approach</strong> — 가장 먼저 떠오르는 접근과 그것이 왜 부족한가. 나쁜 예시 코드 블록을 넣어도 좋다.</li>
          <li><strong>Right approach</strong> — 실제로 작동하는 접근. 위의 naive와 대조적으로 배치.</li>
          <li><strong>Why</strong> — 왜 right가 맞는가. 3~5가지 이유로 정리.</li>
          <li><strong>Cost analysis</strong> 또는 <strong>Trade-offs</strong> — 공짜가 아니다. 무엇을 포기했는가.</li>
          <li><strong>Phase breakdown</strong> (선택) — 단계별로 적용하는 법.</li>
        </ol>
        <p className="leading-7">
          이 중 가장 중요한 건 <strong>Naive와 Right의 대조</strong>다.<br />
          두 접근을 나란히 두고 "이건 안 되고 이건 된다"를 명시적으로 보여주는 게 원칙을 각인시키는 가장 강력한 방법이다.<br />
          Right만 있으면 독자는 "그럼 Naive는 왜 안 되는가"를 스스로 재구성해야 하고, 재구성 비용이 크면 읽지 않게 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 예시 — agent-memory-architecture.md</h3>
        <p className="leading-7">
          context-manager의 가장 성숙한 Lessons 파일 중 하나를 보자.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`# Agent Memory Architecture

## Problem
Memory는 누적이 아니라 압축 rewrite다.
대화가 길어지면 토큰이 폭발하므로, 주기적으로 "요약+갱신"
으로 memory를 압축해야 한다.

## Naive approach
모든 대화 turn을 append → 컨텍스트 폭발.
또는 최근 N턴만 유지 → 오래된 사실 소실.
둘 다 scale 하지 않는다.

## Right approach: 3-tier model
- T1 compressed profile (~500 토큰)
  주기적으로 rewrite. 사용자의 "현재 상태"를 압축 표현.
- T2 vector search (Qdrant)
  과거 대화의 semantic retrieval. 필요할 때만 호출.
- T3 structured facts (Postgres)
  날짜·이름·숫자 등 정확성이 필요한 정보.

## Why (5 reasons)
1. rewrite는 drift 위험이 있지만 context growth를 억제한다.
2. vector search는 lazy 접근이라 평균 비용이 낮다.
3. structured는 LLM이 오독할 수 없는 ground truth 제공.
4. 세 계층이 서로 다른 실패 모드를 커버한다.
5. 각 계층은 독립적으로 교체 가능하다.

## Known risks of rewrite-based approach
- LLM이 "delete 암시"로 오해할 수 있음
  ★ 2026-04-16 Memory B wipeout 사건으로 확인
  → 방어선 3개 추가 (changelog.md 참조)
- 요약 품질이 LLM에 의존 → 모델 변경 시 재검증 필요

## Cost analysis
T1 rewrite: 하루 10회 정도, 1회당 ~2K 토큰
T2 query: turn 당 0~1회, retrieval 하나 1K 토큰
T3 SQL: 거의 비용 없음
총계: 하루 토큰 사용량의 ~15%가 memory 관련

## Implementation phases
Phase A: T1만 (단순 rewrite)
Phase B: T2 추가 (vector 인프라)
Phase C: T3 추가 (structured facts)`}
        </pre>
        <p className="leading-7">
          이 파일 하나에 memory 시스템에 관한 모든 반복 가능한 판단이 들어 있다.<br />
          새로운 memory 관련 결정을 내릴 때마다 이 파일을 먼저 읽는다 — "3-tier 모델의 어느 계층에 해당하는가", "rewrite 위험은 어떻게 완화하는가" 같은 질문이 즉시 답을 얻는다.
        </p>
        <p className="leading-7">
          특히 <strong>Known risks</strong> 섹션이 흥미롭다.<br />
          Memory B wipeout 사건이 이 섹션에 한 줄로 추가됐다. 사건의 상세 설명은 Changelog에, 복구 방법은 커밋에, 교훈은 여기에 — 세 층이 역할을 나눠 가진다.<br />
          이렇게 쓰면 이 파일을 읽는 미래의 내가 "rewrite 방식에는 실제로 확인된 위험이 있다"는 걸 즉시 알 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">업데이트 흐름 — 새 insight는 기존 파일에</h3>
        <p className="leading-7">
          새로운 교훈이 떠올랐을 때의 기본 동작은 <strong>"새 파일을 만들지 않는다"</strong>이다.<br />
          기존 파일 중 주제가 맞는 것을 찾아 해당 섹션을 업데이트한다.
        </p>
        <p className="leading-7">
          구체적인 흐름:
        </p>
        <ol className="leading-7">
          <li>새 사건/교훈이 발생 → Changelog에 한 줄.</li>
          <li>이게 원칙화 가능한가 판단 → 가능하면 Lessons 후보.</li>
          <li>기존 Lessons 파일을 스캔 → 주제가 맞는 파일을 찾는다.</li>
          <li>찾으면 해당 섹션(보통 Known risks, Edge cases, Examples 같은 목록)에 한 줄 추가.</li>
          <li>못 찾으면 새 파일 생성. 단 이 경우가 드물어야 한다.</li>
        </ol>
        <p className="leading-7">
          "기존 파일 업데이트 vs 새 파일 생성"의 비율은 대체로 <strong>9:1 이상</strong>이어야 한다.<br />
          새 파일이 자주 생긴다는 건 두 가지 중 하나를 의미한다.
        </p>
        <ul className="leading-7">
          <li>주제 분류가 너무 세밀하다 — 파일을 병합할 시점.</li>
          <li>프로젝트가 새로운 영역으로 확장 중 — 정상.</li>
        </ul>
        <p className="leading-7">
          전자라면 디렉토리 재정리를 고려한다. 후자라면 새 파일이 여러 개 쌓인 뒤에 공통 주제로 묶을 수 있는지 살핀다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Lessons에 들어가면 안 되는 것</h3>
        <p className="leading-7">
          Lessons가 모든 것을 담으려 하면 아무것도 담지 못한다.<br />
          명시적으로 <strong>배제해야 하는 것</strong>들:
        </p>
        <ul className="leading-7">
          <li>
            <strong>디버깅 레시피</strong> — "이 에러는 X를 Y로 바꾸면 된다." 코드와 커밋이 진실이다. Lessons에 쓰면 코드가 바뀌는 순간 거짓이 된다.
          </li>
          <li>
            <strong>아키텍처 설명</strong> — "컴포넌트 A가 B를 호출한다." docs/ 또는 CLAUDE.md에 있어야 한다. Lessons는 구조 그 자체를 설명하는 곳이 아니다.
          </li>
          <li>
            <strong>사건 단일 기록</strong> — "2026-04-16 이런 일이 있었다." Changelog가 진실이다. Lessons에는 그 사건에서 <strong>추출된 원칙</strong>만 남긴다.
          </li>
          <li>
            <strong>한 번만 내린 unique 결정</strong> — ADR이 진실이다. Lessons는 반복 판단이므로 unique는 여기 오면 안 된다.
          </li>
          <li>
            <strong>진행 중인 작업의 TODO</strong> — issue tracker 또는 별도 TODO 파일이 진실. Lessons는 완료된 교훈만.
          </li>
        </ul>
        <p className="leading-7">
          이 목록의 공통점: 각 항목이 속할 "진실의 소재지"가 따로 있다는 것이다.<br />
          Lessons는 <strong>다른 저장소가 못 담는 것</strong>만 담는다 — 반복 가능한 판단 기준이 그것이다.<br />
          이 경계를 지키면 Lessons는 시간이 지날수록 가치가 올라가고, 경계를 놓으면 쓰레기통이 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Memory B wipeout이 Lessons로 흘러간 실제 경로</h3>
        <p className="leading-7">
          Changelog 섹션에서 봤던 Memory B wipeout 사건을 다시 꺼내 보자.<br />
          이 사건이 Lessons 층으로는 어떻게 흘러갔는지 추적하면, 세 층이 실제로 어떻게 상호작용하는지 보인다.
        </p>
        <ol className="leading-7">
          <li>
            <strong>사건 발생</strong> — 2026-04-16, compaction LLM이 legacy 파일 설명을 "삭제 표시"로 오독. 프로필 전체에 delete ops를 반환. 방어선 3개 추가로 대응.
          </li>
          <li>
            <strong>Changelog 엔트리 prepend</strong> — 한 줄 요약 + 3개 방어선 목록 + 링크.
          </li>
          <li>
            <strong>Lessons 업데이트 판단</strong> — "이 사건에서 반복 가능한 원칙이 추출 가능한가?" 답: 그렇다. "rewrite-based memory는 LLM이 delete를 암시할 수 있다"는 일반 원칙.
          </li>
          <li>
            <strong>기존 파일 스캔</strong> — agent-memory-architecture.md가 memory 전반을 다루고 있음. 이 파일 안에 이미 3-tier 설명이 있음.
          </li>
          <li>
            <strong>섹션 추가</strong> — "Known risks of rewrite-based approach" 섹션을 새로 만들고 첫 항목으로 이 사건을 기록.
          </li>
          <li>
            <strong>두 번째 파일</strong> — llm-promise-vs-actual-capability.md도 업데이트. 이 파일은 "LLM이 실제 능력과 다른 promise를 하는" 패턴을 모으는 파일인데, wipeout 이후 에이전트가 "tool에 접근할 수 없다"고 잘못 주장하는 reverse case가 발견돼 거기에도 한 줄 추가.
          </li>
        </ol>
        <p className="leading-7">
          한 사건이 세 층 모두에 흔적을 남기지만, 각 층은 다른 관점으로 기록한다.<br />
          Changelog는 사건 자체, Lessons는 원칙, ADR은 (이 경우) 없다 — 구조 결정이 아니라 방어선 추가였으므로.<br />
          이렇게 역할이 분담되면 3주 뒤에 "memory 쪽 어떤 문제 있었지?"라는 질문은 Changelog에서 시작해 Lessons로 점프할 수 있고, "rewrite 방식을 고를 때 뭐 조심해야 하지?"라는 질문은 Lessons에서 바로 답이 나온다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>Lessons 층의 ROI</strong> — 가장 높은 가치는 "비슷한 실수를 두 번 하지 않는" 것이다.<br />
          Memory B wipeout 이전에는 rewrite 방식의 위험이 막연한 불안이었다. 사건 이후 Lessons에 명시적으로 기록되면서, 다음 memory 관련 설계에서는 이 위험이 구체적 제약으로 작용한다.<br />
          "한 번 당했으면 두 번 당하지 말자"는 목표가 Lessons의 존재 이유다 — Changelog로는 못 하고 ADR로는 과하다.<br />
          다음 섹션에서는 세 층이 어떻게 서로 참조하며 네트워크를 이루는지, 그리고 이 구조를 새 프로젝트에서 0에서 세팅하는 절차를 본다.
        </p>
      </div>
    </section>
  );
}
