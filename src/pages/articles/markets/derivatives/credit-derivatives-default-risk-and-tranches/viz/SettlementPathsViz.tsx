import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box 둘째 문단 — 현물결제는 부실채권을 넘기고 액면을 받고, 현금결제는 액면과 회수 가격의 차이를 받는다.
 * 숫자는 3절의 명목 1억 원·회수 40%를 미리 쓴다. 현물결제에서 넘기는 채권의 가치도 같은 40으로 둔다(가정).
 * 현물: 매수자 손 = 액면 1억 / 현금: 채권 4,000만 + 지급 6,000만 = 1억. 매도자 순부담은 둘 다 6,000만.
 */
interface Holding {
  bond: string | null;
  cash: string;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  buyer: Holding;
  seller: Holding;
  toSeller: string;
  toBuyer: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "신용사건 직후",
    summary: "채권 액면 1억 원, 가치 4,000만 원",
    note: "은행(보호매수자)은 액면 1억 원짜리 채권을 들고 있고, 그 가치는 액면의 40%인 4,000만 원으로 둡니다(3절 숫자, 가정). 아직 아무것도 오가지 않았습니다.",
    buyer: { bond: "가치 4,000만", cash: "0" },
    seller: { bond: null, cash: "0" },
    toSeller: "",
    toBuyer: "",
  },
  {
    label: "현물결제",
    summary: "채권을 넘기고 액면 1억 원",
    note: "보호매수자는 인도 가능한 부실채권을 넘기고 액면 1억 원을 받습니다. 보호매도자는 1억 원을 내고 4,000만 원 가치의 채권을 받으니 순부담은 6,000만 원입니다. 어느 채무를 넘길 수 있는지는 계약과 결정 절차가 정합니다.",
    buyer: { bond: null, cash: "+1억" },
    seller: { bond: "가치 4,000만", cash: "−1억" },
    toSeller: "부실채권 →",
    toBuyer: "← 액면 1억",
  },
  {
    label: "현금결제",
    summary: "1억 × (1 − 0.40) = 6,000만 원",
    note: "채권은 은행에 남고, 경매 등으로 정한 회수 가격 40과 액면 100의 차이만 현금으로 받습니다. 은행 손에는 채권 4,000만 원과 현금 6,000만 원이 있습니다. 이 예는 두 결제의 회수 가치를 같은 40으로 뒀을 뿐이며, 실제로는 인도·정산 조건 때문에 결과가 다를 수 있습니다.",
    buyer: { bond: "가치 4,000만", cash: "+6,000만" },
    seller: { bond: null, cash: "−6,000만" },
    toSeller: "",
    toBuyer: "← 차액 6,000만",
  },
];

function Party({ title, holding }: { title: string; holding: Holding }) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-3">
      <div className="text-xs font-bold sm:text-sm">{title}</div>
      <div className="mt-2 space-y-2 text-xs sm:text-sm">
        <div className={`rounded-md border px-2 py-1.5 ${holding.bond ? "border-[#2563eb] text-[#2563eb]" : "border-dashed border-border text-muted-foreground"}`}>
          <span className="block text-[11px] text-muted-foreground">채권</span>
          <span className="font-mono font-bold">{holding.bond ?? "없음"}</span>
        </div>
        <div className={`rounded-md border px-2 py-1.5 ${holding.cash.startsWith("+") ? "border-[#16a34a] text-[#16a34a]" : holding.cash.startsWith("−") ? "border-[#dc2626] text-[#dc2626]" : "border-dashed border-border text-muted-foreground"}`}>
          <span className="block text-[11px] text-muted-foreground">결제로 오간 현금(원)</span>
          <span className="font-mono font-bold">{holding.cash}</span>
        </div>
      </div>
    </div>
  );
}

export default function SettlementPathsViz() {
  return (
    <SceneShell
      eyebrow="두 결제 방식"
      title="현물결제와 현금결제는 무엇이 움직이는지가 다릅니다"
      description="왼쪽은 프리미엄을 내고 보호를 산 은행(보호매수자), 오른쪽은 손실 지급을 약속한 보호매도자입니다. 3절의 명목 1억 원·회수 40%를 미리 썼고, 그동안 낸 프리미엄은 빼고 그렸습니다."
      ariaLabel="현물결제와 현금결제에서 채권과 현금이 오가는 방향 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_7rem_minmax(0,1fr)]">
            <Party title="보호매수자(은행)" holding={scene.buyer} />
            <div className="space-y-3 text-center text-[11px] font-semibold leading-4 sm:text-xs">
              <div className={`min-h-8 ${scene.toSeller ? "text-[#2563eb]" : "text-transparent"}`}>{scene.toSeller || "·"}</div>
              <div className={`min-h-8 ${scene.toBuyer ? "text-[#16a34a]" : "text-muted-foreground"}`}>{scene.toBuyer || "결제 전"}</div>
            </div>
            <Party title="보호매도자" holding={scene.seller} />
          </div>
        );
      }}
    />
  );
}
