import VizFrame from "@/components/viz/VizFrame";
import { Controls } from "./PromptVizControls";
import { useScenes } from "./usePromptScenes";

const CONTRACT_SCENES = ["입력 분리", "계약 조립", "검증"] as const;
const CONTRACT_NOTES = [
  "목표·근거·제약을 서로 다른 입력으로 분리합니다.",
  "분리한 값을 objective·evidence·output·abstention이 있는 request envelope로 묶습니다.",
  "Schema는 field와 type을, domain 검사는 근거·상태·권한을 판정합니다.",
] as const;

export function PromptContractViz() {
  const scenes = useScenes(CONTRACT_SCENES.length);
  const activeTone = (scene: number) =>
    scenes.active === scene
      ? "border-primary bg-primary/10 text-foreground"
      : "border-border bg-muted/10 text-muted-foreground";

  return (
    <VizFrame
      eyebrow="Animated request contract"
      title="흩어진 입력을 하나의 검증 가능한 요청 명세로 조립한다"
      description="처음부터 모든 용어를 나열하지 않고 입력의 역할을 분리한 뒤 요청 명세와 검증기를 차례로 연결합니다."
      note="Delimiter는 역할을 보이게 하지만 tool permission이나 data egress를 강제하지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="prompt-contract-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="목표·근거·제약을 요청 계약으로 묶고 schema와 domain 검증으로 넘기는 과정"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div data-viz-live-only className="grid flex-1 items-center">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-1.5 sm:gap-4">
          <div className={`min-w-0 border p-2 sm:p-4 ${activeTone(0)}`}>
            <p className="font-mono text-[10px] font-bold">RAW INPUTS</p>
            <div className="mt-3 grid gap-1.5 sm:mt-4 sm:gap-2">
              {[
                ["목표", "무엇을 바꿀까"],
                ["근거", "어떤 자료만 쓸까"],
                ["제약", "무엇을 하지 말까"],
              ].map(([name, detail]) => (
                <div key={name} className="border border-current/30 bg-background px-1.5 py-2 sm:p-3">
                  <strong className="block text-[11px] sm:inline sm:text-sm">{name}</strong>
                  <span className="hidden text-xs sm:ml-2 sm:inline">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center text-sm font-black text-muted-foreground sm:text-xl">
            <span>→</span>
          </div>

          <div className={`min-w-0 border p-2 sm:p-4 ${activeTone(1)}`}>
            <p className="font-mono text-[10px] font-bold">REQUEST ENVELOPE</p>
            <div className="mt-3 border border-current/40 bg-background px-1.5 py-3 sm:mt-4 sm:p-4">
              <div className="mx-auto h-6 w-9 border border-current sm:h-8 sm:w-12" />
              <div className="mx-auto h-2 w-px bg-current sm:h-3" />
              <p className="whitespace-nowrap text-center text-[10px] font-black sm:text-lg">Contract</p>
              <p className="mt-2 hidden text-center text-xs leading-5 sm:block">
                objective · evidence · output · abstention
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center text-sm font-black text-muted-foreground sm:text-xl">
            <span>→</span>
          </div>

          <div className={`min-w-0 border p-2 sm:p-4 ${activeTone(2)}`}>
            <p className="font-mono text-[10px] font-bold">
              <span className="sm:hidden">VERIFY</span>
              <span className="hidden sm:inline">VERIFICATION</span>
            </p>
            <div className="mt-3 grid gap-2 sm:mt-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-current text-sm font-black sm:h-12 sm:w-12 sm:text-lg">
                ✓
              </div>
              <div>
                <p className="break-keep text-xs font-bold sm:text-base">Schema</p>
                <p className="hidden text-xs sm:block">field · type · enum</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center border border-current text-sm font-black sm:h-12 sm:w-12 sm:text-lg">
                ?
              </div>
              <div>
                <p className="break-keep text-xs font-bold sm:text-base">Domain</p>
                <p className="hidden text-xs sm:block">근거 · 상태 · 권한</p>
              </div>
            </div>
          </div>
        </div>
        </div>
        <Controls {...scenes} labels={CONTRACT_SCENES} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {CONTRACT_SCENES.map((label, index) => (
            <li key={label}>
              <strong>{String(index + 1).padStart(2, "0")} · {label}</strong>
              <span className="mt-1 block text-muted-foreground">{CONTRACT_NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

const REGRESSION_SCENES = ["실패 고정", "한 축 변경", "Canary"] as const;
const REGRESSION_NOTES = [
  "실패한 input·expected output·trace를 같은 fixture로 보존합니다.",
  "Prompt·model·decoder·validator 중 한 축만 바꿔 원인을 분리합니다.",
  "Quality·violation·p95를 canary에서 확인한 뒤 배포하거나 되돌립니다.",
] as const;

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
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="prompt-regression-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Prompt regression and canary animation"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div data-viz-live-only className="grid flex-1 items-center">
        <div>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5 sm:gap-4">
          {[
            ["01", "Failure fixture", "input · expected · trace"],
            ["02", "Paired comparison", "한 번에 한 축"],
            ["03", "Canary gate", "quality · violation · p95"],
          ].map(([id, name, detail], index) => (
            <div key={name} className="contents">
              <div className={`min-w-0 border px-1.5 py-3 sm:p-4 ${scenes.active === index ? "border-primary bg-primary/10" : "border-border"}`}>
                <div className="flex min-w-0 flex-col items-start gap-3">
                  <div className={`${index === 1 ? "rotate-45" : index === 2 ? "rounded-full" : ""} flex h-8 w-8 items-center justify-center border border-current font-mono text-[10px] font-black sm:h-11 sm:w-11 sm:text-xs`}>
                    {id}
                  </div>
                  <div className="min-w-0 break-words">
                    <p className="break-keep text-[11px] font-bold sm:text-base">{name}</p>
                    <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{detail}</p>
                  </div>
                </div>
              </div>
              {index < 2 ? (
                <div className="text-center text-sm font-black text-muted-foreground sm:text-xl">
                  <span>→</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-bold sm:mt-6 sm:text-xs">
          <div className="border-t border-sky-500 pt-2 sm:pt-3">Prompt + template</div>
          <div className="border-t border-violet-500 pt-2 sm:pt-3">Model + decoder</div>
          <div className="border-t border-emerald-500 pt-2 sm:pt-3">Validator + rollback</div>
        </div>
        </div>
        </div>
        <Controls {...scenes} labels={REGRESSION_SCENES} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {REGRESSION_SCENES.map((label, index) => (
            <li key={label}>
              <strong>{String(index + 1).padStart(2, "0")} · {label}</strong>
              <span className="mt-1 block text-muted-foreground">{REGRESSION_NOTES[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
