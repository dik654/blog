import SceneShell from "./SceneShell";

/**
 * 본문 대응: #interest-rate — 기본 2%, 첫 구간 +4%p, 두 번째 구간 +75%p, 기준 사용률 80%, 프로토콜 몫 10% (모두 가정).
 * 차입 이율: U≤80% → 2 + 4·U/80, U>80% → 6 + 75·(U−80)/20. 80% → 6%, 90% → 43.5%.
 * 공급 이율(unbacked=0): r_v × U × 0.9 → 80% 4.32%, 90% 35.235%.
 */
const BASE = 2;
const SLOPE1 = 4;
const SLOPE2 = 75;
const KINK = 80;
const RESERVE_FACTOR = 0.1;

const borrowRate = (u: number) => (u <= KINK ? BASE + (SLOPE1 * u) / KINK : BASE + SLOPE1 + (SLOPE2 * (u - KINK)) / (100 - KINK));
const supplyRate = (u: number) => (borrowRate(u) * u * (1 - RESERVE_FACTOR)) / 100;

const X0 = 44;
const X1 = 340;
const Y0 = 160;
const Y_TOP = 18;
const Y_MAX = 90;
const sx = (u: number) => X0 + (u / 100) * (X1 - X0);
const sy = (r: number) => Y0 - (r / Y_MAX) * (Y0 - Y_TOP);
const STEPS = Array.from({ length: 101 }, (_, u) => u);
const path = (f: (u: number) => number, from: number, to: number) =>
  STEPS.filter((u) => u >= from && u <= to)
    .map((u, i) => `${i === 0 ? "M" : "L"}${sx(u).toFixed(1)},${sy(f(u)).toFixed(1)}`)
    .join(" ");

const fmt = (v: number) => `${Number(v.toFixed(3))}%`;

const SCENES = [
  { label: "첫 구간 0→80%", summary: `80%에서 ${fmt(borrowRate(80))}`, note: "기준 사용률 80%까지는 첫 증가분 4%포인트를 나눠 더하므로 기본 2%에서 6%까지 완만하게 오릅니다. 정확히 80%일 때도 이 아래 구간 식을 씁니다(11절). (가정)" },
  { label: "두 번째 구간 80→90%", summary: `90%에서 ${fmt(borrowRate(90))}`, note: "80% 위의 남은 20%포인트 구간 중 절반을 지났으므로 75%포인트의 절반 37.5를 더해 43.5%입니다. 사용률 10%포인트 차이에 차입 이율은 7배 넘게 커집니다. (가정)" },
  { label: "공급 이율", summary: `${fmt(supplyRate(80))} · ${fmt(supplyRate(90))}`, note: "공급 이율은 차입 이율에 이자를 내는 비중(사용률)과 공급자 몫 90%를 곱합니다. 80%에서 6%×80%×90%=4.32%, 90%에서 43.5%×90%×90%=35.235%입니다. unbacked=0인 예이며 미래 수익 보장이 아닙니다." },
] as const;

export default function RateKinkViz() {
  return (
    <SceneShell
      eyebrow="사용률과 이율"
      title="기준 사용률 80%를 넘으면 차입 이율 선이 꺾여 가팔라집니다"
      description="가로축은 차입 사용률(총부채 ÷ (가용자금 + 총부채)), 세로축은 연율입니다. 기본 2%·증가분 4%p와 75%p·기준 80%·프로토콜 몫 10%는 본문의 가상 설정입니다(가정)."
      ariaLabel="사용률에 따른 차입 이율과 공급 이율 곡선"
      scenes={SCENES}
      render={(active) => {
        const highlight = active === 0 ? path(borrowRate, 0, KINK) : active === 1 ? path(borrowRate, KINK, 90) : null;
        const points =
          active === 0
            ? [{ u: 80, r: borrowRate(80), color: "#2563eb" }]
            : active === 1
              ? [{ u: 80, r: borrowRate(80), color: "#2563eb" }, { u: 90, r: borrowRate(90), color: "#2563eb" }]
              : [{ u: 80, r: supplyRate(80), color: "#16a34a" }, { u: 90, r: supplyRate(90), color: "#16a34a" }];
        return (
          <svg viewBox="0 0 360 192" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 30, 60, 90].map((r) => (
              <g key={r}>
                <line x1={X0} x2={X1} y1={sy(r)} y2={sy(r)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={X0 - 6} y={sy(r) + 4} textAnchor="end" fontSize={10} fill="#64748b">{r}%</text>
              </g>
            ))}
            {[0, 20, 40, 60, 80, 100].map((u) => (
              <text key={u} x={sx(u)} y={Y0 + 15} textAnchor="middle" fontSize={10} fill="#64748b">{u}%</text>
            ))}
            <text x={X1} y={Y0 + 29} textAnchor="end" fontSize={10} fill="#64748b">차입 사용률</text>
            <line x1={sx(KINK)} x2={sx(KINK)} y1={Y_TOP} y2={Y0} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={sx(KINK) - 4} y={Y_TOP + 8} textAnchor="end" fontSize={10} fill="#64748b">기준 80%</text>
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <path d={path(borrowRate, 0, 100)} fill="none" stroke="#2563eb" strokeWidth={1} opacity={0.3} />
            {highlight && <path d={highlight} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
            {active === 2 && <path d={path(supplyRate, 0, 100)} fill="none" stroke="#16a34a" strokeWidth={1.25} />}
            <text x={sx(97)} y={sy(borrowRate(97)) + 2} textAnchor="end" fontSize={10} fontWeight={700} fill="#2563eb">차입</text>
            {active === 2 && <text x={sx(99)} y={sy(supplyRate(99)) + 14} textAnchor="end" fontSize={10} fontWeight={700} fill="#16a34a">공급</text>}
            {points.map((p) => (
              <g key={`${p.u}-${p.color}`}>
                <circle cx={sx(p.u)} cy={sy(p.r)} r={3.5} fill={p.color} />
                <text x={sx(p.u) - 6} y={sy(p.r) - 6} textAnchor="end" fontSize={11} fontWeight={700} fill={p.color}>{fmt(p.r)}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
