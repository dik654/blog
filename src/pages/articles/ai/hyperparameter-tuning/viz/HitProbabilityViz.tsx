import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trial-budget — 독립 추첨 한 번이 좋은 영역에 들어갈 확률 p=0.05(가정).
 * 모두 놓칠 확률 0.95^N을 1에서 뺀다. N=1: 5%, N=3: 14.26%, N=20: 64.15%, N=60: 95.39%.
 */
const P = 0.05;
const MISS = 1 - P;
const N_MAX = 60;
const hit = (n: number) => 1 - MISS ** n;

const SCENES = [
  { label: "한 번 뽑으면", n: 1, summary: "맞힘 5% · 놓침 95%", formula: "0.95¹ = 0.95", note: "좋은 영역에 들어갈 확률을 0.05로 가정하면 한 번 놓칠 확률은 0.95입니다. 막대의 회색 부분이 놓치는 몫입니다." },
  { label: "세 번 뽑으면", n: 3, summary: "1 − 0.95³ = 0.142625", formula: "0.95 × 0.95 × 0.95 = 0.857375", note: "세 번 모두 놓쳐야 실패이므로 놓칠 확률 0.95를 세 번 곱합니다. 남은 0.857375를 1에서 빼면 한 번 이상 맞힐 확률 약 14.26%입니다." },
  { label: "20회 뽑으면", n: 20, summary: "약 64.15%", formula: "0.95²⁰ ≈ 0.3585", note: "곱할수록 놓칠 확률이 줄어 20회면 한 번 이상 맞힐 확률이 약 64.15%입니다. 곡선은 처음에 빨리 오르고 뒤로 갈수록 완만해집니다." },
  { label: "60회 뽑으면", n: 60, summary: "약 95.39%", formula: "0.95⁶⁰ ≈ 0.0461", note: "60회면 약 95.39%입니다. 실제 좋은 영역의 크기를 안다는 뜻은 아니며, 앞 결과를 보고 다음 후보를 바꾸는 탐색에는 고정된 0.05와 독립성 가정을 그대로 쓸 수 없습니다." },
] as const;

const W = 360;
const H = 196;
const LEFT = 40;
const RIGHT = 14;
const TOP = 14;
const BOTTOM = 160;
const px = (n: number) => LEFT + (n / N_MAX) * (W - LEFT - RIGHT);
const py = (prob: number) => BOTTOM - prob * (BOTTOM - TOP);
const CURVE = Array.from({ length: N_MAX + 1 }, (_, n) => `${n === 0 ? "M" : "L"}${px(n).toFixed(1)} ${py(hit(n)).toFixed(1)}`).join(" ");
const MARKS = [1, 3, 20, 60] as const;

export default function HitProbabilityViz() {
  return (
    <SceneShell
      eyebrow="모두 놓칠 확률"
      title="놓칠 확률을 곱해 갈수록 한 번이라도 맞힐 확률이 오릅니다"
      description="가로축은 같은 분포에서 독립적으로 뽑은 횟수, 세로축은 그중 한 번 이상 좋은 영역에 들어갈 확률입니다. 한 번의 확률 0.05는 본문의 가정입니다."
      ariaLabel="추첨 횟수에 따라 한 번 이상 좋은 영역을 만날 확률이 1에서 0.95의 거듭제곱을 뺀 값으로 오르는 곡선"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const prob = hit(scene.n);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.n}회: ${(prob * 100).toFixed(2)}%`}>
              {[0, 0.5, 1].map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={py(tick)} y2={py(tick)} stroke="#e2e8f0" strokeWidth={1} className="dark:stroke-slate-700" />
                  <text x={LEFT - 6} y={py(tick) + 3} textAnchor="end" fontSize={12} fill="#64748b">
                    {`${tick * 100}%`}
                  </text>
                </g>
              ))}
              {[0, 20, 40, 60].map((tick) => (
                <text key={tick} x={px(tick)} y={BOTTOM + 16} textAnchor="middle" fontSize={12} fill="#64748b">
                  {tick}
                </text>
              ))}
              <text x={W - RIGHT} y={BOTTOM + 30} textAnchor="end" fontSize={12} fill="#64748b">
                뽑은 횟수 N
              </text>
              <path d={CURVE} fill="none" stroke="#94a3b8" strokeWidth={1.25} />
              {MARKS.map((n) => {
                const on = n === scene.n;
                return <circle key={n} cx={px(n)} cy={py(hit(n))} r={on ? 4.5 : 2.5} fill={on ? "#2563eb" : "#94a3b8"} />;
              })}
              <line x1={px(scene.n)} x2={px(scene.n)} y1={py(prob)} y2={BOTTOM} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 2" />
              <text
                x={scene.n > 40 ? px(scene.n) - 8 : px(scene.n) + 8}
                y={py(prob) + (scene.n > 40 ? 16 : -6)}
                textAnchor={scene.n > 40 ? "end" : "start"}
                fontSize={13}
                fontWeight={700}
                fill="#2563eb"
              >
                {`N=${scene.n} · ${(prob * 100).toFixed(2)}%`}
              </text>
            </svg>

            <div className="mx-auto mt-3 max-w-[560px]">
              <div className="flex h-5 w-full overflow-hidden rounded-sm border border-border">
                <div className="h-full bg-[#2563eb] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${prob * 100}%` }} />
                <div className="h-full flex-1 bg-[#cbd5e1] dark:bg-[#475569]" />
              </div>
              <div className="mt-1 flex justify-between gap-2 text-xs">
                <span className="font-semibold text-primary">한 번 이상 맞힘 {(prob * 100).toFixed(2)}%</span>
                <span className="text-muted-foreground">모두 놓침 {((1 - prob) * 100).toFixed(2)}%</span>
              </div>
              <p className="mt-2 font-mono text-xs text-muted-foreground">모두 놓칠 확률: {scene.formula}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
