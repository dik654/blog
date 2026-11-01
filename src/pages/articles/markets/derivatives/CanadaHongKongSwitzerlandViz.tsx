import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["예치금", "노출", "손실", "공통 사실", "캐나다", "홍콩", "스위스", "판단 기록"] as const;

const NOTES = [
  "고객 예치금은 20이고, 고객이 밝힌 감당 가능한 손실 한도는 10이라고 가정합니다.",
  "예치금 20에 5배 레버리지를 적용하면 시장 노출은 100입니다.",
  "기초자산이 12% 불리하게 움직인 단순 시나리오의 손실은 12로, 고객 한도 10을 2만큼 넘습니다.",
  "국가 이름만 고르지 않고 고객 거주지·계약 법인, 제공 서비스, 상품과 거래 장소, 권유 여부를 먼저 확정합니다.",
  "캐나다 NI 93-101의 적용 범위에서는 파생상품 당사자 지위와 보호 포기 여부를 확인한 뒤 필요·목표·재무상황·위험감내도와 거래 적합성을 연결합니다.",
  "홍콩에서는 복잡한 장내 파생상품인지, 고객에게 파생상품 지식이 있는지, 권유·추천이 있었는지와 거래 장소에 따른 예외를 나눠 확인합니다.",
  "스위스에서는 단순 주문 실행, 개별 거래 자문, 포트폴리오 전체 자문·일임을 구분해 검사 없음·적정성·적합성 중 필요한 경로를 선택합니다.",
  "최종 기록에는 적용 관할, 고객 분류와 포기, 서비스, 상품·거래 장소, 고객 자료, 계산과 결정 이유를 한 주문 번호로 연결합니다.",
] as const;

type Panel = "deposit" | "exposure" | "loss" | "facts" | "canada" | "hongkong" | "switzerland" | "record";

const SCENES = [
  { title: "예치금 20과 손실 한도 10을 고객 자료로 둡니다", detail: "상품을 보기 전에 고객이 낸 돈과 스스로 밝힌 손실 감당 범위를 같은 단위로 고정합니다.", panel: "deposit", formula: "예치금=20 · 손실 한도=10", conclusion: "자산 규모나 고객 분류만으로 특정 파생상품의 이해도와 손실 감당력을 대신하지 않습니다." },
  { title: "5배 레버리지로 시장 노출이 100이 됩니다", detail: "예치금은 손실의 최대치와 같지 않습니다. 계약 구조와 추가 증거금, 강제청산 조건을 별도로 확인해야 합니다.", panel: "exposure", formula: "20×5=노출 100", conclusion: "고객이 실제로 움직이는 시장위험을 계산해야 다음 보호 절차의 입력이 생깁니다." },
  { title: "12% 하락의 단순 손실 12가 한도 10을 넘습니다", detail: "교육용 선형 손실 시나리오로 공통 사실관계를 만든 뒤 각 관할권의 판단 경로에 같은 숫자를 넣습니다.", panel: "loss", formula: "100×12%=12 · 12−10=2 초과", conclusion: "이 계산만으로 거래를 허용하거나 금지하지는 않지만 어떤 설명과 검사가 필요한지 묻게 합니다." },
  { title: "같은 주문을 비교하려면 네 가지 사실을 먼저 맞춥니다", detail: "고객·계약 관계, 서비스, 상품·거래 장소, 권유 여부 중 하나가 달라지면 적용 의무도 달라질 수 있습니다.", panel: "facts", formula: "관할+고객+서비스+상품·권유", conclusion: "국가별 결론표보다 적용 조건을 재현할 수 있는 사실 기록이 먼저입니다." },
  { title: "캐나다는 당사자 지위와 거래 적합성을 연결합니다", detail: "NI 93-101이 적용되는 장외 파생상품 영업에서 적격 파생상품 당사자인지와 보호 포기 여부를 가른 뒤 고객 자료와 거래를 맞춥니다.", panel: "canada", formula: "당사자 지위→고객 자료→거래 적합성", conclusion: "모든 고객에게 같은 추가 의무가 적용되는 것은 아니므로 현행 통합본과 지역별 적용·면제를 함께 확인합니다." },
  { title: "홍콩은 복잡상품·파생상품 지식·권유 여부를 나눕니다", detail: "HKFE 선물 같은 복잡한 장내 파생상품도 고객 지식 확인과 위험 설명을 거치며, 권유가 없는 거래의 적합성 예외는 별도 조건으로 판단합니다.", panel: "hongkong", formula: "복잡성→지식→권유·거래 장소", conclusion: "장내 상품이라는 이유만으로 지식 확인과 위험 설명까지 사라진다고 보면 안 됩니다." },
  { title: "스위스는 제공한 서비스가 검사 범위를 정합니다", detail: "개별 거래 자문은 지식·경험을 보는 적정성 검사, 포트폴리오 전체 자문·일임은 재무상황·목표까지 보는 적합성 검사를 사용합니다.", panel: "switzerland", formula: "실행만 / 개별 자문 / 전체 자문·일임", conclusion: "단순 주문 실행에는 두 검사를 하지 않을 수 있지만 고객에게 검사하지 않는다는 사실을 먼저 알려야 합니다." },
  { title: "최종 결정은 주문과 함께 다시 확인할 수 있게 남깁니다", detail: "면제나 경고만 기록하지 않고 어떤 사실과 계산으로 설명·권유·거절·실행을 선택했는지 연결합니다.", panel: "record", formula: "사실→규칙→계산→결정→사후 기록", conclusion: "국경 간 거래에서는 판단 결과보다 적용 근거와 당시 원문 버전까지 재현하는 기록이 중요합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function DepositPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="고객 예치금과 손실 한도"><Tile label="예치금" value="20" /><Tile label="손실 한도" value="10" active /></div>; }
function ExposurePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="레버리지 적용 과정"><Tile label="예치금" value="20" /><Tile label="레버리지" value="5배" /><Tile label="시장 노출" value="100" active /></div>; }
function LossPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="시장 하락과 고객 손실 한도 비교"><Tile label="노출" value="100" /><Tile label="12% 하락" value="손실 12" /><Tile label="한도 초과" value="2" active /></div>; }
function FactsPanel() { const items=[["고객","거주지·계약 법인"],["서비스","실행·자문·일임"],["상품","장내·장외·복잡성"],["행위","권유·고객 주문"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="국경 간 거래의 공통 사실">{items.map(([label,value])=><Tile key={label} label={label} value={value} />)}</div>; }
function CanadaPanel() { const items=[["1","당사자 지위"],["2","보호 포기"],["3","필요·재무·위험"],["4","거래 적합성"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="캐나다 파생상품 영업 판단">{items.map(([label,value],index)=><Tile key={label} label={`${label}단계`} value={value} active={index===3} />)}</div>; }
function HongKongPanel() { const items=[["1","복잡상품"],["2","파생 지식"],["3","권유 여부"],["4","장소·예외"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="홍콩 복잡 파생상품 판단">{items.map(([label,value],index)=><Tile key={label} label={`${label}단계`} value={value} active={index===3} />)}</div>; }
function SwitzerlandPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="스위스 서비스별 검사"><Tile label="주문 실행" value="검사 없음·고지" /><Tile label="개별 자문" value="적정성" /><Tile label="전체 자문·일임" value="적합성" active /></div>; }
function RecordPanel() { const items=[["적용","관할·원문"],["분류","고객·서비스"],["입력","상품·고객 자료"],["결론","계산·결정 이유"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="검증 가능한 주문 판단 기록">{items.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===3} />)}</div>; }

export default function CanadaHongKongSwitzerlandViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="파생상품 판매 · 세 관할 비교" title="같은 손실 12도 고객·서비스·상품 조건에 따라 서로 다른 판단 경로를 탑니다" description="예치금과 노출을 계산한 뒤 공통 사실을 고정하고, 캐나다·홍콩·스위스의 출발 질문과 주문 기록까지 한 흐름으로 봅니다." note="숫자는 판단 구조를 설명하기 위한 가정입니다. 실제 거래는 계약 법인, 고객 소재지, 면허, 상품과 거래 장소, 권유 방식, 거래 시점의 법령과 면제를 법률 전문가와 다시 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-canada-hong-kong-switzerland data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "deposit" && <DepositPanel />}{scene.panel === "exposure" && <ExposurePanel />}{scene.panel === "loss" && <LossPanel />}{scene.panel === "facts" && <FactsPanel />}{scene.panel === "canada" && <CanadaPanel />}{scene.panel === "hongkong" && <HongKongPanel />}{scene.panel === "switzerland" && <SwitzerlandPanel />}{scene.panel === "record" && <RecordPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="세 관할 파생상품 판단 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
