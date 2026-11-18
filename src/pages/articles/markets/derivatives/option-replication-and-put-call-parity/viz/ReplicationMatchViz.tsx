import SceneShell from "./SceneShell";
import type { ShellScene } from "./SceneShell";

/**
 * 본문 대응: #black-box — 주가 100 → 120 또는 80, 행사가격 100 콜은 20 또는 0.
 * 주식 수량 = 지급 차이 20 ÷ 주가 차이 40 = 0.5 → 주식 몫 50·60·40.
 * 현금 −40을 더하면 10·20·0 → 상승·하락에서 콜과 같고 오늘 비용 10.
 */
const DELTA = 20 / (120 - 80);
const LOAN = -40;
const COLUMNS = [
  { key: "today", label: "오늘", price: 100, call: null as number | null },
  { key: "up", label: "상승", price: 120, call: 20 as number | null },
  { key: "down", label: "하락", price: 80, call: 0 as number | null },
] as const;

const W = 360;
const H = 246;
const TOP = 52;
const BOTTOM = 212;
const V_MAX = 70;
const V_MIN = -50;
const y = (value: number) => TOP + ((V_MAX - value) / (V_MAX - V_MIN)) * (BOTTOM - TOP);
const X = [56, 196, 290];
const BAR = 26;

const SCENES: readonly ShellScene[] = [
  { label: "목표: 콜의 지급표", summary: "상승 20 · 하락 0", note: "주가가 120이면 행사가격 100에 사서 20을 얻고, 80이면 행사하지 않아 0입니다. 점선 칸이 복제로 맞춰야 할 목표입니다. 오늘 콜 가격은 아직 모릅니다." },
  { label: "주식 반 주로 차이 맞추기", summary: "20 ÷ 40 = 0.5주", note: "콜 지급은 두 상태 사이에서 20 벌어지고 주가는 40 벌어집니다. 그래서 주식을 0.5주 사면 60과 40, 차이가 꼭 20이 됩니다. 이 주식 수량을 델타라고 부릅니다. 차이는 맞았지만 두 상태 모두 목표보다 40 높습니다." },
  { label: "현금 −40으로 높이 맞추기", summary: "60−40=20 · 40−40=0", note: "40을 빌려 두면 만기에 두 상태 모두 40을 갚습니다. 막대 전체가 40 내려가 상승 20, 하락 0으로 점선 칸과 한 칸씩 같아집니다." },
  { label: "오늘 이 조합의 값", summary: "50 − 40 = 10", note: "오늘 주식 반 주는 50이고 빌린 40을 빼면 내 돈은 10이 듭니다. 미래 지급이 콜과 같으므로 콜 가격도 10이어야 합니다. 금리 0, 거래비용과 중간 배당이 없다는 본문 가정입니다." },
];

function ReplicationChart({ scene }: { scene: number }) {
  const showStock = scene >= 1;
  const showLoan = scene >= 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
      <line x1={14} x2={W - 14} y1={y(0)} y2={y(0)} stroke="#94a3b8" strokeWidth={1} />
      <text x={14} y={y(0) - 4} fontSize={10} fill="#64748b">0</text>
      <line x1={140} x2={140} y1={TOP - 22} y2={BOTTOM} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
      <text x={243} y={TOP - 18} textAnchor="middle" fontSize={11} fill="#64748b">만기 (한 기간 뒤)</text>
      {COLUMNS.map((column, index) => {
        const cx = X[index];
        const stock = DELTA * column.price;
        const net = stock + LOAN;
        const isToday = column.key === "today";
        const highlight = isToday ? scene === 3 : scene === 2;
        return (
          <g key={column.key}>
            <text x={cx} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">{`${column.label} · 주가 ${column.price}`}</text>
            {column.call !== null && (
              <rect x={cx - BAR - 6} y={y(Math.max(column.call, 0)) - (column.call === 0 ? 1 : 0)} width={BAR * 2 + 12} height={Math.max(y(0) - y(column.call), 2)} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
            )}
            {column.call !== null && !showStock && (
              <text x={cx} y={y(column.call) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">{`콜 ${column.call}`}</text>
            )}
            {isToday && !showStock && (
              <text x={cx} y={y(20)} textAnchor="middle" fontSize={11} fill="#64748b">콜 가격 = ?</text>
            )}
            {showStock && (
              <>
                <rect x={cx - BAR} y={y(stock)} width={BAR} height={y(0) - y(stock)} fill="#64748b" opacity={0.75} rx={2} />
                <text x={cx - BAR / 2} y={y(stock) - 5} textAnchor="middle" fontSize={11} fill="#334155">{stock}</text>
              </>
            )}
            {showLoan && (
              <>
                <rect x={cx + 2} y={y(0)} width={BAR} height={y(LOAN) - y(0)} fill="#d97706" opacity={0.7} rx={2} />
                <text x={cx + 2 + BAR / 2} y={y(LOAN) + 13} textAnchor="middle" fontSize={11} fill="#b45309">−40</text>
                <circle cx={cx + BAR + 14} cy={y(net)} r={4} fill={highlight ? "#2563eb" : "#93c5fd"} />
                <text x={cx + BAR + 22} y={y(net) + 4} fontSize={12} fontWeight={700} fill="#1d4ed8">{`= ${net}`}</text>
              </>
            )}
          </g>
        );
      })}
      {scene === 1 && (
        <>
          <line x1={X[1] - BAR - 10} x2={X[2] - BAR - 10} y1={y(60)} y2={y(60)} stroke="#64748b" strokeWidth={1} strokeDasharray="2 3" />
          <line x1={X[2] - BAR - 10} x2={X[2] - BAR - 10} y1={y(60)} y2={y(40)} stroke="#64748b" strokeWidth={1} />
          <text x={X[2] - BAR - 14} y={y(50) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">차이 20</text>
        </>
      )}
      <g fontSize={10} fill="#475569">
        <rect x={14} y={6} width={9} height={9} fill="#64748b" opacity={0.75} />
        <text x={27} y={14}>주식 0.5주</text>
        <rect x={92} y={6} width={9} height={9} fill="#d97706" opacity={0.7} />
        <text x={105} y={14}>빌린 현금</text>
        <rect x={166} y={6} width={9} height={9} fill="none" stroke="#2563eb" strokeDasharray="3 2" />
        <text x={179} y={14}>콜 지급(목표)</text>
        <circle cx={262} cy={10.5} r={4} fill="#2563eb" />
        <text x={270} y={14}>합계</text>
      </g>
    </svg>
  );
}

export default function ReplicationMatchViz() {
  return (
    <SceneShell
      eyebrow="복제의 두 손잡이"
      title="주식 수량은 차이를, 현금은 높이를 맞춥니다"
      description="왼쪽은 오늘, 오른쪽 두 칸은 한 기간 뒤 주가가 120 또는 80인 상태입니다. 콜은 행사가격 100에 주식을 살 수 있는 권리라서 주가 120이면 20, 80이면 0을 줍니다."
      ariaLabel="주식 반 주와 차입 40으로 콜의 20과 0을 만드는 과정"
      scenes={SCENES}
      render={(index) => <ReplicationChart scene={index} />}
    />
  );
}
