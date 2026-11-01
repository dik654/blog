import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["손실", "구간", "배분", "베이스 상관", "곡선", "신용사건", "경매 결제", "경계"] as const;

const NOTES = [
  "명목 100인 회사채 묶음에서 누적 포트폴리오 손실 7이 발생했다고 놓습니다.",
  "계약은 포트폴리오 손실의 0~3, 3~7, 7~10 구간을 각각 맡으며 시작점을 attachment, 끝점을 detachment라고 부릅니다.",
  "손실 7은 아래 구간부터 차례로 들어가 0~3에 3, 3~7에 4, 7~10에 0을 배분합니다.",
  "0~10 가상 첫손실 구간의 모형 가격이 관측된 0~3·3~7·7~10 구간 가격의 합과 같아지도록 상관 입력을 역산합니다.",
  "3%·7%·10% 같은 끝점마다 역산한 베이스 상관을 이어 곡선을 만들지만 서로 다른 값이 하나의 일관된 공동부도 확률표를 뜻하지는 않습니다.",
  "별도의 단일 CDS에서는 결정위원회의 신용사건 판단과 경매 개최, 인도 가능한 채무와 일정이 먼저 정해집니다.",
  "명목 1,000만 달러와 경매 최종가격 35를 가정하면 단순 손실률은 65%, 보호 지급액은 650만 달러입니다.",
  "트랜치 가격을 맞춘 베이스 상관과 특정 신용사건의 경매 최종가격은 입력·대상·시점이 다른 두 장부입니다.",
] as const;

type Panel = "loss" | "bands" | "allocation" | "base" | "curve" | "event" | "settlement" | "boundary";

const SCENES = [
  { title: "명목 100인 회사채 묶음에 누적 손실 7이 생깁니다", detail: "먼저 회사별 부도와 회수 결과를 합쳐 계약 전체가 나눠 가져야 할 포트폴리오 손실을 만듭니다.", panel: "loss", formula: "포트폴리오 명목 100 · 누적 손실 7", conclusion: "아직 어느 계약이 얼마를 잃는지는 정해지지 않았으며 손실 구간을 확인해야 합니다." },
  { title: "계약은 손실의 0~3, 3~7, 7~10 구간을 맡습니다", detail: "각 구간의 시작점과 끝점이 손실을 받기 시작하는 때와 원금을 전부 잃는 때를 정합니다.", panel: "bands", formula: "구간 손실=max(min(L,D)−A,0)", conclusion: "같은 포트폴리오를 참조해도 아래 구간은 작은 손실부터, 위 구간은 큰 공동 손실에서 영향을 받습니다." },
  { title: "손실 7은 아래부터 3·4·0으로 배분됩니다", detail: "0~3 구간을 먼저 전부 채운 뒤 남은 4가 3~7 구간을 채우고 7~10 구간에는 닿지 않습니다.", panel: "allocation", formula: "min(7,3)=3 · min(7,7)−3=4 · max(min(7,10)−7,0)=0", conclusion: "포트폴리오 손실률 하나가 구간별로 전혀 다른 원금 손실을 만듭니다." },
  { title: "0~10 가상 구간과 아래 세 구간의 시장가치를 맞춥니다", detail: "베이스 상관은 0부터 끝점까지의 가상 첫손실 구간 모형가가 관측된 하위 구간 가격의 합과 같아지게 하는 입력입니다.", panel: "base", formula: "가격(0~10;ρ10)=가격(0~3)+가격(3~7)+가격(7~10)", conclusion: "상관을 직접 세는 것이 아니라 특정 모형 안에서 거래 가격을 재현하도록 거꾸로 풉니다." },
  { title: "끝점마다 역산한 값을 이어 베이스 상관 곡선을 만듭니다", detail: "3%·7%·10%·15%처럼 끝점이 달라지면 가격을 맞추는 상관도 달라질 수 있어 곡선에 기울기가 생깁니다.", panel: "curve", formula: "끝점 3%→ρ3 · 7%→ρ7 · 10%→ρ10", conclusion: "곡선의 값은 모든 회사 쌍에 그대로 적용되는 실제 부도확률이나 자연 상수가 아닙니다." },
  { title: "단일 CDS 결제는 별도의 신용사건 절차에서 시작합니다", detail: "결정위원회가 사건과 경매 여부를 판단하고, 사건별 조건이 인도 가능한 채무·일정과 경매 방식을 정합니다.", panel: "event", formula: "신용사건 판단→경매 결정→인도 가능 채무→최종가격", conclusion: "포트폴리오 트랜치의 상관 보정과 한 회사 CDS의 계약상 결제 절차를 같은 계산으로 취급하지 않습니다." },
  { title: "최종가격 35는 손실률 65%와 지급액 650만 달러가 됩니다", detail: "명목 1,000만 달러의 단순 보호 지급액을 계산하고 미지급 프리미엄·상계·결제일은 계약 기록과 따로 맞춥니다.", panel: "settlement", formula: "$10m×(1−0.35)=$6.5m", conclusion: "경매 최종가격은 해당 사건의 계약상 회수 가격이며 트랜치의 베이스 상관과 다른 결과값입니다." },
  { title: "트랜치 평가와 신용사건 결제는 두 장부로 끝까지 구분합니다", detail: "왼쪽은 여러 회사의 공동손실을 가격에 맞추는 모형 장부이고, 오른쪽은 특정 사건의 최종가격으로 계약을 결제하는 운영 장부입니다.", panel: "boundary", formula: "모형 보정 장부≠사건 결제 장부", conclusion: "두 경로를 연결할 때도 계약 범위·날짜·참조대상과 사용한 가격을 명시해야 결과를 재현할 수 있습니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function LossPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="포트폴리오 명목과 누적 손실"><Tile label="회사채 묶음" value="명목 100" /><Tile label="누적 손실" value="7" active /></div>; }
function BandsPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="트랜치 시작점과 끝점"><Tile label="아래 구간" value="0~3" active /><Tile label="가운데 구간" value="3~7" /><Tile label="위 구간" value="7~10" /></div>; }
function AllocationPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="손실 7의 구간별 배분"><Tile label="0~3" value="손실 3 / 전액" active /><Tile label="3~7" value="손실 4 / 전액" active /><Tile label="7~10" value="손실 0" /></div>; }
function BasePanel() { return <div className="space-y-2.5" aria-label="베이스 상관 가격 맞춤"><div className="grid grid-cols-3 gap-1.5 sm:gap-3"><Tile label="시장가" value="0~3" /><Tile label="시장가" value="3~7" /><Tile label="시장가" value="7~10" /></div><div className="border border-primary/50 bg-primary/10 px-3 py-2 text-center text-xs font-black text-primary sm:text-sm">합계와 0~10 가상 구간 모형가를 일치</div></div>; }
function CurvePanel() { return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="끝점별 베이스 상관 곡선"><Tile label="끝점" value="3% · ρ₃" /><Tile label="끝점" value="7% · ρ₇" /><Tile label="끝점" value="10% · ρ₁₀" /><Tile label="결과" value="곡선·모형값" active /></div>; }
function EventPanel() { const steps=[["1","사건 판단"],["2","경매 결정"],["3","채무·일정"],["4","최종가격"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="CDS 신용사건 경매 절차">{steps.map(([number,value],index)=><Tile key={number} label={`${number}단계`} value={value} active={index===3} />)}</div>; }
function SettlementPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="CDS 경매 최종가격과 보호 지급"><Tile label="계약 명목" value="$10m" /><Tile label="경매 최종가격" value="35→손실 65%" /><Tile label="단순 지급" value="$6.5m" active /></div>; }
function BoundaryPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="트랜치 모형과 CDS 결제의 구분"><Tile label="트랜치 평가" value="여러 회사 · 가격 맞춤 · 베이스 상관" /><Tile label="CDS 결제" value="특정 사건 · 최종가격 · 현금결제" active /></div>; }

export default function CreditTrancheAuctionLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="신용 트랜치 · 손실과 결제" title="포트폴리오 손실 7의 3·4·0 배분과 최종가격 35의 650만 달러 결제를 구분합니다" description="여러 회사의 공동손실을 구간별로 나누고 가격에 맞춰 베이스 상관을 구하는 경로와, 한 회사의 신용사건을 경매 최종가격으로 결제하는 경로를 따로 추적합니다." note="손실 7과 최종가격 35는 교육용 가정입니다. 베이스 상관 설명은 2005년 BIS 자료의 시장 관행이며 현재 가격·모형 우위를 뜻하지 않습니다. 실제 결제는 해당 계약과 사건별 경매 조건을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-credit-tranche-auction data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "loss" && <LossPanel />}{scene.panel === "bands" && <BandsPanel />}{scene.panel === "allocation" && <AllocationPanel />}{scene.panel === "base" && <BasePanel />}{scene.panel === "curve" && <CurvePanel />}{scene.panel === "event" && <EventPanel />}{scene.panel === "settlement" && <SettlementPanel />}{scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="신용 트랜치와 경매 결제 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
