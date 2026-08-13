import { CitationBlock } from "@/components/ui/citation";

import BannedPatternsViz from "./viz/BannedPatternsViz";
import PathEscapeCheckViz from "./viz/PathEscapeCheckViz";
import ValidationStagesViz from "./viz/ValidationStagesViz";

const validationLedger = [
  {
    question: "입력 구조가 유효한가?",
    answer:
      "Required field, type, timeout 범위와 추가 field를 검사합니다. 이는 JSON 모양에 대한 판정입니다.",
    artifact: "validated BashCommandInput 또는 structured input error",
  },
  {
    question: "셸은 무엇을 실행하는가?",
    answer:
      "Quote, expansion, pipeline, redirection과 command substitution을 포함한 shell program을 보존합니다.",
    artifact: "원문 command · shell/version · cwd/environment digest",
  },
  {
    question: "어떤 effect가 가능한가?",
    answer:
      "Read·write·network·process와 target을 보수적으로 분류하고 Unknown을 자동 허용하지 않습니다.",
    artifact: "effect summary · canonical target · uncertainty",
  },
  {
    question: "실행해도 되는가?",
    answer:
      "Host policy가 canonical 조건을 allow·deny·ask로 판정하며 deny는 process 생성 전에 끝납니다.",
    artifact: "policy generation이 붙은 decision · approval reference",
  },
] as const;

const negativeFixtures = [
  ["구조 오류", "command 누락·timeout 0·알 수 없는 field", "input error, process 0개"],
  ["Shell 우회", "rg ... | sh · $(...) · output redirection", "Unknown/상향 판정 또는 deny"],
  ["Path escape", "../ · symlink · 비슷한 문자열 prefix", "workspace 밖 handle 0개"],
  ["Permission 누락", "enforcer가 없는 dispatch composition", "release candidate 거부"],
  ["TOCTOU", "판정 뒤 symlink·directory entry 교체", "승인한 handle과 실제 handle 일치"],
] as const;

const permissionCases = [
  ["Some + Allow", "Argument-specific required mode를 만족", "Executor 호출 · typed result"],
  ["Some + Deny", "Active mode가 부족하거나 deny rule 일치", "Executor·process 0개 · typed denial"],
  ["Ask", "Action·actor·cwd·target·expiry에 묶인 승인 필요", "승인 전 process 0개"],
  ["None", "Pinned helper가 검사를 건너뛸 수 있음", "현재 bypass 가능 · release는 fail-closed"],
] as const;

export default function ValidationPipeline() {
  return (
    <section id="validation-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        문자열 검사는 실행 허가가 아니라 permission 판정 자료를 만듭니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          고정 사례의 첫 명령은
          <code>rg -n &quot;401|Unauthorized&quot; src tests</code>입니다. 이
          문자열이 비어 있지 않고 JSON Schema를 만족한다고 해서 실행해도 된다는
          뜻은 아닙니다. Host는 shell이 해석할 구조, 접근할 path와 가능한 effect를
          먼저 계산한 뒤 permission engine에 후보를 넘겨야 합니다. 이 판정이
          process 생성보다 앞에 있어야 deny가 실제 side effect를 막을 수 있습니다.
        </p>
        <p>
          <strong>Lexical check</strong>는 특정 token이나 pattern이 있는지 보는
          검사이고, <strong>semantic check</strong>는 shell expansion과 executable
          동작을 고려해 어떤 resource가 영향을 받는지 판단하는 검사입니다. 전자는
          빠르고 설명하기 쉽지만 quote·environment variable·subshell·interpreter
          내부 코드를 모두 이해하지 못합니다. 따라서 lexical allow를 semantic
          safety의 증명으로 사용하지 않습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ValidationStagesViz />
      </div>

      <div className="not-prose my-8 grid min-w-0 gap-4 sm:grid-cols-2 lg:gap-6">
        {validationLedger.map((item) => (
          <article
            key={item.question}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="break-words text-sm font-semibold text-foreground">
              {item.question}
            </h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">
              {item.answer}
            </p>
            <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">
              <strong className="text-foreground/80">남길 artifact:</strong>{" "}
              {item.artifact}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pinned production dispatch와 validation module은 같은 경로가 아닙니다</h3>
        <p>
          <strong>PINNED:</strong> 실제 tools dispatch는 input을 deserialize한 뒤
          <code>tools/src/lib.rs</code> 안의 별도
          <code>classify_bash_permission</code>을 호출합니다. 이 함수는 첫 token과
          간단한 path heuristic으로 required mode를 정하고, enforcer가 주어진
          경우에만 검사한 다음 <code>run_bash</code>를 호출합니다.
        </p>
        <p>
          한편 <code>runtime/src/bash_validation.rs</code>에는 read-only, destructive
          pattern, mode, <code>sed</code>, path와 command intent 검사가 구현돼
          있습니다. <code>validate_command</code>는 mode → sed → destructive →
          path 순서로 첫 non-Allow 결과를 반환합니다. 그러나 같은 pinned commit의
          production code에서 이 함수를 호출하는 경로는 확인되지 않고, module
          자체의 unit test만 확인됩니다. 따라서 아래 검사를 “현재 Bash executor가
          모두 강제한다”고 설명하면 source 범위를 넘습니다.
        </p>
      </div>

      <div
        id="paper-claw-bash-validation-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          고정 근거 · Claw Code Bash validation module
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned runtime/src/bash_validation.rs"
          citeKey={4}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/bash_validation.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Shell string을 mode·destructive signal·path와
              intent 관점에서 검사할 project module이 필요합니다.
            </p>
            <p>
              <strong>기여:</strong> Pinned file은 read-only·mode·sed·destructive·path
              validator, <code>CommandIntent</code> classifier와 first-non-Allow
              pipeline을 제공합니다.
            </p>
            <p>
              <strong>가정:</strong> Commit
              b71afddae100ced324457337925a694686b8fef2의 module과 tests이며 함수의
              존재와 production dispatch integration을 분리합니다.
            </p>
            <p>
              <strong>근거:</strong> 이 절의 lexical rule 종류, intent category와
              <code>validate_command</code> 내부 순서를 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> 모든 shell grammar를 해석하고 이 pipeline이
              Bash executor 앞에서 호출되며 Allow가 안전을 증명한다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Required mode 계산과 executor 앞 enforcement를 따로 시험합니다</h3>
        <p>
          Login edit처럼 WorkspaceWrite 이상이 필요한 command에서는 JSON input과
          required mode, actor·workspace·policy generation을 policy input으로
          보냅니다. <code>Some(PermissionEnforcer)</code>의 Allow만 executor로
          진행하고 Deny는 typed reason을 남긴 채 process를 만들지 않습니다. Ask는
          command 종류 전체가 아니라 action·actor·cwd·canonical target·expiry에
          묶인 승인을 받은 뒤 다시 판정합니다.
        </p>
        <p>
          Pinned <code>None</code> path는 검사를 건너뛸 수 있으므로 release
          composition에서는 enforcer를 required dependency로 바꿉니다. Missing
          enforcer, deny와 아직 소비되지 않은 ask는 모두 같은 negative invariant,
          즉 executor call·child process·workspace change가 0이라는 조건을
          만족해야 합니다.
        </p>
      </div>

      <div className="not-prose my-7 overflow-x-auto rounded-lg border border-border/70">
        <table className="w-full min-w-[720px] border-collapse text-left text-xs">
          <thead className="bg-muted/30 text-foreground/80">
            <tr>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">Case</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">Policy 판정</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">관찰</th>
            </tr>
          </thead>
          <tbody>
            {permissionCases.map(([name, decision, observation]) => (
              <tr key={name} className="border-b border-border/50 last:border-b-0">
                <td className="px-4 py-3 font-semibold text-foreground">{name}</td>
                <td className="px-4 py-3 text-muted-foreground">{decision}</td>
                <td className="px-4 py-3 text-muted-foreground">{observation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Banned pattern은 emergency brake로만 사용합니다</h3>
        <p>
          Root 삭제, raw device overwrite와 fork bomb처럼 정상적인 agent 작업에서
          필요할 가능성이 낮고 피해가 큰 표현은 일찍 거부할 수 있습니다. 다만
          substring rule은 <code>echo &quot;rm -rf /&quot;</code> 같은 설명 문장을
          막으면서 encoded payload나 다른 interpreter를 통한 간접 실행은 놓칠 수
          있습니다. 규칙마다 차단하려는 effect, 오탐 fixture와 알려진 bypass를
          함께 관리해야 합니다.
        </p>
        <p>
          특히 warning을 반환하는 함수가 존재한다는 사실만으로 사람이 실제
          warning을 봤거나 승인이 생성됐다고 볼 수 없습니다. Dispatch가 결과를
          소비하는지, warning 상태에서 process 수가 0인지, 승인 뒤 arguments가
          바뀌면 다시 판정하는지를 integration test로 확인해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <BannedPatternsViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Canonical path를 한 번 계산해도 TOCTOU는 남습니다</h3>
        <p>
          요청 시점의 cwd와 target을 문자열 prefix로 비교하면 <code>..</code>,
          <code>/work/app-old</code>처럼 비슷한 prefix와 symlink 때문에 workspace를
          벗어날 수 있습니다. Existing path는 canonical component 단위로
          비교하고, 아직 없는 output은 가장 가까운 existing parent와 새 component를
          나눠 검증해야 합니다. 실행 파일도 <code>PATH</code>에서 실제로 resolve된
          identity를 판정에 묶어야 합니다.
        </p>
        <p>
          그러나 검사 뒤 process가 file을 열기 전에 symlink나 directory entry가
          바뀌면, 검사한 대상과 실제 열린 대상이 달라지는
          <strong> TOCTOU</strong>(time-of-check to time-of-use) race가 생깁니다.
          Canonical string을 decision log에 남기는 일과 execution-time filesystem
          boundary를 강제하는 일은 서로 다른 층입니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <PathEscapeCheckViz />
      </div>

      <div
        id="paper-cwe-toctou"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          일반 근거 · CWE-367 TOCTOU race
        </p>
        <CitationBlock
          source="MITRE CWE-367 — Time-of-check Time-of-use Race Condition"
          citeKey={5}
          type="paper"
          href="https://cwe.mitre.org/data/definitions/367.html"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Resource를 검사한 뒤 사용할 때까지 상태가
              바뀌면 승인한 대상과 실제 effect 대상이 달라질 수 있습니다.
            </p>
            <p>
              <strong>기여:</strong> CWE-367은 check와 use 사이 경쟁을 줄이고,
              가능한 경우 동일한 handle이나 원자적 operation과 권한 경계를
              사용하도록 안내합니다.
            </p>
            <p>
              <strong>가정:</strong> 공격자나 동시 process가 symlink, directory
              entry 또는 resource state를 바꿀 수 있는 환경입니다.
            </p>
            <p>
              <strong>근거:</strong> Canonical path 검사만으로 execution-time
              filesystem boundary를 보장할 수 없다는 일반 원리를 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> Pinned Claw snapshot에서 특정 exploit이
              재현됐거나 canonicalization 자체가 쓸모없다는 뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release gate는 연결 여부와 effect 부재를 함께 검사합니다</h3>
        <p>
          <strong>HARDENING:</strong> Release composition은 validated input, shell
          program, canonical cwd·target, executable resolution, environment·policy
          digest와 effect summary를 하나의 decision에 묶어야 합니다. Path는 가능한
          경우 dirfd·handle 기반 API와 OS sandbox로 다시 제한하고, 해석하지 못한
          expansion이나 target은 fail-closed 또는 더 좁은 sandbox로 보냅니다.
        </p>
        <p>
          Login edit에서는 canonical root와 target을 check 시점에 기록한 뒤 parent
          directory handle을 기준으로 descriptor-relative open을 수행하고 symlink를
          따라가지 않는 no-follow resolution을 사용합니다. 새 file은 가능한 경우
          같은 directory에서 atomic create·rename으로 반영합니다. Decision의
          resource identity와 실제 handle identity, policy generation과 before/after
          effect를 같은 receipt에 넣어야 합니다. 이 절차도 platform별 API와 동시
          attacker를 사용한 negative test 없이는 완전하다고 주장할 수 없습니다.
        </p>
        <p>
          다음 negative fixture는 단순히 error string을 확인하는 test가 아닙니다.
          Deny·malformed·Unknown 뒤 child process와 workspace diff가 없고, 허용한
          로그인 search만 같은 cwd에서 실행됐다는 evidence까지 확인합니다.
        </p>
      </div>

      <div className="not-prose my-7 overflow-x-auto rounded-lg border border-border/70">
        <table className="w-full min-w-[720px] border-collapse text-left text-xs">
          <thead className="bg-muted/30 text-foreground/80">
            <tr>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">Fixture</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">입력</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">필수 관찰</th>
            </tr>
          </thead>
          <tbody>
            {negativeFixtures.map(([fixture, input, observation]) => (
              <tr key={fixture} className="border-b border-border/50 last:border-b-0">
                <td className="px-4 py-3 font-semibold text-foreground">{fixture}</td>
                <td className="px-4 py-3 text-muted-foreground">{input}</td>
                <td className="px-4 py-3 text-muted-foreground">{observation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 단계가 끝나도 만들어지는 것은 “실행 후보”일 뿐입니다. 최종 allow는
          다음 절의 host permission policy가 결정하고, 실제 effect 한도는 마지막
          절의 OS sandbox가 강제합니다. Login 수정의 완료 여부는 그 뒤에 남은
          observation·diff와 deterministic test receipt로만 판단합니다.
        </p>
      </div>
    </section>
  );
}
