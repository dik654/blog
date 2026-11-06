import SceneShell from "./SceneShell";

/**
 * 본문 대응: need 절 — A 마을 연초 100명의 구성(가정). 0–14세 20, 15–64세 60, 65세 이상 20.
 * 15–64세 60명 중 실제 유급 취업자 45, 나머지 15.
 */
const SCENES = [
  { label: "나이로 나누기", summary: "20 + 60 + 20 = 100명", note: "칸 하나가 한 사람입니다. 연초의 나이만 보면 15–64세가 60명입니다. 이 숫자만으로는 그 60명이 지금 무엇을 하는지 알 수 없습니다." },
  { label: "실제 취업자 표시", summary: "60명 중 유급 취업자 45명 · 15명 차이", note: "60명 모두를 유급 취업자로 세면 실제 45명보다 15명을 더 셉니다. 이 15명에는 공부하거나 구직하는 사람, 건강상 일을 못 하는 사람, 가족을 돌보는 사람이 있을 수 있습니다." },
] as const;

function Cells({ count, filled, tone }: { count: number; filled: number; tone: "plain" | "work" | "dim" }) {
  return (
    <div className="grid grid-cols-20 gap-[3px]" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const on = i < filled;
        const look =
          tone === "work"
            ? on
              ? "border-primary bg-primary/60"
              : "border-dashed border-[#b45309] bg-background"
            : tone === "plain"
              ? "border-primary/60 bg-primary/25"
              : "border-[#64748b]/60 bg-[#64748b]/25";
        return <span key={i} className={`aspect-square rounded-[2px] border transition-colors duration-300 motion-reduce:transition-none ${look}`} />;
      })}
    </div>
  );
}

export default function AgeGridViz() {
  return (
    <SceneShell
      eyebrow="A 마을 100명"
      title="15–64세 60명이 모두 유급 취업자는 아닙니다"
      description="한 줄에 스무 칸, 칸 하나가 한 사람입니다. 숫자는 모두 이 글이 놓은 가정이고 연초 기준입니다."
      ariaLabel="A 마을 100명의 나이 구성과 15에서 64세 중 실제 취업자"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div>
            <p className="mb-1 text-xs font-semibold">0–14세 <span className="font-mono">20명</span></p>
            <Cells count={20} filled={20} tone="dim" />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold">
              15–64세 <span className="font-mono">60명</span>
              <span className={active === 1 ? "font-normal text-muted-foreground" : "invisible"}> · 진한 칸 유급 취업자 45명, 점선 칸 15명</span>
            </p>
            <Cells count={60} filled={active === 1 ? 45 : 60} tone={active === 1 ? "work" : "plain"} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold">65세 이상 <span className="font-mono">20명</span></p>
            <Cells count={20} filled={20} tone="dim" />
          </div>
        </div>
      )}
    />
  );
}
