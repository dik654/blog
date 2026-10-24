import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

export function useRecurrentScenes(length: number) {
  return useAnimatedScenes(length, 4200, { loop: false });
}
