import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

export interface AutobahnShellScene {
  label: string;
  summary: string;
  note: string;
}

/** 이 글의 장면형 Viz가 함께 쓰는 틀입니다. 그림은 모든 장면을 같은 칸에 겹쳐 두어 조작부가 움직이지 않습니다. */
export default function AutobahnSceneShell({
  eyebrow,
  title,
  description,
  note,
  ariaLabel,
  playLabel,
  scenes: items,
  render,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  ariaLabel: string;
  playLabel: string;
  scenes: readonly AutobahnShellScene[];
  render: (active: number) => ReactNode;
}) {
  const scenes = useAnimatedScenes(items.length, 4600, { loop: false });
  const labels = items.map((item) => item.label);

  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description} note={note} canvasClassName="p-3 sm:p-5">
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label={ariaLabel}
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={items.map((item, index) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="break-keep text-base font-bold">
                <span className="mr-2 text-xs font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </h4>
              <span className="break-keep font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={items.map((item, index) => (
            <div key={item.label} className="min-w-0">{render(index)}</div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={items.map((item) => (
            <p key={item.label} className="break-keep border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} playLabel={playLabel} />
        <StaticSceneList labels={labels} notes={items.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
