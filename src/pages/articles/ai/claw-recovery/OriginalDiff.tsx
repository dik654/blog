export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 관계 — claw 의 추가 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          이 글의 RecoveryEngine 은 <strong>원본 Claude Code 에 대응 모듈이 없는 claw 의 추가 설계</strong><br />
          <code>grep -r "RecoveryEngine" /home/heru/code/claude-analysis/src/</code> 결과 0건<br />
          PolicyEngine 위에서 동작하는 sub-system — Lane (자율 작업 단위) 의 실패 복구를 1급 시민화
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">원본의 가장 가까운 메커니즘들 — 다른 layer 의 retry</h3>
        <p>
          원본에 retry / reconnection / recovery 의 부분 조각들은 있음. 단 모두 <strong>transient error retry</strong> 이지 task-level recovery 가 아님:<br />
          <strong><code>services/api/withRetry.ts</code> 822 LOC</strong> — API retry policy. 401 (auth refresh + retry), 429 (rate limit + backoff), 500 (transient retry), prompt-too-long (retry 안 함), idempotency key, retry budget. 가장 깊은 retry 인프라이지만 <strong>API 호출 단위</strong><br />
          <strong><code>services/api/errors.ts</code></strong> — error classification. <code>PROMPT_TOO_LONG_ERROR_MESSAGE</code>, <code>getRetryDelay</code><br />
          <strong>LSP server crash recovery</strong> — <code>services/lsp/manager.ts</code>, <code>LSPServerInstance.ts</code> — language server 죽으면 재 spawn<br />
          <strong>MCP reconnection</strong> — <code>services/mcp/client.ts</code>, <code>useManageMCPConnections.ts</code> — MCP 연결 끊기면 exponential backoff 재시도<br />
          <strong><code>services/teamMemorySync/watcher.ts</code></strong> — file watcher recovery<br />
          <strong>REPL crash recovery</strong> — <code>screens/REPL.tsx</code> — UI 레벨 fail-safe<br />
          모두 <strong>인프라 layer</strong> 의 transient retry — claw 의 RecoveryEngine 이 다루는 "task 가 의도한 결과 못 만들었을 때 어떻게 복구" 와 다른 추상
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">claw 가 추가한 것 — Task-level recovery</h3>
        <p>
          claw 의 RecoveryEngine 은 위 조각들과 다른 layer 에서 동작:<br />
          <strong>RecoveryRecipe DSL</strong> — "이 실패 패턴 만나면 이 액션 시퀀스" 를 declarative 로 표현. 원본의 hardcoded retry policy (withRetry.ts 의 if-else 분기) 와 달리 사용자 정의 가능<br />
          <strong>StaleBranch detector</strong> — Lane 의 git branch 가 base 와 diverge 너무 멀어지면 자동 감지 → rebase / abort / escalate<br />
          <strong>Lane escalation</strong> — Recovery 가 자동 해결 못하면 사용자에게 escalate. PermissionEnforcer 의 ask 와 비슷하지만 task-level<br />
          <strong>Recipe 재사용</strong> — 자주 발생하는 실패 패턴 (예: "테스트 빨강 → npm install + 재시도") 을 recipe 로 등록<br />
          모두 <strong>"task 가 실패했을 때 자율 복구"</strong> 를 1급 시민화한 결정
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">PolicyEngine + RecoveryEngine — 자율 자동화 stack 의 두 축</h3>
        <p>
          PolicyEngine 만으로는 부족 — 모든 lane 이 의도대로 끝나지 않음<br />
          RecoveryEngine 이 PolicyEngine 의 안전판:<br />
          PolicyEngine 이 Lane trigger → RecoveryEngine 이 Lane 실패 catch → recipe 적용 → 재시도 / 다른 lane 으로 escalate / 사용자 알림<br />
          <strong>둘이 결합되면</strong> "Claude 가 코드 짜고 빌드 / 테스트 / 머지까지 사용자 개입 최소" 라는 시나리오가 그제야 production 가능<br />
          원본은 자율 자동화 자체가 1급 시민이 아니라 — recovery layer 도 인프라 retry (API / LSP / MCP) 만 깊이 있음
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">면접 차별점 — "자율 에이전트가 실패하면?"</h3>
        <p>
          "에이전트가 100% 정확하지 않은데 어떻게 production 에 쓸 수 있어?" 라는 질문에 답이 됨<br />
          claw 의 답: <strong>RecoveryEngine 으로 실패를 1급 시민화 + recipe DSL 로 알려진 실패 자동 복구 + escalation 으로 미지의 실패 사용자에게 위임</strong><br />
          단순 retry 아니라 <strong>실패 패턴 학습 + 사용자 정의 recovery action + lane state 통합</strong> 이라는 답
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 원본에 없고 claw 가 추가했나</p>
          <p>
            원본 Claude Code 는 <strong>API / LSP / MCP / REPL 같은 인프라 layer 의 transient retry 만 깊다</strong>. 822 LOC <code>withRetry.ts</code>, MCP exponential backoff, LSP 재 spawn — 모두 운영 시 발견된 실 문제의 응답
          </p>
          <p className="mt-2">
            그러나 <strong>"task 가 실패하면 어떻게?"</strong> 라는 질문은 원본에 없음 — 원본의 use case 가 사용자가 옆에 있는 pair programming 이라 task 실패는 사용자가 직접 보고 다음 prompt 결정. 자율 task 시나리오가 아님
          </p>
          <p className="mt-2">
            claw 는 자율 자동화 (PolicyEngine) 를 가정하므로 <strong>task-level recovery 가 필수</strong>. RecoveryEngine 이 그 답. 원본의 인프라 retry 와는 다른 layer 의 추상화
          </p>
        </div>

      </div>
    </section>
  );
}
