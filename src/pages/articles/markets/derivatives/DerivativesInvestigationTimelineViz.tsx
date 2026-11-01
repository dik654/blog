import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["대화", "주문", "수정", "취소", "경보", "수집", "보류", "검토"] as const;

const NOTES = [
  "09시59분50초의 통신 원본과 발신자·수신자·서버 시각을 사건번호에 연결합니다.",
  "10시00분00.100초 주문의 계정·상품·방향·가격·수량과 입력 주체를 원시 사건으로 고정합니다.",
  "10시00분00.350초 수정의 변경 전후 값과 같은 주문 식별자를 남기며 주문 뒤 0.250초가 지났습니다.",
  "10시00분00.600초 취소를 연결하면 주문부터 취소까지 0.500초의 전체 순서를 재생할 수 있습니다.",
  "10시05분 경보는 앞선 행위를 바꾸는 거래 사건이 아니라 조사 범위를 여는 분석 결과로 따로 기록합니다.",
  "주문 원시 로그·통신·신원·시장 문맥을 원본 형식과 메타데이터로 수집하고 해시·추출 시각·시계 오차를 남깁니다.",
  "사람·계정·자료원·기간을 정한 법적 보류로 예정된 삭제를 멈추고 수집·복사·열람 이력을 기록합니다.",
  "분석가는 사건을 재생하고 반증·누락 자료를 확인한 뒤 종결·추가 조사·보고를 결정하며 보류 변경과 해제도 승인 기록으로 남깁니다.",
] as const;

type Panel = "timeline0" | "timeline1" | "timeline2" | "timeline3" | "timeline4" | "collect" | "hold" | "review";

const SCENES = [
  { title: "09시59분50초의 대화 원본을 사건의 첫 시각으로 둡니다", detail: "메시지 내용만 복사하지 않고 참여자·서버 시각·첨부·수정 이력과 원본 파일 형식을 함께 고정합니다.", panel: "timeline0", formula: "대화 09:59:50 · 주문보다 10.100초 전", conclusion: "앞선 대화는 정황 자료이며 이것만으로 뒤 주문의 의도를 확정하지 않습니다." },
  { title: "10시00분00.100초 주문의 값과 입력 주체를 기록합니다", detail: "계정·기기·직원 또는 고객 식별자와 상품·방향·가격·수량을 주문 식별자 아래에 남깁니다.", panel: "timeline1", formula: "order_id 42 · 10:00:00.100 · 수량 100", conclusion: "최종 상태만 저장하면 처음 입력한 값과 누가 주문했는지 재구성하기 어렵습니다." },
  { title: "0.250초 뒤 수정에서 변경 전후 값을 이어 붙입니다", detail: "10시00분00.350초 사건이 같은 주문을 가리키도록 하고 수량·가격 등 바뀐 필드를 이전 값과 함께 남깁니다.", panel: "timeline2", formula: ".350−.100=0.250초", conclusion: "수정 기록은 새 주문 한 줄이 아니라 앞 사건과 연결된 상태 전이여야 합니다." },
  { title: "다시 0.250초 뒤 취소해 전체 0.500초 순서를 완성합니다", detail: "10시00분00.600초 취소의 주체와 이유 코드, 당시 잔여 수량과 부분체결 여부를 같은 사건표에 놓습니다.", panel: "timeline3", formula: ".600−.100=0.500초", conclusion: "빠른 취소가 보인다는 사실과 실제 시장조작 의도 판단은 별개의 단계입니다." },
  { title: "10시05분 경보는 거래 사건이 아니라 분석 결과로 연결합니다", detail: "어떤 규칙·모형·입력 데이터가 경보를 냈는지 기록하고 주문 뒤 시장 상황과 반복 패턴을 조사 범위에 넣습니다.", panel: "timeline4", formula: "10:05:00−10:00:00.600=4분59.4초", conclusion: "경보는 조사의 출발점이며 앞선 주문 기록을 덮어쓰거나 위반을 자동 확정하지 않습니다." },
  { title: "원시 주문·통신·신원·시장 문맥을 원본 꾸러미로 수집합니다", detail: "각 자료의 원래 형식과 메타데이터, 해시·추출 시각·시계 기준을 기록하고 분석용 변환본은 별도 파생물로 둡니다.", panel: "collect", formula: "원본+메타데이터+해시+추출 시각+시계 오차", conclusion: "화면 캡처만 남기면 검색 가능한 필드·수정 이력·첨부와 계산식이 사라질 수 있습니다." },
  { title: "범위를 정한 법적 보류로 예정된 삭제를 멈춥니다", detail: "대상 사람·계정·자료원·기간을 승인받고 자동 삭제 중지, 수집·복사·열람·내보내기 이력을 남깁니다.", panel: "hold", formula: "범위 승인→삭제 중지→수집→접근 기록→변경 승인", conclusion: "법적 보류는 회사 자료 전체를 영구 보관하는 명령이 아니며 과도하거나 좁은 범위 모두 위험합니다." },
  { title: "사건 재생과 반증 검토 뒤 결정·보류 해제까지 기록합니다", detail: "분석가는 시간표와 시장 문맥을 재생하고 검토자는 누락과 반대 증거를 확인해 종결·추가 조사·보고를 권한에 맞게 결정합니다.", panel: "review", formula: "재생→가설·반증→동료 검토→결정→보류 변경·해제", conclusion: "다른 검토자가 같은 자료와 검색 조건으로 결론을 다시 확인할 수 있어야 감사추적이 완성됩니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

const EVENTS = [
  ["대화", "09:59:50"],
  ["주문", ".100"],
  ["수정", ".350"],
  ["취소", ".600"],
  ["경보", "10:05"],
] as const;

function Tile({ label, value, active = false, complete = false }: { label: string; value: string; active?: boolean; complete?: boolean }) {
  return <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/70 bg-primary/10" : complete ? "border-foreground/30 bg-muted/45" : "border-border"}`}><p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function TimelinePanel({ active }: { active: number }) { return <div className="grid grid-cols-5 gap-1 sm:gap-2" aria-label="대화부터 경보까지의 사건 시간표">{EVENTS.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===active} complete={index<active} />)}</div>; }
function CollectPanel() { const items=[["주문","원시 사건"],["통신","원본·첨부"],["신원","계정·기기"],["시장","호가·체결"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="조사 원본 자료 수집">{items.map(([label,value])=><Tile key={label} label={label} value={value} complete />)}</div>; }
function HoldPanel() { const items=[["1","범위 승인"],["2","삭제 중지"],["3","수집·접근"],["4","변경 기록"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="법적 보류 상태 전이">{items.map(([number,value],index)=><Tile key={number} label={`${number}단계`} value={value} active={index===3} complete={index<3} />)}</div>; }
function ReviewPanel() { const items=[["1","사건 재생"],["2","가설·반증"],["3","동료 검토"],["4","결정·해제"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="조사 검토와 종결">{items.map(([number,value],index)=><Tile key={number} label={`${number}단계`} value={value} active={index===3} complete={index<3} />)}</div>; }

export default function DerivativesInvestigationTimelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="조사 기록 · 사건 재생" title="09시59분50초 대화부터 10시05분 경보까지 한 주문 사건을 다시 만듭니다" description="주문·수정·취소의 0.5초를 통신·신원·시장 문맥과 같은 시각표에 놓고, 원본 수집·법적 보류·검토·해제까지 증거의 상태를 추적합니다." note="시각과 주문값은 교육용 가정입니다. 기록 범위·보존기간·법적 보류와 당국 제출 형식은 적용 관할, 회사 지위와 개별 사건 요청을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-derivatives-investigation data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "timeline0" && <TimelinePanel active={0} />}{scene.panel === "timeline1" && <TimelinePanel active={1} />}{scene.panel === "timeline2" && <TimelinePanel active={2} />}{scene.panel === "timeline3" && <TimelinePanel active={3} />}{scene.panel === "timeline4" && <TimelinePanel active={4} />}{scene.panel === "collect" && <CollectPanel />}{scene.panel === "hold" && <HoldPanel />}{scene.panel === "review" && <ReviewPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="파생상품 조사 시간표 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
