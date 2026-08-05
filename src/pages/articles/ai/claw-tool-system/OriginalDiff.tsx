export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          claw 의 도구 시스템은 <strong><code>ToolSpec</code> 4 필드 + 단일 <code>match</code> dispatch + 6 OnceLock registry</strong><br />
          원본은 <strong>42 도구 디렉토리 / 약 50,800 LOC / 도구마다 풀 lifecycle 객체</strong> — 각 도구가 자체 prompt / UI / permission / result rendering 모듈<br />
          claw 의 단순함은 ergonomics 결정 — 도구 추가가 "ToolSpec + match arm" 으로 끝남
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
                <td className="border border-border px-3 py-2 font-semibold">도구 정의</td>
                <td className="border border-border px-3 py-2"><code>ToolSpec {'{ name, description, input_schema, required_permission }'}</code> 4 필드</td>
                <td className="border border-border px-3 py-2"><code>buildTool({'{...}'})</code> 객체 15+ 필드 (searchHint / outputSchema / isEnabled / toAutoClassifierInput / getPath / render4종 / checkPermissions / validateInput / maxResultSizeChars / shouldDefer …)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">도구 추가</td>
                <td className="border border-border px-3 py-2">ToolSpec + execute_tool match arm</td>
                <td className="border border-border px-3 py-2"><code>tools/MyTool/</code> 디렉토리 + <code>buildTool</code> + UI 컴포넌트 + 자동 등록</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Output Schema</td>
                <td className="border border-border px-3 py-2">없음 (Value 자유 형식)</td>
                <td className="border border-border px-3 py-2"><code>outputSchema</code> 강제 — LLM 출력 형식 보장</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Feature flag</td>
                <td className="border border-border px-3 py-2">항상 40개 고정</td>
                <td className="border border-border px-3 py-2"><code>isEnabled</code> per tool — model / env / feature flag 의존</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">동적 prompt/description</td>
                <td className="border border-border px-3 py-2"><code>&apos;static str</code> 고정</td>
                <td className="border border-border px-3 py-2"><code>async () =&gt; ...</code> 동적 — model / context 의존</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Per-tool checkPermissions</td>
                <td className="border border-border px-3 py-2"><code>required_permission</code> 단일 enum</td>
                <td className="border border-border px-3 py-2"><code>bashPermissions.ts</code> 2,621 LOC 같은 도구별 깊은 권한 로직</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Stub 도구 (claw 자인)</td>
                <td className="border border-border px-3 py-2">AskUserQuestion / RemoteTrigger / TestingPermission stub</td>
                <td className="border border-border px-3 py-2">풀 구현 + 인터랙티브 UI</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">EnterWorktree / ExitWorktree</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">git worktree add/remove + cd, 동시 멀티 브랜치</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">"40 vs 921" 표현 보정</h3>
        <p>
          원본의 도구 수는 정확히 셈하면 <strong>약 42 디렉토리 / 50,800 LOC / 활성 도구 ~50종</strong><br />
          블로그가 인용하는 "921 모듈" 은 도구 자체가 아니라 모든 모듈 카운트 (도구 + UI + 서비스 + utils + 컴포넌트 …)<br />
          정확한 비교: claw 40 spec / claw <code>tools</code> crate 약 5K LOC / 원본 42 디렉토리 / 원본 도구 코드 50,800 LOC<br />
          claw 의 stub 까지 빼면 활성 도구 수는 더 줄어듦
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">AgentTool — 원본 도구 시스템에서 가장 큰 sub-system</h3>
        <p>
          claw 가 <code>Agent</code> 를 한 줄 spec 으로 처리. 원본의 <code>tools/AgentTool/</code> 는 <strong>6,072 LOC sub-system</strong>:<br />
          <code>AgentTool.tsx</code> (1,397) — 메인 도구 정의<br />
          <code>UI.tsx</code> (871) — sub-agent 진행 UI<br />
          <code>runAgent.ts</code> / <code>resumeAgent.ts</code> — 실행 / 재개 lifecycle<br />
          <code>forkSubagent.ts</code> — 부모 컨텍스트 포크 (compact 글의 forked agent 와 같은 메커니즘)<br />
          <code>agentMemory.ts</code> + <code>agentMemorySnapshot.ts</code> — agent 별 영속 메모리 (사용자 정의 agent 가 세션 간 학습)<br />
          <code>builtInAgents.ts</code> + <code>loadAgentsDir.ts</code> — <code>.claude/agents/</code> 디렉토리에서 사용자 정의 agent (markdown frontmatter) 로드<br />
          <code>agentColorManager.ts</code> — 여러 agent 동시 실행 시 색깔 구별<br />
          claw 가 단일 AgentRegistry + worktree isolation 으로 단순화한 부분이 원본에서는 거대한 영역
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3"><code>buildTool</code> 객체 — 도구 = 풀 lifecycle</h3>
        <p>
          원본 도구는 단순 spec 이 아니라 다음을 모두 갖춘 객체:<br />
          <strong>outputSchema</strong> — LLM 에게 출력 형식 보장. 도구별 결과 스키마 검증<br />
          <strong>isEnabled</strong> — feature flag 별 도구 풀 변동. 빌드 환경에 따라 도구 수가 달라짐<br />
          <strong>shouldDefer + searchHint</strong> — deferred tool 메커니즘. 처음에 spec 안 보내고 LLM 이 ToolSearch 로 찾아서 enable. 컨텍스트 토큰 절약<br />
          <strong>toAutoClassifierInput</strong> — auto mode YoloClassifier 가 사용할 텍스트 변환기<br />
          <strong>render 4종</strong> — toolUseMessage / toolResultMessage / progressMessage / rejectedMessage. Ink/React 컴포넌트<br />
          <strong>maxResultSizeChars per-tool</strong> — CronCreate 100,000 char cap. claw 는 stdout 8K / stderr 4K 통일<br />
          <strong>getPath</strong> — 결과 디스크 영속 경로 (CronCreate 는 <code>.claude/scheduled_tasks.json</code>)<br />
          claw 의 4 필드 ToolSpec 과 비교하면 — 도구 1개당 정보량이 한 자릿수 차이
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">EnterWorktree / ExitWorktree — claw 에 없는 도구</h3>
        <p>
          원본의 <code>EnterWorktreeTool</code> + <code>ExitWorktreeTool</code> — git worktree add / remove + cd 자동화<br />
          여러 브랜치를 동시에 별도 디렉토리에 두고 작업 가능 — main 에서 일하면서 PR 검토 브랜치를 같이 띄워두는 패턴<br />
          claw 에 이 도구가 없는 건 의도적 — sub-agent 가 worktree 분리로 격리된다는 design 이지만, 사용자가 직접 worktree 를 도구로 다루는 건 별개
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 이렇게 갈라졌나</p>
          <p>
            <strong>claw 의 ergonomics</strong> — 도구 = "ToolSpec 추가 + match arm 추가". LangChain 같은 데코레이터 보일러플레이트도 없음. 코드 읽기·새 도구 추가가 빠름. 60-70% 도구가 "input 받아 output 반환" 단순 패턴이라는 가정에서 합리적
          </p>
          <p className="mt-2">
            <strong>원본의 50,800 LOC</strong> — 도구가 단순 함수가 아니라 <strong>UI lifecycle 까지 포함한 객체</strong>. 진행 표시, 실패 렌더링, 사용자 거부 메시지, dynamic description 등이 도구 자체 책임. 결과 스키마 강제로 LLM 출력 안정화. feature flag 로 환경별 도구 풀 가변
          </p>
          <p className="mt-2">
            결국 <strong>"도구 = 함수" vs "도구 = 객체 lifecycle"</strong> 의 design decision. 둘 다 합리적 — claw 는 새 도구 추가의 cost 를 낮추고, 원본은 도구마다 풍부한 UI/권한/검증을 표현 가능하게 함
          </p>
        </div>

      </div>
    </section>
  );
}
