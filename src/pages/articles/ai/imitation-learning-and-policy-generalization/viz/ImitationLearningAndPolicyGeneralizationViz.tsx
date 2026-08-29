import { Fragment } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism만 보여 준다: 같은 training coverage grid 위에서 compositional
 * generalization(알려진 축 안의 안 본 조합)과 OOD generalization(아예 새 축)이
 * 서로 다른 지점에서 실패한다는 것을 대비한다.
 */
const OBJECTS = ["Cup", "Box", "Bottle", "Pan"] as const;
const LOCATIONS = ["Left", "Center", "Right", "Shelf"] as const;
// 학습 때 실제로 본 (object, location) 조합. Bottle-Shelf는 두 축 모두 알지만
// 그 조합만 못 봤고, Pan은 행 전체가 학습에 아예 없던 새 축이다.
const SEEN = new Set([
  "Cup|Left", "Cup|Center", "Cup|Right", "Cup|Shelf",
  "Box|Left", "Box|Center", "Box|Right", "Box|Shelf",
  "Bottle|Left", "Bottle|Center", "Bottle|Right",
]);
const GAP_CELL = "Bottle|Shelf";
const OOD_ROW = "Pan";
const OOD_TARGET_CELL = "Pan|Center";

const SCENES = [
  "학습 데이터가 덮는 조합",
  "Compositional: 안 본 조합 하나",
  "OOD: 아예 새로운 축 등장",
  "두 실패 지점을 함께 비교",
] as const;

const NOTES = [
  "3개 object × 4개 location 중 대부분의 조합을 이미 학습에서 봤습니다. 아직 회색 칸(Bottle-Shelf)이 하나 남아 있습니다.",
  "Bottle과 Shelf는 각각 학습에서 본 값이지만 그 둘의 조합은 처음입니다. 이미 아는 축들을 새로 조합하는 것이 compositional generalization입니다.",
  "Pan은 object 축 자체가 학습에 없던 값입니다. 조합이 아니라 분포 자체가 다른 상황에 대응하는 것이 out-of-distribution(OOD) generalization입니다.",
  "같은 policy라도 두 실패는 원인이 다릅니다. Compositional 실패는 조합 부족, OOD 실패는 분포 자체의 부재입니다.",
] as const;

type Tone = "seen" | "empty" | "gap" | "ood-row" | "ood-target";

function cellTone(object: string, location: string, scene: number): Tone {
  const key = `${object}|${location}`;
  if (object === OOD_ROW) {
    if (key === OOD_TARGET_CELL && scene >= 2) return "ood-target";
    return "ood-row";
  }
  if (key === GAP_CELL) {
    if (scene === 1 || scene === 3) return "gap";
    return "empty";
  }
  return SEEN.has(key) ? "seen" : "empty";
}

const TONE_CLASS: Record<Tone, string> = {
  seen: "border-primary/45 bg-primary/8 text-foreground",
  empty: "border-border bg-muted/20 text-muted-foreground",
  gap: "border-primary bg-primary/20 text-foreground",
  "ood-row": "border-dashed border-border/70 bg-muted/10 text-muted-foreground/70",
  "ood-target": "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

export default function ImitationLearningAndPolicyGeneralizationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const showOodRow = scenes.active >= 2;

  return (
    <VizFrame
      eyebrow="Policy generalization taxonomy"
      title="Compositional 실패와 OOD 실패는 같은 grid에서 다른 지점을 가리킵니다"
      description="Object × location 학습 coverage 위에서 안 본 조합과 아예 새로운 축을 같은 그림으로 대비합니다."
      note="Object·location 4×4 예시는 mechanism을 보여 주기 위한 단순화이며 실제 dataset의 축 개수가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Compositional generalization과 OOD generalization 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          <div className="mt-6">
            <div className="grid grid-cols-[3.5rem_repeat(4,1fr)] gap-1">
              <div />
              {LOCATIONS.map((location) => (
                <div key={location} className="text-center text-[10px] font-black text-muted-foreground">
                  {location}
                </div>
              ))}
              {OBJECTS.map((object) => (
                <Fragment key={object}>
                  <div
                    className={`flex items-center text-[10px] font-bold ${object === OOD_ROW && !showOodRow ? "invisible" : "text-foreground"}`}
                  >
                    {object}
                  </div>
                  {LOCATIONS.map((location) => (
                    <div
                      key={`${object}-${location}`}
                      className={`h-9 border text-[10px] font-bold ${
                        object === OOD_ROW && !showOodRow ? "invisible" : TONE_CLASS[cellTone(object, location, scenes.active)]
                      }`}
                    />
                  ))}
                </Fragment>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted-foreground">
              <span><span className="mr-1 inline-block h-2.5 w-2.5 border border-primary/45 bg-primary/8 align-middle" /> 학습에서 본 조합</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 border border-primary bg-primary/20 align-middle" /> compositional gap</span>
              <span><span className="mr-1 inline-block h-2.5 w-2.5 border border-amber-500 bg-amber-500/15 align-middle" /> OOD target</span>
            </div>
          </div>

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
