import SceneShell from "./SceneShell";

/**
 * 본문 대응: #failure-boundary — x=z²는 z와 −z가 같은 x로 가므로 bijection이 아니고,
 * 한 inverse branch만 골라 determinant를 곱하면 다른 branch의 mass를 잃는다.
 * Base는 1절 예의 standard Gaussian. x∈[0.25, 1] 구간은 그림용 가정 → z∈[0.5, 1]과 [−1, −0.5] 두 조각.
 * 대칭이라 두 조각 질량이 같고, z≥0 branch만 세면 전체 질량 1 중 절반만 남는다.
 */
const pZ = (z: number) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

const integrate = (f: (t: number) => number, a: number, b: number, n = 200) => {
  const h = (b - a) / n;
  return Array.from({ length: n + 1 }).reduce<number>((sum, _, i) => {
    const weight = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
    return sum + weight * f(a + i * h);
  }, 0) * (h / 3);
};

const LO = 0.5;
const HI = 1;
const PIECE_POS = integrate(pZ, LO, HI);
const PIECE_NEG = integrate(pZ, -HI, -LO);
const ARRIVED = PIECE_POS + PIECE_NEG;
const HALF_TOTAL = integrate(pZ, 0, 8);

const W = 360;
const LEFT = 16;
const RIGHT = W - 16;
const DOMAIN = 3;
const sz = (v: number) => LEFT + ((v + DOMAIN) / (2 * DOMAIN)) * (RIGHT - LEFT);
const X_MAX = 4;
const sxx = (v: number) => sz(0) + (v / X_MAX) * (RIGHT - sz(0));
const TOP_BASE = 104;
const YS = 180;
const BOT_Y = 196;
const BLUE = "#2563eb";
const ORANGE = "#ea580c";

const curve = Array.from({ length: 121 }, (_, i) => {
  const v = -DOMAIN + (i / 120) * 2 * DOMAIN;
  return `${i === 0 ? "M" : "L"}${sz(v).toFixed(1)} ${(TOP_BASE - pZ(v) * YS).toFixed(1)}`;
}).join(" ");

const area = (lo: number, hi: number) => {
  const pts = Array.from({ length: 21 }, (_, i) => {
    const v = lo + (i / 20) * (hi - lo);
    return `L${sz(v).toFixed(1)} ${(TOP_BASE - pZ(v) * YS).toFixed(1)}`;
  }).join(" ");
  return `M${sz(lo).toFixed(1)} ${TOP_BASE} ${pts} L${sz(hi).toFixed(1)} ${TOP_BASE} Z`;
};

const SCENES = [
  {
    label: "두 조각이 한 곳으로",
    summary: "z와 −z → 같은 x",
    note: `x=z²에서는 z∈[0.5, 1]과 z∈[−1, −0.5]가 모두 x∈[0.25, 1]로 접힙니다. 이 x 구간에 실제로 도착하는 질량은 두 조각의 합 ${PIECE_POS.toFixed(3)} + ${PIECE_NEG.toFixed(3)} = ${ARRIVED.toFixed(3)}입니다.`,
  },
  {
    label: "한 branch만 고르면",
    summary: `${ARRIVED.toFixed(3)} 중 ${PIECE_POS.toFixed(3)}만 셈`,
    note: `inverse로 z=+√x 한 branch만 골라 determinant를 곱하면 오른쪽 조각만 거슬러 올라갑니다. 왼쪽 조각 ${PIECE_NEG.toFixed(3)}은 계산에 들어오지 않아, 이 구간의 질량을 절반만 셉니다.`,
  },
  {
    label: "전체로 보면",
    summary: `전체 질량 1 중 ${HALF_TOTAL.toFixed(2)}`,
    note: `모든 x>0에 대해 같은 일이 생깁니다. standard Gaussian은 0을 중심으로 대칭이라 z<0 쪽 질량 ${HALF_TOTAL.toFixed(2)}가 통째로 빠지고, 한 branch 식으로 만든 밀도의 전체 넓이는 1이 아니라 ${HALF_TOTAL.toFixed(2)}입니다. 그래서 x=z² 같은 many-to-one 함수에는 단일 inverse 공식을 쓸 수 없습니다.`,
  },
] as const;

export default function FoldingBranchViz() {
  return (
    <SceneShell
      eyebrow="bijection이 아닐 때"
      title="x=z²는 두 z를 한 x로 접어 질량을 잃게 만든다"
      description="위는 base z의 standard Gaussian 밀도, 아래는 x=z²가 도착하는 x 축입니다. 칠한 x 구간 [0.25, 1]은 그림을 위한 가정입니다. 숫자는 그 구간의 확률 질량(밀도 곡선 아래 넓이)입니다."
      ariaLabel="x=z squared가 z와 마이너스 z를 같은 x로 보내 한 inverse branch만 쓰면 질량 절반을 잃는 과정"
      scenes={SCENES}
      render={(active) => {
        const negDropped = active >= 1;
        const xLo = sxx(LO * LO);
        const xHi = sxx(HI * HI);
        const barW = (RIGHT - LEFT) / 2;
        return (
          <svg viewBox={`0 0 ${W} 280`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={14} fontSize={11} fontWeight={700} fill="currentColor">pZ(z)</text>
            {active === 2 && <path d={area(-DOMAIN, 0)} fill="#94a3b8" fillOpacity={0.25} stroke="none" />}
            {active === 2 && <path d={area(0, DOMAIN)} fill={BLUE} fillOpacity={0.1} stroke="none" />}
            <path d={area(LO, HI)} fill={BLUE} fillOpacity={0.3} stroke="none" />
            <path d={area(-HI, -LO)} fill={ORANGE} fillOpacity={negDropped ? 0.12 : 0.3} stroke={negDropped ? ORANGE : "none"} strokeWidth={1} strokeDasharray="3 3" />
            <path d={curve} fill="none" stroke="currentColor" strokeWidth={1.25} />
            <line x1={LEFT} x2={RIGHT} y1={TOP_BASE} y2={TOP_BASE} stroke="#94a3b8" strokeWidth={1} />
            {[-2, -1, 0, 1, 2].map((v) => (
              <text key={`z${v}`} x={sz(v)} y={TOP_BASE + 13} textAnchor="middle" fontSize={9} fill="#64748b">{v}</text>
            ))}
            <text x={RIGHT} y={TOP_BASE + 13} textAnchor="end" fontSize={10} fill="#64748b">z</text>

            <line x1={sz((LO + HI) / 2)} x2={(xLo + xHi) / 2 + 4} y1={TOP_BASE + 18} y2={BOT_Y - 10} stroke={BLUE} strokeWidth={1.25} />
            <line x1={sz(-(LO + HI) / 2)} x2={(xLo + xHi) / 2 - 4} y1={TOP_BASE + 18} y2={BOT_Y - 10} stroke={ORANGE} strokeWidth={1.25} strokeDasharray={negDropped ? "3 3" : undefined} opacity={negDropped ? 0.5 : 1} />
            {negDropped && (
              <text x={sz(-(LO + HI) / 2) - 4} y={TOP_BASE + 40} textAnchor="end" fontSize={10} fontWeight={700} fill={ORANGE}>세지 않음</text>
            )}

            <line x1={sz(0)} x2={RIGHT} y1={BOT_Y} y2={BOT_Y} stroke="#94a3b8" strokeWidth={1} />
            <rect x={xLo} y={BOT_Y - 6} width={xHi - xLo} height={6} fill={BLUE} fillOpacity={0.5} />
            {[0, 1, 2, 3].map((v) => (
              <text key={`x${v}`} x={sxx(v)} y={BOT_Y + 13} textAnchor="middle" fontSize={9} fill="#64748b">{v}</text>
            ))}
            <text x={RIGHT} y={BOT_Y + 13} textAnchor="end" fontSize={10} fill="#64748b">x = z²</text>

            <text x={LEFT} y={238} fontSize={10} fill="currentColor">
              {active === 2 ? "전체 질량 1" : "x∈[0.25, 1]에 도착한 질량"}
            </text>
            {(() => {
              const total = active === 2 ? 1 : ARRIVED;
              const counted = active === 2 ? HALF_TOTAL : negDropped ? PIECE_POS : ARRIVED;
              const scale = active === 2 ? barW * 2 : barW / ARRIVED;
              const fullW = active === 2 ? scale : total * scale;
              const countedW = active === 2 ? HALF_TOTAL * scale : counted * scale;
              return (
                <g>
                  <rect x={LEFT} y={246} width={fullW} height={14} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                  <rect x={LEFT} y={246} width={countedW} height={14} rx={2} fill={BLUE} fillOpacity={0.55} />
                  {!negDropped && <rect x={LEFT + PIECE_POS * scale} y={246} width={PIECE_NEG * scale} height={14} fill={ORANGE} fillOpacity={0.55} />}
                  <text x={LEFT + (active === 1 ? fullW : countedW) + 6} y={257} fontSize={10} fontWeight={700} fill={BLUE}>
                    {negDropped ? `한 branch가 세는 몫 ${counted.toFixed(active === 2 ? 2 : 3)}` : `${ARRIVED.toFixed(3)}`}
                  </text>
                </g>
              );
            })()}
          </svg>
        );
      }}
    />
  );
}
