import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 중요 부품 10개를 해마다 하나씩 바꾼다(설명용 장부).
 * 1년: 옛 9·새 1, 5년: 옛 5·새 5, 10년: 새 10. 떼어 둔 옛 부품 10개로 B를 조립한다.
 * A는 사용 경로가 끊기지 않고, B는 처음 물질을 갖지만 경로는 새로 시작한다.
 */
const PARTS = 10;

const SCENES = [
  { label: "처음", summary: "A: 옛 10 · 새 0", year: 0, rebuilt: false, note: "물질과 사용 이력이 한 대에 모여 있습니다. 평소처럼 여러 단서가 한 대를 함께 가리킵니다." },
  { label: "1년 뒤", summary: "A: 옛 9 · 새 1", year: 1, rebuilt: false, note: "부품 하나를 바꿨습니다. 떼어 낸 옛 부품은 버리지 않고 따로 모아 둡니다." },
  { label: "5년 뒤", summary: "A: 옛 5 · 새 5", year: 5, rebuilt: false, note: "옛 부품과 새 부품이 반반입니다. 정체성이 어느 한 비율에서 갑자기 사라진다고 정하면, 왜 하필 그 비율인지 설명해야 합니다." },
  { label: "10년 뒤", summary: "A: 옛 0 · 새 10", year: 10, rebuilt: false, note: "A에는 처음 부품이 하나도 남지 않았지만, 같은 창고와 출퇴근 길을 끊기지 않고 이어 왔습니다. 옛 부품 10개는 모두 따로 모여 있습니다." },
  { label: "옛 부품으로 B를 조립", summary: "A: 연속된 이력 · B: 처음 물질", year: 10, rebuilt: true, note: "옛 부품 10개로 B를 만들면 '처음 자전거'라고 주장할 후보가 둘이 됩니다. A는 연속된 사용 이력을, B는 원래 물질을 가지며, B의 사용 경로는 여기서 새로 시작합니다." },
] as const;

const OLD = "#64748b";
const NEW = "#2563eb";

function Slot({ kind }: { kind: "old" | "new" | "empty" }) {
  if (kind === "empty") {
    return <div className="flex aspect-square min-w-0 items-center justify-center rounded border border-dashed border-border/60" />;
  }
  const color = kind === "old" ? OLD : NEW;
  return (
    <div className="flex aspect-square min-w-0 items-center justify-center rounded border text-[10px] font-bold sm:text-xs" style={{ borderColor: color, color }}>
      {kind === "old" ? "옛" : "새"}
    </div>
  );
}

function Row({ name, sub, slots, path }: { name: string; sub: string; slots: readonly ("old" | "new" | "empty")[]; path: { text: string; color: string; dashed: boolean } | null }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-center sm:gap-3">
      <div className="leading-5">
        <span className="text-sm font-bold">{name}</span>
        <span className="ml-2 text-xs text-muted-foreground sm:ml-0 sm:block">{sub}</span>
      </div>
      <div className="min-w-0">
        <div className="grid grid-cols-10 gap-1">
          {slots.map((kind, index) => (
            <Slot key={index} kind={kind} />
          ))}
        </div>
        <div className="mt-1 flex h-5 items-center gap-2 text-[11px] text-muted-foreground">
          {path ? (
            <>
              <svg width="40" height="6" aria-hidden="true" className="shrink-0">
                <line x1="0" x2="40" y1="3" y2="3" stroke={path.color} strokeWidth={1.25} strokeDasharray={path.dashed ? "4 3" : undefined} />
              </svg>
              <span>{path.text}</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function PartsReplacementViz() {
  return (
    <SceneShell
      eyebrow="10년 동안의 부품 교체"
      title="한 대는 경로를, 다른 한 대는 물질을 가져갑니다"
      description="칸 하나가 중요 부품 하나입니다. 부품 10개와 1년에 하나씩이라는 숫자는 실제 자전거의 부품 수가 아니라 판단이 바뀌는 지점을 보기 위한 설명용 장부입니다(가정)."
      ariaLabel="10년 동안 자전거 A의 부품을 하나씩 바꾸고, 떼어 둔 옛 부품으로 자전거 B를 조립하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const replaced = scene.year;
        const aSlots = Array.from({ length: PARTS }, (_, index) => (index < replaced ? "new" : "old") as "old" | "new");
        const pileSlots = Array.from({ length: PARTS }, (_, index) => (!scene.rebuilt && index < replaced ? "old" : "empty") as "old" | "empty");
        const bSlots = Array.from({ length: PARTS }, () => (scene.rebuilt ? "old" : "empty") as "old" | "empty");
        return (
          <div className="min-w-0 space-y-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="shrink-0 font-bold text-foreground">{replaced}년</span>
              <div className="relative h-1.5 min-w-0 flex-1 rounded-full bg-muted">
                <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(replaced / PARTS) * 100}%`, backgroundColor: NEW }} />
              </div>
              <span className="shrink-0">10년</span>
            </div>
            <Row name="자전거 A" sub="계속 타며 수리" slots={aSlots} path={{ text: replaced === 0 ? "사용 경로 시작" : `사용 경로 ${replaced}년째 끊기지 않음`, color: NEW, dashed: false }} />
            <Row name="떼어 둔 옛 부품" sub="정비사가 보관" slots={pileSlots} path={null} />
            <Row name="자전거 B" sub="옛 부품으로 조립" slots={bSlots} path={scene.rebuilt ? { text: "사용 경로는 여기서 새로 시작", color: OLD, dashed: true } : null} />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="font-bold" style={{ color: OLD }}>옛</span> = 처음 자전거의 부품</span>
              <span><span className="font-bold" style={{ color: NEW }}>새</span> = 교체해 넣은 부품</span>
            </div>
          </div>
        );
      }}
    />
  );
}
