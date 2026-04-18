import ChangelogViz from './viz/ChangelogViz';

export default function Changelog() {
  return (
    <section id="changelog" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Changelog — 시간순 단일 파일</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          세 층 중 가장 먼저 만들어야 하는 건 Changelog다.<br />
          ADR과 Lessons는 없어도 굴러가지만 — 시간 축 기록이 없으면 나머지 두 층이 서로 고립된 조각으로 남는다.<br />
          Changelog는 모든 작업의 최소 단위 기록이자, 다른 층으로 점프하는 진입점이다.
        </p>
        <p className="leading-7">
          이 섹션은 Changelog 하나를 <strong>끝까지 파고든다</strong>.<br />
          파일 구조, 엔트리 포맷, 1분 루틴, git hook 자동화, 월별 아카이브, 그리고 가장 자주 일어나는 유지 실패 패턴과 회복 전략까지.
        </p>

        <div className="not-prose my-8"><ChangelogViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 사례 — context-manager의 changelog.md</h3>
        <p className="leading-7">
          일반론으로 들어가기 전에 실제 파일 하나를 보자.<br />
          context-manager 프로젝트의 <code>knowledge/changelog.md</code> 는 2026-04 월 섹션 맨 위에 이런 엔트리가 있다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`## 2026-04

### 2026-04-16 — Memory B wipeout incident + 3 defensive lines added
Legacy 파일 설명을 compaction LLM이 "삭제 표시"로 오독해 프로필 전체에 delete ops를 반환.
- 방어선: (1) compaction 결과가 0파일인데 이전 >0이면 rollback
          (2) 의심스러운 delete 패턴 발견 시 경고
          (3) safe-delete 규칙을 compaction prompt에 추가
- 코드: agent/src/api/services/memory-sandwich.ts
- 원인 분석: lessons/agent-routing/agent-memory-architecture.md "rewrite 방식의 위험" 섹션`}
        </pre>
        <p className="leading-7">
          5줄짜리 엔트리다. 제목 1줄, 요약 1줄, 링크 4개.<br />
          여기에 "왜"와 "어떻게 막았는가"가 전부 압축돼 있다 — 긴 맥락은 <code>lessons/agent-routing/agent-memory-architecture.md</code>로 링크해 빼냈다.<br />
          이 엔트리 덕분에 3주 뒤의 내가 "memory 관련 이슈가 언제 있었지?"를 물었을 때 즉시 답이 나온다.
        </p>
        <p className="leading-7">
          이 Memory B wipeout 사건은 이 글 전체의 running example이 될 거다.<br />
          Changelog 섹션에서는 엔트리 포맷을 보고, ADR 섹션에서는 이 사건이 왜 바로 ADR로 승격되지 않았는지를 보고, Lessons 섹션에서는 교훈이 어떻게 <code>agent-memory-architecture.md</code>로 수렴했는지를 본다.<br />
          한 사건이 세 층을 어떻게 통과하는지 따라가 보면 전체 구조가 선명해진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 단일 파일인가</h3>
        <p className="leading-7">
          첫 번째 본능은 "날짜별로 파일을 나누자"다. 2026-04-16.md, 2026-04-15.md...<br />
          이 구조는 쓰기는 편하지만 <strong>조회가 치명적으로 나쁘다</strong>.<br />
          "최근 2주에 무슨 일?"이라는 가장 흔한 질문에 답하려면 10개 파일을 일일이 열어야 한다.
        </p>
        <p className="leading-7">
          단일 파일의 장점은 <strong>선형 scanning</strong>이다.<br />
          Ctrl+F로 키워드를 찾거나, 파일 맨 위에서 아래로 스크롤하며 시간순으로 훑을 수 있다.<br />
          조회 비용이 0에 수렴한다 — 이게 시간 축 인덱스의 존재 이유다.
        </p>
        <p className="leading-7">
          대신 파일이 커질 수 있다는 걱정이 생긴다. 이건 "월별 아카이브 split"으로 해결한다 (뒤 섹션에서 다룸).<br />
          메인 파일은 항상 수백 줄 이하로 유지되므로 선형 scanning 성능이 유지된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">시간역순 prepend</h3>
        <p className="leading-7">
          엔트리는 항상 파일의 <strong>맨 위에 prepend</strong>한다.<br />
          최신이 위, 오래된 것이 아래. 파일을 열면 자연스럽게 최신 상태부터 보인다.
        </p>
        <p className="leading-7">
          대안은 "시간순 append" — 파일 끝에 추가하는 방식이다. 이건 두 가지 이유로 나쁘다.
        </p>
        <ul className="leading-7">
          <li><strong>조회 시 매번 끝까지 스크롤</strong>해야 한다. 최근 작업이 가장 자주 조회되는데 접근 비용이 가장 높다.</li>
          <li><strong>월별 아카이브 split이 어렵다</strong>. 시간역순이면 오래된 것이 이미 아래에 있어 "아래 N 줄을 잘라서 아카이브"가 자연스럽다. 시간순이면 그 반대.</li>
        </ul>
        <p className="leading-7">
          prepend가 심리적으로는 어색하다 — "파일 끝에 추가"에 익숙하기 때문에.<br />
          하지만 며칠 써 보면 역전된다. 파일을 열 때마다 즉시 보이는 최신 상태는 다른 어떤 구조보다 조회가 빠르다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">월별 섹션으로 시간 앵커</h3>
        <p className="leading-7">
          파일 안에서는 월별 헤딩으로 큰 앵커를 잡는다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`# Changelog

## 2026-04

### 2026-04-16

#### Router fallback 순서 뒤집음
Primary 실패 시 Haiku보다 Qwen이 먼저 호출되도록 조정.
- 결정: [adr/004-router-fallback.md]
- 원칙: [lessons/model-selection.md]

### 2026-04-15

#### Memory sandwich ops idempotent 보장
...

## 2026-03

### 2026-03-31
...`}
        </pre>
        <p className="leading-7">
          헤딩 계층:
        </p>
        <ul className="leading-7">
          <li><code>## 2026-04</code> — 월별 섹션. 가장 큰 시간 앵커. "2주 전"이라는 상대 시간을 월 섹션으로 변환해서 찾는다.</li>
          <li><code>### 2026-04-16</code> — 날짜 sub-heading. 같은 날짜의 엔트리들을 묶는다.</li>
          <li><code>#### 제목</code> — 엔트리 제목. 하루에 여러 엔트리가 있을 수 있다.</li>
        </ul>
        <p className="leading-7">
          월 헤딩만 있고 날짜 sub-heading이 없어도 작동은 한다.<br />
          하지만 날짜 sub-heading이 있어야 Ctrl+F로 "2026-04-16" 같은 정확한 날짜 검색이 가능하고, 월이 끝나면 월 전체를 통째 아카이브하는 작업이 쉬워진다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">엔트리 포맷 — 3~5줄 규칙</h3>
        <p className="leading-7">
          한 엔트리는 <strong>3~5줄이 목표</strong>다. 구성:
        </p>
        <ul className="leading-7">
          <li><strong>제목 (1줄)</strong> — 무엇이 변했는가. 동사로 시작해서 구체적으로. "routing 수정" 같은 추상어 금지.</li>
          <li><strong>본문 (1~2줄)</strong> — 왜 바꿨는가 / 무엇을 배웠는가. "어떻게"는 커밋 diff에 맡긴다.</li>
          <li><strong>링크 (0~2줄)</strong> — 관련 ADR, Lessons, 커밋, 이슈. 필요한 경우에만.</li>
        </ul>
        <p className="leading-7">
          본문이 3줄을 넘기려 하는 순간, 그 내용은 Changelog가 감당할 것이 아니라는 신호다.<br />
          길어질 내용은 ADR 또는 Lessons로 빼내고, Changelog 엔트리에는 "링크 + 한 문장 요약"만 남긴다.<br />
          "짧은 엔트리가 유지된다"는 규칙을 지키는 게 "전부 기록하기"보다 중요하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">좋은 엔트리 vs 나쁜 엔트리</h3>
        <p className="leading-7">
          제목 하나만 비교해도 차이가 극명하다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`나쁨: "routing 수정"
좋음: "Router fallback 순서 뒤집음 — primary 실패 시 Haiku보다 Qwen이 먼저"

나쁨: "fix"
좋음: "Memory sandwich에서 ops 재적용 시 순서 보존 — idempotent 보장"

나쁨: "prompt tuning"
좋음: "Analyst prompt에 few-shot 2개 추가 — JSON schema 위반률 30%→5%"`}
        </pre>
        <p className="leading-7">
          좋은 엔트리의 공통 특징:
        </p>
        <ul className="leading-7">
          <li><strong>구체적 대상</strong> — "어떤 component / 어떤 함수 / 어떤 prompt"가 명시됨.</li>
          <li><strong>명확한 방향</strong> — "A에서 B로" 같은 전환이 보임.</li>
          <li><strong>측정 가능한 효과</strong> — "위반률 30%→5%" 같은 숫자가 있으면 금상첨화.</li>
        </ul>
        <p className="leading-7">
          나쁜 엔트리는 3주 뒤에 보면 "이게 뭐였지?"가 되고, 그 시점에서 changelog가 완전히 쓸모없어진다.<br />
          "왜"는 남기고, "어떻게"는 커밋 diff에 맡긴다는 원칙이 가장 선명한 구분선이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">작업 완료 직후 1분 루틴</h3>
        <p className="leading-7">
          유지를 성공시키는 한 가지 규칙이 있다면 — <strong>작업이 끝난 직후에 바로 쓴다</strong>는 것이다.
        </p>
        <p className="leading-7">
          구체적인 루틴:
        </p>
        <ol className="leading-7">
          <li>코드 변경 완료</li>
          <li>커밋 (git commit)</li>
          <li>에디터에서 <code>changelog.md</code>를 열고 <strong>1분 타이머</strong></li>
          <li>제목 1줄 + 요약 1~2문장 + (필요하면) 링크 prepend</li>
          <li>저장 → 닫기</li>
        </ol>
        <p className="leading-7">
          이 타이밍이 중요한 이유는 기억이 아직 신선하기 때문이다.<br />
          코드를 쓰는 동안 머릿속에 있던 "왜 이렇게 했는가"가 아직 휘발되지 않은 그 순간이 유일한 유지 기회다.<br />
          10분만 지나도 다른 작업으로 컨텍스트가 넘어가서 "왜"가 흐려진다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>"다음에 써야지" 안티패턴</strong> — 이 말이 나오는 순간 엔트리는 사실상 영원히 안 쓰인다.<br />
          인간 기억은 하루가 지나면 "왜 그렇게 했는지"를 재구성해야 하는데, 그 재구성 비용이 "다시 쓰는 것"보다 비싸다.<br />
          그래서 쓰지 않게 된다 — 합리적 회피다.<br />
          유일한 해법은 작업 완료 직후 1분을 routine의 일부로 고정하는 것이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">git hook으로 부드럽게 강제</h3>
        <p className="leading-7">
          1분 루틴을 인간 의지로 유지하기는 어렵다. 망각, 피로, 빠른 wrap-up 욕구가 쌓이면 어느새 3일치가 밀린다.<br />
          git hook으로 부드러운 리마인더를 추가하면 유지율이 확 올라간다.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`#!/bin/sh
# .git/hooks/post-commit

LAST=$(stat -f %m knowledge/changelog.md 2>/dev/null || echo 0)
NOW=$(date +%s)
DIFF=$((NOW - LAST))

if [ "$DIFF" -gt 86400 ]; then
  echo ""
  echo "⚠️  changelog.md가 1일 이상 정체 중"
  echo "   마지막 수정: $((DIFF / 3600))시간 전"
  echo ""
fi`}
        </pre>
        <p className="leading-7">
          이 hook은 <strong>강제가 아니다</strong>. 커밋을 막지 않고 경고만 띄운다.<br />
          강제하면 "commit --no-verify"로 금방 우회하게 되고, hook 자체가 무시된다.<br />
          부드러운 경고가 "아 맞다"를 유도하고, 그게 1분 루틴으로 자연스럽게 이어진다.
        </p>
        <p className="leading-7">
          또 다른 변형: 커밋 메시지에 <code>[log]</code> 태그가 있으면 hook이 자동으로 changelog.md에 한 줄 prepend.<br />
          이건 자동화가 편하지만 "자동화된 엔트리는 내용이 얄팍해진다"는 부작용이 있다.<br />
          본인에게 맞는 방식을 실험해 보자.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">월별 아카이브 split</h3>
        <p className="leading-7">
          6개월쯤 지나면 changelog.md가 수백 줄을 넘기 시작한다.<br />
          500줄을 넘으면 선형 scanning이 조금씩 버거워지고, 1000줄이 넘으면 Ctrl+F도 느려진다.<br />
          이 시점에 월별 아카이브 split이 필요하다.
        </p>
        <p className="leading-7">
          split 규칙은 단순하다 — <strong>매달 1일에 이전 달을 아카이브로 옮긴다</strong>.
        </p>
        <pre className="text-sm bg-muted p-3 rounded">
          {`knowledge/
├── changelog.md                  # 현재 월 + 이전 1~2개월만
└── archive/
    ├── changelog-2026-03.md      # 2026-03 전체
    ├── changelog-2026-02.md      # 2026-02 전체
    └── changelog-2026-01.md`}
        </pre>
        <p className="leading-7">
          split 시점을 "매달 1일"로 고정하는 게 핵심이다.<br />
          "언제 split 할지"를 결정하는 순간 그 결정 비용이 유지 부담이 된다. 고정된 timing이 있으면 자동조종이 된다.
        </p>
        <p className="leading-7">
          split 자동화는 <strong>하지 않는 것이 좋다</strong>. 자동 split 스크립트는 엣지 케이스에서 깨지기 쉽고, 깨지면 복구가 귀찮고, 귀찮으면 더 이상 안 쓰게 된다.<br />
          월 1회 5분짜리 수동 작업이 훨씬 안정적이다 — 마우스 몇 번으로 이전 달 섹션을 잘라 archive/ 아래 새 파일로 붙여 넣는다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">유지 실패의 전형 패턴</h3>
        <p className="leading-7">
          아무리 잘 세팅해도 유지는 실패할 수 있다. 가장 흔한 패턴은 이렇다.
        </p>
        <ol className="leading-7">
          <li>처음 1~2주는 열심히 쓴다. 매 작업마다 1분 루틴이 지켜진다.</li>
          <li>바쁜 날이 하루 생긴다. "오늘은 나중에 몰아서 쓰자" — 하루치 밀림.</li>
          <li>다음날도 바쁘다. 3일치가 밀린다.</li>
          <li>1주일이 쌓인다. 기억이 흐려지기 시작한다.</li>
          <li>"이제 돌이킬 수 없어" → 완전 포기.</li>
        </ol>
        <p className="leading-7">
          이 패턴의 핵심은 3단계와 5단계 사이에 있다.<br />
          중간에 "쌓인 걸 돌아가서 채우자"라는 결정이 들어가는데, 이게 가장 치명적이다.<br />
          돌아가서 쓰려면 기억을 재구성해야 하고, 재구성 비용이 평소보다 5배는 들기 때문에 자연히 회피한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">회복 전략 — "지금부터만"</h3>
        <p className="leading-7">
          유지가 실패했을 때 회복 전략은 하나다 — <strong>과거를 메꾸지 말 것</strong>.
        </p>
        <ul className="leading-7">
          <li><strong>빠진 기간은 그냥 공백으로 둔다</strong>. 나중의 나는 그 공백을 신경 안 쓴다.</li>
          <li><strong>오늘 작업부터 다시 시작한다</strong>. 1분 루틴을 다시 켠다.</li>
          <li><strong>완벽한 changelog보다 불완전한 changelog가 훨씬 가치 있다</strong>. 공백이 있어도 최신이 쌓이고 있으면 도구 역할을 한다.</li>
        </ul>
        <p className="leading-7">
          가장 큰 적은 완벽주의다.<br />
          "제대로 쓸 거면 완전히 쓰자"는 태도가 changelog를 죽인다. "부분적이라도 꾸준히"가 이기는 전략이다.<br />
          일주일 빠진 구간이 있어도, 그 앞뒤가 잘 쌓여 있으면 3주 뒤 조회에는 아무 문제가 없다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>Changelog의 성공 조건</strong> — 3주 뒤의 내가 "저번에 뭐였지?"를 한 번이라도 해결하면 이미 ROI가 맞다.<br />
          엔트리의 품질, 일관성, 포맷 완성도는 그 다음이다.<br />
          "유지되고 있다"는 상태 자체가 가장 큰 가치다. 어설픈 엔트리라도 있는 것이 없는 것보다 100배 낫다.<br />
          다음 섹션에서는 "한 줄 초과로 쓰고 싶은 내용"이 흘러 들어가는 층 — ADR을 본다.
        </p>
      </div>
    </section>
  );
}
