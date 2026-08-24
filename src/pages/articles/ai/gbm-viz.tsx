import { NodeBox, StoryShell } from "./kimi-k3-shared";
import { useStory } from "./useKimiStory";

const Arrow = () => (
  <span
    aria-hidden
    className="rotate-90 text-center text-xl text-muted-foreground md:rotate-0"
  >
    →
  </span>
);

export function BoostingFunctionViz() {
  const story = useStory(4);
  const labels = ["한 tree", "현재 오차", "새 tree", "ensemble"] as const;
  return (
    <StoryShell
      title="작은 구간 함수를 loss가 줄어드는 방향으로 하나씩 더한다"
      subtitle="먼저 tree 하나의 shape를 보고, 그 다음에만 residual target과 additive update를 붙입니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="grid grid-cols-2 gap-1 border border-emerald-500/50 bg-emerald-500/10 p-4">
          <div className="h-16 border border-emerald-500/60 bg-emerald-500/15" />
          <div className="h-16 border border-emerald-500/60 bg-emerald-500/25" />
          <p className="col-span-2 mt-2 text-center text-xs font-black">
            leaf region → constant value
          </p>
        </div>
        <Arrow />
        <NodeBox
          active={story.step >= 1}
          title="Residual target"
          detail="현재 prediction에서 loss가 줄어드는 sample별 방향"
        />
        <Arrow />
        <div className="space-y-2">
          {["F₀", "+ ηh₁", "+ ηh₂"].map((x, i) => (
            <div
              key={x}
              className={`border px-4 py-3 text-center text-sm font-black transition-opacity ${story.step >= Math.min(3, i + 1) ? "border-primary bg-primary/10 opacity-100" : "border-border opacity-25"}`}
            >
              {x}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        {
          [
            "Tree 하나는 input 공간을 leaf 칸으로 나누고 각 칸에서 상수 값을 냅니다.",
            "현재 score가 틀린 방향을 negative loss derivative로 계산합니다.",
            "새 weak tree가 그 방향을 leaf별 상수로 근사합니다.",
            "Learning rate η로 목소리를 줄여 기존 함수에 더하고 validation에서 round 수를 고릅니다.",
          ][story.step]
        }
      </p>
    </StoryShell>
  );
}

export function XGBoostGainViz() {
  const story = useStory(4);
  const labels = [
    "G·H 모으기",
    "bin 만들기",
    "split 비교",
    "penalty 판정",
  ] as const;
  return (
    <StoryShell
      title="Raw row를 G·H histogram으로 접고 child gain을 parent와 비교한다"
      subtitle="Threshold 후보를 시험하는 통계 장부와 regularized gain을 같은 흐름에서 봅니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className={`border p-3 text-center text-xs transition-all ${story.step >= 1 ? "border-blue-500/50 bg-blue-500/10" : "border-border"}`}
            >
              row {i + 1}
              <br />
              <span className="font-mono">gᵢ,hᵢ</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div
            className={`grid grid-cols-4 gap-1 transition-opacity ${story.step >= 1 ? "opacity-100" : "opacity-25"}`}
          >
            {["bin 0", "bin 1", "bin 2", "bin 3"].map((x) => (
              <div
                key={x}
                className="border border-blue-500/50 bg-blue-500/10 p-3 text-center text-xs font-black"
              >
                {x}
              </div>
            ))}
          </div>
          <div
            className={`grid grid-cols-[1fr_auto_1fr] items-center gap-2 transition-opacity ${story.step >= 2 ? "opacity-100" : "opacity-25"}`}
          >
            <NodeBox active title="Left child" detail="Gᴸ,Hᴸ" />
            <Arrow />
            <NodeBox active title="Right child" detail="Gᴿ,Hᴿ" />
          </div>
          <div
            className={`border p-4 text-center text-sm font-black transition-colors ${story.step >= 3 ? "border-primary bg-primary/10" : "border-border text-muted-foreground"}`}
          >
            child score − parent score − γ &gt; 0 ?
          </div>
        </div>
      </div>
    </StoryShell>
  );
}

export function LightGBMEfficiencyViz() {
  const story = useStory(4);
  const labels = ["row", "column", "gain", "leaf"] as const;
  return (
    <StoryShell
      title="GOSS는 row, EFB는 column, leaf-wise는 growth budget을 줄인다"
      subtitle="세 기법이 서로 다른 축을 줄인다는 사실을 data table과 tree에서 따로 봅니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 30 }, (_, i) => {
            const row = Math.floor(i / 6);
            const selected = row < 2 || row === 4;
            return (
              <div
                key={i}
                className={`h-8 border transition-all ${story.step >= 1 && i % 3 !== 0 ? "opacity-25" : "opacity-100"} ${selected ? "border-rose-500/50 bg-rose-500/10" : "border-border bg-muted/10"}`}
              />
            );
          })}
          <p className="col-span-6 mt-2 text-xs text-muted-foreground">
            붉은 row: 큰 gradient를 유지 · 흐린 column: exclusive feature bundle
            후보
          </p>
        </div>
        <div className="flex items-start justify-center gap-2 pt-2">
          <div className="space-y-2">
            <div className="border border-primary bg-primary/10 px-5 py-3 text-center text-sm font-black">
              root
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="border border-border p-3 text-xs">leaf A</div>
              <div
                className={`border p-3 text-xs ${story.step >= 3 ? "border-amber-500 bg-amber-500/15 font-black" : "border-border"}`}
              >
                leaf B<br />
                gain 7
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {
          [
            "원본 table은 row 수와 sparse column 수가 모두 split scan 비용을 만듭니다.",
            "GOSS는 큰 gradient row를 남기고 작은-gradient row 일부에 보정 weight를 줍니다.",
            "EFB는 동시에 켜지지 않는 sparse columns를 offset bin 하나에 묶습니다.",
            "Leaf-wise growth는 같은 depth 전체가 아니라 현재 gain이 가장 큰 leaf 하나를 확장합니다.",
          ][story.step]
        }
      </p>
    </StoryShell>
  );
}

export function CatBoostOrderingViz() {
  const story = useStory(4);
  const labels = [
    "permutation",
    "prefix",
    "gradient",
    "symmetric tree",
  ] as const;
  return (
    <StoryShell
      title="현재 row를 보지 않은 prefix prediction으로 gradient를 만든다"
      subtitle="Ordered target statistic과 ordered boosting을 섞지 않고, prediction 경로부터 확인합니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="grid grid-cols-4 gap-2">
            {["A", "C", "B", "D"].map((x, i) => (
              <div
                key={x}
                className={`border p-4 text-center font-black ${i < 2 && story.step >= 1 ? "border-emerald-500 bg-emerald-500/10" : i === 2 ? "border-primary bg-primary/10" : "border-border"}`}
              >
                {x}
              </div>
            ))}
          </div>
          <div
            className={`mt-4 border-l border-primary pl-4 text-sm leading-7 transition-opacity ${story.step >= 1 ? "opacity-100" : "opacity-25"}`}
          >
            B의 prediction model은 B·D를 보지 않고 A·C만 학습합니다.
          </div>
          <div
            className={`mt-3 border p-4 text-center text-sm font-black transition-opacity ${story.step >= 2 ? "border-primary opacity-100" : "border-border opacity-25"}`}
          >
            gradient(B) = −∂ℓ(yᴮ,Fᴬᶜ(xᴮ))/∂F
          </div>
        </div>
        <div
          className={`transition-opacity ${story.step >= 3 ? "opacity-100" : "opacity-25"}`}
        >
          <div className="mx-auto w-28 border border-violet-500 bg-violet-500/10 p-3 text-center text-xs font-black">
            same split at depth 0
          </div>
          <div className="mx-auto h-6 w-px bg-border" />
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-violet-500/50 p-3 text-center text-xs">
              same depth-1 rule
            </div>
            <div className="border border-violet-500/50 p-3 text-center text-xs">
              same depth-1 rule
            </div>
          </div>
        </div>
      </div>
    </StoryShell>
  );
}
