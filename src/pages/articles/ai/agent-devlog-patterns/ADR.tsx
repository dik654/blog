import { CitationBlock } from "@/components/ui/citation";
import ADRViz from "./viz/ADRViz";

const OPTIONS = [
  {
    name: "A · single JSON 유지",
    benefit: "migration이 작고 조회 경로가 단순합니다.",
    cost: "한 profile의 잘못된 replace가 전체 파일에 영향을 줄 수 있어 validation·atomic write·backup이 중요합니다.",
  },
  {
    name: "B · profile별 파일 + 파생 index",
    benefit: "부분 갱신과 profile 단위 복구·diff가 쉬워집니다.",
    cost: "파일 수, index rebuild, cross-profile transaction과 migration code가 늘어납니다.",
  },
  {
    name: "C · transactional database",
    benefit: "transaction과 concurrency control을 명시적으로 다룰 수 있습니다.",
    cost: "작은 개인 프로젝트에는 schema·backup·운영 복잡도가 과할 수 있습니다.",
  },
] as const;

export default function ADR() {
  return (
    <section id="adr" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ADR은 선택 당시의 제약과 trade-off를 보존합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          empty-result guard는 당장의 overwrite를 막지만, 사건을 조사하면서 single
          JSON이 부분 갱신과 복구의 영향 범위(blast radius)를 키운다는 구조적 문제가
          드러났다고 해보겠습니다. 이때 “profile별 파일로 바꾼다”는 문장만 남기면
          몇 달 뒤 파일 수와 index 관리 비용이 보일 때 누군가 다시 single JSON으로
          돌릴 수 있습니다. ADR은 그 선택을 영구히 금지하려는 문서가 아니라,
          미래의 개발자가 당시 context가 아직 유효한지 판단하게 하는
          기록입니다.
        </p>
        <p>
          모든 수정이 ADR은 아닙니다. system structure, non-functional
          characteristic, dependency, interface, security boundary, construction
          technique처럼 이후 선택을 제약하는 결정에 사용합니다. 작은 bug fix와
          prompt 문구 수정은 issue와 Changelog로 충분하며, decision이 없는 사건을
          억지로 ADR로 만들면 중요한 기록이 noise에 묻힙니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <ADRViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>option을 비교할 때 같은 decision driver를 사용합니다</h3>
        <p>
          고정 사례에서는 data loss가 번질 수 있는 범위, 부분 복구, 동시 갱신,
          migration 비용, 운영 복잡도를 decision driver, 즉 선택 기준으로 정합니다. “요즘 database가
          유행한다”처럼 option마다 다른 기준을 적용하면 결론을 재검토할 수
          없습니다. 정확한 수치가 없다면 임의 점수로 꾸미지 말고 현재 관찰과
          불확실성을 그대로 적습니다.
        </p>
        <p>
          여기서 atomic write는 파일 교체가 전부 성공하거나 기존 파일이 그대로
          남도록 쓰는 방식이고, transaction은 여러 읽기·쓰기를 한 작업 단위로
          묶어 commit 또는 rollback하는 장치입니다. 둘 다 중간 상태를 줄이지만,
          파일 하나의 안전한 교체와 여러 profile 사이의 일관성은 서로 다른
          문제입니다. 그래서 option 이름만 비교하지 않고 필요한 보장과 운영
          비용을 함께 적습니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 lg:grid-cols-3">
        {OPTIONS.map((option) => (
          <article
            key={option.name}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{option.name}</h3>
            <dl className="mt-3 space-y-3 text-xs leading-5">
              <div className="min-w-0">
                <dt className="font-semibold text-emerald-700 dark:text-emerald-300">얻는 것</dt>
                <dd className="mt-1 break-words text-muted-foreground">{option.benefit}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-semibold text-amber-700 dark:text-amber-300">감수할 것</dt>
                <dd className="mt-1 break-words text-muted-foreground">{option.cost}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례의 ADR</h3>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-muted p-4 text-sm">
          {`---
id: ADR-005
title: profile state를 파일별로 분리한다
status: accepted
date: 2026-04-18
supersedes: ADR-004
---

## Context
single JSON replace에서 한 profile의 empty 결과가 전체 state 갱신 경로에
영향을 줄 수 있었다. profile 단위 복구와 diff가 어려웠다.

## Options
A. single JSON + validation/atomic write 강화
B. profile별 파일 + 파생 index
C. transactional database

## Decision
B를 선택한다. profile file을 정본(source of truth)으로 두고 index는 재생성할 수 있는
파생 데이터로 취급한다.

## Consequences
- 부분 갱신과 profile 단위 rollback이 쉬워진다.
- index rebuild, migration, cross-profile consistency code가 늘어난다.
- profile 수와 concurrent write가 현재 가정을 넘으면 database option을 재검토한다.`}
        </pre>
        <p>
          원래 Nygard 형식의 핵심은 title, status, context, decision,
          consequences입니다. 위 예시는 비교 과정을 보이려고 options를 더했습니다.
          template을 무조건 확장하는 것이 중요한 게 아니라 한 ADR이 significant
          decision 하나를 소유하고, positive·negative·neutral consequence를 함께
          남기며, 다시 볼 조건을 알아볼 수 있어야 합니다.
        </p>

        <p>
          상태 이름도 읽는 사람이 같은 뜻으로 해석해야 합니다. 보통
          <code>proposed</code>는 검토 중, <code>accepted</code>는 채택됨,
          <code>deprecated</code>는 더는 새 작업에 권하지 않음,
          <code>superseded</code>는 뒤의 ADR이 대신함을 뜻합니다. 팀이 다른 상태를
          쓰더라도 각 상태가 구현·배포 완료를 포함하는지 문서에서 분명히
          정의해야 합니다.
        </p>

        <h3>accepted와 implemented는 다른 상태입니다</h3>
        <p>
          <code>accepted</code>는 stakeholder가 decision을 채택했다는 뜻이지
          migration이 끝났거나 production behavior가 검증됐다는 뜻은 아닙니다.
          implementation task, rollout, rollback readiness, data migration test는
          issue나 deployment artifact에서 추적하고 ADR에서 link합니다. 결정이
          뒤집히면 원문을 덮어쓰지 않고 <code>superseded</code>로 표시한 뒤 새
          ADR을 연결해야 과거 code가 어떤 context에서 작성됐는지 남습니다.
        </p>
      </div>

      <div
        id="paper-nygard-adr"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          근거 읽기 · Documenting Architecture Decisions
        </p>
        <CitationBlock
          source="Michael Nygard — Documenting Architecture Decisions"
          citeKey={2}
          type="paper"
          href="https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> code에는 최종 선택이 남아도 그 선택을 만든 기술·조직·project-local forces와 consequence는 시간이 지나며 사라집니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> architecturally significant decision을 repository의 작고 독립적인 record로 남기고 title, status, context, decision, consequences를 보존합니다.</p>
            <p><strong>전제·조건:</strong> 한 ADR은 한 project의 significant decision 하나를 다루며, 상태가 바뀌면 번호를 재사용하거나 원문을 삭제하지 않고 replacement를 연결합니다.</p>
            <p><strong>근거 범위:</strong> ADR의 목적, 기본 template, superseded history를 보존하는 이유를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> options section, 이 글의 filename·승격 기준, profile별 파일이라는 선택이 Nygard가 정한 표준이거나 모든 project에 최적이라는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>ADR이 Lessons로 바뀌는 것은 아닙니다</h3>
        <p>
          ADR-005는 이 project가 이 context에서 내린 decision을 소유합니다.
          “기존 non-empty state를 derived empty output으로 자동 replace하지
          않는다”는 판단은 다른 storage와 migration에도 재사용할 수 있으므로
          Lessons의 후보가 됩니다. decision history와 현재 행동 원칙은 관련이
          있지만 서로 다른 문서가 소유해야 합니다.
        </p>
      </div>
    </section>
  );
}
