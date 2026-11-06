import SceneShell from "./SceneShell";

/**
 * 본문 대응: #complexity — 길이 8을 짝수·홀수로 반복 분할합니다. 층마다 길이 합은 8, 결합 층은 3개입니다.
 * 8×3=24, 8²=64. N=2²⁰이면 N²=2⁴⁰, N log₂N=20·2²⁰. 위치 순서는 분할 규칙에서 나옵니다.
 */
const ROWS: number[][][] = [
  [[0, 1, 2, 3, 4, 5, 6, 7]],
  [[0, 2, 4, 6], [1, 3, 5, 7]],
  [[0, 4], [2, 6], [1, 5], [3, 7]],
  [[0], [4], [2], [6], [1], [5], [3], [7]],
];
const SCENES: { label: string; summary: string; note: string; depth: number; swap?: boolean; ledger?: string }[] = [
  { label: "길이 8 한 묶음", summary: "묶음 1개 · 길이 합 8", depth: 0, note: "직접 합산이라면 출력 8개마다 값 8개를 다뤄 8²=64에 비례합니다." },
  { label: "짝수와 홀수로", summary: "묶음 2개 · 길이 합 4+4=8", depth: 1, note: "짝수 위치 네 개와 홀수 위치 네 개를 각각 처리합니다. 묶음은 늘었지만 한 층의 길이를 모두 더하면 그대로 8입니다." },
  { label: "다시 절반으로", summary: "묶음 4개 · 길이 합 2×4=8", depth: 2, note: "각 묶음의 안에서도 같은 규칙으로 나눕니다. 층 전체의 결합량이 N에 비례하는 이유가 여기에 보입니다." },
  { label: "하나씩 남을 때까지", summary: "결합 층 log₂8 = 3개", depth: 3, ledger: "층 3개 × 층당 8 = 24 ↔ 직접 64", note: "3번 나누면 길이 1입니다. 층마다 8에 비례하는 결합이 3층이니 3×8=24에 비례합니다. 직접 합산의 64와 나란히 놓은 증가율이며 실제 시간 배율은 아닙니다." },
  { label: "마지막 줄의 순서", summary: "001 ↔ 100 → 위치 1과 4", depth: 3, swap: true, note: "맨 아래 줄의 왼쪽부터 칸 0, 1, 2…라 하면 칸 번호를 이진수로 뒤집은 값이 그 칸의 위치입니다(bit reversal). 일부 구현만 쓰는 순서입니다." },
  { label: "N = 2²⁰이면", summary: "2⁴⁰ vs 20·2²⁰", depth: 3, ledger: "층 20개 × 층당 2²⁰ ↔ 직접 2⁴⁰", note: "같은 식에 대입한 두 수는 증가율 비교입니다. 둘을 나눠 실제 장치의 속도 향상 배율이라고 보고할 수는 없습니다." },
];

const SLOT = 38;
const X0 = 24;
const ROW_Y = [24, 72, 120, 168];
const CELL = 30;

export default function RecursionLevelsViz() {
  return (
    <SceneShell
      eyebrow="층과 묶음"
      title="묶음은 늘어나도 한 층의 길이 합은 그대로입니다"
      description="길이 8을 예로 든 radix-2 분할입니다. 칸의 숫자는 원래 위치입니다. 틀 하나가 한 묶음이며 위에서 아래로 길이가 절반씩 줄어듭니다."
      ariaLabel="길이 8의 짝수 홀수 분할 층과 층별 길이 합"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 222" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {ROWS.map((row, depth) => {
              const shown = depth <= scene.depth;
              const groups = row.reduce<{ start: number; cells: number[] }[]>((acc, cells) => {
                const last = acc[acc.length - 1];
                return [...acc, { start: last ? last.start + last.cells.length : 0, cells }];
              }, []);
              return (
                <g key={depth} opacity={shown ? 1 : 0.15}>
                  {groups.map((group) => (
                    <g key={group.start}>
                      <rect x={X0 + group.start * SLOT - 3} y={ROW_Y[depth] - 3} width={group.cells.length * SLOT - 2} height={CELL + 6} rx={8} fill="none" stroke={depth === scene.depth ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                      {group.cells.map((position, i) => {
                        const hit = scene.swap && depth === 3 && (position === 1 || position === 4);
                        const x = X0 + (group.start + i) * SLOT;
                        return (
                          <g key={position}>
                            <rect x={x} y={ROW_Y[depth]} width={CELL} height={CELL} rx={4} fill={hit ? "#d97706" : position % 2 === 0 ? "#2563eb" : "#64748b"} fillOpacity={hit ? 0.3 : 0.12} />
                            <text x={x + CELL / 2} y={ROW_Y[depth] + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={hit ? "#d97706" : "#64748b"}>{position}</text>
                          </g>
                        );
                      })}
                    </g>
                  ))}
                </g>
              );
            })}
            <text x={X0} y={14} fontSize={10} fill="#64748b">원래 위치 (파랑 짝수 · 회색 홀수)</text>
            <text x={348} y={214} textAnchor="end" fontSize={11} fontWeight={700} fill={scene.ledger ? "#2563eb" : "#64748b"}>
              {scene.ledger ?? (scene.swap ? "칸 1 ↔ 위치 4 · 칸 4 ↔ 위치 1" : "층마다 합 8")}
            </text>
          </svg>
        );
      }}
    />
  );
}
