import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 세 거래의 조건·식별자 대사 → 순 위험 0 확인 → 양쪽 승인 → 정한 시각에 종료
 * → 거래 장부를 닫고 평가액·담보 호출·회계·거래보고 상태 갱신. 한 장부에 옛 거래가 남으면 이중 계산이나
 * 잘못된 담보 반환이 생길 수 있음. 마지막 장면에서 담보 호출 장부를 고른 것은 예시(가정)입니다.
 */
type Status = "live" | "closed" | "stale" | "pending";

const LEDGERS = ["거래 장부", "평가액", "담보 호출", "회계", "거래보고"] as const;

const STATUS_TEXT: Record<Status, string> = {
  live: "3건 살아 있음",
  pending: "갱신 전 · 3건",
  closed: "0건 · 종료 반영",
  stale: "옛 3건 남음",
};

const STATUS_STYLE: Record<Status, string> = {
  live: "border-border",
  pending: "border-dashed border-[#d97706]",
  closed: "border-[#16a34a]",
  stale: "border-[#dc2626] border-2",
};

const SCENES = [
  { label: "조건·식별자 대사", summary: "+100 −60 −40 = 0 확인", trades: "대사 완료", approvals: [false, false], ledgers: ["live", "live", "live", "live", "live"] as Status[], note: "수취 100과 지급 60·40의 조건과 거래 식별자를 양쪽 장부에서 맞추고 순 위험이 0인지 확인합니다. 아직 어떤 장부에서도 계약은 살아 있습니다." },
  { label: "양쪽 승인", summary: "허용오차 안 → 승인", trades: "종료 예정", approvals: [true, true], ledgers: ["live", "live", "live", "live", "live"] as Status[], note: "결과가 각자 정한 허용오차 안이라는 것을 두 당사자가 모두 승인해야 다음으로 넘어갑니다. 계산만 끝났다고 계약이 사라지지 않습니다." },
  { label: "정한 시각에 종료", summary: "거래 장부에서 세 건 닫힘", trades: "종료", approvals: [true, true], ledgers: ["closed", "pending", "pending", "pending", "pending"] as Status[], note: "정한 시각에 세 거래를 종료하고 거래 장부에서 계약을 닫습니다. 이 순간 다른 장부는 아직 옛 상태를 들고 있습니다." },
  { label: "나머지 장부 갱신", summary: "다섯 칸 모두 0건", trades: "종료", approvals: [true, true], ledgers: ["closed", "closed", "closed", "closed", "closed"] as Status[], note: "평가액·담보 호출·회계·거래보고의 상태까지 갱신하면 모든 장부가 같은 결과를 가리킵니다. 그다음 사후 대사로 서로 같은지 다시 맞춥니다." },
  { label: "한 장부만 남으면", summary: "이중 계산·잘못된 담보 반환 위험", trades: "종료", approvals: [true, true], ledgers: ["closed", "closed", "stale", "closed", "closed"] as Status[], note: "한 장부에 옛 거래가 남으면 이중 계산이나 잘못된 담보 반환이 생길 수 있습니다. 여기서는 담보 호출 장부를 예로 골랐습니다(가정). 그래서 되돌림 절차와 사후 대사를 압축 설계에 넣습니다." },
] as const;

export default function LedgerSyncViz() {
  return (
    <SceneShell
      eyebrow="종료와 장부"
      title="세 거래를 닫은 뒤 모든 장부가 같은 답을 가리켜야 끝납니다"
      description="위 줄은 압축 대상 세 거래, 가운데는 두 당사자의 승인, 아래 다섯 칸은 같은 거래를 따로 들고 있는 장부입니다."
      ariaLabel="세 거래의 대사, 승인, 종료와 다섯 장부의 상태 갱신 순서"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-2 text-center">
              {["수취 100", "지급 60", "지급 40"].map((trade) => (
                <div key={trade} className={`rounded-lg border px-1 py-2 ${scene.trades === "종료" ? "border-dashed border-border/60 text-muted-foreground" : "border-border"}`}>
                  <strong className={`block ${scene.trades === "종료" ? "line-through" : ""}`}>{trade}</strong>
                  <span className="text-muted-foreground">{scene.trades}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              {["당사자 A", "당사자 B"].map((party, n) => (
                <div key={party} className={`rounded-lg border px-1 py-2 ${scene.approvals[n] ? "border-[#16a34a]" : "border-dashed border-border"}`}>
                  <strong className="block">{party}</strong>
                  <span className={scene.approvals[n] ? "font-semibold text-[#15803d] dark:text-green-400" : "text-muted-foreground"}>{scene.approvals[n] ? "승인 ✓" : "승인 대기"}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {LEDGERS.map((ledger, n) => {
                const status = scene.ledgers[n];
                return (
                  <div key={ledger} className={`rounded-lg border px-1 py-2 text-center ${STATUS_STYLE[status]}`}>
                    <strong className="block">{ledger}</strong>
                    <span className={status === "stale" ? "font-semibold text-[#b91c1c] dark:text-red-400" : status === "closed" ? "text-[#15803d] dark:text-green-400" : "text-muted-foreground"}>{STATUS_TEXT[status]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
