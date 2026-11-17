import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comet-architecture 금리 공식 — 같은 U를 두 곡선이 각자의 base·kink·slope로 읽는다.
 * 본문 예시값: supply b=1%, low=3%, K=80%, high=20% / borrow b=2%, low=5%, K=80%, high=100%.
 * U=0: 1%·2%, U=80%: 3.4%·6%, U=90%: 5.4%·16%, U=100%: 7.4%·26% (같은 식으로 계산).
 */
type Curve = { base: number; low: number; kink: number; high: number };

const SUPPLY: Curve = { base: 1, low: 3, kink: 0.8, high: 20 };
const BORROW: Curve = { base: 2, low: 5, kink: 0.8, high: 100 };

const rate = (curve: Curve, u: number) =>
  u <= curve.kink ? curve.base + curve.low * u : curve.base + curve.low * curve.kink + curve.high * (u - curve.kink);

const W = 360;
const H = 184;
const LEFT = 34;
const RIGHT = 14;
const TOP = 14;
const BOTTOM = 152;
const MAX_RATE = 28;
const x = (u: number) => LEFT + u * (W - LEFT - RIGHT);
const y = (r: number) => BOTTOM - (r / MAX_RATE) * (BOTTOM - TOP);
const pct = (r: number) => `${Number(r.toFixed(1))}%`;

const SCENES = [
  {
    label: "kink 전: 둘 다 완만하게",
    summary: "U 0→80%: 공급 1→3.4% · 차입 2→6%",
    note: "U는 공급된 base 중 빌려 나간 비율, kink는 기울기가 바뀌는 지점(여기서는 80%)입니다. 그 전까지 공급은 1%에서 기울기 3%, 차입은 2%에서 기울기 5%로 오릅니다.",
  },
  {
    label: "kink 뒤: 차입 곡선이 훨씬 가파르게",
    summary: "high slope 공급 20% · 차입 100%",
    note: "80%를 넘은 만큼에만 high slope를 곱합니다. 공급은 20%, 차입은 100%를 써서 kink 뒤 간격이 빠르게 벌어집니다.",
  },
  {
    label: "U = 90%에서 읽기",
    summary: "공급 5.4% · 차입 16%",
    note: "공급 1%+3%×0.8+20%×0.1=5.4%, 차입 2%+5%×0.8+100%×0.1=16%입니다. 공급 금리를 차입 금리×U×(1−reserve factor)로 유도하지 않고, 각자의 곡선에서 따로 읽습니다.",
  },
] as const;

function path(curve: Curve, until: number) {
  const points = [0, Math.min(curve.kink, until), until].map((u) => `${x(u).toFixed(1)},${y(rate(curve, u)).toFixed(1)}`);
  return `M${points.join(" L")}`;
}

export default function RateCurvesViz() {
  return (
    <SceneShell
      eyebrow="두 금리 곡선"
      title="같은 utilization에서 두 곡선이 서로 다른 금리를 냅니다"
      description="가로축은 utilization U, 세로축은 연율로 표시한 금리입니다. 두 곡선의 base·slope·kink는 본문 공식의 설명용 예시값이며 실제 배포 설정이 아닙니다."
      note="On-chain rate는 per-second 1e18 scale이며, 연율 변환은 seconds/year와 배포 설정을 고정해야 합니다."
      ariaLabel="Compound III 공급 금리와 차입 금리 곡선, utilization 90퍼센트에서 5.4퍼센트와 16퍼센트"
      scenes={SCENES}
      render={(active) => {
        const until = active === 0 ? 0.8 : 1;
        const u90 = 0.9;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 10, 20].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={tick === 0 ? 1 : 0.5} />
                <text x={LEFT - 5} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}%</text>
              </g>
            ))}
            {[0, 0.5, 0.8, 1].map((tick) => (
              <text key={tick} x={x(tick)} y={BOTTOM + 14} textAnchor="middle" fontSize={11} fill="#64748b">{Math.round(tick * 100)}%</text>
            ))}
            <text x={W - RIGHT} y={BOTTOM + 28} textAnchor="end" fontSize={11} fill="#64748b">utilization U</text>
            <line x1={x(0.8)} x2={x(0.8)} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(0.8) - 4} y={TOP + 10} textAnchor="end" fontSize={11} fill="#64748b">kink 80%</text>

            <path d={path(BORROW, until)} fill="none" stroke="#dc2626" strokeWidth={1.25} />
            <path d={path(SUPPLY, until)} fill="none" stroke="#2563eb" strokeWidth={1.25} />

            {active === 0 && (
              <>
                <text x={x(0.8) - 4} y={y(6) - 8} textAnchor="end" fontSize={11} fontWeight={700} fill="#b91c1c">차입 6%</text>
                <text x={x(0.8) - 4} y={y(3.4) + 14} textAnchor="end" fontSize={11} fontWeight={700} fill="#1d4ed8">공급 3.4%</text>
              </>
            )}
            {active === 1 && (
              <>
                <text x={x(1) - 4} y={y(26) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#b91c1c">차입 26%</text>
                <text x={x(1) - 4} y={y(7.4) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill="#1d4ed8">공급 7.4%</text>
              </>
            )}
            {active === 2 && (
              <>
                <line x1={x(u90)} x2={x(u90)} y1={TOP} y2={BOTTOM} stroke="#64748b" strokeWidth={1} />
                <text x={x(u90)} y={BOTTOM + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">90%</text>
                <circle cx={x(u90)} cy={y(rate(BORROW, u90))} r={3.5} fill="#dc2626" />
                <circle cx={x(u90)} cy={y(rate(SUPPLY, u90))} r={3.5} fill="#2563eb" />
                <text x={x(u90) - 6} y={y(rate(BORROW, u90)) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#b91c1c">차입 {pct(rate(BORROW, u90))}</text>
                <text x={x(u90) - 6} y={y(rate(SUPPLY, u90)) + 22} textAnchor="end" fontSize={11} fontWeight={700} fill="#1d4ed8">공급 {pct(rate(SUPPLY, u90))}</text>
              </>
            )}

            <g>
              <line x1={LEFT + 8} x2={LEFT + 24} y1={TOP + 8} y2={TOP + 8} stroke="#dc2626" strokeWidth={1.25} />
              <text x={LEFT + 28} y={TOP + 12} fontSize={11} fill="#64748b">차입 곡선</text>
              <line x1={LEFT + 8} x2={LEFT + 24} y1={TOP + 24} y2={TOP + 24} stroke="#2563eb" strokeWidth={1.25} />
              <text x={LEFT + 28} y={TOP + 28} fontSize={11} fill="#64748b">공급 곡선</text>
            </g>
          </svg>
        );
      }}
    />
  );
}
