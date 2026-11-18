import NttSceneShell from "./NttSceneShell";

/**
 * 본문 대응: #unit-root — F₁₇의 0 아닌 16개 값과 근 4·9의 주기.
 * 원 위 순서 = 3⁰, 3¹, …, 3¹⁵ mod 17 (생성원 3의 거듭제곱 순서로 놓은 배치).
 * 4 = 3¹² → 네 칸 간격(반대 방향), 9 = 3² → 두 칸 간격.
 * 4를 길이 8에 쓰면 1·4·16·13이 두 번 반복, 9는 1·9·13·15·16·8·4·2를 한 번씩.
 */
const P = 17;
const RING: readonly number[] = Array.from({ length: 16 }, (_, k) => Array.from({ length: k }).reduce<number>((acc) => (acc * 3) % P, 1));
const powers = (root: number, count: number): number[] =>
  Array.from({ length: count }, (_, k) => Array.from({ length: k }).reduce<number>((acc) => (acc * root) % P, 1));

const SCENES = [
  { label: "생성원 3은 16칸을 모두 지납니다", summary: "3¹⁶ mod 17 = 1, 위수 16", root: 3, steps: 8, cycle: 16, note: "3을 계속 곱하면 0이 아닌 16개 값을 한 번씩 모두 지난 뒤 1로 돌아옵니다. 원 위의 순서는 이 방문 순서대로 놓은 것입니다. 아래 칸은 k=0부터 7까지의 여덟 값만 보입니다." },
  { label: "근 4는 네 칸만 돕니다", summary: "1 → 4 → 16 → 13 → 1", root: 4, steps: 4, cycle: 4, note: "4는 원 위에서 네 칸씩 건너뛰어 네 번 만에 1로 돌아옵니다. 길이 4 변환의 평가 위치가 이 네 값이고, 16은 −1, 13은 −4입니다." },
  { label: "근 4를 길이 8에 쓰면", summary: "k=0~7의 여덟 값 중 서로 다른 값은 4개", root: 4, steps: 8, cycle: 4, note: "k=4부터 1·4·16·13이 다시 나옵니다. 같은 위치를 두 번 쓰므로 여덟 계수를 구별할 수 없습니다." },
  { label: "근 9 = 3²는 여덟 칸을 돕니다", summary: "9⁴ = 16 ≠ 1, 9⁸ = 1", root: 9, steps: 8, cycle: 8, note: "생성원 3에서 두 칸 간격으로 이동하면 서로 다른 여덟 위치를 방문한 뒤 1로 돌아옵니다. 4제곱이 1이 아니므로 더 짧은 주기가 아닙니다." },
] as const;

const W = 320;
const H = 250;
const CX = W / 2;
const CY = 124;
const R = 92;
const LABEL_R = 112;
const angle = (index: number) => (-90 + index * 22.5) * (Math.PI / 180);
const point = (index: number, radius: number) => ({ x: CX + radius * Math.cos(angle(index)), y: CY + radius * Math.sin(angle(index)) });

export default function RootCycleViz() {
  return (
    <NttSceneShell
      eyebrow="평가 위치의 주기"
      title="근 4는 네 칸에서 돌아오고, 길이 8에는 다른 근이 필요합니다"
      description="원 위의 점 16개는 F₁₇에서 0이 아닌 값입니다. 생성원은 거듭제곱하면 이 16개 값을 모두 지나는 값이며, 여기서는 3입니다. 점은 3을 곱해 가는 순서로 놓았습니다(배치는 설명용 가정)."
      ariaLabel="F17의 0 아닌 값 16개 위에서 근 3, 4, 9가 지나는 위치 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sequence = powers(scene.root, scene.steps);
        const cycleValues = powers(scene.root, scene.cycle);
        const visited = new Set(cycleValues);
        const ringIndex = (value: number) => RING.indexOf(value);
        const pathPoints = cycleValues.map((value) => point(ringIndex(value), R));
        const path = `${pathPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")} Z`;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[320px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <circle cx={CX} cy={CY} r={R} fill="none" stroke="#cbd5e1" strokeWidth={1} />
              <path d={path} fill="none" stroke="#2563eb" strokeWidth={1.25} strokeLinejoin="round" />
              {RING.map((value, index) => {
                const dot = point(index, R);
                const label = point(index, LABEL_R);
                const on = visited.has(value);
                const isOne = value === 1;
                return (
                  <g key={value}>
                    <circle cx={dot.x} cy={dot.y} r={on ? 6 : 4} fill={on ? (isOne ? "#1e3a8a" : "#2563eb") : "#e2e8f0"} stroke={on ? "none" : "#94a3b8"} strokeWidth={1} />
                    <text x={label.x} y={label.y + 4} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={on ? "#1e3a8a" : "#94a3b8"}>
                      {value}
                    </text>
                  </g>
                );
              })}
              <text x={CX} y={CY - 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">{active === 0 ? "생성원" : "근"} {scene.root}</text>
              <text x={CX} y={CY + 14} textAnchor="middle" fontSize={11} fill="#64748b">{scene.cycle}번 곱하면 1</text>
            </svg>
            <p className="mt-2 text-xs text-muted-foreground">k=0부터 7까지: {active === 0 ? "생성원" : "근"}을 k번 곱한 값</p>
            <div className="mt-1 grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }, (_, k) => {
                const value = k < sequence.length ? sequence[k] : null;
                const repeated = value !== null && sequence.indexOf(value) < k;
                return (
                  <div
                    key={k}
                    className={`rounded-md border px-0.5 py-1 text-center ${
                      value === null ? "border-dashed border-border/50" : repeated ? "border-red-600" : "border-border"
                    }`}
                  >
                    <span className="block text-[10px] text-muted-foreground">k={k}</span>
                    <span className={`block font-mono text-sm font-bold ${value === null ? "text-muted-foreground/40" : repeated ? "text-red-700 dark:text-red-400" : ""}`}>
                      {value ?? "−"}
                    </span>
                    <span className="block text-[10px] text-red-700 dark:text-red-400">{repeated ? "반복" : " "}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
