import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bias — 왼쪽 단자를 높이면 장벽이 낮아지고, 낮추면 장벽과 공핍 영역이 커진다.
 * 언덕의 높이·폭과 화살표 수는 많고 적음의 방향만 나타낸다. 전류값은 본문의 이상식 계산이다.
 */
const W = 360;
const H = 186;
const BASE_Y = 136;
const CENTER = 180;
const HOLE = "#d97706";
const ELECTRON = "#2563eb";
const MUTED = "#64748b";

const SCENES = [
  { label: "0 V 열평형", summary: "단자 순전류 0 A", height: 58, half: 50, flow: 0, widthWord: "기준", note: "바깥 전압이 없습니다. 언덕을 넘는 흐름과 되돌리는 흐름이 맞아 단자 순전류가 0입니다." },
  { label: "+0.5 V: 왼쪽을 높임", summary: "장벽 낮아짐 → 약 0.251 mA", height: 36, half: 40, flow: 1, widthWord: "좁아짐", note: "장벽이 낮아져 더 많은 전자와 정공이 경계를 넘습니다. 넘어간 쪽에서 이들은 수가 적은 소수 캐리어가 됩니다." },
  { label: "+0.6 V: 더 높임", summary: "장벽 더 낮아짐 → 약 12.03 mA", height: 26, half: 33, flow: 3, widthWord: "더 좁아짐", note: "건너가는 전하가 크게 늘어납니다. 0.1 V 차이가 왜 이렇게 큰지는 다음 절의 식으로 셉니다." },
  { label: "−0.5 V: 왼쪽을 낮춤", summary: "장벽 높아짐 → 약 −1 pA", height: 84, half: 74, flow: -1, widthWord: "넓어짐", note: "많은 쪽 전하가 건너기 어려워집니다. 0은 아니어서 작은 반대 전류가 남습니다. 이 방향의 전압이 크면 항복도 일어날 수 있습니다." },
] as const;

function Horizontal({ x1, x2, y, color, dashed = false }: { x1: number; x2: number; y: number; color: string; dashed?: boolean }) {
  const tip = x2 > x1 ? -5 : 5;
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 2" : undefined} />
      <path d={`M${x2 + tip} ${y - 4} L${x2} ${y} L${x2 + tip} ${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
    </g>
  );
}

export default function BarrierBiasViz() {
  return (
    <SceneShell
      eyebrow="같은 경계, 다른 전압"
      title="바깥 전압이 경계의 언덕을 낮추거나 높입니다"
      description="언덕은 전하가 경계를 넘기 어려운 정도입니다. 정공은 왼쪽에서, 전자는 오른쪽에서 넘습니다."
      note="전류의 양수 방향은 왼쪽에서 오른쪽입니다. 언덕의 높이·폭과 화살표 수는 많고 적음의 방향만 나타내며 실제 전위나 길이가 아닙니다. 전류는 300 K, 기준 전류 1 pA를 가정한 이상식의 안정 상태 값이고, 실제 소자의 항복은 넣지 않았습니다."
      ariaLabel="전압에 따라 경계의 장벽 높이와 폭, 넘어가는 전하가 달라지는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const top = BASE_Y - scene.height;
        const left = CENTER - scene.half;
        const right = CENTER + scene.half;
        const hill = `M12 ${BASE_Y} L${left} ${BASE_Y} C${left + scene.half * 0.5} ${BASE_Y} ${CENTER - scene.half * 0.4} ${top} ${CENTER} ${top} C${CENTER + scene.half * 0.4} ${top} ${right - scene.half * 0.5} ${BASE_Y} ${right} ${BASE_Y} L348 ${BASE_Y}`;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={12} y={14} fontSize={11} fontWeight={700} fill={HOLE}>왼쪽: 정공이 많음</text>
            <text x={348} y={14} textAnchor="end" fontSize={11} fontWeight={700} fill={ELECTRON}>오른쪽: 전자가 많음</text>
            <path d={hill} fill="none" stroke={MUTED} strokeWidth={1.25} />
            {[28, 48, 68].map((x) => (
              <g key={x}>
                <circle cx={x} cy={BASE_Y - 8} r={6.5} fill="#ffffff" stroke={HOLE} strokeWidth={1.25} />
                <text x={x} y={BASE_Y - 4.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={HOLE}>+</text>
              </g>
            ))}
            {[292, 312, 332].map((x) => (
              <g key={x}>
                <circle cx={x} cy={BASE_Y - 8} r={6.5} fill={ELECTRON} />
                <text x={x} y={BASE_Y - 4.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">−</text>
              </g>
            ))}
            {scene.flow > 0 &&
              Array.from({ length: scene.flow }, (_, row) => (
                <g key={row}>
                  <Horizontal x1={96} x2={168} y={top - 10 - row * 12} color={HOLE} />
                  <Horizontal x1={264} x2={192} y={top - 10 - row * 12} color={ELECTRON} />
                </g>
              ))}
            {scene.flow === 0 && (
              <>
                <Horizontal x1={150} x2={210} y={top - 16} color={MUTED} />
                <Horizontal x1={210} x2={150} y={top - 8} color={MUTED} />
              </>
            )}
            {scene.flow < 0 && (
              <>
                <Horizontal x1={78} x2={left + 2} y={BASE_Y - 8} color={HOLE} />
                <Horizontal x1={282} x2={right - 2} y={BASE_Y - 8} color={ELECTRON} />
                <Horizontal x1={212} x2={148} y={top - 10} color={MUTED} dashed />
                <text x={180} y={top - 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={MUTED}>작은 반대 전류</text>
              </>
            )}
            <line x1={left} x2={right} y1={BASE_Y + 12} y2={BASE_Y + 12} stroke={MUTED} strokeWidth={1} />
            <line x1={left} x2={left} y1={BASE_Y + 8} y2={BASE_Y + 16} stroke={MUTED} strokeWidth={1} />
            <line x1={right} x2={right} y1={BASE_Y + 8} y2={BASE_Y + 16} stroke={MUTED} strokeWidth={1} />
            <text x={CENTER} y={BASE_Y + 30} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={MUTED}>공핍 영역 폭: {scene.widthWord}</text>
          </svg>
        );
      }}
    />
  );
}
