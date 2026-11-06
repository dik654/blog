import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — "다수가 원했다"와 "규칙이 정당하다" 사이의 다섯 조건.
 * 조건의 순서와 사례는 글 그대로이고, 통과·탈락을 정하지 않습니다(글: 정답 공식을 주지 않습니다).
 */
const CHECKS = [
  { short: "권한", material: ["관리 주체", "영업 허가 전면 금지"], ask: "이 금지를 할 권한까지 위임받았는가" },
  { short: "이유", material: ["소음 기록", "민원 시간"], ask: "공개해서 왜 밤 10시인지 설명하는가" },
  { short: "대안", material: ["방음", "주류 판매 제한", "약국 예외"], ask: "전면 금지보다 덜 제한적인 수단과 비교했는가" },
  { short: "같은 기준", material: ["같은 소음을 내는 가게"], ask: "같은 기준으로 처리하는가" },
  { short: "재심", material: ["15가구", "점포"], ask: "자료를 내고 재심을 청구할 통로가 있는가" },
] as const;

const SCENES = [
  { label: "첫째, 권한", summary: "위임의 범위", note: "위임은 구성원이 결정 권한을 맡긴 것입니다. 60표가 나와도 맡긴 범위가 전면 금지까지 닿는지는 따로 봅니다." },
  { label: "둘째, 이유", summary: "자료 공개", note: "소음 기록과 민원 시간을 공개해 왜 하필 밤 10시인지 설명합니다." },
  { label: "셋째, 대안", summary: "덜 제한적인 수단", note: "전면 금지 하나만 놓지 않고 방음, 주류 판매 제한, 약국 예외처럼 덜 제한적인 수단을 비교합니다." },
  { label: "넷째, 같은 기준", summary: "공평한 처리", note: "같은 소음을 내는 가게를 같은 기준으로 처리합니다." },
  { label: "다섯째, 재심", summary: "다툴 통로", note: "15가구와 점포가 자료를 내고 재심을 청구할 통로를 둡니다." },
  { label: "두 끝 사이", summary: "60표의 몫 · 다섯 조건의 몫", note: "60표는 결정을 시작하게 하고, 다섯 조건이 강제력의 범위를 정합니다. 이 검사는 정답 공식을 주지 않고 빠진 질문을 드러냅니다." },
] as const;

function Rail({ active }: { active: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs font-bold">
        <span className="rounded-md border border-[#2563eb] px-2 py-1 text-[#2563eb]">다수가 원했다 · 60표</span>
        <span className="rounded-md border border-dashed border-border px-2 py-1 text-muted-foreground">규칙이 정당하다?</span>
      </div>
      <ol className="relative mt-3 grid grid-cols-5">
        <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[14px] h-px bg-border" />
        {CHECKS.map((check, index) => {
          const current = index === active;
          const seen = index < active;
          return (
            <li key={check.short} className="relative flex min-w-0 flex-col items-center gap-1 text-center">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${current ? "border-[#d97706] bg-[#d97706] text-white" : seen ? "border-[#2563eb] bg-background text-[#2563eb]" : "border-dashed border-border bg-background text-muted-foreground"}`}>{index + 1}</span>
              <span className={`text-[11px] leading-4 sm:text-xs ${current ? "font-bold text-foreground" : "text-muted-foreground"}`}>{check.short}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Panel({ index }: { index: number }) {
  const check = CHECKS[index];
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">글의 사례에서 볼 것</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {check.material.map((item) => <li key={item} className="rounded-md border border-border px-2 py-1 text-sm">{item}</li>)}
        </ul>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">묻는 것</p>
        <p className="mt-2 text-sm font-semibold leading-6">{check.ask}</p>
      </div>
    </div>
  );
}

export default function FiveChecksViz() {
  return (
    <SceneShell
      eyebrow="빠진 질문"
      title="“다수가 원했다”와 “규칙이 정당하다” 사이의 다섯 칸"
      description="같은 60표를 놓고 다섯 칸을 차례로 묻습니다. 물은 칸의 파란 테두리는 물었다는 표시일 뿐, 합격이 아닙니다. 글이 사례의 답을 정하지 않기 때문입니다."
      ariaLabel="60표와 규칙이 정당하다는 판단 사이에서 권한, 이유, 대안, 같은 기준, 재심을 차례로 묻는 경로. 통과 여부는 표시하지 않음"
      scenes={SCENES}
      render={(active) => (
        <div>
          <Rail active={active} />
          <StableSceneStack
            active={active}
            className="mt-4"
            scenes={[
              ...CHECKS.map((_, index) => <Panel key={index} index={index} />),
              <div key="both" className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">60표가 하는 일</p>
                  <p className="mt-2 text-sm font-semibold leading-6">결정을 시작하게 합니다</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">다섯 조건이 하는 일</p>
                  <p className="mt-2 text-sm font-semibold leading-6">강제력의 범위를 정합니다</p>
                </div>
              </div>,
            ]}
          />
        </div>
      )}
    />
  );
}
