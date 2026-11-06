import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 외채×금리=연 이자를 면적으로, 이자/수출을 막대로 그립니다.
 * 100×5%=5, 130×5%=6.5, 130×12%=15.6, 15.6/80=19.5%. 6.5/100=6.5%이므로 세 배(2.4×1.25).
 * 5%와 12%는 설명용 가정입니다.
 */
const SCENES = [
  { label: "처음 외채", summary: "100 × 5% = 이자 5", debt: 100, rate: 5, exports: 100, note: "금리 5%(가정)에서 외채 100의 연 이자는 5이고, 수출 100의 5%입니다." },
  { label: "부족 30을 빌림", summary: "130 × 5% = 이자 6.5", debt: 130, rate: 5, exports: 100, note: "가로만 늘어 면적이 6.5가 됩니다. 수출 100의 6.5%라 감당할 수 있다고 판단할 수 있습니다." },
  { label: "금리가 오름", summary: "130 × 12% = 이자 15.6", debt: 130, rate: 12, exports: 100, note: "빚을 더 내지 않아도 금리가 12%(가정)로 오르면 세로가 늘어 이자가 15.6이 됩니다. 점선 칸이 금리가 오르기 전의 6.5입니다." },
  { label: "수출도 줄어듦", summary: "이자/수출 6.5% → 19.5%", debt: 130, rate: 12, exports: 80, note: "금리가 2.4배(12÷5), 나누는 수출이 100에서 80으로 줄어 1.25배. 2.4×1.25로 세 배입니다. 원금을 갚기 전에도 외화 부족이 커집니다." },
] as const;

const X0 = 40;
const SX = 2;
const BASE = 150;
const SY = 10.5;
const BAR_X = 96;
const BAR_S = 1.9;
const MUTED = "#64748b";
const IDLE = "#94a3b8";
const BLUE = "#2563eb";

function RatioRow({ y, label, interest, exports, color }: { y: number; label: string; interest: number; exports: number; color: string }) {
  return (
    <g>
      <text x={6} y={y + 13} fontSize={12} fontWeight={700} fill={color}>{label}</text>
      <rect x={BAR_X} y={y} width={exports * BAR_S} height={18} rx={2} fill="none" stroke={IDLE} strokeWidth={1} />
      <rect x={BAR_X} y={y} width={interest * BAR_S} height={18} rx={2} fill={color} />
      <text x={BAR_X + exports * BAR_S + 6} y={y + 13} fontSize={12} fontWeight={700} fill={color}>{((interest / exports) * 100).toFixed(1).replace(/\.0$/, "")}%</text>
    </g>
  );
}

export default function DebtInterestAreaViz() {
  return (
    <SceneShell
      eyebrow="면적으로 보는 이자"
      title="빚이 늘고 금리가 오르면 이자 면적이 커지고, 수출까지 줄면 수출 대비 몫이 세 배가 됩니다"
      description="가로는 외채, 세로는 금리, 면적은 연 이자입니다. 아래 막대의 빈 칸 전체가 수출이고 채운 부분이 그 안에서 이자가 차지하는 몫입니다. 숫자는 글의 가정입니다."
      ariaLabel="외채와 금리의 곱인 이자 면적, 이자를 수출로 나눈 비율이 6.5퍼센트에서 19.5퍼센트로 세 배가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const interest = (scene.debt * scene.rate) / 100;
        const width = scene.debt * SX;
        const height = scene.rate * SY;
        return (
          <svg viewBox="0 0 340 232" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={X0} x2={X0} y1={14} y2={BASE} stroke={IDLE} strokeWidth={1} />
            <line x1={X0} x2={X0 + 276} y1={BASE} y2={BASE} stroke={IDLE} strokeWidth={1} />
            <text x={X0 - 6} y={10} textAnchor="end" fontSize={12} fill={MUTED}>금리</text>
            <text x={X0 - 6} y={BASE - 5 * SY + 4} textAnchor="end" fontSize={12} fontWeight={scene.rate === 5 ? 700 : 400} fill={MUTED}>5%</text>
            <text x={X0 - 6} y={BASE - 12 * SY + 4} textAnchor="end" fontSize={12} fontWeight={scene.rate === 12 ? 700 : 400} fill={MUTED}>12%</text>
            <text x={X0 + 100 * SX} y={BASE + 15} textAnchor="middle" fontSize={12} fill={MUTED}>100</text>
            <text x={X0 + 130 * SX} y={BASE + 15} textAnchor="middle" fontSize={12} fill={MUTED}>130</text>
            <text x={X0} y={BASE + 15} fontSize={12} fill={MUTED}>외채</text>

            <rect x={X0} y={BASE - height} width={width} height={height} fill={BLUE} opacity={0.85} />
            {active >= 2 && (
              <rect x={X0} y={BASE - 5 * SY} width={130 * SX} height={5 * SY} fill="none" stroke="#ffffff" strokeWidth={1} strokeDasharray="4 3" />
            )}
            <text x={X0 + width / 2} y={active >= 2 ? BASE - 7.5 * SY + 4 : BASE - height / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="#ffffff">이자 {interest}</text>
            {active >= 2 && (
              <text x={X0 + width / 2} y={BASE - 2.5 * SY + 4} textAnchor="middle" fontSize={12} fill="#ffffff">금리 오르기 전 6.5</text>
            )}

            <RatioRow y={176} label={active === 3 ? "12%·수출 80" : `수출 ${scene.exports}`} interest={interest} exports={scene.exports} color={BLUE} />
            {active === 3 && <RatioRow y={204} label="5%·수출 100" interest={6.5} exports={100} color={MUTED} />}
          </svg>
        );
      }}
    />
  );
}
