export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          claw 의 task/team/cron 은 <strong>in-memory registry 698 LOC</strong> + 풍부한 <code>TaskPacket</code> 구조<br />
          원본은 <strong>다종 task class + 실 spawn + cron daemon + 4,585 LOC swarm + iTerm/tmux backend</strong> = 약 13,000 LOC<br />
          <code>PARITY.md</code> Lane 4-6 이 명시: <code>"in-memory lifecycle behavior on main; they still stop short of a real background scheduler or worker fleet"</code>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">본질 차이 — 양방향</h3>
        <p>
          이 글의 비교는 일방향이 아님 — claw 가 단순화한 영역도 있고, <strong>claw 가 추가한 설계도 있음</strong>
        </p>
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
                <td className="border border-border px-3 py-2 font-semibold">Task 종류</td>
                <td className="border border-border px-3 py-2">단일 TaskPacket</td>
                <td className="border border-border px-3 py-2">LocalAgent / LocalShell / RemoteAgent / LocalMainSession / Dream / InProcessTeammate (6+ 종)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">실제 실행</td>
                <td className="border border-border px-3 py-2">in-memory ack 만</td>
                <td className="border border-border px-3 py-2">실 spawn + lifecycle + kill + progress streaming</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Cron 영속성</td>
                <td className="border border-border px-3 py-2">in-memory</td>
                <td className="border border-border px-3 py-2"><code>.claude/scheduled_tasks.json</code> + multi-session lock + missed recovery + jitter + aging</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Cron daemon</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">1초 polling scheduler, lock takeover, file watcher (<code>cronScheduler.ts</code> 565 LOC)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Pane backends</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">iTerm + tmux + InProcess pane — 진짜 터미널 멀티플렉서 자동 setup</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Swarm / Permission sync</td>
                <td className="border border-border px-3 py-2">TeamRegistry CRUD</td>
                <td className="border border-border px-3 py-2"><code>inProcessRunner.ts</code> 1,552 + <code>permissionSync.ts</code> 928 + <code>teammateMailbox.ts</code> 1,183 — 진짜 멀티에이전트</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-400">TaskPacket 풍부 구조</td>
                <td className="border border-border px-3 py-2">goals / constraints / acceptance_criteria / depends_on / blocks 명시</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">없음 — agent definition + prompt 단순</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-400">Goal completion_check</td>
                <td className="border border-border px-3 py-2">자동 검증 명령</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">없음</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">claw 가 추가한 설계 — TaskPacket 의 가치</h3>
        <p>
          원본의 <code>LocalAgentTask.tsx</code> (682 LOC) 는 task 를 <strong>agent definition + prompt 텍스트</strong> 로 정의<br />
          claw 의 <code>TaskPacket {'{ goals, constraints, acceptance_criteria, depends_on, blocks }'}</code> 같은 구조화 필드는 <strong>원본에 대응하는 것이 없음</strong><br />
          이는 단순화의 결과가 아니라 <strong>claw 가 추가한 설계</strong> — 작업을 LLM 에게 자유 텍스트로 위임하는 대신 검증 가능한 구조로 명세<br />
          <code>completion_check</code> 처럼 자동 검증 명령까지 포함하면 — 작업 결과가 LLM 의 "끝났다고 주장" 이 아니라 코드로 확인 가능<br />
          <code>claw-policy-engine</code> 글의 PolicyEngine 과 결합되면 자율 자동화의 안전 layer 가 됨
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cron 의 어려움 — 거의 분산 시스템 문제</h3>
        <p>
          claw 의 <code>CronRegistry</code> 는 in-memory CRUD<br />
          원본의 cron 시스템 (<code>cronScheduler.ts</code> 565 + <code>cronTasks.ts</code> 458 + <code>cron.ts</code> 308 + <code>cronTasksLock.ts</code> 195 = 1,526 LOC) 이 푸는 진짜 문제들:<br />
          <strong>다중 세션 lock</strong> — Claude 인스턴스 여러 개 떠 있을 때 한 세션이 owner, 죽으면 다른 세션이 takeover<br />
          <strong>Missed task recovery</strong> — <code>findMissedTasks()</code> 가 idle 동안 놓친 fire 복구<br />
          <strong>Jitter</strong> — 동시 fire 방지<br />
          <strong>Aging + Permanent flag</strong> — recurring task 가 N 일 이상이면 자동 만료, 영속 task 는 만료 안 됨<br />
          <strong>Recurring × Durable 두 축</strong> — 반복 여부와 재시작 생존 여부를 분리<br />
          <strong><code>MAX_JOBS = 50</code> 캡 + cronToHuman 자연어 변환</strong><br />
          이것들 거의 다 분산 cron 의 고전 문제 — claw 가 in-memory 로 단순화한 만큼 이 모두를 후일 lane 으로 남김
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Swarm — 진짜 멀티에이전트는 4,585 LOC</h3>
        <p>
          claw 의 <code>TeamRegistry</code> 는 단순 store. 원본의 <code>utils/swarm/</code> 4,585 LOC 인프라:<br />
          <code>inProcessRunner.ts</code> (1,552) — 같은 프로세스에서 여러 에이전트 실행, message routing, lifecycle<br />
          <code>permissionSync.ts</code> (928) — leader → follower 권한 결정 sync<br />
          <code>teamHelpers.ts</code> (683) + <code>teammateMailbox.ts</code> (1,183) — 에이전트 간 메시지 큐<br />
          <code>backends/</code> 디렉토리 — <strong>iTerm / tmux / InProcess pane backend</strong>. 실제 터미널 멀티플렉서를 컨트롤해서 여러 Claude 인스턴스를 별도 pane 에 띄우고 reconnection / layout 복구까지<br />
          <code>coordinatorMode.ts</code> (369) — coordinator 가 worker 들 오케스트레이션<br />
          <code>RemoteAgentTask</code> (855) — WebSocket 으로 다른 머신의 Claude 호출<br />
          claw 의 <code>WorkerStatus</code> 명시 8-state 는 좋은 정리지만 — 진짜 swarm 은 이 정도 깊이가 들어감
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 이렇게 갈라졌나</p>
          <p>
            <strong>claw 의 trade-off</strong> — task 를 단일 TaskPacket 으로 통일하면서 풍부한 명세 구조 (Goal/Constraint/Acceptance) 추가. cron 은 in-memory 로 단순화. swarm 은 명시적 8-state machine 으로 정리. PolicyEngine + Recovery 와 결합한 자율 자동화 stack 이 claw 의 차별점
          </p>
          <p className="mt-2">
            <strong>원본의 13,000 LOC</strong> — 6+ task class / 진짜 cron daemon / iTerm·tmux 멀티플렉서 / 원격 agent 까지 — Claude 가 "사용자 머신에서 multi-agent 시스템을 운영" 한다는 광범위한 use case 에서 나옴
          </p>
          <p className="mt-2">
            <strong>둘 다 강점이 있는 양방향 차이</strong>. claw 의 TaskPacket 구조화는 원본에 없는 디자인 — 작업을 LLM 의 자유 텍스트로 두지 않고 검증 가능한 명세로 만든 결정
          </p>
        </div>

      </div>
    </section>
  );
}
