import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

export interface PayloadShellScene {
  label: string;
  summary: string;
  note: string;
}

/**
 * Payload Builder 두 글의 장면형 Viz가 함께 쓰는 틀입니다.
 * 그림·제목·설명을 모두 StableSceneStack에 겹쳐 두어 장면을 넘겨도 조작부 위치가 바뀌지 않습니다.
 */
export default function PayloadSceneShell({
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
  scenes: readonly PayloadShellScene[];
  render: (active: number) => ReactNode;
}) {
  const scenes = useAnimatedScenes(items.length, 5200, { loop: false });
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
          scenes={items.map((item, index) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="break-keep text-base font-bold">
                <span className="mr-2 font-mono text-[10px] text-primary">{String(index + 1).padStart(2, "0")}/{String(items.length).padStart(2, "0")}</span>
                {item.label}
              </h4>
              <span className="break-keep font-mono text-xs font-bold text-primary sm:text-sm">{item.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={items.map((item, index) => (
            <div key={item.label} className="min-w-0">{render(index)}</div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={items.map((item) => (
            <p key={item.label} className="break-keep border-l border-primary/50 pl-3 text-[13px] leading-6 text-muted-foreground">
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
