import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tool-bridge 두 번째 문단 — Bridge는 Connected·발견 목록을 확인한 뒤,
 * 별도 current-thread runtime을 만들고 discovery를 다시 수행하고 tool을 호출한 뒤 manager를 shutdown한다.
 * registry에 보인 장기 연결과 call instance가 같은 generation인지는 측정해야 안다.
 * generation 7은 본문 표의 예시 값이다.
 */
const STEPS = [
  "Connected·발견 목록 확인",
  "Current-thread runtime 생성",
  "Discovery 다시 수행",
  "search 호출",
  "Manager shutdown",
] as const;

const SCENES = [
  { label: "Registry 확인", summary: "docs Connected · search 있음", note: "Bridge는 먼저 registry를 봅니다. docs server가 Connected이고 발견 목록에 search가 있어야 호출로 넘어갑니다." },
  { label: "별도 runtime", summary: "호출마다 새 runtime", note: "Pinned call path는 호출을 위해 별도 current-thread runtime을 만듭니다. Runtime은 비동기 작업을 실행하는 실행기이며, 여기서는 이 호출 하나를 위해 따로 만듭니다." },
  { label: "Discovery 다시", summary: "tool 목록을 다시 받음", note: "이 runtime에서 discovery를 다시 수행합니다. 앞에서 확인한 목록과 이번에 받은 목록이 같은 instance에서 왔는지는 이 경로만으로 정해지지 않습니다." },
  { label: "Tool 호출", summary: "search 실행", note: "다시 발견한 뒤 search를 호출합니다." },
  { label: "Shutdown", summary: "호출 뒤 manager 종료", note: "호출이 끝나면 manager를 shutdown합니다. 매 호출이 discovery와 shutdown을 함께 치르므로 그 비용은 측정해 봐야 압니다." },
  { label: "같은 instance인가", summary: "generation 7 = ?", note: "Generation은 reload 전후의 서로 다른 server process를 구분하는 번호입니다. Registry에 보인 장기 연결(표의 예시: generation 7)과 실제 call instance가 같은 generation인지는 측정해 봐야 알 수 있습니다. 그래서 아래 표처럼 server·instance를 결과와 함께 남깁니다." },
] as const;

export default function BridgeCallPathViz() {
  return (
    <SceneShell
      eyebrow="Bridge call path"
      title="Registry에 보인 연결과 실제로 호출한 instance는 따로 봐야 합니다"
      description="‘Registry에 보인 연결’ 칸은 registry가 보여 주는 docs server, ‘이번 호출의 경로’ 칸은 mcp__docs__search 한 번을 호출할 때 pinned call path가 밟는 다섯 단계입니다."
      ariaLabel="Registry 확인부터 runtime 생성, discovery 재수행, 호출, shutdown까지와 두 instance의 generation 비교"
      scenes={SCENES}
      render={(active) => {
        const compare = active === SCENES.length - 1;
        const registryOn = active === 0 || compare;
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className={`min-w-0 rounded-lg border p-3 text-sm ${registryOn ? "border-primary bg-background" : "border-border bg-background/60"}`}>
              <p className="text-xs font-semibold text-primary">Registry에 보인 연결</p>
              <p className="mt-2 font-semibold">docs · Connected</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">발견 목록: search</p>
              <p className={`mt-3 rounded-md border px-2 py-1 font-mono text-xs ${compare ? "border-primary font-bold" : "border-border text-muted-foreground"}`}>
                generation 7 (표의 예시)
              </p>
            </div>
            <div className="min-w-0 rounded-lg border border-border bg-background p-3">
              <p className="text-xs font-semibold text-primary">이번 호출의 경로</p>
              <ol className="mt-2 space-y-1.5">
                {STEPS.map((step, index) => {
                  const on = index === active;
                  const past = index < active;
                  return (
                    <li
                      key={step}
                      className={`grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-2 rounded-md border px-2 py-1 text-xs ${
                        on ? "border-primary font-bold text-foreground" : past || compare ? "border-border text-foreground" : "border-dashed border-border/60 text-muted-foreground"
                      }`}
                    >
                      <span className="font-mono">{index + 1}</span>
                      <span className="min-w-0 break-words">{step}</span>
                    </li>
                  );
                })}
              </ol>
              <p className={`mt-3 rounded-md border px-2 py-1 font-mono text-xs ${compare ? "border-amber-600 font-bold text-amber-700 dark:text-amber-400" : "border-border text-muted-foreground"}`}>
                generation ? (측정 전에는 모름)
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
