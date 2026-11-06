import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 18·10·6·6개 네 블록, A의 14·2·2·2개, 목표 14·최대 21.
 * 합계 40 ÷ 4 = 평균 10, A 20/40 = 50%, 첫 블록 14/18 ≈ 77.8%.
 */
const BLOCKS = [
  { total: 18, a: 14 },
  { total: 10, a: 2 },
  { total: 6, a: 2 },
  { total: 6, a: 2 },
] as const;

const TARGET = 14;
const MAX = 21;
const AVERAGE = 10;

const SCENES = [
  { label: "피크 18", summary: "목표보다 4 많고 최대보다 3 적음", note: "첫 블록의 18개는 목표 14를 4개 넘지만 최대 21에는 3개 못 미칩니다. 나머지 세 블록은 목표 아래에 있습니다." },
  { label: "평균 10", summary: "18+10+6+6 = 40, 40÷4 = 10", note: "18개가 든 블록이 있어도 네 블록의 평균은 10개입니다. 피크와 평균은 같은 네 블록에서 동시에 성립합니다." },
  { label: "A의 기간 기여 50%", summary: "14+2+2+2 = 20, 20÷40 = 50%", note: "파란 칸이 특정 롤업 A의 게시분입니다. 네 블록 전체를 분모로 놓으면 A 20개, 나머지 20개입니다." },
  { label: "첫 블록만 보면 약 77.8%", summary: "14÷18 ≈ 77.8%", note: "같은 A라도 분모를 첫 블록 18개로 바꾸면 약 77.8%입니다. 기간 전체의 50%와 다른 질문에 답하는 수이므로 섞어 쓰지 않습니다." },
] as const;

const W = 360;
const CELL_H = 7;
const CELL_GAP = 2;
const STEP = CELL_H + CELL_GAP;
const TOP = 24;
const BASE = TOP + MAX * STEP;
const H = BASE + 24;
const COL_W = 56;
const COL_GAP = 12;
const LEFT = 44;
const colX = (index: number) => LEFT + index * (COL_W + COL_GAP);
const lineY = (count: number) => BASE - count * STEP + CELL_GAP / 2;

function cellFill(scene: number, block: (typeof BLOCKS)[number], cell: number) {
  if (cell >= block.total) return "none";
  if (scene >= 2) return cell < block.a ? "#2563eb" : "#94a3b8";
  if (scene === 0 && cell >= TARGET) return "#d97706";
  return "#64748b";
}

const LEGENDS = [
  [["#64748b", "목표 안의 blob"], ["#d97706", "목표를 넘은 4개"]],
  [["#64748b", "블록에 든 blob"]],
  [["#2563eb", "A 20개"], ["#94a3b8", "나머지 20개"], ["", "아래 숫자: A / 전체"]],
  [["#2563eb", "A 14개"], ["#94a3b8", "나머지 4개"], ["", "아래 숫자: A / 전체"]],
] as const;

export default function BlobSlotsViz() {
  return (
    <SceneShell
      eyebrow="네 블록의 칸"
      title="피크 18, 평균 10, 기여 50%를 같은 칸에서 셉니다"
      description="칸 하나가 blob 1개입니다(blob: 롤업이 Ethereum에 올리는 자료 덩어리). 목표 14는 비용 조정이 기준으로 삼는 양, 최대 21은 한 블록에 담을 수 있는 상한입니다. 블록별 개수와 A의 몫은 모두 가정입니다."
      ariaLabel="네 블록의 blob 칸으로 피크, 평균, 특정 롤업의 기간 기여와 첫 블록 비율을 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {BLOCKS.map((block, index) => (
              <g key={index} opacity={active === 3 && index > 0 ? 0.25 : 1}>
                {Array.from({ length: MAX }, (_, cell) => (
                  <rect
                    key={cell}
                    x={colX(index)}
                    y={BASE - (cell + 1) * STEP + CELL_GAP}
                    width={COL_W}
                    height={CELL_H}
                    rx={1.5}
                    fill={cellFill(active, block, cell)}
                    stroke={cell < block.total ? "none" : "#94a3b8"}
                    strokeWidth={0.75}
                    strokeOpacity={0.5}
                  />
                ))}
                <text x={colX(index) + COL_W / 2} y={BASE + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">
                  {active >= 2 ? `${block.a} / ${block.total}` : `${block.total}개`}
                </text>
              </g>
            ))}
            {[{ count: MAX, label: "최대 21" }, { count: TARGET, label: "목표 14" }].map(({ count, label }) => (
              <g key={label}>
                <line x1={LEFT - 4} x2={colX(3) + COL_W + 4} y1={lineY(count)} y2={lineY(count)} stroke="#64748b" strokeWidth={1} />
                <text x={LEFT - 6} y={lineY(count) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">{label.split(" ")[0]}</text>
                <text x={LEFT - 6} y={lineY(count) + 16} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">{label.split(" ")[1]}</text>
              </g>
            ))}
            {active === 1 && (
              <g>
                <line x1={LEFT - 4} x2={colX(3) + COL_W + 4} y1={lineY(AVERAGE)} y2={lineY(AVERAGE)} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="5 3" />
                <rect x={colX(3) - 2} y={lineY(AVERAGE) - 16} width={COL_W + 6} height={14} rx={2} fill="#2563eb" />
                <text x={colX(3) + COL_W / 2 + 1} y={lineY(AVERAGE) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">평균 10</text>
              </g>
            )}
          </svg>
          <StableSceneStack
            active={active}
            className="mt-2"
            scenes={LEGENDS.map((legend, index) => (
              <ul key={index} className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {legend.map(([color, label]) => (
                  <li key={label} className="flex items-center gap-1.5">
                    {color && <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />}
                    {label}
                  </li>
                ))}
              </ul>
            ))}
          />
        </div>
      )}
    />
  );
}
