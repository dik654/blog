import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";

export function RecurrentSceneControls(props: {
  labels: readonly string[];
  active: number;
  playing: boolean;
  setActive: (value: number) => void;
  setPlaying: (value: boolean) => void;
}) {
  return <AnimatedSceneControls {...props} reducedMotion={false} />;
}
