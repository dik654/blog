import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["계약", "가치", "통지", "연결", "인도", "이동비", "저장", "대사"] as const;

const NOTES = [
  "WTI 선물 한 계약은 1천 미국 배럴이며, 일부 인도 방식을 제외한 일반 물리 인도 수량에는 ±2% 허용 범위가 있습니다.",
  "설명용 최종가격 70달러를 1천 배럴에 곱하면 계약가치는 7만 달러입니다. 가격 가정과 계약 규격을 구분해 기록합니다.",
  "마지막 거래일 다음 영업일 오후 3시까지 매수·매도 청산회원이 각각 인수·인도 의사를 내고, 둘째 영업일 통지일에 청산소가 상대를 배정합니다.",
  "매도 측 유입 시설과 매수 측 반출 시설이 쿠싱의 허용 연결망에서 실제로 이어지는지 확인해야 인도 지시를 실행할 수 있습니다.",
  "매수자는 시설 간 펌프오버, 같은 시스템 안의 이전·북아웃, 조건이 맞으면 탱크 안 소유권 이전 가운데 실행 가능한 방법을 고릅니다.",
  "설명용 시설 간 이동비 0.12달러를 1천 배럴에 곱한 120달러는 계약가치 7만 달러와 분리한 물류비입니다.",
  "탱크의 설계 총용량에서 안전 여유와 펌프가 작동하지 않는 바닥 물량을 빼야 실제 작업 저장용량을 판단할 수 있습니다.",
  "최종가격, 실제 수량, 품질, 파이프라인 표, 소유권 문서, 이동비와 지급 기록을 맞춘 뒤에야 인도 절차가 끝납니다.",
] as const;

type Panel = "contract" | "value" | "notice" | "connection" | "method" | "fee" | "storage" | "reconcile";

const SCENES = [
  { title: "화면의 한 계약을 쿠싱 원유 1천 배럴로 바꿔 읽습니다", detail: "계약은 가격 숫자만 약속하지 않습니다. 수량·품질·인도 지역을 함께 고정하며, 일반적인 물리 이동에는 980~1,020배럴의 허용 범위가 있습니다.", panel: "contract", formula: "1계약=1,000 bbl · 일반 허용 범위 980~1,020 bbl", conclusion: "선물 포지션을 만기까지 보유하면 가격 위험과 별개로 받을 시설과 인도 절차가 필요합니다." },
  { title: "설명용 최종가격 70달러가 7만 달러 계약가치가 됩니다", detail: "마지막 거래일 정산가격에 계약 수량과 계약 수를 곱합니다. 이 값은 원유 대금의 기준이며 저장·시설 이동·쿠싱 밖 운송 비용까지 포함한 총비용은 아닙니다.", panel: "value", formula: "$70/bbl×1,000 bbl×1=$70,000", conclusion: "7만 달러는 규정의 계산식에 넣은 가정값이며 실제 최종가격은 해당 만기의 정산값을 사용합니다." },
  { title: "매수와 매도가 의사를 내고 청산소가 상대를 배정합니다", detail: "마지막 거래일 다음 영업일 오후 3시까지 매수 측은 인수 의사, 매도 측은 인도 의사를 냅니다. 둘째 영업일인 통지일에 청산소가 규모를 맞추고, 그다음 영업일에 매수 측이 시설과 방법을 적은 인도 지시서를 보냅니다.", panel: "notice", formula: "T 마지막 거래→T+1 의사 통지→T+2 상대 배정→T+3 인도 지시·증거금", conclusion: "청산소의 배정과 실제 송유관 일정은 같은 일이 아니므로 통지 뒤에도 시설 조율이 남습니다." },
  { title: "쿠싱의 두 시설 사이에 실제 연결 경로가 있어야 합니다", detail: "매도자가 원유를 넣는 송유관·저장시설과 매수자가 받는 시설이 승인된 쿠싱 연결망에서 이어져야 합니다. 이름만 적는 것이 아니라 시설 접근 권한과 처리 능력까지 확인합니다.", panel: "connection", formula: "매도 유입 시설→쿠싱 연결점→매수 반출 시설", conclusion: "계약을 보유했다고 탱크 공간과 파이프라인 수송 능력이 자동으로 예약되지는 않습니다." },
  { title: "실제 이동과 장부상 소유권 이전 중 가능한 방법을 고릅니다", detail: "매수자는 연결 시설 사이로 원유를 밀어 보내는 펌프오버, 같은 시스템 안의 이전·북아웃, 조건이 맞으면 원유를 움직이지 않는 탱크 안 소유권 이전을 선택할 수 있습니다.", panel: "method", formula: "펌프오버 | 시스템 안 이전·북아웃 | 탱크 안 소유권 이전", conclusion: "인도는 항상 장거리 운송을 뜻하지 않지만 어떤 방법이든 수량과 소유권 증거가 필요합니다." },
  { title: "시설 이동비 120달러는 7만 달러 계약가치와 따로 기록합니다", detail: "배럴당 0.12달러라는 설명용 비용을 적용하면 시설 간 이동비는 120달러입니다. 실제 비용 부담은 선택한 시설·방법·요금표와 계약 조건을 확인해야 합니다.", panel: "fee", formula: "$0.12/bbl×1,000 bbl=$120", conclusion: "가격 손익과 물류비를 한 숫자로 합치기 전에 각각의 근거와 부담 주체를 남깁니다." },
  { title: "탱크가 커 보여도 지금 받을 수 있는 공간은 더 작습니다", detail: "설계상 총용량에는 정상 운영 때 비워 두는 안전 여유와 펌프 흡입이 어려운 바닥 물량이 들어 있습니다. EIA의 작업 저장용량은 이 물리적 한계를 반영한 별도 값입니다.", panel: "storage", formula: "작업 저장용량=최대 안전 채움량−탱크 바닥 물량", conclusion: "명목 총용량이나 선물 계약 수만으로 만기 인도 여유를 판단하면 안 됩니다." },
  { title: "수량·품질·소유권·대금 기록이 맞아야 인도가 끝납니다", detail: "인도월 안에 원유 또는 소유권을 넘기고, 지급일에는 실제 수량과 최종가격을 기준으로 대금을 보냅니다. 파이프라인 표와 수량 증서, 품질 자료, 소유권 문서, 송금 기록을 같은 계약 번호로 맞춥니다.", panel: "reconcile", formula: "원유 대금 $70,000(가정)+이동비 $120(가정) · 증거와 지급은 별도 대사", conclusion: "계약가치와 설명용 이동비를 합친 70,120달러만으로 실제 인도 완료를 증명할 수는 없습니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false, complete = false }: { label: string; value: string; active?: boolean; complete?: boolean }) {
  return <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/70 bg-primary/10" : complete ? "border-foreground/30 bg-muted/45" : "border-border"}`}><p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function Arrow() { return <span aria-hidden="true" className="self-center text-center font-mono text-[10px] font-black text-muted-foreground sm:text-sm">→</span>; }
function ContractPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="WTI 한 계약의 수량과 인도 범위"><Tile label="화면" value="WTI 1계약" complete /><Arrow /><Tile label="기준 수량" value="1,000 bbl" active /><Arrow /><Tile label="일반 범위" value="980~1,020" /></div>; }
function ValuePanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="WTI 선물 계약가치 계산"><Tile label="최종가격 가정" value="$70/bbl" complete /><span className="self-center font-mono text-xs font-black">×</span><Tile label="계약 수량" value="1,000 bbl" complete /><span className="self-center font-mono text-xs font-black">=</span><Tile label="계약가치" value="$70,000" active /></div>; }
function NoticePanel() { const rows=[["T","마지막 거래"],["T+1","매수·매도 의사"],["T+2","통지일·배정"],["T+3","인도 지시·증거금"]] as const; return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="WTI 인도 통지 일정">{rows.map(([day,event],index)=><Tile key={day} label={day} value={event} active={index===3} complete={index<3} />)}</div>; }
function ConnectionPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="쿠싱 인도 시설 연결 경로"><Tile label="매도 측" value="유입 시설" complete /><Arrow /><Tile label="쿠싱" value="승인 연결점" active /><Arrow /><Tile label="매수 측" value="반출 시설" /></div>; }
function MethodPanel() { return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="WTI 원유의 세 가지 인도 방법"><Tile label="원유 이동" value="시설 간 펌프오버" active /><Tile label="같은 시스템" value="이전·북아웃" complete /><Tile label="원유 정지" value="탱크 안 소유권" complete /></div>; }
function FeePanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="시설 간 이동비 계산"><Tile label="이동 단가 가정" value="$0.12/bbl" complete /><span className="self-center font-mono text-xs font-black">×</span><Tile label="수량" value="1,000 bbl" complete /><span className="self-center font-mono text-xs font-black">=</span><Tile label="이동비" value="$120" active /></div>; }
function StoragePanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="탱크 총용량과 작업 저장용량의 차이"><Tile label="설계 총용량" value="탱크 전체" complete /><span className="self-center font-mono text-xs font-black">−</span><Tile label="운영 제외" value="안전 여유·바닥" active /><span className="self-center font-mono text-xs font-black">=</span><Tile label="실제 기준" value="작업 저장용량" /></div>; }
function ReconcilePanel() { return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="WTI 인도 완료를 확인하는 증거"><Tile label="물량" value="수량·품질" complete /><Tile label="물류" value="파이프라인 표" complete /><Tile label="권리" value="소유권 문서" complete /><Tile label="정산" value="대금·이동비" active /></div>; }

export default function WtiCushingDeliveryPathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="WTI · 쿠싱 실물인도" title="가격 화면의 한 계약이 쿠싱 원유 1천 배럴의 통지·시설·소유권·대금으로 바뀌는 길" description="설명용 최종가격 70달러와 이동비 0.12달러를 현행 NYMEX Chapter 200의 인도 절차, EIA가 설명한 작업 저장용량의 물리적 한계에 연결합니다." note="70달러와 0.12달러는 계산을 위한 가정입니다. 실제 만기 인도에는 최신 거래소 규정, 청산회원 일정, 시설 계약과 요금표를 다시 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-wti-cushing-delivery data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "contract" && <ContractPanel />}{scene.panel === "value" && <ValuePanel />}{scene.panel === "notice" && <NoticePanel />}{scene.panel === "connection" && <ConnectionPanel />}{scene.panel === "method" && <MethodPanel />}{scene.panel === "fee" && <FeePanel />}{scene.panel === "storage" && <StoragePanel />}{scene.panel === "reconcile" && <ReconcilePanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="WTI 쿠싱 인도 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
