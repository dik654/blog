import SceneShell from "./SceneShell";

/**
 * 본문 대응: #checkpoint-ablation — utility = task_score − alpha × forget_score, forget_score = base_probe − probe.
 * base probe 68은 본문의 예. 세 checkpoint의 점수와 alpha 값은 설명용이다(가정).
 * alpha 0: 80/86/89 → C, 1: 79/83/82 → B, 5: 75/71/54 → A.
 */
const BASE_PROBE = 68;
const CHECKPOINTS = [
  { name: "A", task: 80, probe: 67 },
  { name: "B", task: 86, probe: 65 },
  { name: "C", task: 89, probe: 61 },
] as const;

const SCENES = [
  { label: "α=0 · 목표 점수만", summary: "C 선택", alpha: 0, note: "forgetting을 보지 않으면 목표 task 점수가 가장 높은 C를 고릅니다. C의 probe는 68에서 61로 7%p 떨어져 있어도 드러나지 않습니다." },
  { label: "α=1 · 함께 보기", summary: "B 선택", alpha: 1, note: "하락폭을 빼면 C는 82, B는 83으로 순서가 바뀝니다. 목표 점수는 조금 낮아도 일반 능력을 덜 잃은 B가 남습니다." },
  { label: "α=5 · 하락에 더 민감하게", summary: "A 선택", alpha: 5, note: "α는 forgetting에 대한 민감도입니다. 크게 놓으면 하락폭이 가장 작은 A가 뽑힙니다. 같은 점수에서도 α가 답을 바꾸므로 α 선택도 판단의 일부입니다." },
] as const;

export default function CheckpointUtilityViz() {
  return (
    <SceneShell
      eyebrow="Checkpoint 선택"
      title="forgetting을 얼마나 무겁게 보느냐에 따라 고르는 checkpoint가 달라집니다"
      description="utility = 목표 task 점수 − α × 하락폭입니다. 하락폭은 원래 능력을 재는 benchmark(forgetting probe)의 base 점수 68에서 각 checkpoint의 점수를 뺀 값입니다. 세 checkpoint의 점수와 α는 설명용입니다(가정)."
      ariaLabel="alpha 값에 따른 checkpoint utility 비교"
      scenes={SCENES}
      render={(active) => {
        const alpha = SCENES[active].alpha;
        const rows = CHECKPOINTS.map((ckpt) => {
          const forget = BASE_PROBE - ckpt.probe;
          return { ...ckpt, forget, utility: ckpt.task - alpha * forget };
        });
        const best = rows.reduce<number>((top, row) => Math.max(top, row.utility), 0);
        return (
          <div className="space-y-3">
            {rows.map((row) => {
              const chosen = row.utility === best;
              return (
                <div key={row.name} className={`border px-3 py-2 ${chosen ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                  <div className="flex items-baseline justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-bold">checkpoint {row.name}{chosen ? " ✓ 선택" : ""}</span>
                    <span className="font-mono">{row.task} − {alpha}×{row.forget} = <b>{row.utility}</b></span>
                  </div>
                  <div className="mt-1.5 h-3 border border-border bg-background">
                    <div className={`h-full ${chosen ? "bg-primary/70" : "bg-muted-foreground/30"}`} style={{ width: `${row.utility}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">목표 {row.task} · probe {row.probe} · 하락 {row.forget}%p</p>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
