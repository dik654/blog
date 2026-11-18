import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #example-selection — 고정 집합 재사용 vs pool 500에서 top-5 유사도 검색, 그리고 pool·평가 set 분리.
 * 격자 한 칸 = 후보 example 하나(25열 × 20행 = 500칸). 어떤 칸이 뽑히는지와 평가 set 크기는 모양을 보이려는 가정이다.
 */
const COLS = 25;
const ROWS = 20;
const CELL = 12;
const GRID_W = COLS * CELL;
const GRID_H = ROWS * CELL;
const EVAL_TOP = GRID_H + 22;
const EVAL_ROWS = 4;
const VIEW_H = EVAL_TOP + EVAL_ROWS * CELL + 4;

const idx = (col: number, row: number) => row * COLS + col;

const FIXED_SET = [idx(2, 17), idx(11, 2), idx(16, 9), idx(22, 18), idx(7, 12)];
const TOP_A = [idx(5, 4), idx(6, 4), idx(5, 5), idx(6, 5), idx(5, 3)];
const TOP_B = [idx(19, 14), idx(20, 14), idx(19, 15), idx(18, 14), idx(20, 13)];
/** 겹친 평가 set: pool의 왼쪽 위 10열 × 4행 = 40칸(가정). */
const EVAL_OVERLAP = Array.from({ length: 40 }, (_, k) => idx(k % 10, 2 + Math.floor(k / 10)));

const SCENES = [
  {
    label: "무작위 · 고정 집합",
    summary: "요청 1·2 모두 같은 5칸",
    note: "고정해 둔 example 집합을 매번 재사용합니다. 검색이 없어 가장 싸고 재현하기 쉽지만, 현재 입력과 관련 없는 예시가 섞여 있어도 그대로 prompt에 들어갑니다. 5개라는 크기는 비교용 가정입니다.",
  },
  {
    label: "유사도 · top-5",
    summary: "요청마다 다른 5칸 + 지연",
    note: "현재 query를 embedding으로 바꿔 pool 500개에서 가장 가까운 5개를 고릅니다. 요청 1과 요청 2가 서로 다른 칸을 가져가 관련성은 오르지만, embedding 계산과 검색 시간이 매 request 지연에 더해집니다.",
  },
  {
    label: "pool과 평가 set이 겹침",
    summary: "겹친 칸 = leakage",
    note: "평가에 쓸 held-out set이 선택 pool 안에 들어 있으면, 겹친 칸은 평가 문항이면서 동시에 demonstration 후보입니다. 이 상태의 점수에는 train/eval leakage가 섞입니다.",
  },
  {
    label: "미리 분리",
    summary: "선택용 pool ∩ 평가 set = 없음",
    note: "선택에 쓰는 pool과 평가에 쓰는 set을 처음부터 따로 둡니다. 유사도 검색은 위쪽 500칸 안에서만 일어나고, 아래 평가 set은 검색 대상이 되지 않습니다.",
  },
] as const;

const PIPE = ["query", "embedding", "pool 500 검색", "top-5", "prompt"] as const;

function Grid({ step }: { step: number }) {
  const fixed = new Set(step === 0 ? FIXED_SET : []);
  const a = new Set(step >= 1 ? TOP_A : []);
  const b = new Set(step >= 1 ? TOP_B : []);
  const overlap = new Set(step === 2 ? EVAL_OVERLAP : []);
  return (
    <svg viewBox={`0 0 ${GRID_W} ${VIEW_H}`} className="block h-auto w-full max-w-[18rem]" role="img" aria-label="후보 pool 500칸 격자">
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const x = (i % COLS) * CELL;
        const y = Math.floor(i / COLS) * CELL;
        const fill = fixed.has(i) ? "#475569" : a.has(i) ? "#2563eb" : b.has(i) ? "#d97706" : "#94a3b8";
        const picked = fixed.has(i) || a.has(i) || b.has(i);
        return (
          <g key={i}>
            <rect x={x + 1.5} y={y + 1.5} width={CELL - 3} height={CELL - 3} rx={1.5} fill={fill} fillOpacity={picked ? 1 : 0.28} />
            {overlap.has(i) ? <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} fill="none" stroke="#dc2626" strokeWidth={1} /> : null}
            {overlap.has(i) && a.has(i) ? (
              <path d={`M${x + 2} ${y + 2}L${x + CELL - 2} ${y + CELL - 2}M${x + CELL - 2} ${y + 2}L${x + 2} ${y + CELL - 2}`} stroke="#ffffff" strokeWidth={1.25} />
            ) : null}
          </g>
        );
      })}
      {step === 3
        ? Array.from({ length: 10 * EVAL_ROWS }, (_, k) => (
            <rect
              key={`e${k}`}
              x={(k % 10) * CELL + 1.5}
              y={EVAL_TOP + Math.floor(k / 10) * CELL + 1.5}
              width={CELL - 3}
              height={CELL - 3}
              rx={1.5}
              fill="none"
              stroke="#dc2626"
              strokeWidth={1}
            />
          ))
        : null}
      {step === 3 ? <line x1={0} x2={GRID_W} y1={GRID_H + 11} y2={GRID_H + 11} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" /> : null}
    </svg>
  );
}

function Pipeline({ step }: { step: number }) {
  return (
    <div className="grid grid-cols-5 gap-1 text-center text-[9px] leading-4 sm:gap-2 sm:text-xs">
      {PIPE.map((name, i) => {
        const skipped = step === 0 && (i === 1 || i === 2);
        const label = step === 0 && i === 3 ? "고정 5개" : name;
        const slow = step >= 1 && (i === 1 || i === 2);
        return (
          <div key={name} className={`min-w-0 rounded-md border px-0.5 py-1.5 sm:px-1 ${skipped ? "border-dashed border-border/60 text-muted-foreground/50" : "border-border bg-background"}`}>
            <span className="block break-keep font-semibold">{label}</span>
            <span className={`block text-[9px] sm:text-[10px] ${slow ? "font-bold text-amber-700 dark:text-amber-400" : skipped ? "" : "invisible"}`}>
              {slow ? "+ 지연" : skipped ? "없음" : "·"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Legend({ step }: { step: number }) {
  const items =
    step === 0
      ? [["#475569", "solid", "두 요청이 같이 쓰는 고정 집합"]]
      : [
          ["#2563eb", "solid", "요청 1의 top-5"],
          ["#d97706", "solid", "요청 2의 top-5"],
          ...(step >= 2 ? [["#dc2626", "outline", step === 2 ? "평가 held-out set (pool과 겹침, ✕ = 뽑힌 평가 문항)" : "평가 held-out set (pool 밖)"]] : []),
        ];
  return (
    <ul className="flex min-h-[2.5rem] flex-wrap gap-x-4 gap-y-1 sm:flex-col sm:flex-nowrap text-[11px] leading-5 text-muted-foreground">
      {items.map(([color, kind, text]) => (
        <li key={text} className="flex items-center gap-1.5">
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" fill={kind === "solid" ? color : "none"} stroke={color} strokeWidth={1} />
          </svg>
          {text}
        </li>
      ))}
    </ul>
  );
}

function Drawing({ step }: { step: number }) {
  return (
    <div className="grid min-w-0 gap-3">
      <Pipeline step={step} />
      <div className="grid min-w-0 gap-3 sm:grid-cols-[18rem_minmax(0,1fr)] sm:items-start sm:gap-6">
        <Grid step={step} />
        <Legend step={step} />
      </div>
    </div>
  );
}

export default function ExampleSelectionViz() {
  return (
    <SceneShell
      eyebrow="Demonstration 선택"
      title="고정 집합은 그대로, 유사도 선택은 요청마다 다른 칸"
      description="격자 한 칸이 후보 example 하나이고 위쪽 25×20 = 500칸이 본문의 pool 500개입니다. 어느 칸이 뽑히는지와 평가 set 40칸은 모양을 보이려는 가정입니다."
      ariaLabel="무작위 고정 선택과 유사도 top-5 선택, 그리고 선택 pool과 평가 set의 분리"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <Drawing key={scene.label} step={index} />)} />
      )}
    />
  );
}
