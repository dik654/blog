import PlotAxes from "./PlotAxes";
import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #unravelling — 배수와 바닥이 무너지는 정도를 정한다.
 * 평균 2, 3, 4, 5, 6, 7에 배수를 곱한다. k=1.2: 2.4, 3.6, … k=2: 4, 6, … 14(값 12보다 큼).
 * 바닥 0의 연속형: 평균이 P의 절반 근처, 1.5배면 0.75P 근처라 어디서도 P에 못 미친다.
 */
const SELL: readonly number[] = [2, 4, 6, 8, 10, 12];
const meanAt = (price: number) => {
  const out = SELL.filter((value) => value <= price);
  return out.reduce<number>((sum, value) => sum + value, 0) / out.length;
};

const PRICE = "#475569";
const AVG = "#2563eb";
const OK = "#059669";
const WARN = "#dc2626";
const TEXT = "#64748b";

const LEFT = 30;
const RIGHT = 350;
const TOP = 66;
const BOTTOM = 212;
const sx = (value: number) => LEFT + (value / 12) * (RIGHT - LEFT - 8);
const sy = (value: number) => BOTTOM - (value / 15) * (BOTTOM - TOP);

const CASES: readonly { k: number; traded: number }[] = [
  { k: 1.5, traded: 3 },
  { k: 1.2, traded: 1 },
  { k: 2, traded: 6 },
  { k: 1.5, traded: 0 },
];
const SCENES: readonly ShellScene[] = [
  { label: "1.5배 · 바닥 2", summary: "값 6까지 · 세 대", note: "앞에서 계산한 경우입니다. 두 선이 값 6에서 만나고 그 뒤로는 평균이 값 아래에 있습니다." },
  { label: "1.2배 · 바닥 2", summary: "값 2까지 · 한 대", note: "값 4에서 이미 두 대의 평균 3을 1.2배 한 3.6이 4에 못 미쳐 맨 아래 한 대만 거래됩니다. 배수가 1에 가까우면 거래로 생기는 것도 작으니 잃는 크기를 같이 봐야 합니다." },
  { label: "2배 · 바닥 2", summary: "값 12까지 · 여섯 대", note: "값 12에서 여섯 대의 판 쪽 평균 7을 두 배 하면 14로 12를 넘습니다. 구별하지 못하는 것은 그대로인데 아무것도 무너지지 않습니다." },
  { label: "1.5배 · 바닥 0", summary: "어떤 값에도 거래 없음", note: "논문의 연속형 예처럼 가장 나쁜 것의 값이 0까지 내려가 있으면 평균이 P의 절반 근처라 1.5배 해도 P에 못 미칩니다. 완전한 붕괴는 구조의 필연이 아니라 바닥이 어디냐의 결과입니다." },
];

export default function CollapseFactorViz() {
  return (
    <SceneShell
      eyebrow="얼마나 무너지는가"
      title="같은 구조인데 배수와 바닥만 바꾸면 선이 만나는 자리가 옮겨 갑니다"
      description="배수는 산 쪽이 판 쪽 값의 몇 배로 치는지이고, 바닥은 가장 나쁜 차의 판 쪽 값입니다. 가로축과 세로축은 네 경우 모두 같습니다. 점은 차가 한 대 더 나오는 값이고 선은 점을 이은 것이며, 채운 점은 평균이 값 이상인 자리, 빈 점은 못 미치는 자리입니다."
      ariaLabel="배수 1.5, 1.2, 2와 바닥 0에서 부른 값과 평균 값어치 비교"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        const continuous = active === 3;
        return (
          <svg viewBox="0 0 360 244" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <PlotAxes
              left={LEFT}
              right={RIGHT}
              top={TOP}
              bottom={BOTTOM}
              sx={sx}
              sy={sy}
              xTicks={[0, ...SELL].map((value) => ({ value, label: String(value) }))}
              yTicks={[0, 5, 10, 15].map((value) => ({ value, label: String(value) }))}
              xLabel="부른 값"
              legendY={14}
              legend={[
                { label: "부른 값", color: PRICE },
                { label: continuous ? "평균 × 1.5 (연속형, P의 0.75배 근처)" : `나온 차들의 평균 × ${item.k}`, color: AVG, dash: "5 3" },
              ]}
            />
            <line x1={sx(0)} x2={sx(12)} y1={sy(0)} y2={sy(12)} stroke={PRICE} strokeWidth={1.25} />
            {continuous ? (
              <line x1={sx(0)} x2={sx(12)} y1={sy(0)} y2={sy(9)} stroke={AVG} strokeWidth={1.25} strokeDasharray="5 3" />
            ) : (
              <>
                <polyline points={SELL.map((value) => `${sx(value)},${sy(item.k * meanAt(value))}`).join(" ")} fill="none" stroke={AVG} strokeWidth={1.25} strokeDasharray="5 3" />
                {SELL.map((value) => {
                  const ok = item.k * meanAt(value) >= value;
                  return <circle key={value} cx={sx(value)} cy={sy(item.k * meanAt(value))} r={3} fill={ok ? AVG : "#ffffff"} stroke={AVG} strokeWidth={1} />;
                })}
                {item.traded < 6 && (
                  <line x1={sx(SELL[item.traded - 1])} x2={sx(SELL[item.traded - 1])} y1={TOP} y2={BOTTOM} stroke={OK} strokeWidth={1} strokeDasharray="2 3" />
                )}
              </>
            )}
            <text x={RIGHT} y={14} textAnchor="end" fontSize={11} fontWeight={800} fill={item.traded === 0 ? WARN : item.traded === 6 ? OK : TEXT}>
              {continuous ? "거래 0" : `${item.traded}대 / 6대`}
            </text>
          </svg>
        );
      }}
    />
  );
}
