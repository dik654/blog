import RiskSignalsFlagsViz from "./viz/RiskSignalsFlagsViz";
import TrustDecisionViz from "./viz/TrustDecisionViz";

const restrictedCapabilities = [
  {
    title: "Project instructions",
    body: "repository가 제공한 지침을 표시하되 자동으로 privileged action에 연결하지 않습니다.",
  },
  {
    title: "Hooks · MCP",
    body: "workspace가 선언한 executable과 외부 server는 별도 승인 전까지 비활성화합니다.",
  },
  {
    title: "Write · network",
    body: "경로와 endpoint별 capability를 작업 단위로 최소화합니다.",
  },
] as const;

export default function TrustResolver() {
  return (
    <section id="trust-resolver" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Workspace 신뢰를 실행 capability로 변환한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          처음 연 repository에는 source code뿐 아니라 project instruction, hook,
          plugin과 MCP configuration이 들어 있을 수 있습니다. 파일을 읽는 것과
          그 안의 명령을 실행하거나 외부 server에 연결하는 것은 위험 수준이
          다르므로, 단순한 “이 경로를 신뢰한다” 한 비트로 모두 허용하면 안
          됩니다.
        </p>
        <p className="leading-7">
          trust resolver의 역할은 repository가 선하거나 악한지 맞히는 것이
          아니라, 출처와 risk signal, 사용자 결정을 실제 capability set으로
          바꾸는 것입니다. 기본 상태에서는 code를 관찰할 수 있어도 hooks와
          network, secret, broad write는 기본적으로 차단하고 필요한 작업에서만 범위를
          넓힙니다.
        </p>

        <div className="not-prose my-8">
          <TrustDecisionViz />
        </div>
      </div>

      <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
        {restrictedCapabilities.map((item) => (
          <article
            key={item.title}
            className="min-w-0 rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">
          경로는 identity가 아니라 location일 뿐이다
        </h3>
        <p className="leading-7">
          <code>~/work/*</code>를 예전에 승인했다는 사실만으로 그 아래 모든 새
          checkout과 branch를 완전히 신뢰할 수는 없습니다. 같은 path의 content와
          owner가 바뀔 수 있고, symlink나 mount가 다른 대상을 가리킬 수도
          있습니다. canonical path, repository remote, commit identity와
          filesystem ownership을 함께 보고, capability가 큰 결정일수록 다시
          확인합니다.
        </p>
        <p className="leading-7">
          전체 workspace checksum도 만능 identity가 아닙니다. build artifact와
          dependency 설치만으로 값이 자주 바뀌고, 승인한 commit 안에 위험한
          hook이 원래 포함돼 있을 수 있습니다. 변경 감지는 재검토 signal로 쓰되
          trust 자체를 대신하지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          risk signal은 필요한 restriction으로 연결한다
        </h3>
        <p className="leading-7">
          executable hook, remote MCP, credential reference, broad filesystem
          access와 최근 변경은 서로 다른 위험입니다. 하나의 점수로 합쳐
          “restricted”라고만 표시하면 사용자는 무엇이 막혔는지 알기 어렵습니다.
          각 signal을
          <code>NoHooks</code>, network deny, read-only workspace처럼 구체적인
          enforcement로 연결합니다.
        </p>

        <div className="not-prose my-8">
          <RiskSignalsFlagsViz />
        </div>

        <p className="leading-7">
          정규식으로 command 문자열을 검사하는 것은 triage에 도움이 되지만
          encoded payload와 간접 실행을 놓칠 수 있습니다. 알려진 위험 패턴이
          없다는 이유로 hook을 자동 실행하지 않고, 별도 sandbox와 permission
          gate를 그대로 적용합니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          사용자 결정은 범위와 만료 조건을 포함한다
        </h3>
        <p className="leading-7">
          “이 프로젝트를 신뢰하시겠습니까?”보다 “이 commit의 hook 2개를 실행하고
          이 MCP endpoint에 연결할까요?”처럼 대상과 side effect를 보여 주는
          prompt가 낫습니다. 선택은 repository·branch·capability별로 저장하고,
          remote 변경, owner 변경이나 일정 시간이 지나면 재확인합니다.
        </p>
        <p className="leading-7">
          prompt fatigue를 줄인다고 해서 오래된 승인을 무기한 재사용하면 안
          됩니다. 낮은 위험의 read decision은 오래 기억할 수 있지만 secret과
          network, executable permission은 짧게 유지하고 session 종료 시
          회수합니다.
        </p>
      </div>
    </section>
  );
}
