import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
export default function LaborSceneFrame({ title, description, note, labels, notes, render, renderClassName, noteClassName }: {
  title: string; description: string; note: string; labels: readonly string[];
  notes: readonly string[]; render: (scene: number) => ReactNode;
  /** 모바일에서 장면마다 길이가 달라져도 프레임 높이가 흔들리지 않도록, 실측한 최대 높이의 min-h를 각 Viz가 넘긴다 */
  renderClassName?: string; noteClassName?: string;
}) {
  const scenes = useAnimatedScenes(labels.length, 5600);
  return <VizFrame eyebrow="같은 사례를 단계별로 보기" title={title} description={description} note={note}>
    <div data-viz-canvas tabIndex={0} role="group" aria-label={title} onKeyDown={scenes.onKeyDown}
      className="flex h-[39rem] min-w-0 flex-col gap-4 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <h4 className="text-base font-bold">{labels[scenes.active]}</h4>
        <div aria-live="polite" className={renderClassName}>{render(scenes.active)}</div>
        <p className={noteClassName ? `text-sm leading-7 ${noteClassName}` : "text-sm leading-7"}>{notes[scenes.active]}</p>
      </div>
      <AnimatedSceneControls {...scenes} labels={labels} />
    </div>
  </VizFrame>;
}
