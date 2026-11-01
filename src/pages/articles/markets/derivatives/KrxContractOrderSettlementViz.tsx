import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["계약명세", "주문", "체결", "포지션", "일일정산", "계좌", "반대거래", "만기"] as const;

const NOTES = [
  "코스피200 선물 가격 1포인트는 계약승수 25만 원으로 현금 25만 원이 되고, 최소 호가 0.05포인트는 1만2,500원이 됩니다.",
  "투자자는 월물·매수·1계약·지정가 330과 주문조건을 보냅니다. IOC와 FOK는 즉시 체결되지 않은 수량을 서로 다르게 처리합니다.",
  "연속매매에서는 더 좋은 가격이 먼저이고 같은 가격이면 먼저 접수된 주문이 먼저 체결됩니다. 체결분과 미체결분의 상태를 나눕니다.",
  "체결된 1계약은 매수 포지션과 증거금·청산 장부에 들어갑니다. 주문이 체결됐다고 계약이 끝난 것은 아닙니다.",
  "장 마감 정산가격 328을 적용하면 330에 산 1계약의 하루 손익은 (328−330)×25만 원=−50만 원입니다.",
  "다른 입출금이 없으면 계좌 300만 원은 250만 원이 됩니다. 이어 유지증거금과 납부 시한, 회원사 추가 기준을 확인합니다.",
  "최종거래일 장 마감 전 같은 종목·월물·수량을 반대로 매도하면 미결제약정이 상계됩니다. 수수료와 당일 정산 현금은 따로 남을 수 있습니다.",
  "끝까지 남은 코스피200 선물은 현금으로 최종결제합니다. 결제 방식과 날짜는 상품별 현행 계약명세와 업무규정을 다시 확인합니다.",
] as const;

type Panel = "spec" | "order" | "match" | "position" | "mark" | "account" | "offset" | "expiry";

const SCENES = [
  { title: "계약명세가 화면의 1포인트를 현금 25만 원으로 바꿉니다", detail: "코스피200 선물의 계약승수, 최소 호가, 최종거래일과 결제방식을 주문 전에 읽습니다.", panel: "spec", formula: "1포인트=25만 원 · 0.05포인트=12,500원", conclusion: "선물 가격은 원화 금액 자체가 아니므로 종목별 승수를 붙여야 실제 계약가치와 손익을 알 수 있습니다." },
  { title: "330 지정가 매수 1계약과 남은 수량 조건을 보냅니다", detail: "월물·방향·수량·가격을 정하고, 즉시 처리할 주문이라면 IOC와 FOK 중 미체결 수량을 어떻게 할지도 정합니다.", panel: "order", formula: "월물+매수+1계약+330+주문조건", conclusion: "시장가와 지정가, IOC와 FOK는 가격 보장과 수량 처리의 서로 다른 문제를 다룹니다." },
  { title: "가격과 시간 우선순위가 체결분을 확정합니다", detail: "연속매매에서 맞은편 매도 주문과 가격이 만나면 같은 가격에서는 먼저 접수된 주문이 먼저 체결됩니다.", panel: "match", formula: "주문 접수→호가 대조→체결 1·미체결 0", conclusion: "일부 체결이면 체결분은 포지션이 되고 남은 수량은 주문조건에 따라 대기하거나 취소됩니다." },
  { title: "체결 1계약이 청산 포지션과 증거금 장부에 들어갑니다", detail: "체결번호와 시각, 매수 1계약, 체결가 330을 회원과 청산 장부가 이어받습니다.", panel: "position", formula: "체결 상태≠계약 종료 상태", conclusion: "주문 화면의 체결 완료 뒤에도 매일 손익 정산과 증거금, 반대거래 또는 만기결제가 계속됩니다." },
  { title: "정산가격 328이 하루 손실 50만 원을 만듭니다", detail: "장 마감에 열린 포지션을 정산가격으로 다시 평가해 당일 차액을 현금으로 주고받습니다.", panel: "mark", formula: "(328−330)×25만 원=−50만 원", conclusion: "장기 전망이 맞더라도 오늘의 평가손익은 즉시 계좌와 증거금 여력에 영향을 줍니다." },
  { title: "계좌 300만 원이 250만 원이 되고 증거금을 다시 검사합니다", detail: "다른 입출금이 없다는 가정에서 손실 50만 원을 반영한 뒤 유지증거금과 추가 납부 필요 여부를 확인합니다.", panel: "account", formula: "300만−50만=250만 원", conclusion: "가격 제한은 손실 상한이 아니며 회원사 기준과 납부 시한을 못 지키면 포지션이 강제로 정리될 수 있습니다." },
  { title: "같은 월물 1계약을 매도하면 열린 포지션을 상계합니다", detail: "최종거래일 장 마감 전 동일한 반대 계약을 체결해 미결제약정을 1에서 0으로 줄입니다.", panel: "offset", formula: "매수 1+매도 1→미결제약정 0", conclusion: "경제적 포지션이 끝나도 수수료와 그날의 정산 차액이 모두 처리됐는지는 별도로 확인합니다." },
  { title: "남은 코스피200 선물은 만기 다음 날 현금으로 끝납니다", detail: "반대거래하지 않은 미결제약정은 최종거래일과 상품별 최종결제 규칙을 따라 정리됩니다.", panel: "expiry", formula: "최종결제차금×승수×수량→현금 결제", conclusion: "KRX 안내 페이지 사이에 오래된 설명이 남을 수 있으므로 거래 시점의 업무규정과 상품 명세를 우선 확인합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function SpecPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="코스피200 선물 계약명세"><Tile label="계약승수" value="25만 원" /><Tile label="최소 호가" value="0.05포인트" /><Tile label="한 칸 가치" value="12,500원" active /></div>; }
function OrderPanel() { return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="선물 주문 입력"><Tile label="월물" value="선택" /><Tile label="방향" value="매수" /><Tile label="수량" value="1계약" /><Tile label="지정가" value="330" active /></div>; }
function MatchPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="선물 주문 체결 상태"><Tile label="접수" value="330 매수" /><Tile label="우선순위" value="가격→시간" /><Tile label="결과" value="체결 1" active /></div>; }
function PositionPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="체결 뒤 청산 포지션"><Tile label="주문" value="체결 완료" /><Tile label="포지션" value="매수 1" active /><Tile label="다음 상태" value="매일 정산" /></div>; }
function MarkPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="선물 일일정산 계산"><Tile label="체결가" value="330" /><Tile label="정산가" value="328" /><Tile label="하루 손익" value="−50만 원" active /></div>; }
function AccountPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="정산 뒤 계좌와 증거금"><Tile label="정산 전" value="300만 원" /><Tile label="손익 반영" value="−50만 원" /><Tile label="정산 후" value="250만 원" active /></div>; }
function OffsetPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="반대거래로 포지션 종료"><Tile label="기존" value="매수 1" /><Tile label="반대거래" value="매도 1" /><Tile label="미결제" value="0" active /></div>; }
function ExpiryPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="코스피200 선물 최종결제"><Tile label="최종거래일" value="둘째 목요일" /><Tile label="결제일" value="다음 날" /><Tile label="결제 방식" value="현금" active /></div>; }

export default function KrxContractOrderSettlementViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="KRX 선물 · 주문에서 현금까지" title="330에 산 1계약이 체결·청산·일일정산을 거쳐 하루 손실 50만 원이 됩니다" description="계약명세의 단위를 붙인 주문이 가격·시간 우선순위로 체결되고, 포지션과 증거금 장부를 거쳐 반대거래나 만기결제로 끝나는 과정을 봅니다." note="코스피200 선물 승수 25만 원과 최소 호가 0.05포인트는 KRX 상품 명세를 2026-11-02 확인한 값입니다. 회원사 증거금·주문 가능 조건과 상품 규격은 실제 거래 시점에 다시 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-krx-contract-order-settlement data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "spec" && <SpecPanel />}{scene.panel === "order" && <OrderPanel />}{scene.panel === "match" && <MatchPanel />}{scene.panel === "position" && <PositionPanel />}{scene.panel === "mark" && <MarkPanel />}{scene.panel === "account" && <AccountPanel />}{scene.panel === "offset" && <OffsetPanel />}{scene.panel === "expiry" && <ExpiryPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="KRX 선물 주문과 정산 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
