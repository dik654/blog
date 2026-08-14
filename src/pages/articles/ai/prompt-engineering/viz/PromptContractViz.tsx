import VizFrame from "@/components/viz/VizFrame";
import { Controls, useScenes } from "./PromptVizControls";

const CONTRACT_SCENES = ["입력 분리", "계약 조립", "검증"] as const;

export function PromptContractViz() {
  const scenes = useScenes(CONTRACT_SCENES.length);
  const activeTone = (scene: number) =>
    scenes.active === scene
      ? "border-primary bg-primary/10 text-foreground"
      : "border-border bg-muted/10 text-muted-foreground";

  return (
    <VizFrame
      eyebrow="Animated request contract"
      title="흩어진 요청을 하나의 검증 가능한 봉투로 조립한다"
      description="처음부터 모든 용어를 나열하지 않고 입력의 역할을 분리한 뒤 request envelope와 validator를 차례로 연결합니다."
      note="Delimiter는 역할을 보이게 하지만 tool permission이나 data egress를 강제하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Prompt request contract animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
          <div className={`border p-4 ${activeTone(0)}`}>
            <p className="font-mono text-[10px] font-bold">RAW INPUTS</p>
            <div className="mt-4 grid gap-2">
              {[
                ["목표", "무엇을 바꿀까"],
                ["근거", "어떤 자료만 쓸까"],
                ["제약", "무엇을 하지 말까"],
              ].map(([name, detail]) => (
                <div key={name} className="border border-current/30 bg-background p-3">
                  <strong className="text-sm">{name}</strong>
                  <span className="ml-2 text-xs">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center text-xl font-black text-muted-foreground">
            <span className="hidden lg:inline">→</span>
            <span className="lg:hidden">↓</span>
          </div>

          <div className={`border p-4 ${activeTone(1)}`}>
            <p className="font-mono text-[10px] font-bold">REQUEST ENVELOPE</p>
            <div className="mt-4 border border-current/40 bg-background p-4">
              <div className="mx-auto h-8 w-12 border border-current" />
              <div className="mx-auto h-3 w-px bg-current" />
              <p className="text-center text-lg font-black">Contract</p>
              <p className="mt-2 text-center text-xs leading-5">
                objective · evidence · output · abstention
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center text-xl font-black text-muted-foreground">
            <span className="hidden lg:inline">→</span>
            <span className="lg:hidden">↓</span>
          </div>

          <div className={`border p-4 ${activeTone(2)}`}>
            <p className="font-mono text-[10px] font-bold">VERIFICATION</p>
            <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-current text-lg font-black">
                ✓
              </div>
              <div>
                <p className="font-bold">Schema</p>
                <p className="text-xs">field · type · enum</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center border border-current text-lg font-black">
                ?
              </div>
              <div>
                <p className="font-bold">Domain</p>
                <p className="text-xs">근거 · 상태 · 권한</p>
              </div>
            </div>
          </div>
        </div>
        <Controls {...scenes} labels={CONTRACT_SCENES} />
      </div>
    </VizFrame>
  );
}

const REGRESSION_SCENES = ["실패 고정", "한 축 변경", "Canary"] as const;

export function PromptRegressionViz() {
  const scenes = useScenes(REGRESSION_SCENES.length);
  return (
    <VizFrame
      eyebrow="Animated regression loop"
      title="좋은 한 번을 저장하지 않고 실패를 다음 시험으로 바꾼다"
      description="Failure trace를 fixture로 고정하고 prompt·model·decoder 중 한 축만 바꾼 뒤 canary와 rollback까지 연결합니다."
      note="Prompt hash만 같아도 model snapshot·template·tool schema가 바뀌면 같은 system이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Prompt regression and canary animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
          {[
            ["01", "Failure fixture", "input · expected · trace"],
            ["02", "Paired comparison", "한 번에 한 축"],
            ["03", "Canary gate", "quality · violation · p95"],
          ].map(([id, name, detail], index) => (
            <div key={name} className="contents">
              <div className={`border p-5 ${scenes.active === index ? "border-primary bg-primary/10" : "border-border"}`}>
                <div className="flex items-center gap-3">
                  <div className={`${index === 1 ? "rotate-45" : index === 2 ? "rounded-full" : ""} flex h-11 w-11 items-center justify-center border border-current font-mono text-xs font-black`}>
                    {id}
                  </div>
                  <div>
                    <p className="font-bold">{name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                  </div>
                </div>
              </div>
              {index < 2 ? (
                <div className="text-center text-xl font-black text-muted-foreground">
                  <span className="hidden lg:inline">→</span>
                  <span className="lg:hidden">↓</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div className="border-t border-sky-500 pt-3">Prompt + template</div>
          <div className="border-t border-violet-500 pt-3">Model + decoder</div>
          <div className="border-t border-emerald-500 pt-3">Validator + rollback</div>
        </div>
        <Controls {...scenes} labels={REGRESSION_SCENES} />
      </div>
    </VizFrame>
  );
}
