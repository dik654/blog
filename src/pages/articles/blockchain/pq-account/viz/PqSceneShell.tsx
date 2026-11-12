import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

export interface PqShellScene {
  label: string;
  summary: string;
  note: string;
}

/** pq-account 글의 장면형 Viz 틀입니다. 모든 장면의 그림을 같은 칸에 겹쳐 높이를 고정합니다. */
export default function PqSceneShell({
  eyebrow,
  title,
  description,
  ariaLabel,
  scenes: items,
  render,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ariaLabel: string;
  scenes: readonly PqShellScene[];
  render: (active: number) => ReactNode;
}) {
  const scenes = useAnimatedScenes(items.length, 4600);
  const labels = items.map((item) => item.label);

  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description}>
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
          scenes={items.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack active={scenes.active} className="mt-4" scenes={items.map((item, index) => <div key={item.label}>{render(index)}</div>)} />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={items.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={items.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
