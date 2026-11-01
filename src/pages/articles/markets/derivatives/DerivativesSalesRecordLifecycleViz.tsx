import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["사건번호", "자료 버전", "녹취", "확인", "주문", "증거 묶음", "열람", "보존·파기"] as const;

const NOTES = [
  "14시10분에 고객 목적·재산·경험과 손실 감당력 자료를 확정하고 한 판매 사건번호를 발급합니다.",
  "실제로 보여 준 설명서 3판과 손실 계산표의 파일 식별자·해시·제공 시각을 사건번호에 연결합니다. 최신 4판으로 덮어쓰지 않습니다.",
  "14시12분부터 14시30분까지 18분 녹취를 남기고 참여자·채널·시작과 종료 시각, 녹취 파일의 무결성 정보를 기록합니다.",
  "녹취가 끝난 14시30분부터 주문한 14시32분까지 질문, 답변, 변경 사항과 고객의 최종 확인을 이어 붙입니다.",
  "14시32분 주문·호가·체결·증거금과 사후 알림을 같은 사건번호에 연결해 22분의 판단과 거래가 끊기지 않게 합니다.",
  "고객자료·문서 3판·18분 녹취·확인·주문·체결을 시각과 버전으로 묶고 변경·접근 이력을 별도로 남깁니다.",
  "권리구제를 위한 열람 요구가 오면 본인과 범위를 확인하고 제3자 정보·거절 사유를 검토해 사본이나 청취 경로와 처리 이력을 제공합니다.",
  "자료 종류별 보존 근거와 기간, 법적 보류를 확인합니다. 파기할 때는 원본·검색색인·내보낸 사본과 복원 백업의 재삭제 대상을 추적합니다.",
] as const;

type Panel = "event" | "document" | "recording" | "confirm" | "order" | "bundle" | "access" | "retention";

const SCENES = [
  { title: "14시10분 고객자료를 확정하고 판매 사건번호를 만듭니다", detail: "투자 목적·재산·경험과 손실 감당력, 고객 분류와 확인 시각을 한 사건의 출발점으로 저장합니다.", panel: "event", formula: "사건번호+고객자료+14:10", conclusion: "나중에 녹취와 주문을 찾으려면 처음부터 같은 식별자로 판단 자료를 연결해야 합니다." },
  { title: "고객에게 보여 준 설명서 3판과 손실표를 고정합니다", detail: "문서 이름만 남기지 않고 버전·해시·제공 시각을 기록해 최신 4판으로 바뀐 뒤에도 당시 설명을 재구성합니다.", panel: "document", formula: "설명서 v3+파일 해시+제공 시각", conclusion: "현재 저장소의 최신 문서와 주문 시점에 실제 제공한 문서는 서로 다른 증거입니다." },
  { title: "14시12분부터 14시30분까지 18분 녹취를 연결합니다", detail: "참여자와 채널, 시작·종료 시각, 파일 식별자와 무결성 정보를 사건번호 아래에 남깁니다.", panel: "recording", formula: "14:12→14:30=18분", conclusion: "녹음 파일 하나만 보관하지 않고 어떤 고객·문서·설명 절차의 기록인지 함께 알아야 합니다." },
  { title: "녹취 뒤 주문 전 2분의 질문과 최종 확인도 남깁니다", detail: "14시30분 이후에 바뀐 조건, 추가 질문과 답변, 고객의 의사 확인이 있었다면 주문 직전 상태로 이어 붙입니다.", panel: "confirm", formula: "14:30→14:32=질문·변경·최종 확인 2분", conclusion: "시간줄의 빈 2분을 놓치면 녹취 내용과 실제 주문 조건이 왜 달라졌는지 설명하기 어렵습니다." },
  { title: "14시32분 주문·체결·증거금과 알림을 같은 사건에 붙입니다", detail: "주문 화면과 체결 결과, 적용 가격·수량·증거금, 이후 알림을 판단·설명 기록과 연결합니다.", panel: "order", formula: "14:10→14:32=22분 판매 사건", conclusion: "설명을 했다는 기록과 어떤 거래가 실제로 실행됐는지를 같은 시간축에서 대조할 수 있어야 합니다." },
  { title: "자료 여섯 종류를 버전·시각·변경 이력으로 한 묶음으로 만듭니다", detail: "고객자료·문서·녹취·확인·주문·체결은 원본을 구분해 보관하고 접근자와 변경·내보내기 이력을 남깁니다.", panel: "bundle", formula: "판단+문서+통신+주문+체결+감사기록", conclusion: "변조 방지는 파일을 잠그는 일만이 아니라 누가 언제 무엇을 보거나 내보냈는지 재구성하는 통제입니다." },
  { title: "열람 요구가 오면 본인·범위·제3자 정보를 확인해 제공합니다", detail: "권리구제 목적의 요청을 접수하고 관련 자료를 찾은 뒤 법령상 제한 사유와 마스킹을 검토해 사본 또는 청취 경로를 제공합니다.", panel: "access", formula: "요청→본인·범위 확인→검토→열람·사본·청취→기록", conclusion: "법률은 자료 유형에 따라 요구일로부터 10일 이내 범위에서 대통령령이 정한 기간 안에 열람하도록 규정합니다." },
  { title: "자료별 근거·기간과 법적 보류를 확인한 뒤 파기를 추적합니다", detail: "모든 파일에 같은 기간을 붙이지 않고 원본·색인·내보낸 사본의 만료와 보류를 확인합니다. 백업 복원 때 되살아난 삭제 대상도 다시 처리합니다.", panel: "retention", formula: "보존 근거 종료∧보류 없음→파기+완료 증거", conclusion: "오래 보관하는 것과 빨리 지우는 것 모두 위험하므로 증거 보존과 개인정보 최소화를 자료 종류별로 조정합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function EventPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="판매 사건번호와 고객자료"><Tile label="시각" value="14:10" /><Tile label="입력" value="목적·재산·경험" /><Tile label="출력" value="사건번호" active /></div>; }
function DocumentPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="판매 설명서 버전 기록"><Tile label="제공 문서" value="설명서 3판" active /><Tile label="무결성" value="파일 해시" /><Tile label="현재 최신" value="4판·별도" /></div>; }
function RecordingPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="18분 판매 녹취"><Tile label="시작" value="14:12" /><Tile label="길이" value="18분" active /><Tile label="종료" value="14:30" /></div>; }
function ConfirmPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="녹취 뒤 주문 전 확인"><Tile label="녹취 종료" value="14:30" /><Tile label="질문·변경" value="2분" active /><Tile label="최종 확인" value="14:32" /></div>; }
function OrderPanel() { return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="판매 기록과 주문 체결 연결"><Tile label="판단" value="14:10" /><Tile label="설명" value="14:12~30" /><Tile label="주문" value="14:32" /><Tile label="결과" value="체결·알림" active /></div>; }
function BundlePanel() { const items=[["고객","자료"],["설명","문서 3판"],["통신","18분 녹취"],["거래","주문·체결"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="판매 증거 자료 묶음">{items.map(([label,value])=><Tile key={label} label={label} value={value} active />)}</div>; }
function AccessPanel() { const items=[["1","요청"],["2","본인·범위"],["3","제한 검토"],["4","제공 기록"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="금융소비자 판매 자료 열람">{items.map(([number,value],index)=><Tile key={number} label={`${number}단계`} value={value} active={index===3} />)}</div>; }
function RetentionPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="판매 자료 보존과 파기"><Tile label="자료별 기간" value="법적·업무 근거" /><Tile label="예외" value="법적 보류" /><Tile label="종료" value="파기·증거" active /></div>; }

export default function DerivativesSalesRecordLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="판매기록 · 판단에서 파기까지" title="14시10분 고객자료부터 14시32분 주문까지 22분을 한 사건으로 재구성합니다" description="설명서 버전·18분 녹취·질문과 확인·주문과 체결을 같은 사건번호로 연결하고 열람·보존·법적 보류·파기까지 기록의 생애를 추적합니다." note="시각과 설명서 판수는 교육용 사례입니다. 기록 자료의 종류·보존기간·열람 절차와 적용 대상은 거래 시점의 법률·시행령·감독규정과 회사 정책을 함께 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-derivatives-sales-record data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "event" && <EventPanel />}{scene.panel === "document" && <DocumentPanel />}{scene.panel === "recording" && <RecordingPanel />}{scene.panel === "confirm" && <ConfirmPanel />}{scene.panel === "order" && <OrderPanel />}{scene.panel === "bundle" && <BundlePanel />}{scene.panel === "access" && <AccessPanel />}{scene.panel === "retention" && <RetentionPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="판매기록 생애 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
