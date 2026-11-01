import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["좋은 경로", "나쁜 경로", "출시 전 시험", "목표 고객", "판매 판단", "사후 자료", "수정 행동", "책임 순환"] as const;

const NOTES = [
  "조건을 지키면 원금 100은 만기 108이 되어 이익은 8입니다. 위쪽 수익만으로 상품을 승인하지 않습니다.",
  "보호선이 깨지고 지수가 60이면 상환액은 60, 고객 손실은 40입니다. 발행자 신용과 중도매각 위험도 남습니다.",
  "제조자는 시장 악화·유동성 저하·발행자 부도 같은 나쁜 조건에서 지급식·비용·고객 결과를 출시 전에 시험합니다.",
  "손실 40을 이해하고 감당할 고객을 목표시장으로, 원금 손실을 감당하지 못하는 고객을 판매 제외 대상으로 적습니다.",
  "판매자는 제조자의 상품 자료와 실제 고객의 지식·목표·손실 감당력을 맞춰 주문 허용과 설명 채널을 결정합니다.",
  "교육용 예에서 예상 민원 2건이 실제 8건이 되면 판매량·고객 유형·설명·손실 원인을 함께 조사합니다.",
  "원인에 따라 설명 수정, 채널 제한, 목표시장 변경, 신규 판매 중단과 기존 고객 안내를 각각 결정합니다.",
  "제조자는 상품 설계와 목표시장을, 판매자는 실제 고객 판단과 판매 자료를 맡고 사후 정보가 다시 양쪽 결정으로 돌아갑니다.",
] as const;

type Panel = "upside" | "downside" | "test" | "target" | "distribution" | "monitor" | "action" | "owners";

const SCENES = [
  { title: "조건을 지키면 원금 100은 만기 108이 됩니다", detail: "표시 수익은 8이지만 그 숫자만으로 고객의 필요, 이해 수준과 나쁜 경로의 손실을 판단할 수 없습니다.", panel: "upside", formula: "108−100=이익 8", conclusion: "상품 승인은 기대 수익을 확인하는 일이 아니라 지급식 전체가 고객에게 만들 수 있는 결과를 먼저 여는 절차입니다." },
  { title: "보호선이 깨지고 지수가 60이면 고객 손실은 40입니다", detail: "만기 상환뿐 아니라 중도매각 가격·유동성·발행자 신용이 나빠지는 경우도 별도 시나리오로 봅니다.", panel: "downside", formula: "100−60=손실 40", conclusion: "위쪽 이익 8과 아래쪽 손실 40의 비대칭을 이해하고 감당할 수 있는 고객인지 판단해야 합니다." },
  { title: "제조자는 출시 전에 나쁜 시장과 운영 조건을 시험합니다", detail: "시장 하락·유동성 저하·발행자 부도·예상 밖 수요에서 지급식과 비용, 헤지와 고객 결과가 어떻게 바뀌는지 확인합니다.", panel: "test", formula: "지급식·비용·위험→나쁜 조건→고객 결과", conclusion: "가격 계산에 성공했다는 사실은 상품 설계가 고객에게 적절하거나 운영 가능한지를 증명하지 않습니다." },
  { title: "목표시장과 판매 제외 대상을 구체적으로 나눕니다", detail: "고객 유형·지식·경험·재무상황·손실 감당력·목표와 필요를 상품 특성에 맞춰 적습니다.", panel: "target", formula: "목표 고객≠판매 제외 고객", conclusion: "목표시장은 홍보 대상 목록이 아니라 어떤 고객에게 어떤 채널로 팔 수 있는지 제한하는 설계 입력입니다." },
  { title: "판매자는 상품 자료와 실제 고객 정보를 맞춰 주문을 판단합니다", detail: "제조자가 정한 목표시장만 복사하지 않고 자신이 아는 고객과 유통 채널을 바탕으로 더 구체적인 판단을 만듭니다.", panel: "distribution", formula: "상품 정보+고객 정보→채널·설명·주문 판단", conclusion: "상품의 목표시장에 속한다는 사실과 개별 거래의 적합성·적정성이 확인됐다는 사실은 서로 다릅니다." },
  { title: "예상 민원 2건이 실제 8건이면 승인 가정과 비교합니다", detail: "민원 수 하나로 결함을 확정하지 않고 판매량·고객 유형·설명 이해도·손실 경로·시장 변화를 함께 봅니다.", panel: "monitor", formula: "실제 8−예상 2=경보 6", conclusion: "사후 자료는 자동 판정이 아니라 어떤 승인 가정이 어긋났는지 조사하게 만드는 경보입니다." },
  { title: "원인에 따라 설명·채널·목표시장과 판매 상태를 바꿉니다", detail: "설명 실패면 자료를 고치고 잘못된 고객 유입이면 채널을 제한하며 구조적 결함이면 신규 판매 중단과 기존 고객 안내를 검토합니다.", panel: "action", formula: "원인 확인→수정→승인→적용→효과 확인", conclusion: "회의에서 문제를 확인한 것과 고객에게 영향을 주는 판매·안내 정책이 실제로 바뀐 것은 다른 상태입니다." },
  { title: "제조자와 판매자의 책임과 자료가 다시 이어집니다", detail: "제조자는 상품 설계·시험·목표시장을, 판매자는 실제 고객·채널·판매 결과를 맡고 서로 필요한 정보를 돌려줍니다.", panel: "owners", formula: "제조 정보→판매 판단→고객 결과→재검토", conclusion: "상품 지배구조는 출시 승인 한 번이 아니라 실제 결과가 설계와 유통 판단을 계속 고치게 하는 생애주기 통제입니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function UpsidePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="구조화 상품의 좋은 경로"><Tile label="원금" value="100" /><Tile label="만기 상환" value="108" /><Tile label="이익" value="8" active /></div>; }
function DownsidePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="구조화 상품의 나쁜 경로"><Tile label="원금" value="100" /><Tile label="만기 상환" value="60" /><Tile label="손실" value="40" active /></div>; }
function TestPanel() { const items=["시장","유동성","발행자","수요"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="출시 전 나쁜 조건 시험">{items.map((item,index)=><Tile key={item} label={`${index+1}조건`} value={item} active={index===items.length-1} />)}</div>; }
function TargetPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="목표시장과 판매 제외 대상"><Tile label="목표시장" value="이해·감당 가능" active /><Tile label="판매 제외" value="원금 손실 불가" /></div>; }
function DistributionPanel() { const items=[["제조자","상품 자료"],["판매자","고객 자료"],["채널","설명"],["주문","판단"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="상품 정보와 고객 정보의 판매 판단">{items.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===items.length-1} />)}</div>; }
function MonitorPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="예상과 실제 고객 결과 비교"><Tile label="예상 민원" value="2" /><Tile label="실제 민원" value="8" active /><Tile label="차이" value="+6" /></div>; }
function ActionPanel() { const items=["설명","채널","목표","판매"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="설명 수정, 채널 제한, 목표시장 변경과 판매 중단">{items.map((item,index)=><Tile key={item} label={`${index+1}선택`} value={item} active={index===items.length-1} />)}</div>; }
function OwnersPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="상품 지배구조의 책임 순환"><Tile label="제조자" value="설계·목표" /><Tile label="판매자" value="고객·채널" /><Tile label="공유 자료" value="판매·결과" active /></div>; }

export default function ProductGovernanceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="상품 지배구조 · 설계·판매·사후 검토" title="위쪽 이익 8과 아래쪽 손실 40을 고객·채널·사후 자료로 다시 판단합니다" description="출시 전 나쁜 조건 시험, 목표시장과 판매 제외 대상, 실제 고객 판단, 출시 뒤 경보와 수정 행동을 제조자와 판매자의 책임 순환으로 연결합니다." note="원금 100, 상환액 108·60, 예상 민원 2건과 실제 8건은 흐름을 설명하기 위한 가정입니다. 실제 승인·판매 의무는 상품·고객·계약 법인과 관할 규칙을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-product-governance data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "upside" && <UpsidePanel />}{scene.panel === "downside" && <DownsidePanel />}{scene.panel === "test" && <TestPanel />}{scene.panel === "target" && <TargetPanel />}{scene.panel === "distribution" && <DistributionPanel />}{scene.panel === "monitor" && <MonitorPanel />}{scene.panel === "action" && <ActionPanel />}{scene.panel === "owners" && <OwnersPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="상품 지배구조 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
