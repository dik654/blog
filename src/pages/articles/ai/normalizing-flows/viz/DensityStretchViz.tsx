import SceneShell from "./SceneShell";

/**
 * 본문 대응: #change-of-variables — x=2z, z=x/2, |dz/dx|=1/2, pX(x)=pZ(x/2)/2.
 * Base는 본문 예대로 standard Gaussian. 칠한 구간 z∈[0.5, 1]은 그림용 가정이며 x에서는 [1, 2].
 */
const pZ = (z: number) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);

/** Simpson 적분(짝수 구간 수). */
const integrate = (f: (t: number) => number, a: number, b: number, n = 200) => {
  const h = (b - a) / n;
  return Array.from({ length: n + 1 }).reduce<number>((sum, _, i) => {
    const weight = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
    return sum + weight * f(a + i * h);
  }, 0) * (h / 3);
};

const Z_LO = 0.5;
const Z_HI = 1;
const MASS = integrate(pZ, Z_LO, Z_HI);
const UNCORRECTED = integrate((x) => pZ(x / 2), 2 * Z_LO, 2 * Z_HI);
const CORRECTED = integrate((x) => pZ(x / 2) / 2, 2 * Z_LO, 2 * Z_HI);

const W = 360;
const LEFT = 16;
const RIGHT = W - 16;
const DOMAIN = 6;
const sx = (v: number) => LEFT + ((v + DOMAIN) / (2 * DOMAIN)) * (RIGHT - LEFT);
const TOP_BASE = 112;
const BOT_BASE = 252;
const YS = 190;

const curve = (f: (v: number) => number, base: number) =>
  Array.from({ length: 121 }, (_, i) => {
    const v = -DOMAIN + (i / 120) * 2 * DOMAIN;
    return `${i === 0 ? "M" : "L"}${sx(v).toFixed(1)} ${(base - f(v) * YS).toFixed(1)}`;
  }).join(" ");

const area = (f: (v: number) => number, base: number, lo: number, hi: number) => {
  const pts = Array.from({ length: 21 }, (_, i) => {
    const v = lo + (i / 20) * (hi - lo);
    return `L${sx(v).toFixed(1)} ${(base - f(v) * YS).toFixed(1)}`;
  }).join(" ");
  return `M${sx(lo).toFixed(1)} ${base} ${pts} L${sx(hi).toFixed(1)} ${base} Z`;
};

const pXRaw = (x: number) => pZ(x / 2);
const pX = (x: number) => pZ(x / 2) / 2;

const SCENES = [
  {
    label: "base z",
    summary: `z∈[0.5, 1]의 질량 ${MASS.toFixed(3)}`,
    note: `위 곡선은 standard Gaussian 밀도 pZ입니다. 칠한 구간 [0.5, 1]의 넓이가 그 구간에 있을 확률(probability mass) ${MASS.toFixed(3)}입니다. 밀도는 높이, 질량은 넓이입니다.`,
  },
  {
    label: "x=2z로 늘림",
    summary: "구간 폭 0.5 → 1.0",
    note: "f(z)=2z는 같은 구간을 x∈[1, 2]로 옮기며 폭을 두 배로 늘립니다. 아래 축의 x=1, 2는 위의 z=0.5, 1에서 온 점입니다.",
  },
  {
    label: "보정 없이 옮기면",
    summary: `질량 ${MASS.toFixed(3)} → ${UNCORRECTED.toFixed(3)}?`,
    note: `높이를 그대로 pZ(x/2)로 두면(점선) 두 배 넓은 구간이라 넓이가 ${UNCORRECTED.toFixed(3)}로 두 배가 됩니다. 같은 사건의 확률이 늘어날 수는 없으니 이 곡선은 밀도가 될 수 없습니다(전체 넓이도 1이 아니라 2).`,
  },
  {
    label: "|dz/dx|=1/2를 곱함",
    summary: `pX(x)=pZ(x/2)/2 · 질량 ${CORRECTED.toFixed(3)}`,
    note: `z=x/2이므로 |dz/dx|=1/2입니다. 높이를 절반으로 줄이면(실선) 꼭대기가 ${pZ(0).toFixed(3)}에서 ${pX(0).toFixed(3)}로 내려가고 칠한 넓이는 다시 ${CORRECTED.toFixed(3)}입니다. 폭이 두 배가 된 만큼 밀도가 절반이 되어 질량이 보존됩니다.`,
  },
] as const;

export default function DensityStretchViz() {
  return (
    <SceneShell
      eyebrow="change of variables"
      title="x=2z로 폭이 두 배가 되면 밀도는 절반이 된다"
      description="위는 base z의 밀도, 아래는 x=2z의 밀도이며 두 축의 눈금은 같습니다. Base는 본문 예의 standard Gaussian이고, 칠한 구간 z∈[0.5, 1]은 그림을 위한 가정입니다."
      ariaLabel="x=2z 변환에서 구간 폭이 두 배가 되고 밀도가 절반이 되어 확률 질량이 보존되는 과정"
      scenes={SCENES}
      render={(active) => {
        const showMap = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} 280`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={16} fontSize={11} fontWeight={700} fill="currentColor">pZ(z)</text>
            <path d={area(pZ, TOP_BASE, Z_LO, Z_HI)} fill="#2563eb" fillOpacity={0.25} stroke="none" />
            <path d={curve(pZ, TOP_BASE)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <line x1={LEFT} x2={RIGHT} y1={TOP_BASE} y2={TOP_BASE} stroke="#94a3b8" strokeWidth={1} />
            {[-4, -2, 0, 2, 4].map((v) => (
              <text key={`zt${v}`} x={sx(v)} y={TOP_BASE + 13} textAnchor="middle" fontSize={9} fill="#64748b">{v}</text>
            ))}
            <text x={RIGHT} y={TOP_BASE + 13} textAnchor="end" fontSize={10} fill="#64748b">z</text>
            <text x={sx(0) + 6} y={TOP_BASE - pZ(0) * YS - 4} fontSize={10} fill="#2563eb">{pZ(0).toFixed(3)}</text>

            {showMap && (
              <g stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3">
                <line x1={sx(Z_LO)} x2={sx(2 * Z_LO)} y1={TOP_BASE + 18} y2={BOT_BASE - pXRaw(2 * Z_LO) * YS - 6} />
                <line x1={sx(Z_HI)} x2={sx(2 * Z_HI)} y1={TOP_BASE + 18} y2={BOT_BASE - pXRaw(2 * Z_HI) * YS - 6} />
              </g>
            )}

            <text x={LEFT} y={BOT_BASE - 96} fontSize={11} fontWeight={700} fill="currentColor" opacity={showMap ? 1 : 0.3}>x = 2z</text>
            {active === 1 && (
              <path d={`M${sx(2 * Z_LO)} ${BOT_BASE} L${sx(2 * Z_LO)} ${BOT_BASE - 6} M${sx(2 * Z_HI)} ${BOT_BASE} L${sx(2 * Z_HI)} ${BOT_BASE - 6} M${sx(2 * Z_LO)} ${BOT_BASE - 3} L${sx(2 * Z_HI)} ${BOT_BASE - 3}`} stroke="#ea580c" strokeWidth={1.25} fill="none" />
            )}
            {active === 2 && (
              <>
                <path d={area(pXRaw, BOT_BASE, 2 * Z_LO, 2 * Z_HI)} fill="#ea580c" fillOpacity={0.22} stroke="none" />
                <path d={curve(pXRaw, BOT_BASE)} fill="none" stroke="#ea580c" strokeWidth={1.25} strokeDasharray="4 3" />
              </>
            )}
            {active === 3 && (
              <>
                <path d={curve(pXRaw, BOT_BASE)} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
                <path d={area(pX, BOT_BASE, 2 * Z_LO, 2 * Z_HI)} fill="#2563eb" fillOpacity={0.25} stroke="none" />
                <path d={curve(pX, BOT_BASE)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={sx(0) + 6} y={BOT_BASE - pX(0) * YS - 4} fontSize={10} fill="#2563eb">{pX(0).toFixed(3)}</text>
              </>
            )}
            <line x1={LEFT} x2={RIGHT} y1={BOT_BASE} y2={BOT_BASE} stroke="#94a3b8" strokeWidth={1} opacity={showMap ? 1 : 0.3} />
            {[-4, -2, 0, 2, 4].map((v) => (
              <text key={`xt${v}`} x={sx(v)} y={BOT_BASE + 13} textAnchor="middle" fontSize={9} fill="#64748b" opacity={showMap ? 1 : 0.3}>{v}</text>
            ))}
            <text x={RIGHT} y={BOT_BASE + 13} textAnchor="end" fontSize={10} fill="#64748b" opacity={showMap ? 1 : 0.3}>x</text>
          </svg>
        );
      }}
    />
  );
}
