import SceneShell from "./SceneShell";

/**
 * 본문 대응: #top-k-depth — 후보 100개 중 정답이 융합 순위 3·7·45·92에 있을 때.
 * k2=10 → 상한 2, k2=50(가정) → 상한 3, k2=100 → 상한 4.
 */
const ANSWERS = [3, 7, 45, 92] as const;
const CELLS = Array.from({ length: 100 }, (_, index) => index + 1);
const COLS = 20;
const SIZE = 16;
const STEP = 18;
const ROWS = CELLS.length / COLS;

const SCENES = [
  { label: "후보 100개, 정답 4개", k2: 0, summary: "후보 안 정답 4개", note: "첫 검색이 후보로 인정한 k1=100개입니다. 칸의 순서는 RRF 같은 융합이 정한 순위이고, 정답은 3·7·45·92위에 있다고 놓습니다." },
  { label: "재정렬 창 k2=10", k2: 10, summary: "상한 4 → 2", note: "흔한 조합처럼 상위 10개만 재정렬기에 넣으면 3위와 7위만 창 안에 듭니다. 45위와 92위 정답은 재정렬기가 아무리 정확해도 볼 기회를 얻지 못합니다." },
  { label: "창을 k2=50으로 (가정)", k2: 50, summary: "상한 3", note: "창을 넓히면 45위가 들어와 상한이 3으로 오릅니다. 92위는 여전히 창 밖입니다." },
  { label: "창을 k2=k1=100으로", k2: 100, summary: "상한 4", note: "창이 후보 전체와 같아지면 상한은 후보 안의 정답 수 4와 같아집니다. 대신 재정렬 비용은 늘어납니다." },
] as const;

export default function RerankDepthViz() {
  return (
    <SceneShell
      eyebrow="두 개의 깊이"
      title="재정렬 창을 좁히면 정답 상한이 한 번 더 줄어들 수 있습니다"
      description="칸 하나가 후보 문서 하나이고 왼쪽 위가 1위입니다. 숫자 칸이 정답, 파란 칸이 재정렬기가 읽는 창입니다. 정답이 모두 창 안에 있으면 상한은 줄지 않습니다."
      ariaLabel="후보 100개 중 재정렬 창의 크기에 따라 달라지는 정답 상한"
      scenes={SCENES}
      render={(active) => {
        const { k2 } = SCENES[active];
        const inside = ANSWERS.filter((rank) => rank <= k2).length;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${COLS * STEP - 2} ${ROWS * STEP - 2}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {CELLS.map((rank) => {
                const col = (rank - 1) % COLS;
                const row = Math.floor((rank - 1) / COLS);
                const isAnswer = (ANSWERS as readonly number[]).includes(rank);
                const inWindow = rank <= k2;
                const fill = isAnswer ? (inWindow ? "#2563eb" : k2 === 0 ? "#475569" : "#ffffff") : inWindow ? "#bfdbfe" : "#e2e8f0";
                const stroke = isAnswer && !inWindow && k2 > 0 ? "#dc2626" : "none";
                const textFill = isAnswer && !inWindow && k2 > 0 ? "#dc2626" : "#ffffff";
                return (
                  <g key={rank}>
                    <rect x={col * STEP + 0.5} y={row * STEP + 0.5} width={SIZE - 1} height={SIZE - 1} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
                    {isAnswer && (
                      <text x={col * STEP + SIZE / 2} y={row * STEP + 11.5} textAnchor="middle" fontSize={9} fontWeight={700} fill={textFill}>{rank}</text>
                    )}
                  </g>
                );
              })}
            </svg>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border bg-background px-1 py-2">
                <dt className="text-muted-foreground">첫 검색 k1</dt>
                <dd className="mt-1 font-mono text-sm font-bold">100</dd>
              </div>
              <div className="rounded-lg border border-border bg-background px-1 py-2">
                <dt className="text-muted-foreground">재정렬 k2</dt>
                <dd className="mt-1 font-mono text-sm font-bold">{k2 === 0 ? "−" : k2}</dd>
              </div>
              <div className="rounded-lg border border-primary bg-background px-1 py-2">
                <dt className="text-muted-foreground">남길 수 있는 정답</dt>
                <dd className="mt-1 font-mono text-sm font-bold text-primary">{k2 === 0 ? "4" : inside} / 4</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
