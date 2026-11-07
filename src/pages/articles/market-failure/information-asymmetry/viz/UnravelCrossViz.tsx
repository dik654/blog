import PlotAxes from "./PlotAxes";
import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #unravelling — 부른 값 P와 나온 차들의 평균(산 쪽 값) 두 선이 값 6에서 만난다.
 * 평균 3, 4.5, 6, 7.5, 9, 10.5 / 값 2, 4, 6, 8, 10, 12. 사라지는 몫 4 + 5 + 6 = 15.
 */
const SELL: readonly number[] = [2, 4, 6, 8, 10, 12];
const K = 1.5;
const avgAt = (price: number) => {
  const out = SELL.filter((value) => value <= price);
  return (K * out.reduce<number>((sum, value) => sum + value, 0)) / out.length;
};

const PRICE = "#475569";
const AVG = "#2563eb";
const OK = "#059669";
const WARN = "#dc2626";
const QUIET = "#94a3b8";
const TEXT = "#64748b";

const LEFT = 30;
const RIGHT = 350;
const TOP = 96;
const BOTTOM = 206;
const sx = (value: number) => LEFT + ((value - 2) / 10) * (RIGHT - LEFT - 12) + 6;
const sy = (value: number) => BOTTOM - (value / 13) * (BOTTOM - TOP);
const slotX = (index: number) => 10 + index * 58;

const SCENE_PRICE: readonly number[] = [2, 6, 8, 12, 6];
const SCENES: readonly ShellScene[] = [
  { label: "값 2를 부르면", summary: "1대 · 3 ≥ 2 → 낸다", note: "자기 차를 2 아래로 치는 첫째 차만 나옵니다. 그 차의 값어치는 3이고 3이 2보다 크니 산 쪽은 값을 냅니다." },
  { label: "값 6을 부르면", summary: "3대 · 6 = 6 → 아슬아슬", note: "세 대가 나오고 산 쪽 값의 평균은 (3 + 6 + 9) ÷ 3 = 6입니다. 낸 값과 받는 값이 꼭 맞습니다." },
  { label: "값 8을 부르면", summary: "4대 · 7.5 < 8 → 안 낸다", note: "넷째 차가 들어와도 앞의 세 대는 그대로 남습니다. 값은 2 올랐는데 평균은 1.5만 올라 8을 내고 7.5를 받는 셈입니다." },
  { label: "값을 더 올려도 벌어집니다", summary: "10 vs 9 · 12 vs 10.5", note: "값 10에서는 평균이 9, 값 12에서는 10.5입니다. 차이가 0.5, 1, 1.5로 커지니 값을 더 올려도 맞지 않습니다." },
  { label: "값 6에서 멈춥니다", summary: "사라진 몫 4 + 5 + 6 = 15", note: "세 대만 거래됩니다. 나오지 않은 세 대도 산 쪽이 12, 15, 18로, 판 쪽이 8, 10, 12로 치니 전부 거래되는 것이 맞던 차입니다." },
];

export default function UnravelCrossViz() {
  return (
    <SceneShell
      eyebrow="값이 멈추는 자리"
      title="값이 평균보다 빨리 오르면 두 선은 어디서 만나는가"
      description="실선 칸이 그 값에 나오는 차입니다. 채운 점은 평균이 값 이상인 자리, 빈 점은 못 미치는 자리입니다. 여섯 대로 줄인 예이며, 산 쪽은 전혀 구별하지 못하고 판 쪽은 자기 차를 정확히 안다고 둡니다."
      ariaLabel="부른 값과 나온 차 평균의 산 쪽 값을 비교해 값 6에서 멈추는 과정"
      scenes={SCENES}
      render={(active) => {
        const price = SCENE_PRICE[active];
        const avg = avgAt(price);
        const holds = avg >= price;
        const stop = active === 4;
        return (
          <svg viewBox="0 0 360 238" className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={10} y={11} fontSize={10.5} fontWeight={700} fill={TEXT}>판 쪽 값 → 산 쪽 값</text>
            {SELL.map((value, index) => {
              const out = value <= price;
              const color = out ? OK : QUIET;
              return (
                <g key={value}>
                  <rect x={slotX(index)} y={18} width={52} height={26} rx={6} fill={out ? `${OK}14` : "none"} stroke={color} strokeWidth={1} strokeDasharray={out ? undefined : "4 3"} />
                  <text x={slotX(index) + 26} y={35} textAnchor="middle" fontSize={11} fontWeight={700} fill={out ? OK : TEXT}>{value} → {value * K}</text>
                  {stop && !out && (
                    <text x={slotX(index) + 26} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill={WARN}>+{value * K - value} 사라짐</text>
                  )}
                </g>
              );
            })}
            <PlotAxes
              left={LEFT}
              right={RIGHT}
              top={TOP}
              bottom={BOTTOM}
              sx={sx}
              sy={sy}
              xTicks={SELL.map((value) => ({ value, label: String(value) }))}
              yTicks={[0, 6, 12].map((value) => ({ value, label: String(value) }))}
              xLabel="부른 값"
              legendY={74}
              legend={[
                { label: "부른 값 (산 쪽이 내는 돈)", color: PRICE },
                { label: "나온 차들의 평균 (산 쪽이 받는 값어치)", color: AVG, dash: "5 3" },
              ]}
            />
            <line x1={sx(2)} x2={sx(12)} y1={sy(2)} y2={sy(12)} stroke={PRICE} strokeWidth={1.25} />
            <line x1={sx(2)} x2={sx(12)} y1={sy(avgAt(2))} y2={sy(avgAt(12))} stroke={AVG} strokeWidth={1.25} strokeDasharray="5 3" />
            {SELL.map((value) => {
              const ok = avgAt(value) >= value;
              return (
                <circle key={value} cx={sx(value)} cy={sy(avgAt(value))} r={2.75} fill={ok ? AVG : "#ffffff"} stroke={AVG} strokeWidth={1} />
              );
            })}
            <line x1={sx(price)} x2={sx(price)} y1={TOP} y2={BOTTOM} stroke={stop ? OK : holds ? OK : WARN} strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={sx(price)} cy={sy(price)} r={3.5} fill={PRICE} />
            <circle cx={sx(price)} cy={sy(avg)} r={3.5} fill={holds ? AVG : "#ffffff"} stroke={AVG} strokeWidth={1.25} />
          </svg>
        );
      }}
    />
  );
}
