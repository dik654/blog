import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 세금 80 + 차입 20 = 지출 100(의료 40·교육 30·도로 20·이자 10), 부채 200 → 220. 모두 가정.
 * 칸 하나 = 10. 모든 줄이 같은 칸 크기를 써서 올해 현금 100과 남은 부채 220을 눈으로 셀 수 있다.
 */
const SCENES = [
  { label: "들어온 돈", summary: "세금 80 + 차입 20 = 100", note: "세금 80은 갚아야 할 빚이 아닙니다. 차입 20에는 계약상 상환 의무가 붙습니다. 다른 수입은 없다고 단순화했습니다." },
  { label: "나간 돈", summary: "40 + 30 + 20 + 10 = 100", note: "들어온 칸 수와 나간 칸 수가 같아 올해 현금은 맞습니다. 기존 빚의 원금 상환은 없다고 단순화했습니다." },
  { label: "해가 끝나고 남는 것", summary: "기초 200 + 차입 20 = 기말 220", note: "현금 100은 올해 나간 돈입니다. 차입 2칸(20)은 부채 줄에도 더해져 기말 부채 220으로 남습니다." },
] as const;

const COST = "#64748b";
const TAX = "#2563eb";
const BORROW = "#d97706";
const ROAD = "#16a34a";
const LABEL = "#64748b";
const CELL_W = 30;
const CELL_H = 26;
const PITCH = 32;
const LEFT = 20;
const IN_Y = 22;
const OUT_Y = 92;
const DEBT_Y = 164;

const IN_GROUPS = [
  { name: "세금", amount: 80, cells: 8, color: TAX },
  { name: "차입", amount: 20, cells: 2, color: BORROW },
] as const;
const OUT_GROUPS = [
  { name: "의료", amount: 40, cells: 4, color: COST },
  { name: "교육", amount: 30, cells: 3, color: "#8c9ab0" },
  { name: "도로", amount: 20, cells: 2, color: ROAD },
  { name: "이자", amount: 10, cells: 1, color: COST },
] as const;

function Row({ y, groups, filled, dim }: { y: number; groups: readonly { name: string; amount: number; cells: number; color: string }[]; filled: boolean; dim: (name: string) => boolean }) {
  const starts = groups.map((_, index) => groups.slice(0, index).reduce<number>((sum, group) => sum + group.cells, 0));
  return (
    <g>
      {groups.map((group, index) => (
        <g key={group.name}>
          {Array.from({ length: group.cells }, (_, cell) => {
            const x = LEFT + (starts[index] + cell) * PITCH;
            return filled ? (
              <rect key={cell} x={x} y={y} width={CELL_W} height={CELL_H} rx={3} fill={group.color} opacity={dim(group.name) ? 0.3 : 0.9} />
            ) : (
              <rect key={cell} x={x} y={y} width={CELL_W} height={CELL_H} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            );
          })}
          {filled && (
            <text x={LEFT + (starts[index] + group.cells / 2) * PITCH - 1} y={y + CELL_H + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill={LABEL}>
              {group.name} {group.amount}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

export default function CashCellsViz() {
  return (
    <SceneShell
      eyebrow="한 해의 숫자 (가정)"
      title="올해 오간 현금 100과 해가 끝나도 남는 부채 220"
      description="칸 하나가 10입니다. 모든 줄의 칸 크기가 같으므로 칸 수를 그대로 비교할 수 있습니다. 숫자는 모두 본문의 가정입니다."
      ariaLabel="세금과 차입으로 들어온 100, 네 항목으로 나간 100, 기초 부채 200에 차입 20을 더한 기말 부채 220"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 262" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={LEFT} y={14} fontSize={12} fontWeight={700} fill={LABEL}>들어온 돈</text>
          <Row y={IN_Y} groups={IN_GROUPS} filled dim={(name) => active === 2 && name === "세금"} />
          <text x={LEFT} y={84} fontSize={12} fontWeight={700} fill={LABEL}>나간 돈</text>
          <Row y={OUT_Y} groups={OUT_GROUPS} filled={active >= 1} dim={() => active === 2} />
          <text x={LEFT} y={156} fontSize={12} fontWeight={700} fill={LABEL}>{active === 2 ? "기말(연말) 부채 220" : "기초(연초) 부채 200"}</text>
          {Array.from({ length: 20 }, (_, cell) => (
            <rect key={cell} x={LEFT + (cell % 10) * PITCH} y={DEBT_Y + Math.floor(cell / 10) * (CELL_H + 4)} width={CELL_W} height={CELL_H} rx={3} fill="#64748b" opacity={active === 2 ? 0.6 : 0.3} />
          ))}
          {[0, 1].map((cell) => (
            <rect key={cell} x={LEFT + cell * PITCH} y={DEBT_Y + 2 * (CELL_H + 4)} width={CELL_W} height={CELL_H} rx={3} fill={active === 2 ? BORROW : "none"} opacity={active === 2 ? 0.9 : 1} stroke={active === 2 ? "none" : "#94a3b8"} strokeWidth={1} strokeDasharray="3 3" />
          ))}
          {active === 2 && (
            <text x={LEFT + 2 * PITCH + 6} y={DEBT_Y + 2 * (CELL_H + 4) + 18} fontSize={12} fontWeight={700} fill={BORROW}>차입 20이 부채로 남습니다</text>
          )}
        </svg>
      )}
    />
  );
}
