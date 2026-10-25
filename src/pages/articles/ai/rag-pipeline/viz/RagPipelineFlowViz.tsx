import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  {
    short: "원문",
    title: "환불 규정 v17과 읽기 권한을 함께 등록합니다.",
    note: "원문 내용뿐 아니라 revision·유효 시점·ACL이 파생 데이터의 출발점입니다.",
  },
  {
    short: "색인",
    title: "원문 위치를 보존한 chunk로 새 색인을 만듭니다.",
    note: "chunk c-8f31은 policy-v17의 §4.2와 원문 1180–1540 위치를 가리킵니다.",
  },
  {
    short: "전환",
    title: "검증된 manifest로 active alias를 전환합니다.",
    note: "Query encoder와 document index가 같은 checkpoint·전처리·거리 규약을 사용해야 합니다.",
  },
  {
    short: "질문",
    title: "사용자·권한·시점을 포함한 질문을 받습니다.",
    note: "질문 문자열만 보내지 않고 user u-42·employee 권한·요청 시각을 검색 경계에 전달합니다.",
  },
  {
    short: "문맥",
    title: "허가된 후보에서 근거를 골라 문맥에 남깁니다.",
    note: "c-8f31을 검색하고 중복을 제거한 뒤 4,992 token 문서 예산 안에 보존합니다.",
  },
  {
    short: "답변",
    title: "답변의 주장과 원문 revision을 다시 연결합니다.",
    note: "claim c2 → chunk c-8f31 → policy-v17 §4.2가 이어져야 지원 여부와 삭제·갱신 영향을 확인할 수 있습니다.",
  },
] as const;

type NodeProps = {
  step: number;
  active: number;
  label: string;
  receipt: string;
  owner: string;
};

function FlowNode({ step, active, label, receipt, owner }: NodeProps) {
  const reached = active >= step;
  const current = active === step;
  return (
    <div
      className={`min-w-0 border px-1.5 py-2 transition-colors sm:px-3 sm:py-3 ${
        current
          ? "border-primary bg-primary/10"
          : reached
            ? "border-primary/45 bg-background"
            : "border-border bg-background text-muted-foreground"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <strong className="break-keep text-[10px] leading-4 sm:text-xs sm:leading-5">{label}</strong>
        <span className="hidden shrink-0 font-mono text-[9px] text-primary sm:inline">
          {reached ? "확인" : "대기"}
        </span>
      </div>
      <p className="mt-1 break-words font-mono text-[9px] leading-4 sm:mt-2 sm:text-[10px] sm:leading-4">
        {receipt}
      </p>
      <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground sm:mt-2 sm:text-[10px] sm:leading-4">
        <span className="hidden sm:inline">소유자 · </span>{owner}
      </p>
    </div>
  );
}

function Connector({ reached }: { reached: boolean }) {
  return (
    <div className="flex items-center justify-center px-1" aria-hidden>
      <span className={`h-px w-full ${reached ? "bg-primary" : "bg-border"}`} />
    </div>
  );
}

function PipelineDiagram({ active }: { active: number }) {
  return (
    <div className="space-y-4">
      <section aria-label="원문에서 active index까지의 갱신 경로">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[10px] font-black text-primary">원문 갱신 경로</p>
          <p className="text-[9px] text-muted-foreground">질문 전에 준비</p>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_.6rem_minmax(0,1fr)_.6rem_minmax(0,1fr)] items-stretch sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)]">
          <FlowNode
            step={0}
            active={active}
            label="원문·권한"
            receipt="policy-v17 · employee"
            owner="문서·권한 원장"
          />
          <Connector reached={active >= 1} />
          <FlowNode
            step={1}
            active={active}
            label="Chunk·vector"
            receipt="c-8f31 · §4.2 · 1180:1540"
            owner="수집·색인 작업"
          />
          <Connector reached={active >= 2} />
          <FlowNode
            step={2}
            active={active}
            label="Active index"
            receipt="alias → index-v42"
            owner="색인 registry"
          />
        </div>
      </section>

      <section aria-label="사용자 질문에서 답변까지의 요청 경로">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[10px] font-black text-primary">사용자 질문 경로</p>
          <p className="text-[9px] text-muted-foreground">요청마다 실행</p>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_.6rem_minmax(0,1fr)_.6rem_minmax(0,1fr)] items-stretch sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)]">
          <FlowNode
            step={3}
            active={active}
            label="질문·신원"
            receipt="q-731 · u-42 · employee"
            owner="API·인증"
          />
          <Connector reached={active >= 4} />
          <FlowNode
            step={4}
            active={active}
            label="검색·문맥"
            receipt="rank 2 · c-8f31 · 4,992 tok"
            owner="검색·문맥 조립"
          />
          <Connector reached={active >= 5} />
          <FlowNode
            step={5}
            active={active}
            label="답변·인용"
            receipt="claim c2 → c-8f31 → v17"
            owner="생성·인용 검증"
          />
        </div>
      </section>
    </div>
  );
}

export default function RagPipelineFlowViz() {
  const labels = SCENES.map((scene) => `${scene.short}: ${scene.title}`);
  const notes = SCENES.map((scene) => scene.note);
  const controlLabels = SCENES.map((scene) => scene.short);
  const controls = useAnimatedScenes(SCENES.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? SCENES.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow="전체 지도 · 설명용 한 요청"
      title="원문 갱신 경로와 사용자 질문 경로가 active index에서 만납니다"
      description="두 경로와 상태 소유자를 고정해 두고, 한 환불 규정이 색인된 뒤 답변의 주장으로 연결되는 상태만 바꿉니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="rag-pipeline-flow"
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex min-h-full min-w-0 flex-col border-y border-border/70 bg-background px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-5 lg:px-6 lg:py-5"
      >
        <div data-viz-live-only>
          <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
            장면 · {String(active + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 min-h-10 break-keep text-base font-bold leading-5 sm:mt-2 sm:text-lg sm:leading-7">
            {SCENES[active].title}
          </h3>
          <div className="mt-3 lg:mt-4">
            <PipelineDiagram active={active} />
          </div>
          <p className="mt-3 min-h-10 border-l border-primary/50 pl-3 text-[11px] leading-4 text-muted-foreground sm:pl-4 sm:text-xs sm:leading-5 lg:min-h-[3.5rem] lg:text-sm lg:leading-6">
            {SCENES[active].note}
          </p>
        </div>
        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={controlLabels}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
