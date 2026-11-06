import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — VGPR 사용량이 커지면 상주 wave가 줄거나 scratch로 spill될 수 있고, LDS를 많이 쓰는 block도 상주를 제한한다.
 * 칸 수는 관계를 보이려는 설명용입니다. 실제 register 수가 본문에 없으므로 숫자를 적지 않습니다.
 */
const POOL = 12;

const SCENES = [
  { label: "값을 적게 쓰면", summary: "상주 wave가 많음", perWave: 2, spill: 0, lds: 0, note: "wave마다 VGPR을 조금 쓰면 같은 저장소에 여러 wave가 함께 머물 수 있습니다." },
  { label: "임시 배열을 더하면", summary: "덧셈 64번 그대로 · 상주 감소", perWave: 4, spill: 0, lds: 0, note: "덧셈 수는 그대로인데 wave마다 칸을 더 차지해 함께 머무는 wave가 줄어듭니다. 이런 코드는 덧셈 수가 같아도 느려질 수 있습니다." },
  { label: "더 많이 쓰면", summary: "private scratch로 spill", perWave: 12, spill: 4, lds: 0, note: "저장소에 다 담지 못한 값은 private scratch로 spill될 수 있습니다. spill은 register 밖의 메모리로 값을 내려 두는 일이고, private scratch는 그 메모리 공간입니다." },
  { label: "LDS를 많이 쓰면", summary: "상주 block 제한", perWave: 0, spill: 0, lds: 4, note: "LDS는 별도 자원이지만 이것을 많이 쓰는 block도 상주 자원을 제한합니다. 칸 수는 설명용이며 실제 용량이 아닙니다." },
] as const;

const COLORS = ["bg-primary/70", "bg-primary/35"];

function Pool({ name, groupSize, spill = 0 }: { name: string; groupSize: number; spill?: number }) {
  const cells = Array.from({ length: POOL }, (_, id) => id);
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold">{name}</p>
      <div className="grid grid-cols-12 gap-px border border-muted-foreground/60 p-px">
        {cells.map((id) => {
          const wave = groupSize ? Math.floor(id / groupSize) : -1;
          return (
            <span key={id} className={`flex h-8 items-center justify-center text-xs font-bold ${wave < 0 ? "" : COLORS[wave % 2]}`}>
              {groupSize && id % groupSize === 0 ? <span className="rounded bg-background px-0.5 text-[11px] leading-4">{wave + 1}</span> : null}
            </span>
          );
        })}
      </div>
      <div className="mt-2 flex min-h-8 items-center gap-1 text-xs">
        {spill > 0 && (
          <>
            <span className="font-semibold text-red-700 dark:text-red-400">scratch</span>
            {Array.from({ length: spill }, (_, id) => (
              <span key={id} className="h-6 w-6 rounded-sm border border-dashed border-red-600" />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function VgprPressureViz() {
  return (
    <SceneShell
      eyebrow="상주 자원"
      title="임시 값을 더 쓰면 왜 함께 머무는 wave가 줄어들까요"
      description="같은 띠가 VGPR 저장소이고 같은 숫자의 칸 묶음이 wave(wavefront) 하나입니다. 칸 수는 설명용이며 실제 register 수가 아닙니다."
      ariaLabel="wave마다 쓰는 VGPR이 늘면 상주 wave가 줄고 scratch로 넘치는 과정, LDS의 상주 제한"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return scene.lds ? (
          <div className="space-y-2">
            <Pool name="VGPR" groupSize={2} />
            <Pool name="LDS · 같은 숫자가 block 하나" groupSize={scene.lds} />
          </div>
        ) : (
          <div className="space-y-2">
            <Pool name="VGPR" groupSize={scene.perWave} spill={scene.spill} />
            <div className="min-h-[5.25rem]" aria-hidden />
          </div>
        );
      }}
    />
  );
}
