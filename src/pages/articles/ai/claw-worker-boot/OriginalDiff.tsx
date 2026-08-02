export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          claw 의 worker boot 는 <strong><code>WorkerStatus</code> 8-state 명시 상태머신 + TrustResolver + Misdelivery + Observe</strong><br />
          원본은 <strong><code>swarm/inProcessRunner.ts</code> 1,552 + <code>spawnInProcess</code> 328 + <code>permissionSync</code> 928 + <code>teammateMailbox</code> 1,183 + iTerm/tmux pane backend</strong> = 약 4,500 LOC<br />
          claw 의 명시 상태머신은 <strong>strength</strong> — 원본의 implicit state 보다 정리됨
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
                <td className="border border-border px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-400">상태 명시화</td>
                <td className="border border-border px-3 py-2"><code>WorkerStatus</code> 8 enum (Idle / Launching / TrustResolving / Ready / Running / Stopping / Stopped / Error)</td>
                <td className="border border-border px-3 py-2 text-muted-foreground"><code>inProcessRunner.ts</code> 1,552 LOC implicit state</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">TrustResolver</td>
                <td className="border border-border px-3 py-2">별도 모듈 (worker 권한 결정)</td>
                <td className="border border-border px-3 py-2"><code>permissionSync.ts</code> 928 LOC — leader → follower 권한 sync</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Misdelivery handling</td>
                <td className="border border-border px-3 py-2">명시 처리</td>
                <td className="border border-border px-3 py-2"><code>teammateMailbox.ts</code> 1,183 LOC — 메시지 큐 + dead letter</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Pane backend</td>
                <td className="border border-border px-3 py-2">in-process</td>
                <td className="border border-border px-3 py-2">iTerm / tmux 별도 pane — 실 터미널 멀티플렉서 자동 setup</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Reconnection</td>
                <td className="border border-border px-3 py-2">단순</td>
                <td className="border border-border px-3 py-2">119 LOC — pane 죽으면 재 spawn + layout 복구</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Observe (UI)</td>
                <td className="border border-border px-3 py-2">상태 모니터링</td>
                <td className="border border-border px-3 py-2">BackgroundTaskStatus / RemoteSessionProgress / ShellProgress UI 다수 + <code>useBackgroundTasks</code> hook</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">claw 의 strength — WorkerStatus 8-state 명시화</h3>
        <p>
          원본의 <code>inProcessRunner.ts</code> 1,552 LOC 는 worker lifecycle 을 함수 호출 흐름에 implicit 으로 풀어냄<br />
          상태가 명시 enum 이 아니라 — "현재 어느 함수 실행 중인가" 로 추론<br />
          claw 의 명시 8-state machine 은 <strong>오히려 정리된 디자인</strong>: Idle → Launching → TrustResolving → Ready → Running → Stopping → Stopped + Error 분기<br />
          상태 천이 contract 가 코드로 검증 가능 → 디버깅·테스트 쉬움<br />
          이 부분은 claw-subagent-orchestration 글과 cross-link
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">claw 의 단순화 — Pane backend / 진짜 swarm 인프라</h3>
        <p>
          원본의 swarm sub-system 4,500 LOC 는 worker 를 단순 process 가 아니라 진짜 터미널 환경에 띄움<br />
          <strong>iTerm / tmux backend</strong> — 별도 pane 으로 띄워서 사용자가 각 worker 의 출력 직접 봄<br />
          <strong><code>permissionSync</code> 928 LOC</strong> — leader (사용자 메인 세션) 가 결정한 권한을 follower (worker) 들에게 자동 sync. claw 의 TrustResolver 와 같은 의도지만 leader/follower 모델이 명확<br />
          <strong><code>teammateMailbox</code> 1,183 LOC</strong> — 에이전트 간 메시지 큐 + dead letter handling. claw 의 Misdelivery 가 같은 의도지만 mailbox 추상이 더 풍부<br />
          <strong><code>reconnection.ts</code> 119 LOC</strong> — pane 죽으면 재 spawn + 사용자 layout 복구
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">cross-link — claw-subagent-orchestration / claw-task-team</h3>
        <p>
          이 글의 비교는 task-team 글의 swarm 비교와 같은 코드베이스 (<code>utils/swarm/</code> 4,585 LOC) 를 다룸<br />
          claw 의 worker-boot 글은 <strong>"부팅 + 신뢰 + 메시지 라우팅"</strong> 에 집중<br />
          task-team 글이 <strong>"task lifecycle + cron daemon + multi-agent 오케스트레이션"</strong> 에 집중<br />
          두 글이 결합되면 claw 의 "swarm" 풀 그림 — 명시 상태머신 + TaskPacket 구조화 + PolicyEngine 연동
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 이렇게 갈라졌나</p>
          <p>
            <strong>claw 의 명시 상태머신</strong> — worker 의 lifecycle 을 enum 으로 1급 시민화. 디버깅 / 테스트 / 자동화 (PolicyEngine 의 trigger condition) 에서 모두 유리. <strong>이건 원본보다 정리된 설계</strong>
          </p>
          <p className="mt-2">
            <strong>원본의 4,500 LOC swarm</strong> — Claude 가 사용자 머신에서 진짜 터미널 환경에 multi-agent 를 띄우는 시나리오. iTerm/tmux 통합으로 사용자가 각 agent 출력 직접 봄. <code>permissionSync</code> 로 leader/follower 권한 모델, <code>teammateMailbox</code> 로 inter-agent 통신
          </p>
          <p className="mt-2">
            결국 <strong>"명시 상태 + PolicyEngine 자동화" vs "implicit state + 진짜 터미널 통합"</strong> — 둘 다 합리적이지만 claw 가 worker 자체의 lifecycle 명세에 더 강함
          </p>
        </div>

      </div>
    </section>
  );
}
