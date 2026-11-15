import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stale-branch "refresh는 별도 worktree에서 dry run한다" 둘째 문단.
 * 위 줄 = remote topic branch, 아래 줄 = temporary worktree의 결과.
 * A·B·A′는 설명용 commit 이름(가정)이다.
 */
type Tone = "plain" | "mine" | "other" | "lost";

interface Slot {
  name: string;
  tone: Tone;
}

const TONE_CLASS: Record<Tone, string> = {
  plain: "border-border bg-background text-foreground",
  mine: "border-blue-600 bg-background text-blue-700 dark:text-blue-400",
  other: "border-amber-600 bg-background text-amber-700 dark:text-amber-400",
  lost: "border-dashed border-red-600 bg-background text-red-700 line-through dark:text-red-400",
};

const EMPTY: Slot = { name: "", tone: "plain" };

const SCENES = [
  {
    label: "fetch 때 본 끝",
    summary: "expected old SHA = A",
    remote: [{ name: "A", tone: "plain" }, EMPTY] as const,
    remoteNote: "remote 끝: A",
    local: { name: "A′", tone: "mine" } as Slot,
    verdict: "아직 push하지 않음",
    note: "temporary worktree에서 최신 target 위로 rebase해 A′를 만들었습니다. 이때 remote에서 본 끝 A를 기억해 둡니다. 이 결과를 remote에 올리는 데 force update가 필요한 경우를 봅니다.",
  },
  {
    label: "그사이 다른 사람 push",
    summary: "remote 끝: A → B",
    remote: [{ name: "A", tone: "plain" }, { name: "B", tone: "other" }] as const,
    remoteNote: "remote 끝: B",
    local: { name: "A′", tone: "mine" } as Slot,
    verdict: "A′에는 B가 없음",
    note: "test와 diff review를 기다리는 동안 다른 사람이 같은 branch에 commit B를 올렸습니다. 내 A′는 B를 모르는 상태에서 만들어졌습니다.",
  },
  {
    label: "조건 없이 force-push",
    summary: "remote 끝 = A′ · B 사라짐",
    remote: [{ name: "A′", tone: "mine" }, { name: "B", tone: "lost" }] as const,
    remoteNote: "remote 끝: A′",
    local: { name: "A′", tone: "mine" } as Slot,
    verdict: "B를 덮어씀",
    note: "remote가 지금 무엇을 가리키는지 확인하지 않고 덮으면 remote 끝이 A′로 바뀌고, 그사이 올라온 B는 branch에서 빠집니다.",
  },
  {
    label: "expected old SHA = A 조건",
    summary: "remote 끝이 B ≠ A → 거부",
    remote: [{ name: "A", tone: "plain" }, { name: "B", tone: "other" }] as const,
    remoteNote: "remote 끝: B (그대로)",
    local: { name: "A′", tone: "mine" } as Slot,
    verdict: "push 거부 · B 보존",
    note: "remote 끝이 내가 기억한 A일 때만 바꾸라는 조건을 붙이면, 지금 끝이 B이므로 update가 거부됩니다. 다른 사람이 그사이 올린 commit을 덮어쓰지 않습니다.",
  },
] as const;

function Chip({ slot }: { slot: Slot }) {
  if (!slot.name) {
    return <span className="block h-9 rounded-md border border-dashed border-border/40" aria-hidden />;
  }
  return (
    <span className={`flex h-9 items-center justify-center rounded-md border font-mono text-sm font-bold ${TONE_CLASS[slot.tone]}`}>
      {slot.name}
    </span>
  );
}

export default function ExpectedShaPushViz() {
  return (
    <SceneShell
      eyebrow="Force update 조건"
      title="remote가 내가 본 SHA일 때만 덮어씁니다"
      description="칸 하나가 commit 하나입니다. 위 줄은 remote의 topic branch, 아래 줄은 temporary worktree에서 rebase한 결과입니다. A·B·A′는 설명용 이름(가정)입니다."
      ariaLabel="다른 사람이 그사이 push했을 때 조건 없는 force-push와 expected old SHA 조건의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[5.5rem_repeat(2,minmax(0,1fr))] items-center gap-2 text-xs sm:grid-cols-[7rem_repeat(2,minmax(0,1fr))] sm:text-sm">
              <span className="font-semibold text-muted-foreground">remote topic</span>
              {scene.remote.map((slot, i) => (
                <Chip key={`r${i}`} slot={slot} />
              ))}
              <span className="font-semibold text-muted-foreground">내 worktree</span>
              <Chip slot={scene.local} />
              <span className="text-xs text-muted-foreground">기억한 끝: A</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/70 px-3 py-2 text-xs sm:text-sm">
              <span className="font-mono">{scene.remoteNote}</span>
              <span className="font-semibold">{scene.verdict}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
