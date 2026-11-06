import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { FlowNode } from "./Flow";
import SceneShell from "./SceneShell";

/** 본문 대응: #limits — 구매 2건만으로는 추가 효과를 모른다. 비슷한 사람의 비교 쪽 숫자는 글에 없어 '?'로 둔다. */
const SCENES = [
  { label: "본 사람만 있으면", summary: "구매 2건, 비교 대상 없음", note: "광고를 본 사람이 2건 구매했어도 원래 살 생각이 있었을 수 있습니다. 이 한 줄만으로는 광고가 더한 구매를 가려낼 수 없습니다." },
  { label: "비슷한 사람과 나란히", summary: "2건 vs ?건", note: "노출 전 관심과 조건이 비슷한 사람들 중 광고를 본 경우와 보지 않은 경우를 비교하면 추가 효과를 좁혀 볼 수 있습니다. 안 본 쪽의 수는 사례에 없어 비워 둡니다." },
  { label: "무작위 배정을 해도", summary: "확인 두 가지가 남음", note: "무작위 배정도 실제 행동 차이와 측정 누락을 확인해야 합니다. 비교 조건이 갖춰져도 숫자를 그대로 믿기 전에 이 둘을 봅니다." },
] as const;

function Arm({ title, count, dashed }: { title: string; count: string; dashed?: boolean }) {
  return (
    <div className={`min-w-0 flex-1 rounded-lg border px-3 py-3 text-center ${dashed ? "border-dashed border-border" : "border-border bg-background"}`}>
      <p className="text-sm font-semibold leading-5">{title}</p>
      <p className="mt-1 font-mono text-lg font-bold">{count}</p>
    </div>
  );
}

export default function CompareArmsViz() {
  return (
    <SceneShell
      eyebrow="비교 조건"
      title="광고가 더한 구매는 안 본 쪽과 나란히 놓아야 좁혀집니다"
      description="구매 2건은 앞의 가정 사례입니다. 추가 효과는 광고가 없었으면 일어나지 않았을 구매를 말합니다."
      ariaLabel="광고를 본 집단과 보지 않은 집단의 비교 구조"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <div key="one" className="space-y-2">
              <FlowNode title="광고를 본 사람들" sub="노출 전 관심은 모름" />
              <div className="flex gap-2">
                <Arm title="구매" count="2건" />
                <Arm title="광고 없었어도 샀을까" count="?" dashed />
              </div>
            </div>,
            <div key="two" className="space-y-2">
              <FlowNode title="노출 전 관심·조건이 비슷한 사람들" tone="accent" />
              <div className="flex gap-2">
                <Arm title="광고 봄 → 구매" count="2건" />
                <Arm title="광고 안 봄 → 구매" count="?건" dashed />
              </div>
            </div>,
            <div key="three" className="space-y-2">
              <FlowNode title="무작위로 나눈 두 쪽" sub="광고 봄 · 광고 안 봄" tone="accent" />
              <p className="text-center text-xs font-semibold leading-5 text-muted-foreground">두 쪽을 비교할 때 남는 확인</p>
              <div className="flex gap-2">
                <Arm title="실제 행동 차이" count="확인" dashed />
                <Arm title="측정 누락" count="확인" dashed />
              </div>
            </div>,
          ]}
        />
      )}
    />
  );
}
