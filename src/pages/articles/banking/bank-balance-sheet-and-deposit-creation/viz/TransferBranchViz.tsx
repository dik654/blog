import LedgerCell from "./LedgerCell";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #transfer-repayment — 6 송금이 판매자의 은행에 따라 다른 칸을 움직인다.
 * B은행 고객: A 준비금 20→14, 예금 102→96, B 각각 +6. 합 −6+6=0.
 * A은행 고객: A 총예금·준비금 그대로, 고객별 잔액의 주인만 바뀜.
 */
const SCENES = [
  { label: "송금 전", summary: "새 예금 10은 공장 통장에", seller: 0, sellerBank: "", a: [20, 20, 102, 102], bMoved: false, note: "대출 직후입니다. 아래 열 칸이 새로 생긴 예금 10이고, 아직 모두 공장 통장에 있습니다." },
  { label: "판매자가 B은행 고객", summary: "증감 합 −6 + 6 = 0", seller: 6, sellerBank: "B은행", a: [20, 14, 102, 96], bMoved: true, note: "A의 준비금과 예금이 6씩 줄고, B의 준비금과 판매자 예금이 6씩 늘어납니다. A의 대출 90은 남습니다. 돈이 A은행을 떠났다고 해서 전체 예금 6이 없어진 것은 아닙니다." },
  { label: "판매자도 A은행 고객이라면", summary: "주인만 바뀜 · 총액 그대로", seller: 6, sellerBank: "A은행", a: [20, 20, 102, 102], bMoved: false, note: "은행 사이로 넘길 것이 없습니다. 고객별 잔액 6의 주인만 바뀌고 A의 총예금 102와 준비금 20은 그대로입니다. 앞 장면과 칸을 비교해 보세요." },
] as const;

export default function TransferBranchViz() {
  return (
    <SceneShell
      eyebrow="송금의 두 갈래"
      title="판매자가 어느 은행을 쓰느냐에 따라 움직이는 칸이 달라집니다"
      description="단위는 억 원입니다. 준비금은 은행이 중앙은행 계좌에 두고 은행 간 지급에 쓰는 잔액입니다. B은행은 기존 장부를 생략하고 달라진 양만 적습니다."
      note="준비금 6이 곧바로 옮겨 가는 것은 즉시 총액 결제가 끝난 단순 사례입니다. 실제로는 지시·청산·최종 결제의 때가 다를 수 있습니다."
      ariaLabel="판매자의 은행에 따라 달라지는 송금 6의 장부 변화"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const [r0, r1, d0, d1] = s.a;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-bold">A은행</p>
                <LedgerCell name="준비금" before={r0} after={r1} />
                <LedgerCell name="고객 예금" before={d0} after={d1} />
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-sm font-bold">B은행 <span className="text-xs font-normal text-muted-foreground">달라진 양</span></p>
                {["준비금", "고객 예금"].map((name) => (
                  <div key={name} className={`rounded-lg border px-3 py-2 ${s.bMoved ? "border-primary bg-primary/5" : "border-border/60"}`}>
                    <p className="text-xs leading-5 text-muted-foreground">{name}</p>
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-mono text-base font-bold">{s.bMoved ? "+6" : "0"}</span>
                      <span className={`text-xs leading-5 ${s.bMoved ? "font-semibold text-primary" : "text-muted-foreground"}`}>{s.bMoved ? (name === "준비금" ? "A에서" : "판매자") : "그대로"}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">새로 생긴 예금 10의 주인 (한 칸이 1)</p>
            <svg viewBox="0 0 300 26" className="mt-1 h-auto w-full" role="img" aria-label={`공장 ${10 - s.seller}, 판매자 ${s.seller}`}>
              {Array.from({ length: 10 }, (_, cell) => {
                const sellers = cell >= 10 - s.seller;
                return <rect key={cell} x={cell * 30 + 1} y={1} width={28} height={24} rx={3} fill={sellers ? "#d97706" : "#2563eb"} fillOpacity={0.75} />;
              })}
            </svg>
            <p className="mt-1 flex flex-wrap justify-between gap-x-3 text-xs font-semibold leading-5">
              <span className="text-blue-700 dark:text-blue-400">공장 {10 - s.seller} · A은행</span>
              <span className="text-amber-700 dark:text-amber-400">{s.seller === 0 ? "판매자 0" : `판매자 ${s.seller} · ${s.sellerBank}`}</span>
            </p>
          </div>
        );
      }}
    />
  );
}
