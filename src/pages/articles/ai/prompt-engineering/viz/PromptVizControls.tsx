import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";

export function Controls(props: {
  active: number;
  labels: readonly string[];
  playing: boolean;
  reducedMotion: boolean;
  setActive: (index: number) => void;
  setPlaying: (value: boolean) => void;
}) {
  return <AnimatedSceneControls {...props} />;
}
