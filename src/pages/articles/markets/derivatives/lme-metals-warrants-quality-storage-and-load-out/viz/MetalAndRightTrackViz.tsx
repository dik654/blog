import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 아연은 분석·창고를 지나 트럭에 실리고, 전자 권리(워런트)는 계정 사이를 움직인 뒤 취소된다.
 * 위 줄 = 금속이 실제로 있는 곳, 아래 줄 = 전자 권리가 있는 곳. 점선 = 권리가 그 로트를 가리킨다는 뜻.
 * 순서·숫자는 1·2·4·5·7·9절과 용어 상자(취소 순간 자동 출고되지 않음)를 따른다. 25.3 t·99.995%는 3·7절.
 */
const W = 360;
const H = 206;
const Y_METAL = 62;
const Y_RIGHT = 150;
const METAL_X = [45, 135, 225, 315] as const;
const METAL_LABELS = ["제련소", "품질·분석", "승인 창고", "트럭"] as const;
const RIGHT_X = [45, 135, 225, 315] as const;
const RIGHT_LABELS = ["권리 없음", "보유 계정", "매수자 계정", "취소됨"] as const;

const SCENES = [
  {
    label: "품질 확인",
    summary: "순도 99.995%·승인 브랜드",
    metal: 1,
    right: 0,
    metalTag: "조건 확인 중",
    note: "생산된 아연은 승인 브랜드인지, 순도·형태 조건을 맞는지 먼저 확인받습니다. 이 단계에는 아직 거래할 전자 권리가 없습니다.",
  },
  {
    label: "창고 계량과 기록",
    summary: "25.3 t → 전자 권리 기록",
    metal: 2,
    right: 1,
    metalTag: "25.3 t 계량",
    note: "창고가 무게와 로트를 확인하고, 조건이 맞으면 그 특정 로트를 가리키는 전자 권리(워런트)가 계정에 기록됩니다. 점선은 권리가 어느 로트를 가리키는지를 뜻합니다.",
  },
  {
    label: "권리를 넘겨받음",
    summary: "권리는 이동 · 금속은 그대로",
    metal: 2,
    right: 2,
    metalTag: "같은 자리",
    note: "매수자가 돈을 내고 넘겨받는 것은 이 전자 권리입니다. 금속은 같은 창고, 같은 자리에 있습니다. 권리가 표준화돼 있어 선물 계약을 서로 바꿔 거래할 수 있습니다.",
  },
  {
    label: "워런트 취소",
    summary: "권리는 사라짐 · 금속은 아직 창고",
    metal: 2,
    right: 3,
    metalTag: "아직 창고",
    note: "실물을 원하면 권리를 취소하고 출고 요청을 냅니다. 취소 순간 금속이 자동으로 나가지는 않으며, 보관과 출고 책임이 남습니다(9절).",
  },
  {
    label: "출고",
    summary: "차량 시간 → 트럭 적재",
    metal: 3,
    right: 3,
    metalTag: "로트·서류 대조",
    note: "창고는 정한 일정에 금속을 내놓고, 실제 로트와 서류가 일치하는지 확인해 출고를 끝냅니다. 운송 준비가 늦으면 새 시간을 합의해야 합니다. 공장까지 운반하는 일은 그 뒤에도 남습니다.",
  },
] as const;

const INK = "#334155";
const MUTED = "#94a3b8";
const METAL = "#2563eb";
const RIGHT = "#d97706";
const DONE = "#dc2626";

export default function MetalAndRightTrackViz() {
  return (
    <SceneShell
      eyebrow="금속과 권리의 두 줄"
      title="권리는 계정을 옮겨 다니고 금속은 창고에 머뭅니다"
      description="위 줄은 아연 25.3톤이 실제로 있는 곳, 아래 줄은 그 로트를 가리키는 전자 권리(워런트)가 있는 곳입니다. 장면을 넘기며 두 줄이 언제 함께, 언제 따로 움직이는지 봅니다."
      ariaLabel="아연 로트가 품질 확인, 창고 계량, 권리 이전, 워런트 취소, 출고를 지나는 동안 금속과 전자 권리의 위치 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const mx = METAL_X[scene.metal];
        const rx = RIGHT_X[scene.right];
        const pointing = scene.right === 1 || scene.right === 2;
        const cancelled = scene.right === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={8} y={20} fontSize={13} fontWeight={700} fill={METAL}>금속이 있는 곳</text>
            <text x={8} y={Y_RIGHT - 34} fontSize={13} fontWeight={700} fill={RIGHT}>전자 권리가 있는 곳</text>

            <line x1={METAL_X[0]} x2={METAL_X[3]} y1={Y_METAL} y2={Y_METAL} stroke={MUTED} strokeWidth={1} />
            <line x1={RIGHT_X[0]} x2={RIGHT_X[3]} y1={Y_RIGHT} y2={Y_RIGHT} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />

            {METAL_X.map((x, index) => (
              <g key={`m-${x}`}>
                <circle cx={x} cy={Y_METAL} r={4} fill="#ffffff" stroke={MUTED} strokeWidth={1} />
                <text x={x} y={Y_METAL + 22} textAnchor="middle" fontSize={12} fill={index === scene.metal ? INK : "#64748b"} fontWeight={index === scene.metal ? 700 : 400}>
                  {METAL_LABELS[index]}
                </text>
              </g>
            ))}
            {RIGHT_X.map((x, index) => (
              <g key={`r-${x}`}>
                <circle cx={x} cy={Y_RIGHT} r={4} fill="#ffffff" stroke={MUTED} strokeWidth={1} />
                <text x={x} y={Y_RIGHT + 22} textAnchor="middle" fontSize={12} fill={index === scene.right ? INK : "#64748b"} fontWeight={index === scene.right ? 700 : 400}>
                  {RIGHT_LABELS[index]}
                </text>
              </g>
            ))}

            {pointing && <line x1={rx} y1={Y_RIGHT - 10} x2={mx} y2={Y_METAL + 10} stroke={RIGHT} strokeWidth={1} strokeDasharray="4 3" />}

            <rect x={mx - 20} y={Y_METAL - 11} width={40} height={22} rx={4} fill={METAL} />
            <text x={mx} y={Y_METAL + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">아연</text>
            <text x={mx} y={Y_METAL - 18} textAnchor={scene.metal === 3 ? "end" : "middle"} dx={scene.metal === 3 ? 22 : 0} fontSize={12} fontWeight={700} fill={METAL}>
              {scene.metalTag}
            </text>

            {scene.right > 0 && (
              <g>
                <rect x={rx - 24} y={Y_RIGHT - 11} width={48} height={22} rx={4} fill={cancelled ? "#ffffff" : RIGHT} stroke={cancelled ? DONE : RIGHT} strokeWidth={1} strokeDasharray={cancelled ? "3 2" : undefined} />
                <text x={rx} y={Y_RIGHT + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={cancelled ? DONE : "#ffffff"}>워런트</text>
                {cancelled && <line x1={rx - 26} x2={rx + 26} y1={Y_RIGHT + 13} y2={Y_RIGHT - 13} stroke={DONE} strokeWidth={1.25} />}
              </g>
            )}
            {scene.right === 0 && <text x={rx} y={Y_RIGHT - 12} textAnchor="middle" fontSize={12} fill="#64748b">아직 없음</text>}
          </svg>
        );
      }}
    />
  );
}
