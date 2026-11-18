import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — RDHx는 server가 공기로 내보낸 열을 rack 뒤에서 물로 옮기고(server 내부는 공랭),
 * DLC는 cold plate가 GPU·CPU 열을 server 안에서 냉각수로 직접 받습니다.
 * 차이는 "물이 server 경계 안으로 들어가는가"입니다(9절 실물 2의 text diagram과 같은 경로).
 */
const C = {
  ink: "#334155",
  muted: "#64748b",
  line: "#94a3b8",
  cold: "#2563eb",
  hot: "#dc2626",
  water: "#0f766e",
  mark: "#d97706",
};

const SCENES = [
  {
    label: "RDHx: 물은 rack 뒤 door에서 만납니다",
    summary: "칩 → 공기 → rear door → 물",
    note: "서버 안은 여전히 공랭입니다. fan이 칩의 열을 공기로 실어 내보내고, 뒤쪽 door의 coil이 그 배기 공기에서 물로 열을 넘깁니다. 같은 guide가 자체 fan 없는 passive door를 B300에 권장하지 않으므로 door는 active 방식으로 봅니다.",
  },
  {
    label: "DLC: 물이 서버 안 칩까지 들어갑니다",
    summary: "칩 → cold plate → 냉각수 → CDU",
    note: "cold plate(부품에 맞붙인 냉각 판)가 GPU·CPU에 붙어 열을 서버 안에서 냉각수로 직접 받습니다. 데워진 냉각수는 CDU(냉각수 분배 장치, 6절)에서 facility water로 열을 넘깁니다. 배관이 서버 경계를 넘어 들어오는 만큼 누수 경계와 서비스 절차가 RDHx와 다릅니다.",
  },
] as const;

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 5;
  const a1 = angle + Math.PI * 0.82;
  const a2 = angle - Math.PI * 0.82;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <polygon
        points={`${x2},${y2} ${x2 + head * Math.cos(a1)},${y2 + head * Math.sin(a1)} ${x2 + head * Math.cos(a2)},${y2 + head * Math.sin(a2)}`}
        fill={color}
      />
    </g>
  );
}

export default function CoolingBoundaryViz() {
  return (
    <SceneShell
      eyebrow="물이 열을 받는 지점"
      title="RDHx와 DLC는 물이 서버 경계 안으로 들어가는지가 다릅니다"
      description="RDHx는 후면 도어 열교환기, DLC는 직접 액체 냉각입니다. rack 옆에서 본 단면 그림입니다. 굵은 사각형이 서버 한 대의 경계이고, 주황 점이 물이 처음 열을 받는 자리입니다. 크기와 위치는 개념을 보이기 위한 그림이며 실제 장비 배치가 아닙니다(가정)."
      ariaLabel="RDHx와 DLC에서 물이 열을 받는 위치 비교 단면도"
      scenes={SCENES}
      render={(active) => {
        const rdhx = active === 0;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 서버 경계 */}
            <rect x={70} y={36} width={160} height={118} rx={6} fill="none" stroke={C.ink} strokeWidth={1.25} />
            <text x={76} y={30} fontSize={10} fontWeight={700} fill={C.ink}>서버 경계</text>
            {/* fan */}
            <circle cx={92} cy={70} r={11} fill="none" stroke={C.line} strokeWidth={1} />
            <line x1={84} y1={70} x2={100} y2={70} stroke={C.line} strokeWidth={1} />
            <line x1={92} y1={62} x2={92} y2={78} stroke={C.line} strokeWidth={1} />
            <text x={92} y={96} textAnchor="middle" fontSize={9} fill={C.muted}>fan</text>
            {/* 칩 */}
            <rect x={128} y={104} width={48} height={24} rx={3} fill="#64748b22" stroke={C.muted} strokeWidth={1} />
            <text x={152} y={120} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.ink}>GPU·CPU</text>

            {rdhx ? (
              <g>
                <Arrow x1={14} y1={70} x2={66} y2={70} color={C.cold} />
                <text x={14} y={60} fontSize={9.5} fill={C.cold}>찬 공기</text>
                <Arrow x1={106} y1={78} x2={214} y2={78} color={C.hot} />
                <text x={160} y={70} textAnchor="middle" fontSize={9.5} fill={C.hot}>칩의 열을 실은 공기</text>
                <Arrow x1={230} y1={78} x2={246} y2={78} color={C.hot} />
                {/* active rear door */}
                <rect x={248} y={36} width={20} height={118} rx={3} fill="#0f766e14" stroke={C.water} strokeWidth={1.25} />
                {[52, 68, 84, 100, 116, 132].map((y) => (
                  <line key={y} x1={251} y1={y} x2={265} y2={y} stroke={C.water} strokeWidth={1} />
                ))}
                <text x={258} y={30} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.water}>active RDHx</text>
                <Arrow x1={270} y1={78} x2={318} y2={78} color={C.cold} />
                <text x={294} y={70} textAnchor="middle" fontSize={9.5} fill={C.cold}>식은 공기</text>
                <line x1={258} y1={154} x2={258} y2={178} stroke={C.water} strokeWidth={1.25} />
                <Arrow x1={258} y1={178} x2={330} y2={178} color={C.water} />
                <text x={268} y={194} fontSize={9.5} fill={C.water}>facility water</text>
                <circle cx={258} cy={78} r={5} fill={C.mark} />
                <text x={118} y={172} fontSize={9.5} fill={C.ink}>서버 안에는 물이 없음</text>
              </g>
            ) : (
              <g>
                <rect x={126} y={96} width={52} height={8} rx={2} fill={C.water} />
                <text x={152} y={90} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C.water}>cold plate</text>
                <line x1={178} y1={100} x2={230} y2={100} stroke={C.water} strokeWidth={1.25} />
                <Arrow x1={230} y1={100} x2={276} y2={100} color={C.water} />
                <rect x={280} y={84} width={60} height={32} rx={4} fill="#0f766e14" stroke={C.water} strokeWidth={1} />
                <text x={310} y={104} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.water}>CDU</text>
                <line x1={310} y1={116} x2={310} y2={178} stroke={C.water} strokeWidth={1.25} strokeDasharray="3 3" />
                <text x={318} y={194} textAnchor="end" fontSize={9.5} fill={C.water}>facility water</text>
                <text x={250} y={134} textAnchor="middle" fontSize={9} fill={C.water}>냉각수 loop</text>
                <circle cx={152} cy={100} r={5} fill={C.mark} />
                <text x={118} y={172} fontSize={9.5} fill={C.ink}>냉각수가 서버 경계를 넘음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
