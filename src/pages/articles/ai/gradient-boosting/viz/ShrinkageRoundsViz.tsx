import SceneShell from "./SceneShell";

/**
 * 본문 대응: #shrinkage — 작은 η는 tree 하나의 update를 줄여 더 많은 round가 필요하다.
 * 첫 round는 본문 숫자: residual 3, tree 2.4 → η=.2면 +0.48(잔차 2.52), η=.05면 +0.12(잔차 2.88).
 * 이후 round는 가정: 매 round tree가 그때 잔차의 80%(=2.4/3)를 근사 → 잔차 × (1−0.8η).
 * 0.84ⁿ·3 < 1 → n=7, 0.96ⁿ·3 < 1 → n=27.
 */
const RESIDUAL0 = 3;
const FIT_RATIO = 2.4 / 3;
const ROUNDS = 30;
const THRESHOLD = 1;
const ETAS: readonly number[] = [0.2, 0.05];

const residuals = (eta: number) =>
  Array.from({ length: ROUNDS + 1 }, (_, n) => RESIDUAL0 * (1 - FIT_RATIO * eta) ** n);
const PATHS = ETAS.map(residuals);
const CROSS = PATHS.map((path) => path.findIndex((r) => r < THRESHOLD));

const W = 360;
const H = 200;
const LEFT = 30;
const RIGHT = 14;
const TOP = 16;
const BASE = 162;
const sx = (n: number) => LEFT + (n / ROUNDS) * (W - LEFT - RIGHT);
const sy = (r: number) => BASE - (r / RESIDUAL0) * (BASE - TOP);

const COLORS: readonly string[] = ["#2563eb", "#d97706"];
const MUTED = "#64748b";
const GRID = "#94a3b8";

const SCENES = [
  {
    label: "η=0.2 첫 round",
    summary: "4 + 0.2×2.4 = 4.48 · 잔차 3 → 2.52",
    shown: 1,
    rounds: 1,
    note: "0절의 집입니다. 잔차 3에 대해 tree가 2.4를 내고, 0.2를 곱한 0.48만 더합니다. 남은 잔차는 7−4.48=2.52입니다.",
  },
  {
    label: "η=0.05 첫 round",
    summary: "4 + 0.05×2.4 = 4.12 · 잔차 3 → 2.88",
    shown: 2,
    rounds: 1,
    note: "같은 tree 2.4에 0.05를 곱하면 0.12만 더해집니다. 0.48의 1/4이라 남은 잔차가 2.88로 더 큽니다.",
  },
  {
    label: "round를 이어 가면",
    summary: `잔차 1 아래까지 ${CROSS[0]} round vs ${CROSS[1]} round (가정)`,
    shown: 2,
    rounds: ROUNDS,
    note: "매 round tree가 잔차의 80%(첫 round의 2.4/3)를 맞힌다고 가정하면 잔차는 round마다 0.84배, 0.96배가 됩니다. 실제 비율은 round마다 다르고, 멈출 round는 validation curve가 고릅니다.",
  },
] as const;

export default function ShrinkageRoundsViz() {
  return (
    <SceneShell
      eyebrow="Shrinkage와 round 수"
      title="같은 tree라도 η가 작으면 한 round에 덜 움직입니다"
      description="세로축은 한 집의 남은 잔차(목표 7 − 현재 score, 억), 가로축은 더한 tree 수(round)입니다. 첫 round는 0절의 숫자이고, 둘째 round부터의 모양과 잔차 1 기준선은 그림을 위한 가정입니다."
      ariaLabel="학습률 0.2와 0.05에서 round마다 줄어드는 잔차 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[560px]"
            role="img"
            aria-label={`${scene.label}: ${scene.summary}`}
          >
            {[0, 1, 2, 3].map((v) => (
              <g key={v}>
                <line x1={LEFT} x2={W - RIGHT} y1={sy(v)} y2={sy(v)} stroke={GRID} strokeWidth={v === 0 ? 1 : 0.5} strokeDasharray={v === 0 ? undefined : "2 3"} />
                <text x={LEFT - 6} y={sy(v) + 4} textAnchor="end" fontSize={11} fill={MUTED}>
                  {v}
                </text>
              </g>
            ))}
            {[0, 10, 20, 30].map((n) => (
              <text key={n} x={sx(n)} y={BASE + 15} textAnchor="middle" fontSize={11} fill={MUTED}>
                {n}
              </text>
            ))}
            <text x={W - RIGHT} y={BASE + 32} textAnchor="end" fontSize={11} fill={MUTED}>
              round →
            </text>
            {scene.rounds === ROUNDS && (
              <text x={sx(16)} y={sy(THRESHOLD) - 5} textAnchor="middle" fontSize={10} fill={MUTED}>
                잔차 1 (가정 기준)
              </text>
            )}
            {PATHS.slice(0, scene.shown).map((path, i) => {
              const pts = path.slice(0, scene.rounds + 1);
              const d = pts.map((r, n) => `${n === 0 ? "M" : "L"}${sx(n).toFixed(1)} ${sy(r).toFixed(1)}`).join(" ");
              const last = pts[pts.length - 1];
              const cross = CROSS[i];
              const color = COLORS[i];
              return (
                <g key={ETAS[i]}>
                  <path d={d} fill="none" stroke={color} strokeWidth={1.25} />
                  {pts.map((r, n) => (
                    <circle key={n} cx={sx(n)} cy={sy(r)} r={scene.rounds === 1 ? 3.5 : 2} fill={color} />
                  ))}
                  {scene.rounds === 1 && (
                    <text x={sx(1) + 8} y={sy(last) + (i === 0 ? 10 : -4)} fontSize={11} fontWeight={700} fill={color}>
                      η={ETAS[i]} → {last.toFixed(2)}
                    </text>
                  )}
                  {scene.rounds === ROUNDS && (
                    <g>
                      <line x1={sx(cross)} x2={sx(cross)} y1={sy(path[cross])} y2={BASE} stroke={color} strokeWidth={1} strokeDasharray="3 3" />
                      <text x={sx(cross) - 4} y={i === 0 ? sy(0.4) : sy(1.9)} textAnchor="end" fontSize={11} fontWeight={700} fill={color}>
                        η={ETAS[i]} · {cross} round
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {scene.rounds === ROUNDS && (
              <line x1={LEFT} x2={W - RIGHT} y1={sy(THRESHOLD)} y2={sy(THRESHOLD)} stroke={MUTED} strokeWidth={1} strokeDasharray="5 3" />
            )}
          </svg>
        );
      }}
    />
  );
}
