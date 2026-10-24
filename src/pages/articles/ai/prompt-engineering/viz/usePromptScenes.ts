import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

export function useScenes(length: number) {
  return useAnimatedScenes(length, 6200);
}
