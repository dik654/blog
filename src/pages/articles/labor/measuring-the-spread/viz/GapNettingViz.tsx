import SceneShell from "./SceneShell";

/**
 * 본문 대응: #what-one-number-loses — Lorenz 218쪽 반례의 두 누적 곡선.
 * 첫째 6 13 21 30 40 52 64 76 88 100, 둘째 8 16 24 32 40 48 56 70 84 100.
 * 지점별 차이(첫째 − 둘째): −2 −3 −3 −2 0 +4 +8 +6 +4 → 아래 합 −10, 위 합 +22, 순합 +12.
 * 폭 10을 곱한 120이 곡선 아래 넓이 B의 차이(4,400 − 4,280)이고, ÷ 5,000 = 0.024 = 0.144 − 0.120.
 */
const CUM_I = [6, 13, 21, 30, 40, 52, 64, 76, 88] as const;
const CUM_II = [8, 16, 24, 32, 40, 48, 56, 70, 84] as const;
const DIFF = CUM_I.map((v, i) => v - (CUM_II as readonly number[])[i]);
const NEG = DIFF.filter((d) => d < 0).reduce<number>((sum, d) => sum + d, 0); // −10
const POS = DIFF.filter((d) => d > 0).reduce<number>((sum, d) => sum + d, 0); // +22
const NET = NEG + POS; // +12
const B_I = 10 * (CUM_I.reduce<number>((sum, v) => sum + v, 0) + 50); // 4,400
const B_II = 10 * (CUM_II.reduce<number>((sum, v) => sum + v, 0) + 50); // 4,280
const G_I = 1 - B_I / 5000;
const G_II = 1 - B_II / 5000;

const SCENES = [
  {
    label: "지점마다 두 곡선의 높이를 뺍니다",
    summary: "첫째 − 둘째",
    note: "사람의 10%, 20%, … 90% 지점에서 첫째 곡선의 높이에서 둘째 곡선의 높이를 뺍니다. 위로 솟은 막대는 첫째가 더 많이 가진 지점, 아래로 처진 막대는 둘째가 더 많이 가진 지점입니다.",
  },
  {
    label: "아래쪽은 둘째, 위쪽은 첫째가 앞섭니다",
    summary: "아래 " + NEG + " · 위 +" + POS,
    note: "40%까지는 둘째가 2, 3, 3, 2만큼 앞서 합이 10입니다. 50%에서 같아지고, 그 위로는 첫째가 4, 8, 6, 4만큼 앞서 합이 22입니다.",
  },
  {
    label: "한 숫자는 둘을 더해 버립니다",
    summary: "+" + POS + " − " + -NEG + " = +" + NET,
    note: "곡선 아래 넓이 B는 이 높이들을 폭 10씩 곱해 더한 것이라, 두 B의 차이는 12 × 10 = 120(4,400 대 4,280)입니다. 5,000으로 나눈 0.024가 넓이 비 " + G_I.toFixed(3) + "과 " + G_II.toFixed(3) + "의 차이입니다. 아래쪽에서 둘째가 앞선 10은 위쪽의 22와 더해져 숫자에 따로 남지 않습니다.",
  },
] as const;

const ONE = "#6366f1";
const TWO = "#ef4444";
const MUTED = "#64748b";
const LINE = "#94a3b8";
const BASE_Y = 92;
const UNIT = 6.5; // px per 몫 %p
const X0 = 30;
const STEP = 32;
const BAR_W = 20;

export default function GapNettingViz() {
  return (
    <SceneShell
      eyebrow="넓이 비가 더하는 것"
      title="두 곡선의 차이를 지점마다 세면 한 숫자가 무엇을 지우는지 보입니다"
      description="막대는 입구의 두 경우를 가난한 쪽부터 쌓은 높이의 차이(첫째 − 둘째, %p)입니다. 파랑은 첫째가, 빨강은 둘째가 더 많이 가진 지점입니다."
      note="숫자는 Lorenz(1905) 218쪽의 반례이고, 차이와 넓이 비는 이 글이 계산한 값입니다."
      ariaLabel="두 누적 곡선의 지점별 차이와 그 합이 넓이 비의 차이가 되는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={SCENES[active].label + ": " + SCENES[active].summary}>
          <line x1={X0 - 6} x2={X0 + 8 * STEP + BAR_W + 6} y1={BASE_Y} y2={BASE_Y} stroke={LINE} strokeWidth={1} />
          {active >= 1 && (
            <g>
              <rect x={X0 - 4} y={BASE_Y + 1} width={4 * STEP - (STEP - BAR_W) + 8} height={3 * UNIT + 18} fill="none" stroke={TWO} strokeWidth={1} strokeDasharray="3 2" rx={4} />
              <rect x={X0 + 5 * STEP - 4} y={BASE_Y - 8 * UNIT - 18} width={4 * STEP - (STEP - BAR_W) + 8} height={8 * UNIT + 17} fill="none" stroke={ONE} strokeWidth={1} strokeDasharray="3 2" rx={4} />
              <text x={X0 - 4} y={BASE_Y + 3 * UNIT + 32} fontSize={10.5} fontWeight={700} fill={TWO}>
                둘째가 앞섬 · 합 {-NEG}
              </text>
              <text x={X0 + 9 * STEP - (STEP - BAR_W) + 4} y={BASE_Y - 8 * UNIT - 24} fontSize={10.5} fontWeight={700} fill={ONE} textAnchor="end">
                첫째가 앞섬 · 합 {POS}
              </text>
            </g>
          )}
          {DIFF.map((d, i) => {
            const x = X0 + i * STEP;
            const h = Math.abs(d) * UNIT;
            return (
              <g key={i}>
                {d !== 0 && <rect x={x} y={d > 0 ? BASE_Y - h : BASE_Y} width={BAR_W} height={h} rx={2} fill={d > 0 ? ONE : TWO} opacity={0.8} />}
                <text x={x + BAR_W / 2} y={d >= 0 ? BASE_Y - h - 4 : BASE_Y + h + 12} fontSize={10.5} fontWeight={700} fill={d > 0 ? ONE : d < 0 ? TWO : MUTED} textAnchor="middle">
                  {d > 0 ? "+" + d : d}
                </text>
                <text x={x + BAR_W / 2} y={168} fontSize={9.5} fill={MUTED} textAnchor="middle">
                  {(i + 1) * 10}%
                </text>
              </g>
            );
          })}
          {active === 2 && (
            <g>
              <text x={346} y={84} fontSize={11} fontWeight={700} fill={MUTED} textAnchor="end">
                순합
              </text>
              <text x={346} y={102} fontSize={14} fontWeight={700} fill={ONE} textAnchor="end">
                +{NET}
              </text>
              <text x={346} y={120} fontSize={10} fill={MUTED} textAnchor="end">
                × 폭 10 = {NET * 10}
              </text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
