import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #source-finality — A의 지시 10에서 철회 가능 여부와 의무 이행 여부를 따로 기록한다.
 * 두 칸의 간격은 시간을 잰 값이 아니다. PFMI는 실제 시각을 대신 정하지 않는다.
 */
const SCENES: readonly ShellScene[] = [
  { label: "둘 다 아직", summary: "철회 가능 · 10 미이행", note: "A의 지시 10이 아직 철회될 수 있고 의무도 남아 있는 상태입니다." },
  { label: "철회만 막혔습니다", summary: "철회 불가 · 10 미이행", note: "지시를 더는 철회할 수 없게 되었어도 10의 의무는 아직 이행되지 않았을 수 있습니다. 이 칸이 있어서 두 시점을 같은 것으로 볼 수 없습니다." },
  { label: "최종 이전까지", summary: "철회 불가 · 10 최종 이전", note: "운영 규칙이 정한 최종 이전이 일어났는지는 따로 확인합니다. 그 시각이 실제로 몇 시인지는 시스템마다 규칙을 봐야 하며 PFMI가 대신 정해 주지 않습니다." },
];

function Track({ name, cells, on }: { name: string; cells: readonly [string, string]; on: number }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{name}</p>
      <div className="grid grid-cols-2 gap-2">
        {cells.map((cell, index) => (
          <div
            key={cell}
            className={`rounded-lg border px-2 py-2 text-center text-sm ${index === on ? "border-primary bg-primary/5 font-bold" : "border-dashed border-border text-muted-foreground/60"}`}
          >
            {index === on ? "● " : ""}
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FinalityTracksViz() {
  return (
    <SceneShell
      eyebrow="두 개의 시점"
      title="철회할 수 없게 된 것과 의무가 끝난 것은 다른 칸입니다"
      description="A의 순지급 10 하나를 두 줄로 나누어 기록합니다. 장면 순서는 두 시점이 어긋나는 경우를 보이려는 예시이며 실제 시스템의 시각표가 아닙니다 (가정)."
      ariaLabel="지시 철회 상태와 의무 이행 상태의 세 조합"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-4">
          <Track name="지시 10을 철회할 수 있는가" cells={["철회 가능", "철회 불가"]} on={active === 0 ? 0 : 1} />
          <Track name="의무 10이 이행됐는가" cells={["아직 남음", "최종 이전"]} on={active === 2 ? 1 : 0} />
        </div>
      )}
    />
  );
}
