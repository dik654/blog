import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 규칙·모형의 경보 → 분석가가 고객·실소유자·거래 목적 확인, 계약·송금·가격을 한 사건에 모음
 * → 설명이 충분하면 근거를 남기고 종결 / 합리적 의심이 남으면 지정된 책임자가 법·내부 기준으로 STR 여부 결정,
 *   고객에게 보고 사실을 알려서는 안 되는 의무 확인.
 * #case·#limits — 경보는 자동 신고 기준도 자동 동결 기준도 범죄 판정도 아니다.
 */
const SCENES = [
  { label: "경보", summary: "예상 100 vs 입금 1,000 · 짧은 보유 · 980 출금", step: 0, note: "규칙이나 모형이 예상 100과 입금 1,000의 차이, 짧은 포지션 보유와 980 출금을 찾아 경보를 냅니다. 경보에서 곧바로 신고나 계좌 동결로 가는 길은 없습니다. 이 계산은 자동 신고 기준도 자동 동결 기준도 아닙니다." },
  { label: "분석가 조사", summary: "고객·실소유자·거래 목적 + 자료 한 사건에", step: 1, note: "분석가는 고객과 실소유자, 거래 목적을 확인하고 관련 계약, 송금 자료와 가격을 한 사건에 모읍니다. 실제 재고 헤지, 기업 인수대금이나 담보 이동처럼 합리적 설명이 있을 수 있습니다." },
  { label: "설명이 충분하면", summary: "근거를 남기고 종결", step: 2, note: "합리적 설명과 증거가 확인되면 무엇을 확인했는지 근거를 남기고 사건을 닫습니다. 경보가 났다는 사실만으로 고객을 단정하지 않습니다." },
  { label: "합리적 의심이 남으면", summary: "지정된 책임자가 STR 여부 결정", step: 3, note: "의심이 남으면 지정된 책임자가 법과 내부 기준에 따라 의심거래보고(STR, 의심되는 거래를 금융정보분석기구(FIU)에 알리는 보고) 여부를 결정합니다. 고객에게 보고 사실을 알려서는 안 되는 의무도 확인하고, 누가 결정했는지 기록에 남깁니다." },
] as const;

function Node({ title, body, state, color }: { title: string; body: string; state: "on" | "done" | "off"; color: string }) {
  return (
    <div
      className={`min-w-0 rounded-lg border px-2 py-2 text-center text-xs leading-5 sm:text-sm ${state === "off" ? "border-dashed border-border/60 text-muted-foreground/50" : "bg-background"}`}
      style={{ borderColor: state === "off" ? undefined : color, opacity: state === "done" ? 0.7 : 1 }}
    >
      <span className="block font-semibold" style={{ color: state === "off" ? undefined : color }}>{title}</span>
      <span className="block">{body}</span>
    </div>
  );
}

function Arrow({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 12 18" className="mx-auto h-4 w-3" aria-hidden>
      <line x1={6} x2={6} y1={0} y2={12} stroke={on ? "#475569" : "#cbd5e1"} strokeWidth={1.25} />
      <polygon points="2,11 10,11 6,18" fill={on ? "#475569" : "#cbd5e1"} />
    </svg>
  );
}

export default function AlertDecisionViz() {
  return (
    <SceneShell
      eyebrow="경보에서 판단까지"
      title="경보는 조사를 여는 신호이고, 갈림길은 담당자의 확인 뒤에 옵니다"
      description="위에서 아래로 사건이 진행되고, 분석가의 확인 뒤 두 갈래로 나뉩니다. 오른쪽 위 줄 그은 칸은 경보에서 바로 가지 않는 길입니다."
      ariaLabel="경보, 분석가 조사, 종결 또는 책임자의 의심거래보고 판단으로 나뉘는 흐름"
      scenes={SCENES}
      render={(index) => {
        const step = SCENES[index].step;
        const state = (at: number): "on" | "done" | "off" => (step === at ? "on" : step > at && at < 2 ? "done" : "off");
        return (
          <div className="min-w-0 space-y-1">
            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-center gap-2">
              <Node title="① 경보" body="규칙·모형이 차이를 찾음" state={state(0)} color="#2563eb" />
              <div className={`min-w-0 rounded-lg border border-dashed px-2 py-2 text-center text-[11px] leading-4 sm:text-xs ${step === 0 ? "border-[#dc2626] text-[#b91c1c]" : "border-border/60 text-muted-foreground/60"}`}>
                <span className="block line-through">자동 신고 · 자동 동결 · 범죄 판정</span>
                <span className="block">이 길은 없음</span>
              </div>
            </div>
            <Arrow on={step >= 1} />
            <Node title="② 분석가" body="고객·실소유자·목적 확인, 계약·송금·가격을 한 사건에" state={state(1)} color="#d97706" />
            <div className="grid grid-cols-2 gap-2">
              <Arrow on={step === 2} />
              <Arrow on={step === 3} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0 space-y-1">
                <p className={`text-center text-[11px] sm:text-xs ${step === 2 ? "font-semibold" : "text-muted-foreground/60"}`}>설명이 충분함</p>
                <Node title="③ 종결" body="확인 내용과 근거를 남김" state={state(2)} color="#16a34a" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className={`text-center text-[11px] sm:text-xs ${step === 3 ? "font-semibold" : "text-muted-foreground/60"}`}>합리적 의심이 남음</p>
                <Node title="③ 지정된 책임자" body="법·내부 기준으로 STR 여부 결정 · 고객에게 알리지 않음" state={state(3)} color="#7c3aed" />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
