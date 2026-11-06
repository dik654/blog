import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — FDIC 기본 한도는 예금자·가입 은행·소유권 범주를 기준으로 적용합니다.
 * 칸 하나 = 기준 셋의 한 조합 = 한도 25만 달러 하나. 예금자마다 판을 나눠 평면으로 그립니다.
 * 축의 은행 1·2, 범주 1·2, 예금자 A·B는 칸을 보이려는 자리 이름입니다.
 */
type Cell = readonly [bank: 0 | 1, category: 0 | 1, depositor: 0 | 1];

interface Scene {
  label: string;
  summary: string;
  note: string;
  base: Cell | null;
  next: Cell | null;
  layout: "us" | "eu";
  outside?: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "칸 하나가 한도 하나", summary: "예금자 × 은행 × 범주", note: "미국 FDIC의 기본 한도 25만 달러는 예금자, 가입 은행, 소유권 범주를 기준으로 적용합니다. 그 한 조합이 칸 하나입니다.", base: [0, 0, 0], next: null, layout: "us" },
  { label: "은행을 바꾸면", summary: "가로로 옮겨 새 칸", note: "예금자와 범주가 같아도 가입 은행이 다르면 옆 칸입니다.", base: [0, 0, 0], next: [1, 0, 0], layout: "us" },
  { label: "소유권 범주를 바꾸면", summary: "위로 옮겨 새 칸", note: "같은 은행, 같은 예금자라도 소유권 범주가 다르면 위 칸입니다.", base: [0, 0, 0], next: [0, 1, 0], layout: "us" },
  { label: "예금자가 다르면", summary: "옆 판으로 옮겨 새 칸", note: "같은 은행, 같은 범주라도 예금자가 다르면 오른쪽 판의 같은 자리입니다.", base: [0, 0, 0], next: [0, 0, 1], layout: "us" },
  { label: "EU의 기준", summary: "예금자 × 은행 · 10만 유로", note: "EU의 10만 유로 보호도 해당 예금자와 은행을 기준으로 따집니다. 본문이 드는 기준이 둘이라 판마다 칸이 한 줄입니다.", base: [0, 0, 0], next: null, layout: "eu" },
  { label: "칸 밖의 손실", summary: "펀드·주식·구조화증권", note: "자격을 갖춘 예금에 적용하는 제도라 같은 은행에서 산 펀드나 주식, 구조화증권의 시장 손실은 어느 칸에도 없습니다.", base: null, next: null, layout: "us", outside: true },
];

const ACCENT = "#2563eb";
const NEW_CELL = "#d97706";
const FAINT = "#94a3b8";
const OUTSIDE = "#dc2626";
const GRAY = "#64748b";

const CELL_W = 68;
const CELL_H = 46;
const CELL_GAP = 4;
const PANEL_X = [40, 192] as const;
const TOP = 36;
const rowY = (rowIndex: number) => TOP + rowIndex * (CELL_H + CELL_GAP);

function Panel({ scene, depositor }: { scene: Scene; depositor: 0 | 1 }) {
  const x = PANEL_X[depositor];
  const eu = scene.layout === "eu";
  const rows: readonly (0 | 1)[] = eu ? [0] : [1, 0];
  const offset = eu ? (CELL_H + CELL_GAP) / 2 : 0;
  const limit = eu ? "10만 유로" : "25만 달러";
  return (
    <g>
      <text x={x + CELL_W + CELL_GAP / 2} y={13} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">예금자 {depositor ? "B" : "A"}</text>
      {([0, 1] as const).map((bank) => (
        <text key={bank} x={x + bank * (CELL_W + CELL_GAP) + CELL_W / 2} y={29} textAnchor="middle" fontSize={11} fill={GRAY}>은행 {bank + 1}</text>
      ))}
      {rows.map((category, rowIndex) => {
        const y = rowY(rowIndex) + offset;
        return (
          <g key={category}>
            {!eu && depositor === 0 && <text x={0} y={y + CELL_H / 2 + 4} fontSize={11} fill={GRAY}>범주 {category + 1}</text>}
            {([0, 1] as const).map((bank) => {
              const same = (cell: Cell | null) => cell !== null && cell[0] === bank && cell[1] === category && cell[2] === depositor;
              const isNext = same(scene.next);
              const isBase = same(scene.base);
              const tone = isNext ? NEW_CELL : isBase ? ACCENT : FAINT;
              const cellX = x + bank * (CELL_W + CELL_GAP);
              const centerX = cellX + CELL_W / 2;
              return (
                <g key={bank}>
                  <rect x={cellX} y={y} width={CELL_W} height={CELL_H} rx={4} fill={tone} fillOpacity={isNext || isBase ? 0.2 : 0.06} stroke={tone} strokeWidth={isNext || isBase ? 1.25 : 0.75} />
                  {isBase && <text x={centerX} y={y + CELL_H / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={tone}>{limit}</text>}
                  {isNext && (
                    <g>
                      <text x={centerX} y={y + CELL_H / 2 - 3} textAnchor="middle" fontSize={12} fontWeight={700} fill={tone}>새 칸</text>
                      <text x={centerX} y={y + CELL_H / 2 + 12} textAnchor="middle" fontSize={12} fontWeight={700} fill={tone}>{limit}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

export default function DepositLatticeViz() {
  return (
    <SceneShell
      eyebrow="한도를 세는 칸"
      title="기준 하나만 달라져도 한도를 세는 칸이 달라집니다"
      description="왼쪽 판은 예금자 A, 오른쪽 판은 예금자 B입니다. 판 안의 가로는 은행, 세로는 소유권 범주입니다. 파란 칸이 처음 칸, 주황 칸이 옮겨 간 칸입니다."
      note="은행 1·2, 범주 1·2, 예금자 A·B는 칸을 보이려는 자리 이름입니다. 소유권 범주의 실제 종류와 합산 세부는 제도 자료에서 확인해야 합니다."
      ariaLabel="예금자, 은행, 소유권 범주 세 기준이 만드는 한도 칸과 EU 기준, 칸 밖의 시장 손실"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 340 172" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Panel scene={scene} depositor={0} />
            <Panel scene={scene} depositor={1} />
            {scene.outside && (
              <g>
                <rect x={40} y={142} width={292} height={28} rx={4} fill={OUTSIDE} fillOpacity={0.06} stroke={OUTSIDE} strokeWidth={1} strokeDasharray="4 3" />
                <text x={186} y={160} textAnchor="middle" fontSize={12} fontWeight={700} fill={OUTSIDE}>펀드·주식 등의 시장 손실: 어느 칸에도 없음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
