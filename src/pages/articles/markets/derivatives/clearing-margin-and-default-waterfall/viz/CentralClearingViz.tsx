import type { ReactNode } from "react";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 중앙청산소가 한 계약을 매수자·매도자와의 두 계약으로 가르고,
 * 고객 증거금·회원 증거금·공동기금이 서로 다른 장부에 있다는 점.
 * 금액은 3절의 고객 증거금 12만 씁니다. 다른 장부의 크기는 본문에 없어 적지 않습니다.
 */
const SCENES = [
  { label: "원래는 한 계약", summary: "매수자 ↔ 매도자", note: "중앙청산이 없다면 매수자와 매도자가 서로의 계약 상대입니다. 한쪽이 지급하지 못하면 다른 쪽이 그 손실을 바로 떠안습니다." },
  { label: "청산소가 가운데 섭니다", summary: "계약 1개 → 계약 A·B 2개", note: "중앙청산소는 한 계약을 매수자와의 계약 A, 매도자와의 계약 B로 가릅니다. 매수자에게는 매도자 역할을, 매도자에게는 매수자 역할을 맡습니다. 손실이 사라진 것이 아니라 확인하고 받는 순서가 바뀐 것입니다." },
  { label: "장부는 층마다 따로입니다", summary: "고객 증거금 ≠ 회원 증거금 ≠ 공동기금", note: "고객이 낸 12는 맨 위 장부에 있습니다. 청산회원이 청산소에 낸 증거금과 공동기금은 아래의 다른 장부입니다. 그래서 고객의 12가 청산소의 모든 위험을 막지는 않습니다." },
] as const;

function Party({ name, sub, tone = "base" }: { name: string; sub?: string; tone?: "base" | "ccp" }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 text-center ${tone === "ccp" ? "border-blue-600 bg-blue-600/10" : "border-border bg-background"}`}>
      <span className="block text-sm font-bold">{name}</span>
      {sub && <span className="block text-xs leading-5 text-muted-foreground">{sub}</span>}
    </div>
  );
}

function Link({ label, dashed = false }: { label: string; dashed?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1 py-1 sm:py-0">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className={`block h-6 w-0 border-l sm:h-0 sm:w-full sm:border-l-0 sm:border-t ${dashed ? "border-dashed border-slate-400" : "border-slate-500"}`} />
    </div>
  );
}

function Ledger({ who, ledger, amount }: { who: string; ledger: string; amount: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-3">
      <Party name={who} />
      <div className="min-w-0 rounded-lg border border-dashed border-amber-600 px-3 py-2 text-xs leading-5">
        <span className="block font-semibold text-amber-800 dark:text-amber-300">{ledger}</span>
        <span className="block font-mono text-muted-foreground">{amount}</span>
      </div>
    </div>
  );
}

const PICTURES: readonly ReactNode[] = [
  <div key="bilateral" className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] sm:gap-3">
    <Party name="매수자" sub="선물을 산 쪽" />
    <Link label="계약 1개" />
    <Party name="매도자" sub="선물을 판 쪽" />
  </div>,
  <div key="novation" className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1fr)] sm:gap-3">
    <Party name="매수자" />
    <Link label="계약 A" />
    <Party name="중앙청산소" sub="양쪽의 상대" tone="ccp" />
    <Link label="계약 B" />
    <Party name="매도자" />
  </div>,
  <div key="ledgers" className="space-y-2">
    <Ledger who="고객" ledger="고객 증거금 (중개사 쪽 장부)" amount="3절의 12" />
    <Ledger who="중개사 · 청산회원" ledger="회원이 청산소에 낸 증거금" amount="금액 본문에 없음" />
    <Ledger who="중앙청산소" ledger="공동기금 (회원들의 부담분)" amount="금액 본문에 없음" />
  </div>,
];

export default function CentralClearingViz() {
  return (
    <SceneShell
      eyebrow="중앙청산"
      title="청산소는 한 계약을 둘로 가르고, 담보는 층마다 따로 둡니다"
      description="중앙청산은 청산소가 원래 거래 양쪽 사이에 들어가 각각의 계약 상대가 되는 구조입니다. 마지막 장면의 노란 점선 칸이 서로 다른 장부입니다."
      ariaLabel="한 계약이 중앙청산소를 사이에 둔 두 계약으로 갈라지고, 고객 증거금과 회원 증거금과 공동기금이 다른 장부에 있는 모습"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={PICTURES} />}
    />
  );
}
