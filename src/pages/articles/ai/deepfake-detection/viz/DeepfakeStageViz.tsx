import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import DeepfakeMobileStageFlow from "../DeepfakeMobileStageFlow";

interface StageItem {
  title: string;
  detail: string;
}

export default function DeepfakeStageViz({
  id,
  eyebrow,
  title,
  description,
  note,
  scenes,
  controlLabels,
  notes,
  stages,
  showChildrenOnMobile = false,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  scenes: readonly string[];
  controlLabels?: readonly string[];
  notes: readonly string[];
  stages: readonly StageItem[];
  showChildrenOnMobile?: boolean;
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(scenes.length, 5200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.active;

  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      note={note}
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !flex-none !overflow-visible"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label={`${title}의 ${scenes.length}단계 설명`}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[22rem] flex-col justify-center sm:min-h-[23rem]">
          <p className="text-[11px] font-black text-primary">
            장면 · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 break-keep text-base font-bold">{scenes[active]}</h4>
          <DeepfakeMobileStageFlow
            items={stages}
            active={active}
            ariaLabel={`${title}의 장면 순서`}
          />
          <div className={`mt-6 ${showChildrenOnMobile ? "block" : "hidden sm:block"}`}>
            {children(active)}
          </div>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {notes[active]}
          </p>
        </div>
        <AnimatedSceneControls
          {...controls}
          labels={[...(controlLabels ?? scenes)]}
        />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {scenes.map((scene, index) => (
            <li key={scene} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong>
                {index + 1}. {scene}
              </strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
