import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 시간 절약의 가치와 토지가치 상승이 같은 개선을 반영하면 두 번 셀 수 있습니다.
 * 금액을 본문이 정하지 않았으므로 칸 크기는 금액이 아니고 겹침의 크기도 정하지 않습니다.
 */
const SCENES = [
  { label: "그대로 더하면", summary: "같은 개선을 두 번", note: "1,000분 절약의 가치와 월세 상승 10만 원이 같은 접근성 개선을 반영한다면, 독립 편익처럼 더할 때 겹친 부분이 두 번 들어갑니다." },
  { label: "겹침은 한 번만", summary: "겹침 크기는 먼저 확인", note: "얼마나 겹치는지는 사례에 정해져 있지 않습니다. 그래서 월세 상승 10만 원 안에 1,000분의 가치가 이미 들어 있는지부터 묻습니다." },
  { label: "토지가치 상승 안에 섞인 것", summary: "교통만이 아닐 수 있음", note: "TAG Unit A2.2(2025년 5월판)는 토지 가격에 반영된(자본화된) 모든 영향이 담기므로 이런 효과가 섞여 중복 계산이나 잘못된 귀속이 생길 수 있다고 경고합니다." },
] as const;

function Block({ children, tone }: { children: ReactNode; tone: "time" | "land" | "overlap" | "other" }) {
  const tones = {
    time: "border-primary bg-primary/10 text-primary",
    land: "border-slate-500 bg-slate-500/10 text-foreground",
    overlap: "border-dashed border-amber-600 bg-amber-500/15 text-amber-800 dark:text-amber-300",
    other: "border-border bg-background text-muted-foreground",
  } as const;
  return <span className={`flex min-h-14 min-w-0 flex-1 items-center justify-center rounded-md border px-1 py-2 text-center text-xs font-semibold leading-4 ${tones[tone]}`}>{children}</span>;
}

export default function OverlapViz() {
  return (
    <SceneShell
      eyebrow="중복 계산"
      title="두 금액에 같은 개선이 들어 있으면 더한 값이 부풀 수 있습니다"
      description="칸 크기는 금액이 아니고 겹침의 크기도 정해지지 않았습니다. 잉글랜드 지침의 원칙을 사례에 대입했습니다."
      ariaLabel="시간 절약의 가치와 월세 상승의 겹침, 토지가치 상승에 섞인 다른 효과"
      scenes={SCENES}
      render={(active) => {
        if (active === 2) {
          return (
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">토지가치 상승에 담길 수 있는 것</p>
              <div className="flex min-w-0 gap-1 rounded-lg border border-slate-500 p-2">
                <Block tone="overlap">직접 교통 편익과 겹치는 부분</Block>
                <Block tone="other">광역 경제 효과</Block>
                <Block tone="other">함께 시행한 다른 사업의 효과</Block>
              </div>
            </div>
          );
        }
        return (
          <div className="min-w-0 space-y-3">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">{active === 0 ? "독립 편익처럼 더한 장부" : "겹침을 한 번만 센 장부"}</p>
              <div className="flex min-w-0 gap-1">
                <Block tone="time">시간 가치의 나머지</Block>
                <Block tone="overlap">겹침?</Block>
                {active === 0 && <Block tone="overlap">겹침?</Block>}
                <Block tone="land">월세 상승의 나머지</Block>
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              {active === 0 ? "1,000분의 가치 = 앞 두 칸 · 월세 상승 10만 원 = 뒤 두 칸" : "1,000분의 가치와 월세 상승 10만 원이 가운데 칸을 함께 씁니다."}
            </p>
          </div>
        );
      }}
    />
  );
}
