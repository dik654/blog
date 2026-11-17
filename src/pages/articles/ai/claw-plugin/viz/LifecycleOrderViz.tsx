import PluginSceneShell from "./PluginSceneShell";

/**
 * 본문 대응: #lifecycle 첫 문단 — initialize는 정렬된 순서로 validate·init, shutdown은 반대 순서.
 * 세 번째 plugin init이 실패했을 때 앞의 두 plugin을 자동 rollback했다는 근거는 별도로 확인해야 한다.
 * plugin A·B·C는 정렬 순서만 나타내는 가정이다. Ready 2/3은 아래 식의 숫자다.
 */
type Status = "ready" | "failed" | "down";
interface Step {
  order: readonly (number | null)[];
  status: readonly Status[];
  direction: string;
}

const STEPS: readonly Step[] = [
  { order: [1, 2, 3], status: ["ready", "ready", "ready"], direction: "initialize → 정렬 순서" },
  { order: [3, 2, 1], status: ["down", "down", "down"], direction: "shutdown ← 반대 순서" },
  { order: [1, 2, 3], status: ["ready", "ready", "failed"], direction: "initialize → 세 번째에서 실패" },
];

const PLUGINS = ["plugin A", "plugin B", "plugin C"] as const;

const STATUS_STYLE: Record<Status, { label: string; color: string }> = {
  ready: { label: "init 완료", color: "#16a34a" },
  failed: { label: "init 실패", color: "#dc2626" },
  down: { label: "shutdown 실행", color: "#64748b" },
};

const SCENES = [
  { label: "Initialize는 정렬 순서대로", summary: "A → B → C", note: "Registry는 enabled plugin을 정렬된 순서로 하나씩 validate하고 init command를 실행합니다. A·B·C는 정렬 순서만 나타내는 가정입니다." },
  { label: "Shutdown은 반대 순서로", summary: "C → B → A", note: "내릴 때는 반대 순서로 shutdown command를 실행합니다. Dependency를 쌓은 역순으로 내린다는 기본 원칙과 맞습니다." },
  { label: "세 번째 init이 실패하면", summary: "ready 2 / 3", note: "A와 B의 init command는 이미 실행됐고, 그 command도 shell process와 외부 effect를 만들 수 있습니다. 이때 A·B를 자동으로 rollback했다는 근거는 별도로 확인해야 합니다. 정방향·역방향 순서가 있다고 transaction처럼 함께 되돌려지는 것은 아닙니다." },
] as const;

export default function LifecycleOrderViz() {
  return (
    <PluginSceneShell
      eyebrow="Lifecycle 순서"
      title="Init은 앞에서부터, shutdown은 뒤에서부터 실행합니다"
      description="칸 하나가 enabled plugin 하나이고, 칸 위 동그라미 숫자는 그 장면에서 command가 실행되는 차례입니다. Rollback은 실패했을 때 앞서 끝난 작업을 되돌려 원래 상태로 돌리는 일입니다."
      ariaLabel="세 plugin의 initialize 순서, shutdown 역순, 세 번째 init 실패"
      scenes={SCENES}
      render={(active) => {
        const step = STEPS[active];
        return (
          <div className="min-w-0">
            <p className="mb-2 font-mono text-xs font-semibold text-muted-foreground">{step.direction}</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {PLUGINS.map((name, index) => {
                const status = STATUS_STYLE[step.status[index]];
                const failed = step.status[index] === "failed";
                return (
                  <div key={name} className="min-w-0 text-center">
                    <span className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-sm font-bold" style={{ borderColor: status.color, color: status.color }}>
                      {step.order[index]}
                    </span>
                    <div className="rounded-lg border px-1.5 py-3" style={{ borderColor: status.color, borderStyle: failed ? "dashed" : "solid" }}>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="mt-1 text-[11px] font-semibold" style={{ color: status.color }}>{status.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 min-h-[3.25rem] rounded-md border border-dashed px-3 py-2 text-xs leading-5" style={{ borderColor: active === 2 ? "#d97706" : "transparent", color: "#d97706" }}>
              {active === 2 && "A·B 자동 rollback 여부: 근거 별도 확인 필요"}
            </div>
          </div>
        );
      }}
    />
  );
}
