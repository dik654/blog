import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경로", "선택", "전환", "수입", "추천", "공개", "인과"] as const;

const NOTES = [
  "제작자가 정보를 만들고 화면 운영자가 순서를 정하며 독자가 일부를 읽고 행동합니다. 광고주·구독자·협찬자가 비용을 낼 수 있지만 돈의 경로는 서로 다릅니다.",
  "설명용 게시물 100개 가운데 10개가 화면에서 반복 노출됩니다. 화면에 보이는 10개의 비중만으로 전체 100개의 의견 분포를 확정하지 않습니다.",
  "광고 1천 회 노출에서 20번 클릭, 2건 구매를 가정하면 노출 기준 클릭률은 2%, 클릭 기준 구매율은 10%입니다. 1천 회는 1천 명을 뜻하지 않습니다.",
  "광고·구독·협찬은 돈을 내는 주체와 보상 기준이 다릅니다. 수입 유인이 있다는 사실만으로 허위 제작이나 특정 배치를 자동으로 입증하지 않습니다.",
  "프로파일링 기반 추천은 이용 기록으로 관심사를 추정할 수 있고, 최신순은 다른 기준으로 10칸을 채웁니다. 어느 쪽도 게시물의 진위를 자동 보증하지 않습니다.",
  "EU DSA의 추천 주요 기준 설명과 미국 FTC의 지급 관계 공개는 서로 다른 정보를 드러냅니다. 공개가 이뤄져도 사실 검증과 인과효과 측정은 별도입니다.",
  "광고를 본 뒤 2건이 구매됐어도 원래 살 생각이 있었을 수 있습니다. 조건이 비슷한 비노출 집단과 비교해야 광고가 추가로 만든 구매를 좁혀 볼 수 있습니다.",
] as const;

type Panel = "path" | "selection" | "funnel" | "revenue" | "ranking" | "disclosure" | "causality";

const SCENES = [
  { title: "정보는 제작·배치·읽기·행동을 거치고 돈은 별도 경로로 움직입니다", detail: "사실을 만든 주체, 화면 순서를 정한 주체, 비용을 낸 주체와 행동한 사람을 나눕니다.", panel: "path", formula: "제작 → 배치 → 노출·읽기 → 판단·행동", conclusion: "많이 보였다는 사실은 정확성·믿음·구매의 변화를 각각 증명하지 않습니다." },
  { title: "게시물 100개 가운데 선택된 10개가 화면에서 반복 보입니다", detail: "제한된 화면의 10칸에 어떤 게시물이 들어가는지와 전체 게시물의 분포를 구분합니다.", panel: "selection", formula: "전체 게시물 100개 → 화면에 선택 10개 → 반복 노출", conclusion: "보이지 않은 90개의 내용과 작성량을 화면의 10개만 보고 역으로 확정할 수 없습니다." },
  { title: "1천 회 노출에서 클릭 20번과 구매 2건을 서로 다른 분모로 셉니다", detail: "같은 사람이 여러 번 노출될 수 있고 클릭하지 않은 구매가 있을 수 있다는 설명용 기록입니다.", panel: "funnel", formula: "20 ÷ 1,000 = 2% · 2 ÷ 20 = 10%", conclusion: "노출 수·사람 수·클릭 수·구매 수를 같은 단위로 바꾸지 않습니다." },
  { title: "광고·구독·협찬은 돈을 내는 사람과 보상 기준이 다릅니다", detail: "광고주는 노출을 사고, 구독자는 계속 읽을 이유에 돈을 내며, 협찬은 제작자와 직접 관계를 만들 수 있습니다.", panel: "revenue", formula: "광고 1천 회 1만 원 · 구독료 · 제작자 협찬은 별도 거래", conclusion: "수입 방식은 선택의 조건이지만 실제 왜곡이나 허위의 증거는 별도로 확인해야 합니다." },
  { title: "같은 10칸도 이용 기록과 최신 시각이라는 다른 기준으로 채울 수 있습니다", detail: "프로파일링 기반 추천과 비프로파일링 선택지를 비교하는 설명용 화면입니다.", panel: "ranking", formula: "이용 기록·관심 추정 → 개인화 순서 · 게시 시각 → 최신순", conclusion: "추천 기준을 알 수 있어도 각 게시물의 진위와 노출의 인과효과가 자동으로 밝혀지지는 않습니다." },
  { title: "추천 기준 공개와 지급 관계 공개는 서로 다른 질문에 답합니다", detail: "EU DSA 사례는 순서를 정한 주요 기준을, 미국 FTC 사례는 판단에 영향을 줄 수 있는 지급 관계를 다룹니다.", panel: "disclosure", formula: "무엇을 왜 보여 줬나 ≠ 누가 누구에게 대가를 줬나", conclusion: "두 공개를 함께 봐도 사실 검증과 실제 행동 변화 측정은 별도로 남습니다." },
  { title: "광고 뒤 구매 2건과 광고가 추가로 만든 구매를 구분합니다", detail: "원래 구매할 생각이 비슷한 비노출 집단을 두고 노출 집단과 비교하는 사고실험입니다.", panel: "causality", formula: "노출 집단 구매 − 비노출 집단의 반사실 구매 = 추가 효과", conclusion: "시간상 먼저 보였다는 사실과 원인이었다는 주장은 같은 근거 수준이 아닙니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function PathPanel() {
  const steps = [["제작자", "취재·편집"], ["화면 운영자", "선택·순서"], ["독자", "노출·읽기"], ["행동", "구매·투표·공유"]] as const;
  return <Steps items={steps} label="정보 제작에서 행동까지의 경로" />;
}

function Steps({ items, label }: { items: readonly (readonly [string, string])[]; label: string }) {
  return <div className="relative grid grid-cols-4 gap-1.5" aria-label={label}><span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />{items.map(([title, detail], index) => <div key={title} className="relative min-w-0 text-center"><span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span><p className="mt-1 break-keep text-[9px] font-black sm:text-xs">{title}</p><p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p></div>)}</div>;
}

function SelectionPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="100개 게시물에서 화면의 10개를 선택하는 사례">
      <div className="grid grid-cols-10 gap-0.5 border border-border p-2" aria-label="전체 게시물 100개">{Array.from({ length: 100 }, (_, index) => <span key={index} className={`h-2 ${index < 10 ? "bg-primary" : "bg-muted"}`} />)}</div><span className="font-black">→</span><div className="border border-foreground/50 p-3 text-center"><p className="text-[9px] font-black">화면에 반복 배치</p><p className="mt-1 font-mono text-2xl font-black text-primary">10개</p><p className="mt-1 text-[8px] text-muted-foreground">선택 기준은 별도 확인</p></div>
    </div>
  );
}

function FunnelPanel() {
  const rows = [["노출", "1,000회", "100%"], ["클릭", "20번", "2%"], ["구매", "2건", "클릭의 10%"]] as const;
  return <div className="space-y-1.5" aria-label="노출에서 클릭과 구매로 이어지는 설명용 기록">{rows.map(([label, value, rate], index) => <div key={label} className="mx-auto grid grid-cols-[0.7fr_1fr_1fr] items-center border-y border-border py-2 text-center" style={{ width: `${100 - index * 16}%` }}><p className="text-[9px] font-black sm:text-xs">{label}</p><p className={`font-mono text-sm font-black ${index === 2 ? "text-primary" : ""}`}>{value}</p><p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">{rate}</p></div>)}</div>;
}

function RevenuePanel() {
  const items = [["광고", "광고주 → 화면 운영자", "노출·클릭"], ["구독", "독자 → 매체", "계속 읽을 가치"], ["협찬", "제공자 → 제작자", "후기·노출 관계"]] as const;
  return <ThreeColumns items={items} label="매체 수입의 세 경로" />;
}

function ThreeColumns({ items, label }: { items: readonly (readonly [string, string, string])[]; label: string }) {
  return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label={label}>{items.map(([title, path, basis], index) => <div key={title} className={`min-w-0 border-y py-3 text-center sm:py-4 ${index === 0 ? "border-foreground/50" : "border-border"}`}><p className={`text-[9px] font-black sm:text-sm ${index === 0 ? "text-primary" : ""}`}>{title}</p><p className="mt-1 break-keep text-[8px] font-bold leading-3.5 sm:text-[10px]">{path}</p><p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px]">기준: {basis}</p></div>)}</div>;
}

function RankingPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="프로파일링 기반 추천과 최신순 비교">
      <RuleBox title="개인화 순서" input="이용 기록·관심 추정" output="사람마다 다른 10칸" primary /><RuleBox title="최신순" input="게시 시각" output="최근 게시물 10칸" />
    </div>
  );
}

function RuleBox({ title, input, output, primary = false }: { title: string; input: string; output: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-3 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className={`text-[9px] font-black sm:text-sm ${primary ? "text-primary" : ""}`}>{title}</p><p className="mt-2 break-keep text-[8px] text-muted-foreground sm:text-[10px]">입력 · {input}</p><p className="mt-1 break-keep text-[9px] font-black sm:text-xs">출력 · {output}</p></div>;
}

function DisclosurePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="추천 기준과 광고 관계 공개의 차이">
      <RuleBox title="추천 기준 공개" input="왜 이 순서인가" output="주요 배치 기준" primary /><RuleBox title="지급 관계 공개" input="누가 대가를 줬나" output="광고·협찬 관계" />
    </div>
  );
}

function CausalityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="노출 집단과 비노출 비교 집단">
      <CompareBox title="광고 노출" detail="구매 2건 관측" primary /><span className="font-black">− 비교 →</span><CompareBox title="비노출" detail="원래 살 구매 추정" />
    </div>
  );
}

function CompareBox({ title, detail, primary = false }: { title: string; detail: string; primary?: boolean }) {
  return <div className={`min-w-0 border p-3 text-center sm:p-4 ${primary ? "border-foreground/50" : "border-border"}`}><p className={`text-[10px] font-black sm:text-sm ${primary ? "text-primary" : ""}`}>{title}</p><p className="mt-1 break-keep text-[9px] font-bold text-muted-foreground sm:text-xs">{detail}</p></div>;
}

export default function MediaAttentionPublicBeliefViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="정보와 주목 · 설명용 화면" title="게시물 100개가 화면 10칸과 노출 1천 회를 거쳐 행동 기록이 되는 과정" description="제작·추천·수입·공개와 인과 판단을 분리해, 무엇을 관측했고 무엇은 아직 모르는지 연결합니다." note="게시물·노출·클릭·구매·광고비는 모두 설명용 가정입니다. 실제 플랫폼의 추천 방식·단가·광고 효과가 아닙니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-media-attention-viz data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4"><div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "path" && <PathPanel />}{scene.panel === "selection" && <SelectionPanel />}{scene.panel === "funnel" && <FunnelPanel />}{scene.panel === "revenue" && <RevenuePanel />}{scene.panel === "ranking" && <RankingPanel />}{scene.panel === "disclosure" && <DisclosurePanel />}{scene.panel === "causality" && <CausalityPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div></div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="정보 선택과 행동 기록 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
