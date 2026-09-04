import HookProtocolViz from "./viz/HookProtocolViz";

const processLimits = [
  ["Process", "argv 실행·canonical cwd·process-tree cancellation"],
  ["Environment", "allowlist 기반 env와 최소 secret"],
  ["I/O", "versioned JSON·stderr log·size limit"],
  ["Isolation", "non-root·filesystem·network·resource boundary"],
] as const;

export default function ShellExecution() {
  return (
    <section id="shell-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Hook subprocess는 작은 protocol worker로 실행한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          shell hook은 설정이 간단하지만 host의 file, environment, network에 접근할 수 있는 외부 코드입니다. 문자열 command를 shell에 넘기는
          기능으로 보면 안 됩니다. 정해진 JSON request를 받아 제한된 JSON response를 반환하는 protocol worker로 취급합니다.
        </p>
        <p className="leading-7">
          hook binary나 script의 신뢰 수준은 hook이 검사하는 tool보다 자동으로 높지 않습니다. provenance는 따로 확인합니다. project config에서
          처음 발견된 executable은 source와 digest를 보여주고 승인을 받는 방식, 또는 신뢰된 admin policy에서 배포한 hook만 자동 실행하는 방식이 있습니다.
        </p>

        <div className="not-prose my-8">
          <HookProtocolViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {processLimits.map(([title, body]) => (
          <article
            key={title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          shell parsing보다 argv 실행을 기본으로 둔다
        </h3>
        <p className="leading-7">
          hook command가 고정 executable과 arguments로 표현될 수 있다면
          <code>execve</code> 계열의 argv 실행을 사용해 quoting과 command
          substitution을 피합니다. pipeline이나 redirect가 꼭 필요한 hook만
          명시적으로 shell mode를 선택하고, 그 자체를 더 높은 risk로 표시합니다.
        </p>
        <p className="leading-7">
          working directory는 canonical workspace boundary 안에서 결정하며
          config의 상대 경로를 그대로 넘기지 않습니다. timeout이나
          cancellation에서는 direct child만 종료하지 말고 process group 또는 job
          object로 descendant process까지 정리합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          inherited environment는 allowlist로 줄인다
        </h3>
        <p className="leading-7">
          parent environment 전체를 넘기면 API key, cloud credential, 그 밖의 provider token이 hook에 노출될 수 있습니다. PATH 같은
          최소 runtime variable과 event ID, workspace처럼 필요한 metadata만 명시적으로 넣습니다. secret은 해당 hook이 요구하는 scope로만
          전달합니다.
        </p>
        <p className="leading-7">
          hook input JSON에도 full prompt나 file content를 기본으로 넣지
          않습니다. matcher와 검사에 필요한 field만 전달하고 큰 artifact는
          permission이 적용된 reference로 접근하게 하면 유출 범위를 줄일 수
          있습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          stdout은 protocol, stderr는 진단으로 분리한다
        </h3>
        <p className="leading-7">
          single request hook은 stdin에서 versioned JSON object 하나를 받고 stdout에 response object 하나만 씁니다.
          streaming이 필요하다면 framing이 명확한 JSON Lines 같은 별도 protocol을 정합니다. 일반 log는 stderr로 보내야 parser가 안내 문구를
          response로 오인하지 않습니다.
        </p>
        <p className="leading-7">
          response에는 protocol version과 event ID, outcome, reason code, optional user message를 넣고 unknown field
          정책도 함께 정합니다. stdout·stderr 모두 byte limit를 적용하고 truncation 여부를 기록해 악성 hook이 memory와 context를 고갈시키지
          못하게 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          parse failure 정책은 hook의 criticality에 따른다
        </h3>
        <p className="leading-7">
          security pre-hook이 malformed JSON이나 timeout을 냈다면 판단할 수
          없으므로 fail-closed합니다. optional post telemetry hook은 원래 tool
          result를 보존한 채 hook failure만 기록할 수 있습니다. production에서
          debug mode를 끄는 것으로 안전해지는 것이 아니라 config가 이 차이를
          명시해야 합니다.
        </p>
        <p className="leading-7">
          error message에는 hook ID, phase, exit status, timeout, redacted stderr까지 포함하되 input과 environment의
          secret은 그대로 출력하지 않습니다. 같은 failure가 반복되면 bounded circuit breaker로 hook을 격리합니다. 필수 hook이면 operator에게
          escalation합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          hook도 Bash와 같은 격리 계층을 사용한다
        </h3>
        <p className="leading-7">
          subprocess라는 이유만으로 격리되는 것은 아닙니다. non-root, read-only
          root filesystem, 제한된 writable path, seccomp·resource limit와 egress
          policy를 위협 모델에 맞게 적용합니다. 구체적인 shell validation과
          sandbox의 한계는 <a href="/ai/claw-bash">Bash 실행과 검증</a>에서
          이어서 확인할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
