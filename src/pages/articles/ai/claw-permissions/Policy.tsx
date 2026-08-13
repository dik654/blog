import { CitationBlock } from "@/components/ui/citation";
import PolicyViz from "./viz/PolicyViz";

const MODES = [
  [
    "ReadOnly",
    "낮은 기본 경계",
    "읽기 계열 tool requirement를 충족합니다. 실제 Bash 분류와 path는 별도입니다.",
  ],
  [
    "WorkspaceWrite",
    "Workspace 변경",
    "Workspace 안의 edit·write처럼 이 mode 이하로 분류된 call을 허용합니다.",
  ],
  [
    "DangerFullAccess",
    "더 넓은 effect",
    "외부 path·network처럼 높은 requirement를 가진 call까지 허용할 수 있습니다.",
  ],
  [
    "Prompt",
    "Interactive caller로 위임",
    "Policy는 prompter가 있으면 묻고, 없으면 deny합니다. Enforcer helper의 deferral seam은 별도 확인이 필요합니다.",
  ],
  [
    "Allow",
    "명시적 전면 허용 mode",
    "Pinned enum의 mode입니다. Outer OS·sandbox ceiling을 제거한다는 뜻은 아닙니다.",
  ],
] as const;

const PRECEDENCE = [
  ["1", "denied_tools", "Tool name이 목록에 있으면 mode와 무관하게 즉시 Deny"],
  [
    "2",
    "deny rule",
    "실제 input subject가 맞으면 context override보다 먼저 Deny",
  ],
  [
    "3",
    "context override",
    "Deny는 즉시 거부, Ask는 prompt-or-deny, Allow는 ask rule과 충족되지 않은 mode를 우회하지 못함",
  ],
  ["4", "ask rule", "Interactive prompter에게 묻고, prompter가 없으면 Deny"],
  [
    "5",
    "allow rule · mode",
    "Allow rule이 있거나 active mode가 requirement를 충족하면 Allow",
  ],
  [
    "6",
    "escalation prompt · final deny",
    "Prompt mode 또는 WorkspaceWrite→DangerFullAccess는 묻고, 나머지 불충족은 Deny",
  ],
] as const;

const SUBJECTS = [
  ["Exact", "edit_file(src/auth.ts)", "추출한 subject가 정확히 같을 때 match"],
  ["Prefix", "edit_file(src:*)", "`:*` 앞 prefix로 시작할 때 match"],
  [
    "Any",
    "edit_file 또는 edit_file(*)",
    "해당 tool의 모든 non-empty input에 match",
  ],
  [
    "추출 순서",
    "command → path → file_path → … → url → pattern",
    "JSON object에서 처음 발견한 문자열을 쓰고, 없으면 raw input으로 fallback",
  ],
] as const;

export default function Policy() {
  return (
    <section id="policy" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Pinned PermissionPolicy는 mode와 rule을 정해진 순서로 평가합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Permission mode는 “현재 세션이 어느 정도의 tool을 기본적으로 허용할
          것인가”를 나타내고, 각 tool에는 필요한 mode가 연결됩니다. 로그인
          사례에서 repository 안의 <code>read_file</code>과
          <code>grep_search</code>는 ReadOnly로 분류될 수 있지만,
          <code>edit_file(src/auth.ts)</code>는 WorkspaceWrite가 필요합니다.
          Test는 command와 path를 실제로 분류한 뒤 requirement가 정해집니다.
        </p>
        <p>
          여기서 중요한 점은 “mode 숫자가 충분하면 끝”이 아니라는 것입니다.
          Pinned source는 denied tool과 deny rule을 먼저 검사하고, 그 뒤 hook이
          제공한 context override, ask/allow rule과 active mode를 결합합니다.
          Tool requirement가 등록되지 않은 이름은 안전 쪽으로
          <code>DangerFullAccess</code>를 요구합니다.
        </p>
      </div>

      <div className="not-prose my-8 min-w-0">
        <PolicyViz />
      </div>

      <div className="not-prose my-7 divide-y divide-border/70 rounded-lg border border-border/70">
        {MODES.map(([name, role, boundary]) => (
          <div
            key={name}
            className="grid min-w-0 gap-2 p-4 md:grid-cols-[9rem_10rem_minmax(0,1fr)] md:gap-5"
          >
            <code className="break-words text-xs font-bold text-primary">
              {name}
            </code>
            <p className="break-words text-sm font-semibold">{role}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {boundary}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>실제 precedence를 표처럼 따라가면 충돌도 계산할 수 있습니다</h3>
        <p>
          같은 <code>edit_file</code>에 allow와 deny가 동시에 걸려도 결과는 설정
          파일의 우연한 한 줄 순서로 정해지지 않습니다. Rule 종류 사이의
          precedence는 code에 고정돼 있고, 각 종류 안에서는 첫 matching rule을
          찾습니다. 따라서 아래 위쪽 단계에서 결론이 나면 그 아래 단계는
          실행하지 않습니다.
        </p>
      </div>

      <div className="not-prose my-7 space-y-3">
        {PRECEDENCE.map(([step, gate, result]) => (
          <div
            key={step}
            className="grid min-w-0 gap-2 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[2rem_9rem_minmax(0,1fr)] sm:gap-4"
          >
            <span className="text-xs font-bold text-primary">{step}</span>
            <p className="break-words text-sm font-semibold">{gate}</p>
            <p className="break-words text-sm leading-6 text-muted-foreground">
              {result}
            </p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          예를 들어 hook이 Allow를 요청해도 <code>denied_tools</code>나 deny
          rule을 뒤집지 못합니다. Ask rule이 있으면 여전히 사용자에게 물어야
          하고, allow rule도 outer authority ceiling이나 OS 권한을 만드는 기능은
          아닙니다. Prompt가 필요한데 prompter가 전달되지 않았다면
          <code>prompt_or_deny</code>는 Deny를 반환합니다. 이것이 policy 수준의
          fail-closed 경계입니다.
        </p>

        <h3>
          Rule matcher는 semantic parser가 아니라 문자열 subject matcher입니다
        </h3>
        <p>
          Pinned matcher는 tool name과 input에서 뽑은 문자열 하나를
          exact·prefix·any로 비교합니다. JSON object라면 command, path,
          file_path, URL, pattern 같은 정해진 key 중 처음 발견한 문자열을
          subject로 쓰며, parse하지 못해도 raw input이 비어 있지 않으면 그것을
          fallback으로 씁니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {SUBJECTS.map(([kind, sample, meaning]) => (
          <article
            key={kind}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold">{kind}</h3>
            <code className="mt-2 block break-all text-xs leading-5 text-primary">
              {sample}
            </code>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {meaning}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          따라서 <code>src:*</code>가 match됐다고 symlink 해석이나 canonical
          path, shell pipeline·redirect·substitution, URL redirect 뒤 최종
          host까지 안전한 것은 아닙니다. 이 matcher의 결과를 domain
          authorization으로 확대하지 말고, 실제 path와 command를
          dispatch·executor 경계에서 다시 분류해야 합니다.
        </p>
      </div>

      <div
        id="paper-claw-permission-policy-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          구현 근거 · Pinned PermissionPolicy
        </p>
        <CitationBlock
          source="Claw Code pinned permissions.rs"
          citeKey={3}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/permissions.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> 실제 tool call을 active mode, requirement,
              deny·ask·allow rule, context override와 interactive prompt로
              판정해야 합니다.
            </p>
            <p>
              <strong>핵심 아이디어·기여:</strong> Pinned source는 다섯 mode,
              subject matcher, denied tool→deny→override→ask/allow→mode/prompt의
              평가 순서와 no-prompter deny를 구현합니다.
            </p>
            <p>
              <strong>전제·조건:</strong> Commit b71afdd…의 config와 실제
              caller·tools dispatch를 함께 읽고 이 순서를 다른 제품이나 moving
              main에 일반화하지 않습니다.
            </p>
            <p>
              <strong>근거 범위:</strong> 해당 snapshot의 mode ordering, rule
              matching, override precedence와 prompt-or-deny behavior입니다.
            </p>
            <p>
              <strong>비주장:</strong> OS sandbox, canonical path, credential,
              network와 outer authority ceiling이 이 파일 하나로 보장된다는 뜻은
              아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
