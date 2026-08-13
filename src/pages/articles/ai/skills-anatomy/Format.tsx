import FormatViz from "./viz/FormatViz";

const skillExample = `---
name: gh-fix-ci
description: Fix failing GitHub Actions checks on a PR. Use for CI failures; do not use for general repository review.
---

1. Identify the failing check and collect its log.
2. Reproduce the failure before editing.
3. Make the smallest in-scope change.
4. Re-run the failed check and relevant regression tests.
5. Report the cause, changed files, and verification evidence.`;

export default function Format() {
  return (
    <section id="format" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        SKILL.md는 선택을 위한 metadata와 실행을 위한 instructions를 나눈다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Skill directory의 필수 entry point는 <code>SKILL.md</code>이며,
          frontmatter의 <code>name</code>과 <code>description</code>이 필요합니다.
          Host는 전체 본문을 읽기 전에 이 metadata로 후보를 찾으므로 description에는
          내부 구현보다 사용자가 말할 법한 job, trigger와 비적용 경계를 앞부분에
          적어야 합니다. “코딩에 사용”처럼 넓은 설명은 거의 모든 요청과 충돌하고,
          “AST v4 pipeline”처럼 내부 명칭만 적으면 실제 요청과 매칭하기 어렵습니다.
        </p>
      </div>

      <div className="not-prose my-7 min-w-0 overflow-hidden rounded-lg border border-border/70 bg-muted/15">
        <div className="border-b border-border/70 px-4 py-3 text-xs font-bold text-muted-foreground">
          SKILL.md — trigger와 완료 조건이 보이는 최소 예시
        </div>
        <pre className="min-w-0 overflow-x-auto p-4 text-xs leading-6">
          <code>{skillExample}</code>
        </pre>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          본문은 명령형 단계, 필요한 input, 생성할 output, validation과 fallback을
          실행 순서대로 씁니다. 매번 자연어로 재판단할 이유가 없는 검사나 외부
          tooling은 <code>scripts/</code>, 긴 규약과 배경 문서는
          <code>references/</code>, report template·fixture·resource는
          <code>assets/</code>에 둡니다. 이렇게 수명을 나누면 Skill 본문은 짧게
          유지하면서도 필요한 근거를 잃지 않습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <FormatViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>agents/openai.yaml</code>은 OpenAI 제품의 선택적 metadata입니다.
          UI 표시, implicit invocation policy와 MCP tool dependency를 선언할 수
          있지만 Skill 표준의 필수 본문으로 취급해서는 안 됩니다. Script도
          기본값이 아니라 deterministic behavior나 외부 tooling이 실제로 필요한
          경우에만 추가하고, 실행 전 input·side effect·실패 처리까지 검토합니다.
        </p>
      </div>
    </section>
  );
}
