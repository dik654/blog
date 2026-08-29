import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: agent 가 여러 tool 후보 중 하나를 고르고(0), schema 에 인자를 채우고(1),
 * 서로 의존 없는 tool 은 순차 대신 병렬로 호출해 latency 를 줄이고(2),
 * 결과를 검증해 성공은 다음 선택에, 실패는 retry 로 되돌린다(3).
 * Stage 높이는 4 장면 중 가장 큰 scene 2(타임라인 두 줄 + 설명) 기준으로 고정한다.
 */
const SCENES = ["Tool 선택", "인자 생성", "순차 vs 병렬 호출", "결과 검증 → 다음 step"] as const;

const NOTES = [
  "\"서울 날씨 알려줘\" 라는 요청에 model 이 등록된 tool 이름·설명을 보고 get_weather 를 고릅니다. send_email 은 후보에서 제외됩니다.",
  "get_weather 의 JSON schema(location: string, unit: enum)에 맞춰 model 이 {\"location\": \"Seoul\", \"unit\": \"celsius\"} 를 채웁니다.",
  "독립된 tool 3개를 실행 1회 400ms 로 가정하면, 순차 호출은 3×RTT ≈ 1,200ms 가 걸리지만 한 턴에 함께 반환해 동시에 돌리면 1×RTT ≈ 400ms 로 줄어듭니다.",
  "결과가 성공이면 다음 tool 선택의 입력이 되고, 실패면 재시도 횟수를 늘려 backoff 뒤 다시 부르거나 최대 횟수를 넘기면 typed error 로 확정합니다.",
] as const;

const TOOL_CANDIDATES = ["get_weather", "search_flights", "send_email"] as const;

function SelectionScene() {
  return (
    <div className="mt-6">
      <div className="border border-primary/55 bg-primary/5 p-4 text-sm font-bold text-foreground">
        "서울 날씨 알려줘"
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {TOOL_CANDIDATES.map((name) => (
          <div
            key={name}
            className={`border px-3 py-2 text-center text-xs font-bold ${
              name === "get_weather"
                ? "border-primary/55 bg-primary/10 text-foreground"
                : "border-border text-muted-foreground"
            }`}
          >
            {name}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-bold text-muted-foreground">
        이름·설명을 보고 get_weather 하나만 후보로 고릅니다.
      </p>
    </div>
  );
}

function ArgumentScene() {
  const fields: readonly { key: string; value: string }[] = [
    { key: "location", value: "\"Seoul\"" },
    { key: "unit", value: "\"celsius\"" },
  ];
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="border border-border p-3 text-xs">
        <p className="text-[11px] font-black text-primary">get_weather.schema</p>
        <p className="mt-2 leading-6 text-muted-foreground">location: string (required)</p>
        <p className="leading-6 text-muted-foreground">unit: enum[celsius, fahrenheit]</p>
      </div>
      <div className="border border-primary/55 bg-primary/5 p-3 text-xs">
        <p className="text-[11px] font-black text-primary">생성된 인자</p>
        {fields.map((f) => (
          <p key={f.key} className="mt-2 leading-6 text-foreground">
            {f.key}: {f.value}
          </p>
        ))}
      </div>
    </div>
  );
}

function TimingScene() {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <p className="mb-1 text-[11px] font-bold text-muted-foreground">순차 호출 · 3×RTT ≈ 1,200ms</p>
        <div className="flex gap-1">
          {["tool A", "tool B", "tool C"].map((name) => (
            <div key={name} className="flex h-8 flex-1 items-center justify-center border border-border bg-muted/30 text-[11px] font-bold text-muted-foreground">
              {name}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1 text-[11px] font-bold text-muted-foreground">병렬 호출 · 1×RTT ≈ 400ms</p>
        <div className="flex h-8 items-stretch gap-1">
          {["tool A", "tool B", "tool C"].map((name) => (
            <div key={name} className="flex flex-1 items-center justify-center border border-primary/55 bg-primary/10 text-[11px] font-bold text-foreground">
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ValidationScene() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      <div className="border border-primary/55 bg-primary/5 p-3 text-xs">
        <p className="text-[11px] font-black text-primary">성공 → 다음 선택</p>
        <p className="mt-2 leading-6 text-muted-foreground">
          결과가 typed success 로 state 에 더해져 다음 tool 선택의 입력이 됩니다.
        </p>
      </div>
      <div className="border border-border p-3 text-xs">
        <p className="text-[11px] font-black text-foreground">실패 → retry 또는 error</p>
        <p className="mt-2 leading-6 text-muted-foreground">
          최대 횟수 안이면 backoff 뒤 재시도하고, 넘으면 typed error 로 확정합니다.
        </p>
      </div>
    </div>
  );
}

export default function ToolCallingLifecycleAndCostsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  return (
    <VizFrame
      eyebrow="Tool calling"
      title="Agent 는 tool 을 고르고 인자를 채워 순차·병렬로 호출한 뒤 결과를 검증합니다"
      description="Selection 부터 argument generation, 순차·병렬 invocation, 결과 검증 후 다음 step 반영까지 한 흐름으로 보여 줍니다."
      note="400ms · 1,200ms 수치는 mechanism 을 보여 주는 계산된 예시이며 특정 provider 의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Tool calling 수명주기"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {scenes.active === 0 && <SelectionScene />}
          {scenes.active === 1 && <ArgumentScene />}
          {scenes.active === 2 && <TimingScene />}
          {scenes.active === 3 && <ValidationScene />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
