import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import HookExecutionPathViz from './viz/HookExecutionPathViz';
import HookOutputSemanticsViz from './viz/HookOutputSemanticsViz';
import HookRegistrationViz from './viz/HookRegistrationViz';

type RebuiltProps = {
  onCodeRef: (key: string, ref: CodeRef) => void;
};

function CodeLinks({
  onCodeRef,
  links,
}: {
  onCodeRef: RebuiltProps['onCodeRef'];
  links: Array<[keyof typeof codeRefs, string]>;
}) {
  return (
    <div className="not-prose my-4 flex flex-wrap gap-2">
      {links.map(([key, label]) => (
        <CodeViewButton
          key={key}
          onClick={() => onCodeRef(key, codeRefs[key])}
          label={label}
        />
      ))}
    </div>
  );
}

export default function Rebuilt({ onCodeRef }: RebuiltProps) {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Hook은 permission 앞에서 요청을 다시 쓰는 middleware다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            현재 Claw runtime의 hook event는 <code>PreToolUse</code>, <code>PostToolUse</code>,
            <code>PostToolUseFailure</code> 세 가지다. 사용자 prompt를 가로채는
            <code>UserPromptSubmit</code>은 없다. 세 event 모두 command string 배열이며, 별도의
            matcher object도 없다. 등록된 script가 payload의 <code>tool_name</code>과
            <code>tool_input</code>을 보고 스스로 관심 없는 호출을 무시한다.
          </p>
          <p>
            가장 중요한 순서는 <strong>Pre → permission → tool → Post</strong>다. Pre hook이
            <code>updatedInput</code>을 반환하면 permission policy와 tool executor는 모두 수정된 입력을
            본다. 원래 입력으로 permission을 통과한 뒤 다른 입력을 실행하는 구조가 아니다. 같은 Pre 결과의
            <code>permissionDecision</code>은 최종 Allow가 아니라, 이번 authorization 요청에 붙는
            context다.
          </p>
        </div>

        <HookExecutionPathViz />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3>예제로 effective input을 추적한다</h3>
          <p>
            모델이 <code>{'{"command":"cargo test"}'}</code>를 보냈고 Pre hook이
            <code>{'{"hookSpecificOutput":{"updatedInput":{"command":"cargo test -q"},"permissionDecision":"ask"}}'}</code>를
            출력했다고 하자. runtime은 수정된 JSON을 문자열로 직렬화해 <code>effective_input</code>으로
            만든다. permission policy는 <code>cargo test -q</code>와 Ask override를 평가한다. 사용자가
            허용한 경우에만 tool도 <code>cargo test -q</code>를 실행한다.
          </p>
          <p>
            반대로 hook이 <code>permissionDecision: "allow"</code>를 반환해도 static deny rule은 그보다
            먼저 적용된다. static ask rule도 유지되고, active mode가 tool requirement보다 낮으면 일반
            escalation prompt 또는 Deny 경로로 떨어진다. Hook Allow는 정책을 우회하는 capability token이
            아니다.
          </p>
          <CodeLinks
            onCodeRef={onCodeRef}
            links={[
              ['hook-events', '세 event와 HookRunResult'],
              ['conversation-order', 'conversation 실행 순서'],
              ['permission-override-order', 'permission override 우선순위'],
            ]}
          />

          <h3>Pre와 Post가 바꿀 수 있는 것은 다르다</h3>
          <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
            {[
              ['Pre · input', 'updatedInput', 'permission과 tool이 볼 요청을 교체한다. 마지막 non-empty 값이 남는다.'],
              ['Pre · permission', 'allow / deny / ask context', 'static rule과 mode를 포함한 policy가 최종 Allow/Deny를 계산한다.'],
              ['Pre · feedback', 'systemMessage · reason · additionalContext', '나중에 tool result 또는 거부 이유에 함께 표시된다.'],
              ['Post · side effect', '되돌릴 수 없음', 'tool이 파일이나 외부 시스템을 이미 바꿨다면 hook 자체에는 rollback primitive가 없다.'],
              ['Post · result', 'message + error 재분류', 'deny/fail/cancel이면 최종 tool_result의 is_error를 true로 바꿀 수 있다.'],
            ].map(([phase, signal, effect]) => (
              <div key={phase} className="grid gap-2 px-4 py-3 sm:grid-cols-[130px_170px_minmax(0,1fr)]">
                <strong className="text-sm">{phase}</strong>
                <code className="break-words whitespace-normal text-xs">{signal}</code>
                <span className="text-sm leading-relaxed text-muted-foreground">{effect}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pre-post" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">여러 hook command는 언제 계속되고 언제 멈추는가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Event별 배열은 설정된 순서대로 동기 실행된다. 흔히 생각하는 “첫 Allow가 최종 판정” 구조가
            아니다. exit 0이고 parsed deny가 없으면 message를 누적하고, permission override와 updated
            input이 있으면 결과에 반영한 뒤 다음 command를 실행한다. 뒤 command가 같은 필드를 다시
            출력하면 뒤 값이 남는다.
          </p>
          <p>
            Chain을 즉시 멈추는 것은 Deny, Failed, Cancelled다. 이때 앞 command들이 이미 만든 message와
            override도 결과에 남는다. 따라서 순서는 단순 성능 문제가 아니라 정책 합성 규칙이다. 서로 다른
            조직 hook이 같은 input을 수정한다면 등록 순서를 contract로 테스트해야 한다.
          </p>
        </div>

        <HookOutputSemanticsViz />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <CodeLinks
            onCodeRef={onCodeRef}
            links={[
              ['hook-command-chain', 'command chain과 merge'],
              ['hook-protocol', 'exit code와 stdout parser'],
            ]}
          />

          <h3>실패는 event 위치에 따라 다른 결과를 만든다</h3>
          <p>
            Pre command가 exit 2를 반환하거나 JSON으로 block을 요청하면 tool은 실행되지 않는다. 다른
            non-zero exit, signal 종료, spawn 오류도 <code>Failed</code>가 되고 Pre 단계에서는
            fail-closed로 tool을 막는다. “hook 오류는 skip하고 다음 hook으로 간다”는 현재 동작이 아니다.
          </p>
          <p>
            Tool이 먼저 실패하면 <code>PostToolUseFailure</code> chain이 <code>tool_error</code>를 받는다.
            Tool이 성공하면 <code>PostToolUse</code>가 실행된다. 어느 post chain이든 deny, failure,
            cancellation이 발생하면 이미 수행된 tool을 되감지는 못하지만, model에 돌아가는 tool result는
            error가 된다. 이후 model이 복구 행동을 선택하게 만드는 control signal이다.
          </p>

          <h3>Malformed JSON과 plain text는 같지 않다</h3>
          <p>
            stdout 전체가 빈 문자열이면 변경 없는 Allow 결과다. <code>{'{'}</code> 또는 <code>[</code>로
            시작해 JSON을 의도한 흔적이 있지만 parse에 실패하면, runtime은 command와 stdout·stderr의
            bounded preview를 담은 diagnostic message를 만든다. JSON처럼 보이지 않는 text는 그대로
            feedback message가 된다. 첫 줄만 다시 parse하는 fallback은 없다.
          </p>
        </div>
      </section>

      <section id="shell-execution" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Shell subprocess는 extension boundary이지 sandbox가 아니다</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Unix에서는 hook command를 <code>sh -lc</code>로, Windows에서는 <code>cmd /C</code>로
            실행한다. stdin에는 event payload 전체를 JSON으로 쓰고, stdout·stderr는 pipe로 받는다.
            별도 process라는 사실은 Rust main process의 메모리 오류와 hook script 오류를 분리하지만,
            filesystem·network·credential 접근을 제한하는 containment는 만들지 않는다.
          </p>
          <p>
            현재 payload에는 <code>session_id</code>, workspace root, timestamp가 없다. 공통 필드는
            <code>hook_event_name</code>, <code>tool_name</code>, parsed <code>tool_input</code>,
            raw <code>tool_input_json</code>, result error flag다. 성공 post는 <code>tool_output</code>,
            failure post는 <code>tool_error</code>를 추가한다.
          </p>
          <div className="not-prose my-5 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
            <div className="min-w-0 bg-background p-4">
              <p className="text-sm font-semibold">stdin JSON</p>
              <div className="mt-3 space-y-2 text-xs leading-relaxed">
                <p><code>hook_event_name</code> · <code>tool_name</code></p>
                <p><code>tool_input</code> · <code>tool_input_json</code></p>
                <p><code>tool_output</code> 또는 <code>tool_error</code></p>
                <p><code>tool_result_is_error</code></p>
              </div>
            </div>
            <div className="min-w-0 bg-background p-4">
              <p className="text-sm font-semibold">주입되는 환경 변수</p>
              <div className="mt-3 space-y-2 text-xs leading-relaxed">
                <p><code>HOOK_EVENT</code> · <code>HOOK_TOOL_NAME</code></p>
                <p><code>HOOK_TOOL_INPUT</code> · <code>HOOK_TOOL_IS_ERROR</code></p>
                <p><code>HOOK_TOOL_OUTPUT</code> — post에 output이 있을 때만</p>
              </div>
            </div>
          </div>
          <CodeLinks
            onCodeRef={onCodeRef}
            links={[
              ['hook-protocol', 'stdin · env · stdout protocol'],
              ['hook-abort-loop', 'shell과 abort polling'],
            ]}
          />

          <h3>Abort는 hook 응답이 아니라 host signal이다</h3>
          <p>
            <code>HookAbortSignal</code>은 host가 공유하는 <code>AtomicBool</code>이다. Hook JSON에
            <code>permission: "abort"</code>를 출력해 세션을 종료하는 protocol은 없다. runner는 child가
            끝났는지 20ms마다 확인하다 signal이 켜지면 직접 child에 <code>kill</code>을 보내고 기다린다.
          </p>
          <p>
            시간 deadline은 별개다. 현재 코드에는 기본 2초 timeout도, per-hook timeout도 없다. 또
            process group이나 descendant tree 전체를 종료하는 코드도 보이지 않는다. 무한 실행, child가
            만든 descendant, 출력 pipe 포화 같은 failure mode를 production hardening 항목으로 남겨야
            한다.
          </p>

          <h3>현재 보장과 필요한 hardening</h3>
          <div className="not-prose my-5 divide-y divide-border rounded-md border border-border">
            {[
              ['현재', '동기 순서 보장', '앞 command 결과를 합친 뒤 다음 command를 시작한다.'],
              ['현재', 'host cancellation', 'AtomicBool을 polling해 직접 child를 kill한다.'],
              ['필요', 'deadline', 'event 또는 command별 wall-clock timeout과 명시적 timeout 결과가 필요하다.'],
              ['필요', 'process tree containment', 'process group/job object/cgroup 등으로 descendant까지 정리해야 한다.'],
              ['필요', '환경·작업 디렉터리 정책', '상속할 env, secret, cwd, filesystem·network 권한을 명시해야 한다.'],
              ['필요', 'output bound', 'stdout·stderr 크기 상한과 streaming drain 전략이 필요하다.'],
            ].map(([status, contract, detail]) => (
              <div key={`${status}-${contract}`} className="grid gap-2 px-4 py-3 sm:grid-cols-[64px_180px_minmax(0,1fr)]">
                <span className={`text-xs font-bold ${status === '현재' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                  {status}
                </span>
                <strong className="text-sm">{contract}</strong>
                <span className="text-sm leading-relaxed text-muted-foreground">{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="permission-override" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Settings와 plugin hook은 어디서 하나로 합쳐지는가</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            Hook 등록 source는 settings 하나가 아니다. Config loader가 merged settings의
            <code>hooks</code>에서 세 command 배열을 읽는다. 별도로 plugin registry는 enabled plugin의
            manifest hook을 검증하고 모은다. CLI bootstrap이 plugin hook을
            <code>RuntimeHookConfig</code>로 변환해 settings hook 뒤에 합친 뒤 Conversation을 만든다.
          </p>
          <p>
            Plugin의 상대 command path는 plugin root를 기준으로 resolve되고 실제 file인지 validation을
            거친다. Runtime merge는 event별 순서를 보존하면서 같은 command string의 중복을 제외한다.
            결과적으로 실행 순서는 settings precedence, enabled plugin registry order, dedupe 규칙에
            의존한다.
          </p>
        </div>

        <HookRegistrationViz />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <CodeLinks
            onCodeRef={onCodeRef}
            links={[
              ['runtime-hook-config', 'settings hook config'],
              ['plugin-hook-manifest', 'plugin hook schema와 validation'],
              ['cli-hook-merge', 'CLI bootstrap merge'],
            ]}
          />

          <h3>Hook command 자체를 신뢰할 것인가</h3>
          <p>
            Path validation은 “그 파일이 존재하는가”를 확인할 뿐, script가 안전하다는 뜻은 아니다. Hook은
            tool input과 output을 받고 shell 권한으로 실행된다. Plugin enablement와 project trust,
            command provenance, review·signature, secret redaction을 별도 운영 정책으로 다뤄야 한다.
          </p>
          <p>
            특히 audit hook이 실패하면 tool을 계속 실행할지 막을지는 가용성과 보안의 선택이다. 현재
            runtime은 Pre failure를 막고 Post failure를 result error로 표시하는 고정 semantics를 가진다.
            다른 정책을 추가한다면 <code>fail_open</code>/<code>fail_closed</code>를 문서화하고 event별
            테스트로 증명해야 한다. 존재하지 않는 설정을 현재 기능처럼 설명하면 안 된다.
          </p>

          <h3>설계 리뷰를 위한 네 개의 반례</h3>
          <div className="not-prose my-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Pre Allow + static Deny', '최종 Deny다. deny rule이 hook context보다 먼저 평가된다.'],
              ['Pre updatedInput + Ask', '수정된 input을 대상으로 사용자에게 승인 요청한다. 원본을 승인하지 않는다.'],
              ['Post Deny after write', '파일 변경은 남고 tool result만 error가 된다. rollback transaction이 아니다.'],
              ['Hook A Allow + Hook B update', 'B도 실행된다. message는 누적되고 B의 non-empty updatedInput이 남는다.'],
            ].map(([title, detail]) => (
              <div key={title} className="rounded-md border border-border p-4">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
