import type { KeyboardEvent } from "react";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

export function useStory(length: number, interval = 5200) {
  const controls = useAnimatedScenes(length, interval, { loop: false });
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) =>
    controls.onKeyDown(event as KeyboardEvent<HTMLDivElement>);

  return {
    step: controls.active,
    setStep: controls.setActive,
    playing: controls.playing,
    setPlaying: controls.setPlaying,
    reducedMotion: controls.reducedMotion,
    playbackId: controls.playbackId,
    onKeyDown,
  };
}
