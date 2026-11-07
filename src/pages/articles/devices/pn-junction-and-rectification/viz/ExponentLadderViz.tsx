import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ratio — (0.6 − 0.5)/0.02585 ≈ 3.87 칸. 한 칸(25.85 mV)마다 지수 항이 e ≈ 2.718배.
 * e^3.8685 ≈ 47.87. 막대는 I = 1 pA × (e^(V/0.02585) − 1)을 같은 세로 축척으로 그린 값이다(가정한 1 pA·300 K).
 */
const VT = 0.02585;
const IS_MA = 1e-9;
const currentMa = (volt: number) => IS_MA * (Math.exp(volt / VT) - 1);
const STEPS = [0.5, 0.5 + VT, 0.5 + 2 * VT, 0.5 + 3 * VT, 0.6];
const W = 360;
const H = 208;
const BASE_Y = 148;
const TOP_Y = 28;
const BAR_W = 42;
const barX = (index: number) => 18 + index * 70;
const FACTORS = ["", "×2.718", "×2.718", "×2.718", "×2.383"];
const MAX = currentMa(0.6);
const ACCENT = "#2563eb";
const MUTED = "#64748b";

const SCENES = [
  { label: "출발: 0.5 V", summary: "지수 입력 19.34 · 약 0.251 mA", note: "0.5 V를 열전압 25.85 mV로 나누면 지수의 입력은 약 19.34입니다. 이 입력이 1 늘 때마다 지수 항이 e배(e ≈ 2.718)가 됩니다." },
  { label: "한 칸: 25.85 mV 더", summary: "×2.718 → 약 0.683 mA", note: "전압을 한 칸 올리면 입력이 20.34가 되고 전류는 약 2.718배입니다. 더해지는 것이 아니라 곱해집니다." },
  { label: "두 칸", summary: "×7.389 → 약 1.86 mA", note: "같은 25.85 mV를 또 더했는데 전류의 늘어난 양은 앞 칸보다 큽니다. 이미 늘어난 값에 다시 곱하기 때문입니다." },
  { label: "세 칸", summary: "×20.09 → 약 5.05 mA", note: "세 칸이면 처음의 약 20배입니다. 전압은 0.5 V에서 약 0.078 V밖에 오르지 않았습니다." },
  { label: "남은 0.87칸: 0.6 V", summary: "×47.87 → 약 12.03 mA", note: "0.1 V는 칸으로 약 3.87칸입니다. 마지막 0.87칸은 e^0.8685 ≈ 2.383배이고, 전부 곱하면 e^3.8685 ≈ 47.87배입니다." },
] as const;

export default function ExponentLadderViz() {
  return (
    <SceneShell
      eyebrow="0.1 V가 약 48배가 되는 길"
      title="0.1 V는 곱셈 약 3.87번입니다"
      description="막대 높이는 같은 축척의 전류입니다. 아래 숫자는 위가 전압, 아래가 지수의 입력 V/V_T입니다. 칸 하나가 열전압 V_T = 25.85 mV입니다."
      note="가정한 1 pA·300 K의 이상식 계산입니다. 두 순방향 전류가 기준 전류보다 충분히 커서 −1이 거의 영향을 주지 않는 구간입니다. 중간 전압은 이 식을 따라 넣은 값입니다."
      ariaLabel="0.5 볼트에서 0.6 볼트까지 열전압 한 칸마다 전류가 곱해지는 막대 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={12} x2={W - 12} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            {STEPS.map((volt, index) => {
              const shown = index <= active;
              const current = currentMa(volt);
              const height = (current / MAX) * (BASE_Y - TOP_Y);
              const barCenter = barX(index) + BAR_W / 2;
              return (
                <g key={index}>
                  {shown && (
                    <>
                      <rect x={barX(index)} y={BASE_Y - height} width={BAR_W} height={height} rx={2} fill={ACCENT} opacity={index === active ? 0.9 : 0.5} />
                      <text x={barCenter} y={BASE_Y - height - 5} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={ACCENT}>{current.toFixed(current < 1 ? 3 : 2)}</text>
                    </>
                  )}
                  {shown && index > 0 && <text x={barX(index) - 14} y={BASE_Y + 46} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={ACCENT}>{FACTORS[index]}</text>}
                  <text x={barCenter} y={BASE_Y + 15} textAnchor="middle" fontSize={10.5} fill={MUTED}>{volt.toFixed(3)} V</text>
                  <text x={barCenter} y={BASE_Y + 30} textAnchor="middle" fontSize={10.5} fill={MUTED}>{(volt / VT).toFixed(2)}</text>
                </g>
              );
            })}
            <text x={12} y={14} fontSize={10} fill={MUTED}>전류(mA)</text>
          </svg>
        );
      }}
    />
  );
}
