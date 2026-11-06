import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #parliamentary — P의 패배 뒤 의원내각제에서 갈라지는 경로.
 * 다른 과반 유무, 소수정부·해산, 후임 동시 선출 규칙이 어느 가지를 여는지 같은 나무 위에 표시한다.
 * 151 = 300석의 과반. 나당+다당 = 140+20 = 160.
 */
const SCENES = [
  { label: "P가 졌습니다", summary: "찬성 140 · 반대 160", note: "나당·다당 160석이 151을 넘어 P는 집니다. 하지만 이 패배가 자동으로 불신임인지는 헌법과 의사 규칙에 따라 다르므로, 아직 정부가 물러난다고 말할 수 없습니다." },
  { label: "별도의 신임 절차", summary: "교체 경로가 일상 절차로 열림", note: "“한 표결이면 언제나 즉시 퇴진”이 아닙니다. 의회 다수는 별도의 신임 절차로 내각을 바꿀 수 있고, 그다음 질문은 그 다수가 다른 정부를 세울 수 있는가입니다." },
  { label: "다른 과반이 있을 때", summary: "교착 → 정부 교체", note: "나당·다당 160석이 다른 정부를 세울 수 있다면 대통령제의 정책 교착이 정부 교체로 풀릴 수 있습니다." },
  { label: "다른 과반이 없을 때", summary: "소수정부 또는 해산·총선", note: "나당·다당이 P에 함께 반대해도 정부까지 함께 세우지 못하는 경우입니다. 소수정부는 과반 없이 서 있는 정부입니다. 소수정부가 남거나, 헌법이 정한 조건에서 의회를 해산하고 총선으로 갈 수 있습니다. 해산은 모든 나라에서 총리가 마음대로 누르는 버튼이 아닙니다." },
  { label: "후임을 함께 뽑게 하면", summary: "반대 160만으로는 부족", note: "독일 기본법 제67조는 재적 과반으로 후임 총리를 뽑을 때만 불신임을 표시하게 합니다. 이 규칙을 가상 의회에 얹으면(가정) 나당·다당이 후임에 합의하지 못하는 한 160석이 반대해도 정부를 쓰러뜨리기 어렵고, 140석 정부는 소수정부로 남을 수 있습니다." },
] as const;

function Node({ on, strong, children }: { on: boolean; strong?: boolean; children: ReactNode }) {
  return (
    <div
      className={`rounded-lg border px-2 py-1.5 text-center text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${on ? "" : "opacity-35"} ${
        strong && on ? "border-primary bg-primary/10 font-semibold" : "border-border bg-background"
      }`}
    >
      {children}
    </div>
  );
}

function Stem({ on }: { on: boolean }) {
  return <div className={`mx-auto h-3 w-px bg-border ${on ? "bg-foreground" : ""}`} />;
}

export default function ConfidenceBranchViz() {
  return (
    <SceneShell
      eyebrow="정부 교체의 갈림길"
      title="P가 진 다음, 의원내각제는 어느 가지로 갑니까"
      description="가상 의회 140·140·20석을 그대로 씁니다. 표시된 가지는 열릴 수 있는 경로이며, 어느 가지가 실제로 열리는지는 신임 규칙과 해산 권한에 달렸습니다."
      ariaLabel="예산안 P의 패배 뒤 신임 절차, 다른 과반 유무, 정부 교체와 소수정부와 해산으로 갈라지는 경로"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="relative mb-1 flex h-6 overflow-hidden rounded-sm text-[11px] font-bold leading-6 text-center">
            <div style={{ width: `${(140 / 300) * 100}%`, backgroundColor: "#4f46e526", color: "#4338ca" }}>가당 140</div>
            <div style={{ width: `${(140 / 300) * 100}%`, backgroundColor: "#d9770626", color: "#b45309" }}>나당 140</div>
            <div style={{ width: `${(20 / 300) * 100}%`, backgroundColor: "#05966926", color: "#047857" }}>다</div>
            <div className="absolute inset-y-0 w-px" style={{ left: `${(151 / 300) * 100}%`, backgroundColor: "#dc2626" }} />
          </div>
          <p className="mb-2 text-[11px] leading-4 text-muted-foreground">붉은 선 151석 · 오른쪽 끝 다당 20석</p>
          <Node on strong={active === 0}>예산안 P 부결</Node>
          <Stem on={active >= 1} />
          <Node on={active >= 1} strong={active === 1}>별도의 신임 절차로 내각을 바꾸려 하는가</Node>
          <Stem on={active >= 2} />
          <Node on={active >= 2} strong={active === 2 || active === 3}>다른 과반이 정부를 세울 수 있는가</Node>
          <div className={`mt-1.5 rounded-md border border-dashed px-2 py-1 text-center text-xs leading-5 ${active === 4 ? "" : "invisible"}`} style={{ borderColor: "#d97706" }}>
            독일: 후임을 재적 과반으로 함께 뽑아야 불신임
          </div>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <p className="text-center text-xs font-bold leading-5">있음</p>
            <p className="col-span-2 text-center text-xs font-bold leading-5">없음</p>
            <Node on={active === 2 || active === 4} strong={active === 2}>정부 교체</Node>
            <Node on={active === 3 || active === 4} strong={active === 3 || active === 4}>소수정부 남음</Node>
            <Node on={active === 3} strong={active === 3}>해산·총선(조건부)</Node>
          </div>
        </div>
      )}
    />
  );
}
