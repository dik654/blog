import SparseSceneShell from "./SparseSceneShell";

/**
 * 본문 대응: #cost-saving — 같은 "몇 번 곱하나"가 장부마다 다른 단위를 셉니다.
 * 위치 쌍(네모): 첫 사례 4×2=8, 여섯 칸 전부 6×6=36.
 * Fq2 곱 호출(동그라미): 014 = 5+3+5 = 13, 034 = 3+5+5 = 13, 일반 Fq12 곱 = 3×6 = 18.
 */
interface Group {
  label: string;
  count: number;
}

interface LedgerScene {
  label: string;
  summary: string;
  note: string;
  kind: "pairs" | "calls";
  grid?: { rows: number; cols: number; liveCols: readonly number[] };
  axis?: string;
  groups?: readonly Group[];
}

const SCENES: readonly LedgerScene[] = [
  { label: "위치 쌍 8", summary: "A 4칸 × B의 0 아닌 2칸 = 8", kind: "pairs", grid: { rows: 4, cols: 4, liveCols: [0, 2] }, axis: "행 = A의 네 칸 · 열 = B의 네 칸, 점선 열은 B의 0인 칸", note: "첫 사례의 8은 다항식의 0 아닌 위치 쌍입니다. 네 칸끼리 모두 짝지으면 16쌍이지만 B의 0인 두 열을 빼면 8쌍이 남습니다." },
  { label: "014 호출 13", summary: "5 + 3 + 5 = 13회", kind: "calls", groups: [{ label: "mul_by_01", count: 5 }, { label: "mul_by_1", count: 3 }, { label: "mul_by_01", count: 5 }], note: "고정 원문의 014는 아래 함수 mul_by_01을 두 번, mul_by_1을 한 번 부릅니다. 그 안에 적힌 일반 Fq2 곱이 5·3·5회라서 합은 13회입니다." },
  { label: "034 호출 13", summary: "3 + 5 + 5 = 13회", kind: "calls", groups: [{ label: "직접 곱", count: 3 }, { label: "mul_by_01", count: 5 }, { label: "mul_by_01", count: 5 }], note: "034는 직접 세 번 곱하고 아래 함수를 두 번 불러 3+5+5=13회입니다. 014와 같은 13회지만 곱하는 값은 다릅니다." },
  { label: "일반 곱 호출 18", summary: "Fq6 곱 3번 × 6 = 18회", kind: "calls", groups: [{ label: "Fq6 곱", count: 6 }, { label: "Fq6 곱", count: 6 }, { label: "Fq6 곱", count: 6 }], note: "일반 Fq12 곱은 위층에서 Fq6 곱을 세 번 하고, Fq6 곱마다 Fq2 곱을 여섯 번 불러 18회입니다." },
  { label: "위치 쌍 36", summary: "6칸 × 6칸 = 36쌍", kind: "pairs", grid: { rows: 6, cols: 6, liveCols: [0, 1, 2, 3, 4, 5] }, axis: "행 = 한 값의 여섯 칸 · 열 = 다른 값의 여섯 칸", note: "여섯 칸을 모두 짝지은 36쌍은 18회 호출과도 다른 장부입니다. 어느 숫자도 실제 실행 시간이 아니며, 이 글은 속도를 측정하지 않았습니다." },
];

const PAIR = "#2563eb";
const CALL = "#0f766e";

function PairGrid({ rows, cols, liveCols }: { rows: number; cols: number; liveCols: readonly number[] }) {
  const size = 18;
  const gap = 5;
  const width = cols * (size + gap) - gap;
  const height = rows * (size + gap) - gap;
  return (
    <svg viewBox={`-2 -2 ${width + 4} ${height + 4}`} width={width + 4} height={height + 4} className="mx-auto block max-w-full" aria-hidden>
      {Array.from({ length: rows * cols }, (_, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const live = liveCols.includes(col);
        return (
          <rect
            key={index}
            x={col * (size + gap)}
            y={row * (size + gap)}
            width={size}
            height={size}
            rx={2}
            fill={live ? PAIR : "#ffffff"}
            fillOpacity={live ? 0.85 : 1}
            stroke={live ? PAIR : "#cbd5e1"}
            strokeWidth={1}
            strokeDasharray={live ? undefined : "2 2"}
          />
        );
      })}
    </svg>
  );
}

function CallGroups({ groups }: { groups: readonly Group[] }) {
  return (
    <div className="grid min-w-0 grid-cols-3 gap-2">
      {groups.map((group, index) => (
        <div key={index} className="min-w-0 rounded-md border border-border bg-background px-2 py-2 text-center">
          <p className="break-all text-[11px] leading-4 text-muted-foreground">{group.label}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {Array.from({ length: group.count }, (_, dot) => (
              <svg key={dot} width={12} height={12} viewBox="0 0 12 12" aria-hidden>
                <circle cx={6} cy={6} r={5} fill={CALL} />
              </svg>
            ))}
          </div>
          <p className="mt-1 font-mono text-xs font-bold">{group.count}회</p>
        </div>
      ))}
    </div>
  );
}

export default function CallLedgerViz() {
  return (
    <SparseSceneShell
      eyebrow="곱셈을 세는 네 장부"
      title="8쌍·36쌍과 13회·18회는 서로 다른 단위를 셉니다"
      description="네모 하나는 곱할 계수 위치 한 쌍, 동그라미 하나는 코드에 적힌 일반 Fq2 곱 한 번입니다. ξ 같은 상수 곱과 덧셈은 세지 않습니다. 두 단위를 서로 바꿔 읽지 않습니다."
      ariaLabel="위치 쌍과 Fq2 곱 호출 수를 장부별로 세는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <p className="text-xs font-bold" style={{ color: scene.kind === "pairs" ? PAIR : CALL }}>
              {scene.kind === "pairs" ? "■ 곱할 위치 쌍" : "● Fq2 곱 호출"}
            </p>
            <div className="flex min-h-[9.5rem] min-w-0 flex-col items-center justify-center gap-2">
              {scene.grid && <PairGrid {...scene.grid} />}
              {scene.axis && <p className="text-center text-[11px] leading-4 text-muted-foreground">{scene.axis}</p>}
              {scene.groups && <CallGroups groups={scene.groups} />}
            </div>
          </div>
        );
      }}
    />
  );
}
