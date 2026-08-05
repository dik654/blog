export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 관계 — claw 의 추가 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          이 글의 PolicyEngine 은 <strong>원본 Claude Code 에 대응하는 모듈이 없는 claw 의 추가 설계</strong><br />
          <code>grep -r "PolicyEngine" /home/heru/code/claude-analysis/src/</code> 결과 0건 — 원본의 1,902 TypeScript 파일 어디에도 없음<br />
          claw 가 자율 코딩 자동화를 1급 시민화하면서 새로 도입한 컨셉
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">원본의 가장 가까운 메커니즘들 — 그리고 왜 부족한가</h3>
        <p>
          원본에 자율 자동화의 부분 조각들은 있음:<br />
          <strong><code>cronScheduler.ts</code> 565 LOC</strong> — 시간 기반 trigger. 단 "조건 → 행동" 의 condition 표현력이 cron 표현식만<br />
          <strong><code>coordinatorMode.ts</code> 369 LOC</strong> — coordinator 가 worker 들 관리. 단 rule-based engine 이 아니라 명령 dispatch<br />
          <strong>Hook 시스템 (28 event)</strong> — 이벤트 기반 trigger. 단 hook output 이 다음 hook 의 input 이 되는 chain 은 약함<br />
          <strong>PermissionRule DSL</strong> — <code>Bash(git diff:*)</code> 같은 패턴 파싱. 단 권한 결정용이지 자동화 trigger 가 아님<br />
          이 조각들을 <strong>cron + sub-agent + hook + PermissionRule</strong> 로 조합하면 claw 의 PolicyEngine 일부 기능을 흉내 가능 — 그러나 통합 추상은 부재
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">claw 가 추가한 것 — 통합 자동화 추상</h3>
        <p>
          claw 의 PolicyEngine 은 위 조각들을 <strong>하나의 추상</strong> 으로 통합:<br />
          <strong>Lane (branch + workspace + task)</strong> — 자율 작업 단위. 한 lane = 한 git branch + 한 worktree + 한 task. 사용자가 여러 lane 을 동시 굴림. 원본의 LocalAgentTask + git worktree 조합으로 흉내 가능하지만 통합 모델 부재<br />
          <strong>Rule (condition + action)</strong> — 자동화 trigger. condition (시간/이벤트/상태) 가 만족되면 action (도구 호출/sub-agent 실행) 실행. 원본의 cron + hook 조합과 다른 점은 <strong>state machine 위에서 동작</strong><br />
          <strong>GreenContract (CI 통과 시 자동 merge)</strong> — build/test 통과를 lane 완료 조건으로. 원본은 수동 merge — Claude 가 코드 짜고 사용자가 검토하고 merge<br />
          <strong>LaneContext + Recipes</strong> — lane 별 컨텍스트 + 재사용 가능한 자동화 레시피
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">claw-task-team / claw-permissions 와의 결합</h3>
        <p>
          PolicyEngine 단독으로는 빈약 — 다른 claw 추가 설계와 결합되면 의미가 살아남<br />
          <strong><code>TaskPacket</code> 풍부 구조</strong> (claw-task-team 글) — Goal / Constraint / Acceptance / completion_check 가 PolicyEngine 의 condition 으로 사용. 작업 완료 조건을 LLM 의 자기 주장이 아니라 코드로 검증<br />
          <strong>WorkerStatus 명시 8-state</strong> (claw-worker-boot 글) — Lane 의 진행 상태를 명시 enum 으로 추적. PolicyEngine 의 trigger condition 으로 활용 가능<br />
          <strong>Fork/Merge session</strong> (claw-session 글) — Lane 별 분기 실험 + 결과 통합. PolicyEngine 의 다중 lane 병렬 실행 기반<br />
          <strong>RecoveryEngine</strong> (claw-recovery 글) — Lane 실패 시 복구. PolicyEngine 의 안전판
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">면접 차별점 — "자율 에이전트 자동화 어떻게 설계?"</h3>
        <p>
          이 질문에 답할 때 claw-policy-engine 은 강한 답이 됨<br />
          단순 cron + hook 조합 아니라 <strong>Lane state machine + Rule DSL + GreenContract</strong> 로 계산 가능한 자동화 추상화<br />
          원본 Claude Code 가 일상 도구라면 claw-policy-engine 은 <strong>자율 코딩 agent 의 운영 layer</strong> 가 되겠다는 design statement
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 원본에 없고 claw 가 추가했나</p>
          <p>
            원본 Claude Code 의 use case 는 <strong>"개발자가 IDE 에서 Claude 와 페어 프로그래밍"</strong> 이 중심. cron / sub-agent / hook 같은 자동화 조각들은 있지만 1급 시민이 아님 — 사용자가 매번 indirectly 조합
          </p>
          <p className="mt-2">
            claw 는 <strong>"자율 에이전트가 사람 개입 최소로 코드 작성·검증·merge"</strong> 시나리오를 1급 use case 로 가정. 그래서 PolicyEngine 이라는 통합 자동화 layer 가 필요. <code>TaskPacket</code> + <code>GreenContract</code> 로 작업 결과를 LLM 이 아니라 코드로 검증
          </p>
          <p className="mt-2">
            결국 <strong>"interactive pair programming" vs "autonomous coding"</strong> 의 use case 차이가 PolicyEngine 의 존재/부재를 결정
          </p>
        </div>

      </div>
    </section>
  );
}
