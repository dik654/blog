import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 지정가 주문 일부만 체결되면 남은 수량은 시장에 남거나 주문조건에 따라 취소된다.
 * 9절(#comparison)의 IOC(즉시 체결되지 않은 수량 취소)·FOK(전량 체결이 아니면 모두 취소)를 같은 주문에 적용한다.
 * 호가창(매도 A·B 330 각 1계약, C 330.05 2계약)과 내 주문(330 지정가 매수 3계약)은 설명용 가정이다.
 */
type Status = "wait" | "filled" | "resting" | "cancel";

const SCENES = [
  { label: "호가창과 내 주문", summary: "330 지정가 매수 3계약", asks: ["wait", "wait"], mine: ["wait", "wait", "wait"], note: "330 지정가 매수는 330보다 비싼 매도와는 체결되지 않습니다. 330에 걸린 매도는 A와 B 두 계약뿐이고 330.05의 C는 조건 밖입니다." },
  { label: "가격·시간 우선순위", summary: "A → B 순서로 2계약 체결", asks: ["filled", "filled"], mine: ["filled", "filled", "wait"], note: "더 유리한 가격이 먼저, 같은 가격이면 먼저 들어온 주문이 먼저입니다. 같은 330인 A가 B보다 먼저 들어왔으므로 A, B 순서로 맞춰집니다. 체결된 2계약은 그날부터 증거금과 일일정산 대상입니다." },
  { label: "남은 1계약 · 일반 지정가", summary: "체결 2 · 330 매수로 남음 1", asks: ["filled", "filled"], mine: ["filled", "filled", "resting"], note: "조건을 붙이지 않은 지정가라면 남은 1계약은 330 매수 주문으로 시장에 남아 다음 매도를 기다립니다." },
  { label: "남은 1계약 · IOC 조건", summary: "체결 2 · 취소 1", asks: ["filled", "filled"], mine: ["filled", "filled", "cancel"], note: "IOC(즉시 체결되지 않은 수량을 모두 취소)를 붙이면 체결된 2계약은 그대로 두고 남은 1계약만 바로 취소됩니다." },
  { label: "같은 주문 · FOK 조건", summary: "체결 0 · 취소 3", asks: ["wait", "wait"], mine: ["cancel", "cancel", "cancel"], note: "FOK(전량 체결이 아니면 모두 취소)는 3계약을 한꺼번에 채울 수 없으므로 하나도 체결하지 않고 전부 취소합니다. A와 B는 호가창에 그대로 남습니다." },
] as const satisfies readonly { label: string; summary: string; asks: readonly Status[]; mine: readonly Status[]; note: string }[];

const STATUS_STYLE: Record<Status, { text: string; cls: string }> = {
  wait: { text: "대기", cls: "border-border text-muted-foreground" },
  filled: { text: "체결", cls: "border-[#2563eb] bg-[#2563eb]/10 font-semibold text-[#1d4ed8] dark:text-[#93c5fd]" },
  resting: { text: "330 매수로 남음", cls: "border-dashed border-[#d97706] font-semibold text-[#b45309] dark:text-[#fbbf24]" },
  cancel: { text: "취소", cls: "border-dashed border-[#94a3b8] text-[#64748b] line-through" },
};

export default function PartialFillViz() {
  return (
    <SceneShell
      eyebrow="일부 체결과 남은 수량"
      title="3계약 중 2계약만 체결되면 남은 1계약은 주문조건이 정합니다"
      description="호가창은 지금 걸려 있는 매수·매도 주문의 목록입니다. 왼쪽은 매도 주문, 오른쪽은 내 주문의 계약별 상태입니다. 주문 수량과 호가는 설명용 가정입니다(가정)."
      ariaLabel="330 지정가 매수 3계약이 가격과 시간 우선순위로 2계약 체결된 뒤 일반 지정가, IOC, FOK 조건에 따라 남은 수량이 달라지는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const asks = [
          { name: "매도 A", price: "330.00", detail: "1계약 · 먼저 들어옴", status: scene.asks[0] as Status },
          { name: "매도 B", price: "330.00", detail: "1계약 · 나중에 들어옴", status: scene.asks[1] as Status },
        ];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-bold text-muted-foreground">매도 호가창</p>
              <div className="flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2 text-xs opacity-60">
                <span><strong>매도 C</strong> · 2계약</span>
                <span className="font-mono">330.05 · 조건 밖</span>
              </div>
              {asks.map((ask) => (
                <div key={ask.name} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${STATUS_STYLE[ask.status].cls}`}>
                  <span><strong>{ask.name}</strong> · {ask.detail}</span>
                  <span className="font-mono">{ask.price} · {ask.status === "filled" ? "체결" : "대기"}</span>
                </div>
              ))}
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-xs font-bold text-muted-foreground">내 주문 · 330 지정가 매수</p>
              {scene.mine.map((status, slot) => (
                <div key={slot} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs ${STATUS_STYLE[status as Status].cls}`}>
                  <span>{slot + 1}번째 계약</span>
                  <span>{STATUS_STYLE[status as Status].text}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
