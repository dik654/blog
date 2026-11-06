import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism(가구별 요구, 식민지의 약속과 대우 차이)과 #picture(본국·식민지 비교).
 * 본문이 이 절에서 결과를 적지 않은 경로는 결과 칸을 비워 두고 그렇게 표시합니다.
 */
const PATHS = [
  { label: "직접 동원 25가구", summary: "연금·고용·대표", who: "병사와 군수 노동자", demand: "전후 연금·고용·대표", result: "", note: "3절에서 가정한 25가구의 병사와 군수 노동자가 내는 요구입니다." },
  { label: "할당 생산 35가구", summary: "물가 안정·생활 보장", who: "배급을 견딘 가구", demand: "물가 안정과 생활 보장", result: "", note: "배급을 견딘 35가구(가정)의 요구입니다. 돌봄·필수 서비스 25가구의 요구는 이 절에 따로 없어 그리지 않았습니다." },
  { label: "피란과 상실", summary: "막힐 수 있음", who: "피란과 상실을 겪은 가구", demand: "귀환·국적·재산 회복", result: "새 국경과 소수자 규칙이 막을 수 있음", note: "요구가 언제나 막힌 것은 아니고, 새 국경과 소수자 규칙이 이를 막을 수 있습니다." },
  { label: "식민지 병사와 노동자", summary: "평화 때 미뤄짐", who: "식민지 병사와 노동자", demand: "희생을 근거로 자치와 독립", result: "제국은 정치적 동등성을 미룸", note: "제국은 전쟁 때에는 동등한 충성을 요청하면서 평화 때에는 정치적 동등성을 미뤘습니다." },
] as const;

const SCENES = [
  ...PATHS,
  { label: "약속과 대우의 차이", summary: "파업·봉기·독립운동의 자원", note: "약속과 대우의 이 차이가 파업·봉기·독립운동의 자원이 됐습니다." },
] as const;

function Step({ tag, text, tone }: { tag: string; text: string; tone?: "demand" | "block" | "empty" }) {
  const style = tone === "demand" ? { borderColor: "#2563eb", backgroundColor: "#2563eb14" } : tone === "block" ? { borderColor: "#dc2626", backgroundColor: "#dc262614" } : undefined;
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 ${tone === "empty" ? "border-dashed border-border/70 text-muted-foreground" : tone ? "" : "border-border bg-background"}`} style={style}>
      <span className="block text-xs text-muted-foreground">{tag}</span>
      <span className="block text-sm font-semibold leading-5">{text}</span>
    </div>
  );
}

const ARROW = <span className="py-0.5 text-center font-mono text-muted-foreground sm:px-1 sm:py-0" aria-hidden="true"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span>;

export default function DemandBranchViz() {
  return (
    <SceneShell
      eyebrow="동원에서 요구로"
      title="어디서 희생했는지에 따라 전후의 요구와 막히는 지점이 달라집니다"
      description="누가 → 어떤 요구를 → 무엇에 부딪히는지 순서로 읽습니다. 25·35가구는 3절에서 가정한 수입니다."
      ariaLabel="가구와 식민지 주민의 전후 요구 경로와 약속과 대우의 차이"
      scenes={SCENES}
      render={(active) => {
        if (active === PATHS.length) {
          return (
            <div className="min-w-0 text-sm">
              <div className="rounded-lg border border-border bg-background px-3 py-2 text-center font-semibold leading-5">같은 군복·같은 물자</div>
              <div className="py-1 text-center font-mono text-muted-foreground" aria-hidden="true">↙ ↘</div>
              <div className="grid grid-cols-2 gap-2">
                <Step tag="본국의 시민" text="연금·투표권 확대·전후 주택을 요구할 수 있었음" />
                <Step tag="식민지 주민" text="정치적 대표와 전후 보상을 똑같이 받지 못함" tone="block" />
              </div>
              <div className="py-1 text-center font-mono text-muted-foreground" aria-hidden="true">↓</div>
              <Step tag="그 차이가 된 것" text="파업·봉기·독립운동의 자원" tone="demand" />
            </div>
          );
        }
        const path = PATHS[active];
        return (
          <div className="flex min-w-0 flex-col sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
            <Step tag="누가" text={path.who} />
            {ARROW}
            <Step tag="요구" text={path.demand} tone="demand" />
            {ARROW}
            {path.result ? <Step tag="부딪히는 것" text={path.result} tone="block" /> : <Step tag="부딪히는 것" text="이 절에는 적혀 있지 않음" tone="empty" />}
          </div>
        );
      }}
    />
  );
}
