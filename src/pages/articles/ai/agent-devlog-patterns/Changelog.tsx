import { CitationBlock } from "@/components/ui/citation";
import ChangelogViz from "./viz/ChangelogViz";

const CHANGELOG_FIELDS = [
  ["Date / version", "언제 관찰 가능한 변화가 생겼는지"],
  ["Result", "무엇이 달라졌는지 사용·운영 관점의 한 문장"],
  ["Verification", "어떤 test·metric·review로 완료를 판정했는지"],
  ["Evidence links", "commit, issue, run artifact, ADR, Lessons의 stable link"],
] as const;

export default function Changelog() {
  return (
    <section id="changelog" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Changelog는 검증된 변화를 찾는 시간순 인덱스입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          고정 사례의 첫 공개 기록은 “compaction을 조사했다”가 아니라
          “비어 있는 compaction 결과가 기존 profile을 덮어쓰지 못하도록
          변경했다”입니다. Changelog는 노력이나 debugging 과정을 나열하는
          작업일지가 아니라, 독자가 날짜나 version에서 출발해 관찰 가능한
          변화와 근거를 찾는 index이기 때문입니다.
        </p>
        <p>
          공개 software의 Changelog는 보통 end user에게 notable change를 전달하는
          release 문서입니다. 내부 agent 프로젝트의 개발 Changelog는 운영자와
          다음 개발자가 독자일 수 있으므로 entry 단위가 더 작을 수 있습니다.
          그렇더라도 commit log를 그대로 복사하지 않고 사람이 읽을 결과를
          편집하며, 날짜·분류·link를 일관되게 유지한다는 원리는 같습니다.
        </p>
        <p>
          Keep a Changelog가 쓰는 대표 category는 <code>Added</code>,
          <code>Changed</code>, <code>Deprecated</code>, <code>Removed</code>,
          <code>Fixed</code>, <code>Security</code>입니다. 이 목록을 그대로 따라야
          하는 것은 아니지만, 독자가 “추가된 기능인지, 고친 동작인지, 보안
          변경인지”를 제목만 보고 구분하게 만드는 어휘 체계라는 점은
          참고할 만합니다. 고정 사례는 기존 동작의 결함을 바로잡았으므로
          <code>Fixed</code>에 해당합니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <ChangelogViz />
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CHANGELOG_FIELDS.map(([field, meaning]) => (
          <article
            key={field}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{field}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {meaning}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례를 한 항목으로 줄이기</h3>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted p-4 text-sm">
          {`## 2026-04

### 2026-04-16 — 빈 compaction 결과의 profile overwrite 차단
기존 profile이 있는데 새 compaction 결과가 비어 있으면 갱신을 중단하고
검토 가능한 오류 상태를 반환하도록 변경했다.

- 검증: empty / partial / full 결과 회귀 test
- 코드: commit c8f…
- 사건 artifact: run-1842
- 결정: ADR-005 profile storage 분리
- 원칙: destructive-derived-update.md`}
        </pre>
        <p>
          제목은 구현 수단보다 결과를 먼저 보여 줍니다. 본문은 왜 문제가
          생겼는지 추측하는 대신 실제로 바뀐 guard와 검증 범위를 적고, 상세
          context는 artifact와 ADR로 넘깁니다. <code>run-1842</code>에 고객 원문이나
          secret이 포함되어 있다면 Changelog에는 접근 통제된 artifact의 식별자와
          redacted summary만 남깁니다.
        </p>

        <h3>기록할 변화와 건너뛸 noise</h3>
        <p>
          formatting만 바꾼 commit, 실패한 실험의 모든 중간 command, 자동 생성된
          dependency noise를 전부 넣으면 중요한 변화가 묻힙니다. 반면 behavior,
          data format, model/prompt/tool policy, migration, security boundary,
          운영 절차가 달라졌다면 다음 작업자가 알아야 할 가능성이 큽니다. 팀이
          “notable”의 기준을 정의하고 예외가 생기면 review에서 조정하는 편이
          글자 수만으로 잘라 내는 규칙보다 낫습니다.
        </p>
        <p>
          작성 시점은 구현과 검증이 끝난 직후가 좋습니다. agent가 diff와 test
          결과로 초안을 만들 수는 있지만, 실패한 test를 숨기지 않았는지,
          user-visible impact가 맞는지, link가 실제 artifact를 가리키는지는 사람이
          확인해야 합니다. merge 전에는 <code>Unreleased</code>나 pending 영역에
          두고, 배포 또는 운영 반영이 확인된 뒤 status를 확정할 수 있습니다.
        </p>
      </div>

      <div
        id="paper-keep-a-changelog"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Keep a Changelog
        </p>
        <CitationBlock
          source="Keep a Changelog 1.1.0"
          citeKey={1}
          type="paper"
          href="https://keepachangelog.com/en/1.1.0/"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> raw commit log만으로는 사용자가 release마다 어떤 notable change가 있었는지 빠르게 파악하기 어렵습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> 사람이 읽는 curated chronological list, 최신 version 우선, link 가능한 section, 일관된 change category와 Unreleased 영역을 제안합니다.</p>
            <p><strong>전제·조건:</strong> release 또는 version이 있는 software의 end-user Changelog를 주 대상으로 하며, project가 따르는 versioning과 notable change 기준을 별도로 정해야 합니다.</p>
            <p><strong>근거 범위:</strong> commit dump와 구별되는 Changelog의 목적과 유지 원칙을 뒷받침합니다.</p>
            <p><strong>비주장:</strong> 이 글의 내부 개발 Changelog 형식, 최신순 월별 heading, ADR·Lessons 세 층 구조가 industry standard이거나 모든 commit을 기록해야 한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>언제 ADR이나 Lessons로 넘어가는가</h3>
        <p>
          guard 한 줄의 결과를 찾는 데는 Changelog면 충분합니다. 그러나 storage
          layout처럼 여러 module과 migration에 영향을 주고 되돌리는 비용이 큰
          선택은 “왜”를 보존할 ADR이 필요합니다. 여러 incident와 review에서 같은
          validation rule이 반복된다면 현재 원칙을 Lessons에서 소유합니다.
          Changelog 항목을 계속 늘리는 대신 다음 문서로 link하는 순간입니다.
        </p>
      </div>
    </section>
  );
}
