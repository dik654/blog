import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ranking-evaluation MRR 예시 — 첫 정답 순위 2, 1, top-k 안에 없음.
 * 기여 1/2, 1, 0 → (0.5 + 1 + 0) / 3 = 0.5. k=5는 칸을 그리기 위한 가정입니다.
 */
const QUERIES = [
  { name: "질의 1", first: 2, label: "1/2", value: 0.5 },
  { name: "질의 2", first: 1, label: "1/1", value: 1 },
  { name: "질의 3", first: null, label: "0", value: 0 },
] as const;
const K = 5;
const SLOTS = Array.from({ length: K }, (_, index) => index + 1);
const SUM = QUERIES.reduce<number>((total, query) => total + query.value, 0);
const MRR = SUM / QUERIES.length;

const SCENES = [
  { label: "질의 1", summary: "첫 정답 2위 → 1/2", note: "1위는 정답이 아니고 2위에서 첫 정답이 나왔습니다. 순위를 뒤집어 1/2을 기여로 둡니다." },
  { label: "질의 2", summary: "첫 정답 1위 → 1", note: "맨 앞이 바로 정답이면 기여는 1입니다. 그 뒤에 정답이 더 있어도 첫 번째만 봅니다." },
  { label: "질의 3", summary: "창 안에 없음 → 0", note: "평가 창 안에서 정답을 못 찾으면 찾지 못한 것으로 처리하고 기여는 0입니다." },
  { label: "질의 수로 나눔", summary: `(0.5 + 1 + 0) / 3 = ${MRR}`, note: "세 기여를 더해 질의 수 3으로 나눕니다. 정답이 앞에 있을수록 1에 가까워집니다." },
] as const;

export default function MrrViz() {
  return (
    <SceneShell
      eyebrow="MRR"
      title="질의마다 첫 정답의 순위를 뒤집어 평균을 냅니다"
      description="한 줄이 질의 하나의 상위 결과이고 칸은 순위입니다. 창 크기 5칸은 그리기 위한 가정입니다."
      ariaLabel="질의 세 개의 첫 정답 순위를 역수로 바꿔 평균 내는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2">
          {QUERIES.map((query, row) => {
            const shown = active >= row;
            return (
              <div key={query.name} className={`grid min-w-0 grid-cols-[3rem_minmax(0,1fr)_2.75rem] items-center gap-2 ${shown ? "" : "opacity-40"}`}>
                <span className={`text-xs font-semibold ${active === row ? "text-primary" : "text-muted-foreground"}`}>{query.name}</span>
                <div className="grid grid-cols-5 gap-1">
                  {SLOTS.map((rank) => {
                    const isFirst = shown && query.first === rank;
                    const before = shown && (query.first === null || rank < query.first);
                    return (
                      <span key={rank} className={`flex h-9 min-w-0 items-center justify-center rounded-md border font-mono text-xs ${isFirst ? "border-primary bg-primary font-bold text-primary-foreground" : before ? "border-border bg-background text-muted-foreground" : "border-dashed border-border/50 text-muted-foreground/50"}`}>
                        {isFirst ? "정답" : before ? "아님" : rank}
                      </span>
                    );
                  })}
                </div>
                <span className="text-right font-mono text-sm font-bold">{shown ? query.label : "?"}</span>
              </div>
            );
          })}
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
            <span className="text-xs font-semibold text-muted-foreground">MRR</span>
            <span className={`font-mono font-bold ${active === SCENES.length - 1 ? "text-primary" : "text-muted-foreground/40"}`}>{active === SCENES.length - 1 ? `${SUM} / ${QUERIES.length} = ${MRR}` : "?"}</span>
          </div>
        </div>
      )}
    />
  );
}
