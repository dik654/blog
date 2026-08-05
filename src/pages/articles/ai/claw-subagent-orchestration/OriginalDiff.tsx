export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          claw 의 sub-agent 는 <strong>AgentTool + worktree isolation + TeamLead/Workers + AgentSelection (3 fixed type) + Guardrails</strong><br />
          원본은 <strong>AgentTool 6,072 LOC + LocalAgentTask 682 + RemoteAgentTask 855 + swarm 4,585 + coordinator 369 + teammateMailbox 1,183 = 약 13,000 LOC</strong> sub-system<br />
          이 글의 영역 (worker pane / 메모리 / mailbox / remote) 이 거의 모두 원본의 가장 큰 sub-system 들과 겹침
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
                <td className="border border-border px-3 py-2 font-semibold">Subagent type</td>
                <td className="border border-border px-3 py-2">3 fixed (Explore / Plan / general-purpose)</td>
                <td className="border border-border px-3 py-2">builtin 다수 + 사용자 정의 markdown frontmatter (<code>.claude/agents/</code>)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">사용자 정의 agent</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>loadAgentsDir.ts</code> — <code>.claude/agents/&lt;name&gt;.md</code> markdown frontmatter 자동 등록</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Agent memory</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>agentMemory.ts</code> + <code>agentMemorySnapshot.ts</code> — per-agent 영속 메모리 (다음 호출 시 inject)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Pane backend</td>
                <td className="border border-border px-3 py-2">worktree isolation (디렉토리 격리)</td>
                <td className="border border-border px-3 py-2">iTerm / tmux 별도 pane — 사용자가 각 sub-agent 출력 직접 봄</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Inter-agent 통신</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>teammateMailbox.ts</code> 1,183 LOC — 메시지 큐, send / receive / broadcast / reply</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Permission sync</td>
                <td className="border border-border px-3 py-2">Guardrails (정적 권한 위임)</td>
                <td className="border border-border px-3 py-2"><code>permissionSync.ts</code> 928 LOC — leader → worker 동적 sync, worker 새 권한 요청 시 leader 결정</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Coordinator</td>
                <td className="border border-border px-3 py-2">TeamLead 컨셉</td>
                <td className="border border-border px-3 py-2"><code>coordinatorMode.ts</code> 369 + worker fleet (spawn / kill / respawn / load balance)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Remote agent</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>RemoteAgentTask.tsx</code> 855 LOC — WebSocket 으로 다른 머신의 Claude 호출 (분산)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Fork / Resume</td>
                <td className="border border-border px-3 py-2">단발성</td>
                <td className="border border-border px-3 py-2"><code>forkSubagent</code> (부모 컨텍스트/권한/메모리 상속) + <code>resumeAgent</code> (일시 중지 후 재개)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Color manager</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>agentColorManager.ts</code> — 동시 실행 시 색깔 구별</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">사용자 정의 agent — <code>.claude/agents/&lt;name&gt;.md</code></h3>
        <p>
          원본의 가장 강력한 ergonomic feature 중 하나<br />
          markdown 파일 + frontmatter 만으로 새 agent 정의 가능 — 코드 수정·재컴파일 없음<br />
          예시:<br />
          <code>---<br />
          name: code-reviewer<br />
          description: PR 코드 리뷰 전문<br />
          tools: [Read, Grep, Glob]<br />
          model: sonnet<br />
          ---<br />
          {'<프롬프트 본문>'}</code><br />
          <code>loadAgentsDir.ts</code> 가 디렉토리 walk → frontmatter 파싱 → AgentTool 의 subagent_type 풀에 자동 합류<br />
          claw 의 3 fixed enum 과 비교 — sub-agent 라이프사이클 자체는 거의 같지만 <strong>"새 agent 추가" 의 cost 가 한 자릿수 차이</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Worktree isolation vs Pane backend — 다른 격리 방식</h3>
        <p>
          claw — git worktree 분리로 sub-agent 별 독립 디렉토리. 파일 시스템 충돌 회피<br />
          원본 — 추가로 iTerm / tmux pane 분리. 사용자가 각 sub-agent 의 실시간 출력을 별도 창에서 봄<br />
          worktree isolation 은 격리의 안전, pane backend 는 관찰의 ergonomics — 두 layer 가 다른 문제 해결<br />
          원본은 둘 다 활용, claw 는 worktree 만 — 시각적 분리는 다음 lane
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Remote Agent — 분산 시스템의 진입점</h3>
        <p>
          원본의 <code>RemoteAgentTask.tsx</code> 855 LOC 는 sub-agent 를 <strong>다른 머신</strong> 으로 위임<br />
          WebSocket 연결로 원격 Claude 인스턴스에 작업 전송 → 결과 streaming 회신<br />
          use case: 사용자 노트북에서 무거운 작업 (큰 코드베이스 탐색 / 빌드 / 테스트) 을 회사 서버로 offload<br />
          claw 는 in-process 만 — Remote 는 분산 시스템 추상이 별도로 필요
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">cross-link — claw-task-team / claw-worker-boot</h3>
        <p>
          이 글의 sub-agent 시스템은 task-team 글의 task lifecycle 과 worker-boot 글의 WorkerStatus 와 같은 실 코드 (<code>utils/swarm/</code> 4,585 LOC) 를 다룸<br />
          claw 의 분리 — sub-agent 글이 "AgentTool + isolation + Guardrails", task-team 글이 "TaskPacket + cron + 멀티 task class", worker-boot 글이 "8-state lifecycle"<br />
          세 글이 결합되면 claw 의 multi-agent 풀 그림 — claw-policy-engine 의 자율 자동화 stack 까지 합치면 차별점이 산
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 이렇게 갈라졌나</p>
          <p>
            <strong>claw 의 worktree + Guardrails + 3 fixed type</strong> — sub-agent 의 핵심 추상 (격리 + 권한 위임 + 작업 분류) 만. 자율 자동화 (PolicyEngine + RecoveryEngine + TaskPacket) 와 결합되면 충분. 새 agent 정의 비용은 ToolSpec + match arm 추가
          </p>
          <p className="mt-2">
            <strong>원본의 13,000 LOC</strong> — sub-agent 가 <strong>일상 ergonomics + 분산 시스템</strong> 두 축. <code>.claude/agents/</code> markdown 으로 사용자가 매일 새 agent 만듦, iTerm/tmux pane 으로 시각 분리, agent memory 로 다회 호출 학습, Remote agent 로 회사 서버 offload, color manager 로 동시 시각 구별
          </p>
          <p className="mt-2">
            결국 <strong>"sub-agent = 자율 자동화 building block" vs "sub-agent = 매일 쓰는 ergonomics + 분산 노드"</strong> — claw 의 단순함은 PolicyEngine 위 layer 에서 표현력 회복
          </p>
        </div>

      </div>
    </section>
  );
}
