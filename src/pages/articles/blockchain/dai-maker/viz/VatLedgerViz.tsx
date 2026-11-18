import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vault-debt-collateral — 담보 수량·달러 가치, art·rate·현재 빚,
 * wallet ERC-20 DAI·Vat 내부 DAI·금고 미상환 부채가 서로 다른 칸이라는 점.
 * 담보 3 token × oracle 50달러(가정) = 150달러, art 100, rate 1 → 1.05(본문 예시).
 * 같은 ilk의 다른 금고 B(art 40)는 rate가 공통이라는 점을 보이려는 가정이다.
 */
interface LedgerState {
  walletToken: string;
  walletDai: string;
  rate: string;
  aToken: string;
  aArt: string;
  aDebt: string;
  bArt: string;
  bDebt: string;
  vatDai: string;
  changed: readonly string[];
}

const STATES: readonly LedgerState[] = [
  { walletToken: "0", walletDai: "0", rate: "1", aToken: "3 token", aArt: "0", aDebt: "0", bArt: "40", bDebt: "40", vatDai: "0", changed: ["walletToken", "aToken"] },
  { walletToken: "0", walletDai: "0", rate: "1", aToken: "3 token", aArt: "100", aDebt: "100", bArt: "40", bDebt: "40", vatDai: "100", changed: ["aArt", "aDebt", "vatDai"] },
  { walletToken: "0", walletDai: "100", rate: "1", aToken: "3 token", aArt: "100", aDebt: "100", bArt: "40", bDebt: "40", vatDai: "0", changed: ["walletDai", "vatDai"] },
  { walletToken: "0", walletDai: "100", rate: "1.05", aToken: "3 token", aArt: "100", aDebt: "105", bArt: "40", bDebt: "42", vatDai: "0", changed: ["rate", "aDebt", "bDebt"] },
];

const SCENES = [
  {
    label: "담보 넣기",
    summary: "3 token × 50달러 = 150달러",
    note: "(가정) 담보 3 token이 adapter를 지나 금고 A의 칸에 들어갑니다. 장부에 적히는 것은 수량 3이고, 150달러는 oracle 가격 50달러(가정)를 곱해야 나오는 값입니다. 가격이 바뀌면 수량은 그대로인데 가치만 바뀝니다.",
  },
  {
    label: "100 DAI 꺼내기",
    summary: "art 100 × rate 1 = 빚 100",
    note: "금고 A의 art가 100이 되고, 같은 크기의 DAI가 Vat 내부 잔액으로 생깁니다. rate가 1이라 현재 빚도 100이고 담보 비율은 150 ÷ 100 = 150%입니다.",
  },
  {
    label: "wallet로 옮기기",
    summary: "Vat 내부 0 · wallet 100 · 빚 100",
    note: "Vat 내부 DAI를 DAI용 adapter로 wallet의 ERC-20 DAI로 옮기면 DAI가 놓인 칸만 바뀝니다. 금고 A의 빚 100은 그대로 남습니다. DAI를 어디에 두었는지와 금고에 갚을 빚은 다른 숫자입니다.",
  },
  {
    label: "rate 1 → 1.05",
    summary: "빚 105 · wallet DAI 100",
    note: "rate는 담보 종류(ilk) 전체의 칸 하나라서, 이 값만 바뀌어도 같은 ilk의 금고 A는 100 × 1.05 = 105, 금고 B(가정)는 40 × 1.05 = 42가 됩니다. art는 다시 쓰지 않습니다. wallet의 DAI는 여전히 100이므로 갚으려면 5가 모자라고, 담보 비율은 150 ÷ 105 ≈ 142.86%로 내려갑니다.",
  },
] as const;

function Cell({ label, value, hot }: { label: string; value: string; hot: boolean }) {
  return (
    <div className={`min-w-0 rounded-md border px-2 py-1 ${hot ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border bg-background"}`}>
      <p className="break-keep text-[11px] leading-4 text-muted-foreground">{label}</p>
      <p className={`font-mono text-[13px] font-bold leading-5 ${hot ? "text-[#2563eb]" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

export default function VatLedgerViz() {
  return (
    <SceneShell
      eyebrow="금고의 세 숫자가 놓인 칸"
      title="담보 수량, 현재 빚, 손에 쥔 DAI는 서로 다른 칸에 적힙니다"
      description="사용자 wallet, token을 장부로 넣고 빼는 adapter, core 장부 Vat를 차례로 그렸습니다. Vat 안의 ilk는 담보 종류 하나의 장부이고, 금고(urn) 하나마다 담보 수량과 art가 따로 있습니다. 파란 칸이 그 장면에서 바뀐 값입니다."
      note="150달러·art 100·rate 1.05는 본문의 계산 예시이고, 3 token·50달러·금고 B(art 40)는 칸을 보이려는 가정입니다."
      ariaLabel="wallet, adapter, Vat 장부 사이에서 담보 수량, art, rate, DAI 잔액이 바뀌는 장면"
      scenes={SCENES}
      render={(active) => {
        const s = STATES[active];
        const hot = (key: string) => s.changed.includes(key);
        return (
          <div className="grid min-w-0 gap-2 lg:grid-cols-[minmax(0,0.7fr)_auto_minmax(0,1.6fr)] lg:items-stretch">
            <div className="min-w-0 rounded-lg border border-border p-2">
              <p className="text-xs font-bold">사용자 wallet</p>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5 lg:grid-cols-1">
                <Cell label="담보 token" value={s.walletToken} hot={hot("walletToken")} />
                <Cell label="ERC-20 DAI" value={s.walletDai} hot={hot("walletDai")} />
              </div>
            </div>
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border px-2 py-1 text-center text-xs font-bold text-muted-foreground">
              <span>
                adapter <span className="font-normal">· wallet ⇄ 장부</span>
              </span>
            </div>
            <div className="min-w-0 rounded-lg border border-border p-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold">Vat · ilk(담보 종류 하나)</p>
                <div className="w-28 shrink-0">
                  <Cell label="ilk 공통 rate" value={s.rate} hot={hot("rate")} />
                </div>
              </div>
              {[
                { name: "금고 A (이 글의 예)", token: s.aToken, art: s.aArt, debt: s.aDebt, keys: ["aToken", "aArt", "aDebt"], dashed: false },
                { name: "금고 B (가정)", token: "생략", art: s.bArt, debt: s.bDebt, keys: ["", "bArt", "bDebt"], dashed: true },
              ].map((urn) => (
                <div key={urn.name} className={`mt-1.5 rounded-md border p-1.5 ${urn.dashed ? "border-dashed border-border" : "border-border"}`}>
                  <p className={`text-[11px] font-bold ${urn.dashed ? "text-muted-foreground" : ""}`}>{urn.name}</p>
                  <div className="mt-1 grid grid-cols-3 gap-1.5">
                    <Cell label="담보 수량" value={urn.token} hot={hot(urn.keys[0])} />
                    <Cell label="art" value={urn.art} hot={hot(urn.keys[1])} />
                    <Cell label="빚 = art×rate" value={urn.debt} hot={hot(urn.keys[2])} />
                  </div>
                </div>
              ))}
              <div className="mt-1.5">
                <Cell label="A 소유자의 Vat 내부 DAI 잔액" value={s.vatDai} hot={hot("vatDai")} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
