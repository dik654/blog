/**
 * word를 32 banks에 차례로 배치한 격자입니다. 세로줄 하나가 bank 하나이고 다음 줄로 넘어가면 bank 0으로 돌아옵니다.
 * 위 막대는 bank별 서로 다른 주소 요청 수입니다.
 */
const BANKS = 32;
const CELL_W = 9;
const CELL_H = 4.4;
const X0 = 30;
const HIST_TOP = 8;
const HIST_H = 26;
const GRID_Y = 52;

export default function BankGrid({
  rows,
  reads,
  padding = [],
  mark,
  sequential = false,
  ariaLabel,
}: {
  rows: number;
  reads: readonly number[];
  padding?: readonly number[];
  mark?: { word: number; text: string };
  sequential?: boolean;
  ariaLabel: string;
}) {
  const counts = Array.from({ length: BANKS }, (_, bank) => reads.filter((word) => word % BANKS === bank).length);
  const height = GRID_Y + rows * CELL_H + 18;
  const wordPos = (word: number) => ({ x: X0 + (word % BANKS) * CELL_W, y: GRID_Y + Math.floor(word / BANKS) * CELL_H });
  return (
    <svg viewBox={`0 0 ${X0 + BANKS * CELL_W + 40} ${height}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={ariaLabel}>
      {/* sequential은 word가 놓이는 순서만 보이는 장면이라 읽기 요청이 없고, 막대도 그리지 않습니다. */}
      {!sequential && <text x={X0 - 4} y={HIST_TOP + HIST_H} textAnchor="end" fontSize={9} fill="#64748b">요청</text>}
      {!sequential && counts.map((count, bank) =>
        count === 0 ? null : <rect key={bank} x={X0 + bank * CELL_W + 1} y={HIST_TOP + HIST_H - (count / BANKS) * HIST_H - 1} width={CELL_W - 2} height={(count / BANKS) * HIST_H + 1} fill="#d97706" />,
      )}
      {!sequential && <line x1={X0} x2={X0 + BANKS * CELL_W} y1={HIST_TOP + HIST_H} y2={HIST_TOP + HIST_H} stroke="#94a3b8" strokeWidth={1} />}
      {!sequential && reads.length > 0 && <text x={X0 + BANKS * CELL_W + 4} y={HIST_TOP + HIST_H} fontSize={9} fontWeight={700} fill="#d97706">최대 {Math.max(...counts)}</text>}
      <text x={X0 + CELL_W / 2} y={GRID_Y - 5} textAnchor="middle" fontSize={9} fill="#64748b">0</text>
      <text x={X0 + BANKS * CELL_W - CELL_W / 2} y={GRID_Y - 5} textAnchor="middle" fontSize={9} fill="#64748b">31</text>
      <text x={X0 + (BANKS * CELL_W) / 2} y={GRID_Y - 5} textAnchor="middle" fontSize={9} fill="#64748b">bank 번호 →</text>
      <rect x={X0} y={GRID_Y} width={BANKS * CELL_W} height={rows * CELL_H} fill="none" stroke="#94a3b8" strokeWidth={1} />
      {Array.from({ length: BANKS - 1 }, (_, i) => (
        <line key={i} x1={X0 + (i + 1) * CELL_W} x2={X0 + (i + 1) * CELL_W} y1={GRID_Y} y2={GRID_Y + rows * CELL_H} stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.2} />
      ))}
      {padding.map((word) => {
        const p = wordPos(word);
        return <rect key={word} x={p.x} y={p.y} width={CELL_W} height={CELL_H} fill="#94a3b8" opacity={0.6} />;
      })}
      {reads.map((word) => {
        const p = wordPos(word);
        return <rect key={word} x={p.x} y={p.y} width={CELL_W} height={CELL_H} fill={sequential ? "#2563eb" : "#d97706"} />;
      })}
      {mark && (
        <g>
          <rect x={wordPos(mark.word).x - 1} y={wordPos(mark.word).y - 1} width={CELL_W + 2} height={CELL_H + 2} fill="#2563eb" />
          <text x={X0 + BANKS * CELL_W + 4} y={wordPos(mark.word).y + 6} fontSize={9} fontWeight={700} fill="#2563eb">{mark.text}</text>
        </g>
      )}
      <text x={X0 - 4} y={GRID_Y + 7} textAnchor="end" fontSize={9} fill="#64748b">word</text>
      <text x={X0 + (BANKS * CELL_W) / 2} y={height - 5} textAnchor="middle" fontSize={9} fill="#64748b">줄이 끝나면 다음 word는 다시 bank 0</text>
    </svg>
  );
}
