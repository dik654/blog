import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 같은 443 허용이라도 응답을 처리하는 방식이 다르다.
 * 위 줄 = 허용한 연결을 기억하는 방화벽, 아래 줄 = 들어오는 방향과 나가는 방향을 각각 검사하는 필터.
 * 4장면의 "반대 방향 새 연결" 경계는 #names 용어 설명(상태 기반 방화벽의 boundary)에서 가져왔다.
 */
type FlowState = "ok" | "block" | "rule" | "wait" | "na";

interface Lane {
  rules: readonly [string, string];
  flows: readonly [FlowState, FlowState, FlowState];
}

const FLOW_NAMES = ["요청 · 클라이언트 → 서버 443", "응답 · 서버 → 클라이언트", "반대 방향 새 연결 · 서버가 시작"] as const;

const SCENES = [
  {
    label: "요청이 들어옵니다",
    summary: "두 방식 모두 들어오는 443을 허용",
    stateful: { rules: ["들어오는 규칙: 443 허용", "기억한 연결: 이 요청의 연결"], flows: ["ok", "wait", "wait"] },
    stateless: { rules: ["들어오는 규칙: 443 허용", "나가는 규칙: 없음 (가정)"], flows: ["ok", "wait", "wait"] },
    note: "처음 들어오는 요청은 두 방식 모두 들어오는 규칙의 443 허용으로 통과합니다. 차이는 아직 보이지 않습니다.",
  },
  {
    label: "응답이 나갑니다",
    summary: "연결을 기억하는 쪽만 그대로 통과",
    stateful: { rules: ["들어오는 규칙: 443 허용", "기억한 연결: 이 요청의 연결"], flows: ["ok", "ok", "wait"] },
    stateless: { rules: ["들어오는 규칙: 443 허용", "나가는 규칙: 없음 (가정)"], flows: ["ok", "block", "wait"] },
    note: "위쪽 방화벽은 허용한 연결의 응답을 기억해 자동으로 돌려보냅니다. 아래쪽 필터는 나가는 방향을 따로 검사하므로, 나가는 규칙이 없다고 가정하면 응답이 막힙니다.",
  },
  {
    label: "응답 방향도 따로 허용합니다",
    summary: "아래쪽 필터에 나가는 규칙 추가",
    stateful: { rules: ["들어오는 규칙: 443 허용", "기억한 연결: 이 요청의 연결"], flows: ["ok", "ok", "wait"] },
    stateless: { rules: ["들어오는 규칙: 443 허용", "나가는 규칙: 응답 포트 범위 허용"], flows: ["ok", "ok", "wait"] },
    note: "방향마다 검사하는 필터에서는 응답 포트 범위도 별도로 허용해야 할 수 있습니다. 그래서 ‘443을 열었다’만으로는 부족하고, 어느 경계에 어느 방향으로 어떤 출발지와 목적지를 허용하는지, 상태를 기억하는 규칙인지 함께 적어야 합니다.",
  },
  {
    label: "기억은 그 연결의 응답에만",
    summary: "반대 방향 새 연결은 따로 허용",
    stateful: { rules: ["들어오는 규칙: 443 허용", "기억한 연결: 이 요청의 연결"], flows: ["ok", "ok", "rule"] },
    stateless: { rules: ["들어오는 규칙: 443 허용", "나가는 규칙: 응답 포트 범위 허용"], flows: ["ok", "ok", "na"] },
    note: "상태를 기억하는 규칙도 허용한 연결의 응답만 처리합니다. 서버 쪽에서 새로 시작하는 반대 방향 연결의 허용까지 자동으로 만들지는 않으므로, 그 방향 규칙이 따로 있어야 통과합니다(6절 용어 설명). 아래 줄의 이 칸은 본문이 다루지 않아 비워 둡니다.",
  },
] as const satisfies readonly { label: string; summary: string; stateful: Lane; stateless: Lane; note: string }[];

const MARK: Record<FlowState, { text: string; className: string }> = {
  ok: { text: "✓ 통과", className: "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]" },
  block: { text: "✕ 막힘", className: "border-[#dc2626] bg-[#dc2626]/10 font-bold text-[#b91c1c] dark:text-[#f87171]" },
  rule: { text: "규칙 따로", className: "border-[#d97706] bg-[#d97706]/10 font-bold text-[#b45309] dark:text-[#fbbf24]" },
  wait: { text: "아직", className: "border-dashed border-border text-muted-foreground" },
  na: { text: "–", className: "border-dashed border-border text-muted-foreground" },
};

function LaneView({ title, lane }: { title: string; lane: Lane }) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-3">
      <p className="text-sm font-bold text-foreground">{title}</p>
      <ul className="mt-2 space-y-1 text-xs leading-5 text-muted-foreground">
        {lane.rules.map((rule) => (
          <li key={rule} className="break-words font-mono">{rule}</li>
        ))}
      </ul>
      <ul className="mt-3 space-y-2">
        {FLOW_NAMES.map((name, index) => {
          const mark = MARK[lane.flows[index]];
          return (
            <li key={name} className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 text-xs leading-5">
              <span className="min-w-0 break-words text-foreground">{name}</span>
              <span className={`rounded-md border px-2 py-0.5 text-center ${mark.className}`}>{mark.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function StatefulVsStatelessViz() {
  return (
    <SceneShell
      eyebrow="같은 443, 다른 응답 처리"
      title="연결을 기억하는 규칙과 방향마다 검사하는 규칙"
      description="서버는 규칙 안쪽, 클라이언트는 바깥쪽에 있습니다. 두 줄 모두 들어오는 443을 허용한 상태에서 시작합니다."
      ariaLabel="상태를 기억하는 방화벽과 방향별로 검사하는 필터의 요청·응답 처리 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            <LaneView title="연결을 기억하는 방화벽" lane={scene.stateful} />
            <LaneView title="방향마다 검사하는 필터" lane={scene.stateless} />
          </div>
        );
      }}
    />
  );
}
