import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["예상 100", "입금 1,000", "고객확인", "상쇄 거래", "출금 980", "경보 연결", "STR 판단", "판정 경계"] as const;

const NOTES = [
  "고객확인 때 파악한 법인의 예상 월 거래규모를 100으로 놓고 정상 범위를 설명하는 기준으로 씁니다.",
  "실제 입금 1,000은 예상보다 900 크지만 금액 차이만으로 자금세탁이나 STR 제출을 확정하지 않습니다.",
  "법인명뿐 아니라 실소유자·사업·거래 목적·자금 출처와 예상 규모를 확인해 실제 거래와 비교할 위험 프로필을 만듭니다.",
  "서로 반대인 파생상품 거래로 가격위험을 거의 상쇄하고 비용·손실 20만 남았어도 자금의 출처와 목적은 별도로 확인합니다.",
  "잔액 980이 해외 계좌로 나가면 송금인·수취인 관계, 계약과 상업 목적, 최종 자금 사용처를 한 시간줄에서 봅니다.",
  "입금 시스템의 1,000, 거래 시스템의 손실 20, 출금 시스템의 980을 고객·실소유자 식별자로 연결해야 하나의 조사 사건이 됩니다.",
  "분석가는 설명과 자료를 모으고 보고책임자는 합당한 의심 근거가 있는지 검토해 STR 제출 여부와 근거를 기록합니다.",
  "경보는 자동 유죄·자동 STR·자동 계좌동결이 아닙니다. STR 제출과 KoFIU 분석, 법집행기관의 조사·수사도 서로 다른 단계입니다.",
] as const;

type Panel = "baseline" | "deposit" | "kyc" | "trades" | "withdraw" | "link" | "str" | "boundary";

const SCENES = [
  {
    title: "고객확인에서 예상한 월 거래규모 100을 정상 범위의 출발점으로 둡니다",
    detail: "규모 하나만 저장하지 않고 사업·거래 목적·자금 출처와 실소유자 정보를 함께 기록합니다.",
    panel: "baseline",
    formula: "예상 월 거래=100",
    conclusion: "예상값은 거래를 자동 차단하는 정답이 아니라 실제 행동과 설명의 차이를 찾는 비교 기준입니다.",
  },
  {
    title: "실제 입금 1,000은 예상보다 900 크므로 확인할 근거가 생깁니다",
    detail: "기업 인수대금·담보 이동·실제 수출입 헤지처럼 합리적인 이유가 있을 수 있어 금액만으로 결론 내리지 않습니다.",
    panel: "deposit",
    formula: "실제 입금 1,000−예상 100=차이 900",
    conclusion: "차이는 경보 입력값이며 자금세탁, STR 제출과 계좌 제한을 자동으로 확정하지 않습니다.",
  },
  {
    title: "법인 뒤의 실소유자와 사업·거래 목적·자금 출처를 다시 확인합니다",
    detail: "고객확인 자료가 오래됐거나 실제 거래와 달라졌다면 위험등급과 확인 범위를 갱신합니다.",
    panel: "kyc",
    formula: "고객 + 실소유자 + 사업 + 거래 목적 + 자금 출처",
    conclusion: "고객 신원과 거래 감시를 따로 끝내지 않고 같은 식별자로 자금·주문·수취인을 연결합니다.",
  },
  {
    title: "반대 방향 파생상품으로 위험을 줄여 손실 20만 남아도 자금 경로는 사라지지 않습니다",
    detail: "거래상대·기초자산·가격의 공정성·보유 시간과 수수료를 확인해 경제적 목적을 설명합니다.",
    panel: "trades",
    formula: "입금 1,000−거래 비용·손실 20=잔액 980",
    conclusion: "가격위험이 거의 없거나 손실이 났다는 사실은 자금 출처와 이동 목적의 확인을 대신하지 못합니다.",
  },
  {
    title: "잔액 980이 해외 계좌로 나가면 최종 수취인과 상업 목적을 확인합니다",
    detail: "수취인과 실소유자의 관계, 계약서·송장·담보 근거와 자금 사용처를 앞선 거래에 붙입니다.",
    panel: "withdraw",
    formula: "1,000 입금 → 20 비용·손실 → 980 해외 출금",
    conclusion: "국경을 넘었다는 이유만으로 의심을 확정하지 않지만 빠른 이동과 불투명한 관계는 확인 범위를 넓힐 수 있습니다.",
  },
  {
    title: "세 시스템의 1,000·20·980을 연결해야 하나의 자금경로가 보입니다",
    detail: "입출금·주문·손익이 서로 다른 저장소에 있어도 고객과 실소유자 식별자로 사건 시간줄을 만듭니다.",
    panel: "link",
    formula: "입금 기록 + 주문·손익 + 출금 기록 → 조사 사건",
    conclusion: "각 시스템에서 정상처럼 보인 단편을 연결해야 예상 거래와 다른 전체 행동을 설명할 수 있습니다.",
  },
  {
    title: "분석가가 자료를 모으고 보고책임자가 합당한 의심 근거와 STR 제출을 판단합니다",
    detail: "보고 기관·상대방·의심 거래 내용·합당한 근거·보존 자료를 기록하고 필요한 경우 KoFIU에 제출합니다.",
    panel: "str",
    formula: "경보 → 분석·자료 보강 → 보고책임자 검토 → STR 제출 또는 근거 있는 종결",
    conclusion: "자동 규칙은 우선순위를 정하고 보고책임자가 법과 내부 기준에 따라 제출 여부를 결정합니다.",
  },
  {
    title: "경보·STR·KoFIU 분석·법집행기관 조사는 서로 다른 상태입니다",
    detail: "보고 사실의 비밀유지와 접근 권한을 지키면서 각 단계의 결정자와 근거를 남깁니다.",
    panel: "boundary",
    formula: "경보≠STR≠유죄 · STR 제출≠자동 계좌동결",
    conclusion: "정상 거래의 오탐을 줄이면서 합당한 의심을 놓치지 않으려면 상태와 책임자를 분리해야 합니다.",
  },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function BaselinePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="고객의 예상 거래 기준"><Tile label="고객" value="법인" /><Tile label="예상 월 거래" value="100" active /><Tile label="목적" value="사업·헤지" /></div>;
}

function DepositPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="예상 거래와 실제 입금 차이"><Tile label="실제 입금" value="1,000" /><span className="font-mono text-xs font-black">−</span><Tile label="예상" value="100" /><span className="font-mono text-xs font-black">=</span><Tile label="차이" value="900" active /></div>;
}

function KycPanel() {
  const items = ["고객", "실소유자", "사업", "자금 출처"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="고객확인과 위험 프로필">{items.map((item, index) => <Tile key={item} label={`${index + 1}번`} value={item} active={index === items.length - 1} />)}</div>;
}

function TradesPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="상쇄 파생상품 거래와 잔액"><Tile label="입금" value="1,000" /><span className="font-mono text-xs font-black">−</span><Tile label="비용·손실" value="20" /><span className="font-mono text-xs font-black">=</span><Tile label="잔액" value="980" active /></div>;
}

function WithdrawPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="해외 출금 확인"><Tile label="출금" value="980" /><Tile label="수취인" value="관계 확인" active /><Tile label="목적" value="계약·증빙" /></div>;
}

function LinkPanel() {
  const items = [["입금", "1,000"], ["거래", "−20"], ["출금", "980"], ["사건", "한 시간줄"]] as const;
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="입금 거래 출금 기록 연결">{items.map(([label, value], index) => <Tile key={label} label={label} value={value} active={index === items.length - 1} />)}</div>;
}

function StrPanel() {
  const items = ["경보", "분석", "책임자", "STR"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="의심거래보고 판단 절차">{items.map((item, index) => <Tile key={item} label={`${index + 1}단계`} value={item} active={index === items.length - 1} />)}</div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="경보와 의심거래보고 이후 책임 경계"><Tile label="금융회사" value="STR 판단" /><Tile label="KoFIU" value="종합 분석" active /><Tile label="법집행기관" value="조사·수사" /></div>;
}

export default function DerivativesAmlFlowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="파생상품 AML · 고객·거래·자금"
      title="예상 100인 계좌에 들어온 1,000이 거래 뒤 980으로 나가는 경로를 추적합니다"
      description="고객확인 자료와 입금·파생상품 주문·손익·출금을 연결해 경보, 조사, STR 판단과 이후 분석의 책임을 구분합니다."
      note="금액은 자금경로를 설명하기 위한 가정입니다. 큰 금액·해외 송금·거래 손실만으로 의심거래나 범죄를 확정하지 않습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-derivatives-aml-flow data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "baseline" && <BaselinePanel />}
          {scene.panel === "deposit" && <DepositPanel />}
          {scene.panel === "kyc" && <KycPanel />}
          {scene.panel === "trades" && <TradesPanel />}
          {scene.panel === "withdraw" && <WithdrawPanel />}
          {scene.panel === "link" && <LinkPanel />}
          {scene.panel === "str" && <StrPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="파생상품 AML 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
