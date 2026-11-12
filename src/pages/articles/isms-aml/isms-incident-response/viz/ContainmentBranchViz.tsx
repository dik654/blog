import SceneShell from "./SceneShell";

/**
 * 본문 대응: #triage-containment 둘째 문단 "Containment는 무조건 host 전원을 끄는 행동이 아닙니다…".
 * 02시 10분 급여 export API 대량 다운로드 경보(글의 가정 사례)에서 차단 수단을 고르는 분기.
 * active exfiltration이면 증거 수집을 기다리지 않으므로 그 질문을 먼저 둡니다.
 */
type Node = "off" | "on" | "yes" | "no";

const MEANS = ["Token revoke", "Account disable", "Network isolation", "Route deny", "Feature flag off"] as const;

const SCENES = [
  {
    label: "전원 차단이 기본이 아님",
    summary: "수단 다섯 가지 중에서 고름",
    q1: "off",
    q2: "off",
    outcome: "선택지",
    note: "Containment의 수단은 host 전원 차단 하나가 아닙니다. Token revoke, account disable, network isolation, route deny, 취약 기능의 feature flag off 중 evidence와 업무 영향에 맞는 것을 고릅니다. Host 전원을 내리면 volatile evidence를 잃을 수 있습니다.",
  },
  {
    label: "반출이 진행 중이면",
    summary: "증거 수집을 기다리지 않고 차단",
    q1: "yes",
    q2: "off",
    outcome: "차단을 늦추지 않음",
    note: "Active exfiltration, 곧 데이터가 지금도 밖으로 나가고 있다면 증거 수집을 기다리느라 차단을 늦추지 않습니다. 아래 질문으로 내려가기 전에 차단합니다. 이 가지가 정하는 것은 차단 시점이고, 막는 수단은 여전히 결과 칸의 다섯 가지 가운데서 고릅니다.",
  },
  {
    label: "memory가 핵심 증거이면",
    summary: "승인된 capture → 격리",
    q1: "no",
    q2: "yes",
    outcome: "capture 뒤 격리",
    note: "반출이 진행 중이 아니고 memory가 핵심 증거라면 승인된 capture를 먼저 한 뒤 격리할 수 있습니다. 이 가지가 정하는 것은 capture와 격리의 순서입니다.",
  },
  {
    label: "그 밖의 경우",
    summary: "evidence·업무 영향에 맞는 수단",
    q1: "no",
    q2: "no",
    outcome: "영향에 맞는 수단",
    note: "두 질문에 모두 해당하지 않으면 순서를 앞당기거나 미룰 이유가 없으므로, 다섯 수단 가운데 evidence와 업무 영향에 맞는 것을 고르는 일만 남습니다. 어떤 수단이 맞는지는 사건마다 다르므로 그림은 하나를 정하지 않습니다.",
  },
  {
    label: "모든 조치에 receipt",
    summary: "actor · time · reason · target · result",
    q1: "off",
    q2: "off",
    outcome: "receipt",
    note: "어느 가지로 가든 모든 조치는 누가(actor), 언제(time), 왜(reason), 무엇에(target) 했고 결과가 어땠는지(result receipt)를 남깁니다.",
  },
] as const satisfies readonly { label: string; summary: string; q1: Node; q2: Node; outcome: string; note: string }[];

const RECEIPT = ["actor", "time", "reason", "target", "result"] as const;

function Question({ text, state }: { text: string; state: Node }) {
  const live = state === "yes" || state === "no";
  return (
    <div className={`flex min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-2 ${live ? "border-[#2563eb]" : "border-border"} bg-background`}>
      <span className="break-keep text-xs font-semibold leading-5">{text}</span>
      <span className="flex shrink-0 gap-1 text-[11px] font-bold">
        <span className={`rounded border px-1.5 ${state === "yes" ? "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]" : "border-border/60 text-muted-foreground/60"}`}>예</span>
        <span className={`rounded border px-1.5 ${state === "no" ? "border-[#2563eb] text-[#1d4ed8] dark:text-[#60a5fa]" : "border-border/60 text-muted-foreground/60"}`}>아니오</span>
      </span>
    </div>
  );
}

export default function ContainmentBranchViz() {
  return (
    <SceneShell
      eyebrow="차단 수단 고르기"
      title="반출 여부, 증거 위치, 업무 영향이 차단 시점과 수단을 바꿉니다"
      description="글 첫머리의 02시 10분 급여 export API 대량 다운로드 경보를 이어 갑니다(가정). 위에서 아래로 두 질문을 묻고, 맨 아래 칸이 그 결과입니다. 두 질문은 차단 시점과 순서를, evidence와 업무 영향은 다섯 수단 가운데 무엇을 쓸지를 정합니다."
      ariaLabel="Containment 수단을 반출 여부와 memory 증거, 업무 영향으로 고르는 분기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showReceipt = active === SCENES.length - 1;
        return (
          <div className="min-w-0 space-y-2">
            <Question text="1. 데이터 반출이 지금도 진행 중인가?" state={scene.q1} />
            <Question text="2. memory가 핵심 증거인가?" state={scene.q2} />
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[11px] font-bold text-muted-foreground">{showReceipt ? "조치마다 남기는 기록" : "결과"}</p>
                <p className="text-sm font-bold">{scene.outcome}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                {(showReceipt ? (RECEIPT as readonly string[]) : (MEANS as readonly string[])).map((item) => {
                  // 가지 장면(1·2)에서도 수단은 다섯 가운데서 고르므로 흐리게 지우지 않고 강조만 뺍니다.
                  const strong = active === 0 || active === 3 || showReceipt;
                  return (
                    <span key={item} className={`rounded border px-1.5 py-1 text-center font-mono text-[10px] leading-4 ${strong ? "border-[#2563eb] text-foreground" : "border-border text-foreground"}`}>
                      {item}
                    </span>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                {showReceipt ? "모든 조치에 남기는 기록 항목" : active === 1 || active === 2 ? "가지는 시점·순서를 정하고, 수단은 이 다섯 가운데서 고름" : "글이 든 다섯 수단 · host 전원 차단은 기본값이 아님"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
