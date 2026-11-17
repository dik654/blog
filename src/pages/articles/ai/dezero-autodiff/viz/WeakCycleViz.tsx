import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory — "모든 연결을 강한 참조로 두면 Variable과 Function이 서로를 붙잡아 참조 카운트가 0이 되지 않습니다.
 * 입력은 강한 참조로 보관하되 출력은 Weak으로 두면, 사용자가 출력 Variable을 버렸을 때 계산 그래프도 함께 해제될 수 있습니다."
 * 그림: x → f → y 한 칸. y.creator→f(강), f.inputs→x(강), f.outputs→y(강 또는 Weak), 사용자 변수→y(강).
 * y의 strong 수: 모두 강 = 사용자 1 + f.outputs 1 = 2 → drop 후 1. Weak = 1 → drop 후 0.
 */
type Edge = "strong" | "weak" | "gone";

const SCENES = [
  {
    label: "모두 강한 참조",
    summary: "y의 strong 수 2",
    user: true,
    outputs: "strong",
    alive: { x: true, f: true, y: true },
    yCount: 2,
    fCount: 1,
    note: "y는 creator로 f를 붙잡고, f는 outputs로 y를 붙잡습니다. 사용자 변수까지 합해 y를 잡는 강한 참조는 둘입니다.",
  },
  {
    label: "모두 강한 참조 · 사용자가 y를 버림",
    summary: "y 1, f 1 → 해제되지 않음",
    user: false,
    outputs: "strong",
    alive: { x: true, f: true, y: true },
    yCount: 1,
    fCount: 1,
    note: "사용자가 y를 버려도 f가 y를, y가 f를 서로 붙잡고 있어 어느 쪽 참조 카운트도 0이 되지 않습니다. 아무도 쓰지 않는 그래프가 메모리에 남습니다.",
  },
  {
    label: "outputs를 Weak으로",
    summary: "y의 strong 수 1",
    user: true,
    outputs: "weak",
    alive: { x: true, f: true, y: true },
    yCount: 1,
    fCount: 1,
    note: "f는 y를 Weak으로만 가리킵니다. Weak은 카운트에 들어가지 않으므로 y를 살려 두는 강한 참조는 사용자 변수 하나입니다. 입력 x는 backward에 필요하므로 여전히 강하게 잡습니다.",
  },
  {
    label: "Weak · 사용자가 y를 버림",
    summary: "y 0 → f 0 → 그래프 해제",
    user: false,
    outputs: "gone",
    alive: { x: true, f: false, y: false },
    yCount: 0,
    fCount: 0,
    note: "y의 strong 수가 0이 되어 y가 해제되고, y가 들고 있던 creator 참조가 사라져 f의 수도 0이 됩니다. f가 해제되면서 x를 잡던 강한 참조도 놓습니다. 테스트에서 확인할 값이 바로 이 0입니다.",
  },
] as const;

const W = 380;
const H = 176;
const P = { x: { x: 50, y: 92 }, f: { x: 190, y: 92 }, y: { x: 320, y: 92 }, user: { x: 320, y: 20 } };

function edgeStyle(kind: Edge) {
  if (kind === "strong") return { stroke: "#1e293b", dash: undefined, width: 1.25 };
  if (kind === "weak") return { stroke: "#2563eb", dash: "4 3", width: 1 };
  return { stroke: "#cbd5e1", dash: "2 4", width: 1 };
}

function Arrow({ d, kind, label, lx, ly }: { d: string; kind: Edge; label: string; lx: number; ly: number }) {
  const style = edgeStyle(kind);
  const marker = kind === "strong" ? "url(#wc-strong)" : kind === "weak" ? "url(#wc-weak)" : undefined;
  return (
    <g>
      <path d={d} fill="none" stroke={style.stroke} strokeWidth={style.width} strokeDasharray={style.dash} markerEnd={marker} />
      <text x={lx} y={ly} textAnchor="middle" fontSize={12} fill={kind === "gone" ? "#94a3b8" : style.stroke}>{label}</text>
    </g>
  );
}

export default function WeakCycleViz() {
  return (
    <SceneShell
      eyebrow="Rc · Weak"
      title="출력 쪽 연결을 Weak으로 끊어야 버린 그래프가 해제됩니다"
      description="Rc는 강한 참조 수(strong count)를 세어 0이 되면 값을 해제하고, Weak은 가리키기만 할 뿐 그 수에 들어가지 않습니다. 실선은 강한 참조, 파란 점선은 Weak입니다."
      ariaLabel="Variable과 Function 사이 강한 참조 순환과 Weak 출력 참조 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const yAlive = scene.alive.y;
        const fAlive = scene.alive.f;
        const creator: Edge = yAlive ? "strong" : "gone";
        const inputs: Edge = fAlive ? "strong" : "gone";
        const outputs: Edge = scene.outputs;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <defs>
                <marker id="wc-strong" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill="#1e293b" />
                </marker>
                <marker id="wc-weak" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" fill="#2563eb" />
                </marker>
              </defs>
              <Arrow d={`M${P.f.x - 32},${P.f.y} L${P.x.x + 20},${P.x.y}`} kind={inputs} label="inputs" lx={120} ly={P.x.y - 8} />
              <Arrow d={`M${P.y.x - 14},${P.y.y + 12} Q255,140 ${P.f.x + 26},${P.f.y + 14}`} kind={creator} label="creator" lx={255} ly={142} />
              <Arrow d={`M${P.f.x + 32},${P.f.y - 6} Q255,56 ${P.y.x - 18},${P.y.y - 8}`} kind={outputs} label={scene.outputs === "strong" ? "outputs" : "outputs (Weak)"} lx={255} ly={58} />
              <Arrow d={`M${P.user.x},${P.user.y + 12} L${P.y.x},${P.y.y - 22}`} kind={scene.user ? "strong" : "gone"} label="" lx={0} ly={0} />
              <text x={P.user.x} y={P.user.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.user ? "#1e293b" : "#94a3b8"}>
                {scene.user ? "사용자 변수 y" : "사용자 변수 버림"}
              </text>

              <circle cx={P.x.x} cy={P.x.y} r={18} fill="#ffffff" stroke="#334155" strokeWidth={1} />
              <text x={P.x.x} y={P.x.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">x</text>
              <text x={P.x.x} y={P.x.y + 34} textAnchor="middle" fontSize={12} fill="#475569">입력</text>

              <rect x={P.f.x - 32} y={P.f.y - 15} width={64} height={30} rx={4} fill="#ffffff" stroke={fAlive ? "#334155" : "#cbd5e1"} strokeWidth={1} strokeDasharray={fAlive ? undefined : "3 3"} />
              <text x={P.f.x} y={P.f.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={fAlive ? "#1e293b" : "#94a3b8"}>f</text>
              <text x={P.f.x} y={P.f.y + 36} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.fCount === 0 ? "#16a34a" : "#475569"}>
                {fAlive ? `strong ${scene.fCount}` : "strong 0 · 해제"}
              </text>

              <circle cx={P.y.x} cy={P.y.y} r={18} fill="#ffffff" stroke={yAlive ? "#334155" : "#cbd5e1"} strokeWidth={1} strokeDasharray={yAlive ? undefined : "3 3"} />
              <text x={P.y.x} y={P.y.y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={yAlive ? "#1e293b" : "#94a3b8"}>y</text>
              <text x={P.y.x} y={P.y.y + 34} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.yCount === 0 ? "#16a34a" : active === 1 ? "#dc2626" : "#475569"}>
                {yAlive ? `strong ${scene.yCount}` : "0 · 해제"}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
