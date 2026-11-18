import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture (4절) — 권유가 있으면 적합성, 권유 없이 고객이 스스로 찾은 거래에는
 * 법이 정한 상품에 한해 적정성 절차가 적용될 수 있음. 두 경로 모두 고객 정보를 상품 손실 구조와 맞춰 봄.
 */
type Focus = "advice" | "self" | "common";

const SCENES: readonly { label: string; summary: string; note: string; focus: Focus }[] = [
  { label: "판매자가 권하면", summary: "적합성 원칙", focus: "advice", note: "판매자가 계약을 권하는 경우 고객 정보를 파악하고, 그 고객에게 적합하지 않은 계약은 권하지 않는 적합성 원칙이 중심이 됩니다." },
  { label: "고객이 스스로 찾으면", summary: "법이 정한 상품 → 적정성 절차", focus: "self", note: "권유 없이 고객이 특정 위험 상품을 사려 해도, 법이 정한 상품이면 정보를 파악해 적정하지 않음을 알리고 확인받는 절차가 적용될 수 있습니다." },
  { label: "두 길 모두 맞춰 볼 것", summary: "고객 네 항목 ↔ 손실 구조", focus: "common", note: "어느 쪽도 설문 점수 하나로 끝나지 않습니다. 어떤 규칙이 적용되는지는 국가·고객 유형·상품·판매 경로에 따라 달라지므로 현행 법령과 내부 기준을 확인해야 합니다." },
];

const FACTORS = ["투자 목적", "투자 기간", "손실 감내 능력", "거래 경험"] as const;

function Box({ title, body, on, tone = "sky" }: { title: string; body: string; on: boolean; tone?: "sky" | "amber" }) {
  const onCls = tone === "sky" ? "border-sky-600 bg-sky-600/10" : "border-amber-600 bg-amber-500/10";
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${on ? onCls : "border-border/60 text-muted-foreground"}`}>
      <span className="block text-sm font-semibold">{title}</span>
      <span className="block">{body}</span>
    </div>
  );
}

export default function SuitabilityBranchViz() {
  return (
    <SceneShell
      eyebrow="적합성과 적정성"
      title="권유가 있었는지가 어느 규칙을 먼저 볼지 가릅니다"
      description="위쪽은 거래가 시작된 방식에 따른 갈림길이고, 아래쪽은 두 길이 함께 확인하는 항목입니다. 한국 법 기준의 큰 원칙이며 관할마다 다릅니다."
      ariaLabel="판매자 권유가 있으면 적합성, 고객이 스스로 찾은 거래에는 적정성 절차가 적용될 수 있음을 보이는 갈림길"
      scenes={SCENES}
      render={(index) => {
        const { focus } = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            <div className="rounded-lg border border-border px-3 py-1.5 text-center text-xs font-semibold">고객이 위험 상품 계약을 하려 함</div>
            <div className="grid grid-cols-2 gap-2 text-center text-[11px] text-muted-foreground sm:text-xs">
              <span className={focus === "advice" ? "font-bold text-foreground" : ""}>↓ 판매자가 권유함</span>
              <span className={focus === "self" ? "font-bold text-foreground" : ""}>↓ 권유 없이 스스로</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Box title="적합성" body="고객 정보 파악 · 부적합한 계약은 권하지 않음" on={focus === "advice" || focus === "common"} />
              <Box title="적정성" body="법이 정한 상품이면 정보 파악 · 적정하지 않음을 알리고 확인받음 (적용될 수 있음)" on={focus === "self" || focus === "common"} tone="amber" />
            </div>
            <div className={`rounded-lg border px-3 py-2 ${focus === "common" ? "border-primary" : "border-border/60"}`}>
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,0.8fr)] items-center gap-2 text-xs">
                <div className="flex flex-wrap gap-1">
                  {FACTORS.map((f) => (
                    <span key={f} className={`rounded border px-1.5 py-0.5 ${focus === "common" ? "border-primary/60" : "border-border/60 text-muted-foreground"}`}>
                      {f}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-muted-foreground">↔</span>
                <span className={`rounded border px-1.5 py-0.5 text-center ${focus === "common" ? "border-red-600" : "border-border/60 text-muted-foreground"}`}>상품의 손실 구조</span>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground sm:text-xs">설문 점수 하나로 끝나지 않음</p>
            </div>
          </div>
        );
      }}
    />
  );
}
