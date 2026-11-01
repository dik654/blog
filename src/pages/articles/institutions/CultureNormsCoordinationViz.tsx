import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["약속", "회비", "기록", "절차", "규범", "미납", "경계"] as const;

const NOTES = [
  "가게들이 공동 청소를 약속하고 실제로 돈을 내며, 담당자가 기록하고 청소 결과를 확인합니다. 이번 경험은 다른 가게도 다음에 참여할 것이라는 기대를 다시 바꿉니다.",
  "설명용 A시장 10곳이 한 곳당 2만 원을 내면 20만 원을 모읍니다. 청소비 16만 원을 지급하고 4만 원이 남지만, 이 돈의 처리 규칙은 별도로 정해야 합니다.",
  "납부 기록과 청소 기록은 서로 다른 사실을 남깁니다. 깨끗한 거리만 보고 누가 비용을 냈는지 알 수 없고, 미납 기록만 보고 고의라고 확정할 수도 없습니다.",
  "분담 규칙은 누가 얼마를 낼지, 관찰은 실제 납부와 청소를, 이의 절차는 잘못된 기록과 예외를 고치는 길을 맡습니다. 제재는 이 확인 뒤에 옵니다.",
  "다른 가게도 낼 것이라는 예상과 내야 옳다는 믿음, 실제 납부 행동은 서로 다릅니다. 공동 편익을 비용 없이 누리는 무임승차도 의도와 사정을 확인한 뒤 판단합니다.",
  "미납이 없으면 20만 원 중 4만 원이 남고, 2곳 미납이면 16만 원으로 청소비만 맞습니다. 3곳 미납이면 14만 원으로 2만 원이 부족합니다.",
  "가게가 9곳으로 줄면 모두 같은 약속을 지켜도 18만 원만 모여 잔액이 2만 원으로 줄어듭니다. 협력의 결과를 국적 성격으로 돌리지 않고 구성원 수·비용·권리·수정 절차를 함께 봅니다.",
] as const;

type Panel = "loop" | "money" | "records" | "procedures" | "norms" | "nonpayment" | "boundary";

const SCENES = [
  { title: "약속·행동·관찰·다음 기대가 한 번의 공동 작업마다 이어집니다", detail: "가게들이 청소비를 내기로 하고 실제 납부와 청소 결과를 본 뒤 다음 참여 여부를 판단합니다.", panel: "loop", formula: "약속 → 납부·청소 → 기록·관찰 → 다음 기대", conclusion: "규범은 말로 정한 약속만이 아니라 다른 사람이 무엇을 할지에 대한 예상과 실제 행동을 함께 포함합니다." },
  { title: "가게 10곳이 2만 원씩 내면 20만 원을 모아 16만 원을 지급합니다", detail: "다른 비용은 없고 모든 가게가 청소 혜택을 받는다는 설명용 한 달 장부입니다.", panel: "money", formula: "10곳 × 2만 원 = 20만 원 · 20 − 16 = 잔액 4만 원", conclusion: "4만 원을 넘기거나 돌려줄 규칙과 청소가 부실할 때 문제를 제기할 절차는 별도로 필요합니다." },
  { title: "납부 기록과 청소 기록을 연결해야 약속과 서비스가 맞는지 알 수 있습니다", detail: "깨끗해진 거리와 가게별 입금 내역은 서로 다른 사실을 보여 줍니다.", panel: "records", formula: "가게별 납부 기록 ↔ 회비 장부 ↔ 청소 일시·구역·결과", conclusion: "청소 결과만으로 비용 부담자를 찾지 않고, 미납 기록만으로 고의나 사정을 확정하지 않습니다." },
  { title: "분담·관찰·이의 절차가 서로 다른 문제를 맡습니다", detail: "누가 규칙을 바꿀 수 있는지와 안내·정정·반복 위반 대응의 순서도 함께 정합니다.", panel: "procedures", formula: "분담 규칙 + 관찰 + 이의·정정 + 단계적 대응", conclusion: "기록을 잘 공개해도 반론하고 고칠 길이 없으면 잘못된 판단이 계속 남을 수 있습니다." },
  { title: "다른 가게도 낼 것이라는 예상과 내야 옳다는 믿음, 실제 납부를 구분합니다", detail: "공유된 기대와 관찰된 행동을 한데 묶어 한 나라 사람의 성격으로 바꾸지 않습니다.", panel: "norms", formula: "행동 예상 + 옳다는 믿음 ≠ 실제 납부 기록", conclusion: "무임승차라는 결과가 보여도 일시적 어려움·오류·의도를 확인한 뒤 대응합니다." },
  { title: "미납 0·2·3곳에서 잔액 4·0·−2만 원으로 결과가 갈립니다", detail: "한 곳당 2만 원과 청소비 16만 원은 유지한다는 설명용 비교입니다.", panel: "nonpayment", formula: "10×2−16=4 · 8×2−16=0 · 7×2−16=−2만 원", conclusion: "세 번째 미납부터는 부족한 2만 원의 임시 부담과 서비스 축소가 다음 달 기대까지 바꿀 수 있습니다." },
  { title: "같은 약속도 가게 수·비용·참여 권리가 바뀌면 다른 결과를 냅니다", detail: "가게 9곳이 모두 납부할 때의 잔액과 규칙 수정·참여·정정 권리를 함께 봅니다.", panel: "boundary", formula: "9×2−16=잔액 2만 원 · 참여·정보·정정 권리 별도 확인", conclusion: "협력의 성과를 문화적 고정값으로 읽지 않고 현지 조건과 권력, 규칙을 바꿀 수 있는 절차를 확인합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function LoopPanel() {
  const steps = [["약속", "2만 원 분담"], ["행동", "납부·청소"], ["관찰", "장부·결과"], ["다음 기대", "다시 참여할까"]] as const;
  return <Steps items={steps} label="공동 작업에서 약속과 기대가 이어지는 순환" />;
}

function Steps({ items, label }: { items: readonly (readonly [string, string])[]; label: string }) {
  return <div className="relative grid grid-cols-4 gap-1.5" aria-label={label}><span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />{items.map(([title, detail], index) => <div key={title} className="relative min-w-0 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span><p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>)}</div>;
}

function MoneyPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1.1fr] items-center gap-1.5 sm:gap-3" aria-label="공동 청소 회비 계산">
      <Amount label="가게 10곳" value="10×2만" /><span className="font-black">−</span><Amount label="청소비" value="16만" /><span className="font-black">=</span><Amount label="남은 돈" value="4만" primary />
    </div>
  );
}

function Amount({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-2.5 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p><p className={`mt-1 font-mono text-[10px] font-black sm:text-base ${primary ? "text-primary" : ""}`}>{value} 원</p></div>;
}

function RecordsPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="납부 기록과 청소 기록의 연결">
      <Record title="납부 기록" rows={["누가 냈나", "언제 입금됐나", "얼마가 모였나"]} /><span className="font-black">대조</span><Record title="청소 기록" rows={["언제 했나", "어디를 했나", "결과는 어땠나"]} primary />
    </div>
  );
}

function Record({ title, rows, primary = false }: { title: string; rows: readonly string[]; primary?: boolean }) {
  return <div className={`min-w-0 border p-3 sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className={`text-center text-[9px] font-black sm:text-xs ${primary ? "text-primary" : ""}`}>{title}</p><div className="mt-2 space-y-1">{rows.map((row) => <p key={row} className="border-t border-border pt-1 text-[8px] font-bold text-muted-foreground sm:text-[10px]">{row}</p>)}</div></div>;
}

function ProceduresPanel() {
  const items = [["분담", "누가 얼마를 내나"], ["관찰", "납부·청소 확인"], ["이의", "오류·예외 정정"], ["대응", "안내부터 단계별"]] as const;
  return <Steps items={items} label="공동 규칙을 유지하는 네 절차" />;
}

function NormsPanel() {
  const items = [["예상", "다른 가게도 낼 것"], ["당위", "내는 것이 옳음"], ["행동", "실제 입금 기록"]] as const;
  return <ThreeColumns items={items} label="예상과 당위와 행동의 구분" />;
}

function ThreeColumns({ items, label }: { items: readonly (readonly [string, string])[]; label: string }) {
  return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label={label}>{items.map(([title, detail], index) => <div key={title} className={`min-w-0 border-y py-3 text-center sm:py-4 ${index === 2 ? "border-foreground/50" : "border-border"}`}><p className={`text-[9px] font-black sm:text-sm ${index === 2 ? "text-primary" : ""}`}>{title}</p><p className="mt-1 break-keep text-[8px] font-bold leading-3.5 text-muted-foreground sm:text-[10px]">{detail}</p></div>)}</div>;
}

function NonpaymentPanel() {
  const items = [["미납 0곳", "20−16", "+4만"], ["미납 2곳", "16−16", "0"], ["미납 3곳", "14−16", "−2만"]] as const;
  return <ScenarioRows items={items} label="미납 가게 수에 따른 공동 청소비 잔액" />;
}

function ScenarioRows({ items, label }: { items: readonly (readonly [string, string, string])[]; label: string }) {
  return <div className="space-y-1.5" aria-label={label}>{items.map(([title, calc, value], index) => <div key={title} className={`grid grid-cols-[0.8fr_1fr_0.6fr] items-center gap-2 border-b py-2 ${index === items.length - 1 ? "border-foreground/50" : "border-border"}`}><p className="text-[9px] font-black sm:text-xs">{title}</p><p className="font-mono text-[9px] text-muted-foreground sm:text-xs">{calc}</p><p className={`text-right font-mono text-sm font-black ${index === items.length - 1 ? "text-primary" : ""}`}>{value}</p></div>)}</div>;
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-[0.8fr_1.2fr] gap-2 sm:gap-4" aria-label="가게 수 변화와 참여 권리">
      <div className="border border-foreground/50 p-3 text-center"><p className="text-[9px] font-black">가게 9곳</p><p className="mt-1 font-mono text-lg font-black text-primary">18−16=2만</p><p className="mt-1 text-[8px] text-muted-foreground">같은 관행·다른 결과</p></div>
      <div className="grid grid-cols-3 gap-1.5"><Mini title="참여" detail="규칙 수정" /><Mini title="정보" detail="장부 접근" /><Mini title="정정" detail="이의·구제" /></div>
    </div>
  );
}

function Mini({ title, detail }: { title: string; detail: string }) {
  return <div className="border-y border-border py-3 text-center"><p className="text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] text-muted-foreground sm:text-[10px]">{detail}</p></div>;
}

export default function CultureNormsCoordinationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="문화와 규범 · 설명용 A시장" title="가게 10곳의 회비 약속이 공동 청소와 다음 기대가 되는 과정" description="약속·납부·기록·정정 절차와 미납 시나리오를 따라가며 협력을 문화적 고정값으로 읽지 않습니다." note="가게 수·회비·청소비·미납은 모두 설명용 가정입니다. 특정 지역·국가 사람들의 성향이나 실제 법적 의무가 아닙니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-culture-norms-viz data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4"><div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "loop" && <LoopPanel />}{scene.panel === "money" && <MoneyPanel />}{scene.panel === "records" && <RecordsPanel />}{scene.panel === "procedures" && <ProceduresPanel />}{scene.panel === "norms" && <NormsPanel />}{scene.panel === "nonpayment" && <NonpaymentPanel />}{scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div></div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="공동 규칙과 협력 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
