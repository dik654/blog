import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";

export function Controls(props: {
  active: number;
  labels: readonly string[];
  playing: boolean;
  setActive: (index: number) => void;
  setPlaying: (value: boolean) => void;
}) {
  return <AnimatedSceneControls {...props} reducedMotion={false} />;
}
