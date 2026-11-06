import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 100억 원을 후순위 10·중순위 20·선순위 70으로 나눈 가정에서
 * 총손실 8·15·35억 원이 아래 칸부터 차오른다. 1억 원 = 2 SVG 단위.
 * 후순위 min(L,10), 중순위 min(max(L−10,0),20), 선순위 min(max(L−30,0),70).
 */
const SCENES = [
  { label: "손실 8억 원", summary: "후순위 안에서 끝 · 남는 원금 92", loss: 8, note: "손실이 후순위 10억 원 안에서 끝납니다. 후순위에 2억 원이 남고, 중순위와 선순위는 그대로입니다." },
  { label: "손실 15억 원", summary: "10 + 5 = 15 · 남는 원금 85", loss: 15, note: "후순위 10억 원이 전부 사라지고 남은 5억 원이 중순위로 올라갑니다. 선순위 70억 원에는 손실이 없습니다." },
  { label: "손실 35억 원", summary: "10 + 20 + 5 = 35 · 남는 원금 65", loss: 35, note: "손실이 30억 원 선을 넘어 선순위도 5억 원을 잃습니다. 5÷70≈7.14%입니다. 선순위는 손실 시작점이 늦을 뿐 무손실이 아니고, 손실 합계는 그대로 35억 원입니다." },
] as const;

const TRANCHES = [
  { name: "선순위", size: 70, from: 30, opacity: 0.16 },
  { name: "중순위", size: 20, from: 10, opacity: 0.28 },
  { name: "후순위", size: 10, from: 0, opacity: 0.42 },
];

const BOTTOM = 224;
const UNIT = 2;
const COL_X = 64;
const COL_W = 80;
const RED = "#dc2626";
const TEXT = "#64748b";
const yOf = (amount: number) => BOTTOM - amount * UNIT;

export default function TrancheLossStackViz() {
  return (
    <SceneShell
      eyebrow="손실이 닿는 곳"
      title="손실은 아래 칸부터 차올라 위 칸으로 번집니다"
      description="막대 높이가 원금 100억 원이고 빨간 부분이 총손실입니다. 수수료·이자·시점은 제외하고 최종 원금 손실만 본 가정이며, 70·20·10의 금액도 가정입니다."
      ariaLabel="손실 8억, 15억, 35억 원이 후순위, 중순위, 선순위로 번지는 과정"
      scenes={SCENES}
      render={(active) => {
        const { loss } = SCENES[active];
        const rows = TRANCHES.map((tranche) => {
          const taken = Math.min(Math.max(loss - tranche.from, 0), tranche.size);
          return { ...tranche, taken, left: tranche.size - taken };
        });
        const remaining = rows.reduce<number>((sum, row) => sum + row.left, 0);
        return (
          <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {rows.map((row) => (
              <rect key={row.name} x={COL_X} y={yOf(row.from + row.size)} width={COL_W} height={row.size * UNIT} fill="#64748b" fillOpacity={row.opacity} stroke={TEXT} strokeWidth={1} />
            ))}
            <rect x={COL_X} y={yOf(loss)} width={COL_W} height={loss * UNIT} fill={RED} fillOpacity={0.8} />
            <text x={COL_X + COL_W / 2} y={yOf(loss / 2) + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">손실 {loss}</text>
            {[0, 10, 30, 100].map((tick) => (
              <text key={tick} x={COL_X - 8} y={yOf(tick) + 4} textAnchor="end" fontSize={11} fill={TEXT}>{tick}</text>
            ))}
            <text x={COL_X} y={14} fontSize={11} fill={TEXT}>단위: 억 원</text>
            <text x={352} y={44} textAnchor="end" fontSize={12} fontWeight={700} fill={TEXT}>남는 원금 합계 {remaining}</text>
            {rows.map((row) => (
              <g key={row.name}>
                <text x={COL_X + COL_W + 12} y={yOf(row.from + row.size / 2) + 4} fontSize={11} fontWeight={700} fill={TEXT}>{row.name}</text>
                <text x={COL_X + COL_W + 56} y={yOf(row.from + row.size / 2) + 4} fontSize={11} fill={TEXT}>{row.size} → {row.left}</text>
                <text x={352} y={yOf(row.from + row.size / 2) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={row.taken > 0 ? RED : TEXT}>{row.taken > 0 ? `−${row.taken}` : "손실 없음"}</text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
