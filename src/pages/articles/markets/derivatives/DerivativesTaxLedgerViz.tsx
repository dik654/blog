import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경제손익", "납세자", "계약 분류", "인식 시점", "통산", "한국 계산", "미국 계산", "신고 근거"] as const;

const NOTES = [
  "같은 과세기간의 이익 1,200만 원과 손실 500만 원을 단순 합치면 경제적 순손익은 700만 원입니다.",
  "개인·법인 여부, 거주지와 거래 목적을 먼저 확인해야 어느 국가의 어떤 소득 장부를 만들지 정할 수 있습니다.",
  "한국의 과세대상 파생상품인지, 미국의 적격 Section 1256 계약인지처럼 계약을 해당 세법의 정의에 넣습니다.",
  "계약별 실현·정산 내역을 모으고, 미국 Section 1256처럼 연말 미결제약정을 시가평가하는 규칙이 있는지 확인합니다.",
  "이익과 손실은 법이 허용한 같은 범위에서만 합칩니다. 화면에 함께 보인다는 이유로 다른 자산 손익까지 자동 통산하지 않습니다.",
  "한국 거주 개인의 과세대상 파생상품이라는 가정에서는 700만 원에서 연 250만 원을 공제한 450만 원에 탄력세율 10%를 적용합니다.",
  "미국의 적격 Section 1256 순이익 10은 일반적으로 장기 6과 단기 4로 나뉘지만, 헤지거래와 일부 계약에는 예외가 있습니다.",
  "거주지·과세연도·계약 식별자·거래소·체결과 정산·환율·수수료를 신고 숫자와 연결해야 계산을 다시 검증할 수 있습니다.",
] as const;

type Panel = "net" | "person" | "contract" | "timing" | "scope" | "korea" | "us" | "evidence";

const SCENES = [
  {
    title: "이익 1,200만 원과 손실 500만 원의 경제적 순손익은 700만 원입니다",
    detail: "이 숫자는 세법상 통산 범위·공제·세율을 적용하기 전의 출발점입니다.",
    panel: "net",
    formula: "+1,200만−500만=700만 원",
    conclusion: "거래 화면의 순손익은 세후 현금이 아니며 같은 숫자도 납세자와 계약에 따라 다른 장부로 이동합니다.",
  },
  {
    title: "세율보다 먼저 누가 어느 나라에 신고하는지 확인합니다",
    detail: "개인인지 법인인지, 거주지는 어디인지, 투자인지 사업·헤지인지가 과세 경로를 바꿉니다.",
    panel: "person",
    formula: "신분 + 거주지 + 거래 목적 → 적용할 과세 관할",
    conclusion: "거래 앱·서버·중개회사의 국가만으로 납세자의 거주지와 과세 관할을 정하지 않습니다.",
  },
  {
    title: "같은 ‘선물’ 표시라도 각 세법의 계약 정의에 들어가는지 다시 분류합니다",
    detail: "한국의 과세대상 범위와 미국의 Section 1256 범위는 서로 다른 법적 질문입니다.",
    panel: "contract",
    formula: "계약·기초자산·거래소·청산 방식 → 세법상 상품 범주",
    conclusion: "상품 이름을 보고 다른 나라의 세금 규칙을 그대로 옮기지 않고 계약의 법적 범위를 먼저 확인합니다.",
  },
  {
    title: "실현·정산 내역과 연말 시가평가 대상 미결제약정을 구분합니다",
    detail: "미국 Section 1256 계약은 일반적으로 연말 마지막 영업일의 공정가치로 판 것으로 보지만 예외가 있습니다.",
    panel: "timing",
    formula: "실현 손익 + 적용되는 연말 평가 손익 → 해당 연도의 인식액",
    conclusion: "현금이 입출금된 날과 세금 장부에 손익을 넣는 날이 언제나 같지는 않습니다.",
  },
  {
    title: "법이 허용한 같은 장부 안에서만 이익 1,200과 손실 500을 합칩니다",
    detail: "다른 자산·다른 소득 성격·다른 관할의 손익을 한 화면에 보인다는 이유로 섞지 않습니다.",
    panel: "scope",
    formula: "같은 통산 범위: 1,200−500=700 · 범위 밖 손익: 별도 계산",
    conclusion: "경제적으로 상쇄되는 현물과 파생상품도 세법상 성격이나 인식 시점이 다르면 같은 기간에 상쇄되지 않을 수 있습니다.",
  },
  {
    title: "한국 사례에서는 700만 원에서 250만 원을 공제한 뒤 10%를 적용합니다",
    detail: "한국 거주 개인의 과세대상 파생상품이고 다른 조정이 없다는 설명용 가정입니다.",
    panel: "korea",
    formula: "(700만−250만)×10%=45만 · 지방소득세 4.5만 · 합계 49.5만 원",
    conclusion: "기본 신고기간은 다음 해 5월이며 휴일이면 기한이 다음 날로 연장될 수 있으므로 해당 귀속연도의 공지를 확인합니다.",
  },
  {
    title: "미국 적격 Section 1256 순이익 10은 일반적으로 장기 6과 단기 4로 나뉩니다",
    detail: "연말 시가평가와 60·40 성격 분류를 보여주는 별도 사례이며 한국 세액 계산과 합치지 않습니다.",
    panel: "us",
    formula: "Section 1256 순이익 10×60%=장기 6 · ×40%=단기 4",
    conclusion: "헤지거래·혼합 스트래들·적격 계약 범위 같은 예외가 있으므로 이 비율만으로 실제 미국 세액을 계산하지 않습니다.",
  },
  {
    title: "신고 숫자마다 계약과 거래 기록을 연결해야 다음 해에도 같은 계산을 재현할 수 있습니다",
    detail: "중개회사 연간 내역은 증거의 출발점이며 계약 분류와 환율·비용 판단까지 자동으로 대신하지 않습니다.",
    panel: "evidence",
    formula: "거주지·연도·계약·체결·정산·환율·수수료 → 신고서 숫자",
    conclusion: "세법과 신고기한은 바뀔 수 있으므로 공식 자료의 적용연도와 전문가 검토를 붙여 계산 근거를 보존합니다.",
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

function NetPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="파생상품 경제적 순손익"><Tile label="이익" value="+1,200만" /><span className="font-mono text-xs font-black">−</span><Tile label="손실" value="500만" /><span className="font-mono text-xs font-black">=</span><Tile label="순손익" value="700만" active /></div>;
}

function PersonPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="납세자와 과세 관할 확인"><Tile label="신분" value="개인·법인" /><Tile label="거주지" value="과세 관할" active /><Tile label="거래 목적" value="투자·사업·헤지" /></div>;
}

function ContractPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="한국과 미국의 파생상품 세법상 계약 분류"><Tile label="한국" value="과세대상 파생상품인가" /><Tile label="미국" value="Section 1256 계약인가" active /></div>;
}

function TimingPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="손익 인식 시점"><Tile label="거래 중" value="체결·정산·실현" /><span className="font-mono text-xs font-black">→</span><Tile label="과세연도 말" value="적용 시 시가평가" active /></div>;
}

function ScopePanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="손익 통산 범위"><Tile label="같은 과세 범위" value="+1,200−500=700" active /><Tile label="범위 밖 손익" value="별도 장부" /></div>;
}

function KoreaPanel() {
  const items = [["순손익", "700만"], ["기본공제", "−250만"], ["과세표준", "450만"], ["세액", "49.5만"]] as const;
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="한국 파생상품 양도소득세 설명용 계산">{items.map(([label, value], index) => <Tile key={label} label={label} value={value} active={index === items.length - 1} />)}</div>;
}

function UsPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="미국 Section 1256의 60 대 40 분류"><Tile label="순이익" value="10" /><span className="font-mono text-xs font-black">→</span><Tile label="장기" value="6" active /><span className="font-mono text-xs font-black">+</span><Tile label="단기" value="4" /></div>;
}

function EvidencePanel() {
  const items = ["거주지", "계약", "체결", "정산", "환율", "비용"];
  return <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-3" aria-label="파생상품 세금 신고 근거">{items.map((item, index) => <Tile key={item} label={`${index + 1}번`} value={item} active={index === items.length - 1} />)}</div>;
}

export default function DerivativesTaxLedgerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="파생상품 세금 · 분류·시점·관할"
      title="이익 1,200만 원과 손실 500만 원이 두 나라에서 다른 세금 장부로 바뀌는 과정을 봅니다"
      description="거래 화면의 순손익에서 시작해 납세자·계약·인식 시점·통산 범위를 차례로 통과한 뒤 한국과 미국의 설명용 계산으로 갈라집니다."
      note="수치는 세법 구조를 비교하기 위한 가정입니다. 실제 신고에는 거래연도, 납세자 지위, 계약과 최신 법령을 확인해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-derivatives-tax-ledger data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "net" && <NetPanel />}
          {scene.panel === "person" && <PersonPanel />}
          {scene.panel === "contract" && <ContractPanel />}
          {scene.panel === "timing" && <TimingPanel />}
          {scene.panel === "scope" && <ScopePanel />}
          {scene.panel === "korea" && <KoreaPanel />}
          {scene.panel === "us" && <UsPanel />}
          {scene.panel === "evidence" && <EvidencePanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="파생상품 세금 장부 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
