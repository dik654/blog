import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 내용이 같은 답변 쌍 (A, B)을 제시 순서만 바꿔 두 번 judge 에게 넣으면
 * 승자가 뒤집힐 수 있다는 것. 두 행(순서 1 · 순서 2)을 항상 그리고 값만 채워
 * stage 높이를 고정한다.
 */
const SCENES = ["같은 답변 쌍 A, B", "순서 1: A 를 먼저 제시", "순서 2: 슬롯만 바꿔 제시", "두 판정 비교: 불일치"] as const;

const NOTES = [
  "내용이 완전히 같은 두 답변 A, B 입니다. 아직 어느 슬롯에 넣을지 정하지 않았습니다.",
  "A 를 슬롯 1(먼저 보이는 자리)에 넣고 judge 에게 물으면, 순서에 끌리는 judge 는 슬롯 1 을 승자로 고릅니다. 승자는 A 입니다.",
  "내용은 그대로 두고 슬롯만 바꿔 B 를 슬롯 1 에 넣었습니다. 같은 judge 가 다시 슬롯 1 을 고르면 이번 승자는 B 입니다.",
  "두 번의 판정이 A 와 B 로 서로 다릅니다. 내용은 바뀌지 않았으므로 이 불일치는 position bias 이고, 두 판정이 같을 때만 승자를 확정해야 합니다.",
] as const;

const SLOT1_X = 90;
const SLOT2_X = 300;
const SLOT_W = 140;

function slotContent(run: 1 | 2, scene: number): string | null {
  if (run === 1 && scene < 1) return null;
  if (run === 2 && scene < 2) return null;
  return run === 1 ? "A" : "B"; // 순서 1: slot1=A, 순서 2: slot1=B(swap)
}

export default function LlmAsAJudgeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const scene = scenes.active;
  const rows = [1, 2] as const;
  return (
    <VizFrame
      eyebrow="Position bias · pairwise judge 호출"
      title="같은 답변 쌍을 순서만 바꿔 두 번 물으면 judge 의 승자가 뒤집힙니다"
      description="두 행은 같은 내용을 다른 순서로 넣은 두 번의 judge 호출입니다. 슬롯 1 은 언제나 먼저 제시되는 자리입니다."
      note="실제 판정은 승/패/무 세 값이고 judge 마다 편향의 방향과 크기가 다릅니다. 그림은 A 를 승자로 고르는 단순한 첫-자리 편향만 보입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Position bias 로 같은 답변 쌍의 판정이 순서에 따라 갈리는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <div className="mt-4 border border-border p-3">
            <svg viewBox="0 0 460 190" className="mx-auto h-auto w-full max-w-[28rem]" role="img" aria-label="순서를 바꾼 두 번의 pairwise judge 판정 비교">
              {rows.map((run) => {
                const active = run === 1 ? scene >= 1 : scene >= 2;
                const y0 = run === 1 ? 14 : 84;
                const s1 = slotContent(run, scene);
                const s2 = active ? (run === 1 ? "B" : "A") : null;
                const winner = active ? s1 : null;
                return (
                  <g key={run}>
                    <text x={8} y={y0 - 2} className="fill-muted-foreground font-mono text-[8px]">
                      {run === 1 ? "순서 1" : "순서 2 (슬롯 교체)"}
                    </text>
                    <rect x={SLOT1_X - SLOT_W / 2} y={y0} width={SLOT_W} height={26} strokeWidth={1} strokeDasharray={active ? undefined : "2 3"} className={active ? "fill-primary/15 stroke-primary" : "fill-transparent stroke-border"} />
                    <text x={SLOT1_X} y={y0 + 17} textAnchor="middle" className="fill-foreground font-mono text-[9px]">
                      {s1 ?? "슬롯 1: ?"}
                    </text>
                    <rect x={SLOT2_X - SLOT_W / 2} y={y0} width={SLOT_W} height={26} strokeWidth={1} strokeDasharray={active ? undefined : "2 3"} className="fill-transparent stroke-border" />
                    <text x={SLOT2_X} y={y0 + 17} textAnchor="middle" className="fill-muted-foreground font-mono text-[9px]">
                      {s2 ?? "슬롯 2: ?"}
                    </text>
                    <text x={430} y={y0 + 17} textAnchor="middle" className={`font-mono text-[9px] ${active ? "fill-primary" : "fill-muted-foreground"}`}>
                      {winner ? `→ ${winner}` : "→ ?"}
                    </text>
                  </g>
                );
              })}

              <line x1={20} y1={128} x2={440} y2={128} strokeWidth={1} className="stroke-border" />
              <text x={8} y={148} className="fill-muted-foreground font-mono text-[8px]">비교</text>
              <text
                x={230}
                y={150}
                textAnchor="middle"
                className={`font-mono text-[9px] ${scene >= 3 ? "fill-primary" : "fill-muted-foreground"}`}
              >
                {scene < 2 ? "판정 1개 — 아직 비교 불가" : scene < 3 ? "순서 1: A · 순서 2: B" : "순서 1: A ≠ 순서 2: B → tie / 재판정"}
              </text>
            </svg>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
