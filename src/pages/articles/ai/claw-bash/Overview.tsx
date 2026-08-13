import { Link } from "react-router-dom";

import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

const executionTrace = [
  {
    index: "01",
    owner: "MODEL",
    title: "Command proposal",
    detail:
      '로그인 401 원인을 찾기 위해 `rg -n "401|Unauthorized" src tests`를 실행하자고 제안합니다.',
    artifact: "tool name · 원본 JSON arguments",
  },
  {
    index: "02",
    owner: "HOST",
    title: "Shell · argv 해석",
    detail:
      "직접 argv 실행인지 shell string 실행인지 구분하고 quote·expansion·pipeline 구조를 보존합니다.",
    artifact: "command · shell · cwd · environment snapshot",
  },
  {
    index: "03",
    owner: "HOST",
    title: "Path · effect 분류",
    detail:
      "읽기·쓰기·network·process effect와 대상을 분류하고 해석하지 못한 부분을 Unknown으로 남깁니다.",
    artifact: "effect summary · target · uncertainty",
  },
  {
    index: "04",
    owner: "HOST",
    title: "Permission decision",
    detail:
      "현재 mode와 rule, 필요한 경우 좁게 묶인 사용자 승인을 적용합니다. Deny면 process를 만들지 않습니다.",
    artifact: "allow · deny · ask decision",
  },
  {
    index: "05",
    owner: "EXECUTOR",
    title: "Bounded process",
    detail:
      "허가된 command만 고정한 filesystem·network·resource 조건에서 시작합니다.",
    artifact: "attempt identity · 실제 isolation status",
  },
  {
    index: "06",
    owner: "EXECUTOR",
    title: "Typed observation",
    detail:
      "stdout·stderr·종료 상태·timeout·truncation을 구분하고 실제 workspace effect와 연결합니다.",
    artifact: "observation envelope · effect receipt",
  },
  {
    index: "07",
    owner: "HARNESS",
    title: "Deterministic verification",
    detail:
      "수정 뒤 같은 경계를 거쳐 login regression test를 다시 실행하고 예상한 diff만 남았는지 확인합니다.",
    artifact: "test receipt · workspace diff",
  },
] as const;

const snapshotVsHardening = [
  {
    label: "PINNED · 현재 확인",
    body:
      "Bash input을 deserialize하고 first-token·path heuristic으로 required mode를 정합니다. Enforcer가 주입된 dispatch에서는 실행 전에 그 mode를 검사합니다.",
  },
  {
    label: "PINNED · 실제 실행",
    body:
      "Runtime은 host current directory에서 command를 `sh -lc`로 실행하고 stdout·stderr·timeout·sandbox status를 직렬화합니다.",
  },
  {
    label: "HARDENING · 추가 계약",
    body:
      "Shell 전체 effect, policy generation, process tree, output artifact와 workspace diff를 같은 attempt ID에 묶고 deterministic test로 닫아야 합니다.",
  },
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Bash는 모델의 문자열을 host의 실제 effect로 바꾸는 경계입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사용자가 “로그인 요청이 왜 401로 끝나는지 찾아 최소 수정하고 test해
          주세요”라고 요청했다고 가정하겠습니다. 모델은 source를 찾기 위한
          command를 만들 수 있지만, 문자열을 생성했다는 사실만으로 실행 권한을
          얻지는 않습니다. 모델이 소유하는 것은 <strong>실행 제안</strong>이고,
          filesystem·network·process effect를 허용하는 주체는 host runtime입니다.
        </p>
        <p>
          이 글은 그 제안이 <strong>shell/argv 해석 → expansion과 path → 예상
          effect → permission → process → typed observation → deterministic
          test</strong>를 통과하는 순서를 추적합니다. 구현 사실은 독립 공개 Claw
          Code의 commit <code>b71afdd…</code>에만 귀속합니다. 아래에서
          <strong> PINNED</strong>는 그 snapshot에서 확인한 동작이고,
          <strong> HARDENING</strong>은 안전한 release를 위해 추가할 계약입니다.
        </p>
      </div>

      <ContentBoundary article="claw-bash" />

      <div className="not-prose my-7 grid min-w-0 gap-3 lg:grid-cols-3">
        {snapshotVsHardening.map((item) => (
          <article
            key={item.label}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-xs font-bold text-primary">
              {item.label}
            </h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>로그인 오류 한 건이 남겨야 하는 일곱 artifact</h3>
        <p>
          앞의 네 단계는 아직 외부 effect가 없는 proposal·판정 구간입니다. 다섯
          번째 단계에서 처음 process가 생기고, 여섯 번째 observation은 “실행을
          허가했다”는 기록이 아니라 실제로 관측한 결과입니다. 마지막 test가 같은
          수정본과 cwd에서 통과해야 “401을 고쳤다”는 결론을 낼 수 있습니다.
        </p>
      </div>

      <ol className="not-prose my-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:gap-6">
        {executionTrace.map((item) => (
          <li
            key={item.index}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <div className="flex min-w-0 items-center justify-between gap-3">
              <span className="text-xs font-bold text-primary">{item.index}</span>
              <span className="text-xs font-semibold text-muted-foreground">
                {item.owner}
              </span>
            </div>
            <h4 className="mt-3 break-words text-sm font-semibold text-foreground">
              {item.title}
            </h4>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {item.detail}
            </p>
            <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">
              <strong className="text-foreground/80">Artifact:</strong>{" "}
              {item.artifact}
            </p>
          </li>
        ))}
      </ol>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>argv 실행과 shell string 실행은 서로 다른 API입니다</h3>
        <p>
          <strong>직접 argv 실행</strong>은 executable과 argument 배열을 host가
          나눠 process API에 전달합니다. 이때 <code>|</code>, <code>&gt;</code>,
          <code>$VAR</code>는 자동으로 shell 문법이 되지 않습니다. 반대로
          <strong> shell string 실행</strong>은 문자열 하나를 shell interpreter에
          넘기므로 quote 제거, parameter expansion, command substitution,
          pipeline과 redirection이 shell 규칙에 따라 처리됩니다. 화면에 보인 첫
          token만으로 실제 effect를 판단할 수 없는 이유입니다.
        </p>
        <p>
          예를 들어 첫 제안인
          <code>rg -n &quot;401|Unauthorized&quot; src tests</code>는 눈에 보이는
          범위에서는 search입니다. 그러나
          <code>rg ... &gt; report.txt</code>는 file write를 만들고,
          <code>rg ... | sh</code>는 뒤쪽 process가 입력을 코드로 해석합니다.
          <code>rg &quot;$(cat "$HOME/.token")&quot; .</code>처럼 expansion이 먼저
          민감한 file을 읽을 수도 있습니다. 따라서 executable name, shell
          program, expansion source와 effect target을 서로 다른 field로 다뤄야
          합니다.
        </p>
        <p>
          Direct 실행이라면 executable은 <code>rg</code>, argv는
          <code>[&quot;-n&quot;, &quot;401|Unauthorized&quot;, &quot;src&quot;, &quot;tests&quot;]</code>로
          네 argument가 그대로 전달됩니다. Pinned 경로에서는 이 전체 text가
          <code>sh -lc</code>의 command string 한 개가 되고 shell이 quote 제거와
          expansion을 소유합니다. 두 경우 모두 host current working directory와
          inherited environment가 의미에 영향을 주므로 snapshot에 남겨야 합니다.
          Direct argv와 sanitized environment를 선호하는 것은 hardening 선택이며,
          pinned runtime이 이미 그렇게 실행한다는 설명이 아닙니다.
        </p>
      </div>

      <div
        id="paper-posix-shell-command-language"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          표준 근거 · POSIX Shell Command Language
        </p>
        <CitationBlock
          source="The Open Group Base Specifications — Shell Command Language"
          citeKey={1}
          type="paper"
          href="https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Shell string은 공백으로 나눈 argv가 아니라
              quoting, expansion, redirection과 compound command 규칙을 가진
              언어입니다.
            </p>
            <p>
              <strong>기여:</strong> POSIX 명세는 token recognition, expansion,
              redirection, pipeline과 command execution의 공통 의미를 정의합니다.
            </p>
            <p>
              <strong>가정:</strong> POSIX-compatible shell의 공통 범위이며 각
              shell extension, executable 동작과 platform 차이는 별도 확인합니다.
            </p>
            <p>
              <strong>근거:</strong> 첫 token이나 substring만으로 shell program의
              전체 effect를 증명할 수 없다는 일반 경계를 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> POSIX 문법을 모두 parse하면 runtime 권한,
              path race나 실행된 program 내부 effect까지 안전해진다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned dispatch는 first-token·path heuristic 뒤 선택적으로 권한을 검사합니다</h3>
        <p>
          <strong>PINNED:</strong> <code>tools/src/lib.rs</code>는 Bash schema를
          공개하고 JSON input을 <code>BashCommandInput</code>으로 deserialize합니다.
          그다음 첫 word의 basename이 제한된 read-only 목록에 있는지, token에
          workspace 밖으로 보이는 path가 있는지를 검사해 required mode를
          <code>WorkspaceWrite</code> 또는 <code>DangerFullAccess</code>로 정합니다.
          이 이름은 실제 file write가 확인됐다는 뜻이 아니라 pinned permission
          enum의 ordering에 맞춘 분류 결과입니다.
        </p>
        <p>
          Registry에 <code>PermissionEnforcer</code>가 주입돼 있으면 executor 전에
          required mode를 비교하고 부족할 때 error를 반환합니다. 하지만 enforcer
          인자는 <code>Option</code>이고, <code>execute_tool</code>은 enforcer 없이
          같은 dispatch를 호출할 수 있습니다. 따라서 “Bash tool을 사용하면 모든
          call path에서 permission이 강제된다”고 일반화할 수 없습니다.
        </p>
      </div>

      <div
        id="paper-claw-bash-tool-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          고정 근거 · Claw Code Bash tool dispatch
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned tools/src/lib.rs"
          citeKey={2}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/tools/src/lib.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Model-facing Bash arguments가 permission
              decision과 executor에 어떤 순서로 연결되는지 확인해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Pinned file은 Bash ToolSpec, input
              deserialization, <code>classify_bash_permission</code>, optional
              enforcer seam과 <code>run_bash</code> dispatch를 제공합니다.
            </p>
            <p>
              <strong>가정:</strong> Commit
              b71afddae100ced324457337925a694686b8fef2의 독립 공개 재구현
              snapshot이며 moving main이나 비공개 제품의 구조로 확대하지 않습니다.
            </p>
            <p>
              <strong>근거:</strong> 이 글의 schema·first-token/path
              classification·optional permission seam·runtime 호출 순서를
              뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> Heuristic이 shell semantics를 완전히
              이해하고 모든 call path가 enforcer를 거치며 production security가
              검증됐다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Runtime은 host cwd에서 최종적으로 sh -lc를 호출합니다</h3>
        <p>
          <strong>PINNED:</strong> <code>runtime/src/bash.rs</code>의 input에는
          command, timeout, description, background와 sandbox override가 있지만
          per-call <code>cwd</code> field는 없습니다. Runtime은 host process의
          current directory를 읽고, Linux namespace launcher를 만들 수 있으면
          <code>unshare … sh -lc command</code>를, 그렇지 않으면 바로
          <code>sh -lc command</code>를 준비합니다. 즉 permission 판정에 사용한
          cwd와 실행 시점의 cwd·environment가 같다는 보장은 별도 composition
          contract에서 확인해야 합니다.
        </p>
        <p>
          Foreground 결과는 stdout과 stderr를 각각 최대 16 KiB까지 보존하고,
          non-zero exit는 <code>returnCodeInterpretation</code>, timeout은
          <code>interrupted</code>와 structured timeout event, 요청·적용된 sandbox
          상태는 <code>sandboxStatus</code>로 반환합니다. 하지만 stable attempt ID,
          성공 시의 명시적 exit code, signal, 원본 출력 artifact digest, 실제
          process tree 종료와 workspace rollback은 이 file에서 확인되지 않습니다.
          따라서 timeout이나 error를 “아무 effect도 없었다”로 해석하면 안 됩니다.
        </p>
      </div>

      <div
        id="paper-claw-bash-runtime-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          고정 근거 · Claw Code Bash runtime
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned runtime/src/bash.rs"
          citeKey={3}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/bash.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 허가된 shell string이 어떤 cwd·launcher로
              실행되고 timeout과 output이 어떤 형태로 돌아오는지 확인해야 합니다.
            </p>
            <p>
              <strong>기여:</strong> Pinned file은 <code>BashCommandInput</code>,
              current-dir resolution, <code>sh -lc</code> preparation, foreground·background
              branch, timeout·truncation과 <code>BashCommandOutput</code>을 제공합니다.
            </p>
            <p>
              <strong>가정:</strong> 같은 commit의 tools dispatch, config와
              sandbox status를 함께 읽으며 platform과 host environment를 고정된
              것으로 간주하지 않습니다.
            </p>
            <p>
              <strong>근거:</strong> Shell invocation, per-call cwd 부재, 16 KiB
              truncation, timeout observation과 반환되는 sandbox status 범위를
              뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> Descendant process가 모두 정리되고 output이
              손실 없이 보존되며 timeout·failure 때 filesystem effect가 원자적으로
              rollback된다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>완료 판정은 command의 종료와 login test receipt를 분리합니다</h3>
        <p>
          <strong>HARDENING:</strong> Observation에는 run·call·attempt ID, command와
          shell, cwd·environment digest, policy·sandbox generation, start/end time,
          exit 또는 signal, timeout, truncation 여부와 원본 artifact reference를
          넣습니다. File을 바꿀 수 있는 command라면 before/after digest와 diff도
          같은 receipt에 연결합니다. 이 정보가 있어야 crash 뒤 재시도가 기존
          effect를 중복하는지 판단할 수 있습니다.
        </p>
        <p>
          로그인 사례의 deterministic test는 고정된 fixture로 401이 재현되고,
          최소 수정 뒤 예상 status와 response body가 나오며, 관련 없는 workspace
          diff가 없다는 세 조건을 확인합니다. Shell command가 exit 0이었다는 사실만
          가지고 login 동작이 고쳐졌다고 결론내리지 않습니다. 반대로 test timeout
          뒤에도 child나 file mutation이 남을 수 있으므로 effect receipt를 먼저
          reconciliation한 뒤 재실행합니다.
        </p>
      </div>

      <nav
        aria-label="Bash 글의 정본 경계"
        className="not-prose my-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:gap-6"
      >
        {[
          ["Tool registry", "/ai/claw-tool-system", "Schema·registry·dispatch 정본"],
          ["Permission", "/ai/claw-permissions", "Mode·rule·approval·enforcement 정본"],
          ["File operation", "/ai/claw-file-ops", "Direct read·edit와 workspace mutation 정본"],
          ["Sandbox security", "/ai/agent-sandbox-security", "OS·network·credential 격리 정본"],
        ].map(([label, href, note]) => (
          <Link
            key={href}
            to={href}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4 hover:border-primary/50"
          >
            <span className="break-words text-sm font-semibold text-foreground">
              {label}
            </span>
            <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">
              {note}
            </span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
