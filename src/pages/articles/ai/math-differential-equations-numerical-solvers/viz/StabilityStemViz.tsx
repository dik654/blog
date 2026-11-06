import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stability — λ=10에서 한 단계 배율 1−hλ를 반복해서 곱한다.
 * h=.05(가정) .5 | h=.1 0 | h=.15(가정) −.5 | h=.2 −1 | h=.25 −1.5 | h=.3 −2.
 * n=0..4의 값을 그리고, 세로 범위 ±4 밖의 값은 끝에 세모와 숫자만 둔다.
 */
const SCENES = [
  { label: "hλ=0.5", h: 0.05, hl: 0.5, summary: "h=0.05(가정) · 배율 0.5", note: "같은 부호를 지키며 줄어듭니다. 간격 0.05는 이 구간을 보이려고 고른 값입니다(가정)." },
  { label: "hλ=1", h: 0.1, hl: 1, summary: "h=0.1 · 배율 0", note: "한 번 만에 0이 됩니다. 수치적으로 감쇠하지만 유한 시간의 정확한 양의 해를 잘 맞춘다는 뜻은 아닙니다." },
  { label: "hλ=1.5", h: 0.15, hl: 1.5, summary: "h=0.15(가정) · 배율 −0.5", note: "부호가 번갈아 바뀌지만 크기는 줄어듭니다. 원래 경로에는 없는 뒤집힘이 계산에서 생겼습니다. 간격 0.15는 고른 값입니다(가정)." },
  { label: "hλ=2", h: 0.2, hl: 2, summary: "h=0.2 · 배율 −1", note: "크기가 일정하게 진동하고 0으로 줄지 않습니다. 안정 구간의 경계입니다." },
  { label: "hλ=2.5", h: 0.25, hl: 2.5, summary: "h=0.25 · 배율 −1.5", note: "크기가 커집니다. 원래 경로는 줄어드는데 간격 선택 때문에 계산값의 크기가 늘어납니다." },
  { label: "hλ=3", h: 0.3, hl: 3, summary: "h=0.3 · 배율 −2", note: "더 빠르게 커집니다. 네 번째와 다섯 번째 값은 그림의 범위를 넘어 세모와 숫자로만 표시했습니다." },
] as const;

const W = 360;
const LX = 30;
const RX = 340;
const hx = (value: number) => LX + (value / 3) * (RX - LX);
const nx = (n: number) => 52 + n * 62;
const LIMIT = 4;
const Y0 = 150;
const yUnit = 15;
const yOf = (value: number) => Y0 - value * yUnit;

const fmt = (value: number) => {
  const text = Number.isInteger(value) ? String(Math.abs(value)) : String(Number(Math.abs(value).toFixed(4)));
  return `${value < 0 ? "−" : ""}${text}`;
};

export default function StabilityStemViz() {
  return (
    <SceneShell
      eyebrow="반복해서 곱하는 배율"
      title="hλ가 2 이상이면 계산값의 크기가 줄지 않습니다"
      description="위 띠는 hλ의 위치, 아래 막대는 λ=10, 시작값 1에서 n번 곱한 값입니다. 세로 ±4를 넘는 값은 세모와 숫자로만 표시합니다. 원래 경로는 모든 장면에서 줄어드는 같은 경로입니다."
      ariaLabel="hλ에 따라 달라지는 Euler 반복값"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const factor = 1 - scene.hl;
        const values = [0, 1, 2, 3, 4].map((n) => (n === 0 ? 1 : factor ** n));
        return (
          <svg viewBox={`0 0 ${W} 232`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}, 계산값 ${values.map(fmt).join(", ")}`}>
            <rect x={hx(0)} y={18} width={hx(2) - hx(0)} height={12} rx={2} fill="#16a34a" opacity={0.3} />
            <rect x={hx(2)} y={18} width={hx(3) - hx(2)} height={12} rx={2} fill="#dc2626" opacity={0.2} />
            <text x={(hx(0) + hx(2)) / 2} y={12} textAnchor="middle" fontSize={11.5} fill="#16a34a" fontWeight={700}>0&lt;hλ&lt;2 크기가 줄어듦</text>
            <text x={(hx(2) + hx(3)) / 2} y={12} textAnchor="middle" fontSize={11.5} fill="#dc2626" fontWeight={700}>줄지 않음</text>
            {[0, 1, 2, 3].map((tick) => <text key={tick} x={hx(tick)} y={43} textAnchor="middle" fontSize={11.5} fill="#64748b">{tick}</text>)}
            <path d={`M${hx(scene.hl)} 32l-5 -9h10z`} transform={`translate(0 -5)`} fill="#2563eb" />
            <line x1={36} x2={W - 8} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={36} x2={36} y1={yOf(LIMIT)} y2={yOf(-LIMIT)} stroke="#94a3b8" strokeWidth={1} />
            {[4, 0, -4].map((tick) => <text key={tick} x={31} y={yOf(tick) + 3.5} textAnchor="end" fontSize={11.5} fill="#64748b">{fmt(tick)}</text>)}
            {values.map((value, n) => {
              const over = Math.abs(value) > LIMIT;
              const clipped = Math.max(-LIMIT, Math.min(LIMIT, value));
              const tipY = yOf(clipped);
              const up = value >= 0;
              return (
                <g key={n}>
                  <text x={nx(n)} y={Y0 + 72} textAnchor="middle" fontSize={11.5} fill="#64748b">n={n}</text>
                  <line x1={nx(n)} x2={nx(n)} y1={Y0} y2={tipY} stroke={over ? "#dc2626" : "#2563eb"} strokeWidth={1.25} />
                  {over
                    ? <path d={up ? `M${nx(n)} ${tipY - 7}l-5 8h10z` : `M${nx(n)} ${tipY + 7}l-5 -8h10z`} fill="#dc2626" />
                    : <circle cx={nx(n)} cy={tipY} r={3.2} fill="#2563eb" />}
                  <text x={nx(n) + 7} y={up ? Math.max(tipY - 2, yOf(LIMIT) + 6) : Math.min(tipY + 11, yOf(-LIMIT) - 2)} fontSize={12} fontWeight={700} fill={over ? "#dc2626" : "#2563eb"}>{fmt(value)}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
