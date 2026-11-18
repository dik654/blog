import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째~넷째 문단 — KRX 선물 결제 안내의 세 갈래(일일정산·반대거래·최종결제)와
 * 업무규정(규정 제2432호, 2026-04-15 일부개정·2026-06-29 시행, 2026-10-10 확인)의 최종결제 방식.
 * 현금결제: 주가지수·변동성지수·주식·ETF·국채·단기금리·일반상품(금·돈육). 실물인수도: 통화선물.
 */
type Node = "position" | "daily" | "offset" | "final" | "cash" | "physical";

const SCENES = [
  { label: "체결 뒤에는 매일 정산", summary: "장 마감 가격으로 다시 평가", lit: ["position", "daily"], note: "체결된 포지션은 매일 장 마감 가격으로 다시 평가돼 차액을 주고받습니다. 330→328 하루라면 −50만 원이 계좌에서 빠지고, 포지션이 남아 있는 한 다음 날도 같은 일이 반복됩니다." },
  { label: "출구 1 · 반대거래", summary: "최종거래일 장 마감 전까지", lit: ["position", "daily", "offset"], note: "최종거래일 장 마감 전까지 같은 종목을 반대로 사고팔면 포지션이 닫힙니다. 닫힌 뒤에도 그날의 정산 현금과 수수료는 남을 수 있습니다." },
  { label: "출구 2 · 최종결제", summary: "끝까지 남은 미결제약정", lit: ["position", "daily", "final"], note: "최종거래일까지 반대거래를 하지 않고 남은 미결제약정은 최종결제로 정리합니다. 방식은 현금결제와 실물인수도 두 가지이고, 상품마다 규정이 어느 쪽인지 정합니다." },
  { label: "현금결제인가, 실물인가", summary: "통화선물만 실물인수도", lit: ["position", "daily", "final", "cash", "physical"], note: "업무규정은 통화선물만 실물인수도로, 나머지는 현금결제로 적습니다. KRX 결제 안내 페이지는 10년 국채·금선물을 실물인도로 적어 어긋나므로 거래 시점의 규정과 종목 명세로 다시 확인합니다." },
] as const satisfies readonly { label: string; summary: string; lit: readonly Node[]; note: string }[];

function Box({ on, title, sub, children }: { on: boolean; title: string; sub: string; children?: ReactNode }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-1.5 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none ${on ? "border-[#2563eb] opacity-100" : "border-border opacity-35"}`}>
      <strong className="block text-sm">{title}</strong>
      <span className="text-muted-foreground">{sub}</span>
      {children}
    </div>
  );
}

export default function SettlementExitViz() {
  return (
    <SceneShell
      eyebrow="체결 뒤의 길"
      title="체결된 선물은 매일 정산되다가 두 출구 중 하나로 나갑니다"
      description="미결제약정은 체결된 뒤 아직 닫히지 않은 계약입니다. 파란 테두리가 지금 장면에서 지나는 길이며, 상품 분류는 본문이 인용한 KRX 업무규정을 따릅니다."
      ariaLabel="체결된 선물 포지션이 일일정산을 거쳐 반대거래 또는 최종결제로 끝나고, 최종결제가 현금결제와 실물인수도로 갈리는 구조"
      scenes={SCENES}
      render={(index) => {
        const lit = new Set<Node>(SCENES[index].lit);
        const showLists = index === 3;
        return (
          <div className="min-w-0 space-y-1">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1">
              <Box on={lit.has("position")} title="체결된 포지션" sub="예: 330 매수 1계약" />
              <span className={`font-mono text-sm ${lit.has("daily") ? "text-[#2563eb]" : "text-[#cbd5e1]"}`}>→</span>
              <Box on={lit.has("daily")} title="일일정산 ↻ 매일" sub="장 마감 가격으로 평가해 차액 수수" />
            </div>
            <div className={`pt-1 text-center text-xs font-semibold ${lit.has("offset") || lit.has("final") ? "text-[#2563eb]" : "text-[#94a3b8]"}`}>↓ 일일정산을 받던 포지션이 끝나는 두 출구 ↓</div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="min-w-0 space-y-1">
                <Box on={lit.has("offset")} title="반대거래" sub="같은 종목을 반대로 매매해 닫음" />
              </div>
              <div className="min-w-0 space-y-1">
                <Box on={lit.has("final")} title="최종결제" sub="최종거래일까지 남은 약정" />
              </div>
            </div>
            <div className={`pt-1 text-center text-xs font-semibold ${lit.has("final") ? "text-[#2563eb]" : "text-[#94a3b8]"}`}>↓ 최종결제는 상품 규정에 따라 둘 중 하나 ↓</div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="min-w-0 space-y-1">
                <Box on={lit.has("cash")} title="현금결제" sub="최종결제차금만 주고받음">
                  <span className={`mt-1 block ${showLists ? "" : "invisible"}`}>주가지수·변동성지수·주식·ETF·국채·단기금리·일반상품(금·돈육 등) 선물</span>
                </Box>
              </div>
              <div className="min-w-0 space-y-1">
                <Box on={lit.has("physical")} title="실물인수도" sub="통화와 결제대금을 주고받음">
                  <span className={`mt-1 block ${showLists ? "" : "invisible"}`}>통화선물(미국달러·엔·유로·위안)</span>
                </Box>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
