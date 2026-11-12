import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tree-search — Tree of Thoughts Game of 24 설정 b=5, k=5, d=3.
 * depth 1: root 1개 × k=5 → 5 · depth 2: 유지 5 × 5 → 25 · depth 3: 유지 5 × 5 → 25.
 * 누적 E = 5 + 2×5×5 = 55. 어느 후보가 남는지는 설명용 예시(가정)다.
 */
const K = 5;
const B = 5;
const W = 320;
const ROW_Y = [60, 110, 160] as const;
const ROOT = { x: 160, y: 18 };
const DEPTH1_X = [100, 130, 160, 190, 220] as const;
const DOT_GAP = 10;
const GROUP_GAP = 18;
const GROUP_W = (K - 1) * DOT_GAP;
const START_X = (W - (B * GROUP_W + (B - 1) * GROUP_GAP)) / 2;
const wideX = (index: number) => START_X + Math.floor(index / K) * (GROUP_W + GROUP_GAP) + (index % K) * DOT_GAP;
const groupCenter = (group: number) => START_X + group * (GROUP_W + GROUP_GAP) + GROUP_W / 2;
const KEPT_DEPTH2: readonly number[] = [1, 3, 12, 16, 23];
const KEPT_DEPTH3: readonly number[] = [2, 8, 11, 19, 24];
const WIDE = Array.from({ length: B * K }, (_, index) => index);
const COUNTS = [K, B * K, B * K] as const;

const SCENES = [
  { label: "depth 1", summary: "1 × 5 = 5회 · 누적 5", note: "Root 하나에서 k=5개의 다음 단계 후보(생각)를 만들고 evaluator 가 다섯 개 모두에 점수를 매깁니다. 후보가 k=5개라 상위 b=5개를 남기면 다섯 개가 그대로 다음 depth 의 상태가 됩니다." },
  { label: "depth 2", summary: "5 × 5 = 25회 · 누적 30", note: "남은 상태 5개마다 5개씩, 25개 후보를 평가합니다. 점수 상위 b=5개만 넘기고 20개는 버립니다. 상위 5개는 한 부모에 몰릴 수도 있습니다." },
  { label: "depth 3", summary: "5 × 5 = 25회 · 누적 55", note: "버린 20개 아래로는 아무것도 만들지 않아 이번에도 5개 × 5개 = 25개만 평가합니다. 합계는 5 + 2×5×5 = 55회이고, 점수 상위 5개가 결과 상태로 남습니다." },
] as const;

function Dot({ x, y, state }: { x: number; y: number; state: "hidden" | "kept" | "pruned" }) {
  if (state === "hidden") return <circle cx={x} cy={y} r={3.5} fill="none" stroke="#cbd5e1" strokeWidth={1} opacity={0.35} />;
  if (state === "kept") return <circle cx={x} cy={y} r={4.5} fill="#2563eb" stroke="#2563eb" strokeWidth={1} />;
  return <g opacity={0.6}><circle cx={x} cy={y} r={3.5} fill="none" stroke="#94a3b8" strokeWidth={1} /><line x1={x - 3} x2={x + 3} y1={y + 3} y2={y - 3} stroke="#94a3b8" strokeWidth={1} /></g>;
}

export default function TreeEvaluationCountViz() {
  return (
    <SceneShell
      eyebrow="Tree search · b=5 · k=5 · d=3"
      title="평가 횟수는 남긴 상태 수 × 후보 수로 depth 마다 쌓입니다"
      description="점 하나가 evaluator 가 점수를 매기는 후보 하나입니다. k는 상태 하나에서 만드는 다음 단계 후보 수, b는 depth 마다 남기는 상태 수, d는 반복하는 depth 수입니다."
      note="횟수는 후보 단위로 셉니다. Tree of Thoughts 는 후보마다 evaluator 를 3회 샘플링하므로 실제 evaluator 호출은 그 세 배입니다. 어느 후보가 상위 b개로 남는지는 개수를 보이기 위한 예시입니다(가정)."
      ariaLabel="b=5, k=5, d=3 tree search 에서 depth 마다 평가하는 후보 수와 누적 55회"
      scenes={SCENES}
      render={(active) => {
        const depth2State = (index: number) => (active < 1 ? "hidden" : KEPT_DEPTH2.includes(index) ? "kept" : "pruned");
        const depth3State = (index: number) => (active < 2 ? "hidden" : KEPT_DEPTH3.includes(index) ? "kept" : "pruned");
        return (
          <div className="min-w-0">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="#2563eb" /></svg>점수 상위 b개 · 남김</span>
              <span className="inline-flex items-center gap-1.5"><svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="3.5" fill="none" stroke="#94a3b8" strokeWidth="1" /><line x1="2" x2="8" y1="8" y2="2" stroke="#94a3b8" strokeWidth="1" /></svg>평가 후 버림</span>
            </div>
            <svg viewBox={`0 0 ${W} 172`} className="mx-auto mt-2 h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {DEPTH1_X.map((x) => (
                <line key={`r-${x}`} x1={ROOT.x} y1={ROOT.y + 6} x2={x} y2={ROW_Y[0] - 5} stroke="#94a3b8" strokeWidth={1} />
              ))}
              {active >= 1 && DEPTH1_X.map((x, group) => (
                <line key={`d1-${x}`} x1={x} y1={ROW_Y[0] + 5} x2={groupCenter(group)} y2={ROW_Y[1] - 7} stroke="#94a3b8" strokeWidth={1} />
              ))}
              {active >= 2 && KEPT_DEPTH2.map((parent, group) => (
                <line key={`d2-${parent}`} x1={wideX(parent)} y1={ROW_Y[1] + 5} x2={groupCenter(group)} y2={ROW_Y[2] - 7} stroke="#94a3b8" strokeWidth={1} />
              ))}
              <rect x={ROOT.x - 16} y={ROOT.y - 8} width={32} height={16} rx={4} fill="none" stroke="#64748b" strokeWidth={1} />
              <text x={ROOT.x} y={ROOT.y + 4} textAnchor="middle" fontSize={10} fill="#64748b">root</text>
              {DEPTH1_X.map((x) => (
                <Dot key={`n1-${x}`} x={x} y={ROW_Y[0]} state="kept" />
              ))}
              {WIDE.map((index) => (
                <Dot key={`n2-${index}`} x={wideX(index)} y={ROW_Y[1]} state={depth2State(index)} />
              ))}
              {WIDE.map((index) => (
                <Dot key={`n3-${index}`} x={wideX(index)} y={ROW_Y[2]} state={depth3State(index)} />
              ))}
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              {COUNTS.map((count, depth) => (
                <div key={depth} className={`rounded-lg border px-2 py-2 ${depth === active ? "border-primary" : "border-border"} ${depth > active ? "opacity-40" : ""}`}>
                  <span className="block text-muted-foreground">depth {depth + 1}</span>
                  <span className="block font-mono font-bold">{depth === 0 ? "1×5" : "5×5"} = {count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
