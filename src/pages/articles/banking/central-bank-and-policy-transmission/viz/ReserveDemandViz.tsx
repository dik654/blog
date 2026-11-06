import SceneShell from "./SceneShell";

/**
 * 본문 대응: #operation-procedure — 빠듯한 구간은 작은 변화에 금리가 크게, 충분한 구간은 크게 변하지 않는다.
 * 눈금 없는 설명용 곡선이다. 같은 폭의 잔액 변화를 두 구간에 놓아 세로 변화만 비교한다.
 */
const SCENES = [
  { label: "준비금이 빠듯할 때", summary: "작은 변화 → 금리가 크게", note: "준비금이 빠듯한 운영에서는 수요의 작은 변화도 단기금리를 크게 움직일 수 있습니다. 목표보다 금리가 높아지는 이유가 부족분이라면 공급으로 압력을 줄일 수 있습니다." },
  { label: "준비금이 충분할 때", summary: "같은 폭 → 금리는 크게 안 변함", note: "은행이 조금 더 받거나 내놓아도 시장금리가 크게 변하지 않는 구간입니다. 준비금에 붙이는 부리 금리 등 관리금리가 중요한 기준이 됩니다. 남는다고 반드시 모두 흡수해야 한다는 결론은 성립하지 않습니다." },
  { label: "경계는 변합니다", summary: "충분함 ≠ 무한함", note: "충분함도 무한함과 다르며 분포·규제·결제 수요에 따라 경계가 변합니다. 점선은 경계가 옮겨간 한 예일 뿐 방향과 크기는 글에 없습니다(가정)." },
] as const;

const LEFT = 40;
const RIGHT = 340;
const BASE = 168;
const curveY = (px: number) => 150 - 120 * Math.exp(-(px - LEFT) / 45);
const toPath = (shift: number) =>
  Array.from({ length: 60 }, (_, index) => {
    const px = LEFT + shift + (index / 59) * (RIGHT - LEFT - shift);
    return `${px.toFixed(1)},${curveY(px - shift).toFixed(1)}`;
  }).join(" ");
const MAIN = toPath(0);
const SHIFTED = toPath(46);
const GRAY = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";

function Move({ from, to, color }: { from: number; to: number; color: string }) {
  const y1 = curveY(from);
  const y2 = curveY(to);
  return (
    <g>
      <line x1={from} x2={from} y1={y1} y2={BASE} stroke={color} strokeWidth={1} strokeDasharray="2 3" />
      <line x1={to} x2={to} y1={y2} y2={BASE} stroke={color} strokeWidth={1} strokeDasharray="2 3" />
      <line x1={from} x2={to} y1={BASE} y2={BASE} stroke={color} strokeWidth={1.25} />
      <line x1={LEFT} x2={from} y1={y1} y2={y1} stroke={color} strokeWidth={1} strokeDasharray="2 3" />
      <line x1={LEFT} x2={to} y1={y2} y2={y2} stroke={color} strokeWidth={1} strokeDasharray="2 3" />
      <line x1={LEFT} x2={LEFT} y1={y1} y2={y2} stroke={color} strokeWidth={1.25} />
      <circle cx={from} cy={y1} r={3} fill={color} />
      <circle cx={to} cy={y2} r={3} fill={color} />
    </g>
  );
}

export default function ReserveDemandViz() {
  return (
    <SceneShell
      eyebrow="준비금과 단기금리"
      title="같은 폭의 변화도 어느 구간이냐에 따라 금리를 다르게 움직입니다"
      description="글이 말한 방향만 옮긴 곡선입니다. 축에 눈금이 없고 모양은 설명용입니다(가정). 굵은 선은 가로축의 잔액 변화와 세로축의 금리 변화입니다."
      ariaLabel="빠듯한 구간과 충분한 구간에서 준비금 변화가 단기금리에 주는 영향"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 198" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={LEFT} x2={LEFT} y1={18} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <line x1={LEFT} x2={RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <text x={LEFT} y={12} fontSize={11} fill={GRAY}>단기금리</text>
          <text x={RIGHT} y={BASE + 22} textAnchor="end" fontSize={11} fill={GRAY}>준비금 잔액 →</text>
          <polyline points={MAIN} fill="none" stroke={BLUE} strokeWidth={1.25} />
          {active === 2 && <polyline points={SHIFTED} fill="none" stroke={GRAY} strokeWidth={1} strokeDasharray="4 3" />}
          {active === 0 && (
            <>
              <Move from={62} to={102} color={RED} />
              <text x={112} y={78} fontSize={12} fontWeight={700} fill={RED}>금리 변화 큼</text>
            </>
          )}
          {active === 1 && (
            <>
              <Move from={250} to={290} color={BLUE} />
              <text x={270} y={128} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>금리 변화 작음</text>
            </>
          )}
          {active === 2 && (
            <>
              <text x={150} y={84} fontSize={12} fontWeight={700} fill={GRAY}>경계가 옮겨간 한 예</text>
              <line x1={172} x2={152} y1={90} y2={122} stroke={GRAY} strokeWidth={1} />
            </>
          )}
        </svg>
      )}
    />
  );
}
