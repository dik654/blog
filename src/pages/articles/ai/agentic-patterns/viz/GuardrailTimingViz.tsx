import SceneShell from "./SceneShell";

/**
 * 본문 대응: agent-extension-boundaries #guardrail — 검사를 agent와 동시에 돌리면 지연은 줄 수 있지만
 * 거부가 나오기 전에 token 사용이나 tool 시작이 일어날 수 있고, blocking 검사는 그 전에 멈춘다.
 * 막대 길이는 순서를 보이려는 가정이며 실제 시간이 아니다.
 */
const CHECK_END = 30;
const AGENT_LEN = 60;
const TOOL_START_OFFSET = 18;
const SPAN = CHECK_END + AGENT_LEN + 10;

type Bar = { start: number; end: number } | null;

const SCENES = [
  {
    label: "동시 실행 · 허용",
    summary: "검사와 생성이 함께 시작",
    tokens: { start: 0, end: AGENT_LEN } as Bar,
    tool: { start: TOOL_START_OFFSET, end: AGENT_LEN } as Bar,
    deny: false,
    note: "검사를 agent와 동시에 돌리면 검사가 끝나기를 기다리지 않고 생성이 시작되므로 지연을 줄일 수 있습니다. 허용으로 끝나면 문제가 없습니다.",
  },
  {
    label: "동시 실행 · 거부",
    summary: "거부 전에 이미 시작됐을 수 있음",
    tokens: { start: 0, end: CHECK_END } as Bar,
    tool: { start: TOOL_START_OFFSET, end: CHECK_END } as Bar,
    deny: true,
    note: "검사가 거부를 내기 전에 model이 token을 쓰거나 tool이 시작될 수 있습니다. 빨간 구간이 거부보다 먼저 일어날 수 있는 일이며, 거부 뒤의 처리는 그리지 않았습니다. 부작용이 먼저 시작되면 안 되는 경계에는 이 방식이 맞지 않습니다.",
  },
  {
    label: "blocking · 거부",
    summary: "executor 호출 없음",
    tokens: null as Bar,
    tool: null as Bar,
    deny: true,
    note: "검사가 끝날 때까지 기다리게 하면 거부가 나온 시점에 아직 아무것도 시작되지 않았습니다. 사례에서 승인 없는 실행의 effectStarted가 false인 자리입니다.",
  },
  {
    label: "blocking · 허용",
    summary: "검사 시간만큼 늦게 시작",
    tokens: { start: CHECK_END, end: CHECK_END + AGENT_LEN } as Bar,
    tool: { start: CHECK_END + TOOL_START_OFFSET, end: CHECK_END + AGENT_LEN } as Bar,
    deny: false,
    note: "허용이 나온 뒤에야 생성과 tool이 시작되므로 동시 실행보다 끝나는 시점이 늦어질 수 있습니다. 대신 부작용이 검사보다 먼저 일어나지 않습니다.",
  },
] as const;

const W = 360;
const LEFT = 96;
const RIGHT = 8;
const LANE_H = 22;
const LANES = ["Guardrail 검사", "Model token", "Tool 실행"] as const;
const x = (t: number) => LEFT + (t / SPAN) * (W - LEFT - RIGHT);

export default function GuardrailTimingViz() {
  return (
    <SceneShell
      eyebrow="Guardrail 실행 시점"
      title="검사를 동시에 돌릴 때와 먼저 끝낼 때 무엇이 먼저 일어나는가"
      description="가로는 시간 순서입니다. token은 model이 생성하는 출력 조각이고, 세로 점선은 검사 판정이 나온 순간이며, blocking은 검사가 끝날 때까지 실행을 기다리게 하는 방식입니다. 막대 길이는 순서를 보이려는 가정이며 실제 시간이 아닙니다(가정)."
      ariaLabel="동시 실행과 blocking guardrail에서 허용과 거부 시 token과 tool 시작 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const bars: readonly Bar[] = [{ start: 0, end: CHECK_END }, scene.tokens, scene.tool];
        const verdictX = x(CHECK_END);
        return (
          <svg viewBox={`0 0 ${W} 132`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {LANES.map((lane, index) => {
              const y = 10 + index * (LANE_H + 10);
              const bar = bars[index];
              const beforeVerdict = scene.deny && index > 0 && bar !== null;
              return (
                <g key={lane}>
                  <text x={4} y={y + 15} fontSize={11} fill="#475569">{lane}</text>
                  <rect x={LEFT} y={y} width={W - LEFT - RIGHT} height={LANE_H} rx={3} fill="none" stroke="#e2e8f0" strokeWidth={1} />
                  {bar ? (
                    <rect
                      x={x(bar.start)}
                      y={y + 3}
                      width={x(bar.end) - x(bar.start)}
                      height={LANE_H - 6}
                      rx={2}
                      fill={index === 0 ? "#64748b" : beforeVerdict ? "#dc2626" : "#2563eb"}
                      opacity={0.8}
                    />
                  ) : index > 0 ? (
                    <text x={LEFT + 8} y={y + 15} fontSize={11} fill="#94a3b8">시작 안 함</text>
                  ) : null}
                </g>
              );
            })}
            <line x1={verdictX} x2={verdictX} y1={4} y2={104} stroke={scene.deny ? "#dc2626" : "#16a34a"} strokeWidth={1.25} strokeDasharray="3 3" />
            <text x={verdictX + 4} y={118} fontSize={11} fontWeight={700} fill={scene.deny ? "#dc2626" : "#16a34a"}>{scene.deny ? "거부 판정" : "허용 판정"}</text>
            <text x={W - RIGHT} y={128} textAnchor="end" fontSize={10} fill="#94a3b8">시간 →</text>
          </svg>
        );
      }}
    />
  );
}
