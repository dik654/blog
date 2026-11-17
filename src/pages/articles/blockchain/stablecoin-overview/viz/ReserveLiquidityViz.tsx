import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-parts — 장부 준비금 10000 = 현금 2000 + 나중에 현금화할 자산 8000(가정).
 * 6000 상환 요청 → 현금 4000 부족. 장부 4000 자산을 급매해 3800 → 현금 5800, 200 모자람.
 * 보유 가치: 현금 5800 + 남은 자산 장부 4000 = 9800(장부 10000 대비 급매 손실 200).
 */
const TOTAL = 10000;
const REQUEST = 6000;

type Slice = { label: string; amount: number; color: string; dashed?: boolean };

const SCENES = [
  { label: "장부 10000달러", summary: "현금 2000 + 자산 8000", request: false, slices: [{ label: "현금 2000", amount: 2000, color: "#16a34a" }, { label: "나중에 현금화할 자산 8000", amount: 8000, color: "#64748b" }], note: "준비금 장부는 10000달러지만 오늘 바로 줄 현금은 2000달러이고 8000달러는 팔거나 만기가 와야 현금이 되는 자산입니다(가정)." },
  { label: "6000달러 요청", summary: "현금 2000 → 4000 더 필요", request: true, slices: [{ label: "현금 2000", amount: 2000, color: "#16a34a" }, { label: "자산 8000", amount: 8000, color: "#64748b" }], note: "요청 6000달러 중 현금으로 덮이는 것은 2000달러입니다. 나머지 4000달러는 자산을 팔아 마련해야 하므로 제값에 팔 수 있는지와 지급 은행이 열려 있는지가 중요해집니다." },
  { label: "장부 4000 급매", summary: "3800 → 현금 5800 · 200 부족", request: true, slices: [{ label: "현금 2000", amount: 2000, color: "#16a34a" }, { label: "매각 3800", amount: 3800, color: "#86efac" }, { label: "손실 200", amount: 200, color: "#dc2626", dashed: true }, { label: "남은 자산 4000", amount: 4000, color: "#64748b" }], note: "장부가 4000달러인 자산을 급히 팔아 3800달러만 받으면 현금은 2000+3800=5800달러입니다. 요청 6000달러보다 200달러 모자랍니다." },
  { label: "남은 뒷받침", summary: "5800 + 4000 = 9800", request: false, slices: [{ label: "현금 5800", amount: 5800, color: "#16a34a" }, { label: "손실 200", amount: 200, color: "#dc2626", dashed: true }, { label: "남은 자산 4000", amount: 4000, color: "#64748b" }], note: "급매 뒤 보유 가치는 현금 5800달러와 남은 자산 장부 4000달러를 합친 9800달러입니다. 급매 손실 200달러만큼 남은 상환을 뒷받침할 자산도 줄었습니다." },
] as const satisfies readonly { label: string; summary: string; request: boolean; slices: readonly Slice[]; note: string }[];

const W = 360;
const H = 150;
const X0 = 14;
const X1 = 346;
const x = (amount: number) => X0 + (amount / TOTAL) * (X1 - X0);
const BAR_Y = 62;
const BAR_H = 30;

export default function ReserveLiquidityViz() {
  return (
    <SceneShell
      eyebrow="준비금과 오늘 줄 현금"
      title="장부 10000달러로도 오늘 6000달러를 다 못 줄 수 있습니다"
      description="막대 전체가 장부상 준비금 10000달러이고 길이는 금액에 비례합니다. 구성과 요청액, 급매 가격은 5절의 가정 숫자입니다."
      ariaLabel="준비금 10000달러의 현금과 자산 구성, 6000달러 상환 요청과 급매 손실"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const slices: readonly Slice[] = scene.slices;
        const starts = slices.reduce<number[]>((acc, slice, i) => [...acc, i === 0 ? 0 : acc[i - 1] + slices[i - 1].amount], []);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.request && (
              <>
                <line x1={x(0)} x2={x(REQUEST)} y1={40} y2={40} stroke="#2563eb" strokeWidth={1.25} />
                <line x1={x(0)} x2={x(0)} y1={34} y2={46} stroke="#2563eb" strokeWidth={1.25} />
                <line x1={x(REQUEST)} x2={x(REQUEST)} y1={34} y2={BAR_Y + BAR_H + 6} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <text x={x(REQUEST) / 2 + X0 / 2} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">오늘 상환 요청 6000</text>
              </>
            )}
            {slices.map((slice, i) => (
              <rect
                key={slice.label}
                x={x(starts[i])}
                y={BAR_Y}
                width={x(slice.amount) - X0}
                height={BAR_H}
                fill={slice.dashed ? "none" : slice.color}
                stroke={slice.dashed ? slice.color : "#ffffff"}
                strokeWidth={1}
                strokeDasharray={slice.dashed ? "2 2" : undefined}
              />
            ))}
            {slices.map((slice, i) => {
              const mid = x(starts[i]) + (x(slice.amount) - X0) / 2;
              const small = slice.amount < 1500;
              return (
                <text
                  key={slice.label}
                  x={mid}
                  y={small ? BAR_Y + BAR_H + 34 : BAR_Y + BAR_H / 2 + 4}
                  textAnchor="middle"
                  fontSize={small ? 10 : 11}
                  fontWeight={700}
                  fill={small ? slice.color : slice.color === "#86efac" ? "#14532d" : "#ffffff"}
                >
                  {slice.label}
                </text>
              );
            })}
            {slices.some((slice) => slice.amount < 1500) &&
              slices.map((slice, i) =>
                slice.amount < 1500 ? (
                  <line key={slice.label} x1={x(starts[i]) + (x(slice.amount) - X0) / 2} x2={x(starts[i]) + (x(slice.amount) - X0) / 2} y1={BAR_Y + BAR_H + 2} y2={BAR_Y + BAR_H + 22} stroke={slice.color} strokeWidth={1} />
                ) : null,
              )}
            <text x={X0} y={H - 6} fontSize={10} fill="#64748b">0</text>
            <text x={X1} y={H - 6} textAnchor="end" fontSize={10} fill="#64748b">10000달러</text>
          </svg>
        );
      }}
    />
  );
}
