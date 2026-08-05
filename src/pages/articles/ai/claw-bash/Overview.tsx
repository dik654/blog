import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import BashExitSemanticsStepViz from './viz/BashExitSemanticsStepViz';
import BashPipelineViz from './viz/BashPipelineViz';
import ShellBoundaryLab from './viz/ShellBoundaryLab';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">문자열 하나가 실행되기까지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          파일 도구는 <code>path</code>와 <code>operation</code>이 나뉘지만 shell command는 한
          문자열 안에 pipeline, redirection, substitution, 새 process를 함께 담는다. 그래서
          <code>rm</code> 같은 단어를 찾는 일과 실제 피해 범위를 제한하는 일은 서로 다른 문제다.
          전자는 위험 <strong>신호</strong>이고, 후자는 OS가 강제하는 <strong>containment</strong>다.
        </p>
        <p>
          아래 실험실은 production shell runner의 여섯 경계를 바꿔 보게 하고, 이어지는 호출 경로는
          실제 실행을 일곱 단계로 펼친다. 색 표시는 현재 snapshot에서 확인된 구현 정도이며, 모든
          경계가 이미 닫혔다는 뜻이 아니다.
        </p>
      </div>

      <ShellBoundaryLab />
      <BashPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>현재 production 호출 경로</h3>
        <p>
          도구 dispatcher는 먼저 command의 첫 단어와 겉으로 드러난 path를 보고
          <code>WorkspaceWrite</code> 또는 <code>DangerFullAccess</code>를 고른다. enforcer가 전달된
          경우 permission을 확인한 뒤 <code>run_bash</code>로 간다. 여기서 먼저
          <code>workspace_test_branch_preflight()</code>를 실행하며, stale/diverged branch 결과가
          나오면 sandbox와 shell 실행 전에 직렬화된 결과를 즉시 반환한다. preflight가
          <code>None</code>일 때만 <code>execute_bash</code>를 부른다. 별도 파일의
          <code>validate_command()</code>는 이 경로에서 호출되지 않는다.
        </p>
        <div className="not-prose my-5 grid gap-3 md:grid-cols-2">
          {[
            ['1. 분류', '첫 command와 단순 path heuristic으로 필요한 permission mode를 추정한다.'],
            ['2. 승인', 'enforcer가 있는 호출 경로에서만 mode와 policy를 검사한다. Deny면 execute_bash에 진입하지 않는다.'],
            ['3. branch preflight', 'workspace test 명령이면 freshness를 검사하고 stale/diverged 결과를 조기 반환할 수 있다.'],
            ['4. 상태 계산', 'preflight를 통과한 요청만 설정과 platform support를 합쳐 SandboxStatus를 만든다.'],
            ['5. 실행', 'Linux unshare launcher가 생기면 사용하고, 없으면 sh -lc로 실행한다.'],
            ['6. 관찰', 'foreground는 timeout과 stdout/stderr를, background는 PID만 반환한다.'],
            ['7. 해석', '0이 아닌 정상 exit는 exit_code:N으로 남지만 signal 의미는 따로 남지 않는다.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-border p-4">
              <p className="m-0 text-sm font-semibold">{title}</p>
              <p className="mb-0 mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="not-prose my-4 flex flex-wrap gap-2">
          <CodeViewButton
            onClick={() => onCodeRef('tools-dispatch', codeRefs['tools-dispatch'])}
            label="optional enforcer dispatch 보기"
          />
          <CodeViewButton
            onClick={() => onCodeRef('tools-bash-gateway', codeRefs['tools-bash-gateway'])}
            label="Bash 분류·preflight gateway 보기"
          />
          <CodeViewButton
            onClick={() => onCodeRef('bash-execution', codeRefs['bash-execution'])}
            label="Bash 입출력과 실행 진입점 보기"
          />
          <CodeViewButton
            onClick={() => onCodeRef('sandbox-launch', codeRefs['sandbox-launch'])}
            label="launcher와 fallback 분기 보기"
          />
        </div>

        <h3>입력 schema가 말해 주는 것</h3>
        <p>
          입력에는 command와 timeout뿐 아니라 background 여부, sandbox 강제 해제,
          namespace/network 요청, filesystem mode, 허용 mount가 들어간다. 이 필드들은
          <strong>요청</strong>이다. 예를 들어 <code>filesystemMode=workspace-only</code>라고
          적었다고 해서 실제 mount 경계가 강제됐다고 결론 내리면 안 된다. 뒤에서 status와 launcher를
          확인해야 한다.
        </p>

        <h3>timeout은 응답 상태이지 process 종료 증명은 아니다</h3>
        <p>
          foreground 구현은 <code>tokio::time::timeout(command.output())</code>으로 기다림을 제한한다.
          그러나 이 snapshot에는 새 process group을 만들고 timeout 때 전체 group에 signal을 보낸 뒤
          reap하는 코드가 보이지 않는다. 따라서 “timeout 응답을 돌려줌”과 “shell의 모든 자식이
          종료됨”을 구분해야 한다.
        </p>
        <p>
          background 분기는 더 얇다. stdin/stdout/stderr를 null로 두고 spawn한 뒤 PID 문자열을 즉시
          반환한다. task registry, 로그 경로, 취소 API, descendant cleanup은 이 함수에 없다. 장시간
          서버 실행을 제품 기능으로 만들려면 별도 lifecycle manager가 필요하다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton
            onClick={() => onCodeRef('bash-timeout-output', codeRefs['bash-timeout-output'])}
            label="timeout·출력·exit 처리 보기"
          />
        </div>

        <h3>exit code를 성공/실패 한 비트로 줄일 수 없는 이유</h3>
        <p>
          <code>grep</code>과 <code>rg</code>의 1은 “match 없음”, <code>diff</code>의 1은 “서로
          다름”, <code>test</code>의 1은 “조건이 거짓”이다. 현재 runner는 이들을 모두
          <code>exit_code:1</code>로 기록한다. command별 의미를 붙이지 않으면 agent는 정상적인 탐색
          결과를 장애로 오해하고 불필요한 재시도를 할 수 있다. 반대로 존재하지 않는 실행 파일처럼 shell이
          명령 자체를 시작하지 못한 경우는 보통 127처럼 다른 exit code가 된다. 이 경우는 “정상 실행 뒤
          결과가 없음”이 아니라 dispatch·environment 실패로 분류해야 한다.
        </p>
      </div>

      <BashExitSemanticsStepViz />
    </section>
  );
}
