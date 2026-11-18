import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 들어오는 길과 나가는 길을 따로 그린다.
 * 구역 나눔은 #case의 가정(10.0.0.0~255 중 앞 128개 = 앞문·중계, 뒤 128개 = 앱·데이터베이스).
 * 앱 주소 10.0.0.140은 #mechanism 알고리즘 입력의 백엔드 주소이며 뒤 구역(128~255)에 든다.
 * 막힘·허용은 #black-box 둘째 문단, #picture 두 문단, #source 둘째 문단에서 가져왔다.
 */
type EdgeId = "userFront" | "frontApp" | "userAppDirect" | "appDb" | "appRelay" | "relayOut" | "outRelayIn" | "admin";

const NODES = [
  { id: "user", label: "사용자", x: 8, y: 26 },
  { id: "admin", label: "관리자", x: 8, y: 94 },
  { id: "outside", label: "바깥 서버", x: 8, y: 162 },
  { id: "front", label: "앞문", x: 132, y: 26 },
  { id: "relay", label: "출구 중계", x: 132, y: 162 },
  { id: "app", label: "앱 .140", x: 268, y: 44 },
  { id: "db", label: "데이터베이스", x: 268, y: 144 },
] as const;

const NODE_W = 84;
const NODE_H = 34;

const EDGES: Record<EdgeId, { d: string; label: string; lx: number; ly: number; ex: number; ey: number }> = {
  userFront: { d: "M92 43 H128", label: "443", lx: 110, ly: 37, ex: 128, ey: 43 },
  frontApp: { d: "M216 43 L264 58", label: "", lx: 0, ly: 0, ex: 264, ey: 58 },
  userAppDirect: { d: "M50 26 V12 H310 V40", label: "직접 연결", lx: 180, ly: 9, ex: 310, ey: 40 },
  appDb: { d: "M310 78 V140", label: "정해진 포트", lx: 316, ly: 112, ex: 310, ey: 140 },
  appRelay: { d: "M282 78 L212 162", label: "", lx: 0, ly: 0, ex: 212, ey: 162 },
  relayOut: { d: "M132 176 H96", label: "", lx: 0, ly: 0, ex: 96, ey: 176 },
  outRelayIn: { d: "M92 190 H128", label: "바깥에서 시작", lx: 110, ly: 215, ex: 128, ey: 190 },
  admin: { d: "M92 111 H240", label: "사설 접속·관리 서비스", lx: 166, ly: 105, ex: 240, ey: 111 },
};

const SCENES = [
  {
    label: "들어오는 길",
    summary: "사용자 → 앞문 443 → 앱",
    ok: ["userFront", "frontApp"],
    blocked: [],
    note: "불특정 사용자는 인터넷과 연결된 앞문으로 들어옵니다. 앞문(여러 실행 자원으로 요청을 나누는 입구)은 상태 검사를 통과한 앱으로 요청을 넘깁니다. 앱 주소 10.0.0.140은 뒤 구역에 있습니다.",
  },
  {
    label: "뒤 구역은 직접 못 들어옴",
    summary: "데이터베이스는 앱의 정해진 포트만",
    ok: ["appDb"],
    blocked: ["userAppDirect"],
    note: "외부 사용자가 뒤쪽 주소로 직접 들어오지 못하게 합니다. 데이터베이스는 애플리케이션에서 오는 정해진 포트만 받습니다.",
  },
  {
    label: "나가는 길은 따로",
    summary: "앱 → 출구 중계 → 바깥 업데이트 서버",
    ok: ["appRelay", "relayOut"],
    blocked: [],
    note: "사설 앱이 업데이트 서버로 나갈 때는 출발 주소를 바꾸는 중계 경로를 쓸 수 있습니다. 3절 가정대로 중계 장치는 앞 구역에 둡니다.",
  },
  {
    label: "나갈 수 있어도 들어오지는 못함",
    summary: "바깥 → 출구 중계 → 앱 ✕",
    ok: [],
    blocked: ["outRelayIn"],
    note: "출구 중계는 바깥에서 시작한 임의 연결을 안으로 전달하는 앞문과 역할이 다릅니다. 밖으로 나갈 길이 생겼다고 인터넷에서 그 사설 자원으로 먼저 연결할 입구가 생기지는 않습니다.",
  },
  {
    label: "관리자는 다른 길",
    summary: "관리자 → 사설 접속·관리 서비스",
    ok: ["admin"],
    blocked: [],
    note: "관리자는 사용자용 앞문을 쓰지 않고 별도의 사설 접속이나 관리 서비스를 씁니다. 화살표 끝을 뒤 구역 경계에 둔 것은 본문이 접속 대상을 정하지 않았기 때문입니다.",
  },
] as const satisfies readonly { label: string; summary: string; ok: readonly EdgeId[]; blocked: readonly EdgeId[]; note: string }[];

const OK = "#16a34a";
const BLOCK = "#dc2626";
const IDLE = "#cbd5e1";

export default function InOutPathMapViz() {
  return (
    <SceneShell
      eyebrow="공개 구역과 사설 구역"
      title="들어오는 길, 나가는 길, 관리하는 길은 서로 다릅니다"
      description="왼쪽이 인터넷 바깥, 가운데가 앞 구역(10.0.0.0~10.0.0.127), 오른쪽이 뒤 구역(10.0.0.128~10.0.0.255)입니다. 구역 나눔은 3절의 설명용 가정입니다."
      ariaLabel="앞 구역과 뒤 구역 사이의 들어오는 길, 나가는 길, 관리 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ok = new Set<EdgeId>(scene.ok);
        const blocked = new Set<EdgeId>(scene.blocked);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 236" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                {[["ok", OK], ["block", BLOCK], ["idle", IDLE]].map(([key, color]) => (
                  <marker key={key} id={`inout-arrow-${key}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0 0 L8 4 L0 8 z" fill={color} />
                  </marker>
                ))}
              </defs>
              <rect x={120} y={18} width={108} height={186} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <rect x={244} y={18} width={112} height={186} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
              <text x={60} y={226} textAnchor="middle" fontSize={10} fill="#64748b">인터넷 바깥</text>
              <text x={174} y={226} textAnchor="middle" fontSize={10} fill="#64748b">앞 구역 0~127</text>
              <text x={300} y={226} textAnchor="middle" fontSize={10} fill="#64748b">뒤 구역 128~255</text>
              {(Object.keys(EDGES) as EdgeId[]).map((id) => {
                const edge = EDGES[id];
                const state = ok.has(id) ? "ok" : blocked.has(id) ? "block" : "idle";
                const color = state === "ok" ? OK : state === "block" ? BLOCK : IDLE;
                const { ex, ey } = edge;
                return (
                  <g key={id} opacity={state === "idle" ? 0.55 : 1}>
                    <path
                      d={edge.d}
                      fill="none"
                      stroke={color}
                      strokeWidth={state === "idle" ? 1 : 1.25}
                      strokeDasharray={state === "block" ? "4 3" : undefined}
                      markerEnd={`url(#inout-arrow-${state})`}
                    />
                    {state === "block" && (
                      <text x={ex} y={ey - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLOCK}>✕</text>
                    )}
                    {edge.label && state !== "idle" && (
                      <text x={edge.lx} y={edge.ly} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{edge.label}</text>
                    )}
                  </g>
                );
              })}
              {NODES.map((node) => (
                <g key={node.id}>
                  <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={6} fill="#f8fafc" fillOpacity={0.06} stroke="#64748b" strokeWidth={1} />
                  <text x={node.x + NODE_W / 2} y={node.y + 21} textAnchor="middle" fontSize={12} fontWeight={600} fill="#64748b">{node.label}</text>
                </g>
              ))}
            </svg>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span><span className="mr-1 inline-block h-0.5 w-5 align-middle" style={{ backgroundColor: OK }} />이 장면에서 허용되는 흐름</span>
              <span><span className="mr-1 inline-block w-5 border-t border-dashed align-middle" style={{ borderColor: BLOCK }} />✕ 막히는 흐름</span>
              <span><span className="mr-1 inline-block h-0.5 w-5 align-middle" style={{ backgroundColor: IDLE }} />다른 장면의 흐름</span>
            </div>
          </div>
        );
      }}
    />
  );
}
