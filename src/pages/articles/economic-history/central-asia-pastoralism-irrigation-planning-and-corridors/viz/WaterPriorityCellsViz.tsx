import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 물 100 = 면화 60 + 식량 25 + 가정·생태계 15.
 * 총량 70, 면화 55 우선 → 식량 10 + 가정·생태계 5 = 15.
 * 면화 60→55(−5), 나머지 40→15(−25). 칸 하나가 물 1이다(설명용 단위).
 */
const USES = [
  { mark: "면", name: "면화", color: "#2563eb" },
  { mark: "식", name: "식량작물", color: "#16a34a" },
  { mark: "생", name: "가정·생태계", color: "#0f766e" },
] as const;

type Amounts = readonly number[];
type Use = (typeof USES)[number];
const USE_LIST: readonly Use[] = USES;

const BASE: Amounts = [60, 25, 15];
const DRY: Amounts = [55, 10, 5];

const SCENES = [
  { label: "기준 장부", summary: "60 + 25 + 15 = 100", total: 100, amounts: BASE, compare: false, note: "칸 하나가 물 1입니다. 강과 저수지에서 쓸 수 있는 물 100을 면화 60, 식량작물 25, 가정과 생태계 15로 나눈 설명용 가정이며 실제 유역 배분표가 아닙니다." },
  { label: "총량이 70으로 줄어듭니다", summary: "100 → 70", total: 70, amounts: null, compare: false, note: "가뭄과 상류 사용을 합쳐 쓸 수 있는 물이 70이 됐다고 가정합니다. 점선 칸 30은 사라진 물입니다. 아직 누구 몫에서 줄일지는 정하지 않았습니다." },
  { label: "면화에 55를 먼저 줍니다", summary: "70 − 55 = 15", total: 70, amounts: [55, 0, 0] as Amounts, compare: false, note: "생산 목표를 지키려고 면화 할당을 55로 유지합니다. 면화는 5만 줄었고, 나머지 사용자에게 남은 물은 15뿐입니다." },
  { label: "남은 15를 나눕니다", summary: "10 + 5 = 15", total: 70, amounts: DRY, compare: false, note: "남은 15를 식량 10과 가정·생태계 5로 나눕니다. 처음 장부의 식량 25, 가정·생태계 15와 비교해 보세요." },
  { label: "누가 줄어든 30을 떠안았나", summary: "면화 −5 · 나머지 −25", total: 70, amounts: DRY, compare: true, note: "사라진 30 가운데 면화가 떠안은 것은 5이고, 식량과 가정·생태계가 25를 떠안았습니다. 나머지 몫은 40에서 15로 줄었습니다. 실제 물은 품질과 시점이 달라 이렇게 칸처럼 완전히 바꿔 쓸 수는 없습니다." },
] as const;

const COLS = 20;
const ROWS = 5;
const CELL = 18;
const GAP = 2;

function cellOwner(index: number, total: number, amounts: Amounts | null) {
  if (index >= total) return "gone" as const;
  if (amounts === null) return "pool" as const;
  const owner = amounts.reduce<number>((found, amount, useIndex) => {
    if (found !== -1) return found;
    const start = amounts.slice(0, useIndex).reduce<number>((sum, value) => sum + value, 0);
    return index < start + amount ? useIndex : -1;
  }, -1);
  return owner === -1 ? ("pool" as const) : owner;
}

export default function WaterPriorityCellsViz() {
  return (
    <SceneShell
      eyebrow="물 장부"
      title="물이 30 줄 때 면화는 5만, 나머지는 25를 잃습니다"
      description="칸 하나가 설명용 물 1입니다. 칸 안 글자는 아래 목록 왼쪽 표시와 같습니다. 숫자는 모두 1·3절의 가정입니다."
      ariaLabel="물 100에서 70으로 줄 때 면화 우선 할당이 식량과 가정·생태계 몫에 주는 충격"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const amounts = scene.amounts;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${COLS * CELL + (COLS - 1) * GAP} ${ROWS * CELL + (ROWS - 1) * GAP}`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {Array.from({ length: COLS * ROWS }, (_, index) => {
                const owner = cellOwner(index, scene.total, amounts);
                const x = (index % COLS) * (CELL + GAP);
                const y = Math.floor(index / COLS) * (CELL + GAP);
                const use = typeof owner === "number" ? USE_LIST[owner] : null;
                const color = use ? use.color : owner === "gone" ? "#dc2626" : "#94a3b8";
                return (
                  <g key={index}>
                    <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={3} fill={owner === "gone" ? "none" : color} fillOpacity={use ? 0.22 : 0.1} stroke={color} strokeWidth={1} strokeDasharray={owner === "gone" ? "3 2" : undefined} strokeOpacity={owner === "gone" ? 0.6 : 1} />
                    {use && <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{use.mark}</text>}
                  </g>
                );
              })}
            </svg>
            <ul className="min-w-0 space-y-1 text-sm">
              {USES.map((use, useIndex) => {
                const before = BASE[useIndex];
                const now = amounts === null ? null : amounts[useIndex];
                return (
                  <li key={use.name} className="grid grid-cols-[1.25rem_minmax(0,1fr)_2.25rem_1rem_2.25rem_3rem] items-center gap-1 sm:gap-2">
                    <span className="text-center text-xs font-bold" style={{ color: use.color }}>{use.mark}</span>
                    <span className="leading-5">{use.name}</span>
                    <span className="text-right font-mono text-muted-foreground">{before}</span>
                    <span className="text-center text-muted-foreground">→</span>
                    <span className="text-right font-mono font-bold">{active === 0 ? before : now === null || (active === 2 && useIndex > 0) ? "?" : now}</span>
                    <span className={`text-right font-mono text-xs font-bold text-red-700 dark:text-red-400 ${scene.compare ? "" : "invisible"}`}>−{before - (now ?? before)}</span>
                  </li>
                );
              })}
              <li className="grid grid-cols-[1.25rem_minmax(0,1fr)_2.25rem_1rem_2.25rem_3rem] items-center gap-1 border-t border-border/70 pt-1 sm:gap-2">
                <span className="text-center text-xs font-bold text-muted-foreground">합</span>
                <span className="leading-5">총량</span>
                <span className="text-right font-mono text-muted-foreground">100</span>
                <span className="text-center text-muted-foreground">→</span>
                <span className="text-right font-mono font-bold">{scene.total}</span>
                <span className={`text-right font-mono text-xs font-bold text-red-700 dark:text-red-400 ${active === 0 ? "invisible" : ""}`}>−{100 - scene.total}</span>
              </li>
            </ul>
          </div>
        );
      }}
    />
  );
}
