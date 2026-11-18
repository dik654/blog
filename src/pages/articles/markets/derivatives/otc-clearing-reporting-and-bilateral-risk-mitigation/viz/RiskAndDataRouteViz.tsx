import type { ReactNode } from "react";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 청산소는 양쪽의 계약 상대가 되어 증거금·부도처리 순서를 운영하고,
 * 거래정보저장소는 계약 상대가 되지 않고 보고 자료만 모은다. 그래서 청산·담보·보고 상태를 따로 적는다.
 * 금액은 본문에 없어 적지 않는다.
 */
const SCENES = [
  { label: "처음에는 두 회사의 계약", summary: "회사 A ↔ 회사 B", note: "청산 전에는 두 회사가 서로의 계약 상대입니다. 한쪽이 지급하지 못하면 다른 쪽이 그 위험을 바로 안습니다." },
  { label: "청산소가 가운데 섭니다", summary: "계약 1개 → 청산소와의 계약 2개", note: "중앙청산에서는 청산소가 원래 두 회사 사이에 들어가 각 회사의 계약 상대가 됩니다. 증거금을 받고, 회원이 부도나면 정해 둔 처리 순서를 운영합니다." },
  { label: "정보는 저장소로 갑니다", summary: "저장소 = 자료를 모으는 곳", note: "거래정보저장소는 계약의 체결·변경·종료 정보를 받아 모읍니다. 계약 상대가 되지 않으므로 지급을 대신하지도, 상대방 위험을 넘겨받지도 않습니다." },
  { label: "세 상태를 계약마다 따로", summary: "청산 · 담보 · 보고", note: "저장소 보고가 끝나도 상대방 위험은 사라지지 않고, 청산했다고 보고 의무가 없어지지도 않습니다. 그래서 계약마다 세 상태를 따로 표시합니다." },
] as const;

function Box({ name, sub, tone = "base" }: { name: string; sub?: string; tone?: "base" | "ccp" | "tr" }) {
  const toneClass =
    tone === "ccp" ? "border-blue-600 bg-blue-600/10" : tone === "tr" ? "border-dashed border-slate-500 bg-background" : "border-border bg-background";
  return (
    <div className={`min-w-0 rounded-lg border px-1.5 py-2 text-center sm:px-3 ${toneClass}`}>
      <span className="block text-sm font-bold">{name}</span>
      {sub && <span className="block break-keep text-[11px] leading-4 text-muted-foreground sm:text-xs sm:leading-5">{sub}</span>}
    </div>
  );
}

function Line({ label }: { label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1">
      <span className="text-[11px] font-semibold leading-4 text-muted-foreground sm:text-xs">{label}</span>
      <span className="block h-0 w-full border-t border-slate-500" />
    </div>
  );
}

function Report() {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-col items-center gap-1">
        <span className="block h-5 w-0 border-l border-dashed border-slate-500" />
        <span className="text-center text-xs font-semibold text-muted-foreground">체결·변경·종료 정보 보고 (정보만 이동)</span>
        <span className="block h-5 w-0 border-l border-dashed border-slate-500" />
      </div>
      <div className="mx-auto max-w-xs">
        <Box name="거래정보저장소" sub="계약 상대 아님 · 지급 보증 없음" tone="tr" />
      </div>
    </div>
  );
}

const ROW = "grid grid-cols-[minmax(0,1fr)_minmax(1.75rem,0.6fr)_minmax(0,1.6fr)_minmax(1.75rem,0.6fr)_minmax(0,1fr)] items-center gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.3fr)_minmax(0,0.8fr)_minmax(0,1fr)] sm:gap-3";

function Cleared() {
  return (
    <div className={ROW}>
      <Box name="회사 A" />
      <Line label="계약" />
      <Box name="청산소" sub="양쪽의 계약 상대 · 증거금 · 부도처리 순서" tone="ccp" />
      <Line label="계약" />
      <Box name="회사 B" />
    </div>
  );
}

function Status({ title, cells }: { title: string; cells: readonly [string, string, string] }) {
  const heads = ["청산", "담보", "보고"] as const;
  return (
    <div className="rounded-lg border border-border px-3 py-2">
      <span className="block text-sm font-bold">{title}</span>
      <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-2">
        {heads.map((head, index) => (
          <div key={head} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2 text-xs leading-5 sm:block">
            <span className="font-semibold text-muted-foreground">{head}</span>
            <span className="block">{cells[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PICTURES: readonly ReactNode[] = [
  <div key="bilateral" className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] items-center gap-2 sm:gap-3">
    <Box name="회사 A" />
    <Line label="계약 1개 (서로가 상대)" />
    <Box name="회사 B" />
  </div>,
  <Cleared key="cleared" />,
  <div key="report">
    <Cleared />
    <Report />
  </div>,
  <div key="status" className="space-y-2">
    <Status title="청산 대상 계약" cells={["청산소로 감", "청산 증거금 계정", "저장소에 보고"]} />
    <Status title="비청산 계약" cells={["두 회사 사이에 남음", "양자 담보·평가 분쟁 절차", "저장소에 보고"]} />
  </div>,
];

export default function RiskAndDataRouteViz() {
  return (
    <SceneShell
      eyebrow="위험과 정보의 길"
      title="위험은 청산소로, 정보는 저장소로 갑니다"
      description="실선은 계약 관계, 점선은 정보만 오가는 보고입니다. 청산소(중앙청산소)는 계약 상대가 되고, 거래정보저장소는 보고 자료를 모으기만 합니다."
      ariaLabel="두 회사의 계약에 청산소가 들어가 두 계약이 되고, 계약 정보는 거래정보저장소로 보고되며, 계약마다 청산·담보·보고 상태를 따로 적는 모습"
      scenes={SCENES}
      render={(active) => <StableSceneStack active={active} scenes={PICTURES} />}
    />
  );
}
