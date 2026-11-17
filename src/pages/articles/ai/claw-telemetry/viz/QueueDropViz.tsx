import TelemetrySceneShell from "./TelemetrySceneShell";

/**
 * 본문 대응: #overview "관측 시스템의 장애를 실행 장애로 키우지 않는다".
 * session-7 · turn-12의 model-1 → tool-edit-1 → test-1(timeout) 예를 그대로 씁니다.
 * queue 상한 2칸, 감사 event 하나, 버려지는 대상이 test-1 span인 것은 설명용 가정입니다.
 */
type Slot = { text: string; tone: "span" | "audit" | "empty" };
type BackendState = "present" | "missing" | "pending";

const SCENES = [
  {
    label: "exporter가 따라올 때",
    summary: "queue 1/2 · dropped 0",
    agent: ["완료", "완료", "시작 전"],
    queue: [{ text: "tool-edit-1 span", tone: "span" }, { text: "", tone: "empty" }] as Slot[],
    backend: ["present", "pending", "pending"] as BackendState[],
    incoming: "",
    dropped: 0,
    note: "model-1 span은 queue를 거쳐 바로 backend에 도착합니다. tool-edit-1 span은 방금 끝나 queue에서 다음 batch를 기다립니다.",
  },
  {
    label: "exporter가 느려지면",
    summary: "queue 2/2 · loop는 계속",
    agent: ["완료", "완료", "실행 중"],
    queue: [{ text: "tool-edit-1 span", tone: "span" }, { text: "감사 event", tone: "audit" }] as Slot[],
    backend: ["present", "pending", "pending"] as BackendState[],
    incoming: "",
    dropped: 0,
    note: "exporter가 늦어 감사 event까지 쌓이며 queue가 상한까지 찼습니다. agent loop는 exporter를 기다리지 않고 test-1을 시작합니다. 기다렸다면 관측 지연이 실행 장애가 됐을 것입니다.",
  },
  {
    label: "가득 찬 queue에 test-1 도착",
    summary: "test-1 span drop · dropped 1",
    agent: ["완료", "완료", "timeout"],
    queue: [{ text: "tool-edit-1 span", tone: "span" }, { text: "감사 event", tone: "audit" }] as Slot[],
    backend: ["present", "pending", "pending"] as BackendState[],
    incoming: "test-1 span",
    dropped: 1,
    note: "test-1은 실제로 timeout됐지만 그 span이 들어갈 칸이 없습니다. 감사 event는 높은 우선순위라 보존하고, 이 예에서는 새로 온 test-1 span을 버린다고 가정합니다. 버린 대신 dropped 수를 하나 올립니다.",
  },
  {
    label: "backend에서 보이는 것",
    summary: "test-1 없음 + dropped 1",
    agent: ["완료", "완료", "timeout"],
    queue: [{ text: "", tone: "empty" }, { text: "", tone: "empty" }] as Slot[],
    backend: ["present", "present", "missing"] as BackendState[],
    incoming: "",
    dropped: 1,
    note: "backend에는 test-1 span이 없습니다. dropped 수가 함께 남아 있어야 이 빈칸을 '테스트가 안 돌았다'나 '오류가 없었다'가 아니라 '관측하지 못했다'로 읽을 수 있습니다.",
  },
] as const;

const NAMES = ["model-1", "tool-edit-1", "test-1"] as const;
const W = 360;
const H = 196;
const ROW_Y = [46, 82, 118] as const;
const AGENT_X = 4;
const COL_W = 98;
const QUEUE_X = 131;
const BACK_X = 258;

const SLOT_STYLE: Record<Slot["tone"], { fill: string; stroke: string; text: string }> = {
  span: { fill: "#dbeafe", stroke: "#2563eb", text: "#1d4ed8" },
  audit: { fill: "#fef3c7", stroke: "#d97706", text: "#92400e" },
  empty: { fill: "#ffffff", stroke: "#cbd5e1", text: "#94a3b8" },
};

export default function QueueDropViz() {
  return (
    <TelemetrySceneShell
      eyebrow="SESSION-7 · TURN-12 · 설명용 queue"
      title="queue가 넘쳐 버린 span은 backend에서 '오류 없음'처럼 보입니다"
      description="왼쪽은 실제 실행, 가운데는 exporter로 보내기 전 쌓아 두는 bounded queue(칸 수에 상한이 있는 대기열), 오른쪽은 관측 backend에 도착한 span입니다. queue 2칸과 감사 event는 설명용 가정입니다."
      ariaLabel="session-7 turn-12에서 queue가 가득 차 test-1 span이 drop되고 dropped 수가 1이 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={AGENT_X} y={20} fontSize={11} fontWeight={700} fill="#334155">실제 실행</text>
            <text x={QUEUE_X} y={20} fontSize={11} fontWeight={700} fill="#334155">queue · 상한 2</text>
            <text x={BACK_X} y={20} fontSize={11} fontWeight={700} fill="#334155">backend</text>

            {NAMES.map((name, index) => {
              const y = ROW_Y[index];
              const status = scene.agent[index];
              const timeout = status === "timeout";
              return (
                <g key={`agent-${name}`}>
                  <rect x={AGENT_X} y={y - 14} width={COL_W} height={26} rx={4} fill={status === "시작 전" ? "#ffffff" : "#f1f5f9"} stroke={timeout ? "#dc2626" : "#94a3b8"} strokeWidth={1} strokeDasharray={status === "시작 전" ? "3 2" : undefined} />
                  <text x={AGENT_X + 6} y={y + 3} fontSize={10} fontWeight={700} fill="#0f172a">{name}</text>
                  <text x={AGENT_X + COL_W - 6} y={y + 3} textAnchor="end" fontSize={9.5} fill={timeout ? "#dc2626" : "#64748b"}>{status}</text>
                </g>
              );
            })}

            {[0, 1].map((slot) => {
              const item = scene.queue[slot];
              const style = SLOT_STYLE[item.tone];
              const y = 52 + slot * 34;
              return (
                <g key={`slot-${slot}`}>
                  <rect x={QUEUE_X} y={y} width={COL_W} height={26} rx={4} fill={style.fill} stroke={style.stroke} strokeWidth={1} />
                  <text x={QUEUE_X + COL_W / 2} y={y + 17} textAnchor="middle" fontSize={10} fontWeight={700} fill={style.text}>
                    {item.tone === "empty" ? "빈 칸" : item.text}
                  </text>
                </g>
              );
            })}
            <g opacity={scene.incoming ? 1 : 0}>
              <rect x={QUEUE_X} y={128} width={COL_W} height={22} rx={4} fill="#ffffff" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />
              <text x={QUEUE_X + COL_W / 2} y={143} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">{scene.incoming} ✕</text>
              <text x={QUEUE_X + COL_W / 2} y={162} textAnchor="middle" fontSize={9.5} fill="#dc2626">칸 없음 → drop</text>
            </g>

            {NAMES.map((name, index) => {
              const y = ROW_Y[index];
              const state = scene.backend[index];
              const present = state === "present";
              const missing = state === "missing";
              return (
                <g key={`back-${name}`}>
                  <rect x={BACK_X} y={y - 14} width={COL_W} height={26} rx={4} fill={present ? "#dbeafe" : "#ffffff"} stroke={present ? "#2563eb" : missing ? "#dc2626" : "#cbd5e1"} strokeWidth={1} strokeDasharray={present ? undefined : "3 2"} />
                  <text x={BACK_X + 6} y={y + 3} fontSize={10} fontWeight={700} fill={present ? "#1d4ed8" : "#94a3b8"}>{name}</text>
                  <text x={BACK_X + COL_W - 6} y={y + 3} textAnchor="end" fontSize={9.5} fill={missing ? "#dc2626" : "#64748b"}>
                    {present ? "도착" : missing ? "없음 ?" : "대기"}
                  </text>
                </g>
              );
            })}

            <line x1={AGENT_X + COL_W + 4} x2={QUEUE_X - 4} y1={100} y2={100} stroke="#94a3b8" strokeWidth={1} />
            <polygon points={`${QUEUE_X - 4},100 ${QUEUE_X - 9},97 ${QUEUE_X - 9},103`} fill="#94a3b8" />
            <line x1={QUEUE_X + COL_W + 4} x2={BACK_X - 4} y1={82} y2={82} stroke={active === 1 || active === 2 ? "#cbd5e1" : "#94a3b8"} strokeWidth={1} strokeDasharray={active === 1 || active === 2 ? "3 2" : undefined} />
            <polygon points={`${BACK_X - 4},82 ${BACK_X - 9},79 ${BACK_X - 9},85`} fill="#94a3b8" />
            <text x={(QUEUE_X + COL_W + BACK_X) / 2} y={74} textAnchor="middle" fontSize={9} fill="#64748b">{active === 1 || active === 2 ? "느림" : "export"}</text>

            <line x1={AGENT_X} x2={W - 4} y1={176} y2={176} stroke="#e2e8f0" strokeWidth={1} />
            <text x={AGENT_X} y={191} fontSize={10.5} fill="#475569">agent loop: exporter를 기다리지 않음</text>
            <text x={W - 4} y={191} textAnchor="end" fontSize={11} fontWeight={700} fill={scene.dropped ? "#dc2626" : "#475569"}>dropped = {scene.dropped}</text>
          </svg>
        );
      }}
    />
  );
}
