import SceneShell from "./SceneShell";

/**
 * 본문 대응: #configuration — 23개의 "3 KDA + 1 MLA" block 뒤에 마지막 MLA 하나.
 * KDA = 23×3 = 69, MLA = 23×1+1 = 24, main layer = 69+24 = 93.
 * 칸 하나가 main layer 하나이고, 네 칸 묶음이 hybrid block 하나다.
 */
const BLOCKS = 23;
const PER_ROW = 6;
const CELL_W = 11;
const CELL_H = 22;
const CELL_GAP = 1;
const BLOCK_W = 4 * CELL_W + 3 * CELL_GAP;
const BLOCK_GAP = 10;
const LEFT = 14;
const TOP = 8;
const ROW_H = 42;
const W = 360;
const H = TOP + 4 * ROW_H;

const KDA_FILL = "#0e7490";
const MLA_FILL = "#1d4ed8";
const FAINT = "#cbd5e1";

const blockX = (block: number) => LEFT + (block % PER_ROW) * (BLOCK_W + BLOCK_GAP);
const blockY = (block: number) => TOP + Math.floor(block / PER_ROW) * ROW_H;

const SCENES = [
  {
    label: "block 하나",
    summary: "KDA 3 + MLA 1 = 4층",
    note: "hybrid block 하나는 KDA 세 층 뒤에 MLA 한 층이 오는 네 층 묶음입니다. KDA는 고정 recurrent state를 갱신하고, MLA는 지난 token 기록을 직접 조회합니다.",
  },
  {
    label: "23번 반복",
    summary: "23 × 4 = 92층",
    note: "같은 네 층 묶음을 23번 쌓으면 92층입니다. block이 23개라는 뜻이지 93개 block이 있다는 뜻이 아닙니다.",
  },
  {
    label: "마지막 MLA",
    summary: "92 + 1 = 93층",
    note: "block 밖에 MLA 한 층이 하나 더 붙습니다. 그래서 main layer 합계가 93입니다. Embedding과 output head는 이 93에 넣지 않습니다.",
  },
  {
    label: "종류별로 세기",
    summary: "KDA 69 · MLA 24",
    note: "KDA는 23×3 = 69층, MLA는 block 안 23층에 마지막 1층을 더한 24층입니다. 문맥 길이에 따라 KV cache(지난 token마다 남기는 조회용 기록)가 늘어나는 global MLA 경로가 이 24층입니다.",
  },
] as const;

export default function LayerStackViz() {
  return (
    <SceneShell
      eyebrow="93층의 배치"
      title="93개 main layer는 23개 block과 마지막 MLA 하나로 쌓입니다"
      description="칸 하나가 main layer 하나입니다. K는 KDA, M은 MLA이며 칸 아래 숫자는 block 번호입니다. 공개 configuration의 개수만 셉니다."
      ariaLabel="KDA 세 층과 MLA 한 층으로 된 block 23개와 마지막 MLA 한 층의 배치"
      scenes={SCENES}
      render={(active) => {
        const blockOn = (block: number) => (active === 0 ? block === 0 : true);
        const finalOn = active >= 2;
        const finalIndex = BLOCKS;
        const fx = blockX(finalIndex);
        const fy = blockY(finalIndex);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {Array.from({ length: BLOCKS }, (_, block) => {
                const x = blockX(block);
                const y = blockY(block);
                const on = blockOn(block);
                return (
                  <g key={block}>
                    {[0, 1, 2, 3].map((slot) => {
                      const isMla = slot === 3;
                      const dimKda = active === 3 && !isMla;
                      const fill = !on ? FAINT : isMla ? MLA_FILL : KDA_FILL;
                      return (
                        <g key={slot}>
                          <rect
                            x={x + slot * (CELL_W + CELL_GAP)}
                            y={y}
                            width={CELL_W}
                            height={CELL_H}
                            rx={1.5}
                            fill={fill}
                            opacity={dimKda ? 0.45 : 1}
                          />
                          <text x={x + slot * (CELL_W + CELL_GAP) + CELL_W / 2} y={y + 14.5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">
                            {isMla ? "M" : "K"}
                          </text>
                        </g>
                      );
                    })}
                    <text x={x + BLOCK_W / 2} y={y + CELL_H + 12} textAnchor="middle" fontSize={10} fill={on ? "#475569" : "#94a3b8"}>
                      {block + 1}
                    </text>
                  </g>
                );
              })}
              <rect x={fx} y={fy} width={CELL_W} height={CELL_H} rx={1.5} fill={finalOn ? MLA_FILL : FAINT} />
              <text x={fx + CELL_W / 2} y={fy + 14.5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">M</text>
              {active === 2 && (
                <rect x={fx - 3} y={fy - 3} width={CELL_W + 6} height={CELL_H + 6} rx={3} fill="none" stroke="#1d4ed8" strokeWidth={1.25} />
              )}
              <text x={fx} y={fy + CELL_H + 12} fontSize={9} fontWeight={700} fill={finalOn ? "#1d4ed8" : "#94a3b8"}>
                마지막 MLA
              </text>
            </svg>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: KDA_FILL }} />K = KDA (고정 state 갱신)
              </span>
              <span className="inline-flex items-center gap-2">
                <span aria-hidden className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: MLA_FILL }} />M = MLA (token 기록 직접 조회)
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
