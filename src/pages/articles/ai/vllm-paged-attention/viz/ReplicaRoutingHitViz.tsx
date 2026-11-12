import PagedSceneShell from "./PagedSceneShell";

/**
 * 본문 대응: #cache-locality 둘째 문단(가정) — 길이 35인 같은 입력 10개를 하나씩 순서대로 보내고,
 * 복제본마다 첫 요청만 miss, 이후는 캐시가 남는다고 둔다.
 * 1개: 9/10, 2개 번갈아: 8/10, 8개 순환: 2/10.
 */
const REQUESTS = 10;

const SCENES = [
  { label: "복제본 1개", replicas: 1, summary: "request hit 9/10", note: "모든 요청이 같은 복제본으로 갑니다. 첫 요청만 miss하고 나머지 9개는 남아 있는 캐시를 hit합니다." },
  { label: "복제본 2개 · 번갈아", replicas: 2, summary: "request hit 8/10", note: "홀수 번째는 1번, 짝수 번째는 2번 복제본으로 갑니다. 두 복제본이 각자 첫 요청에서 한 번씩 miss해 8/10입니다." },
  { label: "복제본 8개 · 순환", replicas: 8, summary: "request hit 2/10", note: "앞의 8개 요청이 각 복제본의 첫 요청이라 모두 miss입니다. 9·10번째만 1·2번 복제본으로 돌아와 hit합니다. 동시에 들어온 요청이나 eviction이 있으면 이 숫자는 달라집니다." },
] as const;

export default function ReplicaRoutingHitViz() {
  return (
    <PagedSceneShell
      eyebrow="Replica와 cache locality"
      title="같은 입력 10개도 복제본을 몇 개로 나눠 보내느냐에 따라 hit 수가 달라집니다"
      description="가로는 요청이 도착한 순서, 세로는 복제본(같은 모델을 따로 띄운 사본)입니다. 칸마다 그 요청이 간 복제본에서 hit인지 miss인지 표시했습니다. 15절의 순차 처리 가정을 그대로 씁니다."
      ariaLabel="복제본 수 1, 2, 8개에서 10개 요청의 hit와 miss"
      scenes={SCENES}
      render={(active) => {
        const replicas = SCENES[active].replicas;
        const rows = Array.from({ length: 8 }, (_, row) => row);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[2.25rem_repeat(10,minmax(0,1fr))] gap-1 text-center text-[10px] sm:text-[11px]">
              <span />
              {Array.from({ length: REQUESTS }, (_, index) => <span key={index} className="font-mono text-muted-foreground">{index + 1}</span>)}
              {rows.map((row) => (
                <div key={row} className="contents">
                  <span className={`self-center text-right font-mono ${row < replicas ? "text-foreground" : "text-muted-foreground/40"}`}>R{row + 1}</span>
                  {Array.from({ length: REQUESTS }, (_, index) => {
                    const target = index % replicas;
                    if (row >= replicas || target !== row) {
                      return <span key={index} className={`h-5 rounded-sm border ${row < replicas ? "border-border/60" : "border-dashed border-border/30"}`} />;
                    }
                    const hit = index >= replicas;
                    return (
                      <span key={index} className={`flex h-5 items-center justify-center rounded-sm border font-mono font-bold ${hit ? "border-blue-600 bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-400 bg-background text-muted-foreground"}`}>
                        {hit ? "H" : "M"}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">H = hit · M = miss(그 복제본의 첫 요청) · 점선 줄 = 이 장면에서 쓰지 않는 복제본</p>
          </div>
        );
      }}
    />
  );
}
