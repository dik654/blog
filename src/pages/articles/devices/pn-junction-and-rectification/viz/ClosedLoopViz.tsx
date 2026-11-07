import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why, #depletion — 순전류 0은 내부 전기장 0이 아니다.
 * 장벽을 전지처럼 저항에 이어도 접촉 부분까지 포함한 열평형 회로에는 지속 전류가 없다.
 * 전류 방향은 공급 방식에 따라 달라 화살표로 정하지 않는다.
 */
const W = 360;
const H = 172;
const DEVICE_TOP = 28;
const DEVICE_BOTTOM = 84;
const MID_Y = (DEVICE_TOP + DEVICE_BOTTOM) / 2;
const ACCENT = "#2563eb";
const WARN = "#d97706";
const DONE = "#16a34a";
const MUTED = "#64748b";

const SCENES = [
  { label: "안에서 맞서는 두 흐름", summary: "단자 순전류 0 · 내부 전기장 있음", wire: "off", readout: "단자로 나오는 전류 0", color: MUTED, note: "농도 차이로 퍼지는 흐름과 전기장이 되돌리는 흐름이 상쇄됩니다. 전기장이 사라져서 0이 된 것이 아닙니다." },
  { label: "작은 전지처럼 잇는다면", summary: "경계의 전위 차이 → 저항에 전류?", wire: "try", readout: "전류가 나올까?", color: WARN, note: "경계에 전위 차이가 있으니 저항을 이으면 전류가 돌 것처럼 보입니다. 장벽만 따로 떼어 생각했을 때의 기대입니다." },
  { label: "접촉 부분까지 포함하면", summary: "열평형 회로 → 지속 전류 없음", wire: "try", readout: "순환 전류 없음", color: MUTED, note: "실제 회로는 접합과 저항만이 아니라 접촉 부분까지 포함합니다. 닫힌 열평형 회로에서는 이 전체의 균형이 맞아 전류가 돌지 않습니다." },
  { label: "에너지를 공급하면", summary: "바깥 전압 또는 빛 → 전류", wire: "on", readout: "바깥 전압 또는 빛 공급", color: DONE, note: "전류를 얻으려면 바깥에서 전압을 걸거나 빛처럼 에너지를 공급해야 합니다. 이 글은 7절에서 전압을 겁니다." },
] as const;

export default function ClosedLoopViz() {
  return (
    <SceneShell
      eyebrow="0 A와 내부 전기장"
      title="전기장이 있어도 열평형에서는 저항에서 전력을 꺼낼 수 없습니다"
      description="위 상자가 접합입니다. 양끝의 작은 칸은 접촉 부분이고, 아래 선은 저항으로 이어지는 바깥 회로입니다."
      note="회로의 모양은 설명용이며 전위나 길이를 축척대로 그리지 않았습니다. 첫 장면의 두 화살표는 전류의 방향입니다. 퍼지는 전자는 왼쪽으로 움직이지만 음전하라서 전류로는 오른쪽입니다."
      ariaLabel="접합을 저항에 이어도 열평형에서는 전류가 돌지 않고 에너지를 공급해야 흐르는 회로 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const wireColor = scene.wire === "on" ? DONE : "#94a3b8";
        const dash = scene.wire === "off" ? "2 4" : scene.wire === "try" ? "4 3" : undefined;
        const contactsLit = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <path d={`M60 ${MID_Y} H26 V146 H140 M220 146 H334 V${MID_Y} H300`} fill="none" stroke={wireColor} strokeWidth={1.25} strokeDasharray={dash} />
            <rect x={140} y={134} width={80} height={24} rx={4} fill="none" stroke={wireColor} strokeWidth={1} strokeDasharray={scene.wire === "off" ? "2 4" : undefined} />
            <text x={180} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill={MUTED}>저항</text>

            <rect x={84} y={DEVICE_TOP} width={96} height={DEVICE_BOTTOM - DEVICE_TOP} fill="#d97706" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1} />
            <rect x={180} y={DEVICE_TOP} width={96} height={DEVICE_BOTTOM - DEVICE_TOP} fill="#2563eb" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={1} />
            <text x={112} y={MID_Y + 4} textAnchor="middle" fontSize={10.5} fill={MUTED}>정공 많음</text>
            <text x={248} y={MID_Y + 4} textAnchor="middle" fontSize={10.5} fill={MUTED}>전자 많음</text>
            {[60, 276].map((x) => (
              <rect key={x} x={x} y={DEVICE_TOP} width={24} height={DEVICE_BOTTOM - DEVICE_TOP} fill={contactsLit ? WARN : "none"} fillOpacity={contactsLit ? 0.25 : 0} stroke={contactsLit ? WARN : "#94a3b8"} strokeWidth={contactsLit ? 1.25 : 1} />
            ))}
            <text x={72} y={22} textAnchor="middle" fontSize={10} fontWeight={contactsLit ? 700 : 400} fill={contactsLit ? WARN : MUTED}>접촉</text>
            <text x={288} y={22} textAnchor="middle" fontSize={10} fontWeight={contactsLit ? 700 : 400} fill={contactsLit ? WARN : MUTED}>접촉</text>

            {active === 0 && (
              <>
                <text x={180} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={MUTED}><tspan fill={ACCENT}>퍼지는 흐름 →</tspan> · <tspan fill={WARN}>← 되돌리는 흐름</tspan></text>
                <line x1={154} x2={206} y1={44} y2={44} stroke={ACCENT} strokeWidth={1.25} />
                <path d={`M201 40 L206 44 L201 48`} fill="none" stroke={ACCENT} strokeWidth={1.25} />
                <line x1={206} x2={154} y1={68} y2={68} stroke={WARN} strokeWidth={1.25} />
                <path d={`M159 64 L154 68 L159 72`} fill="none" stroke={WARN} strokeWidth={1.25} />
              </>
            )}
            {active > 0 && <line x1={180} x2={180} y1={DEVICE_TOP} y2={DEVICE_BOTTOM} stroke={MUTED} strokeWidth={1} strokeDasharray="2 2" />}
            <text x={180} y={114} textAnchor="middle" fontSize={12} fontWeight={700} fill={scene.color}>{scene.readout}</text>
          </svg>
        );
      }}
    />
  );
}
