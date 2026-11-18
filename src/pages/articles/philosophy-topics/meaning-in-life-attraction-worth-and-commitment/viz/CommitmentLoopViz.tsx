import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 매주 3시간 과학 수업(선택한 15시간 안) →
 * 관심이 행동을 시작하게 하고, 반복이 설명 능력·신뢰·교육 기회 차이에 대한 앎을 키우며,
 * 실제 관계와 결과가 관심의 내용을 바꾼다. 소진이나 도움이 안 되는 방식이 드러나면 시간과 역할을 고친다.
 */
const SCENES = [
  { label: "한 주 100시간 가운데 3시간", summary: "선택한 15 안의 3", lit: [] as number[], back: false, fix: false, note: "3절 시간표(설명용 가정)의 선택한 참여 15시간 가운데 매주 3시간을 지역 어린이 과학 수업에 씁니다. 시간이 3시간이라는 사실만으로는 이 일이 의미 있는지 정해지지 않습니다." },
  { label: "관심이 행동을 시작하게 합니다", summary: "관심 → 수업", lit: [0, 1], back: false, fix: false, note: "처음에는 과학을 설명하는 일에 마음이 끌려 시작합니다. 끌림은 어떤 활동을 자기 일로 받아들이는 마음입니다." },
  { label: "반복하면 세 가지가 자랍니다", summary: "수업 → 능력·신뢰·앎", lit: [1, 2], back: false, fix: false, note: "준비와 만남을 반복하면서 설명 능력이 자라고, 아이들과 동료의 신뢰가 생기며, 교육 기회의 차이를 더 구체적으로 알게 됩니다." },
  { label: "결과가 관심의 내용을 바꿉니다", summary: "결과 → 관심", lit: [2, 0], back: true, fix: false, note: "실제 관계와 결과가 처음의 관심을 다시 바꿉니다. 관심에서 행동으로 한 방향만 흐르지 않고, 관심과 가치가 양방향으로 오갑니다." },
  { label: "고치는 일도 참여입니다", summary: "시간·역할 수정", lit: [1], back: false, fix: true, note: "소진이 오거나 도움이 되지 않는 방식이 드러나면 시간과 역할을 고칩니다. 몇 시간으로 바꿀지는 글이 정하지 않았으므로 숫자를 적지 않았습니다." },
] as const;

type Scene = (typeof SCENES)[number];
const SCENE_LIST: readonly Scene[] = SCENES;

const BLOCKS = [
  { name: "생계·유지", hours: 45 },
  { name: "돌봄", hours: 20 },
  { name: "관계·휴식", hours: 20 },
  { name: "선택한 참여", hours: 15 },
] as const;

const NODES: readonly { title: string; lines: readonly string[] }[] = [
  { title: "관심 (끌림)", lines: ["과학을 설명하는 일에 끌림"] },
  { title: "행동", lines: ["매주 3시간 수업", "준비와 만남"] },
  { title: "결과", lines: ["설명 능력", "아이·동료의 신뢰", "교육 기회 차이를 앎"] },
];

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const ALERT = "#dc2626";

function HourBar({ strong }: { strong: boolean }) {
  return (
    <div className="min-w-0">
      <div className="flex h-7 w-full overflow-hidden rounded-md border border-border">
        {BLOCKS.map((block) => {
          const chosen = block.name === "선택한 참여";
          return (
            <div key={block.name} className="relative h-full border-r border-border last:border-r-0" style={{ width: `${block.hours}%`, backgroundColor: chosen && strong ? "#dbeafe" : "transparent" }}>
              {chosen ? <div className="absolute inset-y-0 left-0" style={{ width: `${(3 / 15) * 100}%`, backgroundColor: ACCENT }} /> : null}
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex w-full text-[11px] leading-4 text-muted-foreground sm:text-xs">
        {BLOCKS.map((block) => (
          <span key={block.name} className="min-w-0 px-0.5" style={{ width: `${block.hours}%` }}>
            {block.name} {block.hours}
          </span>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: ACCENT }} />
        파란 칸 = 과학 수업 3시간 (100시간 중 3)
      </p>
    </div>
  );
}

function Arrow({ on }: { on: boolean }) {
  return (
    <span className="flex h-4 items-center justify-center text-sm font-bold leading-none sm:h-auto sm:text-base" style={{ color: on ? ACCENT : MUTED }} aria-hidden>
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </span>
  );
}

function Loop({ scene }: { scene: Scene }) {
  const lit: readonly number[] = scene.lit;
  const forward = (from: number) => lit.includes(from) && lit.includes(from + 1);
  const backColor = scene.back ? ACCENT : MUTED;
  return (
    <div className="min-w-0 text-sm" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <div className="relative hidden h-9 sm:block" aria-hidden>
        <div
          className="absolute bottom-0 left-[16.5%] right-[16.5%] top-3 rounded-t-md border-x border-t"
          style={{ borderColor: backColor, borderStyle: scene.back ? "solid" : "dashed" }}
        />
        <span className="absolute bottom-[-0.45rem] left-[16.5%] -translate-x-1/2 text-xs" style={{ color: backColor }}>▼</span>
        <span className="absolute left-1/2 top-0 -translate-x-1/2 bg-background px-2 text-xs" style={{ color: backColor, fontWeight: scene.back ? 700 : 400 }}>
          관계와 결과가 관심을 바꿈
        </span>
      </div>
      <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] sm:gap-0">
        {NODES.map((node, index) => {
          const on = lit.includes(index);
          const fixing = scene.fix && index === 1;
          const color = fixing ? ALERT : on ? ACCENT : MUTED;
          return (
            <div key={node.title} className="contents">
              {index > 0 ? <Arrow on={forward(index - 1)} /> : null}
              <div
                className={`min-w-0 rounded-lg border px-3 py-1 text-center sm:min-h-[6.25rem] sm:py-2 ${on || fixing ? "" : "text-muted-foreground"}`}
                style={{ borderColor: color, borderStyle: fixing ? "dashed" : "solid", backgroundColor: on ? "#2563eb14" : fixing ? "#dc26260d" : "transparent" }}
              >
                <span className="block text-sm font-bold text-foreground sm:text-base">{node.title}</span>
                <span className="block text-xs leading-5 sm:text-sm sm:leading-6">{node.lines.join(" · ")}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-1.5 rounded-md border px-3 py-1 text-center text-xs sm:hidden" style={{ borderColor: backColor, borderStyle: scene.back ? "solid" : "dashed", color: scene.back ? ACCENT : undefined, fontWeight: scene.back ? 700 : 400 }}>
        ↺ 결과에서 다시 관심으로: 관계와 결과가 관심을 바꿈
      </p>
      <div className={`mx-auto mt-2 max-w-sm rounded-lg border border-dashed px-3 py-1 text-center sm:mt-3 sm:py-2 ${scene.fix ? "" : "opacity-35"}`} style={{ borderColor: scene.fix ? ALERT : MUTED }}>
        <span className="block text-xs">소진·도움 안 되는 방식이 드러나면</span>
        <span className="block font-bold">행동 칸의 시간과 역할을 고침</span>
      </div>
    </div>
  );
}

export default function CommitmentLoopViz() {
  return (
    <SceneShell
      eyebrow="반복되는 참여"
      title="매주 3시간 수업이 관심을 다시 바꾸는 고리"
      description="위 띠는 3절의 한 주 100시간(설명용 가정)입니다. 아래 고리는 7절의 과학 수업 사례에서 관심·행동·결과가 서로를 바꾸는 순서입니다."
      ariaLabel="매주 3시간 과학 수업에서 관심이 행동을 시작하고, 반복이 능력과 신뢰를 키우며, 결과가 관심을 바꾸고, 소진 시 시간과 역할을 고치는 고리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENE_LIST[active];
        return (
          <div className="min-w-0 space-y-3 sm:space-y-4">
            <div className={active === 0 ? "" : "hidden sm:block"}>
              <HourBar strong={active === 0} />
            </div>
            <Loop scene={scene} />
          </div>
        );
      }}
    />
  );
}
