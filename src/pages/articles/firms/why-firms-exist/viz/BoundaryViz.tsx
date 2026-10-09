import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import { INSIDE, choices, coordinationTotal } from "../model";

const SCENES = ["전부 밖에", "전부 안에", "세 개 또는 네 개", "밖의 비용 5", "밖의 비용 3.5"] as const;
const CONDITIONS = [
  { n: 0, outside: 4, note: "여섯 일마다 상대를 찾고 조건을 맞추는 데 4가 듭니다. 4를 여섯 번 더하면 24입니다." },
  { n: 6, outside: 4, note: "전부 안에서 처리하면 1+2+3+4+5+6=21입니다. 전부 밖에 맡길 때보다 싸지만 이것이 최저는 아닙니다." },
  { n: 4, outside: 4, note: "앞의 세 개를 안에서 처리해도 18, 네 개를 처리해도 18입니다. 그림은 동률일 때 하나 더 들이는 약속으로 네 개를 선택했습니다." },
  { n: 5, outside: 5, note: "안쪽 비용은 그대로인데 밖의 비용만 5로 올랐습니다. 네 개와 다섯 개가 모두 20으로 최저입니다. 그림은 다섯 개를 선택합니다." },
  { n: 3, outside: 3.5, note: "밖의 비용이 3.5이면 세 개에서만 최저 16.5입니다. 안쪽 비용 1·2·3·4·5·6 중 3.5와 같은 수는 없어도 선택할 수 있습니다." },
] as const;

export default function BoundaryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const c = CONDITIONS[scenes.active], options = choices(c.outside);
  return (
    <VizFrame eyebrow="같은 여섯 일" title="안에서 처리할 일을 바꾸며 합계를 비교한다"
      description="숫자는 만드는 비용을 뺀 조정 비용입니다. 두 방식의 생산비·품질·수량은 같다고 가정합니다."
      note="(가정) 정해진 순서대로 앞에서부터 들입니다. 설립·전환 비용은 0이며 수치는 실측값이 아닙니다.">
      <div data-viz-canvas tabIndex={0} role="group" aria-label="여섯 일의 안과 밖 비용 비교" onKeyDown={scenes.onKeyDown}
        className="flex h-[37rem] min-h-[32rem] min-w-0 flex-col gap-5 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1">
        <h4 className="text-base font-bold">{scenes.active + 1}. {SCENES[scenes.active]}</h4>
        <div aria-live="polite" className="border-y border-border py-3">
          <p className="text-lg font-bold">안 {c.n}개 · 현재 {coordinationTotal(c.n, c.outside)}</p>
          <p className="mt-1 text-sm">최저 {options.minimum} · 안 {options.minimizers.join("개 또는 ")}개</p>
        </div>
        <div className="grid min-h-[13rem] grid-cols-3 gap-2 min-[390px]:min-h-[9rem] sm:min-h-0">
          {INSIDE.map((inside, i) => <div key={i} className="border-l-2 border-primary/50 pl-2">
            <p className="text-xs">일 {i + 1} · {i < c.n ? "안" : "밖"}</p>
            <p className="mt-1 text-base font-bold">비용 {i < c.n ? inside : c.outside}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">안 {inside} / 밖 {c.outside}</p>
          </div>)}
        </div>
        <div className="grid min-h-[9rem] grid-cols-2 gap-x-4 gap-y-2 text-sm min-[390px]:min-h-[6.5rem] sm:min-h-0 sm:grid-cols-4" aria-label="안에서 처리하는 개수별 전체 비용">
          {options.totals.map((total, n) => <p key={n} className={options.minimizers.includes(n) ? "font-bold text-primary" : "text-muted-foreground"}>안 {n}개 → {total}{options.minimizers.includes(n) ? " (최저)" : ""}</p>)}
        </div>
        <p className="min-h-[7rem] text-sm leading-7 min-[390px]:min-h-[5.25rem] sm:min-h-0">{c.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
