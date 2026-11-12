import V2SceneShell from "./V2SceneShell";

/**
 * 본문 대응: #twap — 누적값 1200 → 1800, 300초, 평균 2.
 * 구간 안의 가격 경로는 본문에 없으므로 100초씩 1·4·1로 가정: 100 + 400 + 100 = 600.
 * 마지막 가격 1과 평균 2가 다르다는 점으로 "현재가가 2라는 뜻이 아님"을 보인다.
 */
const SEGMENTS = [
  { from: 0, to: 100, price: 1 },
  { from: 100, to: 200, price: 4 },
  { from: 200, to: 300, price: 1 },
] as const;
const C0 = 1200;
const C_POINTS = SEGMENTS.reduce<number[]>((acc, seg) => [...acc, acc[acc.length - 1] + seg.price * (seg.to - seg.from)], [C0]);
const C1 = C_POINTS[C_POINTS.length - 1];
const AVERAGE = (C1 - C0) / 300;

const W = 360;
const H = 252;
const XL = 52;
const XR = 340;
const P_TOP = 18;
const P_BASE = 98;
const P_MAX = 5;
const C_TOP = 130;
const C_BASE = 222;
const C_MIN = 1150;
const C_MAX = 1850;

const tx = (t: number) => XL + (t / 300) * (XR - XL);
const pyP = (p: number) => P_BASE - (p / P_MAX) * (P_BASE - P_TOP);
const pyC = (c: number) => C_BASE - ((c - C_MIN) / (C_MAX - C_MIN)) * (C_BASE - C_TOP);

const SCENES = [
  {
    label: "구간 안의 가격(가정)",
    summary: "1 → 4 → 1, 100초씩",
    note: "본문은 구간 안에서 가격이 어떻게 움직였는지 말하지 않습니다. 설명을 위해 100초씩 1, 4, 1이었다고 가정합니다. 가격은 B/A 같은 두 reserve의 비율입니다.",
  },
  {
    label: "가격 × 초를 쌓음",
    summary: "1200 + 100 + 400 + 100 = 1800",
    note: "Pair는 reserve를 갱신하기 전에 그동안 유지된 이전 가격에 지난 초를 곱해 누적값에 더합니다. 위 칸의 넓이 100, 400, 100이 아래 선의 오르막이 됩니다. 가격이 높던 구간에서 선이 가파릅니다.",
  },
  {
    label: "두 시점의 차이",
    summary: "1800 − 1200 = 600",
    note: "외부 사용자는 구간 시작과 끝에서 누적값을 저장해 둡니다. 시작 전에 쌓인 1200은 빼고, 관심 구간에서 쌓인 600만 남깁니다.",
  },
  {
    label: "경과 초로 나눔",
    summary: "600 ÷ 300초 = 2",
    note: "평균 2는 점선 높이입니다. 이 가정에서는 어느 구간도 가격이 2였던 적이 없고 마지막 가격은 1입니다. 평균이 2라고 현재가가 2이거나 어느 주문이 2에 체결됐다는 뜻은 아닙니다.",
  },
] as const;

export default function TwapWindowViz() {
  return (
    <V2SceneShell
      eyebrow="TWAP"
      title="가격이 머문 넓이를 쌓고, 차이를 시간으로 나눕니다"
      description="위 칸은 구간 동안의 가격, 아래 선은 가격 누적값입니다. 가로축은 관심 구간 시작부터 지난 초입니다. 1200과 1800은 15절의 고정 소수점 배율을 뺀 설명용 값입니다."
      ariaLabel="가정한 가격 경로로 누적값 1200에서 1800까지 쌓이고 300초로 나눠 평균 2를 얻는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={XL + 6} y={P_TOP + 10} fontSize={10} fontWeight={700} fill="#334155">가격</text>
          <line x1={XL} x2={XR} y1={P_BASE} y2={P_BASE} stroke="#94a3b8" strokeWidth={1} />
          <line x1={XL} x2={XL} y1={P_TOP} y2={P_BASE} stroke="#94a3b8" strokeWidth={1} />
          {[1, 4].map((p) => (
            <text key={p} x={XL - 6} y={pyP(p) + 3} textAnchor="end" fontSize={9} fill="#64748b">{p}</text>
          ))}
          {SEGMENTS.map((seg) => (
            <g key={seg.from}>
              <rect
                x={tx(seg.from)}
                y={pyP(seg.price)}
                width={tx(seg.to) - tx(seg.from)}
                height={P_BASE - pyP(seg.price)}
                fill="#2563eb"
                opacity={active >= 1 ? 0.22 : 0.08}
              />
              <line x1={tx(seg.from)} x2={tx(seg.to)} y1={pyP(seg.price)} y2={pyP(seg.price)} stroke="#2563eb" strokeWidth={1.25} />
              {active >= 1 && (
                <text x={(tx(seg.from) + tx(seg.to)) / 2} y={P_BASE - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill="#1d4ed8">
                  {seg.price * (seg.to - seg.from)}
                </text>
              )}
            </g>
          ))}
          {active === 3 && (
            <g>
              <line x1={XL} x2={XR} y1={pyP(AVERAGE)} y2={pyP(AVERAGE)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={XR} y={pyP(AVERAGE) - 4} textAnchor="end" fontSize={10} fontWeight={700} fill="#b45309">평균 {AVERAGE}</text>
            </g>
          )}

          <text x={XL + 6} y={C_TOP + 10} fontSize={10} fontWeight={700} fill="#334155">누적값</text>
          <line x1={XL} x2={XR} y1={C_BASE} y2={C_BASE} stroke="#94a3b8" strokeWidth={1} />
          <line x1={XL} x2={XL} y1={C_TOP} y2={C_BASE} stroke="#94a3b8" strokeWidth={1} />
          {[C0, C1].map((c) => (
            <text key={c} x={XL - 6} y={pyC(c) + 3} textAnchor="end" fontSize={9} fill="#64748b">{c}</text>
          ))}
          {active >= 1 ? (
            <polyline
              points={C_POINTS.map((c, i) => `${tx(i * 100)},${pyC(c)}`).join(" ")}
              fill="none"
              stroke="#2563eb"
              strokeWidth={1.25}
            />
          ) : (
            <text x={(XL + XR) / 2} y={(C_TOP + C_BASE) / 2} textAnchor="middle" fontSize={10} fill="#94a3b8">다음 장면에서 쌓입니다</text>
          )}
          {active >= 1 && C_POINTS.map((c, i) => <circle key={i} cx={tx(i * 100)} cy={pyC(c)} r={2.5} fill="#2563eb" />)}
          {active >= 2 && (
            <g>
              <line x1={XL} x2={XR} y1={pyC(C0)} y2={pyC(C0)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={XR - 10} x2={XR - 10} y1={pyC(C0)} y2={pyC(C1)} stroke="#d97706" strokeWidth={1.25} />
              <text x={XR - 14} y={(pyC(C0) + pyC(C1)) / 2 + 3} textAnchor="end" fontSize={10} fontWeight={700} fill="#b45309">600</text>
            </g>
          )}
          {active === 3 && (
            <line x1={tx(0)} y1={pyC(C0)} x2={tx(300)} y2={pyC(C1)} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
          )}
          {[0, 100, 200, 300].map((t) => (
            <text key={t} x={tx(t)} y={C_BASE + 14} textAnchor="middle" fontSize={9} fill="#64748b">{t}초</text>
          ))}
        </svg>
      )}
    />
  );
}
