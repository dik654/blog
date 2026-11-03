import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["알림", "headers", "messages", "합의 검사", "상태 replay", "head 판정", "revert·apply"] as const;
const SCENES = [
  { owner: "peer / Syncer", title: "Peer가 candidate head 103을 알립니다", detail: "이 알림은 다운로드할 후보를 알려 줄 뿐입니다. Local head 100이나 durable state는 아직 바뀌지 않습니다.", candidate: "head 103 · untrusted", artifact: "peer head key", check: "아직 없음", local: "head 100 유지" },
  { owner: "Syncer.collectHeaders", title: "103에서 공통 조상 98까지 header ancestry를 모읍니다", detail: "Height가 내려가는지, parent CID가 이어지는지, checkpoint를 가르는 fork가 아닌지 확인합니다.", candidate: "B99 → B100 → B101 → B103", artifact: "header range", check: "ancestry + checkpoint", local: "head 100 유지" },
  { owner: "ChainExchange / blockstore", title: "각 block의 BLS·secp message bytes를 가져옵니다", detail: "Header의 message root는 약속일 뿐입니다. 받은 bytes로 root를 다시 계산해 약속과 같은지 확인합니다.", candidate: "headers + full messages", artifact: "message-root parity", check: "missing·malformed·wrong root", local: "head 100 유지" },
  { owner: "Syncer.ValidateTipSet / consensus", title: "Miner·election·서명·WinningPoSt와 tipset 규칙을 검사합니다", detail: "한 block이라도 실패하면 candidate generation 전체를 head 경쟁에서 제외합니다.", candidate: "fully formed tipsets", artifact: "block validation results", check: "모든 block 통과", local: "head 100 유지" },
  { owner: "StateManager / executor", title: "Parent state에서 canonical messages를 실행해 roots를 재현합니다", detail: "Network version, null rounds, cron과 migration을 같은 문맥으로 적용해 post-state와 receipt roots를 함께 비교합니다.", candidate: "S98 → S103", artifact: "state root + receipt root", check: "cold replay parity", local: "head 100 유지" },
  { owner: "ChainStore.RefreshHeaviestTipSet", title: "완전히 유효한 branches만 weight와 F3 checkpoint 안에서 비교합니다", detail: "Candidate가 더 높다는 이유만으로 이기지 않습니다. 더 무겁고 현재 checkpoint를 연장해야 합니다.", candidate: "B branch selected", artifact: "weight + checkpoint fence", check: "valid · heavier · compatible", local: "head 전환 승인" },
  { owner: "ChainStore head change", title: "공통 조상 98 뒤 A를 revert하고 B를 apply합니다", detail: "A99·A100 두 tipset을 되돌리고 B99·B100·B101 세 tipset을 적용합니다. Subscriber도 같은 순서를 받습니다.", candidate: "B101 published", artifact: "2 revert + 3 apply", check: "complete generation", local: "new head B101" },
] as const;

const NOTES = SCENES.map((scene, index) => `${LABELS[index]}. ${scene.title} ${scene.detail} 이 단계의 receipt는 ${scene.artifact}입니다.`);

export default function ModernChainSyncViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];
  return <VizFrame
    eyebrow="Local head A100 · peer candidate B103 · common ancestor 98"
    title="ChainSync는 더 높은 숫자를 받아들이는 기능이 아니라, 신뢰하지 않는 branch를 실행 가능한 local state로 바꾸는 검증 pipeline입니다"
    description="장면을 넘기면 candidate에 붙는 receipt가 늘어나지만 local head는 마지막 판정 전까지 그대로 유지됩니다."
    note="예시는 null epoch를 생략한 단순 경로입니다. 실제 head 선택은 tipset path, EC weight와 ChainStore checkpoint를 사용합니다."
    documentFlow
    canvasClassName="p-3 sm:p-6"
  >
    <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Lotus ChainSync 검증 장면 탐색기">
      <div data-viz-live-only className="space-y-4">
        <div data-viz-scene-stage className="min-h-[39rem] space-y-4 sm:min-h-[27rem] xl:min-h-[24rem]">
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {LABELS.map((label, index) => <div key={label} className={`border px-1 py-2 text-center text-[9px] font-black ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/30 bg-background" : "border-border bg-background text-muted-foreground"}`}>{index + 1}. {label}</div>)}
          </div>
          <div className="grid gap-px bg-border p-px lg:grid-cols-[minmax(0,1.35fr)_minmax(14rem,0.65fr)]">
            <div className="bg-background p-4 sm:p-5"><p className="text-[10px] font-black text-primary">현재 상태 소유자 · {scene.owner}</p><h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">{scene.title}</h4><p className="mt-2 break-keep text-xs leading-6 text-muted-foreground">{scene.detail}</p><div className="mt-5 h-1.5 bg-border/70"><div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${((scenes.active + 1) / SCENES.length) * 100}%` }} /></div></div>
            <div className="bg-background p-4 sm:p-5"><p className="text-[9px] font-bold text-muted-foreground">이번 단계의 receipt</p><p className="mt-2 border-l-2 border-primary pl-3 font-mono text-xs font-black leading-5">{scene.artifact}</p><p className="mt-4 break-keep text-[9px] leading-5 text-muted-foreground">이 receipt만으로 뒤 단계가 끝났다고 말할 수 없습니다.</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {[["candidate", scene.candidate], ["새 receipt", scene.artifact], ["현재 검사", scene.check], ["공개 local 상태", scene.local]].map(([label, value], index) => <div key={label} className={`relative min-w-0 border bg-background p-3 ${index === 3 && scenes.active < SCENES.length - 1 ? "border-border" : "border-primary/50"}`}><span className={`absolute -left-1 top-4 size-2 ${index <= Math.floor((scenes.active + 1) / 2) ? "bg-primary" : "bg-border"}`} /><p className="text-[9px] font-bold text-muted-foreground">{label}</p><p className="mt-2 break-keep font-mono text-[10px] font-bold leading-5">{value}</p></div>)}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="ChainSync 검증 경로 재생" compact />
      </div>
      <StaticSceneList labels={LABELS} notes={NOTES} />
    </div>
  </VizFrame>;
}
