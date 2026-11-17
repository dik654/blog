import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

export interface BranchShellScene {
  label: string;
  summary: string;
  note: string;
}

/** 장면형 Viz의 공통 틀입니다. 제목·그림·설명을 모두 StableSceneStack에 겹쳐 높이와 조작부 위치를 고정합니다. */
export default function BranchSceneShell({
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
  scenes: readonly BranchShellScene[];
  render: (active: number) => ReactNode;
}) {
  const scenes = useAnimatedScenes(items.length, 4800, { loop: false });
  const labels = items.map((item) => item.label);

  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description} note={note} canvasClassName="p-3 sm:p-6">
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
              <h4 className="break-keep text-base font-bold">{item.label}</h4>
              <span className="break-keep font-mono text-xs font-bold text-primary sm:text-sm">{item.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack className="mt-4" active={scenes.active} scenes={items.map((item, index) => <div key={item.label}>{render(index)}</div>)} />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={items.map((item) => (
            <p key={item.label} className="break-keep border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
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
