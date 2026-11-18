import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 게시물 100개 → 추천 후보 20 → 실제 노출 5 (가정). 칸 하나가 게시물 하나다.
 * 20 / 100 = 20%, 5 / 20 = 25%, 5 / 100 = 5%.
 * 클릭: 한 글 40, 나머지 네 글 합 20 → 40 / 60 ≈ 67%. 네 글 각각의 클릭은 글에 없어 나누지 않는다.
 * 어느 칸이 후보·노출이 되는지는 임의다(가정).
 */
const POST = "#2563eb";
const OUT = "#94a3b8";
const SHOWN = "#16a34a";
const HOT = "#d97706";

const COLS = 20;
const ROWS = 5;
const CELL = 18;
const GAP = 2;

/** 설명용으로 고른 후보 20칸과 노출 5칸의 위치(가정). */
const CANDIDATES = [2, 7, 11, 16, 19, 23, 28, 34, 38, 41, 46, 52, 55, 60, 64, 71, 77, 83, 88, 95] as const;
const SHOWN_CELLS = [7, 28, 46, 64, 83] as const;
const HOT_CELL = 46;

const SCENES = [
  { label: "한 시간에 100개가 올라옵니다", summary: "발행 100", stage: 0, note: "칸 하나가 관련 게시물 하나입니다. 한 시간에 100개가 올라왔다고 놓은 설명용 가정이며, 특정 플랫폼의 실제 비율이 아닙니다." },
  { label: "추천 후보로 거릅니다", summary: "100 → 20 (20%)", stage: 1, note: "언어·관심 주제·차단 설정을 거쳐 20개가 한 이용자의 추천 후보가 됩니다. 나머지 80개는 발행됐지만 이 이용자의 후보에서 빠집니다. 어느 칸이 남는지는 임의로 골랐습니다(가정)." },
  { label: "화면에 실제로 보입니다", summary: "20 → 5 (25%)", stage: 2, note: "화면 공간과 순위 때문에 후보 20개 가운데 5개만 실제로 보입니다. 파란 점선 15칸은 후보였지만 화면에서 밀린 글입니다. 발행된 100개로 따지면 5%이고, 그 사이에 후보 선별과 화면 순위라는 두 선택 단계가 끼었습니다." },
  { label: "다섯 글의 클릭을 나눠 봅니다", summary: "40 : 20 → 약 67%", stage: 3, note: "자극적인 한 글이 클릭 40을 받고 나머지 네 글 합이 20이면, 클릭 60 가운데 40 ÷ 60 ≈ 67%가 한 글에 몰립니다. 다음 추천에서 그 글의 비중이 커질 수 있지만 신고·품질 신호·다양성 규칙이 순위를 낮추기도 합니다." },
] as const;

/** "unseen" = 후보 20에는 들었지만 화면 순위에서 밀린 15개. 1단계 탈락 80개("out")와 구분한다. */
function cellKind(index: number, stage: number): "post" | "out" | "cand" | "unseen" | "shown" | "hot" {
  if (stage === 0) return "post";
  const isCand = (CANDIDATES as readonly number[]).includes(index);
  if (!isCand) return "out";
  if (stage === 1) return "cand";
  const isShown = (SHOWN_CELLS as readonly number[]).includes(index);
  if (!isShown) return "unseen";
  return stage === 3 && index === HOT_CELL ? "hot" : "shown";
}

const COLOR = { post: POST, out: OUT, cand: POST, unseen: POST, shown: SHOWN, hot: HOT } as const;

export default function ExposureFunnelViz() {
  return (
    <SceneShell
      eyebrow="노출 경로 (가정)"
      title="게시물 100개가 화면의 5개가 되기까지 칸으로 거릅니다"
      description="칸 하나가 게시물 하나입니다. 숫자는 3절의 설명용 가정이고, 칸의 위치에는 뜻이 없습니다."
      ariaLabel="게시물 100개가 추천 후보 20개, 실제 노출 5개로 줄고, 다섯 글 가운데 한 글이 클릭 40을 받는 과정"
      scenes={SCENES}
      render={(active) => {
        const stage = SCENES[active].stage;
        const kinds = Array.from({ length: COLS * ROWS }, (_, index) => cellKind(index, stage));
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${COLS * CELL + (COLS - 1) * GAP} ${ROWS * CELL + (ROWS - 1) * GAP}`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {kinds.map((kind, index) => {
                const x = (index % COLS) * (CELL + GAP);
                const y = Math.floor(index / COLS) * (CELL + GAP);
                const color = COLOR[kind];
                return (
                  <g key={index}>
                    <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={3} fill={color} fillOpacity={kind === "out" ? 0.04 : kind === "unseen" ? 0 : 0.24} stroke={color} strokeOpacity={kind === "out" ? 0.35 : 1} strokeWidth={1} strokeDasharray={kind === "out" || kind === "unseen" ? "3 2" : undefined} />
                    {kind === "hot" && <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="currentColor">40</text>}
                  </g>
                );
              })}
            </svg>
            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
              {[
                { name: "발행", value: 100, on: stage === 0 },
                { name: "추천 후보", value: 20, on: stage === 1 },
                { name: "실제 노출", value: 5, on: stage >= 2 },
              ].map((step) => (
                <div key={step.name} className={`rounded-lg border px-2 py-1.5 ${step.on ? "border-primary/60 font-semibold" : "border-border/60 text-muted-foreground"}`}>
                  <span className="block">{step.name}</span>
                  <span className="block font-mono font-bold">{step.value}</span>
                </div>
              ))}
            </div>
            <div className={`space-y-1 ${stage === 3 ? "" : "opacity-30"}`} aria-hidden={stage !== 3}>
              <div className="flex h-5 w-full overflow-hidden rounded-sm border border-border/60 text-[11px] font-bold leading-5">
                <div className="text-center" style={{ width: `${(40 / 60) * 100}%`, backgroundColor: "#d977063d" }}>한 글 40</div>
                <div className="text-center" style={{ width: `${(20 / 60) * 100}%`, backgroundColor: "#16a34a2e" }}>네 글 합 20</div>
              </div>
              <p className="text-xs text-muted-foreground">다섯 글의 클릭 60 = 40 + 20</p>
            </div>
          </div>
        );
      }}
    />
  );
}
