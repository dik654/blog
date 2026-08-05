export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          claw 의 hook 시스템은 <strong>3 이벤트 (PreToolUse / PostToolUse / UserPromptSubmit) + JSON stdin/stdout + shell command 단일 transport</strong><br />
          원본은 <strong>28 이벤트 + 4 transport (shell + agent LLM + HTTP webhook + prompt inject) + 별도 라이프사이클 모듈</strong> = <code>utils/hooks.ts</code> 5,022 LOC + <code>utils/hooks/</code> 8,743 LOC = 13,765 LOC<br />
          가장 큰 갈라짐 — 이벤트 25 개 누락 + transport 3 종 누락
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">두 가지 "hook" 구분 — 헷갈림 방지</h3>
        <p>
          원본 Claude Code 에는 두 종류의 "hook" 이 있음<br />
          1. <strong>React UI hooks</strong> (<code>src/hooks/</code> 104 files) — useTextInput, useTasks 같은 UI 훅. 이 글의 hook 과 무관<br />
          2. <strong>User-defined hooks</strong> (<code>src/utils/hooks.ts</code> 5,022 LOC + <code>utils/hooks/</code> 8,743 LOC) — settings.json 에 등록하는 shell command / agent / HTTP webhook. 이 글이 다루는 대상<br />
          비교 대상은 2번 — 같은 이름이라 헷갈리니 명시
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">28 Hook Events — claw 의 3개와 차원이 다름</h3>
        <p>
          원본 <code>src/entrypoints/sdk/coreTypes.ts</code> 의 <code>HOOK_EVENTS</code>:<br />
          <code>PreToolUse</code>, <code>PostToolUse</code>, <code>PostToolUseFailure</code>, <code>Notification</code>, <code>UserPromptSubmit</code>, <code>SessionStart</code>, <code>SessionEnd</code>, <code>Setup</code>, <code>Stop</code>, <code>StopFailure</code>, <code>SubagentStart</code>, <code>SubagentStop</code>, <code>PreCompact</code>, <code>PostCompact</code>, <code>PermissionRequest</code>, <code>PermissionDenied</code>, <code>TeammateIdle</code>, <code>TaskCreated</code>, <code>TaskCompleted</code>, <code>Elicitation</code>, <code>ElicitationResult</code>, <code>ConfigChange</code>, <code>WorktreeCreate</code>, <code>WorktreeRemove</code>, <code>InstructionsLoaded</code>, <code>CwdChanged</code>, <code>FileChanged</code><br />
          claw 의 3 개는 <code>PreToolUse</code> / <code>PostToolUse</code> / <code>UserPromptSubmit</code> 에 매핑 — 25 개 이벤트가 누락
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">본질 차이</h3>
        <div className="overflow-x-auto not-prose my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">claw (이 글)</th>
                <th className="border border-border px-3 py-2 text-left">원본 Claude Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Transport</td>
                <td className="border border-border px-3 py-2">shell command only</td>
                <td className="border border-border px-3 py-2">shell + agent (sub-LLM) + HTTP webhook (SSRF guard) + prompt inject (4 종)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Output 스키마</td>
                <td className="border border-border px-3 py-2"><code>{'{ permission, reason? }'}</code> 단일</td>
                <td className="border border-border px-3 py-2"><code>hookSpecificOutput</code> 이벤트별 다른 스키마 (permissionDecision / additionalContext / agentInstructions)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">PreCompact / PostCompact</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">customInstructions + userDisplayMessage mutate (compact 글 cross-link)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Session hooks</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">SessionStart / SessionEnd / Setup — <code>sessionHooks.ts</code> 447 LOC, additionalContext + agentInstructions 주입</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">FileChanged + watcher</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>fileChangedWatcher.ts</code> 191 LOC — 파일 변경 자동 감지</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">AsyncHookRegistry</td>
                <td className="border border-border px-3 py-2">없음 (동기 실행)</td>
                <td className="border border-border px-3 py-2">309 LOC — fire-and-forget hook (session-end 등)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Trust 시스템 연동</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>shouldSkipHookDueToTrust</code> — untrusted workspace 자동 비활성</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">자동 등록 source</td>
                <td className="border border-border px-3 py-2">settings.json 만</td>
                <td className="border border-border px-3 py-2">settings.json + markdown frontmatter + skill 메타데이터</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">4 Transport — shell 만이 아닌 hook</h3>
        <p>
          claw 는 <code>/bin/sh -c</code> 로 shell command 실행만 지원. 원본은 4 종:<br />
          <strong>Shell command</strong> — <code>/bin/sh -c</code> spawn (claw 와 동일)<br />
          <strong>Agent hook</strong> (<code>execAgentHook.ts</code> 339 LOC) — hook 으로 sub-agent 실행. agent definition 을 가진 hook 이 LLM 한 번 돌려서 결정. 정적 shell script 로 못 표현하는 정책을 LLM 으로 위임<br />
          <strong>HTTP webhook</strong> (<code>execHttpHook.ts</code> 242 LOC + <code>ssrfGuard.ts</code> 294 LOC) — POST 로 외부 서버 호출. SSRF 방어 (private IP, link-local, DNS rebinding 차단), timeout, retry. Slack / PagerDuty / SIEM 같은 외부 시스템과 연동<br />
          <strong>Prompt inject hook</strong> (<code>execPromptHook.ts</code> 211 LOC) — hook 결과를 LLM prompt 에 사용자 메시지처럼 inject. issue tracker / PR description / 외부 컨텍스트 자동 주입
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">PreCompact / PostCompact — claw-compaction 글과의 cross-link</h3>
        <p>
          원본의 <code>/compact</code> 슬래시는 hook chain 을 트리거<br />
          <strong>PreCompactHooks</strong> 가 <code>customInstructions</code> 를 mutate — hook 이 "이런 관점으로 요약해" 같은 지시를 LLM 프롬프트에 추가 가능<br />
          <strong>PostCompactHooks</strong> 가 <code>userDisplayMessage</code> 를 mutate — 압축 후 사용자에게 표시할 메시지 변경<br />
          claw 의 컴팩션은 결정론적이라 hook 자체가 없음 — 두 시스템이 hook ↔ compact 두 축 모두에서 다름
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">SSRF Guard — HTTP webhook 의 안전판</h3>
        <p>
          <code>ssrfGuard.ts</code> 294 LOC — HTTP hook 이 <strong>private IP / link-local / DNS rebinding</strong> 을 못 찌르도록 차단<br />
          왜 필요? 사용자가 무심코 hook URL 을 <code>http://192.168.0.1/...</code> 같은 내부 호스트로 설정하면 LLM agent 가 사내 망 스캔 도구가 됨<br />
          claw 는 HTTP transport 자체가 없어 이 위험은 자연 회피 — 그러나 enterprise 사용 시 HTTP webhook 이 필수가 되면 SSRF 방어가 첫 lane
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">자동 등록 — frontmatter + skill</h3>
        <p>
          claw 는 settings.json 에 명시 등록만<br />
          원본은 <code>registerFrontmatterHooks.ts</code> 67 LOC — markdown 의 frontmatter 메타데이터에 hook 정의 → 자동 등록<br />
          <code>registerSkillHooks.ts</code> 64 LOC — skill 메타데이터의 hook 자동 등록<br />
          <code>hooksConfigSnapshot.ts</code> 133 LOC — 실행 중 config 변경되면 race condition 발생. snapshot 떠서 일관성 보장 (claw 는 단일 read 라 race 없음)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 이렇게 갈라졌나</p>
          <p>
            <strong>claw 의 3 이벤트 + shell-only</strong> — hook 이 단순할수록 사용자가 디버깅 쉬움. 5단계 execute_hook 파이프라인이 명확. "Pre 훅 {'<'} 500ms" 같은 guideline 이 의미를 가짐. PolicyEngine + Recovery 와 결합되면 더 깊은 자동화는 다른 layer 에서 표현
          </p>
          <p className="mt-2">
            <strong>원본의 28 이벤트 + 4 transport + 13,765 LOC</strong> — Claude 가 enterprise / multi-agent / production 환경에서 동작해야 하는 운영 요구. PreCompact (LLM 압축의 통합 지점) / SessionStart (CLAUDE.md 동적 로드) / FileChanged (file watcher 자동 트리거) / TeammateIdle (swarm 의 lifecycle 통합) / HTTP webhook (외부 시스템 연동) / SSRF guard (security) — 각각이 운영 시나리오의 응답
          </p>
          <p className="mt-2">
            <strong>가장 흥미로운 누락</strong>: <code>PreCompact</code> + <code>FileChanged</code> + Agent hook (LLM 으로 정책 결정) — 이 셋은 "정적 shell script 로 못 표현하는 패턴" 의 대표 예. claw 의 다음 lane 이 들어갈 자리
          </p>
        </div>

      </div>
    </section>
  );
}
