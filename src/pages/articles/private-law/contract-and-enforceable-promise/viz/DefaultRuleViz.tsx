import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: incomplete 절 — 빈칸을 법이 기본값으로 메우고, 다르게 적은 당사자는
 * 그쪽을 따른다. 기본값을 대부분이 합의했을 내용으로 두면 예외만 따로 적으면 된다.
 * 계약 10건과 그중 8건이 '가'를 원한다는 수는 설명용 가정이다.
 */
const WANTS: readonly ("가" | "나")[] = ["가", "가", "나", "가", "가", "가", "가", "나", "가", "가"];
const MAJ = WANTS.filter((w) => w === "가").length;
const MIN = WANTS.length - MAJ;

type Scene = {
  label: string;
  summary: string;
  defaultRule: "가" | "나" | null;
  note: string;
};

const SCENES: readonly Scene[] = [
  {
    label: "기본값이 없으면",
    summary: `따로 적을 계약 ${WANTS.length}건`,
    defaultRule: null,
    note: `계약 ${WANTS.length}건이 모두 같은 빈칸을 남겼다고 하겠습니다(가정). 그 상황이 오면 ${MAJ}건은 '가'로, ${MIN}건은 '나'로 합의했을 것입니다(가정). 법이 메워 두는 값이 없다면 어느 쪽이든 원하는 내용을 얻으려면 미리 적어 두어야 합니다.`,
  },
  {
    label: "대부분이 합의했을 '가'를 기본값으로",
    summary: `따로 적을 계약 ${MIN}건`,
    defaultRule: "가",
    note: `법이 빈칸을 '가'로 메워 두면 '가'를 원하던 ${MAJ}건은 아무것도 적지 않아도 됩니다. '나'를 원하던 ${MIN}건만 '나'라고 적고, 적은 쪽이 기본값보다 우선합니다. 예외적인 사람만 적으면 되므로 따로 적는 계약 수가 가장 적습니다.`,
  },
  {
    label: "드문 '나'를 기본값으로",
    summary: `따로 적을 계약 ${MAJ}건`,
    defaultRule: "나",
    note: `같은 계약들에 '나'를 기본값으로 두면 이번에는 '가'를 원하던 ${MAJ}건이 모두 따로 적어야 합니다. 결과로 얻는 내용은 같아도 적는 수고가 ${MIN}건에서 ${MAJ}건으로 늘어납니다. 그래서 기본 원칙이 '대부분이 합의했을 법한 내용'입니다. 다만 한쪽만 아는 정보를 끌어내려고 일부러 그쪽에 불리한 기본값을 두는 경우도 있습니다.`,
  },
];

const WRITE = "#d97706";
const OK = "#10b981";
const MUTED = "#94a3b8";

function Card({ want, defaultRule }: { want: "가" | "나"; defaultRule: "가" | "나" | null }) {
  const writes = defaultRule === null || defaultRule !== want;
  return (
    <div
      className="flex min-w-0 flex-col items-center rounded-lg border px-1 py-2 text-center"
      style={{ borderColor: writes ? WRITE : OK, borderStyle: writes ? "solid" : "dashed" }}
    >
      <span className="hidden text-[11px] text-muted-foreground sm:block">원했을 내용</span>
      <span className="text-lg font-bold leading-6">{want}</span>
      <span className="mt-1 text-[11px] font-bold leading-4" style={{ color: writes ? WRITE : OK }}>
        <span className="sm:hidden">{writes ? "적음" : "그대로"}</span>
        <span className="hidden sm:inline">{writes ? "따로 적음" : "기본값 그대로"}</span>
      </span>
    </div>
  );
}

function Figure({ s }: { s: number }) {
  const scene = SCENES[s];
  const writeCount = WANTS.filter((w) => scene.defaultRule === null || scene.defaultRule !== w).length;
  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="font-bold">법이 메워 둔 기본값</span>
        <span
          className="rounded-md border px-2 py-0.5 font-mono font-bold"
          style={{ borderColor: scene.defaultRule ? OK : MUTED, color: scene.defaultRule ? OK : MUTED }}
        >
          {scene.defaultRule ?? "없음"}
        </span>
        <span className="text-xs text-muted-foreground">다르게 적으면 적은 쪽이 우선 · 칸 안 글자는 그 계약이 원했을 내용</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {WANTS.map((w, i) => (
          <Card key={i} want={w} defaultRule={scene.defaultRule} />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm">
        <div className="h-3 min-w-0 flex-1 rounded-sm bg-muted/40">
          <div
            className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${(writeCount / WANTS.length) * 100}%`, backgroundColor: WRITE }}
          />
        </div>
        <span className="shrink-0 font-mono font-bold" style={{ color: WRITE }}>
          적는 계약 {writeCount}/{WANTS.length}
        </span>
      </div>
    </div>
  );
}

export default function DefaultRuleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const labels = SCENES.map((x) => x.label);
  return (
    <VizFrame
      eyebrow="빈칸을 메우는 기본값"
      title="기본값을 무엇으로 두느냐가 몇 건이 따로 적어야 하는지를 정합니다"
      description="기본값은 계약서가 적지 않은 빈칸을 법이 미리 메워 둔 내용입니다. 칸 하나가 같은 빈칸을 남긴 계약 한 건이고, '가'와 '나'는 그 상황에서 당사자가 합의했을 두 내용입니다(가정)."
      note="10건 가운데 8건이 '가'를 원한다는 수는 설명을 위한 가정입니다. 실제 기본값은 법이 마련해 두며, 당사자가 다르게 적었다면 그쪽을 따릅니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="기본값에 따라 따로 적어야 하는 계약 수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 min-w-0">
          <Figure s={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((x) => x.note)} />
      </div>
    </VizFrame>
  );
}
