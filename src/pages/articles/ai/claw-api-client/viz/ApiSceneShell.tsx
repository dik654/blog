import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

export interface ApiShellScene {
  label: string;
  summary: string;
  note: string;
}

/**
 * 이 글의 장면형 Viz가 함께 쓰는 틀입니다.
 * 그림은 모든 장면을 StableSceneStack에 겹쳐 두어 가장 큰 장면 높이로 고정합니다.
 */
export default function ApiSceneShell({
  eyebrow,
  title,
  description,
  note,
  ariaLabel,
  scenes: items,
  render,
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  ariaLabel: string;
  scenes: readonly ApiShellScene[];
  render: (active: number) => ReactNode;
}) {
  const scenes = useAnimatedScenes(items.length, 4600);
  const labels = items.map((item) => item.label);

  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description} note={note}>
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
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={items.map((item, index) => (
            <div key={item.label} className="min-w-0">
              {render(index)}
            </div>
          ))}
        />
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
