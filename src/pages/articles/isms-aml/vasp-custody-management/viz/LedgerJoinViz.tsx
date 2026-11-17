import SceneShell from "./SceneShell";

/**
 * 본문 대응: #asset-liability-control 첫째 문단.
 * Liability ledger(고객별 돌려줄 수량)와 Asset inventory(주소·custodian별 자산)는 서로 다른 원장이다.
 * 둘은 stable asset ID와 cutoff time으로 맞추고, omnibus 주소 잔액을 특정 고객 소유로 바로 읽지 않는다.
 * 민지 2 BTC만 글의 숫자이고, 나머지 행과 주소 구성은 설명용 가정이다.
 */
const LIABILITIES = [
  ["민지", "2 BTC"],
  ["고객 B (가정)", "수량 생략"],
  ["고객 C (가정)", "수량 생략"],
] as const;

const ASSETS = [
  ["주소 1 · omnibus (가정)", "여러 고객 몫이 한 잔액에"],
  ["주소 2 (가정)", "key authority · generation 기록"],
  ["외부 custodian (가정)", "custodian · confirmation policy 기록"],
] as const;

const SCENES = [
  {
    label: "고객 채무 원장",
    summary: "민지에게 돌려줄 것: 2 BTC",
    note: "Liability ledger는 고객별 입금·거래·수수료·출금으로 사업자가 돌려줘야 할 수량을 계산합니다. 민지는 2 BTC를 맡겼으므로 이 원장에는 민지 행에 2 BTC가 적힙니다.",
  },
  {
    label: "자산 inventory",
    summary: "주소·custodian별 기록",
    note: "Asset inventory는 고객이 아니라 자산이 있는 곳을 행으로 둡니다. 행마다 chain·network·address·custodian·key authority·confirmation policy·generation을 기록합니다.",
  },
  {
    label: "asset ID·cutoff로 맞춤",
    summary: "같은 BTC · 같은 cutoff끼리",
    note: "두 원장은 stable asset ID(시간이 지나도 바뀌지 않는 자산 식별자)와 cutoff time(집계 기준 시각)이 같은 행끼리 맞춥니다. 다른 자산이나 다른 시각의 잔액을 섞어 대조하지 않습니다.",
  },
  {
    label: "omnibus 잔액 ≠ 민지 소유",
    summary: "주소 잔액으로 고객 몫을 정하지 않음",
    note: "Omnibus 주소는 여러 고객의 자산을 한 주소에 모아 두는 주소입니다. 그 잔액에서 민지의 몫을 읽어 낼 수는 없으므로, 민지가 받을 수량은 언제나 채무 원장 쪽에서 정합니다.",
  },
] as const;

function Panel({ title, rows, lit, dim }: { title: string; rows: readonly (readonly [string, string])[]; lit: boolean; dim: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border p-3 ${lit ? "border-primary" : "border-border"} ${dim ? "opacity-40" : ""}`}>
      <p className="text-xs font-bold text-primary">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {rows.map(([name, value]) => (
          <li key={name} className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 rounded-md border border-border bg-background px-2 py-1.5 text-xs leading-5">
            <span className="font-semibold">{name}</span>
            <span className="text-muted-foreground">{value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] leading-4 text-muted-foreground">모든 행: asset ID = BTC · cutoff = T</p>
    </div>
  );
}

export default function LedgerJoinViz() {
  return (
    <SceneShell
      eyebrow="두 원장"
      title="고객에게 줄 수량과 자산이 있는 곳은 서로 다른 장부에 적습니다"
      description="왼쪽은 고객별 채무, 오른쪽은 자산이 있는 위치입니다. 민지의 2 BTC만 글의 숫자이고 다른 고객과 주소 구성은 설명용 가정입니다."
      ariaLabel="고객 채무 원장과 자산 inventory를 asset ID와 cutoff로 맞추고 omnibus 주소 잔액을 고객 소유로 읽지 않는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_6.5rem_minmax(0,1fr)] sm:items-center">
            <Panel title="Liability ledger · 고객별 채무" rows={LIABILITIES} lit={active === 0} dim={active === 1} />
            <div className={`rounded-md border px-2 py-2 text-center text-[11px] leading-4 ${active === 2 ? "border-primary font-bold text-primary" : active === 3 ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-dashed border-border text-muted-foreground"}`}>
              {active === 3 ? "주소 1 잔액 → 민지 몫 ✕" : active === 2 ? "같은 BTC · cutoff T끼리 대조" : "아직 맞추지 않음"}
            </div>
            <Panel title="Asset inventory · 자산 위치" rows={ASSETS} lit={active === 1 || active === 3} dim={active === 0} />
          </div>
        </div>
      )}
    />
  );
}
