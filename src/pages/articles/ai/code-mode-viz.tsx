import { NodeBox, StoryShell, useStory } from "./kimi-k3-shared";

const Arrow = () => (
  <span
    aria-hidden
    className="rotate-90 text-center text-xl text-muted-foreground md:rotate-0"
  >
    →
  </span>
);

export function CodeModeProgramViz() {
  const story = useStory(4);
  const labels = [
    "tool 왕복",
    "program IR",
    "local data",
    "bounded result",
  ] as const;

  return (
    <StoryShell
      title="여러 번의 model 왕복을 한 program과 local dataflow로 접는다"
      subtitle="코드를 쓴다는 사실보다, 누가 반복을 실행하고 어느 데이터가 model context로 돌아오는지를 봅니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div className="space-y-2">
          {["model 판단", "tool 실행", "result 재입력"].map((label, index) => (
            <div
              key={label}
              className={`border px-3 py-2 text-center text-xs transition-opacity ${
                story.step === 0 || index === 0
                  ? "border-rose-500/50 bg-rose-500/10 opacity-100"
                  : "border-border opacity-30"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <Arrow />
        <NodeBox
          active={story.step >= 1}
          title="Sandbox program"
          detail="선택한 typed tools를 loop·if·filter·reduce로 조합"
          tone="sequence"
        />
        <Arrow />
        <div className="space-y-2">
          <div
            className={`grid grid-cols-4 gap-1 transition-opacity ${
              story.step >= 2 ? "opacity-100" : "opacity-25"
            }`}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <span
                key={index}
                className={`h-7 border ${
                  index % 4 === 0
                    ? "border-cyan-500/50 bg-cyan-500/15"
                    : "border-border bg-muted/10"
                }`}
              />
            ))}
          </div>
          <div
            className={`border px-3 py-3 text-center text-xs font-black transition-all ${
              story.step >= 3
                ? "border-primary bg-primary/10 opacity-100"
                : "border-border opacity-25"
            }`}
          >
            count 20개 · source IDs · truncated=false
          </div>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        {
          [
            "일반 tool loop는 result가 돌아올 때마다 model이 다음 호출을 다시 결정합니다.",
            "Code Mode는 여러 호출과 명시적 control flow를 한 program IR로 먼저 표현합니다.",
            "원본 rows는 sandbox 변수에 남고 filter·group·sort가 runtime 안에서 끝납니다.",
            "Model에는 미리 정한 schema·행 수·byte budget 안의 최종 결과만 돌아옵니다.",
          ][story.step]
        }
      </p>
    </StoryShell>
  );
}

export function CodeModeRuntimeViz() {
  const story = useStory(4);
  const labels = [
    "control flow",
    "capability",
    "result",
    "partial effect",
  ] as const;

  return (
    <StoryShell
      title="Type이 맞는 program도 capability·result·effect 경계를 각각 통과해야 한다"
      subtitle="실행 성공과 외부 effect 성공을 한 상자로 합치지 않고, 실패가 남기는 receipt까지 보여 줍니다."
      labels={labels}
      {...story}
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_1.35fr]">
        <div className="space-y-3">
          <NodeBox
            active
            title="Program control flow"
            detail="loop · branch · bounded concurrency · try/catch"
            tone="sequence"
          />
          <div
            className={`border p-4 transition-all ${
              story.step >= 1
                ? "border-amber-500/60 bg-amber-500/10 opacity-100"
                : "border-border opacity-25"
            }`}
          >
            <p className="text-xs font-black">Capability gate</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              <span className="border border-emerald-500/50 p-2">
                repo.read ✓
              </span>
              <span className="border border-rose-500/50 p-2">shell ×</span>
              <span className="border border-emerald-500/50 p-2">
                issue.write ✓
              </span>
              <span className="border border-rose-500/50 p-2">
                ambient net ×
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div
            className={`border p-4 transition-opacity ${
              story.step >= 2
                ? "border-primary opacity-100"
                : "border-border opacity-25"
            }`}
          >
            <p className="text-xs font-black">Result disclosure</p>
            <div className="mt-3 grid grid-cols-4 gap-1">
              {["schema", "50 rows", "32 KiB", "source IDs"].map((item) => (
                <span
                  key={item}
                  className="border border-border p-2 text-center text-[11px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div
            className={`border p-4 transition-opacity ${
              story.step >= 3
                ? "border-rose-500/60 opacity-100"
                : "border-border opacity-25"
            }`}
          >
            <p className="text-xs font-black">External effect receipt</p>
            <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[11px]">
              {[
                "write 1 ✓",
                "write 2 ✓",
                "write 3 ?",
                "write 4 —",
                "write 5 —",
              ].map((item, index) => (
                <span
                  key={item}
                  className={`border p-2 ${
                    index < 2
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : index === 2
                        ? "border-rose-500/50 bg-rose-500/10"
                        : "border-border"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StoryShell>
  );
}
