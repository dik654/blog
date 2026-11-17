import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #memory-compaction — 같은 directory에 CLAUDE.md와 AGENTS.md가 함께 있을 때
 * Project instructions 설정과 @import가 project context에 무엇을 넣는지 세 갈래로 나눈다.
 * 기본값: CLAUDE.md만 · claude-md-and-agents-md: 둘 다 · 기본값 + @AGENTS.md import: CLAUDE.md를 거쳐 둘 다.
 */
type AgentsState = "skip" | "direct" | "import";

const BRANCHES: readonly { key: string; label: string; setting: string; agents: AgentsState; note: string }[] = [
  {
    key: "default",
    label: "기본값",
    setting: "Project instructions = 기본값",
    agents: "skip",
    note: "기본값에서는 working directory 위에 CLAUDE.md나 CLAUDE.local.md가 있으면 그것을 읽고 AGENTS.md는 생략합니다. 그래서 같은 directory에 둘이 있어도 AGENTS.md는 context에 들어오지 않습니다.",
  },
  {
    key: "both",
    label: "둘 다 읽기 설정",
    setting: "Project instructions = claude-md-and-agents-md",
    agents: "direct",
    note: "Project instructions를 claude-md-and-agents-md로 정하면 CLAUDE.md와 AGENTS.md를 함께 project instruction으로 읽습니다.",
  },
  {
    key: "import",
    label: "@AGENTS.md import",
    setting: "기본값 + CLAUDE.md 안에 @AGENTS.md",
    agents: "import",
    note: "설정을 기본값으로 두더라도 CLAUDE.md에서 @AGENTS.md를 import하면 AGENTS.md 내용이 CLAUDE.md를 거쳐 함께 들어옵니다.",
  },
];

const LABELS = BRANCHES.map((b) => b.label);
const NOTES = BRANCHES.map((b) => b.note);

function FileChip({ name, state }: { name: string; state: "read" | "skip" }) {
  const read = state === "read";
  return (
    <div
      className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 ${
        read ? "border-[#2563eb] bg-[#2563eb]/10" : "border-dashed border-[#94a3b8] text-muted-foreground"
      }`}
    >
      <span className={`block font-mono font-bold ${read ? "" : "line-through"}`}>{name}</span>
      <span className="block">{read ? "context에 들어감" : "생략"}</span>
    </div>
  );
}

function ResultPanel({ agents }: { agents: AgentsState }) {
  if (agents === "import") {
    return (
      <div className="rounded-lg border border-[#2563eb] bg-[#2563eb]/10 px-3 py-2 text-xs leading-5">
        <span className="block font-mono font-bold">CLAUDE.md</span>
        <span className="block">context에 들어감</span>
        <div className="mt-2 rounded-md border border-[#2563eb] bg-background px-3 py-2">
          <span className="block font-mono font-bold">@AGENTS.md</span>
          <span className="block">import 줄로 CLAUDE.md 안에서 함께 들어감</span>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      <FileChip name="CLAUDE.md" state="read" />
      <FileChip name="AGENTS.md" state={agents === "direct" ? "read" : "skip"} />
    </div>
  );
}

export default function AgentsMdBranchViz() {
  const scenes = useAnimatedScenes(BRANCHES.length, 4200);
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="AGENTS.md 선택"
      title="같은 directory의 CLAUDE.md와 AGENTS.md 중 무엇이 들어오는가"
      description="Claude Code v2.1.277 이상에서 한 directory에 두 파일이 함께 있을 때 설정에 따라 세 갈래로 나뉩니다. Import는 CLAUDE.md 안에 @경로를 적어 그 파일 내용을 함께 불러오는 방법입니다."
      note="Instruction에 어떤 파일이 들어오든 permission이 바뀌지는 않습니다. 실제 선택은 사용 중인 client version과 설정에서 확인합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Project instructions 설정별로 CLAUDE.md와 AGENTS.md가 context에 들어오는지 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="min-w-0">
          <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs leading-5">
            <span className="block font-semibold">같은 directory</span>
            <span className="block font-mono">CLAUDE.md · AGENTS.md</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {BRANCHES.map((branch, index) => (
              <button
                key={branch.key}
                type="button"
                aria-pressed={active === index}
                onClick={() => scenes.setActive(index)}
                className={`min-w-0 rounded-lg border px-2 py-2 text-left text-[11px] leading-4 sm:text-xs sm:leading-5 ${
                  active === index ? "border-[#2563eb] bg-[#2563eb]/10 font-bold" : "border-border bg-background text-muted-foreground"
                }`}
              >
                <span className="block break-keep">{index + 1}. {branch.label}</span>
              </button>
            ))}
          </div>
          <StableSceneStack
            active={active}
            className="mt-3"
            scenes={BRANCHES.map((branch) => (
              <div key={branch.key} className="min-w-0 space-y-2">
                <p className="break-words font-mono text-xs font-bold text-primary">{branch.setting}</p>
                <ResultPanel agents={branch.agents} />
              </div>
            ))}
          />
          <StableSceneStack
            active={active}
            className="mt-4"
            scenes={BRANCHES.map((branch) => (
              <p key={branch.key} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
                {branch.note}
              </p>
            ))}
          />
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
