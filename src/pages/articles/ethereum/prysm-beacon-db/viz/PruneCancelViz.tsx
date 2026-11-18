import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pruning — DeleteHistoricalDataBeforeSlot은 cutoff 이전 slot/root 쌍을 먼저 읽고,
 * 한 write transaction에서 쌍마다 block·finalized-root index·state·summary·validator hashes를 지운 뒤
 * block/state slot index와 cache를 정리한다. callback 안에서 context 취소를 만나면 nil을 반환한다.
 * 쌍 네 개와 둘째 쌍 뒤의 취소 시점은 설명용 가정이다.
 */
type Tone = "idle" | "pending" | "done" | "warn" | "skip";
type Pair = readonly [string, Tone];
interface PruneScene {
  label: string;
  summary: string;
  note: string;
  pairs: readonly Pair[];
  steps: readonly Pair[];
}

const PAIRS = ["쌍 1", "쌍 2", "쌍 3", "쌍 4"] as const;
const STEPS = ["slot index 정리", "cache 정리", "callback 반환"] as const;

const SCENES = [
  {
    label: "정상 · 선택",
    summary: "cutoff 이전 slot/root 쌍 4개 (가정)",
    note: "먼저 별도 read 경로에서 cutoff 이전 slot/root 쌍을 읽어 이번 batch를 정합니다. 여기서는 네 쌍이 골라졌다고 가정합니다.",
    pairs: [["남아 있음", "idle"], ["남아 있음", "idle"], ["남아 있음", "idle"], ["남아 있음", "idle"]],
    steps: [["대기", "idle"], ["대기", "idle"], ["대기", "idle"]],
  },
  {
    label: "정상 · 쌍별 삭제",
    summary: "한 write transaction 안에서 4쌍 삭제",
    note: "한 db.Update callback이 쌍마다 block, finalized-root index, state, state summary, validator hashes를 지웁니다. 아직 commit 전입니다.",
    pairs: [["삭제 · commit 전", "pending"], ["삭제 · commit 전", "pending"], ["삭제 · commit 전", "pending"], ["삭제 · commit 전", "pending"]],
    steps: [["대기", "idle"], ["대기", "idle"], ["대기", "idle"]],
  },
  {
    label: "정상 · 정리 후 commit",
    summary: "slot index → cache → commit",
    note: "이어서 block/state slot index와 process-local cache를 정리하고 callback이 끝나면 네 쌍의 삭제가 함께 commit됩니다.",
    pairs: [["삭제됨", "done"], ["삭제됨", "done"], ["삭제됨", "done"], ["삭제됨", "done"]],
    steps: [["실행", "done"], ["실행", "done"], ["nil → commit", "done"]],
  },
  {
    label: "취소 · 쌍 2 뒤",
    summary: "context 취소 → nil 반환",
    note: "같은 batch에서 쌍 2까지 지운 뒤 context 취소를 만났다고 가정합니다. 현재 코드는 이때 오류가 아닌 nil을 반환합니다.",
    pairs: [["삭제 · commit 전", "pending"], ["삭제 · commit 전", "pending"], ["손대지 않음", "idle"], ["손대지 않음", "idle"]],
    steps: [["대기", "idle"], ["대기", "idle"], ["nil (취소)", "warn"]],
  },
  {
    label: "취소 · 결과",
    summary: "앞 2쌍만 commit될 수 있음 · 정리 건너뜀",
    note: "nil이 반환됐으므로 쌍 1·2의 삭제까지 commit될 수 있습니다. 쌍 3·4는 남고, 뒤의 slot index·cache 정리는 실행되지 않습니다. 실제 장애 경로는 test로 고정해야 하는 지점입니다.",
    pairs: [["삭제됐을 수 있음", "warn"], ["삭제됐을 수 있음", "warn"], ["남아 있음", "idle"], ["남아 있음", "idle"]],
    steps: [["건너뜀", "skip"], ["건너뜀", "skip"], ["nil → commit 가능", "warn"]],
  },
] as const satisfies readonly PruneScene[];

const TONE: Record<Tone, string> = {
  idle: "border-border text-muted-foreground",
  pending: "border-dashed border-primary text-primary",
  done: "border-primary bg-primary/5 font-bold text-primary",
  warn: "border-amber-600 bg-amber-500/10 font-bold text-amber-700 dark:text-amber-300",
  skip: "border-border bg-muted/60 text-muted-foreground line-through",
};

function Chip({ label, value, tone }: { label: string; value: string; tone: Tone }) {
  return (
    <div className={`flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center rounded-md border px-1 py-1 text-center ${TONE[tone]}`}>
      <span className="block break-keep text-[10px] font-bold leading-4 text-muted-foreground no-underline">{label}</span>
      <span className="mt-0.5 block break-keep text-[11px] leading-4">{value}</span>
    </div>
  );
}

export default function PruneCancelViz() {
  return (
    <SceneShell
      eyebrow="Prune 중 취소"
      title="취소되면 앞쪽 삭제만 commit되고 정리는 건너뛸 수 있습니다"
      description="칸 하나가 지울 slot/root 쌍 하나입니다. 쌍 네 개와 취소 시점은 설명용 가정입니다."
      ariaLabel="historical prune의 정상 경로와 callback 중 context 취소 경로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly PruneScene[])[active];
        const cancelPath = active >= 3;
        return (
          <div className="min-w-0">
            <p className={`mb-2 text-[11px] font-bold ${cancelPath ? "text-amber-700 dark:text-amber-300" : "text-primary"}`}>
              {cancelPath ? "취소 경로" : "정상 경로"} · 쌍마다 block · finalized-root index · state · summary · validator hashes
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {PAIRS.map((pair, index) => {
                const [value, tone] = scene.pairs[index];
                return <Chip key={pair} label={pair} value={value} tone={tone} />;
              })}
            </div>
            <p className="mb-2 mt-4 text-[11px] font-bold text-muted-foreground">쌍별 삭제 뒤 단계</p>
            <div className="grid grid-cols-3 gap-1.5">
              {STEPS.map((step, index) => {
                const [value, tone] = scene.steps[index];
                return <Chip key={step} label={step} value={value} tone={tone} />;
              })}
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">점선 칸은 commit 전, 주황 칸은 정상 경로와 다르게 끝날 수 있는 값, 회색 칸은 실행되지 않은 단계입니다.</p>
          </div>
        );
      }}
    />
  );
}
