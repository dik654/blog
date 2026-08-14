import VizFrame from "@/components/viz/VizFrame";
import { BackpropSceneControls, useBackpropScenes } from "./BackpropVizControls";

const SCENES = ["forward 값", "reverse 책임", "저장 경계"] as const;

export default function AutodiffGraphViz() {
  const scenes = useBackpropScenes(SCENES.length);
  const reverse = scenes.active === 1;
  return (
    <VizFrame eyebrow="Animated computational graph" title="값은 오른쪽으로, loss의 책임은 왼쪽으로 흐른다" description="w=3, x=2인 작은 graph 하나로 forward, reverse, save/recompute 경계를 차례로 봅니다." note="Tape는 모든 과거 입력을 보관하는 것이 아니라 각 local derivative가 나중에 요구할 값과 operation 순서를 기록합니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="Automatic differentiation graph animation" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <Pair active={scenes.active === 0} />
          <Arrow reverse={reverse} />
          <Node active={scenes.active !== 2} label="곱셈" value={reverse ? "∂a/∂w = x" : "a = 6"} shape="원" />
          <Arrow reverse={reverse} />
          <Node active={reverse} label="제곱·loss" value={reverse ? "∂L/∂a = 12" : "L = 36"} shape="사각" />
        </div>
        <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${scenes.active === 2 ? "opacity-100" : "opacity-55"}`}>
          <div className={`border p-4 ${scenes.active === 2 ? "border-primary bg-primary/10" : "border-border"}`}><p className="text-xs font-bold text-primary">SAVE</p><p className="mt-2 font-mono text-sm">x=2 · a=6 · operation 순서</p><p className="mt-2 text-xs leading-5 text-muted-foreground">backward가 local derivative를 즉시 계산하도록 forward 값 보관</p></div>
          <div className={`border p-4 ${scenes.active === 2 ? "border-amber-500 bg-amber-500/10" : "border-border"}`}><p className="text-xs font-bold text-amber-600">RECOMPUTE</p><p className="mt-2 font-mono text-sm">a=wx를 backward에서 다시 계산</p><p className="mt-2 text-xs leading-5 text-muted-foreground">memory를 줄이는 대신 같은 forward compute를 다시 지불</p></div>
        </div>
        <BackpropSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Pair({ active }: { active: boolean }) { return <div className={`grid gap-2 ${active ? "opacity-100" : "opacity-65"}`}><Node active={active} label="weight" value="w = 3" shape="사각"/><Node active={active} label="input" value="x = 2" shape="사각"/></div>; }
function Node({ active, label, value, shape }: { active: boolean; label: string; value: string; shape: "원" | "사각" }) { return <div className={`min-w-0 border p-3 text-center ${shape === "원" ? "rounded-full" : ""} ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}><p className="text-[10px] font-bold text-muted-foreground">{label}</p><p className="mt-1 break-words font-mono text-xs font-black sm:text-sm">{value}</p></div>; }
function Arrow({ reverse }: { reverse: boolean }) { return <span aria-hidden className="text-lg font-black text-primary">{reverse ? "←" : "→"}</span>; }
