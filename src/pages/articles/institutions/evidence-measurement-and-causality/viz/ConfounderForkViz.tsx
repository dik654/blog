import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 장치 선택과 사용량에 함께 영향을 주는 절약 성향이 교란이다.
 * 측정 오류와 우연한 표본 차이는 이 화살표와 다른 자리에서 생긴다. 화살표 = 영향을 주는 방향.
 */
const SCENES = [
  { label: "알고 싶은 길", summary: "장치 → 사용량", note: "비교에서 알고 싶은 것은 장치를 고른 일이 사용량을 줄였는지입니다. 그림에 이 화살표만 있다면 관측된 차이를 장치에 줄 수 있습니다." },
  { label: "뒤에서 오는 길", summary: "절약 성향 → 양쪽", note: "절약 성향이 있는 집은 장치를 고르기 쉽고, 그 성향만으로도 사용량이 다를 수 있습니다. 이렇게 원인을 뒤섞는 요인이 교란입니다." },
  { label: "같은 숫자에 합쳐짐", summary: "관측된 1은 어느 길로?", note: "사용량 칸에 도착한 값에는 어느 화살표를 타고 왔는지가 적혀 있지 않습니다. 관측된 1만 봐서는 두 길의 몫을 나눌 수 없습니다." },
  { label: "다른 자리의 문제", summary: "측정 오류 · 우연한 표본 차이", note: "측정 오류는 사용량이 기록될 때, 우연한 표본 차이는 작은 집단을 나눌 때 생깁니다. 교란과 자리가 달라 한 가지 절차로 모두 해결되지 않습니다." },
] as const;

const W = 340;
const H = 256;
const DEVICE = "#2563eb";
const CONFOUND = "#d97706";
const INK = "#64748b";
const FAINT = "#94a3b8";

function Box({ x, y, w, h, color, lines, dashed = false }: { x: number; y: number; w: number; h: number; color: string; lines: readonly string[]; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill="none" stroke={color} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={y + h / 2 + 5 + (index - (lines.length - 1) / 2) * 18} textAnchor="middle" fontSize={15} fontWeight={600} fill={color}>{line}</text>
      ))}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} />
      <path d="M0 0 l-7 -4 v8 z" fill={color} transform={`translate(${x2} ${y2}) rotate(${angle})`} />
    </g>
  );
}

export default function ConfounderForkViz() {
  return (
    <SceneShell
      eyebrow="교란의 자리"
      title="장치 줄과 성향 줄이 같은 사용량 칸에 도착합니다"
      description="칸은 관찰하거나 추정할 대상이고 화살표는 영향을 주는 방향입니다. 전력 장치 사례를 그대로 씁니다."
      ariaLabel="장치, 절약 성향, 사용량의 영향 관계와 측정 오류, 표본 차이의 자리를 나누어 보는 과정"
      scenes={SCENES}
      render={(active) => {
        const confounder = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={110} y={6} w={120} h={42} color={confounder ? CONFOUND : FAINT} lines={["절약 성향"]} dashed={!confounder} />
            <Box x={4} y={104} w={104} h={46} color={DEVICE} lines={["장치 선택"]} />
            <Box x={232} y={104} w={104} h={46} color={INK} lines={["사용량"]} />
            <Arrow x1={108} y1={127} x2={231} y2={127} color={DEVICE} />
            <text x={170} y={120} textAnchor="middle" fontSize={15} fontWeight={700} fill={DEVICE}>장치 효과?</text>
            {confounder && (
              <g>
                <Arrow x1={130} y1={48} x2={70} y2={103} color={CONFOUND} />
                <Arrow x1={210} y1={48} x2={270} y2={103} color={CONFOUND} />
              </g>
            )}
            {active === 2 && <text x={336} y={172} textAnchor="end" fontSize={15} fontWeight={700} fill={INK}>관측된 1: 어느 길로?</text>}
            {active === 3 && (
              <g>
                <Box x={232} y={206} w={104} h={42} color={INK} lines={["기록값"]} />
                <Arrow x1={284} y1={150} x2={284} y2={205} color="#dc2626" />
                <text x={277} y={184} textAnchor="end" fontSize={15} fontWeight={700} fill="#dc2626">측정 오류</text>
                <Box x={4} y={198} w={164} h={50} color={INK} lines={["우연한 표본 차이", "작은 집단을 나눌 때"]} dashed />
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
