import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["분류", "문맥 고정", "lease", "계산", "검증", "외부 효과", "종료선"] as const;

const JOBS = [
  {
    kind: "Sealing · sector 42",
    accent: "border-amber-500/60",
    steps: [
      "PC2 작업이 들어옴",
      "sector 42 · PC1 digest · proof profile",
      "worker A · fence 17",
      "CommD·CommR artifact 생성",
      "lineage·commit proof 확인",
      "PreCommit → ProveCommit",
      "actor state에서 active",
    ],
  },
  {
    kind: "WinningPoSt · epoch E",
    accent: "border-sky-500/60",
    steps: [
      "block 생산 기회 검사",
      "base tipset · E · election randomness",
      "worker B · fence 31",
      "challenged sectors로 proof 생성",
      "Winning profile로 proof 확인",
      "block assembly에 proof 전달",
      "유효한 block 후보",
    ],
  },
  {
    kind: "WindowPoSt · deadline D",
    accent: "border-emerald-500/60",
    steps: [
      "deadline D 작업이 열림",
      "partition snapshot · challenge randomness",
      "worker C · fence 52",
      "partition batch별 proof 생성",
      "Window profile로 proof 확인",
      "SubmitWindowedPoSt 전송",
      "성공 receipt가 포함됨",
    ],
  },
] as const;

const SCENE_COPY = [
  {
    title: "세 작업은 GPU를 쓴다는 점만 같고, 답해야 할 질문은 다릅니다",
    detail: "Scheduler는 먼저 task kind를 나눕니다. 이 구분을 잃으면 같은 proof API를 쓴다는 이유로 epoch·deadline·sector 문맥을 섞게 됩니다.",
    receipt: "task kind",
  },
  {
    title: "계산 전에 다시 만들 수 없는 입력 문맥을 한 묶음으로 고정합니다",
    detail: "Sealing은 upstream artifact, Winning은 한 epoch의 base와 randomness, Window는 deadline의 partition snapshot을 고정합니다.",
    receipt: "immutable job generation",
  },
  {
    title: "Worker가 바뀌어도 오래된 결과가 되살아나지 않게 fence를 붙입니다",
    detail: "Lease가 만료돼 새 worker가 이어받으면 generation은 유지하되 fencing token은 증가합니다. 이전 token의 늦은 결과는 버립니다.",
    receipt: "lease + fencing token",
  },
  {
    title: "Worker 성공은 계산 산출물이 생겼다는 뜻일 뿐입니다",
    detail: "CommR이나 proof bytes가 만들어져도 provider duty가 끝난 것은 아닙니다. 아직 입력 문맥과 맞는지 독립적으로 확인해야 합니다.",
    receipt: "content digest + completion marker",
  },
  {
    title: "검증기는 type·randomness·sector 순서를 다시 대조합니다",
    detail: "Winning proof를 Window profile에 넣거나, 같은 크기의 다른 sector artifact를 섞는 negative fixture가 여기서 모두 거절돼야 합니다.",
    receipt: "verified artifact",
  },
  {
    title: "검증 뒤에도 작업마다 다른 외부 효과가 남습니다",
    detail: "Sealing은 actor message 흐름, Winning은 block assembly, Window는 SubmitWindowedPoSt 메시지로 이어집니다. 재시도 전 기존 effect부터 조회합니다.",
    receipt: "idempotent external effect",
  },
  {
    title: "같은 ‘proof 완료’가 아니라 각 계약의 실제 종료선에서 닫습니다",
    detail: "Winning의 block 후보는 canonical inclusion을 보장하지 않습니다. 반면 Window와 sealing은 정의한 confidence까지 chain receipt를 추적해야 합니다.",
    receipt: "job-specific terminal receipt",
  },
] as const;

const NOTES = SCENE_COPY.map((scene, index) => `${LABELS[index]}. ${scene.title} ${scene.detail} 이 장면에서 새로 얻은 receipt는 ${scene.receipt}입니다.`);

export default function ModernProviderDutyViz() {
  const scenes = useAnimatedScenes(SCENE_COPY.length, 8200, { loop: false });
  const scene = SCENE_COPY[scenes.active];

  return <VizFrame
    eyebrow="같은 시각에 도착한 provider 작업 3개"
    title="Scheduler의 핵심은 worker를 빨리 고르는 일이 아니라, 서로 다른 작업 문맥과 종료선을 섞지 않는 일입니다"
    description="장면을 넘기면 세 작업이 분류·고정·계산·검증을 거쳐 서로 다른 목적지에서 닫히는 과정을 볼 수 있습니다."
    note="예시 token과 epoch는 설명용입니다. 실제 proof type·network version·deadline·confidence 정책은 실행 환경에서 고정해야 합니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Lotus provider 작업 계약 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="min-h-[49rem] space-y-4 sm:min-h-[35rem] xl:min-h-[30rem]">
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
          </div>

          <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.65fr)]">
            <div className="bg-background p-4 sm:p-5">
              <p className="text-[10px] font-black text-primary">현재 질문 · {LABELS[scenes.active]}</p>
              <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4>
              <p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p>
              <div className="mt-4 h-1.5 bg-border/70"><div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${((scenes.active + 1) / SCENE_COPY.length) * 100}%` }} /></div>
            </div>
            <div className="bg-background p-4 sm:p-5">
              <p className="text-[9px] font-bold text-muted-foreground">이번 장면이 남기는 receipt</p>
              <p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">{scene.receipt}</p>
              <p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">이 receipt만으로 다음 단계나 다른 job의 종료선을 대신할 수 없습니다.</p>
            </div>
          </div>

          <div className="grid gap-2 lg:grid-cols-3">
            {JOBS.map((job) => <article key={job.kind} className={`min-w-0 border bg-background p-3 sm:p-4 ${job.accent}`}>
              <p className="break-keep text-[10px] font-black">{job.kind}</p>
              <p className="mt-3 text-[9px] font-bold text-muted-foreground">현재 고정된 상태</p>
              <p className="mt-1 break-keep font-mono text-[10px] font-bold leading-5 sm:text-xs">{job.steps[scenes.active]}</p>
              <div className="mt-3 flex gap-1" aria-hidden="true">
                {LABELS.map((label, index) => <span key={label} className={`h-1 flex-1 ${index <= scenes.active ? "bg-primary" : "bg-border"}`} />)}
              </div>
            </article>)}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="Provider 작업 계약 재생" compact />
      </div>
      <StaticSceneList labels={LABELS} notes={NOTES} />
    </div>
  </VizFrame>;
}
