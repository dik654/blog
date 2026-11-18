import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 대출 100×5%=5, 예금 80×2%=1.6 → 3.4, 예금 80×3%=2.4 → 2.6(−0.8).
 * 설명용 명목 80 스왑(변동 수취·고정 지급): 기준금리 +1%p → 변동 수취 +80×1%=0.8, 고정 지급 변화 0.
 * 스왑의 고정금리·변동금리 수준은 본문에 없으므로 금액이 아니라 "변화량"만 숫자로 적습니다.
 */
const SCALE = 1;

const SCENES = [
  { label: "충격 전", summary: "5 − 1.6 = 3.4", deposit: 1.6, swap: false, changes: [0, null, null, 0] as (number | null)[], note: "고정금리 대출 100에서 연 5를 받고, 금리가 바뀌는 예금 80에 연 2%인 1.6을 냅니다. 다른 비용을 빼기 전 이자 차이는 3.4입니다. 아래 변화 칸은 이 상태를 기준 0으로 둡니다." },
  { label: "예금금리 2% → 3%", summary: "5 − 2.4 = 2.6 (−0.8)", deposit: 2.4, swap: false, changes: [-0.8, null, null, -0.8] as (number | null)[], note: "대출 수입 5는 고정이라 그대로이고 예금 비용만 80×3% = 2.4로 늘어납니다. 이자 차이는 2.6으로 0.8 줄어듭니다." },
  { label: "명목 80 스왑을 더하면", summary: "−0.8 + 0.8 = 0", deposit: 2.4, swap: true, changes: [-0.8, 0.8, 0, 0] as (number | null)[], note: "설명용 스왑에서 변동금리를 받고 고정금리를 냅니다. 기준금리가 1%포인트 오르면 변동 수취액이 80×1% = 0.8 늘고 고정 지급액은 그대로라 예금 비용 증가분을 상쇄합니다. 지급일·기준금리·할인·스프레드가 맞지 않으면 실제 상쇄액은 달라집니다." },
] as const;

const CHANGE_ROWS = ["예금 비용 영향", "변동 수취 영향", "고정 지급 영향", "이자 차이 합계"] as const;

function ChangeBar({ label, value, strong }: { label: string; value: number | null; strong: boolean }) {
  const width = value === null ? 0 : (Math.abs(value) / SCALE) * 50;
  const color = value !== null && value < 0 ? "#dc2626" : "#16a34a";
  return (
    <div className="grid grid-cols-[6.75rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <span className="absolute inset-y-0 left-1/2 w-px bg-[#94a3b8]" />
        {value !== null && value !== 0 ? (
          <span className="absolute inset-y-0 rounded-sm" style={{ width: `${width}%`, left: value < 0 ? `${50 - width}%` : "50%", backgroundColor: color }} />
        ) : null}
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value === null ? "없음" : value === 0 ? "0" : `${value > 0 ? "+" : "−"}${Math.abs(value)}`}</span>
    </div>
  );
}

export default function SwapOffsetViz() {
  return (
    <SceneShell
      eyebrow="스왑 상쇄"
      title="예금 비용 0.8 증가를 스왑의 변동 수취 0.8이 메웁니다"
      description="금리스왑은 같은 명목금액에 대해 한쪽은 고정금리 이자를, 다른 쪽은 변동금리 이자를 주고받는 계약입니다. 예금금리와 스왑의 기준금리가 똑같이 1%포인트 오른다고 놓은 설명용 사례이며(가정), 스왑의 고정금리 수준은 본문에 없어 변화량만 적었습니다."
      ariaLabel="예금금리 상승으로 줄어든 이자 차이를 명목 80 금리스왑이 상쇄하는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 text-center text-xs sm:gap-2">
              <div className="rounded-lg border border-border p-2"><strong className="block">대출 고객</strong><span className="text-muted-foreground">고정 100</span></div>
              <span className="font-mono text-[#16a34a]">5→</span>
              <div className="rounded-lg border-2 border-[#2563eb] p-2"><strong className="block">은행</strong><span className="text-muted-foreground">이자 차이</span></div>
              <span className={`font-mono ${index > 0 ? "font-bold text-[#dc2626]" : "text-[#b45309]"}`}>→{scene.deposit}</span>
              <div className="rounded-lg border border-border p-2"><strong className="block">예금자</strong><span className="text-muted-foreground">변동 80</span></div>
            </div>
            <div className={`mx-auto grid max-w-sm grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-2 text-center text-xs ${scene.swap ? "" : "opacity-30"}`}>
              <div className="space-y-1 font-mono">
                <p className="text-[#16a34a]">← 변동 수취 {scene.swap ? "+0.8" : ""}</p>
                <p className="text-muted-foreground">→ 고정 지급 {scene.swap ? "변화 0" : ""}</p>
              </div>
              <div className="rounded-lg border border-dashed border-border p-2"><strong className="block">스왑 상대방</strong><span className="text-muted-foreground">{scene.swap ? "명목 80" : "아직 계약 없음"}</span></div>
            </div>
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-[11px] text-muted-foreground">충격 전 대비 은행의 연간 이자 차이에 주는 영향 (왼쪽 = 줄어듦)</p>
              {CHANGE_ROWS.map((row, rowIndex) => (
                <ChangeBar key={row} label={row} value={scene.changes[rowIndex]} strong={rowIndex === 3} />
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
