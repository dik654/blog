import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LIFECYCLE_SCENES = [
  "외부 update",
  "batch 생성",
  "두 write",
  "merkleize",
  "ancestry 확인",
  "apply",
  "sync",
  "proof 확인",
] as const;

const LIFECYCLE_SHORT_LABELS = [
  "외부",
  "batch",
  "write",
  "root",
  "검사",
  "apply",
  "sync",
  "proof",
] as const;

const LIFECYCLE_NOTES = [
  "외부 Application이 Alice=10과 Bob=15라는 두 key update를 만들었다고 가정합니다. QMDB는 송금 규칙을 실행하지 않고 이미 만들어진 두 update만 받습니다.",
  "현재 DB root를 부모로 하는 branch-scoped batch-7을 만듭니다. 이 batch는 immutable snapshot이 아니라 부모 chain이 이기는 동안만 유효한 speculative view입니다.",
  "batch-7에 Alice와 Bob update를 stage합니다. 아직 DB의 visible state나 disk state는 바뀌지 않습니다.",
  "merkleize가 현재 state에 두 mutation을 resolve하고 candidate root R7을 계산합니다. R7은 적용했을 때의 결과이며 durable commit 증거가 아닙니다.",
  "validate_batch가 batch-7의 base와 ancestor chain이 현재 committed prefix와 이어지는지 확인합니다. 다른 sibling이 먼저 적용됐다면 StaleBatch로 거절합니다.",
  "apply_batch가 operation log와 Current view에 batch-7을 반영합니다. 이 순간 root는 R7이지만 문서 계약상 commit·start_sync·sync 전에는 durable 완료라고 부를 수 없습니다.",
  "sync가 적용된 state를 disk에 내구적으로 기록하고 crash 뒤 recovery가 필요 없는 경계까지 닫습니다. commit도 durable하게 만들지만 startup recovery가 필요할 수 있습니다.",
  "새 verifier가 operation과 activity bitmap chunk로 canonical root R7을 재구성합니다. 같은 root가 맞고 Alice의 최신 operation bit가 1일 때 현재 값 proof가 통과합니다.",
] as const;

const ACTORS = [
  ["APPLICATION", "두 key update 생성"],
  ["BATCH-7", "speculative branch"],
  ["CURRENT QMDB", "ops·activity·root"],
  ["DURABLE STORAGE", "journal·metadata"],
  ["VERIFIER", "root 재구성"],
] as const;

const ACTIVE: readonly (readonly number[])[] = [
  [0],
  [0, 1],
  [0, 1],
  [1, 2],
  [1, 2],
  [1, 2],
  [2, 3],
  [2, 3, 4],
];

const STATE = [
  ["base root", "R6", "durable", "yes", "proof", "old state"],
  ["batch", "batch-7", "DB root", "R6", "disk", "R6"],
  ["writes", "Alice=10 · Bob=15", "DB root", "R6", "disk", "R6"],
  ["candidate", "R7", "DB root", "R6", "disk", "R6"],
  ["ancestry", "valid", "candidate", "R7", "disk", "R6"],
  ["DB root", "R7", "durable", "not yet", "disk", "R6"],
  ["DB root", "R7", "durable", "yes", "disk", "R7"],
  ["canonical root", "R7", "activity", "Alice latest=1", "verify", "pass"],
] as const;

function LifecycleMap({ active }: { active: number }) {
  return (
    <div aria-label="Application update가 QMDB batch와 durable storage를 거쳐 verifier에서 확인되는 경로">
      <div className="grid gap-px bg-border p-px sm:grid-cols-2 xl:grid-cols-3">
        {ACTORS.map(([name, role], index) => (
          <div
            key={name}
            className={`min-w-0 bg-background px-2.5 py-3 transition-colors sm:min-h-24 sm:px-3 ${ACTIVE[active].includes(index) ? "ring-2 ring-inset ring-primary" : "opacity-45"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`block break-keep font-mono text-[8px] font-black sm:text-[9px] ${ACTIVE[active].includes(index) ? "text-primary" : "text-muted-foreground"}`}>{name}</span>
              <span className="font-mono text-[8px] text-muted-foreground" aria-label={`${index + 1}단계`}>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <strong className="mt-1 block break-keep text-[11px] leading-5 sm:text-xs">{role}</strong>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        {[0, 1, 2].map((index) => (
          <div key={STATE[active][index * 2]} className="min-w-0 bg-background px-2 py-2.5 sm:py-3">
            <span className="block break-keep text-muted-foreground">{STATE[active][index * 2]}</span>
            <strong className="mt-1 block break-keep text-primary">{STATE[active][index * 2 + 1]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StorageLifecycleViz() {
  const scenes = useAnimatedScenes(LIFECYCLE_SCENES.length, 3900, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame
      eyebrow="한 batch 추적 · Commonware v2026.9.0"
      title="Candidate root와 apply와 durable state는 같은 완료 상태가 아닙니다"
      description="batch-7 하나를 두 update부터 sync와 Current proof 검증까지 같은 식별자로 추적합니다."
      note="Alice와 Bob의 숫자는 저장 수명주기를 설명하기 위한 가정입니다. QMDB는 송금 규칙이나 client 응답을 자동으로 구현하지 않습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-commonware-storage-scene={active}
        tabIndex={0}
        role="group"
        aria-label="두 key update가 batch에서 durable QMDB state와 proof로 이어지는 여덟 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div className="overflow-x-auto" aria-label="Commonware Storage 수명주기의 여덟 장면">
            <div className="grid min-w-[352px] grid-cols-8 gap-px bg-border p-px lg:min-w-0">
              {LIFECYCLE_SCENES.map((scene, index) => (
                <button
                  type="button"
                  key={scene}
                  aria-pressed={index === active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-11 bg-background px-0.5 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:min-w-0 lg:py-2 ${index === active ? "text-primary" : index < active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{LIFECYCLE_SHORT_LABELS[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{scene}</strong>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 sm:mt-3"><LifecycleMap active={active} /></div>
          <p data-scene-note className="mt-2 min-h-[8.5rem] border-l-2 border-primary/50 pl-2.5 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:min-h-[5rem] sm:pl-4 sm:text-sm sm:leading-6">{LIFECYCLE_NOTES[active]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={LIFECYCLE_SCENES} controlLabels={LIFECYCLE_SCENES} playLabel="Storage 수명주기 재생" className="mt-0 sm:mt-4" compact />
      </div>
      <StaticSceneList labels={LIFECYCLE_SCENES} notes={LIFECYCLE_NOTES} />
    </VizFrame>
  );
}

const LEAF_GROUPS = [
  { peak: "peak · position 14", size: 8, leaves: [0, 1, 2, 3, 4, 5, 6, 7] },
  { peak: "peak · position 17", size: 2, leaves: [8, 9] },
  { peak: "peak · position 18", size: 1, leaves: [10] },
] as const;

export function MmrElevenViz() {
  return (
    <VizFrame
      eyebrow="구조 먼저 · 11 leaves"
      title="11개 leaf는 8·2·1 크기의 세 mountain으로 나뉩니다"
      description="Append해도 기존 node position은 바뀌지 않고, root는 세 peak를 설정된 bagging 순서로 결합합니다."
      note="Location은 leaf 삽입 순서이고 position은 전체 node의 post-order index입니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-2 sm:grid-cols-[8fr_2fr_1fr]" aria-label="11개 MMR leaf가 8개, 2개, 1개 산으로 나뉘는 구조">
        {LEAF_GROUPS.map((group) => (
          <div key={group.peak} className="min-w-0 border border-border bg-background p-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <strong className="break-keep text-[10px] text-primary sm:text-xs">{group.peak}</strong>
              <span className="text-[9px] text-muted-foreground">{group.size} leaves</span>
            </div>
            <div className={`mt-2 grid gap-px bg-border p-px ${group.size === 8 ? "grid-cols-8" : group.size === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
              {group.leaves.map((leaf) => (
                <div key={leaf} className="min-w-0 bg-background px-0.5 py-2 text-center font-mono text-[8px] sm:text-[10px]">L{leaf}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-px bg-border p-px text-center text-[10px] sm:text-xs">
        <p className="bg-background px-2 py-3"><span className="block text-muted-foreground">11₁₀</span><strong>1011₂</strong></p>
        <span className="flex items-center bg-background px-1 text-primary" aria-hidden>→</span>
        <p className="bg-background px-2 py-3"><span className="block text-muted-foreground">1인 bit</span><strong>3개</strong></p>
        <span className="flex items-center bg-background px-1 text-primary" aria-hidden>→</span>
        <p className="bg-background px-2 py-3"><span className="block text-muted-foreground">전체 nodes</span><strong>22−3=19</strong></p>
      </div>
    </VizFrame>
  );
}

export function ProofBoundaryViz() {
  const operations = [
    ["op 0", "Alice=10", "0 · 이후 update로 비활성"],
    ["op 1", "Bob=15", "1 · 현재 값"],
    ["op 2", "Alice=8", "1 · 현재 값"],
  ] as const;
  return (
    <VizFrame
      eyebrow="같은 operation log · 다른 질문"
      title="Any는 이력을, Current는 이력과 activity bit를 함께 확인합니다"
      description="Alice의 첫 update는 log에 남아 Any proof를 만들 수 있지만, op 2가 생긴 뒤 op 0은 현재 값 proof를 통과하지 못합니다."
      note="Current canonical root는 ops root와 grafted root를 결합하며, trailing chunk 상태에 따라 추가 digest도 포함합니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-px bg-border p-px" aria-label="세 operation과 각 activity bit">
        {operations.map(([id, value, bit]) => (
          <div key={id} className="grid grid-cols-[0.52fr_0.9fr_1.58fr] gap-px bg-border text-[10px] leading-5 sm:text-sm">
            <strong className="min-w-0 bg-background px-2 py-2 font-mono text-primary sm:px-3">{id}</strong>
            <span className="min-w-0 bg-background px-2 py-2 font-bold sm:px-3">{value}</span>
            <span className="min-w-0 break-keep bg-background px-2 py-2 text-muted-foreground sm:px-3">{bit}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-2">
        <div className="min-w-0 bg-background p-3">
          <span className="font-mono text-[9px] font-black text-muted-foreground">ANY · op 0</span>
          <strong className="mt-1 block break-keep text-xs sm:text-sm">Alice=10이 이력에 있었음 · 통과</strong>
          <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground sm:text-xs">이후 update가 있었는지는 답하지 않습니다.</p>
        </div>
        <div className="min-w-0 bg-background p-3 ring-2 ring-inset ring-primary">
          <span className="font-mono text-[9px] font-black text-primary">CURRENT · op 0</span>
          <strong className="mt-1 block break-keep text-xs sm:text-sm">Activity bit=0 · 현재 값 proof 실패</strong>
          <p className="mt-1 break-keep text-[10px] leading-5 text-muted-foreground sm:text-xs">op 2의 Alice=8은 bit=1이라 같은 root 아래에서 통과합니다.</p>
        </div>
      </div>
    </VizFrame>
  );
}

export function BranchDurabilityViz() {
  return (
    <VizFrame
      eyebrow="설계된 실패"
      title="먼저 적용된 sibling이 DB의 다음 prefix를 정하면 다른 sibling은 stale입니다"
      description="Batch 유효성과 disk durability는 별도 검사입니다. ancestry가 맞아도 apply만으로 sync 완료가 되지는 않습니다."
      note="Mutating method가 오류를 내거나 future가 끝나기 전에 drop되면 DB handle을 잃을 수 있으므로 validate_batch로 먼저 확인할 수 있습니다."
      canvasClassName="p-2 sm:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch" aria-label="같은 base에서 갈라진 batch A와 B 가운데 A 적용 뒤 B가 stale이 되는 경로">
        <div className="border border-primary bg-primary/[0.04] p-3">
          <span className="font-mono text-[9px] font-black text-primary">BASE R6 → BATCH A</span>
          <strong className="mt-2 block break-keep text-sm">validate · apply 성공</strong>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">DB prefix가 R7-A로 이동합니다.</p>
        </div>
        <div className="hidden items-center text-primary sm:flex" aria-hidden>→</div>
        <div className="border border-border bg-background p-3">
          <span className="font-mono text-[9px] font-black text-muted-foreground">BASE R6 → BATCH B</span>
          <strong className="mt-2 block break-keep text-sm">validate · StaleBatch</strong>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">B는 R7-A의 ancestor chain이 아니므로 읽기·child 생성·apply 대상이 아닙니다.</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-px bg-border p-px text-center text-[9px] leading-4 sm:text-xs sm:leading-5">
        <p className="bg-background px-2 py-3"><strong className="block text-primary">apply</strong>visible root 변경</p>
        <span className="flex items-center bg-background px-1 text-primary" aria-hidden>→</span>
        <p className="bg-background px-2 py-3"><strong className="block text-primary">commit</strong>durable · 시작 시 복구가 필요할 수 있음</p>
        <span className="flex items-center bg-background px-1 text-primary" aria-hidden>→</span>
        <p className="bg-background px-2 py-3"><strong className="block text-primary">sync</strong>durable · 시작 복구 불필요</p>
      </div>
    </VizFrame>
  );
}
