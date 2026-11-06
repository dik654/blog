import type { ReactNode } from "react";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 느낌을 곧바로 '나를 공격한 증거'로 굳히면 지각과 반격 충동이 서로 강화,
 * 관찰하면 느낌은 있어도 반격이 명령은 아님. 한 번으로 습관이 사라지지 않음(수행 전통의 주장).
 */
const SCENES = [
  { label: "곧바로 굳히면", summary: "지각 ⇄ 반격 충동", note: "느낌을 곧바로 ‘나를 공격한 증거’로 굳히면 지각과 반격 충동이 서로를 강화합니다." },
  { label: "관찰을 넣으면", summary: "느낌은 여전히 있음 · 명령은 아님", note: "위치·강도·변화를 관찰해도 맨 위의 느낌은 여전히 있습니다. 그러나 반드시 반격해야 하는 명령은 아닙니다." },
  { label: "한 번으로는", summary: "습관이 다 없어지지는 않음", note: "반복된 주의와 윤리적 행동, 집중 훈련이 함께 필요하다는 것은 수행 전통의 주장입니다. 10초 예는 그 전체 길을 증명하지 않습니다." },
] as const;

function Box({ children, on = true, dashed = false }: { children: ReactNode; on?: boolean; dashed?: boolean }) {
  return <div className={`rounded-lg border px-3 py-2 text-center text-sm leading-6 ${dashed ? "border-dashed" : ""} ${on ? "border-primary" : "border-border/50 text-muted-foreground/60"}`}>{children}</div>;
}

export default function ObservationGapViz() {
  return (
    <SceneShell
      eyebrow="느낌과 반응 사이"
      title="관찰은 느낌을 지우지 않고 다음 칸을 바꿉니다"
      description="맨 위 불쾌한 느낌은 모든 장면에 남아 있고, 비교하는 것은 그 아래 칸입니다."
      ariaLabel="불쾌한 느낌 다음에 굳히기와 관찰이 들어갈 때 달라지는 다음 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <Box><strong>불쾌한 느낌</strong></Box>
          <p className="my-0.5 text-center text-muted-foreground" aria-hidden>↓</p>
          <StableSceneStack
            active={active}
            scenes={[
              <Box key="fix"><strong>곧바로 굳힘</strong><span className="block text-xs leading-5 sm:text-sm">‘나를 공격한 증거’</span></Box>,
              <Box key="watch" dashed><strong>관찰</strong><span className="block text-xs leading-5 sm:text-sm">위치·강도·변화</span></Box>,
              <Box key="watch2" dashed><strong>관찰 한 번</strong><span className="block text-xs leading-5 sm:text-sm">분석의 첫 작동</span></Box>,
            ]}
          />
          <p className="my-0.5 text-center text-muted-foreground" aria-hidden>↓</p>
          <StableSceneStack
            active={active}
            scenes={[
              <div key="loop" className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-1">
                <Box>지각</Box>
                <span className="text-center font-bold" aria-label="서로 강화">⇄</span>
                <Box>반격 충동</Box>
              </div>,
              <Box key="free" dashed>반격은 <strong>반드시 해야 하는 명령이 아님</strong></Box>,
              <Box key="habit" dashed>모든 습관이 <strong>없어지지는 않음</strong></Box>,
            ]}
          />
          <div className={`mt-3 rounded-lg border px-3 py-2 text-center text-xs leading-5 sm:text-sm ${active === 2 ? "border-primary" : "border-border/50 text-muted-foreground/60"}`}>
            수행 전통의 주장: 반복된 주의 + 윤리적 행동 + 집중 훈련
          </div>
        </div>
      )}
    />
  );
}
