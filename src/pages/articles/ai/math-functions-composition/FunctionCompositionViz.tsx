import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["입력 하나", "출력 계약", "함수 연결", "순서 경계"] as const;

export default function FunctionCompositionViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Animated function map"
      title="함수는 값을 순간이동시키는 식이 아니라 입력 집합에서 출력 집합으로 잇는 규칙이다"
      description="입력 하나의 화살표부터 시작해 shape가 맞는 두 함수를 연결하고, 순서를 바꾼 반례까지 확인합니다."
      note="같은 입력에서 화살표가 두 출력으로 갈라지면 이 글에서 말하는 deterministic function이 아닙니다. 여러 입력이 같은 출력으로 모이는 것은 허용됩니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="함수 입력 출력 합성 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
          <SetBox
            label="Domain X"
            title="허용 입력"
            values={["1", "2", "3"]}
            active={active >= 0}
            accent="sky"
          />
          <Connector active={active >= 0} label="g" />
          <SetBox
            label="Intermediate U"
            title="g가 만든 값"
            values={["4", "7", "10"]}
            active={active >= 1}
            accent="violet"
          />
          <Connector active={active >= 2} label="f" />
          <SetBox
            label="Codomain Y"
            title="f가 돌려줄 값"
            values={["16", "49", "100"]}
            active={active >= 2}
            accent="emerald"
          />
        </div>

        <div className="mt-6 grid gap-4 border-t border-border pt-5 md:grid-cols-2">
          <div className={`border-l pl-4 ${active === 2 ? "border-primary" : "border-border"}`}>
            <p className="text-xs font-bold text-muted-foreground">현재 실행</p>
            <p className="mt-2 font-mono text-lg font-black">2 → g(2)=7 → f(7)=49</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              가운데 값 7은 g의 output인 동시에 f의 input입니다.
            </p>
          </div>
          <div className={`border-l pl-4 ${active === 3 ? "border-rose-500" : "border-border"}`}>
            <p className="text-xs font-bold text-muted-foreground">순서를 바꾼 대조</p>
            <p className="mt-2 font-mono text-lg font-black">2 → f(2)=4 → g(4)=13</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              같은 두 함수라도 f∘g와 g∘f는 일반적으로 다른 실행입니다.
            </p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function SetBox({
  label,
  title,
  values,
  active,
  accent,
}: {
  label: string;
  title: string;
  values: string[];
  active: boolean;
  accent: "sky" | "violet" | "emerald";
}) {
  const styles = {
    sky: "border-sky-500 bg-sky-500/10",
    violet: "border-violet-500 bg-violet-500/10",
    emerald: "border-emerald-500 bg-emerald-500/10",
  } as const;
  return (
    <div className={`min-w-0 border p-4 transition-opacity duration-500 ${styles[accent]} ${active ? "opacity-100" : "opacity-35"}`}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black">{title}</p>
      <div className="mt-5 flex items-center justify-around gap-3">
        {values.map((value, index) => (
          <span key={value} className={`flex h-10 w-10 items-center justify-center rounded-full border bg-background font-mono text-sm font-black ${index === 1 ? "border-primary text-primary" : "border-border"}`}>
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function Connector({ active, label }: { active: boolean; label: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 transition-colors duration-500 ${active ? "text-primary" : "text-border"}`} aria-hidden>
      <span className="font-mono text-xs font-black">{label}</span>
      <span className="text-xl">→</span>
    </div>
  );
}
