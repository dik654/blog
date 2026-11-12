import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sink-variants — RSWAManager 예: prompt 100, block 16, 창 64, 계산 500 → block 7~26(20개) 반환.
 * block k는 token 16k ~ 16k + 15를 담는다. 계산한 500개는 block 0~31.
 * prompt 0~99는 block 0~6에 걸친다(block 6 = 96~111).
 * 다음 token(500번)의 창은 437~500번이라 건너뛸 token은 500 − 64 + 1 = 437, 창 안 block은 27~31.
 * 3절 규칙만 쓰는 창 층이면 ⌊437 ÷ 16⌋ = 27개(0~26)를 반환한다(계산).
 */
const BLOCK = 16;
const COMPUTED = 500;
const PROMPT = 100;
const WINDOW = 64;
const SKIPPED = COMPUTED - WINDOW + 1; // 437
const TOTAL_BLOCKS = Math.ceil(COMPUTED / BLOCK); // 32
const PROMPT_BLOCKS = Math.ceil(PROMPT / BLOCK); // 7 → block 0~6
const FREED_SWA = Math.floor(SKIPPED / BLOCK); // 27 → block 0~26

type Kind = "prompt" | "middle" | "window";

const kindOf = (block: number): Kind => (block < PROMPT_BLOCKS ? "prompt" : block < FREED_SWA ? "middle" : "window");

const SCENES = [
  {
    label: "500 token이 놓인 자리",
    summary: "block 0~31",
    note: "block 하나에 token 16개라 계산한 500개는 block 0~31에 들어갑니다. prompt 100개는 block 0~6에 걸칩니다(block 6이 96~111번이라 prompt 끝 99번이 여기 있습니다). 다음 token 500번의 창 64개는 437~500번이라 이미 계산한 창 안 token은 block 27~31에 있습니다.",
  },
  {
    label: "창만 남기는 층이라면",
    summary: "27개 반환 · 5개 보유",
    note: "3절 규칙대로 건너뛸 token 500 − 64 + 1 = 437개를 block으로 내리면 ⌊437 ÷ 16⌋ = 27개, 곧 block 0~26을 돌려줍니다(계산). prompt가 든 block 0~6도 함께 사라집니다.",
  },
  {
    label: "R-SWA 관리자",
    summary: "7~26번 20개 반환 · 12개 보유",
    note: "RSWAManager는 prompt가 걸친 block 0~6을 남기고, prompt 끝과 현재 decode 창 사이의 block 7~26, 20개만 돌려줍니다. 앞을 남기고 가운데를 비우는 모양은 sink + 창과 닮았지만 남는 앞부분이 처음 몇 token이 아니라 prompt 전체입니다.",
  },
] as const;

const W = 360;
const LEFT = 44;
const CELL = (W - LEFT - 4) / TOTAL_BLOCKS;
const ROW_H = 22;
const ROWS = [
  { y: 30, title: "내용" },
  { y: 66, title: "창 층" },
  { y: 108, title: "R-SWA" },
] as const;
const H = 150;

const FILL: Record<Kind, string> = { prompt: "#d97706", middle: "#94a3b8", window: "#2563eb" };

const bx = (block: number) => LEFT + block * CELL;

export default function MiddleBlockReleaseViz() {
  return (
    <SceneShell
      eyebrow="가운데만 돌려주기"
      title="R-SWA 관리자는 prompt와 창을 남기고 그 사이 block만 돌려줍니다"
      description="칸 하나가 token 16개를 담는 block 하나이고, 11절의 예(prompt 100, 창 64, 계산 500)를 씁니다. 맨 윗줄에 이름을 적은 대로 주황은 prompt가 든 block, 파랑은 다음 token의 창이 닿는 block, 회색은 그 사이 block입니다. 점선 빈 칸은 돌려준 block입니다. R-SWA 관리자는 vLLM의 RSWAManager입니다."
      ariaLabel="token 500개를 계산한 요청에서 창 층과 R-SWA 관리자가 쥐는 block 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[34rem]" role="img" aria-label={SCENES[active].summary}>
          {[0, PROMPT_BLOCKS, FREED_SWA, TOTAL_BLOCKS - 1].map((block) => (
            <text key={`n${block}`} x={bx(block) + CELL / 2} y={20} fontSize={10} textAnchor="middle" fill="#64748b">
              {block}
            </text>
          ))}
          <text x={0} y={20} fontSize={10} fill="#64748b">block</text>
          {ROWS.map((row, rowIndex) => {
            const visible = rowIndex === 0 || rowIndex <= active;
            const held = (block: number) =>
              rowIndex === 0 ? true : rowIndex === 1 ? block >= FREED_SWA : kindOf(block) !== "middle";
            const keptCount = Array.from({ length: TOTAL_BLOCKS }, (_, block) => block).filter(held).length;
            return (
              <g key={row.title} opacity={visible ? 1 : 0.25}>
                <text x={0} y={row.y + 15} fontSize={11} fontWeight={700} fill="currentColor">{row.title}</text>
                {Array.from({ length: TOTAL_BLOCKS }, (_, block) => {
                  const kind = kindOf(block);
                  const keep = !visible || held(block);
                  return (
                    <rect
                      key={block}
                      x={bx(block) + 0.75}
                      y={row.y}
                      width={CELL - 1.5}
                      height={ROW_H}
                      rx={1.5}
                      fill={keep ? FILL[kind] : "none"}
                      fillOpacity={keep ? (visible ? 0.8 : 0.4) : 0}
                      stroke={keep ? "none" : "#94a3b8"}
                      strokeWidth={0.75}
                      strokeDasharray={keep ? undefined : "2 2"}
                    />
                  );
                })}
                {rowIndex === 0
                  ? ([
                      ["prompt", 0, PROMPT_BLOCKS],
                      ["가운데", PROMPT_BLOCKS, FREED_SWA],
                      ["창", FREED_SWA, TOTAL_BLOCKS],
                    ] as const).map(([name, from, to]) => (
                      <text key={name} x={(bx(from) + bx(to)) / 2} y={row.y + 15} fontSize={10} fontWeight={700} textAnchor="middle" fill={name === "가운데" ? "#0f172a" : "#ffffff"}>
                        {name}
                      </text>
                    ))
                  : null}
                {rowIndex > 0 && visible ? (
                  <text x={LEFT} y={row.y + ROW_H + 12} fontSize={10} fill="#64748b">
                    {`보유 ${keptCount}개 · 반환 ${TOTAL_BLOCKS - keptCount}개`}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
