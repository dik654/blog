import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-supply — 전극은 절연층 너머 전기장으로 제어하고,
 * 전자는 바탕과 같은 전위에 묶인 공급 영역(n+)에서 실리콘 쪽으로 온다.
 * 충분히 기다린 정적 상태에서만 약 108만 개라고 말할 수 있다.
 */
const W = 360;
const H = 250;
const SI_TOP = 74;
const GATE_X0 = 150;
const GATE_X1 = 320;
// 공급 영역은 전극 가장자리에 맞닿아야 반전층과 이어진다(떨어지면 사이의 p형 영역이 막는다).
const SUPPLY_X1 = GATE_X0;

const HOLE_SURFACE = [168, 196, 224, 252, 280, 306] as const;
const IONS = [172, 204, 236, 268, 300] as const;
const ELECTRON_SLOTS = [160, 178, 196, 214, 232, 250, 268, 286, 304] as const;

const SCENES = [
  {
    label: "전극은 전기장으로만",
    summary: "절연층을 건너는 전자 없음",
    note: "전극을 1.0 V로 올리면 전기장이 절연층을 지나 표면에 닿습니다. 화살표는 제어가 닿는 방향일 뿐, 전자가 위에서 절연층을 통과한다는 뜻이 아닙니다. 정공은 표면에서 밀려나고 음전하 억셉터 이온이 드러납니다.",
  },
  {
    label: "전자는 옆 공급 영역에서",
    summary: "공급 경로는 실리콘 쪽",
    note: "n+ 영역은 전자가 아주 많도록 만든 실리콘 영역입니다. 이 글은 이 영역을 바탕과 같은 0 V에 연결했다고 가정합니다. 전자는 여기서 실리콘 쪽 경로로 전극 아래 표면에 모입니다.",
  },
  {
    label: "너무 빨리 읽으면",
    summary: "아직 108만 개라고 말할 수 없음",
    note: "공급이 늦거나 전압을 너무 빨리 바꾸면 표면 전자가 아직 다 모이지 않은 상태를 읽게 됩니다. 이때의 전자 수는 계산한 정적 값에 도달했다고 할 수 없습니다.",
  },
  {
    label: "충분히 기다린 뒤",
    summary: "정적 계산 · 약 108만 개",
    note: "새 전압에서 충분히 전하를 공급받은 뒤에야 강한 반전 식이 주는 약 −0.173 pC, 전자 약 108만 개를 씁니다. 점의 개수는 그림용이며 실제 전자 수가 아닙니다.",
  },
] as const;

export default function SupplyPathViz() {
  return (
    <SceneShell
      eyebrow="제어와 공급은 다른 길"
      title="전극은 위에서 전기장으로 제어하고, 전자는 옆의 공급 영역에서 실리콘을 따라 옵니다"
      description="전극 아래를 자른 단면입니다. 위가 전극, 얇은 회색 띠가 10 nm 절연층, 아래가 p형 실리콘입니다. 공급 영역의 위치와 크기는 그림용 배치(가정)입니다."
      note="10 nm·100 µm²·1.0 V·문턱 0.5 V는 이 글의 가정입니다. 점과 기호의 개수는 그림용입니다."
      ariaLabel="MOS 단면에서 전기장 제어와 전자 공급 경로"
      scenes={SCENES}
      render={(active) => {
        const electronCount = active === 0 ? 0 : active === 1 ? 3 : active === 2 ? 4 : ELECTRON_SLOTS.length;
        const shown = ELECTRON_SLOTS.slice(0, electronCount);
        const flowing = active === 1 || active === 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 전극과 절연층 */}
            <rect x={GATE_X0} y={34} width={GATE_X1 - GATE_X0} height={26} rx={3} fill="#e2e8f0" stroke="#475569" strokeWidth={1} />
            <text x={(GATE_X0 + GATE_X1) / 2} y={51} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1e293b">전극 1.0 V</text>
            <rect x={GATE_X0} y={60} width={GATE_X1 - GATE_X0} height={14} fill="#cbd5e1" stroke="#64748b" strokeWidth={1} />
            <text x={GATE_X0 - 6} y={71} textAnchor="end" fontSize={10} fill="#475569">절연층 10 nm</text>

            {/* 실리콘 바탕 */}
            <rect x={14} y={SI_TOP} width={W - 28} height={120} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
            <text x={W - 20} y={SI_TOP + 112} textAnchor="end" fontSize={11} fill="#475569">p형 실리콘</text>

            {/* 공급 영역 */}
            <rect x={22} y={SI_TOP} width={SUPPLY_X1 - 22} height={34} fill="#dbeafe" stroke="#2563eb" strokeWidth={1} />
            <text x={(22 + SUPPLY_X1) / 2} y={SI_TOP + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">n+ 공급 영역</text>
            <text x={(22 + SUPPLY_X1) / 2} y={SI_TOP + 28} textAnchor="middle" fontSize={10} fill="#1d4ed8">바탕과 같은 0 V</text>

            {/* 공급 영역과 바탕의 연결 */}
            <path d={`M 30 ${SI_TOP} L 30 22 L 8 22 L 8 ${SI_TOP + 140} L 60 ${SI_TOP + 140}`} fill="none" stroke="#64748b" strokeWidth={1} />
            <line x1={60} x2={60} y1={SI_TOP + 120} y2={SI_TOP + 140} stroke="#64748b" strokeWidth={1} />
            <text x={68} y={SI_TOP + 145} fontSize={10} fill="#475569">바탕 단자 0 V</text>

            {/* 전기장 방향 */}
            {[190, 235, 280].map((x) => (
              <g key={x}>
                <line x1={x} x2={x} y1={62} y2={SI_TOP + 22} stroke="#7c3aed" strokeWidth={1} strokeDasharray="3 2" />
                <path d={`M ${x - 3} ${SI_TOP + 17} L ${x} ${SI_TOP + 23} L ${x + 3} ${SI_TOP + 17}`} fill="none" stroke="#7c3aed" strokeWidth={1} />
              </g>
            ))}
            <text x={GATE_X1} y={16} textAnchor="end" fontSize={10} fill="#6d28d9">점선: 전기장 제어 방향</text>
            {active === 0 && (
              <g>
                <line x1={156} x2={170} y1={60} y2={74} stroke="#dc2626" strokeWidth={1.25} />
                <line x1={170} x2={156} y1={60} y2={74} stroke="#dc2626" strokeWidth={1.25} />
                <text x={GATE_X0} y={28} fontSize={10} fill="#b91c1c">× 직류 통과 없음</text>
              </g>
            )}

            {/* 밀려난 정공과 드러난 억셉터 이온 */}
            {HOLE_SURFACE.map((x) => (
              <g key={`h${x}`}>
                <circle cx={x} cy={SI_TOP + 92} r={5} fill="#ffffff" stroke="#d97706" strokeWidth={1} />
                <text x={x} y={SI_TOP + 95} textAnchor="middle" fontSize={9} fill="#b45309">+</text>
              </g>
            ))}
            {IONS.map((x) => (
              <g key={`i${x}`}>
                <rect x={x - 4} y={SI_TOP + 46} width={8} height={8} fill="#ffffff" stroke="#475569" strokeWidth={1} />
                <text x={x} y={SI_TOP + 53} textAnchor="middle" fontSize={9} fill="#334155">−</text>
              </g>
            ))}

            {/* 공급 경로와 표면 전자 */}
            {flowing && (
              <g>
                <line x1={SUPPLY_X1 - 26} x2={GATE_X0 + 18} y1={SI_TOP + 20} y2={SI_TOP + 20} stroke="#2563eb" strokeWidth={1.25} />
                <path d={`M ${GATE_X0 + 12} ${SI_TOP + 16} L ${GATE_X0 + 18} ${SI_TOP + 20} L ${GATE_X0 + 12} ${SI_TOP + 24}`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              </g>
            )}
            {shown.map((x) => (
              <circle key={`e${x}`} cx={x} cy={SI_TOP + 8} r={4} fill="#2563eb" />
            ))}
            <text x={(GATE_X0 + GATE_X1) / 2} y={SI_TOP + 32} textAnchor="middle" fontSize={10} fill={active === 0 ? "#64748b" : "#1d4ed8"}>
              {active === 0 ? "표면 전자 아직 없음" : active === 3 ? "표면 전자 층 · 약 108만 개" : "표면 전자 모이는 중"}
            </text>

            {/* 범례 */}
            <g fontSize={10} fill="#475569">
              <circle cx={22} cy={H - 10} r={4} fill="#2563eb" />
              <text x={30} y={H - 6}>전자</text>
              <circle cx={70} cy={H - 10} r={5} fill="#ffffff" stroke="#d97706" strokeWidth={1} />
              <text x={80} y={H - 6}>밀려난 정공</text>
              <rect x={150} y={H - 14} width={8} height={8} fill="#ffffff" stroke="#475569" strokeWidth={1} />
              <text x={162} y={H - 6}>드러난 억셉터 이온</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
