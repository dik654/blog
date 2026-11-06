/** 장부 변화 표. 계정마다 자산·부채 양쪽에 이 거래가 만든 변화만 적습니다. */
export interface LedgerAccount {
  name: string;
  assets: readonly string[];
  liabilities: readonly string[];
}

function Cell({ items }: { items: readonly string[] }) {
  return (
    <div className="min-w-0 px-2 py-1.5">
      {items.length === 0 ? (
        <p className="text-xs leading-5 text-muted-foreground/70">변화 없음</p>
      ) : (
        items.map((item) => (
          <p key={item} className="text-xs font-semibold leading-5 text-foreground">{item}</p>
        ))
      )}
    </div>
  );
}

const ROW = "grid grid-cols-[3.75rem_minmax(0,1fr)_minmax(0,1fr)] divide-x divide-border sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)]";

export default function LedgerBoard({ accounts, total, totalLabel }: { accounts: readonly LedgerAccount[]; total: string; totalLabel: string }) {
  return (
    <div className="min-w-0">
      <div className="rounded-lg border border-border bg-background">
        <div className={`${ROW} text-[11px] font-semibold text-muted-foreground`}>
          <span className="px-2 py-1.5">계정</span>
          <span className="px-2 py-1.5">자산</span>
          <span className="px-2 py-1.5">부채</span>
        </div>
        {accounts.map((account) => (
          <div key={account.name} className={`${ROW} border-t border-border`}>
            <p className="min-w-0 px-2 py-1.5 text-xs font-bold leading-5">{account.name}</p>
            <Cell items={account.assets} />
            <Cell items={account.liabilities} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-xs text-muted-foreground">{totalLabel}</span>
        <span className="font-mono text-sm font-bold text-primary">{total}</span>
      </div>
    </div>
  );
}
