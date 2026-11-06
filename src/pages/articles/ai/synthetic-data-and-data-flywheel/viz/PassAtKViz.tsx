import SceneShell from "./SceneShell";

/**
 * 본문 대응: #verifier-filtering pass@k 식 — n=8, c=3(다음 절의 3개 정답 예)을 식에 넣습니다.
 * k=1: 1−5/8=37.5%, k=2: 1−10/28=64.3%, k=3: 1−10/56=82.1%, k=4: 1−5/70=92.9%, k=5: 1−1/56=98.2%, k=6: 1−0/28=100%.
 */
const N = 8;
const C = 3;
const CORRECT = new Set([1, 4, 6]);

function choose(n: number, k: number): number {
  if (k > n) return 0;
  return Array.from({ length: k }, (_, i) => i).reduce<number>((acc, i) => (acc * (n - i)) / (i + 1), 1);
}

const passAt = (k: number) => 1 - choose(N - C, k) / choose(N, k);
const pct = (value: number) => (value === 1 ? "100%" : `${(value * 100).toFixed(1)}%`);
const KS = [1, 2, 3, 4, 5, 6] as const;

function sceneFor(k: number, note: string) {
  const allWrong = choose(N - C, k);
  const total = choose(N, k);
  return { k, label: `${k}개를 고를 때`, summary: `1 − ${allWrong}/${total} = ${pct(passAt(k))}`, note };
}

const SCENES = [
  sceneFor(1, "8개에서 1개를 고르는 경우는 8가지, 그중 오답 5개에서만 고르는 경우는 5가지입니다. 전부 오답일 확률 5/8을 1에서 빼면 37.5%이고, 정답 비율 3/8과 같습니다."),
  sceneFor(2, "C(8,2)는 8개에서 2개를 고르는 경우의 수 28, C(5,2)는 오답 5개에서만 2개를 고르는 경우의 수 10입니다. 둘의 비율이 전부 오답일 확률입니다."),
  sceneFor(3, "경우의 수는 56과 10입니다. 뽑는 수를 늘릴수록 오답만 고르기 어려워져 통과 확률이 커집니다. 다만 그만큼 채점 비용도 함께 늘어납니다."),
  sceneFor(6, "오답은 5개뿐이므로 6개를 고르면 정답이 반드시 하나는 섞입니다. 전부 오답인 경우의 수가 0이 되어 확률은 100%입니다."),
] as const;

const W = 360;
const H = 118;
const BASE = 96;
const TOP = 22;
const STEP = (W - 40) / KS.length;

function Chart({ current }: { current: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`k가 1에서 6까지일 때 통과 확률, 현재 k=${current}는 ${pct(passAt(current))}`}>
      {KS.map((k, position) => {
        const height = passAt(k) * (BASE - TOP);
        const x = 20 + position * STEP + 8;
        const width = STEP - 16;
        const on = k === current;
        return (
          <g key={k}>
            <rect x={x} y={BASE - height} width={width} height={height} rx={2} fill={on ? "#2563eb" : "#94a3b8"} opacity={on ? 0.9 : 0.5} />
            <text x={x + width / 2} y={BASE - height - 5} textAnchor="middle" fontSize={10} fontWeight={on ? 700 : 400} fill={on ? "#2563eb" : "#64748b"}>{pct(passAt(k))}</text>
            <text x={x + width / 2} y={BASE + 15} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill="#64748b">k={k}</text>
          </g>
        );
      })}
      <line x1={20} x2={W - 20} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
    </svg>
  );
}

export default function PassAtKViz() {
  return (
    <SceneShell
      eyebrow="pass@k를 숫자로"
      title="후보 8개 중 정답 3개일 때, k개를 고르면 정답이 섞일 확률"
      description="식의 평균 기호를 빼고 문제 하나만 봅니다. k개는 무작위로 뽑는다고 봅니다. 생성 후보 n=8, 정답 c=3은 다음 절의 예시이며, ✓ 위치와 테두리 칸은 그림을 위한 가정입니다."
      ariaLabel="n 8, c 3에서 k를 늘릴 때 pass@k가 커지는 모습"
      scenes={SCENES}
      render={(index) => {
        const { k } = SCENES[index];
        const wrongCells = Array.from({ length: N }, (_, cell) => cell).filter((cell) => !CORRECT.has(cell));
        const picked = new Set(k <= N - C ? wrongCells.slice(0, k) : [...wrongCells, 1]);
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-8 gap-1.5" aria-hidden="true">
              {Array.from({ length: N }, (_, cell) => (
                <div
                  key={cell}
                  className={`flex h-9 items-center justify-center rounded-md border text-sm font-bold ${picked.has(cell) ? "border-primary bg-primary/15" : "border-border"} ${CORRECT.has(cell) ? "text-[#16a34a]" : "text-muted-foreground"}`}
                >
                  {CORRECT.has(cell) ? "✓" : "✕"}
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">{k <= N - C ? `테두리 칸 ${k}개: 전부 오답인 한 경우` : `테두리 칸 ${k}개: 오답 5개를 다 골라도 ✓가 들어옵니다`}</p>
            <Chart current={k} />
          </div>
        );
      }}
    />
  );
}
