import { CitationBlock } from "@/components/ui/citation";

import SandboxViz from "./viz/SandboxViz";

const boundaries = [
  {
    title: "Filesystem",
    pinned: "Mode·allowed mount 문자열과 HOME·TMPDIR 변경",
    hardening: "실제 mount·handle 정책으로 workspace 밖 접근 차단",
  },
  {
    title: "Network",
    pinned: "요청한 경우 unshare launcher에 --net 추가",
    hardening: "기본 차단, proxy allowlist와 flow receipt",
  },
  {
    title: "Process",
    pinned: "PID namespace 요청과 foreground/background branch",
    hardening: "process group·descendant kill·reap 검증",
  },
  {
    title: "Resources",
    pinned: "Per-call wall-clock timeout과 output truncation",
    hardening: "cgroup/Job limit을 전체 process tree에 적용",
  },
] as const;

const releaseProbes = [
  ["filesystem", "workspace 밖 canary와 symlink를 읽고 쓰려는 command", "접근 실패 · host 변화 없음"],
  ["network", "DNS·redirect·metadata IP·private range egress", "flow 0개 또는 정확한 allowlist receipt"],
  ["timeout", "child가 grandchild를 만들고 parent가 대기", "deadline 뒤 descendant 0개 · 모두 reap"],
  ["background", "background child가 file을 계속 변경", "stable task ID · stop 후 추가 변화 0개"],
  ["rollback", "file 두 개를 바꾼 뒤 test failure", "candidate diff 격리 · baseline 보존"],
] as const;

export default function Sandbox() {
  return (
    <section id="sandbox" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Sandbox는 문자열 해석이 놓친 실제 side effect의 상한을 정합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          같은 shell effect를 여러 문자열로 표현할 수 있으므로 validation과 intent 분류만으로 안전을 보장하기 어렵습니다. sandbox는 command가 착한
          의도인지 맞히기보다 실제 process가 볼 수 있는 filesystem·network·다른 process와 사용할 resource를 제한합니다. permission이 “이
          action을 허용할지”를 결정한다면 sandbox는 허용 뒤에도 넘지 못할 바깥 경계입니다.
        </p>
        <p>
          고정된 Claw snapshot이 제공하는 것은 bubblewrap이나 VM이 아닙니다.
          <strong> PINNED:</strong> Linux에서 작동 가능한 <code>unshare</code>
          user-namespace mapping을 probe하고, mount·IPC·PID·UTS namespace와 선택적
          network namespace를 만든 뒤 그 안에서 <code>sh -lc</code>를 호출하는
          launcher입니다. 요청값·지원 여부·활성 상태를
          <code>SandboxStatus</code>로 돌려주지만, 이 상태값이 모든 isolation
          property를 증명하지는 않습니다.
        </p>
      </div>

      <div className="not-prose my-8">
        <SandboxViz />
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-4 sm:grid-cols-2">
        {boundaries.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
            <p className="mt-3 text-xs font-semibold text-primary">PINNED</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
              {item.pinned}
            </p>
            <p className="mt-3 text-xs font-semibold text-primary">HARDENING</p>
            <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
              {item.hardening}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>SandboxStatus는 요청·지원·활성을 나누지만 enforcement 증명서는 아닙니다</h3>
        <p>
          <strong>PINNED:</strong> Status에는 전체 enabled·supported·active 외에도
          namespace와 network의 supported·active, filesystem mode·active, allowed
          mounts, container marker와 fallback reason이 따로 있습니다. “요청함”과
          “지원됨”, “launcher에 반영됨”을 구분할 수 있다는 점은 유용합니다. 예를
          들어 network isolation의 default는 false이고, 요청했을 때만 launcher에
          <code>--net</code>이 추가됩니다.
        </p>
        <p>
          그러나 <code>filesystem_active</code>는 enabled이고 filesystem mode가
          off가 아니면 true로 계산됩니다. Launcher는
          <code>CLAWD_SANDBOX_FILESYSTEM_MODE</code>와 allowed mounts를 환경 변수로
          전달하고 <code>HOME</code>·<code>TMPDIR</code>를 workspace 아래 directory로
          바꾸지만, pinned <code>sandbox.rs</code>에는 read-only bind mount,
          allow-list mount 또는 workspace 밖 open을 차단하는 규칙이 없습니다.
          Mount namespace를 만들었다는 사실만으로 filesystem view가 제한되지는
          않습니다.
        </p>
      </div>

      <div
        id="paper-claw-bash-sandbox-source"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          고정 근거 · Claw Code sandbox status와 Linux launcher
        </p>
        <CitationBlock
          source="ultraworkers/claw-code — pinned runtime/src/sandbox.rs"
          citeKey={7}
          type="code"
          href="https://github.com/ultraworkers/claw-code/blob/b71afddae100ced324457337925a694686b8fef2/rust/crates/runtime/src/sandbox.rs"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Bash 요청의 namespace·network·filesystem 설정이
              host에서 지원되고 launcher에 반영됐는지 구분할 상태가 필요합니다.
            </p>
            <p>
              <strong>기여:</strong> Pinned file은 SandboxRequest·Status, container
              marker, working <code>unshare</code> probe와 Linux launcher arguments를
              제공합니다.
            </p>
            <p>
              <strong>가정:</strong> Commit
              b71afddae100ced324457337925a694686b8fef2의 Linux util-linux
              <code>unshare</code> 경로이며 host kernel·capability·seccomp 차이를
              별도로 확인합니다.
            </p>
            <p>
              <strong>근거:</strong> Namespace flags, opt-in network isolation,
              environment와 status·fallback 계산의 실제 범위를 뒷받침합니다.
            </p>
            <p>
              <strong>비주장:</strong> Bubblewrap, read-only/allow-list mount,
              credential 격리, resource limit과 fail-closed fallback이 구현됐다는
              뜻은 아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>지원되지 않는 격리를 status로만 알리고 직접 실행할 수 있습니다</h3>
        <p>
          <strong>PINNED:</strong> Namespace가 지원되지 않으면 status에 fallback
          reason이 생기지만 Bash runtime은 이 사실만으로 호출을 중단하지 않습니다.
          Linux launcher를 만들 수 없으면 host cwd에서 바로
          <code>sh -lc</code>를 준비합니다. Filesystem mode가 active로 표시되면
          <code>HOME</code>과 <code>TMPDIR</code>만 workspace 안 경로로 바꿉니다.
          따라서 status를 관찰할 수 있다는 것과 untrusted command가 fail-closed로
          중단된다는 것은 별개의 주장입니다.
        </p>
        <p>
          <strong>HARDENING:</strong> 요청한 property 중 하나라도 실제 backend에서
          강제되지 않으면 process를 만들지 않고 typed unsupported-policy error를
          반환합니다. 사용자가 명시적으로 신뢰한 local mode만 별도 downgrade로
          허용하고, observation에 요청 profile·실제 backend·빠진 property를
          기록합니다. Container marker도 격리 증명이 아니라 진단 signal로만
          사용합니다.
        </p>

        <h3>Filesystem 격리는 mount 또는 handle 정책으로 실제 open을 막아야 합니다</h3>
        <p>
          <strong>HARDENING:</strong> System binary와 library를 읽기 전용으로
          노출하고, ephemeral checkout과 작업별 temporary directory만 필요한
          범위에서 writable하게 만듭니다. Host home, SSH key, cloud credential,
          agent socket과 container daemon socket은 기본 view에서 제거합니다.
          Allowed mount는 문자열 목록을 환경 변수로 넘기는 데서 끝내지 않고,
          backend가 적용한 mount table이나 handle policy를 probe해 receipt로
          남깁니다.
        </p>
        <p>
          writable workspace는 그 안의 source를 보호하지 않습니다. 로그인 수정 command가 source를 지우거나 두 file 중 하나만 바꾼 뒤 실패할 수
          있습니다. pinned Bash runtime에는 filesystem effect의 atomic rollback이 확인되지 않으므로, candidate
          worktree·overlay에서 실행하고 deterministic test와 diff review가 통과한 뒤에만 선택한 patch를 baseline에 반영합니다.
        </p>

        <h3>Network는 command intent가 아니라 실제 egress 경로에서 제한합니다</h3>
        <p>
          <strong>HARDENING:</strong> Login source 조사와 local regression test에는
          network를 기본 차단합니다. Package나 API access가 꼭 필요하면 egress
          proxy에서 destination·method·size·credential class를 제한하고 metadata
          service와 private range를 차단합니다. URL이 command 문자열에 없더라도
          dependency가 통신할 수 있으므로 실제 flow와 proxy decision을 attempt
          receipt에 연결합니다.
        </p>

        <h3>Timeout은 observation이지 descendant process cleanup의 증거가 아닙니다</h3>
        <p>
          <strong>PINNED:</strong> Foreground path는 requested milliseconds로
          <code>command.output()</code> future를 감싸고 deadline을 넘으면 interrupted
          timeout output을 반환합니다. Test로 분류된 command는
          <code>test.hung</code>, 나머지는 <code>timeout</code> interpretation을
          사용합니다. Stdout과 stderr는 각각 16 KiB에서 잘리고 truncation marker가
          붙지만 full-output digest는 없습니다. Background path는 child를 spawn한 뒤
          numeric child ID만 반환하고 기다리지 않습니다. Pinned Bash·sandbox source에는
          별도 process group 생성, group signal, descendant enumeration·reaping이나
          session 종료 시 background tree cleanup을 증명하는 코드가 확인되지
          않습니다.
        </p>
        <p>
          PID namespace의 init process와 host에서 추적하는 process group은 해결하는 문제가 다릅니다. namespace는 process가 보이는 PID
          공간을 분리할 수 있지만 deadline 뒤 모든 descendant에게 종료 signal을 보내고 사라질 때까지 reap하는 lifecycle은 executor가 따로 소유해야
          합니다.
        </p>
      </div>

      <div
        id="paper-linux-process-groups"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          시스템 근거 · Linux process group
        </p>
        <CitationBlock
          source="Linux man-pages — setpgid(2)"
          citeKey={8}
          type="paper"
          href="https://man7.org/linux/man-pages/man2/setpgid.2.html"
        >
          <div className="space-y-2 font-sans">
            <p>
              <strong>문제:</strong> Shell이 만든 parent 하나만 추적하면 pipeline과
              grandchild가 deadline 뒤에도 남을 수 있습니다.
            </p>
            <p>
              <strong>기여:</strong> Linux process-group API는 관련 process를 같은
              group identity에 배치해 lifecycle과 signal 대상을 구성할 표준
              primitive를 제공합니다.
            </p>
            <p>
              <strong>가정:</strong> POSIX/Linux process semantics이며 executor가
              spawn 시 group을 만들고 권한·race·reaping을 올바르게 처리해야 합니다.
            </p>
            <p>
              <strong>근거:</strong> Descendant cleanup을 단일 child handle drop과
              구분하고 명시적인 process-tree lifecycle로 설계해야 한다는 근거입니다.
            </p>
            <p>
              <strong>비주장:</strong> Process group만으로 namespace·cgroup·daemonized
              escape가 모두 해결되거나 pinned Claw가 이 API를 사용한다는 뜻은
              아닙니다.
            </p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Release executor는 process tree와 resource를 하나의 lifecycle로 닫습니다</h3>
        <p>
          <strong>HARDENING:</strong> Spawn 전에 새 process group 또는 platform별 job
          object를 만들고 attempt ID와 leader identity를 기록합니다. Timeout·cancel·
          session 종료에는 group 전체에 graceful signal을 보낸 뒤 짧은 deadline을
          두고 강제 종료하며, descendant가 0이 될 때까지 reap합니다. CPU·memory·PID·
          file size와 wall-clock limit은 단일 parent가 아니라 cgroup 또는 동등한
          backend로 전체 tree에 적용합니다.
        </p>
        <p>
          observation은 process created, timeout signaled, force killed, descendants remaining을 각각 구분합니다. 여기에
          final exit/signal과 output truncation도 별도 항목으로 둡니다. cleanup 중 host가 crash하면 stable task identity로 다시
          조회해 종료를 이어 갑니다. effect 완료 여부를 모른 채 login test나 edit를 곧바로 중복 실행하지는 않습니다.
        </p>

        <h3>Crash 뒤에는 먼저 effect를 reconciliation하고 같은 command를 재실행합니다</h3>
        <p>
          Login command가 <code>src/auth.ts</code> 수정은 끝냈지만 test 중 timeout되고
          result 저장 전에 host가 crash했다고 가정하겠습니다. Planned operation
          ID와 canonical command·cwd·environment digest, authorization receipt가
          durable해야 이 attempt를 다시 찾을 수 있습니다. 저장된 result가 없다는
          이유만으로 edit가 실행되지 않았다고 판단하면 안 되며, 완료 상태는
          ambiguous입니다.
        </p>
        <p>
          복구 시 stable idempotency key로 process-group·cleanup status를 조회하고 workspace before/after digest와 실제
          diff를 effect receipt로 재구성합니다. child가 남으면 먼저 정리합니다. edit가 이미 적용됐으면 같은 mutation을 blindly rerun하지 않고
          deterministic login test만 새 attempt로 실행합니다. 상태를 판정할 수 없거나 안전한 compensation이 없으면 baseline worktree를
          폐기하거나 사람에게 escalation합니다. 이는 exactly-once 보장이 아니라 reconciliation 뒤 중복 effect를 줄이는 계약입니다.
        </p>

        <h3>실제 backend를 공격하는 probe와 login test를 한 release gate로 묶습니다</h3>
        <p>
          config snapshot이나 status boolean만 검사하지 않고 release artifact가 실행되는 동일 host/backend에서 아래 probe를 수행합니다.
          각 fixture는 expected denial뿐 아니라 host에 file·flow·descendant가 남지 않았다는 negative evidence를 요구합니다.
        </p>
        <p>
          paired 평가는 pinned base full SHA와 candidate full SHA를 기록합니다. replay 조건은 동일한 workspace revision, cwd,
          environment, model, tool set, policy, sandbox request와 host capability로 고정합니다. 주입하는 실패는 shell
          string과 direct argv 차이, variable expansion·compound command, canonical path와 symlink TOCTOU입니다. 여기에
          missing enforcer, unsupported sandbox fallback, timeout·16 KiB truncation, descendant linger, crash
          뒤 duplicate effect도 각각 주입합니다.
        </p>
        <p>
          candidate의 unauthorized execution 허용치는 0입니다. 모든 attempt에 cleanup receipt, 최소 auth diff와
          deterministic login test receipt가 있어야 canary로 진행합니다. cleanup·effect 상태가 Unknown이거나 base보다 false
          negative가 하나라도 늘면 중단합니다. rollback artifact에는 base binary·full SHA, policy·sandbox profile과 baseline
          workspace snapshot을 포함합니다. 이 gate는 desired hardening이며 pinned runtime이 이미 통과했다는 보장이 아닙니다.
        </p>
      </div>

      <div className="not-prose my-7 overflow-x-auto rounded-lg border border-border/70">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <thead className="bg-muted/30 text-foreground/80">
            <tr>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">Probe</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">주입</th>
              <th className="border-b border-border/70 px-4 py-3 font-semibold">통과 증거</th>
            </tr>
          </thead>
          <tbody>
            {releaseProbes.map(([probe, injection, evidence]) => (
              <tr key={probe} className="border-b border-border/50 last:border-b-0">
                <td className="px-4 py-3 font-semibold text-foreground">{probe}</td>
                <td className="px-4 py-3 text-muted-foreground">{injection}</td>
                <td className="px-4 py-3 text-muted-foreground">{evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          마지막으로 정상 login fixture를 처음부터 replay합니다. search proposal의 shell·path·effect 판정과 permission decision이
          같은 run에 연결돼야 합니다. 실제 sandbox profile과 process receipt, 최소 diff, regression test exit와 cleanup
          evidence도 마찬가지입니다. namespace가 active라는 한 field나 test exit 0 하나만으로 안전한 실행과 수정 완료를 동시에 주장하지 않습니다.
        </p>
      </div>
    </section>
  );
}
