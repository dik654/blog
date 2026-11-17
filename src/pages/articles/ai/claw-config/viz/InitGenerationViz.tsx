import ClawSceneShell from "./ClawSceneShell";

/**
 * 본문 대응: #bootstrap "외부 process는 trust 결정 뒤에 시작한다" — 취소 signal과 initialization generation을
 * 공유해야 이전 실행에서 늦게 도착한 결과가 새 runtime에 섞이지 않는다.
 * 가로축 = 시간 순서(간격은 가정). 위 줄 = 1세대, 아래 줄 = 2세대, 맨 아래 = 현재 runtime.
 */
const SCENES = [
  {
    label: "초기화를 시작할 때 세대 번호를 붙입니다",
    summary: "현재 세대 = 1",
    note: "initialization generation은 초기화를 새로 시작할 때마다 하나씩 올리는 번호입니다. 1세대가 MCP spawn 같은 외부 작업을 요청하고, 그 요청에는 세대 1이 붙습니다. 그림에는 여러 작업 중 MCP spawn 하나만 그립니다.",
  },
  {
    label: "취소 signal이 1세대를 멈추고 2세대가 시작됩니다",
    summary: "현재 세대 = 2",
    note: "1세대에서 병렬로 도는 provider 연결·plugin enable·MCP spawn·hook 등록은 같은 취소 signal과 세대 값을 공유하므로, signal 하나로 함께 멈춥니다. 취소 뒤 시작한 2세대가 현재 세대가 됩니다. 1세대가 이미 보낸 요청의 응답은 아직 오는 중일 수 있습니다.",
  },
  {
    label: "1세대의 결과가 늦게 도착합니다",
    summary: "결과 세대 1 · 현재 세대 2",
    note: "이 결과는 이전 실행의 것입니다. 세대를 비교하지 않고 받아들이면 1세대 결과가 2세대 runtime에 섞입니다.",
  },
  {
    label: "세대가 다르면 버리고 같은 세대만 반영합니다",
    summary: "1 ≠ 2 → 버림",
    note: "결과에 붙은 세대가 현재 세대와 다르면 runtime에 넣지 않고, 2세대 결과만 반영합니다. hardening된 실행기의 목표이며 pinned BootstrapPlan이 이렇게 동작한다는 근거는 아닙니다.",
  },
] as const;

const W = 340;
const H = 176;
const LANE_X = 78;
const CANCEL_X = 168;
const LANE1_Y = 34;
const LANE2_Y = 82;
const RUNTIME_Y = 132;

export default function InitGenerationViz() {
  return (
    <ClawSceneShell
      eyebrow="Initialization generation"
      title="늦게 온 이전 실행의 결과는 세대 번호로 걸러냅니다"
      description="hardening된 실행기를 가정한 그림입니다. 가로는 시간 순서이고 막대 길이와 간격은 가정입니다."
      ariaLabel="취소 뒤 늦게 도착한 1세대 결과를 세대 번호로 버리는 과정"
      scenes={SCENES}
      render={(active) => {
        const gen = active === 0 ? 1 : 2;
        const lateArrived = active >= 2;
        const rejected = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={8} y={LANE1_Y + 4} fontSize={11} fontWeight={700} fill="#334155">1세대</text>
            <text x={8} y={LANE2_Y + 4} fontSize={11} fontWeight={700} fill={active >= 1 ? "#334155" : "#94a3b8"}>2세대</text>

            <rect x={LANE_X} y={LANE1_Y - 9} width={active === 0 ? 250 : CANCEL_X - LANE_X} height={18} rx={4} fill="#dbeafe" stroke="#2563eb" strokeWidth={1} />
            <text x={LANE_X + 6} y={LANE1_Y + 4} fontSize={11} fill="#1e3a8a">spawn · 세대 1</text>
            {active >= 1 && (
              <>
                <rect x={CANCEL_X} y={LANE1_Y - 9} width={330 - CANCEL_X} height={18} rx={4} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={CANCEL_X} x2={CANCEL_X} y1={14} y2={LANE2_Y + 12} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={CANCEL_X + 4} y={12} fontSize={10} fontWeight={700} fill="#dc2626">취소 signal</text>
                <rect x={CANCEL_X + 6} y={LANE2_Y - 9} width={330 - CANCEL_X - 6} height={18} rx={4} fill="#dcfce7" stroke="#16a34a" strokeWidth={1} />
                <text x={CANCEL_X + 12} y={LANE2_Y + 4} fontSize={11} fill="#14532d">재시작 · 세대 2</text>
              </>
            )}
            {active === 0 && (
              <rect x={LANE_X} y={LANE2_Y - 9} width={252} height={18} rx={4} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
            )}

            {lateArrived && (
              <>
                <circle cx={262} cy={LANE1_Y} r={6} fill="#f59e0b" stroke="#b45309" strokeWidth={1} />
                <text x={272} y={LANE1_Y - 12} fontSize={10} fontWeight={700} fill="#b45309">늦은 결과(1)</text>
                <line x1={262} x2={262} y1={LANE1_Y + 7} y2={RUNTIME_Y - 16} stroke={rejected ? "#dc2626" : "#b45309"} strokeWidth={1.25} strokeDasharray={rejected ? "3 3" : undefined} />
                {rejected && (
                  <>
                    <line x1={255} x2={269} y1={104} y2={118} stroke="#dc2626" strokeWidth={1.25} />
                    <line x1={269} x2={255} y1={104} y2={118} stroke="#dc2626" strokeWidth={1.25} />
                  </>
                )}
              </>
            )}
            {rejected && (
              <>
                <circle cx={312} cy={LANE2_Y} r={6} fill="#16a34a" />
                <line x1={312} x2={312} y1={LANE2_Y + 7} y2={RUNTIME_Y - 16} stroke="#16a34a" strokeWidth={1.25} />
              </>
            )}

            <rect x={LANE_X} y={RUNTIME_Y - 16} width={252} height={34} rx={6} fill="#f8fafc" stroke="#475569" strokeWidth={1} />
            <text x={LANE_X + 10} y={RUNTIME_Y + 5} fontSize={11} fontWeight={700} fill="#0f172a">runtime · 현재 세대 = {gen}</text>
            <text x={8} y={RUNTIME_Y + 5} fontSize={11} fill="#64748b">반영 대상</text>
            {rejected && <text x={LANE_X + 10} y={RUNTIME_Y + 32} fontSize={10} fill="#dc2626">세대 1 결과 버림 · 세대 2 결과만 반영</text>}
            {active === 2 && <text x={LANE_X + 10} y={RUNTIME_Y + 32} fontSize={10} fill="#b45309">비교하지 않으면 그대로 섞임</text>}
          </svg>
        );
      }}
    />
  );
}
