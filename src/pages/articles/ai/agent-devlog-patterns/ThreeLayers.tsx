import ThreeLayersViz from './viz/ThreeLayersViz';

export default function ThreeLayers() {
  return (
    <section id="three-layers" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">세 층의 역할 분담과 유지 규칙</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          지금까지 Changelog, ADR, Lessons를 하나씩 뜯어봤다.<br />
          이 마지막 섹션은 세 층이 <strong>같이 동작하는 방식</strong>을 본다 — 서로를 어떻게 참조하고, 사건이 어떤 경로로 층을 통과하고, 새 프로젝트에서 이 구조를 어떻게 0에서 세팅하는가.
        </p>
        <p className="leading-7">
          그리고 가장 중요한 것 — <strong>유지가 깨지는 패턴</strong>과 그 대응. 세 층이 이론적으로 완벽해도 유지가 안 되면 빈 디렉토리만 남는다.
        </p>

        <div className="not-prose my-8"><ThreeLayersViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">세 층의 링크 네트워크</h3>
        <p className="leading-7">
          세 층은 고립된 사일로가 아니라 <strong>링크로 연결된 네트워크</strong>다.<br />
          각 엔트리/파일이 다른 층의 파일을 markdown 링크로 가리키고, 조회 시 그 링크를 따라 점프한다.
        </p>
        <p className="leading-7">
          구체적인 참조 방향:
        </p>
        <ul className="leading-7">
          <li><strong>Changelog → Lessons</strong>: "원인 분석: lessons/agent-routing/agent-memory-architecture.md 참조"</li>
          <li><strong>Changelog → ADR</strong>: "결정: lessons/decisions/005-memory-b-multifile.md"</li>
          <li><strong>ADR → Lessons</strong>: "이 결정에서 파생된 원칙: lessons/agent-routing/model-selection-not-just-strongest.md"</li>
          <li><strong>Lessons → Changelog</strong>: "★ 2026-04-16 Memory B wipeout 사건으로 확인 (changelog.md 참조)"</li>
          <li><strong>Lessons → ADR</strong>: "이 원칙의 배경 결정: decisions/003-provider-agnostic-gateway.md"</li>
        </ul>
        <p className="leading-7">
          이 참조들이 만드는 네트워크 덕분에, 어느 층에서 진입하든 필요한 정보로 점프할 수 있다.<br />
          "그 이슈 언제였지?"로 Changelog에 들어가서 Lessons 링크를 타면 원칙을 보고, 거기서 ADR 링크를 타면 결정 배경까지 도달한다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>링크 규칙</strong> — 엔트리를 쓸 때 관련 파일이 있으면 반드시 경로를 명시한다.<br />
          "참조" 같은 추상 표현 금지 — 구체 파일 경로를 쓴다. <code>lessons/agent-routing/agent-memory-architecture.md</code> 이렇게.<br />
          이게 귀찮으면 나중에 못 찾는다. 링크가 없는 엔트리는 고립된 메모와 같다.<br />
          context-manager 프로젝트의 CLAUDE.md에는 "Changelog 엔트리마다 관련 lessons/ 또는 decisions/ 경로 명시"가 규칙으로 적혀 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">사건의 생애 — 어떤 층으로 가는가</h3>
        <p className="leading-7">
          모든 사건은 Changelog에서 시작한다. 거기서 어디까지 가느냐가 사건의 무게에 달려 있다.
        </p>
        <p className="leading-7">
          <strong>99%의 사건</strong>: Changelog 한 줄로 끝. 일상적인 코드 변경, 작은 버그 수정, prompt 조정.<br />
          <strong>~10%의 사건</strong>: Changelog + Lessons 업데이트. 반복 가능한 교훈이 추출되는 사건. 기존 Lessons 파일의 해당 섹션을 업데이트하거나, 드물게 새 파일 생성.<br />
          <strong>~1~2%의 사건</strong>: Changelog + Lessons + ADR. 구조 결정이 필요한 사건. 프로젝트 전체에서 손에 꼽을 정도.
        </p>
        <p className="leading-7">
          이 비율이 중요한 이유는 <strong>각 층의 유지 부담을 예측</strong>할 수 있기 때문이다.<br />
          하루 3~5개 작업을 하면 Changelog는 3~5 엔트리, Lessons 업데이트는 주 1~2회, ADR은 달 1회 미만.<br />
          이 리듬이 깨지면 — 예를 들어 매일 Lessons를 쓰고 있다면 — 원칙과 레시피의 경계를 다시 살펴봐야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Memory B wipeout — 세 층 전체 통과 추적</h3>
        <p className="leading-7">
          이 글의 running example이었던 Memory B wipeout 사건을 세 층 전체에서 한 번에 추적해 보자.
        </p>
        <ol className="leading-7">
          <li>
            <strong>4/16 12:30 — 사건 발생</strong>. Compaction LLM이 legacy 파일 설명을 "삭제 표시"로 오독. 프로필 전체 삭제.
          </li>
          <li>
            <strong>4/16 14:00 — 대응 완료</strong>. 3개 방어선 코드에 추가, 커밋.
          </li>
          <li>
            <strong>4/16 14:02 — Changelog</strong>. <code>knowledge/changelog.md</code> 맨 위에 5줄 엔트리 prepend. 제목 + 원인 1줄 + 방어선 3개 + 코드 경로 + Lessons 링크.
          </li>
          <li>
            <strong>4/16 14:05 — Lessons (1)</strong>. <code>agent-memory-architecture.md</code>의 "Known risks of rewrite-based approach" 섹션에 이 사건 한 줄 추가. 기존 파일 업데이트.
          </li>
          <li>
            <strong>4/16 14:07 — Lessons (2)</strong>. <code>llm-promise-vs-actual-capability.md</code>에 reverse case(tool hallucination) 한 줄 추가. 기존 파일 업데이트.
          </li>
          <li>
            <strong>ADR?</strong> — <strong>아니오</strong>. 이 사건은 구조 결정이 아니라 방어선 추가였다. ADR 승격 불필요. 만약 compaction 방식 자체를 근본적으로 바꿨다면 ADR 하나가 추가됐을 것이다.
          </li>
        </ol>
        <p className="leading-7">
          총 소요 시간: 약 7분 (코딩 제외). 3개 파일 수정. 이 7분 덕분에 미래의 내가:
        </p>
        <ul className="leading-7">
          <li>"그 memory 이슈 언제였지?" → Changelog에서 즉시 발견.</li>
          <li>"rewrite 방식 위험이 뭐가 있지?" → Lessons에서 목록으로 즉시 확인.</li>
          <li>"LLM이 도구 접근성에 대해 거짓말하는 패턴은?" → Lessons에서 reverse case로 확인.</li>
        </ul>
        <p className="leading-7">
          이 세 질문이 각각 다른 층에서 즉시 답이 나온다. 한 파일에 전부 적었다면 세 질문 중 하나는 찾기 어려웠을 것이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">새 프로젝트에서 0 → 세팅</h3>
        <p className="leading-7">
          이 구조를 새 프로젝트에 세팅하는 건 5분이면 된다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`# 1. 디렉토리 생성
mkdir -p knowledge/lessons/decisions

# 2. 빈 changelog 생성
echo "# Changelog\n\n## $(date +%Y-%m)" > knowledge/changelog.md

# 3. 첫 ADR — 이 구조 자체를 기록
# (001-dev-journaling-pattern.md 를 context-manager 에서 복사해도 좋다)

# 4. 핵심 주제 디렉토리 2~3개
mkdir -p knowledge/lessons/{core-topic-1,core-topic-2}

# 끝. 나머지는 쓰면서 자란다.`}
        </pre>
        <p className="leading-7">
          중요한 건 <strong>빈 구조를 미리 많이 만들지 않는 것</strong>이다.<br />
          빈 디렉토리 10개를 만들면 "채워야 하는 것들"이 되고, 채우지 못하면 죄책감이 되고, 죄책감은 전체 시스템을 회피하게 만든다.<br />
          최소 구조에서 시작해서 필요할 때 유기적으로 자라게 둔다.
        </p>
        <p className="leading-7">
          첫 ADR을 001-dev-journaling-pattern으로 시작하는 게 좋은 이유는 두 가지다.
        </p>
        <ul className="leading-7">
          <li>이 구조를 왜 선택했는지 공식 기록으로 남겨 "6개월 뒤 구조를 바꾸고 싶을 때" 참조할 수 있다.</li>
          <li>ADR 작성 자체를 연습하는 첫 기회가 된다 — 가장 잘 아는 결정(이 구조 자체)으로 시작하니 템플릿에 익숙해진다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">유지의 두 가지 적</h3>
        <p className="leading-7">
          이 시스템이 6개월 뒤에도 살아 있으려면, 두 가지 적을 인식해야 한다.
        </p>
        <p className="leading-7">
          <strong>적 1 — 완벽주의</strong>.<br />
          "제대로 된 Lessons 파일을 쓰려면 시간이 필요하니 나중에".<br />
          이 태도는 Changelog를 3일 밀리게 하고, 밀린 Changelog는 영원히 복구되지 않는다.<br />
          해독제: "어설픈 엔트리가 없는 엔트리보다 100배 낫다" — Changelog 섹션에서 강조했던 원칙.
        </p>
        <p className="leading-7">
          <strong>적 2 — 과도한 구조화</strong>.<br />
          "3층이면 부족하니 Report 층도 추가하고, Incident Log 층도, Post-mortem 층도..."<br />
          층이 4개를 넘으면 "이건 어디에 쓰지?" 고민 시간이 쓰기 시간을 초과한다. 그 순간 시스템은 사실상 죽는다.<br />
          해독제: 3층이면 충분하다. 4층을 만들 욕구가 생기면 기존 층에서 해결 가능한지 먼저 확인한다.
        </p>
        <p className="leading-7">
          실측한 결과: context-manager 프로젝트에는 3층 외에 <code>reports/</code> 디렉토리가 별도로 있다.<br />
          하지만 이건 phase별 계획/검증 보고서(phase-plan, phase-verify)로, 3층 기록 체계와는 용도가 완전히 다르다.<br />
          reports/는 "프로젝트 관리 문서"이지 "지식 기록"이 아니다 — 이 구분을 유지하는 게 중요하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">개인 vs 팀 — 다른 점 하나</h3>
        <p className="leading-7">
          이 글의 모든 예시는 개인 프로젝트(context-manager) 기준이다.<br />
          팀에서 쓸 때 달라지는 건 <strong>ADR과 Lessons의 상세도</strong> 하나뿐이다.
        </p>
        <p className="leading-7">
          개인 프로젝트에서는 "나만 알면 되는" 약어, 암묵지, 생략이 허용된다. 미래의 나는 과거의 나와 같은 맥락을 공유하기 때문이다.<br />
          팀에서는 그 맥락이 없는 다른 팀원이 읽는다. "왜"를 더 명시적으로, "대안"을 더 상세하게 쓸 필요가 있다.
        </p>
        <p className="leading-7">
          Changelog는 개인이든 팀이든 형식이 같다 — 시간 축 인덱스는 보편적이다. 차이가 나는 건 ADR과 Lessons의 본문 깊이.<br />
          팀 전환 시에는 기존 파일을 상세화하는 게 아니라, 새로 쓰는 파일부터 상세하게 쓰면 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CLAUDE.md에 넣을 규칙 — AI도 따르게</h3>
        <p className="leading-7">
          context-manager 프로젝트의 CLAUDE.md에는 3층 구조가 명시적으로 적혀 있다.<br />
          AI 에이전트(Claude Code 등)가 이 프로젝트에서 작업할 때, CLAUDE.md를 읽고 같은 규칙을 따른다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`## Knowledge 3-layer system
- knowledge/changelog.md: 시간순. 작업 완료 = 엔트리 prepend 완료.
  한 엔트리 3~5줄: 제목 + 요약 + 관련 lessons/decisions 링크.
- knowledge/lessons/<topic>/: 주제별 원칙. 두 번째 유사 사건은
  새 파일 X, 기존 파일 업데이트.
- knowledge/lessons/decisions/NNN-*.md: ADR. 승격 기준:
  "6개월 뒤에도 배경이 필요한 구조적 결정."
  프로젝트 전체 3~5개가 적정선.`}
        </pre>
        <p className="leading-7">
          이렇게 적어두면 AI가 코드 변경을 마친 뒤 "changelog.md에도 엔트리를 추가해야 하나요?"라고 먼저 물어온다.<br />
          3층 규칙이 코드베이스의 일부가 되면, AI든 인간이든 동일한 유지 루프를 따른다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">마무리 — 다섯 줄 요약</h3>
        <p className="leading-7">
          전체 글을 다섯 줄로 압축하면 이것이다:
        </p>
        <ol className="leading-7">
          <li><strong>Changelog</strong> — 매 작업 끝에 1분, 3~5줄 prepend. "언제 무슨 일."</li>
          <li><strong>ADR</strong> — "6개월 뒤에도 배경이 필요한가?" 이 질문에 "예"인 결정만 승격. 프로젝트 3~5개.</li>
          <li><strong>Lessons</strong> — 두 번째 유사 사건은 새 파일 X, 기존 파일 업데이트. 원칙만 남기고 레시피는 코드에.</li>
          <li><strong>링크</strong> — 엔트리마다 관련 층의 파일 경로를 반드시 명시. 링크가 없으면 고립된 메모.</li>
          <li><strong>유지</strong> — "짧게 자주." 길게 쓰려는 순간 다른 층으로 빼낸다. 완벽주의가 가장 큰 적.</li>
        </ol>
        <p className="leading-7">
          이 다섯 줄을 프로젝트의 CLAUDE.md 또는 README 상단에 적어 두면, 세 층 전체의 유지 규칙이 코드베이스 안에 영구 거주하게 된다.<br />
          3주 뒤의 내가 "이 구조 왜 이렇게 돼 있지?"라고 물으면, 001-dev-journaling-pattern.md에 답이 있다.
        </p>
      </div>
    </section>
  );
}
