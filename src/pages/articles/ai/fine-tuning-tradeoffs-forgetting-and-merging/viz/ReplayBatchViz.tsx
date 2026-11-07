import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mitigation — domain 배치에 general 데이터를 10% 섞으면 7%p 하락(68→61)이 2%p로 줄어드는 예.
 * 66%는 68−2 계산이다. 100칸은 비율을 세기 위한 칸이며 실제 배치 크기가 아니다(가정).
 */
const BEFORE = 68;
const CELLS = 100;

const SCENES = [
  { label: "새 domain 데이터만", summary: `${BEFORE}% → 61% · 7%p 하락`, replay: 0, after: 61, note: "배치가 전부 새 목표 쪽이면 모델은 옛 분포를 보지 않습니다. 앞의 법률 fine-tuning 예에서 일반 상식 benchmark는 68%에서 61%로 내려갔습니다." },
  { label: "general 10%를 섞으면", summary: `${BEFORE}% → 66% · 2%p 하락`, replay: 10, after: 66, note: "domain 90%에 원래 general 데이터 10%를 섞으면 하락이 2%p까지 줄어드는 식으로 보고되는 예입니다. 66%는 68−2입니다. 원본 replay 데이터를 보관·재사용할 권리가 있어야 합니다." },
] as const;

function Score({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-5 min-w-0 border border-border bg-background">
        <div className={`h-full ${strong ? "bg-primary/60" : "bg-muted-foreground/30"}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value}%</span>
    </div>
  );
}

export default function ReplayBatchViz() {
  return (
    <SceneShell
      eyebrow="Data replay"
      title="배치에 옛 분포를 섞으면 일반 능력의 하락폭이 줄어드는 예"
      description="왼쪽은 한 번에 학습하는 묶음(배치)의 구성 비율이고, 칸 100개는 비율을 세기 위한 것입니다(가정). 오른쪽은 일반 상식 benchmark 점수를 0~100% 같은 축에 그린 것입니다."
      ariaLabel="replay 비율에 따른 배치 구성과 benchmark 점수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid items-center gap-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
            <div>
              <div className="mx-auto grid max-w-44 grid-cols-10 gap-[2px]" aria-label={`domain ${CELLS - scene.replay}칸, general ${scene.replay}칸`}>
                {Array.from({ length: CELLS }, (_, cell) => {
                  const replay = cell >= CELLS - scene.replay;
                  return <span key={cell} className={`flex aspect-square items-center justify-center border text-[8px] leading-none ${replay ? "border-amber-600 bg-amber-500/30" : "border-border bg-muted-foreground/15"}`}>{replay ? "G" : ""}</span>;
                })}
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">회색 domain {CELLS - scene.replay} · G general {scene.replay}</p>
            </div>
            <div className="space-y-2">
              <Score label="학습 전" value={BEFORE} />
              <Score label="학습 후" value={scene.after} strong />
            </div>
          </div>
        );
      }}
    />
  );
}
